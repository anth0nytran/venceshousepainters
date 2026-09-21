import crypto from "node:crypto";

/* ============================================================
   Meta Conversions API: server-side Lead event.

   Sent for every estimate request, alongside the browser pixel's
   Lead event. Both carry the same event_id, so Meta counts one
   lead, and the server copy still lands when an ad blocker or iOS
   privacy settings stop the pixel.

   ---- Environment ----
   META_CAPI_TOKEN       (required)  Events Manager → dataset →
                                     Settings → Conversions API token
   META_PIXEL_ID         (optional)  defaults to Vences' dataset
   META_TEST_EVENT_CODE  (optional)  routes events to Test Events only

   Never throws: tracking must not cost us the lead.
   ============================================================ */

const DEFAULT_PIXEL_ID = "1696004431515262";
const GRAPH = "https://graph.facebook.com/v21.0";

const sha = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export interface MetaLead {
    eventId: string;
    email: string;
    phoneDigits: string;
    firstName: string;
    lastName: string;
    zip: string;
    ip: string;
    userAgent: string;
    fbp: string;
    fbc: string;
    sourceUrl: string;
    service: string;
}

export async function sendMetaLead(lead: MetaLead): Promise<boolean> {
    const token = process.env.META_CAPI_TOKEN;
    if (!token || !lead.eventId) return false;
    const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;

    const phone = lead.phoneDigits.length === 10 ? `1${lead.phoneDigits}` : lead.phoneDigits;
    const userData: Record<string, unknown> = {
        em: [sha(lead.email)],
        client_ip_address: lead.ip && lead.ip !== "unknown" ? lead.ip : undefined,
        client_user_agent: lead.userAgent || undefined,
        fbp: lead.fbp || undefined,
        fbc: lead.fbc || undefined,
        country: [sha("us")],
    };
    if (phone) userData.ph = [sha(phone)];
    if (lead.firstName) userData.fn = [sha(lead.firstName)];
    if (lead.lastName) userData.ln = [sha(lead.lastName)];
    if (lead.zip) userData.zp = [sha(lead.zip)];

    const body: Record<string, unknown> = {
        data: [{
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: lead.eventId,
            action_source: "website",
            event_source_url: lead.sourceUrl || undefined,
            user_data: userData,
            custom_data: { content_name: "Estimate request", content_category: lead.service },
        }],
    };
    if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

    try {
        const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            console.error("Meta CAPI error:", res.status, (await res.text()).slice(0, 300));
            return false;
        }
        return true;
    } catch (err) {
        console.error("Meta CAPI threw:", err);
        return false;
    }
}

/* ============================================================
   GoHighLevel (LeadConnector) lead push — Vences House Painters.
   Adapted from the South Coast build.

   Every submission is upserted as a contact tagged "website-form".
   That tag is THE trigger for the "**WEBSITE ONLY** Lead Alerts"
   workflow, so it must not be renamed.

   Custom fields written (all exist on location UwbC1hNwME50cOgnws7z):
     service_needed, project_type, timeline   <- dropdowns, values
                                                 must match exactly
     project_address, message, lead_source, form_type,
     sms_consent, age_consent, sms_consent_source, form_submitted_at,
     lead_attribution, utm_*

   ---- Environment ----
   GHL_API_KEY        (required)  Private Integration token (v2)
   GHL_LOCATION_ID    (required)  UwbC1hNwME50cOgnws7z
   GHL_PIPELINE_ID /
   GHL_PIPELINE_STAGE_ID (optional) Also opens an opportunity.

   Not configured = no-op. Lead capture never depends on GHL.
   ============================================================ */

import { SITE_URL } from "./_site.js";

export interface GhlLead {
    fullName: string;
    email: string;
    phone: string;
    /** Digits only, 10 or 11 chars, or "" */
    phoneDigits: string;
    address: string;
    notes: string;
    serviceSlug: string;
    serviceGhl: string;
    situationGhl: string;
    timelineGhl: string;
    timelineLabel: string;
    smsConsent: boolean;
    ageConfirm: boolean;
    consentText: string;
    consentTimestamp: string;
    sourceUrl: string;
    ip: string;
    attribution: Record<string, string>;
}

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

function toE164(digits: string): string {
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
    return "";
}

function splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** "website-form" is the workflow trigger. The rest are filters. */
export function buildTags(lead: GhlLead): string[] {
    const tags = ["website-form", "website-lead"];
    if (lead.serviceSlug) tags.push(`service-${lead.serviceSlug}`);
    if (lead.smsConsent) tags.push("sms-optin");
    const channel = lead.attribution.channel;
    if (channel) tags.push(`channel-${channel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    return tags;
}

export function buildNote(lead: GhlLead): string {
    const a = lead.attribution;
    const lines = [
        `=== ESTIMATE REQUEST — ${DOMAIN} ===`,
        "",
        `Name:            ${lead.fullName}`,
        `Email:           ${lead.email}`,
        `Phone:           ${lead.phone || "Not provided"}`,
        `Service:         ${lead.serviceGhl}`,
        `Situation:       ${lead.situationGhl || "Not specified"}`,
        `Timeline:        ${lead.timelineLabel || "Not specified"}`,
        `Project address: ${lead.address || "Not provided"}`,
        "",
        "--- Notes from the customer ---",
        lead.notes || "(none)",
        "",
        "--- Attribution ---",
        `Channel:         ${a.channel || "direct"}`,
        `UTM source:      ${a.utm_source || "-"}`,
        `UTM medium:      ${a.utm_medium || "-"}`,
        `UTM campaign:    ${a.utm_campaign || "-"}`,
        `UTM content:     ${a.utm_content || "-"}`,
        `fbclid:          ${a.fbclid || "-"}`,
        `gclid:           ${a.gclid || "-"}`,
        `Referrer:        ${a.referrer || "-"}`,
        `Landing page:    ${a.landing_page || "-"}`,
        `Submitted from:  ${lead.sourceUrl || "-"}`,
        "",
        "--- A2P / SMS consent proof ---",
        `SMS opt-in:      ${lead.smsConsent ? "YES" : "No"}`,
        `18+ confirmed:   ${lead.ageConfirm ? "Yes" : "No"}`,
        `Consent time:    ${lead.consentTimestamp || "-"}`,
        `IP address:      ${lead.ip}`,
    ];
    if (lead.smsConsent && lead.consentText) {
        lines.push("", `Consent text shown: "${lead.consentText}"`);
    }
    return lines.join("\n");
}

/* GHL's v2 upsert only accepts custom-field IDs, so the key -> id map is
   fetched once and cached for the life of the warm lambda. */
let fieldIdCache: Record<string, string> | null = null;

async function getFieldIds(token: string, locationId: string): Promise<Record<string, string>> {
    if (fieldIdCache) return fieldIdCache;
    try {
        const res = await fetch(`${BASE}/locations/${locationId}/customFields?model=contact`, {
            headers: { Authorization: `Bearer ${token}`, Version: VERSION, Accept: "application/json" },
        });
        if (!res.ok) {
            console.error("GHL custom-field lookup failed:", res.status);
            return {};
        }
        const json = (await res.json()) as { customFields?: Array<{ id: string; fieldKey: string }> };
        const map: Record<string, string> = {};
        for (const f of json.customFields || []) {
            if (f.fieldKey && f.id) map[f.fieldKey.replace(/^contact\./, "")] = f.id;
        }
        fieldIdCache = map;
        return map;
    } catch (err) {
        console.error("GHL custom-field lookup threw:", err);
        return {};
    }
}

function buildFieldValues(lead: GhlLead): Record<string, string> {
    const v: Record<string, string> = {
        service_needed: lead.serviceGhl,
        project_type: lead.situationGhl,
        timeline: lead.timelineGhl,
        project_address: lead.address,
        message: lead.notes,
        lead_source: "Website Form",
        form_type: "Website estimate form",

        // A2P consent proof
        sms_consent: lead.smsConsent ? "Yes" : "No",
        age_consent: lead.ageConfirm ? "Yes" : "No",
        sms_consent_source: lead.sourceUrl,
        form_submitted_at: lead.consentTimestamp,

        // Attribution
        lead_attribution: lead.attribution.channel || "direct",
        utm_source: lead.attribution.utm_source || "",
        utm_medium: lead.attribution.utm_medium || "",
        utm_campaign: lead.attribution.utm_campaign || "",
        utm_term: lead.attribution.utm_term || "",
        utm_content: lead.attribution.utm_content || "",
    };
    for (const k of Object.keys(v)) {
        if (!v[k] || !String(v[k]).trim()) delete v[k];
    }
    return v;
}

async function postJson(url: string, token: string, body: unknown) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Version: VERSION,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
    });
    const text = await res.text();
    let json: unknown = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
    return { ok: res.ok, status: res.status, json, text };
}

/** Never throws: a GHL outage must not cost us the lead. */
export async function pushToGhl(lead: GhlLead): Promise<{ pushed: boolean; contactId?: string }> {
    const token = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!token || !locationId) return { pushed: false };

    const { firstName, lastName } = splitName(lead.fullName);
    const e164 = toE164(lead.phoneDigits);

    try {
        const ids = await getFieldIds(token, locationId);
        const values = buildFieldValues(lead);
        const customFields: Array<{ id: string; field_value: string }> = [];
        const missing: string[] = [];
        for (const [key, field_value] of Object.entries(values)) {
            if (ids[key]) customFields.push({ id: ids[key], field_value });
            else missing.push(key);
        }
        if (missing.length) console.warn("GHL: no custom field found for:", missing.join(", "));

        const body: Record<string, unknown> = {
            locationId,
            email: lead.email,
            firstName,
            lastName,
            name: lead.fullName,
            tags: buildTags(lead),
            source: `Website — ${DOMAIN}`,
        };
        if (e164) body.phone = e164;
        if (customFields.length) body.customFields = customFields;

        const r = await postJson(`${BASE}/contacts/upsert`, token, body);
        if (!r.ok) {
            console.error("GHL contact upsert failed:", r.status, r.text.slice(0, 400));
            return { pushed: false };
        }
        const j = r.json as { contact?: { id?: string }; id?: string } | null;
        const contactId = j?.contact?.id || j?.id;
        if (!contactId) {
            console.error("GHL upsert succeeded but returned no contact id.");
            return { pushed: true };
        }

        const noteRes = await postJson(`${BASE}/contacts/${contactId}/notes`, token, { body: buildNote(lead) });
        if (!noteRes.ok) console.error("GHL note create failed:", noteRes.status, noteRes.text.slice(0, 300));

        const pipelineId = process.env.GHL_PIPELINE_ID;
        const stageId = process.env.GHL_PIPELINE_STAGE_ID;
        if (pipelineId && stageId) {
            const oppRes = await postJson(`${BASE}/opportunities/`, token, {
                locationId,
                pipelineId,
                pipelineStageId: stageId,
                contactId,
                name: `${lead.fullName} — ${lead.serviceGhl}`,
                status: "open",
            });
            if (!oppRes.ok) console.error("GHL opportunity create failed:", oppRes.status, oppRes.text.slice(0, 300));
        }

        return { pushed: true, contactId };
    } catch (err) {
        console.error("GHL push threw:", err);
        return { pushed: false };
    }
}

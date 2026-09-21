import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { pushToGhl } from "./_ghl";
import { sendMetaLead } from "./_meta";
import { assess, verifyTurnstile } from "./_spam";
import { SERVICES, SITUATIONS, TIMELINES, byValue } from "../src/lib/estimate";
import { BRAND_NAME, PHONE_DISPLAY, PHONE_TEL, SITE_URL } from "../src/lib/site";

export const config = { runtime: "nodejs" };

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 12;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const dupeStore = new Map<string, { count: number; resetAt: number }>();

const esc = (v: string) =>
    v.replace(/[&<>"']/g, (c) =>
        c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;"
    );

const norm = (v: unknown) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim() : "");

const ACCENT = "#1565C0";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed." });
    }

    // Rate limit
    const ip = (Array.isArray(req.headers["x-forwarded-for"]) ? req.headers["x-forwarded-for"][0] : req.headers["x-forwarded-for"]?.split(",")[0]?.trim()) || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const rl = rateLimitStore.get(ip);
    if (rl && rl.resetAt > now && rl.count >= RATE_LIMIT_MAX) {
        return res.status(429).json({ ok: false, error: "Too many requests. Please try again shortly." });
    }
    rateLimitStore.set(ip, { count: (rl && rl.resetAt > now ? rl.count : 0) + 1, resetAt: rl && rl.resetAt > now ? rl.resetAt : now + RATE_LIMIT_WINDOW_MS });

    // Parse body
    let data: Record<string, unknown> = {};
    if (typeof req.body === "string") {
        try { data = JSON.parse(req.body); } catch { return res.status(400).json({ ok: false, error: "Invalid JSON." }); }
    } else if (typeof req.body === "object" && req.body) {
        data = req.body as Record<string, unknown>;
    }

    // Honeypot
    if (norm(data.website) || norm(data.fax) || norm(data.company_url)) {
        return res.status(200).json({ ok: true });
    }

    // Layered spam assessment. Anything blocked returns a 200 so a bot
    // learns nothing from the response and burns its budget instead.
    const tsRaw = norm(data._ts);
    const tsNum = parseInt(tsRaw, 10);
    const elapsedMs = Number.isNaN(tsNum) ? 0 : Date.now() - tsNum;

    const verdict = assess({
        fullName: norm(data.fullName),
        email: norm(data.email),
        phone: norm(data.phone),
        address: norm(data.address),
        notes: norm(data.notes),
        interacted: data.interacted,
        headers: req.headers as Record<string, unknown>,
        tsRaw,
        nonce: norm(data._nonce),
        elapsedMs,
    });

    if (verdict.block) {
        console.warn("Blocked submission [score %d]: %s", verdict.score, verdict.reason);
        return res.status(200).json({ ok: true });
    }
    if (verdict.score > 0) {
        console.info("Allowed submission with signals [score %d]: %s", verdict.score, verdict.reason);
    }

    if (!(await verifyTurnstile(norm(data.turnstileToken), ip))) {
        console.warn("Turnstile verification failed");
        return res.status(200).json({ ok: true });
    }

    const fullName = norm(data.fullName);
    const email = norm(data.email);
    const phone = norm(data.phone);
    const address = norm(data.address);
    const notes = norm(data.notes).slice(0, 2000);
    const service = byValue(SERVICES, norm(data.service));
    const situation = byValue(SITUATIONS, norm(data.situation));
    const timeline = byValue(TIMELINES, norm(data.timeline));
    const smsConsent = data.smsConsent === true || norm(data.smsConsent) === "true";
    const ageConfirm = data.ageConfirm === true || norm(data.ageConfirm) === "true";
    // A2P opt-in proof
    const consentText = norm(data.consentText).slice(0, 1000);
    const consentTimestamp = norm(data.consentTimestamp);
    const sourceUrl = norm(data.sourceUrl).slice(0, 300);
    const attribution = (data.attribution && typeof data.attribution === "object") ? (data.attribution as Record<string, unknown>) : {};
    const attr = (k: string) => norm(attribution[k]).slice(0, 200);

    // Validation
    if (!fullName || fullName.length < 2 || fullName.length > 80) {
        return res.status(400).json({ ok: false, error: "Please enter your full name." });
    }
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }
    // Phone is OPTIONAL (A2P: consent is never coerced). Validate only when provided.
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
        return res.status(400).json({ ok: false, error: "Please enter a valid phone number." });
    }
    if (!service) {
        return res.status(400).json({ ok: false, error: "Please choose what you'd like painted." });
    }
    if (!address || address.length < 5 || address.length > 200) {
        return res.status(400).json({ ok: false, error: "Please tell us where the project is." });
    }
    if (!ageConfirm) {
        return res.status(400).json({ ok: false, error: "Please confirm you are at least 18 years old." });
    }

    // Duplicate check
    const dupeKey = `${email.toLowerCase()}|${phoneDigits}|${service.value}`;
    const dupe = dupeStore.get(dupeKey);
    if (dupe && dupe.resetAt > now && dupe.count > 2) {
        return res.status(200).json({ ok: true });
    }
    dupeStore.set(dupeKey, { count: (dupe && dupe.resetAt > now ? dupe.count : 0) + 1, resetAt: dupe && dupe.resetAt > now ? dupe.resetAt : now + 6 * 60 * 60 * 1000 });

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.LEAD_TO_EMAIL;
    if (!resendApiKey || !toEmail) {
        return res.status(500).json({ ok: false, error: "Server misconfigured." });
    }

    const resend = new Resend(resendApiKey);
    const serviceLabel = service.ghl;
    const situationLabel = situation?.ghl || "Not specified";
    const timelineLabel = timeline?.label || "Not specified";

    const timestamp = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        year: "numeric", month: "short", day: "2-digit",
        hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short",
    }).format(new Date());

    const phoneLink = phoneDigits.length === 10 ? `+1${phoneDigits}` : phoneDigits.length === 11 && phoneDigits.startsWith("1") ? `+${phoneDigits}` : phoneDigits;
    const row = (label: string, value: string) =>
        `<tr><td style="padding:10px 0;color:#6b7280;width:120px;">${esc(label)}</td><td style="padding:10px 0;font-weight:600;">${esc(value)}</td></tr>`;

    // ---- INTERNAL LEAD EMAIL ----
    const leadHtml = `
<div style="background:#f3f4f6;margin:0;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
    <tr><td style="border-top:6px solid #1B1F24;padding:18px 20px;border-bottom:1px solid #f1f5f9;">
      <table role="presentation" width="100%"><tr>
        <td style="font-size:16px;font-weight:700;color:#1B1F24;">${esc(BRAND_NAME)}</td>
        <td align="right"><span style="background:${ACCENT};color:#fff;font-weight:700;font-size:12px;padding:6px 10px;border-radius:999px;">NEW ESTIMATE REQUEST</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:24px 20px 16px;">
      <div style="font-size:24px;font-weight:800;margin:0 0 6px;">${esc(fullName)}</div>
      <div style="font-size:16px;color:#374151;font-weight:600;margin:0 0 4px;">${esc(serviceLabel)}</div>
      <div style="font-size:12px;color:#6b7280;">${esc(timestamp)}</div>
    </td></tr>
    <tr><td style="padding:0 20px 20px;">
      ${phoneDigits ? `<a href="tel:${esc(phoneLink)}" style="display:block;background:#1B1F24;color:#fff;text-decoration:none;font-weight:800;font-size:14px;text-align:center;padding:14px 18px;border-radius:10px;margin-bottom:10px;">Call ${esc(fullName)}</a>` : ""}
      <a href="mailto:${esc(email)}" style="display:block;background:#f3f4f6;color:#111827;text-decoration:none;font-weight:700;font-size:14px;text-align:center;padding:14px 18px;border-radius:10px;border:1px solid #e5e7eb;">Email Lead</a>
    </td></tr>
    <tr><td style="padding:0 20px 20px;">
      <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-size:14px;">
        <tr><td style="background:#f9fafb;padding:14px 16px;font-weight:700;border-bottom:1px solid #e5e7eb;">Lead Details</td></tr>
        <tr><td style="padding:0 16px;"><table role="presentation" width="100%">
          ${row("Name", fullName)}
          <tr><td style="padding:10px 0;color:#6b7280;">Phone</td><td style="padding:10px 0;">${phoneDigits ? `<a href="tel:${esc(phoneLink)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${esc(phone)}</a>` : `<span style="color:#9ca3af;">Not provided</span>`}</td></tr>
          <tr><td style="padding:10px 0;color:#6b7280;">Email</td><td style="padding:10px 0;"><a href="mailto:${esc(email)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${esc(email)}</a></td></tr>
          ${row("Service", serviceLabel)}
          ${row("Situation", situationLabel)}
          ${row("Timeline", timelineLabel)}
          ${row("Address", address)}
        </table></td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 20px 20px;">
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;font-size:12.5px;background:#fafafa;">
        <div style="color:#6b7280;font-weight:700;margin-bottom:8px;">A2P Opt-In Proof</div>
        <div style="color:#111827;line-height:1.8;">
          SMS consent: <strong style="color:${smsConsent ? "#2f7d4f" : "#9a3434"};">${smsConsent ? "YES — opted in" : "Not opted in"}</strong><br/>
          18+ confirmed: <strong>${ageConfirm ? "Yes" : "—"}</strong><br/>
          ${consentTimestamp ? `Timestamp: ${esc(consentTimestamp)}<br/>` : ""}${sourceUrl ? `Source: ${esc(sourceUrl)}<br/>` : ""}IP: ${esc(ip)}
          ${smsConsent && consentText ? `<div style="margin-top:8px;color:#6b7280;font-style:italic;">"${esc(consentText)}"</div>` : ""}
        </div>
      </div>
    </td></tr>
    <tr><td style="padding:0 20px 20px;">
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;font-size:12.5px;background:#fafafa;">
        <div style="color:#6b7280;font-weight:700;margin-bottom:8px;">Lead Source</div>
        <div style="color:#111827;line-height:1.8;">
          Channel: <strong>${esc(attr("channel") || "direct")}</strong><br/>
          ${attr("utm_source") ? `Source / Medium: ${esc(attr("utm_source"))}${attr("utm_medium") ? " / " + esc(attr("utm_medium")) : ""}<br/>` : ""}${attr("utm_campaign") ? `Campaign: ${esc(attr("utm_campaign"))}<br/>` : ""}${attr("utm_content") ? `Content: ${esc(attr("utm_content"))}<br/>` : ""}${attr("fbclid") ? `fbclid: ${esc(attr("fbclid"))}<br/>` : ""}${attr("gclid") ? `gclid: ${esc(attr("gclid"))}<br/>` : ""}${attr("referrer") ? `Referrer: ${esc(attr("referrer"))}<br/>` : ""}${attr("landing_page") ? `Landing page: ${esc(attr("landing_page"))}` : ""}
        </div>
      </div>
    </td></tr>
    ${notes ? `<tr><td style="padding:0 20px 20px;"><div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;font-size:14px;"><div style="color:#6b7280;font-weight:700;margin-bottom:6px;">Notes</div><div style="color:#111827;white-space:pre-wrap;">${esc(notes)}</div></div></td></tr>` : ""}
    <tr><td style="padding:0 20px 22px;">
      <div style="border-left:4px solid ${ACCENT};padding:10px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:#6b7280;">
        This lead came from ${esc(SITE_URL.replace(/^https?:\/\//, ""))}
      </div>
    </td></tr>
  </table>
</div>`;

    // ---- PROSPECT CONFIRMATION EMAIL (transactional receipt only) ----
    const firstName = fullName.split(" ")[0] || fullName;
    const prospectHtml = `
<div style="background:#f3f4f6;margin:0;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
    <tr><td style="border-top:6px solid #1B1F24;padding:24px 24px 0;text-align:center;">
      <div style="font-size:18px;font-weight:800;letter-spacing:0.5px;color:#1B1F24;">${esc(BRAND_NAME.toUpperCase())}</div>
      <div style="font-size:11px;color:${ACCENT};letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Houston, Texas</div>
    </td></tr>
    <tr><td style="padding:28px 24px;">
      <div style="font-size:22px;font-weight:800;margin:0 0 16px;color:#1B1F24;">Hi ${esc(firstName)},</div>
      <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 16px;">
        Thank you for reaching out to ${esc(BRAND_NAME)}. We received your estimate request, and Jay will get back to you within one business day to set up a time to see the project.
      </p>
      <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;font-size:14px;margin-bottom:24px;">
        <tr><td style="background:#f9fafb;padding:12px 16px;font-weight:700;border-bottom:1px solid #e5e7eb;">Your Request</td></tr>
        <tr><td style="padding:0 16px;"><table role="presentation" width="100%">
          ${row("Service", serviceLabel)}
          ${row("Timeline", timelineLabel)}
          ${row("Property", address)}
        </table></td></tr>
      </table>
      <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">
        Need to reach us sooner? Call <a href="tel:${PHONE_TEL}" style="color:${ACCENT};font-weight:700;text-decoration:none;">${PHONE_DISPLAY}</a>.
      </p>
      <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;font-size:12px;color:#6b7280;">
        ${esc(BRAND_NAME)} · Houston, Texas
      </div>
    </td></tr>
  </table>
</div>`;

    try {
        const bcc = process.env.LEADS_BCC_EMAIL?.split(",").map((e) => e.trim()).filter(Boolean) || undefined;

        // Lead notification (always CC the QuickLaunchWeb support inbox)
        const { error: leadErr } = await resend.emails.send({
            from: "Vences | New Estimate <leads@quicklaunchweb.us>",
            to: [toEmail],
            cc: ["support@quicklaunchweb.us"],
            bcc,
            replyTo: email,
            subject: `New Estimate Request | ${serviceLabel} | ${fullName}`,
            html: leadHtml,
            text: `New Estimate Request: ${fullName}\nPhone: ${phone || "Not provided"}\nEmail: ${email}\nService: ${serviceLabel}\nSituation: ${situationLabel}\nTimeline: ${timelineLabel}\nAddress: ${address}\nNotes: ${notes || "N/A"}\n--- Lead Source ---\nChannel: ${attr("channel") || "direct"}\nUTM: ${attr("utm_source") || "-"} / ${attr("utm_medium") || "-"} / ${attr("utm_campaign") || "-"}\n--- A2P Opt-In Proof ---\nSMS consent: ${smsConsent ? "YES" : "No"}\n18+ confirmed: ${ageConfirm ? "Yes" : "No"}\nTimestamp: ${consentTimestamp || "N/A"}\nSource: ${sourceUrl || "N/A"}\nIP: ${ip}`,
        });

        if (leadErr) {
            console.error("Resend lead error:", leadErr);
            return res.status(500).json({ ok: false, error: "Failed to send. Please try again." });
        }

        await resend.emails.send({
            from: `${BRAND_NAME} <leads@quicklaunchweb.us>`,
            to: [email],
            replyTo: toEmail,
            subject: `We received your estimate request, ${firstName}`,
            html: prospectHtml,
            text: `Hi ${firstName},\n\nThank you for reaching out to ${BRAND_NAME}. We received your estimate request for ${serviceLabel}, and Jay will get back to you within one business day to set up a time to see the project.\n\nNeed to reach us sooner? Call ${PHONE_DISPLAY}.\n\n${BRAND_NAME} · Houston, Texas`,
        }).catch((err) => console.error("Prospect email failed (non-blocking):", err));
    } catch (error) {
        console.error("Unhandled exception:", error);
        return res.status(500).json({ ok: false, error: "Failed to send. Please try again." });
    }

    // ---- Meta Conversions API (server copy of the pixel's Lead) ----
    try {
        const nameParts = fullName.split(/\s+/);
        const ua = req.headers["user-agent"];
        await sendMetaLead({
            eventId: norm(data.eventId).slice(0, 100),
            email,
            phoneDigits,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" "),
            zip: (address.match(/(\d{5})(?:-\d{4})?\s*$/) || address.match(/\b(\d{5})\b/) || [])[1] || "",
            ip,
            userAgent: Array.isArray(ua) ? ua[0] : ua || "",
            fbp: norm(data.fbp).slice(0, 200),
            fbc: norm(data.fbc).slice(0, 300),
            sourceUrl,
            service: service.ghl,
        });
    } catch (err) {
        console.error("Meta CAPI failed (non-blocking):", err);
    }

    // ---- Push into GoHighLevel ----
    // Never allowed to fail the request: the lead email already went out,
    // so a GHL outage must not show the customer an error.
    try {
        const attrAll: Record<string, string> = {};
        for (const k of ["channel", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "referrer", "landing_page", "first_touch_channel"]) {
            attrAll[k] = attr(k);
        }
        const ghl = await pushToGhl({
            fullName, email, phone, phoneDigits, address, notes,
            serviceSlug: service.value,
            serviceGhl: service.ghl,
            situationGhl: situation?.ghl || "",
            timelineGhl: timeline?.ghl || "",
            timelineLabel,
            smsConsent, ageConfirm, consentText, consentTimestamp, sourceUrl, ip,
            attribution: attrAll,
        });
        if (!ghl.pushed) console.warn("Lead emailed but not pushed to GHL:", email);
    } catch (err) {
        console.error("GHL push failed (non-blocking):", err);
    }

    return res.status(200).json({ ok: true });
}

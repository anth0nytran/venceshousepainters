/* Temporary diagnostic: imports our own api/ modules. */
import { SITE_URL } from "./_site";
import { SERVICES } from "./_estimate";
import { SPAM_THRESHOLD } from "./_spam";
import { pushToGhl } from "./_ghl";
import { sendMetaLead } from "./_meta";

export default function handler(_req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }) {
    res.status(200).json({
        ok: true, probe: "modules", site: SITE_URL, services: SERVICES.length,
        threshold: SPAM_THRESHOLD, ghl: typeof pushToGhl, meta: typeof sendMetaLead,
        env: { ghlKey: !!process.env.GHL_API_KEY, resendKey: !!process.env.RESEND_API_KEY, leadTo: !!process.env.LEAD_TO_EMAIL },
        node: process.version,
    });
}

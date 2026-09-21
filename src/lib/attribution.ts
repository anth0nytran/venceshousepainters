/* ============================================================
   Vences — visitor attribution / UTM capture.
   Captures where each visitor came from (UTMs, click IDs,
   referrer, landing page) and persists FIRST-touch + LAST-touch
   for the life of the browser, so the lead form always knows
   the true origin even after the visitor navigates around.
   ============================================================ */

const KEY = "vhp_attr_v1";

export interface Touch {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
    gclid: string;
    fbclid: string;
    msclkid: string;
    referrer: string;
    landingPage: string;
    channel: string;
    ts: string;
}

interface Stored { first: Touch; last: Touch }

const param = (sp: URLSearchParams, ...keys: string[]) => {
    for (const k of keys) { const v = sp.get(k); if (v) return v.slice(0, 200); }
    return "";
};

function deriveChannel(t: { source: string; medium: string; gclid: string; fbclid: string; referrer: string }): string {
    if (t.gclid || (t.medium && /cpc|ppc|paid/i.test(t.medium))) return "paid";
    if (t.source) return `${t.source}${t.medium ? " / " + t.medium : ""}`;
    if (t.fbclid) return "facebook / social";
    const ref = t.referrer;
    if (!ref) return "direct";
    try {
        const host = new URL(ref).hostname.replace(/^www\./, "");
        if (host === location.hostname) return "internal";
        if (/google\./.test(host)) return "organic / google";
        if (/bing\.|duckduckgo|yahoo/.test(host)) return "organic / search";
        if (/facebook|instagram|fb\.|t\.co|twitter|x\.com|linkedin|youtube|tiktok|pinterest/.test(host)) return `social / ${host}`;
        return `referral / ${host}`;
    } catch { return "direct"; }
}

function currentTouch(): Touch {
    const sp = new URLSearchParams(location.search);
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const base = {
        source: param(sp, "utm_source"),
        medium: param(sp, "utm_medium"),
        gclid: param(sp, "gclid"),
        fbclid: param(sp, "fbclid"),
        referrer,
    };
    return {
        ...base,
        campaign: param(sp, "utm_campaign"),
        term: param(sp, "utm_term"),
        content: param(sp, "utm_content"),
        msclkid: param(sp, "msclkid"),
        landingPage: location.pathname + location.search,
        channel: deriveChannel(base),
        ts: new Date().toISOString(),
    };
}

const hasSignal = (t: Touch) => !!(t.source || t.gclid || t.fbclid || t.msclkid || (t.referrer && (() => { try { return new URL(t.referrer).hostname.replace(/^www\./, "") !== location.hostname; } catch { return false; } })()));

/** Call once on first load. Persists first-touch and refreshes last-touch. */
export function captureAttribution(): void {
    if (typeof window === "undefined") return;
    try {
        const now = currentTouch();
        const raw = localStorage.getItem(KEY);
        const stored: Stored | null = raw ? JSON.parse(raw) : null;
        if (!stored) {
            localStorage.setItem(KEY, JSON.stringify({ first: now, last: now }));
            return;
        }
        // Only overwrite last-touch when this visit carries a real attribution signal.
        const last = hasSignal(now) ? now : stored.last;
        localStorage.setItem(KEY, JSON.stringify({ first: stored.first, last }));
    } catch { /* storage may be unavailable */ }
}

/** Flat attribution object suitable for sending with a form submission. */
export function getAttribution(): Record<string, string> {
    let stored: Stored | null = null;
    try { const raw = localStorage.getItem(KEY); stored = raw ? JSON.parse(raw) : null; } catch { /* noop */ }
    const f = stored?.first;
    const l = stored?.last;
    return {
        // last-touch (what converted them)
        utm_source: l?.source || "",
        utm_medium: l?.medium || "",
        utm_campaign: l?.campaign || "",
        utm_term: l?.term || "",
        utm_content: l?.content || "",
        gclid: l?.gclid || "",
        fbclid: l?.fbclid || "",
        channel: l?.channel || f?.channel || "direct",
        referrer: l?.referrer || f?.referrer || "",
        landing_page: f?.landingPage || "",
        first_touch_channel: f?.channel || "",
        first_touch_ts: f?.ts || "",
        last_touch_ts: l?.ts || "",
    };
}

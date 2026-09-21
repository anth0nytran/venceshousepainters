import crypto from "node:crypto";

/* ============================================================
   Layered spam / bot defense for the estimate form.

   No single check is reliable on its own, so this stacks cheap,
   independent signals. Two kinds of outcome:

     HARD FAIL  - structurally impossible for a real submission
                  (honeypot filled, wrong origin, no proof of work).
                  Rejected outright.
     SCORE      - suspicious but not proof. Points accumulate and
                  only a total at or above SPAM_THRESHOLD blocks.

   Blocked submissions return HTTP 200 with {ok:true}. Telling a
   bot why it failed just helps it adapt, and a silent accept
   wastes its budget.

   Deliberately dependency-free so it cannot break the lead path.
   Cloudflare Turnstile is supported but optional — see verifyTurnstile.
   ============================================================ */

export const SPAM_THRESHOLD = 5;

export interface SpamVerdict {
    block: boolean;
    /** Internal only. Never returned to the client. */
    reason: string;
    score: number;
    signals: string[];
}

const norm = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/* ---------------- 1. Origin / Referer allowlist ---------------- */
/**
 * The single highest-value check. A browser always sends Origin on a
 * cross-origin POST; a curl script usually sends nothing or something
 * wrong. Blocks the bulk of direct API abuse for free.
 */
export function checkOrigin(headers: Record<string, unknown>): { ok: boolean; detail: string } {
    const allowed = (process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim().replace(/\/+$/, ""))
        .filter(Boolean);

    // Unconfigured means allow — never break lead capture on a missing env var.
    if (!allowed.length) return { ok: true, detail: "not configured" };

    const get = (k: string) => {
        const v = headers[k];
        return Array.isArray(v) ? v[0] : typeof v === "string" ? v : "";
    };

    const origin = get("origin").replace(/\/+$/, "");
    const referer = get("referer");

    if (origin) {
        return allowed.includes(origin)
            ? { ok: true, detail: origin }
            : { ok: false, detail: `origin ${origin}` };
    }
    if (referer) {
        try {
            const o = new URL(referer).origin.replace(/\/+$/, "");
            return allowed.includes(o) ? { ok: true, detail: o } : { ok: false, detail: `referer ${o}` };
        } catch {
            return { ok: false, detail: "malformed referer" };
        }
    }
    return { ok: false, detail: "no origin or referer" };
}

/* ---------------- 2. Proof of work ---------------- */
/**
 * The browser must find a nonce where sha256(`${ts}:${nonce}`) starts
 * with four hex zeros. That is ~65k hashes: imperceptible once, but a
 * real cost to anyone firing thousands of submissions. Crucially it
 * proves a JS runtime executed, which a plain HTTP POST cannot fake.
 *
 * Needs no shared secret, so nothing sensitive ships to the client.
 */
export const POW_PREFIX = "0000";

export function verifyProofOfWork(ts: string, nonce: string): boolean {
    if (!ts || !nonce) return false;
    if (!/^\d+$/.test(ts) || !/^\d{1,12}$/.test(nonce)) return false;
    const hash = crypto.createHash("sha256").update(`${ts}:${nonce}`).digest("hex");
    return hash.startsWith(POW_PREFIX);
}

/* ---------------- 3. Content heuristics ---------------- */

const URL_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ru|cn|xyz|top|club|info|biz|icu|shop|online|site)\b)/i;
const BBCODE_RE = /\[(url|link|b|i)[\]=]/i;

const SPAM_WORDS = [
    "crypto", "bitcoin", "casino", "viagra", "cialis", "seo services", "backlinks",
    "web traffic", "lottery", "forex", "binary option", "escort", "porn", "xxx",
    "loan offer", "make money", "work from home", "click here", "buy now",
    "guest post", "link building", "rank #1", "increase sales", "digital marketing agency",
    "we can help you rank", "outreach", "affordable seo", "web design services",
];

/** Disposable and throwaway inbox providers. */
const DISPOSABLE = new Set([
    "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
    "temp-mail.org", "throwawaymail.com", "yopmail.com", "getnada.com",
    "trashmail.com", "sharklasers.com", "maildrop.cc", "dispostable.com",
    "fakeinbox.com", "mailnesia.com", "mytemp.email", "spam4.me",
    "grr.la", "guerrillamail.info", "temp-mail.io", "moakt.com",
]);

/** Role addresses are rarely a homeowner enquiry. */
const ROLE_LOCALPARTS = new Set([
    "admin", "info", "sales", "marketing", "support", "noreply", "no-reply",
    "webmaster", "postmaster", "abuse", "billing", "contact",
]);

/** Latin text carrying Cyrillic or Greek lookalikes is a classic evasion. */
function hasMixedScripts(s: string): boolean {
    const latin = /[a-zA-Z]/.test(s);
    const cyrillicOrGreek = /[Ѐ-ӿͰ-Ͽ]/.test(s);
    return latin && cyrillicOrGreek;
}

function isGibberish(name: string): boolean {
    const n = name.toLowerCase().replace(/[^a-z]/g, "");
    if (n.length < 4) return false;
    if (/(.)\1{3,}/.test(n)) return true;                 // aaaa
    const vowels = (n.match(/[aeiou]/g) || []).length;
    return vowels / n.length < 0.12;                       // no vowels at all
}

/* ---------------- 4. The assessment ---------------- */

export interface SubmissionInput {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    interacted: unknown;
    headers: Record<string, unknown>;
    tsRaw: string;
    nonce: string;
    elapsedMs: number;
}

export function assess(input: SubmissionInput): SpamVerdict {
    const signals: string[] = [];
    let score = 0;
    const add = (pts: number, why: string) => { score += pts; signals.push(`${why}(+${pts})`); };

    const { fullName, email, address, notes } = input;
    const freeText = `${fullName} ${address} ${notes}`;
    const lower = freeText.toLowerCase();

    // ---- Hard fails ----
    const origin = checkOrigin(input.headers);
    if (!origin.ok) {
        return { block: true, reason: `origin rejected: ${origin.detail}`, score: 100, signals: ["origin"] };
    }
    if (!verifyProofOfWork(input.tsRaw, input.nonce)) {
        return { block: true, reason: "proof of work missing or invalid", score: 100, signals: ["pow"] };
    }

    // ---- Scored signals ----

    // Links in a painting enquiry are almost always spam.
    if (URL_RE.test(notes)) add(5, "url-in-notes");
    if (URL_RE.test(fullName) || URL_RE.test(address)) add(6, "url-in-identity-field");
    if (BBCODE_RE.test(freeText)) add(6, "bbcode");

    for (const w of SPAM_WORDS) {
        if (lower.includes(w)) { add(5, `word:${w}`); break; }
    }

    // Mixing Latin with Cyrillic/Greek in one message is a homoglyph evasion.
    // A genuine Russian speaker writes wholly in Cyrillic, not interleaved.
    if (hasMixedScripts(freeText)) add(5, "mixed-scripts");
    if (isGibberish(fullName)) add(3, "gibberish-name");

    // Email shape
    const at = email.lastIndexOf("@");
    if (at > 0) {
        const localPart = email.slice(0, at).toLowerCase();
        const domain = email.slice(at + 1).toLowerCase();
        if (DISPOSABLE.has(domain)) add(5, "disposable-email");
        if (ROLE_LOCALPARTS.has(localPart)) add(2, "role-address");
        if (/\.(ru|cn|xyz|top|club|icu)$/.test(domain)) add(2, "high-risk-tld");
        if (fullName.toLowerCase().replace(/\s/g, "") === localPart) add(1, "name-equals-email");
    }

    // Behavioral: the page sets this on the first real pointer or key event.
    if (input.interacted !== true && input.interacted !== "true") add(3, "no-interaction");

    // Timing. Humans need a few seconds; the form is also unusable after a day.
    if (input.elapsedMs < 4000) add(4, "too-fast");
    if (input.elapsedMs > 24 * 60 * 60 * 1000) add(3, "stale-form");

    // Volume
    if (notes.length > 1200) add(2, "very-long-notes");
    if ((notes.match(/\n/g) || []).length > 25) add(2, "many-newlines");
    const caps = notes.replace(/[^A-Z]/g, "").length;
    if (notes.length > 40 && caps / notes.length > 0.5) add(2, "shouting");

    return {
        block: score >= SPAM_THRESHOLD,
        reason: signals.join(" "),
        score,
        signals,
    };
}

/* ---------------- 5. Optional Cloudflare Turnstile ---------------- */
/**
 * Enabled only when TURNSTILE_SECRET is set, so the form keeps working
 * if the key is missing or Cloudflare is down. Add the widget and
 * VITE_TURNSTILE_SITE_KEY on the client to switch it on.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET;
    if (!secret) return true;
    if (!token) return false;
    try {
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret, response: token, remoteip: ip }),
        });
        const json = (await res.json()) as { success?: boolean };
        return json.success === true;
    } catch (err) {
        console.error("Turnstile verify failed, allowing through:", err);
        return true;
    }
}

export { norm };

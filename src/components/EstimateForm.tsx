import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Phone } from "lucide-react";
import { getAttribution } from "@/lib/attribution";
import { SERVICES, SITUATIONS, TIMELINES, type Choice } from "@/lib/estimate";
import { CONSENT_TEXT, PHONE_DISPLAY, PHONE_TEL, PRIVACY_PATH, TERMS_PATH } from "@/lib/site";

/* ============================================================
   Estimate form, styled after the acquisition.com/roadmap card:
   one short question per screen, big grey fields, yellow pill.

   A2P rules this form must keep:
     - phone number is OPTIONAL (no required attribute, no asterisk)
     - SMS consent checkbox is optional and NOT pre-checked
     - consent text names the business, frequency, rates, HELP/STOP
       and links Privacy Policy & Terms; it's visible on arrival
     - separate required "18 or older" confirmation
     - opt-in proof (text, timestamp, page URL) sent with the lead
   Submits to /api/send.
   ============================================================ */

type ChoiceId = "service" | "situation" | "timeline";
type Step =
    | { kind: "name"; title: string; button: string }
    | { kind: "choice"; id: ChoiceId; title: string; options: Choice[] }
    | { kind: "contact"; title: string; button: string }
    | { kind: "address"; title: string; button: string };

const STEPS: Step[] = [
    { kind: "name", title: "What's your name?", button: "Let's start" },
    { kind: "choice", id: "service", title: "What do you want painted?", options: SERVICES },
    { kind: "choice", id: "situation", title: "Why are you painting?", options: SITUATIONS },
    { kind: "choice", id: "timeline", title: "When do you want it done?", options: TIMELINES },
    { kind: "contact", title: "How can Jay reach you?", button: "Next" },
    { kind: "address", title: "Where is the house?", button: "Get my 3 prices" },
];

/**
 * Proof of work: find a nonce where sha256(`${ts}:${nonce}`) starts with
 * four hex zeros. Solved in the background while the customer answers,
 * and it proves a JS runtime ran, which a scripted POST cannot fake.
 * Verified server-side in api/_spam.ts.
 */
async function solveProofOfWork(ts: number, signal?: { cancelled: boolean }): Promise<string> {
    if (typeof crypto === "undefined" || !crypto.subtle) return "0";
    const enc = new TextEncoder();
    for (let nonce = 0; nonce < 5_000_000; nonce++) {
        if (signal?.cancelled) return "0";
        const buf = await crypto.subtle.digest("SHA-256", enc.encode(`${ts}:${nonce}`));
        const hex = Array.from(new Uint8Array(buf.slice(0, 3)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        if (hex.startsWith("0000")) return String(nonce);
        if (nonce % 500 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    return "0";
}

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function EstimateForm({ afterCard }: { afterCard?: React.ReactNode }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<Record<ChoiceId, string>>>({});
    const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    const [smsConsent, setSmsConsent] = useState(false);
    const [ageConfirm, setAgeConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState("");

    const [hp, setHp] = useState({ website: "", fax: "", company_url: "" });
    const tsRef = useRef(0);
    const nonceRef = useRef("");
    const interactedRef = useRef(false);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const movedRef = useRef(false);

    const current = STEPS[step];
    const progress = Math.round((step / STEPS.length) * 100);

    useEffect(() => {
        tsRef.current = Date.now();
        const signal = { cancelled: false };
        solveProofOfWork(tsRef.current, signal).then((n) => { nonceRef.current = n; });

        const mark = () => { interactedRef.current = true; };
        window.addEventListener("pointerdown", mark, { once: true, passive: true });
        window.addEventListener("keydown", mark, { once: true });
        return () => {
            signal.cancelled = true;
            window.removeEventListener("pointerdown", mark);
            window.removeEventListener("keydown", mark);
        };
    }, []);

    // Move focus to the new question so keyboard and screen-reader users
    // land on it (skipped on first render so the page doesn't jump).
    useEffect(() => {
        if (movedRef.current) titleRef.current?.focus();
    }, [step]);

    const go = (n: number) => { movedRef.current = true; setErrors({}); setStep(n); };

    const formatPhone = (raw: string) => {
        const d = raw.replace(/\D/g, "").slice(0, 10);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    };

    const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = k === "phone" ? formatPhone(e.target.value) : e.target.value;
        setF((s) => ({ ...s, [k]: v }));
        if (errors[k]) setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
    };

    const choose = (id: ChoiceId, value: string) => {
        setAnswers((a) => ({ ...a, [id]: value }));
        window.setTimeout(() => go(step + 1), 180);
    };

    /** Validate only what's on the current screen. */
    const validateStep = (): boolean => {
        const e: Record<string, string> = {};
        if (current.kind === "name" && `${f.firstName} ${f.lastName}`.trim().length < 2) e.firstName = "Please type your name.";
        if (current.kind === "contact") {
            if (!EMAIL_RE.test(f.email.trim())) e.email = "Please type a real email.";
            const d = f.phone.replace(/\D/g, "");
            if (d.length > 0 && d.length < 10) e.phone = "Please type all 10 numbers.";
        }
        if (current.kind === "address") {
            if (f.address.trim().length < 5) e.address = "Please type the address.";
            if (!ageConfirm) e.age = "Please check the box below that says you are 18 or older.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        setApiError("");
        setSubmitting(true);
        try {
            const res = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: `${f.firstName.trim()} ${f.lastName.trim()}`.trim(),
                    email: f.email.trim(),
                    phone: f.phone.trim(),
                    address: f.address.trim(),
                    notes: "",
                    service: answers.service || "",
                    situation: answers.situation || "",
                    timeline: answers.timeline || "",
                    smsConsent,
                    ageConfirm,
                    consentText: CONSENT_TEXT,
                    consentTimestamp: new Date().toISOString(),
                    sourceUrl: window.location.href,
                    attribution: getAttribution(),
                    ...hp,
                    interacted: interactedRef.current,
                    _ts: String(tsRef.current),
                    _nonce: nonceRef.current,
                }),
            });
            let data: { ok?: boolean; error?: string } | null = null;
            try { data = await res.json(); } catch { /* non-JSON response */ }
            if (!res.ok || data?.ok === false) {
                setApiError(data?.error || `That didn't send. Please call us at ${PHONE_DISPLAY}.`);
            } else {
                setSubmitted(true);
            }
        } catch {
            setApiError(`That didn't send. Try again, or call us at ${PHONE_DISPLAY}.`);
        } finally {
            setSubmitting(false);
        }
    };

    const onNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;
        if (step === STEPS.length - 1) void submit();
        else go(step + 1);
    };

    const card = "rounded-2xl border border-brand-soft bg-white p-6";

    if (submitted) {
        return (
            <div className={`${card} text-center`} role="status">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
                    <Check className="h-7 w-7 text-brand" strokeWidth={3} aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-[24px] leading-[35px] text-ink">You're all set, {f.firstName.trim()}!</h2>
                <p className="mb-6 text-[16px] text-slate">Jay will call you soon to pick a time to see your house.</p>
                <a href={`tel:${PHONE_TEL}`} className="btn-cta">
                    <Phone className="h-5 w-5" aria-hidden="true" /> Call {PHONE_DISPLAY}
                </a>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={onNext} noValidate autoComplete="on" className={card}>
                {/* Progress */}
                <div className="mb-5 flex items-center gap-3">
                    {step > 0 ? (
                        <button type="button" onClick={() => go(step - 1)} className="-ml-1 inline-flex items-center gap-1 rounded text-[14px] font-medium text-slate hover:text-ink">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                        </button>
                    ) : null}
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-field" aria-hidden="true">
                        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${Math.max(progress, 6)}%` }} />
                    </div>
                    <span className="text-[13px] font-medium text-slate">{step + 1} of {STEPS.length}</span>
                </div>

                <h2 ref={titleRef} tabIndex={-1} className="mb-4 text-[24px] leading-[35px] text-ink outline-none">
                    {current.title}
                </h2>

                {/* Honeypots */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                    <input type="text" tabIndex={-1} autoComplete="off" value={hp.website} onChange={(e) => setHp({ ...hp, website: e.target.value })} />
                    <input type="text" tabIndex={-1} autoComplete="off" value={hp.fax} onChange={(e) => setHp({ ...hp, fax: e.target.value })} />
                    <input type="text" tabIndex={-1} autoComplete="off" value={hp.company_url} onChange={(e) => setHp({ ...hp, company_url: e.target.value })} />
                </div>

                {current.kind === "choice" && (
                    <div className="space-y-3" role="group" aria-label={current.title}>
                        {current.options.map((o) => {
                            const on = answers[current.id] === o.value;
                            return (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => choose(current.id, o.value)}
                                    aria-pressed={on}
                                    className={`flex h-[55px] w-full items-center justify-between rounded-lg border px-[13px] text-left text-[18px] font-medium transition-colors ${on ? "border-2 border-brand bg-brand-light text-ink" : "border-fieldline bg-field text-ink hover:border-ink"}`}
                                >
                                    {o.label}
                                    {on && <Check className="h-5 w-5 text-brand" strokeWidth={3} aria-hidden="true" />}
                                </button>
                            );
                        })}
                    </div>
                )}

                {current.kind === "name" && (
                    <div className="space-y-4">
                        <Field error={errors.firstName}>
                            <input aria-label="First name" placeholder="First name" autoComplete="given-name" value={f.firstName} onChange={set("firstName")} className={`field ${errors.firstName ? "field-error" : ""}`} />
                        </Field>
                        <input aria-label="Last name" placeholder="Last name" autoComplete="family-name" value={f.lastName} onChange={set("lastName")} className="field" />
                    </div>
                )}

                {current.kind === "contact" && (
                    <div className="space-y-4">
                        <Field error={errors.email}>
                            <input type="email" inputMode="email" aria-label="Email" placeholder="Email" autoComplete="email" value={f.email} onChange={set("email")} className={`field ${errors.email ? "field-error" : ""}`} />
                        </Field>
                        <Field error={errors.phone}>
                            <input type="tel" inputMode="tel" aria-label="Phone (optional)" placeholder="Phone (optional)" autoComplete="tel" value={f.phone} onChange={set("phone")} className={`field ${errors.phone ? "field-error" : ""}`} />
                        </Field>
                    </div>
                )}

                {current.kind === "address" && (
                    <Field error={errors.address}>
                        <input aria-label="House address" placeholder="Street, city, ZIP" autoComplete="street-address" value={f.address} onChange={set("address")} className={`field ${errors.address ? "field-error" : ""}`} />
                    </Field>
                )}

                {errors.age && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[14px] font-medium text-red-700" role="alert">{errors.age}</p>}
                {apiError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[14px] font-medium text-red-700" role="alert">{apiError}</p>}

                {current.kind !== "choice" && (
                    <div className="mt-8">
                        <button type="submit" disabled={submitting} className="btn-cta">
                            {submitting ? (<><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Sending</>) : current.button}
                        </button>
                        <p className="mt-3 text-center text-[14px] font-medium text-ink">Free. Takes about 60 seconds.</p>
                    </div>
                )}
            </form>

            {afterCard}

            {/* ---- A2P consent: visible on arrival, below the card like the roadmap page's fine print ---- */}
            <div className="mt-7 space-y-3 text-left">
                <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={smsConsent} onChange={(e) => setSmsConsent(e.target.checked)} className="mt-0.5 h-5 w-5 flex-shrink-0 accent-brand" />
                    <span className="text-[13px] leading-[1.55] text-ink/75">
                        {CONSENT_TEXT}{" "}
                        <Link to={PRIVACY_PATH} className="font-semibold text-brand underline">Privacy Policy</Link> &amp;{" "}
                        <Link to={TERMS_PATH} className="font-semibold text-brand underline">Terms</Link>.
                    </span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg ${errors.age ? "bg-red-50 p-2 ring-1 ring-red-400" : ""}`}>
                    <input
                        type="checkbox"
                        checked={ageConfirm}
                        onChange={(e) => { setAgeConfirm(e.target.checked); if (errors.age) setErrors((er) => { const n = { ...er }; delete n.age; return n; }); }}
                        className="h-5 w-5 flex-shrink-0 accent-brand"
                    />
                    <span className="text-[15px] font-medium text-ink">I am 18 or older. (Required)</span>
                </label>
            </div>
        </>
    );
}

function Field({ error, children }: { error?: string; children: React.ReactNode }) {
    return (
        <div>
            {children}
            {error && <p className="mt-1.5 text-[14px] font-medium text-red-600">{error}</p>}
        </div>
    );
}

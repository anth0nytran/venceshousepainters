import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Phone } from "lucide-react";
import { getAttribution } from "@/lib/attribution";
import { SERVICES, SITUATIONS, TIMELINES, type Choice } from "@/lib/estimate";
import { CONSENT_TEXT, PHONE_DISPLAY, PHONE_TEL, PRIVACY_PATH, TERMS_PATH } from "@/lib/site";

/* ============================================================
   Vences — estimate request.
   Adapted from the South Coast consultation funnel: one question
   per screen (single tap, auto-advance), then contact details.

   A2P rules this form must keep:
     - phone number is OPTIONAL (no required attribute, no asterisk)
     - SMS consent checkbox is optional and NOT pre-checked
     - consent text names the business, frequency, rates, HELP/STOP
       and links Privacy Policy & Terms
     - separate required "18 or older" confirmation
     - opt-in proof (text, timestamp, page URL) sent with the lead
   Submits to /api/send.
   ============================================================ */

type QId = "service" | "situation" | "timeline";
interface Step { id: QId; heading: string; options: Choice[] }

const STEPS: Step[] = [
    { id: "service", heading: "What would you like painted?", options: SERVICES },
    { id: "situation", heading: "What's going on with the house?", options: SITUATIONS },
    { id: "timeline", heading: "When would you like it done?", options: TIMELINES },
];
const TOTAL = STEPS.length + 1;

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

type Answers = Partial<Record<QId, string>>;

export default function EstimateForm() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [contact, setContact] = useState({ fullName: "", email: "", phone: "", address: "", notes: "" });
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

    const isDetails = step === STEPS.length;
    const progress = Math.round(((step + 1) / TOTAL) * 100);

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

    const goBack = () => setStep((s) => Math.max(0, s - 1));

    const choose = (id: QId, value: string) => {
        setAnswers((a) => ({ ...a, [id]: value }));
        window.setTimeout(() => setStep((s) => Math.min(STEPS.length, s + 1)), 200);
    };

    const formatPhone = (raw: string) => {
        const d = raw.replace(/\D/g, "").slice(0, 10);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
        return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    };

    const clearError = (k: string) => {
        if (errors[k]) setErrors((er) => { const n = { ...er }; delete n[k]; return n; });
    };

    const setField = (f: keyof typeof contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = f === "phone" ? formatPhone(e.target.value) : e.target.value;
        setContact((c) => ({ ...c, [f]: val }));
        clearError(f);
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (contact.fullName.trim().length < 2) e.fullName = "Please enter your name.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contact.email.trim())) e.email = "Please enter a valid email.";
        // Phone is OPTIONAL (A2P: consent must not be coerced). Validate only if provided.
        const digits = contact.phone.replace(/\D/g, "");
        if (digits.length > 0 && digits.length < 10) e.phone = "Please enter a valid phone number.";
        if (contact.address.trim().length < 5) e.address = "Please tell us where the project is.";
        if (!ageConfirm) e.age = "Please confirm you are at least 18 years old.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: contact.fullName.trim(),
                    email: contact.email.trim(),
                    phone: contact.phone.trim(),
                    address: contact.address.trim(),
                    notes: contact.notes.trim(),
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
                setApiError(data?.error || `We couldn't send that just now. Please call us at ${PHONE_DISPLAY}.`);
            } else {
                setSubmitted(true);
            }
        } catch {
            setApiError(`We couldn't reach the server. Please try again, or call us at ${PHONE_DISPLAY}.`);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="py-6 text-center" role="status">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
                    <Check className="h-6 w-6 text-brand" aria-hidden="true" />
                </div>
                <h2 className="mb-3 text-3xl">Thank you, {contact.fullName.split(" ")[0]}.</h2>
                <p className="mx-auto mb-6 max-w-md text-[15px] text-slate">
                    We received your request. Jay will reach out within one business day to set up a time to see the project.
                    A copy was sent to <span className="break-words text-ink">{contact.email}</span>.
                </p>
                <a href={`tel:${PHONE_TEL}`} className="btn btn-primary">
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call {PHONE_DISPLAY}
                </a>
            </div>
        );
    }

    // A2P consent block. Shown on EVERY step so a carrier reviewer sees it on
    // arrival; on the contact step it sits above the submit button.
    const consent = (
                <div className="mt-8 space-y-4 rounded-md border border-line bg-paper p-4">
                    {/* SMS opt-in: optional, unchecked by default */}
                    <label className="flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={smsConsent}
                            onChange={(e) => setSmsConsent(e.target.checked)}
                            className="mt-1 h-4 w-4 flex-shrink-0 accent-brand"
                        />
                        <span className="text-[12.5px] leading-relaxed text-slate">
                            {CONSENT_TEXT}{" "}
                            <Link to={PRIVACY_PATH} className="font-medium text-brand underline">Privacy Policy</Link> &amp;{" "}
                            <Link to={TERMS_PATH} className="font-medium text-brand underline">Terms</Link>.
                        </span>
                    </label>

                    {/* Age confirmation: required, unchecked by default */}
                    <div>
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={ageConfirm}
                                onChange={(e) => { setAgeConfirm(e.target.checked); clearError("age"); }}
                                className="mt-1 h-4 w-4 flex-shrink-0 accent-brand"
                            />
                            <span className="text-[14px] text-ink">I confirm I am at least 18 years old. *</span>
                        </label>
                        {errors.age && <p className="mt-1 pl-7 text-[13px] text-red-600">{errors.age}</p>}
                    </div>
                </div>
    );

    return (
        <div>
            {/* Progress */}
            <div className="mb-2 flex items-center justify-between text-[13px]">
                <span className="font-semibold text-ink">Step {step + 1} of {TOTAL}</span>
                <span className="text-slate">{progress}% done</span>
            </div>
            <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>

            {!isDetails ? (
                <div key={`step-${step}`}>
                    <h2 className="mb-6 text-[1.75rem] leading-tight sm:text-3xl">{STEPS[step].heading}</h2>
                    <div className="space-y-2.5">
                        {STEPS[step].options.map((opt) => {
                            const selected = answers[STEPS[step].id] === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => choose(STEPS[step].id, opt.value)}
                                    aria-pressed={selected}
                                    className={`group flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3.5 text-left transition-colors sm:px-5 ${selected ? "border-brand bg-brand-light" : "border-line bg-white hover:border-brand/50"}`}
                                >
                                    <span className="min-w-0">
                                        <span className="block text-[16px] font-semibold text-ink">{opt.label}</span>
                                        {opt.hint && <span className="mt-0.5 block text-[14px] text-slate">{opt.hint}</span>}
                                    </span>
                                    <ArrowRight className={`h-4 w-4 flex-shrink-0 ${selected ? "text-brand" : "text-slate/40 group-hover:text-brand"}`} aria-hidden="true" />
                                </button>
                            );
                        })}
                    </div>
                    {step > 0 && (
                        <button type="button" onClick={goBack} className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-slate hover:text-ink">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go back
                        </button>
                    )}
                    {consent}
                </div>
            ) : (
                <form onSubmit={handleSubmit} autoComplete="on" noValidate>
                    <h2 className="mb-2 text-[1.75rem] leading-tight sm:text-3xl">Where should we reach you?</h2>
                    <p className="mb-6 text-[15px] text-slate">We'll use this to set up a time to see the project.</p>

                    {/* Honeypots */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                        <input type="text" tabIndex={-1} autoComplete="off" value={hp.website} onChange={(e) => setHp({ ...hp, website: e.target.value })} />
                        <input type="text" tabIndex={-1} autoComplete="off" value={hp.fax} onChange={(e) => setHp({ ...hp, fax: e.target.value })} />
                        <input type="text" tabIndex={-1} autoComplete="off" value={hp.company_url} onChange={(e) => setHp({ ...hp, company_url: e.target.value })} />
                    </div>

                    {apiError && <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-700" role="alert">{apiError}</div>}

                    <div className="space-y-4">
                        <Field id="fullName" label="Your name *" error={errors.fullName}>
                            <input id="fullName" value={contact.fullName} onChange={setField("fullName")} autoComplete="name" className={`input ${errors.fullName ? "input-error" : ""}`} />
                        </Field>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field id="email" label="Email *" error={errors.email}>
                                <input id="email" type="email" inputMode="email" autoComplete="email" value={contact.email} onChange={setField("email")} className={`input ${errors.email ? "input-error" : ""}`} />
                            </Field>
                            <Field id="phone" label="Phone (optional)" error={errors.phone}>
                                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={setField("phone")} placeholder="(832) 555-0198" className={`input ${errors.phone ? "input-error" : ""}`} />
                            </Field>
                        </div>
                        <Field id="address" label="Project address *" error={errors.address}>
                            <input id="address" value={contact.address} onChange={setField("address")} autoComplete="street-address" placeholder="Street, city and ZIP" className={`input ${errors.address ? "input-error" : ""}`} />
                        </Field>
                        <Field id="notes" label="Anything else we should know? (optional)">
                            <textarea id="notes" value={contact.notes} onChange={setField("notes")} rows={3} className="input resize-none" />
                        </Field>
                    </div>

                    {consent}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <button type="button" onClick={goBack} className="inline-flex items-center gap-2 text-[14px] font-medium text-slate hover:text-ink">
                            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go back
                        </button>
                        <button type="submit" disabled={submitting} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                            {submitting
                                ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</>)
                                : (<>Request My Estimate <ArrowRight className="h-4 w-4" aria-hidden="true" /></>)}
                        </button>
                    </div>
                </form>
            )}

            </div>
    );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-[13px] font-medium text-ink">{label}</label>
            {children}
            {error && <p className="text-[13px] text-red-600">{error}</p>}
        </div>
    );
}

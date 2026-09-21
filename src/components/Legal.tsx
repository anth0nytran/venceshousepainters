import { ADDRESS, EMAIL, LEGAL_NAME, PHONE_DISPLAY, PHONE_TEL, POLICY_EFFECTIVE } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <article className="wrap max-w-3xl break-words py-12 sm:py-16">
            <p className="eyebrow mb-3">Legal</p>
            <h1 className="mb-2 text-4xl sm:text-5xl">{title}</h1>
            <p className="mb-10 text-[14px] text-slate">Effective {POLICY_EFFECTIVE}</p>
            {children}
        </article>
    );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="mb-3 text-2xl">{title}</h2>
            <div className="space-y-3 text-[15px] leading-[1.8] text-slate">{children}</div>
        </section>
    );
}

export function Label({ children }: { children: React.ReactNode }) {
    return <span className="font-semibold text-ink">{children}</span>;
}

export function ContactBlock() {
    return (
        <p>
            {LEGAL_NAME}<br />
            {ADDRESS.street}<br />
            {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}<br />
            Phone: <a href={`tel:${PHONE_TEL}`} className="text-brand hover:underline">{PHONE_DISPLAY}</a><br />
            Email: <a href={`mailto:${EMAIL}`} className="text-brand hover:underline">{EMAIL}</a>
        </p>
    );
}

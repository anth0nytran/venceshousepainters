import { useEffect, useState } from "react";
import { ArrowRight, Check, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import EstimateForm from "@/components/EstimateForm";
import Vsl from "@/components/Vsl";
import {
    FAQ, FINAL_CTA, HERO, OFFER, PHOTOS, PROBLEM, PROMISE, PROOF_BAR, REVIEWS, SCARCITY, SEGMENTS, STEPS,
} from "@/lib/landing";
import { LEGAL_NAME, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { usePageTitle } from "@/lib/usePageTitle";

const FORM_ID = "estimate";

function CtaButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <a href={`#${FORM_ID}`} className={`btn bg-brand px-7 py-4 text-[16px] text-white shadow-md hover:bg-brand-dark ${className}`}>
            {children} <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </a>
    );
}

export default function Estimate() {
    usePageTitle(`Request a Painting Estimate | ${LEGAL_NAME}`);

    return (
        <>
            {/* ---------------- HERO + VSL ---------------- */}
            <section className="border-b border-line">
                <div className="wrap grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                    <div>
                        <p className="eyebrow mb-4">{HERO.eyebrow}</p>
                        <h1 className="mb-5 text-[2.35rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]">{HERO.headline}</h1>
                        <Vsl className="mb-7 lg:hidden" />
                        <p className="mb-7 max-w-xl text-[17px] leading-relaxed text-slate">{HERO.sub}</p>
                        <CtaButton className="w-full sm:w-auto">{HERO.cta}</CtaButton>
                        <p className="mt-3 text-[13px] text-slate">{HERO.ctaNote}</p>
                        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:flex sm:flex-wrap sm:gap-x-6">
                            {PROOF_BAR.map((p) => (
                                <li key={p} className="flex items-center gap-2 text-[14px] font-medium text-ink">
                                    <Check className="h-4 w-4 flex-shrink-0 text-brand" aria-hidden="true" /> {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Vsl className="hidden lg:block" />
                </div>
            </section>

            {/* ---------------- FORM ---------------- */}
            <section id={FORM_ID} className="scroll-mt-4 bg-white">
                <div className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
                    <div className="lg:pt-2">
                        <p className="eyebrow mb-3">Free estimate</p>
                        <h2 className="mb-4 text-4xl leading-tight">Start here. It takes about 60 seconds.</h2>
                        <ol className="mb-8 space-y-5">
                            {STEPS.map((s, i) => (
                                <li key={s.title} className="flex gap-4">
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-white">{i + 1}</span>
                                    <span>
                                        <span className="block font-semibold text-ink">{s.title}</span>
                                        <span className="block text-[15px] text-slate">{s.body}</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <p className="rounded-md border-l-4 border-brand bg-brand-light px-4 py-3 text-[14px] text-ink">{SCARCITY}</p>
                    </div>
                    <div className="rounded-xl border border-line bg-white p-5 shadow-lg sm:p-8">
                        <EstimateForm />
                    </div>
                </div>
            </section>

            {/* ---------------- PROBLEM ---------------- */}
            <section className="bg-ink text-paper">
                <div className="wrap max-w-3xl py-14 sm:py-20">
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8FB8EC]">{PROBLEM.eyebrow}</p>
                    <h2 className="mb-6 text-4xl sm:text-5xl">{PROBLEM.headline}</h2>
                    <div className="space-y-4 text-[17px] leading-relaxed text-paper/80">
                        {PROBLEM.body.map((p) => <p key={p}>{p}</p>)}
                    </div>
                    <p className="mt-8 font-display text-3xl text-white">{PROBLEM.turn}</p>
                </div>
            </section>

            {/* ---------------- OFFER STACK ---------------- */}
            <section>
                <div className="wrap max-w-4xl py-14 sm:py-20">
                    <p className="eyebrow mb-3 text-center">{OFFER.eyebrow}</p>
                    <h2 className="mb-3 text-center text-4xl sm:text-5xl">{OFFER.headline}</h2>
                    <p className="mx-auto mb-10 max-w-xl text-center text-[16px] text-slate">{OFFER.sub}</p>
                    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
                        {OFFER.items.map((item) => (
                            <li key={item.title} className="flex gap-4 p-5 sm:p-6">
                                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-light">
                                    <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                                </span>
                                <span>
                                    <span className="mb-1 block text-[17px] font-semibold text-ink">{item.title}</span>
                                    <span className="block text-[15px] leading-relaxed text-slate">{item.body}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 text-center">
                        <CtaButton>{HERO.cta}</CtaButton>
                    </div>
                </div>
            </section>

            {/* ---------------- PROOF PHOTOS ---------------- */}
            <section className="bg-white">
                <div className="wrap py-14 sm:py-20">
                    <p className="eyebrow mb-3 text-center">On the job</p>
                    <h2 className="mb-10 text-center text-4xl">How we treat your house</h2>
                    <div className="grid gap-5 sm:grid-cols-3">
                        {PHOTOS.map((ph) => (
                            <figure key={ph.src}>
                                <img src={ph.src} alt={ph.alt} loading="lazy" width={900} height={1600} className="aspect-[4/5] w-full rounded-xl object-cover" />
                                <figcaption className="mt-3 text-[14px] text-slate">{ph.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- WHO IT'S FOR ---------------- */}
            <section>
                <div className="wrap py-14 sm:py-20">
                    <p className="eyebrow mb-3 text-center">Who we help</p>
                    <h2 className="mb-10 text-center text-4xl">Painting that fits where you are</h2>
                    <div className="grid gap-5 md:grid-cols-3">
                        {SEGMENTS.map((s) => (
                            <div key={s.title} className="rounded-xl border border-line bg-white p-6">
                                <h3 className="mb-2 text-2xl">{s.title}</h3>
                                <p className="text-[15px] leading-relaxed text-slate">{s.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- REVIEWS (real ones only) ---------------- */}
            {REVIEWS.length > 0 && (
                <section className="bg-white">
                    <div className="wrap py-14 sm:py-20">
                        <h2 className="mb-10 text-center text-4xl">What homeowners say</h2>
                        <div className="grid gap-5 md:grid-cols-3">
                            {REVIEWS.map((r) => (
                                <blockquote key={r.name} className="rounded-xl border border-line p-6">
                                    <p className="mb-4 text-[15px] leading-relaxed text-ink">"{r.quote}"</p>
                                    <footer className="text-[14px] text-slate">{r.name} · {r.area}</footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------------- RISK REVERSAL ---------------- */}
            <section className="bg-brand text-white">
                <div className="wrap flex max-w-3xl flex-col items-center py-14 text-center sm:py-16">
                    <ShieldCheck className="mb-4 h-10 w-10" aria-hidden="true" />
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80">{PROMISE.eyebrow}</p>
                    <h2 className="mb-4 text-3xl sm:text-4xl">{PROMISE.headline}</h2>
                    <p className="max-w-xl text-[16px] text-white/85">{PROMISE.body}</p>
                </div>
            </section>

            {/* ---------------- FAQ ---------------- */}
            <section>
                <div className="wrap max-w-3xl py-14 sm:py-20">
                    <h2 className="mb-8 text-center text-4xl">Questions</h2>
                    <div className="divide-y divide-line rounded-xl border border-line bg-white">
                        {FAQ.map((f) => (
                            <details key={f.q} className="group p-5">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                                    {f.q}
                                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate transition-transform group-open:rotate-180" aria-hidden="true" />
                                </summary>
                                <p className="mt-3 text-[15px] leading-relaxed text-slate">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------------- FINAL CTA ---------------- */}
            <section className="bg-ink text-paper">
                <div className="wrap flex flex-col items-center py-14 pb-28 text-center sm:py-20 lg:pb-20">
                    <h2 className="mb-3 text-4xl text-white sm:text-5xl">{FINAL_CTA.headline}</h2>
                    <p className="mb-8 max-w-md text-[16px] text-paper/80">{FINAL_CTA.sub}</p>
                    <CtaButton>{FINAL_CTA.cta}</CtaButton>
                    <a href={`tel:${PHONE_TEL}`} className="mt-5 inline-flex items-center gap-2 text-[15px] text-paper/80 hover:text-white">
                        <Phone className="h-4 w-4" aria-hidden="true" /> Or call {PHONE_DISPLAY}
                    </a>
                </div>
            </section>

            <StickyCta />
        </>
    );
}

/**
 * Mobile-only bar. Appears once the hero CTA scrolls away and hides while
 * the form itself is on screen, so it never covers the fields.
 */
function StickyCta() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const form = document.getElementById(FORM_ID);
        let formVisible = false;
        const io = form
            ? new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; update(); }, { threshold: 0.05 })
            : null;
        function update() { setShow(window.scrollY > 350 && !formVisible); }
        if (form && io) io.observe(form);
        window.addEventListener("scroll", update, { passive: true });
        return () => { io?.disconnect(); window.removeEventListener("scroll", update); };
    }, []);

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
            aria-hidden={!show}
        >
            <div className="flex gap-3">
                <a href={`#${FORM_ID}`} tabIndex={show ? 0 : -1} className="btn flex-1 bg-brand text-white hover:bg-brand-dark">
                    {HERO.cta}
                </a>
                <a href={`tel:${PHONE_TEL}`} tabIndex={show ? 0 : -1} aria-label={`Call ${PHONE_DISPLAY}`} className="btn border border-line px-4 text-ink">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                </a>
            </div>
        </div>
    );
}

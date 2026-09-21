import { useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GOOGLE_PROFILE, REVIEWS, timeAgo, type Review } from "@/lib/reviews";

/* ============================================================
   Google reviews widget. Styled to match Google's own review
   cards (Roboto, #202124 / #70757a text, #FBBC04 stars, letter
   avatars, owner-response boxes). Every review is real and
   verbatim; see src/lib/reviews.ts for the rules.
   ============================================================ */

export function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

const STAR_PATH = "M12 2.5l2.94 6.27 6.87.76-5.13 4.63 1.43 6.77L12 17.47l-6.11 3.46 1.43-6.77L2.19 9.53l6.87-.76z";

/** Row of five stars, partially filled for ratings like 4.9. */
export function Stars({ rating = 5, size = 14 }: { rating?: number; size?: number }) {
    return (
        <span className="inline-flex" role="img" aria-label={`Rated ${rating} out of 5`}>
            {[0, 1, 2, 3, 4].map((i) => {
                const fill = Math.max(0, Math.min(1, rating - i));
                return (
                    <span key={i} className="relative" style={{ width: size, height: size }}>
                        <svg viewBox="0 0 24 24" width={size} height={size} className="absolute inset-0" aria-hidden="true">
                            <path d={STAR_PATH} fill="#dadce0" />
                        </svg>
                        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
                                <path d={STAR_PATH} fill="#FBBC04" />
                            </svg>
                        </span>
                    </span>
                );
            })}
        </span>
    );
}

const AVATAR_COLORS = ["#5C6BC0", "#00897B", "#EF6C00", "#8E24AA", "#546E7A", "#D81B60", "#43A047", "#F4511E", "#3949AB", "#6D4C41"];

function Avatar({ name }: { name: string }) {
    const n = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
    return (
        <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[18px] font-medium text-white"
            style={{ background: AVATAR_COLORS[n % AVATAR_COLORS.length] }}
            aria-hidden="true"
        >
            {name.trim().charAt(0).toUpperCase()}
        </span>
    );
}

// "New" depends on today's date, so it's decided on the client only
// (null while prerendering) and the static HTML never disagrees with it.
const CLIENT_NOW = typeof window === "undefined" ? 0 : Date.now();
const noopSubscribe = () => () => {};
function useClientNow(): number | null {
    return useSyncExternalStore(noopSubscribe, () => CLIENT_NOW, () => null);
}

function ReviewCard({ r }: { r: Review }) {
    const [open, setOpen] = useState(false);
    const long = !r.truncated && r.text.length > 240;
    const now = useClientNow();
    const isNew = now !== null && (now - new Date(r.date).getTime()) / 86_400_000 < 31;

    return (
        <article className="flex w-[300px] flex-shrink-0 snap-start flex-col rounded-lg border border-[#dadce0] bg-white p-4 text-left sm:w-[320px]">
            <header className="mb-2 flex items-start gap-3">
                <Avatar name={r.name} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium leading-5 text-[#202124]">{r.name}</p>
                    <p className="truncate text-[12px] leading-4 text-[#70757a]">{r.meta}</p>
                </div>
                <GoogleG className="mt-0.5 h-5 w-5 flex-shrink-0" />
            </header>

            <div className="mb-2 flex items-center gap-2">
                <Stars rating={5} size={14} />
                <span className="text-[12px] text-[#70757a]" suppressHydrationWarning>{timeAgo(r.date)}</span>
                {isNew && <span className="rounded bg-[#e8f0fe] px-1.5 text-[11px] font-medium leading-[18px] text-[#1967d2]">New</span>}
            </div>

            {r.tag && <p className="mb-1.5 text-[12px] font-medium text-[#70757a]">{r.tag}</p>}

            <p className={`whitespace-pre-line text-[14px] leading-5 text-[#202124] ${open ? "" : "line-clamp-6"}`}>
                {r.text}{r.truncated ? "…" : ""}
            </p>
            {long && (
                <button type="button" onClick={() => setOpen((o) => !o)} className="-my-1 mt-0 self-start py-2 text-[14px] font-medium text-[#70757a] hover:text-[#202124]">
                    {open ? "Less" : "More"}
                </button>
            )}
            {r.truncated && (
                <a href={GOOGLE_PROFILE.url} target="_blank" rel="noopener noreferrer" className="-my-1 mt-0 self-start py-2 text-[14px] font-medium text-[#70757a] hover:text-[#202124]">
                    More<span className="sr-only"> (opens the full review on Google)</span>
                </a>
            )}

            {r.reply && (
                <div className="mt-3 rounded-lg bg-[#f8f9fa] p-3">
                    <p className="mb-1 text-[13px] font-medium text-[#202124]">
                        Response from the owner <span className="font-normal text-[#70757a]" suppressHydrationWarning>{timeAgo(r.reply.date)}</span>
                    </p>
                    <p className="line-clamp-3 text-[13px] leading-[18px] text-[#3c4043]">{r.reply.text}</p>
                </div>
            )}
        </article>
    );
}

export default function GoogleReviews() {
    const track = useRef<HTMLDivElement>(null);
    const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * 336, behavior: "smooth" });

    return (
        <section id="reviews" aria-label="Google reviews" className="scroll-mt-4 border-t border-line bg-white px-4 py-12 font-roboto sm:py-14">
            <div className="mx-auto max-w-[1080px]">
                {/* Summary header, like Google's rating block */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <GoogleG className="h-6 w-6" />
                                <span className="text-[18px] font-medium text-[#202124]">Reviews</span>
                            </div>
                            <p className="mt-0.5 text-[14px] text-[#70757a]">{GOOGLE_PROFILE.name}</p>
                        </div>
                        <div className="h-12 w-px bg-[#dadce0]" aria-hidden="true" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[32px] font-normal leading-none text-[#202124]">{GOOGLE_PROFILE.rating.toFixed(1)}</span>
                                <Stars rating={GOOGLE_PROFILE.rating} size={18} />
                            </div>
                            <p className="mt-1 text-[13px] text-[#70757a]">{GOOGLE_PROFILE.count} reviews</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews" className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] sm:flex">
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => scroll(1)} aria-label="Next reviews" className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] sm:flex">
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <a href={GOOGLE_PROFILE.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#dadce0] px-4 py-2 text-[14px] font-medium text-[#1a73e8] hover:bg-[#f8f9fa]">
                            See all reviews
                        </a>
                    </div>
                </div>

                <div ref={track} className="relative -mx-4 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:thin]">
                    {REVIEWS.map((r) => <ReviewCard key={r.name} r={r} />)}
                </div>
            </div>
        </section>
    );
}

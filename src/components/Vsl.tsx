import { VSL_POSTER, VSL_SRC } from "@/lib/site";
import { VSL_CAPTION } from "@/lib/landing";

/**
 * Vertical (9:16) video sales letter, shot on the phone the same way the
 * ads are. Until VSL_SRC is set it shows the poster photo on its own, so
 * there is never a dead "video coming soon" box on the page.
 */
export default function Vsl({ className = "" }: { className?: string }) {
    return (
        <figure className={className}>
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[250px] sm:max-w-[300px] lg:max-w-[340px] overflow-hidden rounded-2xl bg-ink shadow-xl ring-1 ring-black/5">
                {VSL_SRC ? (
                    <video
                        className="h-full w-full object-cover"
                        src={VSL_SRC}
                        poster={VSL_POSTER}
                        controls
                        playsInline
                        preload="none"
                        aria-label={VSL_CAPTION}
                    />
                ) : (
                    <img
                        src={VSL_POSTER}
                        alt="Jay Vences, owner of Vences House Painters, at a home in the Houston area"
                        className="h-full w-full object-cover"
                        width={900}
                        height={1600}
                        fetchPriority="high"
                    />
                )}
            </div>
            <figcaption className="mt-3 text-center text-[13px] text-slate">
                {VSL_SRC ? VSL_CAPTION : "Jay Vences, owner. He walks every job himself."}
            </figcaption>
        </figure>
    );
}

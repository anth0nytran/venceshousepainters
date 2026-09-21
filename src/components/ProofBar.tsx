import { Check } from "lucide-react";
import { GoogleG, Stars } from "@/components/GoogleReviews";
import { GOOGLE_PROFILE } from "@/lib/reviews";

/**
 * Quiet proof above the headline. The Google badge jumps down to the
 * full reviews; the two ticks are plain facts about how Jay works.
 */
export default function ProofBar() {
    return (
        <div className="mx-auto mb-5 flex max-w-[680px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-slate">
            <a href="#reviews" className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-roboto hover:border-fieldline">
                <GoogleG className="h-4 w-4" />
                <span className="font-medium text-[#202124]">{GOOGLE_PROFILE.rating.toFixed(1)}</span>
                <Stars rating={GOOGLE_PROFILE.rating} size={13} />
                <span className="text-[#70757a]">({GOOGLE_PROFILE.count} Google reviews)</span>
            </a>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Check className="h-4 w-4 text-brand" strokeWidth={3} aria-hidden="true" /> Owner on every job
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
                <Check className="h-4 w-4 text-brand" strokeWidth={3} aria-hidden="true" /> Houston, TX
            </span>
        </div>
    );
}

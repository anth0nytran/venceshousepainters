import { Star } from "lucide-react";
import EstimateForm from "@/components/EstimateForm";
import GoogleReviews from "@/components/GoogleReviews";
import ProofBar from "@/components/ProofBar";
import Vsl from "@/components/Vsl";
import { HEADLINE, PROOF } from "@/lib/landing";
import { LEGAL_NAME } from "@/lib/site";
import { usePageTitle } from "@/lib/usePageTitle";

// Layout follows acquisition.com/roadmap: headline, big picture,
// one-question-at-a-time form card, two proof lines, fine print.
// Quiet Google proof sits above the headline; the full reviews
// widget sits under everything.
export default function Estimate() {
    usePageTitle(`Get 3 Free Painting Prices | ${LEGAL_NAME}`);

    return (
        <>
        <section className="px-4 pb-14 pt-6 text-center sm:pt-8">
            <ProofBar />
            <h1 className="mx-auto max-w-[1170px] text-balance text-[32px] leading-[1.15] text-black sm:text-[44px] lg:text-[53px]">
                {HEADLINE}
            </h1>

            <Vsl className="mx-auto mt-7 max-w-[680px] sm:mt-9" />

            <div id="estimate" className="mx-auto mt-10 max-w-[524px] scroll-mt-4 text-left">
                <EstimateForm
                    afterCard={
                        <ul className="mt-7 space-y-4">
                            {PROOF.map((p) => (
                                <li key={p} className="text-balance text-center text-[18px] font-bold leading-snug text-ink sm:text-[22px]">
                                    <Star className="-mt-1 mr-2 inline h-5 w-5 fill-brand text-brand" aria-hidden="true" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    }
                />
            </div>
        </section>

        <GoogleReviews />
        </>
    );
}

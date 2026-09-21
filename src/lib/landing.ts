/* ============================================================
   Landing page copy — Vences House Painters estimate page.

   Built on the Hormozi value equation:
     Value = (Dream Outcome x Perceived Likelihood)
             / (Time Delay x Effort & Sacrifice)
   Dream outcome   -> a house painted right, done before move-in
   Likelihood      -> owner walks every job, same crew & prep, photos
   Time delay      -> estimate in days, schedule around your deadline
   Effort          -> 60-second form, written options, nothing to manage

   HARD RULES (read before editing):
     - Every claim must be TRUE. No invented reviews, stats, job
       counts, dollar "values" or guarantees Jay hasn't agreed to.
       A made-up claim is an FTC problem and, on this domain, an
       A2P rejection risk.
     - Premium positioning: never lead with price or discounts.
       The buyer's pain is risk and hassle, not cost.
     - Reviews render only when REVIEWS has real entries.
   ============================================================ */

export const HERO = {
    eyebrow: "For homeowners in Cypress, Katy, The Woodlands & Spring",
    headline: "Get your house painted right the first time, with three written prices to choose from.",
    sub: "Jay walks your home himself, then gives you three written options: one that gets the job done, and two that look better and last longer. Same crew and same prep on every option. You pick.",
    cta: "Get My 3 Written Prices",
    ctaNote: "Free · No obligation · Takes about 60 seconds",
};

export const VSL_CAPTION = "Watch: why Jay gives every homeowner three prices";

/** Short proof points under the hero. Keep them literally true. */
export const PROOF_BAR = [
    "Owner on every walkthrough",
    "Three written options",
    "Interior & exterior",
    "Based in Houston 77095",
];

export const PROBLEM = {
    eyebrow: "The problem with most painting quotes",
    headline: "One number, take it or leave it.",
    body: [
        "Most painters hand you a single price. You can't tell what you're paying for, what's being prepped, or whether you're about to overpay.",
        "It's worse when you're on a deadline. A move-in date, a closing, or an HOA letter with fines attached. A lot of contractors see a homeowner who's cornered and quote high because they know you have to say yes.",
    ],
    turn: "Jay does it the other way around.",
};

export const OFFER = {
    eyebrow: "What you get",
    headline: "The Three-Price Estimate",
    sub: "Every free estimate includes all of this, in writing, before you commit to anything.",
    items: [
        {
            title: "An on-site walkthrough with the owner",
            body: "Jay comes out himself. Not a salesperson, not a phone quote. He looks at the surfaces, the prep, and anything that needs repair first.",
        },
        {
            title: "Three written prices",
            body: "Option one gets the job done and meets any HOA requirement. Options two and three are for a better finish and a longer life. Nothing is hidden in the fine print.",
        },
        {
            title: "Same crew, same prep, every option",
            body: "The price changes with the product and the finish you choose, not with how careful we are. Masking, protection and prep are the same on all three.",
        },
        {
            title: "A clear scope of work",
            body: "What gets painted, what gets repaired, how it's prepped and protected, and how long it takes, written down so everyone is on the same page.",
        },
        {
            title: "A start date that works around you",
            body: "Moving in, selling, or working against an HOA deadline? Tell us the date and we'll plan the job around it.",
        },
    ],
};

export const STEPS = [
    { title: "Tell us about the project", body: "Three quick questions and your contact details. About 60 seconds." },
    { title: "Jay walks the job", body: "He sees the house in person and answers your questions on the spot." },
    { title: "Pick your price", body: "You get three written options. Choose the one that fits, or none. No pressure." },
];

export const SEGMENTS = [
    {
        title: "Just bought or moving in",
        body: "An empty house is the easiest time to paint. No furniture to move, cleaner lines, and it's done before your things arrive.",
    },
    {
        title: "Getting ready to sell",
        body: "Fresh paint is one of the simplest ways to get a house ready for photos and showings. We'll work to your listing date.",
    },
    {
        title: "Older home or worn paint",
        body: "Peeling trim, faded siding, or walls that haven't been touched in years. We'll show you what needs repair before any paint goes on.",
    },
];

export const PHOTOS = [
    { src: "/img/interior-protection.webp", alt: "Vences crew member inside a home with scaffolding set up and the floors fully covered and taped", caption: "Floors covered and taped before any work starts" },
    { src: "/img/jay-samples.webp", alt: "Jay Vences next to taped sample squares on an exterior wall", caption: "Sample areas on the wall so you can see the finish first" },
    { src: "/img/walkthrough.webp", alt: "Jay Vences reviewing a written estimate with a homeowner on a balcony", caption: "Walking the homeowner through the written options" },
];

/** Real, verbatim customer reviews only. Section is hidden while empty. */
export const REVIEWS: Array<{ quote: string; name: string; area: string }> = [];

export const PROMISE = {
    eyebrow: "No-pressure promise",
    headline: "If none of the three prices feel right, you don't owe us anything.",
    body: "The estimate is free and there's no obligation. You'll get everything in writing, take your time, and decide when you're ready.",
};

export const SCARCITY =
    "Jay does every walkthrough himself, so estimate times fill up, especially around move-in and closing dates. Send your request and we'll get you on the calendar.";

export const FAQ = [
    {
        q: "Is the estimate really free?",
        a: "Yes. The walkthrough and all three written prices are free, and there's no obligation to hire us.",
    },
    {
        q: "Why three prices instead of one?",
        a: "Because homeowners want different things. Some need the job done to satisfy an HOA or get a house listed. Others want the best finish that will last the longest. Three options let you choose without guessing what you're paying for.",
    },
    {
        q: "Do I have to be home for the walkthrough?",
        a: "It helps, so Jay can go over the options with you in person. If you can't be there, let us know and we'll work something out.",
    },
    {
        q: "Can you paint before I move in?",
        a: "Yes, and it's the best time to do it. Tell us your move-in date on the form and we'll plan around it.",
    },
    {
        q: "Do you handle HOA paint requirements?",
        a: "Yes. The first of your three options is always built to meet what the HOA is asking for.",
    },
    {
        q: "What areas do you serve?",
        a: "Cypress, Katy, Spring, The Woodlands, Magnolia, Conroe and the greater Houston area.",
    },
    {
        q: "Do you do interiors, exteriors and cabinets?",
        a: "Yes. Interior and exterior painting, cabinet refinishing, trim and doors, and drywall repair before painting.",
    },
];

export const FINAL_CTA = {
    headline: "See your three prices.",
    sub: "Tell us about the project and Jay will reach out to set up your walkthrough.",
    cta: "Start My Free Estimate",
};

/* ============================================================
   Google reviews — copied VERBATIM from the Vences House Painters
   of Houston Google Business Profile on 2026-09-21.

   Rules:
     - Real reviews only, word for word. Never edit a review's text
       beyond cutting it short where Google itself shows "More".
     - RATING and COUNT must match the live profile. Re-check them
       when you update this file (last checked 2026-09-21: 4.9 / 63).
     - Deliberately left out: reviews from family members
       (Edgar Vences, Salvador Vences, lilly wences), keyword-stuffed
       reviews, and reviews that sell on "cheap" (off-brand for a
       premium painter).
     - `date` is estimated from Google's "x months ago" on the copy
       date, so the page can keep showing an accurate relative time.
     - `truncated: true` = Google cut the text off. The card shows
       "More" linking to the full review on Google.
   ============================================================ */

export const GOOGLE_PROFILE = {
    name: "Vences House Painters of Houston",
    rating: 4.9,
    count: 63,
    url: "https://www.google.com/maps?cid=5790731897876260544",
    checked: "2026-09-21",
};

export interface Review {
    name: string;
    meta: string;            // "Local Guide · 56 reviews · 5 photos"
    date: string;            // ISO, estimated from Google's relative time
    tag?: string;            // Google's chip, e.g. "Reasonable price"
    text: string;
    truncated?: boolean;
    reply?: { date: string; text: string };
}

export const REVIEWS: Review[] = [
    {
        name: "Xianmin Zhou",
        meta: "1 review · 3 photos",
        date: "2026-09-07",
        tag: "Reasonable price",
        text: "I would like to express my sincere appreciation for the painter's outstanding work. From start to finish (Photo 1: Damage of the ceiling on the Patio, before starting to the work), the painter demonstrated exceptional professionalism, skill, and attention to detail (Photo 2). The quality of the paintwork is truly impressive Every surface was smooth, even, and flawlessly finished, with no visible brush marks, drips, or uneven patches (Photo 3: The job done). It is clear that the painter takes great pride in their craft and possesses a deep understanding of surface preparation, paint selection, and application techniques.\n\nMoreover, the painter was punctual, well-organized, and respectful of the workspace. They took care to protect floors, furniture, and fixtures, and left the area clean and tidy upon completion. Communication was clear and courteous throughout the project, and any questions or concerns were addressed promptly and professionally.\n\nI would highly recommend this painter to anyone seeking high-quality, reliable, and meticulous work. Their dedication to excellence is evident in every corner of the finished result. It is rare to find such a combination of technical skill, reliability, and genuine care for the customer’s satisfaction.",
        reply: {
            date: "2026-09-07",
            text: "Thank you so much, Mr. Zhou, for your thoughtful review and for trusting Vences House Painters with your home in Cypress, Texas. It was our pleasure repairing and painting the bathroom, painting the backyard patio ceiling, and staining the front balcony. We truly appreciate your recognition of our workmanship, professionalism, and attention to detail. Thank you again for your business and recommendation!",
        },
    },
    {
        name: "Terry Browne",
        meta: "Local Guide · 56 reviews · 5 photos",
        date: "2026-05-21",
        tag: "Reasonable price",
        text: "I called Vences House Painters with an incredible challenge. I asked for a tremendous amount of work to be completed in a short window. I challenged them with high expectations and was met halfway with agreed upon terms of what quality",
        truncated: true,
        reply: {
            date: "2026-05-21",
            text: "Thank you, Terry, for the detailed five-star review and for trusting Vences House Painters with your home. We're thrilled our team delivered the attention to detail, protection, and communication you expected, and that Jay and our crew promptly handled the final touch-up. It was a pleasure coordinating with other contractors and treating your home as if it were our own. We appreciate your recommendation and look forward to working with you again.",
        },
    },
    {
        name: "Glen Maxwell",
        meta: "2 reviews",
        date: "2026-06-21",
        text: "The cabinet painting completely changed our kitchen without needing a full remodel. Before, the cabinets looked dull and worn near the handles, and now the entire room feels brighter and more updated.",
        reply: {
            date: "2026-06-21",
            text: "Thank you, Glen, for the five-star review and for choosing Vences House Painters. We're thrilled the cabinet painting refreshed your kitchen and made the room feel brighter and more updated. Our team takes pride in restoring worn areas and delivering a quality finish. We appreciate your trust in Vences House Painters and are ready to help if you decide to update other areas of your home.",
        },
    },
    {
        name: "Z N",
        meta: "8 reviews · 1 photo",
        date: "2026-01-21",
        tag: "Reasonable price",
        text: "Vences painted our custom built closet and did a fantastic job. They took additional time to remediate some of the prep work I did to make sure the job was done right. Would recommend to anyone looking for a painter.",
    },
    {
        name: "Charley Caporina",
        meta: "Local Guide · 87 reviews · 26 photos",
        date: "2025-09-21",
        text: "Did a great job for a fair price, and got it done quickly. They patched holes in the sheetrock, painted the walls, power washed, painted a patio. They got in and out in a few days. Cleaned up well. Very well managed.",
        truncated: true,
    },
    {
        name: "Albert Ramirez",
        meta: "5 reviews · 7 photos",
        date: "2026-07-21",
        text: "Whether it’s homes or businesses in Houston and surrounding areas, this company delivers dependable, high-quality painting services. I personally highlight their punctuality, clean workmanship, and reliable communication. Highly recommended",
        truncated: true,
    },
    {
        name: "Maria T",
        meta: "11 reviews",
        date: "2026-01-21",
        text: "Efficient - very quick response and delivery time. Communicated throughout the project and were easy to work with, happy with the quality of their work and results. Overall positive experience. Thank you Vences House Painters",
        truncated: true,
    },
    {
        name: "Lesly Delgado",
        meta: "1 review",
        date: "2025-09-21",
        tag: "Reasonable price",
        text: "Great Costumer Service!!!\nI recently moved into the city, I needed some areas renovated around my house. I contacted Mr.Jairo, he went in-depth , and helped me out with any questions I",
        truncated: true,
    },
    {
        name: "Eric Benitez",
        meta: "3 reviews",
        date: "2025-09-21",
        text: "I had contacted Mr. Jairo because a buddy of mine recommended me to him. I need a quote to paint the inside of my 2 story house and he was very professional and had a Mr. Salvador out the next day. He gave me a reasonable quote within my",
        truncated: true,
    },
    {
        name: "Caroline Stegeman",
        meta: "2 reviews · 1 photo",
        date: "2026-07-21",
        tag: "Great price",
        text: "This company did a very good job on my garage door paint job.",
        truncated: true,
    },
];

/** Google-style relative time: "2 weeks ago", "a month ago", "a year ago". */
export function timeAgo(iso: string, now = new Date()): string {
    const days = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 86_400_000));
    if (days < 1) return "today";
    if (days < 7) return days === 1 ? "a day ago" : `${days} days ago`;
    if (days < 30) { const w = Math.round(days / 7); return w <= 1 ? "a week ago" : `${w} weeks ago`; }
    if (days < 365) { const m = Math.round(days / 30.4); return m <= 1 ? "a month ago" : `${m} months ago`; }
    const y = Math.round(days / 365);
    return y <= 1 ? "a year ago" : `${y} years ago`;
}

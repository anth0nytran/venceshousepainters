/* ============================================================
   Single source of truth for business details.
   Everything the A2P reviewer compares (legal name, phone,
   email, address, policy URLs) is read from here, so the form,
   footer, policies and API can never drift apart.
   ============================================================ */

export const SITE_URL = "https://estimate.venceshousepainterstx.com";

// No LLC / Inc / Company here unless it is on the registration.
// A corporate identifier that doesn't match the A2P brand is a rejection.
export const LEGAL_NAME = "Vences House Painters";
export const OWNER = "Jairo \"Jay\" Vences";

export const PHONE_DISPLAY = "(832) 948-8629";
export const PHONE_TEL = "+18329488629";
export const EMAIL = "jairo_vences@yahoo.com";

export const ADDRESS = {
    street: "9742 Whithorn Dr, Suite A",
    city: "Houston",
    state: "TX",
    zip: "77095",
};

/** Shown in the footer so the site clearly says what the business does
 *  (an A2P reviewer checks for this). */
export const SERVICES_LINE = "Interior and exterior painting, cabinet refinishing, trim and doors, and drywall repair.";

export const SERVICE_AREA = "Cypress, Katy, Spring, The Woodlands, Magnolia, Conroe and the greater Houston area";

export const PRIVACY_PATH = "/privacy-policy";
export const TERMS_PATH = "/terms";

export const POLICY_EFFECTIVE = "September 21, 2026";

/**
 * The exact disclosure shown next to the SMS checkbox. It is also sent with
 * every submission as proof of what the person agreed to, and quoted word
 * for word in the Privacy Policy. Non-marketing only: no promotional texts.
 */
export const CONSENT_TEXT =
    `I consent to receive non-marketing text messages from ${LEGAL_NAME}. Message frequency may vary (approximately 2-6 messages per month) and may include estimate follow-ups, appointment reminders, project updates, missed call text-backs, after-hours auto-replies, and one-time review requests. Message & data rates may apply. Text HELP for assistance. You may reply STOP to unsubscribe at any time. Consent is not a condition of purchase. Your information will not be shared with third parties.`;

/**
 * Video sales letter. Drop the finished horizontal (16:9) edit into
 * public/vsl.mp4 and set VSL_SRC to "/vsl.mp4". While it's empty the
 * headline picture (the team shot) shows on its own, so the page never
 * looks unfinished to a visitor or an A2P reviewer. Once the video is
 * set, the same picture becomes its poster with a play button.
 */
export const VSL_SRC = "";
export const VSL_POSTER = "/img/team.webp";

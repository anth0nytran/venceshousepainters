# A2P 10DLC Registration — VENCES HOUSE PAINTERS

Opt-in method: website form only. **Non-marketing messages only — no promotional SMS.**
Prepared 21 September 2026 · QuickLaunchWeb

---

## ⚠️ Decide the brand lane before submitting

| If Jay has… | Lane | Legal name field |
|---|---|---|
| An **EIN** + a registered entity | Standard brand | Exactly as on the IRS EIN letter |
| **No EIN** (SSN or ITIN) | **Sole Proprietor** | `Vences House Painters` — **no** LLC / Inc / Company |

The site currently says **"Vences House Painters"** with no corporate identifier, which is
correct for the sole-prop lane. If he registers as a standard brand under an entity like
"Vences House Painters LLC", update `LEGAL_NAME` in `src/lib/site.ts` **and redeploy
before submitting**. The consent text, policies and footer all read from that one
constant, and the reviewer compares them to the registration. (Tex-Mex was rejected with
error 30915 for exactly this mismatch.)

---

## URLs

```
Website / Opt-in Form URL:  https://estimate.venceshousepainterstx.com
Privacy Policy:             https://estimate.venceshousepainterstx.com/privacy-policy
Terms:                      https://estimate.venceshousepainterstx.com/terms
Opt-in Image URL:           https://estimate.venceshousepainterstx.com/a2p/opt-in-form.png
```

The opt-in image is a screenshot of the live form on the phone step: optional phone
field, the unchecked consent box with its full disclosure and policy links, and the
separate 18+ box. Paste it into GHL's "Opt-in image / proof of consent" field (lesson
from the Solivance submission).

## Readiness

| # | Item | State |
|---|---|---|
| 1 | Subdomain live over HTTPS | ⚠️ deploy + DNS still needed |
| 2 | `/`, `/privacy-policy`, `/terms` load | ✅ built and prerendered to static HTML |
| 3 | Phone field optional, no asterisk | ✅ |
| 4 | SMS checkbox unchecked, names the business | ✅ |
| 5 | Consent visible on arrival (below the form, every step) | ✅ |
| 6 | Consent is non-marketing, matches this doc word for word | ✅ |
| 7 | Separate required 18+ checkbox | ✅ |
| 8 | Policies linked inside checkbox label + footer | ✅ |
| 9 | Privacy: opt-in data exclusion clause | ✅ |
| 10 | Privacy + Terms: carrier liability disclaimer | ✅ |
| 11 | Opt-in proof stored on submit | ✅ timestamp, URL, phone, checkbox, consent text, IP |
| 12 | No GoHighLevel-branded links | ✅ |
| 13 | Support email confirmed | ✅ jairo_vences@yahoo.com (confirmed by Anthony 2026-09-21; GHL profile still has the "jario" typo) |
| 14 | Contact phone | ✅ (832) 979-8127, the GHL/CRM number (the only number in the sub-account) and the one being registered, so calls and texts from this page land in the CRM. The Google listing keeps (832) 789-6922 for Google leads; that difference is fine for A2P |
| 15 | Services clearly described on the site | ✅ footer services line + Terms "Our Services" |
| 16 | CTIA third-party statement (the JN 30896 fix) | ✅ verbatim in Privacy Policy |
| 17 | Opt-in method stated as website-form-only | ✅ Privacy + Terms |
| 18 | Phone field points to the consent box | ✅ "Want text updates? Check the text message box below the form. It's optional." |
| 19 | Policy URLs serve their own static HTML (no JS needed) | ✅ explicit Vercel rewrites to `/privacy-policy/index.html` and `/terms/index.html` |
| 20 | Opt-in screenshot hosted | ✅ `/a2p/opt-in-form.png` |

---

## Business Information

```
Legal / Business Name:  Vences House Painters        (see lane table above)
Website:                https://estimate.venceshousepainterstx.com
Industry:               CONSTRUCTION
Vertical:               Home Services — Residential & Commercial Painting
Region:                 USA
Street:                 9742 Whithorn Dr, Suite A
City / State / ZIP:     Houston, TX 77095
Contact:                Jairo Vences, Owner
```

---

## Use Case Description

```
Vences House Painters is a residential and commercial painting contractor based in Houston, Texas (77095), serving Cypress, Katy, Spring, The Woodlands, Magnolia, Conroe and the greater Houston area. Services are interior and exterior painting, cabinet refinishing, trim and door painting, and drywall repair. When a homeowner submits the estimate request form at https://estimate.venceshousepainterstx.com, they may opt in to SMS by actively checking an unchecked consent checkbox. The phone number field is optional and SMS consent is not a condition of submitting the form, of purchase, or of receiving service. All messages are non-marketing, service-related messages only: confirmation that an estimate request was received, appointment scheduling and reminders for the on-site estimate and the painting work, project status updates during an active job, missed-call text-backs, after-hours auto-replies, and a single review request after a completed job. No promotional or marketing messages are sent. Message frequency varies, approximately 2-6 messages per month. Customers can reply STOP at any time to opt out and HELP for assistance. Proof of opt-in (timestamp, source page URL, phone number, checkbox state, IP address and the exact consent disclosure displayed) is captured and retained on every submission.
```

## How do Contacts Opt-in to Messages?

```
Contacts opt in by submitting the estimate request form at https://estimate.venceshousepainterstx.com. The SMS consent checkbox and its full disclosure are displayed directly below the form card, visible on arrival and on every step of the form. The phone number field is optional and has no required attribute or asterisk. The SMS consent checkbox is NOT pre-checked; the user must actively check it. Consent is voluntary and is not required to submit the form or to receive service. A separate, required, unchecked "I am 18 or older. (Required)" checkbox appears directly below it. The disclosure reads exactly: "I consent to receive non-marketing text messages from Vences House Painters. Message frequency may vary (approximately 2-6 messages per month) and may include estimate follow-ups, appointment reminders, project updates, missed call text-backs, after-hours auto-replies, and one-time review requests. Message & data rates may apply. Text HELP for assistance. You may reply STOP to unsubscribe at any time. Consent is not a condition of purchase. Your information will not be shared with third parties. Privacy Policy & Terms." The words "Privacy Policy" (https://estimate.venceshousepainterstx.com/privacy-policy) and "Terms" (https://estimate.venceshousepainterstx.com/terms) are clickable links inside the checkbox label, and both pages are also linked in the site footer. Proof of opt-in is captured on every submission: timestamp, source page URL, phone number, checkbox state, IP address and the exact consent text displayed. No mobile opt-in data or SMS consent data is shared, sold, rented or transferred to third parties or affiliates for marketing or promotional purposes.
```

---

## Privacy / Third-Party Statement (paste if GHL asks)

```
No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties, excluding aggregators and providers of the Text Message services.
```

---

## Sample Messages (both transactional — no promotional sample on this campaign)

**Sample 1**
```
Vences House Painters: Hi Maria, we received your estimate request for exterior painting. Jay will call you today to set up a time to see the house. Reply STOP to opt out, HELP for help.
```

**Sample 2**
```
Vences House Painters: Reminder, Jay will be at your home tomorrow between 9:00am and 10:00am for your painting estimate. Reply here to reschedule. Msg & data rates may apply. Reply STOP to opt out.
```

## Opt-in Confirmation
```
Vences House Painters: You're opted in to receive messages about your estimate, appointments and project updates. Msg frequency varies (approx 2-6/month). Msg & data rates may apply. Reply HELP for help, STOP to unsubscribe.
```

## Keyword Responses

**HELP**
```
Vences House Painters: For help call (832) 979-8127 or email jairo_vences@yahoo.com. Msg & data rates may apply. Reply STOP to unsubscribe.
```
**STOP**
```
Vences House Painters: You have been unsubscribed and will receive no further messages. Reply START to resubscribe.
```
**START**
```
Vences House Painters: You're resubscribed. Msg frequency varies (approx 2-6/month). Msg & data rates may apply. Reply HELP for help, STOP to unsubscribe.
```

---

## Keep the campaign honest

The campaign is registered as **non-marketing**. Once approved, GHL workflows on this
number must not send promotions (seasonal offers, discounts, "book now and save"). The
current custom-value SMS copy (instant reply, missed-call, follow-ups, review request) is
all service messaging and fits. If Jay later wants promotional texts, that needs a
consent-text change, a redeploy, and a new or updated campaign first.

The landing page itself is promotional web copy. That's fine: the SMS consent and the
campaign cover the text messages, not the web page.

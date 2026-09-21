# Vences House Painters — estimate subdomain

`estimate.venceshousepainterstx.com`. Three public pages: the estimate landing page (VSL +
form), `/privacy-policy` and `/terms`. React + Vite + Tailwind, Resend emails, GoHighLevel
push. Adapted from the South Coast site.

## Edit here

| What | File |
|---|---|
| Business name, phone, email, address, consent text, VSL video | `src/lib/site.ts` |
| Landing page copy (headline, offer, FAQ, reviews) | `src/lib/landing.ts` |
| Form questions and their GHL dropdown values | `src/lib/estimate.ts` |

The consent text, policies, footer and API all read from `site.ts`, so the A2P-reviewed
details can't drift apart. Change them there and redeploy.

## Run

```
npm install
npm run dev          # UI only
npm run dev:vercel   # UI + /api/send (needs .env)
npm run build        # type-check, build, prerender all 3 pages to static HTML
```

## Deploy (Vercel)

1. New Vercel project from this folder. Framework preset: Vite.
2. Environment variables from `.env.example`: `RESEND_API_KEY`, `LEAD_TO_EMAIL`,
   `ALLOWED_ORIGINS`, `GHL_API_KEY`, `GHL_LOCATION_ID` (+ optional pipeline IDs).
3. Add domain `estimate.venceshousepainterstx.com`, then a CNAME `estimate` →
   `cname.vercel-dns.com` at the DNS host.

## Leads

Each submission: lead email to `LEAD_TO_EMAIL` (cc support@quicklaunchweb.us), receipt
email to the customer, and a GHL contact upsert tagged `website-form` (the WEBSITE ONLY
workflow trigger) with `service_needed`, `project_type`, `timeline`, `project_address`,
consent proof and UTMs filled in. GHL failures never block the email.

A2P submission copy: `a2p/VENCES_A2P_SUBMISSION.md`. VSL shooting script: `a2p/VSL_SCRIPT.md`.

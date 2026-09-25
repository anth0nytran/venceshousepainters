/* The business details live in api/_site.ts so the serverless function can
   read them without importing across the api/ boundary — Vercel only bundles
   files inside api/ into a function, and reaching outside it crashed every
   submission. The app keeps importing "@/lib/site" as before. */
export * from "../../api/_site";

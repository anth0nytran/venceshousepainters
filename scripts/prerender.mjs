/* ============================================================
   Post-build prerender.

   A carrier reviewer (and any crawler that doesn't run JS) must
   see the real consent checkbox and the full policy text in the
   HTML itself, not an empty <div id="root">. This writes one
   static HTML file per public route:

     dist/index.html                 -> /
     dist/privacy-policy/index.html  -> /privacy-policy
     dist/terms/index.html           -> /terms

   Vercel serves files before applying rewrites, so each path gets
   its own prerendered page; the client then hydrates it.
   ============================================================ */

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SSR = path.join(ROOT, "dist-ssr");
const SITE_URL = "https://estimate.venceshousepainterstx.com";

const ROUTES = [
    {
        url: "/",
        out: "index.html",
        title: "Request a Painting Estimate | Vences House Painters",
        description: "Request a painting estimate from Vences House Painters in Houston, Texas. Interior and exterior painting for homes in Cypress, Katy, Spring, The Woodlands and the greater Houston area.",
    },
    {
        url: "/privacy-policy",
        out: "privacy-policy/index.html",
        title: "Privacy Policy | Vences House Painters",
        description: "Privacy Policy for Vences House Painters, including how we collect and use your information and our SMS text messaging policy.",
    },
    {
        url: "/terms",
        out: "terms/index.html",
        title: "Terms of Service | Vences House Painters",
        description: "Terms of Service for Vences House Painters, including our SMS messaging program terms and estimates policy.",
    },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const { render } = await import(pathToFileURL(path.join(SSR, "entry-server.js")).href);
const template = await readFile(path.join(DIST, "index.html"), "utf8");

for (const r of ROUTES) {
    const appHtml = render(r.url);
    const canonical = `${SITE_URL}${r.url === "/" ? "/" : r.url}`;
    const html = template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
        .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(r.description)}" />`)
        .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
        .replace("<!--app-html-->", appHtml);

    if (!html.includes(appHtml) || appHtml.length < 500) {
        throw new Error(`Prerender produced no markup for ${r.url}`);
    }

    const file = path.join(DIST, r.out);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
    console.log(`prerendered ${r.url.padEnd(16)} -> dist/${r.out} (${(html.length / 1024).toFixed(1)} KB)`);
}

await rm(SSR, { recursive: true, force: true });

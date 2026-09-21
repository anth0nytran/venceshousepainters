import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

/** Used only by scripts/prerender.mjs at build time. */
export function render(url: string): string {
    return renderToString(
        <StrictMode>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </StrictMode>
    );
}

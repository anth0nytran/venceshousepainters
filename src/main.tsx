import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { captureAttribution } from "@/lib/attribution";

captureAttribution();

const root = document.getElementById("root")!;
const app = (
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);

// Prerendered pages already carry the markup; hydrate them. `vite dev`
// serves an empty root, so render from scratch there.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

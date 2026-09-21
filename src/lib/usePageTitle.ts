import { useEffect } from "react";

/** Keeps the tab title right on client-side navigation. The prerender
 *  script bakes the same titles into each page's static HTML. */
export function usePageTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

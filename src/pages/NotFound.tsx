import { Link } from "react-router-dom";
import { usePageTitle } from "@/lib/usePageTitle";

export default function NotFound() {
    usePageTitle("Page not found | Vences House Painters");

    return (
        <div className="wrap max-w-xl py-24 text-center">
            <h1 className="mb-3 text-4xl">Page not found</h1>
            <p className="mb-8 text-slate">That page doesn't exist.</p>
            <Link to="/" className="btn btn-primary">Request an Estimate</Link>
        </div>
    );
}

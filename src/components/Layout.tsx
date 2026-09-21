import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import {
    ADDRESS, EMAIL, LEGAL_NAME, PHONE_DISPLAY, PHONE_TEL, PRIVACY_PATH, TERMS_PATH,
} from "@/lib/site";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-ink text-white">
                <div className="wrap flex h-[64px] items-center justify-between gap-4 sm:h-[72px]">
                    <Link to="/" className="flex items-center gap-2.5" aria-label={`${LEGAL_NAME} home`}>
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-lg font-black text-white">V</span>
                        <span className="text-[15px] font-bold uppercase tracking-wide sm:text-[17px]">Vences House Painters</span>
                    </Link>
                    <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white hover:bg-brand-dark">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
                        <span className="sm:hidden">Call</span>
                    </a>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-line bg-[#F5F6F8]">
                <div className="wrap grid gap-6 py-10 text-[14px] text-slate sm:grid-cols-2">
                    <div>
                        <p className="font-semibold text-ink">{LEGAL_NAME}</p>
                        <p>{ADDRESS.street}</p>
                        <p>{ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}</p>
                        <p className="mt-2">
                            <a href={`tel:${PHONE_TEL}`} className="hover:text-ink">{PHONE_DISPLAY}</a>
                            {" · "}
                            <a href={`mailto:${EMAIL}`} className="hover:text-ink">{EMAIL}</a>
                        </p>
                    </div>
                    <nav aria-label="Legal" className="flex flex-col gap-2 sm:items-end">
                        <Link to="/" className="hover:text-ink">Request an Estimate</Link>
                        <Link to={PRIVACY_PATH} className="hover:text-ink">Privacy Policy</Link>
                        <Link to={TERMS_PATH} className="hover:text-ink">Terms of Service</Link>
                    </nav>
                    <p className="text-[12px] sm:col-span-2">
                        © {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

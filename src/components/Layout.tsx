import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import {
    ADDRESS, DBA_LINE, EMAIL, BRAND_NAME, LEGAL_ENTITY, PHONE_DISPLAY, PHONE_TEL, PRIVACY_PATH, SERVICE_AREA, SERVICES_LINE, TERMS_PATH,
} from "@/lib/site";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-ink text-white">
                <div className="wrap flex h-[64px] items-center justify-between gap-4 sm:h-[72px]">
                    <Link to="/" className="flex items-center gap-2.5" aria-label={`${BRAND_NAME} home`}>
                        <img src="/img/logo-mark.webp" alt="" width={160} height={125} className="h-9 w-auto sm:h-10" />
                        <img src="/img/logo-word.webp" alt={BRAND_NAME} width={520} height={113} className="h-7 w-auto sm:h-8" />
                    </Link>
                    <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white hover:bg-brand-dark">
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
                        <span className="sm:hidden">Call</span>
                    </a>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="bg-ink text-white/75">
                <div className="wrap grid gap-8 py-10 text-[14px] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <img src="/img/logo-lockup.webp" alt={BRAND_NAME} width={640} height={586} loading="lazy" className="h-24 w-auto" />
                    <div>
                        <p className="font-semibold text-white">{BRAND_NAME}</p>
                        <p className="text-white/60">{DBA_LINE}.</p>
                        <p className="mb-2 max-w-md text-white/60">{SERVICES_LINE} Serving {SERVICE_AREA}.</p>
                        <p>{ADDRESS.street}</p>
                        <p>{ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}</p>
                        <p className="mt-2">
                            <a href={`tel:${PHONE_TEL}`} className="inline-block py-1.5 hover:text-white">{PHONE_DISPLAY}</a>
                            <span aria-hidden="true"> | </span>
                            <a href={`mailto:${EMAIL}`} className="inline-block break-all py-1.5 hover:text-white">{EMAIL}</a>
                        </p>
                    </div>
                    <nav aria-label="Legal" className="flex flex-col sm:items-end">
                        <Link to="/" className="py-2 hover:text-white">Request an Estimate</Link>
                        <Link to={PRIVACY_PATH} className="py-2 hover:text-white">Privacy Policy</Link>
                        <Link to={TERMS_PATH} className="py-2 hover:text-white">Terms of Service</Link>
                    </nav>
                    <p className="text-[12px] text-white/50 sm:col-span-3">
                        © {new Date().getFullYear()} {BRAND_NAME}, operated by {LEGAL_ENTITY}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

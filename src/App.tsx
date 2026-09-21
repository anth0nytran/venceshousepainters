import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Estimate from "./pages/Estimate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { PRIVACY_PATH, TERMS_PATH } from "@/lib/site";

// Three public pages only: the estimate form and the two policies
// the A2P reviewer opens. Pages are imported eagerly so the build
// can prerender each one to static HTML.
export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Estimate />} />
                <Route path={PRIVACY_PATH} element={<PrivacyPolicy />} />
                <Route path={TERMS_PATH} element={<Terms />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    );
}

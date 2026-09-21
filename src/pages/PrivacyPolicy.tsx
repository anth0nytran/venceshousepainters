import { Link } from "react-router-dom";
import { ContactBlock, Label, LegalPage, Section } from "@/components/Legal";
import { CONSENT_TEXT, EMAIL, LEGAL_NAME, SITE_URL, TERMS_PATH } from "@/lib/site";
import { usePageTitle } from "@/lib/usePageTitle";

const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

export default function PrivacyPolicy() {
    usePageTitle(`Privacy Policy | ${LEGAL_NAME}`);

    return (
        <LegalPage title="Privacy Policy">
            <Section title="Overview">
                <p>{LEGAL_NAME} ("we," "us," or "our") respects your privacy. This policy explains what information we collect through {DOMAIN}, how we use it, and the choices you have. By using this website or contacting us, you agree to this policy.</p>
            </Section>

            <Section title="Information We Collect">
                <p>We collect the information you provide directly through our estimate request form: your name, email address, phone number (optional), project address, details about your project, and any message you send. We also collect limited technical information, such as the page you submitted the form from and how you arrived at our site, to operate and improve the site.</p>
            </Section>

            <Section title="How We Use Your Information">
                <p>We use your information to respond to your estimate request, schedule and provide estimates and painting services, send confirmations and follow-ups about your project, and communicate with you as a customer. We do not use your information to send promotional or marketing text messages.</p>
            </Section>

            <Section title="SMS / Text Messaging">
                <p><Label>Platform Operator Disclosure:</Label> {LEGAL_NAME} uses QuickLaunchWeb as its platform operator for all SMS/text messaging. QuickLaunchWeb is the sole sender of all SMS messages. Phone numbers used for messaging are owned, registered, and operated by QuickLaunchWeb. {LEGAL_NAME} does not independently send text messages. QuickLaunchWeb sends all messages on its behalf.</p>
                <p><Label>Message Types:</Label> All SMS messages sent through our website are service-related, non-marketing messages only. Messages include estimate request confirmations, appointment scheduling and reminders, project updates, missed call text-backs, after-hours auto-replies, and one-time review requests after a completed service. We do not send promotional or marketing text messages.</p>
                <p><Label>How You Opt In:</Label> Our estimate request form includes an optional phone number field and an SMS consent checkbox that is not pre-checked. You must actively check the box to opt in. The checkbox reads:</p>
                <p className="border-l-2 border-brand/40 pl-4 italic">"{CONSENT_TEXT} Privacy Policy &amp; Terms."</p>
                <p>Consent is voluntary and is not required to submit the form, to make a purchase, or to receive service. We capture and store proof of opt-in, including the timestamp, the source page URL, your phone number, the checkbox state, and the exact consent text shown.</p>
                <p><Label>Message Frequency:</Label> Message frequency varies based on your project, approximately 2-6 messages per month.</p>
                <p><Label>Message and Data Rates:</Label> Standard message and data rates from your mobile carrier may apply. We are not responsible for carrier charges. Major US carriers are supported, including AT&amp;T, T-Mobile, and Verizon.</p>
                <p><Label>Opt-Out:</Label> Reply <Label>STOP</Label> to any message to unsubscribe immediately. You will receive a one-time confirmation and no further messages will be sent. To re-subscribe, reply <Label>START</Label>.</p>
                <p><Label>Help:</Label> Reply <Label>HELP</Label> to any message for assistance, or email <a href={`mailto:${EMAIL}`} className="text-brand hover:underline">{EMAIL}</a>.</p>
                <p><Label>SMS Data and Privacy:</Label> We do not sell, rent, or share your mobile phone number or SMS consent data with any third parties or affiliates for marketing or promotional purposes. SMS consent and opt-in data is used solely to send the service messages described in this section. Opt-in records (timestamp, source URL, phone number, consent state) are retained for compliance purposes.</p>
                <p>All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties, excluding aggregators and providers of the Text Message services.</p>
                <p>Carriers are not liable for delayed or undelivered messages.</p>
            </Section>

            <Section title="Cookies & Analytics">
                <p>We store basic visit information in your browser (such as the page you first arrived on and any campaign link you used) so we can understand how people find us. You can clear this at any time through your browser settings.</p>
            </Section>

            <Section title="How We Share Information">
                <p>We do not sell your personal information. We share information only with service providers that help us operate, such as our customer management and messaging platform, email delivery provider, and website host, and only as needed to provide our services, or when required by law. Mobile opt-in and SMS consent data is never shared with third parties for marketing.</p>
            </Section>

            <Section title="Data Retention & Security">
                <p>We keep your information for as long as needed to provide our services and meet legal obligations, then delete or anonymize it. We use reasonable administrative and technical safeguards to protect your information, though no method of transmission over the internet is completely secure.</p>
            </Section>

            <Section title="Your Choices">
                <p>You may request access to, correction of, or deletion of your personal information at any time, and you may stop text messages at any time by replying STOP. To make a request, email <a href={`mailto:${EMAIL}`} className="text-brand hover:underline">{EMAIL}</a>.</p>
            </Section>

            <Section title="Children's Privacy">
                <p>Our website and services are intended for adults 18 and older. We do not knowingly collect information from anyone under 18.</p>
            </Section>

            <Section title="Changes to This Policy">
                <p>We may update this policy from time to time. Changes are reflected by updating the effective date above. See also our <Link to={TERMS_PATH} className="text-brand hover:underline">Terms of Service</Link>.</p>
            </Section>

            <Section title="Contact">
                <ContactBlock />
            </Section>
        </LegalPage>
    );
}

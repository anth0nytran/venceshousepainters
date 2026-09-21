import { Link } from "react-router-dom";
import { ContactBlock, Label, LegalPage, Section } from "@/components/Legal";
import { EMAIL, LEGAL_NAME, PRIVACY_PATH, SITE_URL } from "@/lib/site";
import { usePageTitle } from "@/lib/usePageTitle";

const DOMAIN = SITE_URL.replace(/^https?:\/\//, "");

export default function Terms() {
    usePageTitle(`Terms of Service | ${LEGAL_NAME}`);

    return (
        <LegalPage title="Terms of Service">
            <Section title="Acceptance of Terms">
                <p>By accessing {DOMAIN} or engaging {LEGAL_NAME}, you agree to these Terms of Service and our <Link to={PRIVACY_PATH} className="text-brand hover:underline">Privacy Policy</Link>. If you do not agree, please do not use the site.</p>
            </Section>

            <Section title="Eligibility & Age Restriction">
                <p>You must be at least <Label>18 years of age</Label> to use this website, submit any form, opt in to receive SMS messages from us, or otherwise engage our services. By using the site or submitting a form, you represent that you are 18 years of age or older. We do not knowingly collect information from, send SMS messages to, or contract with anyone under 18. Our estimate request form includes a required confirmation that the submitter is at least 18.</p>
            </Section>

            <Section title="Our Services">
                <p>{LEGAL_NAME} provides residential and commercial painting services in the Houston, Texas area, including interior painting, exterior painting, cabinet refinishing, trim and door painting, and drywall repair. Descriptions on this site are general information and do not constitute a binding offer.</p>
            </Section>

            <Section title="Estimates">
                <p>Estimates are free and carry no obligation. Any pricing discussed before we see the project in person is an estimate only. Final scope, materials, schedule, and pricing are confirmed in a written proposal agreed to by both parties.</p>
            </Section>

            <Section title="SMS / Text Messaging Terms">
                <p><Label>Platform Operator:</Label> {LEGAL_NAME} uses QuickLaunchWeb as its platform operator for all SMS communications. QuickLaunchWeb sends all text messages on behalf of {LEGAL_NAME}. All phone numbers used for messaging are owned and operated by QuickLaunchWeb under a single brand registration.</p>
                <p><Label>Program Name:</Label> {`${LEGAL_NAME} SMS Program`}</p>
                <p><Label>How to Opt In:</Label> Website form only. You opt in by checking the unchecked SMS consent box on our estimate request form. The phone number field is optional, and consent is not required to request an estimate or to buy any service. You must be 18 or older to opt in.</p>
                <p><Label>Program Description:</Label> When you submit an estimate request on our website and opt in to SMS by checking the consent checkbox, you may receive the following types of service-related, non-marketing text messages:</p>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Estimate request confirmations</li>
                    <li>Appointment scheduling, reminders, and follow-ups</li>
                    <li>Project updates while work is underway</li>
                    <li>Missed call text-back notifications</li>
                    <li>After-hours auto-reply messages</li>
                    <li>A one-time review request after a completed service</li>
                </ul>
                <p>We do not send promotional or marketing text messages. Message frequency varies, approximately 2-6 messages per month.</p>
                <p>You can cancel the SMS service at any time. Simply text <Label>STOP</Label> to the number you received messages from. Upon sending "STOP," we will confirm your unsubscribe status via SMS. Following this confirmation, you will no longer receive SMS messages from us. To rejoin, reply <Label>START</Label> or sign up as you did initially, and we will resume sending SMS messages to you.</p>
                <p>If you experience issues with the messaging program, reply with the keyword <Label>HELP</Label> for more assistance, or reach out directly to <a href={`mailto:${EMAIL}`} className="text-brand hover:underline">{EMAIL}</a>.</p>
                <p>Carriers are not liable for delayed or undelivered messages.</p>
                <p>As always, message and data rates may apply for messages sent to you from us and to us from you. For questions about your text plan or data plan, contact your wireless provider.</p>
                <p>Consent to receive text messages is not a condition of any purchase or service. For privacy-related inquiries, please refer to our <Link to={PRIVACY_PATH} className="text-brand hover:underline">Privacy Policy</Link>.</p>
            </Section>

            <Section title="Use of the Website">
                <p>You agree to use the site lawfully and not to interfere with its operation or attempt unauthorized access. All content and branding on this site belong to {LEGAL_NAME} or its licensors and may not be reproduced without permission.</p>
            </Section>

            <Section title="Disclaimers & Limitation of Liability">
                <p>The site is provided "as is" without warranties of any kind. To the fullest extent permitted by law, {LEGAL_NAME} is not liable for indirect or incidental damages arising from your use of the site. Nothing here limits the warranties or obligations stated in a signed project agreement.</p>
            </Section>

            <Section title="Governing Law">
                <p>These terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles.</p>
            </Section>

            <Section title="Changes to These Terms">
                <p>We may update these Terms of Service from time to time. Changes are reflected by updating the effective date at the top of this page. Your continued use of the site after changes are posted means you accept the updated terms.</p>
            </Section>

            <Section title="Contact">
                <ContactBlock />
            </Section>
        </LegalPage>
    );
}

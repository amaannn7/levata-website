import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "How Levata collects, uses, and protects your personal information.",
    openGraph: { url: "https://levatahq.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Privacy Policy" lastUpdated="3 July 2026">
            <p>
                This Privacy Policy explains how Levata, a brand of Unknwn Global Pvt Ltd, collects, uses,
                discloses, and safeguards information when you visit levatahq.com (the &ldquo;Site&rdquo;) or
                otherwise engage with Levata&rsquo;s services. By using the Site, you agree to the collection and
                use of information as described in this policy. If you do not agree, please do not use the Site.
            </p>

            <h2>1. Information Collected</h2>
            <p>Levata collects the following categories of information:</p>
            <ul>
                <li>
                    <strong>Information you provide directly:</strong> name, email address, company name, phone
                    number, project details, and any files or documents uploaded when submitting the contact form,
                    requesting a strategy call, or otherwise communicating with Levata.
                </li>
                <li>
                    <strong>Booking information:</strong> when a call is scheduled, Levata&rsquo;s scheduling
                    provider collects and processes information such as name, email, and selected time slot.
                </li>
                <li>
                    <strong>Automatically collected information:</strong> IP address, browser type, device
                    information, pages visited, and general usage data, collected through standard web
                    technologies.
                </li>
                <li>
                    <strong>Anti-spam verification data:</strong> when the contact form is submitted, an automated
                    verification check analyses the interaction with the Site to help distinguish legitimate
                    submissions from spam or abuse.
                </li>
            </ul>

            <h2>2. How Information Is Used</h2>
            <p>Levata uses the information collected to:</p>
            <ul>
                <li>Respond to enquiries, project briefs, and requests for strategy calls;</li>
                <li>Deliver, operate, and improve its services and the Site;</li>
                <li>Communicate about a project, its services, or an account;</li>
                <li>Detect, prevent, and address spam, fraud, or security issues; and</li>
                <li>Comply with applicable legal obligations.</li>
            </ul>
            <p>
                Levata works with a small number of trusted service providers (such as email delivery, scheduling,
                and spam-prevention providers) who process information strictly on Levata&rsquo;s behalf to help
                operate the Site and respond to enquiries. Levata does not sell personal information to third
                parties.
            </p>

            <h2>3. Data Retention</h2>
            <p>
                Personal information is retained for as long as necessary to fulfil the purposes described in this
                policy, including to maintain business records, respond to enquiries, and comply with legal
                obligations. When information is no longer needed, reasonable steps are taken to delete or
                anonymise it.
            </p>

            <h2>4. Data Security</h2>
            <p>
                Levata implements reasonable technical and organisational measures designed to protect information
                against unauthorised access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet or electronic storage is completely secure, and absolute security
                cannot be guaranteed.
            </p>

            <h2>5. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
                <li>Request access to the personal information held about you;</li>
                <li>Request correction of inaccurate or incomplete information;</li>
                <li>Request deletion of your personal information;</li>
                <li>Object to or restrict certain processing of your information; and</li>
                <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
                To exercise any of these rights, contact Levata using the details in Section 8 below.
            </p>

            <h2>6. Children&rsquo;s Privacy</h2>
            <p>
                The Site is not directed at children under the age of 16, and Levata does not knowingly collect
                personal information from children.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
                This Privacy Policy may be updated from time to time. Any changes will be posted on this page with
                a revised &ldquo;Last updated&rdquo; date. Continued use of the Site after changes are posted
                constitutes acceptance of the updated policy.
            </p>

            <h2>8. Contact</h2>
            <div className="legal-contact-card">
                <p>
                    Questions about this Privacy Policy or how information is handled can be directed to{" "}
                    <a href="mailto:hello@levatahq.com">hello@levatahq.com</a>, or in writing to:
                </p>
                <p>
                    Unknwn Global Pvt Ltd (trading as Levata)
                    <br />
                    21A, 17th Lane, Colombo 03, Sri Lanka
                </p>
            </div>
        </LegalPageLayout>
    );
}

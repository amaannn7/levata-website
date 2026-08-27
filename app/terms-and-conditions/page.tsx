import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Terms and Conditions",
    description: "The terms and conditions governing use of the Levata website and services.",
    openGraph: { url: "https://levatahq.com/terms-and-conditions" },
};

export default function TermsPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Terms and Conditions" lastUpdated="3 July 2026">
            <p>
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern access to and use of levatahq.com (the
                &ldquo;Site&rdquo;) and the services offered by Levata, a brand operated by Unknwn Global Pvt Ltd, a
                company registered in Sri Lanka with its registered address at 21A, 17th Lane, Colombo 03, Sri
                Lanka (&ldquo;Levata&rdquo;).
            </p>
            <p>
                By accessing the Site, submitting an enquiry, booking a call, or entering into an engagement with
                Levata, you agree to be bound by these Terms. If you do not agree, please do not use the Site or
                Levata&rsquo;s services.
            </p>

            <h2>1. Services</h2>
            <p>
                Levata provides AI systems, automation, product engineering, and digital infrastructure services,
                delivered either as (a) bespoke, project-based consulting and development engagements
                (&ldquo;Services&rdquo;), or (b) access to software products, including the Sales Intelligence
                Platform, made available on a subscription basis (&ldquo;Products&rdquo;). Specific scope,
                deliverables, timelines, and fees for any engagement are set out in a separate proposal, statement
                of work, or order form agreed in writing between the client and Levata (an &ldquo;Order&rdquo;),
                which forms part of these Terms.
            </p>

            <h2>2. Use of the Site</h2>
            <p>Use of the Site is permitted only for lawful purposes. Users agree not to:</p>
            <ul>
                <li>Attempt to gain unauthorised access to any part of the Site or its underlying systems;</li>
                <li>Submit false, misleading, or fraudulent information through the contact or booking forms;</li>
                <li>Use automated means to scrape, spam, or interfere with the Site&rsquo;s normal operation; or</li>
                <li>Upload content through the Site that is unlawful, harmful, or infringes the rights of any third party.</li>
            </ul>

            <h2>3. Proposals, Quotes, and Engagements</h2>
            <p>
                Any proposal, quote, or estimate provided by Levata is valid for the period stated in that document
                and does not constitute a binding offer until confirmed in a signed Order. Project scope,
                deliverables, pricing, and timelines are governed by the applicable Order, and these Terms apply
                to the extent they are not inconsistent with it.
            </p>

            <h2>4. Fees and Payment</h2>
            <p>
                Fees for Services and Products are set out in the applicable Order or on the relevant Product
                page. Unless otherwise agreed in writing:
            </p>
            <ul>
                <li>Project-based Services are invoiced according to the milestone or payment schedule in the Order;</li>
                <li>Subscription Products are billed in advance on a recurring basis until cancelled; and</li>
                <li>Invoices are due within 14 days of the invoice date, and late payments may result in suspension of Services or access to Products.</li>
            </ul>
            <p>Refund terms are set out separately in the <a href="/refund-policy">Refund Policy</a>.</p>

            <h2>5. Intellectual Property</h2>
            <p>
                Unless otherwise agreed in an Order, all content on the Site, including text, graphics, logos, and
                software, is owned by or licensed to Levata and protected by applicable intellectual property
                laws. Upon full payment for a Service engagement, ownership of the specific deliverables created
                for the client will transfer as set out in the applicable Order, excluding any pre-existing tools,
                frameworks, or components owned by Levata, which remain Levata&rsquo;s property and are licensed to
                the client for use in connection with the deliverables.
            </p>

            <h2>6. Confidentiality</h2>
            <p>
                Each party agrees to keep confidential any non-public business, technical, or project information
                disclosed by the other party in connection with an engagement, and to use such information only for
                the purposes of that engagement.
            </p>

            <h2>7. Warranties and Disclaimers</h2>
            <p>
                Services and Products are provided with reasonable skill and care. Except as expressly stated in
                an applicable Order, the Site and Products are provided &ldquo;as is&rdquo; without warranties of
                any kind, whether express or implied, including warranties of merchantability, fitness for a
                particular purpose, or non-infringement, to the extent permitted by applicable law.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
                To the maximum extent permitted by law, Levata&rsquo;s total liability arising out of or relating
                to these Terms or any Order shall not exceed the total fees paid to Levata for the Service or
                Product giving rise to the claim in the twelve (12) months preceding the event. Levata shall not be
                liable for any indirect, incidental, special, or consequential damages, including loss of profits,
                revenue, or data.
            </p>

            <h2>9. Third-Party Services</h2>
            <p>
                The Site integrates certain third-party tools to support scheduling and spam prevention. Use of
                these tools is subject to the relevant provider&rsquo;s own terms and privacy policy.
            </p>

            <h2>10. Termination</h2>
            <p>
                Either party may terminate an ongoing engagement in accordance with the termination terms set out
                in the applicable Order. Levata reserves the right to suspend or terminate access to the Site or
                any Product at its discretion in the event of a breach of these Terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
                These Terms are governed by and construed in accordance with the laws of Sri Lanka, without regard
                to its conflict of law principles. Any disputes arising under these Terms shall be subject to the
                exclusive jurisdiction of the courts of Sri Lanka.
            </p>

            <h2>12. Changes to These Terms</h2>
            <p>
                These Terms may be updated from time to time. Any changes will be posted on this page with a
                revised &ldquo;Last updated&rdquo; date. Continued use of the Site after changes are posted
                constitutes acceptance of the updated Terms.
            </p>

            <h2>13. Contact</h2>
            <div className="legal-contact-card">
                <p>
                    Questions about these Terms can be directed to{" "}
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

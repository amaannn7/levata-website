import type { Metadata } from "next";
import LegalPageLayout from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
    title: "Refund Policy",
    description: "Levata's refund policy for project-based services and subscription products.",
    openGraph: { url: "https://levatahq.com/refund-policy" },
};

export default function RefundPolicyPage() {
    return (
        <LegalPageLayout eyebrow="Legal" title="Refund Policy" lastUpdated="3 July 2026">
            <p>
                This Refund Policy applies to all Services and Products offered by Levata, a brand operated by
                Unknwn Global Pvt Ltd, a company registered in Sri Lanka with its registered address at 21A, 17th
                Lane, Colombo 03, Sri Lanka. Because Levata offers two distinct types of engagement, project-based
                Services and subscription Products, refund terms are addressed separately below.
            </p>

            <h2>1. Project-Based Services</h2>
            <p>
                For bespoke consulting, development, and delivery engagements (such as AI systems, automation,
                product engineering, and digital infrastructure work), fees are tied to the milestone or payment
                schedule set out in the applicable proposal, statement of work, or order form (&ldquo;Order&rdquo;).
            </p>
            <ul>
                <li>
                    <strong>Before work begins:</strong> if an engagement is cancelled before any work has
                    commenced on a paid milestone, that milestone payment will be refunded in full, less any
                    non-recoverable third-party costs already incurred on the client&rsquo;s behalf.
                </li>
                <li>
                    <strong>After work begins:</strong> once work on a milestone has commenced, fees for that
                    milestone are non-refundable, as they reflect time and resources already committed. Any
                    completed prior milestones remain non-refundable.
                </li>
                <li>
                    <strong>Project cancellation:</strong> to cancel an active engagement, written notice must be
                    given to Levata. The client will be invoiced for all work completed up to the date of
                    cancellation, and any amount paid in advance for work not yet performed will be refunded.
                </li>
                <li>
                    <strong>Quality concerns:</strong> if a deliverable does not meet the specifications agreed in
                    the Order, this should be raised within 14 days of delivery so it can be reviewed and, where
                    warranted, revised at no additional cost. Refunds for quality concerns are considered on a
                    case-by-case basis and are not automatic.
                </li>
            </ul>

            <h2>2. Subscription Products</h2>
            <p>
                For subscription-based Products (such as the Sales Intelligence Platform), the following terms
                apply:
            </p>
            <ul>
                <li>
                    <strong>Free trials:</strong> where a free trial is offered, no charge applies until the trial
                    period ends, provided cancellation occurs before it expires.
                </li>
                <li>
                    <strong>Monthly subscriptions:</strong> payments are non-refundable once a billing cycle has
                    started. Cancellation can be made at any time to stop future charges; access continues until
                    the end of the current billing period.
                </li>
                <li>
                    <strong>Annual subscriptions:</strong> if cancelled within 14 days of the initial purchase or
                    renewal, and with materially no use of the Product, a full refund may be requested. Outside
                    this window, annual fees are non-refundable, but cancellation will stop future renewals.
                </li>
                <li>
                    <strong>Billing errors:</strong> a charge believed to be in error (such as a duplicate charge)
                    should be reported within 30 days of the charge, and any verified error will be investigated
                    and corrected.
                </li>
            </ul>

            <h2>3. How to Request a Refund</h2>
            <p>
                Refund requests can be sent to <a href="mailto:hello@levatahq.com">hello@levatahq.com</a> with the
                requester&rsquo;s name, company, the Service or Product in question, and the reason for the
                request. Refund requests are typically responded to within 5 business days.
            </p>

            <h2>4. Approved Refunds</h2>
            <p>
                Where a refund is approved, it will be issued to the original payment method within 10 business
                days, unless an alternative method is agreed in writing. Any third-party payment processing fees
                that are non-recoverable by Levata may be deducted from the refunded amount.
            </p>

            <h2>5. Changes to This Policy</h2>
            <p>
                This Refund Policy may be updated from time to time. Any changes will be posted on this page with a
                revised &ldquo;Last updated&rdquo; date. The policy in effect at the time of purchase or engagement
                governs that transaction.
            </p>

            <h2>6. Contact</h2>
            <div className="legal-contact-card">
                <p>
                    Questions about this Refund Policy can be directed to{" "}
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

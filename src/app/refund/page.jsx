// app/refund/page.jsx
export default function RefundPolicyPage() {
    return (
        <div className="container-page py-16 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Refund Policy
                </h1>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="text-secondary-text font-sans leading-relaxed space-y-6 text-sm">
                <p className="text-base text-foreground">
                    At LegitAssist, we strive to ensure complete satisfaction for both our clients and legal experts. Please read our refund policy carefully before initiating any payments.
                </p>

                <div>
                    <h2 className="text-lg font-bold text-foreground mb-2">1. Consultation Fees</h2>
                    <p>All consultation fees are paid directly to the lawyer through our secure Stripe integration. Once a hiring request is accepted by the lawyer and the payment is successfully processed, the fee is generally non-refundable.</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground mb-2">2. Cancellation by Lawyer</h2>
                    <p>If a lawyer accepts your request but is unable to provide the consultation due to unforeseen circumstances, you are entitled to a 100% refund. In such cases, the lawyer must mark the request as cancelled, and our support team will initiate the refund process.</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground mb-2">3. Disputes and Quality Issues</h2>
                    <p>If you are unsatisfied with the consultation, please contact our support team within 48 hours of the session. We will review the case and may issue a partial or full refund at our discretion, subject to the lawyer's agreement.</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground mb-2">4. Publishing Fee for Lawyers</h2>
                    <p>The one-time publishing fee paid by lawyers to list their services on LegitAssist is strictly non-refundable. This fee covers the verification process and platform maintenance.</p>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-foreground mb-2">5. Processing Time</h2>
                    <p>Approved refunds will be processed through Stripe and returned to your original payment method. Please allow 5-10 business days for the refund to reflect in your account, depending on your bank's processing times.</p>
                </div>

                <div className="pt-6 mt-6 border-t border-border">
                    <p>If you have any questions about our refund policy, please <a href="/contact" className="text-primary hover:underline font-semibold">contact our support team</a>.</p>
                </div>
            </div>
        </div>
    );
}
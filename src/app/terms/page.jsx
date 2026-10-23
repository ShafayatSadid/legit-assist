// app/terms/page.jsx
export default function TermsPage() {
    return (
        <div className="container-page py-16 max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
            <div className="text-secondary-text font-sans leading-relaxed space-y-4 text-sm">
                <p>By accessing or using LegitAssist, you agree to be bound by these Terms.</p>
                <h2 className="text-lg font-bold text-foreground mt-6">1. User Responsibilities</h2>
                <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
                <h2 className="text-lg font-bold text-foreground mt-6">2. Hiring & Payments</h2>
                <p>LegitAssist acts as a marketplace. The contract for legal services is between the client and the lawyer. Payments are facilitated through our secure Stripe integration. Refunds are subject to the lawyer's specific policies.</p>
                <h2 className="text-lg font-bold text-foreground mt-6">3. Acceptable Use</h2>
                <p>You agree not to use the platform for any unlawful purpose or to harass, abuse, or harm another person.</p>
            </div>
        </div>
    );
}
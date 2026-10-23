// app/privacy/page.jsx
export default function PrivacyPage() {
    return (
        <div className="container-page py-16 max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
            <div className="text-secondary-text font-sans leading-relaxed space-y-4 text-sm">
                <p>Last updated: October 2026</p>
                <h2 className="text-lg font-bold text-foreground mt-6">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes your name, email address, and profile picture.</p>
                <h2 className="text-lg font-bold text-foreground mt-6">2. How We Use Your Information</h2>
                <p>We use the information we collect to operate, maintain, and improve our services, process transactions, and communicate with you about your hires and account.</p>
                <h2 className="text-lg font-bold text-foreground mt-6">3. Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. All passwords are hashed, and payments are processed securely via Stripe.</p>
            </div>
        </div>
    );
}
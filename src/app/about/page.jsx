// app/about/page.jsx
export default function AboutPage() {
    return (
        <div className="container-page py-16 max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">About LegitAssist</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none text-secondary-text font-sans leading-relaxed space-y-4">
                <p>LegitAssist was founded with a simple mission: to democratize access to legal aid. Finding a trustworthy lawyer shouldn't be limited by geography or traditional firm networks.</p>
                <p>We connect clients directly with verified, independent legal experts across various specializations. Whether you need help with corporate law, family disputes, or criminal defense, our platform provides a transparent, secure, and streamlined hiring experience.</p>
                <p>For lawyers, we offer a powerful dashboard to manage their practice, showcase their expertise, and reach a global client base.</p>
            </div>
        </div>
    );
}
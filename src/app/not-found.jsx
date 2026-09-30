// app/not-found.jsx
import Link from "next/link";
import { Button } from "@heroui/react";
import { FiHome, FiSearch } from "react-icons/fi";

export const metadata = {
    title: "404 — Page Not Found | LegalEase",
};

export default function NotFound() {
    return (
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-5 py-16">
            <div className="text-center max-w-md">
                {/* 404 Big */}
                <h1 className="font-heading text-7xl md:text-8xl font-bold leading-none">
                    <span className="text-primary">4</span>
                    <span className="text-secondary">0</span>
                    <span className="text-primary">4</span>
                </h1>

                {/* Divider */}
                <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-secondary" />

                {/* Message */}
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-6">
                    Page Not Found
                </h2>
                <p className="text-sm text-secondary-text mt-3 font-sans leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has
                    been moved. Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-6">
                            <FiHome size={14} />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/lawyers" className="w-full sm:w-auto">
                        <Button className="w-full bg-transparent border border-border text-foreground font-sans font-semibold rounded-lg px-6">
                            <FiSearch size={14} />
                            Browse Lawyers
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
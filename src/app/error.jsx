// app/error.jsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function Error({ error, reset }) {
    useEffect(() => {
        // production-এ console log দরকার নেই, তবে dev-এ helpful
        console.error("App error:", error);
    }, [error]);

    return (
        <section className="min-h-[calc(100vh-200px)] flex items-center justify-center px-5 py-16">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-error/10 text-error flex items-center justify-center">
                    <FiAlertTriangle size={28} />
                </div>

                {/* Divider */}
                <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-secondary" />

                {/* Message */}
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-6">
                    Something went wrong
                </h1>
                <p className="text-sm text-secondary-text mt-3 font-sans leading-relaxed">
                    An unexpected error occurred. You can try again, or head
                    back home.
                </p>

                {/* Dev-only error detail (production-এ hide) */}
                {process.env.NODE_ENV === "development" && error?.message && (
                    <pre className="mt-5 text-xs text-left text-error bg-error/5 border border-error/20 rounded-lg p-3 overflow-x-auto font-mono max-w-full">
                        {error.message}
                    </pre>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        onPress={reset}
                        className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-6"
                    >
                        <FiRefreshCw size={14} />
                        Try Again
                    </Button>
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full bg-transparent border border-border text-foreground font-sans font-semibold rounded-lg px-6">
                            <FiHome size={14} />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
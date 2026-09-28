// app/dashboard/layout.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [drawerOpen, setDrawerOpen] = useState(false);

    // ── Auth + role guard ──
    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.replace("/login");
            return;
        }
        if (!user.role) {
            router.replace("/select-role");
            return;
        }

        // role mismatch → নিজের dashboard-এ ফেরত
        if (pathname.startsWith("/dashboard/user") && user.role !== "user") {
            router.replace("/dashboard");
            return;
        }
        if (
            pathname.startsWith("/dashboard/lawyer") &&
            user.role !== "lawyer"
        ) {
            router.replace("/dashboard");
            return;
        }
        if (
            pathname.startsWith("/dashboard/admin") &&
            user.role !== "admin"
        ) {
            router.replace("/dashboard");
        }
    }, [user, isPending, router, pathname]);

    // route change → drawer close
    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    // loading / guard state
    if (isPending || !user || !user.role) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container-page py-4 md:py-6 px-2 sm:px-5">
            {/* Mobile top bar */}
            <div className="lg:hidden flex items-center justify-between mb-5">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-sans text-foreground"
                >
                    <FiMenu size={16} />
                    Menu
                </button>
                <span className="text-xs text-secondary-text font-sans capitalize">
                    {user.role} Dashboard
                </span>
            </div>

            <div className="grid lg:grid-cols-[260px_1fr] gap-6">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
                    <Sidebar role={user.role} />
                </aside>

                {/* Mobile drawer */}
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <div
                            className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-5 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-heading text-lg font-bold text-foreground">
                                    Menu
                                </span>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    aria-label="Close menu"
                                    className="text-foreground hover:text-primary transition"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                            <Sidebar role={user.role} />
                        </div>
                    </div>
                )}

                {/* Main content */}
                <main className="min-w-0">{children}</main>
            </div>
        </div>
    );
}
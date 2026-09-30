// app/dashboard/user/hiring-history/page.jsx
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import { FiClock, FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import HireStatusBadge from "@/components/dashboard/HireStatusBadge";

function HiringHistoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [hires, setHires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/hires/my");
            setHires(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load hiring history");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Stripe success verify ──
    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const cancelled = searchParams.get("cancelled");

        if (cancelled) {
            toast.error("Payment cancelled");
            router.replace("/dashboard/user/hiring-history");
            return;
        }

        if (sessionId) {
            (async () => {
                setVerifying(true);
                try {
                    const res = await apiFetch(
                        `/api/payments/verify?session_id=${sessionId}`
                    );
                    if (res.data.alreadyPaid) {
                        toast.success("Payment already recorded");
                    } else {
                        toast.success("Payment successful!");
                    }
                    router.replace("/dashboard/user/hiring-history");
                    load();
                } catch (err) {
                    toast.error(err.message || "Payment verification failed");
                    router.replace("/dashboard/user/hiring-history");
                } finally {
                    setVerifying(false);
                }
            })();
        } else {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Pay Now → Stripe checkout ──
    const handlePay = async (hireId) => {
        setPayingId(hireId);
        try {
            const res = await apiFetch("/api/payments/checkout", {
                method: "POST",
                body: JSON.stringify({ hireId }),
            });
            // Stripe Checkout-এ redirect
            window.location.href = res.data.url;
        } catch (err) {
            toast.error(err.message || "Failed to start payment");
            setPayingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Hiring History
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    All your hire requests and their status
                </p>
            </div>

            {verifying && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-sans text-foreground">
                        Verifying payment…
                    </p>
                </div>
            )}

            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 rounded bg-border/40" />
                                <div className="h-3 w-1/4 rounded bg-border/40" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hires.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiClock className="mx-auto text-secondary-text/40 mb-3" size={32} />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                        No hiring history yet
                    </h3>
                    <p className="text-sm text-secondary-text mt-2 font-sans">
                        Browse lawyers and send your first hire request.
                    </p>
                    <Link href="/lawyers" className="inline-block mt-5">
                        <Button className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-5">
                            Browse Lawyers
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold">Lawyer</th>
                                    <th className="px-5 py-3.5 font-semibold">Specialization</th>
                                    <th className="px-5 py-3.5 font-semibold">Fee</th>
                                    <th className="px-5 py-3.5 font-semibold">Date</th>
                                    <th className="px-5 py-3.5 font-semibold">Status</th>
                                    <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hires.map((h) => (
                                    <tr
                                        key={h._id}
                                        className="border-t border-border hover:bg-background/40 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm">
                                                    <Avatar.Image alt={h.lawyerName} src={h.lawyerImage} />
                                                    <Avatar.Fallback delayMs={600}>
                                                        {h.lawyerName?.slice(0, 2).toUpperCase()}
                                                    </Avatar.Fallback>
                                                </Avatar>
                                                <span className="font-sans text-sm font-semibold text-foreground">
                                                    {h.lawyerName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text">
                                            {h.lawyerSpecialization}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground">
                                            ৳ {h.fee?.toLocaleString("en-US")}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text">
                                            {new Date(h.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <HireStatusBadge status={h.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <ActionCell
                                                hire={h}
                                                payingId={payingId}
                                                onPay={handlePay}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {hires.map((h) => (
                            <div
                                key={h._id}
                                className="rounded-2xl border border-border bg-card p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar size="md">
                                        <Avatar.Image alt={h.lawyerName} src={h.lawyerImage} />
                                        <Avatar.Fallback delayMs={600}>
                                            {h.lawyerName?.slice(0, 2).toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans text-sm font-semibold text-foreground truncate">
                                            {h.lawyerName}
                                        </p>
                                        <p className="text-xs text-secondary-text font-sans">
                                            {h.lawyerSpecialization}
                                        </p>
                                    </div>
                                    <HireStatusBadge status={h.status} />
                                </div>

                                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs font-sans">
                                    <div>
                                        <p className="text-secondary-text">Fee</p>
                                        <p className="font-semibold text-foreground text-sm">
                                            ৳ {h.fee?.toLocaleString("en-US")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary-text">Requested</p>
                                        <p className="font-semibold text-foreground">
                                            {new Date(h.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <ActionCell
                                        hire={h}
                                        payingId={payingId}
                                        onPay={handlePay}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function ActionCell({ hire, payingId, onPay, fullWidth }) {
    const wrapCls = fullWidth ? "w-full" : "inline-block";

    if (hire.status === "pending") {
        return (
            <span className="text-xs text-secondary-text font-sans italic">
                Waiting for lawyer…
            </span>
        );
    }
    if (hire.status === "rejected") {
        return (
            <Link href={`/lawyers/${hire.lawyerProfileId}`}>
                <Button size="sm" variant="light" className="text-primary font-sans text-xs">
                    View Lawyer
                    <FiExternalLink size={12} />
                </Button>
            </Link>
        );
    }
    if (hire.status === "accepted") {
        return (
            <Button
                size="sm"
                onPress={() => onPay(hire._id)}
                disabled={payingId === hire._id}
                className={`${wrapCls} bg-secondary hover:brightness-95 text-primary font-sans font-semibold rounded-lg`}
            >
                {payingId === hire._id ? "Redirecting…" : "Pay Now"}
            </Button>
        );
    }
    if (hire.status === "paid") {
        return (
            <Button
                size="sm"
                disabled
                className={`${wrapCls} bg-success/15 text-success font-sans font-semibold rounded-lg cursor-not-allowed`}
            >
                Paid ✓
            </Button>
        );
    }
    return null;
}

export default function HiringHistoryPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <HiringHistoryContent />
        </Suspense>
    );
}
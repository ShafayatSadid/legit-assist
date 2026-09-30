// app/dashboard/admin/all-transactions/page.jsx
"use client";

import { useEffect, useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function AllTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/admin/transactions");
                setTransactions(res.data);
            } catch (err) {
                toast.error(err.message || "Failed to load transactions");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    All Transactions
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    {transactions.length} payment
                    {transactions.length === 1 ? "" : "s"} recorded
                </p>
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="h-4 flex-1 rounded bg-border/40" />
                            <div className="h-4 w-24 rounded bg-border/40" />
                            <div className="h-4 w-20 rounded bg-border/40" />
                        </div>
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiCreditCard
                        className="mx-auto text-secondary-text/40 mb-3"
                        size={32}
                    />
                    <p className="text-sm text-secondary-text font-sans">
                        No transactions yet.
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px]">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold">
                                        Transaction ID
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Type
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Client
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Lawyer
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-t border-border hover:bg-background/40 transition"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-secondary-text">
                                            {t.transactionId}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold whitespace-nowrap ${
                                                    t.type === "publish-fee"
                                                        ? "bg-secondary/15 text-secondary"
                                                        : "bg-primary/10 text-primary"
                                                }`}
                                            >
                                                {t.type === "publish-fee"
                                                    ? "Publish Fee"
                                                    : "Hire"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-foreground">
                                            {t.userEmail}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-foreground">
                                            {t.lawyerName}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground whitespace-nowrap">
                                            ৳ {t.amount?.toLocaleString("en-US")}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text whitespace-nowrap">
                                            {new Date(t.createdAt).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
// app/dashboard/admin/all-transactions/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button, Input } from "@heroui/react";
import { FiCreditCard, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function AllTransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

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

    useEffect(() => {
        setPage(1);
    }, [search]);

    const filteredData = useMemo(() => {
        return transactions.filter(
            (t) =>
                t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
                t.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
                t.lawyerName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [transactions, search]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">All Transactions</h1>
                    <p className="text-sm text-secondary-text mt-1 font-sans">{filteredData.length} payments recorded</p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        placeholder="Search Txn ID, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startContent={<FiSearch className="text-secondary-text" />}
                        classNames={{ inputWrapper: "bg-background border border-border rounded-lg h-10 w-full" }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 h-64 animate-pulse" />
            ) : filteredData.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiCreditCard className="mx-auto text-secondary-text/40 mb-3" size={32} />
                    <p className="text-sm text-secondary-text font-sans">No transactions found.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    
                    {/* ── Desktop Table View ── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[820px]">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold">Transaction ID</th>
                                    <th className="px-5 py-3.5 font-semibold">Type</th>
                                    <th className="px-5 py-3.5 font-semibold">Client</th>
                                    <th className="px-5 py-3.5 font-semibold">Lawyer</th>
                                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                                    <th className="px-5 py-3.5 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((t) => (
                                    <tr key={t.id} className="border-t border-border hover:bg-background/40 transition">
                                        <td className="px-5 py-4 font-mono text-xs text-secondary-text">{t.transactionId}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold whitespace-nowrap ${t.type === "publish-fee" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"}`}>
                                                {t.type === "publish-fee" ? "Publish Fee" : "Hire"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-foreground">{t.userEmail}</td>
                                        <td className="px-5 py-4 text-sm font-sans text-foreground">{t.lawyerName}</td>
                                        <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground whitespace-nowrap">৳ {t.amount?.toLocaleString("en-US")}</td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text whitespace-nowrap">
                                            {new Date(t.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card View ── */}
                    <div className="md:hidden flex flex-col divide-y divide-border">
                        {paginatedData.map((t) => (
                            <div key={t.id} className="p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-sans font-semibold ${t.type === "publish-fee" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"}`}>
                                        {t.type === "publish-fee" ? "Publish Fee" : "Hire"}
                                    </span>
                                    <span className="font-heading font-bold text-foreground">৳ {t.amount?.toLocaleString("en-US")}</span>
                                </div>
                                <p className="font-mono text-xs text-secondary-text truncate">{t.transactionId}</p>
                                <div className="bg-background rounded-lg p-2 mt-1 space-y-1">
                                    <p className="text-xs font-sans text-secondary-text truncate"><span className="font-semibold text-foreground">Client:</span> {t.userEmail}</p>
                                    <p className="text-xs font-sans text-secondary-text truncate"><span className="font-semibold text-foreground">Lawyer:</span> {t.lawyerName}</p>
                                </div>
                                <p className="text-[10px] text-right text-secondary-text font-sans mt-1">
                                    {new Date(t.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Pagination Controls ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-border bg-background/30 gap-4">
                        <span className="text-xs text-secondary-text font-sans">
                            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button size="sm" isIconOnly variant="flat" disabled={page === 1} onPress={() => setPage(p => p - 1)}>
                                <FiChevronLeft size={16} />
                            </Button>
                            <span className="text-sm font-sans font-medium px-2">Page {page} of {Math.max(1, totalPages)}</span>
                            <Button size="sm" isIconOnly variant="flat" disabled={page >= totalPages} onPress={() => setPage(p => p + 1)}>
                                <FiChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
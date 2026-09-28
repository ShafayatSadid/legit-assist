// app/lawyers/page.jsx
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import LawyerCard from "@/components/lawyers/LawyerCard";
import LawyerFilters from "@/components/lawyers/LawyerFilters";
import LawyerSkeleton from "@/components/lawyers/LawyerSkeleton";
import EmptyState from "@/components/lawyers/EmptyState";
import Pagination from "@/components/shared/Pagination";

function BrowseContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [lawyers, setLawyers] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(true);

    const fetchLawyers = useCallback(async () => {
        setLoading(true);
        try {
            const query = searchParams.toString();
            const res = await apiFetch(
                `/api/lawyers${query ? `?${query}` : ""}`
            );
            setLawyers(res.data.lawyers);
            setMeta({
                page: res.data.page,
                totalPages: res.data.totalPages,
                total: res.data.total,
            });
        } catch (err) {
            toast.error(err.message || "Failed to load lawyers");
            setLawyers([]);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchLawyers();
    }, [fetchLawyers]);

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.replace(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="container-page py-10">
            {/* ── Header ── */}
            <div className="text-center mb-10">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Browse Lawyers
                </h1>
                <p className="text-secondary-text mt-3 font-sans max-w-xl mx-auto text-sm md:text-base">
                    Find the right legal expert for your needs — search, filter,
                    and hire with confidence.
                </p>
                <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-secondary" />
            </div>

            {/* ── Filters ── */}
            <LawyerFilters />

            {/* ── Results ── */}
            <div className="mt-8">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <LawyerSkeleton key={i} />
                        ))}
                    </div>
                ) : lawyers.length === 0 ? (
                    <div className="grid grid-cols-1">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-secondary-text font-sans">
                            Showing{" "}
                            <span className="font-semibold text-foreground">
                                {lawyers.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-foreground">
                                {meta.total}
                            </span>{" "}
                            lawyers
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {lawyers.map((l) => (
                                <LawyerCard key={l.id} lawyer={l} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={meta.page}
                            totalPages={meta.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </section>
    );
}

export default function BrowseLawyersPage() {
    return (
        <Suspense fallback={null}>
            <BrowseContent />
        </Suspense>
    );
}
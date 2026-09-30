// app/dashboard/admin/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiBriefcase, FiClock, FiDollarSign } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/admin/analytics");
                setStats(res.data);
            } catch (err) {
                toast.error(err.message || "Failed to load analytics");
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
                    Analytics Overview
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Platform-wide metrics at a glance
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border bg-card p-6 h-32 animate-pulse"
                        />
                    ))}
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        label="Total Clients"
                        value={stats.totalUsers}
                        icon={FiUsers}
                        color="primary"
                    />
                    <StatCard
                        label="Total Lawyers"
                        value={stats.totalLawyers}
                        icon={FiBriefcase}
                        color="secondary"
                    />
                    <StatCard
                        label="Total Hires"
                        value={stats.totalHires}
                        icon={FiClock}
                        color="success"
                    />
                    <StatCard
                        label="Total Revenue"
                        value={stats.totalRevenue}
                        icon={FiDollarSign}
                        color="secondary"
                        prefix="৳ "
                    />
                </div>
            ) : null}
        </div>
    );
}
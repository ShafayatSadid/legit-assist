// app/dashboard/admin/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
    FiUsers,
    FiBriefcase,
    FiClock,
    FiDollarSign,
    FiBarChart2,
    FiTrendingUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { apiFetch } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";

// ─────────────────────────────────────────────
// Custom tooltip
// ─────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xl">
            <p className="text-xs font-sans font-medium text-secondary-text">
                {label}
            </p>
            <p className="text-lg font-heading font-bold text-foreground mt-0.5">
                {payload[0].value.toLocaleString("en-US")}
            </p>
        </div>
    );
}

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

    // ── Bar chart data ──
    const chartData = stats
        ? [
              {
                  name: "Clients",
                  value: stats.totalUsers,
                  fill: "#0F2747", // primary navy
              },
              {
                  name: "Lawyers",
                  value: stats.totalLawyers,
                  fill: "#C9A227", // secondary gold
              },
              {
                  name: "Hires",
                  value: stats.totalHires,
                  fill: "#15803D", // success green
              },
          ]
        : [];

    const totalActivity =
        stats?.totalUsers + stats?.totalLawyers + stats?.totalHires || 0;

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

            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-border bg-card p-6 h-32 animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 h-96 animate-pulse" />
                        <div className="rounded-2xl border border-border bg-card p-6 h-96 animate-pulse" />
                    </div>
                </div>
            ) : stats ? (
                <>
                    {/* ── Stat Cards ── */}
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

                    {/* ── Charts Grid ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Bar Chart */}
                        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 md:p-6">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="font-heading text-lg font-bold text-foreground">
                                        Platform Overview
                                    </h3>
                                    <p className="text-xs text-secondary-text font-sans mt-0.5">
                                        Clients, lawyers and total hires at a
                                        glance
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <FiBarChart2 size={16} />
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="mt-6 h-72 md:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -15,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            vertical={false}
                                            stroke="#E2E8F0"
                                            opacity={0.6}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fill: "#64748B",
                                                fontSize: 12,
                                                fontFamily: "var(--font-inter)",
                                            }}
                                            dy={8}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{
                                                fill: "#64748B",
                                                fontSize: 12,
                                                fontFamily: "var(--font-inter)",
                                            }}
                                            allowDecimals={false}
                                            width={40}
                                        />
                                        <Tooltip
                                            content={<ChartTooltip />}
                                            cursor={{
                                                fill: "#0F2747",
                                                opacity: 0.04,
                                                radius: 8,
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[10, 10, 0, 0]}
                                            maxBarSize={72}
                                            animationDuration={900}
                                        >
                                            {chartData.map((entry, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={entry.fill}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
                                {chartData.map((d) => (
                                    <div
                                        key={d.name}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor: d.fill,
                                            }}
                                        />
                                        <span className="text-xs font-sans text-secondary-text">
                                            {d.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Highlight */}
                        <div className="rounded-2xl border border-border bg-card p-5 md:p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-1">
                                <div>
                                    <h3 className="font-heading text-lg font-bold text-foreground">
                                        Revenue
                                    </h3>
                                    <p className="text-xs text-secondary-text font-sans mt-0.5">
                                        Hires + publish fees
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                                    <FiTrendingUp size={16} />
                                </div>
                            </div>

                            {/* Big Number */}
                            <div className="flex-1 flex flex-col items-center justify-center py-8">
                                <p className="text-[11px] uppercase tracking-widest text-secondary-text font-sans font-medium">
                                    Total Revenue
                                </p>
                                <p className="text-4xl md:text-5xl font-heading font-bold text-foreground mt-3 leading-none">
                                    ৳{" "}
                                    {stats.totalRevenue.toLocaleString("en-US")}
                                </p>

                                {/* Divider */}
                                <div className="my-6 h-px w-20 bg-secondary/40" />

                                {/* Subtext */}
                                <p className="text-xs text-secondary-text font-sans text-center max-w-[200px] leading-relaxed">
                                    From{" "}
                                    <span className="font-semibold text-foreground">
                                        {stats.totalHires}
                                    </span>{" "}
                                    hire
                                    {stats.totalHires === 1 ? "" : "s"} and
                                    platform fees
                                </p>
                            </div>

                            {/* Bottom stat row */}
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-secondary-text font-sans">
                                        Total Activity
                                    </p>
                                    <p className="text-lg font-heading font-bold text-foreground mt-0.5">
                                        {totalActivity.toLocaleString("en-US")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wide text-secondary-text font-sans">
                                        Avg per Hire
                                    </p>
                                    <p className="text-lg font-heading font-bold text-foreground mt-0.5">
                                        ৳{" "}
                                        {stats.totalHires > 0
                                            ? Math.round(
                                                  stats.totalRevenue /
                                                      stats.totalHires
                                              ).toLocaleString("en-US")
                                            : "0"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
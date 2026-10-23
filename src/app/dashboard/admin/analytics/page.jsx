// app/dashboard/admin/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import {
    FiUsers,
    FiBriefcase,
    FiClock,
    FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
    PieChart,
    Pie,
    Legend,
} from "recharts";
import { apiFetch } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";

const COLORS = ["#0F2747", "#C9A227", "#15803D", "#DC2626", "#64748B"];

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 shadow-xl">
            <p className="text-xs font-sans font-medium text-secondary-text">{label}</p>
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

    if (loading || !stats) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-6 h-32 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="rounded-2xl border border-border bg-card h-80 animate-pulse" />
                    <div className="rounded-2xl border border-border bg-card h-80 animate-pulse" />
                </div>
            </div>
        );
    }

    const barData = [
        { name: "Clients", value: stats.totalUsers, fill: COLORS[0] },
        { name: "Lawyers", value: stats.totalLawyers, fill: COLORS[1] },
        { name: "Hires", value: stats.totalHires, fill: COLORS[2] },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Analytics Overview
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Platform-wide metrics at a glance
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard label="Total Clients" value={stats.totalUsers} icon={FiUsers} color="primary" />
                <StatCard label="Total Lawyers" value={stats.totalLawyers} icon={FiBriefcase} color="secondary" />
                <StatCard label="Total Hires" value={stats.totalHires} icon={FiClock} color="success" />
                <StatCard label="Total Revenue" value={stats.totalRevenue} icon={FiDollarSign} color="secondary" prefix="৳ " />
            </div>

            {/* Row 1: Bar Chart & Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Bar Chart */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-6">Platform Overview</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <RechartsTooltip content={<ChartTooltip />} cursor={{ fill: "#0F2747", opacity: 0.05 }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {barData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-6">Hires by Specialization</h3>
                    <div className="h-72">
                        {stats.pieChartData.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-secondary-text">No data yet</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<ChartTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Line Chart (Full Width) */}
            <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-6">Hiring Trend (Monthly)</h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} dy={10} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <RechartsTooltip content={<ChartTooltip />} />
                            <Line 
                                type="monotone" 
                                dataKey="hires" 
                                stroke={COLORS[0]} 
                                strokeWidth={3} 
                                dot={{ r: 5, fill: COLORS[0] }} 
                                activeDot={{ r: 7 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
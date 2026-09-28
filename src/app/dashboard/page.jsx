// app/dashboard/page.jsx
"use client";

import Link from "next/link";
import { Avatar, Chip } from "@heroui/react";
import { FiMail, FiClock, FiMessageSquare, FiEdit, FiEdit3, FiUsers, FiCreditCard, FiBarChart2 } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const ACTIONS = {
    user: [
        {
            label: "Update Profile",
            href: "/dashboard/user/update-profile",
            icon: FiEdit,
        },
        {
            label: "Hiring History",
            href: "/dashboard/user/hiring-history",
            icon: FiClock,
        },
        {
            label: "My Comments",
            href: "/dashboard/user/comments",
            icon: FiMessageSquare,
        },
    ],
    lawyer: [
        {
            label: "Manage Profile",
            href: "/dashboard/lawyer/manage-legal-profile",
            icon: FiEdit3,
        },
        {
            label: "Hiring Requests",
            href: "/dashboard/lawyer/hiring-history",
            icon: FiClock,
        },
    ],
    admin: [
        {
            label: "Manage Users",
            href: "/dashboard/admin/manage-users",
            icon: FiUsers,
        },
        {
            label: "Transactions",
            href: "/dashboard/admin/all-transactions",
            icon: FiCreditCard,
        },
        {
            label: "Analytics",
            href: "/dashboard/admin/analytics",
            icon: FiBarChart2,
        },
    ],
};

export default function DashboardOverview() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    if (!user) return null;

    const actions = ACTIONS[user.role] || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Dashboard
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Welcome back, {user.name?.split(" ")[0]}
                </p>
            </div>

            {/* Profile card */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <Avatar size="lg" className="w-20 h-20 ring-4 ring-secondary/20">
                        <Avatar.Image alt={user.name} src={user.image} />
                        <Avatar.Fallback delayMs={600}>
                            {user.name?.slice(0, 2).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-heading text-xl font-bold text-foreground">
                                {user.name}
                            </h2>
                            <Chip size="sm" variant="soft" color="accent">
                                <Chip.Label className="capitalize">
                                    {user.role}
                                </Chip.Label>
                            </Chip>
                        </div>
                        <p className="text-sm text-secondary-text mt-1 font-sans inline-flex items-center gap-1.5">
                            <FiMail size={13} />
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            {actions.length > 0 && (
                <div>
                    <h2 className="font-heading text-lg font-bold text-foreground mb-3">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {actions.map((a) => {
                            const Icon = a.icon;
                            return (
                                <Link
                                    key={a.href}
                                    href={a.href}
                                    className="group rounded-2xl border border-border bg-card p-5 flex items-center gap-3 transition hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition">
                                        <Icon size={18} />
                                    </div>
                                    <span className="font-sans text-sm font-semibold text-foreground">
                                        {a.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
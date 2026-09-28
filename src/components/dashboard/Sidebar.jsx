// components/dashboard/Sidebar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import {
    FiGrid,
    FiClock,
    FiMessageSquare,
    FiEdit,
    FiEdit3,
    FiUsers,
    FiCreditCard,
    FiBarChart2,
    FiLogOut,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const LINKS = {
    user: [
        { label: "Overview", href: "/dashboard", icon: FiGrid, exact: true },
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
        {
            label: "Update Profile",
            href: "/dashboard/user/update-profile",
            icon: FiEdit,
        },
    ],
    lawyer: [
        { label: "Overview", href: "/dashboard", icon: FiGrid, exact: true },
        {
            label: "Hiring History",
            href: "/dashboard/lawyer/hiring-history",
            icon: FiClock,
        },
        {
            label: "Manage Profile",
            href: "/dashboard/lawyer/manage-legal-profile",
            icon: FiEdit3,
        },
    ],
    admin: [
        { label: "Overview", href: "/dashboard", icon: FiGrid, exact: true },
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

export default function Sidebar({ role }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const links = LINKS[role] || [];

    const isActive = (link) => {
        if (link.exact) return pathname === link.href;
        return (
            pathname === link.href || pathname.startsWith(link.href + "/")
        );
    };

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            {/* User info */}
            <div className="flex items-center gap-3 pb-5 border-b border-border">
                <Avatar size="md">
                    <Avatar.Image alt={user?.name} src={user?.image} />
                    <Avatar.Fallback delayMs={600}>
                        {user?.name?.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <p className="font-sans text-sm font-semibold text-foreground truncate">
                        {user?.name}
                    </p>
                    <p className="font-sans text-xs text-secondary-text capitalize">
                        {role}
                    </p>
                </div>
            </div>

            {/* Links */}
            <nav className="mt-4 flex flex-col gap-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-sans transition ${
                                active
                                    ? "bg-primary text-white font-semibold"
                                    : "text-foreground hover:bg-background"
                            }`}
                        >
                            <Icon
                                size={16}
                                className={
                                    active ? "" : "text-secondary-text"
                                }
                            />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="mt-5 pt-4 border-t border-border">
                <Button
                    onPress={handleLogout}
                    className="w-full bg-transparent border border-border text-error font-sans font-medium rounded-lg"
                >
                    <FiLogOut size={14} />
                    Logout
                </Button>
            </div>
        </div>
    );
}
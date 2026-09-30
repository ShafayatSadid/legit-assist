// app/dashboard/admin/manage-users/page.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import {
    FiUsers,
    FiBriefcase,
    FiTrash2,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiExternalLink,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function ManageUsersPage() {
    const [tab, setTab] = useState("users"); // "users" | "lawyers"
    const [users, setUsers] = useState([]);
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [deleting, setDeleting] = useState(null); // {type, item}
    const [deleteLoading, setDeleteLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        const res = await apiFetch("/api/admin/users");
        setUsers(res.data);
    }, []);

    const loadLawyers = useCallback(async () => {
        const res = await apiFetch("/api/admin/lawyers");
        setLawyers(res.data);
    }, []);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([loadUsers(), loadLawyers()]);
        } catch (err) {
            toast.error(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [loadUsers, loadLawyers]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // ── Role change ──
    const handleRoleChange = async (userId, newRole) => {
        setActionId(`role:${userId}`);
        try {
            await apiFetch(`/api/admin/users/${userId}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role: newRole }),
            });
            toast.success(`Role changed to ${newRole}`);
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Failed to change role");
        } finally {
            setActionId(null);
        }
    };

    // ── Lawyer publish toggle ──
    const handleTogglePublish = async (lawyerId) => {
        setActionId(`pub:${lawyerId}`);
        try {
            await apiFetch(`/api/admin/lawyers/${lawyerId}/toggle-publish`, {
                method: "PATCH",
            });
            toast.success("Publish status updated");
            loadLawyers();
        } catch (err) {
            toast.error(err.message || "Failed to toggle publish");
        } finally {
            setActionId(null);
        }
    };

    // ── Delete ──
    const handleDelete = async () => {
        if (!deleting) return;
        setDeleteLoading(true);
        try {
            if (deleting.type === "user") {
                await apiFetch(`/api/admin/users/${deleting.item.id}`, {
                    method: "DELETE",
                });
                toast.success("User deleted");
                loadUsers();
                loadLawyers();
            } else {
                await apiFetch(`/api/admin/lawyers/${deleting.item.id}`, {
                    method: "DELETE",
                });
                toast.success("Listing deleted");
                loadLawyers();
            }
            setDeleting(null);
        } catch (err) {
            toast.error(err.message || "Failed to delete");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Manage Users
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Manage platform users and their legal listings
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border">
                <button
                    onClick={() => setTab("users")}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-sans font-semibold transition border-b-2 -mb-px ${
                        tab === "users"
                            ? "border-secondary text-primary"
                            : "border-transparent text-secondary-text hover:text-foreground"
                    }`}
                >
                    <FiUsers size={14} />
                    Users ({users.length})
                </button>
                <button
                    onClick={() => setTab("lawyers")}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-sans font-semibold transition border-b-2 -mb-px ${
                        tab === "lawyers"
                            ? "border-secondary text-primary"
                            : "border-transparent text-secondary-text hover:text-foreground"
                    }`}
                >
                    <FiBriefcase size={14} />
                    Lawyer Listings ({lawyers.length})
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 rounded bg-border/40" />
                                <div className="h-3 w-1/4 rounded bg-border/40" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : tab === "users" ? (
                <UsersTable
                    users={users}
                    actionId={actionId}
                    onRoleChange={handleRoleChange}
                    onDelete={(u) => setDeleting({ type: "user", item: u })}
                />
            ) : (
                <LawyersTable
                    lawyers={lawyers}
                    actionId={actionId}
                    onTogglePublish={handleTogglePublish}
                    onDelete={(l) => setDeleting({ type: "lawyer", item: l })}
                />
            )}

            {/* Delete confirm */}
            <ConfirmModal
                open={!!deleting}
                onClose={() => !deleteLoading && setDeleting(null)}
                onConfirm={handleDelete}
                title={
                    deleting?.type === "user"
                        ? "Delete this user?"
                        : "Delete this listing?"
                }
                description={
                    deleting?.type === "user"
                        ? `User "${deleting?.item.name}" and their lawyer profile (if any) will be permanently removed.`
                        : `"${deleting?.item.name}"'s listing will be removed from the browse page.`
                }
                confirmLabel="Delete"
                loading={deleteLoading}
            />
        </div>
    );
}

// ─────────────────────────────────────────────
// Users Table
// ─────────────────────────────────────────────
function UsersTable({ users, actionId, onRoleChange, onDelete }) {
    if (users.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <FiUsers className="mx-auto text-secondary-text/40 mb-3" size={32} />
                <p className="text-sm text-secondary-text font-sans">
                    No users yet.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-background/50">
                        <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                            <th className="px-5 py-3.5 font-semibold">User</th>
                            <th className="px-5 py-3.5 font-semibold">Email</th>
                            <th className="px-5 py-3.5 font-semibold">Role</th>
                            <th className="px-5 py-3.5 font-semibold text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const busy = actionId === `role:${u.id}`;
                            return (
                                <tr
                                    key={u.id}
                                    className="border-t border-border hover:bg-background/40 transition"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="sm">
                                                <Avatar.Image alt={u.name} src={u.image} />
                                                <Avatar.Fallback delayMs={600}>
                                                    {u.name?.slice(0, 2).toUpperCase()}
                                                </Avatar.Fallback>
                                            </Avatar>
                                            <span className="font-sans text-sm font-semibold text-foreground">
                                                {u.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-sans text-secondary-text">
                                        {u.email}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold capitalize ${
                                                u.role === "admin"
                                                    ? "bg-error/10 text-error"
                                                    : u.role === "lawyer"
                                                    ? "bg-secondary/15 text-secondary"
                                                    : "bg-primary/10 text-primary"
                                            }`}
                                        >
                                            {u.role || "none"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {u.role && u.role !== "admin" && (
                                                <Button
                                                    size="sm"
                                                    disabled={busy}
                                                    onPress={() =>
                                                        onRoleChange(
                                                            u.id,
                                                            u.role === "user"
                                                                ? "lawyer"
                                                                : "user"
                                                        )
                                                    }
                                                    className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg"
                                                >
                                                    <FiRefreshCw size={12} />
                                                    {busy
                                                        ? "..."
                                                        : `Make ${
                                                              u.role === "user"
                                                                  ? "Lawyer"
                                                                  : "Client"
                                                          }`}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                variant="light"
                                                onPress={() => onDelete(u)}
                                                aria-label="Delete user"
                                                className="text-error"
                                            >
                                                <FiTrash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Lawyers Table
// ─────────────────────────────────────────────
function LawyersTable({ lawyers, actionId, onTogglePublish, onDelete }) {
    if (lawyers.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                <FiBriefcase className="mx-auto text-secondary-text/40 mb-3" size={32} />
                <p className="text-sm text-secondary-text font-sans">
                    No lawyer listings yet.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[820px]">
                    <thead className="bg-background/50">
                        <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                            <th className="px-5 py-3.5 font-semibold">Lawyer</th>
                            <th className="px-5 py-3.5 font-semibold">
                                Specialization
                            </th>
                            <th className="px-5 py-3.5 font-semibold">Fee</th>
                            <th className="px-5 py-3.5 font-semibold">Status</th>
                            <th className="px-5 py-3.5 font-semibold text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lawyers.map((l) => {
                            const busy = actionId === `pub:${l.id}`;
                            return (
                                <tr
                                    key={l.id}
                                    className="border-t border-border hover:bg-background/40 transition"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="sm">
                                                <Avatar.Image alt={l.name} src={l.image} />
                                                <Avatar.Fallback delayMs={600}>
                                                    {l.name?.slice(0, 2).toUpperCase()}
                                                </Avatar.Fallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-sans text-sm font-semibold text-foreground">
                                                    {l.name}
                                                </span>
                                                <span className="text-xs text-secondary-text font-sans truncate max-w-[180px]">
                                                    {l.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-sans text-secondary-text">
                                        {l.specialization}
                                    </td>
                                    <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground">
                                        ৳ {l.fee?.toLocaleString("en-US")}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold ${
                                                l.published
                                                    ? "bg-success/10 text-success"
                                                    : "bg-secondary-text/10 text-secondary-text"
                                            }`}
                                        >
                                            {l.published ? "Published" : "Hidden"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/lawyers/${l.id}`}
                                                target="_blank"
                                                className="text-secondary-text hover:text-primary transition p-1.5"
                                                aria-label="View profile"
                                            >
                                                <FiExternalLink size={14} />
                                            </Link>
                                            <Button
                                                size="sm"
                                                disabled={busy}
                                                onPress={() => onTogglePublish(l.id)}
                                                className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg"
                                            >
                                                {l.published ? (
                                                    <>
                                                        <FiEyeOff size={12} />
                                                        {busy ? "..." : "Unpublish"}
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiEye size={12} />
                                                        {busy ? "..." : "Publish"}
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                variant="light"
                                                onPress={() => onDelete(l)}
                                                aria-label="Delete listing"
                                                className="text-error"
                                            >
                                                <FiTrash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
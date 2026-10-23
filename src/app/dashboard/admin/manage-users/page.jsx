// app/dashboard/admin/manage-users/page.jsx
"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { Avatar, Button, Input } from "@heroui/react";
import {
    FiUsers,
    FiTrash2,
    FiRefreshCw,
    FiSearch,
    FiChevronUp,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    
    const [deleting, setDeleting] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
    const itemsPerPage = 8;

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/admin/users");
            setUsers(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const processedData = useMemo(() => {
        let filtered = users.filter(
            (u) =>
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase()) ||
                u.role?.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (["name", "email", "role"].includes(sortConfig.key)) {
                return sortConfig.direction === "asc"
                    ? (valA || "").localeCompare(valB || "")
                    : (valB || "").localeCompare(valA || "");
            }
            if (sortConfig.key === "createdAt") {
                const dateA = new Date(valA || 0).getTime();
                const dateB = new Date(valB || 0).getTime();
                return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });

        return filtered;
    }, [users, search, sortConfig]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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

    const handleDelete = async () => {
        if (!deleting) return;
        setDeleteLoading(true);
        try {
            await apiFetch(`/api/admin/users/${deleting.id}`, { method: "DELETE" });
            toast.success("User deleted");
            setDeleting(null);
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Manage Users</h1>
                    <p className="text-sm text-secondary-text mt-1 font-sans">Manage platform clients and administrators</p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        placeholder="Search by name, email, role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startContent={<FiSearch className="text-secondary-text" />}
                        classNames={{ inputWrapper: "bg-background border border-border rounded-lg h-10 w-full" }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-2"><div className="h-4 w-1/3 rounded bg-border/40" /></div>
                        </div>
                    ))}
                </div>
            ) : processedData.length === 0 ? (
                <div className="text-center py-12 text-secondary-text font-sans border border-dashed border-border rounded-2xl bg-card/50">
                    <FiUsers className="mx-auto text-secondary-text/40 mb-3" size={32} />
                    <p>No users found matching your search.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    
                    {/* ── Desktop Table View (Hidden on Mobile) ── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary transition" onClick={() => requestSort("name")}>
                                        <div className="flex items-center gap-1">
                                            User
                                            {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                                        </div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary transition" onClick={() => requestSort("email")}>
                                        <div className="flex items-center gap-1">
                                            Email
                                            {sortConfig.key === "email" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                                        </div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary transition" onClick={() => requestSort("role")}>
                                        <div className="flex items-center gap-1">
                                            Role
                                            {sortConfig.key === "role" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                                        </div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.id} className="border-t border-border hover:bg-background/40 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm">
                                                    <Avatar.Image alt={item.name} src={item.image} />
                                                    <Avatar.Fallback delayMs={600}>{item.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                                                </Avatar>
                                                <span className="font-sans text-sm font-semibold text-foreground">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text">{item.email}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold capitalize ${item.role === "admin" ? "bg-error/10 text-error" : item.role === "lawyer" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"}`}>
                                                {item.role || "none"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.role !== "admin" && (
                                                    <Button
                                                        size="sm"
                                                        disabled={actionId === `role:${item.id}`}
                                                        onPress={() => handleRoleChange(item.id, item.role === "user" ? "lawyer" : "user")}
                                                        className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg"
                                                    >
                                                        <FiRefreshCw size={12} />
                                                        {actionId === `role:${item.id}` ? "..." : item.role === "user" ? "Make Lawyer" : "Make Client"}
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm" isIconOnly variant="light"
                                                    onPress={() => setDeleting(item)}
                                                    className="text-error"
                                                    disabled={item.role === "admin"}
                                                >
                                                    <FiTrash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card View (Hidden on Desktop) ── */}
                    <div className="md:hidden flex flex-col divide-y divide-border">
                        {paginatedData.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar size="md">
                                            <Avatar.Image alt={item.name} src={item.image} />
                                            <Avatar.Fallback delayMs={600}>{item.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-sans font-semibold text-foreground text-sm">{item.name}</p>
                                            <p className="font-sans text-xs text-secondary-text">{item.email}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-sans font-semibold capitalize ${item.role === "admin" ? "bg-error/10 text-error" : item.role === "lawyer" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"}`}>
                                        {item.role || "none"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-end gap-2 mt-1">
                                    {item.role !== "admin" && (
                                        <Button
                                            size="sm"
                                            disabled={actionId === `role:${item.id}`}
                                            onPress={() => handleRoleChange(item.id, item.role === "user" ? "lawyer" : "user")}
                                            className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg flex-1"
                                        >
                                            <FiRefreshCw size={12} />
                                            {actionId === `role:${item.id}` ? "..." : item.role === "user" ? "Make Lawyer" : "Make Client"}
                                        </Button>
                                    )}
                                    <Button
                                        size="sm" isIconOnly variant="flat" color="danger"
                                        onPress={() => setDeleting(item)}
                                        disabled={item.role === "admin"}
                                    >
                                        <FiTrash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Pagination Controls ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-border bg-background/30 gap-4">
                        <span className="text-xs text-secondary-text font-sans">
                            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, processedData.length)} of {processedData.length} users
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

            <ConfirmModal
                open={!!deleting}
                onClose={() => !deleteLoading && setDeleting(null)}
                onConfirm={handleDelete}
                title="Delete this user?"
                description={`"${deleting?.name}" will be permanently removed. This action cannot be undone.`}
                confirmLabel="Delete"
                loading={deleteLoading}
            />
        </div>
    );
}
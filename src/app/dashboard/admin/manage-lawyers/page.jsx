// app/dashboard/admin/manage-lawyers/page.jsx
"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, Button, Input } from "@heroui/react";
import {
    FiBriefcase,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiExternalLink,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiChevronDown,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function AdminManageLawyersPage() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    
    const [deleting, setDeleting] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
    const itemsPerPage = 8;

    const loadLawyers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/admin/lawyers");
            setLawyers(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load lawyers");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLawyers();
    }, [loadLawyers]);

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
        let filtered = lawyers.filter(
            (l) =>
                l.name?.toLowerCase().includes(search.toLowerCase()) ||
                l.email?.toLowerCase().includes(search.toLowerCase()) ||
                l.specialization?.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            
            if (sortConfig.key === "name" || sortConfig.key === "specialization") {
                return sortConfig.direction === "asc"
                    ? (valA || "").localeCompare(valB || "")
                    : (valB || "").localeCompare(valA || "");
            }
            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [lawyers, search, sortConfig]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleTogglePublish = async (lawyerId) => {
        setActionId(`pub:${lawyerId}`);
        try {
            await apiFetch(`/api/admin/lawyers/${lawyerId}/toggle-publish`, { method: "PATCH" });
            toast.success("Publish status updated");
            loadLawyers();
        } catch (err) {
            toast.error(err.message || "Failed to toggle publish");
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleting) return;
        setDeleteLoading(true);
        try {
            await apiFetch(`/api/admin/lawyers/${deleting.id}`, { method: "DELETE" });
            toast.success("Lawyer listing deleted");
            setDeleting(null);
            loadLawyers();
        } catch (err) {
            toast.error(err.message || "Failed to delete lawyer");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Manage Lawyers</h1>
                    <p className="text-sm text-secondary-text mt-1 font-sans">Review, publish, or remove lawyer listings</p>
                </div>
                <div className="w-full md:w-72">
                    <Input
                        placeholder="Search name, email, spec..."
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
                            <div className="flex-1 space-y-2"><div className="h-4 w-1/4 rounded bg-border/40" /></div>
                        </div>
                    ))}
                </div>
            ) : processedData.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiBriefcase className="mx-auto text-secondary-text/40 mb-3" size={32} />
                    <h3 className="font-heading text-lg font-bold text-foreground">No lawyer listings found</h3>
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    
                    {/* ── Desktop Table View ── */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary" onClick={() => requestSort("name")}>
                                        <div className="flex items-center gap-1">Lawyer {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}</div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary" onClick={() => requestSort("specialization")}>
                                        <div className="flex items-center gap-1">Specialization {sortConfig.key === "specialization" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}</div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold cursor-pointer hover:text-primary" onClick={() => requestSort("fee")}>
                                        <div className="flex items-center gap-1">Fee {sortConfig.key === "fee" && (sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />)}</div>
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">Status</th>
                                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((l) => {
                                    const busy = actionId === `pub:${l.id}`;
                                    return (
                                        <tr key={l.id} className="border-t border-border hover:bg-background/40 transition">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar size="sm">
                                                        <Avatar.Image alt={l.name} src={l.image} />
                                                        <Avatar.Fallback delayMs={600}>{l.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-sans text-sm font-semibold text-foreground">{l.name}</span>
                                                        <span className="text-xs text-secondary-text font-sans truncate max-w-[150px]">{l.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-sans text-secondary-text">{l.specialization}</td>
                                            <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground">৳ {l.fee?.toLocaleString("en-US")}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-sans font-semibold ${l.published ? "bg-success/10 text-success" : "bg-secondary-text/10 text-secondary-text"}`}>
                                                    {l.published ? "Published" : "Hidden"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/lawyers/${l.id}`} target="_blank" className="text-secondary-text hover:text-primary transition p-1.5">
                                                        <FiExternalLink size={14} />
                                                    </Link>
                                                    <Button size="sm" disabled={busy} onPress={() => handleTogglePublish(l.id)} className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg min-w-[90px]">
                                                        {l.published ? <><FiEyeOff size={12} /> {busy ? "..." : "Unpublish"}</> : <><FiEye size={12} /> {busy ? "..." : "Publish"}</>}
                                                    </Button>
                                                    <Button size="sm" isIconOnly variant="light" onPress={() => setDeleting(l)} className="text-error">
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

                    {/* ── Mobile Card View ── */}
                    <div className="md:hidden flex flex-col divide-y divide-border">
                        {paginatedData.map((l) => {
                            const busy = actionId === `pub:${l.id}`;
                            return (
                                <div key={l.id} className="p-4 flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="md">
                                                <Avatar.Image alt={l.name} src={l.image} />
                                                <Avatar.Fallback delayMs={600}>{l.name?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-sans font-semibold text-foreground text-sm">{l.name}</p>
                                                <p className="font-sans text-xs text-secondary-text">{l.specialization}</p>
                                                <p className="font-sans text-xs text-secondary-text truncate max-w-[150px]">{l.email}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-sans font-semibold ${l.published ? "bg-success/10 text-success" : "bg-secondary-text/10 text-secondary-text"}`}>
                                            {l.published ? "Published" : "Hidden"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                                        <span className="font-sans font-bold text-foreground">৳ {l.fee?.toLocaleString("en-US")}</span>
                                        <div className="flex gap-2">
                                            <Link href={`/lawyers/${l.id}`} target="_blank" className="p-2 bg-background rounded-lg text-secondary-text">
                                                <FiExternalLink size={16} />
                                            </Link>
                                            <Button size="sm" disabled={busy} onPress={() => handleTogglePublish(l.id)} className="bg-transparent border border-border text-foreground font-sans text-xs rounded-lg">
                                                {l.published ? <><FiEyeOff size={12} /> {busy ? "..." : "Unpublish"}</> : <><FiEye size={12} /> {busy ? "..." : "Publish"}</>}
                                            </Button>
                                            <Button size="sm" isIconOnly variant="flat" color="danger" onPress={() => setDeleting(l)}>
                                                <FiTrash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Pagination Controls ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-border bg-background/30 gap-4">
                        <span className="text-xs text-secondary-text font-sans">
                            Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, processedData.length)} of {processedData.length}
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
                title="Delete this lawyer listing?"
                description={`"${deleting?.name}"'s profile will be permanently removed from the platform.`}
                confirmLabel="Delete Listing"
                loading={deleteLoading}
            />
        </div>
    );
}
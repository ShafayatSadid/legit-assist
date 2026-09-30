// app/dashboard/user/comments/page.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, Button } from "@heroui/react";
import { FiMessageSquare, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import EditModal from "@/components/shared/EditModal";
import ConfirmModal from "@/components/shared/ConfirmModal";

export default function MyCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(null); // comment object
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingLoading, setDeletingLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/comments/my");
            setComments(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load comments");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // ── Edit handler ──
    const handleSaveEdit = async (newText) => {
        if (!editing) return;
        setSaving(true);
        try {
            await apiFetch(`/api/comments/${editing._id}`, {
                method: "PATCH",
                body: JSON.stringify({ text: newText }),
            });
            toast.success("Comment updated");
            setEditing(null);
            load();
        } catch (err) {
            toast.error(err.message || "Failed to update comment");
        } finally {
            setSaving(false);
        }
    };

    // ── Delete handler ──
    const handleConfirmDelete = async () => {
        if (!deleting) return;
        setDeletingLoading(true);
        try {
            await apiFetch(`/api/comments/${deleting._id}`, {
                method: "DELETE",
            });
            toast.success("Comment deleted");
            setDeleting(null);
            load();
        } catch (err) {
            toast.error(err.message || "Failed to delete comment");
        } finally {
            setDeletingLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    My Comments
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Reviews you have posted on lawyer profiles
                </p>
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 animate-pulse"
                        >
                            <div className="w-10 h-10 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 rounded bg-border/40" />
                                <div className="h-3 w-full rounded bg-border/40" />
                                <div className="h-3 w-2/3 rounded bg-border/40" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiMessageSquare
                        className="mx-auto text-secondary-text/40 mb-3"
                        size={32}
                    />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                        No comments yet
                    </h3>
                    <p className="text-sm text-secondary-text mt-2 font-sans">
                        You can review lawyers after hiring and paying them.
                    </p>
                    <Link href="/lawyers" className="inline-block mt-5">
                        <Button className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-5">
                            Browse Lawyers
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold">
                                        Lawyer
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Comment
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Date
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map((c) => (
                                    <tr
                                        key={c._id}
                                        className="border-t border-border hover:bg-background/40 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/lawyers/${c.lawyerProfileId}`}
                                                className="font-sans text-sm font-semibold text-foreground hover:text-primary transition inline-flex items-center gap-1.5"
                                            >
                                                {c.lawyerName}
                                                <FiExternalLink size={12} />
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text max-w-md">
                                            <p className="line-clamp-2">
                                                {c.text}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text whitespace-nowrap">
                                            {new Date(
                                                c.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    isIconOnly
                                                    variant="light"
                                                    onPress={() => setEditing(c)}
                                                    aria-label="Edit comment"
                                                    className="text-primary"
                                                >
                                                    <FiEdit2 size={14} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    isIconOnly
                                                    variant="light"
                                                    onPress={() => setDeleting(c)}
                                                    aria-label="Delete comment"
                                                    className="text-error"
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

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {comments.map((c) => (
                            <div
                                key={c._id}
                                className="rounded-2xl border border-border bg-card p-4"
                            >
                                <Link
                                    href={`/lawyers/${c.lawyerProfileId}`}
                                    className="font-sans text-sm font-semibold text-foreground hover:text-primary transition inline-flex items-center gap-1.5"
                                >
                                    {c.lawyerName}
                                    <FiExternalLink size={12} />
                                </Link>

                                <p className="text-sm text-secondary-text font-sans mt-2 line-clamp-3 leading-relaxed">
                                    {c.text}
                                </p>

                                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                    <p className="text-xs text-secondary-text font-sans">
                                        {new Date(
                                            c.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                            onPress={() => setEditing(c)}
                                            aria-label="Edit comment"
                                            className="text-primary"
                                        >
                                            <FiEdit2 size={14} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                            onPress={() => setDeleting(c)}
                                            aria-label="Delete comment"
                                            className="text-error"
                                        >
                                            <FiTrash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Edit Modal */}
            <EditModal
                open={!!editing}
                onClose={() => !saving && setEditing(null)}
                onSave={handleSaveEdit}
                title="Edit Comment"
                label="Your Review"
                initialValue={editing?.text || ""}
                maxLength={500}
                saving={saving}
            />

            {/* Delete Modal */}
            <ConfirmModal
                open={!!deleting}
                onClose={() => !deletingLoading && setDeleting(null)}
                onConfirm={handleConfirmDelete}
                title="Delete this comment?"
                description={`Your review on ${deleting?.lawyerName} will be permanently removed. This cannot be undone.`}
                confirmLabel="Delete"
                loading={deletingLoading}
            />
        </div>
    );
}
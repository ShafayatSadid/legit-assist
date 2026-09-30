// app/dashboard/lawyer/hiring-history/page.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import HireStatusBadge from "@/components/dashboard/HireStatusBadge";

export default function LawyerHiringHistoryPage() {
    const [hires, setHires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null); // "hireId:accept" / "hireId:reject"

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/hires/lawyer");
            setHires(res.data);
        } catch (err) {
            toast.error(err.message || "Failed to load hiring requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleAction = async (hireId, action) => {
        setActionId(`${hireId}:${action}`);
        try {
            await apiFetch(`/api/hires/${hireId}/${action}`, {
                method: "PATCH",
            });
            toast.success(
                action === "accept"
                    ? "Hire request accepted"
                    : "Hire request rejected"
            );
            load();
        } catch (err) {
            toast.error(err.message || `Failed to ${action}`);
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Hiring Requests
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Accept or reject incoming hire requests from clients
                </p>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 animate-pulse"
                        >
                            <div className="w-10 h-10 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 rounded bg-border/40" />
                                <div className="h-3 w-1/4 rounded bg-border/40" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hires.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <FiClock
                        className="mx-auto text-secondary-text/40 mb-3"
                        size={32}
                    />
                    <h3 className="font-heading text-lg font-bold text-foreground">
                        No requests yet
                    </h3>
                    <p className="text-sm text-secondary-text mt-2 font-sans">
                        Your incoming hire requests will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-background/50">
                                <tr className="text-left text-xs uppercase tracking-wide text-secondary-text font-sans">
                                    <th className="px-5 py-3.5 font-semibold">
                                        Client
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Fee
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Request Date
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-3.5 font-semibold text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {hires.map((h) => (
                                    <tr
                                        key={h._id}
                                        className="border-t border-border hover:bg-background/40 transition"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm">
                                                    <Avatar.Fallback delayMs={600}>
                                                        {h.userName
                                                            ?.slice(0, 2)
                                                            .toUpperCase()}
                                                    </Avatar.Fallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-sans text-sm font-semibold text-foreground">
                                                        {h.userName}
                                                    </span>
                                                    <span className="text-xs text-secondary-text font-sans truncate max-w-[180px]">
                                                        {h.userEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans font-semibold text-foreground">
                                            ৳ {h.fee?.toLocaleString("en-US")}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-sans text-secondary-text whitespace-nowrap">
                                            {new Date(
                                                h.createdAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <HireStatusBadge status={h.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <ActionCell
                                                hire={h}
                                                actionId={actionId}
                                                onAction={handleAction}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {hires.map((h) => (
                            <div
                                key={h._id}
                                className="rounded-2xl border border-border bg-card p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar size="md">
                                        <Avatar.Fallback delayMs={600}>
                                            {h.userName
                                                ?.slice(0, 2)
                                                .toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans text-sm font-semibold text-foreground truncate">
                                            {h.userName}
                                        </p>
                                        <p className="text-xs text-secondary-text font-sans truncate">
                                            {h.userEmail}
                                        </p>
                                    </div>
                                    <HireStatusBadge status={h.status} />
                                </div>

                                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs font-sans">
                                    <div>
                                        <p className="text-secondary-text">Fee</p>
                                        <p className="font-semibold text-foreground text-sm">
                                            ৳ {h.fee?.toLocaleString("en-US")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-secondary-text">
                                            Requested
                                        </p>
                                        <p className="font-semibold text-foreground">
                                            {new Date(
                                                h.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <ActionCell
                                        hire={h}
                                        actionId={actionId}
                                        onAction={handleAction}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Action cell
// ─────────────────────────────────────────────
function ActionCell({ hire, actionId, onAction, fullWidth }) {
    const wrapCls = fullWidth ? "w-full flex gap-2" : "flex items-center justify-end gap-2";

    if (hire.status === "pending") {
        const accepting = actionId === `${hire._id}:accept`;
        const rejecting = actionId === `${hire._id}:reject`;

        return (
            <div className={wrapCls}>
                <Button
                    size="sm"
                    onPress={() => onAction(hire._id, "accept")}
                    disabled={accepting || rejecting}
                    className={`${
                        fullWidth ? "flex-1" : ""
                    } bg-success hover:opacity-90 text-white font-sans font-semibold rounded-lg`}
                >
                    <FiCheck size={14} />
                    {accepting ? "..." : "Accept"}
                </Button>
                <Button
                    size="sm"
                    onPress={() => onAction(hire._id, "reject")}
                    disabled={accepting || rejecting}
                    className={`${
                        fullWidth ? "flex-1" : ""
                    } bg-transparent border border-error text-error font-sans font-semibold rounded-lg`}
                >
                    <FiX size={14} />
                    {rejecting ? "..." : "Reject"}
                </Button>
            </div>
        );
    }

    if (hire.status === "accepted") {
        return (
            <span className="text-xs text-secondary-text font-sans italic">
                Waiting for payment…
            </span>
        );
    }

    if (hire.status === "paid") {
        return (
            <span className="text-xs text-success font-sans font-semibold">
                Paid ✓
            </span>
        );
    }

    return null;
}
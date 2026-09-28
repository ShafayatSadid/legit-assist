// components/lawyers/HireModal.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import * as Dialog from "@heroui/react"; // fallback — নিচের নোট দেখো
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function HireModal({ lawyer, open, onClose, onSuccess }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await apiFetch("/api/hires", {
                method: "POST",
                body: JSON.stringify({ lawyerProfileId: lawyer.id }),
            });
            toast.success("Hire request sent! Wait for the lawyer to respond.");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to send hire request");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <h3 className="font-heading text-xl font-bold text-foreground">
                    Confirm Hire Request
                </h3>
                <p className="text-sm text-secondary-text mt-2 font-sans">
                    You are about to send a hire request to{" "}
                    <span className="font-semibold text-foreground">
                        {lawyer.name}
                    </span>
                    .
                </p>

                {/* Fee summary */}
                <div className="mt-5 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between text-sm font-sans">
                        <span className="text-secondary-text">
                            Specialization
                        </span>
                        <span className="font-medium text-foreground">
                            {lawyer.specialization}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-sans mt-2">
                        <span className="text-secondary-text">
                            Consultation Fee
                        </span>
                        <span className="font-bold text-foreground">
                            ৳ {lawyer.fee?.toLocaleString("en-US")}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-secondary-text mt-4 font-sans leading-relaxed">
                    The lawyer will review your request. If accepted, you can
                    proceed to payment from your dashboard.
                </p>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                    <Button
                        onPress={onClose}
                        disabled={loading}
                        className="flex-1 bg-transparent border border-border text-foreground font-sans font-medium rounded-lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={handleConfirm}
                        disabled={loading}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg"
                    >
                        {loading ? "Sending..." : "Confirm Hire"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
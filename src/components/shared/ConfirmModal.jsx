// components/shared/ConfirmModal.jsx
"use client";

import { Button } from "@heroui/react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    loading = false,
}) {
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
                {/* Icon + Header */}
                <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                        <FiAlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-heading text-lg font-bold text-foreground">
                            {title}
                        </h3>
                        <p className="text-sm text-secondary-text mt-1.5 font-sans leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                    <Button
                        onPress={onClose}
                        disabled={loading}
                        className="flex-1 bg-transparent border border-border text-foreground font-sans font-medium rounded-lg"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onPress={onConfirm}
                        disabled={loading}
                        className="flex-1 bg-error hover:opacity-90 text-white font-sans font-semibold rounded-lg"
                    >
                        {loading ? "Deleting..." : confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
// components/shared/EditModal.jsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function EditModal({
    open,
    onClose,
    onSave,
    title = "Edit",
    label = "Content",
    initialValue = "",
    maxLength = 500,
    saving = false,
    placeholder = "Write something...",
}) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState("");

    // open হলে value reset
    useEffect(() => {
        if (open) {
            setValue(initialValue);
            setError("");
        }
    }, [open, initialValue]);

    if (!open) return null;

    const handleSave = () => {
        const trimmed = value.trim();
        if (!trimmed) {
            setError("Cannot be empty");
            return;
        }
        if (trimmed.length > maxLength) {
            setError(`Must be under ${maxLength} characters`);
            return;
        }
        setError("");
        onSave(trimmed);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <h3 className="font-heading text-xl font-bold text-foreground">
                    {title}
                </h3>

                {/* Body */}
                <div className="mt-5">
                    <label className="text-sm font-medium text-foreground font-sans block mb-1.5">
                        {label}
                    </label>
                    <textarea
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder={placeholder}
                        rows={5}
                        maxLength={maxLength + 50}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-secondary-text outline-none focus:border-primary transition font-sans resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                        <p className="text-xs text-error font-sans">
                            {error}
                        </p>
                        <p className="text-xs text-secondary-text font-sans">
                            {value.length}/{maxLength}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                    <Button
                        onPress={onClose}
                        disabled={saving}
                        className="flex-1 bg-transparent border border-border text-foreground font-sans font-medium rounded-lg"
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={handleSave}
                        disabled={saving}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
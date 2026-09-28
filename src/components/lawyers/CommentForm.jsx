// components/lawyers/CommentForm.jsx
"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function CommentForm({ lawyerProfileId, onSuccess }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await apiFetch("/api/comments", {
                method: "POST",
                body: JSON.stringify({
                    lawyerProfileId,
                    text: text.trim(),
                }),
            });
            toast.success("Review posted!");
            setText("");
            onSuccess?.();
        } catch (err) {
            toast.error(err.message || "Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-4 md:p-5"
        >
            <h3 className="font-heading text-base font-bold text-foreground mb-3">
                Write a Review
            </h3>
            <Input
                placeholder="Share your experience with this lawyer..."
                value={text}
                onValueChange={setText}
                className="w-full"
                classNames={{
                    inputWrapper:
                        "bg-background border border-border rounded-lg h-auto py-2.5",
                    input: "text-sm",
                }}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-secondary-text font-sans">
                    Max 500 characters
                </p>
                <Button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-5"
                >
                    {loading ? "Posting..." : "Post Review"}
                </Button>
            </div>
        </form>
    );
}
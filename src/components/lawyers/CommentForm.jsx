// components/lawyers/CommentForm.jsx
"use client";

import { useState } from "react";
import {
    Button,
    TextField,
    Label,
    TextArea,
    FieldError,
    Description,
} from "@heroui/react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const MAX_LEN = 500;

export default function CommentForm({ lawyerProfileId, onSuccess }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const isInvalid = text.length > 0 && text.trim().length === 0;

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
            <TextField
                isRequired
                name="comment"
                defaultValue={text}
                onChange={setText}
                isInvalid={isInvalid}
                validate={(value) => {
                    if (!value || !value.trim()) {
                        return "Comment cannot be empty";
                    }
                    if (value.trim().length > MAX_LEN) {
                        return `Comment must be under ${MAX_LEN} characters`;
                    }
                    return null;
                }}
                className="w-full"
            >
                <Label className="font-heading text-base font-bold text-foreground mb-2">
                    Write a Review
                </Label>

                <TextArea
                    placeholder="Share your experience with this lawyer..."
                    rows={4}
                    fullWidth
                    maxLength={MAX_LEN}
                    className="bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-secondary-text focus:border-primary transition"
                />

                <div className="flex items-center justify-between mt-1">
                    <Description className="text-xs text-secondary-text font-sans">
                        Max {MAX_LEN} characters
                    </Description>
                    <span className="text-xs text-secondary-text font-sans">
                        {text.length}/{MAX_LEN}
                    </span>
                </div>

                <FieldError className="text-xs text-error mt-1" />
            </TextField>

            <div className="mt-3 flex items-center justify-end">
                <Button
                    type="submit"
                    disabled={loading || !text.trim() || isInvalid}
                    className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-5"
                >
                    {loading ? "Posting..." : "Post Review"}
                </Button>
            </div>
        </form>
    );
}
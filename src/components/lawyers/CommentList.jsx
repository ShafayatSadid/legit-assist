// components/lawyers/CommentList.jsx
import { Avatar } from "@heroui/react";
import { FiMessageSquare } from "react-icons/fi";

export default function CommentList({ comments }) {
    if (!comments || comments.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
                <FiMessageSquare
                    className="mx-auto text-secondary-text/50 mb-3"
                    size={28}
                />
                <p className="text-sm text-secondary-text font-sans">
                    No reviews yet. Be the first to review after hiring.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((c) => (
                <div
                    key={c._id}
                    className="rounded-2xl border border-border bg-card p-4 md:p-5"
                >
                    <div className="flex items-start gap-3">
                        <Avatar size="md">
                            <Avatar.Image alt={c.userName} src={c.userImage} />
                            <Avatar.Fallback delayMs={600}>
                                {c.userName?.slice(0, 2).toUpperCase()}
                            </Avatar.Fallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="font-sans font-semibold text-sm text-foreground">
                                    {c.userName}
                                </p>
                                <p className="text-xs text-secondary-text font-sans">
                                    {new Date(c.createdAt).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        }
                                    )}
                                </p>
                            </div>
                            <p className="text-sm text-foreground/90 mt-2 font-sans leading-relaxed whitespace-pre-wrap">
                                {c.text}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
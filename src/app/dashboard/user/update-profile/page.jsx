// app/dashboard/user/update-profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@heroui/react";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";

export default function UpdateProfilePage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load current values
    useEffect(() => {
        if (!user) return;
        setName(user.name || "");
        setImage(user.image || "");
        setLoading(false);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }

        setSaving(true);
        try {
            await apiFetch("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({
                    name: name.trim(),
                    image: image || null,
                }),
            });

            // session cookie refresh
            await authClient.getSession({
                query: { disableCookieCache: true },
            });

            toast.success("Profile updated");
        } catch (err) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Update Profile
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Update your name and profile picture
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-6 max-w-2xl"
            >
                {/* Profile Image */}
                <div>
                    <label className="text-sm font-medium text-foreground font-sans block mb-3">
                        Profile Picture
                    </label>
                    <ImageUploader
                        value={image}
                        onChange={setImage}
                        fallbackText={name}
                    />
                </div>

                {/* Name */}
                <div className="flex flex-col">
                    <label
                        htmlFor="profile-name"
                        className="text-sm font-medium text-foreground font-sans mb-1.5"
                    >
                        Full Name
                    </label>
                    <Input
                        id="profile-name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                        classNames={{
                            inputWrapper:
                                "bg-background border border-border rounded-lg h-11 w-full",
                            input: "text-sm",
                        }}
                    />
                </div>

                {/* Email (read-only) */}
                <div className="flex flex-col">
                    <label
                        htmlFor="profile-email"
                        className="text-sm font-medium text-foreground font-sans mb-1.5"
                    >
                        Email
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full h-11 px-3 rounded-lg border border-border bg-background/50 text-sm text-secondary-text outline-none cursor-not-allowed font-sans"
                    />
                    <p className="text-xs text-secondary-text mt-1.5 font-sans">
                        Email cannot be changed
                    </p>
                </div>

                {/* Submit */}
                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-6"
                    >
                        {saving ? "Saving..." : "Update Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
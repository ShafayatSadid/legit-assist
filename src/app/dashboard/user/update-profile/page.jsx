// app/dashboard/user/update-profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";

export default function UpdateProfilePage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    // Profile State
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passLoading, setPassLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        setName(user.name || "");
        setImage(user.image || "");
        setLoading(false);
    }, [user]);

    // ── Update Profile (Name + Image) ──
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }

        setSaving(true);
        try {
            await apiFetch("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({ name: name.trim(), image: image || null }),
            });

            // Session refresh so NavBar updates
            await authClient.getSession({ query: { disableCookieCache: true } });
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // ── Change Password ──
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setPassLoading(true);
        try {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true, // Logs out other devices for security
            });

            if (error) {
                toast.error(error.message || "Failed to change password");
            } else {
                toast.success("Password changed successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setPassLoading(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const inputCls = "w-full h-11 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition font-sans";

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Profile Settings
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Manage your personal information and security
                </p>
            </div>

            {/* ── SECTION 1: Profile Details ── */}
            <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-6">
                <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">
                    Profile Details
                </h2>

                <div>
                    <label className="text-sm font-medium text-foreground font-sans block mb-3">
                        Profile Picture
                    </label>
                    <ImageUploader value={image} onChange={setImage} fallbackText={name} />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputCls}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className={`${inputCls} opacity-60 cursor-not-allowed`}
                    />
                    <p className="text-xs text-secondary-text mt-1.5 font-sans">
                        Email cannot be changed
                    </p>
                </div>

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

            {/* ── SECTION 2: Change Password ── */}
            <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-5">
                <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">
                    Change Password
                </h2>

                {/* Current Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`${inputCls} pr-10`}
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground"
                        >
                            {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`${inputCls} pr-10`}
                            placeholder="Min 6 characters"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground"
                        >
                            {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputCls}
                        placeholder="Re-type new password"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={passLoading}
                        className="bg-secondary hover:brightness-95 text-primary font-sans font-semibold rounded-lg px-6"
                    >
                        <FiLock size={14} />
                        {passLoading ? "Updating..." : "Change Password"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
// app/dashboard/admin/settings/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiSettings } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";

export default function AdminSettingsPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passLoading, setPassLoading] = useState(false);
    
    // Show/Hide Password States
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    useEffect(() => {
        if (!user) return;
        setName(user.name || "");
        setImage(user.image || "");
        setLoading(false);
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({ name: name.trim(), image: image || null }),
            });
            await authClient.getSession({ query: { disableCookieCache: true } });
            toast.success("Admin settings updated");
        } catch (err) {
            toast.error(err.message || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in both password fields");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        setPassLoading(true);
        try {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });
            if (error) toast.error(error.message);
            else {
                toast.success("Password changed");
                setCurrentPassword("");
                setNewPassword("");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setPassLoading(false);
        }
    };

    if (loading) return <div className="py-20 text-center animate-pulse">Loading...</div>;

    const inputCls = "w-full h-11 px-3 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition font-sans";
    const passInputCls = `${inputCls} pr-10`;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                    <FiSettings className="text-primary" /> Admin Settings
                </h1>
                <p className="text-sm text-secondary-text mt-1 font-sans">
                    Manage your administrative account preferences
                </p>
            </div>

            {/* Profile Section */}
            <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-6">
                <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">Account Details</h2>
                
                <div>
                    <label className="text-sm font-medium text-foreground font-sans block mb-3">Profile Picture</label>
                    <ImageUploader value={image} onChange={setImage} fallbackText={name} />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">Email (Read Only)</label>
                    <input type="email" value={user.email} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
                </div>

                <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-6">
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </form>

            {/* Password Section */}
            <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">Security</h2>
                
                {/* Current Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">Current Password</label>
                    <div className="relative">
                        <input 
                            type={showCurrent ? "text" : "password"} 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            className={passInputCls} 
                            placeholder="Enter current password" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground transition"
                            aria-label="Toggle password visibility"
                        >
                            {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-foreground font-sans mb-1.5">New Password</label>
                    <div className="relative">
                        <input 
                            type={showNew ? "text" : "password"} 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            className={passInputCls} 
                            placeholder="Min 6 characters" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-foreground transition"
                            aria-label="Toggle new password visibility"
                        >
                            {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                <Button type="submit" disabled={passLoading} className="bg-secondary hover:brightness-95 text-primary font-sans font-semibold rounded-lg px-6">
                    <FiLock size={14} /> {passLoading ? "Updating..." : "Change Password"}
                </Button>
            </form>
        </div>
    );
}
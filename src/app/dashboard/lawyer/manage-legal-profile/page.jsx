// app/dashboard/lawyer/manage-legal-profile/page.jsx
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Select, ListBox } from "@heroui/react";
import {
    FiSave,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiAlertCircle,
    FiCheckCircle,
    FiExternalLink,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ImageUploader from "@/components/shared/ImageUploader";
import ConfirmModal from "@/components/shared/ConfirmModal";

const CATEGORIES = [
    "Criminal",
    "Corporate",
    "Family",
    "Property",
    "Immigration",
    "Tax",
    "Labor",
    "Intellectual Property",
];

const PUBLISH_FEE = 500;

const EMPTY_FORM = { name: "", bio: "", specialization: "", fee: "", image: "" };

const inputBaseCls =
    "w-full h-11 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-secondary-text outline-none focus:border-primary transition font-sans";

function ManageProfileContent() {
    const { data: session } = authClient.useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [paying, setPaying] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/api/lawyer/profile");
            setProfile(res.data);
            setForm({
                name: res.data.name || "",
                bio: res.data.bio || "",
                specialization: res.data.specialization || "",
                fee: res.data.fee ?? "",
                image: res.data.image || "",
            });
        } catch (err) {
            if (err.message?.toLowerCase().includes("not found")) {
                setProfile(null);
                setForm({
                    ...EMPTY_FORM,
                    name: session?.user?.name || "",
                    image: session?.user?.image || "",
                });
            } else {
                toast.error(err.message || "Failed to load profile");
            }
        } finally {
            setLoading(false);
        }
    }, [session]);

    // ── Stripe return handling ──
    useEffect(() => {
        if (session === undefined) return;

        const sessionId = searchParams.get("session_id");
        const cancelled = searchParams.get("cancelled");

        if (cancelled) {
            toast.error("Payment cancelled");
            router.replace("/dashboard/lawyer/manage-legal-profile");
            load();
            return;
        }

        if (sessionId) {
            (async () => {
                setVerifying(true);
                try {
                    const res = await apiFetch(
                        `/api/payments/lawyer-fee-verify?session_id=${sessionId}`
                    );
                    if (res.data.alreadyPaid) {
                        toast.success("Publishing fee already recorded");
                    } else {
                        toast.success("Publishing fee paid — profile activated!");
                    }
                    router.replace("/dashboard/lawyer/manage-legal-profile");
                    load();
                } catch (err) {
                    toast.error(err.message || "Verification failed");
                    router.replace("/dashboard/lawyer/manage-legal-profile");
                    load();
                } finally {
                    setVerifying(false);
                }
            })();
        } else {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    // ── Save ──
    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || form.name.trim().length < 2) {
            toast.error("Name must be at least 2 characters");
            return;
        }
        if (!form.bio.trim()) {
            toast.error("Bio is required");
            return;
        }
        if (!form.specialization) {
            toast.error("Please select a specialization");
            return;
        }
        const feeNum = Number(form.fee);
        if (!Number.isFinite(feeNum) || feeNum < 0) {
            toast.error("Fee must be a valid number");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                bio: form.bio.trim(),
                specialization: form.specialization,
                fee: feeNum,
                image: form.image || null,
            };

            if (profile) {
                await apiFetch("/api/lawyer/profile", {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
                toast.success("Profile updated");
            } else {
                await apiFetch("/api/lawyer/profile", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                toast.success("Profile created");
            }
            load();
        } catch (err) {
            toast.error(err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    // ── Pay publish fee → Stripe checkout ──
    const handlePayFee = async () => {
        setPaying(true);
        try {
            const res = await apiFetch("/api/payments/lawyer-fee-checkout", {
                method: "POST",
            });
            window.location.href = res.data.url;
        } catch (err) {
            toast.error(err.message || "Failed to start payment");
            setPaying(false);
        }
    };

    // ── Toggle publish ──
    const handleTogglePublish = async () => {
        setToggling(true);
        try {
            await apiFetch("/api/lawyer/profile/toggle-publish", { method: "PATCH" });
            toast.success(profile.published ? "Unpublished" : "Published");
            load();
        } catch (err) {
            toast.error(err.message || "Failed to toggle publish");
        } finally {
            setToggling(false);
        }
    };

    // ── Delete ──
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await apiFetch("/api/lawyer/profile", { method: "DELETE" });
            toast.success("Profile deleted");
            setConfirmDelete(false);
            load();
        } catch (err) {
            toast.error(err.message || "Failed to delete profile");
        } finally {
            setDeleting(false);
        }
    };

    if (loading || verifying) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                {verifying && (
                    <p className="text-sm text-secondary-text font-sans">
                        Verifying payment…
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                        Manage Legal Profile
                    </h1>
                    <p className="text-sm text-secondary-text mt-1 font-sans">
                        {profile
                            ? "Update your public listing details"
                            : "Create your profile to start receiving hire requests"}
                    </p>
                </div>
                {profile && (
                    <Link
                        href={`/lawyers/${profile.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition font-sans"
                    >
                        View Public Profile
                        <FiExternalLink size={14} />
                    </Link>
                )}
            </div>

            {/* Publish fee banner */}
            {profile && !profile.publishFeePaid && (
                <div className="rounded-2xl border border-secondary/40 bg-secondary/5 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-secondary shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-heading text-base font-bold text-foreground">
                                One-time publishing fee
                            </h3>
                            <p className="text-sm text-secondary-text mt-1 font-sans">
                                Pay ৳ {PUBLISH_FEE} once to publish your profile
                                and appear in search results.
                            </p>
                        </div>
                    </div>
                    <Button
                        onPress={handlePayFee}
                        disabled={paying}
                        className="bg-secondary hover:brightness-95 text-primary font-sans font-semibold rounded-lg px-5"
                    >
                        {paying ? "Redirecting…" : `Pay ৳ ${PUBLISH_FEE}`}
                    </Button>
                </div>
            )}

            {/* Publish status */}
            {profile && profile.publishFeePaid && (
                <div className="rounded-2xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <FiCheckCircle className="text-success shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-heading text-base font-bold text-foreground">
                                {profile.published
                                    ? "Your profile is live"
                                    : "Your profile is hidden"}
                            </h3>
                            <p className="text-sm text-secondary-text mt-1 font-sans">
                                {profile.published
                                    ? "Clients can find and hire you from the Browse page."
                                    : "Toggle to publish and start receiving hire requests."}
                            </p>
                        </div>
                    </div>
                    <Button
                        onPress={handleTogglePublish}
                        disabled={toggling}
                        className={`${profile.published
                                ? "bg-transparent border border-error text-error"
                                : "bg-primary hover:bg-primary-hover text-white"
                            } font-sans font-semibold rounded-lg px-5`}
                    >
                        {profile.published ? (
                            <>
                                <FiEyeOff size={14} />
                                {toggling ? "..." : "Unpublish"}
                            </>
                        ) : (
                            <>
                                <FiEye size={14} />
                                {toggling ? "..." : "Publish"}
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Form (unchanged — same as before) */}
            <form
                onSubmit={handleSave}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 space-y-5"
            >
                <div>
                    <label className="text-sm font-medium text-foreground font-sans block mb-3">
                        Profile Photo
                    </label>
                    <ImageUploader
                        value={form.image}
                        onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                        fallbackText={form.name}
                    />
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="lp-name"
                        className="text-sm font-medium text-foreground font-sans mb-1.5"
                    >
                        Display Name
                    </label>
                    <input
                        id="lp-name"
                        type="text"
                        placeholder="Adv. John Doe"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputBaseCls}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                        <label
                            htmlFor="lp-spec"
                            className="text-sm font-medium text-foreground font-sans mb-1.5"
                        >
                            Specialization
                        </label>
                        <Select
                            aria-label="Specialization"
                            placeholder="Choose specialization"
                            value={form.specialization || null}
                            onChange={(key) =>
                                setForm((f) => ({ ...f, specialization: key }))
                            }
                            className="w-full"
                        >
                            <Select.Trigger
                                id="lp-spec"
                                className="h-11 rounded-lg border border-border bg-background px-3 text-sm w-full flex items-center justify-between"
                            >
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover className="bg-card border border-border rounded-lg shadow-xl">
                                <ListBox>
                                    {CATEGORIES.map((c) => (
                                        <ListBox.Item
                                            key={c}
                                            id={c}
                                            textValue={c}
                                            className="text-foreground data-[hovered=true]:bg-background data-[selected=true]:bg-primary data-[selected=true]:text-white cursor-pointer"
                                        >
                                            {c}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="lp-fee"
                            className="text-sm font-medium text-foreground font-sans mb-1.5"
                        >
                            Consultation Fee (৳)
                        </label>
                        <input
                            id="lp-fee"
                            type="number"
                            min="0"
                            placeholder="5000"
                            value={form.fee}
                            onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
                            className={inputBaseCls}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="lp-bio"
                        className="text-sm font-medium text-foreground font-sans mb-1.5"
                    >
                        Professional Bio
                    </label>
                    <textarea
                        id="lp-bio"
                        rows={5}
                        maxLength={1000}
                        placeholder="Describe your expertise, experience, and approach…"
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-secondary-text outline-none focus:border-primary transition font-sans resize-none"
                    />
                    <p className="text-xs text-secondary-text mt-1.5 font-sans text-right">
                        {form.bio.length}/1000
                    </p>
                </div>

                <div className="pt-2 flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-6"
                    >
                        <FiSave size={14} />
                        {saving ? "Saving…" : profile ? "Update Profile" : "Create Profile"}
                    </Button>
                </div>
            </form>

            {/* Danger zone */}
            {profile && (
                <div className="rounded-2xl border border-error/30 bg-error/5 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h3 className="font-heading text-base font-bold text-foreground">
                            Delete Profile
                        </h3>
                        <p className="text-sm text-secondary-text mt-1 font-sans">
                            This will permanently remove your listing.
                        </p>
                    </div>
                    <Button
                        onPress={() => setConfirmDelete(true)}
                        className="bg-transparent border border-error text-error font-sans font-semibold rounded-lg px-5"
                    >
                        <FiTrash2 size={14} />
                        Delete
                    </Button>
                </div>
            )}

            <ConfirmModal
                open={confirmDelete}
                onClose={() => !deleting && setConfirmDelete(false)}
                onConfirm={handleDelete}
                title="Delete your legal profile?"
                description="Your listing will be removed from the browse page. Active hires must be resolved first."
                confirmLabel="Delete Profile"
                loading={deleting}
            />
        </div>
    );
}

export default function ManageLegalProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ManageProfileContent />
        </Suspense>
    );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { FiUser, FiBriefcase, FiCheck } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const ROLES = [
  {
    id: "user",
    title: "I'm a Client",
    subtitle: "Looking for legal help",
    description:
      "Browse lawyers, hire experts, and manage your legal matters.",
    icon: FiUser,
    redirect: "/",
  },
  {
    id: "lawyer",
    title: "I'm a Lawyer",
    subtitle: "Offering legal services",
    description:
      "Publish your services and connect with clients worldwide.",
    icon: FiBriefcase,
    redirect: "/dashboard/lawyer",
  },
];

export default function RoleSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  // ইউজারের role অলরেডি সেট থাকলে সরাসরি রিডাইরেক্ট
  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login");
      return;
    }
    const role = session.user.role;
    if (role === "lawyer") router.replace("/dashboard/lawyer");
    else if (role === "admin") router.replace("/dashboard/admin");
  }, [session, isPending, router]);

  const handleConfirm = async () => {
  if (!selected) {
    toast.error("Please select a role to continue");
    return;
  }

  setLoading(true);
  try {
    // ✅ authClient.updateUser বাদ, fetch ইউজ করো
    const res = await fetch("/api/user/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to set role");
      return;
    }

    toast.success(
      selected === "lawyer"
        ? "Welcome, Lawyer! Complete your profile to start."
        : "Welcome to LegalEase!"
    );

    const target = ROLES.find((r) => r.id === selected);
    router.push(target?.redirect || "/");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 overflow-hidden bg-background">
      {/* Decorative glow */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight">
            Choose Your Role
          </h2>
          <p className="text-base text-secondary-text mt-3 font-sans max-w-md mx-auto">
            Tell us how you want to use LegalEase. You can&apos;t change this
            later without admin approval.
          </p>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-secondary" />
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isActive = selected === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelected(role.id)}
                className={`relative text-left p-6 md:p-7 rounded-2xl border-2 transition-all duration-200 group ${
                  isActive
                    ? "border-secondary bg-secondary-light/40 shadow-lg shadow-secondary/10"
                    : "border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                }`}
              >
                {/* Selected Check */}
                {isActive && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow-md">
                    <FiCheck className="text-white" size={16} strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                    isActive
                      ? "bg-secondary text-white"
                      : "bg-primary/10 text-primary group-hover:bg-primary/15"
                  }`}
                >
                  <Icon size={26} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-heading text-foreground">
                  {role.title}
                </h3>
                <p className="text-sm font-medium text-secondary mt-1 font-sans">
                  {role.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-secondary-text mt-4 leading-relaxed font-sans">
                  {role.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Button
            type="button"
            disabled={!selected || loading}
            onClick={handleConfirm}
            className="w-full md:w-72 bg-primary hover:bg-primary-hover text-white font-heading font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? "Setting up..." : "Continue"}
          </Button>

          <p className="text-xs text-secondary-text font-sans text-center">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
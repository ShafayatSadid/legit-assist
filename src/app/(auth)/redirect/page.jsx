"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const role = session?.user?.role;
    if (!role) return router.replace("/select-role");
    if (role === "lawyer") return router.replace("/dashboard/lawyer");
    if (role === "admin") return router.replace("/dashboard/admin");
    router.replace("/");
  }, [session, isPending, router]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-secondary-text font-sans">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
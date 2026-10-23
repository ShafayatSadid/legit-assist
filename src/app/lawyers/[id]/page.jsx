// app/lawyers/[id]/page.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Button, Chip } from "@heroui/react";
import {
    FiArrowLeft,
    FiCalendar,
    FiDollarSign,
    FiLock,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import HireModal from "@/components/lawyers/HireModal";
import CommentList from "@/components/lawyers/CommentList";
import CommentForm from "@/components/lawyers/CommentForm";
import LawyerCard from "@/components/lawyers/LawyerCard"; // ✅ Imported LawyerCard

export default function LawyerDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const user = session?.user;

    const [lawyer, setLawyer] = useState(null);
    const [comments, setComments] = useState([]);
    const [related, setRelated] = useState([]); // ✅ State for related lawyers
    const [status, setStatus] = useState({ hire: null, hasCommented: false });
    const [loading, setLoading] = useState(true);
    const [hireOpen, setHireOpen] = useState(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [lRes, cRes] = await Promise.all([
                apiFetch(`/api/lawyers/${id}`),
                apiFetch(`/api/comments/lawyer/${id}`),
            ]);
            setLawyer(lRes.data);
            setComments(cRes.data);

            if (user) {
                const sRes = await apiFetch(`/api/hires/status/${id}`);
                setStatus({
                    hire: sRes.data.hire,
                    hasCommented: sRes.data.hasCommented,
                });
            }

            // ✅ Fetch Related Lawyers (same specialization)
            if (lRes.data.specialization) {
                const relRes = await apiFetch(
                    `/api/lawyers?specialization=${encodeURIComponent(lRes.data.specialization)}&excludeId=${id}&limit=4`
                );
                setRelated(relRes.data.lawyers);
            }
        } catch (err) {
            toast.error(err.message || "Failed to load lawyer");
            router.replace("/lawyers");
        } finally {
            setLoading(false);
        }
    }, [id, user, router]);

    useEffect(() => {
        if (sessionLoading) return;
        loadAll();
    }, [loadAll, sessionLoading]);

    const handleHireClick = () => {
        if (!user) {
            toast.error("Please login to hire");
            router.push("/login");
            return;
        }
        if (user.role === "lawyer") {
            toast.error("Lawyers cannot hire other lawyers");
            return;
        }
        if (user.role === "admin") {
            toast.error("Admins cannot hire");
            return;
        }
        if (status.hire?.status === "pending") return;
        if (status.hire?.status === "accepted") {
            toast.success("Proceed to payment from your dashboard");
            router.push("/dashboard/user/hiring-history");
            return;
        }
        if (status.hire?.status === "paid") return;

        setHireOpen(true);
    };

    const hireButtonState = (() => {
        if (!user) return { label: "Hire Lawyer", disabled: false };
        if (user.role !== "user") return { label: "Hire Lawyer", disabled: false };

        const s = status.hire?.status;
        if (s === "pending") return { label: "Request Pending", disabled: true };
        if (s === "accepted") return { label: "Pay Now", disabled: false };
        if (s === "paid") return { label: "Hired ✓", disabled: true };
        return { label: "Hire Lawyer", disabled: false };
    })();

    const canComment =
        user?.role === "user" &&
        (status.hire?.status === "accepted" || status.hire?.status === "paid") &&
        !status.hasCommented;

    if (loading || sessionLoading) {
        return (
            <section className="container-page py-10">
                <div className="animate-pulse space-y-6">
                    <div className="h-6 w-32 bg-border/40 rounded-lg" />
                    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-full bg-border/40" />
                            <div className="flex-1 space-y-3">
                                <div className="h-6 w-2/3 bg-border/40 rounded-lg" />
                                <div className="h-4 w-1/3 bg-border/40 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!lawyer) return null;

    const allImages = [lawyer.image, ...(lawyer.gallery || [])].filter(Boolean);

    return (
        <>
            <section className="container-page py-8 md:py-10 max-w-7xl mx-auto px-2">
                <Link
                    href="/lawyers"
                    className="inline-flex items-center gap-2 text-sm text-secondary-text hover:text-primary transition font-sans mb-6"
                >
                    <FiArrowLeft size={16} />
                    Back to Browse
                </Link>

                {/* Media Gallery Section */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6 shadow-sm">
                    {allImages.length > 0 ? (
                        <div className="relative group">
                            <div className="overflow-hidden" ref={emblaRef}>
                                <div className="flex">
                                    {allImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="flex-[0_0_100%] min-w-0 h-[300px] md:h-[450px] relative bg-background"
                                        >
                                            <img
                                                src={img}
                                                alt={`${lawyer.name} - image ${index + 1}`}
                                                className="w-full h-full object-contain md:object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                            {index === 0 && (
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h1 className="font-heading text-2xl md:text-4xl font-bold text-white">
                                                            {lawyer.name}
                                                        </h1>
                                                        <Chip
                                                            size="sm"
                                                            variant="soft"
                                                            color={lawyer.isBusy ? "danger" : "success"}
                                                        >
                                                            <Chip.Label>
                                                                {lawyer.isBusy ? "Busy" : "Available"}
                                                            </Chip.Label>
                                                        </Chip>
                                                    </div>
                                                    <p className="text-white/90 font-medium font-sans">
                                                        {lawyer.specialization}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => emblaApi?.scrollPrev()}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
                                        aria-label="Previous image"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => emblaApi?.scrollNext()}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
                                        aria-label="Next image"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center bg-background/50">
                            <p className="text-secondary-text font-sans">No images available</p>
                        </div>
                    )}
                </div>

                {/* Two-column layout */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left — Bio + Comments */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-border bg-card p-6">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-secondary-text font-sans mb-4 border-b border-border pb-4">
                                <span className="inline-flex items-center gap-1.5">
                                    <FiCalendar size={13} />
                                    Joined{" "}
                                    {new Date(lawyer.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <FiDollarSign size={13} />
                                    {lawyer.hireCount} hire{lawyer.hireCount === 1 ? "" : "s"}
                                </span>
                            </div>
                            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
                                About
                            </h2>
                            <p className="text-sm text-foreground/85 font-sans leading-relaxed whitespace-pre-wrap">
                                {lawyer.bio || "No description provided."}
                            </p>
                        </div>

                        <div>
                            <h2 className="font-heading text-lg font-bold text-foreground mb-4">
                                Reviews ({comments.length})
                            </h2>

                            {canComment && (
                                <div className="mb-4">
                                    <CommentForm lawyerProfileId={lawyer.id} onSuccess={loadAll} />
                                </div>
                            )}

                            {!user && (
                                <div className="mb-4 rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                                    <FiLock className="text-secondary-text shrink-0" />
                                    <p className="text-sm text-secondary-text font-sans">
                                        <Link href="/login" className="text-primary font-semibold hover:underline">
                                            Login
                                        </Link>{" "}
                                        and hire to post a review.
                                    </p>
                                </div>
                            )}

                            {user &&
                                user.role === "user" &&
                                !canComment &&
                                !status.hasCommented &&
                                status.hire?.status !== "accepted" &&
                                status.hire?.status !== "paid" && (
                                    <div className="mb-4 rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                                        <FiLock className="text-secondary-text shrink-0" />
                                        <p className="text-sm text-secondary-text font-sans">
                                            Only clients who have hired this lawyer can post a review.
                                        </p>
                                    </div>
                                )}

                            {status.hasCommented && (
                                <div className="mb-4 rounded-xl border border-border bg-card p-4">
                                    <p className="text-sm text-secondary-text font-sans">
                                        ✓ You have already reviewed this lawyer. Edit from your dashboard.
                                    </p>
                                </div>
                            )}

                            <CommentList comments={comments} />
                        </div>
                    </div>

                    {/* Right — sticky fee card */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-6">
                            <p className="text-xs uppercase tracking-wide text-secondary-text font-sans">
                                Consultation Fee
                            </p>
                            <p className="text-3xl font-heading font-bold text-foreground mt-1">
                                ৳ {lawyer.fee?.toLocaleString("en-US")}
                            </p>

                            <div className="my-5 h-px bg-border" />

                            <Button
                                onPress={handleHireClick}
                                disabled={hireButtonState.disabled}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg py-3 h-auto disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {hireButtonState.label}
                            </Button>

                            <p className="text-xs text-secondary-text mt-3 font-sans text-center">
                                Payment is processed after the lawyer accepts your request.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ✅ Related Lawyers Section */}
                {related.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-border">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="font-heading text-2xl font-bold text-foreground">
                                    Related Lawyers
                                </h2>
                                <p className="text-sm text-secondary-text font-sans mt-1">
                                    Other experts in {lawyer.specialization}
                                </p>
                            </div>
                            <Link
                                href={`/lawyers?specialization=${encodeURIComponent(lawyer.specialization)}`}
                                className="hidden sm:inline-flex text-sm font-semibold text-primary hover:underline font-sans"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {related.map((relLawyer) => (
                                <LawyerCard key={relLawyer.id} lawyer={relLawyer} />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {lawyer && (
                <HireModal
                    lawyer={lawyer}
                    open={hireOpen}
                    onClose={() => setHireOpen(false)}
                    onSuccess={loadAll}
                />
            )}
        </>
    );
}
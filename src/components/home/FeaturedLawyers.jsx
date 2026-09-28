// components/home/FeaturedLawyers.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import LawyerCard from "@/components/lawyers/LawyerCard";
import LawyerSkeleton from "@/components/lawyers/LawyerSkeleton";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export default function FeaturedLawyers() {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/lawyers/featured");
                setLawyers(res.data);
            } catch (err) {
                toast.error(err.message || "Failed to load featured lawyers");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <section className=" py-14 md:py-20">
            {/* Header */}
            <div className="flex items-end justify-between mb-8 md:mb-10">
                <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                        Featured Lawyers
                    </h2>
                    <p className="text-secondary-text text-sm mt-1.5 font-sans">
                        Handpicked legal experts ready to help
                    </p>
                    <div className="mt-3 h-1 w-14 rounded-full bg-secondary" />
                </div>

                <Link
                    href="/lawyers"
                    className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition font-sans"
                >
                    View All
                    <FiArrowRight size={14} />
                </Link>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <LawyerSkeleton key={i} />
                    ))}
                </div>
            ) : lawyers.length === 0 ? (
                <p className="text-center text-secondary-text font-sans py-10">
                    No featured lawyers yet.
                </p>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                >
                    {lawyers.map((l) => (
                        <motion.div key={l.id} variants={itemVariants}>
                            <LawyerCard lawyer={l} />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Mobile View All */}
            <div className="mt-8 flex justify-center md:hidden">
                <Link
                    href="/lawyers"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition font-sans"
                >
                    View All Lawyers
                    <FiArrowRight size={14} />
                </Link>
            </div>
        </section>
    );
}
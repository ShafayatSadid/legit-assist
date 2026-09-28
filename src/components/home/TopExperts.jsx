// components/home/TopExperts.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Avatar } from "@heroui/react";
import { FiAward } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function TopExperts() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/lawyers/top");
                setExperts(res.data);
            } catch (err) {
                toast.error(err.message || "Failed to load top experts");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <section className="container-page py-14 md:py-20">
                <div className="text-center mb-10">
                    <div className="h-8 w-56 bg-border/40 rounded-lg mx-auto animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border bg-card p-6 h-48 animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (experts.length === 0) return null;

    return (
        <section className="container-page py-14 md:py-20">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-secondary font-sans text-xs font-semibold uppercase tracking-wider mb-3">
                    <FiAward size={14} />
                    Most Hired
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Top Legal Experts
                </h2>
                <p className="text-secondary-text text-sm mt-2 font-sans">
                    Trusted by hundreds of clients
                </p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            {/* Experts */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
                {experts.map((expert, i) => (
                    <motion.div key={expert.id} variants={itemVariants}>
                        <Link
                            href={`/lawyers/${expert.id}`}
                            className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-secondary/40"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Rank badge + Avatar */}
                                <div className="relative">
                                    <Avatar
                                        size="lg"
                                        className="w-20 h-20 ring-4 ring-secondary/20 group-hover:ring-secondary/40 transition-all"
                                    >
                                        <Avatar.Image
                                            alt={expert.name}
                                            src={expert.image}
                                        />
                                        <Avatar.Fallback delayMs={600}>
                                            {expert.name
                                                ?.slice(0, 2)
                                                .toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar>

                                    {/* Rank */}
                                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs shadow-md">
                                        {i + 1}
                                    </div>
                                </div>

                                <h3 className="mt-4 font-heading text-lg font-bold text-foreground line-clamp-1">
                                    {expert.name}
                                </h3>
                                <p className="text-sm text-secondary font-medium mt-0.5 font-sans">
                                    {expert.specialization}
                                </p>

                                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1">
                                    <FiAward
                                        size={12}
                                        className="text-secondary"
                                    />
                                    <span className="text-xs font-semibold text-secondary font-sans">
                                        {expert.hireCount} hires
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
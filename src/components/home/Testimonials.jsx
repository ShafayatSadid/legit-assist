// components/home/Testimonials.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Avatar } from "@heroui/react";
import { FiMessageSquare } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

export default function Testimonials() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/public/testimonials");
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to load testimonials");
            }
        })();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="container-page py-14 md:py-20">
            <div className="text-center mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Client Testimonials
                </h2>
                <p className="text-secondary-text text-sm mt-2 font-sans">
                    Hear from people who found their legal experts
                </p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="rounded-2xl border border-border bg-card p-6 relative"
                    >
                        <FiMessageSquare className="absolute top-6 right-6 text-secondary/20" size={40} />
                        
                        <p className="text-sm text-foreground/80 font-sans leading-relaxed italic mb-6 line-clamp-4 relative z-10">
                            "{r.text}"
                        </p>

                        <div className="flex items-center gap-3">
                            <Avatar size="md" className="shrink-0">
                                <Avatar.Image src={r.userImage} />
                                <Avatar.Fallback>{r.userName?.slice(0, 2).toUpperCase()}</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-bold text-foreground font-sans">
                                    {r.userName}
                                </p>
                                <p className="text-xs text-secondary-text font-sans">
                                    Hired <span className="text-primary font-medium">{r.lawyerName}</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
// components/home/PlatformStats.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiUsers, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { apiFetch } from "@/lib/api";

export default function PlatformStats() {
    const [stats, setStats] = useState({ totalClients: 0, totalLawyers: 0, totalHires: 0 });

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch("/api/public/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load stats");
            }
        })();
    }, []);

    const items = [
        { label: "Total Clients", value: stats.totalClients, icon: FiUsers, color: "text-primary" },
        { label: "Verified Lawyers", value: stats.totalLawyers, icon: FiBriefcase, color: "text-secondary" },
        { label: "Successful Hires", value: stats.totalHires, icon: FiCheckCircle, color: "text-success" },
    ];

    return (
        <section className="bg-primary py-16">
            <div className="container-page">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.4 }}
                            className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0"
                        >
                            <item.icon size={32} className="text-secondary mb-3 opacity-80" />
                            <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                                {item.value}+
                            </h3>
                            <p className="text-sm uppercase tracking-wider text-white/60 font-sans font-medium">
                                {item.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
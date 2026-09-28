// components/home/LegalCategories.jsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
    FiShield,
    FiBriefcase,
    FiUsers,
    FiHome,
    FiGlobe,
    FiFileText,
    FiTrendingUp,
    FiZap,
} from "react-icons/fi";

const CATEGORIES = [
    { name: "Criminal", icon: FiShield },
    { name: "Corporate", icon: FiBriefcase },
    { name: "Family", icon: FiUsers },
    { name: "Property", icon: FiHome },
    { name: "Immigration", icon: FiGlobe },
    { name: "Tax", icon: FiFileText },
    { name: "Labor", icon: FiTrendingUp },
    { name: "Intellectual Property", icon: FiZap },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function LegalCategories() {
    return (
        <section className="container-page py-14 md:py-20">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Legal Categories
                </h2>
                <p className="text-secondary-text text-sm mt-2 font-sans">
                    Browse lawyers by their area of expertise
                </p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            {/* Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <motion.div key={cat.name} variants={itemVariants}>
                            <Link
                                href={`/lawyers?specialization=${encodeURIComponent(
                                    cat.name
                                )}`}
                                className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 h-32 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                    <Icon size={22} />
                                </div>
                                <p className="font-sans text-sm font-semibold text-foreground text-center leading-tight">
                                    {cat.name}
                                </p>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
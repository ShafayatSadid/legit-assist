// components/home/HowItWorks.jsx
"use client";

import { motion } from "motion/react";
import { FiSearch, FiSend, FiCheckCircle } from "react-icons/fi";

const STEPS = [
    {
        icon: FiSearch,
        title: "Browse Lawyers",
        desc: "Explore verified legal experts by specialization, fee, and availability.",
    },
    {
        icon: FiSend,
        title: "Send Request",
        desc: "Submit a hire request with just one click. Wait for the lawyer to accept.",
    },
    {
        icon: FiCheckCircle,
        title: "Consult & Pay",
        desc: "Once accepted, securely pay the consultation fee and start your session.",
    },
];

export default function HowItWorks() {
    return (
        <section className="container-page py-14 md:py-20 bg-background">
            <div className="text-center mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    How It Works
                </h2>
                <p className="text-secondary-text text-sm mt-2 font-sans">
                    Get legal help in three simple steps
                </p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />

                {STEPS.map((step, i) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, duration: 0.5 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-xl flex items-center justify-center mb-6 z-10 relative">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <step.icon size={28} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-sm shadow-md">
                                {i + 1}
                            </div>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                            {step.title}
                        </h3>
                        <p className="text-sm text-secondary-text font-sans max-w-xs leading-relaxed">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
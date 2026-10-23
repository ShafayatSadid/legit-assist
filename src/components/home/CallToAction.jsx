// components/home/CallToAction.jsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FiBriefcase, FiSearch, FiArrowRight } from "react-icons/fi";

export default function CallToAction() {
    return (
        <section className="container-page py-14 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">
                
                {/* ── Client CTA ── */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-primary p-10 md:p-14 flex flex-col justify-center relative overflow-hidden group"
                >
                    {/* Decorative background circle */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
                    
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                        <FiSearch size={22} />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
                        Need Legal Help?
                    </h2>
                    <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                        Browse our network of verified experts, find the right lawyer for your case, and hire them easily.
                    </p>
                    <Link href="/lawyers">
                        <button className="inline-flex items-center gap-2 text-secondary font-sans font-semibold hover:gap-3 transition-all duration-300">
                            Browse Lawyers <FiArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>

                {/* ── Lawyer CTA ── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-secondary p-10 md:p-14 flex flex-col justify-center relative overflow-hidden group"
                >
                    {/* Decorative background circle */}
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 backdrop-blur-sm">
                        <FiBriefcase size={22} />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-3">
                        Are You a Lawyer?
                    </h2>
                    <p className="text-primary/70 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                        Join our platform to showcase your expertise, connect with clients globally, and grow your practice.
                    </p>
                    <Link href="/register">
                        <button className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-sans font-semibold hover:bg-primary-hover transition-all duration-300 shadow-md">
                            Join as a Lawyer <FiArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
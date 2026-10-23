// components/home/FAQ.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQS = [
    {
        q: "How do I hire a lawyer on LegalEase?",
        a: "Browse our verified lawyers, select one that fits your needs, and click 'Hire Lawyer'. Once the lawyer accepts your request, you can securely pay the consultation fee to confirm the session."
    },
    {
        q: "Is my payment secure?",
        a: "Yes, all payments are processed securely through Stripe. We do not store your credit card information on our servers."
    },
    {
        q: "Can I review a lawyer after hiring?",
        a: "Absolutely. Only clients who have successfully hired and paid a lawyer can leave a review. This ensures all our testimonials are 100% genuine."
    },
    {
        q: "What if a lawyer rejects my request?",
        a: "If a lawyer rejects your request or is marked as 'Busy', you can easily browse and send a request to another available lawyer on the platform."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="container-page py-14 md:py-20 bg-background">
            <div className="text-center mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    Frequently Asked Questions
                </h2>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {FAQS.map((faq, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-border bg-card overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        >
                            <span className="font-heading font-semibold text-foreground">
                                {faq.q}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary shrink-0 ml-4">
                                {openIndex === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
                            </div>
                        </button>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="px-5 pb-5 text-sm text-secondary-text font-sans leading-relaxed border-t border-border pt-4">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
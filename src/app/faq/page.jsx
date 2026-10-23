// app/faq/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQS = [
    {
        q: "How do I hire a lawyer on LegitAssist?",
        a: "Browse our verified lawyers, select one that fits your needs, and click 'Hire Lawyer'. Once the lawyer accepts your request, you can securely pay the consultation fee to confirm the session."
    },
    {
        q: "Is my payment information secure?",
        a: "Yes, absolutely. All payments are processed securely through Stripe. LegitAssist does not store your credit card or payment details on our servers."
    },
    {
        q: "Can I review a lawyer after hiring?",
        a: "Yes. Only clients who have successfully hired and paid a lawyer can leave a review. This ensures that all our testimonials are 100% genuine and verified."
    },
    {
        q: "How do I become a verified lawyer on LegitAssist?",
        a: "You can register as a Lawyer, create your legal profile, and pay a one-time publishing fee. Once verified, your profile will be visible to clients worldwide."
    },
    {
        q: "What happens if a lawyer rejects my hire request?",
        a: "If a lawyer rejects your request or is marked as 'Busy', you will be notified. You can then easily browse and send a request to another available lawyer on the platform."
    },
    {
        q: "Can I change my role from Client to Lawyer later?",
        a: "Currently, roles are assigned during registration. If you need to change your role, please contact our support team for assistance."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="container-page py-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                    Frequently Asked Questions
                </h1>
                <p className="text-secondary-text mt-3 font-sans text-sm md:text-base">
                    Find answers to common questions about hiring and working on LegitAssist.
                </p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="space-y-4">
                {FAQS.map((faq, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/30"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                        >
                            <span className="font-heading font-semibold text-foreground text-base md:text-lg">
                                {faq.q}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-4 transition-colors ${openIndex === i ? 'bg-primary text-white' : 'bg-background text-primary'}`}>
                                {openIndex === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
                            </div>
                        </button>
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="px-5 pb-5 text-sm md:text-base text-secondary-text font-sans leading-relaxed border-t border-border pt-4">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
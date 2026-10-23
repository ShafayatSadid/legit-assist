// app/contact/page.jsx
"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send message");

            toast.success("Message sent successfully! We'll get back to you soon.");
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full h-11 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:border-primary outline-none transition";

    return (
        <div className="container-page py-16 md:py-24">
            <div className="text-center mb-12">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
                <p className="text-secondary-text mt-2 font-sans">Have a question? We'd love to hear from you.</p>
                <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-6">
                    <h2 className="font-heading text-xl font-bold text-foreground">Get in Touch</h2>
                    <p className="text-sm text-secondary-text font-sans leading-relaxed">
                        Our support team is available around the clock to assist you with any inquiries or issues.
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><FiMail size={18} /></div>
                            <div>
                                <p className="text-sm font-semibold text-foreground font-sans">Email</p>
                                <p className="text-xs text-secondary-text font-sans">support@LegitAssist.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><FiPhone size={18} /></div>
                            <div>
                                <p className="text-sm font-semibold text-foreground font-sans">Phone</p>
                                <p className="text-xs text-secondary-text font-sans">+880 1234 567890</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><FiMapPin size={18} /></div>
                            <div>
                                <p className="text-sm font-semibold text-foreground font-sans">Office</p>
                                <p className="text-xs text-secondary-text font-sans">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-foreground mb-1.5">Name</label>
                        <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="Your full name" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-foreground mb-1.5">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} placeholder="you@example.com" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-foreground mb-1.5">Message</label>
                        <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4} className={`${inputCls} h-auto py-2.5 resize-none`} placeholder="How can we help you?" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg mt-2">
                        {loading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
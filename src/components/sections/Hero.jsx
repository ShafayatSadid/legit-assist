"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
    {
        image: "/images/slide-1.webp",
        heading: "Find & Hire Expert Legal Counsel",
        subtext:
            "Connect with top-rated lawyers for your legal needs — anytime, anywhere.",
        primaryCta: { label: "Browse Lawyers", href: "/lawyers" },
        secondaryCta: { label: "How it Works", href: "/how-it-works" },
    },
    {
        image: "/images/slide-2.webp",
        heading: "Decades of Combined Legal Experience",
        subtext:
            "Our network of lawyers has successfully handled thousands of cases.",
        primaryCta: { label: "View Top Experts", href: "/lawyers?sort=top" },
        secondaryCta: { label: "Read Reviews", href: "/reviews" },
    },
    {
        image: "/images/slide-3.webp",
        heading: "Secure, Verified & Trusted",
        subtext:
            "Your legal matters are handled with the highest confidentiality.",
        primaryCta: { label: "Get Started", href: "/register" },
        secondaryCta: { label: "Learn More", href: "/about" },
    },
];

const AUTOPLAY_MS = 5500;

export default function Hero() {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    // Autoplay — manual change করলে timer reset হবে
    useEffect(() => {
        const id = setInterval(next, AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [next, current]);

    return (
        <section className="relative w-full h-[88vh] min-h-140 max-h-215 overflow-hidden bg-primary px-5 md:px-18">

            {/* ───── Background Image Layer ───── */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    {/* Dark navy gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                </div>
            ))}

            {/* ───── Content Layer ───── */}
            <div className="relative z-20 container-page h-full flex items-center pt-20">
                <div className="max-w-2xl grid">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`col-start-1 row-start-1 transition-all duration-700 ease-out ${index === current
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 pointer-events-none"
                                }`}
                        >
                            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                                {slide.heading}
                            </h1>

                            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl font-sans leading-relaxed">
                                {slide.subtext}
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <Link href={slide.primaryCta.href}>
                                    <button className="bg-secondary hover:brightness-95 text-primary font-sans font-semibold px-7 py-3 rounded-lg shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                                        {slide.primaryCta.label}
                                    </button>
                                </Link>
                                <Link href={slide.secondaryCta.href}>
                                    <button className="border border-white/60 text-white hover:bg-white hover:text-primary font-sans font-semibold px-7 py-3 rounded-lg transition-all duration-200">
                                        {slide.secondaryCta.label}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ───── Prev / Next Arrows (desktop only) ───── */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 transition"
            >
                <FiChevronLeft size={22} />
            </button>

            <button
                onClick={next}
                aria-label="Next slide"
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 transition"
            >
                <FiChevronRight size={22} />
            </button>

            {/* ───── Dots Indicator ───── */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === current
                                ? "w-10 bg-secondary"
                                : "w-3 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>

        </section>
    );
}
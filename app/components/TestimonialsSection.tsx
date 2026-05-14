"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
    {
        company: "SaaS",
        quote:
            "Levata didn't build us a website — they built a client acquisition system. Qualified leads tripled in 90 days.",
        author: "CEO",
        role: "SaaS Company",
    },
    {
        company: "E-commerce",
        quote:
            "The AI systems transformed how we operate. Automated reporting, real-time KPIs, and an AI assistant that handles 80% of inbound.",
        author: "COO",
        role: "E-commerce Retailer",
    },
    {
        company: "Professional Services",
        quote:
            "Like having an entire technology division in our corner. We scaled from 8 to 40 staff without our operations falling apart.",
        author: "Founder",
        role: "Professional Services",
    },
];

const AUTO_ROTATE_MS = 6500;

function ChevronArrow({ dir }: { dir: "prev" | "next" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-[18px] h-[18px]">
            {dir === "prev" ? (
                <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
                <path d="M9 6L15 12L9 18" strokeLinecap="round" strokeLinejoin="round" />
            )}
        </svg>
    );
}

export default function TestimonialsSection() {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const total = TESTIMONIALS.length;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => {
            setActive((p) => (p + 1) % total);
        }, AUTO_ROTATE_MS);
        return () => clearInterval(id);
    }, [paused, total]);

    const goPrev = () => setActive((p) => (p - 1 + total) % total);
    const goNext = () => setActive((p) => (p + 1) % total);

    return (
        <section
            ref={sectionRef}
            className="relative w-full px-6 py-20 md:py-28 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative z-10 mx-auto max-w-4xl">
                {/* Label */}
                <div className="mb-12 flex flex-col items-center text-center gap-4">
                    <div className="inline-flex items-center gap-3">
                        <span className="flex items-center">
                            <span className="animate-label-line" />
                            <span className="animate-label-dot" />
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">What clients say</p>
                    </div>
                </div>

                {/* Testimonial stage */}
                <div className="relative min-h-[280px] md:min-h-[240px] flex items-center justify-center">
                    {TESTIMONIALS.map((t, i) => {
                        const isActive = i === active;
                        return (
                            <div
                                key={t.company}
                                aria-hidden={!isActive}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? "translateY(0)" : "translateY(8px)",
                                    pointerEvents: isActive ? "auto" : "none",
                                    transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                            >
                                <blockquote className="text-2xl md:text-3xl font-medium leading-snug tracking-tight text-white max-w-3xl">
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="mt-10 flex flex-col items-center gap-1">
                                    <p className="text-sm font-semibold text-white/85">{t.author}</p>
                                    <p className="text-xs text-white/40">{t.role}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="mt-14 flex items-center justify-center gap-8">
                    <button
                        onClick={goPrev}
                        aria-label="Previous testimonial"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 hover:border-white/40 hover:text-white"
                    >
                        <ChevronArrow dir="prev" />
                    </button>

                    {/* Line indicators (not circles) */}
                    <div className="flex items-center gap-2.5">
                        {TESTIMONIALS.map((_, i) => {
                            const isActive = i === active;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    className="h-px transition-all duration-500"
                                    style={{
                                        width: isActive ? "32px" : "16px",
                                        background: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)",
                                    }}
                                />
                            );
                        })}
                    </div>

                    <button
                        onClick={goNext}
                        aria-label="Next testimonial"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 hover:border-white/40 hover:text-white"
                    >
                        <ChevronArrow dir="next" />
                    </button>
                </div>
            </div>
        </section>
    );
}

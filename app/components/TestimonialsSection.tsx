"use client";

import { useEffect, useRef, useState } from "react";
import SectionBeam from "@/app/components/SectionBeam";

const TESTIMONIALS = [
    {
        company: "SaaS",
        quote:
            "Levata didn't build us a website, they built a client acquisition system. Qualified leads tripled in 90 days.",
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
            className="home-theme-dark relative w-full px-6 py-20 md:py-28 overflow-hidden"
            style={{ background: "#07080F", color: "#F0F0F2" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 45% at 80% 20%, rgba(123, 85, 234,0.04) 0%, transparent 60%)",
                    ].join(", ")
                }} />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl">
                {/* Label */}
                <div className="mb-12 flex flex-col items-center text-center gap-5">
                    <SectionBeam />
                    <h2 className="display-section-title display-inline max-w-2xl text-center">
                        <span className="display-muted-line">Don&apos;t take our word for it. </span><span className="display-strong-line">What clients say.</span>
                    </h2>
                </div>

                {/* Testimonial stage */}
                <div className="relative min-h-[320px] sm:min-h-[280px] md:min-h-[240px] flex items-center justify-center">
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
                                <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug tracking-tight max-w-3xl" style={{ color: "#F0F0F2" }}>
                                    &ldquo;{t.quote}&rdquo;
                                </blockquote>
                                <div className="mt-10 flex flex-col items-center gap-1">
                                    <p className="text-sm font-semibold" style={{ color: "rgba(240,240,242,0.85)" }}>{t.author}</p>
                                    <p className="text-xs" style={{ color: "rgba(240,240,242,0.4)" }}>{t.role}</p>
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
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 hover:opacity-80"
                        style={{
                            background: "var(--home-control-bg, transparent)",
                            border: "1px solid var(--home-control-border, rgba(255,255,255,0.15))",
                            color: "var(--home-control-color, rgba(255,255,255,0.72))",
                        }}
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
                                        background: isActive ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.24)",
                                    }}
                                />
                            );
                        })}
                    </div>

                    <button
                        onClick={goNext}
                        aria-label="Next testimonial"
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 hover:opacity-80"
                        style={{
                            background: "var(--home-control-bg, transparent)",
                            border: "1px solid var(--home-control-border, rgba(255,255,255,0.15))",
                            color: "var(--home-control-color, rgba(255,255,255,0.72))",
                        }}
                    >
                        <ChevronArrow dir="next" />
                    </button>
                </div>
            </div>
        </section>
    );
}

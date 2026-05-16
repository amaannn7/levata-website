"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import HeroBubbles from "@/app/components/HeroBubbles";
import { useBookCall } from "@/app/components/BookCallProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Section label helper (matches the rest of the site) ───────────────────
function SectionLabel({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center gap-3">
            <span className="flex items-center">
                <span className="animate-label-line" />
                <span className="animate-label-dot" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{text}</p>
        </div>
    );
}

// ── Glassmorphism gradient-border wrapper ─────────────────────────────────
function GradientBorder({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="rounded-2xl p-px"
            style={{
                background:
                    "linear-gradient(135deg, rgba(114,200,245,0.5) 0%, rgba(255,255,255,0.08) 50%, rgba(155,47,255,0.5) 100%)",
            }}
        >
            <div
                className="rounded-[15px] backdrop-blur-xl"
                style={{
                    background: "rgba(6,0,20,0.7)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {children}
            </div>
        </div>
    );
}

// ── Card 1: AI Metrics + trend chart ──────────────────────────────────────
function CardAIMetrics() {
    return (
        <GradientBorder>
            <div className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                        AI Metrics
                    </p>
                    <span className="flex items-center gap-1.5">
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: "#3DFD98" }}
                        />
                        <span className="text-[9px] font-medium text-white/40">LIVE</span>
                    </span>
                </div>

                <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[20px] font-extrabold leading-none tracking-tight text-white">12</p>
                        <p className="mt-1 text-[10px] text-white/40">Active models</p>
                    </div>
                    <p className="text-[10px] text-white/40 text-right leading-tight">
                        <span className="font-semibold text-white/75">99.4%</span>
                        <br />
                        uptime
                    </p>
                </div>

                <div className="mt-2.5">
                    <svg viewBox="0 0 200 60" className="block w-full" style={{ height: 44 }} aria-hidden>
                        <defs>
                            <linearGradient id="card1Stroke" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#9B2FFF" />
                                <stop offset="100%" stopColor="#72C8F5" />
                            </linearGradient>
                            <linearGradient id="card1Fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#72C8F5" stopOpacity="0.22" />
                                <stop offset="100%" stopColor="#72C8F5" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 3" />
                        <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 3" />
                        <motion.polygon
                            points="0,55 20,48 40,50 60,42 80,36 100,32 120,26 140,22 160,16 180,12 200,8 200,60 0,60"
                            fill="url(#card1Fill)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.55, ease: "easeOut" }}
                        />
                        <motion.polyline
                            points="0,55 20,48 40,50 60,42 80,36 100,32 120,26 140,22 160,16 180,12 200,8"
                            fill="none"
                            stroke="url(#card1Stroke)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
                        />
                        <motion.circle
                            cx="200" cy="8" r="2.5" fill="#72C8F5"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.95, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="mt-1 flex items-center justify-between">
                        <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">30D ago</span>
                        <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">Now</span>
                    </div>
                </div>
            </div>
        </GradientBorder>
    );
}

// ── Card 2: Workflow Status mini-boxes ────────────────────────────────────
function CardWorkflow() {
    return (
        <GradientBorder>
            <div className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-white/85 leading-tight">Workflow status</p>
                    <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                        style={{
                            background: "rgba(61,253,152,0.12)",
                            border: "1px solid rgba(61,253,152,0.25)",
                            color: "rgba(61,253,152,0.9)",
                        }}
                    >
                        3/3 LIVE
                    </span>
                </div>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {[
                        { label: "Enrich", value: "234", unit: "Live" },
                        { label: "Email", value: "1.2k", unit: "Live" },
                        { label: "CRM", value: "892", unit: "Synced" },
                    ].map((box, i) => (
                        <motion.div
                            key={box.label}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45, delay: 0.9 + i * 0.1, ease: EASE }}
                            className="relative flex flex-col items-center justify-center rounded-md py-2"
                            style={{ border: "1px dashed rgba(255,255,255,0.18)" }}
                        >
                            <span
                                className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full"
                                style={{ background: "#3DFD98", boxShadow: "0 0 4px #3DFD98" }}
                            />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                                {box.label}
                            </span>
                            <span className="mt-0.5 text-[15px] font-extrabold leading-none tracking-tight text-white">
                                {box.value}
                            </span>
                            <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                {box.unit}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </GradientBorder>
    );
}

// ── Card 3: Revenue Uplift + gradient swatch ──────────────────────────────
function CardRevenue() {
    return (
        <GradientBorder>
            <div className="px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Revenue Uplift
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                    <motion.p
                        className="text-[24px] font-extrabold leading-none tracking-tight text-white"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 1.05, ease: EASE }}
                    >
                        +38%
                    </motion.p>
                    <motion.div
                        className="h-8 w-8 rounded-lg flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg, #9B2FFF 0%, #72C8F5 55%, #3DFD98 100%)",
                        }}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, delay: 1.15, ease: EASE }}
                    />
                </div>
                <p className="mt-2.5 text-[11px] leading-snug text-white/55">
                    Pipeline vs. last quarter.
                </p>
            </div>
        </GradientBorder>
    );
}

// ── Page hero ─────────────────────────────────────────────────────────────
export default function HomeHero() {
    const heroRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <section
            ref={heroRef}
            data-hero
            aria-labelledby="hero-heading"
            className="relative w-full overflow-hidden"
            style={{
                background: "radial-gradient(ellipse 120% 90% at 15% 50%, #18004A 0%, #0D0030 55%, #07001F 100%)",
                minHeight: "min(100vh, 920px)",
            }}
        >
            <HeroBubbles containerRef={heroRef} />
            {/* Content layer (left text / right cards) */}
            <div className="relative z-20 mx-auto grid min-h-[min(100vh,920px)] w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 md:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-0">

                {/* Left column — text + CTAs */}
                <div className="flex flex-col items-start text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                        className="mb-5 md:mb-6"
                    >
                        {/* Mobile eyebrow — plain uppercase */}
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 md:hidden">
                            Digital Solutions &amp; Software
                        </p>
                        {/* Desktop eyebrow — animated SectionLabel */}
                        <div className="hidden md:block">
                            <SectionLabel text="Digital Solutions & Software" />
                        </div>
                    </motion.div>

                    <motion.h1
                        id="hero-heading"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
                        className="max-w-2xl text-balance text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        {/* Mobile headline — same copy as desktop */}
                        <span className="md:hidden">
                            Your Business Deserves Intelligence,{" "}
                            <span className="jakarta-italic">Not Just Software.</span>
                        </span>
                        {/* Desktop headline */}
                        <span className="hidden md:inline">
                            Your Business Deserves Intelligence,
                            <br />
                            <span className="jakarta-italic">Not Just Software.</span>
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
                        className="mt-5 max-w-xl"
                    >
                        {/* Mobile subhead — same copy as desktop */}
                        <p className="text-sm leading-relaxed text-white/55 md:hidden">
                            Levata builds AI-powered systems, platforms, and automation that don&apos;t just support
                            your business — they transform it. We are the infrastructure partner for companies ready
                            to operate, compete, and grow at a different level.
                        </p>
                        {/* Desktop subhead */}
                        <p className="hidden text-sm leading-relaxed text-white/55 md:block md:text-base">
                            Levata builds AI-powered systems, platforms, and automation that don&apos;t just support
                            your business — they transform it. We are the infrastructure partner for companies ready
                            to operate, compete, and grow at a different level.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.46, ease: EASE }}
                        className="mt-8"
                    >
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 cursor-pointer sm:py-3.5"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.10), rgba(155,47,255,0.10))",
                                boxShadow: "0 0 10px rgba(114,200,245,0.12), 0 0 10px rgba(155,47,255,0.10), inset 0 0 0 1px rgba(114,200,245,0.22)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 24px rgba(114,200,245,0.34), 0 0 24px rgba(155,47,255,0.26), inset 0 0 0 1px rgba(114,200,245,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 10px rgba(114,200,245,0.12), 0 0 10px rgba(155,47,255,0.10), inset 0 0 0 1px rgba(114,200,245,0.22)";
                            }}
                        >
                            <span>Book a Strategy Call</span>
                            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    </motion.div>
                </div>

                {/* Right column — 3 stat cards compact floating panel */}
                <div className="relative hidden md:flex md:items-center w-full lg:max-w-[340px]" aria-hidden>
                    <motion.div
                        className="flex flex-col gap-2 w-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                        >
                            <CardAIMetrics />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                        >
                            <CardWorkflow />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                        >
                            <CardRevenue />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

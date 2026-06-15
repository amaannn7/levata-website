"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useBookCall } from "@/app/components/BookCallProvider";

const AIGlobe = dynamic(() => import("@/app/components/AIGlobe"), { ssr: false });
const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

// - Rotating word with gradient underline -
const ROTATING_WORDS = ["operates", "grows", "scales"];


function RotatingWord() {
    const INTERVAL = 2600;

    const [index, setIndex] = useState(0);
    const [sweepKey, setSweepKey] = useState(1);
    const [targetWidth, setTargetWidth] = useState<number | null>(null);

    const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);

    // Delay width update to match when new word starts entering (after exit anim ~500ms)
    useEffect(() => {
        if (targetWidth === null) {
            // initial mount -- set width and fire sweep immediately
            setTargetWidth(measureRefs.current[index]?.offsetWidth ?? null);
            setSweepKey(k => k + 1);
            return;
        }
        // Wait for exit animation to finish before resizing line
        const wt = setTimeout(() => {
            setTargetWidth(measureRefs.current[index]?.offsetWidth ?? null);
        }, 500);
        // Sweep fires as the new word lands
        const st = setTimeout(() => setSweepKey(k => k + 1), 550);
        return () => { clearTimeout(wt); clearTimeout(st); };
    }, [index]);

    useEffect(() => {
        const t = setInterval(() => {
            setIndex(i => (i + 1) % ROTATING_WORDS.length);
        }, INTERVAL);
        return () => clearInterval(t);
    }, []);

    return (
        <span className="relative inline-block align-baseline">
            {/* Reserve space for longest word */}
            <span className="invisible whitespace-nowrap">
                {ROTATING_WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}.
            </span>

            {/* Hidden measurers for all words */}
            {ROTATING_WORDS.map((w, i) => (
                <span
                    key={w}
                    ref={el => { measureRefs.current[i] = el; }}
                    aria-hidden
                    className="whitespace-nowrap"
                    style={{ position: "absolute", visibility: "hidden", top: 0, left: 0, pointerEvents: "none" }}
                >
                    {w}.
                </span>
            ))}

            {/* Rotating word */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={index}
                    initial={{ y: "0.85em", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-0.85em", opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute inset-0 whitespace-nowrap"
                >
                    {ROTATING_WORDS[index]}.
                </motion.span>
            </AnimatePresence>

            {/* Base line -- always visible */}
            <span
                aria-hidden
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: "-6px",
                    width: targetWidth ? `${targetWidth}px` : "100%",
                    height: "3px",
                    display: "block",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.1)",
                    transition: "width 1.2s cubic-bezier(0.25,1,0.5,1)",
                }}
            />

            {/* Color sweep -- fires when line extends */}
            <span
                key={sweepKey}
                aria-hidden
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: "-6px",
                    width: targetWidth ? `${targetWidth}px` : "100%",
                    height: "3px",
                    display: "block",
                    borderRadius: "9999px",
                    background: "linear-gradient(90deg, #00FFDD 0%, #7B55EA 50%, #CC01FF 100%)",
                    transition: "width 1.2s cubic-bezier(0.25,1,0.5,1)",
                    animation: "auroraFlowSweep 1.6s ease-in-out forwards",
                }}
            />
        </span>
    );
}

// - Glassmorphism gradient-border wrapper -
function GradientBorder({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="rounded-2xl p-px"
            style={{
                background:
                    "linear-gradient(135deg, rgba(123, 85, 234,0.5) 0%, rgba(255,255,255,0.08) 50%, rgba(123, 85, 234,0.5) 100%)",
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

// - Card 1: AI Metrics + trend chart -
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
                            style={{ background: "rgba(255,255,255,0.45)" }}
                        />
                        <span className="text-[9px] font-medium text-white/40">LIVE</span>
                    </span>
                </div>

                <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[20px] font-bold leading-none tracking-tight text-white">12</p>
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
                                <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0.75)" />
                            </linearGradient>
                            <linearGradient id="card1Fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" stopOpacity="1" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 3" />
                        <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 3" />
                        <motion.polygon
                            points="0,55 20,48 40,50 60,42 80,36 100,32 120,26 140,22 160,16 180,12 200,8 200,60 0,60"
                            fill="url(#card1Fill)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
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
                            transition={{ duration: 1.0, delay: 0.3, ease: EASE }}
                        />
                        <motion.circle
                            cx="200" cy="8" r="2.5" fill="rgba(255,255,255,0.85)"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.25, ease: "easeOut" }}
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

// - Card 2: Workflow Status mini-boxes -
function CardWorkflow() {
    return (
        <GradientBorder>
            <div className="px-3 py-2.5">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-white/85 leading-tight">Workflow status</p>
                    <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                        style={{
                            background: "rgba(123, 85, 234,0.12)",
                            border: "1px solid rgba(123, 85, 234,0.25)",
                            color: "rgba(123, 85, 234,0.9)",
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
                            transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: EASE }}
                            className="relative flex flex-col items-center justify-center rounded-md py-2"
                            style={{ border: "1px dashed rgba(255,255,255,0.18)" }}
                        >
                            <span
                                className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full"
                                style={{ background: "rgba(255,255,255,0.55)", boxShadow: "0 0 4px rgba(255,255,255,0.3)" }}
                            />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                                {box.label}
                            </span>
                            <span className="mt-0.5 text-[15px] font-bold leading-none tracking-tight text-white">
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

// - Card 3: Revenue Uplift + gradient swatch -
function CardRevenue() {
    return (
        <GradientBorder>
            <div className="px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Revenue Uplift
                </p>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                    <motion.p
                        className="text-[24px] font-bold leading-none tracking-tight text-white"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
                    >
                        +38%
                    </motion.p>
                    <motion.div
                        className="h-8 w-8 rounded-lg flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)",
                        }}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
                    />
                </div>
                <p className="mt-2.5 text-[11px] leading-snug text-white/55">
                    Pipeline vs. last quarter.
                </p>
            </div>
        </GradientBorder>
    );
}

// - Scroll indicator -
function ScrollIndicator() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => { if (window.scrollY > 40) setVisible(false); };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
            transition={{ duration: 0.6, delay: visible ? 0.9 : 0, ease: EASE }}
            className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 md:bottom-10"
        >
            {/* SCROLL label */}
            <span
                style={{
                    fontFamily: "var(--font-code), ui-monospace, monospace",
                    fontSize: "9px",
                    letterSpacing: "0.28em",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                }}
            >
                scroll
            </span>

            {/* Track line + traveling dot */}
            <div className="relative flex flex-col items-center" style={{ width: 1, height: 48 }}>
                {/* Static track */}
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgba(123,85,234,0.15), rgba(0,255,221,0.25), rgba(123,85,234,0.0))" }}
                />
                {/* First dot -- staggered */}
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 3, height: 3, left: -1, background: "rgba(0,255,221,0.9)", boxShadow: "0 0 6px rgba(0,255,221,0.8)" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
                />
                {/* Second dot -- offset */}
                <motion.div
                    className="absolute rounded-full"
                    style={{ width: 3, height: 3, left: -1, background: "rgba(123,85,234,0.9)", boxShadow: "0 0 6px rgba(123,85,234,0.8)" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.7, repeatDelay: 0.3 }}
                />
            </div>
        </motion.div>
    );
}

// - Page hero -
export default function HomeHero() {
    const heroRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <section
            ref={heroRef}
            data-hero
            aria-labelledby="hero-heading"
            className="home-theme-dark relative flex w-full flex-col justify-center overflow-hidden min-h-[88svh] lg:min-h-[90vh]"
        >
            {/* Subtle top-center accent glow */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: "radial-gradient(ellipse 70% 55% at 50% -5%, rgba(123, 85, 234,0.06) 0%, transparent 60%)" }}
            />

            {/* Mobile only -- small particle cloud floating in front of the text, centered, subtle */}
            <div
                aria-hidden
                className="pointer-events-none absolute z-30 md:hidden"
                style={{
                    top: "140px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(300px, 80vw)",
                    height: "min(300px, 80vw)",
                    opacity: 0.5,
                    mixBlendMode: "screen",
                }}
            >
                <AIGlobe />
            </div>

            {/* Content layer (left text / right globe) */}
            <div className="relative z-20 mx-auto grid w-full max-w-[1240px] items-center gap-10 px-8 py-16 sm:px-12 md:gap-8 md:py-20 lg:grid-cols-[1fr_380px] lg:gap-4 lg:min-h-[min(86vh,760px)] lg:px-16 lg:pt-10 lg:pb-0 xl:px-20">
                <div className="flex flex-col items-start text-left">
                    <motion.h1
                        id="hero-heading"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.05, ease: EASE }}
                        className="display-hero-title home-hero-title max-w-4xl"
                    >
                        <span className="display-muted-line xl:whitespace-nowrap">Custom intelligence for</span>
                        <span className="display-strong-line xl:whitespace-nowrap">
                            how your business <RotatingWord />
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                        className="mt-5 max-w-[480px]"
                    >
                        <p className="text-lead text-white/55">
                            Levata builds AI systems and automation that transform how your business operates, not just supports it.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                        className="mt-6"
                    >
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white cursor-pointer sm:py-3.5"
                            data-cta="primary"
                        >
                            Book a Consultation Call
                            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </button>
                    </motion.div>
                </div>

                {/* Right column -- AI Globe */}
                <div className="relative hidden md:flex md:items-center justify-center w-full lg:max-w-[360px]" aria-hidden>
                    <motion.div
                        className="w-full"
                        style={{ height: "380px" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                    >
                        <AIGlobe />
                    </motion.div>
                </div>
            </div>

            <ScrollIndicator />
            <HeroHorizon />
        </section>
    );
}

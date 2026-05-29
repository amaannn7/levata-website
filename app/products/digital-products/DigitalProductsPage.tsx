"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "#FFFFFF";
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Count-up hook ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const elRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.6 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!triggered) return;
        let raf: number;
        let start: number | null = null;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            setCount(Math.round(eased * target));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [triggered, target, duration]);
    return { count, elRef };
}

function KPI({ value, suffix, label, animate = true }: { value: number; suffix: string; label: string; animate?: boolean }) {
    const { count, elRef } = useCountUp(animate ? value : 0, 1800);
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <span ref={elRef} className="text-4xl sm:text-5xl font-bold leading-none tracking-tight md:text-7xl" style={{ color: GREEN }}>
                {animate ? count : value}{suffix}
            </span>
            <span className="max-w-[140px] text-[13px] font-medium leading-snug text-white/55 tracking-wide sm:max-w-[200px] sm:text-sm">{label}</span>
        </div>
    );
}

// ── Icons (all blue) ──────────────────────────────────────────────────────
function IconLightbulb() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0012 3z" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconBlocks() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
    );
}
function IconHourglass() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 3h12M6 21h12M8 3v3l4 6-4 6v3M16 3v3l-4 6 4 6v3" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
function IconShield() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconRefresh() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12a9 9 0 0115-6.7L21 8M21 4v4h-4M21 12a9 9 0 01-15 6.7L3 16M3 20v-4h4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5l2.2 2.2L8 3.2" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconChip() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
            <rect x="8" y="8" width="16" height="16" rx="2" stroke={BLUE} strokeWidth="1.6" />
            <rect x="12" y="12" width="8" height="8" rx="1" stroke={BLUE} strokeWidth="1.4" />
            <path d="M14 8V5M18 8V5M14 27V24M18 27V24M5 14H8M5 18H8M27 14H24M27 18H24" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────
const FAILURE_STAGES = [
    { num: "01", title: "Too slow", body: "By the time a standard agency delivers your MVP, the market has shifted and your assumptions have changed.", Icon: IconHourglass },
    { num: "02", title: "Wrong thing first", body: "Without validated scoping, teams build beautiful products nobody wants. Months of dev. Zero traction.", Icon: IconBlocks },
    { num: "03", title: "Technical debt", body: "Rushed MVPs create infrastructure that can't scale, requiring costly rebuilds just as you gain momentum.", Icon: IconRefresh },
];

const FRAMEWORK = [
    { title: "Validation-first", body: "We test demand before we write code. Real signal, real users." },
    { title: "AI-native architecture", body: "Intelligence woven into every layer, not bolted on as an afterthought." },
    { title: "Agile build cycles", body: "Two-week sprints, working software in your hands every fortnight." },
    { title: "Analytics integration", body: "Instrumented from day one. Every action measured, every funnel mapped." },
    { title: "Scale readiness", body: "Architecture built to compound, handles 10× growth without a rewrite." },
];

const BUILD_TIMELINE = [
    { num: "01", title: "Discovery", body: "Map the problem space, the user, the success metric." },
    { num: "02", title: "Prototype", body: "Clickable proof of concept in two weeks." },
    { num: "03", title: "Build", body: "Production sprints with continuous deploy." },
    { num: "04", title: "AI Integration", body: "Wire intelligence into the highest-leverage flows." },
    { num: "05", title: "Launch", body: "Shipped, instrumented, measured. Live in market." },
];

const PROCESS_STEPS = [
    { num: "01", title: "Discovery & Validation", body: "Pressure-test the idea against the market; define core value proposition and success metrics before building anything." },
    { num: "02", title: "Design Sprint & Prototype", body: "Clickable prototype tested with real target users, before a single line of production code is written." },
    { num: "03", title: "Agile Build Cycles", body: "2-week sprints, shipping working software continuously so you see real product at every stage." },
    { num: "04", title: "AI Integration Layer", body: "AI capabilities are architected and integrated during development, native to the product's core experience." },
    { num: "05", title: "Launch & Post-MVP Roadmap", body: "Managed deployment, analytics activation, and a prioritized roadmap based on real user behaviour." },
];

const FOUNDER_CONSIDERATIONS = [
    "Pivot strategy if the data points elsewhere",
    "Scalability path for 10× growth",
    "IP ownership and clean handover",
    "Launch strategy and go-to-market motion",
];

const FAQS = [
    { q: "What's included in an MVP and what's left for later?", a: "We scope collaboratively, the core feature set needed to validate your value proposition. Everything else is clearly documented in a post-MVP roadmap." },
    { q: "Will the MVP be scalable?", a: "Yes. We architect for scale from day one, infrastructure, codebase, and data architecture designed to support 10× and 100× growth without fundamental rebuilds." },
    { q: "Who owns the IP and code?", a: "You do, completely. All code, designs, and intellectual property are transferred to you in full at project completion. No lock-in." },
    { q: "What if we need to pivot after launch?", a: "Pivots happen, that's the nature of early-stage products. We build MVPs that are architecturally flexible and maintain post-launch partnerships to support and guide pivots when data demands them." },
];

// ── FAQ item ──────────────────────────────────────────────────────────────
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
            className="overflow-hidden rounded-2xl"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`,
                transition: "border-color 300ms ease",
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02]"
            >
                <span className="text-base font-semibold text-white md:text-lg">{q}</span>
                <span
                    aria-hidden
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-white/55 md:text-base">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DigitalProductsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#0E1014] overflow-hidden page-dividers">

            {/* ── 1. HERO ───────────────────────────────────── */}
            <section
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                                        <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">From concept to market.</span>
                        <span className="display-strong-line">Faster than you thought.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Validated, market-ready products built in weeks, without the 18-month timeline or six-figure burn.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            data-cta="primary"
                        >
                            Start Your Product Journey
                        </button>

                    </div>
                </motion.div>
                <HeroHorizon />
            </section>

            {/* ── 2. PROBLEM, Horizontal startup failure timeline ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Why most software</span>
                            <span className="display-strong-line">products fail to ship.</span>
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Three patterns we see in every failed build. Each one costs more than the last.
                        </p>
                    </motion.div>

                    {/* Timeline rail */}
                    <div className="relative">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{
                                top: "28px",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${BLUE}33 6%, ${BLUE}33 94%, transparent)`,
                            }}
                        />
                        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3">
                            {FAILURE_STAGES.map((stage, i) => (
                                <motion.div
                                    key={stage.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div
                                        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full md:h-14 md:w-14"
                                        style={{
                                            background: "#171A22",
                                            border: `1px solid ${GREEN}80`,
                                            boxShadow: `0 0 0 4px #0E1014, 0 0 20px ${GREEN}25`,
                                        }}
                                    >
                                        <span className="text-base font-bold md:text-lg" style={{ color: GREEN }}>{stage.num}</span>
                                    </div>
                                    <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${BLUE}14`, border: `1px solid ${BLUE}40` }}>
                                        <stage.Icon />
                                    </div>
                                    <h3 className="mt-3 text-base font-bold leading-snug text-white md:text-lg">{stage.title}</h3>
                                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-white/55 md:text-sm">{stage.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
                        className="mt-14 text-center text-sm text-white/45 md:text-base"
                    >
                        <span className="font-bold" style={{ color: GREEN }}>70%</span> of software MVPs fail at one of these stages, usually before a single real user gets value. The fix is validation-first, AI-native development.
                    </motion.p>
                </div>
            </section>

            {/* ── 3. APPROACH, Sticky left + scrolling right ─── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.7fr_1fr] md:gap-16 lg:gap-20 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-5 md:sticky md:top-32"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">We build products</span>
                                <span className="display-strong-line">that prove themselves.</span>
                            </h2>
                            <p className="max-w-md text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                Lean startup principles combined with AI-accelerated execution, shipping real product in weeks, not months, with AI built into every layer from day one.
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-5">
                            {FRAMEWORK.map((f, i) => (
                                <motion.div
                                    key={f.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    whileHover={{ y: -4 }}
                                    className="flex items-start gap-5 rounded-2xl p-6 md:p-7 transition-colors duration-300 hover:bg-white/[0.03]"
                                    style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${GREEN}14`, border: `1px solid ${GREEN}40` }}>
                                        <span className="text-sm font-bold" style={{ color: GREEN }}>{String(i + 1).padStart(2, "0")}</span>
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-bold text-white md:text-xl">{f.title}</h3>
                                        <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{f.body}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. MVP DEVELOPMENT, Editorial split layout ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:gap-12 items-start"
                    >
                        <div className="flex flex-col gap-4">
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Real product. Real users.</span>
                                <span className="display-strong-line">Six weeks.</span>
                            </h2>
                            <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                A focused MVP build that puts working software in front of real users fast, with the
                                architecture and instrumentation to scale once you have signal.
                            </p>
                        </div>
                        <div
                            className="hidden md:flex h-32 w-32 items-center justify-center rounded-2xl backdrop-blur-sm"
                            style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <IconChip />
                        </div>
                    </motion.div>

                    <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
                        {/* INCLUDED */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="flex flex-col gap-4 rounded-2xl p-6 md:p-7 backdrop-blur-sm"
                            style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Included</span>
                            <ul className="flex flex-col gap-3">
                                {["Product strategy and market validation workshop", "Feature scoping and priority matrix (core vs. post-MVP)", "UX/UI design, research-led and conversion-optimised", "Full-stack development (web and/or mobile)", "AI feature integration baked in from the start", "Analytics and user tracking from day one", "Production deployment, infrastructure setup, and post-launch roadmap"].map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-sm text-white">
                                        <span aria-hidden className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full" style={{ background: `${BLUE}14`, border: `1px solid ${BLUE}40` }}>
                                            <IconCheck />
                                        </span>
                                        <span className="leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* OUTCOMES, bigger card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                            className="flex flex-col gap-5 rounded-2xl p-7 md:p-8 backdrop-blur-sm md:row-span-1"
                            style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Outcomes</span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-bold leading-none md:text-6xl" style={{ color: GREEN }}>6–12</span>
                                <span className="text-lg font-medium text-white/55">wk</span>
                            </div>
                            <p className="text-sm leading-relaxed text-white/55">From kickoff to a live, instrumented MVP in front of real users.</p>
                        </motion.div>

                        {/* SUPPORT */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
                            className="flex flex-col gap-4 rounded-2xl p-6 md:p-7 backdrop-blur-sm"
                            style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Support</span>
                            <p className="text-sm leading-relaxed text-white/55">Post-launch optimisation, AI fine-tuning, and roadmap expansion baked into every engagement.</p>
                            <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" aria-hidden>
                                <line x1="10" y1="20" x2="190" y2="20" stroke={`${BLUE}33`} strokeWidth="1" strokeDasharray="3 3" />
                                {[20, 60, 100, 140, 180].map((cx) => (
                                    <circle key={cx} cx={cx} cy="20" r="3" fill={BLUE} />
                                ))}
                            </svg>
                        </motion.div>
                    </div>

                    {/* Build timeline strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mt-16"
                    >
                        <div className="mb-8 flex flex-col items-center text-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Build timeline</span>
                            <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">
                                Discovery → Prototype → Build → AI → Launch
                            </h3>
                        </div>
                        <div className="relative">
                            <div
                                aria-hidden
                                className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                                style={{
                                    top: "20px",
                                    height: "1px",
                                    background: `linear-gradient(to right, transparent, ${BLUE}33 6%, ${BLUE}33 94%, transparent)`,
                                }}
                            />
                            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                                {BUILD_TIMELINE.map((s, i) => (
                                    <motion.div
                                        key={s.num}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                                        className="flex flex-col items-center text-center"
                                    >
                                        <div
                                            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full"
                                            style={{
                                                background: "#171A22",
                                                border: `1px solid ${GREEN}80`,
                                                boxShadow: "0 0 0 4px #0E1014",
                                            }}
                                        >
                                            <span className="text-xs font-bold" style={{ color: GREEN }}>{s.num}</span>
                                        </div>
                                        <p className="mt-3 text-sm font-bold text-white">{s.title}</p>
                                        <p className="mt-1 max-w-[140px] text-xs leading-relaxed text-white/45">{s.body}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 5. OUTCOMES, 2×2 oversized KPI grid ──────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(123, 85, 234,0.05) 0%, transparent 65%)",
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The numbers founders</span>
                            <span className="display-strong-line">actually care about.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-y-14 gap-x-8 md:gap-x-12">
                        <KPI value={6} suffix="–12wk" label="Average kick-off to launch" />
                        <KPI value={70} suffix="%" label="Reduction in time-to-market" />
                        <KPI value={100} suffix="%" label="Of MVPs built AI-ready" animate={false} />
                        <KPI value={3} suffix="×" label="Higher retention in AI-native products" />
                    </div>
                </div>
            </section>

            {/* ── 6. DELIVERY PROCESS, Vertical process journey ── */}
            <section id="process" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">From signed kickoff</span>
                            <span className="display-strong-line">to shipped product.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.55fr_1fr] md:gap-16 items-start">
                        {/* Sticky progress timeline */}
                        <div className="hidden md:flex md:sticky md:top-32 flex-col gap-3">
                            {PROCESS_STEPS.map((s, i) => (
                                <div key={s.num} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "#171A22", border: `1px solid ${GREEN}80` }}>
                                        <span className="text-[10px] font-bold" style={{ color: GREEN }}>{s.num}</span>
                                    </div>
                                    <span className="text-sm font-medium text-white/65">{s.title}</span>
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <span aria-hidden className="ml-3 text-white/20">→</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Process panels */}
                        <div className="flex flex-col gap-5">
                            {PROCESS_STEPS.map((s, i) => (
                                <motion.div
                                    key={s.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    className="flex flex-col gap-4 rounded-2xl p-7 md:p-8"
                                    style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-3xl font-black leading-none md:text-4xl" style={{ color: GREEN }}>{s.num}</span>
                                        <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">{s.title}</h3>
                                    </div>
                                    <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{s.body}</p>
                                    <svg width="100%" height="32" viewBox="0 0 320 32" fill="none" aria-hidden>
                                        <line x1="10" y1="16" x2="310" y2="16" stroke={`${BLUE}22`} strokeWidth="1" strokeDasharray="3 3" />
                                        {[40, 100, 160, 220, 280].map((cx, idx) => (
                                            <circle key={cx} cx={cx} cy="16" r={idx === i ? 4 : 2.5} fill={idx === i ? GREEN : BLUE} opacity={idx === i ? 1 : 0.4} />
                                        ))}
                                    </svg>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-20 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-12 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Founder questions,</span>
                            <span className="display-strong-line">answered.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-3">
                        {FAQS.map((f, i) => (
                            <FAQItem
                                key={f.q}
                                q={f.q}
                                a={f.a}
                                index={i}
                                isOpen={openFaq === i}
                                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. FINAL CTA ──────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <CTAAurora variant={1} />
                <div aria-hidden className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.5), transparent)" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                                        <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Your idea deserves better</span>
                        <span className="display-strong-line">than a long quote.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                        Go from concept to market in weeks, with AI built in from day one.
                    </p>
                    <div className="flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            data-cta="primary"
                        >
                            Start Your Product Journey
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

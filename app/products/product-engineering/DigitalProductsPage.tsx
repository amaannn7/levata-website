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
const NEW_PROCESS_STEPS = [
    {
        num: "01",
        title: "Validate",
        body: "We assess market opportunities, user needs, and product assumptions to identify what should be built before development begins.",
    },
    {
        num: "02",
        title: "Define",
        body: "We shape product strategy, functionality, and user experience to create a clear roadmap for development.",
    },
    {
        num: "03",
        title: "Build",
        body: "We design and develop market-ready digital products with the flexibility and scalability to support future growth.",
    },
    {
        num: "04",
        title: "Optimise",
        body: "We refine and enhance products based on user feedback, performance data, and evolving business requirements.",
    },
];

const NEW_SERVICES = [
    {
        num: "01",
        title: "MVP Development",
        eyebrow: "Validation comes before scale.",
        body: "We develop MVPs that help businesses test assumptions, prove demand, and gain market insight before committing to full-scale product development. The result is faster learning, reduced risk, and a clearer path toward building products that the market genuinely wants.",
        bullets: [
            "Product strategy and validation",
            "MVP scoping and prioritisation",
            "User experience and interface design",
            "Product development",
            "Analytics and performance tracking",
            "Launch preparation and growth roadmap",
        ],
    },
    {
        num: "02",
        title: "SaaS Product Development",
        eyebrow: "Software that delivers lasting value.",
        body: "We design and develop SaaS products that are built for growth from day one. By combining thoughtful product strategy, scalable engineering, and user-focused design, we help businesses create software platforms that can evolve, adapt, and grow with market demand.",
        bullets: [
            "Product strategy and planning",
            "SaaS architecture and design",
            "User experience and interface design",
            "Full-stack product development",
            "Infrastructure and integrations",
            "Product optimisation and roadmap planning",
        ],
    },
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

const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";

// ── Product Problem visual ────────────────────────────────────────────────
function ProductProblemVisual() {
    const stages = [
        { cx: 90,  label: "No validation", sub: "Build starts", icon: "?" },
        { cx: 240, label: "Wrong scope",    sub: "Months in",   icon: "✕" },
        { cx: 390, label: "Technical debt", sub: "At launch",   icon: "!" },
    ];
    return (
        <div className="relative mx-auto w-full max-w-xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Where products fail</p>
            <svg viewBox="0 0 480 290" className="block h-auto w-full" fill="none">
                <defs>
                    <filter id="pp_glow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {/* Spine */}
                <motion.line x1="40" y1="148" x2="440" y2="148"
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                />
                {/* Declining momentum curve */}
                <motion.path d="M40 100 Q160 110 240 148 Q320 185 440 220"
                    stroke="rgba(255,80,80,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="5 4"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                />
                {stages.map((s, i) => (
                    <motion.g key={s.label}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: 0.15 + i * 0.14, ease: EASE }}
                    >
                        {/* Outer ring */}
                        <circle cx={s.cx} cy="148" r="30"
                            fill="rgba(10,14,28,0.0)" stroke="rgba(255,80,80,0.12)" strokeWidth="1" />
                        {/* Node */}
                        <circle cx={s.cx} cy="148" r="22"
                            fill="rgba(10,14,28,0.98)" stroke="rgba(255,80,80,0.35)" strokeWidth="1.2" />
                        {/* Icon */}
                        <text x={s.cx} y="154"
                            textAnchor="middle" fontFamily={MONO} fontSize="14" fontWeight="700"
                            fill="rgba(255,80,80,0.7)">{s.icon}
                        </text>
                        {/* Label above */}
                        <text x={s.cx} y="100"
                            textAnchor="middle" fontSize="10.5" fontWeight="600"
                            fill="rgba(255,255,255,0.75)">{s.label}
                        </text>
                        {/* Sub below */}
                        <text x={s.cx} y="114"
                            textAnchor="middle" fontFamily={MONO} fontSize="8" letterSpacing="0.08em"
                            fill="rgba(255,255,255,0.3)">{s.sub}
                        </text>
                        {/* Connector to label */}
                        <line x1={s.cx} y1="118" x2={s.cx} y2="126"
                            stroke="rgba(255,80,80,0.2)" strokeWidth="1" />
                        {/* Step number */}
                        <text x={s.cx} y="196"
                            textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700"
                            letterSpacing="0.16em" fill="rgba(123,85,234,0.5)">
                            {String(i + 1).padStart(2, "0")}
                        </text>
                    </motion.g>
                ))}
                {/* Budget drain bar */}
                <motion.g
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
                >
                    <rect x="70" y="228" width="340" height="6" rx="3" fill="rgba(255,255,255,0.04)" />
                    <motion.rect x="70" y="228" width="340" height="6" rx="3"
                        fill="rgba(255,80,80,0.35)"
                        style={{ transformOrigin: "70px 231px", scaleX: 0 }}
                        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1.0, delay: 0.9, ease: EASE }}
                    />
                    <text x="240" y="252"
                        textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700"
                        letterSpacing="0.18em" fill="rgba(255,80,80,0.5)">RUNWAY LOST
                    </text>
                    <text x="240" y="268"
                        textAnchor="middle" fontFamily={MONO} fontSize="7.5"
                        letterSpacing="0.12em" fill="rgba(255,255,255,0.2)">TIME · BUDGET · MOMENTUM
                    </text>
                </motion.g>
            </svg>
        </div>
    );
}

// ── MVP Development visual ────────────────────────────────────────────────
function MVPVisual() {
    const steps = [
        { label: "Idea", sub: "Assumption" },
        { label: "Validate", sub: "Real signal" },
        { label: "Scope", sub: "Core only" },
        { label: "Build", sub: "Sprints" },
        { label: "Launch", sub: "Live users" },
    ];
    const cx = [60, 150, 240, 330, 420];
    const cy = 120;

    return (
        <div className="relative mx-auto w-full max-w-xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Validation path</p>
            <svg viewBox="0 0 480 240" className="block h-auto w-full" fill="none">
                <defs>
                    <filter id="mvp_glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Connecting spine */}
                {cx.slice(0, -1).map((x, i) => (
                    <motion.line
                        key={`spine-${i}`}
                        x1={x + 18} y1={cy} x2={cx[i + 1] - 18} y2={cy}
                        stroke="rgba(123,85,234,0.18)" strokeWidth="1" strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: EASE }}
                    />
                ))}

                {/* Animated travel dot */}
                <motion.circle
                    r="3" fill="rgba(123,85,234,0.9)" filter="url(#mvp_glow)"
                    initial={{ opacity: 0 }}
                    whileInView={{
                        cx: [cx[0], cx[1], cx[2], cx[3], cx[4]],
                        cy: [cy, cy, cy, cy, cy],
                        opacity: [0, 1, 1, 1, 1],
                    }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 2.4, delay: 1.2, ease: "easeInOut" }}
                />

                {steps.map((s, i) => {
                    const isLast = i === steps.length - 1;
                    return (
                        <motion.g key={s.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                        >
                            {/* Outer glow ring for last node */}
                            {isLast && (
                                <motion.circle cx={cx[i]} cy={cy} r="24"
                                    fill="rgba(123,85,234,0.06)" stroke="rgba(123,85,234,0.2)" strokeWidth="1"
                                    animate={{ r: [22, 28, 22], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                            {/* Node circle */}
                            <circle cx={cx[i]} cy={cy} r="17"
                                fill="rgba(10,14,28,0.98)"
                                stroke={isLast ? "rgba(123,85,234,0.85)" : "rgba(123,85,234,0.3)"}
                                strokeWidth={isLast ? "1.5" : "1"}
                            />
                            {/* Inner dot */}
                            <circle cx={cx[i]} cy={cy} r="4"
                                fill={isLast ? "rgba(123,85,234,0.95)" : "rgba(123,85,234,0.45)"}
                            />
                            {/* Step number */}
                            <text x={cx[i]} y={cy - 26}
                                textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700"
                                letterSpacing="0.16em" fill="rgba(123,85,234,0.7)">
                                {String(i + 1).padStart(2, "0")}
                            </text>
                            {/* Label */}
                            <text x={cx[i]} y={cy + 33}
                                textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700"
                                letterSpacing="0.1em"
                                fill={isLast ? "rgba(123,85,234,0.95)" : "rgba(255,255,255,0.75)"}>
                                {s.label}
                            </text>
                            {/* Sub */}
                            <text x={cx[i]} y={cy + 46}
                                textAnchor="middle" fontFamily={MONO} fontSize="7.5"
                                letterSpacing="0.08em" fill="rgba(255,255,255,0.35)">
                                {s.sub}
                            </text>
                        </motion.g>
                    );
                })}

                {/* Outcome chip */}
                <motion.g
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
                >
                    <rect x="155" y="190" width="170" height="26" rx="13"
                        fill="rgba(123,85,234,0.07)" stroke="rgba(123,85,234,0.25)" strokeWidth="1" />
                    <circle cx="174" cy="203" r="3" fill="rgba(123,85,234,0.9)" />
                    <text x="250" y="207" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700"
                        letterSpacing="0.18em" fill="rgba(123,85,234,0.85)">VALIDATED MVP</text>
                </motion.g>
            </svg>
        </div>
    );
}

// ── SaaS Product visual ───────────────────────────────────────────────────
function SaaSVisual() {
    const layers = [
        { label: "USER INTERFACE", sub: "Design · UX · Flows", accent: 0.9 },
        { label: "APPLICATION", sub: "Logic · APIs · Auth", accent: 0.65 },
        { label: "INTEGRATIONS", sub: "3rd-party · Webhooks", accent: 0.45 },
        { label: "DATA LAYER", sub: "Database · Storage", accent: 0.28 },
    ];
    const barY = (i: number) => 50 + i * 58;
    const barW = 320;
    const barX = 20;

    return (
        <div className="relative mx-auto w-full max-w-xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Product architecture</p>
            <svg viewBox="0 0 360 310" className="block h-auto w-full" fill="none">
                <defs>
                    <filter id="saas_glow">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Connection lines between layers */}
                {layers.slice(0, -1).map((_, i) => (
                    <motion.g key={`conn-${i}`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.1, ease: EASE }}
                    >
                        <line x1={barX + barW * 0.35} y1={barY(i) + 20} x2={barX + barW * 0.35} y2={barY(i + 1) - 2}
                            stroke="rgba(123,85,234,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1={barX + barW * 0.65} y1={barY(i) + 20} x2={barX + barW * 0.65} y2={barY(i + 1) - 2}
                            stroke="rgba(123,85,234,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                    </motion.g>
                ))}

                {layers.map((layer, i) => (
                    <motion.g key={layer.label}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.55, delay: 0.1 + i * 0.11, ease: EASE }}
                    >
                        {/* Bar background */}
                        <rect x={barX} y={barY(i) - 2} width={barW} height="40" rx="7"
                            fill="rgba(10,14,28,0.98)"
                            stroke={`rgba(123,85,234,${layer.accent * 0.28})`}
                            strokeWidth="1.2"
                        />
                        {/* Left accent bar */}
                        <rect x={barX} y={barY(i) - 2} width="3" height="40" rx="1.5"
                            fill={`rgba(123,85,234,${layer.accent * 0.8})`}
                        />
                        {/* Pulsing dot for top layer */}
                        {i === 0 && (
                            <motion.circle cx={barX + 18} cy={barY(i) + 18} r="4"
                                fill="rgba(123,85,234,0.9)" filter="url(#saas_glow)"
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                        {i > 0 && (
                            <circle cx={barX + 18} cy={barY(i) + 18} r="3.5"
                                fill={`rgba(123,85,234,${layer.accent * 0.7})`}
                            />
                        )}
                        {/* Label */}
                        <text x={barX + 34} y={barY(i) + 14}
                            fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.18em"
                            fill={`rgba(255,255,255,${0.45 + layer.accent * 0.55})`}>
                            {layer.label}
                        </text>
                        {/* Sub */}
                        <text x={barX + 34} y={barY(i) + 28}
                            fontFamily={MONO} fontSize="8" letterSpacing="0.1em"
                            fill={`rgba(255,255,255,${layer.accent * 0.55})`}>
                            {layer.sub}
                        </text>
                        {/* Right scale badge */}
                        <rect x={barX + barW - 68} y={barY(i) + 8} width="58" height="18" rx="9"
                            fill={`rgba(123,85,234,${layer.accent * 0.08})`}
                            stroke={`rgba(123,85,234,${layer.accent * 0.2})`}
                            strokeWidth="0.8"
                        />
                        <text x={barX + barW - 39} y={barY(i) + 21}
                            textAnchor="middle" fontFamily={MONO} fontSize="7" fontWeight="700" letterSpacing="0.14em"
                            fill={`rgba(123,85,234,${layer.accent * 0.9})`}>
                            {["SCALABLE", "MODULAR", "FLEXIBLE", "RELIABLE"][i]}
                        </text>
                    </motion.g>
                ))}

                {/* Growth arrow at bottom */}
                <motion.g
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
                >
                    <motion.path
                        d="M50 278 Q180 260 310 278"
                        stroke="rgba(123,85,234,0.3)" strokeWidth="1.2" fill="none"
                        strokeDasharray="5 4"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 1, delay: 0.8, ease: EASE }}
                    />
                    <path d="M306 274 L312 278 L306 282" stroke="rgba(123,85,234,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="180" y="296" textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700"
                        letterSpacing="0.2em" fill="rgba(123,85,234,0.45)">BUILT TO GROW</text>
                </motion.g>
            </svg>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DigitalProductsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#0E1014] overflow-hidden page-dividers">

            {/* ── 1. HERO ── */}
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
                        <span className="display-muted-line">Most products burn runway.</span>
                        <span className="display-strong-line">Ours buy you traction.</span>
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        We help founders and businesses test assumptions, validate market demand, and transform
                        ideas into market-ready digital products through strategic design and scalable engineering.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            data-cta="primary"
                        >
                            Start your product journey today
                        </button>
                    </div>
                </motion.div>
                <HeroHorizon intensity="strong" />
            </section>

            {/* ── 2. PROBLEM ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 55% 60% at 15% 40%, rgba(255,80,80,0.05) 0%, transparent 65%)",
                        "radial-gradient(ellipse 45% 55% at 85% 60%, rgba(123,85,234,0.05) 0%, transparent 65%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20 md:items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-6"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Most products fail</span>
                                <span className="display-strong-line">before they launch.</span>
                            </h2>
                            <p className="text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                Businesses often begin development before validating demand, testing assumptions,
                                or defining the right product strategy. By launch, valuable time, budget, and
                                momentum have already been lost.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                        >
                            <ProductProblemVisual />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 3. SOLUTION ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(123,85,234,0.08) 0%, transparent 65%)",
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-20 md:items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-5"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Validate first.</span>
                                <span className="display-strong-line">Build second.</span>
                            </h2>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="flex flex-col gap-5"
                        >
                            <p className="text-base leading-relaxed text-white/65 md:text-[1.05rem]">
                                The most successful products are not built on assumptions. By validating demand,
                                testing ideas, and refining priorities early, businesses can reduce risk, move
                                faster, and invest with greater confidence.
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 md:mt-20"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {[
                            { title: "Reduce Risk",            desc: "Validate before you commit budget to building." },
                            { title: "Move Faster",            desc: "From idea to live product in weeks, not months." },
                            { title: "Validate Demand",        desc: "Real user signal before a line of production code." },
                            { title: "Invest with Confidence", desc: "Every decision backed by data, not assumption." },
                        ].map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: EASE }}
                                className="flex flex-col gap-2 pt-10 pb-7 px-6"
                                style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                            >
                                <p className="text-sm font-semibold text-white leading-snug md:text-base">{p.title}</p>
                                <p className="text-[13px] leading-relaxed text-white/40">{p.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── 4. OUR PROCESS ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123,85,234,0.06) 0%, transparent 70%)",
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-12 flex flex-col items-center gap-5 text-center md:mb-16"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">How products</span>
                            <span className="display-strong-line">get built.</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                    >
                        {/* Desktop: horizontal flow */}
                        <div className="hidden items-start justify-center gap-0 md:flex">
                            {NEW_PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex items-start">
                                    <div className="flex w-36 flex-col items-center gap-4 text-center">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(123,85,234,0.6)" }}>{step.num}</span>
                                        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)", boxShadow: "0 12px 36px rgba(123,85,234,0.15)" }}>
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" /><line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" /></svg>}
                                                {i === 1 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 3h6M9 3a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2M9 3v0M8 10h8M8 14h6M8 18h4" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                                                {i === 2 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><circle cx="19" cy="16" r="3" stroke="rgba(0,255,221,0.55)" strokeWidth="1.3" /><path d="M18 16l.7.7 1.3-1.4" stroke="rgba(0,255,221,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                {i === 3 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><path d="M3 11L8 6L13 9L20 3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 3h3v3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">{step.title}</h3>
                                        <p className="text-xs leading-relaxed md:text-sm" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "140px" }}>{step.body}</p>
                                    </div>
                                    {i < NEW_PROCESS_STEPS.length - 1 && (
                                        <div className="flex w-16 flex-shrink-0 items-center" aria-hidden style={{ marginTop: "74px" }}>
                                            <div className="relative flex w-full items-center">
                                                <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(123,85,234,0.25), rgba(123,85,234,0.5), rgba(123,85,234,0.25))" }} />
                                                <svg className="-ml-px flex-shrink-0" width="7" height="12" viewBox="0 0 7 12" fill="none">
                                                    <path d="M1 1L6 6L1 11" stroke="rgba(123,85,234,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <motion.div className="absolute h-1.5 w-1.5 rounded-full"
                                                    style={{ top: "50%", marginTop: "-3px", background: "rgba(123,85,234,0.9)", boxShadow: "0 0 6px rgba(123,85,234,0.7)" }}
                                                    initial={{ left: 0 }} animate={{ left: "calc(100% - 8px)" }}
                                                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Mobile: vertical flow */}
                        <div className="flex flex-col items-center gap-2 md:hidden">
                            {NEW_PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex flex-col items-center">
                                    <div className="flex w-36 flex-col items-center gap-4 text-center">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(123,85,234,0.6)" }}>{step.num}</span>
                                        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)", boxShadow: "0 12px 36px rgba(123,85,234,0.15)" }}>
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" /><line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" /></svg>}
                                                {i === 1 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 3h6M9 3a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2M8 10h8M8 14h6M8 18h4" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                                                {i === 2 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /></svg>}
                                                {i === 3 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /></svg>}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-semibold tracking-tight text-white">{step.title}</h3>
                                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "200px" }}>{step.body}</p>
                                    </div>
                                    {i < NEW_PROCESS_STEPS.length - 1 && (
                                        <div className="flex justify-center py-1" aria-hidden>
                                            <div className="relative flex flex-col items-center" style={{ height: "52px", width: "2px" }}>
                                                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(123,85,234,0.15), rgba(123,85,234,0.35), rgba(123,85,234,0.15))" }} />
                                                <motion.div className="absolute -left-[3px] h-2 w-2 rounded-full"
                                                    style={{ background: "rgba(123,85,234,0.9)", boxShadow: "0 0 8px rgba(123,85,234,0.7)" }}
                                                    initial={{ top: 0 }} animate={{ top: "calc(100% - 8px)" }}
                                                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 5. OUR SERVICES ── */}
            <section id="services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-12 flex flex-col items-center gap-5 text-center md:mb-16"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Two product</span>
                            <span className="display-strong-line">layers we build.</span>
                        </h2>
                    </motion.div>
                    <div className="flex flex-col gap-14 md:gap-20">
                        {NEW_SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-20 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-lg font-bold leading-none tabular-nums" style={{ color: GREEN }}>{svc.num}.</span>
                                            <h3 className="text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">{svc.title}</h3>
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">{svc.eyebrow}</p>
                                        <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">{svc.body}</p>
                                        <div className="mt-2 flex flex-col gap-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">What&apos;s included</p>
                                            <ul className="flex flex-col gap-2.5">
                                                {svc.bullets.map((b) => (
                                                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/75">
                                                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                                            style={{ background: "rgba(0,255,221,0.07)", border: "1px solid rgba(0,255,221,0.30)" }}>
                                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                                                                <path d="M2 5l2.2 2.2L8 3.2" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {/* visual */}
                                    {i === 0 ? <MVPVisual /> : <SaaSVisual />}
                                </motion.div>
                            );
                        })}
                    </div>
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

                    <div className="relative mx-auto max-w-3xl">
                        {/* Vertical spine */}
                        <div
                            aria-hidden
                            className="absolute left-1/2 top-0 bottom-0 hidden md:block"
                            style={{ width: 1, transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, rgba(123,85,234,0.25) 8%, rgba(123,85,234,0.25) 92%, transparent)" }}
                        />

                        <div className="flex flex-col gap-0">
                            {PROCESS_STEPS.map((s, i) => {
                                const isRight = i % 2 === 0;
                                return (
                                    <motion.div
                                        key={s.num}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                                        className="relative grid grid-cols-1 md:grid-cols-2 md:gap-8 pb-12 last:pb-0"
                                    >
                                        {/* Centre node */}
                                        <div
                                            aria-hidden
                                            className="absolute left-1/2 top-0 z-10 hidden md:flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full"
                                            style={{ background: "#0E1014", border: "1.5px solid rgba(255,255,255,0.35)", boxShadow: "0 0 0 4px #0E1014, 0 0 16px rgba(255,255,255,0.1)" }}
                                        >
                                            <span className="text-[10px] font-bold" style={{ fontFamily: "var(--font-code)", letterSpacing: "0.1em", color: "rgba(255,255,255,0.85)" }}>{s.num}</span>
                                        </div>

                                        {/* Content — right side on even, left side on odd (desktop) */}
                                        {isRight ? (
                                            <>
                                                <div className="hidden md:block" /> {/* empty left cell */}
                                                <div className="flex flex-col gap-2 md:pl-6">
                                                    <div className="flex items-center gap-3 md:hidden mb-2">
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "#0E1014", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                                                            <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{s.num}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-base font-semibold text-white leading-snug md:text-lg">{s.title}</h3>
                                                    <p className="text-sm leading-relaxed text-white/50 md:text-[15px]">{s.body}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex flex-col gap-2 md:pr-6 md:text-right">
                                                    <div className="flex items-center gap-3 md:hidden mb-2">
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "#0E1014", border: "1.5px solid rgba(255,255,255,0.3)" }}>
                                                            <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{s.num}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-base font-semibold text-white leading-snug md:text-lg">{s.title}</h3>
                                                    <p className="text-sm leading-relaxed text-white/50 md:text-[15px]">{s.body}</p>
                                                </div>
                                                <div className="hidden md:block" /> {/* empty right cell */}
                                            </>
                                        )}
                                    </motion.div>
                                );
                            })}
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
                <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
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

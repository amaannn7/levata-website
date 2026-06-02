"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import WhatWeBuildVisual from "@/app/components/WhatWeBuildVisual";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "#FFFFFF";
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
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

// ── Icons (all blue) ──────────────────────────────────────────────────────
function IconDownArrow() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 4v14M6 12l6 6 6-6" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconGlobe() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke={BLUE} strokeWidth="1.5" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke={BLUE} strokeWidth="1.5" />
        </svg>
    );
}
function IconLayers() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3L3 8l9 5 9-5-9-5z" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 13l9 5 9-5M3 18l9 5 9-5" stroke={BLUE} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}
function IconCart() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 4h2l3 12h11l2-8H6" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.5" stroke={BLUE} strokeWidth="1.5" />
            <circle cx="18" cy="20" r="1.5" stroke={BLUE} strokeWidth="1.5" />
        </svg>
    );
}
function IconCog() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="3" stroke={BLUE} strokeWidth="1.5" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" />
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
function IconSpark({ flat = false }: { flat?: boolean }) {
    const path = flat
        ? "M2 14 L8 12 L14 13 L20 10 L26 11 L32 8"
        : "M2 14 L8 10 L14 12 L20 6 L26 8 L32 3";
    return (
        <svg width="48" height="20" viewBox="0 0 34 18" fill="none" aria-hidden>
            <path d={path} stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────
const LEAKAGE = [
    { num: "01", title: "Beautiful but passive websites", body: "They look good and get ignored in the market. No conversion architecture, no intelligence, no measurable revenue impact." },
    { num: "02", title: "Platforms that can't handle growth", body: "Built for today, not tomorrow. When you scale, performance degrades and the whole thing needs expensive remediation." },
    { num: "03", title: "E-commerce leaving money on the table", body: "Without AI-driven personalisation and conversion-optimised UX, your store is operating at half capacity." },
];

const PROCESS_STEPS = [
    {
        num: "01",
        title: "Assess",
        body: "We analyse your business, users, systems, and challenges to identify the infrastructure required to support growth and performance.",
    },
    {
        num: "02",
        title: "Architect",
        body: "We design a digital infrastructure strategy tailored to your business, ensuring every solution aligns with operational goals and growth objectives.",
    },
    {
        num: "03",
        title: "Build",
        body: "We develop scalable digital systems, platforms, and experiences that support customers, operations, and long-term growth.",
    },
    {
        num: "04",
        title: "Optimise",
        body: "We continuously refine and improve performance as your business evolves, ensuring your infrastructure scales alongside growth.",
    },
];

const SUB_SERVICES = [
    {
        num: "01",
        title: "Website Development",
        eyebrow: "Your Most Important Sales Asset, Re-engineered",
        body: "We build websites designed to drive action. Every design decision and user journey is shaped by conversion psychology and AI-driven insights. From landing pages to full-scale brand websites, we combine strategy, UX, design, development, CMS integration, and performance tracking into one cohesive solution.",
        bullets: [
            "Conversion-focused strategy and user experience",
            "Custom website design",
            "High-performance website development",
            "CMS setup and team onboarding",
            "Technical setup",
            "Analytics and performance tracking",
        ],
        visual: "website" as const,
    },
    {
        num: "02",
        title: "E-commerce Development",
        eyebrow: "Revenue-Engineered Online Stores",
        body: "Ecommerce is more than a sales channel. It is a critical part of how customers experience your brand. From product discovery to post-purchase engagement, every touchpoint is designed to make buying easier, strengthen customer relationships, and support long-term growth.",
        bullets: [
            "Ecommerce strategy and store design",
            "Checkout and payment setup",
            "Product discovery and search experience",
            "Inventory and operational integrations",
            "Customer communication automation",
            "Analytics and performance tracking",
        ],
        visual: "ecommerce" as const,
    },
    {
        num: "03",
        title: "Platform Development",
        eyebrow: "Scalable Infrastructure for Complex Operations",
        body: "Client portals, internal systems, and custom business platforms engineered around your operational requirements. Designed to improve efficiency, streamline processes, and create a scalable foundation for growth.",
        bullets: [
            "Platform planning and architecture",
            "User experience and interface design",
            "Custom platform development",
            "Database and system setup",
            "User access and security management",
            "Third-party integrations and testing",
        ],
        visual: "platform" as const,
    },
];

const OUTCOME_METRICS = [
    { value: 3, suffix: "×", label: "Avg conversion rate improvement" },
    { value: 99.9, suffix: "%", label: "Uptime SLA on all platforms", decimals: 1 },
    { value: 40, suffix: "%", label: "Avg e-commerce revenue lift in 6 months" },
    { value: 0, symbol: "∞", label: "Scale ceiling, built to grow" },
];

const PIPELINE = [
    { num: "01", title: "Strategy & Requirements", body: "Define revenue thesis, scope, and success metrics before a single decision is made." },
    { num: "02", title: "UX & Design", body: "Flows, prototype, and conversion-optimised design, every screen built for action." },
    { num: "03", title: "Development & Integration", body: "Production build with continuous deployment and all third-party integrations wired in." },
    { num: "04", title: "QA & Performance Testing", body: "Performance, accessibility, security, and load testing, nothing ships until it passes." },
    { num: "05", title: "Launch & Optimisation", body: "Go-live, instrumentation, and ongoing conversion optimisation post-launch." },
];

const STACK_BADGES = [
    "Next.js", "Sanity", "Payload", "Strapi", "Shopify", "Medusa", "Postgres", "Vercel",
];

const UPTIME_BADGES = [
    { label: "99.9% uptime SLO" },
    { label: "Edge-first delivery" },
    { label: "Auto-scaling infra" },
    { label: "Zero-downtime deploys" },
];

const FAQS = [
    { q: "What platforms and technologies do you use?", a: "We choose the stack that fits your business, not our comfort zone. Next.js, Shopify, Medusa, Payload CMS, Sanity, Postgres, Vercel, and AWS are common selections. Every project gets a considered rationale before a line of code is written." },
    { q: "Can you work with our existing website?", a: "Yes. We handle full migrations, redesigns, and incremental improvements. We map redirects, preserve SEO equity, and migrate content cleanly, whether you're on WordPress, Webflow, Wix, or a custom legacy stack." },
    { q: "Can we self-manage the platform after launch?", a: "Always. We build for handoff, full CMS control, documentation, and team training are standard. If you want ongoing management or optimisation, we offer that too." },
    { q: "What are your typical project timelines?", a: "Marketing sites take 4–8 weeks. Platforms and custom systems run 10–20 weeks depending on scope and integration complexity. We scope every project in detail before committing to a timeline." },
];

// ── Digital Services Problem visual: broken infrastructure ────────────────
function DigitalProblemVisual() {
    return (
        <div className="relative mx-auto w-full max-w-sm">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Where growth stalls</p>
            <svg viewBox="0 0 380 320" className="block h-auto w-full" fill="none">
                <defs>
                    <filter id="dp_glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* ── Panel 1: Passive website ── */}
                <motion.g initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.1, ease: EASE }}>
                    {/* Browser chrome */}
                    <rect x="20" y="20" width="160" height="108" rx="7"
                        fill="rgba(10,14,28,0.98)" stroke="rgba(255,80,80,0.22)" strokeWidth="1.2" />
                    <rect x="20" y="20" width="160" height="22" rx="7"
                        fill="rgba(255,80,80,0.06)" />
                    <circle cx="34" cy="31" r="3.5" fill="rgba(255,80,80,0.3)" />
                    <circle cx="46" cy="31" r="3.5" fill="rgba(255,255,255,0.12)" />
                    <circle cx="58" cy="31" r="3.5" fill="rgba(255,255,255,0.12)" />
                    <rect x="68" y="25" width="96" height="12" rx="6"
                        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                    {/* Page content — flat/no-action layout */}
                    <rect x="30" y="52" width="140" height="8" rx="2" fill="rgba(255,255,255,0.18)" />
                    <rect x="30" y="66" width="110" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
                    <rect x="30" y="78" width="120" height="6" rx="2" fill="rgba(255,255,255,0.06)" />
                    {/* Flat "no CTA" area */}
                    <rect x="30" y="94" width="60" height="20" rx="5"
                        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <text x="60" y="108" textAnchor="middle" fontFamily={MONO} fontSize="7"
                        fill="rgba(255,255,255,0.25)">NO ACTION</text>
                    {/* Flat conversion bar */}
                    <rect x="30" y="118" width="140" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
                    <motion.rect x="30" y="118" width="14" height="4" rx="2" fill="rgba(255,80,80,0.5)"
                        initial={{ width: 0 }} whileInView={{ width: 14 }}
                        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.6, ease: EASE }} />
                    {/* Label */}
                    <text x="100" y="142" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700"
                        letterSpacing="0.12em" fill="rgba(255,255,255,0.6)">PASSIVE WEBSITE</text>
                    <text x="100" y="154" textAnchor="middle" fontFamily={MONO} fontSize="7.5"
                        letterSpacing="0.1em" fill="rgba(255,80,80,0.55)">9% CONVERSION</text>
                </motion.g>

                {/* ── Panel 2: Platform bottleneck ── */}
                <motion.g initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.22, ease: EASE }}>
                    <rect x="200" y="20" width="160" height="108" rx="7"
                        fill="rgba(10,14,28,0.98)" stroke="rgba(255,80,80,0.22)" strokeWidth="1.2" />
                    {/* Server stack */}
                    {[0, 1, 2].map((idx) => (
                        <g key={idx}>
                            <rect x="214" y={36 + idx * 26} width="132" height="18" rx="4"
                                fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />
                            <circle cx="224" cy={45 + idx * 26} r="3" fill={idx === 1 ? "rgba(255,80,80,0.7)" : "rgba(255,255,255,0.15)"} />
                            <rect x="232" y={41 + idx * 26} width={idx === 1 ? 60 : 88} height="8" rx="2"
                                fill={idx === 1 ? "rgba(255,80,80,0.12)" : "rgba(255,255,255,0.06)"} />
                        </g>
                    ))}
                    {/* Overload indicator */}
                    <text x="280" y="116" textAnchor="middle" fontFamily={MONO} fontSize="7.5" fontWeight="700"
                        letterSpacing="0.12em" fill="rgba(255,80,80,0.6)">BOTTLENECK</text>
                    <path d="M248 104 L312 104" stroke="rgba(255,80,80,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="280" y="142" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700"
                        letterSpacing="0.12em" fill="rgba(255,255,255,0.6)">RIGID PLATFORM</text>
                    <text x="280" y="154" textAnchor="middle" fontFamily={MONO} fontSize="7.5"
                        letterSpacing="0.1em" fill="rgba(255,80,80,0.55)">CAN&apos;T SCALE</text>
                </motion.g>

                {/* ── Panel 3: Ecommerce leaking ── */}
                <motion.g initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: 0.34, ease: EASE }}>
                    <rect x="110" y="178" width="160" height="108" rx="7"
                        fill="rgba(10,14,28,0.98)" stroke="rgba(255,80,80,0.22)" strokeWidth="1.2" />
                    {/* Cart funnel */}
                    <rect x="122" y="192" width="136" height="12" rx="3" fill="rgba(255,255,255,0.06)" />
                    <text x="190" y="202" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="rgba(255,255,255,0.3)">VISITORS</text>
                    <rect x="133" y="210" width="114" height="12" rx="3" fill="rgba(255,255,255,0.05)" />
                    <text x="190" y="220" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="rgba(255,255,255,0.25)">ADD TO CART</text>
                    <rect x="150" y="228" width="80" height="12" rx="3" fill="rgba(255,255,255,0.04)" />
                    <text x="190" y="238" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="rgba(255,255,255,0.2)">CHECKOUT</text>
                    {/* Drop-off arrows */}
                    {[{ x: 248, y: 215 }, { x: 234, y: 233 }].map((pt, i) => (
                        <motion.g key={i}
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4, delay: 0.7 + i * 0.1, ease: EASE }}>
                            <path d={`M${pt.x} ${pt.y} L${pt.x + 14} ${pt.y + 10}`}
                                stroke="rgba(255,80,80,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx={pt.x + 14} cy={pt.y + 10} r="2.5" fill="rgba(255,80,80,0.5)" filter="url(#dp_glow)" />
                        </motion.g>
                    ))}
                    {/* Lost revenue */}
                    <rect x="122" y="252" width="136" height="18" rx="4"
                        fill="rgba(255,80,80,0.05)" stroke="rgba(255,80,80,0.2)" strokeWidth="0.8" />
                    <text x="190" y="264" textAnchor="middle" fontFamily={MONO} fontSize="7.5" fontWeight="700"
                        letterSpacing="0.1em" fill="rgba(255,80,80,0.6)">REVENUE LOST AT CHECKOUT</text>
                    <text x="190" y="300" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700"
                        letterSpacing="0.12em" fill="rgba(255,255,255,0.6)">LEAKING ECOMMERCE</text>
                </motion.g>

                {/* Connecting dotted lines between panels */}
                {[
                    { x1: 180, y1: 74, x2: 200, y2: 74 },
                    { x1: 100, y1: 155, x2: 110, y2: 178 },
                    { x1: 280, y1: 155, x2: 270, y2: 178 },
                ].map((l, i) => (
                    <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                        stroke="rgba(255,80,80,0.15)" strokeWidth="1" strokeDasharray="3 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: EASE }}
                    />
                ))}
            </svg>
        </div>
    );
}

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

// ── Animated metric tile ─────────────────────────────────────────────────
function MetricTile({ value, suffix = "", prefix = "", decimals = 0, label, index, symbol }: { value: number; suffix?: string; prefix?: string; decimals?: number; label: string; index: number; symbol?: string }) {
    const intTarget = Math.round(value * Math.pow(10, decimals));
    const { count, elRef } = useCountUp(intTarget, 1800);
    const display = symbol ? symbol : (decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(decimals) : count.toString());
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            className="flex flex-col items-center gap-3 px-4 py-8 text-center md:gap-4"
        >
            <IconSpark />
            <span ref={elRef} className="text-4xl sm:text-5xl font-bold leading-none tracking-tight md:text-6xl" style={{ color: GREEN }}>
                {symbol ? "" : prefix}{display}{symbol ? "" : suffix}
            </span>
            <span className="text-sm font-medium leading-snug text-white/55">{label}</span>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DigitalServicesPage() {
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
                        <span className="display-muted-line">Digital infrastructure</span>
                        <span className="display-strong-line">built for growth.</span>
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Modern businesses are built on digital infrastructure. We design and engineer scalable
                        systems that support growth, enhance customer experiences, and create long-term
                        competitive advantage.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            data-cta="primary"
                        >
                            Book a Consultation Call
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
                        {/* Left: heading + paragraph */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-6"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">The biggest barrier to growth</span>
                                <span className="display-strong-line">is hidden in plain sight.</span>
                            </h2>
                            <p className="text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                Outdated websites, disconnected platforms, and rigid systems quietly create
                                friction across the customer journey and daily operations. What worked for the
                                business yesterday can quickly become a limitation on where it needs to go next.
                            </p>
                            <p className="text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                Businesses built for growth need infrastructure built for scale.
                            </p>
                        </motion.div>

                        {/* Right: visual */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                        >
                            <DigitalProblemVisual />
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
                            <SectionLabel />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Modern growth requires</span>
                                <span className="display-strong-line">scalable digital infrastructure.</span>
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
                                Businesses that invest in the right digital foundations are better positioned
                                to attract customers, support operations, and scale efficiently. Infrastructure
                                becomes more than a business asset. It becomes a platform for sustainable growth.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pillars */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 md:mt-20"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {[
                            { title: "Attract Customers",  desc: "Digital presence that converts visitors into leads." },
                            { title: "Support Operations", desc: "Infrastructure that keeps the business running smoothly." },
                            { title: "Scale Efficiently",  desc: "Systems built to grow without rebuilding from scratch." },
                            { title: "Build Advantage",    desc: "Digital assets that compound value over time." },
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
                            <span className="display-muted-line">How infrastructure</span>
                            <span className="display-strong-line">gets built.</span>
                        </h2>
                    </motion.div>

                    {/* Desktop: horizontal flow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                    >
                        <div className="hidden items-start justify-center gap-0 md:flex">
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex items-start">
                                    <div className="flex w-36 flex-col items-center gap-4 text-center">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(123,85,234,0.6)" }}>
                                            {step.num}
                                        </span>
                                        <div
                                            className="rounded-2xl p-px"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)",
                                                boxShadow: "0 12px 36px rgba(123,85,234,0.15)",
                                            }}
                                        >
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && (
                                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                        <circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" />
                                                        <line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                                                        <circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" />
                                                    </svg>
                                                )}
                                                {i === 1 && (
                                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                        <path d="M5 8V5h3M16 5h3v3M5 16v3h3M16 19h3v-3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" />
                                                        <rect x="8.5" y="8.5" width="7" height="7" stroke="rgba(0,255,221,0.9)" strokeWidth="1.3" opacity="0.7" />
                                                        <line x1="12" y1="8.5" x2="12" y2="15.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1" opacity="0.4" />
                                                        <line x1="8.5" y1="12" x2="15.5" y2="12" stroke="rgba(0,255,221,0.9)" strokeWidth="1" opacity="0.4" />
                                                    </svg>
                                                )}
                                                {i === 2 && (
                                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                        <path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" />
                                                        <circle cx="19" cy="16" r="3" stroke="rgba(0,255,221,0.55)" strokeWidth="1.3" />
                                                        <path d="M18 16l.7.7 1.3-1.4" stroke="rgba(0,255,221,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                                {i === 3 && (
                                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                        <path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" />
                                                        <path d="M3 11L8 6L13 9L20 3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M17 3h3v3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-semibold tracking-tight text-white md:text-base">{step.title}</h3>
                                        <p className="text-xs leading-relaxed md:text-sm" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "140px" }}>{step.body}</p>
                                    </div>
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="flex w-16 flex-shrink-0 items-center" aria-hidden style={{ marginTop: "74px" }}>
                                            <div className="relative flex w-full items-center">
                                                <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(123,85,234,0.25), rgba(123,85,234,0.5), rgba(123,85,234,0.25))" }} />
                                                <svg className="-ml-px flex-shrink-0" width="7" height="12" viewBox="0 0 7 12" fill="none">
                                                    <path d="M1 1L6 6L1 11" stroke="rgba(123,85,234,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <motion.div
                                                    className="absolute h-1.5 w-1.5 rounded-full"
                                                    style={{ top: "50%", marginTop: "-3px", background: "rgba(123,85,234,0.9)", boxShadow: "0 0 6px rgba(123,85,234,0.7)" }}
                                                    initial={{ left: 0 }}
                                                    animate={{ left: "calc(100% - 8px)" }}
                                                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile: vertical flow */}
                        <div className="flex flex-col items-center gap-2 md:hidden">
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex flex-col items-center">
                                    <div className="flex w-36 flex-col items-center gap-4 text-center">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(123,85,234,0.6)" }}>
                                            {step.num}
                                        </span>
                                        <div
                                            className="rounded-2xl p-px"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)",
                                                boxShadow: "0 12px 36px rgba(123,85,234,0.15)",
                                            }}
                                        >
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" /><line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" /></svg>}
                                                {i === 1 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 8V5h3M16 5h3v3M5 16v3h3M16 19h3v-3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><rect x="8.5" y="8.5" width="7" height="7" stroke="rgba(0,255,221,0.9)" strokeWidth="1.3" opacity="0.7" /></svg>}
                                                {i === 2 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><circle cx="19" cy="16" r="3" stroke="rgba(0,255,221,0.55)" strokeWidth="1.3" /></svg>}
                                                {i === 3 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><path d="M3 11L8 6L13 9L20 3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-semibold tracking-tight text-white">{step.title}</h3>
                                        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "200px" }}>{step.body}</p>
                                    </div>
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="flex justify-center py-1" aria-hidden>
                                            <div className="relative flex flex-col items-center" style={{ height: "52px", width: "2px" }}>
                                                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(123,85,234,0.15), rgba(123,85,234,0.35), rgba(123,85,234,0.15))" }} />
                                                <motion.div
                                                    className="absolute -left-[3px] h-2 w-2 rounded-full"
                                                    style={{ background: "rgba(123,85,234,0.9)", boxShadow: "0 0 8px rgba(123,85,234,0.7)" }}
                                                    initial={{ top: 0 }}
                                                    animate={{ top: "calc(100% - 8px)" }}
                                                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                                />
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
                            <span className="display-muted-line">Three infrastructure</span>
                            <span className="display-strong-line">layers we build.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-14 md:gap-20">
                        {SUB_SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const IconForRow = i === 0 ? IconGlobe : i === 1 ? IconCart : IconLayers;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-20 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    {/* text */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-lg font-bold leading-none tabular-nums" style={{ color: GREEN }}>
                                                {svc.num}.
                                            </span>
                                            <h3 className="text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">
                                                {svc.title}
                                            </h3>
                                        </div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">
                                            {svc.eyebrow}
                                        </p>
                                        <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-[15px]">
                                            {svc.body}
                                        </p>
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
                                    <div className="mx-auto w-full max-w-lg">
                                        <WhatWeBuildVisual kind={svc.visual} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. OUTCOMES, Horizontal metrics strip ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
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
                            <span className="display-muted-line">What the numbers</span>
                            <span className="display-strong-line">look like.</span>
                        </h2>
                    </motion.div>

                    <div
                        className="grid grid-cols-2 rounded-2xl md:grid-cols-4"
                        style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {OUTCOME_METRICS.map((m, i) => {
                            // mobile (2-col): all but last two get bottom-border; right column also gets a left-border
                            // desktop (4-col): all but first get a left-border (no bottom borders)
                            const mobileBottom = i < OUTCOME_METRICS.length - 2 ? "border-b border-white/[0.07]" : "";
                            const mobileLeft = i % 2 === 1 ? "border-l border-white/[0.07]" : "";
                            return (
                                <div
                                    key={m.label}
                                    className={`relative ${mobileBottom} ${mobileLeft} md:border-b-0 md:border-l md:border-white/[0.07] md:first:border-l-0`}
                                >
                                    <MetricTile {...m} index={i} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 6. DELIVERY PROCESS, Pipeline ── */}
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
                            <span className="display-muted-line">A pipeline,</span>
                            <span className="display-strong-line">not a sprint.</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{
                                top: "32px",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${BLUE}55 6%, ${BLUE}55 94%, transparent)`,
                            }}
                        />
                        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
                            {PIPELINE.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div
                                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{
                                            background: "#171A22",
                                            border: `1.5px solid ${BLUE}`,
                                            boxShadow: `0 0 0 6px #0E1014, 0 0 22px ${BLUE}33`,
                                        }}
                                    >
                                        <span className="text-sm font-bold md:text-base" style={{ color: GREEN }}>{step.num}</span>
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-white md:text-lg">{step.title}</h3>
                                    <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-white/55 md:text-sm">{step.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center gap-5 text-center md:mb-14"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The</span>
                            <span className="display-strong-line">common questions.</span>
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

            {/* ── 8. FINAL CTA ── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
                <CTAAurora variant={2} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Your digital presence</span>
                        <span className="display-strong-line">is your best team member.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Let&apos;s build the platforms and systems that generate revenue, qualify leads, and serve customers while you sleep.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            data-cta="primary"
                        >
                            Discuss Your Project
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

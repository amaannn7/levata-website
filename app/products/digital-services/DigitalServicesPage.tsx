"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import WhatWeBuildVisual from "@/app/components/WhatWeBuildVisual";
import SectionLabel from "@/app/components/SectionLabel";
import SpotlightGrid from "@/app/components/SpotlightGrid";
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

const REVENUE_FLOW = [
    { num: "01", title: "Strategy", body: "Define the revenue thesis before a single pixel is drawn." },
    { num: "02", title: "UX", body: "Flows engineered for action, not aesthetics for their own sake." },
    { num: "03", title: "Development", body: "Production-grade build on a stack that scales without surprises." },
    { num: "04", title: "AI", body: "Search, recommendations, personalisation, intelligence in the user path." },
    { num: "05", title: "Optimisation", body: "Continuous experimentation against revenue metrics." },
];

const SUB_SERVICES = [
    {
        num: "01",
        title: "Website Development",
        eyebrow: "Conversion-first",
        body: "Conversion-first websites with strategy, UX, design, development, CMS, SEO, and tracking built in.",
        bullets: ["Conversion strategy and UX architecture", "Performance-optimised development", "Analytics and conversion tracking"],
        visual: "website" as const,
    },
    {
        num: "02",
        title: "Platform Development",
        eyebrow: "Scale-ready",
        body: "Client portals, SaaS products, and internal tools built to perform under load and scale with your model.",
        bullets: ["Full-stack development and API design", "Authentication, permissions, and security", "Third-party integrations"],
        visual: "platform" as const,
    },
    {
        num: "03",
        title: "E-commerce Development",
        eyebrow: "Revenue engine",
        body: "E-commerce built around conversion rate, average order value, and lifetime customer value. AI search included.",
        bullets: ["Checkout optimisation and payment integration", "AI product recommendations and smart search", "Analytics and revenue attribution"],
        visual: "ecommerce" as const,
    },
    {
        num: "04",
        title: "Custom Systems",
        eyebrow: "Bespoke infrastructure",
        body: "When off-the-shelf software doesn't fit, we build it. Proprietary tools, portals, and BI infrastructure.",
        bullets: ["Custom database and data architecture", "Business logic and rules engine development", "Security, compliance, and documentation"],
        visual: "custom" as const,
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
                <SpotlightGrid />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                                        <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Digital infrastructure</span>
                        <span className="display-strong-line">built to work hard.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        We don&apos;t build websites. We engineer AI-integrated platforms that generate revenue and serve customers around the clock.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)" }}
                        >
                            Discuss Your Project
                        </button>

                    </div>
                </motion.div>
                <HeroHorizon />
            </section>

            {/* ── 2. PROBLEM, Revenue leakage panels ── */}
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
                            <span className="display-muted-line">Where revenue leaks</span>
                            <span className="display-strong-line">out of digital.</span>
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Three patterns we see in almost every audit. Each one quietly bleeds revenue you&apos;ve already earned.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-10">
                        {LEAKAGE.map((item, i) => (
                            <motion.div
                                key={item.num}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                                className={`relative flex flex-col gap-5 ${i === 1 ? "lg:mt-16" : i === 2 ? "lg:mt-32" : ""
                                    }`}
                            >
                                {/* Huge background watermark numeral */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute -top-4 -left-1 select-none leading-none"
                                    style={{
                                        fontFamily: MONO,
                                        fontWeight: 700,
                                        fontSize: "clamp(4rem, 8vw, 7rem)",
                                        color: "rgba(255,255,255,0.04)",
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {item.num}
                                </span>

                                {/* Eyebrow + accent line */}
                                <div className="relative flex items-center gap-3">
                                    <span
                                        className="h-px w-8"
                                        style={{
                                            background:
                                                "linear-gradient(to right, rgba(34,211,238,0.6), transparent)",
                                        }}
                                    />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                                        Pattern {item.num}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="relative text-2xl font-semibold leading-[1.15] tracking-tight text-white md:text-[1.75rem]">
                                    {item.title}
                                </h3>

                                {/* Body */}
                                <p className="relative text-[15px] leading-relaxed text-white/55">
                                    {item.body}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. APPROACH, Revenue engineering vertical flow ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-16 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Revenue engineering,</span>
                            <span className="display-strong-line">end to end.</span>
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            One framework. Five layers. Every decision tied back to a revenue thesis.
                        </p>
                    </motion.div>

                    <div className="relative mx-auto max-w-2xl">
                        {/* vertical spine */}
                        <div
                            aria-hidden
                            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
                            style={{
                                width: "1px",
                                background: `linear-gradient(to bottom, transparent, ${BLUE}55 8%, ${BLUE}55 92%, transparent)`,
                            }}
                        />
                        <div className="flex flex-col gap-12">
                            {REVENUE_FLOW.map((node, i) => (
                                <motion.div
                                    key={node.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    className="relative flex items-center gap-6"
                                >
                                    {/* left metric */}
                                    <div className={`hidden flex-1 md:block ${i % 2 === 0 ? "" : "opacity-0 pointer-events-none"} text-right`}>
                                        {i % 2 === 0 && (
                                            <p className="text-sm text-white/55">{node.body}</p>
                                        )}
                                    </div>
                                    {/* node */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div
                                            className="flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16"
                                            style={{
                                                background: "#171A22",
                                                border: `1.5px solid ${BLUE}`,
                                                boxShadow: `0 0 0 6px #0E1014, 0 0 22px ${BLUE}33`,
                                            }}
                                        >
                                            <span className="text-base font-bold md:text-lg" style={{ color: GREEN }}>{node.num}</span>
                                        </div>
                                        <h3 className="mt-3 text-center text-lg font-bold text-white md:text-xl">{node.title}</h3>
                                    </div>
                                    {/* right metric */}
                                    <div className={`flex-1 ${i % 2 === 1 ? "md:block" : "md:opacity-0 md:pointer-events-none"}`}>
                                        {i % 2 === 1 ? (
                                            <p className="text-sm text-white/55">{node.body}</p>
                                        ) : (
                                            <p className="text-sm text-white/55 md:hidden">{node.body}</p>
                                        )}
                                        {/* mobile only show on every row */}
                                        {i % 2 === 0 && (
                                            <p className="text-sm text-white/55 md:hidden">{node.body}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. SUB-SERVICES, Alternating enterprise sections ── */}
            <section id="sub-services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-16 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Four practices.</span>
                            <span className="display-strong-line">One delivery standard.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-20 md:gap-28">
                        {SUB_SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const IconForRow = i === 0 ? IconGlobe : i === 1 ? IconLayers : i === 2 ? IconCart : IconCog;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    {/* text */}
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl sm:text-5xl font-bold leading-none md:text-6xl" style={{ color: GREEN }}>{svc.num}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{svc.eyebrow}</span>
                                        </div>
                                        <h3 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                                            {svc.title}
                                        </h3>
                                        <p className="max-w-md text-base leading-relaxed text-white/55 md:text-[1.05rem]">{svc.body}</p>
                                        <ul className="mt-2 flex flex-col gap-2.5">
                                            {svc.bullets.map((b) => (
                                                <li key={b} className="flex items-center gap-3 text-sm text-white md:text-[15px]">
                                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}55` }}>
                                                        <IconCheck />
                                                    </span>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${BLUE}14`, border: `1px solid ${BLUE}40` }}>
                                            <IconForRow />
                                        </div>
                                    </div>
                                    {/* visual */}
                                    <div>
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
                            style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)" }}
                        >
                            Discuss Your Project
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

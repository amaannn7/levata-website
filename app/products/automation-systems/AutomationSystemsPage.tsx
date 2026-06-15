"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import AutomationVisual from "@/app/components/AutomationVisual";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "rgba(0,255,221,0.9)";
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

// Reveal once in view, with a timed fallback so SVG visuals still animate even if
// the IntersectionObserver never fires (iOS Safari + smooth scroll).
function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
    const observed = useInView(ref, { once: true, margin: "200px" });
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 700);
        return () => clearTimeout(t);
    }, []);
    return observed || forced;
}

// Problem-diagram variants "" driven by ONE whileInView on the parent <div>, so the
// SVG children reveal via variant propagation (reliable on mobile, unlike per-SVG observers).
const diagramParent = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const diagramLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (d: number) => ({ pathLength: 1, opacity: 0.6, transition: { duration: 0.9, delay: d, ease: EASE } }),
};
const diagramHub = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.85, ease: EASE } },
};
const diagramPill = {
    hidden: { opacity: 0, y: 8 },
    visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: EASE } }),
};

// "-"- Count-up hook "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

// "-"- Icons "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
function IconCRM() {
    return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="8" r="3.5" stroke={BLUE} strokeWidth="1.5" /><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" /></svg>);
}
function IconFinance() {
    return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V8m6 11V5m6 14v-7m4 7V11" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" /></svg>);
}
function IconOps() {
    return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="12" cy="12" r="3" stroke={BLUE} strokeWidth="1.5" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" /></svg>);
}
function IconSupport() {
    return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M21 12a9 9 0 10-18 0v3a2 2 0 002 2h2v-7H4M21 12v3a2 2 0 01-2 2h-2v-7h3" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function IconReport() {
    return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="4" y="4" width="16" height="16" rx="2" stroke={BLUE} strokeWidth="1.5" /><path d="M8 14l3-3 3 2 3-4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function IconBolt() {
    return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function IconBranch() {
    return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="6" cy="6" r="2" stroke={BLUE} strokeWidth="1.5" /><circle cx="6" cy="18" r="2" stroke={BLUE} strokeWidth="1.5" /><circle cx="18" cy="12" r="2" stroke={BLUE} strokeWidth="1.5" /><path d="M6 8v8M8 6h4a4 4 0 014 4v.5M8 18h4a4 4 0 004-4v-.5" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" /></svg>);
}
function IconGrid() {
    return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" stroke={BLUE} strokeWidth="1.5" /></svg>);
}
function IconCheck() {
    return (<svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 5l2.2 2.2L8 3.2" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function IconSpark() {
    return (<svg width="48" height="20" viewBox="0 0 34 18" fill="none" aria-hidden><path d="M2 14 L8 10 L14 12 L20 6 L26 8 L32 3" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

// "-"- Data "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
const DISCONNECTED = [
    { Icon: IconCRM, label: "CRM", pos: { top: "5%", left: "8%" }, delay: 0.0 },
    { Icon: IconFinance, label: "Finance", pos: { top: "12%", right: "10%" }, delay: 0.1 },
    { Icon: IconOps, label: "Ops", pos: { top: "55%", left: "4%" }, delay: 0.2 },
    { Icon: IconSupport, label: "Support", pos: { bottom: "8%", right: "12%" }, delay: 0.3 },
    { Icon: IconReport, label: "Reporting", pos: { bottom: "12%", left: "30%" }, delay: 0.4 },
];

const ARCH_NODES = [
    { num: "01", title: "Audit", body: "Map every process, system, and bottleneck." },
    { num: "02", title: "Architecture", body: "Design the unified automation surface." },
    { num: "03", title: "Automation", body: "Wire workflows, triggers, and integrations." },
    { num: "04", title: "Intelligence", body: "Layer AI decisions on top of the rails." },
    { num: "05", title: "Optimisation", body: "Measure, refine, and expand coverage." },
];

const PROCESS_STEPS = [
    {
        num: "01",
        title: "Assess",
        body: "We analyse your processes, systems, and workflows to identify repetitive tasks, bottlenecks, and opportunities for automation.",
    },
    {
        num: "02",
        title: "Architect",
        body: "We design automation strategies tailored to your operations, ensuring workflows align with business goals and operational requirements.",
    },
    {
        num: "03",
        title: "Automate",
        body: "We implement connected workflows, automations, and systems that reduce manual effort and improve operational efficiency.",
    },
    {
        num: "04",
        title: "Optimise",
        body: "We continuously refine and improve automation performance as your business evolves, ensuring operations remain efficient at scale.",
    },
];

const SUB_AUTOMATION = [
    {
        num: "01",
        title: "Workflow Automation",
        eyebrow: "AI-Powered Process Intelligence",
        body: "We build intelligent workflows that connect systems, streamline processes, and support better operational decision-making. By reducing manual intervention and improving how work moves through the business, organisations can operate more efficiently and scale with greater confidence.",
        bullets: [
            "Lead and customer workflows",
            "Sales and follow-up automation",
            "Customer support processes",
            "Marketing workflows",
            "Project and operational automation",
            "Automated approvals and alerts",
        ],
        visual: "workflow" as const,
    },
    {
        num: "02",
        title: "Dashboard Systems",
        eyebrow: "Real-Time Intelligence for Every Decision",
        body: "Effective decisions depend on clear visibility. We create business intelligence dashboards that connect data across the organisation, providing leadership teams with real-time insights into performance, operations, and growth.",
        bullets: [
            "Data and system integration",
            "KPI and reporting framework",
            "Custom dashboards",
            "Real-time business insights",
            "Automated alerts and reporting",
            "User access management",
        ],
        visual: "intel" as const,
    },
];

const OPS_METRICS = [
    { value: 70, suffix: "%", label: "Avg reduction in manual processing time" },
    { value: 10, suffix: "hrs", label: "Avg hours saved per employee per week" },
    { value: 3, suffix: "×", label: "Operational throughput increase" },
    { value: 6, suffix: "mo", label: "Typical time to full ROI" },
];

const DEPLOYMENT = [
    { num: "01", title: "Operations Audit", body: "Process inventory + bottlenecks ranked by automation impact." },
    { num: "02", title: "Architecture & Stack", body: "Automation architecture designed; tools picked to fit your systems." },
    { num: "03", title: "Build in Staging", body: "Workflows, integrations, and AI logic stress-tested before prod." },
    { num: "04", title: "Phased Rollout", body: "Deploy in stages, validating each before expanding coverage." },
    { num: "05", title: "Training & Handoff", body: "Runbooks, docs, and training so your team owns and extends it." },
    { num: "06", title: "Monitor & Expand", body: "Continuous monitoring and expansion as your business scales." },
];

const FAQS = [
    { q: "Will this work with our existing tools?", a: "Yes. We integrate with Salesforce, HubSpot, NetSuite, QuickBooks, Slack, Notion, Linear, Zendesk, Stripe, and any system with a REST or GraphQL API. We build custom connectors where native integrations don't exist." },
    { q: "What happens if an automation encounters an error?", a: "Every workflow has error handling and alerting built in. Critical failures trigger immediate notifications to your team with detailed logs, so nothing fails silently and every issue can be diagnosed and resolved quickly." },
    { q: "Can you automate processes that require human judgment?", a: "Yes, through human-in-the-loop checkpoints. The automation handles routing, data gathering, and preparation; a human makes the decision at defined escalation points. You get the efficiency without removing the oversight." },
    { q: "What data sources can you connect to?", a: "Any system with an API, database connector, or webhook. We also work with legacy systems that require custom ETL pipelines, file-based integrations, or screen-capture automation as a last resort." },
    { q: "How long does implementation typically take?", a: "First production workflows ship in 3-6 weeks. Full operational coverage typically takes 3-6 months, deployed in phases so you see value at every step, not just at the end." },
];

// -- FAQ item --
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
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
                <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full" style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}99` }} />
                    <span className="display-card-title">{q}</span>
                </div>
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
                        <div className="flex flex-col gap-3 px-6 pb-6">
                            <p className="text-lead text-white/55">{a}</p>
                            <div className="flex items-center gap-3">
                                <IconSpark />
                                <span className="text-eyebrow text-white/50">Live monitoring</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// "-"- Metric tile "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
function MetricTile({ value, suffix = "", prefix = "", decimals = 0, label, index }: { value: number; suffix?: string; prefix?: string; decimals?: number; label: string; index: number }) {
    const intTarget = Math.round(value * Math.pow(10, decimals));
    const { count, elRef } = useCountUp(intTarget, 1800);
    const display = decimals > 0 ? (count / Math.pow(10, decimals)).toFixed(decimals) : count.toString();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            className="flex flex-col items-start gap-3 rounded-xl p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
            <div className="flex w-full items-center justify-between">
                <IconSpark />
                <span className="flex h-2 w-2 rounded-full" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}99` }} />
            </div>
            <span ref={elRef} className="display-stat">
                {prefix}{display}{suffix}
            </span>
            <span className="text-caption text-white/55">{label}</span>
        </motion.div>
    );
}

// "-"- Page "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
export default function AutomationSystemsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { open: openBookCall } = useBookCall();
    const silosRef = useRef<HTMLDivElement>(null);
    const silosInView = useReveal(silosRef);

    return (
        <main className="relative min-h-screen bg-[#0E1014] overflow-hidden page-dividers">

            {/* "" 1. HERO """"""""""""""""""""""""""""""""""""" */}
            <section
                data-hero
                className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:min-h-0 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">Most automations break.</span>
                        <span className="display-strong-line sm:whitespace-nowrap">Ours run your business.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        Your people are at their best when they&apos;re solving problems, serving customers, and
                        driving growth. We automate repetitive workflows and manual processes so they can
                        focus on the work that matters most.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Let&apos;s Discuss Your Processes
                        </button>
                    </div>
                </motion.div>
                <HeroHorizon intensity="strong" />
            </section>

            {/* "" 2. PROBLEM "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 55% 60% at 15% 40%, rgba(255,80,80,0.05) 0%, transparent 65%)",
                        "radial-gradient(ellipse 45% 55% at 85% 60%, rgba(123,85,234,0.05) 0%, transparent 65%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20 md:items-center">
                        {/* Left: heading + paragraphs */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-6"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Growth becomes difficult</span>
                                <span className="display-strong-line">when operations stay manual.</span>
                            </h2>
                            <p className="text-lead text-white/55">
                                As businesses grow, manual processes become harder to manage. Teams spend more
                                time on repetitive tasks, information moves slowly between systems, and
                                operational inefficiencies begin to compound.
                            </p>
                            <p className="text-lead text-white/55">
                                Without the right systems in place, growth often creates more work instead
                                of more momentum.
                            </p>
                        </motion.div>

                        {/* Right: disconnected silos visual */}
                        <div ref={silosRef} className="relative mx-auto w-full max-w-md sm:max-w-none" style={{ aspectRatio: "5 / 4" }}>
                            <svg viewBox="0 0 400 320" className="block h-full w-full" fill="none">
                                <text x="0" y="28" fontFamily="var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="9" fontWeight="700"
                                    letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">DISCONNECTED OPERATIONS</text>
                                <defs>
                                    <filter id="auto_prob_glow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>

                                {/* Silo nodes "" scattered, isolated, no center hub */}
                                {[
                                    { cx: 80,  cy: 75,  label: "CRM",       sub: "MANUAL",    delay: 0.05 },
                                    { cx: 310, cy: 65,  label: "FINANCE",   sub: "MANUAL",    delay: 0.12 },
                                    { cx: 55,  cy: 200, label: "OPS",       sub: "MANUAL",    delay: 0.19 },
                                    { cx: 330, cy: 195, label: "SUPPORT",   sub: "MANUAL",    delay: 0.26 },
                                    { cx: 195, cy: 240, label: "REPORTING", sub: "MANUAL",    delay: 0.33 },
                                ].map((p) => (
                                    <motion.g key={p.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={silosInView ? { opacity: 1, scale: 1 } : undefined}
                                        transition={{ duration: 0.45, delay: p.delay, ease: EASE }}
                                        style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
                                    >
                                        <rect x={p.cx - 52} y={p.cy - 22} width="104" height="44" rx="9"
                                            fill="rgba(10,14,28,0.98)"
                                            stroke="rgba(255,80,80,0.28)"
                                            strokeWidth="1.2"
                                        />
                                        {/* Red left accent */}
                                        <rect x={p.cx - 52} y={p.cy - 22} width="3" height="44" rx="1.5"
                                            fill="rgba(255,80,80,0.5)"
                                        />
                                        {/* Warning dot "" looping blink, staggered per silo */}
                                        <motion.circle cx={p.cx - 33} cy={p.cy - 4} r="3.5" fill="rgba(255,80,80,0.6)" filter="url(#auto_prob_glow)"
                                            animate={silosInView ? { opacity: [0.4, 1, 0.4] } : undefined}
                                            transition={{ duration: 2, repeat: Infinity, delay: p.delay * 4, ease: "easeInOut" }} />
                                        <text x={p.cx - 22} y={p.cy - 1}
                                            fontFamily={MONO} fontSize="10" fontWeight="700" letterSpacing="0.14em"
                                            fill="rgba(255,255,255,0.75)">{p.label}
                                        </text>
                                        <text x={p.cx - 22} y={p.cy + 13}
                                            fontFamily={MONO} fontSize="7.5" letterSpacing="0.16em"
                                            fill="rgba(255,80,80,0.5)">{p.sub}
                                        </text>
                                    </motion.g>
                                ))}

                                {/* Broken stub lines "" each system tries to connect but fails */}
                                {[
                                    { x1: 132, y1: 75,  x2: 175, y2: 90  },
                                    { x1: 258, y1: 65,  x2: 215, y2: 85  },
                                    { x1: 107, y1: 200, x2: 150, y2: 205 },
                                    { x1: 278, y1: 195, x2: 247, y2: 200 },
                                    { x1: 195, y1: 218, x2: 195, y2: 185 },
                                ].map((l, i) => (
                                    <motion.line key={i}
                                        x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                                        stroke="rgba(255,80,80,0.2)" strokeWidth="1" strokeDasharray="3 5"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={silosInView ? { pathLength: 1, opacity: 1 } : undefined}
                                        transition={{ duration: 0.4, delay: 0.45 + i * 0.07, ease: EASE }}
                                    />
                                ))}

                                {/* Central void "" "no automation layer" */}
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={silosInView ? { opacity: 1 } : undefined}
                                    transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
                                >
                                    <motion.g
                                        animate={silosInView ? { opacity: [0.55, 1, 0.55] } : undefined}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <rect x="130" y="120" width="140" height="30" rx="15"
                                            fill="rgba(255,60,60,0.05)"
                                            stroke="rgba(255,60,60,0.22)"
                                            strokeWidth="1"
                                            strokeDasharray="4 3"
                                        />
                                        <text x="200" y="139"
                                            textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="700"
                                            letterSpacing="0.18em" fill="rgba(255,80,80,0.65)">NO AUTOMATION
                                        </text>
                                    </motion.g>
                                </motion.g>

                                {/* Bottom caption */}
                                <text x="200" y="298"
                                    textAnchor="middle" fontFamily={MONO} fontSize="8" letterSpacing="0.14em"
                                    fill="rgba(255,80,80,0.35)">SILOED . MANUAL . DISCONNECTED
                                </text>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* "" 3. SOLUTION "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(123,85,234,0.08) 0%, transparent 65%)",
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 lg:gap-20 md:items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-5"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Modern growth requires</span>
                                <span className="display-strong-line">automated operations.</span>
                            </h2>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="flex flex-col gap-5"
                        >
                            <p className="text-lead text-white/55">
                                Businesses that scale successfully rely on systems that reduce manual effort
                                and create operational consistency. Automation helps streamline workflows,
                                improve efficiency, and give teams more time to focus on higher-value work.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pillars */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 md:mt-20"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {[
                            { title: "Streamline Workflows",       desc: "Processes that run without manual handoffs.", icon: <><path d="M3 6h14M3 10h10M3 14h6" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 12l3 3-3 3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></> },
                            { title: "Improve Efficiency",         desc: "Less time spent on repetitive tasks.", icon: <><path d="M10 4v6l4 2" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="10" r="7" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5"/></> },
                            { title: "Reduce Manual Work",         desc: "Automation handles the routine, people handle the rest.", icon: <><rect x="3" y="5" width="6" height="6" rx="1.5" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5"/><path d="M12 8h5M12 12h3M3 14l2 2 4-4" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></> },
                            { title: "Focus on Higher-Value Work", desc: "Teams spend time where it actually drives growth.", icon: <><path d="M4 14l4-4 3 3 5-6" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="5" r="2" fill="rgba(0,255,221,0.1)" stroke="rgba(0,255,221,0.8)" strokeWidth="1.4"/></> },
                        ].map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: EASE }}
                                className="flex flex-col gap-3 pt-10 pb-7 px-6"
                                style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(0,255,221,0.06)", border: "1px solid rgba(0,255,221,0.15)" }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>{p.icon}</svg>
                                </div>
                                <p className="display-card-title" style={{ minHeight: "2.6em" }}>{p.title}</p>
                                <p className="text-body-sm text-white/45">{p.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* "" 4. OUR PROCESS "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123,85,234,0.06) 0%, transparent 70%)",
                }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">How automation </span><span className="display-strong-line">gets built.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                    >
                        {/* Desktop: horizontal flow */}
                        <div className="hidden items-start justify-center gap-6 md:flex">
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex items-start">
                                    <div className="flex w-52 flex-col items-center gap-4 text-center">
                                        <span className="text-eyebrow" style={{ color: "rgba(123,85,234,0.6)" }}>{step.num}</span>
                                        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)", boxShadow: "0 12px 36px rgba(123,85,234,0.15)" }}>
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" /><line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" /></svg>}
                                                {i === 1 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 8V5h3M16 5h3v3M5 16v3h3M16 19h3v-3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><rect x="8.5" y="8.5" width="7" height="7" stroke="rgba(0,255,221,0.9)" strokeWidth="1.3" opacity="0.7" /><line x1="12" y1="8.5" x2="12" y2="15.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1" opacity="0.4" /><line x1="8.5" y1="12" x2="15.5" y2="12" stroke="rgba(0,255,221,0.9)" strokeWidth="1" opacity="0.4" /></svg>}
                                                {i === 2 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                {i === 3 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><path d="M3 11L8 6L13 9L20 3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 3h3v3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                                            </div>
                                        </div>
                                        <h3 className="display-card-title">{step.title}</h3>
                                        <p className="text-body-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{step.body}</p>
                                    </div>
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="flex w-10 flex-shrink-0 items-center" aria-hidden style={{ marginTop: "74px" }}>
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
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={step.num} className="flex flex-col items-center">
                                    <div className="flex w-52 flex-col items-center gap-4 text-center">
                                        <span className="text-eyebrow" style={{ color: "rgba(123,85,234,0.6)" }}>{step.num}</span>
                                        <div className="rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(123,85,234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123,85,234,0.45) 100%)", boxShadow: "0 12px 36px rgba(123,85,234,0.15)" }}>
                                            <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                {i === 0 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.5" cy="10.5" r="5.5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" /><line x1="14.7" y1="14.7" x2="20" y2="20" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" /><circle cx="10.5" cy="10.5" r="1.6" fill="rgba(0,255,221,0.9)" /></svg>}
                                                {i === 1 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 8V5h3M16 5h3v3M5 16v3h3M16 19h3v-3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><rect x="8.5" y="8.5" width="7" height="7" stroke="rgba(0,255,221,0.9)" strokeWidth="1.3" opacity="0.7" /></svg>}
                                                {i === 2 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="rgba(0,255,221,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                {i === 3 && <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" /><path d="M3 11L8 6L13 9L20 3" stroke="rgba(0,255,221,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                            </div>
                                        </div>
                                        <h3 className="display-card-title">{step.title}</h3>
                                        <p className="text-body-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{step.body}</p>
                                    </div>
                                    {i < PROCESS_STEPS.length - 1 && (
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

            {/* "" 5. OUR SERVICES "" */}
            <section id="services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Two automation </span><span className="display-strong-line">layers we build.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-14 md:gap-20">
                        {SUB_AUTOMATION.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const IconForRow = i === 0 ? IconBolt : IconGrid;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-20 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    <div className={`flex flex-col gap-4 ${isOdd ? "md:ml-auto md:w-full md:max-w-md" : ""}`}>
                                        <div className="flex items-baseline gap-3">
                                            <span className="display-feature-title tabular-nums" style={{ color: GREEN }}>{svc.num}.</span>
                                            <h3 className="display-feature-title">{svc.title}</h3>
                                        </div>
                                        <p className="text-eyebrow text-white/50">{svc.eyebrow}</p>
                                        <p className="max-w-md text-body-sm text-white/55">{svc.body}</p>
                                        <div className="mt-2 flex flex-col gap-3">
                                            <p className="text-eyebrow text-white/45">What&apos;s included</p>
                                            <ul className="flex flex-col gap-2.5">
                                                {svc.bullets.map((b) => (
                                                    <li key={b} className="flex items-start gap-2.5 text-body-sm text-white/75">
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
                                    <div className="mx-auto block w-full max-w-md sm:max-w-none">
                                        <AutomationVisual kind={svc.visual} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* "" 7. FAQ, Console style "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-12 gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">From the </span><span className="display-strong-line">operations console.</span>
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

            {/* "" 8. FINAL CTA "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
                <CTAAurora variant={3} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
                >
                    <h2 className="display-section-title max-w-3xl text-center">
                        <span className="display-muted-line">What if manual operations</span>
                        <span className="display-strong-line">weren&apos;t a constraint?</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        Map your operation. Eliminate the manual layer. Deploy the systems that let your team scale without scaling the headcount.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book Your Automation Audit
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

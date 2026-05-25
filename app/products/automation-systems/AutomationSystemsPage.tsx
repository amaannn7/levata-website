"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import AutomationVisual from "@/app/components/AutomationVisual";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "#FFFFFF";
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Section label ─────────────────────────────────────────────────────────
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

// ── Icons ─────────────────────────────────────────────────────────────────
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

// ── Data ──────────────────────────────────────────────────────────────────
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

const SUB_AUTOMATION = [
    {
        num: "01",
        title: "Eliminate Manual Operations at Scale",
        eyebrow: "Business automation",
        body: "Every repetitive process — onboarding, invoicing, approvals, reporting — replaced with a reliable automated workflow that runs without human touch.",
        bullets: [
            "End-to-end onboarding and approval workflows",
            "Cross-system data sync, no copy-paste",
            "Compliance reporting + audit trails",
        ],
        visual: "workflow" as const,
    },
    {
        num: "02",
        title: "AI-Powered Process Intelligence",
        eyebrow: "Decision automation",
        body: "AI decision engines that prioritise, route, and escalate work — lead scoring, ticket triage, exception handling — using your business rules.",
        bullets: [
            "Lead scoring + territory routing",
            "Ticket triage with SLA-aware escalation",
            "Human-in-the-loop on high-stakes calls",
        ],
        visual: "decision" as const,
    },
    {
        num: "03",
        title: "Real-Time Intelligence for Every Decision",
        eyebrow: "Live operations",
        body: "A single pane of glass for the whole business — live KPIs, anomaly alerts, and cross-system drilldowns updating in real time.",
        bullets: [
            "Custom KPI views per team and role",
            "Real-time anomaly detection + alerts",
            "Cross-system aggregation, mobile-ready",
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
    { num: "04", title: "Phased Rollout", body: "Deploy in stages — validate each before expanding coverage." },
    { num: "05", title: "Training & Handoff", body: "Runbooks, docs, and training so your team owns and extends it." },
    { num: "06", title: "Monitor & Expand", body: "Continuous monitoring and expansion as your business scales." },
];

const FAQS = [
    { q: "Will this work with our existing tools?", a: "Yes. We integrate with Salesforce, HubSpot, NetSuite, QuickBooks, Slack, Notion, Linear, Zendesk, Stripe, and any system with a REST or GraphQL API. We build custom connectors where native integrations don't exist." },
    { q: "What happens if an automation encounters an error?", a: "Every workflow has error handling and alerting built in. Critical failures trigger immediate notifications to your team with detailed logs, so nothing fails silently and every issue can be diagnosed and resolved quickly." },
    { q: "Can you automate processes that require human judgment?", a: "Yes, through human-in-the-loop checkpoints. The automation handles routing, data gathering, and preparation; a human makes the decision at defined escalation points. You get the efficiency without removing the oversight." },
    { q: "What data sources can you connect to?", a: "Any system with an API, database connector, or webhook. We also work with legacy systems that require custom ETL pipelines, file-based integrations, or screen-capture automation as a last resort." },
    { q: "How long does implementation typically take?", a: "First production workflows ship in 3–6 weeks. Full operational coverage typically takes 3–6 months, deployed in phases so you see value at every step, not just at the end." },
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
                <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full" style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}99` }} />
                    <span className="text-base font-semibold text-white md:text-lg">{q}</span>
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
                            <p className="text-sm leading-relaxed text-white/55 md:text-base">{a}</p>
                            <div className="flex items-center gap-3">
                                <IconSpark />
                                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Live monitoring</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Metric tile ─────────────────────────────────────────────────────────
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
            <span ref={elRef} className="text-4xl font-bold leading-none tracking-tight md:text-5xl" style={{ color: GREEN }}>
                {prefix}{display}{suffix}
            </span>
            <span className="text-xs font-medium leading-snug text-white/55 md:text-sm">{label}</span>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AutomationSystemsPage() {
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
                    <SectionLabel text="Automation & Systems" />
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Automate the Work.</span>
                        <span className="display-strong-line">Amplify the People.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        We build the systems that eliminate the manual layer — so your team works on what actually moves the business.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #7B55EA 0%, #22D3EE 100%)" }}
                        >
                            Map Your Automation Opportunities
                        </button>

                    </div>
                </motion.div>
                <HeroHorizon />
            </section>

            {/* ── 2. PROBLEM, Disconnected systems ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                    ].join(", "),
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
                        {/* Left: text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-5 text-left"
                        >
                            <SectionLabel text="The problem" />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Manual operations</span>
                                <span className="display-strong-line">are a tax on growth.</span>
                            </h2>
                            <p className="max-w-md text-base leading-relaxed text-white/55">
                                Most businesses run on spreadsheets, copy-paste, and tribal knowledge. No automation layer, no system of record.
                            </p>
                        </motion.div>

                        {/* Right: disconnected systems orbiting a central hub — all in viewBox coords so lines actually meet the cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.55, ease: EASE }}
                            className="relative w-full"
                            style={{ aspectRatio: "16 / 10" }}
                        >
                        <svg
                            viewBox="0 0 600 380"
                            className="absolute inset-0 h-full w-full"
                            fill="none"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {(() => {
                                const HUB = { cx: 300, cy: 190 };
                                const HUB_R = 64;
                                const PILL_W = 140;
                                const PILL_H = 44;
                                const pills = [
                                    { cx: 95, cy: 70, label: "CRM", delay: 0.1 },
                                    { cx: 505, cy: 70, label: "Finance", delay: 0.18 },
                                    { cx: 95, cy: 310, label: "Ops", delay: 0.26 },
                                    { cx: 505, cy: 310, label: "Support", delay: 0.34 },
                                    { cx: 300, cy: 348, label: "Reporting", delay: 0.42 },
                                ];

                                return (
                                    <>
                                        {/* Dashed connector lines: from each card edge toward the hub edge */}
                                        {pills.map((p) => {
                                            const dx = HUB.cx - p.cx;
                                            const dy = HUB.cy - p.cy;
                                            const len = Math.hypot(dx, dy);
                                            const ux = dx / len;
                                            const uy = dy / len;
                                            // Start near pill edge (offset from center along the line toward hub)
                                            const x1 = p.cx + ux * (PILL_W / 2 - 4);
                                            const y1 = p.cy + uy * (PILL_H / 2 - 4);
                                            // End at hub edge
                                            const x2 = HUB.cx - ux * HUB_R;
                                            const y2 = HUB.cy - uy * HUB_R;
                                            return (
                                                <motion.line
                                                    key={`l-${p.label}`}
                                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                                    stroke={BLUE}
                                                    strokeOpacity="0.5"
                                                    strokeWidth="1"
                                                    strokeDasharray="4 5"
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                                                    viewport={{ once: true, margin: "-60px" }}
                                                    transition={{ duration: 0.9, delay: 0.5 + p.delay, ease: EASE }}
                                                />
                                            );
                                        })}

                                        {/* Central hub */}
                                        <motion.g
                                            initial={{ opacity: 0, scale: 0.6 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, margin: "-60px" }}
                                            transition={{ duration: 0.6, delay: 0.85, ease: EASE }}
                                            style={{ transformOrigin: `${HUB.cx}px ${HUB.cy}px` }}
                                        >
                                            {/* dark ring around hub to mask line ends */}
                                            <circle
                                                cx={HUB.cx} cy={HUB.cy} r={HUB_R + 6}
                                                fill="#0E1014"
                                            />
                                            <circle
                                                cx={HUB.cx} cy={HUB.cy} r={HUB_R}
                                                fill="rgba(23,26,34,0.98)"
                                                stroke={GREEN}
                                                strokeWidth="1.5"
                                            />
                                            {/* bolt glyph */}
                                            <path
                                                d={`M${HUB.cx + 2} ${HUB.cy - 22} L${HUB.cx - 11} ${HUB.cy + 2} L${HUB.cx} ${HUB.cy + 2} L${HUB.cx - 2} ${HUB.cy + 20} L${HUB.cx + 14} ${HUB.cy - 5} L${HUB.cx + 3} ${HUB.cy - 5} L${HUB.cx + 6} ${HUB.cy - 22} Z`}
                                                stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" fill="none"
                                            />
                                            <text
                                                x={HUB.cx} y={HUB.cy + 40}
                                                textAnchor="middle"
                                                fontFamily={MONO}
                                                fontSize="13" fontWeight="700"
                                                letterSpacing="0.22em"
                                                fill={GREEN}
                                            >
                                                HUB
                                            </text>
                                        </motion.g>

                                        {/* Floating system pills */}
                                        {pills.map((p) => (
                                            <motion.g
                                                key={p.label}
                                                initial={{ opacity: 0, y: 8 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-60px" }}
                                                transition={{ duration: 0.5, delay: p.delay, ease: EASE }}
                                            >
                                                <rect
                                                    x={p.cx - PILL_W / 2}
                                                    y={p.cy - PILL_H / 2}
                                                    width={PILL_W}
                                                    height={PILL_H}
                                                    rx="10"
                                                    fill="rgba(23,26,34,0.98)"
                                                    stroke={BLUE}
                                                    strokeOpacity="0.4"
                                                    strokeWidth="1.2"
                                                />
                                                <circle
                                                    cx={p.cx - PILL_W / 2 + 16}
                                                    cy={p.cy}
                                                    r="4"
                                                    fill={BLUE}
                                                    fillOpacity="0.75"
                                                />
                                                <text
                                                    x={p.cx + 8}
                                                    y={p.cy + 5}
                                                    textAnchor="middle"
                                                    fontFamily={MONO}
                                                    fontSize="15" fontWeight="700"
                                                    letterSpacing="0.08em"
                                                    fill="white"
                                                >
                                                    {p.label}
                                                </text>
                                            </motion.g>
                                        ))}
                                    </>
                                );
                            })()}
                        </svg>
                    </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 3. APPROACH, Architecture map ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-16 gap-5 text-center"
                    >
                        <SectionLabel text="Our approach" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The five-stage</span>
                            <span className="display-strong-line">automation blueprint.</span>
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Full architecture, not isolated automations — audit, design, build, intelligence, optimise.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Horizontal spine — passes through the center of the circles (h-16 = 64px tall, center at 32px) */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block"
                            style={{
                                top: "32px",
                                left: "6%",
                                right: "6%",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${BLUE}55 8%, ${BLUE}55 92%, transparent)`,
                            }}
                        />

                        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
                            {ARCH_NODES.map((node, i) => (
                                <motion.div
                                    key={node.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div
                                        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full md:h-16 md:w-16"
                                        style={{
                                            background: "#171A22",
                                            border: `1.5px solid ${BLUE}`,
                                            boxShadow: `0 0 0 6px #0E1014, 0 0 22px ${BLUE}33`,
                                        }}
                                    >
                                        <span className="text-base font-bold md:text-lg" style={{ color: GREEN }}>{node.num}</span>
                                    </div>
                                    <h3 className="mt-4 text-base font-bold text-white md:text-lg">{node.title}</h3>
                                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-white/55 md:text-sm">{node.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. SUB-SERVICES, Alternating ── */}
            <section id="sub-services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-16 gap-5 text-center"
                    >
                        <SectionLabel text="What we build" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Three layers of</span>
                            <span className="display-strong-line">operational intelligence.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-20 md:gap-28">
                        {SUB_AUTOMATION.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const IconForRow = i === 0 ? IconGrid : i === 1 ? IconBranch : IconReport;
                            return (
                                <motion.div
                                    key={svc.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, ease: EASE }}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    <div className="flex flex-col gap-5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl sm:text-5xl font-bold leading-none md:text-6xl" style={{ color: GREEN }}>{svc.num}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{svc.eyebrow}</span>
                                        </div>
                                        <h3 className="text-2xl font-semibold leading-tight text-white md:text-3xl">{svc.title}</h3>
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
                                    <div>
                                        <AutomationVisual kind={svc.visual} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. OUTCOMES, Real-time dashboard ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Outcomes" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">What unified automation</span>
                            <span className="display-strong-line">ships.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                        {OPS_METRICS.map((m, i) => (
                            <MetricTile key={m.label} {...m} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. DELIVERY PROCESS, Deployment roadmap ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Deployment" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Roadmap to</span>
                            <span className="display-strong-line">production.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                        {DEPLOYMENT.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE }}
                                className="relative flex flex-col gap-3 overflow-hidden rounded-2xl p-6"
                                style={{
                                    background: "rgba(23,26,34,0.92)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                {/* Background numeral watermark */}
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute right-3 top-0 select-none leading-none"
                                    style={{
                                        fontFamily: MONO,
                                        fontWeight: 700,
                                        fontSize: "3.4rem",
                                        color: "rgba(255,255,255,0.04)",
                                        letterSpacing: "-0.04em",
                                    }}
                                >
                                    {step.num}
                                </span>
                                <div className="relative flex items-center gap-3">
                                    <span
                                        className="h-px w-6"
                                        style={{ background: `linear-gradient(to right, ${BLUE}, transparent)` }}
                                    />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45" style={{ fontFamily: MONO }}>
                                        Stage {step.num}
                                    </span>
                                </div>
                                <h3 className="relative text-lg font-semibold leading-snug tracking-tight text-white md:text-[1.15rem]">
                                    {step.title}
                                </h3>
                                <p className="relative text-sm leading-relaxed text-white/55">{step.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ, Console style ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="FAQ" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">From the</span>
                            <span className="display-strong-line">operations console.</span>
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
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Map your operation. Eliminate the manual layer. Deploy the systems that let your team scale without scaling the headcount.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #7B55EA 0%, #22D3EE 100%)" }}
                        >
                            Book Your Automation Audit
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

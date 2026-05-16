"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import PageArcs from "@/app/components/PageArcs";
import HeroBubbles from "@/app/components/HeroBubbles";
import { useBookCall } from "@/app/components/BookCallProvider";

const GREEN = "#3DFD98";
const BLUE = "#72C8F5";
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
        title: "Business Automation",
        eyebrow: "Workflow rails",
        body: "Replace manual handoffs with audited workflows. Onboarding, invoices, approvals, and reporting routed through a single automation surface.",
        bullets: ["Onboarding & provisioning", "Invoice & approvals", "Document workflows", "Audit-grade logs"],
        visual: "workflow",
    },
    {
        num: "02",
        title: "Workflow Automation — AI Decision Trees",
        eyebrow: "Intelligent routing",
        body: "AI decision engines that prioritise, route, and escalate work in real time. Lead scoring, ticket triage, exception handling — all powered by intelligent branching.",
        bullets: ["Lead scoring & routing", "Smart escalation rules", "SLA-aware triage", "Human-in-the-loop checkpoints"],
        visual: "tree",
    },
    {
        num: "03",
        title: "Dashboard Systems — Executive Command Center",
        eyebrow: "Live intelligence",
        body: "A single pane of glass for the operators who run the business. KPI walls, anomaly alerts, operational graphs, all updating live.",
        bullets: ["KPI walls & live tiles", "Anomaly alerts", "Cross-system drilldowns", "Role-based views"],
        visual: "dashboard",
    },
];

const OPS_METRICS = [
    { value: 3.5, suffix: "×", label: "Throughput uplift", decimals: 1 },
    { value: 1200, suffix: "+", label: "Hours saved / month" },
    { value: 4, suffix: "×", label: "Operations ROI" },
    { value: 85, suffix: "%", label: "Automation coverage" },
];

const DEPLOYMENT = [
    { num: "01", title: "Audit", body: "Process & system inventory." },
    { num: "02", title: "Design", body: "Automation architecture & guardrails." },
    { num: "03", title: "Build", body: "Workflows, integrations, AI logic." },
    { num: "04", title: "Deploy", body: "Phased rollout into production." },
    { num: "05", title: "Train", body: "Team enablement & runbooks." },
    { num: "06", title: "Expand", body: "Continuous coverage growth." },
];

const FAQS = [
    { q: "Which tools do you integrate with?", a: "Salesforce, HubSpot, NetSuite, QuickBooks, Slack, Notion, Linear, Zendesk, Intercom, Stripe — plus any system with a REST or GraphQL API. We build connectors where they don't exist." },
    { q: "How long until we see ROI?", a: "First production workflows ship in 3–6 weeks. Measurable operational ROI typically lands within the first quarter of go-live." },
    { q: "What about governance and auditability?", a: "Every workflow is versioned, every decision logged, every action attributable. Designed for SOC 2 / ISO 27001 environments." },
    { q: "Do automations replace headcount?", a: "They replace toil. Teams reinvest the recovered hours into work that compounds — not into doing nothing." },
    { q: "Can we own and modify the automations?", a: "Yes. Clean handover with documentation, runbooks, and a knowledge-transfer engagement. Your team can extend without us." },
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
            <span ref={elRef} className="text-4xl font-extrabold leading-none tracking-tight md:text-5xl" style={{ color: GREEN }}>
                {prefix}{display}{suffix}
            </span>
            <span className="text-xs font-medium leading-snug text-white/55 md:text-sm">{label}</span>
        </motion.div>
    );
}

// ── Workflow mini ──────────────────────────────────────────────────────────
function WorkflowMock() {
    const nodes = ["Onboarding", "Invoices", "Approvals", "Reporting"];
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-6"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
                {nodes.map((n, i) => {
                    const x = 30 + i * 75;
                    return (
                        <g key={n}>
                            <rect x={x} y="70" width="60" height="40" rx="6" stroke={BLUE} strokeWidth="1.4" />
                            <text x={x + 30} y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600">{n.toUpperCase()}</text>
                            {i < nodes.length - 1 && (
                                <path d={`M${x + 60} 90 L${x + 75} 90`} stroke={`${BLUE}88`} strokeWidth="1.2" strokeDasharray="3 3" />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

function DecisionTreeMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-6"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <svg viewBox="0 0 320 180" className="h-full w-full" fill="none">
                {/* root */}
                <rect x="20" y="75" width="70" height="34" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="55" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="600">LEAD</text>
                {/* diamond decision */}
                <path d="M140 92 L160 72 L180 92 L160 112 Z" stroke={BLUE} strokeWidth="1.4" />
                <text x="160" y="95" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600">SCORE</text>
                <path d="M90 92 L140 92" stroke={`${BLUE}88`} strokeWidth="1.2" strokeDasharray="3 3" />
                {/* branches */}
                <path d="M180 80 L240 40" stroke={`${BLUE}88`} strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M180 92 L240 92" stroke={`${BLUE}88`} strokeWidth="1.2" strokeDasharray="3 3" />
                <path d="M180 104 L240 144" stroke={`${BLUE}88`} strokeWidth="1.2" strokeDasharray="3 3" />
                <rect x="240" y="22" width="60" height="32" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="270" y="42" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">PRIORITY</text>
                <rect x="240" y="76" width="60" height="32" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="270" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">NURTURE</text>
                <rect x="240" y="130" width="60" height="32" rx="6" stroke={BLUE} strokeWidth="1.4" />
                <text x="270" y="150" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">ESCALATE</text>
            </svg>
        </div>
    );
}

function DashboardMock() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl p-5"
            style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.08)", aspectRatio: "16 / 10" }}
        >
            <div className="grid h-full grid-cols-3 gap-3">
                {[
                    { v: "98%", l: "Uptime" },
                    { v: "1.2k", l: "Active" },
                    { v: "+24%", l: "Δ Today" },
                ].map((t) => (
                    <div key={t.l} className="flex flex-col justify-between rounded-md p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="text-lg font-bold" style={{ color: GREEN }}>{t.v}</span>
                        <span className="text-[10px] text-white/55">{t.l}</span>
                    </div>
                ))}
                <div className="col-span-3 rounded-md p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <svg viewBox="0 0 280 50" className="h-full w-full" fill="none">
                        <path d="M0 35 L40 25 L80 30 L120 18 L160 22 L200 10 L240 14 L280 6" stroke={BLUE} strokeWidth="1.5" fill="none" />
                        <circle cx="200" cy="10" r="3" fill={GREEN} />
                    </svg>
                </div>
            </div>
            <div
                className="absolute right-4 top-4 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, color: GREEN }}
            >
                LIVE
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AutomationSystemsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const heroRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#07001F] overflow-hidden">
            <PageArcs />

            {/* ── 1. HERO ───────────────────────────────────── */}
            <section
                ref={heroRef}
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:pb-[100px] md:pt-[150px]"
            >
                <HeroBubbles containerRef={heroRef} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <SectionLabel text="Automation & Systems" />
                    <h1
                        className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        AI-powered operations.<br /><span className="jakarta-italic">One unified system.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Workflow automation, decision systems, and executive dashboards that connect every part of your
                        business — so the rails run themselves.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                                boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 20px rgba(114,200,245,0.28), 0 0 20px rgba(155,47,255,0.22), inset 0 0 0 1px rgba(114,200,245,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                            }}
                        >
                            Book a Strategy Call
                        </button>
                        <a href="#sub-services">
                            <NeonButton variant="ghost" size="default" className="text-sm font-semibold tracking-wide px-6 py-3">
                                See What We Build
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* ── 2. PROBLEM — Disconnected systems ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(155,47,255,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(114,200,245,0.05) 0%, transparent 70%)",
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
                        <SectionLabel text="The problem" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Five systems pretending to be one business.
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            CRM doesn't talk to finance. Ops lives in spreadsheets. Reporting is a ritual, not a signal. The work isn't running the business — it's holding it together.
                        </p>
                    </motion.div>

                    {/* Disconnected → connected visualization */}
                    <div
                        className="relative mx-auto h-[420px] w-full max-w-3xl rounded-2xl md:h-[460px]"
                        style={{ background: "rgba(8,1,28,0.45)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {/* SVG connection lines */}
                        <motion.svg
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            className="absolute inset-0 h-full w-full"
                            viewBox="0 0 600 460"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            {[
                                "M75 50 L300 230",
                                "M520 70 L300 230",
                                "M45 280 L300 230",
                                "M520 400 L300 230",
                                "M220 410 L300 230",
                            ].map((d, i) => (
                                <motion.path
                                    key={d}
                                    d={d}
                                    stroke={BLUE}
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                    variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55 } }}
                                    transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: EASE }}
                                />
                            ))}
                        </motion.svg>

                        {/* central hub */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
                            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                        >
                            <div
                                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full md:h-28 md:w-28"
                                style={{
                                    background: "rgba(8,1,28,0.95)",
                                    border: `1.5px solid ${GREEN}`,
                                    boxShadow: `0 0 0 8px #07001F, 0 0 32px ${GREEN}44`,
                                }}
                            >
                                <IconBolt />
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GREEN }}>Hub</span>
                            </div>
                        </motion.div>

                        {/* floating cards */}
                        {DISCONNECTED.map((card) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: card.delay, ease: EASE }}
                                className="absolute flex items-center gap-2 rounded-xl px-3 py-2"
                                style={{ ...card.pos, background: "rgba(8,1,28,0.85)", border: `1px solid ${BLUE}55`, backdropFilter: "blur(4px)" }}
                            >
                                <card.Icon />
                                <span className="text-xs font-bold text-white">{card.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. APPROACH — Architecture map ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.06) 0%, transparent 65%)",
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
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            The automation architecture map.
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Five stages. Branching decision logic on top. Optimised for the way your business actually runs.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* spine */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{
                                top: "60px",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${BLUE}66 6%, ${BLUE}66 94%, transparent)`,
                            }}
                        />
                        {/* sub-branches (decorative) */}
                        <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-32 w-full lg:block" viewBox="0 0 1000 120" fill="none" preserveAspectRatio="none">
                            <path d="M250 60 L300 20" stroke={`${BLUE}55`} strokeWidth="1" strokeDasharray="3 3" />
                            <path d="M250 60 L200 100" stroke={`${BLUE}55`} strokeWidth="1" strokeDasharray="3 3" />
                            <path d="M550 60 L600 20" stroke={`${BLUE}55`} strokeWidth="1" strokeDasharray="3 3" />
                            <path d="M750 60 L800 100" stroke={`${BLUE}55`} strokeWidth="1" strokeDasharray="3 3" />
                            {/* diamond decision nodes */}
                            <path d="M295 12 L305 22 L295 32 L285 22 Z" stroke={BLUE} strokeWidth="1.2" />
                            <path d="M195 92 L205 102 L195 112 L185 102 Z" stroke={BLUE} strokeWidth="1.2" />
                            <path d="M595 12 L605 22 L595 32 L585 22 Z" stroke={BLUE} strokeWidth="1.2" />
                            <path d="M795 92 L805 102 L795 112 L785 102 Z" stroke={BLUE} strokeWidth="1.2" />
                        </svg>

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
                                            background: "rgba(8,1,28,1)",
                                            border: `1.5px solid ${BLUE}`,
                                            boxShadow: `0 0 0 6px #07001F, 0 0 22px ${BLUE}33`,
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

            {/* ── 4. SUB-SERVICES — Alternating ── */}
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
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Three layers of operational intelligence.
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-20 md:gap-28">
                        {SUB_AUTOMATION.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const Visual = svc.visual === "workflow" ? WorkflowMock : svc.visual === "tree" ? DecisionTreeMock : DashboardMock;
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
                                            <span className="text-5xl font-extrabold leading-none md:text-6xl" style={{ color: GREEN }}>{svc.num}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{svc.eyebrow}</span>
                                        </div>
                                        <h3 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">{svc.title}</h3>
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
                                        <Visual />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 5. OUTCOMES — Real-time dashboard ── */}
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
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            What unified automation ships.
                        </h2>
                    </motion.div>

                    <div
                        className="rounded-2xl p-6 md:p-8"
                        style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Operations dashboard</span>
                            <div className="flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, color: GREEN }}>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                                LIVE
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {OPS_METRICS.map((m, i) => (
                                <MetricTile key={m.label} {...m} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. DELIVERY PROCESS — Deployment roadmap ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Deployment" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Roadmap to production.
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute left-7 top-2 bottom-2 w-px md:left-9"
                            style={{ background: `linear-gradient(to bottom, transparent, ${BLUE}55 8%, ${BLUE}55 92%, transparent)` }}
                        />
                        <div className="flex flex-col gap-6">
                            {DEPLOYMENT.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                    className="relative flex items-start gap-6 md:gap-8"
                                >
                                    <div
                                        className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full md:h-[72px] md:w-[72px]"
                                        style={{
                                            background: "rgba(8,1,28,1)",
                                            border: `1.5px solid ${BLUE}`,
                                            boxShadow: `0 0 0 6px #07001F, 0 0 22px ${BLUE}33`,
                                        }}
                                    >
                                        <span className="text-base font-bold md:text-xl" style={{ color: GREEN }}>{step.num}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1.5 rounded-xl p-5" style={{ background: "rgba(8,1,28,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                        <h3 className="text-lg font-bold text-white md:text-xl">{step.title}</h3>
                                        <p className="text-sm leading-relaxed text-white/55 md:text-base">{step.body}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ — Console style ── */}
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
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            From the operations console.
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
                <div className="pointer-events-none absolute inset-0 opacity-30">
                    <svg viewBox="0 0 1200 400" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
                        <path d="M0 150 Q400 50 800 150 T1600 150" stroke={`${BLUE}33`} strokeWidth="1" />
                        <path d="M0 220 Q400 320 800 220 T1600 220" stroke={`${BLUE}22`} strokeWidth="1" />
                        <path d="M0 280 Q400 180 800 280 T1600 280" stroke={`${BLUE}22`} strokeWidth="1" />
                        {[150, 350, 550, 750, 950].map((x) => (
                            <circle key={x} cx={x} cy="150" r="3" fill={GREEN} opacity="0.5" />
                        ))}
                    </svg>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
                >
                    <h2 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl">
                        Let your operations <span className="jakarta-italic">run themselves.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Map the chaos. Architect the spine. Ship the system. Watch the throughput compound.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
                            style={{
                                background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                                boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 20px rgba(114,200,245,0.28), 0 0 20px rgba(155,47,255,0.22), inset 0 0 0 1px rgba(114,200,245,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                    "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                            }}
                        >
                            Book a Strategy Call
                        </button>
                        <a href="/products/sales-intelligence-platform">
                            <NeonButton variant="ghost" size="default" className="text-sm font-semibold tracking-wide px-6 py-3">
                                Explore More
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "rgba(0,255,221,0.9)";
const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";

// Reveal once in view, with a timed fallback so visuals still show even if the
// IntersectionObserver never fires (iOS Safari + smooth scroll can miss it).
function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
    const observed = useInView(ref, { once: true, margin: "200px" });
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    return observed || forced;
}

// ── Icons ────────────────────────────────────────────────────────────────
function IconCheck({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5l2.2 2.2L8 3.2" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconCross() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 3l8 8M11 3l-8 8" stroke="rgba(255,120,120,0.85)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

// ── Process step icons ────────────────────────────────────────────────────
const ICON_STROKE = "rgba(0,255,221,0.9)";
const ICON_STROKE_DIM = "rgba(0,255,221,0.45)";

function IconAssess() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="10.5" cy="10.5" r="5.5" stroke={ICON_STROKE} strokeWidth="1.5" />
            <line x1="14.7" y1="14.7" x2="20" y2="20" stroke={ICON_STROKE} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10.5" cy="10.5" r="1.6" fill={ICON_STROKE} />
        </svg>
    );
}
function IconArchitect() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 8V5h3M16 5h3v3M5 16v3h3M16 19h3v-3" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
            <rect x="8.5" y="8.5" width="7" height="7" stroke={ICON_STROKE} strokeWidth="1.3" opacity="0.7" />
            <line x1="12" y1="8.5" x2="12" y2="15.5" stroke={ICON_STROKE} strokeWidth="1" opacity="0.4" />
            <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={ICON_STROKE} strokeWidth="1" opacity="0.4" />
        </svg>
    );
}
function IconIntegrate() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="9" cy="12" r="4.4" stroke={ICON_STROKE} strokeWidth="1.5" />
            <circle cx="15" cy="12" r="4.4" stroke={ICON_STROKE} strokeWidth="1.5" />
            <path d="M11.4 12h1.2" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}
function IconOptimise() {
    return (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 19V14M9 19V11M14 19V8M19 19V5" stroke={ICON_STROKE} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M3 11L8 6L13 9L20 3" stroke={ICON_STROKE_DIM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 3h3v3" stroke={ICON_STROKE_DIM} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
const PROCESS_ICONS = [IconAssess, IconArchitect, IconIntegrate, IconOptimise];

// ── AI Problem visual: pain points as SVG rows ───────────────────────────
function AIProblemVisual() {
    // SVG path for each icon, rendered at 10×10 centred in the badge
    const icons: Record<string, React.ReactNode> = {
        cost:    <><path d="M12 3v18" stroke="rgba(255,80,80,0.85)" strokeWidth="1.6" strokeLinecap="round" /><path d="M16 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H8" stroke="rgba(255,80,80,0.85)" strokeWidth="1.6" strokeLinecap="round" /></>,
        broken:  <><circle cx="12" cy="12" r="7" stroke="rgba(255,80,80,0.85)" strokeWidth="1.6" /><path d="M8 8l8 8" stroke="rgba(255,80,80,0.85)" strokeWidth="1.6" strokeLinecap="round" /></>,
        complex: <><path d="M4 6h16M4 12h10M4 18h6" stroke="rgba(255,80,80,0.85)" strokeWidth="1.6" strokeLinecap="round" /><circle cx="18" cy="18" r="3" stroke="rgba(255,80,80,0.55)" strokeWidth="1.3" /><path d="M16.8 18l.8.8 1.6-1.6" stroke="rgba(255,80,80,0.85)" strokeWidth="1.2" strokeLinecap="round" /></>,
        down:    <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(255,80,80,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    };
    const rows = [
        { text: "More AI tools = More subscription fees",   icon: "cost"    },
        { text: "More disconnected systems",                icon: "broken"  },
        { text: "More operational complexity",              icon: "complex" },
        { text: "More fragmented workflows",                icon: "broken"  },
        { text: "Less visibility across operations",        icon: "down"    },
        { text: "Less efficiency at scale",                 icon: "down"    },
    ];
    const rowH = 38;
    const startY = 50;
    const ref = useRef<HTMLDivElement>(null);
    const inView = useReveal(ref);

    return (
        <div ref={ref} className="relative mx-auto w-full max-w-md">
            <svg viewBox={`0 0 360 ${startY + rows.length * rowH + 24}`} className="block h-auto w-full" fill="none">
                <text x="0" y="32" fontFamily={MONO} fontSize="9" fontWeight="700"
                    letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">THE PATTERN WE SEE</text>
                {rows.map((row, i) => (
                    <motion.g key={row.text}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : undefined}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE }}
                    >
                        {/* Row background */}
                        <rect x="0" y={startY + i * rowH} width="360" height={rowH - 4} rx="7"
                            fill="rgba(10,14,28,0.95)" stroke="rgba(255,80,80,0.18)" strokeWidth="1" />
                        {/* Left accent bar */}
                        <rect x="0" y={startY + i * rowH} width="3" height={rowH - 4} rx="1.5"
                            fill="rgba(255,80,80,0.55)" />
                        {/* Icon badge */}
                        <rect x="8" y={startY + i * rowH + 6} width="22" height="22" rx="5"
                            fill="rgba(255,80,80,0.08)" stroke="rgba(255,80,80,0.22)" strokeWidth="0.8" />
                        {/* SVG icon centred in badge — 24×24 viewBox mapped into 22×22 space at (8, rowY+6) */}
                        <g transform={`translate(8, ${startY + i * rowH + 6}) scale(${22 / 24})`}>
                            {icons[row.icon]}
                        </g>
                        {/* Pain point text */}
                        <text x="40" y={startY + i * rowH + 22}
                            fontFamily={MONO} fontSize="10" fontWeight="500"
                            fill="rgba(255,255,255,0.65)">{row.text}
                        </text>
                    </motion.g>
                ))}
            </svg>
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

function IconArrowRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Data ─────────────────────────────────────────────────────────────────
const FAILURES = [
    { num: "01", title: "Tools Without Strategy", body: "Scattered AI apps, no central intelligence, no shared context. Every team is solving a sliver of the problem in isolation." },
    { num: "02", title: "Generic Outputs", body: "The same off-the-shelf models your competitors are running. No differentiation, no proprietary edge, no compounding advantage." },
    { num: "03", title: "Integration Debt", body: "Messy stack, disconnected workflows, brittle scripts holding it all together. Maintenance cost outpaces the value delivered." },
];

const LAYERS = [
    { num: "01", title: "Data Mapping", body: "Inventory the signals, sources, and structures that matter, before any model touches them." },
    { num: "02", title: "Decision Design", body: "Define the decisions AI should make, the ones humans keep, and the audit trail between them." },
    { num: "03", title: "AI Integration Layer", body: "Models, prompts, and guardrails wired into the systems your team already operates in." },
    { num: "04", title: "Workflow Intelligence", body: "Intelligent routing across the work itself, prioritisation, escalation, summarisation, action." },
    { num: "05", title: "Continuous Optimisation", body: "Feedback loops that improve precision, cost, and coverage over time. Intelligence as infrastructure, not a one-time install." },
];

const AI_STACK_SERVICES = [
    {
        num: "01",
        title: "AI Integration",
        eyebrow: "Connected intelligence",
        body: "Wire AI into the systems your team already runs in, CRM, database, workflow tools, without rebuilding the stack underneath.",
        bullets: ["CRM + AI orchestration", "Database-aware retrieval", "Workflow trigger automation", "Audit-grade observability"],
    },
    {
        num: "02",
        title: "AI Assistants",
        eyebrow: "Internal + customer",
        body: "Purpose-built assistants for the surfaces your team and customers actually use. Context-aware, tone-tuned, grounded in your data.",
        bullets: ["Internal knowledge assistants", "Customer-facing copilots", "RAG over your documents", "Channel deployment (Slack, web, CRM)"],
    },
    {
        num: "03",
        title: "Intelligent Workflows",
        eyebrow: "Decision routing",
        body: "AI-driven branching, prioritisation, and escalation across the operational paths that matter most. Decisions in milliseconds, with a trail.",
        bullets: ["Conditional routing engines", "Smart prioritisation", "Human-in-the-loop checkpoints", "Outcome-aware learning"],
    },
    {
        num: "04",
        title: "Custom AI Solutions",
        eyebrow: "Bespoke models",
        body: "Fine-tuned models, custom data pipelines, predictive systems, built when off-the-shelf intelligence isn't enough.",
        bullets: ["Fine-tuning on proprietary data", "Custom embeddings + vector stores", "Predictive + classification models", "Private deployment options"],
    },
];

const KPI_METRICS = [
    { value: 60, suffix: "%", label: "Avg reduction in manual decision time" },
    { value: 4, suffix: "×", label: "Increase in qualified pipeline per rep" },
    { value: 85, suffix: "%", label: "Support queries resolved without escalation" },
    { value: 3, suffix: "mo", label: "Typical time to measurable ROI" },
];

const LIFECYCLE = [
    { num: "01", title: "Discovery & Audit", body: "Map data sources, decision surfaces, and the processes AI should touch." },
    { num: "02", title: "Architecture", body: "Design the intelligence layer: models, retrieval, guardrails, and integrations." },
    { num: "03", title: "Build & Test", body: "Engineering in staging, red-teaming outputs, integrating with live systems." },
    { num: "04", title: "Deploy & Monitor", body: "Phased rollout, observability from day one, live feedback loops from the start." },
    { num: "05", title: "Compound & Expand", body: "Continuous optimisation, model iteration, and expansion across new workflows." },
];

// ── KPI counter ───────────────────────────────────────────────────────────
function KPI({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
    const { count, elRef } = useCountUp(value);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
            className="flex flex-col items-center gap-3 text-center"
        >
            <span ref={elRef} className="display-stat">
                {count}{suffix}
            </span>
            <span className="max-w-[140px] text-caption text-white/55 tracking-wide sm:max-w-[200px]">{label}</span>
        </motion.div>
    );
}

// ── Lifecycle step card ───────────────────────────────────────────────────
function StepCard({ step }: { step: typeof LIFECYCLE[number] }) {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="display-card-title">{step.title}</h3>
            <p className="text-body-sm text-white/55">{step.body}</p>
        </div>
    );
}

const PROBLEM_BULLETS = [
    "More AI tools = More subscription fees",
    "More disconnected systems",
    "More operational complexity",
    "More fragmented workflows",
    "Less visibility across operations",
    "Less efficiency at scale",
];

const PROCESS_STEPS = [
    {
        num: "01",
        title: "Assess",
        body: "We analyse your operations, workflows, systems, and challenges to identify where intelligence can create the greatest impact.",
    },
    {
        num: "02",
        title: "Architect",
        body: "We design an intelligence strategy tailored to your business, ensuring every solution aligns with operational goals and growth objectives.",
    },
    {
        num: "03",
        title: "Integrate",
        body: "We embed intelligence into workflows, systems, and processes to create a connected operational ecosystem.",
    },
    {
        num: "04",
        title: "Optimise",
        body: "We continuously refine and improve performance as your business evolves, ensuring intelligence scales alongside growth.",
    },
];

const FAQS = [
    { q: "Do we need to be \"AI-ready\" to start?", a: "No. The Assess phase is designed to surface gaps and quick wins simultaneously, most engagements ship a usable AI workflow in the first 4–6 weeks while the longer-horizon foundation is built in parallel." },
    { q: "Which models do you use?", a: "Frontier (Claude, GPT, Gemini) for general reasoning. Fine-tuned open-source (Llama, Mistral) when latency, cost, or data residency demand it. We pick the model that fits the job, not the other way around." },
    { q: "Where does our data live?", a: "Your infrastructure by default. Private deployment, isolated retrieval, no model-provider training on your inputs. SOC 2 / ISO 27001 alignment available on request." },
    { q: "How do you measure AI success?", a: "Decision quality, time-to-decision, automation coverage, and ROI against the baseline you defined in the assessment. Vanity metrics like \"messages generated\" don't count." },
    { q: "What happens after launch?", a: "Continuous-optimisation packages cover monitoring, drift detection, prompt + model iteration, and expansion of coverage into adjacent workflows. AI systems compound, we keep them compounding." },
];

const CY = "rgba(123,85,234";

// ── Shared frame ──────────────────────────────────────────────────────────
function AIFrame({ refEl, inView, children }: { refEl: React.RefObject<HTMLDivElement | null>; inView: boolean; children: React.ReactNode }) {
    return (
        <motion.div ref={refEl}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative w-full"
            style={{ aspectRatio: "5 / 4" }}
        >
            {children}
        </motion.div>
    );
}

// ── Service Visual 1: AI Integration ─────────────────────────────────────
// Browser app showing a CRM-like UI with a floating AI connector panel
function AIIntegrationVisual() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useReveal(ref);

    // Three stacked system blocks (CRM, DATABASE, WORKFLOW) each with a
    // status indicator and a live data reading. A shared AI layer bar sits
    // between them and a results column, showing the AI processing each
    // system's data and producing a single enriched output per system.
    // No nodes, no arrows — just a clean architecture stack.

    const systems = [
        {
            y: 32,
            tag: "CRM",
            line1: "1,240 contacts",
            line2: "84 deals open",
            result: "12 leads ready to contact",
            resultCy: true,
        },
        {
            y: 98,
            tag: "DATABASE",
            line1: "Sales history",
            line2: "Order & billing data",
            result: "3 accounts need follow-up",
            resultCy: false,
        },
        {
            y: 164,
            tag: "WORKFLOW",
            line1: "48 tasks pending",
            line2: "6 overdue callbacks",
            result: "6 calls overdue, act now",
            resultCy: true,
        },
    ];

    const SX = 8;    // system block left x
    const SW = 120;  // system block width
    const SH = 54;   // system block height
    const AIX = 148; // AI layer left x
    const AIW = 84;  // AI layer width
    const RX = 252;  // result block left x
    const RW = 120;  // result block width

    return (
        <AIFrame refEl={ref} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-3">
            <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">

                {/* ── AI layer centre column ── */}
                <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
                    {/* Full-height AI bar */}
                    <rect x={AIX} y={systems[0].y} width={AIW}
                        height={systems[systems.length - 1].y + SH - systems[0].y}
                        rx="8" fill="rgba(14,16,22,0.98)"
                        stroke={`${CY}, 0.35)`} strokeWidth="1.2" />
                    {/* Top label */}
                    <text x={AIX + AIW / 2} y={systems[0].y - 8} textAnchor="middle"
                        fontFamily={MONO} fontSize="6.5" fontWeight="700" letterSpacing="0.16em"
                        fill={`${CY}, 0.65)`}>AI LAYER</text>
                    {/* Pulsing centre dot */}
                    <motion.circle cx={AIX + AIW / 2} cy={systems[1].y + SH / 2} r="5"
                        fill={`${CY}, 0.12)`} stroke={`${CY}, 0.55)`} strokeWidth="1.2"
                        animate={inView ? { r: [4, 7, 4], opacity: [0.7, 1, 0.7] } : {}}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx={AIX + AIW / 2} cy={systems[1].y + SH / 2} r="2.5"
                        fill={`${CY}, 0.9)`}
                        animate={inView ? { opacity: [0.6, 1, 0.6] } : {}}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
                    {/* Tick marks per system */}
                    {systems.map((s) => (
                        <g key={`tick-${s.y}`}>
                            <line x1={AIX + 10} y1={s.y + SH / 2} x2={AIX + AIW - 10} y2={s.y + SH / 2}
                                stroke={`${CY}, 0.15)`} strokeWidth="0.8" />
                        </g>
                    ))}
                    {/* MODEL label bottom */}
                    <text x={AIX + AIW / 2} y={systems[systems.length - 1].y + SH + 14}
                        textAnchor="middle" fontFamily={MONO} fontSize="6"
                        letterSpacing="0.12em" fill={`${CY}, 0.35)`}>MODEL</text>
                </motion.g>

                {/* ── System blocks + connectors + result blocks ── */}
                {systems.map((s, i) => (
                    <motion.g key={s.tag}
                        initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.22 + i * 0.1, ease: EASE }}>

                        {/* ── System block ── */}
                        <rect x={SX} y={s.y} width={SW} height={SH} rx="7"
                            fill="rgba(16,18,26,0.98)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        {/* Top accent */}
                        <rect x={SX} y={s.y} width={SW} height="3" rx="1.5"
                            fill="rgba(255,255,255,0.16)" />
                        {/* Tag */}
                        <rect x={SX + 8} y={s.y + 9} width="44" height="13" rx="3"
                            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
                        <text x={SX + 30} y={s.y + 19} textAnchor="middle" fontFamily={MONO}
                            fontSize="6" fontWeight="700" letterSpacing="0.1em"
                            fill="rgba(255,255,255,0.5)">{s.tag}</text>
                        {/* Data lines */}
                        <text x={SX + 8} y={s.y + 34} fontFamily={MONO} fontSize="7.5"
                            fill="rgba(255,255,255,0.65)">{s.line1}</text>
                        <text x={SX + 8} y={s.y + 47} fontFamily={MONO} fontSize="7"
                            fill="rgba(255,255,255,0.3)">{s.line2}</text>

                        {/* ── Left connector: system → AI ── */}
                        <line x1={SX + SW} y1={s.y + SH / 2} x2={AIX} y2={s.y + SH / 2}
                            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                        {/* Pulse left → AI */}
                        <motion.circle r="2" cy={s.y + SH / 2} fill="rgba(255,255,255,0.55)"
                            animate={inView ? { cx: [SX + SW, AIX], opacity: [0, 1, 0] } : { opacity: 0 }}
                            transition={{ duration: 0.7, delay: 0.7 + i * 0.22, repeat: Infinity, ease: "easeInOut" }} />

                        {/* ── Right connector: AI → result ── */}
                        <line x1={AIX + AIW} y1={s.y + SH / 2} x2={RX} y2={s.y + SH / 2}
                            stroke={`${CY}, 0.2)`} strokeWidth="1" strokeDasharray="3 3" />
                        {/* Pulse AI → result */}
                        <motion.circle r="2" cy={s.y + SH / 2} fill={`${CY}, 0.8)`}
                            animate={inView ? { cx: [AIX + AIW, RX], opacity: [0, 1, 0] } : { opacity: 0 }}
                            transition={{ duration: 0.65, delay: 1.0 + i * 0.25, repeat: Infinity, ease: "easeInOut" }} />

                        {/* ── Result block ── */}
                        <rect x={RX} y={s.y + 8} width={RW} height={SH - 16} rx="6"
                            fill={s.resultCy ? `${CY}, 0.06)` : "rgba(255,255,255,0.03)"}
                            stroke={s.resultCy ? `${CY}, 0.3)` : "rgba(255,255,255,0.08)"} strokeWidth="1" />
                        <text x={RX + 10} y={s.y + SH / 2 + 4} fontFamily={MONO} fontSize="7.5"
                            fontWeight="700"
                            fill={s.resultCy ? `${CY}, 0.88)` : "rgba(255,255,255,0.45)"}>{s.result}</text>
                    </motion.g>
                ))}

                {/* ── Column headers ── */}
                <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.1, ease: EASE }}>
                    <text x={SX + SW / 2} y="20" textAnchor="middle" fontFamily={MONO}
                        fontSize="6.5" letterSpacing="0.16em" fill="rgba(255,255,255,0.2)">YOUR SYSTEMS</text>
                    <text x={RX + RW / 2} y="20" textAnchor="middle" fontFamily={MONO}
                        fontSize="6.5" letterSpacing="0.16em" fill={`${CY}, 0.4)`}>OUTPUT</text>
                </motion.g>

                {/* ── Stat strip ── */}
                <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.75, ease: EASE }}>
                    <line x1="8" y1="242" x2="372" y2="242" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                    <text x="63"  y="256" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">DATA PROCESSING</text>
                    <text x="63"  y="272" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">40–70%</text>
                    <text x="63"  y="282" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">faster</text>
                    <text x="190" y="256" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">MANUAL TASKS</text>
                    <text x="190" y="272" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CY}, 0.9)`}>60%</text>
                    <text x="190" y="282" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">eliminated</text>
                    <text x="317" y="256" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">DECISIONS</text>
                    <text x="317" y="272" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">3×</text>
                    <text x="317" y="282" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">faster</text>
                </motion.g>
            </svg>
            </div>
        </AIFrame>
    );
}

// ── Service Visual 2: Intelligent Workflows ───────────────────────────────
// Pipeline: task in → AI decision diamond → three labelled output branches
function IntelligentWorkflowsVisual() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useReveal(ref);

    // Node spine sits at x=190 centre. Label boxes extend left (BEFORE) or right (AFTER).
    // 4 rows, 52px apart, starting at y=40. Stat strip at y=254.
    const CX = 190;
    const stepH = 50;
    const startY = 44;
    const nodeR = 14;
    const boxW = 128;
    const gap = 10; // gap between node edge and box

    const steps = [
        {
            before: { label: "REQUEST IN",    sub: "email / Slack" },
            after:  { label: "REQUEST IN",    sub: "any channel"   },
        },
        {
            before: { label: "MANUAL REVIEW", sub: "15 min avg"    },
            after:  { label: "AUTO-CLASSIFY", sub: "instant"       },
        },
        {
            before: { label: "MANUAL ASSIGN", sub: "manager picks" },
            after:  { label: "SMART ROUTING", sub: "right person"  },
        },
        {
            before: { label: "PROCESSED",     sub: "2–4 days"      },
            after:  { label: "RESOLVED",      sub: "same day"      },
        },
    ];

    return (
        <AIFrame refEl={ref} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-3">
                <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">

                    {/* ── Column headers ── */}
                    <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.35, delay: 0.05, ease: EASE }}>
                        {/* BEFORE header — left of centre */}
                        <text x={CX - nodeR - gap - boxW / 2} y="18" textAnchor="middle"
                            fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.18em"
                            fill="rgba(255,80,80,0.65)">MANUAL</text>
                        {/* AFTER header — right of centre */}
                        <text x={CX + nodeR + gap + boxW / 2} y="18" textAnchor="middle"
                            fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.18em"
                            fill={`${CY}, 0.75)`}>AI-DRIVEN</text>
                    </motion.g>

                    {/* ── Centre spine (shared vertical line) ── */}
                    <motion.line
                        x1={CX} y1={startY - nodeR + 2}
                        x2={CX} y2={startY + (steps.length - 1) * stepH + nodeR - 2}
                        stroke="rgba(255,255,255,0.08)" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                    />

                    {/* ── Animated pulses travelling down spine ── */}
                    {steps.slice(0, -1).map((_, i) => (
                        <motion.circle key={`pulse-${i}`} r="2.4" cx={CX}
                            fill={`${CY}, 0.85)`}
                            animate={inView ? {
                                cy: [startY + i * stepH + nodeR + 2, startY + (i + 1) * stepH - nodeR - 2],
                                opacity: [0, 1, 0],
                            } : {}}
                            transition={{ duration: 0.9, delay: 0.85 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}

                    {/* ── Step rows ── */}
                    {steps.map((step, i) => {
                        const cy = startY + i * stepH;
                        const isLast = i === steps.length - 1;
                        // Left box: x from (CX - nodeR - gap - boxW) to (CX - nodeR - gap)
                        const lx = CX - nodeR - gap - boxW;
                        // Right box: x from (CX + nodeR + gap) to (CX + nodeR + gap + boxW)
                        const rx = CX + nodeR + gap;

                        return (
                            <motion.g key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.2 + i * 0.09, ease: EASE }}
                            >
                                {/* ── BEFORE box (left) ── */}
                                <rect x={lx} y={cy - 16} width={boxW} height="32" rx="7"
                                    fill="rgba(16,18,26,0.98)"
                                    stroke="rgba(255,80,80,0.18)" strokeWidth="1" />
                                {/* right accent bar flush against node */}
                                <rect x={lx + boxW - 3} y={cy - 16} width="3" height="32" rx="1.5"
                                    fill="rgba(255,80,80,0.35)" />
                                <text x={lx + 10} y={cy - 3} fontFamily={MONO}
                                    fontSize="8.5" fontWeight="700" letterSpacing="0.07em"
                                    fill="rgba(255,255,255,0.6)">{step.before.label}</text>
                                <text x={lx + 10} y={cy + 11} fontFamily={MONO}
                                    fontSize="7" letterSpacing="0.06em"
                                    fill="rgba(255,80,80,0.5)">{step.before.sub}</text>

                                {/* ── Centre node ── */}
                                <circle cx={CX} cy={cy} r={nodeR}
                                    fill={isLast ? `${CY}, 0.1)` : "rgba(14,16,22,0.98)"}
                                    stroke={isLast ? `${CY}, 0.75)` : "rgba(255,255,255,0.2)"}
                                    strokeWidth={isLast ? "1.8" : "1"} />
                                {isLast
                                    ? <path d={`M${CX - 6} ${cy + 1} l4.5 4.5 l7.5 -8`}
                                        stroke={`${CY}, 0.95)`} strokeWidth="1.7"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                    : <text x={CX} y={cy + 4} textAnchor="middle"
                                        fontFamily={MONO} fontSize="8" fontWeight="700"
                                        fill="rgba(255,255,255,0.35)">{i + 1}</text>
                                }

                                {/* ── AFTER box (right) ── */}
                                <rect x={rx} y={cy - 16} width={boxW} height="32" rx="7"
                                    fill="rgba(14,16,22,0.98)"
                                    stroke={`${CY}, ${isLast ? "0.45" : "0.2"})`} strokeWidth="1" />
                                {/* left accent bar flush against node */}
                                <rect x={rx} y={cy - 16} width="3" height="32" rx="1.5"
                                    fill={`${CY}, ${isLast ? "0.7" : "0.35"})`} />
                                <text x={rx + 12} y={cy - 3} fontFamily={MONO}
                                    fontSize="8.5" fontWeight="700" letterSpacing="0.07em"
                                    fill={`${CY}, ${isLast ? "0.95" : "0.75"})`}>{step.after.label}</text>
                                <text x={rx + 12} y={cy + 11} fontFamily={MONO}
                                    fontSize="7" letterSpacing="0.06em"
                                    fill={`${CY}, 0.4)`}>{step.after.sub}</text>
                            </motion.g>
                        );
                    })}

                    {/* ── Bottom stat strip ── */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.65, ease: EASE }}>
                        <line x1="8" y1="252" x2="372" y2="252"
                            stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="63"  y="265" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">SPEED</text>
                        <text x="63"  y="280" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">65%</text>
                        <text x="63"  y="290" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.25)">faster</text>
                        <text x="190" y="265" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">ERROR RATE</text>
                        <text x="190" y="280" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CY}, 0.9)`}>70%</text>
                        <text x="190" y="290" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.25)">reduction</text>
                        <text x="317" y="265" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">THROUGHPUT</text>
                        <text x="317" y="280" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">4×</text>
                        <text x="317" y="290" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.25)">increase</text>
                    </motion.g>
                </svg>
            </div>
        </AIFrame>
    );
}

// ── Service Visual 3: Custom AI Solutions ─────────────────────────────────
function CustomAISolutionsVisual() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useReveal(ref);

    // Layout: 4 input rows on left (y=40,84,128,172), engine centre at (190,106),
    // 3 output rows on right (y=62,106,150).
    // Connectors are straight elbow lines (horizontal then diagonal) so pulses
    // can animate cleanly on a single axis without bezier tracking issues.
    // Engine right edge = 190+38 = 228. Engine left edge = 190-38 = 152.
    // Input right edge = 4+96 = 100. Output left edge = 276.
    // Elbow bend point for inputs: x=126 (midway between 100 and 152).
    // Elbow bend point for outputs: x=252 (midway between 228 and 276).

    const ECX = 190, ECY = 106, ER = 38;
    const INX2 = 100;   // right edge of input boxes
    const ELBOWL = 126; // left elbow x
    const ELBOWR = 252; // right elbow x
    const OUTX1 = 276;  // left edge of output boxes

    const inputs = [
        { y: 40,  label: "CRM DATA",    sub: "contacts · deals"  },
        { y: 84,  label: "OPS DATA",    sub: "tasks · logs"      },
        { y: 128, label: "PROD DATA",   sub: "events · usage"    },
        { y: 172, label: "DOCS",        sub: "text · history"    },
    ];
    const outputs = [
        { y: 62,  label: "SCORING",     sub: "leads ranked"      },
        { y: 106, label: "AUTOMATION",  sub: "decisions made"    },
        { y: 150, label: "FORECASTING", sub: "outcomes predicted" },
    ];
    // Engine entry/exit y positions spread evenly across left/right arcs
    const engineInY  = (i: number) => ECY + (i - 1.5) * 16; // 4 inputs
    const engineOutY = (i: number) => ECY + (i - 1)   * 22; // 3 outputs

    return (
        <AIFrame refEl={ref} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-3">
                <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">
                    <defs>
                        <radialGradient id="cai_core" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={`${CY}, 0.15)`} />
                            <stop offset="100%" stopColor={`${CY}, 0.01)`} />
                        </radialGradient>
                    </defs>

                    {/* ── Section labels ── */}
                    <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}>
                        <text x="52" y="13" textAnchor="middle" fontFamily={MONO} fontSize="7"
                            letterSpacing="0.16em" fill="rgba(255,255,255,0.22)">YOUR DATA</text>
                        <line x1="4" y1="18" x2="100" y2="18" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
                        <text x="325" y="13" textAnchor="middle" fontFamily={MONO} fontSize="7"
                            letterSpacing="0.16em" fill={`${CY}, 0.38)`}>OUTPUTS</text>
                        <line x1="276" y1="18" x2="376" y2="18" stroke={`${CY}, 0.1)`} strokeWidth="0.7" />
                    </motion.g>

                    {/* ── Input boxes ── */}
                    {inputs.map((inp, i) => (
                        <motion.g key={inp.label}
                            initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.08 + i * 0.07, ease: EASE }}>
                            <rect x="4" y={inp.y - 18} width="96" height="36" rx="7"
                                fill="rgba(18,20,28,0.98)" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
                            <rect x="4" y={inp.y - 18} width="3" height="36" rx="1.5"
                                fill="rgba(255,255,255,0.18)" />
                            <circle cx="92" cy={inp.y - 6} r="2.5" fill={`${CY}, 0.55)`} />
                            <text x="14" y={inp.y - 3} fontFamily={MONO} fontSize="8" fontWeight="700"
                                letterSpacing="0.09em" fill="rgba(255,255,255,0.72)">{inp.label}</text>
                            <text x="14" y={inp.y + 10} fontFamily={MONO} fontSize="6.5"
                                letterSpacing="0.06em" fill="rgba(255,255,255,0.28)">{inp.sub}</text>
                        </motion.g>
                    ))}

                    {/* ── Input connectors: straight H → elbow → diagonal to engine ── */}
                    {inputs.map((inp, i) => {
                        const ey = engineInY(i);
                        return (
                            <motion.path key={`li-${i}`}
                                d={`M${INX2} ${inp.y} L${ELBOWL} ${inp.y} L${ECX - ER} ${ey}`}
                                stroke="rgba(255,255,255,0.09)" strokeWidth="1"
                                strokeDasharray="3 4" fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                                transition={{ duration: 0.45, delay: 0.28 + i * 0.06, ease: EASE }}
                            />
                        );
                    })}

                    {/* ── Input pulses: animate cx along horizontal segment only ── */}
                    {inputs.map((inp, i) => (
                        <motion.circle key={`pi-${i}`} r="2.5" cy={inp.y}
                            fill={`${CY}, 0.8)`}
                            animate={inView ? { cx: [INX2, ELBOWL], opacity: [0, 1, 0] } : { opacity: 0 }}
                            transition={{ duration: 0.7, delay: 0.75 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}

                    {/* ── Central engine ── */}
                    <motion.g initial={{ opacity: 0, scale: 0.88 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
                        style={{ transformOrigin: `${ECX}px ${ECY}px` }}>
                        <circle cx={ECX} cy={ECY} r={ER + 14} fill="url(#cai_core)" />
                        <motion.circle cx={ECX} cy={ECY} r={ER + 7}
                            fill="none" stroke={`${CY}, 0.14)`} strokeWidth="1"
                            animate={inView ? { r: [ER + 5, ER + 13, ER + 5], opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
                        <circle cx={ECX} cy={ECY} r={ER}
                            fill="rgba(14,16,24,0.98)" stroke={`${CY}, 0.58)`} strokeWidth="1.5" />
                        <circle cx={ECX} cy={ECY} r={ER - 10}
                            fill="none" stroke={`${CY}, 0.11)`} strokeWidth="1" strokeDasharray="4 3" />
                        <text x={ECX} y={ECY - 7} textAnchor="middle" fontFamily={MONO}
                            fontSize="9" fontWeight="700" letterSpacing="0.14em" fill={`${CY}, 0.95)`}>YOUR AI</text>
                        <text x={ECX} y={ECY + 8} textAnchor="middle" fontFamily={MONO}
                            fontSize="7" letterSpacing="0.1em" fill="rgba(255,255,255,0.38)">MODEL</text>
                        <text x={ECX} y={ECY + 21} textAnchor="middle" fontFamily={MONO}
                            fontSize="6.5" letterSpacing="0.1em" fill={`${CY}, 0.45)`}>CUSTOM-BUILT</text>
                    </motion.g>

                    {/* ── Output connectors: diagonal from engine → elbow → straight H ── */}
                    {outputs.map((out, i) => {
                        const ey = engineOutY(i);
                        return (
                            <motion.path key={`lo-${i}`}
                                d={`M${ECX + ER} ${ey} L${ELBOWR} ${out.y} L${OUTX1} ${out.y}`}
                                stroke={`${CY}, 0.2)`} strokeWidth="1"
                                strokeDasharray="3 4" fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                                transition={{ duration: 0.45, delay: 0.5 + i * 0.07, ease: EASE }}
                            />
                        );
                    })}

                    {/* ── Output pulses: animate cx along horizontal segment only ── */}
                    {outputs.map((out, i) => (
                        <motion.circle key={`po-${i}`} r="2.5" cy={out.y}
                            fill={`${CY}, 0.9)`}
                            animate={inView ? { cx: [ELBOWR, OUTX1], opacity: [0, 1, 0] } : { opacity: 0 }}
                            transition={{ duration: 0.65, delay: 1.05 + i * 0.28, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}

                    {/* ── Output boxes ── */}
                    {outputs.map((out, i) => (
                        <motion.g key={out.label}
                            initial={{ opacity: 0, x: 8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.52 + i * 0.09, ease: EASE }}>
                            <rect x={OUTX1} y={out.y - 20} width="100" height="40" rx="7"
                                fill="rgba(14,16,24,0.98)" stroke={`${CY}, 0.26)`} strokeWidth="1.2" />
                            <rect x="373" y={out.y - 20} width="3" height="40" rx="1.5"
                                fill={`${CY}, 0.48)`} />
                            <text x={OUTX1 + 10} y={out.y - 4} fontFamily={MONO} fontSize="8" fontWeight="700"
                                letterSpacing="0.09em" fill={`${CY}, 0.88)`}>{out.label}</text>
                            <text x={OUTX1 + 10} y={out.y + 10} fontFamily={MONO} fontSize="6.5"
                                letterSpacing="0.06em" fill="rgba(255,255,255,0.32)">{out.sub}</text>
                        </motion.g>
                    ))}

                    {/* ── Stat strip ── */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.85, ease: EASE }}>
                        <line x1="8" y1="210" x2="372" y2="210" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="63"  y="224" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">VS GENERIC MODELS</text>
                        <text x="63"  y="241" textAnchor="middle" fontFamily={MONO} fontSize="16" fontWeight="700" fill="white">5×</text>
                        <text x="63"  y="252" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">more accurate</text>
                        <text x="190" y="224" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">PREDICTION LIFT</text>
                        <text x="190" y="241" textAnchor="middle" fontFamily={MONO} fontSize="16" fontWeight="700" fill={`${CY}, 0.9)`}>35–60%</text>
                        <text x="190" y="252" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">improvement</text>
                        <text x="317" y="224" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.28)">COMPETITIVE EDGE</text>
                        <text x="317" y="241" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill="white">Proprietary</text>
                        <text x="317" y="252" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">AI = durable moat</text>
                    </motion.g>
                </svg>
            </div>
        </AIFrame>
    );
}

// ── Data: Services ────────────────────────────────────────────────────────
const SERVICES = [
    {
        num: "01",
        title: "AI Integration",
        eyebrow: "Intelligence Woven Into Your Stack",
        body: "We connect cutting-edge AI directly into your existing platforms: CRMs, ERPs, databases, and workflows. The result: an operation that thinks alongside your team without context-switching.",
        included: [
            "AI integration across your existing business systems",
            "Custom AI tools designed around your operations",
            "AI model selection, configuration, and deployment",
            "Prompt engineering and optimisation",
            "Performance monitoring and ongoing refinement",
        ],
        Visual: AIIntegrationVisual,
    },
    {
        num: "02",
        title: "Intelligent Workflows",
        eyebrow: "Logic That Runs Itself",
        body: "AI-driven workflow systems that replace decision-heavy manual processes with adaptive automation. These aren't rigid rules. They understand context, learn from outcomes, and route work intelligently.",
        included: [
            "Workflow analysis and automation planning",
            "Intelligent workflows with decision-based logic",
            "Automated document and data processing",
            "Connected workflows across multiple systems",
            "Workflow monitoring and performance optimisation",
        ],
        Visual: IntelligentWorkflowsVisual,
    },
    {
        num: "03",
        title: "Custom AI Solutions",
        eyebrow: "Built for What Off-the-Shelf Can't Do",
        body: "When generic AI won't deliver the precision your business needs, we engineer it from scratch. Fine-tuned language models, recommendation engines, predictive analytics, and AI product features built on your proprietary data.",
        included: [
            "Custom AI solution design and development",
            "Data preparation and model training",
            "Testing, validation, and optimisation",
            "Deployment and infrastructure setup",
            "Monitoring, maintenance, and continuous improvement",
        ],
        Visual: CustomAISolutionsVisual,
    },
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
                <span className="display-card-title">{q}</span>
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
                        <p className="px-6 pb-6 text-lead text-white/55">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AIIntelligencePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [openStack, setOpenStack] = useState<number>(0);
    const stackSectionRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    useEffect(() => {
        const el = stackSectionRef.current;
        if (!el) return;
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(min-width: 768px)");
        let rafId: number | null = null;
        const total = AI_STACK_SERVICES.length;
        const update = () => {
            rafId = null;
            if (!mq.matches) return;
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            if (rect.bottom < 0 || rect.top > vh) return;
            const scrolled = -rect.top;
            const scrollable = rect.height - vh;
            if (scrollable <= 0) return;
            const progress = Math.max(0, Math.min(0.999, scrolled / scrollable));
            const idx = Math.min(total - 1, Math.max(0, Math.floor(progress * total)));
            setOpenStack((prev) => (prev === idx ? prev : idx));
        };
        const onScroll = () => { if (rafId !== null) return; rafId = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        mq.addEventListener("change", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            mq.removeEventListener("change", onScroll);
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <main className="relative min-h-screen bg-[#0E1014] overflow-hidden page-dividers">

            {/* ── Block 1. HERO ─────────────────────────────── */}
            <section
                data-hero
                className="relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:min-h-0 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Most teams bolt AI on.</span>
                        <span className="display-strong-line">We engineer it in.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        We architect AI as a layer within your business, not a tool on the shelf. Connecting
                        data, decisions, and workflows into intelligent systems designed to scale, adapt, and
                        compound over time.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col gap-6"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">The problem isn&apos;t growth.</span>
                                <span className="display-strong-line">It&apos;s what growth exposes.</span>
                            </h2>
                            <p className="text-lead text-white/55">
                                As businesses scale, operational gaps become more visible. Systems disconnect,
                                workflows become inefficient, visibility decreases, and teams spend more time
                                managing complexity instead of driving momentum.
                            </p>
                            <p className="text-lead text-white/55">
                                Without a clear intelligence strategy, businesses often end up managing more
                                technology while gaining little operational advantage.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.05 }}
                            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
                            className="block"
                        >
                            <AIProblemVisual />
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
                                <span className="display-muted-line">Modern growth requires</span>
                                <span className="display-strong-line">intelligent infrastructure.</span>
                            </h2>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="flex flex-col gap-5"
                        >
                            <p className="text-lead text-white/55">
                                Connected intelligence systems help businesses streamline workflows, automate
                                operations, improve decision-making, and reduce the operational friction that often
                                comes with growth.
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
                            { title: "Streamline Workflows",  desc: "Processes that run without manual handoffs.", icon: <><path d="M3 6h14M3 10h10M3 14h6" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 12l3 3-3 3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></> },
                            { title: "Automate Operations",   desc: "Systems that act without waiting for a person.", icon: <><circle cx="10" cy="10" r="3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round"/></> },
                            { title: "Improve Decisions",     desc: "Intelligence that surfaces the right action.", icon: <><path d="M10 3L12.5 8H17l-4 3 1.5 5L10 13l-4.5 3L7 11 3 8h4.5z" stroke="rgba(0,255,221,0.8)" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(0,255,221,0.08)"/></> },
                            { title: "Reduce Friction",       desc: "Less overhead between insight and outcome.", icon: <><path d="M4 10h12M13 7l3 3-3 3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6v8" stroke="rgba(0,255,221,0.4)" strokeWidth="1.5" strokeLinecap="round"/></> },
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
                                <p className="text-caption text-white/40">{p.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── OUR PROCESS ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
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
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">How intelligence </span><span className="display-strong-line">gets built.</span>
                        </h2>
                    </motion.div>

                    {/* Desktop: horizontal flow (matches home Solution exactly) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                    >
                        <div className="hidden items-start justify-center gap-6 md:flex">
                            {PROCESS_STEPS.map((step, i) => {
                                const Icon = PROCESS_ICONS[i];
                                return (
                                    <div key={step.num} className="flex items-start">
                                        <div className="flex w-52 flex-col items-center gap-4 text-center">
                                            <span className="text-eyebrow" style={{ color: "rgba(123, 85, 234,0.6)" }}>
                                                {step.num}
                                            </span>
                                            <div
                                                className="rounded-2xl p-px"
                                                style={{
                                                    background: "linear-gradient(135deg, rgba(123, 85, 234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123, 85, 234,0.45) 100%)",
                                                    boxShadow: "0 12px 36px rgba(123, 85, 234,0.15)",
                                                }}
                                            >
                                                <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                    <Icon />
                                                </div>
                                            </div>
                                            <h3 className="display-card-title">{step.title}</h3>
                                            <p className="text-body-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{step.body}</p>
                                        </div>
                                        {i < PROCESS_STEPS.length - 1 && (
                                            <div className="flex w-10 flex-shrink-0 items-center" aria-hidden style={{ marginTop: "74px" }}>
                                                <div className="relative flex w-full items-center">
                                                    <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(123, 85, 234,0.25), rgba(123, 85, 234,0.5), rgba(123, 85, 234,0.25))" }} />
                                                    <svg className="-ml-px flex-shrink-0" width="7" height="12" viewBox="0 0 7 12" fill="none">
                                                        <path d="M1 1L6 6L1 11" stroke="rgba(123, 85, 234,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <motion.div
                                                        className="absolute h-1.5 w-1.5 rounded-full"
                                                        style={{ top: "50%", marginTop: "-3px", background: "rgba(123, 85, 234,0.9)", boxShadow: "0 0 6px rgba(123, 85, 234,0.7)" }}
                                                        initial={{ left: 0 }}
                                                        animate={{ left: "calc(100% - 8px)" }}
                                                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile: vertical flow */}
                        <div className="flex flex-col items-center gap-2 md:hidden">
                            {PROCESS_STEPS.map((step, i) => {
                                const Icon = PROCESS_ICONS[i];
                                return (
                                    <div key={step.num} className="flex flex-col items-center">
                                        <div className="flex w-52 flex-col items-center gap-4 text-center">
                                            <span className="text-eyebrow" style={{ color: "rgba(123, 85, 234,0.6)" }}>
                                                {step.num}
                                            </span>
                                            <div
                                                className="rounded-2xl p-px"
                                                style={{
                                                    background: "linear-gradient(135deg, rgba(123, 85, 234,0.55) 0%, rgba(255,255,255,0.06) 50%, rgba(123, 85, 234,0.45) 100%)",
                                                    boxShadow: "0 12px 36px rgba(123, 85, 234,0.15)",
                                                }}
                                            >
                                                <div className="flex h-24 w-24 items-center justify-center rounded-[15px]" style={{ background: "rgba(10,14,28,0.98)" }}>
                                                    <Icon />
                                                </div>
                                            </div>
                                            <h3 className="display-card-title">{step.title}</h3>
                                            <p className="text-body-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{step.body}</p>
                                        </div>
                                        {i < PROCESS_STEPS.length - 1 && (
                                            <div className="flex justify-center py-1" aria-hidden>
                                                <div className="relative flex flex-col items-center" style={{ height: "52px", width: "2px" }}>
                                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(123, 85, 234,0.15), rgba(123, 85, 234,0.35), rgba(123, 85, 234,0.15))" }} />
                                                    <motion.div
                                                        className="absolute -left-[3px] h-2 w-2 rounded-full"
                                                        style={{ background: "rgba(123, 85, 234,0.9)", boxShadow: "0 0 8px rgba(123, 85, 234,0.7)" }}
                                                        initial={{ top: 0 }}
                                                        animate={{ top: "calc(100% - 8px)" }}
                                                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Block 5. OUR SERVICES ─────────────────────── */}
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
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Three intelligence </span><span className="display-strong-line">layers we build.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-14 md:gap-20">
                        {SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const Visual = svc.Visual;
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
                                            <span className="display-feature-title tabular-nums" style={{ color: GREEN }}>
                                                {svc.num}.
                                            </span>
                                            <h3 className="display-feature-title">
                                                {svc.title}
                                            </h3>
                                        </div>
                                        <p className="text-eyebrow text-white/50">
                                            {svc.eyebrow}
                                        </p>
                                        <p className="max-w-md text-body-sm text-white/55">
                                            {svc.body}
                                        </p>
                                        <div className="mt-2 flex flex-col gap-3">
                                            <p className="text-eyebrow text-white/45">What&apos;s included</p>
                                            <ul className="flex flex-col gap-2.5">
                                                {svc.included.map((b) => (
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
                                    {/* visual */}
                                    <div className="mx-auto block w-full max-w-md sm:max-w-none">
                                        <Visual />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────── */}
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
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">The </span><span className="display-strong-line">common questions.</span>
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

            {/* ── FINAL CTA ─────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
                <CTAAurora variant={1} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Intelligence becomes</span>
                        <span className="display-strong-line">infrastructure, not a toolset.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        The companies treating AI as a layer, not a feature, are the ones compounding.
                        Let&apos;s design yours.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book a Consultation Call
                        </button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

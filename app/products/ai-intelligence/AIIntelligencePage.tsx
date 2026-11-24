"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";
import { AIIntegrationMock, AIProblemMock, CustomAIMock, IntelligentWorkflowsMock } from "@/app/components/mockups/AIMockups";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#FFFFFF";
const BLUE = "rgba(0,255,221,0.9)";
const EASE = [0.16, 1, 0.3, 1] as const;


// "-"- Icons "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

// "-"- Process step icons "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

// "-"- Data "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

// "-"- KPI counter "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
function KPI({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
    const { count, elRef } = useCountUp(value);
    return (
        <div
            data-reveal
            data-reveal-delay={Math.round((index * 0.08) * 1000)}
            className="flex flex-col items-center gap-3 text-center"
        >
            <span ref={elRef} className="display-stat">
                {count}{suffix}
            </span>
            <span className="max-w-[140px] text-caption text-white/55 tracking-wide sm:max-w-[200px]">{label}</span>
        </div>
    );
}

// "-"- Lifecycle step card "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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
    { q: "Do we need to be \"AI-ready\" to start?", a: "No. The Assess phase is designed to surface gaps and quick wins simultaneously, most engagements ship a usable AI workflow in the first 4-6 weeks while the longer-horizon foundation is built in parallel." },
    { q: "Which models do you use?", a: "Frontier (Claude, GPT, Gemini) for general reasoning. Fine-tuned open-source (Llama, Mistral) when latency, cost, or data residency demand it. We pick the model that fits the job, not the other way around." },
    { q: "Where does our data live?", a: "Your infrastructure by default. Private deployment, isolated retrieval, no model-provider training on your inputs. SOC 2 / ISO 27001 alignment available on request." },
    { q: "How do you measure AI success?", a: "Decision quality, time-to-decision, automation coverage, and ROI against the baseline you defined in the assessment. Vanity metrics like \"messages generated\" don't count." },
    { q: "What happens after launch?", a: "Continuous-optimisation packages cover monitoring, drift detection, prompt + model iteration, and expansion of coverage into adjacent workflows. AI systems compound, we keep them compounding." },
];


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
        Visual: AIIntegrationMock,
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
        Visual: IntelligentWorkflowsMock,
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
        Visual: CustomAIMock,
    },
];

// "-"- FAQ item "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            data-reveal
            data-reveal-delay={Math.round((index * 0.05) * 1000)}
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
        </div>
    );
}

// "-"- Page "-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-"-
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

            {/* "" Block 1. HERO """"""""""""""""""""""""""""""" */}
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
                        <span className="display-muted-line sm:whitespace-nowrap">Most teams bolt AI on.</span>
                        <span className="display-strong-line sm:whitespace-nowrap">We engineer it in.</span>
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
                        <div
                            data-reveal
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
                        </div>
                        <div
                            data-reveal
                            data-reveal-delay="150"
                            className="block"
                        >
                            <AIProblemMock />
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
                        <div
                            data-reveal
                            className="flex flex-col gap-5"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Modern growth requires</span>
                                <span className="display-strong-line">intelligent infrastructure.</span>
                            </h2>
                        </div>
                        <div
                            data-reveal
                            data-reveal-delay="100"
                            className="flex flex-col gap-5"
                        >
                            <p className="text-lead text-white/55">
                                Connected intelligence systems help businesses streamline workflows, automate
                                operations, improve decision-making, and reduce the operational friction that often
                                comes with growth.
                            </p>
                        </div>
                    </div>
                    <div
                        data-reveal
                        data-reveal-delay="200"
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 md:mt-20"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {[
                            { title: "Streamline Workflows",  desc: "Processes that run without manual handoffs.", icon: <><path d="M3 6h14M3 10h10M3 14h6" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 12l3 3-3 3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></> },
                            { title: "Automate Operations",   desc: "Systems that act without waiting for a person.", icon: <><circle cx="10" cy="10" r="3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round"/></> },
                            { title: "Improve Decisions",     desc: "Intelligence that surfaces the right action.", icon: <><path d="M10 3L12.5 8H17l-4 3 1.5 5L10 13l-4.5 3L7 11 3 8h4.5z" stroke="rgba(0,255,221,0.8)" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(0,255,221,0.08)"/></> },
                            { title: "Reduce Friction",       desc: "Less overhead between insight and outcome.", icon: <><path d="M4 10h12M13 7l3 3-3 3" stroke="rgba(0,255,221,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6v8" stroke="rgba(0,255,221,0.4)" strokeWidth="1.5" strokeLinecap="round"/></> },
                        ].map((p, i) => (
                            <div
                                data-reveal
                                data-reveal-delay={Math.round((0.25 + i * 0.08) * 1000)}
                                key={p.title}
                                className="flex flex-col gap-3 pt-10 pb-7 px-6"
                                style={{ borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "rgba(0,255,221,0.06)", border: "1px solid rgba(0,255,221,0.15)" }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>{p.icon}</svg>
                                </div>
                                <p className="display-card-title" style={{ minHeight: "2.6em" }}>{p.title}</p>
                                <p className="text-body-sm text-white/45">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* "" OUR PROCESS "" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
                }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                        className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">How intelligence </span><span className="display-strong-line">gets built.</span>
                        </h2>
                    </div>

                    {/* Desktop: horizontal flow (matches home Solution exactly) */}
                    <div
                        data-reveal
                        data-reveal-delay="150"
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
                    </div>
                </div>
            </section>

            {/* "" Block 5. OUR SERVICES """"""""""""""""""""""" */}
            <section id="services" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div
                        data-reveal
                        className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Three intelligence </span><span className="display-strong-line">layers we build.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-14 md:gap-20">
                        {SERVICES.map((svc, i) => {
                            const isOdd = i % 2 === 1;
                            const Visual = svc.Visual;
                            return (
                                <div
                                    data-reveal
                                    key={svc.num}
                                    className={`grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16 lg:gap-20 ${isOdd ? "md:[&>div:first-child]:order-2" : ""}`}
                                >
                                    {/* text */}
                                    <div className={`flex flex-col gap-4 ${isOdd ? "md:ml-auto md:w-full md:max-w-md" : ""}`}>
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* "" FAQ """"""""""""""""""""""""""""""""""""""""" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <div
                        data-reveal
                        className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">The </span><span className="display-strong-line">common questions.</span>
                        </h2>
                    </div>

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

            {/* "" FINAL CTA """"""""""""""""""""""""""""""""""" */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
                <CTAAurora variant={1} />
                <div
                    data-reveal
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
                </div>
            </section>
        </main>
    );
}

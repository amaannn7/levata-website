"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const GREEN = "#4B91F7";
const BLUE = "#4B91F7";
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

// ── Count-up ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
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

// ── Icons (small, blue strokes) ───────────────────────────────────────────
function IconCheck({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 5l2.2 2.2L8 3.2" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function IconArrowRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Step card (Process section) ──────────────────────────────────────────
function StepCard({ step }: { step: { num: string; title: string; body: string } }) {
    return (
        <div
            className="block w-full rounded-xl px-4 py-3.5 text-left sm:inline-block sm:w-auto sm:px-5 sm:py-4"
            style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
            <h3 className="text-base font-bold leading-tight text-white md:text-lg">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55 sm:max-w-[280px] md:text-[15px]">{step.body}</p>
        </div>
    );
}

// ── Sales Intelligence dashboard mockup ──────────────────────────────────
function SalesIntelligenceDashboard() {
    const leads = [
        { name: "Acme Corp", score: 92, status: "Hot", color: GREEN },
        { name: "Globex Inc.", score: 78, status: "Warm", color: BLUE },
        { name: "Initech", score: 64, status: "Warm", color: BLUE },
        { name: "Stark Industries", score: 51, status: "Nurture", color: "#4B91F7" },
    ];
    const tiles = [
        { label: "Leads", value: "248" },
        { label: "Replied", value: "63", sub: "25%" },
        { label: "Pipeline", value: "$1.2M" },
    ];
    return (
        <div
            className="w-full overflow-hidden rounded-2xl"
            style={{ background: "rgba(23,26,34,0.96)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
            {/* dashboard chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3.5 py-3 sm:px-5 sm:py-3.5">
                <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 sm:text-[11px]">Sales Intelligence</span>
                </div>
                <span
                    className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                    style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, color: GREEN }}
                >
                    <span className="h-1 w-1 rounded-full" style={{ background: GREEN }} />
                    Live
                </span>
            </div>

            {/* KPI tiles */}
            <div className="grid grid-cols-3 gap-2 px-3.5 pt-4 sm:gap-3 sm:px-5 sm:pt-5">
                {tiles.map((t) => (
                    <div
                        key={t.label}
                        className="rounded-lg p-2.5 sm:p-3"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">{t.label}</span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-base font-bold tracking-tight sm:text-xl" style={{ color: GREEN }}>{t.value}</span>
                            {t.sub && <span className="text-[10px] font-medium text-white/45">{t.sub}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Lead table header */}
            <div className="mt-4 flex items-center gap-3 px-3.5 pb-2 sm:mt-5 sm:px-5">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Today&apos;s pipeline</span>
                <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Lead rows */}
            <div className="flex flex-col gap-1.5 px-2.5 pb-4 sm:px-3 sm:pb-5">
                {leads.map((lead, i) => (
                    <motion.div
                        key={lead.name}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: EASE }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: lead.color }} />
                        <span className="flex-1 truncate text-[13px] font-semibold text-white">{lead.name}</span>
                        <div className="hidden h-1 w-20 overflow-hidden rounded-full sm:block" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${lead.score}%` }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.9, delay: 0.4 + i * 0.08, ease: EASE }}
                                className="h-full"
                                style={{ background: BLUE }}
                            />
                        </div>
                        <span className="w-7 text-right text-[12px] font-bold tabular-nums" style={{ color: GREEN }}>{lead.score}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ── Data ──────────────────────────────────────────────────────────────────
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

const SUB_SERVICES = [
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
        bullets: ["Fine-tuning on proprietary data", "Custom data pipelines", "Predictive & forecasting systems", "Private deployment"],
    },
];

const KPI_METRICS = [
    { value: 80, suffix: "%", label: "Tasks automated" },
    { value: 4, suffix: "×", label: "Throughput increase" },
    { value: 65, suffix: "%", label: "Less manual decisions" },
    { value: 12, suffix: "mo", label: "AI ROI horizon" },
];

const LIFECYCLE = [
    { num: "01", title: "Readiness Assessment", body: "Map AI fit across your operations." },
    { num: "02", title: "Architecture Design", body: "Blueprint the intelligence layer." },
    { num: "03", title: "Data Foundation", body: "Lay the data + retrieval substrate." },
    { num: "04", title: "Build & Integrate", body: "Ship into the systems you run in." },
    { num: "05", title: "Monitor & Optimise", body: "Measure, refine, expand." },
];

const FAQS = [
    { q: "Do we need to be \"AI-ready\" to start?", a: "No. The Readiness Assessment is designed to surface gaps and quick wins simultaneously, most engagements ship a usable AI workflow in the first 4–6 weeks while the longer-horizon foundation is built in parallel." },
    { q: "Which models do you use?", a: "Frontier (Claude, GPT, Gemini) for general reasoning. Fine-tuned open-source (Llama, Mistral) when latency, cost, or data residency demand it. We pick the model that fits the job, not the other way around." },
    { q: "Where does our data live?", a: "Your infrastructure by default. Private deployment, isolated retrieval, no model-provider training on your inputs. SOC 2 / ISO 27001 alignment available on request." },
    { q: "How do you measure AI success?", a: "Decision quality, time-to-decision, automation coverage, and ROI against the baseline you defined in the assessment. Vanity metrics like \"messages generated\" don't count." },
    { q: "What happens after launch?", a: "Continuous-optimisation packages cover monitoring, drift detection, prompt + model iteration, and expansion of coverage into adjacent workflows. AI systems compound, we keep them compounding." },
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

// ── KPI counter ──────────────────────────────────────────────────────────
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
            <span ref={elRef} className="text-4xl font-bold leading-none tracking-tight sm:text-5xl md:text-7xl" style={{ color: GREEN }}>
                {count}{suffix}
            </span>
            <span className="max-w-[140px] text-[13px] font-medium leading-snug text-white/55 tracking-wide sm:max-w-[200px] sm:text-sm">{label}</span>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AIIntelligencePage() {
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
                    <SectionLabel text="AI & Intelligence" />
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Intelligence becomes</span>
                        <span className="display-strong-line">infrastructure.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        We architect AI as a layer in your business, not a tool on the shelf. Data, decisions, and
                        workflows wired into one intelligent system that compounds.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Book a Strategy Call
                        </button>

                    </div>
                </motion.div>
                <HeroHorizon />
            </section>

            {/* ── 2. PROBLEM, 3 failure modes (clean cards, no icons) ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(75,145,247,0.05) 0%, transparent 70%)",
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
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Three patterns that quietly</span>
                            <span className="display-strong-line">break AI investments.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {FAILURES.map((f, i) => (
                            <motion.div
                                key={f.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                whileHover={{ y: -4 }}
                                className="flex flex-col gap-5 rounded-2xl p-7 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <span className="text-3xl font-bold leading-none" style={{ color: GREEN }}>{f.num}</span>
                                <h3 className="text-xl font-bold leading-tight text-white">{f.title}</h3>
                                <p className="text-sm leading-relaxed text-white/55">{f.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. APPROACH, Centered statement + 5-row inline list ── */}
            <section id="approach" className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(75,145,247,0.06) 0%, transparent 65%)",
                }} />
                <div className="relative z-10 mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Our approach" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">We architect AI as</span>
                            <span className="display-strong-line">infrastructure, not tools.</span>
                        </h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/55">
                            Five layers that turn AI from scattered experiments into a system that earns trust and compounds.
                        </p>
                    </motion.div>

                    <div className="flex flex-col">
                        {LAYERS.map((l, i) => (
                            <motion.div
                                key={l.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-b border-white/[0.07] py-6 md:grid-cols-[auto_minmax(180px,0.5fr)_1fr] md:py-8"
                                style={{ borderBottom: i === LAYERS.length - 1 ? "none" : undefined }}
                            >
                                <span className="text-2xl font-bold tabular-nums leading-none md:text-3xl" style={{ color: GREEN }}>{l.num}</span>
                                <h3 className="col-span-2 text-lg font-bold leading-tight text-white md:col-span-1 md:text-xl">{l.title}</h3>
                                <p className="col-span-2 text-sm leading-relaxed text-white/55 md:col-span-1 md:text-[15px]">{l.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. AI STACK, 2×2 capability grid, no mock visuals ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="The AI stack" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Four capability layers.</span>
                            <span className="display-strong-line">One coherent system.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-fr">
                        {SUB_SERVICES.map((svc, i) => (
                            <motion.div
                                key={svc.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
                                whileHover={{ y: -4 }}
                                className="flex h-full flex-col gap-5 rounded-2xl p-7 md:p-8 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{ background: "rgba(23,26,34,0.92)", border: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-bold leading-none md:text-5xl" style={{ color: GREEN }}>{svc.num}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">{svc.eyebrow}</span>
                                </div>
                                <h3 className="text-xl font-semibold leading-tight text-white md:text-2xl">{svc.title}</h3>
                                <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{svc.body}</p>
                                <ul className="mt-auto flex flex-col gap-2.5 pt-2">
                                    {svc.bullets.map((b) => (
                                        <li key={b} className="flex items-center gap-3 text-sm text-white/85">
                                            <IconCheck />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. FEATURED PRODUCT, Sales Intelligence dashboard spotlight ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Featured product" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Intelligence,</span>
                            <span className="display-strong-line">shipped as a workspace.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="rounded-2xl p-px"
                        style={{ background: "linear-gradient(135deg,rgba(75,145,247,0.3) 0%,rgba(255,255,255,0.06) 50%,rgba(75,145,247,0.3) 100%)" }}
                    >
                        <div
                            className="grid grid-cols-1 gap-8 rounded-2xl p-5 sm:p-7 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 md:p-10"
                            style={{ background: "rgba(23,26,34,0.98)" }}
                        >
                            {/* Left, copy */}
                            <div className="flex flex-col gap-5">
                                <h3 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                                    Sales Intelligence Platform
                                </h3>
                                <p className="max-w-md text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                                    Turn leads into qualified pipeline in hours, not days. AI research, lead scoring,
                                    and outreach, wired into the workspace your team runs in.
                                </p>
                                <ul className="flex flex-col gap-2.5">
                                    {["AI prospect research", "Lead prioritisation", "Automated outreach"].map((b) => (
                                        <li key={b} className="flex items-center gap-3 text-sm font-medium text-white/85">
                                            <IconCheck />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/products/sales-intelligence-platform"
                                    className="mt-2 inline-flex items-center gap-2 self-start text-sm font-semibold transition-opacity hover:opacity-80"
                                    style={{ color: BLUE }}
                                >
                                    View Product <IconArrowRight />
                                </Link>
                            </div>

                            {/* Right, dashboard */}
                            <div>
                                <SalesIntelligenceDashboard />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 6. OUTCOMES, KPI strip ── */}
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
                            <span className="display-muted-line">What intelligence</span>
                            <span className="display-strong-line">ships.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:gap-x-12">
                        {KPI_METRICS.map((k, i) => (
                            <KPI key={k.label} {...k} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. DELIVERY PROCESS, Zig-zag rail with alternating steps ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-16 gap-5 text-center"
                    >
                        <SectionLabel text="Delivery process" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The AI lifecycle,</span>
                            <span className="display-strong-line">end to end.</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Mobile spine, left edge */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-6 top-2 bottom-2 w-px md:hidden"
                            style={{ background: `linear-gradient(to bottom, transparent, ${BLUE}55 6%, ${BLUE}55 94%, transparent)` }}
                        />
                        {/* Desktop spine, center */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-2 bottom-2 hidden -translate-x-1/2 md:block"
                            style={{ width: "1px", background: `linear-gradient(to bottom, transparent, ${BLUE}55 6%, ${BLUE}55 94%, transparent)` }}
                        />

                        <div className="flex flex-col gap-10 md:gap-12">
                            {LIFECYCLE.map((step, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                    <motion.div
                                        key={step.num}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                                        className="relative flex items-start gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8"
                                    >
                                        {/* Node, mobile left, desktop center */}
                                        <div
                                            className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full md:order-2 md:h-14 md:w-14"
                                            style={{
                                                background: "#171A22",
                                                border: `1.5px solid ${BLUE}`,
                                                boxShadow: `0 0 0 6px #0E1014, 0 0 22px ${BLUE}33`,
                                            }}
                                        >
                                            <span className="text-sm font-bold md:text-base" style={{ color: GREEN }}>{step.num}</span>
                                        </div>

                                        {/* Content card, mobile right of node; desktop alternates left/right */}
                                        <div className={`flex-1 md:order-${isLeft ? "1" : "3"} ${isLeft ? "md:text-right" : "md:text-left"}`}>
                                            <StepCard step={step} />
                                        </div>

                                        {/* Empty placeholder so node stays centered on desktop */}
                                        <div className={`hidden md:block ${isLeft ? "md:order-3" : "md:order-1"}`} aria-hidden />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 8. FAQ, Split with simplified sidebar ── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="FAQ" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The</span>
                            <span className="display-strong-line">common questions.</span>
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-3 max-w-3xl mx-auto w-full">
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

            {/* ── 9. FINAL CTA, Clean centered, gradient divider ── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                />
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
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        The companies treating AI as a layer, not a feature, are the ones compounding. Let&apos;s design yours.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Book Your AI Strategy Session
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

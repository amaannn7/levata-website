"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
    const [count, setCount] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const elRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!triggered) return;
        let raf: number;
        let start: number | null = null;
        const step = (ts: number) => {
            if (start === null) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.round(eased * target));
            if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [triggered, target, duration]);

    return { count, elRef };
}

function AnimatedStat({ value, suffix, label, animate = true }: { value: number; suffix: string; label: string; animate?: boolean }) {
    const { count, elRef } = useCountUp(animate ? value : 0, 1800);
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <span ref={elRef} className="display-stat font-thin">
                {animate ? count : value}
                <span>{suffix}</span>
            </span>
            <span className="max-w-[160px] sm:max-w-[200px] text-caption text-white/45 tracking-wide">{label}</span>
        </div>
    );
}

// ── Capability glyphs ──────────────────────────────────────────────────────
type IconKind = "research" | "score" | "email" | "call" | "queue" | "crm";

function CapabilityIcon({ kind }: { kind: IconKind }) {
    const s = "rgba(0,255,221,0.9)";
    if (kind === "research") return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6" stroke={s} strokeWidth="1.6" />
            <path d="M15.5 15.5L20 20" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8 11h6M11 8v6" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    );
    if (kind === "score") return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="13" width="4" height="8" rx="1" stroke={s} strokeWidth="1.5" />
            <rect x="10" y="8" width="4" height="13" rx="1" stroke={s} strokeWidth="1.5" />
            <rect x="17" y="3" width="4" height="18" rx="1" stroke={s} strokeWidth="1.5" />
        </svg>
    );
    if (kind === "email") return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" stroke={s} strokeWidth="1.5" />
            <path d="M3 7l9 7 9-7" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    if (kind === "call") return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 4h4l2 5-2.5 1.2a11 11 0 005.3 5.3L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
    if (kind === "queue") return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="4" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
            <rect x="3" y="10" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
            <rect x="3" y="16" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
        </svg>
    );
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 7l9-4 9 4-9 4-9-4z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 12l9 4 9-4M3 17l9 4 9-4" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

// ── Sales Dashboard SVG Visual ─────────────────────────────────────────────
function SalesDashboardVisual() {
    const ref = useRef<HTMLDivElement>(null);
    const observed = useInView(ref, { once: true, margin: "200px" });
    // Fallback so the dashboard reveals even if the observer never fires (iOS Safari).
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    const inView = observed || forced;
    const prefersReducedMotion = useReducedMotion();
    const reduced = !!prefersReducedMotion;

    const pipelineData = [38, 52, 44, 68, 58, 74, 82, 71, 88, 94, 86, 98];
    const maxVal = 100;
    const sparkW = 280, sparkH = 60;
    const pts = pipelineData.map((v, i) => `${(i / (pipelineData.length - 1)) * sparkW},${sparkH - (v / maxVal) * sparkH}`).join(" ");

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative w-full mx-auto max-w-[900px]"
        >
            {/* Outer glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 80px rgba(123,85,234,0.12), 0 0 40px rgba(123,85,234,0.06)" }} />

            <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                    background: "linear-gradient(160deg, rgba(18,20,28,0.98) 0%, rgba(13,14,22,0.99) 100%)",
                    border: "1px solid rgba(123,85,234,0.18)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                }}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-white/10" />
                            <div className="h-3 w-3 rounded-full bg-white/10" />
                            <div className="h-3 w-3 rounded-full bg-white/10" />
                        </div>
                        <span className="ml-2 text-[10px] font-semibold tracking-[0.2em] text-white/30 uppercase" style={{ fontFamily: MONO }}>
                            Sales Intelligence Platform
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/25 font-medium" style={{ fontFamily: MONO }}>Live</span>
                        <motion.div
                            className="h-2 w-2 rounded-full"
                            style={{ background: "rgba(123,85,234,0.9)" }}
                            animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-12 gap-0 divide-x divide-white/[0.04]">

                    {/* Left sidebar: lead list */}
                    <div className="col-span-3 p-4 border-r border-white/[0.04] hidden md:block">
                        <p className="text-[9px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-3" style={{ fontFamily: MONO }}>Lead Queue</p>
                        {[
                            { name: "Meridian Group", role: "VP Sales", score: 94, hot: true },
                            { name: "Vantage Capital", role: "CEO", score: 88, hot: true },
                            { name: "Crestline Corp", role: "RevOps", score: 71, hot: false },
                            { name: "Nexford Ltd", role: "Dir. Sales", score: 65, hot: false },
                            { name: "Pinnacle Co", role: "Head BD", score: 58, hot: false },
                        ].map((lead, i) => (
                            <motion.div
                                key={lead.name}
                                initial={{ opacity: 0, x: -8 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: EASE }}
                                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 mb-1 cursor-default"
                                style={{
                                    background: i === 0 ? "rgba(123,85,234,0.08)" : "transparent",
                                    border: i === 0 ? "1px solid rgba(123,85,234,0.2)" : "1px solid transparent",
                                }}
                            >
                                <div className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white/60"
                                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    {lead.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-semibold text-white/80 truncate leading-none mb-0.5">{lead.name}</p>
                                    <p className="text-[9px] text-white/30 truncate leading-none">{lead.role}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {lead.hot && <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(123,85,234,0.9)" }} />}
                                    <span className="text-[9px] font-semibold text-white/50" style={{ fontFamily: MONO }}>{lead.score}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center: main panel */}
                    <div className="col-span-12 md:col-span-6 p-5">

                        {/* KPI row */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {[
                                { label: "Researched Today", val: "12", delta: "+4" },
                                { label: "Emails Sent", val: "28", delta: "+11" },
                                { label: "Pipeline Value", val: "$84k", delta: "+22%" },
                            ].map((kpi, i) => (
                                <motion.div
                                    key={kpi.label}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }}
                                    className="rounded-xl p-3"
                                    style={{ background: "rgba(123,85,234,0.06)", border: "1px solid rgba(123,85,234,0.15)" }}
                                >
                                    <p className="text-[9px] text-white/35 font-medium mb-1.5 leading-none">{kpi.label}</p>
                                    <p className="text-xl font-thin text-white leading-none mb-1">{kpi.val}</p>
                                    <span className="text-[9px] font-semibold" style={{ color: "rgba(123,85,234,0.9)" }}>{kpi.delta}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pipeline sparkline */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
                            className="rounded-xl p-4 mb-4"
                            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-semibold text-white/50 tracking-[0.14em] uppercase" style={{ fontFamily: MONO }}>Pipeline Activity</p>
                                <span className="text-[9px] font-semibold" style={{ fontFamily: MONO, color: "rgba(123,85,234,0.9)" }}>▲ 24% this week</span>
                            </div>
                            <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full" style={{ height: 52 }} fill="none">
                                <defs>
                                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(123,85,234,0.4)" />
                                        <stop offset="100%" stopColor="rgba(123,85,234,0)" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    d={`M0,${sparkH} L0,${sparkH - (pipelineData[0] / maxVal) * sparkH} ${pts} L${sparkW},${sparkH} Z`}
                                    fill="url(#sparkGrad)"
                                    initial={{ opacity: 0 }}
                                    animate={inView ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                                />
                                <motion.polyline
                                    points={pts}
                                    stroke="rgba(123,85,234,0.85)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                                    transition={{ duration: 1.2, delay: 0.65, ease: EASE }}
                                />
                                {pipelineData.map((v, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={(i / (pipelineData.length - 1)) * sparkW}
                                        cy={sparkH - (v / maxVal) * sparkH}
                                        r={i === pipelineData.length - 1 ? 3.5 : 2}
                                        fill={i === pipelineData.length - 1 ? "rgba(123,85,234,1)" : "rgba(123,85,234,0.5)"}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.3, delay: 0.9 + i * 0.04, ease: EASE }}
                                    />
                                ))}
                            </svg>
                        </motion.div>

                        {/* Active lead card */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
                            className="rounded-xl p-4"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-[10px] font-semibold tracking-[0.14em] text-white/30 uppercase mb-1" style={{ fontFamily: MONO }}>AI Research Brief</p>
                                    <p className="text-sm font-semibold text-white">Meridian Group · James Chen, VP Sales</p>
                                </div>
                                <div className="flex-shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wide uppercase" style={{ background: "rgba(123,85,234,0.12)", border: "1px solid rgba(123,85,234,0.3)", color: "rgba(123,85,234,0.95)", fontFamily: MONO }}>
                                    Score 94
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {["Scaling outbound team, needs prospecting automation", "Pain: reps spend 3h/day on manual research", "Hook: reference recent $12M Series B"].map((line, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-start gap-2"
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={inView ? { opacity: 1, x: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.9 + i * 0.07, ease: EASE }}
                                    >
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(123,85,234,0.7)" }} />
                                        <p className="text-[11px] text-white/60 leading-relaxed">{line}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right panel: activity feed */}
                    <div className="col-span-3 p-4 border-l border-white/[0.04] hidden md:block">
                        <p className="text-[9px] font-semibold tracking-[0.2em] text-white/30 uppercase mb-3" style={{ fontFamily: MONO }}>Activity</p>
                        {[
                            { icon: "✉", text: "Email sent to James Chen", time: "2m ago", color: "rgba(123,85,234,0.9)" },
                            { icon: "🔍", text: "Research complete: Vantage", time: "8m ago", color: "rgba(168,85,247,0.8)" },
                            { icon: "📞", text: "Call logged: Crestline Corp", time: "14m ago", color: "rgba(255,255,255,0.5)" },
                            { icon: "⬆", text: "Lead pushed to CRM", time: "31m ago", color: "rgba(123,85,234,0.6)" },
                            { icon: "✓", text: "Follow-up queued: Nexford", time: "1h ago", color: "rgba(255,255,255,0.3)" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 8 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }}
                                className="flex items-start gap-2 mb-3"
                            >
                                <div className="mt-0.5 h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center text-[10px]"
                                    style={{ background: "rgba(123,85,234,0.08)", border: "1px solid rgba(123,85,234,0.2)", color: item.color }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/60 leading-snug">{item.text}</p>
                                    <p className="text-[9px] text-white/25 mt-0.5" style={{ fontFamily: MONO }}>{item.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

        </motion.div>
    );
}

// ── Content ────────────────────────────────────────────────────────────────
const PAIN_POINTS = [
    {
        num: "01",
        title: "Research is eating your team's time",
        body: "Reps spend hours manually researching prospects before sending a single email or making a call. Most of that work is repetitive, inconsistent, and difficult to scale, reducing selling time and slowing pipeline growth.",
    },
    {
        num: "02",
        title: "Generic outreach gets ignored",
        body: "Cold emails and call scripts without personalization lead to low reply rates, missed conversations, and poor engagement. Teams waste time guessing what messaging will actually convert.",
    },
    {
        num: "03",
        title: "Lack of sales discipline kills pipeline",
        body: "Reps miss follow-ups, forget tasks, and work inconsistently. Without a structured process, opportunities stall, momentum slows, and forecasting becomes unreliable.",
    },
    {
        num: "04",
        title: "No high-level view of pipeline health",
        body: "Managers struggle to see pipeline movement, deal stages, bottlenecks, and overall team performance without spending hours digging through reports and spreadsheets.",
    },
    {
        num: "05",
        title: "No visibility into daily sales activity",
        body: "Without real-time visibility, managers cannot track outreach, follow-ups, meetings, and team execution, making it difficult to identify gaps and maintain sales momentum.",
    },
];

const CAPABILITIES: Array<{ title: string; description: string; bullets: string[]; icon: IconKind }> = [
    {
        title: "AI Prospect Research",
        description: "Full prospect intel in seconds: company, pain points, buying signals, hooks, and discovery questions ready before every outreach.",
        bullets: ["Company + industry intel", "Pain points + buying signals", "Hooks + objection handling"],
        icon: "research",
    },
    {
        title: "Lead Scoring & Prioritization",
        description: "Every lead scored against your ICP by industry, role, size, and engagement. Reps always know who to contact first.",
        bullets: ["ICP fit + grade", "Activity velocity tracking", "Next-best action surfaced"],
        icon: "score",
    },
    {
        title: "Personalized Email & Follow-Up",
        description: "Cold email, follow-ups, and breakup emails generated in seconds, tailored to the prospect, your tone, and prior history.",
        bullets: ["Cold + 2 follow-ups + breakup", "Tone + custom voice", "Personalized at scale"],
        icon: "email",
    },
    {
        title: "Call Script Generation",
        description: "Structured scripts for cold, follow-up, discovery, and demo calls, adapted to the prospect, role, and industry.",
        bullets: ["4 call types covered", "Industry-specific talking points", "Objections built into the flow"],
        icon: "call",
    },
    {
        title: "Prioritized Work Queues",
        description: "Hot leads, stalled prospects, overdue callbacks, and research-ready contacts surfaced automatically. No more daily guesswork.",
        bullets: ["Daily targets + streaks", "Hot, stalled + overdue queues", "Pipeline visibility"],
        icon: "queue",
    },
    {
        title: "CRM Integration & Sync",
        description: "Qualified opportunities pushed straight into your CRM with full field-mapped sync, stage tracking, and complete activity history.",
        bullets: ["OAuth + field mapping", "Email, call + meeting logs", "CSV export anytime"],
        icon: "crm",
    },
];

const AUDIENCE = [
    "Small to mid-sized B2B sales teams managing outbound prospecting",
    "Founder-led or owner-led businesses running outbound sales themselves",
    "Agencies and consultants running lead generation campaigns for clients",
    "Sales reps managing cold outreach and follow-up manually today",
    "Teams using Zoho CRM seeking a lightweight AI prospecting layer",
    "Businesses that need AI research and messaging without enterprise complexity",
];

const OUTCOMES = [
    { value: 80, suffix: "%", label: "Reduction in research time per prospect", animate: true },
    { value: 3, suffix: "×", label: "More personalized outreach per day", animate: true },
    { value: 0, suffix: "", label: "Leads missed with smart work queues", animate: false },
    { value: 1, suffix: "", label: "Place for research, email, calls, and CRM", animate: false },
];

const STEPS = [
    { num: "01", title: "Import or Add Leads", body: "Upload a CSV lead list or add prospects individually. Contact and company data stored in one clean record." },
    { num: "02", title: "Run AI Research", body: "Generate a complete prospect intelligence brief in seconds: pain points, hooks, buying signals, and discovery questions." },
    { num: "03", title: "Score & Prioritize", body: "The system grades each lead against your ICP and surfaces the highest-value opportunities first." },
    { num: "04", title: "Generate Outreach", body: "Create personalized cold emails, follow-ups, and call scripts in one click, tailored to each prospect." },
    { num: "05", title: "Track & Log", body: "Log emails sent, call outcomes, follow-up dates, and meeting results. Never lose track of where a lead stands." },
    { num: "06", title: "Qualify & Push to CRM", body: "Move qualified leads directly into your CRM with full data sync. Keep your pipeline clean and current." },
];

const FAQS = [
    { q: "Is this a CRM replacement?", a: "No, it's a prospecting and outreach layer designed to sit on top of your existing CRM. We push qualified opportunities into your CRM, not replace it." },
    { q: "What CRMs do you integrate with?", a: "The platform supports most major CRM integrations via OAuth and field mapping. Zoho CRM is a primary supported integration with additional platforms in active development." },
    { q: "How does the AI research work?", a: "The system uses the lead's contact and company data to generate structured sales intelligence covering profile, pain points, buying signals, hooks, and questions, in seconds." },
    { q: "Can multiple reps use the platform?", a: "Yes. The platform includes multi-user support with admin controls, user management, configurable ICP settings, and qualification question management." },
    { q: "Can I import my existing lead lists?", a: "Yes. Upload CSV files directly and the platform maps your existing data fields into the lead record structure. You can also add leads individually or via CRM pull sync." },
    { q: "Is there a free trial?", a: "Yes. Contact us to set up a trial or book a live demo where we'll walk through the platform with your actual prospect data." },
];

// ── FAQ Accordion ─────────────────────────────────────────────────────────
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 300ms ease" }}
        >
            <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors duration-200">
                <span className="display-card-title">{q}</span>
                <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.18)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-lead text-white/55">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function SalesIntelligencePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [activeCap, setActiveCap] = useState<number>(0);
    const [openPain, setOpenPain] = useState<number>(-1);
    const [activeCard, setActiveCard] = useState(0);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#0E1014] overflow-hidden page-dividers">

            {/* ── 1. HERO ───────────────────────────────────── */}
            <section
                data-hero
                className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:min-h-0 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Most lead lists go cold.</span>
                        <span className="display-strong-line">Ours turn into pipeline.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        Research, qualification, outreach, and follow-up often consume more time than the conversations that drive revenue.
                        Our AI-powered workspace turns raw lead lists into prioritized, researched, ready-to-action pipeline. In hours, not weeks.
                    </p>
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book a Demo
                        </button>
                    </div>
                </motion.div>
                <div aria-hidden className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2" style={{ background: "linear-gradient(to right, transparent, rgba(204,1,255,0.35), transparent)" }} />
                <HeroHorizon intensity="strong" />
            </section>

            {/* ── 2. PROBLEM ────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 55% 60% at 15% 40%, rgba(255,80,80,0.05) 0%, transparent 65%)",
                        "radial-gradient(ellipse 45% 55% at 85% 60%, rgba(123,85,234,0.05) 0%, transparent 65%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-center">

                        {/* Left: heading */}
                        <div className="flex flex-col gap-4">
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Too much effort.</span>
                                <span className="display-strong-line">Not enough selling.</span>
                            </h2>
                            <p className="text-lead text-white/45 max-w-sm">
                                Research, qualification, outreach, and follow-up often consume more time than the conversations that drive revenue. As sales operations become fragmented, productivity declines and pipeline growth becomes harder to sustain.
                            </p>
                        </div>

                        {/* Right: stacked cards */}
                        <div className="flex flex-col" style={{ gap: 0 }}>
                            {PAIN_POINTS.map((pp, i) => {
                                const isActive = activeCard === i;
                                return (
                                    <motion.div
                                        key={pp.num}
                                        onClick={() => setActiveCard(i)}
                                        className="rounded-2xl overflow-hidden cursor-pointer relative"
                                        animate={{
                                            y: isActive ? -4 : 0,
                                            zIndex: isActive ? 10 : PAIN_POINTS.length - i,
                                        }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        style={{
                                            background: isActive
                                                ? "rgba(18,16,32,0.98)"
                                                : `rgba(${10 + i * 3}, ${10 + i * 3}, ${20 + i * 3}, 0.97)`,
                                            border: `1px solid ${isActive ? "rgba(255,60,60,0.25)" : "rgba(255,255,255,0.07)"}`,
                                            boxShadow: isActive
                                                ? "0 -4px 0 0 rgba(255,60,60,0.3), 0 16px 48px rgba(0,0,0,0.5)"
                                                : "none",
                                            marginTop: i === 0 ? 0 : -12,
                                        }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-4 px-6 py-5">
                                            <span
                                                className="text-[10px] font-bold tabular-nums flex-shrink-0"
                                                style={{ fontFamily: MONO, letterSpacing: "0.22em", color: isActive ? "rgba(255,80,80,0.8)" : "rgba(255,255,255,0.28)" }}
                                            >
                                                {pp.num}
                                            </span>
                                            <span
                                                className="flex-1 font-semibold leading-snug text-[15px]"
                                                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.6)" }}
                                            >
                                                {pp.title}
                                            </span>
                                            <motion.span
                                                animate={{ rotate: isActive ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ color: isActive ? "rgba(255,80,80,0.7)" : "rgba(255,255,255,0.2)" }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </motion.span>
                                        </div>

                                        {/* Body */}
                                        <AnimatePresence initial={false}>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 flex flex-col gap-3">
                                                        <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                                                        <p className="text-body-sm text-white/55">
                                                            {pp.body}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. CORE CAPABILITIES ──────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(0,255,221,0.04) 0%, transparent 70%)" }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-12 gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Everything your team needs</span>
                            <span className="display-strong-line">in one intelligent workspace.</span>
                        </h2>
                    </motion.div>

                    {/* Dashboard visual */}
                    <div className="mb-16 md:mb-20">
                        <SalesDashboardVisual />
                    </div>

                    {/* Capabilities selector */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.25fr] md:gap-7"
                    >
                        {/* Left: capability list — accordion on mobile, selector on desktop */}
                        <div className="flex flex-col gap-1.5">
                            {CAPABILITIES.map((c, i) => {
                                const active = activeCap === i;
                                return (
                                    <div key={c.title} className="flex flex-col">
                                        <button
                                            type="button"
                                            onClick={() => setActiveCap(active ? -1 : i)}
                                            className="group relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-300"
                                            style={{
                                                background: active ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%)" : "transparent",
                                                border: active ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.05)",
                                                borderBottomLeftRadius: active ? 0 : undefined,
                                                borderBottomRightRadius: active ? 0 : undefined,
                                            }}
                                            onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; } }}
                                            onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)"; } }}
                                            aria-pressed={active}
                                        >
                                            <span aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-300"
                                                style={{ width: active ? 3 : 0, height: active ? 28 : 0, background: "rgba(0,255,221,0.9)", boxShadow: active ? "0 0 12px rgba(0,255,221,0.4)" : "none" }} />
                                            <span className="flex-shrink-0 text-[10px] font-semibold tabular-nums transition-colors duration-300"
                                                style={{ fontFamily: MONO, letterSpacing: "0.18em", color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", minWidth: 18 }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                                                style={{ background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)", border: active ? "1px solid rgba(255,255,255,0.28)" : "1px solid rgba(255,255,255,0.08)" }}>
                                                <CapabilityIcon kind={c.icon} />
                                            </span>
                                            <span className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                                <span className="text-body-sm font-semibold leading-snug transition-colors duration-300"
                                                    style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.62)" }}>
                                                    {c.title}
                                                </span>
                                                <span aria-hidden className="flex-shrink-0 transition-all duration-300 md:block"
                                                    style={{ color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", transform: active ? "rotate(90deg)" : "none" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            </span>
                                        </button>

                                        {/* Inline detail — mobile only */}
                                        <AnimatePresence initial={false}>
                                            {active && (
                                                <motion.div
                                                    key="mobile-detail"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                                    className="overflow-hidden md:hidden"
                                                >
                                                    <div className="rounded-b-xl p-5 flex flex-col gap-4"
                                                        style={{ background: "linear-gradient(160deg, rgba(28,30,38,0.96) 0%, rgba(20,22,28,0.96) 100%)", border: "1px solid rgba(255,255,255,0.18)", borderTop: "none" }}>
                                                        <p className="text-body-sm text-white/60">{c.description}</p>
                                                        <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                                                        <p className="text-eyebrow text-white/35">What's included</p>
                                                        <ul className="flex flex-col gap-2.5">
                                                            {c.bullets.map((b) => (
                                                                <li key={b} className="flex items-center gap-3 text-[14px] text-white/85">
                                                                    <span aria-hidden className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                                                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                            <path d="M2 5l2 2L8 3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </span>
                                                                    <span className="leading-snug">{b}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right: detail panel — desktop only */}
                        <div className="relative hidden md:block overflow-hidden rounded-2xl p-px"
                            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.14) 100%)" }}>
                            <div className="relative overflow-hidden rounded-[15px] p-7 md:p-9"
                                style={{ background: "linear-gradient(160deg, rgba(28,30,38,0.96) 0%, rgba(20,22,28,0.96) 100%)", minHeight: 380 }}>
                                <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,255,221,0.3) 50%, transparent 100%)" }} />
                                <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
                                    style={{ background: "radial-gradient(circle, rgba(0,255,221,0.05) 0%, transparent 70%)" }} />

                                <AnimatePresence mode="wait">
                                    {activeCap >= 0 && (
                                        <motion.div key={activeCap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="relative flex h-full flex-col gap-5">
                                            <span aria-hidden className="pointer-events-none absolute right-0 top-0 select-none leading-none"
                                                style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(5rem, 10vw, 7.5rem)", color: "rgba(255,255,255,0.03)", letterSpacing: "-0.04em" }}>
                                                {String(activeCap + 1).padStart(2, "0")}
                                            </span>
                                            <div className="relative flex items-center justify-between gap-4">
                                                <span className="flex h-14 w-14 items-center justify-center rounded-xl"
                                                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                                                    <CapabilityIcon kind={CAPABILITIES[activeCap].icon} />
                                                </span>
                                                <span className="text-[10px] font-semibold uppercase tabular-nums text-white/45"
                                                    style={{ fontFamily: MONO, letterSpacing: "0.22em" }}>
                                                    Capability {String(activeCap + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <h3 className="relative display-feature-title">
                                                {CAPABILITIES[activeCap].title}
                                            </h3>
                                            <p className="relative text-body-sm text-white/60">
                                                {CAPABILITIES[activeCap].description}
                                            </p>
                                            <div aria-hidden className="relative my-1 h-px w-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
                                            <p className="relative -mb-1 text-eyebrow text-white/35">What's included</p>
                                            <ul className="relative mt-auto flex flex-col gap-2.5">
                                                {CAPABILITIES[activeCap].bullets.map((b, bi) => (
                                                    <motion.li key={b} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.08 + bi * 0.05, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-3 text-[14px] text-white/85">
                                                        <span aria-hidden className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                <path d="M2 5l2 2L8 3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                        <span className="leading-snug">{b}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 4. KEY OUTCOMES (STATS) ───────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-14 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(204,1,255,0.07) 0%, transparent 65%)" }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-12 gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Real results, </span><span className="display-strong-line">not hype.</span>
                        </h2>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
                        {OUTCOMES.map((o) => (
                            <AnimatedStat key={o.label} value={o.value} suffix={o.suffix} label={o.label} animate={o.animate} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. HOW IT WORKS (STEPS) ───────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: ["radial-gradient(ellipse 50% 50% at 20% 30%, rgba(0,255,221,0.04) 0%, transparent 70%)", "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(204,1,255,0.04) 0%, transparent 70%)"].join(", ") }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-12 gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">From lead list</span>
                            <span className="display-strong-line">to closed deal in 6 steps.</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        <div aria-hidden className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{ top: "28px", height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18) 6%, rgba(255,255,255,0.18) 94%, transparent)" }} />
                        <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
                            {STEPS.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full md:h-14 md:w-14"
                                        style={{ background: "#171A22", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 0 0 4px #0E1014, 0 0 20px rgba(255,255,255,0.15)" }}>
                                        <span className="text-base font-thin tracking-tight md:text-lg" style={{ color: "#FFFFFF", fontFamily: MONO }}>
                                            {step.num}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 display-card-title" style={{ minHeight: "2.8em" }}>{step.title}</h3>
                                    <p className="mt-2 max-w-[180px] text-caption text-white/55">{step.body}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. BUILT FOR TEAMS ────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-14 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: ["radial-gradient(ellipse 50% 50% at 20% 50%, rgba(204,1,255,0.06) 0%, transparent 70%)", "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(0,255,221,0.05) 0%, transparent 70%)"].join(", ") }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Built for teams that do</span>
                            <span className="display-strong-line">real outbound sales.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {AUDIENCE.map((line, i) => (
                            <motion.div
                                key={line}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-start gap-4 rounded-xl px-5 py-4"
                                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <span
                                    aria-hidden
                                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                                    style={{ background: "rgba(0,255,221,0.07)", border: "1px solid rgba(0,255,221,0.30)" }}
                                >
                                    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3">
                                        <path d="M2 5l2.5 2.5L8 3" stroke="rgba(0,255,221,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-body-sm text-white/75">{line}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ ───────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-14 md:py-20">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center gap-3 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Frequently asked </span><span className="display-strong-line">questions.</span>
                        </h2>
                    </motion.div>
                    <div className="flex flex-col gap-3">
                        {FAQS.map((f, i) => (
                            <FAQItem key={f.q} q={f.q} a={f.a} index={i} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. FINAL CTA ─────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
                <CTAAurora variant={2} />
                <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-0 mx-auto h-px max-w-3xl" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <h2 className="display-section-title display-inline max-w-2xl text-center">
                        <span className="display-muted-line">Your reps should be </span><span className="display-strong-line">closing, not researching.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        Give your team the AI workspace that does the heavy lifting before every email and every call.
                    </p>
                    <div>
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book a Demo
                        </button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

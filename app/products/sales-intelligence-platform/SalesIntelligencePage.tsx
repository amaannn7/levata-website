"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

// ── Image placeholder (matches homepage helper, drop a real <Image> later) ──
function ImagePlaceholder({
    aspect = "16 / 9",
    label = "Image placeholder",
    className = "",
}: {
    aspect?: string;
    label?: string;
    className?: string;
}) {
    return (
        <div
            className={`relative w-full overflow-hidden rounded-xl ${className}`}
            style={{
                aspectRatio: aspect,
                background: "linear-gradient(135deg, rgba(75,145,247,0.10), rgba(75,145,247,0.06))",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
            aria-hidden
        >
            <div className="hero-grid-bg absolute inset-0 opacity-50" />
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(75,145,247,0.18) 0%, transparent 70%)",
                }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                    {label}
                </span>
            </div>
        </div>
    );
}

// ── §2 Problem, line-art icons (one per pain) ────────────────────────────
function IconResearchClock() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M3 12H1M21 12H23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2" opacity="0.55" />
        </svg>
    );
}

function IconEnvelopeIgnored() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 7L12 14L21 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 14L15 18M15 14L9 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

function IconLeakyFunnel() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 5H20L14 12V19L10 21V12L4 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="22" r="0.9" fill="currentColor" />
            <circle cx="12" cy="19.5" r="0.6" fill="currentColor" opacity="0.6" />
        </svg>
    );
}

const PAIN_ICONS = [IconResearchClock, IconEnvelopeIgnored, IconLeakyFunnel] as const;
const PAIN_ACCENTS = ["#4B91F7", "#4B91F7", "#4B91F7"] as const;

// ── Section label helper ───────────────────────────────────────────────────
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

// ── Count-up hook (matches HeroSection.tsx) ────────────────────────────────
function useCountUp(target: number, duration = 1800) {
    const [count, setCount] = useState(0);
    const [triggered, setTriggered] = useState(false);
    const elRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setTriggered(true);
            },
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

function AnimatedStat({
    value,
    suffix,
    label,
    animate = true,
}: {
    value: number;
    suffix: string;
    label: string;
    animate?: boolean;
}) {
    const { count, elRef } = useCountUp(animate ? value : 0, 1800);
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <span
                ref={elRef}
                className="text-4xl sm:text-5xl font-bold leading-none tracking-tight md:text-6xl"
                style={{ color: "#4B91F7" }}
            >
                {animate ? count : value}
                <span style={{ color: "#4B91F7" }}>{suffix}</span>
            </span>
            <span className="max-w-[140px] sm:max-w-[200px] text-sm font-medium leading-snug text-white/45 tracking-wide">
                {label}
            </span>
        </div>
    );
}

// ── Capability glyphs ──────────────────────────────────────────────────────
type IconKind = "research" | "score" | "email" | "call" | "queue" | "crm";

function CapabilityIcon({ kind, accent }: { kind: IconKind; accent: string }) {
    const s = accent;
    if (kind === "research")
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6" stroke={s} strokeWidth="1.6" />
                <path d="M15.5 15.5L20 20" stroke={s} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M8 11h6M11 8v6" stroke={s} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
        );
    if (kind === "score")
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="13" width="4" height="8" rx="1" stroke={s} strokeWidth="1.5" />
                <rect x="10" y="8" width="4" height="13" rx="1" stroke={s} strokeWidth="1.5" />
                <rect x="17" y="3" width="4" height="18" rx="1" stroke={s} strokeWidth="1.5" />
            </svg>
        );
    if (kind === "email")
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke={s} strokeWidth="1.5" />
                <path d="M3 7l9 7 9-7" stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    if (kind === "call")
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                    d="M5 4h4l2 5-2.5 1.2a11 11 0 005.3 5.3L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"
                    stroke={s}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        );
    if (kind === "queue")
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="4" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
                <rect x="3" y="10" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
                <rect x="3" y="16" width="18" height="4" rx="1" stroke={s} strokeWidth="1.5" />
                <circle cx="7" cy="6" r="0.9" fill={s} />
                <circle cx="7" cy="12" r="0.9" fill={s} />
                <circle cx="7" cy="18" r="0.9" fill={s} />
            </svg>
        );
    // crm
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 7l9-4 9 4-9 4-9-4z" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 12l9 4 9-4M3 17l9 4 9-4" stroke={s} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

// ── Content ────────────────────────────────────────────────────────────────
const PAIN_POINTS = [
    {
        title: "Research is eating your team's time",
        body: "Reps spend hours manually researching prospects before writing a single email. Most of that research never gets used.",
        accent: "#4B91F7",
    },
    {
        title: "Generic outreach gets ignored",
        body: "Mass-blasted emails with no personalization drive low open rates, zero replies, and damaged sender reputation.",
        accent: "#4B91F7",
    },
    {
        title: "Leads fall through without follow-up",
        body: "Without a system, hot prospects cool off, callbacks get missed, and pipeline visibility disappears into spreadsheets.",
        accent: "#4B91F7",
    },
];

const CAPABILITIES: Array<{
    title: string;
    description: string;
    bullets: string[];
    accent: string;
    icon: IconKind;
}> = [
        {
            title: "AI Prospect Research",
            description:
                "Generate structured sales intelligence for any lead in seconds, not hours. Company profiles, industry challenges, buying signals, likely pain points, success metrics, opening hooks, and discovery questions. All the context your rep needs before picking up the phone or hitting send.",
            bullets: [
                "Company profile and industry landscape",
                "Pain points, buying power, and success metrics",
                "Opening hooks, sales angles, and discovery questions",
                "Objection anticipation and handling guidance",
            ],
            accent: "#4B91F7",
            icon: "research",
        },
        {
            title: "Lead Scoring & Prioritization",
            description: "Not all leads deserve equal attention. The platform scores and grades every prospect against your ideal customer profile, by industry, role, company size, geography, and enrichment data, so your reps always know who to contact first.",
            bullets: [
                "ICP scoring with fit grades and engagement scores",
                "Lead temperature and activity velocity tracking",
                "Next-action urgency and recommended actions",
                "Configurable scoring rules set by admins",
            ],
            accent: "#4B91F7",
            icon: "score",
        },
        {
            title: "Personalized Email & Follow-Up Generation",
            description: "Generate tailored outreach emails in seconds, initial cold email, first follow-up, second follow-up, and breakup email. Every email uses prospect data, research insights, prior email history, and your tone preferences to produce messages that actually get replies.",
            bullets: [
                "Cold email, follow-up 1 & 2, and breakup email generation",
                "Tone preferences and custom instruction support",
                "Social proof and value proposition integration",
                "Sender context and personalization at scale",
            ],
            accent: "#4B91F7",
            icon: "email",
        },
        {
            title: "Call Script Generation",
            description: "Walk into every call prepared. The platform generates structured call scripts for cold calls, follow-ups, callbacks, discovery calls, and demo introductions, tailored to the specific prospect, role, company, and industry.",
            bullets: [
                "Scripts for cold call, follow-up, discovery, and demo",
                "Prospect and industry-specific talking points",
                "Objection handling built into the script flow",
                "Adapts based on available research depth",
            ],
            accent: "#4B91F7",
            icon: "call",
        },
        {
            title: "Prioritized Work Queues & Daily Planning",
            description: "The platform surfaces exactly who to contact and when, eliminating the daily guesswork of deciding what to work on. Hot leads, stalled prospects, overdue callbacks, and research-ready contacts are all surfaced automatically.",
            bullets: [
                "Daily call, email, and research targets with completion streaks",
                "Hot leads, stalled leads, and overdue callback queues",
                "Carry-over tasks and commitment tracking",
                "Command center dashboard with pipeline visibility",
            ],
            accent: "#4B91F7",
            icon: "queue",
        },
        {
            title: "CRM Integration & Sales Workflow Tracking",
            description: "Push qualified opportunities directly into your CRM with field-mapped sync. Track every stage of the sales workflow, from first research to qualified deal, with full email history, call outcomes, notes, and meeting records stored against each lead.",
            bullets: [
                "Full CRM integration with OAuth, field mapping, and sync history",
                "Lead stages: new, researched, emailed, called, qualified, disqualified",
                "Email, call, and meeting outcome logging",
                "Export CRM-compatible CSV data at any point",
            ],
            accent: "#4B91F7",
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
    { num: "01", title: "Import or Add Leads", body: "Upload a CSV lead list or add prospects individually. Contact and company data stored in one clean record.", accent: "#4B91F7" },
    { num: "02", title: "Run AI Research", body: "Generate a complete prospect intelligence brief in seconds, pain points, hooks, buying signals, and discovery questions.", accent: "#4B91F7" },
    { num: "03", title: "Score & Prioritize", body: "The system grades each lead against your ICP and surfaces the highest-value opportunities first.", accent: "#4B91F7" },
    { num: "04", title: "Generate Outreach", body: "Create personalized cold emails, follow-ups, and call scripts in one click, tailored to each prospect.", accent: "#4B91F7" },
    { num: "05", title: "Track & Log", body: "Log emails sent, call outcomes, follow-up dates, and meeting results. Never lose track of where a lead stands.", accent: "#4B91F7" },
    { num: "06", title: "Qualify & Push to CRM", body: "Move qualified leads directly into your CRM with full data sync. Keep your pipeline clean and current.", accent: "#4B91F7" },
];

const FAQS = [
    {
        q: "Is this a CRM replacement?",
        a: "No, it's a prospecting and outreach layer designed to sit on top of your existing CRM. We push qualified opportunities into your CRM, not replace it.",
    },
    {
        q: "What CRMs do you integrate with?",
        a: "The platform supports most major CRM integrations via OAuth and field mapping. Zoho CRM is a primary supported integration with additional platforms in active development.",
    },
    {
        q: "How does the AI research work?",
        a: "The system uses the lead's contact and company data to generate structured sales intelligence, covering profile, pain points, buying signals, hooks, and questions, in seconds.",
    },
    {
        q: "Can multiple reps use the platform?",
        a: "Yes. The platform includes multi-user support with admin controls, user management, configurable ICP settings, and qualification question management.",
    },
    {
        q: "Can I import my existing lead lists?",
        a: "Yes. Upload CSV files directly and the platform maps your existing data fields into the lead record structure. You can also add leads individually or via CRM pull sync.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes. Contact us to set up a trial or book a live demo where we'll walk through the platform with your actual prospect data.",
    },
];

// ── FAQ Accordion item ────────────────────────────────────────────────────
function FAQItem({
    q,
    a,
    index,
    isOpen,
    onToggle,
}: {
    q: string;
    a: string;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${isOpen ? "rgba(75,145,247,0.28)" : "rgba(255,255,255,0.06)"}`,
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
                        background: "rgba(75,145,247,0.08)",
                        border: "1px solid rgba(75,145,247,0.25)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="#4B91F7" strokeWidth="1.6" strokeLinecap="round" />
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
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-white/55 md:text-base">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function SalesIntelligencePage() {
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
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <SectionLabel text="Sales Intelligence Platform" />
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Turn your lead list into</span>
                        <span className="display-strong-line">a pipeline, in hours.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        The AI-powered sales workspace for B2B teams. Research prospects, prioritize leads, generate
                        personalized outreach, and push qualified opportunities into your CRM, all from one place.
                    </p>
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Start Your Free Trial
                        </button>
                    </div>
                </motion.div>

                <div
                    aria-hidden
                    className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(75,145,247,0.35), transparent)" }}
                />
                <HeroHorizon />
            </section>

            {/* ── 2. PROBLEM ────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                        ].join(", "),
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Stop wasting time</span>
                            <span className="display-strong-line">on research and outreach tools.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {PAIN_POINTS.map((pp, i) => {
                            const Icon = PAIN_ICONS[i] ?? PAIN_ICONS[0];
                            const accent = PAIN_ACCENTS[i] ?? PAIN_ACCENTS[0];
                            return (
                                <motion.div
                                    key={pp.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ y: -4 }}
                                    className="flex h-full flex-col gap-5 rounded-2xl p-7 md:p-8 transition-colors duration-300 hover:bg-white/[0.03]"
                                    style={{
                                        background: "rgba(23,26,34,0.92)",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                    }}
                                >
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{
                                            background: "rgba(75,145,247,0.08)",
                                            border: "1px solid rgba(75,145,247,0.25)",
                                            color: "#4B91F7",
                                        }}
                                    >
                                        <Icon />
                                    </div>
                                    <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                                        {pp.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/55">{pp.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3. CORE CAPABILITIES ──────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Core capabilities" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Everything your team needs</span>
                            <span className="display-strong-line">in one intelligent workspace.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {CAPABILITIES.map((c, i) => (
                            <motion.div
                                key={c.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -4 }}
                                className="flex h-full flex-col gap-5 rounded-2xl p-7 md:p-8 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{
                                    background: "rgba(23,26,34,0.92)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                                    style={{
                                        background: "rgba(75,145,247,0.08)",
                                        border: "1px solid rgba(75,145,247,0.25)",
                                    }}
                                >
                                    <CapabilityIcon kind={c.icon} accent="#4B91F7" />
                                </div>
                                <h3 className="text-[1.2rem] font-bold leading-snug tracking-tight text-white md:text-[1.35rem]">
                                    {c.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55">{c.description}</p>
                                <ul className="mt-auto flex flex-col gap-2.5">
                                    {c.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-3 text-sm text-white">
                                            <span
                                                aria-hidden
                                                className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                                style={{ background: "#4B91F7" }}
                                            />
                                            <span className="leading-snug">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. WHO IT'S FOR ──────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-20 md:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(75,145,247,0.07) 0%, transparent 70%)",
                            "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                        ].join(", "),
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Who it's for" />
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
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <span
                                    aria-hidden
                                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: "rgba(75,145,247,0.12)",
                                        border: "1px solid rgba(75,145,247,0.3)",
                                    }}
                                >
                                    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3">
                                        <path
                                            d="M2 5l2.5 2.5L8 3"
                                            stroke="#4B91F7"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                                <span className="text-sm leading-relaxed text-white/75">{line}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. KEY OUTCOMES ──────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-24 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(75,145,247,0.08) 0%, transparent 65%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="Key outcomes" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Real results,</span>
                            <span className="display-strong-line">not hype.</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
                        {OUTCOMES.map((o) => (
                            <AnimatedStat
                                key={o.label}
                                value={o.value}
                                suffix={o.suffix}
                                label={o.label}
                                animate={o.animate}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. HOW IT WORKS ──────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(75,145,247,0.06) 0%, transparent 70%)",
                        ].join(", "),
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel text="How it works" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">From lead list</span>
                            <span className="display-strong-line">to closed deal in 6 steps.</span>
                        </h2>
                    </motion.div>

                    {/* Horizontal stepped flow */}
                    <div className="relative">
                        {/* Connecting line, lg+ only, behind the badge row */}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute hidden lg:block lg:left-0 lg:right-0"
                            style={{
                                top: "28px",
                                height: "1px",
                                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18) 6%, rgba(255,255,255,0.18) 94%, transparent)",
                            }}
                        />

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
                                    <div
                                        className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full md:h-14 md:w-14"
                                        style={{
                                            background: "#171A22",
                                            border: "1px solid #4B91F780",
                                            boxShadow: "0 0 0 4px #0E1014, 0 0 20px #4B91F725",
                                        }}
                                    >
                                        <span
                                            className="text-base font-bold tracking-tight md:text-lg"
                                            style={{ color: "#4B91F7" }}
                                        >
                                            {step.num}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 text-base font-bold leading-snug tracking-tight text-white md:text-lg">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-white/55 md:text-sm">
                                        {step.body}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ ───────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-20 md:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(75,145,247,0.05) 0%, transparent 70%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="FAQ" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Frequently asked</span>
                            <span className="display-strong-line">questions.</span>
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

            {/* ── 8. FINAL CTA ─────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(75,145,247,0.18) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 50% at 20% 0%, rgba(75,145,247,0.1) 0%, transparent 60%)",
                            "radial-gradient(ellipse 40% 50% at 80% 0%, rgba(75,145,247,0.08) 0%, transparent 60%)",
                        ].join(", "),
                    }}
                />
                <div
                    aria-hidden
                    className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(75,145,247,0.5), transparent)" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <SectionLabel text="Ship pipeline" />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Your reps should be</span>
                        <span className="display-strong-line">closing, not researching.</span>
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                        Give your team the AI workspace that does the heavy lifting before every email and every call.
                    </p>
                    <div>
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
                        >
                            Book a Demo
                        </button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

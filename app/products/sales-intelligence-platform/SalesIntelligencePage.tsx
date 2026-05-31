"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";

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
                background: "linear-gradient(135deg, rgba(123, 85, 234,0.10), rgba(123, 85, 234,0.06))",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
            aria-hidden
        >
            <div className="hero-grid-bg absolute inset-0 opacity-50" />
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.18) 0%, transparent 70%)",
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
const PAIN_ACCENTS = ["#FFFFFF", "#FFFFFF", "#FFFFFF"] as const;

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
                style={{ color: "#FFFFFF" }}
            >
                {animate ? count : value}
                <span style={{ color: "#FFFFFF" }}>{suffix}</span>
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
        accent: "#FFFFFF",
    },
    {
        title: "Generic outreach gets ignored",
        body: "Mass-blasted emails with no personalization drive low open rates, zero replies, and damaged sender reputation.",
        accent: "#FFFFFF",
    },
    {
        title: "Leads fall through without follow-up",
        body: "Without a system, hot prospects cool off, callbacks get missed, and pipeline visibility disappears into spreadsheets.",
        accent: "#FFFFFF",
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
                "Full prospect intel in seconds: company, pain points, buying signals, hooks, and discovery questions ready before every outreach.",
            bullets: [
                "Company + industry intel",
                "Pain points + buying signals",
                "Hooks + objection handling",
            ],
            accent: "#FFFFFF",
            icon: "research",
        },
        {
            title: "Lead Scoring & Prioritization",
            description:
                "Every lead scored against your ICP by industry, role, size, and engagement. Reps always know who to contact first.",
            bullets: [
                "ICP fit + grade",
                "Activity velocity tracking",
                "Next-best action surfaced",
            ],
            accent: "#FFFFFF",
            icon: "score",
        },
        {
            title: "Personalized Email & Follow-Up",
            description:
                "Cold email, follow-ups, and breakup emails generated in seconds, tailored to the prospect, your tone, and prior history.",
            bullets: [
                "Cold + 2 follow-ups + breakup",
                "Tone + custom voice",
                "Personalized at scale",
            ],
            accent: "#FFFFFF",
            icon: "email",
        },
        {
            title: "Call Script Generation",
            description:
                "Structured scripts for cold, follow-up, discovery, and demo calls, adapted to the prospect, role, and industry.",
            bullets: [
                "4 call types covered",
                "Industry-specific talking points",
                "Objections built into the flow",
            ],
            accent: "#FFFFFF",
            icon: "call",
        },
        {
            title: "Prioritized Work Queues",
            description:
                "Hot leads, stalled prospects, overdue callbacks, and research-ready contacts surfaced automatically. No more daily guesswork.",
            bullets: [
                "Daily targets + streaks",
                "Hot, stalled + overdue queues",
                "Pipeline visibility",
            ],
            accent: "#FFFFFF",
            icon: "queue",
        },
        {
            title: "CRM Integration & Sync",
            description:
                "Qualified opportunities pushed straight into your CRM with full field-mapped sync, stage tracking, and complete activity history.",
            bullets: [
                "OAuth + field mapping",
                "Email, call + meeting logs",
                "CSV export anytime",
            ],
            accent: "#FFFFFF",
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
    { num: "01", title: "Import or Add Leads", body: "Upload a CSV lead list or add prospects individually. Contact and company data stored in one clean record.", accent: "#FFFFFF" },
    { num: "02", title: "Run AI Research", body: "Generate a complete prospect intelligence brief in seconds, pain points, hooks, buying signals, and discovery questions.", accent: "#FFFFFF" },
    { num: "03", title: "Score & Prioritize", body: "The system grades each lead against your ICP and surfaces the highest-value opportunities first.", accent: "#FFFFFF" },
    { num: "04", title: "Generate Outreach", body: "Create personalized cold emails, follow-ups, and call scripts in one click, tailored to each prospect.", accent: "#FFFFFF" },
    { num: "05", title: "Track & Log", body: "Log emails sent, call outcomes, follow-up dates, and meeting results. Never lose track of where a lead stands.", accent: "#FFFFFF" },
    { num: "06", title: "Qualify & Push to CRM", body: "Move qualified leads directly into your CRM with full data sync. Keep your pipeline clean and current.", accent: "#FFFFFF" },
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
                border: `1px solid ${isOpen ? "rgba(123, 85, 234,0.28)" : "rgba(255,255,255,0.06)"}`,
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
                        background: "rgba(123, 85, 234,0.08)",
                        border: "1px solid rgba(123, 85, 234,0.25)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
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
    const [activeCap, setActiveCap] = useState(0);
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
                                        <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line">Most lead lists go cold.</span>
                        <span className="display-strong-line">Ours turn into pipeline.</span>
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Cold lead lists, scattered research, and generic outreach lose the deals worth winning.
                        Our AI-powered workspace turns raw lead lists into prioritized, researched,
                        ready-to-action pipeline in hours, not weeks.
                    </p>
                    <div className="mt-2">
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

                <div
                    aria-hidden
                    className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.35), transparent)" }}
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
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
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
                        <SectionLabel />
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
                                            background: "rgba(123, 85, 234,0.08)",
                                            border: "1px solid rgba(123, 85, 234,0.25)",
                                            color: "#FFFFFF",
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
                        background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                    }}
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Everything your team needs</span>
                            <span className="display-strong-line">in one intelligent workspace.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.25fr] md:gap-7"
                    >
                        {/* Left: capability list */}
                        <div className="flex flex-col gap-1.5">
                            {CAPABILITIES.map((c, i) => {
                                const active = activeCap === i;
                                return (
                                    <button
                                        key={c.title}
                                        type="button"
                                        onClick={() => setActiveCap(i)}
                                        className="group relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-300"
                                        style={{
                                            background: active
                                                ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 100%)"
                                                : "transparent",
                                            border: active
                                                ? "1px solid rgba(255,255,255,0.18)"
                                                : "1px solid rgba(255,255,255,0.05)",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) {
                                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) {
                                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                                            }
                                        }}
                                        aria-pressed={active}
                                    >
                                        {/* Active accent stripe */}
                                        <span
                                            aria-hidden
                                            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all duration-300"
                                            style={{
                                                width: active ? 3 : 0,
                                                height: active ? 28 : 0,
                                                background: "#FFFFFF",
                                                boxShadow: active ? "0 0 12px rgba(255,255,255,0.4)" : "none",
                                            }}
                                        />
                                        {/* Number */}
                                        <span
                                            className="flex-shrink-0 text-[10px] font-semibold tabular-nums transition-colors duration-300"
                                            style={{
                                                fontFamily: MONO,
                                                letterSpacing: "0.18em",
                                                color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                                                minWidth: 18,
                                            }}
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        {/* Icon */}
                                        <span
                                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                                            style={{
                                                background: active
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(255,255,255,0.02)",
                                                border: active
                                                    ? "1px solid rgba(255,255,255,0.28)"
                                                    : "1px solid rgba(255,255,255,0.08)",
                                            }}
                                        >
                                            <CapabilityIcon kind={c.icon} accent="#FFFFFF" />
                                        </span>
                                        {/* Title + chevron */}
                                        <span className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                            <span
                                                className="text-sm font-semibold leading-snug transition-colors duration-300 md:text-[15px]"
                                                style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.62)" }}
                                            >
                                                {c.title}
                                            </span>
                                            <span
                                                aria-hidden
                                                className="flex-shrink-0 transition-all duration-300"
                                                style={{
                                                    color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                                                    transform: active ? "translateX(3px)" : "none",
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: detail panel for active capability */}
                        <div className="relative overflow-hidden rounded-2xl p-px"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.14) 100%)",
                            }}
                        >
                            <div
                                className="relative overflow-hidden rounded-[15px] p-7 md:p-9"
                                style={{
                                    background:
                                        "linear-gradient(160deg, rgba(28,30,38,0.96) 0%, rgba(20,22,28,0.96) 100%)",
                                    minHeight: 380,
                                }}
                            >
                                {/* Top accent line */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)",
                                    }}
                                />
                                {/* Corner glow */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full"
                                    style={{
                                        background:
                                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                                    }}
                                />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCap}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative flex h-full flex-col gap-5"
                                    >
                                        {/* Huge background numeral */}
                                        <span
                                            aria-hidden
                                            className="pointer-events-none absolute right-0 top-0 select-none leading-none"
                                            style={{
                                                fontFamily: MONO,
                                                fontWeight: 700,
                                                fontSize: "clamp(5rem, 10vw, 7.5rem)",
                                                color: "rgba(255,255,255,0.035)",
                                                letterSpacing: "-0.04em",
                                            }}
                                        >
                                            {String(activeCap + 1).padStart(2, "0")}
                                        </span>

                                        {/* Header row: icon + eyebrow */}
                                        <div className="relative flex items-center justify-between gap-4">
                                            <span
                                                className="flex h-14 w-14 items-center justify-center rounded-xl"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
                                                    border: "1px solid rgba(255,255,255,0.22)",
                                                    boxShadow: "0 4px 14px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                                                }}
                                            >
                                                <CapabilityIcon kind={CAPABILITIES[activeCap].icon} accent="#FFFFFF" />
                                            </span>
                                            <span
                                                className="text-[10px] font-semibold uppercase tabular-nums text-white/45"
                                                style={{ fontFamily: MONO, letterSpacing: "0.22em" }}
                                            >
                                                Capability {String(activeCap + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="relative text-[1.5rem] font-bold leading-[1.15] tracking-tight text-white md:text-[1.75rem]">
                                            {CAPABILITIES[activeCap].title}
                                        </h3>

                                        {/* Description */}
                                        <p className="relative text-[15px] leading-relaxed text-white/60 md:text-base">
                                            {CAPABILITIES[activeCap].description}
                                        </p>

                                        {/* Divider */}
                                        <div
                                            aria-hidden
                                            className="relative my-1 h-px w-full"
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                                            }}
                                        />

                                        {/* Eyebrow above bullets */}
                                        <p className="relative -mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                            What's included
                                        </p>

                                        {/* Bullets */}
                                        <ul className="relative mt-auto flex flex-col gap-2.5">
                                            {CAPABILITIES[activeCap].bullets.map((b, bi) => (
                                                <motion.li
                                                    key={b}
                                                    initial={{ opacity: 0, x: -6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: 0.08 + bi * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                                    className="flex items-center gap-3 text-[14px] text-white/85"
                                                >
                                                    <span
                                                        aria-hidden
                                                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center"
                                                    >
                                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                            <path d="M2 5l2 2L8 3" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span>
                                                    <span className="leading-snug">{b}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 4. WHO IT'S FOR ──────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-6 py-20 md:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(123, 85, 234,0.07) 0%, transparent 70%)",
                            "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
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
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <span
                                    aria-hidden
                                    className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: "rgba(123, 85, 234,0.12)",
                                        border: "1px solid rgba(123, 85, 234,0.3)",
                                    }}
                                >
                                    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3">
                                        <path
                                            d="M2 5l2.5 2.5L8 3"
                                            stroke="#FFFFFF"
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
                        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(123, 85, 234,0.08) 0%, transparent 65%)",
                    }}
                />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center md:mb-14 gap-5 text-center"
                    >
                        <SectionLabel />
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
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(123, 85, 234,0.05) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
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
                        <SectionLabel />
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
                                            border: "1px solid #FFFFFF80",
                                            boxShadow: "0 0 0 4px #0E1014, 0 0 20px #FFFFFF25",
                                        }}
                                    >
                                        <span
                                            className="text-base font-bold tracking-tight md:text-lg"
                                            style={{ color: "#FFFFFF" }}
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
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel />
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
                <CTAAurora variant={2} />
                <div
                    aria-hidden
                    className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.5), transparent)" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
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

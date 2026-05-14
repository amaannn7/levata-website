"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import PageArcs from "@/app/components/PageArcs";

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
                className="text-5xl font-extrabold leading-none tracking-tight text-white md:text-6xl"
            >
                {animate ? count : value}
                <span className="text-white">{suffix}</span>
            </span>
            <span className="max-w-[200px] text-sm font-medium leading-snug text-white/45 tracking-wide">
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
        accent: "#72C8F5",
    },
    {
        title: "Generic outreach gets ignored",
        body: "Mass-blasted emails with no personalization drive low open rates, zero replies, and damaged sender reputation.",
        accent: "#BB00FF",
    },
    {
        title: "Leads fall through without follow-up",
        body: "Without a system, hot prospects cool off, callbacks get missed, and pipeline visibility disappears into spreadsheets.",
        accent: "#9B2FFF",
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
                "Generate structured sales intelligence for any lead in seconds. Company profiles, industry challenges, buying signals, likely pain points, success metrics, opening hooks, and discovery questions.",
            bullets: [
                "Company profile and industry landscape",
                "Pain points, buying power, and success metrics",
                "Opening hooks, sales angles, and discovery questions",
                "Objection anticipation and handling guidance",
            ],
            accent: "#9B2FFF",
            icon: "research",
        },
        {
            title: "Lead Scoring & Prioritization",
            description: "Scores and grades every prospect against your ideal customer profile.",
            bullets: [
                "ICP scoring with fit grades and engagement scores",
                "Lead temperature and activity velocity tracking",
                "Next-action urgency and recommended actions",
                "Configurable scoring rules set by admins",
            ],
            accent: "#72C8F5",
            icon: "score",
        },
        {
            title: "Personalized Email & Follow-Up Generation",
            description: "Generate tailored outreach emails in seconds.",
            bullets: [
                "Cold email, follow-up 1 & 2, and breakup email generation",
                "Tone preferences and custom instruction support",
                "Social proof and value proposition integration",
                "Sender context and personalization at scale",
            ],
            accent: "#BB00FF",
            icon: "email",
        },
        {
            title: "Call Script Generation",
            description: "Structured call scripts tailored to the prospect.",
            bullets: [
                "Scripts for cold call, follow-up, discovery, and demo",
                "Prospect and industry-specific talking points",
                "Objection handling built into the script flow",
            ],
            accent: "#3DFD98",
            icon: "call",
        },
        {
            title: "Prioritized Work Queues & Daily Planning",
            description: "Surfaces exactly who to contact and when.",
            bullets: [
                "Daily call, email, and research targets",
                "Hot leads, stalled leads, and overdue callback queues",
                "Command center dashboard with pipeline visibility",
            ],
            accent: "#72C8F5",
            icon: "queue",
        },
        {
            title: "CRM Integration & Sales Workflow Tracking",
            description: "Push qualified opportunities directly into your CRM.",
            bullets: [
                "Full CRM integration with OAuth and field mapping",
                "Lead stages tracking",
                "Email, call, and meeting outcome logging",
            ],
            accent: "#9B2FFF",
            icon: "crm",
        },
    ];

const AUDIENCE = [
    "Small to mid-sized B2B sales teams managing outbound prospecting",
    "Founder-led or owner-led businesses running outbound sales themselves",
    "Agencies and consultants running lead generation campaigns for clients",
    "Sales reps managing cold outreach manually today",
    "Teams using Zoho CRM seeking a lightweight AI layer",
    "Businesses that need AI research without enterprise complexity",
];

const OUTCOMES = [
    { value: 80, suffix: "%", label: "Reduction in research time per prospect", animate: true },
    { value: 3, suffix: "×", label: "More personalized outreach per day", animate: true },
    { value: 0, suffix: "", label: "Leads missed with smart work queues", animate: false },
    { value: 1, suffix: "", label: "Place for research, email, calls, and CRM", animate: false },
];

const STEPS = [
    { num: "01", title: "Import or Add Leads", body: "Upload CSV or add individually.", accent: "#9B2FFF" },
    { num: "02", title: "Run AI Research", body: "Generate complete prospect intelligence brief in seconds.", accent: "#72C8F5" },
    { num: "03", title: "Score & Prioritize", body: "Grade leads against your ICP.", accent: "#BB00FF" },
    { num: "04", title: "Generate Outreach", body: "Create personalized emails and call scripts.", accent: "#3DFD98" },
    { num: "05", title: "Track & Log", body: "Log all activity in one place.", accent: "#72C8F5" },
    { num: "06", title: "Qualify & Push to CRM", body: "Sync qualified opportunities directly.", accent: "#9B2FFF" },
];

const FAQS = [
    {
        q: "Is this a CRM replacement?",
        a: "No — it's a prospecting and outreach layer designed to sit on top of your existing CRM.",
    },
    {
        q: "What CRMs do you integrate with?",
        a: "Supports most major CRMs via OAuth. Zoho CRM is a primary integration.",
    },
    {
        q: "How does the AI research work?",
        a: "Uses lead and company data to generate structured sales intelligence in seconds.",
    },
    {
        q: "Can multiple reps use the platform?",
        a: "Yes, with multi-user support, admin controls, and team features.",
    },
    {
        q: "Can I import my existing lead lists?",
        a: "Yes, via CSV upload with field mapping.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes. Contact us to set up a trial or book a live demo.",
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
                border: `1px solid ${isOpen ? "rgba(114,200,245,0.28)" : "rgba(255,255,255,0.06)"}`,
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
                        background: "rgba(114,200,245,0.08)",
                        border: "1px solid rgba(114,200,245,0.25)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="#72C8F5" strokeWidth="1.6" strokeLinecap="round" />
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

    return (
        <main className="relative min-h-screen bg-[#07001F] overflow-hidden">
            <PageArcs />

            {/* ── 1. HERO ───────────────────────────────────── */}
            <section
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-6 text-center"
                style={{ paddingTop: "150px", paddingBottom: "100px" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <SectionLabel text="Sales Intelligence Platform" />
                    <h1
                        className="text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.25rem] md:text-[2.7rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        Turn Your Lead List Into a Qualified Pipeline —<br />In Hours, Not Days.
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        The AI-powered sales workspace for B2B teams. Research prospects, prioritize leads, generate
                        personalized outreach, and push qualified opportunities into your CRM — all from one place.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Start Your Free Trial
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>

                <div
                    aria-hidden
                    className="absolute bottom-0 left-1/2 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(114,200,245,0.35), transparent)" }}
                />
            </section>

            {/* ── 2. PROBLEM ────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(155,47,255,0.06) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(114,200,245,0.05) 0%, transparent 70%)",
                        ].join(", "),
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="The problem" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Stop wasting time on manual research and scattered outreach.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {PAIN_POINTS.map((pp, i) => (
                            <motion.div
                                key={pp.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-2xl p-px"
                                style={{
                                    background: `linear-gradient(160deg, ${pp.accent}33 0%, rgba(255,255,255,0.05) 60%)`,
                                }}
                            >
                                <div
                                    className="h-full rounded-[15px] p-7"
                                    style={{ background: "rgba(8,1,28,0.98)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <div
                                        className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{ background: `${pp.accent}1A`, border: `1px solid ${pp.accent}55` }}
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ background: pp.accent, boxShadow: `0 0 12px ${pp.accent}` }}
                                        />
                                    </div>
                                    <h3 className="mb-3 text-lg font-bold leading-snug text-white md:text-xl">
                                        {pp.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">{pp.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. CORE CAPABILITIES ──────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 70% at 50% 40%, rgba(114,200,245,0.05) 0%, transparent 70%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Core capabilities" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Everything your team needs in one intelligent workspace.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {CAPABILITIES.map((c, i) => (
                            <motion.div
                                key={c.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: (i % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -4 }}
                                className="rounded-2xl p-px"
                                style={{
                                    background: `linear-gradient(160deg, ${c.accent}33 0%, rgba(255,255,255,0.05) 60%)`,
                                }}
                            >
                                <div
                                    className="flex h-full flex-col gap-5 rounded-[15px] p-7"
                                    style={{ background: "rgba(8,1,28,0.98)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <div className="relative w-fit">
                                        <div
                                            aria-hidden
                                            className="absolute -inset-2 rounded-2xl"
                                            style={{ background: `radial-gradient(circle, ${c.accent}33 0%, transparent 70%)` }}
                                        />
                                        <div
                                            className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                                            style={{
                                                background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}08)`,
                                                border: `1px solid ${c.accent}40`,
                                            }}
                                        >
                                            <CapabilityIcon kind={c.icon} accent={c.accent} />
                                        </div>
                                    </div>
                                    <h3 className="text-[1.3rem] font-bold leading-snug tracking-tight text-white">
                                        {c.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/55">{c.description}</p>
                                    <ul className="mt-auto flex flex-col gap-2.5">
                                        {c.bullets.map((b) => (
                                            <li key={b} className="flex items-start gap-3 text-sm text-white">
                                                <span
                                                    className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                                    style={{ background: c.accent }}
                                                />
                                                <span className="leading-snug">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. WHO IT'S FOR ──────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-20 md:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(155,47,255,0.07) 0%, transparent 70%)",
                            "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(114,200,245,0.06) 0%, transparent 70%)",
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
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Built for teams that do real outbound sales.
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
                                        background: "rgba(114,200,245,0.12)",
                                        border: "1px solid rgba(114,200,245,0.3)",
                                    }}
                                >
                                    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3">
                                        <path
                                            d="M2 5l2.5 2.5L8 3"
                                            stroke="#72C8F5"
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
            <section className="relative w-full overflow-hidden px-6 py-24 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.08) 0%, transparent 65%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="Key outcomes" />
                        <h2 className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Real results, not hype.
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
            <section className="relative w-full overflow-hidden px-6 py-20 md:py-28">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(114,200,245,0.05) 0%, transparent 70%)",
                            "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(155,47,255,0.06) 0%, transparent 70%)",
                        ].join(", "),
                    }}
                />
                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-14 flex flex-col items-center gap-5 text-center"
                    >
                        <SectionLabel text="How it works" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            From lead list to closed deal in 6 steps.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-2xl p-px"
                                style={{
                                    background: `linear-gradient(315deg, ${step.accent}44, rgba(58,53,80,0.5))`,
                                }}
                            >
                                <div
                                    className="flex h-full flex-col gap-3 rounded-[15px] p-6"
                                    style={{ background: "#07001F" }}
                                >
                                    <span
                                        className="text-[2rem] font-black leading-none"
                                        style={{
                                            color: step.accent,
                                            textShadow: `${step.accent}80 0px 0px 12px`,
                                        }}
                                    >
                                        {step.num}.
                                    </span>
                                    <h3 className="text-lg font-bold leading-snug text-white md:text-xl">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">{step.body}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. FAQ ───────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-20 md:py-24">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(114,200,245,0.05) 0%, transparent 70%)",
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
                        <h2 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Frequently asked questions.
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
            <section className="relative w-full overflow-hidden px-6 py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(155,47,255,0.18) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 50% at 20% 0%, rgba(114,200,245,0.1) 0%, transparent 60%)",
                            "radial-gradient(ellipse 40% 50% at 80% 0%, rgba(155,47,255,0.08) 0%, transparent 60%)",
                        ].join(", "),
                    }}
                />
                <div
                    aria-hidden
                    className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2"
                    style={{ background: "linear-gradient(to right, transparent, rgba(155,47,255,0.5), transparent)" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <SectionLabel text="Ship pipeline" />
                    <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-4xl lg:text-[2.8rem]">
                        Your reps should be closing — not researching.
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                        Give your team the AI workspace that does the heavy lifting before every email and every call.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Book a Demo
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import PageArcs from "@/app/components/PageArcs";
import HeroBubbles from "@/app/components/HeroBubbles";
import { useBookCall } from "@/app/components/BookCallProvider";

// ── Section label ──────────────────────────────────────────────────────────
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

// ── Monochrome schematic diagrams (mirror homepage §9 WhyVisualHint set) ──
const MONO_STROKE = "rgba(255,255,255,0.65)";
const MONO_FILL = "rgba(255,255,255,0.08)";

function IconLayersDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <rect x="10" y="6" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="10" y="15" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="10" y="24" width="60" height="6" rx="2" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <circle cx="22" cy="9" r="1.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="1.5" fill={MONO_STROKE} />
            <circle cx="58" cy="27" r="1.5" fill={MONO_STROKE} />
        </svg>
    );
}

function IconE2EDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <line x1="14" y1="18" x2="40" y2="18" stroke={MONO_STROKE} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
            <line x1="40" y1="18" x2="66" y2="18" stroke={MONO_STROKE} strokeWidth="1.4" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="14" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="14" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="40" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="66" cy="18" r="7" fill="rgba(8,1,28,0.95)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="66" cy="18" r="2.5" fill={MONO_STROKE} />
        </svg>
    );
}

function IconLoopDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <path d="M14 22 Q 40 -2, 66 22" stroke={MONO_STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M66 22 Q 40 38, 14 22" stroke={MONO_STROKE} strokeWidth="1.5" strokeDasharray="3 3" fill="none" strokeLinecap="round" opacity="0.55" />
            <path d="M58 16 L 66 22 L 60 28" stroke={MONO_STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="14" cy="22" r="3" fill={MONO_STROKE} />
        </svg>
    );
}

function IconBarsDiagram() {
    return (
        <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
            <rect x="10" y="22" width="10" height="10" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="26" y="16" width="10" height="16" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="42" y="10" width="10" height="22" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <rect x="58" y="4" width="10" height="28" rx="1.5" fill={MONO_FILL} stroke={MONO_STROKE} strokeWidth="1.2" />
            <path d="M15 24 L 31 18 L 47 12 L 63 6" stroke={MONO_STROKE} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Initials avatar (for Team cards) ──────────────────────────────────────
function initialsFrom(name: string) {
    const parts = name.replace(/\./g, "").trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const WHY_ITEMS = [
    {
        Icon: IconLayersDiagram,
        title: "AI-native from the ground up",
        body: "Every system we ship is designed with AI at its core — not bolted on later.",
    },
    {
        Icon: IconE2EDiagram,
        title: "End-to-end under one roof",
        body: "Strategy, design, engineering, automation, and growth — coordinated under one accountable team.",
    },
    {
        Icon: IconLoopDiagram,
        title: "Continuous partnership model",
        body: "We don't disappear after launch. We measure, iterate, and compound results month over month.",
    },
    {
        Icon: IconBarsDiagram,
        title: "Outcomes over outputs",
        body: "We commit to measurable business results, not deliverables in a Notion doc.",
    },
];

const TEAM = [
    {
        name: "Amaan K.",
        role: "CEO & Co-founder",
        bio: "Architects the strategic vision and AI systems that drive measurable client outcomes.",
    },
    {
        name: "Sarah M.",
        role: "Head of AI Engineering",
        bio: "Leads model integration and intelligent automation across every Levata build.",
    },
    {
        name: "Daniel R.",
        role: "Head of Delivery",
        bio: "Owns end-to-end execution: from discovery to launch to continuous optimisation.",
    },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function AboutPage() {
    const ctaRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#07001F] flex flex-col overflow-hidden">
            <PageArcs />

            {/* ── Hero ─────────────────────────────────────────── */}
            <section
                ref={heroRef}
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:pb-[100px] md:pt-[150px]"
            >
                <HeroBubbles containerRef={heroRef} />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                >
                    <SectionLabel text="About Levata" />
                    <h1
                        className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]"
                        style={{
                            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        }}
                    >
                        We&apos;re Not a Digital Agency.<br />
                        <span className="jakarta-italic">We&apos;re an Intelligence Partner.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Levata builds AI-powered systems that help businesses move faster, decide smarter, and
                        compete at a level that wasn&apos;t possible before.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-5 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
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
                    </div>
                </motion.div>

                <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(114,200,245,0.35), transparent)" }}
                />
            </section>

            {/* ── Who We Are ───────────────────────────────────── */}
            <section className="relative w-full px-6 py-16 md:py-20 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute z-0" style={{
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    width: "120vw", height: "500px",
                    background: [
                        "radial-gradient(ellipse 30% 60% at 20% 50%, rgba(155,47,255,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 60% at 80% 50%, rgba(114,200,245,0.06) 0%, transparent 70%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="Who we are" />
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            Building the AI-native operations layer.
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto max-w-3xl text-center text-base leading-relaxed text-white/55 md:text-[1.05rem]"
                    >
                        We founded Levata to close the gap between powerful AI technology and the businesses
                        that need it most. Not through software subscriptions or one-off projects — but as a
                        genuine systems partner with end-to-end accountability for every outcome we promise.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto mt-10 max-w-2xl rounded-2xl p-px"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(114,200,245,0.35) 0%, rgba(255,255,255,0.06) 50%, rgba(155,47,255,0.35) 100%)",
                        }}
                    >
                        <div
                            className="relative rounded-[15px] p-7 md:p-8"
                            style={{
                                background: "rgba(8,1,28,0.96)",
                                border: "1px solid rgba(255,255,255,0.04)",
                            }}
                        >
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                Our vision
                            </p>
                            <p className="text-lg font-medium leading-snug text-white/90 md:text-xl">
                                &ldquo;To make AI-powered operations the standard for every ambitious business —
                                not just the enterprise.&rdquo;
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Team ─────────────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-16 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(155,47,255,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 40% at 80% 20%, rgba(114,200,245,0.05) 0%, transparent 60%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="The team" />
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-[1.1]">
                            The people behind the partnership.
                        </h2>
                        <p className="max-w-md text-base text-white/45 leading-relaxed md:text-[1.05rem]">
                            A focused team of strategists, engineers, and AI specialists obsessed with shipping
                            outcomes — not deliverables.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                        {TEAM.map(({ name, role, bio }, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center text-center"
                            >
                                <div
                                    aria-hidden
                                    className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed sm:h-32 sm:w-32 md:h-36 md:w-36"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.18)",
                                        background: "radial-gradient(circle, rgba(155,47,255,0.08) 0%, rgba(8,1,28,0.5) 70%)",
                                    }}
                                >
                                    <span className="text-2xl font-bold tracking-tight text-white/85 md:text-3xl">
                                        {initialsFrom(name)}
                                    </span>
                                </div>
                                <p className="mt-6 text-lg font-bold text-white md:text-xl">{name}</p>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{role}</p>
                                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Clients Choose Us ────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-16 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(155,47,255,0.08) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(114,200,245,0.06) 0%, transparent 60%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center text-center gap-4"
                    >
                        <SectionLabel text="Why clients choose us" />
                        <h2 className="text-3xl font-extrabold tracking-tight text-white leading-[1.08] md:text-4xl max-w-2xl">
                            Four reasons we earn long-term partnerships.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:auto-rows-fr">
                        {WHY_ITEMS.map(({ Icon, title, body }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ y: -4 }}
                                className="flex h-full flex-col gap-6 rounded-2xl p-7 md:p-9 transition-colors duration-300 hover:bg-white/[0.03]"
                                style={{
                                    background: "rgba(8,1,28,0.55)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <Icon />
                                <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────────────── */}
            <section ref={ctaRef} className="relative w-full px-6 py-20 md:py-28 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 70% at 50% 100%, rgba(155,47,255,0.15) 0%, transparent 65%)",
                        "radial-gradient(ellipse 30% 40% at 30% 50%, rgba(114,200,245,0.07) 0%, transparent 60%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(155,47,255,0.4), transparent)" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center gap-8"
                >
                    <SectionLabel text="Work with us" />
                    <h2 className="text-3xl font-extrabold tracking-tight text-white leading-[1.08] md:text-4xl">
                        Ready to build the infrastructure<br />your business deserves?
                    </h2>
                    <p className="max-w-md text-base text-white/50 leading-relaxed">
                        Tell us about your business. We&apos;ll come back with a clear path to AI-powered operations
                        within 48 hours.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
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
                            Book a Free Strategy Call
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

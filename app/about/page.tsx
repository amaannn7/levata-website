"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

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
            <circle cx="14" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="14" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="40" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
            <circle cx="40" cy="18" r="2.5" fill={MONO_STROKE} />
            <circle cx="66" cy="18" r="7" fill="rgba(23,26,34,0.98)" stroke={MONO_STROKE} strokeWidth="1.4" />
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
        body: "Intelligence is designed into everything, not bolted on.",
    },
    {
        Icon: IconE2EDiagram,
        title: "End-to-end under one roof",
        body: "Strategy, design, engineering, and AI. One team, one outcome.",
    },
    {
        Icon: IconLoopDiagram,
        title: "Continuous partnership model",
        body: "We monitor, optimise, and improve after delivery, always.",
    },
    {
        Icon: IconBarsDiagram,
        title: "Outcomes over outputs",
        body: "Every engagement is tied to measurable business results.",
    },
];

const TEAM = [
    { name: "Shameer Refai", role: "Co-founder", bio: "" },
    { name: "Abdur Rahman", role: "Co-founder", bio: "" },
    { name: "Amaan Yusuf", role: "Co-founder", bio: "" },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function AboutPage() {
    const ctaRef = useRef<HTMLElement>(null);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="relative min-h-screen bg-[#0E1014] flex flex-col overflow-hidden page-dividers">

            {/* ── Hero ─────────────────────────────────────────── */}
            <section
                data-hero
                className="relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:min-h-0 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                >
                                        <h1 className="display-hero-title max-w-4xl text-center">
                        <span className="display-muted-line">Most agencies build assets.</span>
                        <span className="display-strong-line">We build advantage.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        Every business has hidden inefficiencies, disconnected systems, and untapped leverage
                        that limit its ability to operate and scale effectively. We help you identify them and
                        engineer smarter ways to operate.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-5 py-3 rounded-full text-sm font-semibold text-white cursor-pointer"
                            data-cta="primary"
                        >
                            Book a Consultation Call
                        </button>
                    </div>
                </motion.div>

                <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.35), transparent)" }}
                />
                <HeroHorizon intensity="strong" />
            </section>

            {/* ── Who We Are ───────────────────────────────────── */}
            <section className="relative w-full px-6 py-16 md:py-24 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 60% at 15% 50%, rgba(123,85,234,0.07) 0%, transparent 65%)",
                        "radial-gradient(ellipse 40% 50% at 85% 50%, rgba(0,255,221,0.04) 0%, transparent 65%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto w-full max-w-6xl">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-20 md:items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-5"
                        >
                            <SectionLabelSide />
                            <h2 className="display-section-title">
                                <span className="display-muted-line">Intelligence,</span>
                                <span className="display-strong-line">built in.</span>
                            </h2>
                            <p className="text-lead text-white/55">
                                We founded Levata to help businesses transition into a new era of operation, where
                                AI, automation, and intelligent layers are embedded into the foundation of how
                                companies operate, grow, and scale.
                            </p>
                            <p className="text-lead text-white/55">
                                Our approach focuses on building connected systems that improve operations, support
                                scale, and drive measurable business growth instead of relying on fragmented tools
                                or short-term solutions.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-2xl p-7 md:p-9"
                            style={{
                                background: "var(--home-card-bg)",
                                border: "1px solid var(--home-card-border)",
                            }}
                        >
                            <p className="text-eyebrow text-white/35 mb-5">Our vision</p>
                            <p className="display-quote text-white/90">
                                To help businesses unlock scalable growth through intelligent infrastructure.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Team ─────────────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-16 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(123, 85, 234,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 40% at 80% 20%, rgba(123, 85, 234,0.05) 0%, transparent 60%)",
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
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The people building</span>
                            <span className="display-strong-line">what&apos;s next.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/45">
                            Bringing together strategy, technology, and operational thinking to help businesses
                            build what comes next.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
                                        background: "radial-gradient(circle, rgba(123, 85, 234,0.08) 0%, rgba(8,1,28,0.5) 70%)",
                                    }}
                                >
                                    <span className="display-feature-title text-white/85">
                                        {initialsFrom(name)}
                                    </span>
                                </div>
                                <p className="mt-6 display-card-title">{name}</p>
                                <p className="mt-1 text-eyebrow text-white/45">{role}</p>
                                {bio && (
                                    <p className="mt-3 max-w-xs text-body-sm text-white/55">{bio}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Clients Choose Us ────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-16 md:py-24">
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{
                    background: [
                        "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(123, 85, 234,0.08) 0%, transparent 70%)",
                        "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(123, 85, 234,0.06) 0%, transparent 60%)",
                    ].join(", "),
                }} />
                <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-bg" />

                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center text-center gap-4"
                    >
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Four reasons we earn</span>
                            <span className="display-strong-line">long-term partnerships.</span>
                        </h2>
                    </motion.div>

                    <div className="relative mx-auto max-w-3xl">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute left-[27px] top-4 bottom-4 hidden md:block"
                            style={{
                                width: "1px",
                                background:
                                    "linear-gradient(to bottom, transparent, rgba(123,85,234,0.45) 12%, rgba(123,85,234,0.45) 88%, transparent)",
                            }}
                        />
                        <div className="flex flex-col gap-6">
                            {WHY_ITEMS.map(({ Icon, title, body }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative flex items-start gap-5 md:gap-7"
                                >
                                    <div
                                        className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                                        style={{
                                            background: "rgba(23,26,34,0.98)",
                                            border: "1.5px solid rgba(123,85,234,0.65)",
                                            boxShadow: "0 0 0 6px #0E1014, 0 0 22px rgba(123,85,234,0.22)",
                                        }}
                                    >
                                        <span className="text-sm font-bold tracking-tight text-white md:text-base">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-1 flex-col gap-3 rounded-2xl p-6 md:flex-row md:items-center md:gap-7 md:p-7"
                                        style={{
                                            background: "rgba(23,26,34,0.92)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <Icon />
                                        </div>
                                        <div className="flex flex-col gap-2 md:gap-2.5">
                                            <h3 className="display-card-title">
                                                {title}
                                            </h3>
                                            <p className="text-body-sm text-white/55">{body}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Final CTA ────────────────────────────────────── */}
            <section ref={ctaRef} className="relative w-full px-6 py-20 md:py-28 overflow-hidden">
                <CTAAurora variant={3} />
                <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.4), transparent)" }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto max-w-3xl flex flex-col items-center text-center gap-8"
                >
                                        <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Build the infrastructure</span>
                        <span className="display-strong-line">your business deserves.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/50">
                        Discover what becomes possible when intelligence is built into the foundation of your
                        business. If you&apos;re ready to improve the way your business operates and scales,
                        we&apos;re ready to talk.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
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

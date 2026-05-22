"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import dynamic from "next/dynamic";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

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
                className="relative flex flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-28 text-center sm:px-6 md:pb-[100px] md:pt-[150px]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                >
                    <SectionLabel text="About Levata" />
                    <h1 className="display-hero-title max-w-4xl text-center">
                        <span className="display-muted-line">We&apos;re not a digital agency.</span>
                        <span className="display-strong-line">We&apos;re an intelligence partner.</span>
                    </h1>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-[1.05rem]">
                        Levata builds AI-powered systems that help businesses move faster, decide smarter, and
                        compete at a level that wasn&apos;t possible before.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-5 py-3 rounded-full text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #7B55EA 0%, #22D3EE 100%)" }}
                        >
                            Book a Strategy Call
                        </button>
                    </div>
                </motion.div>

                <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-32"
                    style={{ background: "linear-gradient(to right, transparent, rgba(123, 85, 234,0.35), transparent)" }}
                />
                <HeroHorizon />
            </section>

            {/* ── Who We Are ───────────────────────────────────── */}
            <section className="relative w-full px-6 py-16 md:py-20 overflow-hidden">
                <div aria-hidden className="pointer-events-none absolute z-0" style={{
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    width: "120vw", height: "500px",
                    background: [
                        "radial-gradient(ellipse 30% 60% at 20% 50%, rgba(123, 85, 234,0.07) 0%, transparent 70%)",
                        "radial-gradient(ellipse 30% 60% at 80% 50%, rgba(123, 85, 234,0.06) 0%, transparent 70%)",
                    ].join(", "),
                }} />

                <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center text-center gap-5"
                    >
                        <SectionLabel text="Who we are" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Building the</span>
                            <span className="display-strong-line">AI-native operations layer.</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-8 max-w-2xl text-center text-base leading-relaxed text-white/55 md:text-[1.05rem]"
                    >
                        We founded Levata to close the gap between powerful AI technology and the businesses
                        that need it most. Not through software subscriptions or one-off projects, but as a
                        genuine systems partner with end-to-end accountability for every outcome we promise.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 w-full max-w-2xl rounded-2xl p-px"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(123, 85, 234,0.35) 0%, rgba(255,255,255,0.06) 50%, rgba(123, 85, 234,0.35) 100%)",
                        }}
                    >
                        <div
                            className="relative flex flex-col items-center rounded-[15px] p-7 text-center md:p-8"
                            style={{
                                background: "rgba(23,26,34,0.98)",
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
                        <SectionLabel text="The team" />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">The people behind</span>
                            <span className="display-strong-line">the partnership.</span>
                        </h2>
                        <p className="max-w-xl text-base text-white/45 leading-relaxed md:text-[1.05rem]">
                            A focused team of strategists, engineers, and AI specialists obsessed with shipping
                            outcomes, not deliverables.
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
                                    <span className="text-2xl font-bold tracking-tight text-white/85 md:text-3xl">
                                        {initialsFrom(name)}
                                    </span>
                                </div>
                                <p className="mt-6 text-lg font-bold text-white md:text-xl">{name}</p>
                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{role}</p>
                                {bio && (
                                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{bio}</p>
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

                <div className="relative z-10 mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-12 flex flex-col items-center text-center gap-4"
                    >
                        <SectionLabel text="Why clients choose us" />
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
                                            <h3 className="text-lg font-bold leading-snug tracking-tight text-white md:text-xl">
                                                {title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-white/55 md:text-[15px]">{body}</p>
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
                <CTAAurora />
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
                    <SectionLabel text="Work with us" />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Build the infrastructure</span>
                        <span className="display-strong-line">your business deserves.</span>
                    </h2>
                    <p className="max-w-md text-base text-white/50 leading-relaxed">
                        No pitch. No pressure. Just clarity on what&apos;s possible.
                    </p>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={openBookCall}
                            className="relative px-4 py-2 rounded-full sm:px-6 sm:py-3 text-sm font-semibold text-white transition-opacity duration-200 cursor-pointer hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #7B55EA 0%, #22D3EE 100%)" }}
                        >
                            Book a Free Strategy Call
                        </button>

                    </div>
                </motion.div>
            </section>
        </main>
    );
}

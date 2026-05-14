"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button as NeonButton } from "@/app/components/ui/neon-button";
import PageArcs from "@/app/components/PageArcs";

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

// ── Why-choose icons (4 selected from the original 6) ──────────────────────
function IconAINative() {
    return (
        <svg width="60" height="54" viewBox="0 0 60 54" fill="none" aria-hidden>
            <defs>
                <linearGradient id="aw-a" x1="14" y1="11" x2="46" y2="43" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#72C8F5" /><stop offset="1" stopColor="#BB00FF" />
                </linearGradient>
            </defs>
            <path d="M30 11 L30 43 M14 27 L46 27 M18.7 15.7 L41.3 38.3 M41.3 15.7 L18.7 38.3" stroke="url(#aw-a)" strokeWidth="3.5" strokeLinecap="square" />
        </svg>
    );
}
function IconEndToEnd() {
    return (
        <svg width="60" height="54" viewBox="0 0 60 54" fill="none" aria-hidden>
            <defs>
                <linearGradient id="aw-b" x1="10" y1="7" x2="50" y2="47" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#72C8F5" /><stop offset="1" stopColor="#BB00FF" />
                </linearGradient>
            </defs>
            <circle cx="30" cy="27" r="20" stroke="url(#aw-b)" strokeWidth="2" />
            <circle cx="30" cy="27" r="11" stroke="url(#aw-b)" strokeWidth="2" />
            <circle cx="30" cy="27" r="4" fill="url(#aw-b)" />
        </svg>
    );
}
function IconContinuous() {
    return (
        <svg width="60" height="54" viewBox="0 0 60 54" fill="none" aria-hidden>
            <defs>
                <linearGradient id="aw-c" x1="11" y1="7" x2="49" y2="47" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#72C8F5" /><stop offset="1" stopColor="#BB00FF" />
                </linearGradient>
            </defs>
            <path d="M11 7 C20 7 25 20 30 27 C35 20 40 7 49 7" stroke="url(#aw-c)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M11 47 C20 47 25 34 30 27 C35 34 40 47 49 47" stroke="url(#aw-c)" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    );
}
function IconOutcomes() {
    return (
        <svg width="60" height="54" viewBox="0 0 60 54" fill="none" aria-hidden>
            <defs>
                <linearGradient id="aw-d" x1="9" y1="12" x2="51" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#72C8F5" /><stop offset="1" stopColor="#BB00FF" />
                </linearGradient>
            </defs>
            <rect x="9" y="12" width="5.5" height="30" rx="2.75" fill="url(#aw-d)" />
            <rect x="19" y="18" width="5.5" height="18" rx="2.75" fill="url(#aw-d)" />
            <rect x="29" y="23" width="5.5" height="8" rx="2.75" fill="url(#aw-d)" />
            <path d="M43 22 L51 27 L43 32" stroke="url(#aw-d)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const WHY_ITEMS = [
    {
        Icon: IconAINative,
        title: "AI-native from the ground up",
        body: "Every system we ship is designed with AI at its core — not bolted on later.",
    },
    {
        Icon: IconEndToEnd,
        title: "End-to-end under one roof",
        body: "Strategy, design, engineering, automation, and growth — coordinated under one accountable team.",
    },
    {
        Icon: IconContinuous,
        title: "Continuous partnership model",
        body: "We don't disappear after launch. We measure, iterate, and compound results month over month.",
    },
    {
        Icon: IconOutcomes,
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

    return (
        <main className="relative min-h-screen bg-[#07001F] flex flex-col overflow-hidden">
            <PageArcs />

            {/* ── Hero ─────────────────────────────────────────── */}
            <section
                data-hero
                className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
                style={{ paddingTop: "150px", paddingBottom: "100px" }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto"
                >
                    <SectionLabel text="About Levata" />
                    <h1
                        className="text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.25rem] md:text-[2.7rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        We&apos;re Not a Digital Agency.<br />
                        We&apos;re an Intelligence Partner.
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        Levata builds AI-powered systems that help businesses move faster, decide smarter, and
                        compete at a level that wasn&apos;t possible before.
                    </p>
                    <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Book a Strategy Call
                            </NeonButton>
                        </a>
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

                <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_1.9fr] md:gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-4"
                    >
                        <SectionLabel text="Who we are" />
                        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-tight">
                            Building the AI-native<br />operations layer.
                        </h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-6"
                    >
                        <p className="text-base leading-relaxed text-white/60 md:text-lg">
                            We founded Levata to close the gap between powerful AI technology and the businesses
                            that need it most. Not through software subscriptions or one-off projects — but as a
                            genuine systems partner with end-to-end accountability for every outcome we promise.
                        </p>

                        <div
                            className="relative rounded-2xl p-px"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(114,200,245,0.35) 0%, rgba(255,255,255,0.06) 50%, rgba(155,47,255,0.35) 100%)",
                            }}
                        >
                            <div
                                className="relative rounded-[15px] p-7"
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
                        className="mb-12 flex flex-col gap-4"
                    >
                        <SectionLabel text="The team" />
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-tight">
                            The people behind the partnership.
                        </h2>
                        <p className="max-w-md text-sm text-white/45 leading-relaxed">
                            A focused team of strategists, engineers, and AI specialists obsessed with shipping
                            outcomes — not deliverables.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {TEAM.map(({ name, role, bio }, i) => (
                            <motion.div
                                key={name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <div
                                    className="relative flex items-end justify-center overflow-hidden"
                                    style={{
                                        height: 320,
                                        background: "linear-gradient(180deg, #0a0118 0%, #12002e 100%)",
                                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(155,47,255,0.14) 0%, transparent 70%)" }} />
                                    <svg aria-hidden viewBox="0 0 120 160" fill="none" className="relative z-10 w-40 opacity-20">
                                        <ellipse cx="60" cy="42" rx="24" ry="24" fill="white" />
                                        <path d="M10 160 C10 110 30 90 60 90 C90 90 110 110 110 160Z" fill="white" />
                                    </svg>
                                </div>
                                <div className="px-6 py-5">
                                    <p className="text-base font-bold text-white">{name}</p>
                                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{role}</p>
                                    <p className="mt-3 text-sm leading-relaxed text-white/50">{bio}</p>
                                </div>
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

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {WHY_ITEMS.map(({ Icon, title, body }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.6, delay: (i % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                className="group flex items-start gap-5 rounded-2xl p-6 transition-colors duration-500"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <span
                                    className="flex-shrink-0 transition-all duration-500 group-hover:drop-shadow-[0_0_22px_rgba(114,200,245,0.65)]"
                                    style={{ opacity: 0.92 }}
                                >
                                    <Icon />
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold leading-snug text-white md:text-xl">{title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/50">{body}</p>
                                </div>
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
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Book a Free Strategy Call
                            </NeonButton>
                        </a>
                        <a href="/#services">
                            <NeonButton variant="ghost" size="lg" className="font-semibold tracking-wide">
                                Explore Our Services
                            </NeonButton>
                        </a>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}

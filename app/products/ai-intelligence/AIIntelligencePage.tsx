"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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

// ── Content ────────────────────────────────────────────────────────────────
const CAPABILITIES = [
    {
        accent: "#9B2FFF",
        title: "AI Integration & Assistants",
        description:
            "Deploy custom AI assistants and integrate large language models into your existing workflows, customer touchpoints, and internal tools — without rebuilding your stack.",
        bullets: [
            "Custom chatbots and AI assistants for internal use",
            "LLM integration into existing platforms and tools",
            "AI-augmented customer support and sales workflows",
            "Context-aware API design and response systems",
        ],
    },
    {
        accent: "#72C8F5",
        title: "Custom Model Deployment",
        description:
            "Fine-tuned models and purpose-built AI pipelines deployed to your exact specification — on your infrastructure or ours.",
        bullets: [
            "Fine-tuning on proprietary business data",
            "RAG pipelines for document-aware AI",
            "Private deployment on cloud or on-premise",
            "Model evaluation, monitoring, and versioning",
        ],
    },
    {
        accent: "#3DFD98",
        title: "Intelligent Automation",
        description:
            "Replace manual, repetitive operations with end-to-end AI-driven processes that learn, adapt, and improve over time.",
        bullets: [
            "Workflow automation with AI decision-making",
            "Real-time data enrichment and classification",
            "AI-powered reporting and business intelligence",
            "Systems that scale without adding headcount",
        ],
    },
];

const SIP_FEATURES = [
    "AI-powered prospect research in seconds",
    "Lead scoring & ICP prioritization",
    "Personalized email & call script generation",
    "CRM sync & full pipeline visibility",
];

const AUDIENCE = [
    "B2B sales teams automating prospect research and outreach",
    "Operations leaders eliminating manual reporting and approvals",
    "Founders building AI-native products from the ground up",
    "Product teams shipping intelligent features fast",
    "Agencies running AI workflows for multiple clients",
    "Businesses outgrowing spreadsheets and manual processes",
];

// ── Page ──────────────────────────────────────────────────────────────────
export default function AIIntelligencePage() {
    return (
        <main className="relative min-h-screen bg-[#07001F] overflow-hidden">
            <PageArcs />

            {/* ── 1. HERO ───────────────────────────────────────── */}
            <section
                data-hero
                className="relative flex flex-col items-center justify-center overflow-hidden px-6 text-center"
                style={{
                    paddingTop: "clamp(100px, calc(72px + 9.5vw + 20px), 200px)",
                    paddingBottom: "clamp(60px, 8vw, 120px)",
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <SectionLabel text="AI & Intelligence" />
                    <h1
                        className="text-balance text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.02em] text-white sm:text-[2.25rem] md:text-[2.7rem] lg:text-[3rem]"
                        style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif" }}
                    >
                        Build the Intelligence Layer Your Business Deserves.
                    </h1>
                    <p className="max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
                        From AI integration and custom model deployment to intelligent automation — Levata designs
                        AI systems that compound in value over time.
                    </p>
                    <div className="mt-2">
                        <a href="/contact">
                            <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                                Book a Strategy Call
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

            {/* ── 2. CAPABILITIES ───────────────────────────────── */}
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
                        <SectionLabel text="Capabilities" />
                        <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Three ways we deploy AI into your business.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {CAPABILITIES.map((cap, i) => (
                            <motion.div
                                key={cap.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-2xl p-px"
                                style={{
                                    background: `linear-gradient(160deg, ${cap.accent}33 0%, rgba(255,255,255,0.05) 60%)`,
                                }}
                            >
                                <div
                                    className="flex h-full flex-col gap-5 rounded-[15px] p-7"
                                    style={{ background: "rgba(8,1,28,0.98)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{ background: `${cap.accent}1A`, border: `1px solid ${cap.accent}55` }}
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{ background: cap.accent, boxShadow: `0 0 12px ${cap.accent}` }}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold leading-snug tracking-tight text-white">
                                        {cap.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/55">{cap.description}</p>
                                    <ul className="mt-auto flex flex-col gap-2.5">
                                        {cap.bullets.map((b) => (
                                            <li key={b} className="flex items-start gap-3 text-sm text-white/75">
                                                <span
                                                    className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rotate-45"
                                                    style={{ background: cap.accent }}
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

            {/* ── 3. FEATURED PRODUCT — Sales Intelligence Platform ── */}
            <section className="relative w-full px-6 py-16 md:py-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(155,47,255,0.09) 0%, transparent 65%)",
                    }}
                />
                <div className="relative z-10 mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-10 flex flex-col items-center gap-4 text-center"
                    >
                        <SectionLabel text="Featured product" />
                        <h2 className="max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-4xl">
                            Our flagship AI product.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-3xl p-px"
                        style={{
                            background:
                                "linear-gradient(105deg, rgba(114,200,245,0.35) 0%, rgba(255,255,255,0.06) 50%, rgba(155,47,255,0.35) 100%)",
                            boxShadow: "-8px 0 40px rgba(114,200,245,0.08), 8px 0 40px rgba(155,47,255,0.08)",
                        }}
                    >
                        <div
                            className="flex flex-col gap-7 rounded-3xl p-8 md:flex-row md:items-center md:gap-12 md:p-12"
                            style={{ background: "rgba(6,0,20,0.98)" }}
                        >
                            <div className="flex flex-col gap-5 flex-1">
                                <span
                                    className="w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                                    style={{
                                        background: "rgba(155,47,255,0.08)",
                                        color: "rgba(155,47,255,0.8)",
                                        border: "1px solid rgba(155,47,255,0.22)",
                                    }}
                                >
                                    Sales Intelligence Platform
                                </span>
                                <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl leading-tight">
                                    AI Sales Workspace for B2B Teams.
                                </h3>
                                <p className="text-sm leading-relaxed text-white/55 md:text-base max-w-lg">
                                    Turn your raw lead list into a researched, prioritized, and actionable pipeline — in
                                    hours, not days. The only AI workspace built for B2B outbound from the ground up.
                                </p>
                                <ul className="flex flex-col gap-2.5">
                                    {SIP_FEATURES.map((f) => (
                                        <li key={f} className="flex items-start gap-3 text-sm text-white/65">
                                            <span
                                                className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: "rgba(114,200,245,0.15)",
                                                    border: "1px solid rgba(114,200,245,0.3)",
                                                }}
                                            >
                                                <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" aria-hidden>
                                                    <path
                                                        d="M2 5l2.5 2.5L8 3"
                                                        stroke="#72C8F5"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>
                                            <span className="leading-snug">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/products/sales-intelligence-platform" className="mt-2 w-fit">
                                    <NeonButton variant="solid" size="default" className="font-semibold tracking-wide">
                                        Explore the Platform
                                    </NeonButton>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 4. WHO IT'S FOR ───────────────────────────────── */}
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
                            Built for teams that run on intelligence.
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
                                        background: "rgba(155,47,255,0.12)",
                                        border: "1px solid rgba(155,47,255,0.3)",
                                    }}
                                >
                                    <svg viewBox="0 0 10 10" fill="none" className="h-3 w-3" aria-hidden>
                                        <path
                                            d="M2 5l2.5 2.5L8 3"
                                            stroke="#9B2FFF"
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

            {/* ── 5. FINAL CTA ──────────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-6 py-24 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(155,47,255,0.18) 0%, transparent 65%)",
                            "radial-gradient(ellipse 40% 50% at 20% 0%, rgba(114,200,245,0.1) 0%, transparent 60%)",
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
                    <SectionLabel text="Let's build" />
                    <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-4xl lg:text-[2.8rem]">
                        Your intelligence layer starts with a conversation.
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
                        Tell us about your business. We&apos;ll map the highest-leverage AI opportunities and show
                        you exactly how to capture them.
                    </p>
                    <a href="/contact">
                        <NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">
                            Book a Free Strategy Call
                        </NeonButton>
                    </a>
                </motion.div>
            </section>
        </main>
    );
}

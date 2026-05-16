"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Step data ──────────────────────────────────────────────────────────────

interface Step {
    num: string;
    accent: string;
    accentRgb: string;
    label: string;
    description: string;
    bullets: string[];
    result: string;
}

const STEPS: Step[] = [
    {
        num: "01",
        accent: "#9B2FFF",
        accentRgb: "155,47,255",
        label: "Discovery & Audit",
        description: "Before we write a single line of code, we audit your systems, data flows, and commercial model to find the highest-leverage AI and automation opportunities.",
        bullets: [
            "Map your business model, data flows, and existing systems",
            "Identify highest-leverage AI and automation opportunities",
            "Align technical capability with your commercial goals",
        ],
        result: "A clear opportunity map and prioritised roadmap — before a single line of code is written.",
    },
    {
        num: "02",
        accent: "#72C8F5",
        accentRgb: "114,200,245",
        label: "Architecture & Strategy",
        description: "We design the architecture: how every system connects, where data flows, and which KPIs prove the strategy is working.",
        bullets: [
            "Design your custom AI ecosystem and integration architecture",
            "Define measurable KPIs and success criteria for each initiative",
            "Validate the roadmap against real business constraints",
        ],
        result: "A battle-tested blueprint your team can execute against with full confidence.",
    },
    {
        num: "03",
        accent: "#3DFD98",
        accentRgb: "61,253,152",
        label: "Build, Launch & Optimise",
        description: "We ship in focused sprints, launch with full support, and measure everything — so your system gets smarter and more valuable over time.",
        bullets: [
            "Ship in focused engineering sprints with full progress visibility",
            "Managed launch with onboarding, documentation, and support",
            "Continuous iteration: measure results and compound improvements",
        ],
        result: "A system that keeps getting smarter — delivering increasing ROI month over month.",
    },
];

// ── Step card (plain text, no visuals) ───────────────────────────────────

function StepCard({ step }: { step: Step }) {
    return (
        <div
            className="flex flex-col gap-6 rounded-2xl p-8 md:p-10"
            style={{
                background: "rgba(8,1,28,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "#72C8F5" }} />
                <span
                    className="text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: "#72C8F5" }}
                >
                    Phase {step.num} — {step.label}
                </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">{step.description}</p>
            <ul className="flex flex-col gap-3">
                {step.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-white/70 md:text-[15px]">
                        <span
                            className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                            style={{ background: "#72C8F5", opacity: 0.7 }}
                        />
                        {b}
                    </li>
                ))}
            </ul>
            <div
                className="rounded-xl px-4 py-3"
                style={{
                    background: "rgba(114,200,245,0.05)",
                    border: "1px solid rgba(114,200,245,0.14)",
                }}
            >
                <p className="text-xs leading-relaxed text-white/50">
                    <span className="font-semibold text-white/75">Result: </span>{step.result}
                </p>
            </div>
        </div>
    );
}

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

// ── Main component ─────────────────────────────────────────────────────────

export default function ProcessTabsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const step = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length));
        setActiveStep(step);
    });

    return (
        <section id="process" className="relative w-full">
            {/* ── Desktop sticky scroll (lg+) ─────────────────────────── */}
            <div ref={containerRef} className="relative hidden lg:block" style={{ height: "300vh" }}>
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: [
                            "radial-gradient(ellipse 50% 70% at 15% 40%, rgba(155,47,255,0.07) 0%, transparent 65%)",
                            "radial-gradient(ellipse 45% 55% at 85% 60%, rgba(114,200,245,0.05) 0%, transparent 65%)",
                        ].join(", "),
                    }}
                />

                <div className="sticky top-0 h-screen overflow-hidden">
                    <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-10 px-10 xl:px-16">

                        {/* ── Left panel ── */}
                        <div className="flex w-[42%] flex-col gap-8">
                            <SectionLabel text="How we work" />
                            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-4xl">
                                From strategy to<br />compounding success.
                            </h2>
                            <p className="text-base leading-relaxed text-white/50 xl:text-[1.05rem]">
                                A repeatable system that turns strategic clarity into measurable outcomes — fast.
                            </p>
                            {/* Step progress */}
                            <div className="flex flex-col gap-3">
                                {STEPS.map((s, i) => (
                                    <div key={s.num} className="flex items-center gap-3">
                                        <div
                                            className="h-0.5 rounded-full transition-all duration-500"
                                            style={{
                                                width: i === activeStep ? 32 : 16,
                                                background: i === activeStep ? "#3DFD98" : "rgba(255,255,255,0.12)",
                                            }}
                                        />
                                        <span
                                            className="text-xs font-medium transition-colors duration-500"
                                            style={{ color: i === activeStep ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.22)" }}
                                        >
                                            {s.num} — {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right panel — one card at a time ── */}
                        <div className="flex w-[58%] items-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, y: 32 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.55, ease: EASE }}
                                    className="w-full"
                                >
                                    <StepCard step={STEPS[activeStep]} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Mobile / tablet fallback (<lg) ─────────────────────────── */}
            <div className="relative px-6 py-20 lg:hidden">
                <div className="pointer-events-none absolute inset-0" style={{ background: ["radial-gradient(ellipse 40% 60% at 20% 30%, rgba(155,47,255,0.06) 0%, transparent 70%)", "radial-gradient(ellipse 40% 50% at 80% 70%, rgba(114,200,245,0.05) 0%, transparent 70%)"].join(", ") }} />
                <div className="relative mx-auto max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mb-12 flex flex-col items-center gap-4 text-center"
                    >
                        <SectionLabel text="How we work" />
                        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white leading-[1.1]">From strategy to compounding success.</h2>
                        <p className="max-w-xl text-base leading-relaxed text-white/50">A repeatable system that turns strategic clarity into measurable outcomes — fast.</p>
                    </motion.div>

                    <div className="relative">
                        <div className="pointer-events-none absolute left-6 top-8 bottom-8 w-px" style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.15) 12%, rgba(255,255,255,0.15) 88%, transparent 100%)" }} />
                        <div className="flex flex-col gap-12">
                            {STEPS.map((step, i) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                                    className="relative flex items-start gap-6"
                                >
                                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(8,1,28,0.95)", border: "1px solid #3DFD9880", boxShadow: "0 0 0 6px rgba(7,0,31,1), 0 0 20px #3DFD9825" }}>
                                        <span className="text-sm font-extrabold" style={{ color: "#3DFD98" }}>{step.num}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-4 pt-1">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Phase {step.num}</span>
                                            <h3 className="mt-1 text-xl font-bold leading-tight tracking-tight text-white">{step.label}</h3>
                                        </div>
                                        <ul className="flex flex-col gap-2.5">
                                            {step.bullets.map((b) => (
                                                <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-white/60">
                                                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "rgba(255,255,255,0.45)" }} />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="rounded-lg px-4 py-3 text-sm leading-relaxed text-white/50" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <span className="font-semibold text-white/75">Result: </span>{step.result}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

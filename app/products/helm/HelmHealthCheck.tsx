"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE, HEALTH_AREAS, HELM_START_URL, MONO, tint } from "./helmData";

const ANSWERS = ["Never", "Rarely", "Partly", "Mostly", "Always"] as const;
const SCORES = [15, 35, 55, 75, 95];

const QUESTIONS: Record<(typeof HEALTH_AREAS)[number]["key"], { q: string; fix: string; module: string }> = {
    vision: { q: "Would every leader describe where we're heading in the same words?", module: "Vision Canvas", fix: "Put your values, focus, long-term target and this year's plan on one page everyone signs up to." },
    people: { q: "Is every key role owned by one person who fits our values?", module: "Seat Map + People Lens", fix: "Map every seat to one owner, then check each person against your values and the role." },
    numbers: { q: "Do we review the same handful of numbers every week?", module: "Scorecard", fix: "Pick 5 to 15 numbers with owners and goals. Anything off target turns red before it turns into a crisis." },
    issues: { q: "Do problems get solved for good, not just discussed?", module: "Issues + To-dos", fix: "Keep one ranked issues list and solve the top three each week with a guided method and 7-day to-dos." },
    process: { q: "Are our core processes written down and actually followed?", module: "Playbook", fix: "Write each core process as simple steps with an owner, so the way you work stops living in people's heads." },
    rhythm: { q: "Do we meet weekly and reset priorities every 90 days?", module: "Pulse Meeting", fix: "Run the same 90-minute Monday meeting and reset three to seven priorities per leader every quarter." },
};

// Radar geometry
const SIZE = 340;
const C = SIZE / 2;
const R = 108;
const angle = (i: number) => (-90 + i * (360 / HEALTH_AREAS.length)) * (Math.PI / 180);
const pt = (i: number, v: number) => [C + Math.cos(angle(i)) * R * (v / 100), C + Math.sin(angle(i)) * R * (v / 100)] as const;
const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).map((n) => n.toFixed(1)).join(",")).join(" ");

export default function HelmHealthCheck() {
    const [answers, setAnswers] = useState<number[]>([3, 2, 3, 1, 1, 2]);
    const [hover, setHover] = useState<number | null>(null);

    const scores = answers.map((a) => SCORES[a]);
    const overall = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
    const lowest = scores.indexOf(Math.min(...scores));
    const lowestArea = HEALTH_AREAS[lowest];
    const rec = QUESTIONS[lowestArea.key];

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8" data-no-reveal>
            {/* Questions */}
            <ol className="flex flex-col gap-2.5">
                {HEALTH_AREAS.map((area, i) => {
                    const active = hover === i;
                    return (
                        <li
                            key={area.key}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}
                            className="rounded-2xl p-4 transition-colors duration-200 sm:p-5"
                            style={{
                                background: "var(--home-card-bg)",
                                border: `1px solid ${active ? "rgba(255,255,255,0.16)" : "var(--home-card-border)"}`,
                            }}
                        >
                            <div className="mb-3 flex items-start gap-3">
                                <span className="mt-0.5 text-[10px] font-semibold tabular-nums tracking-[0.16em] text-white/35" style={{ fontFamily: MONO }}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-eyebrow text-white/40">{area.label}</p>
                                    <p className="mt-1 text-body-sm text-white/80">{QUESTIONS[area.key].q}</p>
                                </div>
                            </div>
                            <div role="radiogroup" aria-label={QUESTIONS[area.key].q} className="grid grid-cols-5 gap-1">
                                {ANSWERS.map((label, a) => {
                                    const selected = answers[i] === a;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            role="radio"
                                            aria-checked={selected}
                                            onClick={() => setAnswers((prev) => prev.map((x, k) => (k === i ? a : x)))}
                                            className="cursor-pointer rounded-lg px-1 py-2 text-[11px] font-medium transition-all duration-200 sm:text-[11px]"
                                            style={{
                                                background: selected ? tint("var(--accent-secondary)", 12) : "rgba(255,255,255,0.02)",
                                                border: `1px solid ${selected ? tint("var(--accent-secondary)", 50) : "rgba(255,255,255,0.06)"}`,
                                                color: selected ? "var(--text-primary)" : "var(--text-muted)",
                                            }}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </li>
                    );
                })}
            </ol>

            {/* Result */}
            <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative overflow-hidden rounded-2xl p-5 sm:p-7" style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" }}>
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tint("var(--accent-secondary)", 40)}, transparent)` }} />
                    <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full" style={{ background: `radial-gradient(circle, ${tint("var(--accent)", 12)} 0%, transparent 70%)` }} />

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <p className="text-eyebrow text-white/40">Your health score</p>
                            <p className="mt-1 flex items-baseline gap-1">
                                <motion.span key={overall} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-thin leading-none tabular-nums text-white" style={{ fontSize: "var(--text-stat)" }}>{overall}</motion.span>
                                <span className="text-body-sm text-white/40">/ 100</span>
                            </p>
                        </div>
                        <span className="mt-1 hidden rounded-full px-2.5 py-1 text-[10px] text-white/50 sm:inline-flex" style={{ border: "1px solid rgba(255,255,255,0.1)", fontFamily: MONO }}>
                            6 of 20 questions
                        </span>
                    </div>

                    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative mx-auto my-2 w-full max-w-[340px]" role="img"
                        aria-label={`Health by area: ${HEALTH_AREAS.map((a, i) => `${a.label} ${scores[i]}`).join(", ")}`}>
                        {[25, 50, 75, 100].map((ring) => (
                            <polygon key={ring} points={poly(HEALTH_AREAS.map(() => ring))} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                        ))}
                        {HEALTH_AREAS.map((a, i) => {
                            const [x, y] = pt(i, 100);
                            return <line key={a.key} x1={C} y1={C} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
                        })}
                        <motion.polygon
                            initial={false}
                            animate={{ points: poly(scores) }}
                            transition={{ duration: 0.5, ease: EASE }}
                            fill={tint("var(--accent-secondary)", 14)}
                            stroke="var(--accent-secondary)"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        {HEALTH_AREAS.map((a, i) => {
                            const [x, y] = pt(i, scores[i]);
                            const [lx, ly] = pt(i, 124);
                            const anchor = Math.abs(lx - C) < 4 ? "middle" : lx > C ? "start" : "end";
                            const active = hover === i || (hover === null && i === lowest);
                            return (
                                <g key={a.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-default">
                                    <circle cx={x} cy={y} r="14" fill="transparent" />
                                    <motion.circle
                                        initial={false}
                                        animate={{ cx: x, cy: y, r: active ? 5.5 : 4 }}
                                        transition={{ duration: 0.5, ease: EASE }}
                                        fill={i === lowest ? "var(--status-warn)" : "var(--accent-secondary)"}
                                        stroke="var(--home-card-bg)"
                                        strokeWidth="2"
                                    />
                                    <text x={lx} y={ly - 4} textAnchor={anchor} fontSize="11" fill={active ? "var(--text-primary)" : "var(--text-secondary)"}>{a.label}</text>
                                    <text x={lx} y={ly + 10} textAnchor={anchor} fontSize="10" fill="var(--text-muted)" style={{ fontFamily: MONO }}>{scores[i]}</text>
                                </g>
                            );
                        })}
                    </svg>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={lowestArea.key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.3, ease: EASE }}
                            className="relative rounded-xl p-4"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <p className="flex items-center gap-2 text-eyebrow text-white/45">
                                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--status-warn)" }} />
                                Start here · {lowestArea.label}
                            </p>
                            <p className="mt-2 display-card-title">{rec.module}</p>
                            <p className="mt-1.5 text-body-sm text-white/55">{rec.fix}</p>
                        </motion.div>
                    </AnimatePresence>

                    <a
                        href={HELM_START_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative mt-5 inline-flex text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80"
                    >
                        Take the full 20-question Health Check →
                    </a>
                </div>
            </div>
        </div>
    );
}

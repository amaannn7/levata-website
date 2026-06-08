"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;
const RED = "rgba(255,75,75,0.9)";
const RED_DIM = "rgba(255,75,75,0.18)";
const ORANGE = "rgba(255,150,60,0.9)";

// Count-up hook
function useCountUp(target: number, duration: number, inView: boolean, delay = 0) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!inView) return;
        let raf: number;
        let start: number | null = null;
        const t = setTimeout(() => {
            const step = (ts: number) => {
                if (start === null) start = ts;
                const p = Math.min((ts - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                setVal(Math.round(eased * target));
                if (p < 1) raf = requestAnimationFrame(step);
            };
            raf = requestAnimationFrame(step);
        }, delay);
        return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    }, [inView, target, duration, delay]);
    return val;
}

// SVG arc helper
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const toRad = (d: number) => (d - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

// Animated ring
function Ring({ cx, cy, r, pct, color, delay, inView, thickness = 6 }: {
    cx: number; cy: number; r: number; pct: number;
    color: string; delay: number; inView: boolean; thickness?: number;
}) {
    const circumference = 2 * Math.PI * r;
    const dash = circumference * pct;
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        if (!inView) return;
        const t = setTimeout(() => setAnimated(true), delay);
        return () => clearTimeout(t);
    }, [inView, delay]);

    return (
        <g>
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={thickness} />
            {/* Filled arc */}
            <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${animated ? dash : 0} ${circumference}`}
                strokeDashoffset={circumference * 0.25}
                style={{ transition: animated ? `stroke-dasharray 1.4s cubic-bezier(0.25,1,0.5,1) ${delay * 0.001}s` : "none" }}
            />
        </g>
    );
}

export default function OperationsBeforeTerminal() {
    const ref = useRef<HTMLDivElement>(null);
    const observed = useInView(ref, { once: true, margin: "100px" });
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    const inView = observed || forced;

    // Count-ups
    const hoursLost = useCountUp(23, 1600, inView, 300);
    const tasksManual = useCountUp(74, 1400, inView, 500);
    const revenueAt = useCountUp(60, 1800, inView, 700);

    const SIZE = 220;
    const CX = SIZE / 2;
    const CY = SIZE / 2;

    return (
        <div ref={ref} className="flex flex-col gap-5">

            {/* ── Main card ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                    background: "linear-gradient(160deg, rgba(14,12,24,0.98) 0%, rgba(10,8,18,0.99) 100%)",
                    border: "1px solid rgba(255,75,75,0.15)",
                    boxShadow: "0 0 60px rgba(255,50,50,0.06), 0 24px 60px rgba(0,0,0,0.5)",
                }}
            >
                {/* Subtle red ambient */}
                <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,50,50,0.06) 0%, transparent 70%)",
                }} />

                {/* Header */}
                <div className="relative flex items-center justify-between mb-5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30" style={{ fontFamily: MONO }}>
                            Weekly Waste Report
                        </p>
                        <p className="mt-0.5 text-xs text-white/20" style={{ fontFamily: MONO }}>
                            Before Levata
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: RED }}
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                        />
                        <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,75,75,0.7)", letterSpacing: "0.16em" }}>LIVE</span>
                    </div>
                </div>

                {/* Clock rings + center stat */}
                <div className="relative flex items-center justify-center mb-6">
                    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <defs>
                            <filter id="ringGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {/* Outer ring — hours lost */}
                        <g filter="url(#ringGlow)">
                            <Ring cx={CX} cy={CY} r={94} pct={0.64} color={RED} delay={300} inView={inView} thickness={7} />
                        </g>
                        {/* Middle ring — manual tasks */}
                        <g filter="url(#ringGlow)">
                            <Ring cx={CX} cy={CY} r={74} pct={0.74} color={ORANGE} delay={500} inView={inView} thickness={6} />
                        </g>
                        {/* Inner ring — revenue at risk */}
                        <g filter="url(#ringGlow)">
                            <Ring cx={CX} cy={CY} r={54} pct={0.60} color="rgba(255,200,60,0.85)" delay={700} inView={inView} thickness={5} />
                        </g>

                        {/* Center */}
                        <text x={CX} y={CY - 10} textAnchor="middle" fill="rgba(255,75,75,0.95)"
                            style={{ fontFamily: MONO, fontSize: 36, fontWeight: 700 }}>
                            {hoursLost}h
                        </text>
                        <text x={CX} y={CY + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)"
                            style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                            lost per week
                        </text>

                        {/* Tick marks */}
                        {Array.from({ length: 36 }).map((_, i) => {
                            const angle = (i / 36) * 360 - 90;
                            const rad = angle * Math.PI / 180;
                            const inner = 103, outer = i % 3 === 0 ? 110 : 106;
                            return (
                                <line key={i}
                                    x1={CX + inner * Math.cos(rad)} y1={CY + inner * Math.sin(rad)}
                                    x2={CX + outer * Math.cos(rad)} y2={CY + outer * Math.sin(rad)}
                                    stroke="rgba(255,255,255,0.08)" strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Legend rows */}
                <div className="relative flex flex-col gap-3">
                    {[
                        { label: "Hours lost to manual ops", val: `${hoursLost}h / week`, color: RED, pct: 64 },
                        { label: "Tasks done manually", val: `${tasksManual}%`, color: ORANGE, pct: 74 },
                        { label: "Revenue-generating time", val: `${revenueAt}%`, color: "rgba(255,200,60,0.85)", pct: 60 },
                    ].map((row) => (
                        <div key={row.label} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: row.color, boxShadow: `0 0 6px ${row.color}` }} />
                            <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                                <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{row.label}</span>
                                <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, flexShrink: 0 }}>{row.val}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="relative mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,75,75,0.12)" }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,75,75,0.5)", letterSpacing: "0.14em" }}>
                        ✖ COMPOUNDING EVERY WEEK
                    </span>
                    <motion.span
                        style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: "0.14em" }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        WITHOUT AUTOMATION
                    </motion.span>
                </div>
            </motion.div>

            {/* ── Stat pills row ── */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "hrs wasted", val: `${hoursLost}`, sub: "per week", color: RED },
                    { label: "tasks manual", val: `${tasksManual}%`, sub: "no automation", color: ORANGE },
                    { label: "time at risk", val: `${revenueAt}%`, sub: "non-revenue", color: "rgba(255,200,60,0.85)" },
                ].map((s) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="flex flex-col items-center gap-1 rounded-xl p-3 text-center"
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                            {s.val}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>
                            {s.label}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: 8, color: "rgba(255,255,255,0.2)" }}>
                            {s.sub}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

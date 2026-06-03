"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const PURPLE = "rgba(168, 85, 247";
const PURPLE_DEEP = "rgba(124, 58, 237";
const CYAN = "rgba(34, 211, 238";

type LogEntry = { level: "1" | "2"; text: string };

const TOP_LOGS: LogEntry[] = [
    { level: "1", text: "Manual research" },
    { level: "1", text: "Spreadsheet chaos" },
    { level: "1", text: "Manual outreach" },
];

const BOTTOM_LOG: LogEntry = {
    level: "2",
    text: "Team burnout",
};

function LogPill({
    entry,
    delay,
    offset = 0,
}: {
    entry: LogEntry;
    delay: number;
    offset?: number;
}) {
    const isCritical = entry.level === "2";
    const fg = isCritical ? "rgba(255, 92, 92, 0.95)" : "rgba(255, 168, 72, 0.95)";

    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full"
            style={{
                marginLeft: offset,
                padding: "5px 12px 5px 10px",
                background:
                    "linear-gradient(135deg, rgba(20, 20, 24, 0.9) 0%, rgba(14, 14, 18, 0.92) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: `0 4px 16px rgba(7, 8, 15, 0.45), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 24px rgba(255, 255, 255, 0.06)`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
            }}
        >
            <span
                className="text-[10px] font-semibold tabular-nums"
                style={{
                    color: fg,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
            >
                {`{${entry.level}}`}
            </span>
            <span
                className="text-[11.5px] text-white/85"
                style={{ letterSpacing: "0.005em" }}
            >
                {entry.text}
            </span>
        </motion.div>
    );
}

function Orbiter({
    children,
    style,
    delay,
}: {
    children: React.ReactNode;
    style: React.CSSProperties;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="absolute flex items-center justify-center rounded-full"
            style={{
                width: 38,
                height: 38,
                background:
                    "linear-gradient(135deg, rgba(22, 22, 26, 0.92) 0%, rgba(14, 14, 18, 0.92) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow: `0 4px 18px rgba(7, 8, 15, 0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 22px rgba(255, 255, 255, 0.06)`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                ...style,
            }}
        >
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{
                    duration: 4.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

function Laptop() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <svg width="186" height="138" viewBox="0 0 230 170" fill="none">
                <defs>
                    <linearGradient id="opbl_screenFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(24, 24, 28, 0.95)" />
                        <stop offset="100%" stopColor="rgba(14, 14, 18, 0.95)" />
                    </linearGradient>
                    <linearGradient id="opbl_screenStroke" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.32)" />
                        <stop offset="55%" stopColor="rgba(255, 255, 255, 0.10)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.28)" />
                    </linearGradient>
                    <radialGradient id="opbl_screenGlow" cx="0.5" cy="0.5">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.06)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>
                    <radialGradient id="opbl_floor" cx="0.5" cy="0.5">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.14)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>
                </defs>

                {/* Floor glow under laptop */}
                <ellipse cx="115" cy="158" rx="100" ry="9" fill="url(#opbl_floor)" opacity="0.75" />

                {/* Screen body */}
                <rect
                    x="34"
                    y="14"
                    width="162"
                    height="104"
                    rx="10"
                    fill="url(#opbl_screenFill)"
                    stroke="url(#opbl_screenStroke)"
                    strokeWidth="1.3"
                />
                {/* Screen inner bezel + soft glow */}
                <rect
                    x="42"
                    y="22"
                    width="146"
                    height="84"
                    rx="3.5"
                    fill="url(#opbl_screenGlow)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.8"
                />

                {/* Chaotic spreadsheet grid on screen */}
                <g opacity="0.42">
                    <line x1="42" y1="42" x2="188" y2="42" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                    <line x1="42" y1="62" x2="188" y2="62" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                    <line x1="42" y1="84" x2="188" y2="84" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                    <line x1="82" y1="22" x2="82" y2="106" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                    <line x1="122" y1="22" x2="122" y2="106" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                    <line x1="158" y1="22" x2="158" y2="106" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" strokeDasharray="2 2.5" />
                </g>

                {/* Center pulsing alert symbol */}
                <motion.g
                    animate={{ opacity: [0.82, 1, 0.82] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <circle cx="115" cy="64" r="17" stroke="rgba(255, 95, 95, 0.72)" strokeWidth="1.4" fill="rgba(255, 95, 95, 0.08)" />
                    <line x1="115" y1="55" x2="115" y2="66" stroke="rgba(255, 115, 115, 0.95)" strokeWidth="1.7" strokeLinecap="round" />
                    <circle cx="115" cy="71" r="1.3" fill="rgba(255, 115, 115, 0.95)" />
                </motion.g>

                {/* Base / keyboard tray (perspective) */}
                <path
                    d="M16 120 L214 120 L222 144 L8 144 Z"
                    fill="url(#opbl_screenFill)"
                    stroke="url(#opbl_screenStroke)"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                />
                {/* Trackpad slot */}
                <rect x="98" y="127" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.07)" />
            </svg>
        </motion.div>
    );
}

// ── tool glyphs (white-tinted, simple SVG) ─────────────────────────────────
const SpreadsheetGlyph = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" />
        <line x1="3" y1="9" x2="21" y2="9" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
        <line x1="3" y1="15" x2="21" y2="15" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
        <line x1="9" y1="3" x2="9" y2="21" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
        <line x1="15" y1="3" x2="15" y2="21" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
    </svg>
);

const MagnifyGlyph = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1.4" />
        <line x1="16" y1="16" x2="20.5" y2="20.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const ClockGlyph = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" />
        <path d="M12 7 V12 L15.5 14.5" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const MailBrokenGlyph = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="1.6" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" />
        <path d="M3 8 L12 14 L21 8" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" strokeLinejoin="round" />
        <line x1="6" y1="6" x2="18" y2="19" stroke="rgba(255, 95, 95, 0.92)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const DocumentGlyph = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M6 3 H14 L18 7 V21 H6 Z" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M14 3 V7 H18" stroke="rgba(255,255,255,0.82)" strokeWidth="1.3" strokeLinejoin="round" />
        <line x1="8.5" y1="12" x2="15.5" y2="12" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" />
        <line x1="8.5" y1="15" x2="15.5" y2="15" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" />
        <line x1="8.5" y1="18" x2="13" y2="18" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" />
    </svg>
);

function BinaryStrip() {
    return (
        <div
            aria-hidden
            className="pointer-events-none flex flex-col items-center gap-[2px] text-center select-none"
            style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 8.5,
                lineHeight: "12px",
                letterSpacing: "0.18em",
            }}
        >
            <span style={{ color: "rgba(255, 255, 255, 0.32)" }}>01101 01001 11010 00110 10101</span>
            <span style={{ color: "rgba(255, 255, 255, 0.18)" }}>11001 01110 10100 01011 11000</span>
        </div>
    );
}

export default function OperationsBeforeTerminal() {
    const ref = useRef<HTMLDivElement>(null);
    const observed = useInView(ref, { once: true, margin: "200px" });
    // Fallback so the terminal still renders if the observer never fires (iOS Safari).
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    const inView = observed || forced;

    return (
        <div
            ref={ref}
            className="relative w-full"
            style={{ aspectRatio: "6 / 5", minHeight: "clamp(280px, 50vw, 400px)" }}
        >
            {/* ── TOP: floating pills cluster ── */}
            {inView && (
                <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5">
                    <LogPill entry={TOP_LOGS[0]} delay={0.05} offset={0} />
                    <LogPill entry={TOP_LOGS[1]} delay={0.12} offset={-20} />
                    <LogPill entry={TOP_LOGS[2]} delay={0.19} offset={14} />
                </div>
            )}

            {/* ── Connector: gradient beam from pills to laptop ── */}
            {inView && (
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-10"
                    style={{
                        top: 116,
                        width: 1,
                        height: 22,
                        background: `linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)`,
                        transformOrigin: "top center",
                    }}
                    aria-hidden
                />
            )}

            {/* ── CENTER: laptop + orbiting tool icons ── */}
            {inView && (
                <div
                    className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ marginTop: 4 }}
                >
                    <div className="relative">
                        <Laptop />

                        {/* Orbiters around laptop body */}
                        <Orbiter style={{ left: -52, top: 18 }} delay={0.22}>
                            <SpreadsheetGlyph />
                        </Orbiter>
                        <Orbiter style={{ left: -18, top: 76 }} delay={0.28}>
                            <MagnifyGlyph />
                        </Orbiter>
                        <Orbiter style={{ right: -18, top: 76 }} delay={0.32}>
                            <ClockGlyph />
                        </Orbiter>
                        <Orbiter style={{ right: -52, top: 18 }} delay={0.36}>
                            <MailBrokenGlyph />
                        </Orbiter>
                    </div>
                </div>
            )}

            {/* ── Binary trail below laptop ── */}
            {inView && (
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ bottom: 62 }}
                >
                    <BinaryStrip />
                </motion.div>
            )}

            {/* ── BOTTOM: critical severity pill ── */}
            {inView && (
                <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 18 }}>
                    <LogPill entry={BOTTOM_LOG} delay={0.44} />
                </div>
            )}
        </div>
    );
}

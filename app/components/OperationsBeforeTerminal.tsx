"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function OperationsBeforeTerminal() {
    const ref = useRef<HTMLDivElement>(null);
    const observed = useInView(ref, { once: true, margin: "200px" });
    const [forced, setForced] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setForced(true), 600);
        return () => clearTimeout(t);
    }, []);
    const inView = observed || forced;

    const pills = [
        { text: "Manual research", offset: 0, delay: 0.3 },
        { text: "Spreadsheet chaos", offset: -18, delay: 0.42 },
        { text: "Manual outreach", offset: 12, delay: 0.54 },
    ];

    const orbiters = [
        {
            style: { left: -48, top: 12 }, delay: 0.45,
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                <line x1="3" y1="9" x2="21" y2="9" stroke="rgba(255,75,75,0.6)" strokeWidth="1" />
                <line x1="3" y1="15" x2="21" y2="15" stroke="rgba(255,75,75,0.6)" strokeWidth="1" />
                <line x1="9" y1="3" x2="9" y2="21" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="15" y1="3" x2="15" y2="21" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            </svg>,
        },
        {
            style: { left: -16, top: 72 }, delay: 0.55,
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" />
                <line x1="16" y1="16" x2="20.5" y2="20.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>,
        },
        {
            style: { right: -16, top: 72 }, delay: 0.62,
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                <path d="M12 7 V12 L15.5 14.5" stroke="rgba(255,120,60,0.9)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>,
        },
        {
            style: { right: -48, top: 12 }, delay: 0.7,
            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="13" rx="1.6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                <path d="M3 8 L12 14 L21 8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinejoin="round" />
                <line x1="6" y1="6" x2="18" y2="19" stroke="rgba(255,75,75,0.9)" strokeWidth="1.3" strokeLinecap="round" />
            </svg>,
        },
    ];

    return (
        <div
            ref={ref}
            className="relative w-full flex items-center justify-center"
            style={{ minHeight: 320 }}
        >
            {inView && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="relative"
                    style={{ width: 200 }}
                >
                    {/* Ambient glow behind everything */}
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            borderRadius: "50%",
                            background: "radial-gradient(ellipse 120% 120% at 50% 60%, rgba(255,75,75,0.08) 0%, transparent 70%)",
                            transform: "scale(2)",
                        }}
                    />

                    {/* Rotating ambient rings */}
                    <div
                        aria-hidden
                        className="absolute pointer-events-none"
                        style={{ inset: -60, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                        <svg width="320" height="320" viewBox="0 0 320 320">
                            {[130, 100, 70].map((r, i) => (
                                <motion.circle
                                    key={r}
                                    cx={160} cy={160} r={r}
                                    fill="none"
                                    stroke="rgba(123,85,234,0.06)"
                                    strokeWidth="1"
                                    strokeDasharray="4 8"
                                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                                    transition={{ duration: 22 + i * 8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: "160px 160px" }}
                                />
                            ))}
                        </svg>
                    </div>

                    {/* Pills above laptop */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                        style={{ bottom: "calc(100% + 12px)", zIndex: 20, width: 280 }}
                    >
                        {pills.map(({ text, offset, delay }) => (
                            <motion.div
                                key={text}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay, ease: EASE }}
                                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full"
                                style={{
                                    marginLeft: offset,
                                    padding: "5px 12px 5px 10px",
                                    background: "rgba(14,12,24,0.95)",
                                    border: "1px solid rgba(255,75,75,0.22)",
                                    boxShadow: "0 0 18px rgba(255,75,75,0.08), 0 4px 16px rgba(0,0,0,0.55)",
                                    backdropFilter: "blur(12px)",
                                    WebkitBackdropFilter: "blur(12px)",
                                }}
                            >
                                <span
                                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                    style={{ background: "rgba(255,120,60,0.9)", boxShadow: "0 0 6px rgba(255,120,60,0.6)" }}
                                />
                                <span className="text-[10.5px] text-white/70" style={{ fontFamily: "ui-monospace, monospace" }}>
                                    {text}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Laptop SVG */}
                    <div className="relative" style={{ zIndex: 10 }}>
                        <svg width="200" height="148" viewBox="0 0 230 170" fill="none">
                            <defs>
                                <linearGradient id="mob_screenFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(18,14,30,0.98)" />
                                    <stop offset="100%" stopColor="rgba(10,8,20,0.99)" />
                                </linearGradient>
                                <linearGradient id="mob_screenStroke" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="rgba(255,75,75,0.4)" />
                                    <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                                    <stop offset="100%" stopColor="rgba(255,75,75,0.3)" />
                                </linearGradient>
                                <radialGradient id="mob_screenGlow" cx="0.5" cy="0.5">
                                    <stop offset="0%" stopColor="rgba(255,75,75,0.05)" />
                                    <stop offset="100%" stopColor="rgba(255,75,75,0)" />
                                </radialGradient>
                                <radialGradient id="mob_floor" cx="0.5" cy="0.5">
                                    <stop offset="0%" stopColor="rgba(255,75,75,0.14)" />
                                    <stop offset="100%" stopColor="rgba(255,75,75,0)" />
                                </radialGradient>
                            </defs>

                            {/* Floor glow — red tinted */}
                            <ellipse cx="115" cy="158" rx="90" ry="8" fill="url(#mob_floor)" opacity="0.9" />

                            {/* Screen body */}
                            <rect x="34" y="14" width="162" height="104" rx="10"
                                fill="url(#mob_screenFill)" stroke="url(#mob_screenStroke)" strokeWidth="1.3" />
                            <rect x="42" y="22" width="146" height="84" rx="3.5"
                                fill="url(#mob_screenGlow)" stroke="rgba(255,75,75,0.08)" strokeWidth="0.8" />

                            {/* Broken bar chart on screen */}
                            <g opacity="0.55">
                                <rect x="55" y="75" width="12" height="25" rx="1.5" fill="rgba(255,75,75,0.6)" />
                                <rect x="75" y="58" width="12" height="42" rx="1.5" fill="rgba(255,120,60,0.55)" />
                                <rect x="95" y="66" width="12" height="34" rx="1.5" fill="rgba(255,75,75,0.5)" />
                                <rect x="115" y="46" width="12" height="54" rx="1.5" fill="rgba(255,120,60,0.6)" />
                                <rect x="135" y="71" width="12" height="29" rx="1.5" fill="rgba(255,75,75,0.45)" />
                                <rect x="155" y="83" width="12" height="17" rx="1.5" fill="rgba(255,120,60,0.4)" />
                                <line x1="50" y1="100" x2="175" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                            </g>

                            {/* Pulsing alert */}
                            <motion.g
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <circle cx="115" cy="57" r="14" stroke="rgba(255,75,75,0.6)" strokeWidth="1.2" fill="rgba(255,75,75,0.07)" />
                                <line x1="115" y1="49" x2="115" y2="59" stroke="rgba(255,100,100,0.95)" strokeWidth="1.6" strokeLinecap="round" />
                                <circle cx="115" cy="64" r="1.2" fill="rgba(255,100,100,0.95)" />
                            </motion.g>

                            {/* Keyboard base */}
                            <path d="M16 120 L214 120 L222 144 L8 144 Z"
                                fill="url(#mob_screenFill)" stroke="url(#mob_screenStroke)" strokeWidth="1.3" strokeLinejoin="round" />
                            <rect x="98" y="127" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
                        </svg>

                        {/* Orbiters */}
                        {orbiters.map(({ style, delay, icon }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay, ease: EASE }}
                                className="absolute flex items-center justify-center rounded-full"
                                style={{
                                    width: 34, height: 34,
                                    background: "rgba(14,12,24,0.95)",
                                    border: "1px solid rgba(255,75,75,0.2)",
                                    boxShadow: "0 0 14px rgba(255,75,75,0.1), 0 4px 14px rgba(0,0,0,0.6)",
                                    backdropFilter: "blur(8px)",
                                    WebkitBackdropFilter: "blur(8px)",
                                    ...style,
                                }}
                            >
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                                >
                                    {icon}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom critical pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
                        className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-2 whitespace-nowrap rounded-full"
                        style={{
                            top: "calc(100% + 14px)",
                            padding: "5px 14px 5px 10px",
                            background: "rgba(14,12,24,0.95)",
                            border: "1px solid rgba(255,75,75,0.35)",
                            boxShadow: "0 0 20px rgba(255,75,75,0.15), 0 4px 16px rgba(0,0,0,0.55)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                        }}
                    >
                        <motion.span
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ background: "rgba(255,75,75,0.95)", boxShadow: "0 0 8px rgba(255,75,75,0.7)" }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                        />
                        <span className="text-[10.5px] font-semibold" style={{ fontFamily: "ui-monospace, monospace", color: "rgba(255,100,100,0.9)" }}>
                            Team burnout
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

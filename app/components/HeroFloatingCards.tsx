"use client";

import { motion } from "framer-motion";

function GradientBorder({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="rounded-2xl p-px"
            style={{
                background:
                    "linear-gradient(135deg, rgba(114,200,245,0.45) 0%, rgba(255,255,255,0.06) 50%, rgba(155,47,255,0.45) 100%)",
                boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
            }}
        >
            <div
                className="rounded-[15px] backdrop-blur-md"
                style={{ background: "rgba(6,0,20,0.85)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
                {children}
            </div>
        </div>
    );
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroFloatingCards() {
    return (
        <div
            className="pointer-events-none absolute z-20 hidden md:flex flex-col gap-2.5"
            style={{
                top: "clamp(80px, 9vw, 130px)",
                right: "clamp(14px, 3vw, 44px)",
                width: "clamp(200px, 19vw, 250px)",
            }}
            aria-hidden
        >
            {/* ── Card 1 — AI Metrics + trend chart ── */}
            <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                whileHover={{ y: -4 }}
            >
                <GradientBorder>
                    <div className="px-3.5 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                                AI Metrics
                            </p>
                            <span className="flex items-center gap-1.5">
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: "#3DFD98", boxShadow: "0 0 8px #3DFD98" }}
                                />
                                <span className="text-[9px] font-medium text-white/40">LIVE</span>
                            </span>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-2">
                            <div>
                                <p className="text-[24px] font-extrabold leading-none tracking-tight text-white">12</p>
                                <p className="mt-1 text-[10px] text-white/40">Active models</p>
                            </div>
                            <p className="text-[10px] text-white/40 text-right leading-tight">
                                <span className="font-semibold text-white/75">99.4%</span>
                                <br />
                                uptime
                            </p>
                        </div>

                        {/* Trend chart */}
                        <div className="mt-3">
                            <svg viewBox="0 0 200 60" className="block w-full" style={{ height: 58 }} aria-hidden>
                                <defs>
                                    <linearGradient id="card1Stroke" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#9B2FFF" />
                                        <stop offset="100%" stopColor="#72C8F5" />
                                    </linearGradient>
                                    <linearGradient id="card1Fill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#72C8F5" stopOpacity="0.22" />
                                        <stop offset="100%" stopColor="#72C8F5" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Dashed baseline gridlines */}
                                <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 3" />
                                <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="2 3" />

                                {/* Area fill (fades in after line) */}
                                <motion.polygon
                                    points="0,55 20,48 40,50 60,42 80,36 100,32 120,26 140,22 160,16 180,12 200,8 200,60 0,60"
                                    fill="url(#card1Fill)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.55, ease: "easeOut" }}
                                />

                                {/* Line (draws in) */}
                                <motion.polyline
                                    points="0,55 20,48 40,50 60,42 80,36 100,32 120,26 140,22 160,16 180,12 200,8"
                                    fill="none"
                                    stroke="url(#card1Stroke)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
                                />

                                {/* End-point dot */}
                                <motion.circle
                                    cx="200"
                                    cy="8"
                                    r="2.5"
                                    fill="#72C8F5"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 1.95, ease: "easeOut" }}
                                />
                                <motion.circle
                                    cx="200"
                                    cy="8"
                                    r="5"
                                    fill="#72C8F5"
                                    fillOpacity="0.2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 2.0, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">30D ago</span>
                                <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/25">Now</span>
                            </div>
                        </div>
                    </div>
                </GradientBorder>
            </motion.div>

            {/* ── Card 2 — Workflow status (mazehq mini-boxes) ── */}
            <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                whileHover={{ y: -4 }}
            >
                <GradientBorder>
                    <div className="px-3.5 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-white/85 leading-tight">
                                Workflow status
                            </p>
                            <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                                style={{
                                    background: "rgba(61,253,152,0.12)",
                                    border: "1px solid rgba(61,253,152,0.25)",
                                    color: "rgba(61,253,152,0.9)",
                                }}
                            >
                                3/3 LIVE
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-1.5">
                            {[
                                { label: "Enrich", value: "234", unit: "Live" },
                                { label: "Email", value: "1.2k", unit: "Live" },
                                { label: "CRM", value: "892", unit: "Synced" },
                            ].map((box, i) => (
                                <motion.div
                                    key={box.label}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.45, delay: 0.9 + i * 0.1, ease: EASE }}
                                    className="relative flex flex-col items-center justify-center rounded-md py-2"
                                    style={{
                                        border: "1px dashed rgba(255,255,255,0.18)",
                                    }}
                                >
                                    <span
                                        className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full"
                                        style={{ background: "#3DFD98", boxShadow: "0 0 4px #3DFD98" }}
                                    />
                                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                                        {box.label}
                                    </span>
                                    <span className="mt-0.5 text-[17px] font-extrabold leading-none tracking-tight text-white">
                                        {box.value}
                                    </span>
                                    <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/35">
                                        {box.unit}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </GradientBorder>
            </motion.div>

            {/* ── Card 3 — Revenue uplift + gradient swatch ── */}
            <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                whileHover={{ y: -4 }}
            >
                <GradientBorder>
                    <div className="px-3.5 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                            Revenue Uplift
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <motion.p
                                className="text-[30px] font-extrabold leading-none tracking-tight text-white"
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.55, delay: 1.05, ease: EASE }}
                            >
                                +38%
                            </motion.p>
                            <motion.div
                                className="h-8 w-8 rounded-lg flex-shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #9B2FFF 0%, #72C8F5 55%, #3DFD98 100%)",
                                    boxShadow: "0 0 16px rgba(155,47,255,0.28)",
                                }}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.55, delay: 1.15, ease: EASE }}
                            />
                        </div>
                        <p className="mt-2.5 text-[11px] leading-snug text-white/55">
                            Pipeline vs. last quarter.
                        </p>
                    </div>
                </GradientBorder>
            </motion.div>
        </div>
    );
}

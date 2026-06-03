"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type WhatWeBuildKind = "website" | "platform" | "ecommerce" | "custom";

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const CYAN = "rgba(123, 85, 234";

function Frame({
    children,
    refEl,
    inView,
}: {
    children: React.ReactNode;
    refEl: React.RefObject<HTMLDivElement | null>;
    inView: boolean;
}) {
    return (
        <motion.div
            ref={refEl}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative w-full"
            style={{ aspectRatio: "5 / 4" }}
        >
            {children}
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. WEBSITE — illustrative landing-page scene with hero illustration + cursor
// ─────────────────────────────────────────────────────────────────────────
function WebsiteIllustration({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <svg viewBox="0 0 360 340" className="h-full w-full" fill="none">
                    {/* Slightly tilted browser frame */}
                    <motion.g
                        initial={{ opacity: 0, y: 12, rotate: -2 }}
                        animate={inView ? { opacity: 1, y: 0, rotate: -1.5 } : {}}
                        transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
                        style={{ transformOrigin: "180px 145px" }}
                    >
                        {/* Window shadow */}
                        <rect x="20" y="34" width="320" height="220" rx="12" fill="rgba(0,0,0,0.4)" />
                        {/* Window body */}
                        <rect x="18" y="32" width="320" height="220" rx="12" fill="rgba(22,24,30,0.98)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
                        {/* Chrome */}
                        <circle cx="32" cy="46" r="3" fill="rgba(255,255,255,0.22)" />
                        <circle cx="42" cy="46" r="3" fill="rgba(255,255,255,0.22)" />
                        <circle cx="52" cy="46" r="3" fill="rgba(255,255,255,0.22)" />
                        <rect x="70" y="40" width="200" height="12" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />

                        {/* Nav bar */}
                        <rect x="34" y="68" width="14" height="14" rx="3" fill={`${CYAN}, 0.7)`} />
                        <rect x="52" y="73" width="32" height="4" rx="1.2" fill="rgba(255,255,255,0.5)" />
                        <rect x="232" y="73" width="14" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
                        <rect x="252" y="73" width="14" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
                        <rect x="272" y="73" width="14" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
                        <rect x="294" y="69" width="32" height="12" rx="6" fill={`${CYAN}, 0.2)`} stroke={`${CYAN}, 0.55)`} strokeWidth="0.8" />

                        {/* Hero left: headline + body + buttons */}
                        <motion.g
                            initial={{ opacity: 0, x: -6 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
                        >
                            <rect x="34" y="108" width="60" height="6" rx="1.5" fill="rgba(255,255,255,0.42)" />
                            <rect x="34" y="124" width="150" height="10" rx="2" fill="rgba(255,255,255,0.88)" />
                            <rect x="34" y="140" width="120" height="10" rx="2" fill="rgba(255,255,255,0.88)" />
                            <rect x="34" y="164" width="160" height="3" rx="1" fill="rgba(255,255,255,0.22)" />
                            <rect x="34" y="172" width="130" height="3" rx="1" fill="rgba(255,255,255,0.18)" />
                            {/* Primary CTA */}
                            <rect x="34" y="190" width="78" height="22" rx="11" fill={`${CYAN}, 0.85)`} />
                            <rect x="48" y="198" width="50" height="6" rx="1.5" fill="rgba(255,255,255,0.92)" />
                            {/* Ghost button */}
                            <rect x="122" y="190" width="56" height="22" rx="11" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />
                            <rect x="134" y="198" width="32" height="6" rx="1.5" fill="rgba(255,255,255,0.5)" />
                        </motion.g>

                        {/* Hero right: layered illustration shapes */}
                        <motion.g
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
                            style={{ transformOrigin: "270px 165px" }}
                        >
                            <rect x="216" y="106" width="110" height="118" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                            {/* Circle */}
                            <circle cx="252" cy="146" r="22" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill={`${CYAN}, 0.06)`} />
                            {/* Triangle */}
                            <path d="M278 178 L308 138 L322 188 Z" stroke={`${CYAN}, 0.7)`} strokeWidth="1.4" fill={`${CYAN}, 0.12)`} strokeLinejoin="round" />
                            {/* Floating dots */}
                            <circle cx="242" cy="120" r="2.4" fill={`${CYAN}, 0.85)`} />
                            <circle cx="310" cy="116" r="1.8" fill="rgba(255,255,255,0.55)" />
                            <circle cx="226" cy="200" r="2" fill="rgba(255,255,255,0.45)" />
                            <motion.circle
                                cx="298" cy="206" r="3"
                                fill={`${CYAN}, 0.95)`}
                                animate={reduced ? undefined : { opacity: [0.4, 1, 0.4], r: [3, 4.2, 3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.g>

                        {/* Bottom content strip */}
                        <rect x="34" y="226" width="290" height="14" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
                        <circle cx="44" cy="233" r="3" fill={`${CYAN}, 0.6)`} />
                        <rect x="54" y="230" width="60" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
                        <rect x="54" y="236" width="40" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
                    </motion.g>

                    {/* Floating conversion-analytics card */}
                    <motion.g
                        initial={{ opacity: 0, y: 12 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
                    >
                        <motion.g
                            animate={reduced ? undefined : { y: [0, -3, 0] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <rect x="244" y="208" width="100" height="58" rx="9" fill="rgba(12,14,20,0.98)" stroke={`${CYAN}, 0.5)`} strokeWidth="1.2" />
                            <text x="256" y="224" fontFamily={MONO} fontSize="6" letterSpacing="0.18em" fill="rgba(255,255,255,0.5)">
                                CONVERSION
                            </text>
                            <text x="256" y="242" fontFamily={MONO} fontSize="13" fontWeight="700" fill="white">
                                +24%
                            </text>
                            <polyline
                                points="256,258 268,253 280,255 292,247 304,249 318,240 332,236"
                                fill="none" stroke={`${CYAN}, 0.95)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                            />
                            <path d="M332 236 L327 237 M332 236 L331 241" stroke={`${CYAN}, 0.95)`} strokeWidth="1.4" strokeLinecap="round" />
                        </motion.g>
                    </motion.g>

                    {/* Cursor pointer hovering over CTA */}
                    <motion.g
                        initial={{ opacity: 0, x: -10, y: 10 }}
                        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                        transition={{ duration: 0.55, delay: 0.5, ease: EASE }}
                    >
                        <motion.g
                            animate={reduced ? undefined : { y: [0, -2, 0] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M104 198 L104 220 L110 215 L115 226 L120 224 L114 213 L122 213 Z"
                                fill="white"
                                stroke="rgba(0,0,0,0.6)"
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                            />
                        </motion.g>
                    </motion.g>

                    {/* Stat strip */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.85, ease: EASE }}>
                        <line x1="8" y1="296" x2="352" y2="296" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="60"  y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">CONVERSION LIFT</text>
                        <text x="60"  y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">+24%</text>
                        <text x="60"  y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">avg on launch</text>
                        <text x="180" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">PAGE SPEED</text>
                        <text x="180" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>95+</text>
                        <text x="180" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">lighthouse score</text>
                        <text x="300" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">TIME TO LIVE</text>
                        <text x="300" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">4–8w</text>
                        <text x="300" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">design to launch</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. PLATFORM — system architecture topology (hub-and-spoke)
// ─────────────────────────────────────────────────────────────────────────
function PlatformIllustration({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    const nodes = [
        { x: 60, y: 70, label: "WEB", sub: "next.js" },
        { x: 60, y: 220, label: "MOBILE", sub: "ios · android" },
        { x: 300, y: 50, label: "AUTH", sub: "oauth + jwt" },
        { x: 320, y: 145, label: "DB", sub: "postgres" },
        { x: 300, y: 240, label: "QUEUE", sub: "redis" },
        { x: 200, y: 30, label: "CDN", sub: "edge" },
        { x: 200, y: 260, label: "STORAGE", sub: "s3" },
    ];

    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 380 340" className="h-full w-full" fill="none">
                    {/* Connecting lines from each node to the hub */}
                    {nodes.map((n, i) => (
                        <motion.line
                            key={`l-${i}`}
                            x1={n.x} y1={n.y} x2="190" y2="145"
                            stroke="rgba(255,255,255,0.15)"
                            strokeWidth="1"
                            strokeDasharray="3 5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.18 + i * 0.04, ease: EASE }}
                        />
                    ))}

                    {/* Animated data pulses on lines */}
                    {!reduced &&
                        nodes.map((n, i) => (
                            <motion.circle
                                key={`p-${i}`}
                                r="2.4"
                                fill={`${CYAN}, 0.9)`}
                                initial={{ opacity: 0 }}
                                animate={inView ? {
                                    cx: [n.x, 190],
                                    cy: [n.y, 145],
                                    opacity: [0, 1, 0],
                                } : {}}
                                transition={{
                                    duration: 1.8,
                                    delay: 0.6 + i * 0.25,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        ))}

                    {/* Outer ring of nodes */}
                    {nodes.map((n, i) => (
                        <motion.g
                            key={`n-${i}`}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.12 + i * 0.05, ease: EASE }}
                            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        >
                            <rect x={n.x - 28} y={n.y - 13} width="56" height="26" rx="4"
                                fill="rgba(20,22,28,0.96)"
                                stroke="rgba(255,255,255,0.22)"
                                strokeWidth="1" />
                            <text x={n.x} y={n.y - 1} textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="600" letterSpacing="0.14em" fill="rgba(255,255,255,0.92)">
                                {n.label}
                            </text>
                            <text x={n.x} y={n.y + 8} textAnchor="middle" fontFamily={MONO} fontSize="6" letterSpacing="0.1em" fill="rgba(255,255,255,0.4)">
                                {n.sub}
                            </text>
                        </motion.g>
                    ))}

                    {/* Central platform hub */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
                        style={{ transformOrigin: "190px 145px" }}
                    >
                        {/* Pulsing aura */}
                        {!reduced && (
                            <motion.circle
                                cx="190" cy="145" r="56"
                                fill={`${CYAN}, 0.05)`}
                                stroke={`${CYAN}, 0.2)`}
                                strokeWidth="1"
                                animate={{ opacity: [0.5, 1, 0.5], r: [54, 62, 54] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        )}
                        <rect x="160" y="128" width="84" height="54" rx="8"
                            fill="rgba(20,22,28,0.55)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <rect x="154" y="123" width="84" height="54" rx="8"
                            fill="rgba(20,22,28,0.8)" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                        <rect x="148" y="118" width="84" height="54" rx="8"
                            fill="rgba(20,22,28,0.98)"
                            stroke={`${CYAN}, 0.55)`}
                            strokeWidth="1.4" />
                        <circle cx="190" cy="135" r="6" stroke={`${CYAN}, 0.9)`} strokeWidth="1.4" fill="none" />
                        <circle cx="190" cy="135" r="2" fill={`${CYAN}, 0.9)`} />
                        <text x="190" y="158" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.18em" fill="white">
                            PLATFORM
                        </text>
                        <text x="190" y="167" textAnchor="middle" fontFamily={MONO} fontSize="6" letterSpacing="0.14em" fill={`${CYAN}, 0.85)`}>
                            api · scale · secure
                        </text>
                    </motion.g>

                    {/* Stat strip */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.75, ease: EASE }}>
                        <line x1="8" y1="296" x2="372" y2="296" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="63"  y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">INTEGRATIONS</text>
                        <text x="63"  y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">7+</text>
                        <text x="63"  y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">systems connected</text>
                        <text x="190" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">UPTIME SLA</text>
                        <text x="190" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>99.9%</text>
                        <text x="190" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">guaranteed</text>
                        <text x="317" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">SCALES TO</text>
                        <text x="317" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">10×</text>
                        <text x="317" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">without re-arch</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. ECOMMERCE — phone storefront with product + ADD button + cart badge
// ─────────────────────────────────────────────────────────────────────────
function EcommerceIllustration({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 380 340" className="h-full w-full" fill="none">
                    {/* Soft spotlight under the phone */}
                    {!reduced && (
                        <motion.ellipse
                            cx="190" cy="266" rx="92" ry="6"
                            fill={`${CYAN}, 0.16)`}
                            animate={{ opacity: [0.5, 0.95, 0.5] }}
                            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}

                    {/* Phone frame, slight tilt */}
                    <motion.g
                        initial={{ opacity: 0, y: 14, rotate: -3 }}
                        animate={inView ? { opacity: 1, y: 0, rotate: -2 } : {}}
                        transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                        style={{ transformOrigin: "190px 150px" }}
                    >
                        {/* Body */}
                        <rect
                            x="130" y="32" width="120" height="220" rx="20"
                            fill="rgba(18,20,26,0.98)"
                            stroke="rgba(255,255,255,0.42)"
                            strokeWidth="1.6"
                        />
                        {/* Dynamic Island */}
                        <rect x="170" y="41" width="40" height="9" rx="4.5" fill="rgba(0,0,0,0.65)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
                        <circle cx="203" cy="45.5" r="1.8" fill="rgba(255,255,255,0.28)" />

                        {/* Status bar */}
                        <text x="140" y="58" fontFamily={MONO} fontSize="6.5" fontWeight="600" letterSpacing="0.04em" fill="rgba(255,255,255,0.6)">9:41</text>
                        <rect x="222" y="53.5" width="14" height="6" rx="1.5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
                        <rect x="223.5" y="55" width="9" height="3" rx="0.8" fill={`${CYAN}, 0.85)`} />
                        <rect x="236.5" y="55" width="1.6" height="3" rx="0.8" fill="rgba(255,255,255,0.5)" />

                        {/* Product image area */}
                        <rect
                            x="140" y="60" width="100" height="84" rx="8"
                            fill="rgba(255,255,255,0.04)"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.8"
                        />
                        {/* AI recommendation badge */}
                        <rect x="146" y="66" width="46" height="13" rx="6.5" fill={`${CYAN}, 0.18)`} stroke={`${CYAN}, 0.6)`} strokeWidth="0.8" />
                        <path d="M153 72.5 l1.4 -3 l1.4 3 l3 1.4 l-3 1.4 l-1.4 3 l-1.4 -3 l-3 -1.4 Z" fill={`${CYAN}, 0.95)`} transform="translate(-1 0)" />
                        <text x="162" y="76" fontFamily={MONO} fontSize="6.5" fontWeight="700" letterSpacing="0.1em" fill="white">AI PICK</text>

                        {/* Sneaker silhouette inside image area */}
                        <motion.g
                            initial={{ opacity: 0, x: -6 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
                        >
                            {/* sole */}
                            <path
                                d="M150 122 Q150 116 158 115 L222 113 Q230 113 232 119 L232 124 Q232 127 228 127 L153 127 Q150 127 150 122 Z"
                                fill={`${CYAN}, 0.22)`}
                                stroke={`${CYAN}, 0.9)`}
                                strokeWidth="1.3"
                                strokeLinejoin="round"
                            />
                            {/* upper */}
                            <path
                                d="M157 115 Q160 96 174 94 L196 93 Q216 92 226 100 L230 110 Q231 113 228 114 L222 113 L157 115 Z"
                                fill="rgba(255,255,255,0.08)"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                            />
                            {/* swoosh */}
                            <path
                                d="M204 108 Q212 100 224 102"
                                stroke={`${CYAN}, 0.9)`}
                                strokeWidth="1.4"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </motion.g>

                        {/* Product title + category */}
                        <motion.g
                            initial={{ opacity: 0, y: 4 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.36, ease: EASE }}
                        >
                            <text x="140" y="166"
                                fontFamily={MONO} fontSize="11" fontWeight="700" letterSpacing="0.02em"
                                fill="white">
                                Aero V3
                            </text>
                            <text x="140" y="178"
                                fontFamily={MONO} fontSize="7" letterSpacing="0.18em"
                                fill="rgba(255,255,255,0.4)">
                                RUNNING · M
                            </text>
                            {/* Rating stars */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <path
                                    key={i}
                                    d="M0,-3.2 L0.94,-0.99 L3.04,-0.99 L1.35,0.38 L1.88,2.59 L0,1.3 L-1.88,2.59 L-1.35,0.38 L-3.04,-0.99 L-0.94,-0.99 Z"
                                    transform={`translate(${206 + i * 8}, 174)`}
                                    fill={i < 4 ? `${CYAN}, 0.95)` : "rgba(255,255,255,0.2)"}
                                />
                            ))}
                        </motion.g>

                        {/* Price */}
                        <motion.text
                            x="140" y="202"
                            fontFamily={MONO} fontSize="18" fontWeight="700" letterSpacing="0.02em"
                            fill={`${CYAN}, 0.95)`}
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.42, ease: EASE }}
                        >
                            $112
                        </motion.text>

                        {/* Colour selector swatches */}
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.46, ease: EASE }}
                        >
                            <circle cx="212" cy="197" r="4.5" fill="rgba(255,255,255,0.85)" />
                            <circle cx="212" cy="197" r="6.6" fill="none" stroke={`${CYAN}, 0.85)`} strokeWidth="1" />
                            <circle cx="226" cy="197" r="4.5" fill={`${CYAN}, 0.7)`} />
                            <circle cx="240" cy="197" r="4.5" fill="rgba(255,255,255,0.28)" />
                        </motion.g>

                        {/* Add to cart button (centered text, no icon) */}
                        <motion.g
                            initial={{ opacity: 0, y: 6 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.5, ease: EASE }}
                        >
                            <rect x="140" y="216" width="100" height="22" rx="11" fill={`${CYAN}, 0.92)`} />
                            <text x="190" y="231" textAnchor="middle"
                                fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.2em" fill="rgba(8,10,16,0.95)">
                                ADD TO CART
                            </text>
                        </motion.g>

                        {/* Home indicator */}
                        <rect x="172" y="245" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.32)" />
                    </motion.g>

                    {/* Floating revenue card (bottom-left) */}
                    <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.72, ease: EASE }}
                    >
                        <motion.g
                            animate={reduced ? undefined : { y: [0, -3, 0] }}
                            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <rect x="40" y="194" width="92" height="58" rx="9" fill="rgba(12,14,20,0.98)" stroke={`${CYAN}, 0.5)`} strokeWidth="1.2" />
                            <text x="52" y="210" fontFamily={MONO} fontSize="6" letterSpacing="0.16em" fill="rgba(255,255,255,0.5)">
                                REVENUE
                            </text>
                            <text x="52" y="228" fontFamily={MONO} fontSize="13" fontWeight="700" fill="white">
                                +40%
                            </text>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <rect key={i} x={52 + i * 15} y={246 - (6 + i * 4)} width="9" height={6 + i * 4} rx="1.5"
                                    fill={`${CYAN}, ${0.4 + i * 0.12})`} />
                            ))}
                        </motion.g>
                    </motion.g>

                    {/* Floating cart with counter */}
                    <motion.g
                        initial={{ opacity: 0, x: 10, y: -6 }}
                        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.62, ease: EASE }}
                    >
                        <motion.g
                            animate={reduced ? undefined : { y: [0, -3, 0] }}
                            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <circle cx="296" cy="74" r="22"
                                fill="rgba(18,20,26,0.98)"
                                stroke={`${CYAN}, 0.75)`}
                                strokeWidth="1.4" />
                            <path d="M286 70 L288 70 L290 80 L304 80 L306 74 L290 74"
                                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <circle cx="292" cy="84" r="1.4" fill="white" />
                            <circle cx="302" cy="84" r="1.4" fill="white" />
                            <motion.circle
                                cx="312" cy="60" r="7"
                                fill={`${CYAN}, 0.95)`}
                                animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <text x="312" y="63" textAnchor="middle"
                                fontFamily={MONO} fontSize="8.5" fontWeight="700" fill="rgba(8,10,16,0.95)">
                                1
                            </text>
                        </motion.g>
                    </motion.g>

                    {/* Stat strip */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.9, ease: EASE }}>
                        <line x1="8" y1="296" x2="372" y2="296" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="63"  y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">REVENUE LIFT</text>
                        <text x="63"  y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">+40%</text>
                        <text x="63"  y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">avg post-launch</text>
                        <text x="190" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">CART ABANDON</text>
                        <text x="190" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>−28%</text>
                        <text x="190" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">with AI picks</text>
                        <text x="317" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">MOBILE CVR</text>
                        <text x="317" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">3.2×</text>
                        <text x="317" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">vs old store</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. CUSTOM — bespoke data architecture: database → schema + logic/rules engine
// ─────────────────────────────────────────────────────────────────────────
function CustomIllustration({
    inView,
    reduced,
    refEl,
}: {
    inView: boolean;
    reduced: boolean;
    refEl: React.RefObject<HTMLDivElement | null>;
}) {
    // Database cylinder geometry (left)
    const dbX = 86, dbTop = 110, dbW = 64, dbH = 96, dbRy = 12;
    const dbCx = dbX + dbW / 2;
    // Connector targets
    const schema = { x: 226, y: 96, w: 118, h: 70 };   // schema table (top-right)
    const logic = { x: 226, y: 196, w: 118, h: 62 };   // rules/logic engine (bottom-right)

    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 380 340" className="h-full w-full" fill="none">
                    {/* Subtle blueprint grid */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
                    >
                        {[60, 100, 140, 180, 220, 260].map((y) => (
                            <line key={`h-${y}`} x1="40" y1={y} x2="356" y2={y}
                                stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
                        ))}
                        {[40, 90, 140, 190, 240, 290, 340].map((x) => (
                            <line key={`v-${x}`} x1={x} y1="50" x2={x} y2="262"
                                stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
                        ))}
                    </motion.g>

                    {/* Connector lines: DB → schema, DB → logic */}
                    {([
                        [dbX + dbW, dbTop + 18, schema.x, schema.y + schema.h / 2],
                        [dbX + dbW, dbTop + dbH - 18, logic.x, logic.y + logic.h / 2],
                    ] as const).map(([x1, y1, x2, y2], i) => (
                        <motion.path
                            key={`c-${i}`}
                            d={`M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="1"
                            strokeDasharray="3 5"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.12, ease: EASE }}
                        />
                    ))}

                    {/* Data pulses travelling DB → schema / logic */}
                    {!reduced && ([
                        [dbX + dbW, dbTop + 18, schema.x, schema.y + schema.h / 2],
                        [dbX + dbW, dbTop + dbH - 18, logic.x, logic.y + logic.h / 2],
                    ] as const).map(([x1, y1, x2, y2], i) => (
                        <motion.circle
                            key={`pulse-${i}`}
                            r="2.4"
                            fill={`${CYAN}, 0.95)`}
                            initial={{ opacity: 0 }}
                            animate={inView ? { cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] } : {}}
                            transition={{ duration: 1.8, delay: 1 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}

                    {/* Database cylinder */}
                    <motion.g
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
                        style={{ transformOrigin: `${dbCx}px ${dbTop + dbH / 2}px` }}
                    >
                        {/* body */}
                        <path
                            d={`M${dbX} ${dbTop} L${dbX} ${dbTop + dbH} A ${dbW / 2} ${dbRy} 0 0 0 ${dbX + dbW} ${dbTop + dbH} L${dbX + dbW} ${dbTop} Z`}
                            fill="rgba(20,22,28,0.98)"
                            stroke={`${CYAN}, 0.55)`}
                            strokeWidth="1.4"
                        />
                        {/* internal platters */}
                        {[dbTop + 30, dbTop + 58].map((cy, i) => (
                            <ellipse key={i} cx={dbCx} cy={cy} rx={dbW / 2} ry={dbRy}
                                fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                        ))}
                        {/* top cap */}
                        <ellipse cx={dbCx} cy={dbTop} rx={dbW / 2} ry={dbRy}
                            fill="rgba(28,30,38,0.98)" stroke={`${CYAN}, 0.7)`} strokeWidth="1.4" />
                        <text x={dbCx} y={dbTop + dbH + 24} textAnchor="middle"
                            fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.16em" fill="white">
                            DATA
                        </text>
                        <text x={dbCx} y={dbTop + dbH + 34} textAnchor="middle"
                            fontFamily={MONO} fontSize="6" letterSpacing="0.12em" fill={`${CYAN}, 0.8)`}>
                            custom schema
                        </text>
                    </motion.g>

                    {/* Schema table card (top-right) */}
                    <motion.g
                        initial={{ opacity: 0, x: 8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.34, ease: EASE }}
                    >
                        <rect x={schema.x} y={schema.y} width={schema.w} height={schema.h} rx="6"
                            fill="rgba(20,22,28,0.98)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                        {/* header */}
                        <rect x={schema.x} y={schema.y} width={schema.w} height="18" rx="6"
                            fill={`${CYAN}, 0.14)`} />
                        <rect x={schema.x} y={schema.y + 12} width={schema.w} height="6" fill={`${CYAN}, 0.14)`} />
                        <text x={schema.x + 10} y={schema.y + 13} fontFamily={MONO} fontSize="7.5" fontWeight="700" letterSpacing="0.12em" fill="white">
                            SCHEMA
                        </text>
                        {/* rows */}
                        {[0, 1, 2].map((r) => (
                            <g key={r}>
                                <circle cx={schema.x + 12} cy={schema.y + 32 + r * 14} r="2" fill={`${CYAN}, 0.8)`} />
                                <rect x={schema.x + 20} y={schema.y + 29 + r * 14} width={r === 1 ? 70 : 56} height="4" rx="1.5" fill="rgba(255,255,255,0.4)" />
                                <rect x={schema.x + schema.w - 26} y={schema.y + 29 + r * 14} width="16" height="4" rx="1.5" fill="rgba(255,255,255,0.18)" />
                            </g>
                        ))}
                    </motion.g>

                    {/* Logic / rules engine (bottom-right) with gear */}
                    <motion.g
                        initial={{ opacity: 0, x: 8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.44, ease: EASE }}
                    >
                        <rect x={logic.x} y={logic.y} width={logic.w} height={logic.h} rx="6"
                            fill="rgba(20,22,28,0.98)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                        {/* rotating gear */}
                        <motion.g
                            style={{ transformOrigin: `${logic.x + 26}px ${logic.y + logic.h / 2}px` }}
                            animate={reduced ? undefined : { rotate: 360 }}
                            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                        >
                            {Array.from({ length: 8 }).map((_, i) => {
                                const a = (i / 8) * Math.PI * 2;
                                const cx = logic.x + 26, cy = logic.y + logic.h / 2;
                                return (
                                    <rect key={i}
                                        x={cx - 1.5} y={cy - 14} width="3" height="5" rx="1"
                                        fill={`${CYAN}, 0.85)`}
                                        transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} />
                                );
                            })}
                            <circle cx={logic.x + 26} cy={logic.y + logic.h / 2} r="9" fill="none" stroke={`${CYAN}, 0.9)`} strokeWidth="1.6" />
                            <circle cx={logic.x + 26} cy={logic.y + logic.h / 2} r="3" fill={`${CYAN}, 0.9)`} />
                        </motion.g>
                        {/* rule lines */}
                        {[0, 1, 2].map((r) => (
                            <rect key={r} x={logic.x + 48} y={logic.y + 18 + r * 12} width={r === 2 ? 38 : 56} height="4" rx="1.5" fill="rgba(255,255,255,0.32)" />
                        ))}
                        <text x={logic.x + 48} y={logic.y + 13} fontFamily={MONO} fontSize="7.5" fontWeight="700" letterSpacing="0.12em" fill="white">
                            LOGIC
                        </text>
                    </motion.g>

                    {/* Spec label, top-left */}
                    <motion.g
                        initial={{ opacity: 0, x: -6 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                    >
                        <text x="46" y="40" fontFamily={MONO} fontSize="7" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                            ▸ CUSTOM INFRASTRUCTURE
                        </text>
                        <line x1="46" y1="46" x2="200" y2="46" stroke={`${CYAN}, 0.5)`} strokeWidth="0.8" />
                    </motion.g>

                    {/* Caption */}
                    <motion.text
                        x="190" y="282" textAnchor="middle"
                        fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.3em"
                        fill="white"
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.9, ease: EASE }}
                    >
                        BUILT TO SPEC
                    </motion.text>

                    {/* Stat strip */}
                    <motion.g initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 1.0, ease: EASE }}>
                        <line x1="8" y1="296" x2="372" y2="296" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
                        <text x="63"  y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">DELIVERY</text>
                        <text x="63"  y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">10–20w</text>
                        <text x="63"  y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">scope to launch</text>
                        <text x="190" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">CUSTOM SCHEMA</text>
                        <text x="190" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill={`${CYAN}, 0.9)`}>100%</text>
                        <text x="190" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">built to your data</text>
                        <text x="317" y="310" textAnchor="middle" fontFamily={MONO} fontSize="7" letterSpacing="0.14em" fill="rgba(255,255,255,0.3)">HANDOFF</text>
                        <text x="317" y="326" textAnchor="middle" fontFamily={MONO} fontSize="15" fontWeight="700" fill="white">Full</text>
                        <text x="317" y="337" textAnchor="middle" fontFamily={MONO} fontSize="6.5" letterSpacing="0.08em" fill="rgba(255,255,255,0.24)">docs + training</text>
                    </motion.g>
                </svg>
            </div>
        </Frame>
    );
}

// ── Public component ──────────────────────────────────────────────────────
export default function WhatWeBuildVisual({ kind }: { kind: WhatWeBuildKind }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "200px" });
    const prefersReducedMotion = useReducedMotion();
    const reduced = !!prefersReducedMotion;

    if (kind === "website") return <WebsiteIllustration inView={inView} reduced={reduced} refEl={ref} />;
    if (kind === "platform") return <PlatformIllustration inView={inView} reduced={reduced} refEl={ref} />;
    if (kind === "ecommerce") return <EcommerceIllustration inView={inView} reduced={reduced} refEl={ref} />;
    return <CustomIllustration inView={inView} reduced={reduced} refEl={ref} />;
}

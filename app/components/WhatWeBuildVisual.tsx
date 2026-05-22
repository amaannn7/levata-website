"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type WhatWeBuildKind = "website" | "platform" | "ecommerce" | "custom";

const EASE = [0.16, 1, 0.3, 1] as const;
const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
const CYAN = "rgba(34, 211, 238";

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
                <svg viewBox="0 0 360 290" className="h-full w-full" fill="none">
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
                <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">
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
                <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">
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
                        {/* Speaker notch */}
                        <rect x="174" y="44" width="32" height="4" rx="2" fill="rgba(255,255,255,0.18)" />

                        {/* Product image area */}
                        <rect
                            x="140" y="60" width="100" height="84" rx="8"
                            fill="rgba(255,255,255,0.04)"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="0.8"
                        />

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

                        {/* Add to cart button (centered text, no icon) */}
                        <motion.g
                            initial={{ opacity: 0, y: 6 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.5, ease: EASE }}
                        >
                            <rect x="140" y="218" width="100" height="24" rx="12" fill={`${CYAN}, 0.92)`} />
                            <text x="190" y="234" textAnchor="middle"
                                fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.2em" fill="rgba(8,10,16,0.95)">
                                ADD TO CART
                            </text>
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
                            {/* Cart bubble */}
                            <circle cx="296" cy="74" r="22"
                                fill="rgba(18,20,26,0.98)"
                                stroke={`${CYAN}, 0.75)`}
                                strokeWidth="1.4" />
                            {/* Cart icon */}
                            <path d="M286 70 L288 70 L290 80 L304 80 L306 74 L290 74"
                                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <circle cx="292" cy="84" r="1.4" fill="white" />
                            <circle cx="302" cy="84" r="1.4" fill="white" />
                            {/* Counter badge */}
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
                </svg>
            </div>
        </Frame>
    );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. CUSTOM — custom-shaped module being drawn with blueprint dimension marks
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
    // A custom asymmetric polygon — the "built to spec" shape
    const shape = "M120 110 L228 90 L268 150 L246 220 L156 232 L100 188 Z";

    return (
        <Frame refEl={refEl} inView={inView}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <svg viewBox="0 0 380 290" className="h-full w-full" fill="none">
                    {/* Subtle blueprint grid behind the shape */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
                    >
                        {[60, 100, 140, 180, 220, 260].map((y) => (
                            <line key={`h-${y}`} x1="50" y1={y} x2="330" y2={y}
                                stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
                        ))}
                        {[50, 100, 150, 200, 250, 300, 330].map((x) => (
                            <line key={`v-${x}`} x1={x} y1="60" x2={x} y2="260"
                                stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
                        ))}
                    </motion.g>

                    {/* Blueprint corner ticks (frame only, no box) */}
                    {([[50, 60], [330, 60], [50, 260], [330, 260]] as const).map(([x, y], i) => (
                        <motion.g
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 0.6 } : {}}
                            transition={{ duration: 0.4, delay: 0.08 + i * 0.04, ease: EASE }}
                        >
                            <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke={`${CYAN}, 0.6)`} strokeWidth="1" />
                            <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke={`${CYAN}, 0.6)`} strokeWidth="1" />
                        </motion.g>
                    ))}

                    {/* Fill of the shape (drawn behind the outline) */}
                    <motion.path
                        d={shape}
                        fill={`${CYAN}, 0.1)`}
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
                    />

                    {/* Outline drawn in via pathLength */}
                    <motion.path
                        d={shape}
                        fill="none"
                        stroke={`${CYAN}, 0.95)`}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.1, delay: 0.18, ease: EASE }}
                    />

                    {/* Vertex markers */}
                    {[
                        [120, 110], [228, 90], [268, 150], [246, 220], [156, 232], [100, 188],
                    ].map(([cx, cy], i) => (
                        <motion.circle
                            key={i}
                            cx={cx} cy={cy} r="3"
                            fill="rgba(14,16,22,0.98)"
                            stroke={`${CYAN}, 0.95)`}
                            strokeWidth="1.4"
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: EASE }}
                        />
                    ))}

                    {/* Pulsing vertex (highlight one as "active") */}
                    {!reduced && (
                        <motion.circle
                            cx="228" cy="90" r="3"
                            fill={`${CYAN}, 0.95)`}
                            animate={{ opacity: [0.45, 1, 0.45], r: [3, 5, 3] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}

                    {/* Horizontal dimension line (top) */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.95, ease: EASE }}
                    >
                        <line x1="100" y1="74" x2="268" y2="74" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        {/* Tick marks */}
                        <line x1="100" y1="70" x2="100" y2="78" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        <line x1="268" y1="70" x2="268" y2="78" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        {/* Label */}
                        <rect x="166" y="66" width="36" height="14" rx="2"
                            fill="rgba(14,16,22,0.98)" />
                        <text x="184" y="76" textAnchor="middle"
                            fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.08em"
                            fill={`${CYAN}, 0.95)`}>
                            18.4
                        </text>
                    </motion.g>

                    {/* Vertical dimension line (right) */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: 1.0, ease: EASE }}
                    >
                        <line x1="290" y1="90" x2="290" y2="220" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        <line x1="286" y1="90" x2="294" y2="90" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        <line x1="286" y1="220" x2="294" y2="220" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
                        <rect x="278" y="148" width="24" height="14" rx="2"
                            fill="rgba(14,16,22,0.98)" />
                        <text x="290" y="158" textAnchor="middle"
                            fontFamily={MONO} fontSize="8" fontWeight="700" letterSpacing="0.08em"
                            fill={`${CYAN}, 0.95)`}>
                            14.2
                        </text>
                    </motion.g>

                    {/* Spec label, top-left */}
                    <motion.g
                        initial={{ opacity: 0, x: -6 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
                    >
                        <text x="56" y="38" fontFamily={MONO} fontSize="7" letterSpacing="0.22em" fill="rgba(255,255,255,0.45)">
                            ▸ SPEC · 01 OF 01
                        </text>
                        <line x1="56" y1="44" x2="180" y2="44" stroke={`${CYAN}, 0.5)`} strokeWidth="0.8" />
                    </motion.g>

                    {/* BUILT TO SPEC label below the shape */}
                    <motion.text
                        x="190" y="282" textAnchor="middle"
                        fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="0.32em"
                        fill="white"
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 1.05, ease: EASE }}
                    >
                        BUILT TO SPEC
                    </motion.text>
                </svg>
            </div>
        </Frame>
    );
}

// ── Public component ──────────────────────────────────────────────────────
export default function WhatWeBuildVisual({ kind }: { kind: WhatWeBuildKind }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15%" });
    const prefersReducedMotion = useReducedMotion();
    const reduced = !!prefersReducedMotion;

    if (kind === "website") return <WebsiteIllustration inView={inView} reduced={reduced} refEl={ref} />;
    if (kind === "platform") return <PlatformIllustration inView={inView} reduced={reduced} refEl={ref} />;
    if (kind === "ecommerce") return <EcommerceIllustration inView={inView} reduced={reduced} refEl={ref} />;
    return <CustomIllustration inView={inView} reduced={reduced} refEl={ref} />;
}

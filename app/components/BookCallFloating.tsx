"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useBookCall } from "@/app/components/BookCallProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BookCallFloating() {
    const { open: navigateToCalendly } = useBookCall();
    const borderRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let angle = 0;
        let rafId: number;
        const tick = () => {
            angle = (angle + 0.6) % 360;
            if (borderRef.current) {
                borderRef.current.style.background =
                    `conic-gradient(from ${angle}deg, #00FFDD, #7B55EA, #CC01FF, #7B55EA, #00FFDD)`;
            }
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="fixed bottom-6 right-5 sm:right-7 z-[150]">
            <motion.button
                type="button"
                onClick={navigateToCalendly}
                aria-label="Book a strategy call"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
                whileHover={{ scale: 1.08, transition: { duration: 0.12, ease: "easeOut" } }}
                whileTap={{ scale: 0.94, transition: { duration: 0.1 } }}
                className="relative flex items-center justify-center cursor-pointer"
                style={{ width: 54, height: 54 }}
            >
                {/* Rotating aurora border */}
                <span
                    ref={borderRef}
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                        inset: -2,
                        background: "conic-gradient(from 0deg, #00FFDD, #7B55EA, #CC01FF, #7B55EA, #00FFDD)",
                        borderRadius: "50%",
                    }}
                />

                {/* Glow */}
                <span
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 24px rgba(123,85,234,0.5), 0 0 10px rgba(0,255,221,0.25)" }}
                />

                {/* Glass disc */}
                <span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{
                        inset: 2,
                        background: "rgba(10,9,22,0.92)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderRadius: "50%",
                    }}
                />

                {/* Calendar icon — larger, higher contrast */}
                <span className="relative z-10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        {/* Body outline */}
                        <rect
                            x="2.5" y="4.5"
                            width="19" height="17"
                            rx="3"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="1.5"
                        />
                        {/* Header fill */}
                        <rect
                            x="2.5" y="4.5"
                            width="19" height="6"
                            rx="3"
                            fill="rgba(255,255,255,0.18)"
                        />
                        <rect x="2.5" y="8" width="19" height="2.5" fill="rgba(255,255,255,0.18)" />

                        {/* Divider line */}
                        <line x1="2.5" y1="10.5" x2="21.5" y2="10.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                        {/* Pin tabs — cyan */}
                        <rect x="7.5" y="2.5" width="2" height="4.5" rx="1" fill="#00FFDD" />
                        <rect x="14.5" y="2.5" width="2" height="4.5" rx="1" fill="#00FFDD" />

                        {/* Day grid — row 1 */}
                        <rect x="5.5"  y="13" width="3" height="2.2" rx="0.6" fill="rgba(255,255,255,0.75)" />
                        <rect x="10.5" y="13" width="3" height="2.2" rx="0.6" fill="rgba(255,255,255,0.75)" />
                        <rect x="15.5" y="13" width="3" height="2.2" rx="0.6" fill="rgba(255,255,255,0.75)" />

                        {/* Day grid — row 2, middle one highlighted purple */}
                        <rect x="5.5"  y="16.5" width="3" height="2.2" rx="0.6" fill="rgba(255,255,255,0.3)" />
                        <rect x="10.5" y="16.5" width="3" height="2.2" rx="0.6" fill="#7B55EA" />
                        <rect x="15.5" y="16.5" width="3" height="2.2" rx="0.6" fill="rgba(255,255,255,0.3)" />
                    </svg>
                </span>
            </motion.button>
        </div>
    );
}

"use client";

import { useEffect, useRef, useState, useCallback, type RefObject } from "react";
import { motion } from "framer-motion";

interface Ring {
    id: number;
    x: number;
    y: number;
    size: number;        // initial diameter px
    finalScale: number;  // how large the ring grows
    duration: number;    // seconds
    driftX: number;      // px drift while expanding
    driftY: number;      // px drift (upward)
    borderColor: string;
}

let uid = 0;

export default function HeroBubbles({
    containerRef,
    className = "",
}: {
    containerRef: RefObject<HTMLElement | null>;
    className?: string;
}) {
    const [rings, setRings] = useState<Ring[]>([]);
    const lastX = useRef(-9999);
    const lastY = useRef(-9999);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const spawn = (cx: number, cy: number) => {
            // Alternate between white and subtle cyan tones for variety
            const isCyan = Math.random() > 0.55;
            const borderOpacity = 0.18 + Math.random() * 0.18;
            const borderColor = isCyan
                ? `rgba(123, 85, 234,${borderOpacity})`
                : `rgba(255,255,255,${borderOpacity})`;

            setRings((prev) => [
                ...prev.slice(-22),
                {
                    id: uid++,
                    // Natural random offset so rings don't all stack on the exact cursor
                    x: cx + (Math.random() - 0.5) * 22,
                    y: cy + (Math.random() - 0.5) * 22,
                    size: 26 + Math.random() * 50,   // 26–76 px initial diameter
                    finalScale: 2.6 + Math.random() * 1.8,
                    duration: 0.9 + Math.random() * 0.75,
                    driftX: (Math.random() - 0.5) * 26,
                    driftY: -(5 + Math.random() * 16),
                    borderColor,
                },
            ]);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const dx = cx - lastX.current;
            const dy = cy - lastY.current;
            // Spawn every ~10px of movement
            if (dx * dx + dy * dy < 100) return;
            lastX.current = cx;
            lastY.current = cy;
            spawn(cx, cy);
        };

        container.addEventListener("mousemove", onMouseMove);
        return () => container.removeEventListener("mousemove", onMouseMove);
    }, [containerRef]);

    const remove = useCallback((id: number) => {
        setRings((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        >
            {rings.map((ring) => (
                <motion.div
                    key={ring.id}
                    initial={{ scale: 0.12, opacity: 0.55 }}
                    animate={{ scale: ring.finalScale, opacity: 0, x: ring.driftX, y: ring.driftY }}
                    transition={{ duration: ring.duration, ease: [0.08, 0.55, 0.25, 1] }}
                    onAnimationComplete={() => remove(ring.id)}
                    style={{
                        position: "absolute",
                        left: ring.x,
                        top: ring.y,
                        width: ring.size,
                        height: ring.size,
                        marginLeft: -ring.size / 2,
                        marginTop: -ring.size / 2,
                        borderRadius: "50%",
                        border: `1px solid ${ring.borderColor}`,
                        filter: "blur(0.6px)",
                        willChange: "transform, opacity",
                    }}
                />
            ))}
        </div>
    );
}


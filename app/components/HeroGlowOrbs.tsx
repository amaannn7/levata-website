"use client";

import { useEffect, useState, type RefObject } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
    useTransform,
} from "framer-motion";

const SPRING = { stiffness: 50, damping: 22, mass: 0.7 } as const;

type Orb = {
    color: string;
    size: string;
    blur: number;
    pos: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
    };
    mouseMultX: number;
    mouseMultY: number;
    idleAmp: number;
    idleDuration: number;
};

const FULL_ORBS: Orb[] = [
    {
        color: "rgba(75,145,247,0.42)",
        size: "clamp(420px, 50vw, 720px)",
        blur: 80,
        pos: { top: "-15%", left: "-12%" },
        mouseMultX: 40,
        mouseMultY: 30,
        idleAmp: 16,
        idleDuration: 9,
    },
    {
        color: "rgba(75,145,247,0.36)",
        size: "clamp(360px, 44vw, 620px)",
        blur: 70,
        pos: { bottom: "-18%", right: "-10%" },
        mouseMultX: -32,
        mouseMultY: -24,
        idleAmp: 14,
        idleDuration: 11,
    },
    {
        color: "rgba(187,0,255,0.26)",
        size: "clamp(260px, 28vw, 380px)",
        blur: 50,
        pos: { top: "30%", left: "55%" },
        mouseMultX: 24,
        mouseMultY: 18,
        idleAmp: 10,
        idleDuration: 7,
    },
];

const SUBTLE_ORBS: Orb[] = [
    {
        color: "rgba(75,145,247,0.42)",
        size: "clamp(420px, 50vw, 720px)",
        blur: 70,
        pos: { top: "-12%", left: "-10%" },
        mouseMultX: 28,
        mouseMultY: 20,
        idleAmp: 12,
        idleDuration: 10,
    },
    {
        color: "rgba(75,145,247,0.36)",
        size: "clamp(360px, 44vw, 620px)",
        blur: 60,
        pos: { bottom: "-14%", right: "-8%" },
        mouseMultX: -24,
        mouseMultY: -16,
        idleAmp: 10,
        idleDuration: 12,
    },
];

function OrbItem({
    orb,
    index,
    sx,
    sy,
    interactive,
}: {
    orb: Orb;
    index: number;
    sx: ReturnType<typeof useSpring>;
    sy: ReturnType<typeof useSpring>;
    interactive: boolean;
}) {
    const x = useTransform(sx, (v) => (interactive ? v * orb.mouseMultX : 0));
    const y = useTransform(sy, (v) => (interactive ? v * orb.mouseMultY : 0));

    return (
        <motion.div
            style={{
                position: "absolute",
                top: orb.pos.top,
                left: orb.pos.left,
                right: orb.pos.right,
                bottom: orb.pos.bottom,
                width: orb.size,
                height: orb.size,
                x,
                y,
                willChange: "transform",
            }}
        >
            <motion.div
                animate={
                    interactive
                        ? {
                            y: [`-${orb.idleAmp}px`, `${orb.idleAmp}px`, `-${orb.idleAmp}px`],
                            x: [
                                `${orb.idleAmp * 0.4}px`,
                                `-${orb.idleAmp * 0.4}px`,
                                `${orb.idleAmp * 0.4}px`,
                            ],
                        }
                        : undefined
                }
                transition={
                    interactive
                        ? {
                            duration: orb.idleDuration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.6,
                        }
                        : undefined
                }
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                    filter: `blur(${orb.blur}px)`,
                    mixBlendMode: "screen",
                }}
            />
        </motion.div>
    );
}

export default function HeroGlowOrbs({
    containerRef,
    density = "subtle",
    className = "",
}: {
    containerRef: RefObject<HTMLElement | null>;
    density?: "subtle" | "full";
    className?: string;
}) {
    const orbs = density === "full" ? FULL_ORBS : SUBTLE_ORBS;
    const reducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(true);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, SPRING);
    const sy = useSpring(my, SPRING);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (isMobile || reducedMotion) return;
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
            const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
            mx.set(Math.max(-1, Math.min(1, nx)));
            my.set(Math.max(-1, Math.min(1, ny)));
        };
        const reset = () => {
            mx.set(0);
            my.set(0);
        };
        el.addEventListener("pointermove", handler);
        el.addEventListener("pointerleave", reset);
        return () => {
            el.removeEventListener("pointermove", handler);
            el.removeEventListener("pointerleave", reset);
        };
    }, [isMobile, reducedMotion, containerRef, mx, my]);

    const interactive = !reducedMotion;

    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 overflow-hidden z-0 ${className}`}
        >
            {orbs.map((orb, i) => (
                <OrbItem key={i} orb={orb} index={i} sx={sx} sy={sy} interactive={interactive} />
            ))}
        </div>
    );
}

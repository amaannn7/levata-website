"use client";

import { useEffect, useRef } from "react";

type ColorPreset = "purple" | "teal" | "magenta";
type Intensity = "subtle" | "default" | "strong";

type Props = {
    /** Brand color preset, or custom { edge, mid } RGBs ("R,G,B") */
    color?: ColorPreset | { edge: string; mid: string };
    /** Line density + max opacity */
    intensity?: Intensity;
    /** Height of the bottom band */
    className?: string;
};

const COLOR_PRESETS: Record<ColorPreset, { edge: string; mid: string }> = {
    purple:  { edge: "123,85,234",  mid: "167,139,250" },
    teal:    { edge: "34,211,238",  mid: "94,234,212"  },
    magenta: { edge: "204,1,255",   mid: "232,121,249" },
};

const INTENSITY_PRESETS: Record<Intensity, { lines: number; maxAlpha: number; scrollSeconds: number }> = {
    subtle:  { lines: 8,  maxAlpha: 0.14, scrollSeconds: 12 },
    default: { lines: 14, maxAlpha: 0.22, scrollSeconds: 9 },
    strong:  { lines: 14, maxAlpha: 0.48, scrollSeconds: 7 },
};

export default function HeroHorizon({
    color = "purple",
    intensity = "default",
    className = "h-[200px] md:h-[260px]",
}: Props = {}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visibleRef = useRef(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const palette = typeof color === "string" ? COLOR_PRESETS[color] : color;
        const { lines: LINE_COUNT, maxAlpha, scrollSeconds } = INTENSITY_PRESETS[intensity];

        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let rafId = 0;
        const start = performance.now();
        let staticDrawn = false;

        const resize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            staticDrawn = false; // re-render snapshot on resize
        };
        resize();
        window.addEventListener("resize", resize);

        const observer = new IntersectionObserver(
            (entries) => {
                visibleRef.current = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0 }
        );
        observer.observe(wrapper);

        const drawFrame = (t: number) => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < LINE_COUNT; i++) {
                const offset = (t / scrollSeconds + i / LINE_COUNT) % 1;
                const p = Math.pow(offset, 2.2);
                const y = p * h;

                const fade = Math.sin(offset * Math.PI);
                const alpha = fade * maxAlpha;
                if (alpha < 0.01) continue;

                const grad = ctx.createLinearGradient(0, 0, w, 0);
                grad.addColorStop(0,    "rgba(0,0,0,0)");
                grad.addColorStop(0.2,  `rgba(${palette.edge},${alpha})`);
                grad.addColorStop(0.5,  `rgba(${palette.mid},${alpha * 1.2})`);
                grad.addColorStop(0.8,  `rgba(${palette.edge},${alpha})`);
                grad.addColorStop(1,    "rgba(0,0,0,0)");

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        };

        const loop = () => {
            if (reducedMotion) {
                if (!staticDrawn) {
                    drawFrame(0);
                    staticDrawn = true;
                }
            } else if (visibleRef.current) {
                drawFrame((performance.now() - start) / 1000);
            }
            rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            observer.disconnect();
        };
    }, [color, intensity]);

    return (
        <div
            ref={wrapperRef}
            className={`pointer-events-none absolute bottom-0 left-0 right-0 z-0 ${className}`}
        >
            <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100%", display: "block" }}
            />
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(to top, transparent 0%, transparent 50%, #07080F 100%)",
                }}
            />
        </div>
    );
}

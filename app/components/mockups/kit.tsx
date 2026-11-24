"use client";

// Shared building blocks for the coded product mockups across the site.
// Everything is drawn with theme variables so the screens sit inside Levata's
// dark theme. Mockup data is illustrative; it only shows what each service does.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
export const EASE = [0.16, 1, 0.3, 1] as const;
export const LINE = "rgba(255,255,255,0.06)";
export const CYAN = "var(--accent-secondary)";
export const VIOLET = "var(--accent)";
export const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const STATUS = {
    on: "var(--status-on)",
    warn: "var(--status-warn)",
    off: "var(--status-off)",
} as const;

export const PANEL: React.CSSProperties = { background: "rgba(255,255,255,0.025)", border: `1px solid ${LINE}` };

/** `live` is true while the mockup is on screen and the visitor allows motion. */
export function useLive<T extends Element = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const inView = useInView(ref, { amount: 0.25 });
    const reduced = useReducedMotion();
    return { ref, live: inView && !reduced, reduced: !!reduced };
}

/** Run `fn` every `ms` while `on`. setState happens inside the interval, never in the effect body. */
export function useEvery(on: boolean, ms: number, fn: () => void) {
    const fnRef = useRef(fn);
    useEffect(() => {
        fnRef.current = fn;
    });
    useEffect(() => {
        if (!on) return;
        const id = window.setInterval(() => fnRef.current(), ms);
        return () => window.clearInterval(id);
    }, [on, ms]);
}

export function useTicker(on: boolean, ms: number) {
    const [n, setN] = useState(0);
    useEvery(on, ms, () => setN((x) => x + 1));
    return n;
}

export const money = (n: number, prefix = "$") => `${prefix}${Math.round(n).toLocaleString("en-US")}`;

// ── Window chrome ─────────────────────────────────────────────────────────────

export function Window({
    title,
    right,
    children,
    className = "",
    bodyClassName = "",
    style,
}: {
    title: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    bodyClassName?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div
            className={`lv-mockup relative flex flex-col overflow-hidden rounded-2xl ${className}`}
            style={{
                background: "linear-gradient(180deg, var(--surface-elevated) 0%, var(--surface) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.4), 0 0 60px ${tint(VIOLET, 7)}`,
                ...style,
            }}
        >
            <div className="flex h-9 flex-shrink-0 items-center gap-3 px-3.5" style={{ borderBottom: `1px solid ${LINE}`, background: "rgba(255,255,255,0.02)" }}>
                <span className="flex gap-1.5" aria-hidden>
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                    ))}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-white/45" style={{ fontFamily: MONO }}>
                    {title}
                </span>
                {right}
            </div>
            <div className={`relative min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
        </div>
    );
}

/** A browser frame with an address bar, for websites and stores. */
export function Browser({ url, children, className = "", right }: { url: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
    return (
        <Window
            className={className}
            right={right}
            title={
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-md px-2.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span className="truncate">{url}</span>
                </span>
            }
        >
            {children}
        </Window>
    );
}

// ── Small pieces ──────────────────────────────────────────────────────────────

export function Dot({ color = STATUS.on, pulse = false, size = 6 }: { color?: string; pulse?: boolean; size?: number }) {
    return (
        <span className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }} aria-hidden>
            {pulse && <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: color }} />}
            <span className="relative inline-flex h-full w-full rounded-full" style={{ background: color, boxShadow: `0 0 8px ${tint(color, 60)}` }} />
        </span>
    );
}

export function Chip({ children, color = STATUS.on, className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
    return (
        <span
            className={`inline-flex flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium ${className}`}
            style={{ color, background: tint(color, 10), border: `1px solid ${tint(color, 28)}` }}
        >
            {children}
        </span>
    );
}

export function LivePill({ label = "Live" }: { label?: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-[10px] text-white/50" style={{ fontFamily: MONO }}>
            <Dot pulse size={6} /> {label}
        </span>
    );
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={`text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/35 ${className}`} style={{ fontFamily: MONO }}>
            {children}
        </p>
    );
}

export function Spark({
    values,
    color = CYAN,
    height = 36,
    fill = true,
    className = "",
}: {
    values: number[];
    color?: string;
    height?: number;
    fill?: boolean;
    className?: string;
}) {
    const w = 100;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    const pts = values.map((v, i) => [(i / (values.length - 1)) * w, height - 3 - ((v - min) / span) * (height - 8)]);
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const last = pts[pts.length - 1];
    return (
        <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className={`block w-full ${className}`} style={{ height }} aria-hidden>
            {fill && <path d={`${d} L${w},${height} L0,${height} Z`} fill={tint(color, 12)} />}
            <path d={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
        </svg>
    );
}

export function Meter({ pct, color = CYAN, className = "" }: { pct: number; color?: string; className?: string }) {
    return (
        <div className={`h-1.5 w-full overflow-hidden rounded-full ${className}`} style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
        </div>
    );
}

export function Avatar({ initials, color = CYAN, size = 22 }: { initials: string; color?: string; size?: number }) {
    return (
        <span
            className="inline-flex flex-shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white/85"
            style={{ width: size, height: size, background: tint(color, 18), border: `1px solid ${tint(color, 40)}` }}
        >
            {initials}
        </span>
    );
}

export function Stat({ label, value, sub, subColor }: { label: string; value: React.ReactNode; sub?: React.ReactNode; subColor?: string }) {
    return (
        <div className="min-w-0 rounded-xl px-3 py-2.5" style={PANEL}>
            <Label>{label}</Label>
            <p className="mt-1 truncate text-[17px] font-normal leading-none text-white tabular-nums">{value}</p>
            {sub && (
                <p className="mt-1 truncate text-[10px] text-white/40" style={subColor ? { color: subColor } : undefined}>
                    {sub}
                </p>
            )}
        </div>
    );
}

export function Check({ color = STATUS.on, size = 12 }: { color?: string; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="flex-shrink-0">
            <circle cx="6" cy="6" r="5.5" fill={tint(color, 14)} stroke={tint(color, 50)} />
            <path d="M3.6 6.1l1.6 1.6 3.2-3.4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** Blinking text caret for "typing" animations. */
export function Caret() {
    return <span className="ml-px inline-block h-[1em] w-[1.5px] translate-y-[2px] animate-pulse" style={{ background: CYAN }} aria-hidden />;
}

/** Reveal `text` one character at a time while `on`, then hold. */
export function useTyped(text: string, on: boolean, cps = 38) {
    const [n, setN] = useState(0);
    const [key, setKey] = useState(text);
    if (key !== text) {
        setKey(text);
        setN(0);
    }
    useEvery(on && n < text.length, 1000 / cps, () => setN((x) => Math.min(x + 1, text.length)));
    return on ? text.slice(0, n) : text;
}

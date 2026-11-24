"use client";

// Sable product page: a live, self-playing mockup of Sable in Levata's theme.
// Names, menu and headline figures come from Sable's demo restaurant (Lanka Kitchen).
// Everything else is illustrative and only drives the animation.

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { EASE, MONO, STATUS, tint } from "./sableData";

const AUTOPLAY_MS = 8000;
const LINE = "rgba(255,255,255,0.06)";
const PANEL: React.CSSProperties = { background: "rgba(255,255,255,0.025)", border: `1px solid ${LINE}` };
const rs = (n: number, dp = 0) => `Rs ${n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

// Runs `fn` every `ms` while `on`, so each view can run its own little loop.
function useEvery(on: boolean, ms: number, fn: () => void) {
    const fnRef = useRef(fn);
    useEffect(() => { fnRef.current = fn; });
    useEffect(() => {
        if (!on) return;
        const id = window.setInterval(() => fnRef.current(), ms);
        return () => window.clearInterval(id);
    }, [on, ms]);
}

// A counter that goes up every `ms` while `on`.
function useTicker(on: boolean, ms: number) {
    const [n, setN] = useState(0);
    useEvery(on, ms, () => setN((x) => x + 1));
    return n;
}

function Title({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
    return (
        <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>{children}</p>
            {right}
        </div>
    );
}

function Pill({ children, color = STATUS.on }: { children: React.ReactNode; color?: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] text-white/70"
            style={{ background: tint(color, 10), border: `1px solid ${tint(color, 30)}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {children}
        </span>
    );
}

// ── 1. Till ───────────────────────────────────────────────────────────────────
type Dish = { name: string; price: number; note?: string };
const MENU: Dish[] = [
    { name: "Chicken kottu", price: 1450, note: "Contains gluten, egg" },
    { name: "Egg kottu", price: 1100 },
    { name: "Cheese kottu", price: 1850 },
    { name: "String hopper set", price: 950 },
    { name: "Egg hopper", price: 180 },
    { name: "Lamprais", price: 1950, note: "Contains egg, fish, gluten" },
    { name: "Chicken rice and curry", price: 1250 },
    { name: "Fish bun", price: 160 },
    { name: "Vegetable roti", price: 140 },
    { name: "King coconut", price: 250 },
    { name: "Milk tea", price: 150, note: "Contains milk" },
];
const TILL_SCRIPT = ["Chicken kottu", "String hopper set", "Milk tea", "Milk tea", "Lamprais"];

function TillView({ auto }: { auto: boolean }) {
    const [lines, setLines] = useState<{ name: string; qty: number }[]>([]);
    const [flash, setFlash] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const step = useRef(0);
    const flashTimer = useRef(0);
    useEffect(() => () => window.clearTimeout(flashTimer.current), []);

    const add = (name: string) => {
        setSent(false);
        setFlash(name);
        window.clearTimeout(flashTimer.current);
        flashTimer.current = window.setTimeout(() => setFlash(null), 350);
        setLines((ls) => {
            const i = ls.findIndex((l) => l.name === name);
            if (i === -1) return [...ls, { name, qty: 1 }];
            return ls.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
        });
    };

    // Scripted service: ring up a takeaway, send it to the kitchen, start again.
    useEvery(auto, 900, () => {
        const s = step.current++ % (TILL_SCRIPT.length + 4);
        if (s < TILL_SCRIPT.length) add(TILL_SCRIPT[s]);
        else if (s === TILL_SCRIPT.length + 1) setSent(true);
        else if (s === TILL_SCRIPT.length + 3) { setLines([]); setSent(false); }
    });

    const subtotal = lines.reduce((s, l) => s + l.qty * MENU.find((m) => m.name === l.name)!.price, 0);
    const sscl = subtotal * 0.025;
    const vat = (subtotal + sscl) * 0.18;

    return (
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-w-0 flex-col">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-1">
                        {["Takeaway", "Dine-in", "Delivery app"].map((t, i) => (
                            <span key={t} className="rounded-md px-2.5 py-1 text-[11px]" style={i === 0 ? { background: "rgba(255,255,255,0.1)", color: "var(--text-primary)" } : { color: "var(--text-muted)" }}>{t}</span>
                        ))}
                    </div>
                    <Pill>Online · all synced</Pill>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-4">
                    {MENU.map((m) => {
                        const on = flash === m.name;
                        return (
                            <button key={m.name} type="button" onClick={() => add(m.name)}
                                className="flex min-h-[64px] cursor-pointer flex-col justify-between rounded-lg p-2.5 text-left transition-all duration-200"
                                style={{
                                    background: on ? tint("var(--accent-secondary)", 14) : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${on ? tint("var(--accent-secondary)", 50) : LINE}`,
                                    transform: on ? "scale(0.96)" : "scale(1)",
                                }}>
                                <span className="text-[12px] leading-tight text-white/85">{m.name}</span>
                                <span className="text-[10px] tabular-nums text-white/45" style={{ fontFamily: MONO }}>{rs(m.price)}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-auto hidden flex-wrap items-center gap-1.5 pt-4 lg:flex">
                    <span className="mr-1 text-[10px] text-white/35">Takes</span>
                    {["Cash", "Cards", "LankaQR", "Gift cards", "Split bills"].map((x) => (
                        <span key={x} className="rounded-full px-2 py-0.5 text-[10px] text-white/55" style={PANEL}>{x}</span>
                    ))}
                    <span className="ml-auto text-[10px] text-white/35">Receipts in English, Sinhala or Tamil</span>
                </div>
            </div>

            <div className="flex flex-col rounded-xl p-3" style={PANEL}>
                <Title right={<span className="text-[10px] text-white/40">Nugegoda · T25</span>}>Bill</Title>
                <ul className="flex min-h-[120px] flex-1 flex-col gap-1.5 overflow-hidden">
                    <AnimatePresence initial={false}>
                        {lines.length === 0 && (
                            <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-6 text-center text-[11px] text-white/30">Tap a dish to start a bill</motion.li>
                        )}
                        {lines.map((l) => {
                            const d = MENU.find((m) => m.name === l.name)!;
                            return (
                                <motion.li key={l.name} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
                                    className="flex items-start gap-2 text-[11px]">
                                    <span className="w-3 tabular-nums text-white/45" style={{ fontFamily: MONO }}>{l.qty}</span>
                                    <span className="flex-1">
                                        <span className="block text-white/85">{l.name}</span>
                                        {d.note && <span className="block text-[10px]" style={{ color: tint(STATUS.warn, 85) }}>{d.note}</span>}
                                    </span>
                                    <span className="tabular-nums text-white/60" style={{ fontFamily: MONO }}>{(l.qty * d.price).toLocaleString("en-US")}</span>
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ul>
                <div className="mt-2 flex flex-col gap-0.5 border-t pt-2 text-[10px] text-white/45" style={{ borderColor: LINE, fontFamily: MONO }}>
                    <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{rs(subtotal, 2)}</span></div>
                    <div className="flex justify-between"><span>SSCL 2.5%</span><span className="tabular-nums">{rs(sscl, 2)}</span></div>
                    <div className="flex justify-between"><span>VAT 18%</span><span className="tabular-nums">{rs(vat, 2)}</span></div>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-[13px] text-white">Total</span>
                    <span className="text-lg font-thin tabular-nums text-white">{rs(subtotal + sscl + vat, 2)}</span>
                </div>
                <button type="button" onClick={() => lines.length && setSent(true)}
                    className="mt-2 cursor-pointer rounded-lg py-2 text-[11px] font-semibold text-white transition-colors duration-300"
                    style={{ background: sent ? tint(STATUS.on, 16) : "rgba(255,255,255,0.08)", border: `1px solid ${sent ? tint(STATUS.on, 45) : "rgba(255,255,255,0.14)"}` }}>
                    {sent ? "✓ Sent to the kitchen" : "Send to kitchen"}
                </button>
            </div>
        </div>
    );
}

// ── 2. Kitchen screens ────────────────────────────────────────────────────────
type Station = "Kottu and grill" | "Hoppers" | "Drinks";
type Ticket = { id: number; from: string; ref: string; station: Station; items: string[]; allergy?: string; born: number };
const TICKET_POOL: Omit<Ticket, "id" | "born">[] = [
    { from: "Till", ref: "T12", station: "Kottu and grill", items: ["2 × Chicken kottu", "1 × Cheese kottu"], allergy: "No egg: allergy" },
    { from: "Table QR", ref: "T4", station: "Hoppers", items: ["6 × Egg hopper", "1 × String hopper set"] },
    { from: "PickMe Food", ref: "#4471", station: "Drinks", items: ["3 × Milk tea", "2 × King coconut"] },
    { from: "Uber Eats", ref: "#9210", station: "Kottu and grill", items: ["1 × Egg kottu", "1 × Lamprais"] },
    { from: "Till", ref: "T25", station: "Drinks", items: ["2 × Milk tea"], allergy: "Dairy allergy" },
    { from: "Table QR", ref: "T9", station: "Hoppers", items: ["4 × Egg hopper"] },
    { from: "Till", ref: "T2", station: "Kottu and grill", items: ["1 × Chicken rice and curry"], allergy: "Peanut allergy" },
];
const STATIONS: Station[] = ["Kottu and grill", "Hoppers", "Drinks"];

function KitchenView({ live }: { live: boolean }) {
    const [now, setNow] = useState(0);
    const nowRef = useRef(0);
    const [tickets, setTickets] = useState<Ticket[]>(() => TICKET_POOL.slice(0, 4).map((t, i) => ({ ...t, id: i, born: -((4 - i) * 47) })));
    const [soldOut, setSoldOut] = useState(false);
    const next = useRef(4);
    useEvery(live, 1000, () => { nowRef.current += 1; setNow(nowRef.current); });
    useEvery(live, 2600, () => {
        const t = TICKET_POOL[next.current % TICKET_POOL.length];
        const id = next.current++;
        const born = nowRef.current;
        setTickets((ts) => {
            const list = [...ts, { ...t, id, born }];
            // Keep each station to its three newest tickets: the oldest gets bumped.
            return STATIONS.flatMap((s) => list.filter((x) => x.station === s).slice(-3));
        });
    });

    const bump = (id: number) => setTickets((ts) => ts.filter((t) => t.id !== id));
    const age = (born: number) => { const s = Math.max(0, now - born); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                    {["Till", "Table QR", "PickMe Food", "Uber Eats"].map((s) => <span key={s} className="rounded-full px-2 py-0.5 text-[10px] text-white/55" style={PANEL}>{s}</span>)}
                </div>
                <button type="button" onClick={() => setSoldOut((v) => !v)}
                    className="cursor-pointer rounded-full px-2.5 py-1 text-[10px] text-white/75 transition-colors"
                    style={{ background: soldOut ? tint(STATUS.off, 14) : "rgba(255,255,255,0.05)", border: `1px solid ${soldOut ? tint(STATUS.off, 45) : "rgba(255,255,255,0.12)"}` }}>
                    {soldOut ? "Egg kottu · sold out on every till" : "Mark egg kottu sold out"}
                </button>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                {STATIONS.map((s) => (
                    <div key={s} className="flex min-w-0 flex-col gap-2 rounded-xl p-2.5" style={PANEL}>
                        <p className="px-1 text-[10px] uppercase tracking-[0.14em] text-white/45" style={{ fontFamily: MONO }}>{s}</p>
                        <AnimatePresence initial={false}>
                            {tickets.filter((t) => t.station === s).map((t) => (
                                <motion.div key={t.id} layout initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: EASE }}
                                    className="rounded-lg p-2.5"
                                    style={{ background: "var(--surface-elevated)", border: `1px solid ${t.allergy ? tint(STATUS.off, 45) : "rgba(255,255,255,0.08)"}` }}>
                                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px]" style={{ fontFamily: MONO }}>
                                        <span className="truncate text-white/60">{t.from} · {t.ref}</span>
                                        <span className="tabular-nums text-white/40">{age(t.born)}</span>
                                    </div>
                                    {t.items.map((it) => <p key={it} className="text-[11px] leading-snug text-white/85">{it}</p>)}
                                    {t.allergy && <p className="mt-1 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: tint(STATUS.off, 16), color: STATUS.off }}>{t.allergy}</p>}
                                    <button type="button" onClick={() => bump(t.id)} className="mt-1.5 cursor-pointer text-[10px] text-white/40 hover:text-white/75">Bump ✓</button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── 3. Today (back office) ────────────────────────────────────────────────────
const NEEDS = [
    { n: 1, t: "Licence has expired", d: "Liquor licence: renew and record the date", c: STATUS.off },
    { n: 1, t: "Fridge reading out of range", d: "Walk-in chiller: see what was done", c: STATUS.off },
    { n: 20, t: "Bills to approve", d: "Rs 427,989 in total", c: STATUS.warn },
    { n: 2, t: "Records to review", d: "Discounts, refunds, cash or payments", c: STATUS.warn },
    { n: 1, t: "Urgent repair open", d: "Kottu griddle, affecting service", c: STATUS.warn },
    { n: 1, t: "Leave request", d: "From Dilini Jayasuriya", c: STATUS.on },
];
const BILL_STREAM = [2233, 1450, 5080, 950, 3120, 1850, 640, 2790, 4210, 1250];
const WEEK = [{ d: "Thu", v: 5.6 }, { d: "Fri", v: 6.7 }, { d: "Sat", v: 8.3 }, { d: "Sun", v: 8.1 }, { d: "Mon", v: 5.0 }];

function TodayView({ live }: { live: boolean }) {
    const [done, setDone] = useState<Record<number, boolean>>({});
    const tick = useTicker(live, 1100);
    const orders = tick;
    const sales = useMemo(() => Array.from({ length: tick }, (_, i) => BILL_STREAM[i % BILL_STREAM.length]).reduce((a, b) => a + b, 0), [tick]);
    const left = NEEDS.filter((_, i) => !done[i]).length;

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg text-white">Good morning, Rohan</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>Thursday, 12 November</p>
            </div>
            <div className="rounded-xl p-3" style={PANEL}>
                <Title right={<span className="text-[10px] text-white/40">Tap one to clear it</span>}>Needs you ({left})</Title>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
                    {NEEDS.map((x, i) => {
                        const ok = !!done[i];
                        return (
                            <button key={x.t} type="button" onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 text-left transition-all duration-300"
                                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${LINE}`, opacity: ok ? 0.45 : 1 }}>
                                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[12px] tabular-nums text-white"
                                    style={{ background: tint(ok ? STATUS.on : x.c, 14), border: `1px solid ${tint(ok ? STATUS.on : x.c, 35)}` }}>{ok ? "✓" : x.n}</span>
                                <span className="min-w-0">
                                    <span className={`block truncate text-[11px] ${ok ? "text-white/50 line-through" : "text-white/85"}`}>{x.t}</span>
                                    <span className="block truncate text-[10px] text-white/40">{x.d}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col rounded-xl p-3" style={PANEL}>
                    <Title>Yesterday</Title>
                    <p className="text-2xl font-thin tabular-nums text-white">Rs 605,140</p>
                    <p className="text-[10px] text-white/45">271 orders · 2 outlets</p>
                    <div className="mt-auto flex flex-col items-start gap-1.5 pt-3"><Pill>6.1% above forecast</Pill><Pill color={STATUS.off}>6.0% down on last Wednesday</Pill></div>
                </div>
                <div className="flex flex-col rounded-xl p-3" style={PANEL}>
                    <Title right={<Pill>Live</Pill>}>Today so far</Title>
                    <p className="text-2xl font-thin tabular-nums text-white">{rs(sales)}</p>
                    <p className="text-[10px] text-white/45">{orders} orders</p>
                    <div className="mt-auto pt-3">
                        <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <motion.div className="h-full rounded-full" style={{ background: tint("var(--accent-secondary)", 70) }} animate={{ width: `${Math.min(100, (sales / 60000) * 100)}%` }} transition={{ duration: 0.6, ease: EASE }} />
                        </div>
                        <p className="mt-1.5 text-[10px] text-white/40">Against where you usually are by now</p>
                    </div>
                </div>
                <div className="rounded-xl p-3" style={PANEL}>
                    <Title>The week ahead</Title>
                    <div className="flex flex-col gap-2">
                        {WEEK.slice(0, 4).map((w, i) => (
                            <div key={w.d} className="flex items-center gap-2 text-[10px]">
                                <span className="w-7 text-white/55">{w.d}</span>
                                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <motion.span className="absolute inset-y-0 left-0 rounded-full" style={{ background: tint("var(--accent-secondary)", 60) }}
                                        initial={{ width: 0 }} animate={{ width: `${(w.v / 8.5) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 * i, ease: EASE }} />
                                </span>
                                <span className="whitespace-nowrap text-right tabular-nums text-white/70" style={{ fontFamily: MONO }}>Rs {w.v}L</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── 4. Café counter ───────────────────────────────────────────────────────────
const CAFE_NAMES = ["Kenji", "Kasun", "James", "Fatima", "Dinusha", "Nimali", "Ruwan", "Amaya", "Sahan", "Tharushi"];
type Cup = { n: number; name: string };

function CafeView({ live }: { live: boolean }) {
    const [cups, setCups] = useState<{ making: Cup[]; ready: Cup[] }>({
        making: [{ n: 84, name: "Kenji" }, { n: 85, name: "Kasun" }, { n: 86, name: "James" }],
        ready: [{ n: 83, name: "Nimali" }, { n: 82, name: "Dinusha" }, { n: 81, name: "Fatima" }],
    });
    const counter = useRef(87);

    // The oldest cup moves to "ready", the oldest ready cup gets collected, a new order arrives.
    useEvery(live, 1900, () => {
        const n = counter.current++;
        setCups(({ making: [first, ...rest], ready }) => ({
            making: [...rest, { n, name: CAFE_NAMES[n % CAFE_NAMES.length] }],
            ready: first ? [first, ...ready].slice(0, 4) : ready,
        }));
    });
    const { making, ready } = cups;

    return (
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
            <div className="flex flex-col rounded-xl p-4" style={{ ...PANEL, background: "rgba(0,0,0,0.25)" }}>
                <div className="mb-4 flex items-baseline justify-between">
                    <p className="text-[13px] text-white">Collection screen</p>
                    <p className="text-[10px] text-white/40">Lagoon Café, Negombo</p>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4">
                    {[{ label: "Being made", list: making, on: false }, { label: "Ready to collect", list: ready, on: true }].map((col) => (
                        <div key={col.label}>
                            <p className="mb-2 text-[11px] text-white/55">{col.label}</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {col.list.map((c) => (
                                        <motion.div key={c.n} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.35, ease: EASE }}
                                            className="flex flex-col items-center rounded-xl py-3"
                                            style={col.on
                                                ? { background: tint("var(--accent-secondary)", 14), border: `1px solid ${tint("var(--accent-secondary)", 40)}`, boxShadow: `0 0 24px ${tint("var(--accent-secondary)", 12)}` }
                                                : { background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
                                            <span className="text-3xl font-thin tabular-nums text-white">{c.n}</span>
                                            <span className="text-[10px] text-white/60">{c.name}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="rounded-xl p-3" style={PANEL}>
                    <Title>Counter flow</Title>
                    {["Guest pays first and gives a name", "Order goes to the bar with a number", "Screen shows being made, then ready"].map((s, i) => (
                        <p key={s} className="flex gap-2 py-1 text-[11px] text-white/65"><span className="text-white/35" style={{ fontFamily: MONO }}>0{i + 1}</span>{s}</p>
                    ))}
                </div>
                <div className="rounded-xl p-3" style={PANEL}>
                    <Title>Stamp card · Fatima</Title>
                    <div className="grid grid-cols-5 gap-1.5">
                        {Array.from({ length: 10 }, (_, i) => (
                            <span key={i} className="flex aspect-square items-center justify-center rounded-full text-[10px]"
                                style={i < 7 ? { background: tint("var(--accent-secondary)", 18), border: `1px solid ${tint("var(--accent-secondary)", 50)}`, color: "var(--text-primary)" } : { border: "1px dashed rgba(255,255,255,0.18)" }}>
                                {i < 7 ? "✓" : ""}
                            </span>
                        ))}
                    </div>
                    <p className="mt-2 text-[10px] text-white/45">7 of 10 · the next free drink is 3 away</p>
                </div>
            </div>
        </div>
    );
}

// ── 5. Forecast ───────────────────────────────────────────────────────────────
const FORECAST = [
    { d: "Today", v: 5.7 }, { d: "Fri", v: 6.9, tag: "Pay week" }, { d: "Sat", v: 8.3 }, { d: "Sun", v: 8.1 },
    { d: "Mon", v: 5.0, tag: "Rain" }, { d: "Tue", v: 4.9 }, { d: "Wed", v: 6.0, tag: "Poya" },
];

function ForecastView({ live }: { live: boolean }) {
    const [sel, setSel] = useState(1);
    useEvery(live, 1600, () => setSel((s) => (s + 1) % FORECAST.length));
    const day = FORECAST[sel];

    return (
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="flex flex-col rounded-xl p-4" style={PANEL}>
                <Title right={<Pill>Forecast</Pill>}>Next 7 days</Title>
                <p className="text-2xl font-thin tabular-nums text-white">Rs 4,493,291</p>
                <p className="text-[10px] text-white/45">Likely between Rs 3,580,447 and Rs 5,639,211 · 2,010 orders</p>
                <div className="mt-4 flex flex-1 items-stretch gap-2" style={{ minHeight: 150 }}>
                    {FORECAST.map((f, i) => {
                        const on = i === sel;
                        return (
                            <button key={f.d} type="button" onClick={() => setSel(i)} className="flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-1.5">
                                <span className="flex w-full flex-1 flex-col items-center justify-end gap-1.5">
                                    <span className="text-[9px] tabular-nums text-white/50" style={{ fontFamily: MONO }}>{f.v}L</span>
                                    <motion.span className="w-full max-w-[38px] rounded-md"
                                        style={{ background: on ? "var(--accent-secondary)" : tint("var(--accent-secondary)", 30), boxShadow: on ? `0 0 18px ${tint("var(--accent-secondary)", 40)}` : "none" }}
                                        initial={{ height: "0%" }} animate={{ height: `${(f.v / 8.5) * 85}%` }} transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }} />
                                </span>
                                <span className={`text-[10px] ${on ? "text-white" : "text-white/45"}`}>{f.d}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3 flex min-h-[22px] items-center gap-2 border-t pt-3 text-[11px] text-white/60" style={{ borderColor: LINE }}>
                    <span className="text-white/85">{day.d}</span>
                    <span className="tabular-nums" style={{ fontFamily: MONO }}>Rs {day.v}L</span>
                    {day.tag && <Pill color={STATUS.warn}>Allows for {day.tag.toLowerCase()}</Pill>}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="rounded-xl p-3" style={PANEL}>
                    <Title>How accurate it is</Title>
                    <p className="text-xl font-thin text-white">88.6% <span className="text-[10px] text-white/45">next-day accuracy</span></p>
                    {[{ k: "Sable forecast", v: 89 }, { k: "Same day last week", v: 86 }, { k: "Sable, a week ahead", v: 90 }].map((b) => (
                        <div key={b.k} className="mt-2">
                            <div className="flex justify-between text-[10px] text-white/55"><span>{b.k}</span><span>{b.v}%</span></div>
                            <div className="mt-1 h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                <motion.div className="h-full rounded-full" style={{ background: tint("var(--accent-secondary)", 70) }} initial={{ width: 0 }} animate={{ width: `${b.v}%` }} transition={{ duration: 0.9, ease: EASE }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex-1 rounded-xl p-3" style={PANEL}>
                    <Title>Turned into</Title>
                    {["Prep list for the kitchen", "Hour-by-hour staff plan", "Orders for each supplier"].map((s) => (
                        <p key={s} className="flex items-center gap-2 py-1 text-[11px] text-white/65"><span style={{ color: "var(--accent-secondary)" }}>→</span>{s}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 6. Food cost ──────────────────────────────────────────────────────────────
const DISHES = [
    { name: "Chicken kottu", price: 1450, cost: 435, chicken: true },
    { name: "Chicken rice and curry", price: 1250, cost: 400, chicken: true },
    { name: "Lamprais", price: 1950, cost: 702, chicken: true },
    { name: "Cheese kottu", price: 1850, cost: 555, chicken: false },
    { name: "String hopper set", price: 950, cost: 247, chicken: false },
];
const SUPPLIERS = [
    { name: "Colombo Dairy and Drinks", onTime: 100, inFull: 99 },
    { name: "Corner Bakery", onTime: 100, inFull: 100 },
    { name: "Island Poultry", onTime: 94, inFull: 88 },
];

function FoodCostView({ auto }: { auto: boolean }) {
    // 0 = normal, 1 = supplier price rise flagged, 2 = new prices applied
    const [stage, setStage] = useState(0);
    useEvery(auto, 2400, () => setStage((s) => (s + 1) % 3));

    const rows = DISHES.map((d) => {
        const cost = stage > 0 && d.chicken ? Math.round(d.cost * 1.12) : d.cost;
        const price = stage === 2 && d.chicken ? Math.ceil((cost / 0.3) / 50) * 50 : d.price;
        return { ...d, cost, price, pct: (cost / price) * 100, hit: stage === 1 && d.chicken };
    });

    return (
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="flex flex-col rounded-xl p-3" style={PANEL}>
                <Title right={stage === 0 ? <Pill>All dishes on target</Pill> : stage === 1 ? <Pill color={STATUS.warn}>3 dishes hit</Pill> : <Pill>New prices applied</Pill>}>Food cost, plate by plate</Title>
                <AnimatePresence>
                    {stage === 1 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px]" style={{ background: tint(STATUS.warn, 8), border: `1px solid ${tint(STATUS.warn, 30)}` }}>
                                <span className="text-white/80">Island Poultry raised chicken by 12%. Three dishes are now above 30% food cost.</span>
                                <button type="button" onClick={() => setStage(2)} className="cursor-pointer rounded-md px-2 py-1 text-[10px] font-semibold text-white" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>Use suggested prices</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="grid grid-cols-[minmax(0,1fr)_70px_60px_80px] gap-2 border-b pb-1.5 text-[9px] uppercase tracking-[0.12em] text-white/35" style={{ borderColor: LINE, fontFamily: MONO }}>
                    <span>Dish</span><span className="text-right">Price</span><span className="text-right">Cost</span><span className="text-right">Food cost</span>
                </div>
                {rows.map((r) => (
                    <div key={r.name} className="grid grid-cols-[minmax(0,1fr)_70px_60px_80px] items-center gap-2 border-b py-2 text-[11px]" style={{ borderColor: LINE }}>
                        <span className="truncate text-white/85">{r.name}</span>
                        <span className="text-right tabular-nums text-white/70" style={{ fontFamily: MONO }}>{r.price.toLocaleString("en-US")}</span>
                        <span className="text-right tabular-nums text-white/50" style={{ fontFamily: MONO }}>{r.cost}</span>
                        <span className="flex items-center justify-end gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full transition-colors duration-500" style={{ background: r.pct > 30.5 ? STATUS.warn : STATUS.on }} />
                            <span className="tabular-nums text-white/80" style={{ fontFamily: MONO }}>{r.pct.toFixed(1)}%</span>
                        </span>
                    </div>
                ))}
                <div className="mt-auto grid grid-cols-1 gap-2 pt-4 sm:grid-cols-3">
                    {[["Recipes costed", "Every dish"], ["Target food cost", "30%"], ["Checked against", "Every supplier bill"]].map(([k, v]) => (
                        <div key={k} className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${LINE}` }}>
                            <p className="text-[10px] text-white/40">{k}</p>
                            <p className="text-[12px] text-white/80">{v}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rounded-xl p-3" style={PANEL}>
                <Title>Supplier scorecards</Title>
                {SUPPLIERS.map((s) => (
                    <div key={s.name} className="mb-3">
                        <p className="text-[11px] text-white/80">{s.name}</p>
                        {[{ k: "On time", v: s.onTime }, { k: "In full", v: s.inFull }].map((b) => (
                            <div key={b.k} className="mt-1 flex items-center gap-2 text-[9px] text-white/45">
                                <span className="w-12 whitespace-nowrap">{b.k}</span>
                                <span className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <motion.span className="block h-full rounded-full" style={{ background: b.v < 95 ? STATUS.warn : tint("var(--accent-secondary)", 70) }} initial={{ width: 0 }} animate={{ width: `${b.v}%` }} transition={{ duration: 0.8, ease: EASE }} />
                                </span>
                                <span className="w-7 text-right tabular-nums">{b.v}%</span>
                            </div>
                        ))}
                    </div>
                ))}
                <p className="text-[10px] text-white/40">Short deliveries become claims automatically.</p>
            </div>
        </div>
    );
}

// ── 7. Rosters and payroll ────────────────────────────────────────────────────
const STAFF = ["Chaminda Silva", "Dilini Jayasuriya", "Kumar Rajan", "Nimal Fernando", "Saman Bandara"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const OFF: Record<string, number[]> = { "Chaminda Silva": [0], "Dilini Jayasuriya": [1], "Kumar Rajan": [2], "Nimal Fernando": [0, 3], "Saman Bandara": [4] };
const PIN_SCRIPT = ["", "•", "••", "•••", "••••", "ok", "ok", ""];

function PeopleView({ live }: { live: boolean }) {
    const tick = useTicker(live, 700);
    const pin = PIN_SCRIPT[tick % PIN_SCRIPT.length];

    return (
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
            <div className="flex min-w-0 flex-col rounded-xl p-3" style={PANEL}>
                <Title right={<span className="text-[10px] text-white/40">Mon 9 to Sun 15</span>}>Roster</Title>
                <div className="helm-scroll overflow-x-auto">
                    <div className="min-w-[460px]">
                        <div className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] gap-1 pb-1 text-[9px] uppercase tracking-[0.12em] text-white/35" style={{ fontFamily: MONO }}>
                            <span>Person</span>{DAYS.map((d) => <span key={d} className="text-center">{d}</span>)}
                        </div>
                        {STAFF.map((p, r) => (
                            <div key={p} className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))] items-center gap-1 py-1">
                                <span className="truncate text-[11px] text-white/75">{p}</span>
                                {DAYS.map((d, c) => {
                                    const off = OFF[p]?.includes(c);
                                    return (
                                        <motion.span key={d} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: (r * 7 + c) * 0.012 }}
                                            className="rounded px-0.5 py-1 text-center text-[8px] tabular-nums"
                                            style={off ? { color: "var(--text-disabled)", border: "1px dashed rgba(255,255,255,0.1)" } : { background: tint("var(--accent-secondary)", 10), border: `1px solid ${tint("var(--accent-secondary)", 25)}`, color: "var(--text-secondary)", fontFamily: MONO }}>
                                            {off ? "off" : "10–18:30"}
                                        </motion.span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="mt-2 text-[10px] text-white/40">Hours, overtime, leave and service charge flow into payroll.</p>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 sm:grid-cols-4">
                    {[["Rostered", "29 shifts"], ["Clocked in today", "4 of 5"], ["Leave requests", "1 waiting"], ["Payroll", "Ready on the 25th"]].map(([k, v]) => (
                        <div key={k} className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${LINE}` }}>
                            <p className="text-[10px] text-white/40">{k}</p>
                            <p className="text-[12px] text-white/80">{v}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="rounded-xl p-3" style={PANEL}>
                    <Title>Clock in · Till 1</Title>
                    <div className="flex h-10 items-center justify-center rounded-lg text-lg tracking-[0.4em] text-white" style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${LINE}` }}>
                        {pin === "ok" ? <span className="text-[12px] tracking-normal text-white/85">✓ Dilini · 9:58 am</span> : pin || <span className="text-[11px] tracking-normal text-white/30">Enter PIN</span>}
                    </div>
                </div>
                <div className="flex-1 rounded-xl p-3" style={PANEL}>
                    <Title right={<Pill>Sent</Pill>}>Payslip · Dilini</Title>
                    {[["Basic pay", "65,000"], ["Overtime", "6,200"], ["Service charge", "18,400"], ["EPF 8%", "−5,200"], ["APIT", "0"]].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-0.5 text-[11px] text-white/55"><span>{k}</span><span className="tabular-nums" style={{ fontFamily: MONO }}>{v}</span></div>
                    ))}
                    <div className="mt-1 flex justify-between border-t pt-1.5 text-[12px] text-white" style={{ borderColor: LINE }}><span>Net pay</span><span className="tabular-nums" style={{ fontFamily: MONO }}>Rs 84,400</span></div>
                    <p className="mt-1.5 text-[10px] text-white/40">Employer EPF 12% and ETF 3% on the returns.</p>
                </div>
            </div>
        </div>
    );
}

// ── 8. Books ──────────────────────────────────────────────────────────────────
const KPIS = [
    { k: "Sales", v: "Rs 18,513,914" }, { k: "Gross profit", v: "68.9%" }, { k: "Staff costs", v: "19.3%" },
    { k: "Prime cost", v: "50.3%" }, { k: "Net profit", v: "Rs 4,777,785" },
];
const POSTINGS = [
    { what: "Bill NUG-H01-007308", amt: "5,079.90", to: "Sales · SSCL · VAT" },
    { what: "LankaQR payout matched", amt: "224,470.00", to: "Bank" },
    { what: "Island Poultry bill", amt: "48,200.00", to: "Food stock · Bills to pay" },
    { what: "Bill COL7-H01-006682", amt: "3,286.00", to: "Sales · SSCL · VAT" },
    { what: "Card payout matched", amt: "131,905.00", to: "Bank" },
    { what: "Cash drawer closed, Till 1", amt: "−400.00", to: "Cash difference" },
    { what: "Payroll posted", amt: "1,184,300.00", to: "Staff costs · EPF · ETF" },
];

function BooksView({ live }: { live: boolean }) {
    const tick = useTicker(live, 1500);
    const feed = Array.from({ length: 4 }, (_, i) => ({ ...POSTINGS[(tick + i) % POSTINGS.length], key: tick + i })).reverse();

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
                {KPIS.map((k, i) => (
                    <motion.div key={k.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }} className="rounded-xl p-3" style={PANEL}>
                        <p className="text-[10px] text-white/45">{k.k}</p>
                        <p className="mt-1 text-[15px] font-thin tabular-nums text-white">{k.v}</p>
                    </motion.div>
                ))}
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="flex flex-col overflow-hidden rounded-xl p-3" style={PANEL}>
                    <Title right={<Pill>Posting live</Pill>}>Journal</Title>
                    <ul className="flex flex-col gap-1.5">
                        <AnimatePresence initial={false} mode="popLayout">
                            {feed.map((p) => (
                                <motion.li key={p.key} layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}
                                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${LINE}` }}>
                                    <span className="min-w-0">
                                        <span className="block truncate text-[11px] text-white/80">{p.what}</span>
                                        <span className="block truncate text-[10px] text-white/40">→ {p.to}</span>
                                    </span>
                                    <span className="text-[11px] tabular-nums text-white/70" style={{ fontFamily: MONO }}>{p.amt}</span>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="rounded-xl p-3" style={PANEL}>
                        <Title>Cash position</Title>
                        <p className="text-xl font-thin tabular-nums text-white">Rs 29,573,188</p>
                        <p className="text-[10px] text-white/45">Bank, safes and drawers</p>
                    </div>
                    <div className="flex-1 rounded-xl p-3" style={PANEL}>
                        <Title>Ready to file</Title>
                        <p className="text-[11px] text-white/65">VAT and SSCL for October</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {["Xero", "QuickBooks", "Tally"].map((x) => <span key={x} className="rounded-md px-2 py-1 text-[10px] text-white/65" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>Export to {x}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
type ViewId = "till" | "kitchen" | "today" | "cafe" | "forecast" | "cost" | "people" | "books";
const VIEWS: { id: ViewId; label: string; caption: string }[] = [
    { id: "till", label: "Till", caption: "A till that never misses a bill. Tap the dishes to ring one up." },
    { id: "kitchen", label: "Kitchen", caption: "Orders from the till, guest phones and delivery apps reach the right station, allergies in red." },
    { id: "today", label: "Today", caption: "The back office opens on what needs a decision. Tap an item to clear it." },
    { id: "cafe", label: "Café counter", caption: "Pay first, give a name, collect when the number turns ready." },
    { id: "forecast", label: "Forecast", caption: "Tomorrow, already planned: a forecast that allows for poya days, holidays, pay week and rain." },
    { id: "cost", label: "Food cost", caption: "When a supplier raises a price, Sable flags the dishes it hurts and suggests new prices." },
    { id: "people", label: "People", caption: "PIN clock-in at the till, rosters and payroll under Sri Lankan rules." },
    { id: "books", label: "Books", caption: "Every sale, bill and payment is posted as it happens." },
];

function NavIcon({ id }: { id: ViewId }) {
    const p = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            {id === "till" && <><rect x="3" y="4" width="18" height="12" rx="2" {...p} /><path d="M7 20h10M9 8h6M9 12h3" {...p} /></>}
            {id === "kitchen" && <><path d="M6 13a6 6 0 0112 0H6zM4 16h16M12 5v2" {...p} /></>}
            {id === "today" && <><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" {...p} /></>}
            {id === "cafe" && <><path d="M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5V8zM16 10h2a2 2 0 010 4h-2" {...p} /></>}
            {id === "forecast" && <><path d="M4 20V10M10 20V5M16 20v-7M22 20H2" {...p} /></>}
            {id === "cost" && <><path d="M3 12V4h8l10 10-8 8L3 12z" {...p} /><circle cx="7.5" cy="8.5" r="1.3" {...p} /></>}
            {id === "people" && <><circle cx="9" cy="8" r="3.5" {...p} /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a3 3 0 000-6M21 20c0-2.4-1.4-4.4-3.5-5.4" {...p} /></>}
            {id === "books" && <><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" {...p} /><path d="M9 9h6M9 13h4" {...p} /></>}
        </svg>
    );
}

export default function SableDashboard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { margin: "-15% 0px" });
    const reduced = !!useReducedMotion();
    const [view, setView] = useState<ViewId>("till");
    // The content window has a fixed height (so the page never jumps); start each view at its top.
    const panelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        panelRef.current?.scrollTo({ top: 0 });
    }, [view]);
    const [autoplay, setAutoplay] = useState(true);

    const live = inView && !reduced;
    const touring = autoplay && live;

    useEffect(() => {
        if (!touring) return;
        const t = window.setTimeout(() => setView((v) => VIEWS[(VIEWS.findIndex((x) => x.id === v) + 1) % VIEWS.length].id), AUTOPLAY_MS);
        return () => window.clearTimeout(t);
    }, [touring, view]);

    const stopTour = () => setAutoplay(false);
    const pick = (id: ViewId) => { stopTour(); setView(id); };
    const current = VIEWS.find((v) => v.id === view)!;

    return (
        <div ref={ref} className="relative mx-auto w-full max-w-[1120px]" data-no-reveal>
            <div aria-hidden className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[40px]"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${tint("var(--accent)", 14)} 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 90%, ${tint("var(--accent-secondary)", 7)} 0%, transparent 70%)` }} />

            <div className="relative overflow-hidden rounded-2xl"
                style={{ background: "var(--home-card-bg)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 30px 90px rgba(0,0,0,0.55), 0 0 0 1px ${tint("var(--accent)", 6)}` }}
                onPointerDown={stopTour}>
                {/* Window bar */}
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5" style={{ borderColor: LINE }}>
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="hidden gap-1.5 sm:flex">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />)}</div>
                        <span className="flex items-center gap-2 truncate text-[11px] text-white/50" style={{ fontFamily: MONO }}>
                            <span className="text-white/80">sable</span><span className="text-white/25">/</span><span className="truncate">lanka-kitchen</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-[10px] text-white/40 md:inline" style={{ fontFamily: MONO }}>2 outlets · Nugegoda, Colombo 7</span>
                        <span className="hidden gap-0.5 rounded-md p-0.5 text-[10px] sm:flex" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
                            {["EN", "සිං", "தமி"].map((l, i) => <span key={l} className="rounded px-1.5 py-0.5" style={i === 0 ? { background: "rgba(255,255,255,0.1)", color: "var(--text-primary)" } : { color: "var(--text-muted)" }}>{l}</span>)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                    <nav aria-label="Sable demo views" className="border-b md:border-b-0 md:border-r" style={{ borderColor: LINE }}>
                        <div className="helm-scroll flex gap-1 overflow-x-auto p-2 md:flex-col md:p-3" role="tablist">
                            {VIEWS.map((v) => {
                                const active = v.id === view;
                                return (
                                    <button key={v.id} type="button" role="tab" aria-selected={active} onClick={() => pick(v.id)}
                                        className="relative flex flex-shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-left text-[12px] font-medium transition-colors duration-200"
                                        style={{ background: active ? "rgba(255,255,255,0.06)" : "transparent", color: active ? "var(--text-primary)" : "var(--text-muted)" }}>
                                        {active && <motion.span layoutId="sable-nav-marker" aria-hidden className="absolute left-0 top-1/2 hidden h-4 w-[3px] -translate-y-1/2 rounded-r-full md:block" style={{ background: "var(--accent-secondary)" }} />}
                                        <NavIcon id={v.id} />
                                        <span className="whitespace-nowrap">{v.label}</span>
                                        {active && touring && (
                                            <motion.span key={`${v.id}-progress`} aria-hidden className="absolute bottom-0 left-0 h-px" style={{ background: tint("var(--accent-secondary)", 70) }}
                                                initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="hidden px-5 pb-4 pt-6 text-[10px] leading-relaxed text-white/30 md:block">
                            {autoplay ? "Touring the demo. Click anything to take over." : "Demo data for Lanka Kitchen, Sable's sample restaurant."}
                        </p>
                    </nav>

                    <div className="flex min-w-0 flex-col">
                        <div ref={panelRef} data-lenis-prevent className="relative h-[640px] overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:h-[540px] md:overflow-hidden">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div key={view} className="h-full" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
                                    {view === "till" && <TillView auto={touring} />}
                                    {view === "kitchen" && <KitchenView live={live} />}
                                    {view === "today" && <TodayView live={live} />}
                                    {view === "cafe" && <CafeView live={live} />}
                                    {view === "forecast" && <ForecastView live={touring} />}
                                    {view === "cost" && <FoodCostView auto={touring} />}
                                    {view === "people" && <PeopleView live={live} />}
                                    {view === "books" && <BooksView live={live} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex h-[76px] items-center border-t px-4 py-2.5 sm:h-[60px] sm:px-5" style={{ borderColor: LINE }} aria-live="polite">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.p key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="line-clamp-3 text-[12px] text-white/55 sm:line-clamp-2">
                                    <span className="text-white/85">{current.label}.</span> {current.caption}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

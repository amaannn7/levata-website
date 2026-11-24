"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BILL, EASE, MONO, PERMISSIONS, POYA_MENU, RIPPLE, STATUS, tint } from "./sableData";

const CARD: React.CSSProperties = { background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" };
const INSET: React.CSSProperties = { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" };

// ── Small shared bits ─────────────────────────────────────────────────────────
function Dot({ color, pulse = false }: { color: string; pulse?: boolean }) {
    return (
        <span className="relative flex h-2 w-2 flex-shrink-0">
            {pulse && <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: color }} />}
            <span className="relative h-2 w-2 rounded-full" style={{ background: color }} />
        </span>
    );
}

function Check({ color = STATUS.on, size = 18 }: { color?: string; size?: number }) {
    return (
        <span className="flex flex-shrink-0 items-center justify-center rounded-full"
            style={{ width: size, height: size, background: tint(color, 12), border: `1px solid ${tint(color, 45)}` }}>
            <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 10 10" fill="none" aria-hidden>
                <path d="M2 5.2l2 2L8 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className="flex cursor-pointer items-center gap-3 text-caption text-white/70 transition-colors duration-200 hover:text-white"
        >
            <span className="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300"
                style={{ background: on ? tint(STATUS.warn, 30) : "rgba(255,255,255,0.08)", border: `1px solid ${on ? tint(STATUS.warn, 60) : "rgba(255,255,255,0.14)"}` }}>
                <motion.span
                    className="absolute top-[3px] h-4 w-4 rounded-full"
                    style={{ background: "var(--text-primary)" }}
                    animate={{ left: on ? 22 : 3 }}
                    transition={{ duration: 0.25, ease: EASE }}
                />
            </span>
            {label}
        </button>
    );
}

// ── 1. One sale, everywhere at once ───────────────────────────────────────────
export function OneRecord() {
    // -1 = bill still open; n = first n destinations updated.
    const [step, setStep] = useState(-1);
    const timers = useRef<number[]>([]);

    const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
    useEffect(() => clear, []);

    const run = () => {
        clear();
        setStep(0);
        RIPPLE.forEach((_, i) => {
            timers.current.push(window.setTimeout(() => setStep(i + 1), 300 + i * 360));
        });
    };
    const reset = () => { clear(); setStep(-1); };

    const closed = step >= 0;
    const done = step >= RIPPLE.length;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" data-no-reveal>
            {/* Bill */}
            <div className="flex flex-col rounded-2xl p-5 sm:p-6" style={CARD}>
                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>
                        {BILL.outlet} · {BILL.table} · Takeaway
                    </p>
                    <span className="flex items-center gap-1.5 text-[11px] text-white/50">
                        <Dot color={closed ? STATUS.on : STATUS.warn} />
                        {closed ? "Paid" : "Open"}
                    </span>
                </div>

                <ul className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    {BILL.items.map((it) => (
                        <li key={it.name} className="flex items-start gap-3 py-2.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <span className="w-4 text-[12px] tabular-nums text-white/45" style={{ fontFamily: MONO }}>{it.qty}</span>
                            <span className="flex-1">
                                <span className="block text-[13px] text-white/85">{it.name}</span>
                                {it.note && <span className="block text-[11px] text-white/40">{it.note}</span>}
                            </span>
                            <span className="text-[12px] tabular-nums text-white/70" style={{ fontFamily: MONO }}>Rs {it.price}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-3 flex flex-col gap-1 border-t pt-3 text-[12px]" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    {[["Subtotal", BILL.subtotal], ["SSCL 2.5%", BILL.sscl], ["VAT 18%", BILL.vat]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-white/50">
                            <span>{k}</span><span className="tabular-nums" style={{ fontFamily: MONO }}>Rs {v}</span>
                        </div>
                    ))}
                    <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-body text-white">Total</span>
                        <span className="text-2xl font-thin tabular-nums text-white">Rs {BILL.total}</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-4">
                    {!closed ? (
                        <button type="button" onClick={run} data-cta="primary"
                            className="relative inline-flex cursor-pointer items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white">
                            Close the bill →
                        </button>
                    ) : (
                        <button type="button" onClick={reset}
                            className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
                            Run it again
                        </button>
                    )}
                    <span className="text-caption text-white/40">{closed ? "One sale, five places, same moment." : "Close it and watch what updates."}</span>
                </div>
            </div>

            {/* Where the sale lands */}
            <div className="relative flex flex-col rounded-2xl p-5 sm:p-6" style={CARD}>
                <p className="mb-4 text-eyebrow text-white/40">Where the sale goes</p>
                <ol className="relative flex flex-1 flex-col justify-between gap-2">
                    <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <motion.span
                        aria-hidden
                        className="absolute left-[19px] top-6 w-px origin-top"
                        style={{ background: "var(--accent-secondary)", height: "calc(100% - 3rem)" }}
                        animate={{ scaleY: closed ? Math.min(step, RIPPLE.length - 1) / (RIPPLE.length - 1) : 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                    />
                    {RIPPLE.map((r, i) => {
                        const lit = step > i;
                        return (
                            <li key={r.key} className="relative flex items-center gap-4 rounded-xl px-3 py-3 transition-colors duration-300"
                                style={{ background: lit ? tint("var(--accent-secondary)", 5) : "transparent", border: `1px solid ${lit ? tint("var(--accent-secondary)", 22) : "transparent"}` }}>
                                <span className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                                    style={{ background: lit ? "var(--accent-secondary)" : "var(--surface-elevated)", border: `1px solid ${lit ? "var(--accent-secondary)" : "rgba(255,255,255,0.2)"}`, boxShadow: lit ? `0 0 12px ${tint("var(--accent-secondary)", 50)}` : "none" }} />
                                <span className="min-w-0 flex-1">
                                    <span className="block text-[13px] text-white/85">{r.label}</span>
                                    <span className={`block text-[12px] transition-colors duration-300 ${lit ? "text-white/60" : "text-white/30"}`}>
                                        {lit ? r.done : closed ? "Updating…" : "Waiting for the sale"}
                                    </span>
                                </span>
                            </li>
                        );
                    })}
                </ol>
                <p className={`mt-4 text-caption transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`} aria-live="polite">
                    <span className="text-white/80">Nothing to reconcile at midnight.</span>{" "}
                    <span className="text-white/45">The till, kitchen and back office share one set of books.</span>
                </p>
            </div>
        </div>
    );
}

// ── 3. Ask Sable: a change only happens once you confirm ──────────────────────
export function AskSable() {
    const [stage, setStage] = useState<"idle" | "confirm" | "done">("idle");

    return (
        <div className="flex flex-col gap-3" data-no-reveal>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ ...INSET, borderColor: stage === "idle" ? "rgba(255,255,255,0.14)" : tint("var(--accent-secondary)", 35) }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span className="flex-1 truncate text-[13px] text-white/80">Mark egg kottu sold out</span>
                <button
                    type="button"
                    onClick={() => setStage("confirm")}
                    disabled={stage !== "idle"}
                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:cursor-default disabled:opacity-40"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                    Ask
                </button>
            </div>

            <div className="min-h-[124px]" aria-live="polite">
                <AnimatePresence mode="wait">
                    {stage === "idle" && (
                        <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-1 pt-2 text-caption text-white/40">
                            Press Ask to see what happens next.
                        </motion.p>
                    )}
                    {stage === "confirm" && (
                        <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25, ease: EASE }}
                            className="rounded-xl p-4" style={INSET}>
                            <p className="text-[13px] text-white/85">Mark Egg kottu sold out on every till?</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <button type="button" onClick={() => setStage("done")}
                                    className="cursor-pointer rounded-lg px-3.5 py-2 text-xs font-semibold text-white"
                                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}>
                                    Yes, mark it sold out
                                </button>
                                <button type="button" onClick={() => setStage("idle")} className="cursor-pointer text-xs text-white/45 hover:text-white/75">Not now</button>
                                <span className="text-[11px] text-white/40">Nothing changes until you confirm.</span>
                            </div>
                        </motion.div>
                    )}
                    {stage === "done" && (
                        <motion.div key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
                            className="rounded-xl p-4" style={{ ...INSET, borderColor: tint(STATUS.on, 30) }}>
                            <p className="flex items-center gap-2.5 text-[13px] text-white/85"><Check size={18} />Egg kottu is sold out on every till.</p>
                            <p className="mt-2 text-[11px] text-white/40" style={{ fontFamily: MONO }}>Logged · changed by you · just now</p>
                            <button type="button" onClick={() => setStage("idle")} className="mt-3 cursor-pointer text-xs text-white/45 hover:text-white/75">Reset</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── 4. Poya day: alcohol locks on every till ──────────────────────────────────
export function PoyaTill() {
    const [poya, setPoya] = useState(false);

    return (
        <div className="flex h-full flex-col rounded-2xl p-5 sm:p-6" style={CARD} data-no-reveal>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>Till · Colombo 7</p>
                <Switch on={poya} onChange={setPoya} label="Today is a poya day" />
            </div>
            <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3">
                {POYA_MENU.map((m) => {
                    const locked = poya && m.alcohol;
                    return (
                        <div key={m.name} className="relative flex min-h-20 flex-col justify-between rounded-xl p-3 transition-all duration-300"
                            style={{ ...INSET, opacity: locked ? 0.55 : 1, borderStyle: locked ? "dashed" : "solid", borderColor: locked ? tint(STATUS.warn, 45) : "rgba(255,255,255,0.06)" }}>
                            <span className={`text-[13px] ${locked ? "text-white/45 line-through" : "text-white/85"}`}>{m.name}</span>
                            <AnimatePresence>
                                {locked && (
                                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                                        className="flex items-center gap-1.5 text-[11px] text-white/55">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <rect x="5" y="11" width="14" height="10" rx="2" stroke={STATUS.warn} strokeWidth="2" />
                                            <path d="M8 11V8a4 4 0 018 0v3" stroke={STATUS.warn} strokeWidth="2" />
                                        </svg>
                                        Locked today
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
            <p className="mt-4 text-caption text-white/45" aria-live="polite">
                {poya ? "Alcohol is locked on every till for the day. Food and drinks bill as normal." : "Switch on the poya day to see alcohol lock across the tills."}
            </p>
        </div>
    );
}

// ── 5. Offline: pull the plug and service carries on ──────────────────────────
export function OfflinePanel() {
    const [online, setOnline] = useState(true);
    const [queued, setQueued] = useState(0);

    // Offline: a bill queues roughly every second. Back online: the queue drains in order.
    useEffect(() => {
        const id = window.setInterval(
            () => setQueued((q) => (online ? Math.max(q - 1, 0) : Math.min(q + 1, 48))),
            online ? 110 : 900,
        );
        return () => window.clearInterval(id);
    }, [online]);

    const syncing = online && queued > 0;
    const rows = [
        { k: "Internet", v: online ? "Connected" : "Down", c: online ? STATUS.on : STATUS.off },
        { k: "Tills", v: online ? "Billing" : "Billing and printing receipts", c: STATUS.on },
        { k: "Kitchen screens", v: online ? "Receiving orders" : "Receiving orders over your Wi-Fi", c: STATUS.on },
        {
            k: "Cloud backup",
            v: !online ? `${queued} ${queued === 1 ? "bill" : "bills"} waiting to sync` : syncing ? `Syncing in invoice order · ${queued} left` : "Up to date",
            c: online && !syncing ? STATUS.on : STATUS.warn,
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl" style={{ ...CARD, boxShadow: `0 24px 70px rgba(0,0,0,0.45), 0 0 60px ${tint(online ? "var(--accent-secondary)" : STATUS.off, 6)}`, transition: "box-shadow 500ms ease" }} data-no-reveal>
            <div className="flex items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>Lanka Kitchen · status</p>
                <button
                    type="button"
                    onClick={() => setOnline((o) => !o)}
                    className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-200"
                    style={{ background: online ? tint(STATUS.off, 14) : tint(STATUS.on, 14), border: `1px solid ${online ? tint(STATUS.off, 40) : tint(STATUS.on, 40)}` }}
                >
                    {online ? "Pull the plug" : "Reconnect"}
                </button>
            </div>
            <ul className="flex flex-col p-2" aria-live="polite">
                {rows.map((r) => (
                    <li key={r.k} className="flex items-center justify-between gap-4 rounded-xl px-4 py-4">
                        <span className="text-[13px] text-white/60">{r.k}</span>
                        <span className="flex items-center gap-2 text-right text-[13px] text-white/85">
                            <span className="tabular-nums">{r.v}</span>
                            <Dot color={r.c} pulse={r.c !== STATUS.on} />
                        </span>
                    </li>
                ))}
            </ul>
            <p className="border-t px-5 py-3 text-[11px] text-white/40" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {online && !syncing ? "Everything synced. Try pulling the plug." : !online ? "Service carries on. Bills queue in invoice order." : "Back online. Catching up in the order bills were made."}
            </p>
        </div>
    );
}

// ── 6. The owner's 7 am summary on WhatsApp ───────────────────────────────────
export function OwnerSummary() {
    const [approved, setApproved] = useState<Record<string, boolean>>({});
    const pending = [
        { k: "payroll", label: "Payroll for this month" },
        { k: "order", label: "Chicken order from the supplier" },
    ];
    const left = pending.filter((p) => !approved[p.k]).length;

    return (
        <div className="flex h-full flex-col rounded-2xl p-5 sm:p-6" style={CARD} data-no-reveal>
            <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>S</span>
                <span className="flex-1">
                    <span className="block text-[13px] text-white/90">Sable</span>
                    <span className="block text-[11px] text-white/40">WhatsApp · 7:00 am</span>
                </span>
                <span className="rounded-full px-2.5 py-1 text-[10px] text-white/60" style={INSET}>{left} waiting</span>
            </div>

            <div className="rounded-2xl rounded-tl-md p-4" style={INSET}>
                <p className="text-[13px] text-white/85">Yesterday at Lanka Kitchen</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[11px] text-white/40">Sales</p>
                        <p className="text-xl font-thin tabular-nums text-white">Rs 486,200</p>
                        <p className="text-[11px] text-white/50">331 covers · 6% above forecast</p>
                    </div>
                    <div>
                        <p className="text-[11px] text-white/40">Food cost</p>
                        <p className="text-xl font-thin tabular-nums text-white">31.4%</p>
                    </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-[12px] text-white/60">
                    <Dot color={STATUS.warn} />Cash: Rs 400 short at Nugegoda, Till 1
                </p>
            </div>

            <p className="mb-2 mt-4 text-eyebrow text-white/40">Waiting for you</p>
            <ul className="flex flex-col gap-2">
                {pending.map((p) => {
                    const ok = !!approved[p.k];
                    return (
                        <li key={p.k} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ ...INSET, borderColor: ok ? tint(STATUS.on, 28) : "rgba(255,255,255,0.06)" }}>
                            <span className={`text-[13px] ${ok ? "text-white/50" : "text-white/85"}`}>{p.label}</span>
                            {ok ? (
                                <span className="flex items-center gap-1.5 text-[12px] text-white/60"><Check size={16} />Approved</span>
                            ) : (
                                <button type="button" onClick={() => setApproved((a) => ({ ...a, [p.k]: true }))}
                                    className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                                    Approve
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
            {left === 0 && (
                <button type="button" onClick={() => setApproved({})} className="mt-3 cursor-pointer self-start text-[11px] text-white/40 hover:text-white/70">Reset</button>
            )}
        </div>
    );
}

// ── 7. Permissions: what each role can see ────────────────────────────────────
export function PermissionsPanel() {
    const [role, setRole] = useState<"owner" | "cashier">("cashier");

    return (
        <div className="flex h-full flex-col rounded-2xl p-5 sm:p-6" style={CARD} data-no-reveal>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/40" style={{ fontFamily: MONO }}>Signed in as</p>
                <div className="inline-flex rounded-full p-1" role="tablist" aria-label="Role" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {(["owner", "cashier"] as const).map((r) => {
                        const on = role === r;
                        return (
                            <button key={r} type="button" role="tab" aria-selected={on} onClick={() => setRole(r)}
                                className="relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors duration-200"
                                style={{ color: on ? "var(--text-primary)" : "var(--text-muted)" }}>
                                {on && <motion.span layoutId="sable-role-pill" className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)" }} transition={{ duration: 0.3, ease: EASE }} />}
                                <span className="relative">{r}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <ul className="flex flex-col gap-2">
                {PERMISSIONS.map((p) => {
                    const v = p[role];
                    const detail = "detail" in p ? p.detail : null;
                    return (
                        <li key={p.what} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={INSET}>
                            <span className="min-w-0">
                                <span className="block text-[13px] text-white/80">{p.what}</span>
                                {detail && <span className="block text-[11px] text-white/40">{detail}</span>}
                            </span>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span key={v} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}
                                    className="flex flex-shrink-0 items-center gap-2 text-[12px] text-white/65">
                                    {v === "show" && <><Dot color={STATUS.on} />Visible</>}
                                    {v === "allow" && <><Dot color={STATUS.on} />Allowed</>}
                                    {v === "hide" && <><span aria-hidden className="h-2 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />Hidden</>}
                                    {v === "manager" && <><Dot color={STATUS.warn} />Needs a manager</>}
                                </motion.span>
                            </AnimatePresence>
                        </li>
                    );
                })}
            </ul>
            <p className="mt-4 text-caption text-white/45">
                Owner, Manager and Cashier roles, set per outlet. Voids, discounts and refunds above a limit wait for a manager, and every change is logged.
            </p>
        </div>
    );
}

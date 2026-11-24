"use client";

// Digital Infrastructure service mockups. Brands and figures are illustrative.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Avatar, Browser, Check, Chip, CYAN, Dot, EASE, Label, LINE, LivePill, Meter, MONO, PANEL,
    Spark, Stat, STATUS, tint, useEvery, useLive, VIOLET, Window,
} from "./kit";

// ── Problem: a site audit of an outdated website and store ────────────────────

const AUDIT = [
    { k: "Mobile page load", v: "6.4s", good: "under 2.5s", c: STATUS.off, pct: 22 },
    { k: "Performance score", v: "38", good: "90+", c: STATUS.off, pct: 38 },
    { k: "Visitors who enquire", v: "0.4%", good: "2–5%", c: STATUS.off, pct: 12 },
    { k: "Carts abandoned", v: "81%", good: "under 65%", c: STATUS.warn, pct: 81 },
    { k: "Leads reaching the CRM", v: "Manual", good: "Automatic", c: STATUS.warn, pct: 30 },
    { k: "Peak-traffic downtime", v: "3 outages", good: "None", c: STATUS.off, pct: 60 },
];

export function DigitalProblemMock() {
    const { ref, live } = useLive();
    const [n, setN] = useState(0);
    useEvery(live, 700, () => setN((x) => (x >= AUDIT.length + 3 ? 0 : x + 1)));
    return (
        <div ref={ref}>
            <Window title="site-audit / yourbusiness.com" right={<Chip color={STATUS.off}>{Math.min(n, AUDIT.length)} issues</Chip>} className="w-full" bodyClassName="flex flex-col gap-2 p-3">
                <div className="flex items-center gap-3 rounded-xl p-3" style={PANEL}>
                    <div className="relative h-14 w-14 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden>
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke={STATUS.off} strokeWidth="3" strokeDasharray={`${0.38 * 97.4} 97.4`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[15px] tabular-nums text-white">38</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-[12px] text-white/85">Looks fine. Quietly losing customers.</p>
                        <p className="text-[10px] text-white/40">18,240 visitors last month · 73 enquiries</p>
                    </div>
                </div>
                {AUDIT.map((a, i) => (
                    <motion.div key={a.k} animate={{ opacity: i < n ? 1 : 0.25 }} transition={{ duration: 0.3 }}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={PANEL}>
                        <Dot color={i < n ? a.c : "rgba(255,255,255,0.2)"} />
                        <span className="min-w-0 flex-1 truncate text-[11px] text-white/75">{a.k}</span>
                        <span className="w-16 text-right text-[11px] tabular-nums text-white/90">{a.v}</span>
                        <span className="hidden w-20 text-right text-[9.5px] text-white/35 sm:inline">target {a.good}</span>
                    </motion.div>
                ))}
            </Window>
        </div>
    );
}

// ── 01. Website Development: a fast site that turns visitors into leads ───────

const LEAD_NAMES = ["Priya S. · Clinic group", "Tom B. · 3 hotels", "Aisha K. · Logistics", "Marco D. · Retail chain"];

export function WebsiteMock({ compact = false }: { compact?: boolean }) {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 2200, () => setK((x) => x + 1));
    const visitors = 128 + ((k * 7) % 23);
    return (
        <div ref={ref} className={compact ? "h-full" : ""}>
            <Browser url="northpeak.co" right={<LivePill label={`${visitors} on site`} />} className={compact ? "h-full" : "aspect-[5/4] w-full"}>
                <div className="flex h-full flex-col">
                    {/* the site */}
                    <div className="relative flex flex-1 flex-col gap-2.5 overflow-hidden px-5 py-3" style={{ background: `radial-gradient(ellipse 70% 80% at 85% 20%, ${tint(VIOLET, 16)}, transparent 60%), radial-gradient(ellipse 50% 60% at 10% 100%, ${tint(CYAN, 10)}, transparent 60%)` }}>
                        <div className="flex items-center justify-between text-[9.5px] text-white/45">
                            <span className="font-semibold tracking-wide text-white/80">Northpeak</span>
                            <span className="hidden gap-3 sm:flex"><span>Services</span><span>Work</span><span>Pricing</span></span>
                            <span className="rounded-full px-2 py-0.5 text-white/80" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>Contact</span>
                        </div>
                        <p className={`${compact ? "mt-1 text-[15px]" : "mt-auto text-[19px]"} max-w-[80%] leading-tight text-white`}>Logistics software your drivers actually use.</p>
                        <p className="max-w-[75%] text-[10px] leading-relaxed text-white/50">Live tracking, proof of delivery and invoicing in one place.</p>
                        <div className={`flex gap-2 ${compact ? "" : "mb-auto"}`}>
                            <span className="rounded-full px-3 py-1 text-[10px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>Get a demo</span>
                            <span className="rounded-full px-3 py-1 text-[10px] text-white/70" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>See pricing</span>
                        </div>
                    </div>
                    {/* analytics strip */}
                    <div className="grid grid-cols-3 gap-2 p-2.5" style={{ borderTop: `1px solid ${LINE}`, background: "rgba(0,0,0,0.2)" }}>
                        <Stat label="Speed score" value="98" sub="loads in 0.9s" subColor={STATUS.on} />
                        <Stat label="Enquiry rate" value="4.1%" sub="was 0.4%" subColor={STATUS.on} />
                        <Stat label="Leads · month" value={312 + (k % 5)} sub="sent to CRM" />
                    </div>
                </div>
                {/* new-lead toast */}
                <AnimatePresence>
                    {k % 2 === 1 && (
                        <motion.div key={k} initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className={`absolute right-3 ${compact ? "top-2" : "top-3"} flex items-center gap-2 rounded-xl px-3 py-2`}
                            style={{ background: "var(--surface-elevated)", border: `1px solid ${tint(CYAN, 30)}`, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
                            <Check />
                            <div>
                                <p className="text-[10.5px] text-white/85">New demo request</p>
                                <p className="text-[9.5px] text-white/40">{LEAD_NAMES[(k >> 1) % LEAD_NAMES.length]} → CRM</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Browser>
        </div>
    );
}

// ── 02. E-commerce Development: store + the operations behind it ──────────────

const ORDERS = [
    { id: "#10482", who: "Sofia R.", item: "Trail Runner 2 · 39", amt: 129 },
    { id: "#10483", who: "Ben A.", item: "Merino crew · x2", amt: 74 },
    { id: "#10484", who: "Hana T.", item: "Trail Runner 2 · 41", amt: 129 },
    { id: "#10485", who: "Luis P.", item: "Rain shell · M", amt: 189 },
    { id: "#10486", who: "Chloe M.", item: "Trail socks · x3", amt: 36 },
];
const EVENTS = [
    { t: "Cart recovered by email · $86", c: STATUS.on },
    { t: "Low stock: Trail Runner 2 · 40 → reorder sent", c: STATUS.warn },
    { t: "Shipping label printed · #10483", c: STATUS.on },
    { t: "Review request sent · 5★ received", c: STATUS.on },
];

export function EcommerceMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(2);
    useEvery(live, 1900, () => setK((x) => x + 1));
    const orders = [0, 1, 2].map((o) => ORDERS[(k - o + ORDERS.length * 10) % ORDERS.length]);
    const ev = EVENTS[k % EVENTS.length];
    return (
        <div ref={ref}>
            <Window title="store admin / today" right={<LivePill />} className="aspect-[5/4] w-full" bodyClassName="grid grid-cols-5">
                {/* storefront */}
                <div className="col-span-2 flex flex-col gap-2 p-3" style={{ borderRight: `1px solid ${LINE}` }}>
                    <div className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] text-white/50" style={PANEL}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        trail shoes wide
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-xl" style={{ background: `radial-gradient(circle at 50% 55%, ${tint(CYAN, 18)}, transparent 60%), rgba(255,255,255,0.03)`, border: `1px solid ${LINE}` }}>
                        <svg viewBox="0 0 120 80" className="absolute inset-x-3 top-1/2 -translate-y-1/2" aria-hidden>
                            <path d="M8 58c18-2 30-14 40-28 6 6 16 9 26 10 14 2 30 6 36 14v8H8z" fill={tint(VIOLET, 45)} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                            <path d="M8 66h102" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <Chip color={CYAN} className="absolute left-2 top-2">Best seller</Chip>
                    </div>
                    <div>
                        <p className="text-[11.5px] text-white/85">Trail Runner 2</p>
                        <p className="text-[10px] text-white/45">$129 · 4.8★ (1,204)</p>
                    </div>
                    <div className="flex gap-1">
                        {[39, 40, 41, 42].map((s) => (
                            <span key={s} className="flex-1 rounded-md py-1 text-center text-[9.5px] text-white/60" style={{ ...PANEL, borderColor: s === 41 ? tint(CYAN, 50) : LINE }}>{s}</span>
                        ))}
                    </div>
                    <span className="mt-auto rounded-full py-1.5 text-center text-[10px] font-semibold text-white" style={{ background: "var(--accent-gradient)" }}>Add to cart</span>
                </div>
                {/* operations */}
                <div className="col-span-3 flex min-w-0 flex-col gap-2 p-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Stat label="Sales today" value={`$${(8420 + k * 129).toLocaleString("en-US")}`} sub="+18% vs last Tue" subColor={STATUS.on} />
                        <Stat label="Conversion" value="3.6%" sub="checkout in 1 page" />
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-xl" style={PANEL}>
                        <div className="px-3 py-2" style={{ borderBottom: `1px solid ${LINE}` }}><Label>New orders</Label></div>
                        <AnimatePresence initial={false}>
                            {orders.map((o) => (
                                <motion.div key={`${o.id}-${k}`} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}
                                    className="flex items-center gap-2 px-3 py-1.5 text-[10.5px]">
                                    <span className="w-12 text-white/40" style={{ fontFamily: MONO }}>{o.id}</span>
                                    <span className="min-w-0 flex-1 truncate text-white/75">{o.item}</span>
                                    <span className="tabular-nums text-white/85">${o.amt}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10.5px]" style={PANEL}>
                        <Dot color={ev.c} />
                        <span className="min-w-0 flex-1 truncate text-white/70">{ev.t}</span>
                    </motion.div>
                    <div className="mt-auto rounded-xl p-2.5" style={PANEL}>
                        <div className="flex justify-between"><Label>Revenue · 14 days</Label></div>
                        <Spark values={[42, 45, 41, 48, 52, 50, 57, 55, 61, 64, 60, 68, 72, 70 + (k % 4)]} height={34} />
                    </div>
                </div>
            </Window>
        </div>
    );
}

// ── 03. Platform Development: a client portal with roles and integrations ─────

const PROJECTS = [
    { p: "Warehouse rollout · Leeds", owner: "AK", status: "On track", c: STATUS.on, pct: 72 },
    { p: "Driver app v2", owner: "JM", status: "In review", c: CYAN, pct: 90 },
    { p: "Billing migration", owner: "SO", status: "Blocked", c: STATUS.off, pct: 35 },
    { p: "Customer onboarding", owner: "PN", status: "On track", c: STATUS.on, pct: 58 },
];
const AUDIT_LOG = [
    "Ana (Admin) invited 2 users",
    "Invoice INV-2207 paid via Stripe",
    "Jon (Editor) uploaded contract.pdf",
    "Role changed: Mia → Viewer",
    "Salesforce sync: 214 records",
];

export function PlatformMock() {
    const { ref, live } = useLive();
    const [k, setK] = useState(0);
    useEvery(live, 1800, () => setK((x) => x + 1));
    return (
        <div ref={ref}>
            <Window title="portal.acmegroup.com / projects" right={<span className="flex items-center gap-1.5 text-[10px] text-white/45"><Avatar initials="AK" size={18} />Admin</span>}
                className="aspect-[5/4] w-full" bodyClassName="flex">
                <div className="hidden w-[28%] flex-shrink-0 flex-col gap-0.5 p-2.5 sm:flex" style={{ borderRight: `1px solid ${LINE}` }}>
                    {["Projects", "Documents", "Invoices", "Team & roles", "Integrations", "Audit log"].map((n, i) => (
                        <span key={n} className="rounded-md px-2 py-1.5 text-[10.5px]" style={{ background: i === 0 ? "rgba(255,255,255,0.06)" : "transparent", color: i === 0 ? "var(--text-primary)" : "var(--text-muted)" }}>{n}</span>
                    ))}
                    <div className="mt-auto flex flex-col gap-1.5 rounded-lg p-2" style={PANEL}>
                        <Label>Connected</Label>
                        {["Stripe", "Salesforce", "S3 storage"].map((s) => (
                            <span key={s} className="flex items-center gap-1.5 text-[10px] text-white/55"><Dot size={5} />{s}</span>
                        ))}
                    </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
                    <div className="grid grid-cols-3 gap-2">
                        <Stat label="Active users" value="1,284" sub="3 roles" />
                        <Stat label="Uptime" value="99.98%" sub="30 days" subColor={STATUS.on} />
                        <Stat label="Response" value="112ms" sub="p95" />
                    </div>
                    <div className="flex flex-col overflow-hidden rounded-xl" style={PANEL}>
                        {PROJECTS.map((p, i) => (
                            <div key={p.p} className="flex items-center gap-2.5 px-3 py-2" style={{ borderTop: i ? `1px solid ${LINE}` : undefined }}>
                                <span className="min-w-0 flex-1 truncate text-[11px] text-white/80">{p.p}</span>
                                <div className="hidden w-16 sm:block"><Meter pct={p.pct} color={p.c} /></div>
                                <Avatar initials={p.owner} size={18} color={VIOLET} />
                                <Chip color={p.c} className="w-[66px] justify-center">{p.status}</Chip>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto flex flex-col gap-1 rounded-xl p-2.5" style={PANEL}>
                        <Label>Audit log</Label>
                        {[0, 1].map((o) => (
                            <motion.span key={`${k}-${o}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex items-center gap-1.5 truncate text-[10px] text-white/55">
                                <Check size={10} />{AUDIT_LOG[(k + o) % AUDIT_LOG.length]}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </Window>
        </div>
    );
}

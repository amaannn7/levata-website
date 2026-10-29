"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useBookCall } from "@/app/components/BookCallProvider";
import CTAAurora from "@/app/components/CTAAurora";
import SectionLabel from "@/app/components/SectionLabel";
import SectionLabelSide from "@/app/components/SectionLabelSide";
import HelmDashboard from "./HelmDashboard";
import HelmHealthCheck from "./HelmHealthCheck";
import { EASE, HELM_DEMO_URL, HELM_START_URL, MONO, STATUS, tint } from "./helmData";

const HeroHorizon = dynamic(() => import("@/app/components/HeroHorizon"), { ssr: false });

const SECTION = "relative w-full overflow-hidden px-5 py-14 sm:px-6 sm:py-20 md:py-28";


// ── Content ───────────────────────────────────────────────────────────────────
const TRUST = ["Free to start", "No credit card", "Unlimited leadership invites", "Your data stays private"];

const PROBLEMS = [
    { without: "Everyone is busy, but pulling in different directions.", with: "One shared plan and 90-day priorities the whole team can see." },
    { without: "Weekly meetings are status updates that decide nothing.", with: "A Monday meeting built to solve the three biggest problems." },
    { without: "Problems surface weeks too late.", with: "A weekly scorecard turns red the week a number slips." },
    { without: "The same issues keep coming back.", with: "Issues are solved at the root, then handed off as 7-day to-dos." },
    { without: "Nobody is quite sure who owns what.", with: "A Seat Map gives every role exactly one owner." },
];

const BEATS = [
    { key: "fri", when: "Every Friday", title: "Numbers in", body: "Each owner updates their scorecard numbers. Anything off target is flagged before the weekend." },
    { key: "mon", when: "Every Monday", title: "Pulse Meeting", body: "90 minutes, same agenda, live numbers. Most of the time goes on solving the top three issues." },
    { key: "q", when: "Every 90 days", title: "Reset priorities", body: "Each leader commits to three to seven priorities for the next quarter, with milestones." },
] as const;

const STEPS = [
    { num: "01", title: "Take the Health Check", body: "20 questions score six areas of your company and show where to start." },
    { num: "02", title: "Set up with guidance", body: "Plain-English instructions for every section. The assistant drafts the harder parts for your approval." },
    { num: "03", title: "Run the rhythm", body: "Friday numbers, Monday meeting, 90-day resets. Helm keeps the cadence so you don't have to." },
];

type ModuleIcon = "command" | "pulse" | "scorecard" | "priorities" | "issues" | "playbook" | "assistant" | "health";
const MODULES: { title: string; body: string; icon: ModuleIcon }[] = [
    { title: "Command Centre", body: "Company health, this week's numbers, priorities and to-dos on one screen.", icon: "command" },
    { title: "Pulse Meeting", body: "A 90-minute Monday agenda with timers, live numbers, ratings and a written recap.", icon: "pulse" },
    { title: "Scorecard", body: "5 to 15 key numbers over 13 weeks, with goals and owners. Off target turns red.", icon: "scorecard" },
    { title: "Priorities", body: "Three to seven 90-day goals per leader, with milestones and progress.", icon: "priorities" },
    { title: "Issues + To-dos", body: "A ranked problem list, a guided way to solve them, and seven-day commitments.", icon: "issues" },
    { title: "Playbook", body: "Your core processes written as simple steps, each with an owner.", icon: "playbook" },
    { title: "Setup guide + assistant", body: "Plain-English instructions, plus an assistant that drafts the hard sections for approval.", icon: "assistant" },
    { title: "Health Check", body: "20 questions that score six areas of the company and show where to start.", icon: "health" },
];

const SEATS = [
    { id: "ceo", seat: "CEO", name: "Sarah Okafor", owns: "Vision, key clients, leadership team", fit: true },
    { id: "sales", seat: "Sales", name: "Daniel Reyes", owns: "Pipeline, proposals, win rate", fit: true },
    { id: "delivery", seat: "Delivery", name: "Priya Nair", owns: "Projects, utilisation, hiring", fit: true },
    { id: "finance", seat: "Finance", name: "Marcus Lee", owns: "Cash, billing, monthly close", fit: true },
    { id: "ops", seat: "Operations", name: "Open seat", owns: "Tools, onboarding, Playbook upkeep", fit: false },
];

const FAQS = [
    { q: "Who is Helm for?", a: "Leadership teams at growing companies, roughly 10 to 250 people. It's built for the stage where the founder can no longer keep everything in their head and the leadership team needs a shared way of running the business." },
    { q: "Is it really free to start?", a: "Yes. You can start free with no credit card, and invite your whole leadership team without limits." },
    { q: "Do we need a consultant or coach to set it up?", a: "No. Every section comes with plain-English setup instructions, and the assistant drafts the harder parts (like your vision or scorecard) for you to review and approve." },
    { q: "Can we try it before putting our own data in?", a: "Yes. The demo loads Northwind Consulting, a made-up 25-person consultancy with a full quarter of data. Every visitor gets a private copy that is deleted after a day." },
    { q: "Is our data private?", a: "Yes. Your data is private to your company and only visible to the people you invite." },
    { q: "How does Helm relate to Levata?", a: "Helm is powered by Levata. If you want help rolling it out, or connecting it to the tools and data you already use, our team can help." },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
function ModuleGlyph({ kind }: { kind: ModuleIcon }) {
    const p = { stroke: "var(--accent-secondary)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            {kind === "command" && <><rect x="3" y="3" width="7" height="9" rx="1.5" {...p} /><rect x="14" y="3" width="7" height="5" rx="1.5" {...p} /><rect x="14" y="12" width="7" height="9" rx="1.5" {...p} /><rect x="3" y="16" width="7" height="5" rx="1.5" {...p} /></>}
            {kind === "pulse" && <><circle cx="12" cy="13" r="8" {...p} /><path d="M12 9v4l2.5 2M9 2h6" {...p} /></>}
            {kind === "scorecard" && <><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><path d="M3 10h18M9 4v16" {...p} /></>}
            {kind === "priorities" && <><circle cx="12" cy="12" r="8" {...p} /><circle cx="12" cy="12" r="4" {...p} /></>}
            {kind === "issues" && <><path d="M12 3l9 16H3L12 3z" {...p} /><path d="M12 10v4M12 17v.01" {...p} /></>}
            {kind === "playbook" && <><path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" {...p} /><path d="M9 9h6M9 13h4" {...p} /></>}
            {kind === "assistant" && <><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" {...p} /><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z" {...p} /></>}
            {kind === "health" && <><path d="M3 12h4l2-5 4 10 2-5h6" {...p} /></>}
        </svg>
    );
}

function Mark({ ok, size = 22 }: { ok: boolean; size?: number }) {
    const color = ok ? STATUS.on : STATUS.off;
    return (
        <span className="flex flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300"
            style={{ width: size, height: size, background: tint(color, 12), border: `1px solid ${tint(color, 45)}` }}>
            <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 10 10" fill="none" aria-hidden>
                {ok
                    ? <path d="M2 5.2l2 2L8 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M3 3l4 4M7 3l-4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />}
            </svg>
        </span>
    );
}

// ── Problem → fix toggle ──────────────────────────────────────────────────────
function ProblemToggle() {
    const [withHelm, setWithHelm] = useState(false);
    return (
        <div className="flex flex-col gap-4" data-no-reveal>
            <div className="inline-flex self-start rounded-full p-1" role="tablist" aria-label="Compare" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {[false, true].map((v) => {
                    const active = withHelm === v;
                    return (
                        <button
                            key={String(v)}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setWithHelm(v)}
                            className="relative cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-200"
                            style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
                        >
                            {active && <motion.span layoutId="helm-problem-pill" className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)" }} transition={{ duration: 0.3, ease: EASE }} />}
                            <span className="relative">{v ? "With Helm" : "Without Helm"}</span>
                        </button>
                    );
                })}
            </div>

            <ul className="flex flex-col gap-2.5">
                {PROBLEMS.map((p, i) => (
                    <li
                        data-reveal
                        data-reveal-delay={Math.round((i * 0.06) * 1000)}
                        key={p.without}
                        className="relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4"
                        style={{
                            background: "var(--home-card-bg)",
                            border: `1px solid ${withHelm ? tint(STATUS.on, 22) : "var(--home-card-border)"}`,
                            transition: "border-color 400ms ease",
                        }}
                    >
                        <span className="w-6 flex-shrink-0 text-[10px] font-semibold tabular-nums tracking-[0.2em] text-white/30" style={{ fontFamily: MONO }}>
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <Mark ok={withHelm} />
                        <span className="relative min-h-[1.5em] flex-1">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={withHelm ? "with" : "without"}
                                    initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                                    transition={{ duration: 0.28, delay: i * 0.04, ease: EASE }}
                                    className={`block text-body-sm ${withHelm ? "text-white/85" : "text-white/60"}`}
                                >
                                    {withHelm ? p.with : p.without}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ── Rhythm: one row per beat across the 13 weeks of a quarter ────────────────
const NOW_WEEK = 9;
const RHYTHM_ROWS = [
    { key: "fri", day: "Friday", what: "numbers in" },
    { key: "mon", day: "Monday", what: "Pulse Meeting" },
    { key: "q", day: "Quarter end", what: "reset priorities" },
] as const;

function RhythmMark({ row, week }: { row: (typeof RHYTHM_ROWS)[number]["key"]; week: number }) {
    const past = week <= NOW_WEEK;
    if (row === "q") {
        if (week !== 13) return null;
        return <span className="h-2.5 w-2.5 rotate-45" style={{ background: "var(--status-warn)" }} />;
    }
    const color = row === "fri" ? "var(--accent-secondary)" : "var(--text-primary)";
    const shape = row === "fri" ? "h-2.5 w-2.5 rounded-full" : "h-3.5 w-1.5 rounded-sm";
    // Done weeks are solid; weeks still ahead are outlined.
    return <span className={shape} style={past ? { background: color } : { border: `1px solid ${tint(color, 45)}` }} />;
}

function RhythmStrip() {
    const [focus, setFocus] = useState<(typeof BEATS)[number]["key"] | null>(null);
    const dim = (k: string) => (focus && focus !== k ? 0.2 : 1);
    const cols = "minmax(84px, 112px) repeat(13, minmax(0, 1fr))";

    return (
        <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-7" style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" }} data-no-reveal>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-eyebrow text-white/40">One quarter · 13 weeks</p>
                    <p className="text-[11px] text-white/45">Solid = done · outlined = still ahead</p>
                </div>

                {/* Week numbers */}
                <div className="grid items-end gap-[2px] pb-2" style={{ gridTemplateColumns: cols }}>
                    <span className="text-[10px] text-white/35">Week</span>
                    {Array.from({ length: 13 }, (_, i) => (
                        <span key={i} className={`text-center text-[10px] tabular-nums ${i + 1 === NOW_WEEK ? "text-white" : "text-white/35"} ${[1, 5, NOW_WEEK, 13].includes(i + 1) ? "" : "max-sm:invisible"}`} style={{ fontFamily: MONO }}>
                            {i + 1 === NOW_WEEK && <span className="block text-[9px] text-white/60" style={{ fontFamily: "inherit" }}>now</span>}
                            {i + 1}
                        </span>
                    ))}
                </div>

                {/* One row per beat */}
                <div className="flex flex-col gap-[2px]">
                    {RHYTHM_ROWS.map((row) => (
                        <div key={row.key} className="grid items-center gap-[2px] transition-opacity duration-300" style={{ gridTemplateColumns: cols, opacity: dim(row.key) }}>
                            <span className="flex flex-col pr-2 leading-tight">
                                <span className="text-[12px] text-white/80">{row.day}</span>
                                <span className="text-[10px] text-white/40">{row.what}</span>
                            </span>
                            {Array.from({ length: 13 }, (_, i) => (
                                <span
                                    key={i}
                                    className="flex h-9 items-center justify-center rounded-md"
                                    style={{ background: i + 1 === NOW_WEEK ? tint("var(--accent-secondary)", 8) : "rgba(255,255,255,0.02)" }}
                                >
                                    <RhythmMark row={row.key} week={i + 1} />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-[11px] text-white/45">
                    Numbers go in every Friday and get discussed every Monday. At the end of week 13 each leader sets new priorities for the next quarter.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {BEATS.map((b, i) => (
                    <div
                        data-reveal
                        data-reveal-delay={Math.round((i * 0.08) * 1000)}
                        key={b.key}
                        onMouseEnter={() => setFocus(b.key)}
                        onMouseLeave={() => setFocus(null)}
                        onFocus={() => setFocus(b.key)}
                        onBlur={() => setFocus(null)}
                        tabIndex={0}
                        className="rounded-2xl p-6 outline-none transition-colors duration-300 md:p-7"
                        style={{ background: "var(--home-card-bg)", border: `1px solid ${focus === b.key ? "rgba(255,255,255,0.18)" : "var(--home-card-border)"}` }}
                    >
                        <p className="text-eyebrow text-white/40">{b.when}</p>
                        <h3 className="mt-2 display-card-title">{b.title}</h3>
                        <p className="mt-2 text-body-sm text-white/55">{b.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Modules bento: two feature tiles with mini visuals + eight small tiles ─────
function VisionCanvasTile() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] uppercase tracking-[0.16em] text-white/35" style={{ fontFamily: MONO }}>Core values</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Own the outcome", "Say it straight", "Clients first"].map((v) => (
                        <span key={v} className="rounded-full px-2.5 py-1 text-[11px] text-white/75" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>{v}</span>
                    ))}
                </div>
            </div>
            {[
                { k: "Focus", v: "Advisory for scaling firms" },
                { k: "10-year target", v: "150 people, 3 offices" },
                { k: "3-year picture", v: "$12M revenue, 60% retainers" },
                { k: "This year", v: "$6.2M, 4 new retainers" },
            ].map((b) => (
                <div key={b.k} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/35" style={{ fontFamily: MONO }}>{b.k}</p>
                    <p className="mt-1.5 text-[12px] leading-snug text-white/75">{b.v}</p>
                </div>
            ))}
        </div>
    );
}

function SeatMapTile() {
    const [active, setActive] = useState<string>("sales");
    const seat = SEATS.find((s) => s.id === active)!;
    const node = (id: string) => {
        const s = SEATS.find((x) => x.id === id)!;
        const on = active === id;
        return (
            <button
                key={id}
                type="button"
                onMouseEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                onClick={() => setActive(id)}
                className="relative flex w-full min-w-0 cursor-pointer flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-center transition-colors duration-200"
                style={{
                    background: on ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                    border: `1px ${s.fit ? "solid" : "dashed"} ${on ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.09)"}`,
                }}
            >
                <span className="text-[9px] uppercase tracking-[0.14em] text-white/40" style={{ fontFamily: MONO }}>{s.seat}</span>
                <span className={`w-full truncate text-[11px] ${s.fit ? "text-white/80" : "text-white/40"}`}>{s.name}</span>
                {s.fit && <span className="absolute right-1.5 top-1.5"><Mark ok size={12} /></span>}
            </button>
        );
    };

    return (
        <div className="flex flex-col gap-3" data-no-reveal>
            <div className="flex flex-col items-center">
                <div className="w-[38%] min-w-[120px]">{node("ceo")}</div>
                <span aria-hidden className="h-3 w-px" style={{ background: "rgba(255,255,255,0.2)" }} />
                {/* Branch line + a drop to each of the four seats (4-column layout only) */}
                <div aria-hidden className="relative hidden h-3 w-full sm:block">
                    <span className="absolute left-[12.5%] right-[12.5%] top-0 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
                    {[12.5, 37.5, 62.5, 87.5].map((l) => (
                        <span key={l} className="absolute top-0 h-3 w-px" style={{ left: `${l}%`, background: "rgba(255,255,255,0.2)" }} />
                    ))}
                </div>
                <div className="mt-2 grid w-full grid-cols-2 gap-1.5 sm:mt-0 sm:grid-cols-4">
                    {["sales", "delivery", "finance", "ops"].map(node)}
                </div>
            </div>
            <div className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }} aria-live="polite">
                <Mark ok={seat.fit} size={18} />
                <p className="min-w-0 text-[12px] leading-snug text-white/55">
                    <span className="text-white/85">{seat.name}</span> · owns {seat.owns.toLowerCase()}
                    {seat.fit ? " · fits the values" : " · hiring this quarter"}
                </p>
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40">
                <span className="flex items-center gap-1.5"><Mark ok size={12} />fits the company&apos;s values</span>
                <span className="flex items-center gap-1.5"><span aria-hidden className="h-3 w-4 rounded-[3px] border border-dashed" style={{ borderColor: "rgba(255,255,255,0.3)" }} />open seat</span>
                <span>Hover or tap a seat to see what it owns.</span>
            </p>
        </div>
    );
}

function ModulesBento() {
    const big = [
        { title: "Vision Canvas", body: "Core values, focus, long-term targets and this year's plan, on one page.", visual: <VisionCanvasTile /> },
        { title: "Seat Map + People Lens", body: "Who owns each role, and whether each person fits the company's values.", visual: <SeatMapTile /> },
    ];
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {big.map((b, i) => (
                <div
                    data-reveal
                    data-reveal-delay={Math.round((i * 0.08) * 1000)}
                    key={b.title}
                    className="relative col-span-2 flex flex-col gap-5 overflow-hidden rounded-2xl p-6 md:p-7"
                    style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" }}
                >
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${tint("var(--accent)", 35)}, transparent)` }} />
                    <div>
                        <h3 className="display-card-title">{b.title}</h3>
                        <p className="mt-1.5 text-body-sm text-white/55">{b.body}</p>
                    </div>
                    {b.visual}
                </div>
            ))}
            {MODULES.map((m, i) => (
                <div
                    data-reveal
                    data-reveal-delay={Math.round(((i % 4) * 0.06) * 1000)}
                    key={m.title}
                    className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5 transition-colors sm:p-6 duration-300 hover:border-white/20"
                    style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" }}
                >
                    <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: `radial-gradient(circle, ${tint("var(--accent-secondary)", 12)} 0%, transparent 70%)` }} />
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <ModuleGlyph kind={m.icon} />
                    </span>
                    <h3 className="text-body font-medium text-white">{m.title}</h3>
                    <p className="text-caption text-white/50">{m.body}</p>
                </div>
            ))}
        </div>
    );
}

// ── Demo provisioning terminal ────────────────────────────────────────────────
const DEMO_LINES = [
    { t: "$ helm demo --company \"Northwind Consulting\"", cmd: true },
    { t: "✓ 25 people, 4 leaders seated" },
    { t: "✓ 13 weeks of scorecard numbers loaded" },
    { t: "✓ Priorities, issues and to-dos for the quarter" },
    { t: "✓ Last Monday's meeting recap attached" },
    { t: "→ Private copy ready · deleted after 24h" },
];

function DemoTerminal() {
    return (
        <div className="relative overflow-hidden rounded-2xl" style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)", boxShadow: `0 24px 70px rgba(0,0,0,0.45), 0 0 60px ${tint("var(--accent)", 7)}` }}>
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />)}
                <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-white/30" style={{ fontFamily: MONO }}>demo</span>
            </div>
            <pre className="font-mono whitespace-pre-wrap break-words p-5 text-[12px] leading-[1.9] sm:p-6 sm:text-[13px]">
                {DEMO_LINES.map((l, i) => (
                    <span
                        data-reveal
                        data-reveal-delay={Math.round((0.15 + i * 0.18) * 1000)}
                        key={l.t}
                        className={`font-mono block ${l.cmd ? "text-white/85" : i === DEMO_LINES.length - 1 ? "text-white" : "text-white/55"}`}
                    >
                        {l.t}
                    </span>
                ))}
                <motion.span
                    aria-hidden
                    className="mt-1 inline-block h-4 w-2 align-middle"
                    style={{ background: "var(--accent-secondary)" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </pre>
        </div>
    );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ q, a, index, isOpen, onToggle }: { q: string; a: string; index: number; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            data-reveal
            data-reveal-delay={Math.round((index * 0.05) * 1000)}
            className="overflow-hidden rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${isOpen ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 300ms ease" }}
        >
            <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02]">
                <span className="display-card-title">{q}</span>
                <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.18)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-lead text-white/55">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CTAButtons({ center = true }: { center?: boolean }) {
    return (
        <div className={`flex flex-col items-center gap-4 sm:flex-row ${center ? "justify-center" : "sm:justify-start"}`}>
            <a href={HELM_START_URL} target="_blank" rel="noopener noreferrer" data-cta="primary"
                className="relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white cursor-pointer">
                Start free →
            </a>
            <a href={HELM_DEMO_URL} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white/80">
                Try the live demo →
            </a>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HelmPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { open: openBookCall } = useBookCall();

    return (
        <main className="home-theme-dark relative min-h-screen overflow-hidden page-dividers">

            {/* ── 1. HERO ─────────────────────────────────── */}
            <section data-hero className="relative flex flex-col items-center overflow-hidden px-5 pb-16 pt-32 text-center sm:px-6 md:pb-20 md:pt-[160px]">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6"
                >
                    <h1 className="display-hero-title max-w-3xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">Your leadership team,</span>
                        <span className="display-strong-line sm:whitespace-nowrap">pulling the same way.</span>
                    </h1>
                    <p className="max-w-2xl text-lead text-white/55">
                        Helm gives growing companies of 10 to 250 people one shared plan, a weekly scorecard, 90-day priorities
                        and a Monday meeting that solves problems instead of reporting on them.
                    </p>
                    <div className="mt-2"><CTAButtons /></div>
                    <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {TRUST.map((t) => (
                            <li key={t} className="flex items-center gap-1.5 text-caption text-white/45">
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden><path d="M2 5.2l2 2L8 3" stroke="var(--accent-secondary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                {t}
                            </li>
                        ))}
                    </ul>
                </motion.div>
                <HeroHorizon intensity="strong" />
            </section>

            {/* ── 2. LIVE DASHBOARD ───────────────────────── */}
            <section className="relative w-full px-4 pb-14 pt-10 sm:px-6 sm:pb-20 md:pb-28">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10">
                    <div data-reveal className="mb-8 flex flex-col items-center gap-3 text-center md:mb-10">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">Your whole week,</span>
                            <span className="display-strong-line">on one screen.</span>
                        </h2>
                        <p className="max-w-xl text-body-sm text-white/50">
                            This is a working demo. Tick off a to-do, update a priority, solve an issue or run a Monday meeting.
                        </p>
                    </div>
                    <HelmDashboard />
                </div>
            </section>

            {/* ── 3. PROBLEM ──────────────────────────────── */}
            <section className={SECTION}>
                <div className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 60% at 15% 40%, ${tint(STATUS.off, 5)} 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 85% 60%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 65%)` }} />
                <div className="relative z-10 mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.15fr] md:gap-16">
                    <div data-reveal className="flex flex-col gap-4">
                        <SectionLabelSide />
                        <h2 className="display-section-title">
                            <span className="display-muted-line">Growth breaks the way</span>
                            <span className="display-strong-line">leadership teams work.</span>
                        </h2>
                        <p className="max-w-sm text-lead text-white/45">
                            What worked at ten people stops working at forty. The founder becomes the bottleneck, meetings multiply,
                            and nobody can say for sure whether the company is on track this week.
                        </p>
                    </div>
                    <ProblemToggle />
                </div>
            </section>

            {/* ── 4. RHYTHM ───────────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-2xl text-center">
                            <span className="display-muted-line">A simple rhythm</span>
                            <span className="display-strong-line">your team can keep.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/50">Three beats, repeated all quarter. Hover or tap a card below to highlight its row.</p>
                    </div>
                    <RhythmStrip />

                    <div className="mt-16 md:mt-20">
                        <p className="mb-8 text-center text-eyebrow text-white/40">Up and running in three steps</p>
                        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
                            <div aria-hidden className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-px md:block" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0.18) 90%, transparent)" }} />
                            {STEPS.map((s, i) => (
                                <div
                                    data-reveal
                                    data-reveal-delay={Math.round((i * 0.1) * 1000)}
                                    key={s.num}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{ background: "var(--surface-elevated)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 0 0 4px var(--background), 0 0 20px rgba(255,255,255,0.12)" }}>
                                        <span className="text-lg font-thin text-white" style={{ fontFamily: MONO }}>{s.num}</span>
                                    </div>
                                    <h3 className="mt-4 display-card-title">{s.title}</h3>
                                    <p className="mt-2 max-w-[280px] text-caption text-white/55">{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. HEALTH CHECK ─────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 50% at 80% 40%, ${tint("var(--accent)", 6)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-3xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Not sure where to begin?</span>
                            <span className="display-strong-line sm:whitespace-nowrap">Take the Health Check.</span>
                        </h2>
                        <p className="max-w-xl text-lead text-white/50">
                            The full check is 20 questions across six areas. Here are six with sample answers filled in. Change any answer and the chart and recommendation update.
                        </p>
                    </div>
                    <HelmHealthCheck />
                </div>
            </section>

            {/* ── 6. MODULES ──────────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 50% 50% at 20% 30%, ${tint("var(--accent-secondary)", 4)} 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 80% 70%, ${tint("var(--accent)", 5)} 0%, transparent 70%)` }} />
                <div className="relative z-10 mx-auto max-w-[1120px]">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                        <SectionLabel />
                        <h2 className="display-section-title max-w-4xl text-center">
                            <span className="display-muted-line sm:whitespace-nowrap">Everything your team needs,</span>
                            <span className="display-strong-line sm:whitespace-nowrap">in one place.</span>
                        </h2>
                    </div>
                    <ModulesBento />
                </div>
            </section>

            {/* ── 7. DEMO ─────────────────────────────────── */}
            <section className={SECTION}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0 dot-grid-bg" />
                <div className="relative z-10 mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
                    <div data-reveal className="flex flex-col gap-5">
                        <SectionLabelSide />
                        <h2 className="display-section-title">
                            <span className="display-muted-line">See it working</span>
                            <span className="display-strong-line">before you set it up.</span>
                        </h2>
                        <p className="max-w-md text-lead text-white/50">
                            Open Northwind Consulting, a made-up 25-person consultancy with a full quarter of data. You get your own
                            private copy to click through, and it is deleted after a day.
                        </p>
                        <div className="grid max-w-md grid-cols-3 gap-3">
                            {[
                                { v: "25", l: "people" },
                                { v: "13", l: "weeks of data" },
                                { v: "24h", l: "private copy" },
                            ].map((s) => (
                                <div key={s.l} className="rounded-xl px-4 py-3" style={{ background: "var(--home-card-bg)", border: "1px solid var(--home-card-border)" }}>
                                    <p className="text-2xl font-thin text-white tabular-nums">{s.v}</p>
                                    <p className="text-caption text-white/45">{s.l}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-1">
                            <a href={HELM_DEMO_URL} target="_blank" rel="noopener noreferrer" data-cta="primary"
                                className="relative inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white cursor-pointer">
                                Open the demo →
                            </a>
                        </div>
                    </div>
                    <DemoTerminal />
                </div>
            </section>

            {/* ── 8. FAQ ──────────────────────────────────── */}
            <section className={SECTION}>
                <div className="relative z-10 mx-auto max-w-3xl">
                    <div data-reveal className="mb-10 flex flex-col items-center gap-3 text-center">
                        <SectionLabel />
                        <h2 className="display-section-title display-inline max-w-2xl text-center">
                            <span className="display-muted-line">Frequently asked </span><span className="display-strong-line">questions.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {FAQS.map((f, i) => (
                            <FAQItem key={f.q} q={f.q} a={f.a} index={i} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 9. FINAL CTA ────────────────────────────── */}
            <section className={SECTION}>
                <CTAAurora variant={2} />
                <div
                    data-reveal
                    className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center"
                >
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line sm:whitespace-nowrap">Your first good Monday</span>
                        <span className="display-strong-line sm:whitespace-nowrap">can be this Monday.</span>
                    </h2>
                    <p className="max-w-xl text-lead text-white/55">
                        Start free, invite your leadership team, and run your first Pulse Meeting next week.
                    </p>
                    <CTAButtons />
                    <button type="button" onClick={openBookCall} className="cursor-pointer text-caption text-white/40 transition-colors duration-200 hover:text-white/70">
                        Want help rolling it out? Book a call with Levata
                    </button>
                </div>
            </section>
        </main>
    );
}

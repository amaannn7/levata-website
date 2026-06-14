"use client";

import Image from "next/image";
import SectionBeam from "@/app/components/SectionBeam";

// - Client logos -
// scale = per-logo size multiplier. Square / tightly-cropped marks need >1
// to visually balance against wide text-logos that already fill their box.
const CLIENTS: { name: string; country: string; file: string }[] = [
    { name: "Macktiles", country: "Australia", file: "macktiles-au.png" },
    { name: "Elevate", country: "Australia", file: "elevate (1).png" },
    { name: "Besanz", country: "Canada", file: "Besanz.png" },
    { name: "Sterling Nutritions", country: "Singapore", file: "Sterling.png" },
    { name: "Wagar", country: "Australia", file: "wagar.png" },
    { name: "Lady Baby", country: "Qatar", file: "lody.png" },
    { name: "Fibonacci Series", country: "UAE", file: "fibonacci (1).png" },
    { name: "Spine Doctor", country: "New Zealand", file: "spyne-doctor.png" },
    { name: "Macktiles", country: "Sri Lanka", file: "macktiles-sl.png" },
    { name: "TopWay", country: "Sri Lanka", file: "topway.png" },
    { name: "Macktiles Masterpieces", country: "Sri Lanka", file: "macktiles-masterpieces.png" },
    { name: "Miracle", country: "Sri Lanka", file: "Miracle.png" },
    { name: "Unbound Tours", country: "Sri Lanka", file: "unbound.png" },
    { name: "Knight Consultant", country: "New Zealand", file: "kmc.png" },
    { name: "Gateway Furnitures", country: "Sri Lanka", file: "gateway.png" },
    { name: "Camellia Ranch", country: "Sri Lanka", file: "camellia.png" },
];

const TRACK = [...CLIENTS, ...CLIENTS];

// AI "sparkle" between logos — a 4-point shimmer star plus a tiny companion sparkle,
// gently twinkling in the brand gradient. viewBox 44 x 44.
// A 4-point star: pinched diamond with concave sides, drawn from the center outward.
const SPARKLE_MAIN =
    "M22 6 C23 16 28 21 38 22 C28 23 23 28 22 38 C21 28 16 23 6 22 C16 21 21 16 22 6 Z";
const SPARKLE_MINI =
    "M36 30 C36.6 33 38 34.4 41 35 C38 35.6 36.6 37 36 40 C35.4 37 34 35.6 31 35 C34 34.4 35.4 33 36 30 Z";

function CircuitTrace({ i }: { i: number }) {
    const gid = `clients-spark-grad-${i}`;
    return (
        <span
            aria-hidden
            className="clients-trace flex h-[120px] w-[52px] flex-shrink-0 items-center justify-center self-start md:h-[140px]"
            style={{ ["--d" as string]: `${(i % 5) * 0.5}s` }}
        >
            <svg viewBox="0 0 44 44" fill="none" className="h-[34px] w-[34px] overflow-visible">
                <defs>
                    <linearGradient id={gid} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00FFDD" />
                        <stop offset="100%" stopColor="#CC01FF" />
                    </linearGradient>
                </defs>
                <path d={SPARKLE_MAIN} fill={`url(#${gid})`} className="clients-spark-main" />
                <path d={SPARKLE_MINI} fill={`url(#${gid})`} className="clients-spark-mini" />
            </svg>
        </span>
    );
}

function ClientItem({ client }: { client: typeof CLIENTS[number] }) {
    return (
        <div
            title={`${client.name} — ${client.country}`}
            className="group flex flex-shrink-0 flex-col items-center gap-3"
        >
            <div className="flex h-[120px] w-[120px] items-center justify-center md:h-[140px] md:w-[140px]">
                <Image
                    src={`/${client.file}`}
                    alt={client.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    unoptimized
                />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30 transition-colors duration-300 group-hover:text-white/55">
                {client.country}
            </span>
            <span className="sr-only">{client.name}, {client.country}</span>
        </div>
    );
}

export default function ClientsMarquee() {
    return (
        <section className="home-theme-dark relative w-full overflow-hidden px-5 py-14 sm:px-6 md:py-20">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 70% at 50% 60%, rgba(123, 85, 234,0.07) 0%, transparent 65%)",
                    }}
                />
            </div>
            <div className="relative z-10 mx-auto max-w-[1120px]">
                <div className="mb-10 flex flex-col items-center gap-3 text-center md:mb-12">
                    <SectionBeam />
                    <h2 className="display-section-title max-w-2xl text-center">
                        <span className="display-muted-line">Trusted by teams that</span>
                        <span className="display-strong-line">expect better systems.</span>
                    </h2>
                </div>

                <div className="clients-marquee-mask">
                    <div
                        className="flex w-max items-center"
                        style={{
                            gap: "clamp(12px, 1.6vw, 22px)",
                            animation: "marquee 48s linear infinite",
                        }}
                    >
                        {TRACK.map((client, i) => (
                            <div key={i} className="flex items-start" style={{ gap: "clamp(40px, 5vw, 72px)" }}>
                                <ClientItem client={client} />
                                <CircuitTrace i={i} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

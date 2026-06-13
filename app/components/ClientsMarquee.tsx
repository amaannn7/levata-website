"use client";

import Image from "next/image";
import SectionBeam from "@/app/components/SectionBeam";

// - Client logos -
// scale = per-logo size multiplier. Square / tightly-cropped marks need >1
// to visually balance against wide text-logos that already fill their box.
const CLIENTS: { name: string; file: string; scale?: number }[] = [
    { name: "Wagar", file: "wagar-logo.png", scale: 1.35 },
    { name: "Unbound Tours", file: "unbound-logo.png" },
    { name: "SpyneDoctors New Zealand", file: "spyne-logo-nz.png" },
    { name: "Q Express", file: "qexpress.png", scale: 1.35 },
    { name: "Gateway", file: "gateway-logo-white-e1703242647735.png", scale: 1.2 },
    { name: "Elevate", file: "elevate.png" },
    { name: "Camellia Ranch", file: "Menu-1.png", scale: 1.55 },
    { name: "Macktiles Australia", file: "macktiles-logo-terracotta.png" },
    { name: "Macktiles Lanka", file: "macktiles-lk-logo-variation.png" },
    { name: "Macktiles Masterpieces", file: "MSL-Logo-W-New-2048x706-1.png" },
    { name: "Lody Baby", file: "lody-baby-qatar-tx.png", scale: 1.6 },
    { name: "Client", file: "logo-temp.png" },
    { name: "The Fibonacci Series", file: "fibonacci.png", scale: 1.95 },
];

const TRACK = [...CLIENTS, ...CLIENTS];


function ClientItem({ client }: { client: typeof CLIENTS[number] }) {
    const scale = client.scale ?? 1;
    return (
        <div
            title={client.name}
            className="home-tech-icon-wrap flex h-14 w-[150px] flex-shrink-0 items-center justify-center md:h-16 md:w-[180px]"
        >
            <Image
                src={`/clients/${client.file}`}
                alt={client.name}
                width={180}
                height={64}
                className="max-h-full max-w-full object-contain opacity-90 transition-opacity duration-200 hover:opacity-100"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                }}
                unoptimized
            />
            <span className="sr-only">{client.name}</span>
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

                <div className="tech-marquee-mask">
                    <div
                        className="flex w-max items-center"
                        style={{
                            gap: "clamp(40px, 8vw, 96px)",
                            animation: "marquee 26s linear infinite",
                        }}
                    >
                        {TRACK.map((client, i) => (
                            <ClientItem key={i} client={client} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

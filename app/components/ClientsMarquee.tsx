"use client";

const CLIENTS = [
    {
        name: "Google",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="home-tech-icon h-12 w-auto md:h-14">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
    },
    {
        name: "Microsoft",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="home-tech-icon h-12 w-auto md:h-14">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
            </svg>
        ),
    },
    {
        name: "Stripe",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="home-tech-icon h-11 w-auto md:h-12">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
        ),
    },
    {
        name: "Notion",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="home-tech-icon h-12 w-auto md:h-14">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
            </svg>
        ),
    },
    {
        name: "GitHub",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="home-tech-icon h-12 w-auto md:h-14">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
        ),
    },
];

const TRACK = [...CLIENTS, ...CLIENTS];

function SectionLabel({ text }: { text: string }) {
    return (
        <div
            className="inline-flex items-center gap-3"
        >
            <span className="flex items-center">
                <span className="animate-label-line" />
                <span className="animate-label-dot" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{text}</p>
        </div>
    );
}

function ClientItem({ client }: { client: typeof CLIENTS[0] }) {
    return (
        <div
            title={client.name}
            className="home-tech-icon-wrap flex min-w-[132px] flex-shrink-0 items-center justify-center md:min-w-[168px]"
        >
            {client.svg}
            <span className="sr-only">{client.name}</span>
        </div>
    );
}

export default function ClientsMarquee() {
    return (
        <section className="home-theme-dark relative w-full overflow-hidden px-5 py-10 sm:px-6 md:py-14">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0" style={{
                    background: "radial-gradient(ellipse 60% 70% at 50% 60%, rgba(75,145,247,0.07) 0%, transparent 65%)"
                }} />
            </div>
            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col items-center gap-5 text-center md:mb-12">
                    <SectionLabel text="Selected clients" />
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

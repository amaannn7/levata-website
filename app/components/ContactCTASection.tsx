"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// Icons
function ChevronIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// Countries
const COUNTRIES = [
    { code: "af", dial: "+93", name: "Afghanistan" },
    { code: "al", dial: "+355", name: "Albania" },
    { code: "dz", dial: "+213", name: "Algeria" },
    { code: "ao", dial: "+244", name: "Angola" },
    { code: "ar", dial: "+54", name: "Argentina" },
    { code: "am", dial: "+374", name: "Armenia" },
    { code: "au", dial: "+61", name: "Australia" },
    { code: "at", dial: "+43", name: "Austria" },
    { code: "az", dial: "+994", name: "Azerbaijan" },
    { code: "bh", dial: "+973", name: "Bahrain" },
    { code: "bd", dial: "+880", name: "Bangladesh" },
    { code: "by", dial: "+375", name: "Belarus" },
    { code: "be", dial: "+32", name: "Belgium" },
    { code: "bz", dial: "+501", name: "Belize" },
    { code: "bo", dial: "+591", name: "Bolivia" },
    { code: "ba", dial: "+387", name: "Bosnia and Herzegovina" },
    { code: "bw", dial: "+267", name: "Botswana" },
    { code: "br", dial: "+55", name: "Brazil" },
    { code: "bn", dial: "+673", name: "Brunei" },
    { code: "bg", dial: "+359", name: "Bulgaria" },
    { code: "kh", dial: "+855", name: "Cambodia" },
    { code: "cm", dial: "+237", name: "Cameroon" },
    { code: "ca", dial: "+1", name: "Canada" },
    { code: "cl", dial: "+56", name: "Chile" },
    { code: "cn", dial: "+86", name: "China" },
    { code: "co", dial: "+57", name: "Colombia" },
    { code: "cd", dial: "+243", name: "Congo (DRC)" },
    { code: "cr", dial: "+506", name: "Costa Rica" },
    { code: "hr", dial: "+385", name: "Croatia" },
    { code: "cu", dial: "+53", name: "Cuba" },
    { code: "cy", dial: "+357", name: "Cyprus" },
    { code: "cz", dial: "+420", name: "Czech Republic" },
    { code: "dk", dial: "+45", name: "Denmark" },
    { code: "do", dial: "+1", name: "Dominican Republic" },
    { code: "ec", dial: "+593", name: "Ecuador" },
    { code: "eg", dial: "+20", name: "Egypt" },
    { code: "sv", dial: "+503", name: "El Salvador" },
    { code: "ee", dial: "+372", name: "Estonia" },
    { code: "et", dial: "+251", name: "Ethiopia" },
    { code: "fi", dial: "+358", name: "Finland" },
    { code: "fr", dial: "+33", name: "France" },
    { code: "ge", dial: "+995", name: "Georgia" },
    { code: "de", dial: "+49", name: "Germany" },
    { code: "gh", dial: "+233", name: "Ghana" },
    { code: "gr", dial: "+30", name: "Greece" },
    { code: "gt", dial: "+502", name: "Guatemala" },
    { code: "hn", dial: "+504", name: "Honduras" },
    { code: "hk", dial: "+852", name: "Hong Kong" },
    { code: "hu", dial: "+36", name: "Hungary" },
    { code: "is", dial: "+354", name: "Iceland" },
    { code: "in", dial: "+91", name: "India" },
    { code: "id", dial: "+62", name: "Indonesia" },
    { code: "ir", dial: "+98", name: "Iran" },
    { code: "iq", dial: "+964", name: "Iraq" },
    { code: "ie", dial: "+353", name: "Ireland" },
    { code: "il", dial: "+972", name: "Israel" },
    { code: "it", dial: "+39", name: "Italy" },
    { code: "jm", dial: "+1", name: "Jamaica" },
    { code: "jp", dial: "+81", name: "Japan" },
    { code: "jo", dial: "+962", name: "Jordan" },
    { code: "kz", dial: "+7", name: "Kazakhstan" },
    { code: "ke", dial: "+254", name: "Kenya" },
    { code: "kw", dial: "+965", name: "Kuwait" },
    { code: "kg", dial: "+996", name: "Kyrgyzstan" },
    { code: "lv", dial: "+371", name: "Latvia" },
    { code: "lb", dial: "+961", name: "Lebanon" },
    { code: "ly", dial: "+218", name: "Libya" },
    { code: "lt", dial: "+370", name: "Lithuania" },
    { code: "lu", dial: "+352", name: "Luxembourg" },
    { code: "mg", dial: "+261", name: "Madagascar" },
    { code: "my", dial: "+60", name: "Malaysia" },
    { code: "mv", dial: "+960", name: "Maldives" },
    { code: "mt", dial: "+356", name: "Malta" },
    { code: "mu", dial: "+230", name: "Mauritius" },
    { code: "mx", dial: "+52", name: "Mexico" },
    { code: "md", dial: "+373", name: "Moldova" },
    { code: "mn", dial: "+976", name: "Mongolia" },
    { code: "ma", dial: "+212", name: "Morocco" },
    { code: "mz", dial: "+258", name: "Mozambique" },
    { code: "mm", dial: "+95", name: "Myanmar" },
    { code: "na", dial: "+264", name: "Namibia" },
    { code: "np", dial: "+977", name: "Nepal" },
    { code: "nl", dial: "+31", name: "Netherlands" },
    { code: "nz", dial: "+64", name: "New Zealand" },
    { code: "ni", dial: "+505", name: "Nicaragua" },
    { code: "ng", dial: "+234", name: "Nigeria" },
    { code: "no", dial: "+47", name: "Norway" },
    { code: "om", dial: "+968", name: "Oman" },
    { code: "pk", dial: "+92", name: "Pakistan" },
    { code: "pa", dial: "+507", name: "Panama" },
    { code: "py", dial: "+595", name: "Paraguay" },
    { code: "pe", dial: "+51", name: "Peru" },
    { code: "ph", dial: "+63", name: "Philippines" },
    { code: "pl", dial: "+48", name: "Poland" },
    { code: "pt", dial: "+351", name: "Portugal" },
    { code: "qa", dial: "+974", name: "Qatar" },
    { code: "ro", dial: "+40", name: "Romania" },
    { code: "ru", dial: "+7", name: "Russia" },
    { code: "rw", dial: "+250", name: "Rwanda" },
    { code: "sa", dial: "+966", name: "Saudi Arabia" },
    { code: "sn", dial: "+221", name: "Senegal" },
    { code: "rs", dial: "+381", name: "Serbia" },
    { code: "sg", dial: "+65", name: "Singapore" },
    { code: "sk", dial: "+421", name: "Slovakia" },
    { code: "si", dial: "+386", name: "Slovenia" },
    { code: "so", dial: "+252", name: "Somalia" },
    { code: "za", dial: "+27", name: "South Africa" },
    { code: "kr", dial: "+82", name: "South Korea" },
    { code: "ss", dial: "+211", name: "South Sudan" },
    { code: "es", dial: "+34", name: "Spain" },
    { code: "lk", dial: "+94", name: "Sri Lanka" },
    { code: "sd", dial: "+249", name: "Sudan" },
    { code: "se", dial: "+46", name: "Sweden" },
    { code: "ch", dial: "+41", name: "Switzerland" },
    { code: "sy", dial: "+963", name: "Syria" },
    { code: "tw", dial: "+886", name: "Taiwan" },
    { code: "tj", dial: "+992", name: "Tajikistan" },
    { code: "tz", dial: "+255", name: "Tanzania" },
    { code: "th", dial: "+66", name: "Thailand" },
    { code: "tn", dial: "+216", name: "Tunisia" },
    { code: "tr", dial: "+90", name: "Turkey" },
    { code: "tm", dial: "+993", name: "Turkmenistan" },
    { code: "ug", dial: "+256", name: "Uganda" },
    { code: "ua", dial: "+380", name: "Ukraine" },
    { code: "ae", dial: "+971", name: "United Arab Emirates" },
    { code: "gb", dial: "+44", name: "United Kingdom" },
    { code: "us", dial: "+1", name: "United States" },
    { code: "uy", dial: "+598", name: "Uruguay" },
    { code: "uz", dial: "+998", name: "Uzbekistan" },
    { code: "ve", dial: "+58", name: "Venezuela" },
    { code: "vn", dial: "+84", name: "Vietnam" },
    { code: "ye", dial: "+967", name: "Yemen" },
    { code: "zm", dial: "+260", name: "Zambia" },
    { code: "zw", dial: "+263", name: "Zimbabwe" },
];

const INFO_ITEMS = [
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 6L12 13L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        label: "Email us",
        value: "hello@levata.io",
    },
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        label: "Response time",
        value: "Within 48 hours",
    },
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 12H21M12 3C14.5 6 14.5 18 12 21C9.5 18 9.5 6 12 3Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        label: "Timezone",
        value: "Worldwide, async friendly",
    },
];

// Component
export default function ContactCTASection({ showHeading = true }: { showHeading?: boolean }) {
    const [country, setCountry] = useState("us");
    const sectionRef = useRef<HTMLDivElement>(null);

    const selected = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

    return (
        <section ref={sectionRef} id="contact-cta" className="relative w-full bg-[#07001F] px-5 py-8 sm:px-6 md:py-14">
            <div className="mx-auto max-w-6xl">

                {showHeading && (
                    <div className="mb-12" data-form-heading>
                        <div className="mb-3 inline-flex items-center gap-3">
                            <span className="flex items-center">
                                <span className="animate-label-line" />
                                <span className="animate-label-dot" />
                            </span>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Get in touch</p>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                            Drop Us a{" "}
                            <span className="text-white">
                                Message
                            </span>
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
                            Fill in the form and we&apos;ll get back within 48 hours.
                        </p>
                    </div>
                )}

                {/* Card */}
                <div
                    data-no-reveal
                    className="overflow-hidden rounded-2xl p-px"
                    style={{ background: "linear-gradient(135deg,rgba(114,200,245,0.3) 0%,rgba(255,255,255,0.06) 50%,rgba(155,47,255,0.3) 100%)" }}
                >
                    <div className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[340px_1fr]" data-form>

                        {/* Left info panel */}
                        <div
                            className="flex flex-col justify-between gap-5 border-b border-white/8 p-6 sm:gap-8 sm:p-8 md:gap-10 md:p-10 lg:border-b-0 lg:border-r"
                            style={{ background: "linear-gradient(160deg,rgba(155,47,255,0.15) 0%,rgba(7,0,31,0.98) 100%)" }}
                        >
                            <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/30">
                                    Let&apos;s talk
                                </p>
                                <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl md:text-3xl">
                                    We&apos;d love to hear about your project.
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/45">
                                    Whether you&apos;re starting from scratch or scaling an existing product, we&apos;re here to help.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:gap-6">
                                {INFO_ITEMS.map((item) => (
                                    <div key={item.label} className="flex items-start gap-4">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40">
                                            {item.icon}
                                        </span>
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">{item.label}</p>
                                            <p className="mt-0.5 text-sm font-medium text-white/75">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right form panel */}
                        <div className="bg-[#07001F] p-6 sm:p-8 md:p-10">
                            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">

                                {/* Name + Email */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2" data-form-field>
                                    <Field label="Full Name" required placeholder="John Smith" />
                                    <Field label="Email" required type="email" placeholder="hello@company.com" />
                                </div>

                                {/* Phone with country flag */}
                                <div data-form-field>
                                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                        Phone
                                    </label>
                                    <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors focus-within:border-white/22">
                                        {/* Country trigger */}
                                        <div className="relative flex shrink-0 cursor-pointer items-center gap-2 border-r border-white/10 px-2.5 py-3 hover:bg-white/[0.03] sm:px-3 sm:py-3.5">
                                            <Image
                                                src={`https://flagcdn.com/w20/${selected.code}.png`}
                                                alt={selected.name}
                                                width={20}
                                                height={14}
                                                className="rounded-[2px] object-cover"
                                                unoptimized
                                            />
                                            <span className="text-sm font-medium text-white/70">{selected.dial}</span>
                                            <span className="text-white/30"><ChevronIcon /></span>
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="absolute inset-0 cursor-pointer opacity-0"
                                                aria-label="Country dial code"
                                                style={{ background: "#07001F", color: "#fff" }}
                                            >
                                                {COUNTRIES.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.name} ({c.dial})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Number input */}
                                        <input
                                            type="tel"
                                            className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none"
                                            placeholder="512 345 6789"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div data-form-field>
                                    <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                                        Message <span className="text-white/25">*</span>
                                    </label>
                                    <textarea
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-white/22 focus:outline-none"
                                        placeholder="Tell us about your project: scope, timeline, goals…"
                                        rows={5}
                                    />
                                </div>

                                {/* Extras */}
                                <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-1" data-form-field>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/70"
                                    >
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/30">
                                            <PlusIcon />
                                        </span>
                                        Attach File
                                    </button>
                                </div>

                                {/* Submit */}
                                <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-5" data-form-field>
                                    <p className="text-xs text-white/25">All fields marked * are required</p>
                                    <button
                                        type="submit"
                                        className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg sm:px-6 sm:py-3"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))",
                                            boxShadow: "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)",
                                        }}
                                        onMouseEnter={(e) => {
                                            const target = e.currentTarget as HTMLButtonElement;
                                            target.style.boxShadow = "0 0 20px rgba(114,200,245,0.15), 0 0 20px rgba(155,47,255,0.12), inset 0 0 0 1px rgba(114,200,245,0.25)";
                                        }}
                                        onMouseLeave={(e) => {
                                            const target = e.currentTarget as HTMLButtonElement;
                                            target.style.boxShadow = "0 0 10px rgba(114,200,245,0.1), 0 0 10px rgba(155,47,255,0.08), inset 0 0 0 1px rgba(114,200,245,0.18)";
                                        }}
                                    >
                                        Send Request
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Field
function Field({ label, required = false, placeholder, type = "text" }: {
    label: string; required?: boolean; placeholder?: string; type?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {label} {required && <span className="text-white/25">*</span>}
            </label>
            <input
                type={type}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-white/22 focus:outline-none"
                placeholder={placeholder}
            />
        </div>
    );
}




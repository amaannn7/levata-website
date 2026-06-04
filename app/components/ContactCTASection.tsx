"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { COUNTRIES } from "@/app/lib/countries";
import SectionLabel from "@/app/components/SectionLabel";

type Status = "idle" | "loading" | "success" | "error";

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

function FileIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB — within Vercel hobby tier request limit
const ALLOWED_TYPES = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp";

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const INFO_ITEMS = [
    {
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 6L12 13L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        label: "Email us",
        value: "hello@levatahq.com",
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

export default function ContactCTASection({ showHeading = true }: { showHeading?: boolean }) {
    const [country, setCountry] = useState("us");
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const selected = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];
    const isLoading = status === "loading";

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            setErrorMsg(`File too large. Max ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
            setStatus("error");
            e.target.value = "";
            return;
        }
        setAttachedFile(file);
        if (status === "error") {
            setStatus("idle");
            setErrorMsg("");
        }
    };

    const removeAttachment = () => {
        setAttachedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const data = new FormData(e.currentTarget);
        const phoneNumber = (data.get("phone") as string | null)?.trim() ?? "";
        const phone = phoneNumber ? `${selected.dial} ${phoneNumber}` : "";

        const payload = new FormData();
        payload.append("name", (data.get("name") as string).trim());
        payload.append("email", (data.get("email") as string).trim());
        if (phone) payload.append("phone", phone);
        payload.append("message", (data.get("message") as string).trim());
        payload.append("source", "Contact Form");
        if (attachedFile) payload.append("attachment", attachedFile);

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: payload, // browser sets multipart Content-Type with boundary
            });
            const json = await res.json() as { success?: boolean; error?: string };
            if (!res.ok || !json.success) {
                setErrorMsg(json.error ?? "Something went wrong. Please try again.");
                setStatus("error");
            } else {
                setStatus("success");
                formRef.current?.reset();
                setCountry("us");
                setAttachedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        } catch {
            setErrorMsg("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    };

    return (
        <section ref={sectionRef} id="contact-cta" className="relative w-full bg-[#0E1014] px-5 py-8 sm:px-6 md:py-14">
            <div className="relative z-10 mx-auto max-w-6xl">

                {showHeading && (
                    <div className="mb-12" data-form-heading>
                                                <h2 className="display-section-title display-inline">
                            <span className="display-muted-line">Drop us a </span><span className="display-strong-line">message.</span>
                        </h2>
                        <p className="mt-4 max-w-md text-body-sm text-white/45">
                            Fill in the form and we&apos;ll get back within 48 hours.
                        </p>
                    </div>
                )}

                {/* Card */}
                <div
                    data-no-reveal
                    className="overflow-hidden rounded-2xl p-px"
                    style={{ background: "linear-gradient(135deg,rgba(123, 85, 234,0.3) 0%,rgba(255,255,255,0.06) 50%,rgba(123, 85, 234,0.3) 100%)" }}
                >
                    <div className="grid grid-cols-1 overflow-hidden rounded-2xl lg:grid-cols-[340px_1fr]" data-form>

                        {/* Left info panel */}
                        <div
                            className="flex flex-col justify-between gap-5 border-b border-white/8 p-6 sm:gap-8 sm:p-8 md:gap-10 md:p-10 lg:border-b-0 lg:border-r"
                            style={{ background: "linear-gradient(160deg,rgba(123, 85, 234,0.15) 0%,rgba(23,26,34,0.98) 100%)" }}
                        >
                            <div>
                                <p className="mb-3 text-eyebrow text-white/30">
                                    Let&apos;s talk
                                </p>
                                <h3 className="display-feature-title">
                                    We&apos;d love to hear about your project.
                                </h3>
                                <p className="mt-4 text-body-sm text-white/45">
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
                                            <p className="text-eyebrow text-white/30">{item.label}</p>
                                            <p className="mt-0.5 text-body-sm font-medium text-white/75">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right form panel */}
                        <div className="bg-[#0E1014] p-6 sm:p-8 md:p-10">
                            {status === "success" ? (
                                <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-5 text-center">
                                    <span
                                        className="flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{ background: "rgba(123, 85, 234,0.10)", border: "1px solid rgba(123, 85, 234,0.28)" }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <path d="M5 12l4.5 4.5L19 7" stroke="#7B55EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="display-card-title">Inquiry received.</h3>
                                        <p className="max-w-xs text-body-sm text-white/50">
                                            We&apos;ll get back to you within 48 hours at the email you provided.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStatus("idle")}
                                        className="mt-1 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-5">

                                    {/* Name + Email */}
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2" data-form-field>
                                        <Field name="name" label="Full Name" required placeholder="John Smith" disabled={isLoading} />
                                        <Field name="email" label="Email" required type="email" placeholder="hello@company.com" disabled={isLoading} />
                                    </div>

                                    {/* Phone with country flag */}
                                    <div data-form-field>
                                        <label className="mb-1.5 block text-eyebrow text-white/35">
                                            Phone
                                        </label>
                                        <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors focus-within:border-white/22">
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
                                                    disabled={isLoading}
                                                    style={{ background: "#0E1014", color: "#fff" }}
                                                >
                                                    {COUNTRIES.map((c) => (
                                                        <option key={c.code} value={c.code}>
                                                            {c.name} ({c.dial})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                disabled={isLoading}
                                                className="w-full bg-transparent px-4 py-3.5 text-base text-white placeholder:text-white/25 focus:outline-none disabled:opacity-50"
                                                placeholder="512 345 6789"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div data-form-field>
                                        <label className="mb-1.5 block text-eyebrow text-white/35">
                                            Message <span className="text-white/25">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            disabled={isLoading}
                                            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-white placeholder:text-white/25 transition-colors focus:border-white/22 focus:outline-none disabled:opacity-50"
                                            placeholder="Tell us about your project: scope, timeline, goals..."
                                            rows={5}
                                        />
                                    </div>

                                    {/* Attach file */}
                                    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-1" data-form-field>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={ALLOWED_TYPES}
                                            onChange={handleFileSelect}
                                            disabled={isLoading}
                                            className="hidden"
                                            aria-hidden
                                        />
                                        {!attachedFile ? (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isLoading}
                                                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white/70 disabled:opacity-40"
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/30">
                                                    <PlusIcon />
                                                </span>
                                                Attach File
                                            </button>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">
                                                <span className="text-white/55"><FileIcon /></span>
                                                <span className="max-w-[180px] truncate text-xs font-medium text-white/75 sm:max-w-[240px]">
                                                    {attachedFile.name}
                                                </span>
                                                <span className="text-[10px] font-mono text-white/35">
                                                    {formatFileSize(attachedFile.size)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={removeAttachment}
                                                    disabled={isLoading}
                                                    aria-label="Remove attachment"
                                                    className="ml-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-white/45 transition-colors hover:border-white/30 hover:text-white/80 disabled:opacity-40"
                                                >
                                                    <XIcon />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Error message */}
                                    {status === "error" && errorMsg && (
                                        <p className="rounded-lg px-3 py-2.5 text-sm text-red-400"
                                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                            {errorMsg}
                                        </p>
                                    )}

                                    {/* Submit */}
                                    <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-5" data-form-field>
                                        <p className="text-micro text-white/25">All fields marked * are required</p>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-white  sm:px-6 sm:py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                            data-cta="primary"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Sending…
                                                </span>
                                            ) : "Send Request"}
                                        </button>
                                    </div>

                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

function Field({ name, label, required = false, placeholder, type = "text", disabled }: {
    name: string; label: string; required?: boolean; placeholder?: string; type?: string; disabled?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-eyebrow text-white/35">
                {label} {required && <span className="text-white/25">*</span>}
            </label>
            <input
                name={name}
                type={type}
                required={required}
                disabled={disabled}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-base text-white placeholder:text-white/25 transition-colors focus:border-white/22 focus:outline-none disabled:opacity-50"
                placeholder={placeholder}
            />
        </div>
    );
}

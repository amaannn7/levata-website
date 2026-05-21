"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { COUNTRIES } from "@/app/lib/countries";

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "loading" | "success" | "error";

function ChevronIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function BookCallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [country, setCountry] = useState("us");
    const formRef = useRef<HTMLFormElement>(null);

    const selected = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES[0];

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClose = () => {
        setStatus("idle");
        setErrorMsg("");
        onClose();
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === "loading") return;

        const data = new FormData(e.currentTarget);
        const phoneNumber = (data.get("phone") as string | null)?.trim() ?? "";
        const phone = phoneNumber ? `${selected.dial} ${phoneNumber}` : undefined;

        const payload = {
            name: (data.get("name") as string).trim(),
            email: (data.get("email") as string).trim(),
            phone,
            company: (data.get("company") as string | null)?.trim() || undefined,
            message: (data.get("message") as string).trim(),
            source: "Book a Strategy Call",
        };

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json() as { success?: boolean; error?: string };
            if (!res.ok || !json.success) {
                setErrorMsg(json.error ?? "Something went wrong. Please try again.");
                setStatus("error");
            } else {
                setStatus("success");
                formRef.current?.reset();
                setCountry("us");
            }
        } catch {
            setErrorMsg("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    };

    const baseInput =
        "w-full rounded-lg bg-white/[0.03] px-3.5 py-2.5 text-base text-white placeholder:text-white/30 transition-colors focus:outline-none disabled:opacity-50";
    const styleInput: React.CSSProperties = { border: "1px solid rgba(255,255,255,0.10)" };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="book-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-8"
                    style={{ background: "rgba(14,16,20,0.78)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
                    onClick={handleClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        key="book-panel"
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        onClick={(e) => e.stopPropagation()}
                        className="accent-frame relative w-full max-w-md overflow-hidden rounded-2xl p-px"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-[#0E1014]">
                            {/* subtle glow accent */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 z-0"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(114,200,245,0.08) 0%, transparent 70%)",
                                }}
                            />

                            {/* Close */}
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close"
                                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
                                style={{ background: "rgba(23,26,34,0.94)", border: "1px solid rgba(255,255,255,0.14)" }}
                            >
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2L12 12M12 2L2 12" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>

                            <div className="relative z-10 p-7 md:p-8">
                                {status === "success" ? (
                                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                                        <span
                                            className="flex h-12 w-12 items-center justify-center rounded-full"
                                            style={{ background: "rgba(155,47,255,0.12)", border: "1px solid rgba(114,200,245,0.28)" }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <path d="M5 12l4.5 4.5L19 7" stroke="#72C8F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="text-xl font-semibold tracking-tight text-white">Request received.</h3>
                                            <p className="text-sm leading-relaxed text-white/55">
                                                We&apos;ll be in touch within 48 hours at the email you provided.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="mt-2 px-5 py-2 rounded-full text-sm font-semibold text-white/80 transition-colors hover:text-white"
                                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)" }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Header */}
                                        <div className="mb-6 flex flex-col gap-2 pr-8">
                                            <div className="inline-flex items-center gap-3">
                                                <span className="flex items-center">
                                                    <span className="animate-label-line" />
                                                    <span className="animate-label-dot" />
                                                </span>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#71717A]">Book a Strategy Call</p>
                                            </div>
                                            <h2 className="text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl">
                                                Tell us what you&apos;re building.
                                            </h2>
                                            <p className="text-xs leading-relaxed text-white/45 md:text-[13px]">
                                                A short brief is enough. We reply within 48 hours.
                                            </p>
                                        </div>

                                        {/* Form */}
                                        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">

                                            {/* Name + Email */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <ModalField label="Full Name" name="name" placeholder="John Smith" required disabled={status === "loading"} />
                                                <ModalField label="Work Email" name="email" type="email" placeholder="hello@company.com" required disabled={status === "loading"} />
                                            </div>

                                            {/* Phone with country picker */}
                                            <div>
                                                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                                                    Phone
                                                </label>
                                                <div
                                                    className="flex overflow-hidden rounded-lg transition-colors focus-within:border-white/25"
                                                    style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}
                                                >
                                                    {/* Country trigger */}
                                                    <div className="relative flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-white/10 px-2.5 py-2.5 hover:bg-white/[0.03]">
                                                        <Image
                                                            src={`https://flagcdn.com/w20/${selected.code}.png`}
                                                            alt={selected.name}
                                                            width={20}
                                                            height={14}
                                                            className="rounded-[2px] object-cover"
                                                            unoptimized
                                                        />
                                                        <span className="text-white/30"><ChevronIcon /></span>
                                                        <select
                                                            value={country}
                                                            onChange={(e) => setCountry(e.target.value)}
                                                            className="absolute inset-0 cursor-pointer opacity-0"
                                                            aria-label="Country dial code"
                                                            disabled={status === "loading"}
                                                            style={{ background: "#0E1014", color: "#fff" }}
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
                                                        name="phone"
                                                        disabled={status === "loading"}
                                                        className="w-full bg-transparent px-3.5 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
                                                        placeholder="512 345 6789"
                                                    />
                                                </div>
                                            </div>

                                            {/* Company */}
                                            <ModalField label="Company" name="company" placeholder="Acme Inc." disabled={status === "loading"} />

                                            {/* Message */}
                                            <div>
                                                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                                                    What can we help with? <span className="text-white/50">*</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    required
                                                    disabled={status === "loading"}
                                                    rows={4}
                                                    className={`${baseInput} resize-none focus:border-white/25`}
                                                    style={styleInput}
                                                    placeholder="A short note on the problem you're trying to solve…"
                                                />
                                            </div>

                                            {status === "error" && errorMsg && (
                                                <p className="rounded-lg px-3 py-2.5 text-sm text-red-400"
                                                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                                    {errorMsg}
                                                </p>
                                            )}

                                            <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                                                <p className="text-[11px] text-white/35">
                                                    <span className="text-white/55">*</span> required
                                                </p>
                                                <button
                                                    type="submit"
                                                    disabled={status === "loading"}
                                                    className="accent-button-surface relative rounded-full border px-5 py-2.5 text-sm font-medium text-white transition duration-200 cursor-pointer sm:py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {status === "loading" ? (
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
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ModalField({ label, name, type = "text", placeholder, required, disabled }: {
    label: string; name: string; type?: string; placeholder?: string; required?: boolean; disabled?: boolean;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {label}{required && <span className="ml-1 text-white/50">*</span>}
            </label>
            <input
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full rounded-lg bg-white/[0.03] px-3.5 py-2.5 text-base text-white placeholder:text-white/30 transition-colors focus:outline-none focus:border-white/25 disabled:opacity-50"
                style={{ border: "1px solid rgba(255,255,255,0.10)" }}
            />
        </div>
    );
}

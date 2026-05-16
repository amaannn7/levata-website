"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Field = { name: string; label: string; type?: string; placeholder?: string; required?: boolean; full?: boolean; rows?: number };

const FIELDS: Field[] = [
    { name: "name", label: "Full Name", placeholder: "John Smith", required: true },
    { name: "email", label: "Work Email", type: "email", placeholder: "hello@company.com", required: true },
    { name: "company", label: "Company", placeholder: "Acme Inc.", full: true },
    { name: "message", label: "What can we help with?", placeholder: "A short note on the problem you're trying to solve…", required: true, full: true, rows: 4 },
];

export default function BookCallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) setSubmitted(false);
    }, [open]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
    };

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
                    style={{ background: "rgba(7,0,31,0.78)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
                    onClick={onClose}
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
                        className="relative w-full max-w-md overflow-hidden rounded-2xl p-px"
                        style={{ background: "linear-gradient(135deg,rgba(114,200,245,0.32) 0%,rgba(255,255,255,0.06) 50%,rgba(155,47,255,0.32) 100%)" }}
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-[#07001F]">
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
                                onClick={onClose}
                                aria-label="Close"
                                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10"
                                style={{ background: "rgba(8,1,28,0.7)", border: "1px solid rgba(255,255,255,0.14)" }}
                            >
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 2L12 12M12 2L2 12" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>

                            <div className="relative z-10 p-7 md:p-8">
                                {submitted ? (
                                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                                        <span
                                            className="flex h-12 w-12 items-center justify-center rounded-full"
                                            style={{ background: "rgba(61,253,152,0.12)", border: "1px solid rgba(61,253,152,0.45)" }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <path d="M5 12l4.5 4.5L19 7" stroke="#3DFD98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <div className="flex flex-col gap-1.5">
                                            <h3 className="text-xl font-extrabold tracking-tight text-white">Request received.</h3>
                                            <p className="text-sm leading-relaxed text-white/55">
                                                We&apos;ll be in touch within 48 hours at the email you provided.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
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
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Book a Strategy Call</p>
                                            </div>
                                            <h2 className="text-xl font-extrabold leading-tight tracking-tight text-white md:text-2xl">
                                                Tell us what you&apos;re building.
                                            </h2>
                                            <p className="text-xs leading-relaxed text-white/45 md:text-[13px]">
                                                A short brief is enough. We reply within 48 hours.
                                            </p>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {FIELDS.map((f) => (
                                                    <FormField key={f.name} field={f} />
                                                ))}
                                            </div>

                                            <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                                                <p className="text-[11px] text-white/35">
                                                    <span className="text-white/55">*</span> required
                                                </p>
                                                <button
                                                    type="submit"
                                                    className="relative px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 cursor-pointer sm:py-3"
                                                    style={{
                                                        background: "linear-gradient(135deg, rgba(114,200,245,0.14), rgba(155,47,255,0.14))",
                                                        boxShadow:
                                                            "0 0 10px rgba(114,200,245,0.12), 0 0 10px rgba(155,47,255,0.1), inset 0 0 0 1px rgba(114,200,245,0.25)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                                            "0 0 22px rgba(114,200,245,0.32), 0 0 22px rgba(155,47,255,0.26), inset 0 0 0 1px rgba(114,200,245,0.5)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                                                            "0 0 10px rgba(114,200,245,0.12), 0 0 10px rgba(155,47,255,0.1), inset 0 0 0 1px rgba(114,200,245,0.25)";
                                                    }}
                                                >
                                                    Send Request
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

function FormField({ field }: { field: Field }) {
    const baseInput =
        "w-full rounded-lg bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:outline-none";
    const styleInput: React.CSSProperties = {
        border: "1px solid rgba(255,255,255,0.10)",
    };
    return (
        <div className={field.full ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {field.label}{field.required && <span className="ml-1 text-white/50">*</span>}
            </label>
            {field.rows ? (
                <textarea
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    rows={field.rows}
                    className={`${baseInput} resize-none focus:border-white/25`}
                    style={styleInput}
                />
            ) : (
                <input
                    name={field.name}
                    type={field.type ?? "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    className={`${baseInput} focus:border-white/25`}
                    style={styleInput}
                />
            )}
        </div>
    );
}

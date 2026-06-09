"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/levatahq/30min?hide_gdpr_banner=1&primary_color=7B55EA";
const EASE = [0.16, 1, 0.3, 1] as const;

function isTouchDevice() {
    return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
}

export default function BookCallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);
    const [preloaded, setPreloaded] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Preload iframe after page is idle — so it's ready before user clicks
    useEffect(() => {
        if (isTouchDevice()) return;
        const hasIdle = typeof requestIdleCallback === "function";
        const id = hasIdle
            ? requestIdleCallback(() => setPreloaded(true), { timeout: 3000 })
            : (setTimeout(() => setPreloaded(true), 2000) as unknown as number);
        return () => {
            if (hasIdle) cancelIdleCallback(id);
            else clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
        };
    }, []);

    useEffect(() => {
        if (!open) return;

        // Mobile: use Calendly's own native popup widget
        if (isTouchDevice()) {
            window.Calendly?.closePopupWidget?.();
            const launch = () => window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
            const t = setTimeout(() => {
                if (window.Calendly) launch();
                else setTimeout(launch, 500);
            }, 50);
            const onMsg = (e: MessageEvent) => {
                if (e.data?.event === "calendly.popup_closed") onClose();
            };
            window.addEventListener("message", onMsg);
            return () => {
                clearTimeout(t);
                window.removeEventListener("message", onMsg);
            };
        }

        // Desktop: iframe modal
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!mounted) return null;
    if (isTouchDevice()) return null;

    return createPortal(
        <>
            {/* Hidden preload iframe — loads Calendly in background before user clicks */}
            {preloaded && (
                <iframe
                    src={CALENDLY_URL}
                    title="Calendly preload"
                    aria-hidden
                    tabIndex={-1}
                    style={{
                        position: "fixed",
                        top: 0, left: 0,
                        width: 1, height: 1,
                        opacity: 0,
                        pointerEvents: "none",
                        border: "none",
                        zIndex: -1,
                    }}
                />
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="cal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 99999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "16px",
                            background: "rgba(0,0,0,0.55)",
                        }}
                    >
                        <motion.div
                            key="cal-panel"
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.96 }}
                            transition={{ duration: 0.34, ease: EASE }}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                width: "100%",
                                maxWidth: 1000,
                                height: "min(700px, 90svh)",
                                borderRadius: 16,
                                overflow: "hidden",
                            }}
                        >
                            <iframe
                                src={CALENDLY_URL}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title="Book a strategy call with Levata"
                                style={{ display: "block", border: "none" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}

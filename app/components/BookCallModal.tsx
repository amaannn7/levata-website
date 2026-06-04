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

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!open) return;

        // Mobile: use Calendly's own native popup widget — fully handles touch
        if (isTouchDevice()) {
            const launch = () => window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
            if (window.Calendly) {
                launch();
            } else {
                const t = setTimeout(launch, 500);
                return () => clearTimeout(t);
            }
            const onMsg = (e: MessageEvent) => {
                if (e.data?.event === "calendly.popup_closed") onClose();
            };
            window.addEventListener("message", onMsg);
            return () => window.removeEventListener("message", onMsg);
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

    // Mobile uses Calendly's own popup — no custom modal needed
    if (isTouchDevice()) return null;

    return createPortal(
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
        </AnimatePresence>,
        document.body
    );
}

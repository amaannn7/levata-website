"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import BookCallModal from "@/app/components/BookCallModal";

type BookCallContextValue = {
    open: () => void;
    close: () => void;
};

const BookCallContext = createContext<BookCallContextValue | null>(null);

export function useBookCall(): BookCallContextValue {
    const ctx = useContext(BookCallContext);
    if (!ctx) {
        return {
            open: () => {
                if (typeof window !== "undefined") window.location.href = "/contact";
            },
            close: () => {},
        };
    }
    return ctx;
}

export default function BookCallProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const value = useMemo(() => ({ open, close }), [open, close]);

    return (
        <BookCallContext.Provider value={value}>
            {children}
            <BookCallModal open={isOpen} onClose={close} />
        </BookCallContext.Provider>
    );
}

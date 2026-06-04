"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import BookCallModal from "@/app/components/BookCallModal";

type BookCallContextValue = {
    open: () => void;
    close: () => void;
};

const BookCallContext = createContext<BookCallContextValue | null>(null);

export function useBookCall(): BookCallContextValue {
    const ctx = useContext(BookCallContext);
    if (!ctx) return { open: () => {}, close: () => {} };
    return ctx;
}

export default function BookCallProvider({ children }: { children: React.ReactNode }) {
    const [openCount, setOpenCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const open = useCallback(() => {
        if (pathname === "/contact") {
            document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            // Increment count to force useEffect re-run even if already open
            setOpenCount((c) => c + 1);
            setIsOpen(true);
        }
    }, [pathname]);

    const close = useCallback(() => setIsOpen(false), []);
    const value = useMemo(() => ({ open, close }), [open, close]);

    return (
        <BookCallContext.Provider value={value}>
            {children}
            <BookCallModal key={openCount} open={isOpen} onClose={close} />
        </BookCallContext.Provider>
    );
}

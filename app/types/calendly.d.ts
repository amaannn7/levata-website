interface CalendlyPopupOptions {
    url: string;
    parentElement?: HTMLElement;
    prefill?: {
        name?: string;
        email?: string;
    };
    utm?: Record<string, string>;
}

interface Window {
    Calendly?: {
        initPopupWidget: (options: CalendlyPopupOptions) => void;
        closePopupWidget: () => void;
    };
}

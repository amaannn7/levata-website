// Sable product page: content and links.
// All copy and figures mirror Sable's own site (sable.levatahq.com/welcome)
// and its demo restaurant, Lanka Kitchen. Interactive panels are illustrative.

export const SABLE_URL = "https://sable.levatahq.com";
export const SABLE_SITE_URL = `${SABLE_URL}/welcome`;
export const SABLE_DEMO_URL = `${SABLE_URL}/welcome/demo`;

const mail = (subject: string, body?: string) =>
    `mailto:hello@sable.lk?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

export const SABLE_BOOK_DEMO_URL = mail("Book a Sable demo", "Restaurant name:\nNumber of outlets:\nBest time to call:");
export const SABLE_DEMO_PIN_URL = mail("Sable demo PIN");

export const MONO = "var(--font-code), ui-monospace, SFMono-Regular, Menlo, monospace";
export const EASE = [0.16, 1, 0.3, 1] as const;

// Translucent version of any CSS color/variable.
export const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const STATUS = {
    on: "var(--status-on)",
    warn: "var(--status-warn)",
    off: "var(--status-off)",
} as const;

// ── Hero ──────────────────────────────────────────────────────────────────────
export const TRUST = ["Bills offline", "VAT and SSCL ready", "Sinhala, Tamil and English", "From Rs 15,000 a month"];

// ── One record: a real bill from the demo till ────────────────────────────────
export const BILL = {
    outlet: "Nugegoda",
    table: "T25",
    items: [
        { qty: 1, name: "Chicken kottu", note: "Contains gluten, egg", price: "1,000.00" },
        { qty: 1, name: "String hopper set", price: "950.00" },
        { qty: 2, name: "Milk tea", note: "Contains milk", price: "300.00" },
        { qty: 1, name: "Lamprais", note: "Contains egg, fish, gluten", price: "1,950.00" },
    ],
    subtotal: "4,200.00",
    sscl: "105.00",
    vat: "774.90",
    total: "5,079.90",
};

export const RIPPLE = [
    { key: "kitchen", label: "Kitchen screens", done: "Each dish at the right station, allergies in red" },
    { key: "stock", label: "Stock", done: "Recipe ingredients taken off stock" },
    { key: "cost", label: "Food cost", done: "Plate cost updated for every dish sold" },
    { key: "tax", label: "VAT and SSCL", done: "Rs 774.90 VAT and Rs 105.00 SSCL recorded" },
    { key: "books", label: "Books", done: "Sale posted to the books as it happens" },
] as const;

// ── Everything else service needs ─────────────────────────────────────────────
export type ExtraIcon = "kitchen" | "guests" | "complaints" | "offers" | "hotel" | "whatsapp";
export const EXTRAS: { title: string; body: string; icon: ExtraIcon }[] = [
    { title: "Every order, at the right station", body: "Orders from the till, guest phones and delivery apps go straight to the right station. Sold out on every till in one tap.", icon: "kitchen" },
    { title: "Every guest, remembered", body: "Find a guest by part of a name or number. One record each, with allergies carried into bookings.", icon: "guests" },
    { title: "Complaints, put right", body: "Log a complaint against a table and send the dish back as a remake. See trends by dish and by hour.", icon: "complaints" },
    { title: "Offers that run themselves", body: "Happy hours and lunch deals by day and hour, coupon codes with limits, and birthday offers on WhatsApp.", icon: "offers" },
    { title: "At home in a hotel", body: "Charge bills to a room after checking the stay, take room service, keep breakfast lists and settle at checkout.", icon: "hotel" },
    { title: "Receipts and loyalty on WhatsApp", body: "Receipts and loyalty points go to guests on WhatsApp, and birthday offers follow on their day.", icon: "whatsapp" },
];

// ── Built for Sri Lanka ───────────────────────────────────────────────────────
export const LOCAL = [
    { title: "VAT, SSCL and service charge", body: "Applied in the right order, with invoice numbers that can't be skipped or changed." },
    { title: "Poya days", body: "Alcohol locks on every till for the day." },
    { title: "LankaQR and cards", body: "Every card and QR payment matched to what the bank pays in." },
    { title: "PickMe Food and Uber Eats", body: "Delivery orders arrive on the till like any other order." },
    { title: "EPF, ETF and APIT", body: "Payroll under Sri Lankan rules, with returns ready to submit." },
    { title: "Sinhala, Tamil and English", body: "Everyone works in their own language, from till to receipt." },
];

export const POYA_MENU = [
    { name: "Chicken kottu", alcohol: false },
    { name: "Egg hopper", alcohol: false },
    { name: "Milk tea", alcohol: false },
    { name: "King coconut", alcohol: false },
    { name: "Beer", alcohol: true },
    { name: "Arrack", alcohol: true },
];

// ── Owners + permissions ──────────────────────────────────────────────────────
export const PERMISSIONS = [
    { what: "Menu prices", detail: "Chicken kottu · Rs 1,450", owner: "show", cashier: "show" },
    { what: "Food cost", owner: "show", cashier: "hide" },
    { what: "Supplier prices", owner: "show", cashier: "hide" },
    { what: "Staff salaries", owner: "show", cashier: "hide" },
    { what: "Void a bill", owner: "allow", cashier: "manager" },
] as const;

// ── Pricing ───────────────────────────────────────────────────────────────────
export const PLANS = [
    {
        name: "Counter",
        price: "Rs 15,000",
        per: "a month per outlet",
        for: "Cafés, bakeries and single-outlet restaurants.",
        cta: "Start with Counter",
        href: mail("Sable Counter", "Outlets: 1"),
        featured: false,
        intro: null as string | null,
        items: [
            "Up to 3 tills",
            "Kitchen screens and printers",
            "VAT and SSCL invoices",
            "Cash, cards, LankaQR and gift cards",
            "Stock and recipes",
            "Guest records, bookings and complaints",
            "Café counter, collection screen and stamp cards",
            "Happy hours, coupons and birthday offers",
            "WhatsApp receipts and loyalty points",
        ],
    },
    {
        name: "Full house",
        price: "Rs 25,000",
        per: "a month per outlet",
        for: "Most restaurants choose this.",
        cta: "Start with Full house",
        href: mail("Sable Full house", "Outlets: 1"),
        featured: true,
        intro: "Everything in Counter, with unlimited tills, plus:",
        items: [
            "Forecasts, prep lists and staff plans",
            "Supplier ordering and delivery checks",
            "Rosters, timesheets and payroll",
            "Accounts, bank and tax",
            "PickMe and Uber Eats orders",
            "WhatsApp approvals and daily summary",
            "Ask Sable",
            "Hotel dining: room charges, room service, breakfast lists",
        ],
    },
    {
        name: "Group",
        price: "Custom",
        per: "from 6 outlets",
        for: "For groups running six or more outlets.",
        cta: "Talk to us",
        href: mail("Sable for a group", "Outlets: 1"),
        featured: false,
        intro: "Everything in Full house, plus:",
        items: [
            "Several companies under one login",
            "Area managers by outlet",
            "Menus, recipes and staff set up for you",
            "A named contact",
        ],
    },
];

// ── Getting started ───────────────────────────────────────────────────────────
export const STEPS = [
    { num: "01", title: "Book a demo", body: "Thirty minutes to set up your dishes and walk through a full day, from first bill to last report." },
    { num: "02", title: "We set you up", body: "Sable loads your menu, recipes and staff and sets up your tills. It usually takes a few days." },
    { num: "03", title: "Your first service", body: "We stay with you through your first service. Your 80 mm printers, card machine and LankaQR usually keep working." },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const FAQS = [
    { q: "What happens if the internet goes down?", a: "Service carries on. Tills keep billing and printing, and orders reach the kitchen through a small hub on your Wi-Fi. Everything syncs when the connection comes back." },
    { q: "Can I use my existing printers and card machines?", a: "In most cases, yes. Sable works with standard 80 mm receipt printers, your bank's card machine and LankaQR." },
    { q: "How long does it take to get started?", a: "Usually a few days. Sable loads your menu, recipes and staff, sets up your tills, and stays with you through your first service." },
    { q: "Does it work for a café or a hotel restaurant?", a: "Yes. Cafés get a counter flow with names, numbers and a ready screen. Hotel outlets charge bills to rooms, take room service and keep breakfast lists, and room charges export to the front office system." },
    { q: "Are offers or Ask Sable extra?", a: "No. Promotions, coupons, birthday offers and Ask Sable are included. There are no add-ons." },
    { q: "Will my accountant be able to use it?", a: "Yes, with their own login, or by sending the month to Xero, QuickBooks or Tally." },
    { q: "Who owns my data?", a: "You do. You can export sales, accounts, guest and staff records at any time." },
    { q: "How does Sable relate to Levata?", a: "Sable is a product of Unknwn Global Pvt Ltd and is powered by Levata. If you want help connecting it to the systems you already run, our team can help." },
];

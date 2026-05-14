---
name: levata-ai-website
description: Project-specific guardrails for the Levata AI marketing site — brand voice, locked components, design tokens, section primitives, and content rules. Invoke whenever editing app/** in this repo for copy, layout, or visual changes.
---

# Levata AI Website — Skill

This skill captures the non-obvious rules that make Levata copy and layout consistent with the brand. Read `CLAUDE.md` for repo orientation; this file is the **content + visual contract**.

## When to invoke

- Any change to `app/page.tsx`, `app/about/**`, `app/contact/**`, `app/products/**`, or `app/components/**` that touches copy, layout, or visuals.
- Any new section, card grid, or CTA placement.
- Any task that asks for "premium / modern / conversion-focused / AI-native" framing on this site.

## Brand voice

Levata is an **AI-native intelligence partner**, not a digital agency. Copy must:

- Lead with outcomes, not deliverables ("3× lead conversion", not "beautiful websites").
- Speak to founders, COOs, heads of revenue — not designers.
- Use B2B vocabulary: pipeline, conversion, operations, infrastructure, accountability, ROI.
- Reject "agency" framing entirely. Never write: *we're passionate about*, *we love what we do*, *award-winning team*, *digital solutions*, *crafted with care*.
- Headlines: max 8 words on the main line. Emphasise 2–4 words with the signature gradient on the second line.

## Locked components — never modify without explicit sign-off

- `app/components/ClientsMarquee.tsx` — the 8-logo set, marquee animation, and grayscale→colour hover behaviour are frozen.
- `TechStackSection` (inside `app/components/HeroSection.tsx`) — the four categories, pill tabs, and grid layout are frozen.

If a change requires modifying these, **stop and confirm with the user first.**

## Design tokens (use these literally)

```ts
// Colours
const BG          = "#07001F";
const BRAND_CYAN  = "#72C8F5";
const BRAND_PURPLE = "#9B2FFF";
const BRAND_VIOLET = "#BB00FF";
const ACCENT_GREEN = "#3DFD98";  // success / status indicators

// Brand gradient — used on backgrounds, glows, icon-square fills,
// button hover affordances, and BorderGradient wrappers ONLY.
// NEVER apply this as a text fill (no WebkitBackgroundClip:"text"). All headline,
// body, ticker, service-title, sub-service, and learn-more TEXT is pure white.
background: "linear-gradient(90deg, #9B2FFF, #72C8F5)"

// Heading font
fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif"
```

Section-eyebrow pattern (use the `SectionLabel` helper — already defined in `HeroSection.tsx` and `about/page.tsx`):

```tsx
<SectionLabel text="Your section eyebrow" />
```

This renders the animated line + pulsing dot + uppercase tracked label. Don't reimplement.

## Primitives to reuse

| Primitive | Location | When to use |
|---|---|---|
| `NeonButton` | `app/components/ui/neon-button.tsx` | Every CTA. Use `variant="solid"` for primary, `variant="ghost"` for secondary. |
| `SectionLabel` | inline in `HeroSection.tsx` / `about/page.tsx` | Every section eyebrow. |
| `CircleArrow` | `app/components/ServicesSection.tsx` | Inline "Learn more / Request a demo" link affordance. |
| `useCountUp` + `StatCounter` | `HeroSection.tsx` | Animated numeric stats. Pass `{ leadNumber, suffix, label }`. |
| `cn()` | `lib/utils.ts` | Any dynamic className. |

## Animation conventions

- **GSAP** for legacy / load animations (rotating SVG circles, services ticker, stat count-up). Don't replace these with Framer Motion.
- **Framer Motion** for new section reveals. Standard pattern:
  ```tsx
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
  >
  ```
- Stagger via `delay: i * 0.12` for card grids.
- **Hero stat cards** (right rail, `md+`): one-time entry stagger (delays 0.4 / 0.55 / 0.7s, `x: 24 → 0`), chart line draws via `pathLength: 0 → 1` (~1.2s), mini-boxes stagger left→right with 100ms gap. No continuous float — `whileHover={{ y: -4 }}` only.

## Service section (section 6) — canonical content

Headline: **"Six capabilities. One unified system."** — pure white (no gradient).

Six cards in a 1/2/3-column responsive grid (`ServiceCardsTrack`). First card (AI & Intelligence) has a subtle purple gradient background. Cards stagger-animate in with `whileInView` (`whileHover={{ y: -4 }}`). Never reduce to fewer than 6.

| # | Title | Accent | Icon kind |
|---|---|---|---|
| 1 | AI & Intelligence | `#9B2FFF` | `ai` |
| 2 | Sales Intelligence Platform | `#72C8F5` | `sales` |
| 3 | Digital Products | `#BB00FF` | `products` |
| 4 | Digital Services | `#3DFD98` | `services` |
| 5 | Automation & Systems | `#72C8F5` | `automation` |
| 6 | Growth & Marketing | `#9B2FFF` | `growth` |

Each card structure (top → bottom):
- **Icon square** (h-14 w-14 rounded-xl) with accent-gradient background, accent-coloured border, soft radial glow behind, and a `<ServiceIcon kind={...} accent={...}/>` line-art glyph with a small sparkle in the top-right.
- **Title** — white, `text-[1.4rem] font-bold tracking-tight`.
- **Bulleted sub-services** (3 items) — diamond bullets (1.5×1.5 rotated 45°) filled with the accent colour, body text white.
- **Learn-more link** — white text + right-arrow, `href="/contact"`, `hover:opacity-80`. Each card has its own `learnMore` string ("Explore AI & intelligence", "Discover Sales Intelligence", etc.).

## CTA pattern

Every hero and every closing CTA section uses **two** `NeonButton`s side by side:
- Primary (solid): action verb — `Book a Free Strategy Call`, `Book a Strategy Call`, `Send a Message`, `Start Your Free Trial`, etc.
- Secondary (ghost): `Explore Our Services` (marketing pages) or `Book a Demo` / `Start Free Trial` (product pages). Marketing-page secondary CTAs link to `/#services`; product-page CTAs link to `/contact`.

Both `size="lg"` with `className="font-semibold tracking-wide"`. Container: `flex flex-col items-center gap-3 sm:flex-row`.

## Content checklist for any new section

1. Section eyebrow (`<SectionLabel text="..." />`) — 1–3 words, uppercase.
2. H2 headline — max 8 words, **white text only** (no gradient fills).
3. Optional body — ≤ 60 words.
4. Cards / grid / mockup — keep below 6 items per row band.
5. CTAs — primary `<NeonButton variant="solid" size="lg" className="font-semibold tracking-wide">` + secondary `<NeonButton variant="ghost" size="lg" className="font-semibold tracking-wide">…</NeonButton>`.
6. Background glow — radial gradient ellipse, low-opacity purple + cyan, `pointer-events-none absolute inset-0 z-0`.
7. Wrap content in `motion.div` with `whileInView`.

## Product pages (`app/products/**`)

Each product page is a **server `page.tsx` exporting `Metadata`** + a sibling client component holding the content. Don't mix them into one `"use client"` file — product pages need real SEO metadata.

Canonical 8-section structure (see `app/products/sales-intelligence-platform/SalesIntelligencePage.tsx`):
1. **Hero** — `PageArcs` background, `SectionLabel`, white h1 (`text-[1.9rem]` → `lg:text-[3rem]`, `font-semibold`, Space Grotesk), 60-word subhead, dual `size="lg"` CTAs (`Start Your Free Trial` / `Book a Demo`).
2. **Problem** — 3 pain-point cards. Match homepage section-3 pattern: gradient `p-px` wrapper, inner `rgba(8,1,28,0.98)` card with accent dot icon (`h-2 w-2 rounded-full` glow), white title, white/50 body.
3. **Core Capabilities** — 2-col grid of 6 cards. Each card: icon square (`h-12 w-12 rounded-xl`, accent gradient bg, radial glow behind), white `text-[1.3rem] font-bold` title, white/55 description, diamond-bullet sub-items (white text, accent diamond `1.5×1.5 rotate-45`). `whileHover={{ y: -4 }}`.
4. **Who It's For** — 3-col grid of audience tiles. Cyan circle check icon + white/75 line. Subtle border `rgba(255,255,255,0.06)`.
5. **Key Outcomes** — 4-up `AnimatedStat` grid (`useCountUp` hook, 1800ms easeOutExpo). Animate numeric values; static labels for non-numeric outcomes (e.g., `0`, `1`).
6. **How It Works** — 3-col grid of 6 numbered steps. Each step: gradient-border wrapper, `#07001F` inner card, big accent-colored `text-[2rem] font-black` number with glow `textShadow`, white title, white/50 body.
7. **FAQ** — `AnimatePresence` accordion. First item open by default. Open border shifts to `rgba(114,200,245,0.28)`; toggle icon is a `+` rotating 45° to `×`. Height + opacity animation, `duration: 0.3`.
8. **Final CTA** — matches homepage section-12 pattern: triple radial-glow background, top divider line, dual `size="lg"` buttons (`Book a Demo` primary / `Start Free Trial` ghost).

When adding new product pages, mirror this 8-section structure and reuse the same `SectionLabel` + `useCountUp` + `FAQItem` helpers (define inline; they're not exported).

### Cross-linking from the homepage

Whenever a new product page launches, wire it in **three** places — failing to update any one of them leaves the funnel broken:

1. **`SERVICE_CARDS` in `HeroSection.tsx`** — set `href: "/products/<slug>"` on every related service card (e.g., the Sales Intelligence Platform launch updated both `AI & Intelligence` and `Sales Intelligence Platform` cards to point at `/products/sales-intelligence-platform`). The `href` field is required on every entry; `ServiceCard` reads `card.href` for the learn-more link.
2. **Featured Product section** (`HeroSection.tsx` §5) — if the product is the featured one, point the `CircleArrow` link at `/products/<slug>` and use copy like `"Explore the platform"` (not `"Request a demo"` — demo CTAs belong on the product page itself).
3. **`SERVICES` array in `Navbar.tsx`** — update the matching entries' `href` to `/products/<slug>`. Services without a product page should stay on `/#services`.

### Navbar Services dropdown

The "Services" link in `Navbar.tsx` is a **hover-triggered dropdown** (not a plain anchor). Implementation rules:

- Hover open + 120ms close delay (`closeTimer` ref so brief mouse-outs don't snap shut).
- Chevron icon to the right of the label, rotates 180° when open (`transform`, 300ms).
- Panel: 280px wide, `rgba(7,0,31,0.85)` + `backdrop-blur(20px)`, 1px white/8 border, large drop shadow. 16px top offset from the trigger (`pt-4`) so the gap is still hoverable.
- Each item: small accent-colored dot (1.5×1.5 with `box-shadow` glow), white/75 label that goes pure white on hover, dot scales 1.25× on hover. Hover bg `rgba(255,255,255,0.05)`.
- `AnimatePresence` open/close: `opacity 0→1`, `y: 6→0`, 180ms.
- Click a link → `setServicesOpen(false)` so the dropdown closes during navigation.

Keep this minimal — no sub-descriptions, no images, no two-column layouts. Six items, dot + label, period.

## Common mistakes to avoid

- Adding any colour outside the brand palette (no oranges, reds, teals unless explicitly status/accent).
- Using `bg-white` text containers — the site is dark; copy lives directly on `#07001F`.
- Replacing rotating SVG circles in the hero — they are the brand signature.
- Adding emoji to body copy. (Emoji is allowed only as a category icon when the user explicitly requested it.)
- Importing `framer-motion`'s old path on Next 16 — use `"framer-motion"`.
- Forgetting `"use client"` on a component that uses `motion`, hooks, or `useRef`.
- Putting scattered floating cards behind/over the headline — the hero stat cards live as a stacked **right rail** (`top` + `right` clamped, `flex-col gap-3`), not as four-corner floats.
- **Applying the brand gradient to any text fill.** Headlines, H2s, the services ticker, service titles, sub-services, and learn-more links are all pure white. The gradient lives only on backgrounds, glows, icon-square fills, button hover affordances, and gradient-border wrappers.
- Forgetting the secondary `Explore Our Services` ghost CTA next to a primary action button — pair them in every hero and closing CTA.

## Verification before reporting done

- [ ] `npm run dev` — page renders with no console errors.
- [ ] Rotating circles + services ticker animate.
- [ ] Section reveals fire on scroll.
- [ ] Hero floating cards visible at `md+`, hidden on mobile.
- [ ] `npm run build` passes type check.
- [ ] ClientsMarquee and TechStackSection visually identical to the locked baseline.

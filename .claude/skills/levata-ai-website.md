# Levata AI Website — Design System Reference

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- Fonts: **DM Sans** (all text, loaded via Next.js `next/font/google`) + **GeistMono** (code/mono)
- CSS variables: `--font-ui` / `--font-display` → DM Sans; `--font-code` → GeistMono

## Theme Architecture — All Dark

All home page sections use `home-theme-dark` (or inherit from `:root` which is dark). There is **no light theme** in use. Never add `home-theme-light` to any section.

```tsx
<section className="home-theme-dark ...">
```

**Section order (HeroSection.tsx):**
1. HomeHero — dark
2. Problem (spider layout) — dark
3. Solution — dark
4. Services carousel (2×2 image cards) — dark
5. Mid-page CTA — dark
6. Clients Marquee — dark
7. Featured Product (Sales Intelligence Platform) — dark
8. By the Numbers — dark
9. Testimonials — dark
10. Tech Stack — dark
11. Why Levata — dark
12. Final CTA — dark
13. Footer — dark

## CSS Custom Properties

| Token | Value |
|---|---|
| `--background` | `#07080F` |
| `--surface` | `#0E0E1A` |
| `--surface-elevated` | `#131328` |
| `--border` | `#1E1B2E` |
| `--text-primary` | `#F0F0F2` |
| `--text-secondary` | `#A3A3AC` |
| `--text-muted` | `#6E6E7E` |
| `--text-disabled` | `#4A4A5A` |
| `--accent` | `#CC01FF` (decorative glows/borders ONLY) |
| `--accent-secondary` | `#00FFDD` |
| `--accent-gradient` | `linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)` |
| `--home-card-bg` | `#0E0E1A` |
| `--home-card-border` | `rgba(30,27,46,0.9)` |
| `--home-control-bg` | `rgba(14,14,26,0.92)` |
| `--home-control-border` | `rgba(30,27,46,0.9)` |
| `--home-control-color` | `#F0F0F2` |

## Font Weight Scale

| Tailwind class | Compiled weight | Use |
|---|---|---|
| `font-thin` | 300 | hero titles, section titles, all display lines |
| `font-normal` | 400 | body text, paragraphs, h3/h4 |
| `font-medium` | 500 | UI labels, nav items |
| `font-semibold` | 600 | buttons, section eyebrow labels |

**Display headings use weight 300.** `display-hero-title`, `display-section-title`, `display-muted-line`, `display-strong-line` all compile to `font-weight: 300`.

Letter-spacing on display titles: `0.01em` (positive, airy). Never negative.

## Heading Pattern — Every h1 and h2

```jsx
<h1 className="display-hero-title max-w-3xl">
  <span className="display-muted-line">Short context phrase</span>
  <span className="display-strong-line">Main claim.</span>
</h1>

<h2 className="display-section-title max-w-2xl text-center">
  <span className="display-muted-line">Context phrase</span>
  <span className="display-strong-line">Value statement.</span>
</h2>
```

- `display-muted-line`: `color: var(--text-secondary)`, weight 300
- `display-strong-line`: `color: var(--text-primary)`, weight 300
- Hierarchy is **color contrast only** — not weight difference

## Span Length Rules

| Container | Max chars per span |
|---|---|
| `max-w-2xl` | ≤ 22 chars |
| `max-w-3xl` | ≤ 25 chars |
| `max-w-4xl` | ≤ 29 chars |

Never `max-w-xl` on centered hero h1. Never `ch`-based max-widths.

## Section Label Pattern

```jsx
<div className="inline-flex items-center gap-3">
  <span className="flex items-center">
    <span className="animate-label-line" />
    <span className="animate-label-dot" />
  </span>
  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Label</p>
</div>
```

## Button Pattern

Primary CTAs use cyan→purple gradient. Text always white/black — no pink/accent on text.

```tsx
<button
  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
  style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)" }}
>
  Book your call →
</button>
```

**NEVER** use `var(--accent)` as a raw solid button fill. Use `var(--accent-gradient)` for CTAs.

## Card Pattern

```tsx
<div style={{
  background: "var(--home-card-bg)",
  border: "1px solid var(--home-card-border)",
}}>
```

## Services Section (actual, in HeroSection.tsx)

Uses `SERVICE_CARDS` array with `ServicesCarousel` component — 2×2 grid of image cards.
Each card: background photo + icon + number always visible. Sub-service chips always visible.
Description + Explore link revealed on hover via `grid-rows-[0fr→1fr]` + opacity transition.

## Problem Section (spider layout, desktop only)

`ProblemSpider` component in HeroSection.tsx. SVG canvas 800×360, center at (400,180).
Four pain points at diagonal corners connected to center visual (`OperationsBeforeTerminal`) via animated dashed spokes with traveling `animateMotion` dots.
Mobile: stacked list + visual.

## Stats Section (By the Numbers)

`KEY_RESULTS` in HeroSection.tsx. Each stat has: `title` (eyebrow), animated count + suffix, `label` (descriptor).
Section headline: "What smarter operations / deliver."

## Mid-page CTA

Headline: "Your next level / starts here."
Subline: "Let's uncover what's slowing your growth, and what fixes it."
Button: "Book your call →"

## Icon Color Rule

All inline SVG icons across the site use **cyan** — `rgba(0,255,221,0.9)` — matching `--home-accent-cyan`.

```tsx
// Always use these constants for icon strokes/fills
const ICON_STROKE = "rgba(0,255,221,0.9)";     // primary icon stroke
const ICON_STROKE_DIM = "rgba(0,255,221,0.45)"; // dimmed secondary paths

// Icon container background + border
style={{ background: "rgba(0,255,221,0.07)", border: "1px solid rgba(0,255,221,0.18)" }}
```

This applies to: process step icons, solution pillar card icons, service visual glows/nodes, and any other decorative SVG icons.  
**Never use** lavender `rgba(167,139,250,...)` or raw purple `#7B55EA` on icon strokes — those are for borders, gradients, and container glows only.

## Non-Negotiable Rules

- No `font-weight` above 300 on display/hero/section titles
- No negative `letter-spacing` on display titles — must be `0` or `0.01em`
- No `font-extrabold` / `font-black` / `font-bold` on body or captions
- No gradient text
- No italic styling
- No `text-balance` on left-aligned text
- No `ch`-based max-widths
- No `max-w-xl` on centered hero h1
- No hardcoded hex in new TSX components — use CSS variables or the gradient constant
- No pink on text, numbers, or headings
- No `home-theme-light` on any section
- Only two font families: DM Sans (all text) + GeistMono (code). Do not introduce a third.

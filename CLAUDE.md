# Levata Design System

This is the authoritative design specification for the Levata website. All AI-generated code must follow these rules exactly.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion. Font: `geomanist` — single unified stack only.

---

## Theme Architecture — All Dark

The home page uses **all-dark sections**. Every section uses `home-theme-dark` (or inherits from `:root` which is dark). There is no light theme in use on the home page.

```tsx
// All sections use dark theme
<section className="home-theme-dark ...">
```

**Home page section order:**
1. HomeHero — dark
2. TechStackSection — dark
3. ClientsMarquee — dark
4. Problem — dark
5. Solution — dark
6. Services — dark
7. Mid-page CTA — dark (after services)
8. Featured Product — dark
9. By the Numbers — dark
10. Testimonials — dark
11. Why Levata — dark
12. Final CTA — dark
13. Footer — dark

**NEVER** use `home-theme-light`. **NEVER** hardcode colors inside themed sections — always use CSS variables.

---

## CSS Custom Properties

### Dark theme tokens (`:root` base + `.home-theme-dark`)

| Variable | Value |
|---|---|
| `--background` | `#0D0F17` |
| `--surface` | `#151822` |
| `--surface-elevated` | `#1C202E` |
| `--border` | `#252A3A` |
| `--text-primary` | `#F0F0F2` |
| `--text-secondary` | `#A3A3AC` |
| `--text-muted` | `#6E6E7E` |
| `--text-disabled` | `#4A4A5A` |
| `--accent` | `#EA4B71` |
| `--accent-gradient` | `linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)` |
| `--home-card-bg` | `rgba(21,24,34,0.94)` |
| `--home-card-border` | `rgba(255,255,255,0.07)` |
| `--home-control-bg` | `rgba(21,24,34,0.92)` |
| `--home-control-border` | `rgba(37,42,58,0.9)` |
| `--home-control-color` | `#F0F0F2` |

---

## Tailwind Utility Mappings (globals.css overrides)

Tailwind's `text-white/XX` classes are remapped to CSS variables:

| Class | Resolves to |
|---|---|
| `text-white` … `text-white/65` | `var(--text-primary)` |
| `text-white/60` … `text-white/45` | `var(--text-secondary)` |
| `text-white/40` … `text-white/30` | `var(--text-muted)` |
| `text-white/25` … `text-white/20` | `var(--text-disabled)` |

**Key rule:** Always use `text-white/XX` Tailwind classes (not hardcoded hex) for text. Never hardcode colors.

Font weight overrides: `font-bold` and `font-semibold` both compile to `600`. `font-medium` compiles to `500`. Max weight anywhere is `600`.

---

## Typography

### Heading Pattern — ALL h1 and h2

```jsx
<h1 className="display-hero-title max-w-3xl">
  <span className="display-muted-line">Context phrase</span>
  <span className="display-strong-line">Main claim.</span>
</h1>

<h2 className="display-section-title max-w-2xl text-center">
  <span className="display-muted-line">Context phrase</span>
  <span className="display-strong-line">Value statement.</span>
</h2>
```

- `display-muted-line`: `color: var(--text-muted)`, weight 400
- `display-strong-line`: `color: var(--text-primary)`, weight 400
- Hierarchy is **color only** — both lines use weight 400

### Span length rules (prevent 4-line wrap at hero font size)

| Container | Max chars per span |
|---|---|
| `max-w-2xl` | ≤ 22 chars |
| `max-w-3xl` | ≤ 25 chars |
| `max-w-4xl` | ≤ 29 chars |

Never use `max-w-xl` for a centered hero h1. Never use `ch`-based max-widths.

### Section label pattern

```jsx
<div className="inline-flex items-center gap-3">
  <span className="flex items-center">
    <span className="animate-label-line" />
    <span className="animate-label-dot" />
  </span>
  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Label</p>
</div>
```

---

## Buttons

Primary CTA buttons use the blue-to-purple gradient. Text/numbers are strictly black and white — no pink/accent on text.

```tsx
// Primary CTA — blue-purple gradient
<button
  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
  style={{ background: "linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)" }}
>
  Book a Strategy Call →
</button>

// Secondary text link
<a className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-200">
  See what we build →
</a>
```

**NEVER** use `var(--accent)` (`#EA4B71`) for button backgrounds. The accent color is only used for small decorative glows/borders, not on text, numbers, or buttons.

---

## Card Pattern

Cards must use CSS variables for all colors. Never hardcode surface or border colors.

```tsx
<div
  style={{
    background: "var(--home-card-bg)",
    border: "1px solid var(--home-card-border)",
    boxShadow: "var(--home-card-shadow)",
  }}
  className="rounded-2xl p-7"
>
```

---

## Non-Negotiable Rules

- No `font-weight: 700` / `font-extrabold` / `font-black`
- No gradient text
- No italic styling
- No `text-balance` on left-aligned text
- No `ch`-based max-widths
- No `max-w-xl` on centered hero h1
- No hardcoded hex color values in new TSX components — use CSS variables or the gradient constant
- No pink (`#EA4B71`) on text, numbers, or headings — strictly black and white for readable content
- No `home-theme-light` on any section — entire home page is dark
- Single font family everywhere (geomanist)

---

## Spacing

- Section vertical padding: `py-14 sm:py-20 md:py-28`
- Hero top padding: accounts for navbar height (~72px) + breathing room
- Card internal padding: `p-7 md:p-9`
- Heading to body gap: `gap-4` or `gap-5` in flex column

## Responsive

- Headings scale via `clamp()` through the display classes
- Mobile: single column, centered text
- Desktop (lg+): two-column hero layout, horizontal carousels unlock

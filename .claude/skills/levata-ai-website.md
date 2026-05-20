# Levata AI Website — Design System Reference

## Stack
- Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- Font: `geomanist` — single unified stack, no secondary fonts

## Theme Architecture — All Dark

All home page sections use `home-theme-dark` (or inherit from `:root` which is dark). There is **no light theme** in use. Never add `home-theme-light` to any section.

```tsx
<section className="home-theme-dark ...">
```

**Section order:**
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

## CSS Custom Properties

| Token | Value |
|---|---|
| `--background` | `#0D0F17` |
| `--surface` | `#151822` |
| `--surface-elevated` | `#1C202E` |
| `--border` | `#252A3A` |
| `--text-primary` | `#F0F0F2` |
| `--text-secondary` | `#A3A3AC` |
| `--text-muted` | `#6E6E7E` |
| `--text-disabled` | `#4A4A5A` |
| `--accent` | `#EA4B71` (decorative glows/borders ONLY — never on text or buttons) |
| `--accent-gradient` | `linear-gradient(135deg, #4B91F7 0%, #7B55EA 100%)` |
| `--home-card-bg` | `rgba(21,24,34,0.94)` |
| `--home-card-border` | `rgba(255,255,255,0.07)` |
| `--home-control-bg` | `rgba(21,24,34,0.92)` |
| `--home-control-border` | `rgba(37,42,58,0.9)` |
| `--home-control-color` | `#F0F0F2` |

## Tailwind Utility Mappings

Tailwind `text-white/XX` remapped to CSS vars in globals.css:

| Tailwind | Resolves to |
|---|---|
| `text-white` | `var(--text-primary)` |
| `text-white/55` | `var(--text-secondary)` |
| `text-white/40` | `var(--text-muted)` |
| `text-white/25` | `var(--text-disabled)` |

## Heading Pattern — Every h1 and h2

Both lines weight 400. Hierarchy is color-only.

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

- `display-muted-line`: `color: var(--text-muted)`, weight 400
- `display-strong-line`: `color: var(--text-primary)`, weight 400

## Span Length Rules

At hero size (56px):
- `max-w-2xl` → ≤ 22 chars
- `max-w-3xl` → ≤ 25 chars
- `max-w-4xl` → ≤ 29 chars

Never use `max-w-xl` on a centered hero h1.

## Font Weight Scale

| Tailwind class | Actual weight | Use |
|---|---|---|
| `font-normal` | 400 | body text, display headings |
| `font-medium` | 500 | UI text, navbar, buttons |
| `font-semibold` | 600 | h3 headings |
| `font-bold` | 600 | section headings |

No `font-extrabold`, no `font-black`, no weight 700 anywhere.

## Button Pattern

Primary CTAs use blue-purple gradient. Text and numbers are strictly white/black — no pink on readable content.

```tsx
// Primary CTA — gradient
<button
    type="button"
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

**NEVER** use `var(--accent)` for button backgrounds. Accent is for decorative glows/SVG borders only.

## Card Pattern

```tsx
<div style={{
    background: "var(--home-card-bg)",
    border: "1px solid var(--home-card-border)",
    boxShadow: "var(--home-card-shadow)",
}}>
```

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

## Prohibited

- `font-weight: 700` / `font-extrabold` / `font-black`
- Gradient text or glow text effects
- Italic styling
- `text-balance` on left-aligned text
- `ch`-based max-widths
- `max-w-xl` on centered hero h1
- Pink (`#EA4B71`) on text, numbers, headings, or buttons
- `home-theme-light` on any section
- Hardcoded color hex values in component styles — always use CSS variables
- Multiple font families

# Levata Design System

This is the authoritative design specification for the Levata website. All AI-generated code must follow these rules exactly.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion.

### Fonts (two-stack system, all loaded in [app/layout.tsx](app/layout.tsx))

| Purpose | Font | CSS variable | Weights |
|---|---|---|---|
| All text — headings, body, UI | **DM Sans** | `--font-dm-sans` → `--font-display` / `--font-ui` | 300, 400, 500, 600, 700 |
| Terminal / logs / code (`code`, `pre`, `kbd`, `[class*="font-mono"]`) | **GeistMono** | `--font-geist-mono` → `--font-code` | 400, 500 |

Hero and section titles use **DM Sans weight 300** — light, airy, with `letter-spacing: 0.01em`. Do not import additional font families or set `font-family` inline.

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
| `--background` | `#07080F` |
| `--surface` | `#0E0E1A` |
| `--surface-elevated` | `#131328` |
| `--border` | `#1E1B2E` |
| `--text-primary` | `#F0F0F2` |
| `--text-secondary` | `#A3A3AC` |
| `--text-muted` | `#6E6E7E` |
| `--text-disabled` | `#4A4A5A` |
| `--accent` | `#CC01FF` (decorative glows/borders ONLY — never on text or buttons) |
| `--accent-secondary` | `#00FFDD` |
| `--accent-gradient` | `linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)` |
| `--home-card-bg` | `rgba(14,14,26,0.94)` |
| `--home-card-border` | `rgba(255,255,255,0.07)` |
| `--home-control-bg` | `rgba(14,14,26,0.92)` |
| `--home-control-border` | `rgba(30,27,46,0.9)` |
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

Font weight scale:

| Class | Compiled weight | Use |
|---|---|---|
| `font-thin` | 300 | hero titles, section titles, all `.display-*` lines |
| `font-normal` | 400 | body text, paragraphs, h3/h4 |
| `font-medium` | 500 | UI labels, nav items |
| `font-semibold` | 600 | buttons, section eyebrow labels |

**Display headings use weight 300.** Never apply 500+ to `.display-hero-title`, `.display-section-title`, `.display-muted-line`, or `.display-strong-line`.

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

- `display-muted-line`: `color: var(--text-secondary)`, weight **300** (DM Sans)
- `display-strong-line`: `color: var(--text-primary)`, weight **300** (DM Sans)
- Hierarchy comes from **color contrast only** — secondary vs primary, not weight difference

### Span length rules (prevent 4-line wrap at hero font size)

| Container | Max chars per span |
|---|---|
| `max-w-2xl` | ≤ 22 chars |
| `max-w-3xl` | ≤ 25 chars |
| `max-w-4xl` | ≤ 29 chars |

Never use `max-w-xl` for a centered hero h1. Never use `ch`-based max-widths.

### Hero lines must stay on one line (no 3rd line)

Each `display-muted-line` / `display-strong-line` span is a single intended line — hero headings must render as **exactly 2 lines** on tablet/desktop, never wrapping a span to a 3rd line. Because the hero font uses `clamp()` (`--text-hero`), a span can grow enough at mid-size desktop widths to wrap even when within the char limit above.

- **Centered hero h1s:** add `sm:whitespace-nowrap` to each span. If a span exceeds its container's char limit, also bump the container one step (e.g. `max-w-3xl` → `max-w-4xl`).
- **Home hero** (left-aligned in the 2-column `1fr 380px` grid): the text column is narrow at `lg`. Its `<h1>` uses class `home-hero-title`; globals.css forces `white-space: nowrap` on its spans at `min-width: 1024px`. Do not reduce its font size to fix wrapping — keep nowrap.
- Below `sm`/`lg` (single-column mobile) wrapping is allowed and expected.

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

Primary CTA buttons use the purple-to-cyan gradient. Text/numbers are strictly black and white — no pink/accent on text.

```tsx
// Primary CTA — purple-to-cyan gradient
<button
  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
  style={{ background: "linear-gradient(135deg, #00FFDD 0%, #CC01FF 100%)" }}
>
  Book a Strategy Call →
</button>

// Secondary text link
<a className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors duration-200">
  See what we build →
</a>
```

**NEVER** use `var(--accent)` (`#CC01FF`) as a raw solid fill. The accent color is for decorative glows/borders only. Use `var(--accent-gradient)` for all CTA buttons.

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

- No weight above 300 on `.display-hero-title`, `.display-section-title`, `.display-muted-line`, `.display-strong-line`
- No negative `letter-spacing` on hero/section titles — must be `0` or positive (`0.01em`)
- No `font-extrabold` / `font-black`
- No `font-bold` on body copy, captions, labels, or buttons
- No gradient text
- No italic styling
- No `text-balance` on left-aligned text
- No `ch`-based max-widths
- No `max-w-xl` on centered hero h1
- No hardcoded hex color values in new TSX components — use CSS variables or the gradient constant
- No pink on text, numbers, or headings
- No `home-theme-light` on any section — entire home page is dark
- Only two approved font families: DM Sans (all text) + GeistMono (code/terminal). Do not introduce a third family or set inline `font-family`.

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

---

## Team section (About page)

Team data lives in the `TEAM` array in [app/about/page.tsx](app/about/page.tsx). Each member: `{ name, role, photo, bio }`. Photos are in `public/team/`. Order is intentional: **Rahman (COO) → Shameer (CEO, middle) → Amaan**. Cards use `.team-card` + `.team-photo-ring` (gradient ring, hover lift/glow) from globals.css; photos are full color (no grayscale). Member photos should be kept reasonably small for web (≤ ~600px / a few hundred KB).

---

## Deployment (Namecheap, cPanel Node.js App)

Hosted on Namecheap shared hosting via **Setup Node.js App**. App root is the home-level folder **`levatahq.com`** (`/home/stagdctc/levatahq.com`), NOT `public_html`. App settings: Node **22**, mode **Production**, startup file **`server.js`**, env vars `NODE_ENV=production` and `RESEND_API_KEY` (the contact form needs it; `.env.local` is never uploaded). `package.json` `start` must be `node server.js`.

**Deploy loop for any change:**
1. Edit + `npm run build` locally (always delete a stale `.next` first if it ever grows huge — a `.next/dev` folder from `npm run dev` must never be deployed).
2. Build the upload zip from these only: `.next/` (minus `cache`), `app/`, `lib/`, `public/`, `scripts/`, `package.json`, `package-lock.json`, `server.js`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.mjs`. Zip the **contents** (files at zip root, no nested folder). A correct zip is ~20 MB.
3. cPanel File Manager → `levatahq.com` → Upload → Extract (confirm `server.js`/`package.json` at root) → delete zip.
4. **Fix permissions (always — Windows zips lose the execute bit, causing `EACCES` on `.next/static`):** cPanel → Terminal:
   ```
   cd /home/stagdctc/levatahq.com
   find .next -type d -exec chmod 755 {} \;
   find .next -type f -exec chmod 644 {} \;
   ```
5. Setup Node.js App → Stop → **Run NPM Install** → Start.

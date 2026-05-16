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

`TechStackSection` (inside `HeroSection.tsx`) was previously locked but is **no longer** — it was intentionally rewritten as a 2-row opposing marquee. See §10 canonical layout below.

## Visual restraint rule (canonical, homepage §3–§10)

Outside the hero, the homepage is **monochrome**. The brand gradient is reserved for:
- HomeHero atmospheric glow orbs
- `GradientBorder` wrappers on featured panels (§3 After card, §4 flow nodes, §7 Featured Product container)
- `NeonButton` hover affordances
- §4 flow-connector traveling dots (+ the §3↔§4 vertical connector)
- The §6↔§7 horizontal divider
- The H1 `textShadow` premium glow

**Everywhere else:**
- Icons and glyphs render in `rgba(255,255,255,0.7–0.75)`. `ServiceIcon` ignores its `accent` prop and always renders white.
- `ServiceIconSquare` has `rgba(255,255,255,0.03)` bg + `rgba(255,255,255,0.08)` border. **No radial-gradient halo, no inset/outer boxShadow glow, no accent-tinted bg.**
- Diamond bullets (§3 wins, §6 expanded rows) are `rgba(255,255,255,0.6)`.
- §6 accordion plus-toggle: white/4 bg, white/18 border, white/75 stroke — not cyan.
- §9 featured card uses the same flat `rgba(8,1,28,0.55)` bg as the others — its dominance comes from 2×2 size, not accent tint.
- §9 schematic SVGs (`IconLayersDiagram` / `IconE2EDiagram` / `IconLoopDiagram` / `IconBarsDiagram`) stroke in `rgba(255,255,255,0.65)`, fills in `rgba(255,255,255,0.08)`. None take an `accent` prop. `WhyVisualTrio` was removed when §9 went flat.

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
| `SectionLabel` | inline in `HeroSection.tsx` / `about/page.tsx` / `HomeHero.tsx` | Every section eyebrow. |
| `CircleArrow` | `app/components/ServicesSection.tsx` | Inline "Learn more / Request a demo" link affordance. |
| `useCountUp` + `StatCounter` | `HeroSection.tsx` | Animated numeric stats. Pass `{ leadNumber, suffix, label }`. |
| `cn()` | `lib/utils.ts` | Any dynamic className. |

## Homepage hero (`HomeHero.tsx`)

Self-contained. **Do not** put the rotating arcs back, **do not** put the "What we build" services ticker back, and **do not** apply the brand gradient to the H1 — it's pure white, no `textShadow`.

Three glassmorphism cards (AI Metrics, Workflow Status, Revenue Uplift) live **inside** this file. Card chrome is the `GradientBorder` pattern (cyan→white→purple p-px outer, `rgba(6,0,20,0.7)` + `backdrop-blur-xl` inner, white/8 border). Cards are `pointer-events-none` end-to-end — no hover lift, no glow effects.

**No cursor parallax.** No `HeroGlowOrbs`, no perspective grid, no vignette. Background is plain `bg-[#07001F]` + `HeroBubbles` cursor ring effect (`app/components/HeroBubbles.tsx`). Cards animate in with staggered `opacity 0→1, x: 24→0` on mount.

**HeroBubbles** (`app/components/HeroBubbles.tsx`): DOM-based cursor ring effect mounted inside `HomeHero`. On `mousemove` (every ~10px) spawns a `motion.div` ring at cursor + random offset (±11px). Each ring: thin 1px border (alternates `rgba(255,255,255,...)` and `rgba(114,200,245,...)`, opacity 0.18–0.36), `border-radius: 50%`, `filter: blur(0.6px)`. Framer Motion animates `scale: 0.12 → 2.6–4.4`, `opacity: 0.55 → 0`, plus small upward + lateral drift. Duration 0.9–1.65s, ease `[0.08,0.55,0.25,1]`. Self-removes via `onAnimationComplete`. Max 22 rings live at once. Respects `prefers-reduced-motion`. No canvas, no rAF loop.

**Typography:** H1 uses `text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]` with `font-semibold leading-[1.05] tracking-[-0.025em]`. No textShadow. This same scale applies to **all** hero H1s (homepage, about, contact, every product page) — sub-pages are no longer larger.

**CTAs:** Two `<NeonButton size="lg">` side by side (`variant="solid"` primary + `variant="ghost"` secondary). **Exception:** "Book a Strategy Call" hero CTAs on the homepage (`HomeHero.tsx`), About page, and AI Intelligence page use a custom **neon-glass `<a>` anchor** (matching the navbar Contact Us button) instead of `NeonButton variant="solid"`. Style: `background: linear-gradient(135deg, rgba(114,200,245,0.08), rgba(155,47,255,0.08))`, `boxShadow: "0 0 10px rgba(114,200,245,0.1)... inset 0 0 0 1px rgba(114,200,245,0.18)"`, `color: white`. Hover brightens glow + border. Product-page hero primary CTAs still use `NeonButton variant="solid"`.

**Card layout** on `md+`: right column is `hidden md:flex flex-col gap-2 lg:max-w-[340px] lg:ml-auto`. Cards are compact (`px-3 py-2.5`) and stack vertically.

## Animation conventions

- **GSAP** for legacy / load animations (`PageArcs.tsx` rotating circles on about/contact/product pages, stat count-up, TechStackSection fade-ins). Don't replace these with Framer Motion. **The homepage hero no longer uses GSAP** — it's pure Framer Motion.
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
- **Homepage hero (static)** — owned by `HomeHero.tsx`, not inline. **No cursor parallax, no HeroGlowOrbs.** Cards animate in on mount with staggered `x: 24→0, opacity 0→1` only. Plain static background.

## Premium section layouts (homepage §3–§9)

The homepage was upgraded with Lyzr-style premium layouts. Six sections are now considered "canonical premium" — don't simplify them back into generic equal-card grids.

### §3 Problem — Before/After split
2-column `md:grid-cols-2` with diagonal arrow connector circle (40×40, gradient border, cyan arrow icon) pinned at the absolute centre. Left card is desaturated (`rgba(8,1,28,0.6)`, white/45 text, ⨯ icons in dashed circles) + a "broken system" SVG schematic (dashed disconnected boxes). Right card uses the `GradientBorder` chrome (cyan→white→purple p-px) + green ✓ icons + a hub-and-spoke "connected nodes" SVG schematic. Data lives in the `TRANSFORMATIONS` array (3 pain/win pairs); never reduce below 3 pairs.

### §4 Solution — 4-node flow diagram
The H2 + sub paragraph stay centred; below them, the `FLOW_NODES` array drives 4 `<FlowNode>` cards joined by `<FlowConnector>`. Connectors are gradient-stroke dashed lines with an infinite-looping `motion.circle` traveling dot (2.4s `repeat: Infinity, ease: "easeInOut"`). On `<md` the layout becomes vertical (`FlowConnector vertical />`). The 4 nodes are immutable (Diagnose → Architect → Build → Compound); changing them requires explicit sign-off.

### §5 Services — Horizontal carousel *(was interactive explorer, before that was centered accordion)*
Full-width at `max-w-7xl mx-auto`. Rendered by `<ServicesCarousel>` (inline function in `HeroSection.tsx`).

**Layout:**
- **Header row** on top (`flex items-end justify-between`):
  - Left: small `"What we do"` eyebrow (white/45 uppercase tracked) + H2 `"Four capabilities."` + small `"Book a strategy call ↗"` link in white/70 with arrow icon (top-right arrow style).
  - Right: 2 round 44×44 arrow buttons (prev / next) with `rgba(255,255,255,0.03)` bg, white/12 border. `disabled` state at `opacity-30`.
- **Scroll track** below (`flex gap-4 overflow-x-auto`):
  - Inline `style`: `scrollSnapType: "x mandatory"`, `scrollbarWidth: "none"`, `WebkitOverflowScrolling: "touch"`.
  - Class: `services-carousel-scroll` (the matching CSS in `globals.css` hides the native scrollbar via `::-webkit-scrollbar { display: none }`).
  - Each card: `<a data-card href={card.href}>`, width `min(85vw, 360px)`, `scrollSnapAlign: "start"`, flat homepage chrome (`rgba(8,1,28,0.55)` bg, white/7 border, hover bg tint).

**Card content** (top → bottom):
1. `<ImagePlaceholder aspect="3 / 2" label="<service> mockup" accent={card.accent} />` — accent-tinted per service.
2. `Service 0X` eyebrow in `${card.accent}CC`.
3. Title (`text-[1.3rem] md:text-[1.4rem] font-bold`).
4. Description (white/55).
5. Diamond-bulleted sub-services with `card.accent` diamonds.
6. "Learn more →" with arrow that translates right on hover.

**State + scroll behavior:**
- `scrollRef = useRef<HTMLDivElement>(null)`.
- `canPrev` / `canNext` driven by `scrollLeft > 4` / `scrollLeft + clientWidth < scrollWidth - 4` (4px tolerance for sub-pixel rounding).
- Re-evaluate on `scroll` event + `ResizeObserver` on the track.
- `scrollBy(dir: 1 | -1)`: queries the first `[data-card]`, scrolls by its width + 16px gap, `behavior: "smooth"`.

The old `ServicesExplorer` and `ServicesAccordion` functions stay defined in the file but are unused (cleanup later).

**Data**: `SERVICE_CARDS` now requires a `description` field (~12-18 words per service) in addition to `subServices`. Existing fields (`title`, `subServices`, `learnMore`, `href`, `accent`, `icon`) stay.

**Never re-introduce** the sticky 2-col image layout (broke the centered-header rhythm) or the bare accordion (felt static and unmodern). The old `ServicesAccordion` function stays defined for now as dead code.

**Canonical service taxonomy (exactly 4 — never add to this list):**

| # | Title | Accent | Icon kind | Href |
|---|---|---|---|---|
| 1 | AI & Intelligence *(open by default)* | `#9B2FFF` | `ai` | `/contact` |
| 2 | Digital Products | `#BB00FF` | `products` | `/contact` |
| 3 | Digital Services | `#3DFD98` | `services` | `/contact` |
| 4 | Automation & Systems | `#72C8F5` | `automation` | `/contact` |

**Removed entirely (do not re-add):** Sales Intelligence Platform (it's a product — surfaces only in §5 + Navbar Products dropdown). Growth & Marketing (cut from the offering).

Reuse `<ServiceIconSquare>` and `<ServiceLearnMore>` (inline helpers in `HeroSection.tsx`) — don't reimplement. The `featured` field on `SERVICE_CARDS` was dropped — accordion rows are all equal. **Never reintroduce the old bento card variants for §5** — the accordion is canonical. `<ImagePlaceholder>` no longer renders in §5.

## Sub-page section grammar (`/about` + `/products/sales-intelligence-platform`)

Both sub-pages now share the homepage canonical patterns. **All section headers are centered** (eyebrow + H2 + sub paragraph, `mb-12` to `mb-14`). **All content cards use the same flat chrome**: `rgba(8,1,28,0.55)` bg, `rgba(255,255,255,0.07)` border, `rounded-2xl p-7 md:p-8`, hover-lift (`hover:bg-white/[0.03]` + `whileHover y: -4`). **Icons / diagrams are monochrome** (`rgba(255,255,255,0.65)` stroke, `rgba(255,255,255,0.08)` fill).

### Sales Intelligence layout distinctness rule
Sales sections share homepage's color tokens, flat chrome, and monochrome icon rule — but **never duplicate a homepage section's *shape* 1:1**. Capabilities = grid (not accordion). Process = horizontal stepped flow (not vertical timeline). Outcomes already match homepage §7 (counters row) — fine because there's no other way to render 4 large numbers. Hero, FAQ, Final CTA, and Problem can stay structurally similar to homepage because they're patterns with fewer variations.

### Sales Intelligence Platform (`SalesIntelligencePage.tsx`)
- **§2 Problem**: 3 flat cards (`md:grid-cols-3 gap-5`). Each card has a **per-pain line-art SVG icon** in an accent-tinted `h-12 w-12` rounded-xl tile (bg `{accent}14`, border `{accent}40`, SVG color via `currentColor` from the parent's `color: {accent}`). Icons + accents arrays — `PAIN_ICONS = [IconResearchClock, IconEnvelopeIgnored, IconLeakyFunnel]` and `PAIN_ACCENTS = ["#9B2FFF", "#BB00FF", "#72C8F5"]` — defined inline at the top of `SalesIntelligencePage.tsx`. Mapped by card index. Title + body stay monochrome white.
- **§3 Core Capabilities**: **flat 2-col 3-row grid** at `max-w-5xl` (`grid-cols-1 md:grid-cols-2 gap-5`). Each card: `<CapabilityIcon kind={c.icon} accent={c.accent} />` in a **per-capability accent-tinted** `h-12 w-12` rounded-xl tile (bg `{c.accent}14`, border `{c.accent}40`), then title + description (white/55) + **diamond-bulleted sub-services with `c.accent` diamonds** (was white/60). Hover-lift. **No expansion, no accordion** — distinct from homepage §5. The `CapabilitiesAccordion` function stays defined but is unused.
- **§4 Who It's For**: flat tile grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`). White/75 check icon in a white/4 / white/18 bordered circle + white body. Card bg matches homepage flat chrome.
- **§5 Key Outcomes**: clean 4-counter row (`AnimatedStat`s in a `grid-cols-2 md:grid-cols-4` row). No panel.
- **§6 How It Works**: **horizontal stepped flow** at `max-w-6xl`. `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-4 gap-y-12`. Each cell: circular numbered badge centered at top (`h-12 w-12 md:h-14 md:w-14` rounded-full, `rgba(8,1,28,1)` bg, **per-step `{step.accent}80` border**, **4px solid `#07001F` ring** to punch through the connecting line, **a soft `{step.accent}30` glow** (`boxShadow: 0 0 0 4px #07001F, 0 0 20px {accent}30`), **`{step.accent}`-colored bold number** inside). Title (white) centered below, body (white/55, `max-w-[180px]`) centered. **Connecting line stays monochrome** (`linear-gradient(to right, transparent, white/18 6%, white/18 94%, transparent)`) absolutely positioned at `top: 28px`, **`lg+` only**. `whileInView` fade-in stagger. `STEPS` data already carries `accent` per step (`#9B2FFF / #72C8F5 / #BB00FF / #3DFD98 / #72C8F5 / #9B2FFF`).
- **§7 FAQ**: `<FAQItem>` accordion. Plus-toggle now uses white/4 bg + white/18 border + white/75 stroke (not cyan). Border on open: white/18 (not cyan). Otherwise unchanged.
- **§8 Final CTA**: top horizontal gradient divider + dual canonical-style NeonButton (see "Canonical button style" below).

### About page (`app/about/page.tsx`)
- **Who We Are**: centered single-column at `max-w-4xl`. Header centered at top (`<SectionLabel text="Who we are" />` + H2 + sub). Body paragraph centered at `max-w-3xl text-white/55`. Below: the "Our vision" gradient-bordered callout panel at `max-w-2xl mx-auto` — kept as the only place gradient lives on this page.
- **Team**: 3 **standalone circular avatars** in a grid — **no card wrapper, no border, no hover-lift**. Each cell is just `flex flex-col items-center text-center`. Circle: `h-32 w-32 md:h-36 md:w-36 rounded-full border-2 border-dashed border-white/[0.18]` + subtle inner radial gradient (`rgba(155,47,255,0.08) → rgba(8,1,28,0.5)`). Big initials inside (`text-2xl md:text-3xl font-bold tracking-tight text-white/85`) via `initialsFrom(name)`. Below the circle: name (`mt-6 text-lg md:text-xl font-bold white`), role (`mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45`), bio (`mt-3 max-w-xs text-sm text-white/55`). Grid: `gap-12 lg:gap-8` for breathing room since the circles are the sole visual anchors. Section header is **centered**.
- **Why Clients Choose Us**: **flat 2×2 equal grid** mirroring homepage §9. `md:grid-cols-2 md:auto-rows-fr gap-5`. Each card: monochrome schematic SVG at top (`IconLayersDiagram`, `IconE2EDiagram`, `IconLoopDiagram`, `IconBarsDiagram` — all duplicated inline in `app/about/page.tsx`, identical to homepage §9 versions) + bold title + body. Drop the old gradient-stroked icons (`IconAINative`, `IconEndToEnd`, `IconContinuous`, `IconOutcomes`).
- **Final CTA**: already has the top divider + dual canonical-style NeonButton (see "Canonical button style" below).

**Never re-add** colored icon squares, accent-tinted card backgrounds, radial-glow boxShadows, sticky 2-col layouts, person-silhouette placeholders, or card chrome around the Team avatars — the homepage grammar is the contract.

## Where accent colors are allowed (icons + numbers exceptions)

The site is otherwise monochrome, but **icons and numbers** may use brand accent colors in these specific surfaces:

| Surface | What gets accent |
|---|---|
| Homepage §5 ServicesExplorer (active service) | Left list active number + right panel eyebrow (`{accent}CC`) + diamond bullets + small placeholder tint (`ImagePlaceholder accent={card.accent}`) |
| Sales §2 Problem (per pain) | Line-art icon stroke (`currentColor` from `color: {PAIN_ACCENTS[i]}`) + icon tile bg/border |
| Sales §3 Core Capabilities (per capability) | `CapabilityIcon` stroke + icon tile bg/border + diamond bullets — via `c.accent` |
| Sales §6 How It Works (per step) | Numbered badge border + number color + soft accent glow — via `step.accent` |

**The card chrome around these surfaces still stays monochrome** (`rgba(8,1,28,0.55)` bg + white/7 border + hover state). Only the icon/number/glyph inside picks up accent.

**Where accent is NOT allowed (still monochrome):**
- Homepage §3 Problem Before/After schematics
- Homepage §4 Solution flow node icons
- Homepage §6 Featured Product chrome (gradient border is permitted, but icons stay white)
- Homepage §9 Why Levata schematic diagrams (`IconLayersDiagram` etc.)
- About page Why Clients Choose diagrams (same set)
- About page Team initials
- Sales §4 Who It's For check icons
- Sales §7 FAQ plus-toggle

If you're adding a new section, default to monochrome unless the icons/numbers are the *primary visual hierarchy* of that section (in which case, accent is acceptable per the above table).

## Canonical button style (site-wide)

Every `NeonButton` CTA across home / about / contact / Sales / AI Intelligence pages uses **one** treatment:
```tsx
<NeonButton variant="solid" size="default" className="text-sm font-semibold tracking-wide px-6 py-2.5">
```
Secondary buttons (where present) use `variant="ghost"` with the same `size` + `className`. **`size="lg"` is no longer used anywhere on the site** — single canonical button. The About hero "Book a Strategy Call" anchor is an intentional exception: it uses a custom neon-glass `<a>` (matching the navbar Contact Us pill style) instead of `NeonButton`. Preserved as a special hero treatment; don't migrate it.

### §6 Featured Product — placement
Section eyebrow `"Featured product"` + H2 + sub + the dashboard-mockup `GradientBorder` card (Sales Intelligence Platform pitch + dashboard SVG mockup). Same content as before — only the eyebrow text and the section position changed. Padding `pt-20 md:pt-24 pb-10 md:pb-14`. Followed by a thin horizontal gradient divider that bridges into §7 Numbers below.

### §7 By the Numbers — clean 4-counter row *(sits below Featured Product)*
Preceded by the §6↔§7 horizontal gradient divider. Section eyebrow `"By the numbers"` + H2 `"The outcomes speak for themselves."` + a clean `grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-x-12 text-center` row of 4 `StatCounter` calls. **No panel chrome, no `GradientBorder` wrapper, no body copy, no `ImagePlaceholder`, no hero-stat split.** Just the 4 animated numbers — they prove the product story above. `CountUpInline` helper was removed. Top padding `pt-10 md:pt-14`.

### §8 Process — Vertical timeline (`ProcessTabsSection.tsx`)
Single-column layout in `max-w-4xl mx-auto`. **Section header is centred at the top** (`<SectionLabel text="How we work" />` + H2 `"From strategy to compounding success."` + sub paragraph in white/50). Below the header: a **vertical timeline** of 3 numbered steps.

**Timeline construction:**
- A 1px vertical gradient line runs down the left edge of the timeline container, absolute-positioned: `left-6 top-8 bottom-8 md:left-8`. Background: `linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.18) 12%, rgba(255,255,255,0.18) 88%, transparent 100%)`. The line fades at top and bottom so it doesn't extend beyond the first/last badge.
- 3 step rows in `flex flex-col gap-12 md:gap-16`. Each row is `flex items-start gap-6 md:gap-10`.

**Numbered badge** (left side of each row, sits on the timeline):
- `h-12 w-12 md:h-16 md:w-16 rounded-xl flex-shrink-0`.
- Background `rgba(8,1,28,0.95)` with `1px solid rgba(255,255,255,0.12)` border.
- `boxShadow: "0 0 0 6px rgba(7,0,31,1)"` — a 6px solid section-bg-colored ring around the badge so it visibly "cuts" the timeline line.
- Number text: `text-base md:text-xl font-extrabold tracking-tight text-white`.
- Pure monochrome — no accent.

**Content** (right side of each row, `flex flex-1 flex-col gap-4 md:gap-5 pt-1 md:pt-2`):
- `"Phase 0X"` eyebrow (`text-[10px] font-bold uppercase tracking-[0.22em] text-white/40`).
- Title `text-2xl md:text-[1.75rem] font-bold tracking-tight text-white`.
- Dotted-bullet list (white/65 text, white/50 round dots — `h-1.5 w-1.5 rounded-full`).
- Result line in a subtle bordered card: `rounded-lg px-4 py-3`, `rgba(255,255,255,0.02)` bg, white/6 border. `"Result: "` prefix in white/80, rest in white/55.

**Animations**: `whileInView` fade-in (`opacity 0→1, y: 30→0`), staggered `delay: i * 0.12`. No hover effects on the row.

**No tabs, no `useState`, no `useEffect`, no auto-rotate, no `AnimatePresence`, no `MockupPlaceholder`, no inline card mockups, no `useScroll`/`useMotionValueEvent` scroll-stepping, no watermark numbers, no card containers around each step.** Pure timeline. To add/edit steps, edit the `PROCESS_STEPS` array at the top of `ProcessTabsSection.tsx`.

The component name `ProcessTabsSection` is historic — there are no tabs. Filename is kept to avoid import churn; treat it as the canonical "Process section" component.

### §9 Why Choose Levata — flat 2×2 equal-cards grid
`md:grid-cols-2 md:auto-rows-fr gap-5` — **all 4 cards same size**, no featured variant. Each card: `rgba(8,1,28,0.55)` bg + `rgba(255,255,255,0.07)` border, padding `p-7 md:p-9`, subtle hover (`hover:bg-white/[0.03]` + `whileHover y: -4`). Card structure: monochrome `<WhyVisualHint>` SVG at top, then `text-xl md:text-2xl font-bold` title, then `text-white/55 text-sm md:text-[15px]` body. **No `WhyVisualTrio` (removed)**, **no eyebrow inside cards**, **no accent-tinted bg on any card**.

`WhyVisualHint` routes by title keyword to one of four monochrome diagrams:
- `IconLayersDiagram` (stacked layers w/ embedded nodes) for "AI-Native"
- `IconE2EDiagram` (3 connected nodes) for "End-to-End"
- `IconLoopDiagram` (curved arrow loop) for "Continuous Optimisation"
- `IconBarsDiagram` (ascending bars + trendline) for "Outcomes"

All diagrams stroke in `rgba(255,255,255,0.65)`, fills in `rgba(255,255,255,0.08)`. None take an `accent` prop. The `featured` field on `WHY_LEVATA` entries is still typed (legacy compat) but ignored by the layout.

### Shared bento primitives

- `<ImagePlaceholder aspect={...} label?={...} className?={...} />` — gradient bg + `.hero-grid-bg` mask + radial purple glow + white/30 "Image placeholder" label. Used in §5 Services + `ProcessTabsSection`. Replace with real `<Image>` later by editing this single component.
- `<ServiceIconSquare icon size?={"sm"|"md"} />` — **monochrome** white-on-dark tile (no accent, no glow, no boxShadow). `accent` prop kept on the type for backwards compat but ignored. Used in §5 accordion + §4 flow nodes.
- `<ServiceLearnMore label href />` — white text + right-arrow link, used in §5 rows.
- `<FlowNode />` + `<FlowConnector vertical? />` — §4 only (plus §3→§4 vertical bridge).

All defined inline in `HeroSection.tsx` (except `MockupPlaceholder` inside `ProcessTabsSection.tsx` which is a §8-specific clone).

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

## Booking modal contract

`Book a Strategy Call` CTAs across the site open the inline `<BookCallModal>` — they never route to `/contact`. The three-piece system:

- `app/components/BookCallModal.tsx` — Centered dialog. `AnimatePresence` + scale/fade entry. Backdrop is `rgba(7,0,31,0.78)` + `backdrop-blur(8px)`. Closes on Esc, backdrop click, or the top-right `×` button. Locks `body.overflow` while open. Renders `<ContactCTASection showHeading={false} />` inside a `max-w-5xl rounded-2xl p-px` gradient-border panel.
- `app/components/BookCallProvider.tsx` — Mounts the modal exactly once at the layout root (`app/layout.tsx`) and exposes the `useBookCall()` hook returning `{ open, close }`. Wrapped inside `<SmoothScrollProvider>`.
- `app/components/BookCallButton.tsx` — Wraps `<NeonButton>` and calls `useBookCall().open()` on click. Use this when you want NeonButton styling (e.g. ghost secondaries paired with a primary). For custom neon-glass anchor styling (hero / final-CTA primaries), use a raw `<button onClick={openBookCall}>` and keep the existing inline `style` + `onMouseEnter`/`onMouseLeave` chrome.

`/contact` is **not** removed. It still renders `<ContactCTASection />` standalone and remains the destination of the Navbar "Contact Us" pill — covering direct links, email-blasted URLs, and SEO. Don't add another route or duplicate the form anywhere else.

When adding a CTA:
- Import `useBookCall` and pull `const { open: openBookCall } = useBookCall();` inside the component (top-level, alongside other hooks).
- Wire `onClick={openBookCall}` on a `<button type="button">`.
- Never use `<a href="/contact">` for a primary CTA. The only `/contact` link that remains is the Navbar pill.

## Product pages (`app/products/**`)

Each product page is a **server `page.tsx` exporting `Metadata`** + a sibling client component holding the content. Don't mix them into one `"use client"` file — product pages need real SEO metadata.

### Product page color rule

A consolidated color grammar applies to `/products/digital-products`, `/products/digital-services`, `/products/automation-systems` (and is the alignment target for `/products/ai-intelligence`):

| Token | Color | Where it applies |
|---|---|---|
| **Text** | `#ffffff` at varying opacities (`/100`, `/75`, `/55`, `/45`) | All headings, body, eyebrows, labels |
| **Numbers** | `#3DFD98` green | Stat counters, step numerals (`01`, `02`…), KPI metrics, eyebrow numbers, dashboard tile values |
| **Icons / glyphs** | `#72C8F5` blue | All SVG strokes — line icons, schematic visuals, dashed connectors, check ticks, sparklines |

Card chrome stays monochrome (`rgba(8,1,28,0.55)` bg, `rgba(255,255,255,0.07)` border, hover-lift). The signature purple→cyan gradient is still allowed on `NeonButton` hovers, `HeroBubbles`, and very faint radial-glow background washes — but **no per-section accent variation**. Define `const GREEN = "#3DFD98"; const BLUE = "#72C8F5";` at the top of each new product-page client component and reuse those constants instead of hard-coding hex values inline.

The Sales Intelligence Platform page is the **exception** — it keeps its existing per-section accent palette (`PAIN_ACCENTS`, per-capability `c.accent`, per-step `step.accent`). Do not retrofit it onto the new rule unless explicitly asked.

### Canonical 8-section structure (see `app/products/sales-intelligence-platform/SalesIntelligencePage.tsx`):
1. **Hero** — `PageArcs` background, `SectionLabel`, white h1 (`text-[1.9rem]` → `lg:text-[3rem]`, `font-semibold`, Space Grotesk), 60-word subhead, dual `size="lg"` CTAs (`Start Your Free Trial` / `Book a Demo`).
2. **Problem** — 3 pain-point cards. Match homepage section-3 pattern: gradient `p-px` wrapper, inner `rgba(8,1,28,0.98)` card with accent dot icon (`h-2 w-2 rounded-full` glow), white title, white/50 body.
3. **Core Capabilities** — 2-col grid of 6 cards. Each card: icon square (`h-12 w-12 rounded-xl`, accent gradient bg, radial glow behind), white `text-[1.3rem] font-bold` title, white/55 description, diamond-bullet sub-items (white text, accent diamond `1.5×1.5 rotate-45`). `whileHover={{ y: -4 }}`.
4. **Who It's For** — 3-col grid of audience tiles. Cyan circle check icon + white/75 line. Subtle border `rgba(255,255,255,0.06)`.
5. **Key Outcomes** — 4-up `AnimatedStat` grid (`useCountUp` hook, 1800ms easeOutExpo). Animate numeric values; static labels for non-numeric outcomes (e.g., `0`, `1`).
6. **How It Works** — 3-col grid of 6 numbered steps. Each step: gradient-border wrapper, `#07001F` inner card, big accent-colored `text-[2rem] font-black` number with glow `textShadow`, white title, white/50 body.
7. **FAQ** — `AnimatePresence` accordion. First item open by default. Open border shifts to `rgba(114,200,245,0.28)`; toggle icon is a `+` rotating 45° to `×`. Height + opacity animation, `duration: 0.3`.
8. **Final CTA** — matches homepage section-12 pattern: triple radial-glow background, top divider line, dual `size="lg"` buttons (`Book a Demo` primary / `Start Free Trial` ghost).

When adding new product pages, mirror this 8-section structure and reuse the same `SectionLabel` + `useCountUp` + `FAQItem` helpers (define inline; they're not exported).

### Per-page section contracts

#### `/products/ai-intelligence` — `AIIntelligencePage.tsx`
1. **Hero** — split layout (`lg:grid-cols-[1.05fr_0.95fr]`). Left: eyebrow `"AI & Intelligence"`, H1 `"Intelligence becomes infrastructure."`, sub, custom neon-glass `<button onClick={openBookCall}>Book AI Strategy Session</button>` + ghost `Explore Stack` link → `#approach`. Right (lg+ only): `HeroAIVisual` — 4 floating nodes (`Data` / `Model` / `Decision` / `Workflow`) connected by 5 `motion.path` data-flow lines with `<animateMotion>` traveling dots in green, over a faint 5×5 dot grid.
2. **Problem** — 3 System Failure Panels (`FAILURES`: Tools Without Strategy / Generic Outputs / Integration Debt). Each card: green number badge top-left + blue schematic icon top-right (`IconScatteredApps` / `IconGenericLLM` / `IconTangledStack`) + title + body.
3. **Approach** — sticky-left + scrolling-right. Left: H2 `"We architect AI as infrastructure, not tools."` Right: 5 stacked layer panels (`LAYERS`) — each with green numeric badge, title, body, and a blue `LayerDiagram` mini-SVG (`data` / `decision` / `integration` / `workflow` / `optimisation`).
4. **Sub-services (AI Stack)** — 3 alternating rows (01 AI Integration → `FlowVisual` with CRM/AI/Database/Workflow + green animateMotion dot, 02 AI Assistants → `ChatVisual` chat-bubble panel with Internal/Customer tabs, 03 Intelligent Workflows → `DecisionTreeVisual` IF-diamond decision tree). 04 Custom AI Solutions sits as a **full-width band** below with `LabVisual` (Model Training → Data Pipeline → Predictive System boxes with green status dots).
5. **Featured Product (Sales Intelligence teaser)** — single `GradientBorder` panel (`md:grid-cols-[1fr_1.1fr]`). Left: product name + 1-line statement + `View Product →` link to `/products/sales-intelligence-platform`. Right: `SalesTeaserVisual` — compact 3-row lead-table SVG with green priority dots + blue score bars. Below the panel: 3-card mini benefit row (`AI prospect research` / `Lead prioritisation` / `Automated outreach`).
6. **Outcomes — KPI strip** — 4 `KPI` counters: `80%` / `4×` / `65%` / `12mo`. No card chrome, pure green numbers.
7. **Delivery Process — Linear AI Lifecycle** — horizontal 5-step pipeline (`LIFECYCLE`: Readiness Assessment → Architecture Design → Data Foundation → Build & Integrate → Monitor & Optimise). Same shape as Digital Services §6.
8. **FAQ — Split System** — `md:grid-cols-[1.4fr_1fr]`. Left: `FAQItem` accordion (`FAQS`). Right sidebar: `AI System Notes` panel — 4 bullets (`SYSTEM_NOTES`: Integration compatibility / Data requirements / Security model / Deployment timelines) with green dot + blue 12px underline per entry.
9. **Final CTA — Intelligence Future State** — neural-network backdrop (8×8 blue dot grid + decorative connector paths + 2 `motion.path` flowing streams with `pathLength` reveal). Centered H2 `"Intelligence becomes infrastructure — not a toolset."` + dual CTAs (`Book Your AI Strategy Session` + ghost `Explore More` → `/products/sales-intelligence-platform`).

#### `/products/digital-products` — `DigitalProductsPage.tsx`
1. **Hero** — `PageArcs` + `HeroBubbles`, centered eyebrow `"Digital Products"`, H1 `"Ship validated MVPs. Not vanity projects."`, dual CTAs (`Book a Strategy Call` solid + `See How We Build` ghost → `#process`).
2. **Problem** — horizontal startup failure timeline. Five stages (`FAILURE_STAGES`: Idea / Overbuilding / Delay / No Validation / Rebuild) on a horizontal dashed line. Each stage: green numbered badge (`01` → `05`), blue icon tile, white title, white/55 body. Stat strip below: `70%` of MVPs fail.
3. **Approach** — sticky-left framework. Left column sticky (`md:sticky md:top-32`) with statement H2; right column scrolls 5 framework panels (`FRAMEWORK`: Validation-first / AI-native / Agile / Analytics / Scale).
4. **MVP Development** — editorial split (big green `01` + headline + blue chip icon). Below: 3 vertical panels — `INCLUDED` (blue check list), `OUTCOMES` (massive green stats), `SUPPORT` (roadmap). Followed by horizontal build timeline (`BUILD_TIMELINE`).
5. **Outcomes** — 2×2 oversized KPI grid (`6–12wk`, `70%`, `AI-native`, `3×`). Green numbers, white labels.
6. **Delivery Process** — vertical process journey. Sticky left progress timeline + large process panels stacked right (`PROCESS_STEPS`).
7. **FAQ** — accordion (`FAQS`) + right sidebar `FOUNDER_CONSIDERATIONS` with 4 blue-check bullets.
8. **Final CTA** — top gradient divider, dual canonical CTAs.

#### `/products/digital-services` — `DigitalServicesPage.tsx`
1. **Hero** — centered, H1 `"Revenue-engineered websites. Not brochureware."`.
2. **Problem** — 3 revenue-leakage panels (`LEAKAGE`: Passive websites / Scaling failures / Lost e-commerce). Each card: green number + blue down-arrow icon + before/after mini-bars + body.
3. **Approach** — vertical revenue-engineering flow (`REVENUE_FLOW`: Strategy → UX → Development → AI → Optimisation). Blue circle nodes with green numerals on a vertical spine, alternating side text.
4. **Sub-services** — 4 alternating rows (`SUB_SERVICES`):
   - Website Development → `BrowserMock` (browser frame with floating green `+CTA` badge)
   - Platform Development → `ArchitectureMock` (5-node API / AUTH / DB / DASH / SERVER diagram in blue)
   - E-commerce Development → `StorefrontMock` (3-card storefront with AI Search + Checkout badges)
   - Custom Systems → `BlueprintMock` (grid blueprint with admin/db/flow nodes)
5. **Outcomes** — horizontal metrics strip in a single bordered panel. 4 `MetricTile`s with blue `IconSpark` sparkline above each green metric.
6. **Delivery Process** — 5-node horizontal pipeline (`PIPELINE`: Strategy → UX → Build → QA → Launch).
7. **FAQ** — 2-column layout. Left: accordion (`FAQS`). Right sidebar: `STACK_BADGES` pill grid + `UPTIME_BADGES` list with green status dots.
8. **Final CTA** — top divider + flowing curve SVG backdrop at 30% opacity, dual canonical CTAs.

#### `/products/automation-systems` — `AutomationSystemsPage.tsx`
1. **Hero** — H1 `"AI-powered operations. One unified system."`.
2. **Problem** — disconnected systems → connected hub. 5 floating system cards (`DISCONNECTED`: CRM / Finance / Ops / Support / Reporting) at fixed positions in a bordered panel. Animated `motion.svg` dashed lines draw on scroll from each card into a central green "Hub" badge with blue `IconBolt`.
3. **Approach** — horizontal architecture map (`ARCH_NODES`: Audit → Architecture → Automation → Intelligence → Optimisation) with decorative diamond decision sub-branches above/below the main spine (SVG overlay).
4. **Sub-services** — 3 alternating rows (`SUB_AUTOMATION`):
   - Business Automation → `WorkflowMock` (4-node workflow: Onboarding / Invoices / Approvals / Reporting)
   - Workflow Automation — AI Decision Trees → `DecisionTreeMock` (LEAD → diamond SCORE → 3 branches: Priority / Nurture / Escalate)
   - Dashboard Systems — Executive Command Center → `DashboardMock` (3 KPI tiles + sparkline + green LIVE badge)
5. **Outcomes** — operations dashboard panel with `LIVE` indicator. 4 `MetricTile`s with blue sparkline + green status dot per tile.
6. **Delivery Process** — 6-stage vertical deployment roadmap (`DEPLOYMENT`: Audit → Design → Build → Deploy → Train → Expand). Left vertical spine + numbered nodes + content card per row.
7. **FAQ** — console-style. Each row prefixed with a green status dot in the question header; when expanded, shows a small blue line-chart `IconSpark` + `Live monitoring` label.
8. **Final CTA** — top divider + flowing 3-curve SVG backdrop, dual canonical CTAs.

### Inline helpers shared across the 3 new pages

Each of the 3 new product-page client components is **self-contained** and duplicates these inline helpers (do not extract into shared modules):
- `SectionLabel` — eyebrow with `animate-label-line` + `animate-label-dot`.
- `useCountUp(target, duration)` — IntersectionObserver-triggered count-up.
- `KPI` (Digital Products only) — large green animated stat with white label.
- `MetricTile` (Digital Services + Automation) — sparkline + green count-up + white label. Accepts `prefix` / `suffix` / `decimals`.
- `FAQItem` — accordion row with `+ → ×` rotating toggle. Automation page variant adds a green status dot in the question header and a `Live monitoring` line when expanded.
- `IconCheck` — small blue check tick (`stroke={BLUE}`).
- `IconSpark` — 48×20 blue sparkline.
- Page-specific schematic mocks (`BrowserMock`, `ArchitectureMock`, `StorefrontMock`, `BlueprintMock`, `WorkflowMock`, `DecisionTreeMock`, `DashboardMock`).

When the user provides real screenshots or product mockups later, swap the schematic Mock components for `next/image`-backed equivalents — do not edit the surrounding section structure.

### Cross-linking from the homepage

Whenever a new product page launches, wire it in **three** places — failing to update any one of them leaves the funnel broken:

1. **`SERVICE_CARDS` in `HeroSection.tsx`** — set `href: "/products/<slug>"` on every related service card. **Current canonical mapping** (all 4 services have product pages):
   - `AI & Intelligence` → `/products/ai-intelligence`
   - `Digital Products` → `/products/digital-products`
   - `Digital Services` → `/products/digital-services`
   - `Automation & Systems` → `/products/automation-systems`
   The `href` field is required on every entry; `ServiceCard` reads `card.href` for the learn-more link.
2. **Featured Product section** (`HeroSection.tsx`) — if the product is the featured one, point the `CircleArrow` link at `/products/<slug>` and use copy like `"Explore the platform"` (not `"Request a demo"` — demo CTAs belong on the product page itself).
3. **`SERVICES` array in `Navbar.tsx`** — must mirror the `SERVICE_CARDS` mapping exactly. **No service should anchor to `/#services` anymore** — each of the 4 has its own product page.

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
- The homepage hero cards parallax via spring-smoothed cursor coords — never animate them with `y: [0, -10, 0] repeat: Infinity` on desktop (the cursor is the interaction). The infinite float is **only** the reduced-motion / mobile fallback.
- Reintroducing the rotating SVG arcs or the "What we build" services ticker on the homepage hero — both were intentionally removed. The cinematic composition replaces them. `PageArcs.tsx` is still used on `/about`, `/contact`, and `/products/**` — do not remove it there.
- Flattening §3 Problem back to a 3-card grid, or §9 back to an equal-size grid — the before/after split and the bento are the canonical premium layouts. If §9 needs to grow, keep the bento by adding the new card at `md:col-span-3` to span the bottom row.
- Reintroducing accent-colored `ServiceIconSquare`, accent diamond bullets, or radial-glow boxShadows anywhere on the homepage — **forbidden outside HomeHero, `GradientBorder` wrappers, and CTAs**. Icons + glyphs + bullets on the homepage are monochrome.
- Re-locking `TechStackSection` or reverting it to the tabbed-categories grid — it was intentionally unlocked and rewritten as a 2-row opposing marquee (top scrolls left @ 40s, bottom scrolls right @ 36s). Only `ClientsMarquee` is still locked.
- Putting Numbers before Featured Product, or wrapping Numbers in a gradient-border panel — the canonical order is **§5 Services → §6 Featured Product → §7 Numbers**, and §7 is a clean 4-counter row with no panel chrome. The product story leads; the numbers prove it. A thin horizontal gradient divider connects §6 → §7.
- Reintroducing the `featured: true` variant or `WhyVisualTrio` in §9 — §9 is now a flat 2×2 grid of equal-size cards. All four cards share the same chrome; the only color comes from the four monochrome `WhyVisualHint` SVGs (`IconLayersDiagram` / `IconE2EDiagram` / `IconLoopDiagram` / `IconBarsDiagram`).
- Adding text labels or pill chrome back to the §10 Tech Stack marquee — it's intentionally **logos only**, 40px size, grayscale, with generous gap. The `name` lives only in the `title` attribute for accessibility.
- Reintroducing tabs, auto-rotate, `AnimatePresence`, scroll-stepping (`useScroll`/`useMotionValueEvent`), inline card mockups (`DiscoveryCard`/`ArchitectureCard`/`BuildCard`), card containers around each step, or watermark step numbers to §8 Process — the section is now a **vertical timeline**: centred section header, then 3 numbered badges sitting on a 1px gradient line, each with content to the right. No cards, no mockups, no interactivity beyond the entry fade-in.
- Reintroducing `Growth & Marketing` or `Sales Intelligence Platform` to `SERVICE_CARDS` — the canonical service taxonomy is exactly **four**: AI & Intelligence, Digital Products, Digital Services, Automation & Systems. Sales Intelligence Platform is a product, surfaced only via §5 Featured Product + the Navbar Products dropdown.
- Replacing the §6 accordion with the old `ServiceCard` / `ServiceCardFeatured` bento — the accordion is the canonical premium pattern now. The `featured` field was dropped from `SERVICE_CARDS`; do not re-add it.
- **Per-section accent variation on `/products/digital-products`, `/products/digital-services`, or `/products/automation-systems`.** These three pages use the consolidated **product page color rule**: white text, green numbers, blue icons — period. No per-section / per-card accent colors (no `PAIN_ACCENTS`-style array, no `c.accent` on capabilities, no per-step accent on process). The Sales Intelligence Platform page is the only product page that still uses per-section accents.
- **Pointing `SERVICE_CARDS` or `Navbar.tsx SERVICES` entries back at `/#services` or `/contact`.** All 4 services now have product pages. The canonical mapping (`/products/ai-intelligence`, `/products/digital-products`, `/products/digital-services`, `/products/automation-systems`) must be kept in sync across both files.
- **Wiring a `Book a Strategy Call` CTA to `<a href="/contact">`.** All primary CTAs site-wide open the inline `<BookCallModal>` via `useBookCall().open()`. `/contact` is the fallback (Navbar "Contact Us" pill, direct links, SEO) — never a primary CTA target.
- **Re-promoting `ClientsMarquee` back to homepage §2.** The canonical order now places ClientsMarquee at §6 — between Process and Featured Product — so the hero flows straight into the problem statement. The closing rhythm is also re-ordered: §9 Testimonials → §10 Tech Stack → §11 Why Levata → §12 Final CTA. Don't restore the old hero-adjacent placement.
- Replacing `<ImagePlaceholder>` instances with real images one-at-a-time inline — if you're swapping placeholders for real imagery, edit the `ImagePlaceholder` helper once or fork it into a `<ServiceImage src>` component. Do not duplicate the gradient-bg-plus-mask styling per usage.
- Putting `PROCESS_STEPS` data back into `HeroSection.tsx` — it lives inside `ProcessTabsSection.tsx` now. Editing the process phases means editing that file.
- **Adding tabs or auto-rotate back to ProcessTabsSection** — the section is now static stacked cards. Keep it that way.
- **Applying the brand gradient to any text fill.** Headlines, H2s, the services ticker, service titles, sub-services, and learn-more links are all pure white. The gradient lives only on backgrounds, glows, icon-square fills, button hover affordances, and gradient-border wrappers.
- Forgetting the secondary `Explore Our Services` ghost CTA next to a primary action button — pair them in every hero and closing CTA.

## Verification before reporting done

- [ ] `npm run dev` — page renders with no console errors.
- [ ] Rotating circles + services ticker animate.
- [ ] Section reveals fire on scroll.
- [ ] Hero floating cards visible at `md+`, hidden on mobile.
- [ ] `npm run build` passes type check.
- [ ] ClientsMarquee visually identical to the locked baseline. TechStackSection renders as 2-row opposing marquee.

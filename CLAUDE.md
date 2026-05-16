@AGENTS.md

# Levata — AI-Native Marketing Site

Marketing site for **Levata**, positioned as an AI-native intelligence partner (not a generic digital agency). The site is a single-product funnel optimised for B2B strategy-call bookings.

## Brand positioning
- **One-liner:** "Your business deserves intelligence, not just software."
- **Tone:** Confident, outcome-driven, B2B. Never "agency", "passion-driven", or generic dev-shop language.
- **Featured product:** AI Sales Workspace (Sales Intelligence Platform).

## Dev commands
```bash
npm run dev    # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Tech stack
| Layer | Library |
|---|---|
| Framework | Next.js 16.2.4 (App Router) — see `AGENTS.md` note |
| UI | React 19.2.4 |
| Styling | Tailwind CSS 4 |
| Animation (legacy) | GSAP 3.15 — rotating circles, services ticker, count-up |
| Animation (sections) | Framer Motion 11 — `whileInView` reveals + hero floating cards |
| Smooth scroll | Lenis 1.3 |
| Icons | react-icons (Simple Icons via `react-icons/si`) |
| Class merging | `cn()` in `lib/utils.ts` (clsx + tailwind-merge) |
| Variants | class-variance-authority (only `neon-button.tsx`) |

## Project structure
```
app/
  layout.tsx                    # Fonts, metadata, Navbar/Footer
  page.tsx                      # Renders <HeroSection />
  globals.css                   # CSS vars, keyframes, delay-* utilities
  about/page.tsx                # About page
  contact/page.tsx              # Contact page
  products/
    sales-intelligence-platform/
      page.tsx                  # Server component — exports Metadata
      SalesIntelligencePage.tsx # "use client" — full product page content
    ai-intelligence/
      page.tsx                  # Server component — exports Metadata
      AIIntelligencePage.tsx    # "use client" — AI & Intelligence product page
    digital-products/
      page.tsx                  # Server component — exports Metadata
      DigitalProductsPage.tsx   # "use client" — MVP / product development page
    digital-services/
      page.tsx                  # Server component — exports Metadata
      DigitalServicesPage.tsx   # "use client" — websites, platforms, e-commerce, custom systems
    automation-systems/
      page.tsx                  # Server component — exports Metadata
      AutomationSystemsPage.tsx # "use client" — workflow automation, decision systems, dashboards
  components/
    HeroSection.tsx             # Homepage — orchestrates sections 1–12 (delegates §1 to HomeHero, §8 to ProcessTabsSection)
    HomeHero.tsx                # Homepage hero — left/right split, clean static layout, Lyzr typography
    HeroBubbles.tsx             # Cursor ring effect — DOM rings (Framer Motion) expand + fade on mousemove — mounted in HomeHero
    HeroGlowOrbs.tsx            # Reusable cursor-reactive glow orbs (density "subtle" | "full") — no longer used; file kept for reference
    ContactHero.tsx             # Client subcomponent for the contact page hero (keeps page.tsx server-side for metadata)
    ProcessTabsSection.tsx      # §8 Our Process — vertical timeline (3 numbered badges on a gradient line)
    Navbar.tsx                  # Fixed header, scroll-blur, Services hover dropdown + Products hover dropdown
    Footer.tsx
    ClientsMarquee.tsx          # LOCKED — do not modify
    TestimonialsSection.tsx     # Carousel, 3 testimonials
    ServicesSection.tsx         # No longer rendered on homepage; exports `CircleArrow` still used
    ContactCTASection.tsx       # Contact form (rendered on /contact AND inside BookCallModal — accepts `showHeading={false}`)
    BookCallModal.tsx           # Centered dialog wrapping ContactCTASection — Esc/backdrop/X to close, body scroll locked while open
    BookCallProvider.tsx        # Mounts modal once, exposes `useBookCall()` hook → { open, close }
    BookCallButton.tsx          # NeonButton wrapper that calls useBookCall().open() — used where NeonButton styling is desired
    BookCallSection.tsx
    PageArcs.tsx                # Decorative arcs for non-home pages
    ui/neon-button.tsx          # NeonButton — variants: default/solid/ghost, sizes: sm/default/lg
lib/utils.ts                    # cn()
public/                         # levatalogo.png + rotating-circle SVGs
```

## Homepage section order (HeroSection.tsx)

The narrative arc: open with the **why** (problem → solution → services → process), prove the **who** (client logos), pitch the **what** (featured product → numbers), validate (testimonials → tech stack → why-Levata), close (final CTA). ClientsMarquee is **demoted to §6** so the hero flows straight into the problem statement.

1. **Hero (clean left/right split)** — rendered by `HomeHero.tsx`. On `lg+` a 2-column grid (`lg:grid-cols-[1.05fr_0.95fr]`): **left column** has eyebrow + H1 + subhead + dual CTAs, all left-aligned; **right column** has 3 stat cards (AI Metrics, Workflow Status, Revenue Uplift) stacked vertically with staggered entry animations. On `<md` the right column is hidden entirely — text only. **No cursor parallax, no HeroGlowOrbs, no perspective grid, no vignette overlay.** Plain `bg-[#07001F]` background + `HeroBubbles` cursor ring effect (expanding semi-transparent rings on mousemove). Cards are static (no hover lift, no glow). H1 sizes: `text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]`. CTAs use `size="lg"`. `PageArcs.tsx` is used on `/about`, `/contact`, and `/products/**`.

**Headline rule: ALL text is pure white.** No gradient text fills anywhere — heroes, H2s, service titles, sub-services. The brand gradient lives only on backgrounds, glows, button hovers, icon squares, and borders — never on text. No `textShadow` on any hero H1.
2. **Problem (Before/After split)** — header + sub. Two-column layout (`md:grid-cols-2`): left "BEFORE" card (desaturated, white/45 text, dashed-border broken-system schematic SVG), right "AFTER" card (gradient `p-px` border, vibrant white text + monochrome check bullets, connected-nodes hub schematic SVG). Diagonal arrow connector circle pinned at the absolute centre on `md+`. Pain → win pairs sit in the `TRANSFORMATIONS` array. **Bottom padding tightened** so the section flows into the §2↔§3 vertical connector line.
3. **Solution (4-node flow diagram)** — sits directly below a `<FlowConnector vertical />` bridge from §2 (tight top padding; standalone bg removed so §2+§3 share ambience). Italic transition line above the H2: *"This is the system that replaces the duct tape."* H2 + sub paragraph: a horizontal 4-node flow (`Diagnose → Architect → Build → Compound`) on `md+`, vertical on mobile. Each node is a `GradientBorder` square with phase number + **monochrome** `ServiceIcon`. Connectors are gradient-stroke dashed lines with infinite-looping `motion.circle` traveling dots (2.4s period) — connectors are the only place brand gradient is allowed in §3.
4. **Service Categories (Horizontal carousel)** — full-width at `max-w-7xl`. Rendered by `<ServicesCarousel>`. **Header row** on top: eyebrow `"What we do"` + H2 + small "Book a strategy call" button on the left (now opens the BookCall modal instead of routing to `/contact`); **prev/next arrow buttons** (44×44 rounded-full, white/3 bg, white/12 border) on the right. Buttons enable/disable based on scroll position via `scroll` event + `ResizeObserver`. **Scroll track** below: horizontally scrollable container with `scroll-snap-type: x mandatory`, native scrollbar hidden via `.services-carousel-scroll` class. Each card: fixed `width: min(85vw, 360px)`, `scroll-snap-align: start`, flat homepage chrome. Card content (top → bottom): `<ImagePlaceholder aspect="3/2" accent={card.accent} />` (accent-tinted per service), `Service 0X` eyebrow in `${card.accent}CC`, title, description, diamond-bulleted sub-services with `card.accent` diamonds, "Learn more →" link. Arrow buttons call `scrollBy({ left: cardWidth + 16 })` with smooth scroll. Touch-drag scroll on mobile is native. The old `ServicesExplorer` and `ServicesAccordion` functions stay defined but unused.
5. **Our Process (vertical timeline)** — rendered by `ProcessTabsSection.tsx`. Single-column layout in `max-w-4xl`. Section header centred at the top (eyebrow + H2 + sub). Below: a **vertical timeline** — a 1px gradient line runs down the left edge (`linear-gradient(to bottom, transparent → white/18 → transparent)`), with 3 numbered badges sitting on the line. Each row is `flex items-start gap-6 md:gap-10`: badge on the left (`h-12 w-12 md:h-16 md:w-16` rounded square, dark bg with white/12 border, 6px solid bg-color outline so it "cuts through" the line), content on the right. Content per row: `"Phase 0X"` eyebrow + title (`text-2xl md:text-[1.75rem]`) + dotted-bullet points + a Result line in a subtle bordered card. Pure monochrome (white text, white/50 bullets, no accent colors). `whileInView` fade-in with `delay: i * 0.12` per step. No tabs, no auto-rotate, no `AnimatePresence`, no mockups, no `useState`.
6. **ClientsMarquee** — **LOCKED**. Demoted from the original §2 slot. Wrapper is `py-12 md:py-16` with a thin centered gradient divider (`mb-8 h-px w-24 from-transparent via-white/10 to-transparent`) above the marquee. Sits between Process (§5) and Featured Product (§7) — proof point that bridges the *how we work* sections into the *what we ship* sections.
7. **Featured Product (Sales Intelligence Platform + dashboard mockup)** — same dashboard-mockup `GradientBorder` card. Eyebrow `"Featured product"` + H2 + sub. Followed by a thin horizontal gradient divider that visually connects into §8 Numbers below. The narrative: here's the product → here are the numbers it ships.
8. **By the Numbers (clean 4-counter row)** *(sits below Featured Product, connected by the divider)* — section eyebrow + H2 + a simple `grid-cols-2 md:grid-cols-4 gap-y-12 md:gap-x-12 text-center` row of 4 `StatCounter` calls. **No panel chrome, no body copy, no image placeholder, no hero-stat split.** Just the 4 animated numbers. The numbers are enough — and they prove the product story above.
9. **Testimonials** — `<TestimonialsSection />`. Carousel, 3 testimonials. Promoted from the original §11 slot so social proof sits adjacent to the Numbers.
10. **Tech Stack (two-row opposing marquee — logos only)** — section header + 2 horizontal scrolling rows of **just logos** (no labels, no pill chrome). Each icon: 40px size, grayscale (`filter: grayscale(1) brightness(0) invert(1) opacity(0.55)`) → on hover full opacity + white drop-shadow. Generous gap (`clamp(32px, 5vw, 72px)`) between logos. Top row scrolls left at 40s, bottom row scrolls right at 36s. Rows have `.tech-marquee-mask` (edge fade gradient). No `useState`, no GSAP — just CSS `@keyframes marquee` + `animation-direction: reverse`. Logo name appears as `title` attribute on hover for accessibility.
11. **Why Choose Levata (flat 2×2 equal-cards grid)** — 4 entries in `WHY_LEVATA`. **No featured variant** — all 4 cards are equal size in a `md:grid-cols-2 md:auto-rows-fr gap-5` grid. Each card has the same flat chrome (`rgba(8,1,28,0.55)` bg, white/7 border, `p-7 md:p-9`, subtle hover `hover:bg-white/[0.03]` + `whileHover y: -4`). Card structure: monochrome `<WhyVisualHint>` SVG at top (`IconLayersDiagram` for "AI-Native", `IconE2EDiagram`, `IconLoopDiagram`, `IconBarsDiagram` for the others), then `text-xl md:text-2xl` title, then white/55 body. **No `WhyVisualTrio`, no accent-tinted backgrounds, no eyebrows on cards** — modern, flat, uniform. Demoted from §9 to §11 — closing argument before the final CTA.
12. Final CTA

## Design system
| Token | Value |
|---|---|
| `--background` | `#07001F` |
| `--foreground` | `#ffffff` |
| `--brand-cyan` | `#72C8F5` |
| `--brand-purple` | `#9B2FFF` |
| `--brand-violet` | `#BB00FF` |
| Heading font | Space Grotesk (`--font-space-grotesk`) |
| Body font | Manrope (`--font-manrope`) |
| Signature gradient | `linear-gradient(90deg, #9B2FFF, #72C8F5)` — used on emphasized headline phrases |

## Animation conventions
- **GSAP** owns: `PageArcs.tsx` rotating SVG circles (about/contact/product pages only), `useCountUp` stat animation, and `TechStackSection` legacy fade-ins. **The homepage hero no longer uses GSAP.**
- **Framer Motion** owns: section reveals (`initial → whileInView`, `viewport={{ once: true, margin: "-80px" }}`, `ease: [0.16, 1, 0.3, 1]`), homepage hero entry stagger (`HomeHero.tsx`). No cursor parallax on hero.
- **CSS keyframes** (`globals.css`): `badgePulse`, `marquee`, `techFadeIn`, `labelBeam`, `labelDotPulse`.
- Section-label pattern: `<SectionLabel text="..." />` (animated line + pulsing dot + uppercase eyebrow).

## Product pages
- `/products/sales-intelligence-platform` — flagship product landing page. Section *shapes* are intentionally **distinct from homepage** so the product page doesn't read as a clone (capabilities = grid, not accordion; process = horizontal stepper, not timeline). Sections: Hero (HeroBubbles + dual CTAs); **§2 Problem** (3 flat cards, each with a **line-art SVG icon per pain** — `IconResearchClock` / `IconEnvelopeIgnored` / `IconLeakyFunnel` — in an accent-tinted `h-12 w-12` tile using `PAIN_ACCENTS = ["#9B2FFF", "#BB00FF", "#72C8F5"]`); **§3 Core Capabilities** (flat 2-col 3-row grid — per-capability accent on icon tile + diamond bullets via `c.accent`); §4 Who It's For (flat tiles with white/75 check); §5 Key Outcomes (clean 4-counter row); **§6 How It Works** (horizontal stepped flow — 6 circular numbered badges with **per-step accent** via `step.accent`: colored border + soft accent glow + colored number; the connecting dashed line stays monochrome white/18); §7 FAQ (animated accordion, monochrome plus-toggle); §8 Final CTA (top divider). The `CapabilitiesAccordion` function stays defined in the file but is now unused. Server `page.tsx` exports `Metadata`; client logic lives in sibling `SalesIntelligencePage.tsx`.
- `/products/ai-intelligence` — AI & Intelligence service landing page. 9 sections: Hero (split layout — text left, lightweight 4-node AI system visual right with `motion.svg` data-flow lines + `animateMotion` traveling dots over a faint 5×5 dot grid), Problem (3 System Failure Panels — Tools Without Strategy / Generic Outputs / Integration Debt), Approach (sticky-left "We architect AI as infrastructure, not tools" + scrolling 5-layer right column with per-layer mini diagrams), Sub-services (AI Stack — alternating rows for AI Integration / AI Assistants / Intelligent Workflows + a full-width "AI lab" band for Custom AI Solutions), Featured Product teaser (compact Sales Intelligence spotlight in a `GradientBorder` panel with a 3-row lead-table SVG + 3 micro-benefit pills below), Outcomes (KPI strip — `80%` / `4×` / `65%` / `12mo`), Delivery Process (Linear AI Lifecycle — 5-node horizontal pipeline), FAQ (split — accordion left + "AI System Notes" advisory sidebar right with green dots + blue underlines), Final CTA (neural-network 8×8 dot grid + 2 flowing-stream `motion.path`s as background). Applies the **product page color rule**: white text, green numbers, blue icons.
- `/products/digital-products` — MVP / product development page. 8 sections: Hero, Problem (horizontal startup failure timeline — 5 stages), Approach (sticky-left + scrolling-right 5-principle framework), MVP Development (editorial split + INCLUDED/OUTCOMES/SUPPORT panels + build timeline), Outcomes (2×2 oversized KPI grid), Delivery Process (vertical journey with sticky timeline), FAQ (accordion + Founder Considerations sidebar), Final CTA.
- `/products/digital-services` — websites, platforms, e-commerce, custom systems. 8 sections: Hero, Problem (3 revenue-leakage panels with before/after mini bars), Approach (revenue-engineering vertical flow — Strategy → UX → Development → AI → Optimisation), Sub-services (4 alternating rows: Website / Platform / E-commerce / Custom Systems with line-art mock visuals), Outcomes (horizontal metrics strip with sparkline above each), Delivery Process (5-node pipeline), FAQ (2-column with Stack + Reliability sidebar), Final CTA.
- `/products/automation-systems` — workflow automation + decision systems + dashboards. 8 sections: Hero, Problem (disconnected systems → connected hub visualization with animated SVG connectors and 5 floating system cards), Approach (architecture map with diamond decision sub-branches), Sub-services (Business Automation / AI Decision Trees / Executive Command Center — alternating rows with workflow / tree / dashboard mocks), Outcomes (real-time metrics dashboard panel), Delivery Process (6-stage vertical deployment roadmap), FAQ (console-style with green status dot + monitoring line on expand), Final CTA.

### Product page color rule (`/products/*` only)
A consolidated color triplet replaces per-section accent variation on `/products/digital-products`, `/products/digital-services`, and `/products/automation-systems`:

| Token | Color | Where |
|---|---|---|
| Body text | `#ffffff` at varying opacities (`/100`, `/75`, `/55`, `/45`) | All headings, body, eyebrows, list items |
| Numbers | `#3DFD98` (green) | Stat counters, step numbers (`01`, `02`…), KPI metrics, eyebrow numerals |
| Icons / glyphs | `#72C8F5` (blue) | All SVG strokes — line icons, schematic visuals, dashed connectors, check ticks |

Card chrome stays monochrome (`rgba(8,1,28,0.55)` bg, `rgba(255,255,255,0.07)` border). The signature purple→cyan gradient is still allowed on `NeonButton` hovers and `HeroBubbles` — but **no per-section accent variation** on these three pages. The Sales Intelligence Platform page keeps its existing per-section accent treatment; the AI Intelligence page is being aligned to the new rule.

## Sub-page section grammar
Both `/about` and `/products/sales-intelligence-platform` now share the homepage canonical grammar:
- **Centered section headers**: `<SectionLabel>` + H2 (`text-3xl md:text-4xl font-extrabold leading-[1.1]`) + sub paragraph in white/45–white/55. `mb-12` to `mb-14`.
- **Flat card chrome**: `rgba(8,1,28,0.55)` bg, `rgba(255,255,255,0.07)` border, `rounded-2xl p-7 md:p-8`, hover-lift (`hover:bg-white/[0.03]` + `whileHover y: -4`).
- **Monochrome icons / diagrams**: schematic SVGs use `rgba(255,255,255,0.65)` stroke + `rgba(255,255,255,0.08)` fill. No accent tints.
- **Accordion pattern**: `<ServicesAccordion>` (homepage) and `<CapabilitiesAccordion>` (Sales) follow identical grammar — plus-toggle (white/grey), single-open, first-row-open, `AnimatePresence` height transition.
- **Vertical timeline**: 1px gradient line + numbered badges with section-bg ring. Used in homepage §8 Process and Sales §6 How It Works.
- **Standalone circular avatars** (About Team): the team members render as **bare circles** with no card wrapper — `h-32 w-32 md:h-36 md:w-36` rounded-full with `border-2 border-dashed border-white/[0.18]` + subtle inner radial gradient. Big initials inside (`text-2xl md:text-3xl text-white/85`) via `initialsFrom(name)`. Name + role + bio centred beneath the circle. Bio capped at `max-w-xs`. Grid: `gap-12 lg:gap-8`. **No card chrome, no border, no hover-lift** — circles sit directly on the page background.
- **Final CTA**: top horizontal gradient divider + dual canonical-style NeonButton (see "Canonical button style" below). Already in place on home / about / Sales.

## Home → product cross-links
- **Featured Product section (homepage §5):** "Explore the platform" CircleArrow CTA → `/products/sales-intelligence-platform`.
- **Service carousel (homepage §5) `href` field on `SERVICE_CARDS`:** each of the 4 services now points to its own product page (no longer `/contact`):
  - AI & Intelligence → `/products/ai-intelligence`
  - Digital Products → `/products/digital-products`
  - Digital Services → `/products/digital-services`
  - Automation & Systems → `/products/automation-systems`
  Service taxonomy is exactly 4. Sales Intelligence Platform lives in §6 (Featured Product) + the Navbar Products dropdown only — never re-add it to `SERVICE_CARDS`.
- **Navbar:** "Services" is a hover dropdown listing the 4 services, each linking to its product page (same mapping as above). "Products" is a separate hover dropdown listing Sales Intelligence Platform → `/products/sales-intelligence-platform`. Keep both `SERVICES` (Navbar) and `SERVICE_CARDS` (HeroSection) in sync when adding new product pages.

## Locked components — DO NOT MODIFY without explicit sign-off
- `app/components/ClientsMarquee.tsx`

(`TechStackSection` was previously locked but is no longer — it was intentionally rewritten as a 2-row opposing marquee. See homepage §10 for the canonical layout.)

## Visual restraint (homepage §3–§10)
Brand gradient is reserved for: HomeHero atmospheric glow orbs, `GradientBorder` wrappers on featured panels (§3 After card, §4 flow nodes, §7 Featured Product container, ClientsMarquee divider), `NeonButton` hover affordances, §4 flow-connector traveling dots, the §6↔§7 horizontal divider, and the H1 `textShadow`.

**Where accent colors ARE allowed (icons + numbers exceptions):**
- **Homepage §5 Services Explorer** — active service's `card.accent` colors the left list active number, the right panel eyebrow (`{accent}CC`), the diamond bullets, and the small placeholder gradient tint.
- **Sales §2 Problem** — per-pain accent (`PAIN_ACCENTS`) tints the line-art icon tile (bg `{accent}14` + border `{accent}40` + `color: {accent}` for the SVG via `currentColor`).
- **Sales §3 Capabilities** — per-capability `c.accent` tints the `CapabilityIcon` tile + the diamond bullets.
- **Sales §6 How It Works** — per-step `step.accent` colors the numbered badge border + number + soft glow.

**Everywhere else, icons + glyphs + diamond bullets stay monochrome** in `rgba(255,255,255,0.55–0.75)` — no per-card accent colors, no radial-glow boxShadows, no accent-tinted card backgrounds. Card chrome (bg, border, hover state) always stays monochrome — only the icon/number/glyph inside picks up accent.

## Component conventions
- `"use client"` on any component with hooks, event handlers, GSAP/Framer Motion, or browser APIs.
- Use `cn()` for dynamic className merging.
- Use `<NeonButton>` for every CTA. Variants: `default`, `solid`, `ghost`. Sizes: `sm`, `default`, `lg`.
- CVA only in `neon-button.tsx`. Don't introduce it elsewhere unless adding variant-heavy components.
- Tailwind 4: `@import "tailwindcss"` only. No `tailwind.config.js` needed.
- **Book a Strategy Call CTAs** open the inline `<BookCallModal>` rather than navigating to `/contact`. The wiring is: `<BookCallProvider>` (mounted once in `app/layout.tsx`) exposes a `useBookCall()` hook → `{ open }`. Any CTA calls `open()` on click. The `/contact` page still renders `<ContactCTASection />` standalone — it remains the fallback (Navbar pill, direct links, SEO). When adding a new CTA, use `<button onClick={openBookCall}>` (paired with the custom neon-glass style) for the hero/final-CTA primary; for `<NeonButton>`-style CTAs, import `useBookCall` and wire `onClick`. Never reintroduce `<a href="/contact">` for the primary CTA.

**Hero typography (canonical Lyzr scale).** All hero H1s use `font-semibold leading-[1.05] tracking-[-0.025em] text-white text-balance` with `fontFamily: var(--font-space-grotesk)`. No `textShadow` on any hero H1. Sizes are **unified across all pages**:
- All hero H1s (homepage + about + contact + all product pages): `text-[2rem] sm:text-[2.5rem] md:text-[2.75rem] lg:text-[3rem]`.
Hero subheads use `text-sm md:text-base text-white/55 leading-relaxed max-w-xl`.

**Canonical button style (site-wide).** Every `NeonButton` CTA across the site uses the same hero treatment:
```tsx
<NeonButton variant="solid" size="default" className="text-sm font-semibold tracking-wide px-6 py-2.5">
```
Secondary buttons (where present) use `variant="ghost"` with the same `size` + `className`. **`size="lg"` is no longer used anywhere** — single canonical button style across home / about / contact / Sales / AI Intelligence pages. Exception: the About hero "Book a Strategy Call" uses a custom neon-glass `<a>` anchor (matching the navbar Contact Us pill) — separate from the NeonButton system; preserved intentionally as a special hero treatment.

## Behavioral guidelines
- **Think before coding.** State assumptions; ask when unclear; flag simpler approaches.
- **Simplicity first.** Minimum code that solves the problem. No speculative abstractions or error handling for impossible scenarios.
- **Surgical changes.** Touch only what the task requires. Match existing style. Don't refactor what isn't broken.
- **Goal-driven.** Define a verifiable check for each task (test passes / page renders correctly / no console errors) before claiming done.
- For UI changes, run `npm run dev` and verify in a browser before reporting complete.

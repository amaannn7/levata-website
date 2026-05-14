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
  components/
    HeroSection.tsx             # Homepage — all 12 sections
    HeroFloatingCards.tsx       # 3 floating UI cards over hero (Framer Motion)
    Navbar.tsx                  # Fixed header, scroll-blur
    Footer.tsx
    ClientsMarquee.tsx          # LOCKED — do not modify
    TestimonialsSection.tsx     # Carousel, 3 testimonials
    ServicesSection.tsx         # No longer rendered on homepage; exports `CircleArrow` still used
    ContactCTASection.tsx       # Contact form (rendered only on /contact)
    BookCallSection.tsx
    PageArcs.tsx                # Decorative arcs for non-home pages
    ui/neon-button.tsx          # NeonButton — variants: default/solid/ghost, sizes: sm/default/lg
lib/utils.ts                    # cn()
public/                         # levatalogo.png + rotating-circle SVGs
```

## Homepage section order (HeroSection.tsx)
1. Hero — rotating SVG circles + centred headline + services ticker + dual CTAs (`size="default"`). 3 stat cards stacked as a right rail on `md+` (`HeroFloatingCards.tsx`): AI Metrics + trend chart, Workflow Status as 3 dotted mini-boxes (Enrich/Email/CRM), Revenue Uplift + multi-stop gradient swatch. Cards animate in once (entry stagger 0.4 / 0.55 / 0.7s, chart line draws via `pathLength`, mini-boxes stagger left→right). No continuous float — `whileHover={{ y: -4 }}` only.

**Headline + ticker rule: ALL text is pure white.** No gradient text fills anywhere — heroes, H2s, the rotating services ticker, service titles, sub-services. The brand gradient lives only on backgrounds, glows, button hovers, icon squares, and borders — never on text.
2. ClientsMarquee — **LOCKED**
3. Problem (3 pain points)
4. Solution
5. Featured Product (Sales Intelligence Platform + dashboard mockup)
6. Service Categories — headline "Six capabilities. One unified system." — 6-card responsive grid (1 / 2 / 3 cols at sm / md / lg). Each card: accent-coloured icon square (top, with subtle radial glow), white title, 3 bulleted sub-services (diamond bullet rotated 45° in accent colour, white text), white "Learn more" link with right-arrow → `/contact`. First card (AI & Intelligence) has a purple gradient background. Services: AI & Intelligence, Sales Intelligence Platform, Digital Products, Digital Services, Automation & Systems, Growth & Marketing.
7. Key Results (4 animated stats)
8. Our Process (4 steps)
9. Why Choose Levata (3 cards)
10. TechStackSection — **LOCKED**
11. TestimonialsSection
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
- **GSAP** owns: rotating SVG circles, services ticker (2.8s steps), `useCountUp` stat animation.
- **Framer Motion** owns: section reveals (`initial → whileInView`, `viewport={{ once: true, margin: "-80px" }}`, `ease: [0.16, 1, 0.3, 1]`), hero floating cards (y-oscillation, `repeat: Infinity`).
- **CSS keyframes** (`globals.css`): `badgePulse`, `marquee`, `techFadeIn`, `labelBeam`, `labelDotPulse`.
- Section-label pattern: `<SectionLabel text="..." />` (animated line + pulsing dot + uppercase eyebrow).

## Product pages
- `/products/sales-intelligence-platform` — flagship product landing page. 8 sections in order: Hero (dual CTAs: Start Free Trial / Book a Demo), Problem (3 cards), Core Capabilities (6 cards in 2-col grid, icon square + bullets), Who It's For (6 audience tiles in 3-col grid with cyan check), Key Outcomes (4-up animated stats — `useCountUp`), How It Works (6 numbered cards in 3-col grid, accent-glow numbers), FAQ (animated accordion via `AnimatePresence`), Final CTA. Server `page.tsx` exports `Metadata`; client logic lives in sibling `SalesIntelligencePage.tsx`.

## Home → product cross-links
- **Featured Product section (homepage §5):** "Explore the platform" CircleArrow CTA → `/products/sales-intelligence-platform`.
- **Service cards (homepage §6) `href` field on `SERVICE_CARDS`:** `AI & Intelligence` and `Sales Intelligence Platform` cards link to `/products/sales-intelligence-platform`; the other four still link to `/contact` until their product pages exist.
- **Navbar:** "Services" is a hover dropdown listing all 6 services (accent-colored dots). `AI & Intelligence` + `Sales Intelligence Platform` → product page; the other four anchor to `/#services` on the homepage. Keep this mapping in sync with `SERVICE_CARDS` when adding new product pages.

## Locked components — DO NOT MODIFY without explicit sign-off
- `app/components/ClientsMarquee.tsx`
- `TechStackSection` (defined inside `HeroSection.tsx`) — categories, tabs, grid styling

## Component conventions
- `"use client"` on any component with hooks, event handlers, GSAP/Framer Motion, or browser APIs.
- Use `cn()` for dynamic className merging.
- Use `<NeonButton>` for every CTA. Variants: `default`, `solid`, `ghost`. Sizes: `sm`, `default`, `lg`.
- CVA only in `neon-button.tsx`. Don't introduce it elsewhere unless adding variant-heavy components.
- Tailwind 4: `@import "tailwindcss"` only. No `tailwind.config.js` needed.

## Behavioral guidelines
- **Think before coding.** State assumptions; ask when unclear; flag simpler approaches.
- **Simplicity first.** Minimum code that solves the problem. No speculative abstractions or error handling for impossible scenarios.
- **Surgical changes.** Touch only what the task requires. Match existing style. Don't refactor what isn't broken.
- **Goal-driven.** Define a verifiable check for each task (test passes / page renders correctly / no console errors) before claiming done.
- For UI changes, run `npm run dev` and verify in a browser before reporting complete.

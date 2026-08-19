---
name: Dwen Wo Ho
description: Confidential student mental health care — warm, clinical, calm
colors:
  primary: "#e8d4ad"
  primary-foreground: "#161207"
  info: "#2b3990"
  success: "#2bb673"
  warning: "#f59e0b"
  destructive: "#ed4b58"
  background: "#2b1210"
  foreground: "#f4f2ef"
  muted: "#3b1a17"
  muted-foreground: "rgba(244,242,239,.55)"
  border: "rgba(255,255,255,.10)"
  card: "rgba(255,255,255,.055)"
  footer-bg: "#202126"
  secondary-accent: "#0d9488"
  warm-sand: "#e8d5b7"
typography:
  display:
    fontFamily: "'Space Grotesk', var(--font-space-grotesk), sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Space Grotesk', var(--font-space-grotesk), sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Space Grotesk', var(--font-space-grotesk), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Space Grotesk', var(--font-space-grotesk), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "'Space Grotesk', var(--font-space-grotesk), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 0.625rem"
    height: "2rem"
---

# Design System: Dwen Wo Ho

## Overview

**Creative North Star: "Bronze Fury" — a lantern-lit care room**

Dwen Wo Ho's visual system moved from a light lavender/purple register to a deep maroon-and-gold direction ("Bronze Fury", stakeholder-directed reskin, see `guide/Bronze Fury A_33.html`). The intent hasn't changed — it should still feel like a private, well-run care space, not a startup landing page or a hospital ward — but the atmosphere is now warmer and lower-key: a gradient of deep reds grounding the screen, gold as the single accent that carries all calls to action, and frosted-glass surfaces for the chrome that floats above content (bottom identity bars, campus switchers, dialogs).

Dark is now the **default and primary experience** (`defaultTheme="dark"`); light mode is a lighter maroon-and-cream tint derived for this system (the source mockup is dark-only) and should be treated as the secondary mode, not the canonical one.

The system still serves a **product register**: design disappears into task flow for students booking care and providers managing patients. Marketing hero moments borrow the same tokens — no separate "brand mode" palette.

**Key Characteristics:**

- Gold (`--primary`) used for actions and brand recognition against a maroon ground — full saturation for CTAs, `/10`–`/20` tints for chips and subtle chrome
- Space Grotesk for everything — headings, body, and UI; Space Mono for code-like or data-dense content (access codes, OTP)
- Pill-shaped primary buttons (`rounded-full`); inputs and cards use modest `rounded-lg`/`rounded-2xl`
- Frosted glassmorphism (`backdrop-filter: blur/saturate`) is now a deliberate signature for floating chrome, not an anti-pattern
- Semantic green/blue/amber/red for success, info, warning, error — never decorative

## Colors

A deep maroon ground anchored by **Bronze Gold** as the sole accent, with institutional blue and growth green as supporting semantics unchanged from before.

### Primary

- **Bronze Gold** (`#e8d4ad` dark / `#b8862e` light): Primary actions, brand headings, focus rings, active states. Full saturation for CTAs; `/10`–`/20` opacity for chips, borders, and subtle chrome.
- **Primary Foreground** (`#161207` dark / `#fefaf5` light): Text and icons on primary/gold surfaces — always dark ink on light gold, and vice versa in light mode.

### Secondary & Semantic (unchanged)

- **Institutional Blue** (#2b3990): Info states, sidebar primary accents, links requiring authority without alarm.
- **Growth Green** (#2bb673): Success states, positive confirmation, OTP slot emphasis.
- **Warm Amber** (#f59e0b): Warnings and attention without panic.
- **Alert Red** (`#ed4b58`): Destructive actions, validation errors, and the "911" triage tier only.

### Neutral / Ground

- **Maroon Depths** (dark `#2b1210`, gradient family `#733730 → #1a100c`): Page background. The gradient (`.bg-app-gradient` utility) is opt-in per-shell — not forced onto every route.
- **Cream Tint** (light `#f8efe7`, gradient family `#f7e9df → #ecdcc8`): Light-mode page background — a derived lighter tint of the same family, not from the source mockup.
- **Ink** (`#f4f2ef` dark / `#2b1210` light): Primary text.
- **Muted** (`rgba(244,242,239,.55)` dark / `rgba(43,18,16,.55)` light): Secondary text, placeholders.
- **Line** (`rgba(255,255,255,.10)` dark / `rgba(43,18,16,.12)` light): Borders and dividers.
- **Glass Card** (`rgba(255,255,255,.055)` dark / `#fffaf5` light): Card surfaces — translucent in dark mode to support the glass aesthetic, solid in light mode.

### Tertiary (unchanged)

- **Teal Accent** (#0d9488): Secondary accent for variety without competing with primary gold.
- **Warm Sand** (#e8d5b7): Soft warm beige for count badges, highlights, and tertiary accents.
- **Footer Charcoal** (#202126): Marketing footer only; not for in-app chrome.

## Typography

**Display / Headlines / Titles / Body / Labels:** Space Grotesk (300–700 weights) for everything — headings and body share one family now, applied via `--font-heading`/`--font-sans`. Large marketing headings run `text-6xl` to `text-8xl` with tight tracking.

**Mono:** Space Mono for access codes, OTP inputs, and other code-like or data-dense displays (`--font-mono`).

Scale ratio ~1.2 between steps. No fluid clamp on product screens — fixed rem sizes for predictable density in dashboards and forms.

## Elevation

**Frosted glassmorphism is now a deliberate signature**, not an anti-pattern: bottom identity/action bars, campus-switcher chrome, and floating panels use `backdrop-filter: blur() saturate()` with a translucent tint, a thin gloss-edge border, and soft layered shadows (see `LiquidGlass`/`LiquidGlassNavbar`). Gold glow halos (`box-shadow` with a soft gold tint) mark hover/focus on primary elements.

Cards in dark mode use a translucent `rgba(255,255,255,.055)` surface for depth; light mode uses solid cream cards differentiated by border rather than heavy shadows.

Focus rings: `ring-ring/50` with `ring-[3px]` on buttons; inputs use `ring-primary/50` on focus — visible for WCAG AA keyboard users. Gold-on-dark and gold-on-cream text pairings must be checked for AA contrast on a case-by-case basis — gold does not have the contrast margin purple had against a light background.

## Components

### Buttons

- **Primary:** `rounded-full`, `bg-primary`, `text-primary-foreground`, `shadow-xs`, hover `bg-primary/90`
- **Secondary:** Muted maroon/cream fill, muted foreground text
- **Outline / Ghost:** For tertiary actions; ghost has no default hover fill
- **Destructive:** Red fill, white text, dedicated focus ring
- Sizes: default (`px-5 py-2`), `sm`, `lg`, `icon`

### Badges

- **Triage tiers** (`triage-911`/`triage-now`/`triage-asap`): client-derived visual severity for the provider patient grid — 911 pulses destructive red, Now is solid gold, ASAP is a gold outline. These are cosmetic approximations, not backed by a real severity field yet (see `guide/provider-design-refactor-backend-needs.md`).
- **Assessment severity** (`severity-mild`/`moderate`/`severe`/`emergency`): success → warning → destructive → pulsing destructive, used in the patient assessment "dome" breakdown.

### Inputs

- Height `h-8`, `rounded-lg`, `border-input`, transparent background
- Focus: `border-ring` + `ring-primary/50`
- Invalid: `border-destructive` + destructive ring
- Disabled: `bg-input/50`, reduced opacity

### Cards & Surfaces

- Translucent glass card on maroon ground (dark) / solid cream card on cream ground (light), `rounded-2xl`–`rounded-3xl` for larger containers
- Provider dashboard chrome (campus-switcher row, bottom identity bar) is full-bleed and sidebar-less — no persistent top nav on the provider home screen

### Navigation

- Provider home screen: top campus-ring row + bottom frosted identity/action bar, no persistent sidebar or top nav
- Other provider/patient/curator surfaces: standard top nav + mobile sheet patterns, unchanged
- Footer dark charcoal separate from app chrome

### Motion

- UI transitions: `transition-all` / `transition-colors`, 150–250ms implied
- Marketing: framer-motion entrance animations, blob/gradient utilities — gate behind `prefers-reduced-motion`
- Page transitions via View Transition API (column wipe) — decorative; disable for reduced motion

## Do's and Don'ts

**Do**

- Use Bronze Gold only for primary actions, active selection, and brand headings — it's the single accent against the maroon ground, don't dilute it with competing bright colors
- Keep forms clean: one column on mobile, clear labels, visible error states
- Maintain consistent button shapes across student and provider flows
- Use semantic colors for state (success green, info blue, warning amber, error red)
- Test contrast on gold buttons and translucent card text at AA, in both themes
- Use the opt-in `.bg-app-gradient` utility for shells that want the decorative radial background — don't force it onto every route via `body`

**Don't**

- Reintroduce the old Care Purple (`#955aa4`) — it's fully retired from the token system; any surviving hardcoded purple hex is a bug, not a style choice
- Use display typography in data tables, form labels, or dense dashboards
- Ship decorative blob/gradient animations on clinical task screens
- Mix pill buttons with sharp-corner buttons on the same workflow step
- Default to modal dialogs when inline or progressive disclosure would work
- Use startup hype copy styling (all-caps eyebrows on every section, tracked kickers)
- Treat triage tiers or "unseen" ring counts as real backend data — they're derived/approximated client-side today (see `guide/provider-design-refactor-backend-needs.md`)

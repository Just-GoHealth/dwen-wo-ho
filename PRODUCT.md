# Product

## Register

product

## Users

**Students** in Ghana — primarily college students seeking confidential mental health support. They use the product when stressed, in crisis, or proactively managing wellness. Context: campus life, academic pressure, often on mobile, sometimes hesitant to seek help.

**Providers** — licensed psychologists, counselors, and therapists who deliver care through the platform. Context: clinical workflows, patient management, scheduling, documentation. They need efficiency without sacrificing professionalism.

Both audiences share a need for trust: students must feel safe revealing vulnerability; providers must feel the platform supports clinical standards.

## Product Purpose

Dwen Wo Ho ("Think About Yourself") is a student mental health platform by JustGo Health. It connects Ghanaian students with licensed mental health professionals through confidential, accessible digital care — therapy matching, crisis support, mood tracking, and peer communities.

Success looks like: students who would not otherwise seek help feel confident enough to start; providers can deliver care with clear, low-friction workflows; the interface never undermines confidentiality or clinical credibility.

## Brand Personality

**Warm, clinical, calm.**

Voice is reassuring without hype. Copy acknowledges difficulty directly but stays hopeful. No bro-marketing, no trivializing mental health, no institutional coldness. The product should feel like a competent care environment — private, respectful, and steady.

Reference direction: BetterHelp / Talkspace — clinical trust, clear provider matching, professional but approachable.

## Anti-references

- Generic startup slop: "boost your productivity" energy, AI-default SaaS aesthetics, purple-gradient decoration for its own sake
- Cold institutional healthcare: sterile bureaucracy, intimidating forms, hospital-gray everything
- Overly playful youth marketing that trivializes mental health (memes, loud hype, gamified suffering)

Note: the provider surface adopted a deliberate deep maroon/gold "Bronze Fury" reskin with frosted glassmorphism (stakeholder-directed, see `guide/Bronze Fury A_33.html` and `DESIGN.md`) — glassmorphism itself is no longer an anti-pattern here, provided it stays purposeful chrome (identity bars, campus switchers) rather than decorative noise layered onto clinical task screens.

## Design Principles

1. **Safety before spectacle** — Every screen should reinforce confidentiality and calm. Visual noise, aggressive motion, or hype copy erodes trust.
2. **Clinical credibility, human warmth** — UI patterns should feel familiar to users of trusted health and productivity tools; tone stays human, never robotic or corporate.
3. **Earned familiarity** — Reuse standard affordances (forms, nav, tables, modals-as-last-resort). Invented UI vocabulary creates doubt in a care context.
4. **Equal dignity for both sides** — Student and provider surfaces share a coherent system; neither feels like an afterthought.
5. **Clarity under stress** — Hierarchy, labels, and error states must work when users are anxious, tired, or in a hurry.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA** as baseline
- Respect `prefers-reduced-motion` for decorative animations (blob, gradient, view transitions)
- Maintain sufficient contrast on primary purple (#955aa4) and semantic states (success, warning, destructive)
- Form controls, focus rings, and touch targets must remain usable on mobile-first student devices

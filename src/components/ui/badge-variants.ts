/** Generic variants, rendered by `@just-gohealth/ui`'s Badge. */
export const GENERIC_BADGE_VARIANTS = [
  "default",
  "secondary",
  "destructive",
  "outline",
] as const;

export type GenericBadgeVariant = (typeof GENERIC_BADGE_VARIANTS)[number];

/**
 * Domain variants kept as a local fallback so existing `variant="triage-*"` /
 * `variant="severity-*"` callers keep working. New code should prefer the
 * package's `TriageBadge` / `SeverityBadge`. Classes mirror those components.
 */
export const DOMAIN_BADGE_CLASSES = {
  /* Triage tags. Flat, softly-tinted pills at rest; "-lit" is the solid-fill
     look used only when that tier is the active bottom-bar filter. */
  "triage-911": "border-destructive/40 bg-destructive/20 text-destructive",
  "triage-now": "border-primary/45 bg-primary/25 text-primary",
  "triage-asap": "border-success/40 bg-success/20 text-success",
  "triage-911-lit": "border-transparent bg-destructive text-white shadow-sm",
  "triage-now-lit": "border-transparent bg-primary text-[#161207] shadow-sm",
  "triage-asap-lit": "border-transparent bg-success text-white shadow-sm",
  /* Assessment item severity (dome accordion rows) */
  "severity-mild": "border-success/30 bg-success/10 text-success",
  "severity-moderate": "border-warning/30 bg-warning/10 text-warning",
  "severity-severe": "border-destructive/30 bg-destructive/10 text-destructive",
  "severity-emergency":
    "border-transparent bg-destructive text-destructive-foreground animate-pulse-subtle",
} as const;

export type DomainBadgeVariant = keyof typeof DOMAIN_BADGE_CLASSES;

export type BadgeVariant = GenericBadgeVariant | DomainBadgeVariant;

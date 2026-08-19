import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        /* Triage tags — client-derived approximation, not backend ground truth
           (see guide/provider-design-refactor-backend-needs.md). Flat,
           softly-tinted pills at rest (no heavy borders/shadows); "-lit" is
           the solid-fill look used only when that tier is the active
           bottom-bar filter. */
        "triage-911":
          "border-destructive/40 bg-destructive/20 text-destructive",
        "triage-now": "border-primary/45 bg-primary/25 text-primary",
        "triage-asap": "border-success/40 bg-success/20 text-success",
        "triage-911-lit":
          "border-transparent bg-destructive text-white shadow-sm",
        "triage-now-lit":
          "border-transparent bg-primary text-[#161207] shadow-sm",
        "triage-asap-lit": "border-transparent bg-success text-white shadow-sm",
        /* Assessment item severity (dome accordion rows) */
        "severity-mild": "border-success/30 bg-success/10 text-success",
        "severity-moderate": "border-warning/30 bg-warning/10 text-warning",
        "severity-severe":
          "border-destructive/30 bg-destructive/10 text-destructive",
        "severity-emergency":
          "border-transparent bg-destructive text-destructive-foreground animate-pulse-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

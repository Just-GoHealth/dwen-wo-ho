/**
 * Returns visual config for a patient status value.
 * @param {"urgent"|"new"|"action"|"follow-up"|"referred"|"ignored"} status
 */
export function getStatusConfig(status: string) {
  const map: Record<
    string,
    { label: string; cls: string; bar: string; actionLabel: string }
  > = {
    urgent: {
      label: "Urgent",
      cls: "bg-destructive/10 text-destructive border-destructive/25",
      bar: "var(--destructive)",
      actionLabel: "View Case",
    },
    new: {
      label: "New",
      cls: "bg-success/10 text-success border-success/25",
      bar: "var(--success)",
      actionLabel: "Open Case",
    },
    action: {
      label: "In Treatment",
      cls: "bg-primary/10 text-primary border-primary/25",
      bar: "var(--primary)",
      actionLabel: "Resume",
    },
    followUp: {
      label: "Follow-up",
      cls: "bg-warning/10 text-warning border-warning/25",
      bar: "var(--warning)",
      actionLabel: "Review",
    },
    referred: {
      label: "Referred Out",
      cls: "bg-secondary text-secondary-foreground border-border",
      bar: "var(--secondary-foreground)",
      actionLabel: "View",
    },
    ignored: {
      label: "Ignored",
      cls: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/25",
      bar: "var(--muted-foreground)",
      actionLabel: "Action",
    },
  };
  return map[status.toLowerCase()] ?? map.ignored;
}

/** Score-ring colour per status */
/** * Locked-In Color Coding based on 0-10 score
 * 0.0 - 2.0: Black (Critical)
 * 2.1 - 4.0: Red (High Concern)
 * 4.1 - 6.0: Light Green (Mild Concern)
 * 6.1 - 8.0: Green (Healthy/Stable)
 * 8.1 - 10.0: Brand primary (Neutral/No Concern)
 */
export function getScoreColor(score: number | null) {
  if (score === null) return "var(--muted-foreground)"; // Default/Ignored

  if (score <= 2.0) return "var(--destructive)"; // Critical
  if (score <= 4.0)
    return "color-mix(in srgb, var(--destructive) 65%, transparent)"; // High Concern
  if (score <= 6.0) return "color-mix(in srgb, var(--success) 55%, white)"; // Mild Concern
  if (score <= 8.0) return "var(--success)"; // Healthy
  return "var(--primary)"; // Brand primary: Neutral
}

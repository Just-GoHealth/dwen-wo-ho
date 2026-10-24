/**
 * The app's historical Button variant/size names, mapped onto
 * `@just-gohealth/ui`'s Button API. Importers keep using the old names.
 */
export type AppButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export type AppButtonSize = "default" | "sm" | "lg" | "icon";

type PackageVariant =
  "primary" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export const BUTTON_VARIANT_MAP: Record<
  AppButtonVariant,
  PackageVariant | null
> = {
  default: "primary",
  destructive: "destructive",
  outline: "outline",
  secondary: "secondary",
  // The app's ghost variant was intentionally unstyled (callers bring their
  // own colours), so it maps to "no variant classes" rather than the
  // package's ghost hover styles.
  ghost: null,
  link: "link",
};

export const BUTTON_SIZE_MAP: Record<
  AppButtonSize,
  "md" | "sm" | "lg" | "icon"
> = {
  default: "md",
  sm: "sm",
  lg: "lg",
  icon: "icon",
};

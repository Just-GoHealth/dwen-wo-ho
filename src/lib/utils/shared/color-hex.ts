/**
 * Maps the backend's named severity colors to the app's actual theme
 * tokens instead of arbitrary hardcoded hex (the old values — e.g. a
 * near-black `#081c05` for "green", flat `#ff0000` for "red" — predate the
 * Bronze Fury palette and never matched it).
 */
export function getColorHex(color: string) {
  let code = "";
  if (color === "yellow") code = "var(--warning)";
  if (color === "orange")
    code = "color-mix(in srgb, var(--destructive) 55%, var(--warning) 45%)";
  if (color === "green") code = "var(--success)";
  if (color === "purple") code = "var(--gold-lo)";
  if (color === "red") code = "var(--destructive)";
  if (color === "light green")
    code = "color-mix(in srgb, var(--success) 55%, white)";
  // A translucent muted-foreground would be nearly invisible as a solid
  // swatch behind white badge text — use the brand's own darkest gradient
  // stop instead, which stays opaque and dark in both themes.
  if (color === "black") code = "var(--sw-red-deep)";
  return code;
}

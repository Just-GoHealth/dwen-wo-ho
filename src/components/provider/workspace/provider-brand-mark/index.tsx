import { Logo } from "@/components/shared/logo";

/**
 * Static JustGo Health mark for `ProviderGlassBar`'s right region —
 * non-clickable, white since the bar itself is a dark glass panel
 * (`.sc-screen .m-bar`) rather than the mock's light `.pr-bar` band. Full
 * opacity, not the mock's 86% dimming, since white-on-dark-glass needs
 * every bit of contrast it can get to stay legible.
 */
export function ProviderBrandMark() {
  return (
    <Logo
      variant="white"
      withLink={false}
      className="h-6 w-auto sm:h-7 md:h-8"
    />
  );
}

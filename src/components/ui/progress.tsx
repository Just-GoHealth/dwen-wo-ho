import * as React from "react";
import { Progress as UiProgress } from "@just-gohealth/ui";

/** Backed by `@just-gohealth/ui`'s Progress; `value` stays optional (defaults to 0). */
function Progress({
  value,
  ...props
}: Omit<React.ComponentProps<typeof UiProgress>, "value"> & {
  value?: number | null;
}) {
  return <UiProgress value={value ?? 0} {...props} />;
}

export { Progress };

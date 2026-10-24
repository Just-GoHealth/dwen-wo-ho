import * as React from "react";
import { Textarea as UiTextarea } from "@just-gohealth/ui";

import { cn } from "@/lib/utils";

/**
 * Backed by `@just-gohealth/ui`'s Textarea. Keeps the app's auto-growing
 * (`field-sizing-content`) behaviour.
 */
function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof UiTextarea>) {
  return (
    <UiTextarea
      className={cn("field-sizing-content min-h-16", className)}
      {...props}
    />
  );
}

export { Textarea };

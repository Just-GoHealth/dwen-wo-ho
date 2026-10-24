import * as React from "react";
import {
  Button as UiButton,
  type ButtonProps as UiButtonProps,
} from "@just-gohealth/ui";

import {
  BUTTON_SIZE_MAP,
  BUTTON_VARIANT_MAP,
  type AppButtonSize,
  type AppButtonVariant,
} from "./button-variants";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: AppButtonVariant | null;
  size?: AppButtonSize | null;
  asChild?: boolean;
  /** Shows a spinner, disables the button and sets `aria-busy`. */
  loading?: boolean;
  /** Text shown while loading. Defaults to the button's children. */
  loadingText?: React.ReactNode;
};

/**
 * App-level Button — a thin wrapper over `@just-gohealth/ui`'s Button that
 * keeps the app's original variant/size names.
 */
function Button({
  variant,
  size,
  type,
  asChild = false,
  ...props
}: ButtonProps) {
  const uiProps = {
    ...props,
    asChild,
    variant: BUTTON_VARIANT_MAP[variant ?? "default"],
    size: BUTTON_SIZE_MAP[size ?? "default"],
    // The package defaults to type="button"; native <button> (and this app's
    // previous Button) defaults to "submit", which forms rely on.
    type: asChild ? type : (type ?? "submit"),
  } as UiButtonProps;

  return <UiButton {...uiProps} />;
}

export { Button };

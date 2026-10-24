"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Toaster as UiToaster,
  type ToasterProps as UiToasterProps,
} from "@just-gohealth/ui";

type ToasterProps = UiToasterProps;

/** Backed by `@just-gohealth/ui`'s Toaster; follows the next-themes theme. */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <UiToaster
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckIcon className="text-success size-4" />,
        info: <InfoIcon className="text-info size-4" />,
        warning: <TriangleAlertIcon className="text-warning size-4" />,
        error: <OctagonXIcon className="text-error size-4" />,
        loading: <Loader2Icon className="text-loading size-4 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };

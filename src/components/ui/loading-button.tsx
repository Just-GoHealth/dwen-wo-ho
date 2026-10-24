import * as React from "react";

import { Button } from "@/components/ui/button";

type LoadingButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  /** When omitted with size="icon", shows spinner only while loading */
  loadingText?: React.ReactNode;
};

/** Button with a loading state — backed by `@just-gohealth/ui`'s Button `loading`/`loadingText`. */
function LoadingButton({ loading = false, ...props }: LoadingButtonProps) {
  return <Button loading={loading} {...props} />;
}

export { LoadingButton };

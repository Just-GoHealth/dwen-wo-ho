import { getMetadata } from "@/lib/metadata";
import { ProviderAuthWorkspace } from "@/components/provider/auth/auth-workspace";

// Curators share the provider sign-in endpoint and flow; this route gives them
// their own screen so logout / session expiry no longer drops them on the
// provider sign-in page (LOG-02).
export const metadata = getMetadata(
  "Curator Sign In",
  "Sign in to your Dwen Wo Ho curator account.",
  "/curator/auth",
);

export default function CuratorAuthPage() {
  return <ProviderAuthWorkspace audience="curator" />;
}

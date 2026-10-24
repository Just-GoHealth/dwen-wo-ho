import { getMetadata } from "@/lib/metadata";
import { CuratorProviderDetailsScreen } from "@/components/curator/provider-details/screen";

export const metadata = getMetadata(
  "Provider Details",
  "Review provider details and application status on Dwen Wo Ho.",
  "/curator/provider",
);

export default function CuratorProviderDetailsPage() {
  return <CuratorProviderDetailsScreen />;
}

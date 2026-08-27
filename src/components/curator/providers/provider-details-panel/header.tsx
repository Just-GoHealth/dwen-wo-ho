import { FiUser, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { ProviderHeaderProps } from "@/lib/types/components/curator/providers/provider-details-panel";

export const ProviderHeader = ({
  provider,
  onClose,
  statusConfig,
}: ProviderHeaderProps) => {
  return (
    <div className="bg-muted/80 border-border relative flex items-center gap-6 border-b p-6">
      <Button
        onClick={onClose}
        variant="ghost"
        className="bg-muted/80 hover:bg-destructive/5 text-muted-foreground hover:text-foreground border-border/50 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border p-0 backdrop-blur-sm transition-all duration-200 hover:rotate-90"
        aria-label="Close modal"
      >
        <FiX className="text-destructive h-5 w-5" />
      </Button>

      <div className="ring-card bg-muted text-muted-foreground flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-lg ring-4">
        {provider.profilePhotoURL ? (
          // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
          <img
            src={provider.profilePhotoURL}
            alt={provider.fullName || "Provider"}
            className="h-full w-full object-cover"
          />
        ) : (
          <FiUser className="h-10 w-10" />
        )}
      </div>

      <div className="text-foreground flex-1">
        <h2 className="text-foreground mb-1 text-2xl font-bold">
          {provider?.fullName ?? "Provider"}
        </h2>
        {provider?.professionalTitle && (
          <p className="text-muted-foreground mb-2 text-sm">
            {provider.professionalTitle}
          </p>
        )}
        {statusConfig && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
          >
            {provider.applicationStatus}
          </span>
        )}
      </div>
    </div>
  );
};

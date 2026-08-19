import { FiUser, FiMail, FiPhone, FiCalendar, FiAward } from "react-icons/fi";
import Image from "next/image";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { ProviderProfileCardProps } from "@/lib/types/components/provider/profile";

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <div className="bg-card border-border mb-5 rounded-2xl border p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {provider.profilePhotoURL ? (
          <div className="border-primary relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2">
            <Image
              src={provider.profilePhotoURL}
              alt={formatProviderName(
                provider.providerName || "",
                provider.providerTitle,
              )}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="border-primary bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2">
            <FiUser className="h-8 w-8" />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h2 className="text-foreground text-xl font-bold">
              {formatProviderName(
                provider.providerName || "",
                provider.providerTitle,
              )}
            </h2>
            {provider.applicationStatus === "APPROVED" && (
              <span
                className="bg-primary text-primary-foreground flex size-4 shrink-0 items-center justify-center rounded-full text-[10px]"
                title="Verified Provider"
              >
                ✓
              </span>
            )}
          </div>

          {provider.specialty && (
            <p className="text-muted-foreground mb-2.5 text-base">
              {provider.specialty}
            </p>
          )}
          {provider.status && (
            <p className="text-foreground/80 mb-2.5 text-sm italic">
              &quot;{provider.status}&quot;
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <FiMail className="text-muted-foreground h-4 w-4 shrink-0" />
              <span className="text-foreground text-sm">{provider.email}</span>
            </div>
            {provider.officePhoneNumber && (
              <div className="flex items-center gap-2">
                <FiPhone className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="text-foreground text-sm">
                  {provider.officePhoneNumber}
                </span>
              </div>
            )}
            {provider.applicationDate && (
              <div className="flex items-center gap-2">
                <FiCalendar className="text-muted-foreground h-4 w-4 shrink-0" />
                <span className="text-foreground text-sm">
                  Joined{" "}
                  {new Date(provider.applicationDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FiAward className="text-muted-foreground h-4 w-4 shrink-0" />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  provider.applicationStatus === "APPROVED"
                    ? "bg-success/10 text-success"
                    : provider.applicationStatus === "PENDING"
                      ? "bg-warning/10 text-warning"
                      : "bg-destructive/10 text-destructive"
                }`}
              >
                {provider.applicationStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

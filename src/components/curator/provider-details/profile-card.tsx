import { User, Mail, Phone, Calendar } from "lucide-react";
import { ProviderProfileCardProps } from "@/lib/types/components/curator/provider-details/provider-details";

export function ProviderProfileCard({ provider }: ProviderProfileCardProps) {
  return (
    <div className="bg-card border-border mb-8 overflow-hidden rounded-lg border shadow-lg">
      <div className="px-6 py-8">
        <div className="flex items-start space-x-6">
          {/* Profile Image */}
          <div className="shrink-0">
            {provider.profilePhotoURL ? (
              // eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization
              <img
                src={provider.profilePhotoURL}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary flex h-30 w-30 items-center justify-center rounded-full">
                <User className="text-primary-foreground h-16 w-16" />
              </div>
            )}
          </div>

          {/* Provider Info */}
          <div className="flex-1">
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              {provider.professionalTitle
                ? `${provider.professionalTitle} `
                : ""}
              {provider.fullName}
            </h1>
            <div className="mb-4 flex items-center space-x-2">
              <Mail className="text-muted-foreground h-5 w-5" />
              <span className="text-muted-foreground">{provider.email}</span>
            </div>

            {provider.officePhoneNumber && (
              <div className="mb-2 flex items-center space-x-2">
                <Phone className="text-muted-foreground h-5 w-5" />
                <span className="text-muted-foreground">
                  {provider.officePhoneNumber}
                </span>
              </div>
            )}

            <div className="mb-4 flex items-center space-x-2">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <span className="text-muted-foreground">
                Applied:{" "}
                {provider.createdAt
                  ? new Date(provider.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            {(provider.status || provider.bio) && (
              <div className="mb-4">
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  Bio/Status
                </h3>
                <p className="text-muted-foreground bg-muted rounded-lg p-4">
                  {provider.bio || provider.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

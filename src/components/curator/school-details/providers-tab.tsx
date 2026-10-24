import Image from "next/image";
import { Users } from "lucide-react";
import { formatProviderName } from "@/lib/utils/shared/provider-name";
import { TabContentState } from "@/components/shared/tab-content-state/index";
import { ProvidersTabProps } from "@/lib/types/components/curator/school-details/school-details";

export const ProvidersTab = ({
  providers,
  isLoading,
  onProviderClick,
  searchQuery = "",
}: ProvidersTabProps & { searchQuery?: string }) => {
  const filteredProviders = providers.filter((provider) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const nameMatch = formatProviderName(
      provider.providerName,
      provider.providerTitle,
    )
      .toLowerCase()
      .includes(query);
    const specialtyMatch = provider.specialty?.toLowerCase().includes(query);

    return nameMatch || specialtyMatch;
  });

  return (
    <TabContentState
      isLoading={isLoading}
      isEmpty={filteredProviders.length === 0}
      loadingMessage="Loading providers..."
      emptyMessage={
        providers.length === 0
          ? "No providers found for this school"
          : "No providers match your search"
      }
      EmptyIcon={Users}
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider, index) => {
          const fullName = formatProviderName(
            provider.providerName,
            provider.providerTitle,
          );

          // Rotating pastel gradient backgrounds
          const pastelColors = [
            "from-rose-200 to-rose-100", // pink
            "from-blue-200 to-indigo-100", // blue-lavender
            "from-emerald-200 to-green-100", // green
            "from-amber-200 to-yellow-100", // amber
            "from-teal-200 to-cyan-100", // teal
            "from-sky-200 to-cyan-100", // sky
            "from-orange-200 to-amber-100", // orange
            "from-fuchsia-200 to-pink-100", // fuchsia
          ];
          const bgGradient = pastelColors[index % pastelColors.length];

          return (
            <button
              type="button"
              key={provider.id}
              onClick={() => onProviderClick(provider)}
              className="group flex flex-col items-center text-center transition-all duration-200"
            >
              {/* Pastel square with avatar */}
              <div
                className={`h-40 w-40 rounded-3xl bg-linear-to-br ${bgGradient} mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg`}
              >
                {provider.profilePhotoURL ? (
                  <Image
                    src={provider.profilePhotoURL}
                    alt={provider.providerName}
                    width={88}
                    height={88}
                    className="h-22 w-22 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-22 w-22 items-center justify-center rounded-full bg-white/40 backdrop-blur-sm">
                    <Users className="text-foreground/40 h-10 w-10" />
                  </div>
                )}
              </div>

              {/* Full name (with title) */}
              <h4 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                {fullName}
              </h4>

              {/* Specialty */}
              {provider.specialty && (
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {provider.specialty}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </TabContentState>
  );
};

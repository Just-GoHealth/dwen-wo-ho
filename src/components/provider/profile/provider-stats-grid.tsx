import { ProviderStatsGridProps } from "@/lib/types/components/provider/profile";
import { getProviderStatItems } from "@/lib/constants/components/provider/profile/profile";
import { StatTile } from "@/components/ui/stat-tile";

export function ProviderStatsGrid({ stats }: ProviderStatsGridProps) {
  const statItems = getProviderStatItems(stats);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <StatTile
          key={item.label}
          icon={item.icon}
          value={item.value}
          label={item.label}
          iconWrapperClassName={item.bgClass}
          iconClassName={item.textClass}
        />
      ))}
    </div>
  );
}

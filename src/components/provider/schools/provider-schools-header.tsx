import { ProviderSchoolsHeaderProps } from "@/lib/types/components/provider/schools";

export function ProviderSchoolsHeader({
  title = "My Schools",
  description = "View and manage your assigned schools",
}: ProviderSchoolsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-foreground mb-2 text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

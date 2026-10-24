"use client";

import { useRouter } from "next/navigation";
import WidthConstraint from "@/components/ui/width-constraint";
import { useProviderSchools } from "@/hooks/provider/schools/use-schools";
import {
  ProviderSchoolsHeader,
  ProviderSchoolsFilter,
  ProviderSchoolsList,
} from "@/components/provider/schools";
import { JoinCampusPanel } from "@/components/provider/schools/join-campus-panel";

export default function ProviderSchoolsPage() {
  const router = useRouter();
  const {
    schoolsList,
    cachedSchools,
    atomLoading,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    isLoadingProfile,
    isApproved,
  } = useProviderSchools();

  const handleSchoolClick = (schoolId: string | number) => {
    router.push(`/provider/schools/${schoolId}`);
  };

  const isLoading =
    (atomLoading || isLoadingProfile) && cachedSchools.length === 0;

  return (
    <WidthConstraint>
      <div className="p-4 sm:p-8">
        <ProviderSchoolsHeader />

        <ProviderSchoolsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <ProviderSchoolsList
          schools={schoolsList}
          isLoading={isLoading}
          activeFilter={activeFilter}
          onSchoolClick={handleSchoolClick}
        />

        {isApproved && (
          <JoinCampusPanel
            joinedIds={new Set(cachedSchools.map((s) => String(s.id)))}
          />
        )}
      </div>
    </WidthConstraint>
  );
}

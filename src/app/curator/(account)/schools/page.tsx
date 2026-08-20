"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { DYNAMIC_ROUTES } from "@/lib/constants/infra/routes";
import { Button } from "@/components/ui/button";

import { School } from "lucide-react";
import { SchoolCardSkeletonGrid } from "@/components/curator/schools/school-card/skeleton";

import WidthConstraint from "@/components/ui/width-constraint";

import { useCuratorSchools } from "@/hooks/curator/schools/use-schools";

import { type FilterType } from "@/lib/types/components/shared/school-filter";

import { FILTER_OPTIONS } from "@/lib/constants/components/curator/schools/schools-list-search";

import { SchoolCard } from "@/components/curator/schools/school-card/index";

import { NotificationBell } from "@/components/shared/notification-bell/index";

import { useCuratorNotification } from "@/hooks/curator/notification/use-notification";

import { FilterTabBar } from "@/components/shared/filter-tab-bar/index";

import { SearchDropdown } from "@/components/shared/search-dropdown";

import { SchoolSuggestionCard } from "@/components/shared/school-suggestion-card/index";

import {
  SCHOOLS_LIST_SEARCH_PLACEHOLDERS,
  SCHOOL_FILTER_ICONS,
} from "@/lib/constants/components/curator/schools/schools-list-search";

export default function SchoolsPage() {
  const {
    schoolsList,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    setAppliedSearchQuery,
    filterCounts,
    isLoading,
    hasCachedData,
    isError,
    suggestions,
    quickFilters,
    localActiveFilters,
    toggleFilter,
    removeFilter,
    clearFilters,
  } = useCuratorSchools();

  const router = useRouter();
  const { unreadCount, setIsOpen } = useCuratorNotification();

  if (isError) {
    return (
      <div className="bg-app-gradient min-h-screen">
        <WidthConstraint>
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-8 p-8">
            <div className="text-destructive text-center font-medium">
              Failed to load schools
            </div>

            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </WidthConstraint>
      </div>
    );
  }

  return (
    <div className="bg-app-gradient min-h-screen">
      <WidthConstraint>
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 p-4 duration-700 md:p-8">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
              Schools
            </h1>

            <p className="text-muted-foreground text-lg">
              Manage and view all registered educational institutions
            </p>
          </div>

          {/* Header Actions */}
          <div className="hidden items-center gap-4 2xl:flex">
            <NotificationBell
              unreadCount={unreadCount}
              onOpenNotifs={() => setIsOpen(true)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 object-center min-[1229px]:flex-row">
          {/* Search & Filters */}
          <FilterTabBar<FilterType>
            tabs={FILTER_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              icon: SCHOOL_FILTER_ICONS[opt.value],
              count: filterCounts[opt.value],
            }))}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            activeTabLayoutId="curator-schools-filter"
            className="hidden min-[1229px]:flex"
          />

          <div className="w-full max-w-sm 2xl:max-w-xl">
            <SearchDropdown
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholders={SCHOOLS_LIST_SEARCH_PLACEHOLDERS}
              suggestions={suggestions}
              quickFilters={quickFilters}
              activeFilters={localActiveFilters}
              onSelectOption={(val) => {
                setSearchQuery(val);
              }}
              onFilterChange={(filter) => {
                if (filter.filterKey) {
                  toggleFilter(filter);
                }
              }}
              onRemoveFilter={removeFilter}
              getSuggestionValue={(s) => s.name}
              renderSuggestion={SchoolSuggestionCard}
              onSubmitSearch={(query) => {
                setAppliedSearchQuery(query);
              }}
              onSuggestionAction={(suggestion) => {
                if (suggestion && suggestion.id) {
                  router.push(
                    DYNAMIC_ROUTES.curator.schoolDetails(
                      suggestion.id,
                    ) as Route,
                  );
                }
              }}
              onResetSearch={() => {
                setSearchQuery("");
                setAppliedSearchQuery("");
                setActiveFilter("all");
                clearFilters();
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading && !hasCachedData ? (
          <SchoolCardSkeletonGrid />
        ) : schoolsList.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center gap-4 py-20 text-center duration-500">
            <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
              <School className="text-muted-foreground h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-foreground text-xl font-semibold">
                No schools found
              </h3>

              <p className="text-muted-foreground mx-auto max-w-sm">
                {activeFilter === "all"
                  ? "There are no schools registered yet."
                  : `There are no schools under the "${FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label}" category.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {schoolsList.map((school, i) => (
              <div
                key={school.id}
                className="animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <SchoolCard school={school} priority={i < 3} />
              </div>
            ))}
          </div>
        )}
      </div>
      </WidthConstraint>
    </div>
  );
}

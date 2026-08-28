"use client";

import { FiSearch } from "react-icons/fi";
import { MdSchool } from "react-icons/md";
import { SchoolSelectionPickerProps } from "@/lib/types/components/shared/overlays";
import { useSchoolSelection } from "@/hooks/components/curator/content-pages/use-school-selection";
import { SCHOOL_FILTER_OPTIONS } from "@/lib/constants/components/curator/content-pages/overlays";
import { ArrowBigLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchoolSelectionPicker({
  isOpen,
  onClose,
  onSelect,
}: SchoolSelectionPickerProps) {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filteredSchools,
    handleSchoolClick,
    handleSelectPlatform,
  } = useSchoolSelection(isOpen, onSelect);

  if (!isOpen) return null;

  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl">
      <div className="bg-card text-foreground border-border flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <Button
            onClick={onClose}
            className="bg-muted hover:bg-muted-foreground/40 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <ArrowBigLeftIcon className="h-6 w-6" />
          </Button>
          <h2 className="text-foreground text-2xl font-bold">Select School</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Search Bar */}
        <div className="border-border border-b p-6">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <FiSearch className="text-foreground h-5 w-5" />
            </div>
            <input
              type="text"
              aria-label="Search schools"
              placeholder="Search schools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground w-full rounded-xl border py-3 pr-12 pl-4 transition-all focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="border-border border-b px-6 pt-2 pb-2">
          <div className="flex flex-wrap justify-center gap-2">
            {SCHOOL_FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground shadow-primary/20 shadow-md"
                    : "bg-card text-muted-foreground hover:bg-muted border-border border"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Schools List - Fixed height to show 6 cards (3 rows × 2 columns), rest scrollable */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "20rem" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground">Loading schools...</p>
              </div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="py-20 text-center">
              <MdSchool className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                No schools found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No schools match your search."
                  : "No schools available."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Platform/Default Option */}
              <Button
                onClick={handleSelectPlatform}
                className="bg-muted hover:bg-muted/80 flex h-20 w-full items-center gap-4 rounded-xl p-4 text-left transition-all"
              >
                <div className="bg-secondary-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                  <span className="text-primary-foreground text-lg font-bold">
                    +
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-semibold">
                    Platform (Default)
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Default cover page for all schools
                  </p>
                </div>
              </Button>

              {/* Schools List */}
              <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2">
                {filteredSchools.map((school) => (
                  <Button
                    key={school.id}
                    onClick={() => handleSchoolClick(school)}
                    variant={"secondary"}
                    className="flex h-14 w-80 items-center gap-6 rounded-full p-4 text-left transition-all"
                  >
                    {school.logo ? (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                        <img
                          src={school.logo}
                          alt={school.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <MdSchool className="text-muted-foreground h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-primary-foreground truncate font-semibold">
                        {school.name}
                      </p>
                      {school.type && (
                        <p className="text-primary-foreground/80 text-sm">
                          {school.type}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

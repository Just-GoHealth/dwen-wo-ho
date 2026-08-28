import { MdSchool } from "react-icons/md";
import { FiSearch, FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SchoolsTabProps } from "@/lib/types/components/curator/partners/partner-details-panel";
import { AssociatedSchool } from "@/lib/types/entities/partners";
import { Input } from "@/components/ui/input";

export const SchoolsTab = ({
  isLoadingSchools,
  associatedSchools,
  filteredAvailableSchools,
  schoolSearchQuery,
  setSchoolSearchQuery,
  handleSchoolClick,
  setSchoolToRemove,
  setSchoolToAdd,
}: SchoolsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Schools */}
      <div>
        <h4 className="mb-3 font-semibold text-gray-900">Associated Schools</h4>
        {isLoadingSchools ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p>Loading schools...</p>
          </div>
        ) : associatedSchools.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <MdSchool className="mx-auto mb-2 h-12 w-12 text-gray-300" />
            <p>No schools associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedSchools.map((school: AssociatedSchool) => (
              <Button
                key={school.id}
                onClick={() => handleSchoolClick(school)}
                className="bg-background border-border hover:border-primary/30 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-cyan-500">
                      <MdSchool className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{school.name}</p>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSchoolToRemove(school);
                  }}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors"
                  aria-label="Remove school"
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Available Schools */}
      <div>
        <h4 className="mb-3 font-semibold text-gray-900">Available Schools</h4>
        <div className="relative mb-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search schools..."
            value={schoolSearchQuery}
            onChange={(e) => setSchoolSearchQuery(e.target.value)}
            className="bg-background border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground w-full rounded-lg border py-2 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
          />
        </div>

        {filteredAvailableSchools.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            {schoolSearchQuery
              ? "No schools found matching your search."
              : "All schools are already associated."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredAvailableSchools.map((school: AssociatedSchool) => (
              <div
                key={school.id}
                className="bg-background border-border hover:border-primary/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-cyan-500">
                      <MdSchool className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{school.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSchoolToAdd(school)}
                  className="border-success/50 text-success hover:bg-success/10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors"
                  aria-label="Add school"
                >
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

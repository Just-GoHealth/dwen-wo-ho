import { FiAward, FiMinus, FiSearch, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SchoolsTabProps } from "@/lib/types/components/curator/providers/provider-details-panel";
import { AssociatedSchool } from "@/lib/types/entities/partners";
import { Input } from "@/components/ui/input";

export const SchoolsTab = ({
  isLoadingSchools,
  associatedSchools,
  schoolSearchQuery,
  setSchoolSearchQuery,
  filteredAvailableSchools,
  setSchoolToRemove,
  setSchoolToAdd,
  applicationStatus,
}: SchoolsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Associated Schools */}
      <div>
        <h4 className="mb-3 font-semibold">Associated Schools</h4>
        {isLoadingSchools ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="border-border mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p>Loading schools...</p>
          </div>
        ) : associatedSchools.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <FiAward className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
            <p>No schools associated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {associatedSchools.map((school) => (
              <div
                key={school.id}
                className="bg-muted/50 border-border hover:border-primary/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {school.logo ? (
                    <div className="border-border h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
                      <Image
                        src={school.logo}
                        alt={school.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="border-border from-primary to-primary/70 text-primary-foreground shadow-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br text-xl font-bold shadow-lg"></div>
                  )}
                  <div>
                    <p className="font-semibold">{school.name}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSchoolToRemove(school)}
                  variant="ghost"
                  className="border-destructive/80 text-destructive hover:bg-destructive/20 flex h-8 w-8 items-center justify-center rounded-full border-2 p-0 transition-colors"
                  aria-label="Remove school"
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Schools */}
      <div>
        <h4 className="mb-3 font-semibold">Available Schools</h4>
        {isLoadingSchools ? (
          <div className="text-muted-foreground py-4 text-center">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="text-muted-foreground h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search schools..."
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
                className="placeholder-muted w-full py-2 pr-4 pl-10 transition-all"
              />
            </div>

            {filteredAvailableSchools.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                {schoolSearchQuery
                  ? "No schools found matching your search."
                  : "All schools are already associated."}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredAvailableSchools.map((school: AssociatedSchool) => {
                  const isRejected = applicationStatus === "REJECTED";
                  return (
                    <div
                      key={school.id}
                      className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                        isRejected &&
                        "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {school.logo ? (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                            <Image
                              src={school.logo}
                              alt={school.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-300">
                            <FiAward className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p
                            className={`font-semibold ${isRejected ? "text-gray-500" : "text-gray-900"}`}
                          >
                            {school.name}
                          </p>
                          {isRejected && (
                            <p className="mt-1 text-xs text-gray-400">
                              Cannot add schools to rejected providers
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => !isRejected && setSchoolToAdd(school)}
                        disabled={isRejected}
                        variant="ghost"
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 p-0 transition-colors ${
                          isRejected
                            ? "cursor-not-allowed border-gray-300 text-gray-400"
                            : "border-green-400 text-green-500 hover:bg-green-50"
                        }`}
                        aria-label="Add school"
                      >
                        <FiPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

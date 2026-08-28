"use client";

import { MdSchool } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { Logo } from "@/components/shared/logo";
import WidthConstraint from "@/components/ui/width-constraint";
import { useLockInSchools } from "@/hooks/patient/lock-in/use-schools";

export function PatientLockInSchoolPickerScreen() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredSchools,
    handleSchoolSelect,
  } = useLockInSchools();

  return (
    <div className="min-h-screen">
      <WidthConstraint>
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Lock In</h1>
              <p className="text-gray-600">Select your school to begin</p>
            </div>
            <Logo />
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                aria-label="Search schools"
                placeholder="Search schools by name, nickname, type, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-primary focus:ring-primary/20 w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-400 transition-all focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-gray-500">Loading schools...</p>
              </div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="py-20 text-center">
              <MdSchool className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No schools found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "No schools are available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.map((school) => (
                <button
                  type="button"
                  key={school.id}
                  onClick={() => handleSchoolSelect(school.id)}
                  className="hover:border-primary/30 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {school.logo ? (
                      <div className="relative h-16 w-16 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                        <img
                          src={school.logo}
                          alt={school.name}
                          className="h-full w-full rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <MdSchool className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 truncate text-lg font-semibold text-gray-900">
                        {school.name}
                      </h3>
                      {school.nickname && (
                        <p className="mb-1 text-sm text-gray-500">
                          @{school.nickname}
                        </p>
                      )}
                      {school.type && (
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                          {school.type}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </WidthConstraint>
    </div>
  );
}

"use client";

import React from "react";
import { MdSchool } from "react-icons/md";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { useSchoolsQuery } from "@/hooks/queries/useSchoolsQuery";
import { School } from "@/types/school";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function SchoolsPage() {
  // Fetch schools using the query hook
  const { schools, isLoading, isError, error } = useSchoolsQuery();

  console.log(schools);

  // Use schools data or empty array
  const schoolsList = schools || [];

  // Loading state
  if (isLoading) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#955aa4] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading schools...</p>
            </div>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  // Error state
  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">
              Failed to load schools
            </p>
            <p className="text-red-500 text-sm">
              {error?.message || "An error occurred"}
            </p>
          </div>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center mb-4 lg:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg px-4 lg:px-6 py-3 lg:py-4 shadow-sm border w-full">
              <h1 className="text-xl lg:text-2xl font-bold text-[#955aa4] flex items-center gap-2">
                <MdSchool className="text-xl lg:text-2xl" />
                <span className="hidden sm:inline">All Schools</span>
                <span className="sm:hidden">Schools</span>
                <span>· {schoolsList.length}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {Array.isArray(schoolsList) && schoolsList?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MdSchool className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                No schools found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Schools will appear here once they are added
              </p>
            </div>
          ) : (
            schoolsList?.map((school) => (
              <Link
                key={school.id}
                href={`${ROUTES.curator.schools}/${school.id}`}
              >
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 hover:scale-[1.02]">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                      {school.logo ? (
                        <Image
                          width={48}
                          height={48}
                          src={school.logo}
                          alt={school.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <MdSchool className="text-white text-xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1">
                        {school.name}
                      </h3>
                      {school.nickname && (
                        <p className="text-gray-500 text-xs lg:text-sm truncate font-medium mb-1">
                          {school.nickname}
                        </p>
                      )}
                      <p className="text-[#955aa4] text-xs lg:text-sm font-medium">
                        {school.type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Providers:</span>
                      <span className="font-semibold text-gray-900">
                        {school.totalProviders}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Partners:</span>
                      <span className="font-semibold text-gray-900">
                        {school.totalPartners}
                      </span>
                    </div>
                    {school.campuses && school.campuses.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Campuses:</span>
                        <span className="font-semibold text-gray-900">
                          {school.campuses.length}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <div className="px-4 py-2 rounded-full font-semibold text-sm shadow-sm bg-green-100 text-green-700 border border-green-200">
                      Active
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </WidthConstraint>
  );
}

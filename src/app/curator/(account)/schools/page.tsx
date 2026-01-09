"use client";

import React, { useState, useMemo } from "react";
import { MdSchool, MdLocationOn } from "react-icons/md";
import { FiCalendar, FiSearch } from "react-icons/fi";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";
import { School } from "@/types/school";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useSchools } from "@/hooks/queries/useSchoolsQuery";

type FilterType = "all" | "JHS" | "SHS" | "NMTC" | "University";

const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "NMTC", value: "NMTC" },
  { label: "University", value: "University" },
];

export default function SchoolsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allSchools = [], isLoading, isError } = useSchools();

  const schoolsList = useMemo(() => {
    let filtered = activeFilter === "all"
      ? allSchools
      : allSchools.filter((school) => school.type === activeFilter);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((school) => {
        const nameMatch = school.name?.toLowerCase().includes(query);
        const nicknameMatch = school.nickname?.toLowerCase().includes(query);
        const typeMatch = school.type?.toLowerCase().includes(query);
        const campusesMatch = school.campuses?.some(campus => 
          campus.toLowerCase().includes(query)
        );
        return nameMatch || nicknameMatch || typeMatch || campusesMatch;
      });
    }

    return filtered;
  }, [allSchools, activeFilter, searchQuery]);

 

  if (isError) {
    return (
      <WidthConstraint>
        <div className="flex flex-col gap-8 p-8">
          <div className="text-center text-red-500">Failed to load schools</div>
        </div>
      </WidthConstraint>
    );
  }

  return (
    <WidthConstraint>
      <div className="flex flex-col gap-8 p-8">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#955aa4] flex items-center gap-3">
                <MdSchool className="text-4xl" />
                Schools
                <span className="text-2xl text-gray-400 font-medium">
                  ({schoolsList.length})
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Manage and view all registered educational institutions.
              </p>
            </div>
          </div>



          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools by name, nickname, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4] transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === filter.value
                    ? "bg-[#955aa4] text-white shadow-md shadow-[#955aa4]/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

     
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col relative overflow-hidden animate-pulse"
              >
                <div className="flex items-start gap-4">
                  {/* Skeleton Logo */}
                  <div className="w-20 h-20 rounded-2xl bg-gray-200 flex-shrink-0"></div>

                  {/* Skeleton Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Skeleton Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      

        {/* Schools Grid */}
        {!isLoading && schoolsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schoolsList.map((school: School) => (
              <div
                key={school.id}
                className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-[#955aa4]/30 transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  {/* Logo Section */}
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 p-4 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {school.logo ? (
                      <Image
                        width={80}
                        height={80}
                        src={school.logo}
                        alt={school.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdSchool className="text-gray-300 text-4xl" />
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#955aa4]/10 text-[#955aa4]">
                        {school.type}
                      </span>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(school.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2">
                      {school.name}
                    </h3>
                    {school.nickname && (
                      <p className="text-gray-500 text-sm font-medium">
                        &quot;{school.nickname}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer / Location */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    {school.campuses && Array.isArray(school.campuses) && school.campuses.length > 0 ? (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MdLocationOn className="text-[#955aa4] w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {school.campuses.join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No campus location</span>
                    )}
                  </div>

                  <Link href={`${ROUTES.curator.schools}/${school.id}`}>
                    <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#955aa4] group-hover:text-white transition-all duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && schoolsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <MdSchool className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 max-w-md">
              {activeFilter === "all"
                ? "There are no schools registered yet."
                : `There are no schools registered under the ${filterOptions.find((f) => f.value === activeFilter)?.label} category yet.`}
            </p>
          </div>
        )}
      </div>
    </WidthConstraint>
  );
}

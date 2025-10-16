"use client";

import React, { useState } from "react";
import { MdSchool } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import WidthConstraint from "@/components/ui/width-constraint";

interface School {
  id: string;
  name: string;
  nickname?: string;
  status: "Active" | "Inactive";
  lastActivity: string;
  activityType: string;
  avatar?: string;
}

export default function SchoolsPage() {
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const mockSchools: School[] = [
    {
      id: "1",
      name: "Achimota High School",
      status: "Active",
      lastActivity: "2m ago",
      activityType: "New Visit",
      avatar: "/auth/lawyer.jpg",
    },
    {
      id: "2",
      name: "Ashesi University",
      status: "Active",
      lastActivity: "2d ago",
      activityType: "New Provider",
    },
    {
      id: "3",
      name: "Korle-Bu NMTC",
      status: "Inactive",
      lastActivity: "2h ago",
      activityType: "New Screen",
      avatar: "/auth/man.jpg",
    },
    {
      id: "4",
      name: "Accra Technical Uni.",
      status: "Active",
      lastActivity: "Now",
      activityType: "New Results",
    },
    {
      id: "5",
      name: "KNUST",
      status: "Inactive",
      lastActivity: "2w ago",
      activityType: "Provider Visit",
    },
    {
      id: "6",
      name: "Achimota High School",
      status: "Active",
      lastActivity: "2m ago",
      activityType: "New Visit",
      avatar: "/auth/lawyer.jpg",
    },
  ];

  const [schools] = useState<School[]>(mockSchools);

  const filteredSchools = schools.filter((school) => {
    if (filter === "All") return true;
    return school.status.toLowerCase() === filter.toLowerCase();
  });

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
                <span>· {filteredSchools.length}</span>
              </h1>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="relative ml-2 flex-shrink-0">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 justify-between min-w-[120px]"
            >
              <span>{filter}</span>
              <FiChevronDown
                className="w-4 h-4 transition-transform duration-200"
                style={{
                  transform: showFilterDropdown
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => {
                    setFilter("All");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">All</span>
                  {filter === "All" && (
                    <span className="text-[#955aa4] text-lg">✓</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFilter("Active");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Active</span>
                </button>
                <button
                  onClick={() => {
                    setFilter("Inactive");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Inactive</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#955aa4]/50 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#955aa4] to-[#7C4DFF] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                  {school.avatar ? (
                    <Image
                      width={48}
                      height={48}
                      src={school.avatar}
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
                  <p className="text-orange-500 text-xs lg:text-sm truncate font-medium">
                    {school.activityType} • {school.lastActivity}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm ${
                    school.status === "Active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {school.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidthConstraint>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import JustGoHealthBlack from "@/components/logo-black";
import {
  FiFileText,
  FiPlus,
  FiLogOut,
  FiArrowRight,
  FiMenu,
} from "react-icons/fi";
import { MdSchool, MdHealthAndSafety } from "react-icons/md";
import { cn } from "@/lib/utils";

interface SidebarProps {
  schoolCount: number;
  providerCount: number;
  onCreateClick: () => void;
  onLogout: () => void;
}

export const CuratorSidebar = ({
  schoolCount,
  providerCount,
  onCreateClick,
  onLogout,
}: SidebarProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-[#955aa4] p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-[#955aa4] font-bold text-lg">JustGo Health</h1>
        <div className="w-10" /> {/* Spacer for center alignment */}
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* White Sidebar */}
      <div
        className={cn(
          "w-64 bg-white border-r border-gray-200",
          "flex flex-col h-screen shadow-lg z-40",
          "fixed md:static",
          "transition-transform duration-300 ease-in-out",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="transform hover:scale-105 transition-transform duration-300 justify-center flex">
            <JustGoHealthBlack />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-3">
            <Link
              href="/curator/schools"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "block px-4 py-3 font-bold transition-all duration-200 rounded-lg",
                isActive("/curator/schools")
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#955aa4]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdSchool className="text-xl" />
                  <span className="text-lg">Schools</span>
                </div>
                <span className={cn(
                  "text-sm px-2 py-1 rounded-full",
                  isActive("/curator/schools")
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                )}>
                  {schoolCount}
                </span>
              </div>
            </Link>
            <Link
              href="/curator/providers"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "block px-4 py-3 font-bold transition-all duration-200 rounded-lg",
                isActive("/curator/providers")
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#955aa4]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdHealthAndSafety className="text-xl" />
                  <span className="text-lg">Providers</span>
                </div>
                <span className={cn(
                  "text-sm px-2 py-1 rounded-full",
                  isActive("/curator/providers")
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                )}>
                  {providerCount}
                </span>
              </div>
            </Link>
            <Link
              href="/curator/pages"
              onClick={() => setIsMobileSidebarOpen(false)}
              className={cn(
                "block px-4 py-3 font-bold transition-all duration-200 rounded-lg",
                isActive("/curator/pages")
                  ? "bg-[#955aa4] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#955aa4]"
              )}
            >
              <div className="flex items-center gap-3">
                <FiFileText className="text-xl" />
                <span className="text-lg">Pages</span>
              </div>
            </Link>
            <button
              onClick={() => {
                onCreateClick();
                setIsMobileSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-100 hover:text-[#955aa4] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <FiPlus className="text-xl" />
                <span className="text-lg">Create</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogoutClick}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <FiLogOut className="text-xl" />
                <span className="text-lg">Logout</span>
              </div>
              <FiArrowRight className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>

      {/* Clean Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
              Logout Confirmation
            </h2>
            <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onLogout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

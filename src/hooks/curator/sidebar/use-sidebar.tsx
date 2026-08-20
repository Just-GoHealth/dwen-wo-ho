"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { FiFileText, FiPlus } from "react-icons/fi";
import type { Route } from "next";
import { ROUTES } from "@/lib/constants/infra/routes";
import {
  MdSchool,
  MdHealthAndSafety,
  MdHandshake,
  MdEmojiEvents,
} from "react-icons/md";
import { useCuratorNotification } from "@/hooks/curator/notification/use-notification";
import { NavItem } from "@/lib/types/components/curator/curator-sidebar/sidebar";
import { useCuratorSummary } from "@/hooks/queries/use-curator";

export const useCuratorSidebar = () => {
  const [isCollapsed, setIsCollapsedState] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const mounted = useHydrated();

  const { notifications, unreadCount, setIsOpen } = useCuratorNotification();
  const { data: summary } = useCuratorSummary();

  // Tracks whether the *current* collapsed state was forced by the
  // auto-collapse-on-detail-page effect below, as opposed to the user's own
  // toggle — so returning to a main page only restores what the effect
  // itself changed, never overriding a collapse the user chose deliberately.
  const autoCollapsedRef = useRef(false);

  const setIsCollapsed = (value: boolean) => {
    autoCollapsedRef.current = false;
    setIsCollapsedState(value);
  };

  // Auto-collapse sidebar on non-main pages (e.g. school details) to give
  // them more room — but never force it back open on main pages if the user
  // had already collapsed it themselves.
  useEffect(() => {
    const mainPages: string[] = [
      ROUTES.curator.dashboard,
      ROUTES.curator.create,
      ROUTES.curator.providers,
      ROUTES.curator.partners,
      ROUTES.curator.pages,
      ROUTES.curator.competitions,
    ];

    const isMainPage = mainPages.includes(pathname);

    if (!isMainPage) {
      setIsCollapsedState((prev) => {
        if (!prev) autoCollapsedRef.current = true;
        return true;
      });
    } else if (autoCollapsedRef.current) {
      autoCollapsedRef.current = false;
      setIsCollapsedState(false);
    }
  }, [pathname]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileSidebarOpen(false);
  };

  const navItems: NavItem[] = [
    {
      href: ROUTES.curator.schools,
      label: "Schools",
      icon: <MdSchool className="shrink-0 text-lg" />,
      count: summary?.schoolCount,
    },
    {
      href: ROUTES.curator.providers,
      label: "Providers",
      icon: <MdHealthAndSafety className="shrink-0 text-lg" />,
      count: summary?.providerCount,
    },
    {
      href: ROUTES.curator.partners,
      label: "Partners",
      icon: <MdHandshake className="shrink-0 text-lg" />,
      count: summary?.partnerCount,
    },
    {
      href: ROUTES.curator.pages,
      label: "Pages",
      icon: <FiFileText className="shrink-0 text-lg" />,
    },
    {
      href: ROUTES.curator.competitions as Route,
      label: "Competitions",
      icon: <MdEmojiEvents className="shrink-0 text-lg" />,
    },
    {
      href: ROUTES.curator.create as Route,
      label: "Create",
      icon: <FiPlus className="shrink-0 text-lg" />,
    },
  ];

  return {
    isCollapsed,
    setIsCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    showLogoutModal,
    setShowLogoutModal,
    pathname,
    theme,
    mounted,
    notifications,
    unreadCount,
    navItems,
    handleLogoutClick,
    setIsOpen: setIsOpen,
  };
};

"use client";

import { useState, useEffect } from "react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const mounted = useHydrated();

  const { notifications, unreadCount, setIsOpen } = useCuratorNotification();
  const { data: summary } = useCuratorSummary();

  // Auto-collapse sidebar on non-main pages
  useEffect(() => {
    const mainPages: string[] = [
      ROUTES.curator.dashboard,
      ROUTES.curator.create,
      ROUTES.curator.schools,
      ROUTES.curator.providers,
      ROUTES.curator.partners,
      ROUTES.curator.pages,
      ROUTES.curator.competitions,
    ];

    const isMainPage = mainPages.includes(pathname);

    if (!isMainPage) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
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

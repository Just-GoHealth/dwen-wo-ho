"use client";
import { m, AnimatePresence } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { SidebarProps } from "@/lib/types/components/curator/curator-sidebar/sidebar";
import { SidebarContent } from "./sidebar-content";
import { MobileHeader } from "./mobile-header";
import { useCuratorSidebar } from "@/hooks/curator/sidebar/use-sidebar";
import {
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from "@/lib/constants/components/curator/curator-sidebar/layout";

export const CuratorSidebar = (props: SidebarProps) => {
  const {
    isCollapsed,
    setIsCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    showLogoutModal,
    setShowLogoutModal,
    theme,
    mounted,
    unreadCount,
    navItems,
    handleLogoutClick,
    pathname,
    setIsOpen,
  } = useCuratorSidebar();

  const { onLogout } = props;

  const sidebarContentProps = {
    navItems,
    pathname,
    mounted,
    unreadCount,
    setIsOpen: setIsOpen,
    onToggleCollapse: () => setIsCollapsed(!isCollapsed),
    onLogoutClick: handleLogoutClick,
    onMobileClose: () => setIsMobileSidebarOpen(false),
  };

  return (
    <TooltipProvider>
      {/* Mobile Header */}
      <MobileHeader
        isOpen={isMobileSidebarOpen}
        onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        theme={theme}
        mounted={mounted}
        unreadCount={unreadCount}
        setIsOpen={setIsOpen}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <m.aside
        initial={false}
        animate={{
          width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-app-gradient bg-card border-border/60 relative hidden h-screen shrink-0 flex-col overflow-hidden border-r md:flex"
      >
        <SidebarContent {...sidebarContentProps} collapsed={isCollapsed} />
      </m.aside>

      {/* Mobile Sidebar (drawer) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <m.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-app-gradient bg-card border-border/60 fixed top-14 bottom-0 left-0 z-40 w-72 overflow-hidden border-r shadow-2xl md:hidden"
          >
            <SidebarContent {...sidebarContentProps} collapsed={false} />
          </m.aside>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          onLogout();
          setShowLogoutModal(false);
        }}
        title="Logout Confirmation"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        variant="danger"
      />
    </TooltipProvider>
  );
};

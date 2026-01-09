import { ROUTES } from "@/constants/routes";

let isHandlingAuthError = false;

export const handleTokenExpiration = () => {
  if (isHandlingAuthError) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  isHandlingAuthError = true;

  localStorage.removeItem("token");
  localStorage.removeItem("curatorToken");

  const currentPath = window.location.pathname;
  const isAuthPage = 
    currentPath.includes("/signin") ||
    currentPath.includes("/signup") ||
    currentPath.includes("/auth") ||
    currentPath.includes("/check-email") ||
    currentPath.includes("/verify") ||
    currentPath.includes("/new-password") ||
    currentPath.includes("/recover");

  if (!isAuthPage) {
    window.location.href = ROUTES.provider.auth;
  }

  setTimeout(() => {
    isHandlingAuthError = false;
  }, 1000);
};

export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};

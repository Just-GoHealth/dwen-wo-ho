import { ROUTES } from "@/lib/constants/infra/routes";
import { getStoredUserType } from "@/lib/utils/auth/get-user-type";

type SignInUserType = ReturnType<typeof getStoredUserType>;

/**
 * Sign-in screen for a user type: curators have their own, everyone else
 * uses the provider screen (LOG-02).
 */
export const getSignInRoute = (
  userType: SignInUserType = getStoredUserType(),
): string =>
  userType === "curator" ? ROUTES.curator.auth : ROUTES.provider.auth;

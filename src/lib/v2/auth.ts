import { http, signOut } from "./http";
import type {
  ClaimRequest,
  CodeRequest,
  LookupRequest,
  LookupResponse,
  Me,
  PasswordRequest,
  ProviderSignUpRequest,
  RecoveryRequest,
  RoleCategory,
  SignInRequest,
  VerifyRequest,
  VerifyResponse,
} from "./types";

/** `/auth/*` and the public role-category list (contract section 2). */
export const authApi = {
  csrf: () => http.get<void>("/auth/csrf"),
  lookup: (body: LookupRequest) =>
    http.post<LookupResponse>("/auth/lookup", body),
  signIn: (body: SignInRequest) => http.post<Me>("/auth/sign-in", body),
  providerSignUp: (body: ProviderSignUpRequest) =>
    http.post<void>("/auth/provider/sign-up", body),
  verify: (body: VerifyRequest) =>
    http.post<VerifyResponse>("/auth/verify", body),
  /** Sends a new code; the old one stops working. Always 202. */
  sendCode: (body: CodeRequest) => http.post<void>("/auth/codes", body),
  recovery: (body: RecoveryRequest) => http.post<void>("/auth/recovery", body),
  claim: (body: ClaimRequest) => http.post<void>("/auth/claim", body),
  setPassword: (body: PasswordRequest) => http.post<Me>("/auth/password", body),
  me: () => http.get<Me>("/auth/me"),
  signOut,
  roleCategories: () => http.get<RoleCategory[]>("/role-categories"),
};

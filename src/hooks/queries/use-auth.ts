import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/v2/auth";
import { performLogout } from "@/lib/auth/session";
import { setUserType } from "@/lib/utils/auth/get-user-type";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import type { Me } from "@/lib/v2/types";

/** Records the UI hint for which workspace this browser is signed in to. */
export const rememberSignedIn = (me: Me) => {
  setUserType(me.role === "CURATOR" ? "curator" : "provider");
};

/**
 * Auth mutations (backend v2 `/auth/*`). Every call carries `role`; the
 * session itself is the backend's HttpOnly cookies.
 */
export const useAuthQuery = () => {
  const queryClient = useQueryClient();

  const onSignedIn = (me: Me) => {
    rememberSignedIn(me);
    queryClient.setQueryData(QUERY_KEYS.v2.me, me);
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.v2.providerMe });
  };

  const lookupMutation = useMutation({
    mutationKey: ["auth", "lookup"],
    mutationFn: authApi.lookup,
  });

  const signInMutation = useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: authApi.signIn,
    onSuccess: onSignedIn,
  });

  const providerSignUpMutation = useMutation({
    mutationKey: ["auth", "provider-sign-up"],
    mutationFn: authApi.providerSignUp,
  });

  const verifyMutation = useMutation({
    mutationKey: ["auth", "verify"],
    mutationFn: authApi.verify,
    onSuccess: (res) => {
      if (res.me) onSignedIn(res.me);
    },
  });

  const sendCodeMutation = useMutation({
    mutationKey: ["auth", "codes"],
    mutationFn: authApi.sendCode,
  });

  const recoveryMutation = useMutation({
    mutationKey: ["auth", "recovery"],
    mutationFn: authApi.recovery,
  });

  const claimMutation = useMutation({
    mutationKey: ["auth", "claim"],
    mutationFn: authApi.claim,
  });

  const setPasswordMutation = useMutation({
    mutationKey: ["auth", "password"],
    mutationFn: authApi.setPassword,
    onSuccess: onSignedIn,
  });

  const logout = (redirectTo?: string) => {
    void performLogout(queryClient, redirectTo);
  };

  return {
    lookupMutation,
    signInMutation,
    providerSignUpMutation,
    verifyMutation,
    sendCodeMutation,
    recoveryMutation,
    claimMutation,
    setPasswordMutation,
    logout,
  };
};

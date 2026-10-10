import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/shared/auth";
import { performLogout } from "@/lib/auth/session";
import { QUERY_KEYS } from "@/lib/constants/infra/query-keys";
import { toast } from "sonner";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";

// After any auth mutation, cached auth-scoped data (profile, session) may be
// stale, so refresh it. invalidateQueries only refetches active queries.
const authQueryKey = { queryKey: [QUERY_KEYS.auth] };

export const useAuthQuery = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: authService.login,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const signupMutation = useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: authService.signup,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationKey: ["auth", "verifyEmail"],
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const checkEmailMutation = useMutation({
    mutationKey: ["auth", "checkEmail"],
    mutationFn: authService.checkEmail,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const resendSignupVerificationMutation = useMutation({
    mutationKey: ["auth", "resendSignupVerification"],
    mutationFn: authService.resendSignupVerification,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
      toast.success(SIGN_UP_TEXTS.toasts.resend);
    },
  });

  const resendPasswordResetVerificationMutation = useMutation({
    mutationKey: ["auth", "resendPasswordResetVerification"],
    mutationFn: authService.resendPasswordResetVerification,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
      toast.success(SIGN_UP_TEXTS.toasts.resendPasswordReset);
    },
  });

  const recoverAccountMutation = useMutation({
    mutationKey: ["auth", "recoverAccount"],
    mutationFn: authService.recoverAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const submitRecoveryCodeMutation = useMutation({
    mutationKey: ["auth", "submitRecoveryCode"],
    mutationFn: authService.submitAccountRecoveryCode,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["auth", "resetPassword"],
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const addPhotoMutation = useMutation({
    mutationKey: ["auth", "addPhoto"],
    mutationFn: authService.addPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const updateProfileMutation = useMutation({
    mutationKey: ["auth", "updateProfile"],
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const addSpecialtyMutation = useMutation({
    mutationKey: ["auth", "addSpecialty"],
    mutationFn: authService.addSpecialty,
    onSuccess: () => {
      queryClient.invalidateQueries(authQueryKey);
    },
  });

  const logout = (redirectTo?: string) => {
    performLogout(queryClient, redirectTo);
  };

  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    checkEmailMutation,
    resendSignupVerificationMutation,
    recoverAccountMutation,
    submitRecoveryCodeMutation,
    resetPasswordMutation,
    addPhotoMutation,
    updateProfileMutation,
    addSpecialtyMutation,
    logout,
    resendPasswordResetVerificationMutation,
  };
};

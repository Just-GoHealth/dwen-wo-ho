import { axiosInstance, checkResponse } from "@/configs/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";

const useAuthQuery = () => {
  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: { email: string; password: string }) => login(data),
  });

  const signupMutation = useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: (data: { email: string; password: string; fullName: string }) =>
      signup(data),
  });

  const verifyEmailMutation = useMutation({
    mutationKey: ["auth", "verifyEmail"],
    mutationFn: (data: { email: string }) => verifyEmail(data),
  });

  const checkEmailMutation = useMutation({
    mutationKey: ["auth", "checkEmail"],
    mutationFn: (data: { email: string }) => checkEmail(data),
  });

  const recoverAccountMutation = useMutation({
    mutationKey: ["auth", "recoverAccount"],
    mutationFn: (data: { email: string }) => recoverAccount(data),
  });

  const submitRecoveryCodeMutation = useMutation({
    mutationKey: ["auth", "submitRecoveryCode"],
    mutationFn: (data: { code: string; email: string }) =>
      submitAccountRecoveryCode(data),
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["auth", "resetPassword"],
    mutationFn: (data: { password: string; confirmPassword: string }) =>
      resetPassword(data),
  });

  async function login(data: { email: string; password: string }) {
    return axiosInstance.post(ENDPOINTS.login, data).then((response) => {
      return checkResponse(response, 200);
    });
  }

  async function signup(data: {
    email: string;
    password: string;
    fullName: string;
  }) {
    return axiosInstance.post(ENDPOINTS.signup, data).then((response) => {
      return checkResponse(response, 200);
    });
  }

  async function checkEmail(data: { email: string }) {
    return axiosInstance.post(ENDPOINTS.verifyEmail, data).then((response) => {
      return checkResponse(response, 200);
    });
  }

  async function verifyEmail(data: { email: string }) {
    return axiosInstance.post(ENDPOINTS.verifyEmail, data).then((response) => {
      return checkResponse(response, 200);
    });
  }

  async function recoverAccount(data: { email: string }) {
    return axiosInstance
      .post(ENDPOINTS.recoverAccount, data)
      .then((response) => {
        return checkResponse(response, 200);
      });
  }

  async function submitAccountRecoveryCode(data: {
    code: string;
    email: string;
  }) {
    return axiosInstance
      .post(ENDPOINTS.submitAccountRecoveryCode, data)
      .then((response) => {
        return checkResponse(response, 200);
      });
  }

  async function resetPassword(data: {
    password: string;
    confirmPassword: string;
  }) {
    return axiosInstance
      .post(ENDPOINTS.resetPassword, data)
      .then((response) => {
        return checkResponse(response, 200);
      });
  }

  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    checkEmailMutation,
    recoverAccountMutation,
    submitRecoveryCodeMutation,
    resetPasswordMutation,
  };
};

export default useAuthQuery;

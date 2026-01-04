import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";
import { axiosFormData, checkResponse } from "@/configs/axiosInstance";

const useAuthQuery = () => {
  const loginMutation = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: { email: string; password: string }) => login(data),
  });

  const signupMutation = useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: (data: {
      email: string;
      password: string;
      fullName: string;
      professionalTitle: string;
    }) => signup(data),
  });

  const verifyEmailMutation = useMutation({
    mutationKey: ["auth", "verifyEmail"],
    mutationFn: (data: { email: string; code: string }) => verifyEmail(data),
  });

  const checkEmailMutation = useMutation({
    mutationKey: ["auth", "checkEmail"],
    mutationFn: (data: { email: string }) => checkEmail(data),
  });

  const sendVerificationEmailMutation = useMutation({
    mutationKey: ["auth", "sendVerificationEmail"],
    mutationFn: (data: { email: string }) => sendVerificationEmail(data),
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

  const addPhotoMutation = useMutation({
    mutationKey: ["auth", "addPhoto"],
    mutationFn: (data: FormData) => addPhoto(data),
  });

  const updateProfileMutation = useMutation({
    mutationKey: ["auth", "updateProfile"],
    mutationFn: (data: {
      [key: string]: unknown;
    }) => updateProfile(data),
  });

  const addSpecialtyMutation = useMutation({
    mutationKey: ["auth", "addSpecialty"],
    mutationFn: (data: { specialty: string }) => addSpecialty(data),
  });

  async function login(data: { email: string; password: string }) {
    console.log("🔑 login() called");
    console.log("Request data:", data);

    const result = await api(ENDPOINTS.login, { method: "POST", body: JSON.stringify(data) });

    console.log("🔑 login() result:", result);
    return result;
  }

  async function signup(data: {
    email: string;
    password: string;
    fullName: string;
    professionalTitle: string;
  }) {
    console.log("🔐 signup() called");
    console.log("Endpoint:", ENDPOINTS.signup);
    console.log("Request data:", {
      email: data.email,
      password: "***REDACTED***",
      fullName: data.fullName,
      professionalTitle: data.professionalTitle,
    });

    const result = await api(ENDPOINTS.signup, {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("🔐 signup() result:", result);
    return result;
  }

  async function checkEmail(data: { email: string }) {
    return api(ENDPOINTS.checkEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function verifyEmail(data: { email: string; code: string }) {
    console.log("✉️ verifyEmail() called");
    console.log("Endpoint:", ENDPOINTS.verifyEmail);
    console.log("Request data:", data);

    const result = await api(ENDPOINTS.verifyEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("✉️ verifyEmail() result:", result);
    return result;
  }

  async function sendVerificationEmail(data: { email: string }) {
    console.log("📧 sendVerificationEmail called with:", data);
    console.log("Endpoint:", ENDPOINTS.sendVerificationEmail);

    const result = await api(ENDPOINTS.sendVerificationEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log("📧 sendVerificationEmail result:", result);
    return result;
  }

  async function recoverAccount(data: { email: string }) {
    return api(ENDPOINTS.recoverAccount, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function submitAccountRecoveryCode(data: {
    code: string;
    email: string;
  }) {
    return api(ENDPOINTS.submitAccountRecoveryCode, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function resetPassword(data: {
    password: string;
    confirmPassword: string;
  }) {
    return api(ENDPOINTS.resetPassword, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function addPhoto(data: FormData) {
    const response = await axiosFormData.post(ENDPOINTS.addPhoto, data);
    return checkResponse(response, 200);
  }

  async function updateProfile(data: {
    [key: string]: unknown;
  }) {
    return api(ENDPOINTS.updateProfile, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function addSpecialty(data: { specialty: string }) {
    return api(ENDPOINTS.addSpecialty, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    checkEmailMutation,
    sendVerificationEmailMutation,
    recoverAccountMutation,
    submitRecoveryCodeMutation,
    resetPasswordMutation,
    addPhotoMutation,
    updateProfileMutation,
    addSpecialtyMutation,
  };
};

export default useAuthQuery;

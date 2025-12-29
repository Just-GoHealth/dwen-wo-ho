import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";

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
      [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }) => updateProfile(data),
  });

  const addSpecialtyMutation = useMutation({
    mutationKey: ["auth", "addSpecialty"],
    mutationFn: (data: { specialty: string }) => addSpecialty(data),
  });

  async function login(data: { email: string; password: string }) {
    return api(ENDPOINTS.login, { method: "POST", body: JSON.stringify(data) });
  }

  async function signup(data: {
    email: string;
    password: string;
    fullName: string;
    professionalTitle: string;
  }) {
    return api(ENDPOINTS.signup, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function checkEmail(data: { email: string }) {
    return api(ENDPOINTS.checkEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async function verifyEmail(data: { email: string; code: string }) {
    return api(ENDPOINTS.verifyEmail, {
      method: "POST",
      body: JSON.stringify(data),
    });
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
    return api(ENDPOINTS.addPhoto, { method: "POST", body: data });
  }

  async function updateProfile(data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
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
    recoverAccountMutation,
    submitRecoveryCodeMutation,
    resetPasswordMutation,
    addPhotoMutation,
    updateProfileMutation,
    addSpecialtyMutation,
  };
};

export default useAuthQuery;

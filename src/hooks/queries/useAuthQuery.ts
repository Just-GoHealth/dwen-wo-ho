import { axiosInstance, checkResponse } from "@/configs/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const useAuthQuery = () => {
  const loginMutation = useMutation({
    mutationFn: login,
    onError: (error: AxiosError) => {
      console.log(error);
    },
    onSuccess: (success) => {
      console.log(success);
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onError: (error: AxiosError) => {
      console.log(error);
    },
    onSuccess: (success) => {
      console.log(success);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onError: (error: AxiosError) => {
      console.log(error);
    },
    onSuccess: (success) => {
      console.log(success);
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: checkEmail,
    onError: (error: AxiosError) => {
      console.log(error);
    },
    onSuccess: (success) => {
      console.log(success);
    },
  });

  async function login(data: unknown) {
    return axiosInstance.post(ENDPOINTS.login, data).then((response) => {
      return checkResponse(response, 200);
    });
  }

  async function signup(data: unknown) {
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

  return {
    loginMutation,
    signupMutation,
    verifyEmailMutation,
    checkEmailMutation,
  };
};

export default useAuthQuery;

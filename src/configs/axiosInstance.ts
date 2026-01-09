import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { handleTokenExpiration, isAuthError } from "@/lib/auth-utils";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://justgo.up.railway.app";

const PUBLIC_ENDPOINTS = [
  "/api/v1/auth/check-email",
  "/api/v1/auth/sign-in",
  "/api/v1/auth/create-account",
  "/api/v1/auth/submit-signup-code",
  "/api/v1/email/send-verification",
  "/api/v1/auth/recover-account",
  "/api/v1/auth/submit-account-recovery-code",
  "/api/v1/auth/reset-password",
];

const isPublicEndpoint = (url: string): boolean => {
  return PUBLIC_ENDPOINTS.some((path) => url.includes(path));
};

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const axiosFormData = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("curatorToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for form data - Add auth token
axiosFormData.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("curatorToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for axiosInstance - Handle token expiration
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const config = error.config as InternalAxiosRequestConfig;

      if (isAuthError(status) && config && !isPublicEndpoint(config.url || "")) {
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please log in again.");
          handleTokenExpiration();
        }
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor for axiosFormData - Handle token expiration
axiosFormData.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const config = error.config as InternalAxiosRequestConfig;

      if (isAuthError(status) && config && !isPublicEndpoint(config.url || "")) {
        if (typeof window !== "undefined") {
          toast.error("Your session has expired. Please log in again.");
          handleTokenExpiration();
        }
      }
    }

    return Promise.reject(error);
  }
);

export const checkResponse = (response: AxiosResponse, statusCode: number) => {
  if (!!response && response.status === statusCode) {
    return response.data;
  }
};

export const checkError = (error: AxiosError): string => {
  const response = error.response as AxiosResponse;
  if (response?.data && response.data?.message) {
    return response?.data?.message;
  }
  return "There was an issue processing your request";
};

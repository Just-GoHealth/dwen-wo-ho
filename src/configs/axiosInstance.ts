import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://justgo.up.railway.app";

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
    // Get token from localStorage
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

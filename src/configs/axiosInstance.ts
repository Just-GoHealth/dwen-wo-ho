import axios, { AxiosError, AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://justgo-api.up.railway.app",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const axiosFormData = axios.create({
  baseURL: "https://justgo-api.up.railway.app",
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
});

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
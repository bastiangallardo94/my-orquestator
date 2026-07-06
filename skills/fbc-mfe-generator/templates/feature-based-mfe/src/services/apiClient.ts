import { ENV } from "../constants/environment.config";
import store from "@infrastructure/store/store";
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ApiError, NotFoundError, UnauthorizedError, ValidationError } from "../types/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

//Add request interceptor for auth.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState()
    const token = state.authentication?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error)
  }
);

// Add response interceptor to catch different errors.
// Response interceptor to transform errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { response, request, message } = error;

    if (response) {
      const { status } = response;
      const data = response.data as Record<string, any> || {};

      switch (status) {
        case 400:
          throw new ValidationError(data.message || 'Invalid request', data);
        case 401:
          throw new UnauthorizedError(data.message || 'Please log in again', data);
        case 403:
          throw new ApiError(data.message || 'You do not have permission', status, data);
        case 404:
          throw new NotFoundError(data.message || 'Resource not found', data);
        case 500:
          throw new ApiError(data.message || 'Server error', status, data);
        default:
          throw new ApiError(data.message || `Request failed with status ${status}`, status, data);
      }
    } else if (request) {
      throw new ApiError('Network error - no response received');
    } else {
      throw new ApiError(`Request error: ${message}`);
    }
  }
);

export default apiClient;

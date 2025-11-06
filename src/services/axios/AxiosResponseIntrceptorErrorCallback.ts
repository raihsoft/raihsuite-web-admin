import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useSessionUser, useToken } from "@/store/authStore";
import appConfig from "@/configs/app.config";

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

const unauthorizedCodes = [401, 419, 440];
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// 🔁 Process queued requests once refresh completes
const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

const AxiosResponseIntrceptorErrorCallback = async (
  error: AxiosError
): Promise<any> => {
  const { response, config } = error;
  const { setToken } = useToken();

  if (!response || !config) {
    return Promise.reject(error);
  }

  // 🔐 Handle unauthorized or expired access token
  if (unauthorizedCodes.includes(response.status)) {
    const originalRequest = config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (originalRequest._retry) {
      // Already retried once, avoid infinite loop
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue multiple failed requests until refresh finishes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers)
            originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token found");

      // 🔄 Call Django's refresh endpoint
      const res = await axios.post(
        `${appConfig.apiPrefix}/token/refresh/`,
        { refresh: refreshToken }
      );

      const newAccess = res.data.access;
      localStorage.setItem("access_token", newAccess);

      // Update global state
      setToken(newAccess);
      useSessionUser.getState().setSessionSignedIn(true);

      // Retry queued requests
      processQueue(null, newAccess);
      isRefreshing = false;

      // Retry the original request with new access token
      if (originalRequest.headers)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return axios(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      processQueue(refreshError, null);
      isRefreshing = false;

      // Force logout
      setToken("");
      useSessionUser.getState().setUser({});
      useSessionUser.getState().setSessionSignedIn(false);

      return Promise.reject(refreshError);
    }
  }

  // If not unauthorized, return the error normally
  return Promise.reject(error);
};

export default AxiosResponseIntrceptorErrorCallback;

import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useSessionUser, useToken } from "@/store/authStore";
import AxiosBase from "./AxiosBase";

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

// All status codes that mean "unauthorized"
const unauthorizedCodes = [401, 419, 440];

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// 🔁 Retry all queued requests after refresh finishes
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });
  failedQueue = [];
};

const AxiosResponseIntrceptorErrorCallback = async (error: AxiosError) => {
  const { response, config } = error;

  if (!response || !config) return Promise.reject(error);

  const originalRequest = config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  const { setToken } = useToken();

  // =========================================================
  // 🔥 TOKEN EXPIRED / UNAUTHORIZED
  // =========================================================
  if (
    (response.data as any)?.code === "token_not_valid" ||
    unauthorizedCodes.includes(response.status)
  ) {
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.log("❌ No refresh token → force logout.");
      logoutUser();
      return Promise.reject(error);
    }

    // 🔁 If another refresh request is already in progress → queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers)
            originalRequest.headers.Authorization = `Bearer ${token}`;

          return AxiosBase(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // =========================================================
      // 🔄 CALL REFRESH TOKEN API
      // (Django SimpleJWT default endpoint)
      // =========================================================
      const res = await AxiosBase.post("/accounts/refresh/", {
        refresh: refreshToken,
      });

      const newAccess = (res.data as any).access;

      // Save new access token
      localStorage.setItem("access_token", newAccess);
      setToken(newAccess);

      useSessionUser.getState().setSessionSignedIn(true);

      // Retry queued requests
      processQueue(null, newAccess);
      isRefreshing = false;

      // Retry the failed request
      if (originalRequest.headers)
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return AxiosBase(originalRequest);
    } catch (refreshError) {
      console.error("❌ Refresh failed → logging out...", refreshError);

      processQueue(refreshError, null);
      isRefreshing = false;

      logoutUser();

      return Promise.reject(refreshError);
    }
  }

  // not token issue → forward error
  return Promise.reject(error);
};

// =========================================================
// 🔴 Common logout handler
// =========================================================
const logoutUser = () => {
  const { setToken } = useToken();

  setToken("");
  useSessionUser.getState().setUser({});
  useSessionUser.getState().setSessionSignedIn(false);

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
};

export default AxiosResponseIntrceptorErrorCallback;

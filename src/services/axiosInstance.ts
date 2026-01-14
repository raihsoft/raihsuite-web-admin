// import axios from "axios";

// // --- Get CSRF cookie ---
// function getCookie(name: string) {
//   if (typeof document === "undefined") return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();
//   return null;
// }

// const axiosInstance = axios.create({
//   baseURL: "https://staging-api.raihsuite.com/v1/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // --- REQUEST INTERCEPTOR ---
// axiosInstance.interceptors.request.use(
//   (config: any) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     const csrfToken = getCookie("csrftoken");
//     if (csrfToken) {
//       config.headers["X-CSRFToken"] = csrfToken;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- RESPONSE INTERCEPTOR ---
// axiosInstance.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refresh = localStorage.getItem("refresh_token");

//         // Use axios (NOT axiosInstance)
//         const res = await axios.post(
//           "/api/token/refresh/",
//           { refresh },
//           { withCredentials: true }
//         );

//         // Save new access token
//         localStorage.setItem("access_token", res.data.access);

//         // Ensure header exists
//         originalRequest.headers = originalRequest.headers || {};
//         originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

//         // Retry failed request
//         return axiosInstance(originalRequest);

//       } catch (err) {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

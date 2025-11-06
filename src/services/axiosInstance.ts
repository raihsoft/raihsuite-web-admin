// import axios from "axios";

// function getCookie(name: string) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();
// }

// const axiosInstance = axios.create({
//   baseURL: "/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, 
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
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
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refresh = localStorage.getItem("refresh_token");
//         const res = await axios.post("/api/token/refresh/", { refresh }, {
//           withCredentials: true,
//         });

//         localStorage.setItem("access_token", res.data.access);
//         originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

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

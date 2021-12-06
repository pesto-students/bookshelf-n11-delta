import axios from "axios";
import {toast} from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     // add bearer token
//     //   const token = TokenService.getAccessToken();
//     //   if (token) {
//     //     config.headers['Authorization'] = `Bearer ${token}`;
//     //   }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config;
    if (!["/login", "/signup"].includes(originalConfig.url) && error.response) {
      // Access token expired
      if (
        error.response.status === 401 &&
        error.response.data.message === "TokenExpiredError" &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        try {
          // refresh token handling
          //   const oldRefreshToken = TokenService.getRefreshToken();
          //   const response = await AuthService.refreshToken(oldRefreshToken);
          //   const {accessToken, refreshToken} = response.data;
          //   TokenService.setAccessToken(accessToken);
          //   TokenService.setRefreshToken(refreshToken);
          return axiosInstance(originalConfig);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    toast.error(error.response.data.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";
import {toast} from "react-toastify";
import environment from "../Environment/environment";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../shared/immutables";

const axiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // add bearer token
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config;
    if (!["/login", "/signup"].includes(error.url) && error.response) {
      // Access token expired
      if (
        error.response.status === 401 &&
        error.response.data === "TokenExpiredError" &&
        !originalConfig._retry
      ) {
        originalConfig._retry = true;

        try {
          // refresh token handling
          const oldRefreshToken = localStorage.getItem(REFRESH_TOKEN);
          try {
            const response = await axios.post(
              `${environment.API_URL}/refresh`,
              {
                refresh_token: oldRefreshToken,
              }
            );
            const {token, refreshToken} = response.data;
            localStorage.setItem(ACCESS_TOKEN, token);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
          } catch (err) {
            console.log("Error occured while refreshing token: ", error);
            // do nothing
          }
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

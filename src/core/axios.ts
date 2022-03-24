import axios from 'axios';
import {toast} from 'react-toastify';
import environment from '../Environment/environment';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../shared/immutables';
import {TokenService} from '../shared/services';

const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  config => {
    // add bearer token
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const originalConfig = error.config;
    if (!['/login', '/signup'].includes(originalConfig.url) && error.response) {
      // Access token expired
      const oldRefreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (
        error.response.status === 401 &&
        !originalConfig._retry &&
        oldRefreshToken
      ) {
        originalConfig._retry = true;

        try {
          const response = await axios.post(`${environment.API_URL}/refresh`, {
            refreshToken: oldRefreshToken,
          });
          const {token, refreshToken} = response.data;
          TokenService.setTokenPayload({
            token,
            refreshToken,
          });
          return axiosInstance(originalConfig);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    const msg = error.response?.data?.message;
    if (msg) {
      toast.error(msg);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

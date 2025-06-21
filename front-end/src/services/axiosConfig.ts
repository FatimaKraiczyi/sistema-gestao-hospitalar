import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosConfig = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const refreshToken = await TokenService.getRefreshToken();
      // if (refreshToken) {
      // try {
      //   const response = await axiosConfig.post('/refreshToken', {
      //     refreshToken,
      //   });
      //   const newAccessToken = response?.data?.accessToken;
      //   setAccessToken(newAccessToken);
      //   return axiosConfig(originalRequest);
      // } catch (error) {
      //   console.error('Error refreshing token:', error);
      //   return Promise.reject(error);
      // }
      // }
    }
    return Promise.reject(error?.response?.data);
  }
);

export default axiosConfig;

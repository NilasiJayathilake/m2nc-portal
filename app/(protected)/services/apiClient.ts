import axios, { InternalAxiosRequestConfig } from 'axios';
import { apiEndpoints, isPublicEndpoint } from './apiEndPoints';
import { appRoutes } from '@/app/config/appRoutes';
import { tokenStorage } from './tokenStorage';
import type { TokenResponse } from './types';

const Timeout = {
  DEFAULT: 30_000,
} as const;

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: Timeout.DEFAULT,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isPublicEndpoint(config.url)) {
      return config;
    }
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicEndpoint(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken: string) => {
            try {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post<TokenResponse>(apiEndpoints.auth.refresh, {
          refreshToken,
        });

        const { accessToken, expiresIn } = response.data;
        tokenStorage.setAccessToken(accessToken, expiresIn);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        onRefreshed(accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshSubscribers = [];
        tokenStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = appRoutes.auth.login;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

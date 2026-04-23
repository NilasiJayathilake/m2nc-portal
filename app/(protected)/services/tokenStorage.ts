import type { UserResponse } from './types';

export const ACCESS_TOKEN_KEY = 'm2nc_access_token';
export const REFRESH_TOKEN_KEY = 'm2nc_refresh_token';
export const ACCESS_EXPIRES_AT_KEY = 'm2nc_access_expires_at';
export const USER_KEY = 'm2nc_user';

const isBrowser = () => typeof window !== 'undefined';

const getStorage = (remember: boolean) => {
  if (!isBrowser()) return null;
  return remember ? window.localStorage : window.sessionStorage;
};

const removeFromBoth = (key: string) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
  window.sessionStorage.removeItem(key);
};

export const tokenStorage = {
  isRemembered(): boolean {
    if (!isBrowser()) return false;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY) != null;
  },

  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return (
      window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ??
      window.localStorage.getItem(ACCESS_TOKEN_KEY)
    );
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return (
      window.sessionStorage.getItem(REFRESH_TOKEN_KEY) ??
      window.localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },

  setTokens(accessToken: string, refreshToken: string, remember: boolean, expiresInSeconds?: number) {
    const storage = getStorage(remember);
    if (!storage) return;

    removeFromBoth(ACCESS_TOKEN_KEY);
    removeFromBoth(REFRESH_TOKEN_KEY);
    removeFromBoth(ACCESS_EXPIRES_AT_KEY);

    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    if (typeof expiresInSeconds === 'number' && Number.isFinite(expiresInSeconds)) {
      const expiresAtMs = Date.now() + expiresInSeconds * 1000;
      storage.setItem(ACCESS_EXPIRES_AT_KEY, String(expiresAtMs));
    }
  },

  setAccessToken(accessToken: string, expiresInSeconds?: number) {
    if (!isBrowser()) return;
    const remember = tokenStorage.isRemembered();
    const storage = getStorage(remember);
    if (!storage) return;

    removeFromBoth(ACCESS_TOKEN_KEY);
    removeFromBoth(ACCESS_EXPIRES_AT_KEY);

    storage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (typeof expiresInSeconds === 'number' && Number.isFinite(expiresInSeconds)) {
      const expiresAtMs = Date.now() + expiresInSeconds * 1000;
      storage.setItem(ACCESS_EXPIRES_AT_KEY, String(expiresAtMs));
    }
  },

  getUser(): UserResponse | null {
    if (!isBrowser()) return null;
    const raw = window.sessionStorage.getItem(USER_KEY) ?? window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      return null;
    }
  },

  setUser(user: UserResponse, remember: boolean) {
    const storage = getStorage(remember);
    if (!storage) return;
    removeFromBoth(USER_KEY);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    removeFromBoth(ACCESS_TOKEN_KEY);
    removeFromBoth(REFRESH_TOKEN_KEY);
    removeFromBoth(ACCESS_EXPIRES_AT_KEY);
    removeFromBoth(USER_KEY);
  },
};

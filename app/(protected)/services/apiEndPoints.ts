export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
  }
}; 

export const publicEndpoints = [
  apiEndpoints.auth.login,
  apiEndpoints.auth.signup,
  apiEndpoints.auth.refresh,
  apiEndpoints.auth.logout,
];

export function isPublicEndpoint(url?: string): boolean {
  if (!url) return false;
  return publicEndpoints.some((endpoint) => url.includes(endpoint));
}

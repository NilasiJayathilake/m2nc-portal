export type UserRole = 'NEW_COMER' | 'FRIEND';

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface SignUpRequest {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignUpResponse {
  message: string;
  userResponse: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer' | string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer' | string;
}

import axios from 'axios';
import apiClient from './apiClient';
import { apiEndpoints } from './apiEndPoints';
import { tokenStorage } from './tokenStorage';
import type {
	LoginRequest,
	LoginResponse,
	ProblemDetail,
	RefreshTokenRequest,
	SignUpRequest,
	SignUpResponse,
	TokenResponse,
	UserResponse,
} from './types';

export type LoginOptions = {
	remember?: boolean;
};

function normalizeUser(user: UserResponse): UserResponse {
	return {
		...user,
		name: user.name ?? null,
	};
}

function getProblemDetailMessage(data: unknown): string | null {
	if (!data || typeof data !== 'object') return null;
	const problem = data as ProblemDetail;
	return problem.detail || problem.title || null;
}

function toErrorMessage(err: unknown, fallback: string): string {
	if (axios.isAxiosError(err)) {
		const messageFromProblem = getProblemDetailMessage(err.response?.data);
		if (messageFromProblem) return messageFromProblem;
		if (typeof err.message === 'string' && err.message.trim().length) return err.message;
	}
	if (err instanceof Error && err.message.trim().length) return err.message;
	return fallback;
}

export async function signUp(payload: SignUpRequest): Promise<SignUpResponse> {
	try {
		const response = await apiClient.post<SignUpResponse>(apiEndpoints.auth.signup, payload);
		return response.data;
	} catch (err) {
		throw new Error(toErrorMessage(err, 'Sign up failed'));
	}
}

export async function login(payload: LoginRequest, options: LoginOptions = {}): Promise<LoginResponse> {
	try {
		const response = await apiClient.post<LoginResponse>(apiEndpoints.auth.login, payload);
		const data = response.data;

		const remember = !!options.remember;
		tokenStorage.setTokens(data.accessToken, data.refreshToken, remember, data.expiresIn);
		tokenStorage.setUser(normalizeUser(data.user), remember);

		return data;
	} catch (err) {
		throw new Error(toErrorMessage(err, 'Login failed'));
	}
}

export async function refresh(refreshTokenOverride?: string): Promise<TokenResponse> {
	const refreshToken = refreshTokenOverride ?? tokenStorage.getRefreshToken();
	if (!refreshToken) {
		throw new Error('No refresh token available');
	}

	const payload: RefreshTokenRequest = { refreshToken };
	try {
		const response = await apiClient.post<TokenResponse>(apiEndpoints.auth.refresh, payload);

		tokenStorage.setAccessToken(response.data.accessToken, response.data.expiresIn);
		return response.data;
	} catch (err) {
		throw new Error(toErrorMessage(err, 'Token refresh failed'));
	}
}

export async function logout(): Promise<void> {
	try {
		await apiClient.post(apiEndpoints.auth.logout, {});
	} catch {
		// Backend may treat logout as idempotent or may not implement it yet.
	} finally {
		tokenStorage.clear();
	}
}

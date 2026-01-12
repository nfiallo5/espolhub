import apiClient, { setTokens, clearTokens, getRefreshToken } from './client';
import {
  ApiSuccessResponse,
  AuthTokens,
  RegisterData,
  Seller,
  RefreshTokenResponse
} from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(credentials: LoginRequest): Promise<AuthTokens> {
  const response = await apiClient.post<ApiSuccessResponse<AuthTokens>>('/login', credentials);
  const data = response.data.data;

  setTokens(data.access_token, data.refresh_token);

  return data;
}

export async function register(userData: RegisterData): Promise<Seller> {
  const response = await apiClient.post<ApiSuccessResponse<Seller>>('/sellers', userData);
  return response.data.data;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await apiClient.delete('/logout', {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
    } catch (error) {
      // Even if logout fails, clear local tokens
      console.error('Logout failed:', error);
    }
  }

  clearTokens();
}

export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.post<ApiSuccessResponse<RefreshTokenResponse>>(
    '/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  return response.data.data;
}

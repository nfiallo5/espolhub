import apiClient from './client';
import {
  ApiSuccessResponse,
  Seller,
  PublicSeller,
  Announcement,
  Faculty
} from '@/types';

export interface UpdateProfileData {
  seller: {
    name?: string;
    phone?: string;
    faculty?: Faculty;
  };
}

export async function getMyProfile(): Promise<Seller> {
  const response = await apiClient.get<ApiSuccessResponse<Seller>>('/sellers/me');
  return response.data.data;
}

export async function getPublicProfile(id: number): Promise<PublicSeller> {
  const response = await apiClient.get<ApiSuccessResponse<PublicSeller>>(`/sellers/${id}`);
  return response.data.data;
}

export async function updateProfile(data: UpdateProfileData): Promise<Seller> {
  const response = await apiClient.patch<ApiSuccessResponse<Seller>>('/sellers/me', data);
  return response.data.data;
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete('/sellers/me');
}

export async function getSellerAnnouncements(sellerId: number): Promise<Announcement[]> {
  const response = await apiClient.get<ApiSuccessResponse<Announcement[]>>(
    `/sellers/${sellerId}/announcements`
  );
  return response.data.data;
}

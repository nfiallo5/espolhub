import apiClient from './client';
import { ApiSuccessResponse, ApiMeta, Category, Announcement } from '@/types';

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<ApiSuccessResponse<Category[]>>('/categories');
  return response.data.data;
}

export async function getCategory(id: number): Promise<Category> {
  const response = await apiClient.get<ApiSuccessResponse<Category>>(`/categories/${id}`);
  return response.data.data;
}

interface CategoryAnnouncementsResponse {
  data: Announcement[];
  meta: ApiMeta;
}

export async function getCategoryAnnouncements(
  categoryId: number,
  params: { page?: number; per_page?: number } = {}
): Promise<CategoryAnnouncementsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.per_page) searchParams.append('per_page', params.per_page.toString());

  const queryString = searchParams.toString();
  const url = queryString
    ? `/categories/${categoryId}/announcements?${queryString}`
    : `/categories/${categoryId}/announcements`;

  const response = await apiClient.get<{ data: Announcement[]; meta: ApiMeta }>(url);
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

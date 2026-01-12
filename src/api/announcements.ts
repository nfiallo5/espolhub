import apiClient from './client';
import {
  ApiSuccessResponse,
  ApiMeta,
  Announcement,
  AnnouncementQueryParams,
  CreateAnnouncementData,
  UpdateAnnouncementData
} from '@/types';

interface AnnouncementsResponse {
  data: Announcement[];
  meta: ApiMeta;
}

function buildQueryString(params: AnnouncementQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.append('q', params.q);
  if (params.category_id) searchParams.append('category_id', params.category_id.toString());
  if (params.condition) searchParams.append('condition', params.condition);
  if (params.min_price) searchParams.append('min_price', params.min_price.toString());
  if (params.max_price) searchParams.append('max_price', params.max_price.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.per_page) searchParams.append('per_page', params.per_page.toString());

  return searchParams.toString();
}

export async function getAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementsResponse> {
  const queryString = buildQueryString(params);
  const url = queryString ? `/announcements?${queryString}` : '/announcements';

  const response = await apiClient.get<{ data: Announcement[]; meta: ApiMeta }>(url);
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function searchAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementsResponse> {
  const queryString = buildQueryString(params);
  const url = queryString ? `/announcements/search?${queryString}` : '/announcements/search';

  const response = await apiClient.get<{ data: Announcement[]; meta: ApiMeta }>(url);
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getPopularAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementsResponse> {
  const queryString = buildQueryString(params);
  const url = queryString ? `/announcements/popular?${queryString}` : '/announcements/popular';

  const response = await apiClient.get<{ data: Announcement[]; meta: ApiMeta }>(url);
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getRecentAnnouncements(
  params: AnnouncementQueryParams = {}
): Promise<AnnouncementsResponse> {
  const queryString = buildQueryString(params);
  const url = queryString ? `/announcements/recent?${queryString}` : '/announcements/recent';

  const response = await apiClient.get<{ data: Announcement[]; meta: ApiMeta }>(url);
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getAnnouncement(id: number): Promise<Announcement> {
  const response = await apiClient.get<ApiSuccessResponse<Announcement>>(`/announcements/${id}`);
  return response.data.data;
}

export async function createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
  const formData = new FormData();

  formData.append('announcement[title]', data.title);
  formData.append('announcement[description]', data.description);
  formData.append('announcement[price]', data.price.toString());
  formData.append('announcement[condition]', data.condition);
  formData.append('announcement[category_id]', data.category_id.toString());

  if (data.location) {
    formData.append('announcement[location]', data.location);
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images[]', image);
    });
  }

  const response = await apiClient.post<ApiSuccessResponse<Announcement>>(
    '/announcements',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
}

export async function updateAnnouncement(
  id: number,
  data: UpdateAnnouncementData
): Promise<Announcement> {
  const formData = new FormData();

  if (data.title) formData.append('announcement[title]', data.title);
  if (data.description) formData.append('announcement[description]', data.description);
  if (data.price) formData.append('announcement[price]', data.price.toString());
  if (data.condition) formData.append('announcement[condition]', data.condition);
  if (data.category_id) formData.append('announcement[category_id]', data.category_id.toString());
  if (data.location) formData.append('announcement[location]', data.location);

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append('images[]', image);
    });
  }

  const response = await apiClient.patch<ApiSuccessResponse<Announcement>>(
    `/announcements/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await apiClient.delete(`/announcements/${id}`);
}

export async function incrementViews(id: number): Promise<void> {
  await apiClient.patch(`/announcements/${id}/increment_views`);
}

export async function reserveAnnouncement(id: number): Promise<Announcement> {
  const response = await apiClient.patch<ApiSuccessResponse<Announcement>>(
    `/announcements/${id}/reserve`
  );
  return response.data.data;
}

export async function markAsSold(id: number): Promise<Announcement> {
  const response = await apiClient.patch<ApiSuccessResponse<Announcement>>(
    `/announcements/${id}/mark_as_sold`
  );
  return response.data.data;
}

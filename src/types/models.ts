import { Faculty, ConditionKey, AnnouncementStatus } from './enums';

// Seller Types
export interface SellerAttributes {
  id: number;
  name: string;
  faculty: Faculty;
  email: string;
  phone: string;
  whatsapp_link: string;
  created_at: string;
}

export interface Seller {
  id: string;
  type: 'seller';
  attributes: SellerAttributes;
}

// Public profile has limited info (no email/phone)
export interface PublicSellerAttributes {
  id: number;
  name: string;
  faculty: Faculty;
  whatsapp_link: string;
  created_at: string;
}

export interface PublicSeller {
  id: string;
  type: 'seller';
  attributes: PublicSellerAttributes;
}

// Category Types
export interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  announcements_count: number;
}

export interface Category {
  id: string;
  type: 'category';
  attributes: CategoryAttributes;
}

// Announcement Types
export interface AnnouncementAttributes {
  id: number;
  title: string;
  description: string;
  price: number | string; // API may return as string
  condition: ConditionKey;
  location: string | null;
  status: AnnouncementStatus;
  views: number;
  created_at: string;
  updated_at: string;
  images: string[];
}

export interface AnnouncementRelationships {
  seller: {
    data: PublicSeller;
  };
  category: {
    data: Category;
  };
}

export interface Announcement {
  id: string;
  type: 'announcement';
  attributes: AnnouncementAttributes;
  relationships?: AnnouncementRelationships;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  seller: {
    name: string;
    email: string;
    phone: string;
    faculty: Faculty;
    password: string;
    password_confirmation: string;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  seller: Seller;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Announcement Query Parameters
export interface AnnouncementQueryParams {
  q?: string;
  category_id?: number;
  condition?: ConditionKey;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  per_page?: number;
}

// Create/Update Announcement Data
export interface CreateAnnouncementData {
  title: string;
  description: string;
  price: number;
  condition: ConditionKey;
  category_id: number;
  location?: string;
  images?: File[];
}

export interface UpdateAnnouncementData {
  title?: string;
  description?: string;
  price?: number;
  condition?: ConditionKey;
  category_id?: number;
  location?: string;
  images?: File[];
}

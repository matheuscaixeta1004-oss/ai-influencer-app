// === Database schema types ===

export interface Profile {
  id: string;
  name: string;
  email: string;
  credits: number;
  is_dev: boolean;
  created_at: string;
}

export interface AIModel {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  ethnicity: string;
  location: string;
  niche: string;
  bio: string;
  status: 'draft' | 'active' | 'training';
  config: Record<string, unknown>;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModelPhoto {
  id: string;
  model_id: string;
  storage_path: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Content {
  id: string;
  user_id: string;
  model_id: string;
  prompt: string;
  image_url: string | null;
  status: 'draft' | 'approved' | 'archived';
  credits_used: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // positive = in, negative = out
  reason: string;
  created_at: string;
}

// === UI types ===

export interface DashboardStats {
  totalModels: number;
  totalPhotos: number;
  totalContent: number;
  creditsBalance: number;
  creditsUsedToday: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// === Business rules ===
export const CREDITS = {
  SIGNUP_BONUS: 50,
  CREATE_MODEL: 10,
  GENERATE_STANDARD: 2,
  GENERATE_HD: 5,
  UPLOAD_PHOTO: 0,
  MAX_FREE_MODELS: 5,
} as const;

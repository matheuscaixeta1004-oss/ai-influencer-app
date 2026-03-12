export interface AIModel {
  id: string;
  name: string;
  persona: string;
  style: string;
  avatar: string;
  photosCount: number;
  reelsCount: number;
  followers: number;
  status: 'active' | 'draft' | 'paused';
}

export interface Photo {
  id: string;
  modelId: string;
  modelName: string;
  url: string;
  prompt: string;
  createdAt: string;
  likes: number;
  style: string;
}

export interface ContentItem {
  id: string;
  modelId: string;
  modelName: string;
  type: 'photo' | 'reel' | 'story';
  status: 'draft' | 'scheduled' | 'published';
  caption: string;
  thumbnail: string;
  scheduledAt?: string;
  publishedAt?: string;
  engagement: number;
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'bonus';
  amount: number;
  description: string;
  createdAt: string;
  balanceAfter: number;
}

export interface DashboardStats {
  totalModels: number;
  totalPhotos: number;
  totalReels: number;
  creditsBalance: number;
  creditsUsedToday: number;
  scheduledPosts: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

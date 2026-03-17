export type CardCategory = 'image_gen' | 'video_gen' | 'prompt' | 'ref_image' | 'model_ref';

export interface CardField {
  id: string;
  label: string;
  type: 'select' | 'text' | 'textarea' | 'upload';
  options?: { value: string; label: string }[];
  defaultValue: string;
  placeholder?: string;
}

export interface GenerationCardData {
  category: CardCategory;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  prePrompt: string;
  aspectRatio: string;
  fields: CardField[];
  isLocked?: boolean;
  comingSoon?: boolean;
  onGenerate?: (params: Record<string, string>) => void;
  modelAvatar?: string;
  modelName?: string;
  /** Which handles this card exposes */
  hasSourceHandle?: boolean;
  hasTargetHandle?: boolean;
  [key: string]: unknown;
}

export interface ResultCardData {
  imageUrl: string;
  prompt: string;
  modelName: string;
  category: CardCategory;
  timestamp: string;
  status: 'generating' | 'done' | 'error';
  [key: string]: unknown;
}

export interface TopicGroupData {
  label: string;
  color: string;
  width: number;
  height: number;
  [key: string]: unknown;
}

import type { CardField, GenerationCardData } from './types';

// ── Shared field definitions ──────────────────────────────────────────
const sceneField: CardField = {
  id: 'scene',
  label: 'Cenário',
  type: 'select',
  options: [
    { value: 'beach', label: '🏖️ Praia' },
    { value: 'restaurant', label: '🍽️ Restaurante' },
    { value: 'gym', label: '🏋️ Academia' },
    { value: 'home', label: '🏠 Casa' },
    { value: 'city', label: '🏙️ Cidade' },
    { value: 'nature', label: '🌿 Natureza' },
    { value: 'studio', label: '📸 Estúdio' },
    { value: 'pool', label: '🏊 Piscina' },
  ],
  defaultValue: 'beach',
};

const outfitField: CardField = {
  id: 'outfit',
  label: 'Roupa',
  type: 'select',
  options: [
    { value: 'casual', label: '👕 Casual' },
    { value: 'elegant', label: '👗 Elegante' },
    { value: 'fitness', label: '🏃 Fitness' },
    { value: 'bikini', label: '👙 Biquíni' },
    { value: 'streetwear', label: '🧢 Streetwear' },
    { value: 'lingerie', label: '🩱 Lingerie' },
  ],
  defaultValue: 'casual',
};

const poseField: CardField = {
  id: 'pose',
  label: 'Pose',
  type: 'select',
  options: [
    { value: 'standing', label: '🧍 Em pé' },
    { value: 'sitting', label: '🪑 Sentada' },
    { value: 'walking', label: '🚶 Andando' },
    { value: 'posing', label: '💃 Posando' },
    { value: 'candid', label: '📷 Espontânea' },
  ],
  defaultValue: 'posing',
};

const detailField: CardField = {
  id: 'detail',
  label: 'Detalhe extra',
  type: 'text',
  defaultValue: '',
  placeholder: 'Ex: sorrindo, golden hour...',
};

// ── Card templates (new categories) ──────────────────────────────────
export const CARD_TEMPLATES: Omit<GenerationCardData, 'modelAvatar' | 'modelName' | 'onGenerate'>[] = [
  {
    category: 'image_gen',
    title: 'Geração de Imagem',
    description: 'Gera imagem a partir de prompt + imagem de referência.',
    icon: '🖼️',
    accentColor: '#00AFF0',
    prePrompt: '{prompt}',
    aspectRatio: '4:5',
    fields: [
      sceneField,
      outfitField,
      poseField,
      detailField,
    ],
    hasTargetHandle: true,
    hasSourceHandle: true,
  },
  {
    category: 'video_gen',
    title: 'Geração de Vídeo',
    description: 'Gera vídeo com Motion Control a partir de prompt + ref.',
    icon: '🎬',
    accentColor: '#FF6D00',
    prePrompt: '{prompt}',
    aspectRatio: '9:16',
    fields: [
      {
        id: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { value: 'dance', label: '💃 Dancinha' },
          { value: 'transition', label: '✨ Transição' },
          { value: 'lipsync', label: '🎤 Lip Sync' },
          { value: 'grwm', label: '💄 GRWM' },
        ],
        defaultValue: 'dance',
      },
      detailField,
    ],
    hasTargetHandle: true,
    hasSourceHandle: true,
  },
  {
    category: 'prompt',
    title: 'Prompt',
    description: 'Escreva o prompt de texto para a geração.',
    icon: '✏️',
    accentColor: '#7C3AED',
    prePrompt: '',
    aspectRatio: '',
    fields: [
      {
        id: 'prompt_text',
        label: 'Prompt',
        type: 'textarea',
        defaultValue: '',
        placeholder: 'Descreva a imagem ou vídeo que deseja gerar...',
      },
    ],
    hasTargetHandle: false,
    hasSourceHandle: true,
  },
  {
    category: 'ref_image',
    title: 'Imagem de Referência',
    description: 'Upload da imagem de referência para a geração.',
    icon: '🖼️',
    accentColor: '#10B981',
    prePrompt: '',
    aspectRatio: '',
    fields: [
      {
        id: 'ref_url',
        label: 'Imagem de Referência',
        type: 'upload',
        defaultValue: '',
        placeholder: 'Arraste ou clique para fazer upload...',
      },
    ],
    hasTargetHandle: false,
    hasSourceHandle: true,
  },
];

// ── Map context menu IDs to template indices ──────────────────────────
export const MENU_TO_TEMPLATE: Record<string, number> = {
  image_gen: 0,
  video_gen: 1,
  prompt: 2,
  ref_image: 3,
};

// ── Default canvas layout ─────────────────────────────────────────────
export const DEFAULT_TOPIC_GROUPS = [
  { id: 'topic-social', label: '📱 Social Media', color: '#EFF6FF', x: 0, y: 0, width: 720, height: 520 },
  { id: 'topic-video', label: '🎬 Vídeo', color: '#FFF7ED', x: 780, y: 0, width: 360, height: 520 },
  { id: 'topic-premium', label: '🔥 Premium', color: '#FEF2F2', x: 0, y: 580, width: 720, height: 520 },
];

export const DEFAULT_CARD_POSITIONS = [
  { templateIdx: 0, x: 40, y: 80, parentId: 'topic-social' },
  { templateIdx: 1, x: 370, y: 80, parentId: 'topic-social' },
  { templateIdx: 2, x: 40, y: 80, parentId: 'topic-video' },
  { templateIdx: 3, x: 40, y: 80, parentId: 'topic-premium' },
];

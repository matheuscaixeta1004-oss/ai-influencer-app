import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import type { CardCategory } from '../types';

interface ResultCardNodeData {
  imageUrl: string;
  prompt: string;
  modelName: string;
  category: CardCategory;
  timestamp: string;
  status: 'generating' | 'done' | 'error';
  [key: string]: unknown;
}

const categoryLabels: Record<CardCategory, { label: string; color: string }> = {
  image_gen: { label: '🖼️ Imagem', color: '#00AFF0' },
  video_gen: { label: '🎬 Vídeo', color: '#FF6D00' },
  prompt: { label: '✏️ Prompt', color: '#7C4DFF' },
  ref_image: { label: '🖼️ Referência', color: '#E040FB' },
};

function ResultCardNodeInner({ data }: NodeProps) {
  const { imageUrl, prompt, modelName, category, timestamp, status } = data as unknown as ResultCardNodeData;
  const cat = categoryLabels[category];

  return (
    <div
      className="w-[240px] rounded-2xl bg-white overflow-hidden select-none hover:shadow-xl transition-shadow duration-200"
      style={{
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        {status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
            <span className="text-[12px] text-gray-400 font-medium">Gerando...</span>
          </div>
        ) : status === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">❌</span>
            <span className="text-[12px] text-red-400 font-medium">Erro na geração</span>
          </div>
        ) : (
          <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
        )}

        {/* Category badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: cat.color }}
        >
          {cat.label}
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-[12px] text-gray-700 font-medium truncate">{modelName}</p>
        <p className="text-[11px] text-gray-400 truncate mt-0.5">{prompt}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-gray-300">{timestamp}</span>
          {status === 'done' && (
            <div className="flex gap-1">
              <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors" title="Download">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
              <button className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors" title="Publicar">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ResultCardNode = memo(ResultCardNodeInner);

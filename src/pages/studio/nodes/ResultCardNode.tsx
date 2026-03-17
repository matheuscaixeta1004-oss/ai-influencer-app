import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { MdImage, MdVideocam, MdTextFields, MdDownload, MdSend, MdError } from 'react-icons/md';
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

const categoryLabels: Record<CardCategory, { label: string; color: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  image_gen: { label: 'Imagem', color: '#00AFF0', Icon: MdImage },
  video_gen: { label: 'Vídeo', color: '#FF6D00', Icon: MdVideocam },
  prompt: { label: 'Prompt', color: '#7C4DFF', Icon: MdTextFields },
  ref_image: { label: 'Referência', color: '#E040FB', Icon: MdImage },
  model_ref: { label: 'Modelo', color: '#E040FB', Icon: MdImage },
};

function ResultCardNodeInner({ data }: NodeProps) {
  const { imageUrl, prompt, modelName, category, timestamp, status } = data as unknown as ResultCardNodeData;
  const cat = categoryLabels[category] ?? categoryLabels.image_gen;
  const { Icon } = cat;

  return (
    <div
      className="w-[240px] rounded-2xl overflow-hidden select-none hover:shadow-2xl transition-shadow duration-200"
      style={{
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: '#111' }}>
        {status === 'generating' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-400 animate-spin" />
            <span className="text-[12px] text-gray-500 font-medium">Gerando...</span>
          </div>
        ) : status === 'error' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <MdError size={28} className="text-red-500" />
            <span className="text-[12px] text-red-400 font-medium">Erro na geração</span>
          </div>
        ) : (
          <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
        )}

        {/* Category badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}
        >
          <span style={{ color: cat.color, display: 'flex' }}><Icon size={10} /></span>
          <span className="text-[10px] font-semibold" style={{ color: cat.color }}>{cat.label}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-[12px] font-medium truncate" style={{ color: '#e0e0e0' }}>{modelName}</p>
        <p className="text-[11px] truncate mt-0.5" style={{ color: '#666' }}>{prompt}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px]" style={{ color: '#444' }}>{timestamp}</span>
          {status === 'done' && (
            <div className="flex gap-1">
              <button
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={{ color: '#666' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#aaa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                title="Download"
              >
                <MdDownload size={14} />
              </button>
              <button
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={{ color: '#666' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#aaa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                title="Publicar"
              >
                <MdSend size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ResultCardNode = memo(ResultCardNodeInner);

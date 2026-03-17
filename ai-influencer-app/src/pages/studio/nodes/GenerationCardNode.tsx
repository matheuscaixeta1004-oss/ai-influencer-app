import { memo, useState, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CardCategory, CardField } from '../types';

interface GenerationCardNodeData {
  category: CardCategory;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  fields: CardField[];
  isLocked?: boolean;
  comingSoon?: boolean;
  modelAvatar?: string;
  modelName?: string;
  hasSourceHandle?: boolean;
  hasTargetHandle?: boolean;
  onGenerate?: (params: Record<string, string>) => void;
  [key: string]: unknown;
}

function GenerationCardNodeInner({ data }: NodeProps) {
  const {
    title, description, icon, accentColor, fields,
    isLocked, comingSoon, modelAvatar, modelName, onGenerate,
    hasSourceHandle, hasTargetHandle,
  } = data as unknown as GenerationCardNodeData;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((f) => { initial[f.id] = f.defaultValue; });
    return initial;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (isLocked || comingSoon) return;
    setIsGenerating(true);
    onGenerate?.(values);
    setTimeout(() => setIsGenerating(false), 2500);
  };

  const handleFileUpload = (fieldId: string, file: File) => {
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    setValues((v) => ({ ...v, [fieldId]: url }));
  };

  const locked = isLocked || comingSoon;

  // Handle style shared
  const handleStyle = {
    width: 10,
    height: 10,
    background: '#fff',
    border: `2px solid ${accentColor}`,
    borderRadius: '50%',
  };

  return (
    <div
      className={`
        w-[300px] rounded-2xl bg-white overflow-visible select-none
        transition-shadow duration-200
        ${locked ? 'opacity-75' : 'hover:shadow-xl'}
      `}
      style={{
        border: `1px solid ${locked ? '#E5E7EB' : accentColor}20`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.06), 0 8px 24px ${accentColor}08`,
      }}
    >
      {/* Target handle (left side — input) */}
      {hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ ...handleStyle, left: -5 }}
        />
      )}

      {/* Source handle (right side — output) */}
      {hasSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ ...handleStyle, right: -5 }}
        />
      )}

      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}15)` }}
      >
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
            {comingSoon && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-600 whitespace-nowrap">
                Em breve
              </span>
            )}
            {isLocked && !comingSoon && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-500 whitespace-nowrap">
                🔒 Premium
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{description}</p>
        </div>
      </div>

      {/* Model badge */}
      {modelName && (
        <div className="px-4 py-2 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100">
          <div
            className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden flex-shrink-0"
            style={modelAvatar ? {} : { background: accentColor }}
          >
            {modelAvatar
              ? <img src={modelAvatar} alt="" className="w-full h-full object-cover" />
              : modelName[0]?.toUpperCase()
            }
          </div>
          <span className="text-[12px] text-gray-600 font-medium truncate">{modelName}</span>
          <span className="ml-auto text-[10px] text-gray-400">Modelo vinculado</span>
        </div>
      )}

      {/* Fields */}
      <div className="px-4 py-3 space-y-2.5">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                disabled={locked}
                className="w-full text-[13px] px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                disabled={locked}
                rows={3}
                className="w-full text-[13px] px-3 py-2 rounded-lg border border-gray-200 resize-none
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  disabled:bg-gray-50 disabled:text-gray-400 placeholder-gray-300 transition-colors"
              />
            ) : field.type === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50
                  hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer
                  flex flex-col items-center justify-center gap-1 py-4"
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                ) : (
                  <>
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[11px] text-gray-400">{field.placeholder || 'Upload'}</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(field.id, file);
                  }}
                />
              </div>
            ) : (
              <input
                type="text"
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                disabled={locked}
                className="w-full text-[13px] px-3 py-1.5 rounded-lg border border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                  disabled:bg-gray-50 disabled:text-gray-400 placeholder-gray-300 transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      {/* Generate button — only show for generation cards */}
      {(data as unknown as GenerationCardNodeData).category !== 'prompt' &&
       (data as unknown as GenerationCardNodeData).category !== 'ref_image' && (
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={handleGenerate}
            disabled={locked || isGenerating}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white
              transition-all duration-200 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]"
            style={{
              background: locked
                ? '#D1D5DB'
                : `linear-gradient(135deg, ${accentColor}, ${accentColor}DD)`,
              boxShadow: locked ? 'none' : `0 2px 8px ${accentColor}40`,
            }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Gerando...
              </span>
            ) : locked ? (
              comingSoon ? '🚧 Em breve' : '🔒 Desbloquear Premium'
            ) : (
              '✨ Gerar'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export const GenerationCardNode = memo(GenerationCardNodeInner);

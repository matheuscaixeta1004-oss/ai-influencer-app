import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  MdImage,
  MdVideocam,
  MdTextFields,
  MdPlayArrow,
  MdSettings,
  MdAspectRatio,
  MdGraphicEq,
  MdAdd,
  MdRemove,
  MdPerson,
} from 'react-icons/md';
import type { CardCategory } from '../types';

interface GenerationCardNodeData {
  category: CardCategory;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  fields: { id: string; label: string; type: string; options?: { value: string; label: string }[]; defaultValue: string; placeholder?: string }[];
  isLocked?: boolean;
  comingSoon?: boolean;
  modelAvatar?: string;
  modelName?: string;
  hasSourceHandle?: boolean;
  hasTargetHandle?: boolean;
  onGenerate?: (params: Record<string, string>) => void;
  cardIndex?: number;
  [key: string]: unknown;
}

// ─── Reusable pill select ────────────────────────────────────────────
function PillSelect({
  value,
  onChange,
  options,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer select-none"
      style={{ background: '#333', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-white text-[12px] font-medium outline-none cursor-pointer appearance-none pr-3"
        style={{ color: '#e0e0e0' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#222', color: '#e0e0e0' }}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg className="w-3 h-3 text-gray-500 flex-shrink-0 pointer-events-none absolute right-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

// ─── Quantity control ────────────────────────────────────────────────
function QuantityPill({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div
      className="flex items-center gap-1 rounded-full px-2 py-1.5"
      style={{ background: '#333', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <MdRemove size={14} />
      </button>
      <span className="text-[12px] font-semibold text-white w-5 text-center">x{value}</span>
      <button
        onClick={() => onChange(Math.min(4, value + 1))}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <MdAdd size={14} />
      </button>
    </div>
  );
}

// ─── Toggle pill ─────────────────────────────────────────────────────
function TogglePill({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-[#444]'}`}
      >
        <div
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ transform: `translateX(${value ? '17px' : '2px'})` }}
        />
      </button>
    </div>
  );
}

// ─── Sidebar icon button ─────────────────────────────────────────────
function SideBtn({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
      style={{ background: '#2e2e2e', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {icon}
    </button>
  );
}

// ─── Image Generator Card ────────────────────────────────────────────
function ImageGenCard({
  data,
  cardIndex,
  isGenerating,
  onGenerate,
}: {
  data: GenerationCardNodeData;
  cardIndex: number;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [model, setModel] = useState('nano-banana-2');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [quality, setQuality] = useState('1K');

  const modelOptions = [
    { value: 'nano-banana-2', label: 'Nano Banana 2' },
    { value: 'seed-dream', label: 'Seed Dream' },
    { value: 'ideogram-v3', label: 'Ideogram v3' },
  ];
  const aspectOptions = [
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
    { value: '9:16', label: '9:16' },
    { value: '16:9', label: '16:9' },
  ];
  const qualityOptions = [
    { value: '1K', label: '1K' },
    { value: '2K', label: '2K' },
    { value: '4K', label: '4K' },
  ];

  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="flex flex-col gap-2 pr-2 pt-10">
        <SideBtn icon={<MdTextFields size={18} />} title="Referência de texto" />
        <SideBtn icon={<MdImage size={18} />} title="Imagem de referência" />
      </div>

      {/* Card body */}
      <div
        className="w-[420px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <MdImage size={18} className="text-gray-400" />
          <span className="text-[13px] font-semibold text-white">Gerador de Imagem #{cardIndex}</span>
          {data.comingSoon && (
            <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(255,165,0,0.15)', color: '#FFA500' }}>
              Em breve
            </span>
          )}
        </div>

        {/* Preview area */}
        <div
          className="relative mx-3 mt-3 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ height: 220, background: '#111' }}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-blue-400 animate-spin" />
              <span className="text-[12px] text-gray-500">Gerando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <MdImage size={40} className="text-gray-600" />
              <span className="text-[11px] text-gray-500">Prévia aparecerá aqui</span>
            </div>
          )}
        </div>

        {/* Prompt input */}
        <div className="px-3 pt-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que deseja gerar..."
            rows={2}
            className="w-full bg-transparent text-[13px] resize-none outline-none placeholder-[#666]"
            style={{ color: '#e0e0e0' }}
          />
        </div>

        {/* Controls row 1 */}
        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap">
          <QuantityPill value={quantity} onChange={setQuantity} />
          <PillSelect value={model} onChange={setModel} options={modelOptions} />
          <PillSelect
            value={aspectRatio}
            onChange={setAspectRatio}
            options={aspectOptions}
            icon={<MdAspectRatio size={14} />}
          />
        </div>

        {/* Controls row 2 + generate */}
        <div
          className="px-3 py-2.5 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <PillSelect value={quality} onChange={setQuality} options={qualityOptions} />
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            style={{ background: '#333', border: '1px solid rgba(255,255,255,0.08)' }}
            title="Configurações"
          >
            <MdSettings size={16} />
          </button>
          <div className="ml-auto">
            <button
              onClick={onGenerate}
              disabled={isGenerating || data.comingSoon}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: '#555', border: '1px solid rgba(255,255,255,0.1)' }}
              title="Gerar"
            >
              <MdPlayArrow size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-2 pl-2 pt-10">
        <SideBtn icon={<MdImage size={18} />} title="Usar como referência" />
      </div>
    </div>
  );
}

// ─── Video Generator Card ────────────────────────────────────────────
function VideoGenCard({
  data,
  cardIndex,
  isGenerating,
  onGenerate,
}: {
  data: GenerationCardNodeData;
  cardIndex: number;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [model, setModel] = useState('kling-3.0');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState('5s');
  const [resolution, setResolution] = useState('1080p');
  const [soundFx, setSoundFx] = useState(false);

  const modelOptions = [
    { value: 'kling-3.0', label: 'Kling 3.0' },
    { value: 'kling-2.0', label: 'Kling 2.0' },
  ];
  const aspectOptions = [
    { value: '1:1', label: '1:1' },
    { value: '4:5', label: '4:5' },
    { value: '9:16', label: '9:16' },
    { value: '16:9', label: '16:9' },
  ];
  const durationOptions = [
    { value: '5s', label: '5s' },
    { value: '10s', label: '10s' },
  ];
  const resolutionOptions = [
    { value: '720p', label: '720p' },
    { value: '1080p', label: '1080p' },
  ];

  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="flex flex-col gap-2 pr-2 pt-10">
        <SideBtn icon={<MdTextFields size={18} />} title="Referência de texto" />
        <SideBtn icon={<MdImage size={18} />} title="Imagem de referência" />
        <SideBtn icon={<MdImage size={18} />} title="Imagem de referência adicional" />
      </div>

      {/* Card body */}
      <div
        className="w-[420px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <MdVideocam size={18} className="text-gray-400" />
          <span className="text-[13px] font-semibold text-white">Gerador de Vídeo #{cardIndex}</span>
          {data.comingSoon && (
            <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(255,165,0,0.15)', color: '#FFA500' }}>
              Em breve
            </span>
          )}
        </div>

        {/* Preview area */}
        <div
          className="relative mx-3 mt-3 rounded-xl overflow-hidden flex items-center justify-center"
          style={{ height: 220, background: '#111' }}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-orange-400 animate-spin" />
              <span className="text-[12px] text-gray-500">Gerando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <MdVideocam size={40} className="text-gray-600" />
              <span className="text-[11px] text-gray-500">Prévia aparecerá aqui</span>
            </div>
          )}
        </div>

        {/* Prompt input */}
        <div className="px-3 pt-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o vídeo que deseja gerar..."
            rows={2}
            className="w-full bg-transparent text-[13px] resize-none outline-none placeholder-[#666]"
            style={{ color: '#e0e0e0' }}
          />
        </div>

        {/* Controls row 1 */}
        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap">
          <QuantityPill value={quantity} onChange={setQuantity} />
          <PillSelect value={model} onChange={setModel} options={modelOptions} />
          <PillSelect
            value={aspectRatio}
            onChange={setAspectRatio}
            options={aspectOptions}
            icon={<MdAspectRatio size={14} />}
          />
          <PillSelect value={duration} onChange={setDuration} options={durationOptions} />
        </div>

        {/* Controls row 2 + generate */}
        <div
          className="px-3 py-2.5 flex items-center gap-2 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <PillSelect value={resolution} onChange={setResolution} options={resolutionOptions} />
          <TogglePill label="Som" value={soundFx} onChange={setSoundFx} />
          <div className="ml-auto">
            <button
              onClick={onGenerate}
              disabled={isGenerating || data.comingSoon}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: '#555', border: '1px solid rgba(255,255,255,0.1)' }}
              title="Gerar"
            >
              <MdPlayArrow size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-2 pl-2 pt-10">
        <SideBtn icon={<MdImage size={18} />} title="Keyframe inicial" />
        <SideBtn icon={<MdImage size={18} />} title="Keyframe final" />
        <SideBtn icon={<MdVideocam size={18} />} title="Referência de vídeo" />
        <SideBtn icon={<MdGraphicEq size={18} />} title="Referência de áudio" />
      </div>
    </div>
  );
}

// ─── Model Ref Card (small) ──────────────────────────────────────────
function ModelRefCard({ data }: { data: GenerationCardNodeData }) {
  return (
    <div
      className="w-[200px] rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <MdPerson size={16} className="text-gray-400" />
        <span className="text-[12px] font-semibold text-white">Modelo</span>
      </div>

      {/* Avatar */}
      <div className="mx-3 my-2.5 rounded-xl overflow-hidden" style={{ height: 100, background: '#111' }}>
        {data.modelAvatar ? (
          <img src={data.modelAvatar} alt="Modelo" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <MdPerson size={36} className="text-gray-500" />
          </div>
        )}
      </div>

      {/* Model name */}
      <div className="px-3 pb-3">
        <div
          className="w-full px-2.5 py-1.5 rounded-lg text-[12px] text-gray-300 truncate"
          style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {data.modelName || 'Selecionar modelo'}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
function GenerationCardNodeInner({ data, id }: NodeProps) {
  const cardData = data as unknown as GenerationCardNodeData;
  const {
    category,
    hasSourceHandle,
    hasTargetHandle,
    comingSoon,
  } = cardData;

  const [isGenerating, setIsGenerating] = useState(false);

  // Extract card index from node id (e.g. card-image_gen-1234-2 → index from cardCounter)
  const cardIndex = (() => {
    const parts = id.split('-');
    const last = parts[parts.length - 1];
    const num = parseInt(last, 10);
    return isNaN(num) ? 1 : num + 1;
  })();

  const handleGenerate = () => {
    if (comingSoon) return;
    setIsGenerating(true);
    cardData.onGenerate?.({});
    setTimeout(() => setIsGenerating(false), 2500);
  };

  const handleStyle = {
    width: 10,
    height: 10,
    background: '#555',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
  };

  return (
    <div className="relative select-none" style={{ overflow: 'visible' }}>
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

      {/* Render the appropriate card type */}
      {category === 'image_gen' && (
        <ImageGenCard
          data={cardData}
          cardIndex={cardIndex}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      )}
      {category === 'video_gen' && (
        <VideoGenCard
          data={cardData}
          cardIndex={cardIndex}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      )}
      {category === 'model_ref' && (
        <ModelRefCard data={cardData} />
      )}
      {(category === 'prompt' || category === 'ref_image') && (
        <LegacyCard data={cardData} isGenerating={isGenerating} onGenerate={handleGenerate} />
      )}
    </div>
  );
}

// ─── Legacy compact card for prompt/ref_image ────────────────────────
function LegacyCard({
  data,
}: {
  data: GenerationCardNodeData;
  isGenerating?: boolean;
  onGenerate?: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    data.fields?.forEach((f) => { init[f.id] = f.defaultValue || ''; });
    return init;
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const TitleIcon = data.category === 'prompt' ? MdTextFields : MdImage;

  return (
    <div
      className="w-[300px] rounded-2xl overflow-hidden"
      style={{
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <TitleIcon size={16} className="text-gray-400" />
        <span className="text-[13px] font-semibold text-white">{data.title}</span>
        {data.comingSoon && (
          <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(255,165,0,0.15)', color: '#FFA500' }}>
            Em breve
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="px-4 py-3 space-y-2.5">
        {data.fields?.map((field) => (
          <div key={field.id}>
            <label className="block text-[11px] font-medium text-gray-500 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                rows={4}
                className="w-full text-[13px] px-3 py-2 rounded-lg resize-none outline-none placeholder-[#555]"
                style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
              />
            ) : field.type === 'upload' ? (
              <div
                className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: '#2a2a2a' }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setUploadPreview(url);
                      setValues((v) => ({ ...v, [field.id]: url }));
                    }
                  };
                  input.click();
                }}
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                ) : (
                  <>
                    <MdImage size={28} className="text-gray-600" />
                    <span className="text-[11px] text-gray-500">{field.placeholder || 'Upload'}</span>
                  </>
                )}
              </div>
            ) : (
              <input
                type="text"
                value={values[field.id] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full text-[13px] px-3 py-1.5 rounded-lg outline-none placeholder-[#555]"
                style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.08)', color: '#e0e0e0' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const GenerationCardNode = memo(GenerationCardNodeInner);

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

// ─── Light theme tokens ──────────────────────────────────────────────
const CARD = {
  bg: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.08)',
  shadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
  divider: '1px solid rgba(0,0,0,0.06)',
  previewBg: '#F3F4F6',
  pillBg: '#F3F4F6',
  pillBorder: '1px solid rgba(0,0,0,0.06)',
  handleBg: '#F3F4F6',
  handleBorder: '1px solid rgba(0,0,0,0.1)',
  inputBg: '#F9FAFB',
  inputBorder: '1px solid rgba(0,0,0,0.08)',
};

// ─── Aspect ratio → preview dimensions ───────────────────────────────
function getPreviewDimensions(ratio: string, maxWidth: number) {
  const BASE_HEIGHT = 220;
  const MIN_CARD = 320;
  const MAX_CARD = 480;

  const [w, h] = ratio.split(':').map(Number);
  if (!w || !h) return { width: maxWidth, height: BASE_HEIGHT, cardWidth: maxWidth + 26 };

  const aspect = w / h;
  let previewW: number;
  let previewH: number;

  if (aspect >= 1) {
    previewW = maxWidth;
    previewH = Math.round(maxWidth / aspect);
  } else {
    previewH = Math.round(BASE_HEIGHT * 1.4);
    previewW = Math.round(previewH * aspect);
    if (previewW > maxWidth) {
      previewW = maxWidth;
      previewH = Math.round(maxWidth / aspect);
    }
  }

  const cardWidth = Math.max(MIN_CARD, Math.min(MAX_CARD, previewW + 26));
  return { width: previewW, height: previewH, cardWidth };
}

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
      style={{ background: CARD.pillBg, border: CARD.pillBorder }}
    >
      {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-gray-700 text-[12px] font-medium outline-none cursor-pointer appearance-none pr-3"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg className="w-3 h-3 text-gray-400 flex-shrink-0 pointer-events-none absolute right-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
      style={{ background: CARD.pillBg, border: CARD.pillBorder }}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-black/5"
      >
        <MdRemove size={14} />
      </button>
      <span className="text-[12px] font-semibold text-gray-700 w-5 text-center">x{value}</span>
      <button
        onClick={() => onChange(Math.min(4, value + 1))}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-black/5"
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
      <span className="text-[11px] text-gray-500">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${value ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <div
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ transform: `translateX(${value ? '17px' : '2px'})` }}
        />
      </button>
    </div>
  );
}

// ─── Handle-button: a sidebar circle that IS a ReactFlow handle ──────
function HandleBtn({
  id,
  type,
  position,
  icon,
  title,
  topOffset,
}: {
  id: string;
  type: 'source' | 'target';
  position: Position;
  icon: React.ReactNode;
  title: string;
  topOffset: number;
}) {
  const isLeft = position === Position.Left;
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        top: topOffset,
        [isLeft ? 'left' : 'right']: -20,
        width: 36,
        height: 36,
        zIndex: 10,
      }}
      title={title}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors pointer-events-none"
        style={{ background: CARD.handleBg, border: CARD.handleBorder }}
      >
        {icon}
      </div>
      <Handle
        type={type}
        position={position}
        id={id}
        style={{
          position: 'absolute',
          [isLeft ? 'left' : 'right']: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          background: 'transparent',
          border: 'none',
          zIndex: 20,
        }}
        isConnectable={true}
      />
    </div>
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

  const previewDimensions = getPreviewDimensions(aspectRatio, 394);

  return (
    <div className="relative" style={{ padding: '0 24px' }}>
      <HandleBtn id="text-ref" type="target" position={Position.Left} icon={<MdTextFields size={18} />} title="Referência de texto" topOffset={80} />
      <HandleBtn id="image-ref" type="target" position={Position.Left} icon={<MdImage size={18} />} title="Imagem de referência" topOffset={124} />
      <HandleBtn id="output-ref" type="source" position={Position.Right} icon={<MdImage size={18} />} title="Usar como referência" topOffset={80} />

      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ width: previewDimensions.cardWidth, background: CARD.bg, border: CARD.border, boxShadow: CARD.shadow }}
      >
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: CARD.divider }}>
          <MdImage size={18} className="text-gray-400" />
          <span className="text-[13px] font-semibold text-gray-800">Gerador de Imagem #{cardIndex}</span>
        </div>

        <div
          className="relative mx-3 mt-3 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300"
          style={{ width: previewDimensions.width, height: previewDimensions.height, background: CARD.previewBg, alignSelf: 'center' }}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-blue-400 animate-spin" />
              <span className="text-[12px] text-gray-400">Gerando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-40">
              <MdImage size={40} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">Prévia aparecerá aqui</span>
            </div>
          )}
        </div>

        <div className="px-3 pt-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem que deseja gerar..."
            rows={2}
            className="w-full bg-transparent text-[13px] text-gray-700 resize-none outline-none placeholder-gray-400"
          />
        </div>

        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap">
          <QuantityPill value={quantity} onChange={setQuantity} />
          <PillSelect value={model} onChange={setModel} options={modelOptions} />
          <PillSelect value={aspectRatio} onChange={setAspectRatio} options={aspectOptions} icon={<MdAspectRatio size={14} />} />
        </div>

        <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderTop: CARD.divider }}>
          <PillSelect value={quality} onChange={setQuality} options={qualityOptions} />
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            style={{ background: CARD.pillBg, border: CARD.pillBorder }}
            title="Configurações"
          >
            <MdSettings size={16} />
          </button>
          <div className="ml-auto">
            <button
              onClick={onGenerate}
              disabled={isGenerating || data.comingSoon}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00AFF0, #0099D4)', boxShadow: '0 2px 8px rgba(0,175,240,0.3)' }}
              title="Gerar"
            >
              <MdPlayArrow size={22} />
            </button>
          </div>
        </div>
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

  const previewDimensions = getPreviewDimensions(aspectRatio, 394);

  return (
    <div className="relative" style={{ padding: '0 24px' }}>
      <HandleBtn id="text-ref" type="target" position={Position.Left} icon={<MdTextFields size={18} />} title="Referência de texto" topOffset={80} />
      <HandleBtn id="image-ref" type="target" position={Position.Left} icon={<MdImage size={18} />} title="Imagem de referência" topOffset={124} />
      <HandleBtn id="image-ref-2" type="target" position={Position.Left} icon={<MdImage size={18} />} title="Imagem de referência adicional" topOffset={168} />
      <HandleBtn id="keyframe-start" type="target" position={Position.Right} icon={<MdImage size={18} />} title="Keyframe inicial" topOffset={80} />
      <HandleBtn id="keyframe-end" type="target" position={Position.Right} icon={<MdImage size={18} />} title="Keyframe final" topOffset={124} />
      <HandleBtn id="video-ref" type="target" position={Position.Right} icon={<MdVideocam size={18} />} title="Referência de vídeo" topOffset={168} />
      <HandleBtn id="audio-ref" type="target" position={Position.Right} icon={<MdGraphicEq size={18} />} title="Referência de áudio" topOffset={212} />

      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ width: previewDimensions.cardWidth, background: CARD.bg, border: CARD.border, boxShadow: CARD.shadow }}
      >
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: CARD.divider }}>
          <MdVideocam size={18} className="text-gray-400" />
          <span className="text-[13px] font-semibold text-gray-800">Gerador de Vídeo #{cardIndex}</span>
        </div>

        <div
          className="relative mx-3 mt-3 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300"
          style={{ width: previewDimensions.width, height: previewDimensions.height, background: CARD.previewBg, alignSelf: 'center' }}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-orange-400 animate-spin" />
              <span className="text-[12px] text-gray-400">Gerando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-40">
              <MdVideocam size={40} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">Prévia aparecerá aqui</span>
            </div>
          )}
        </div>

        <div className="px-3 pt-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o vídeo que deseja gerar..."
            rows={2}
            className="w-full bg-transparent text-[13px] text-gray-700 resize-none outline-none placeholder-gray-400"
          />
        </div>

        <div className="px-3 pb-2 flex items-center gap-2 flex-wrap">
          <QuantityPill value={quantity} onChange={setQuantity} />
          <PillSelect value={model} onChange={setModel} options={modelOptions} />
          <PillSelect value={aspectRatio} onChange={setAspectRatio} options={aspectOptions} icon={<MdAspectRatio size={14} />} />
          <PillSelect value={duration} onChange={setDuration} options={durationOptions} />
        </div>

        <div className="px-3 py-2.5 flex items-center gap-2 flex-wrap" style={{ borderTop: CARD.divider }}>
          <PillSelect value={resolution} onChange={setResolution} options={resolutionOptions} />
          <TogglePill label="Som" value={soundFx} onChange={setSoundFx} />
          <div className="ml-auto">
            <button
              onClick={onGenerate}
              disabled={isGenerating || data.comingSoon}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #00AFF0, #0099D4)', boxShadow: '0 2px 8px rgba(0,175,240,0.3)' }}
              title="Gerar"
            >
              <MdPlayArrow size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Model Ref Card (small) ──────────────────────────────────────────
function ModelRefCard({ data }: { data: GenerationCardNodeData }) {
  return (
    <div className="relative" style={{ padding: '0 24px' }}>
      <HandleBtn id="model-out" type="source" position={Position.Right} icon={<MdPerson size={16} />} title="Conectar modelo" topOffset={50} />

      <div
        className="w-[200px] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: CARD.bg, border: CARD.border, boxShadow: CARD.shadow }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: CARD.divider }}>
          <MdPerson size={16} className="text-gray-400" />
          <span className="text-[12px] font-semibold text-gray-800">Modelo</span>
        </div>
        <div className="mx-3 my-2.5 rounded-xl overflow-hidden" style={{ height: 100, background: CARD.previewBg }}>
          {data.modelAvatar ? (
            <img src={data.modelAvatar} alt="Modelo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <MdPerson size={36} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="px-3 pb-3">
          <div
            className="w-full px-2.5 py-1.5 rounded-lg text-[12px] text-gray-600 truncate"
            style={{ background: CARD.inputBg, border: CARD.inputBorder }}
          >
            {data.modelName || 'Selecionar modelo'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
function GenerationCardNodeInner({ data, id }: NodeProps) {
  const cardData = data as unknown as GenerationCardNodeData;
  const { category, comingSoon } = cardData;

  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="select-none" style={{ overflow: 'visible' }}>
      {category === 'image_gen' && (
        <ImageGenCard data={cardData} cardIndex={cardIndex} isGenerating={isGenerating} onGenerate={handleGenerate} />
      )}
      {category === 'video_gen' && (
        <VideoGenCard data={cardData} cardIndex={cardIndex} isGenerating={isGenerating} onGenerate={handleGenerate} />
      )}
      {category === 'model_ref' && (
        <ModelRefCard data={cardData} />
      )}
      {(category === 'prompt' || category === 'ref_image') && (
        <LegacyCard data={cardData} />
      )}
    </div>
  );
}

// ─── Legacy compact card for prompt/ref_image ────────────────────────
function LegacyCard({ data }: { data: GenerationCardNodeData }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    data.fields?.forEach((f) => { init[f.id] = f.defaultValue || ''; });
    return init;
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const TitleIcon = data.category === 'prompt' ? MdTextFields : MdImage;

  return (
    <div className="relative" style={{ padding: '0 24px' }}>
      {data.hasTargetHandle && (
        <HandleBtn id="input" type="target" position={Position.Left} icon={TitleIcon === MdTextFields ? <MdTextFields size={16} /> : <MdImage size={16} />} title="Entrada" topOffset={40} />
      )}
      {data.hasSourceHandle && (
        <HandleBtn id="output" type="source" position={Position.Right} icon={TitleIcon === MdTextFields ? <MdTextFields size={16} /> : <MdImage size={16} />} title="Saída" topOffset={40} />
      )}

      <div
        className="w-[300px] rounded-2xl overflow-hidden"
        style={{ background: CARD.bg, border: CARD.border, boxShadow: CARD.shadow }}
      >
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: CARD.divider }}>
          <TitleIcon size={16} className="text-gray-400" />
          <span className="text-[13px] font-semibold text-gray-800">{data.title}</span>
        </div>
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
                  className="w-full text-[13px] text-gray-700 px-3 py-2 rounded-lg resize-none outline-none placeholder-gray-400"
                  style={{ background: CARD.inputBg, border: CARD.inputBorder }}
                />
              ) : field.type === 'upload' ? (
                <div
                  className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'rgba(0,0,0,0.12)', background: CARD.inputBg }}
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
                      <MdImage size={28} className="text-gray-300" />
                      <span className="text-[11px] text-gray-400">{field.placeholder || 'Upload'}</span>
                    </>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={values[field.id] || ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full text-[13px] text-gray-700 px-3 py-1.5 rounded-lg outline-none placeholder-gray-400"
                  style={{ background: CARD.inputBg, border: CARD.inputBorder }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const GenerationCardNode = memo(GenerationCardNodeInner);

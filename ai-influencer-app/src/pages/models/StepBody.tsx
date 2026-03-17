import { useState } from 'react';
import { Card, Select } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

/* ─── Photo Card Selector ─── */
interface PhotoOption {
  value: string;
  label: string;
  image: string;
}

function PhotoCardGrid({
  label,
  options,
  selected,
  onSelect,
  columns = 6,
}: {
  label: string;
  options: PhotoOption[];
  selected: string;
  onSelect: (value: string) => void;
  columns?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`
              group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer
              ${selected === opt.value
                ? 'border-primary ring-2 ring-primary/20 scale-[1.02]'
                : 'border-gray-200 hover:border-gray-300'}
            `}
          >
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={opt.image}
                alt={opt.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className={`
              py-2 px-1 text-center transition-colors
              ${selected === opt.value ? 'bg-primary/5' : 'bg-white'}
            `}>
              <span className={`text-[11px] font-semibold ${selected === opt.value ? 'text-primary' : 'text-gray-600'}`}>
                {opt.label}
              </span>
            </div>
            {selected === opt.value && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Data ─── */
const skinTones: PhotoOption[] = [
  { value: 'fair', label: 'Clara', image: '/images/references/skin/fair.jpg' },
  { value: 'medium', label: 'Média', image: '/images/references/skin/medium.jpg' },
  { value: 'olive', label: 'Oliva', image: '/images/references/skin/olive.jpg' },
  { value: 'tan', label: 'Bronzeada', image: '/images/references/skin/tan.jpg' },
  { value: 'brown', label: 'Morena', image: '/images/references/skin/brown.jpg' },
  { value: 'dark', label: 'Escura', image: '/images/references/skin/dark.jpg' },
];

const bodyTypes: PhotoOption[] = [
  { value: 'slim', label: 'Slim', image: '/images/references/body/slim.jpg' },
  { value: 'athletic', label: 'Atlético', image: '/images/references/body/athletic.jpg' },
  { value: 'average', label: 'Médio', image: '/images/references/body/average.jpg' },
  { value: 'curvy', label: 'Curvy', image: '/images/references/body/curvy.jpg' },
  { value: 'plus', label: 'Plus Size', image: '/images/references/body/plus.jpg' },
];

const breastSizes: PhotoOption[] = [
  { value: 'small', label: 'Pequeno', image: '/images/references/breast/small.jpg' },
  { value: 'medium', label: 'Médio', image: '/images/references/breast/medium.jpg' },
  { value: 'large', label: 'Grande', image: '/images/references/breast/large.jpg' },
  { value: 'xlarge', label: 'Extra Grande', image: '/images/references/breast/xlarge.jpg' },
];

const buttSizes: PhotoOption[] = [
  { value: 'narrow', label: 'Estreito', image: '/images/references/butt/narrow.jpg' },
  { value: 'medium', label: 'Médio', image: '/images/references/butt/medium.jpg' },
  { value: 'wide', label: 'Largo', image: '/images/references/butt/wide.jpg' },
  { value: 'xwide', label: 'Extra Largo', image: '/images/references/butt/xwide.jpg' },
];

const eyeColors = [
  { value: 'brown', label: 'Castanho', color: '#8B4513' },
  { value: 'hazel', label: 'Avelã', color: '#9B7D4C' },
  { value: 'green', label: 'Verde', color: '#2E8B57' },
  { value: 'blue', label: 'Azul', color: '#4169E1' },
  { value: 'gray', label: 'Cinza', color: '#808080' },
  { value: 'amber', label: 'Âmbar', color: '#FFBF00' },
];

const hairTypes: PhotoOption[] = [
  { value: 'straight', label: 'Liso', image: '/images/references/hair/straight.jpg' },
  { value: 'wavy', label: 'Ondulado', image: '/images/references/hair/wavy.jpg' },
  { value: 'curly', label: 'Cacheado', image: '/images/references/hair/curly.jpg' },
  { value: 'coily', label: 'Crespo', image: '/images/references/hair/coily.jpg' },
];

const hairLengthOptions = [
  { value: 'short', label: 'Curto' },
  { value: 'medium', label: 'Médio' },
  { value: 'long', label: 'Longo' },
  { value: 'extra-long', label: 'Extra Longo' },
];

export function StepBody({ data, update }: Props) {
  const [extrasText, setExtrasText] = useState(data.extras.join(', '));

  const handleExtrasChange = (value: string) => {
    setExtrasText(value);
    const items = value.split(',').map(s => s.trim()).filter(Boolean);
    update({ extras: items });
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-sidebar mb-1">Características Físicas</h3>
      <p className="text-sm text-gray-500 mb-6">Defina o corpo e aparência da modelo</p>

      <div className="space-y-8">

        {/* Skin Tone — photo cards */}
        <PhotoCardGrid
          label="Tom de Pele"
          options={skinTones}
          selected={data.skinTone}
          onSelect={(v) => update({ skinTone: v })}
          columns={6}
        />

        {/* Body Type — photo cards */}
        <PhotoCardGrid
          label="Tipo de Corpo"
          options={bodyTypes}
          selected={data.bodyType}
          onSelect={(v) => update({ bodyType: v })}
          columns={5}
        />

        {/* Breast Size — photo cards */}
        <PhotoCardGrid
          label="Tamanho do Busto"
          options={breastSizes}
          selected={data.breastSize}
          onSelect={(v) => update({ breastSize: v })}
          columns={4}
        />

        {/* Butt Size — photo cards */}
        <PhotoCardGrid
          label="Tamanho do Bumbum"
          options={buttSizes}
          selected={data.buttSize}
          onSelect={(v) => update({ buttSize: v })}
          columns={4}
        />

        {/* Height */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Altura: {data.height}cm
          </label>
          <input
            type="range"
            min={145}
            max={195}
            value={data.height}
            onChange={(e) => update({ height: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>145cm</span>
            <span>195cm</span>
          </div>
        </div>

        {/* Hair — photo type + text color + length */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Cabelo</label>

          {/* Hair Type — photo cards */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {hairTypes.map((ht) => (
              <button
                key={ht.value}
                onClick={() => update({ hairType: ht.value })}
                className={`
                  group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer
                  ${data.hairType === ht.value
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={ht.image}
                    alt={ht.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className={`py-2 text-center ${data.hairType === ht.value ? 'bg-primary/5' : 'bg-white'}`}>
                  <span className={`text-[11px] font-semibold ${data.hairType === ht.value ? 'text-primary' : 'text-gray-500'}`}>
                    {ht.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cor do Cabelo</label>
              <input
                type="text"
                value={data.hairColor}
                onChange={(e) => update({ hairColor: e.target.value })}
                placeholder="Ex: Castanho escuro, Loiro platinado..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <Select
              label="Comprimento"
              value={data.hairLength}
              onChange={(e) => update({ hairLength: e.target.value })}
              placeholder="Selecione"
              options={hairLengthOptions}
            />
          </div>
        </div>

        {/* Eye Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cor dos Olhos</label>
          <div className="flex gap-3 flex-wrap">
            {eyeColors.map((eye) => (
              <button
                key={eye.value}
                onClick={() => update({ eyeColor: eye.value })}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer
                  ${data.eyeColor === eye.value
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: eye.color }} />
                <span className="text-xs font-medium text-gray-700">{eye.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Extras — free text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Extras <span className="text-gray-400 font-normal text-xs">(opcional)</span>
          </label>
          <textarea
            value={extrasText}
            onChange={(e) => handleExtrasChange(e.target.value)}
            placeholder="Sardas, tatuagem no braço esquerdo, piercing no nariz, covinhas..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
          <p className="text-[11px] text-gray-400 mt-1">Separe com vírgula. Descreva livremente as características únicas.</p>
        </div>
      </div>
    </Card>
  );
}

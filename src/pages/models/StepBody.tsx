import { Card, Select } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

const skinTones = [
  { value: 'porcelain', label: 'Porcelana', color: '#FDEBD0' },
  { value: 'fair', label: 'Clara', color: '#F5CBA7' },
  { value: 'light', label: 'Leve', color: '#E8B98B' },
  { value: 'medium', label: 'Média', color: '#D4956B' },
  { value: 'olive', label: 'Oliva', color: '#C68642' },
  { value: 'tan', label: 'Bronzeada', color: '#A56B3E' },
  { value: 'brown', label: 'Morena', color: '#8D5524' },
  { value: 'dark', label: 'Escura', color: '#5C3317' },
];

const bodyTypes = [
  { value: 'slim', label: 'Slim', icon: '🏃‍♀️' },
  { value: 'athletic', label: 'Athletic', icon: '💪' },
  { value: 'average', label: 'Average', icon: '👤' },
  { value: 'curvy', label: 'Curvy', icon: '✨' },
  { value: 'plus', label: 'Plus Size', icon: '🌸' },
];

const eyeColors = [
  { value: 'brown', label: 'Castanho', color: '#8B4513' },
  { value: 'hazel', label: 'Avelã', color: '#9B7D4C' },
  { value: 'green', label: 'Verde', color: '#2E8B57' },
  { value: 'blue', label: 'Azul', color: '#4169E1' },
  { value: 'gray', label: 'Cinza', color: '#808080' },
  { value: 'amber', label: 'Âmbar', color: '#FFBF00' },
];

const hairColorOptions = [
  { value: 'black', label: 'Preto' },
  { value: 'brown', label: 'Castanho' },
  { value: 'blonde', label: 'Loiro' },
  { value: 'red', label: 'Ruivo' },
  { value: 'platinum', label: 'Platinado' },
  { value: 'pink', label: 'Rosa' },
];
const hairTypeOptions = [
  { value: 'straight', label: 'Liso' },
  { value: 'wavy', label: 'Ondulado' },
  { value: 'curly', label: 'Cacheado' },
  { value: 'coily', label: 'Crespo' },
];
const hairLengthOptions = [
  { value: 'short', label: 'Curto' },
  { value: 'medium', label: 'Médio' },
  { value: 'long', label: 'Longo' },
  { value: 'extra-long', label: 'Extra Longo' },
];

const extraOptions = ['Sardas', 'Tatuagens', 'Piercings', 'Cicatrizes', 'Covinhas', 'Pintas'];

export function StepBody({ data, update }: Props) {
  const toggleExtra = (extra: string) => {
    update({
      extras: data.extras.includes(extra)
        ? data.extras.filter((e) => e !== extra)
        : [...data.extras, extra],
    });
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-sidebar mb-1">Características Físicas</h3>
      <p className="text-sm text-gray-500 mb-5">Defina o corpo e aparência da modelo</p>

      <div className="space-y-6">
        {/* Skin Tone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tom de Pele</label>
          <div className="flex gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => update({ skinTone: tone.value })}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all cursor-pointer
                  hover:scale-110
                  ${data.skinTone === tone.value ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-gray-200'}
                `}
                style={{ backgroundColor: tone.color }}
                title={tone.label}
              />
            ))}
          </div>
          {data.skinTone && (
            <p className="text-xs text-gray-500 mt-1.5">
              {skinTones.find(t => t.value === data.skinTone)?.label}
            </p>
          )}
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Corpo</label>
          <div className="grid grid-cols-5 gap-2">
            {bodyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => update({ bodyType: type.value })}
                className={`
                  p-3 rounded-xl border-2 text-center transition-all cursor-pointer
                  ${data.bodyType === type.value
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <span className="text-xl block">{type.icon}</span>
                <span className="text-[10px] font-semibold text-gray-600 mt-1 block">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Altura: {data.height}cm
          </label>
          <input
            type="range"
            min={155}
            max={185}
            value={data.height}
            onChange={(e) => update({ height: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>155cm</span>
            <span>185cm</span>
          </div>
        </div>

        {/* Hair */}
        <div className="grid grid-cols-3 gap-4">
          <Select label="Cor do Cabelo" value={data.hairColor} onChange={(e) => update({ hairColor: e.target.value })} placeholder="Selecione" options={hairColorOptions} />
          <Select label="Tipo" value={data.hairType} onChange={(e) => update({ hairType: e.target.value })} placeholder="Selecione" options={hairTypeOptions} />
          <Select label="Comprimento" value={data.hairLength} onChange={(e) => update({ hairLength: e.target.value })} placeholder="Selecione" options={hairLengthOptions} />
        </div>

        {/* Eye Color */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cor dos Olhos</label>
          <div className="flex gap-3">
            {eyeColors.map((eye) => (
              <button
                key={eye.value}
                onClick={() => update({ eyeColor: eye.value })}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer
                  ${data.eyeColor === eye.value
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: eye.color }} />
                <span className="text-xs font-medium text-gray-700">{eye.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Extras */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Extras</label>
          <div className="flex flex-wrap gap-2">
            {extraOptions.map((extra) => (
              <button
                key={extra}
                onClick={() => toggleExtra(extra)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer
                  ${data.extras.includes(extra)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
                `}
              >
                {extra}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

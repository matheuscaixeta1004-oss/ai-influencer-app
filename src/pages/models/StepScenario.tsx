import { Card, Select } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

const environments = [
  { value: 'bedroom', label: '🛏️ Quarto', icon: '🛏️' },
  { value: 'apartment', label: '🏠 Apartamento', icon: '🏠' },
  { value: 'beach', label: '🏖️ Praia', icon: '🏖️' },
  { value: 'city', label: '🏙️ Cidade', icon: '🏙️' },
  { value: 'nature', label: '🌿 Natureza', icon: '🌿' },
];

const roomStyles = [
  { value: 'modern', label: 'Moderno' },
  { value: 'cozy', label: 'Aconchegante' },
  { value: 'luxury', label: 'Luxo' },
  { value: 'minimalist', label: 'Minimalista' },
  { value: 'bohemian', label: 'Boêmio' },
];

const lightingOptions = [
  { value: 'natural', label: '☀️ Natural', desc: 'Luz do dia, janelas abertas' },
  { value: 'golden', label: '🌅 Dourada', desc: 'Golden hour, tons quentes' },
  { value: 'dramatic', label: '🎭 Dramática', desc: 'Alto contraste, sombras fortes' },
  { value: 'studio', label: '💡 Estúdio', desc: 'Iluminação profissional, clean' },
];

const personalityOptions = [
  'Sensual', 'Inocente', 'Confiante', 'Misteriosa', 'Alegre',
  'Sofisticada', 'Selvagem', 'Tímida', 'Provocante', 'Elegante',
  'Esportiva', 'Artística',
];

export function StepScenario({ data, update }: Props) {
  const toggleTag = (tag: string) => {
    update({
      personalityTags: data.personalityTags.includes(tag)
        ? data.personalityTags.filter((t) => t !== tag)
        : [...data.personalityTags, tag],
    });
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-sidebar mb-1">Cenário & Estilo</h3>
      <p className="text-sm text-gray-500 mb-5">Define o ambiente e personalidade visual</p>

      <div className="space-y-6">
        {/* Environment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ambiente</label>
          <div className="grid grid-cols-5 gap-2">
            {environments.map((env) => (
              <button
                key={env.value}
                onClick={() => update({ environment: env.value })}
                className={`
                  p-3 rounded-xl border-2 text-center transition-all cursor-pointer
                  ${data.environment === env.value
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <span className="text-2xl block">{env.icon}</span>
                <span className="text-[10px] font-semibold text-gray-600 mt-1 block">
                  {env.label.replace(/^[^\s]+\s/, '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Room sub-style (only if bedroom/apartment) */}
        {(data.environment === 'bedroom' || data.environment === 'apartment') && (
          <Select
            label="Sub-estilo do ambiente"
            value={data.roomStyle}
            onChange={(e) => update({ roomStyle: e.target.value })}
            placeholder="Selecione o estilo"
            options={roomStyles}
          />
        )}

        {/* Lighting */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Iluminação</label>
          <div className="grid grid-cols-2 gap-3">
            {lightingOptions.map((light) => (
              <button
                key={light.value}
                onClick={() => update({ lighting: light.value })}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all cursor-pointer
                  ${data.lighting === light.value
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <p className="text-sm font-semibold text-sidebar">{light.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{light.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Personality Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Personalidade Visual <span className="text-gray-400 font-normal">(multiselect)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {personalityOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer
                  ${data.personalityTags.includes(tag)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
          {data.personalityTags.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {data.personalityTags.length} selecionados
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

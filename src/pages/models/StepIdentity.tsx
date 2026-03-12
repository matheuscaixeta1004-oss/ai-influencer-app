import { Card, Input, Select } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

const ethnicityOptions = [
  { value: 'asian', label: 'Asiática' },
  { value: 'black', label: 'Negra' },
  { value: 'caucasian', label: 'Caucasiana' },
  { value: 'latina', label: 'Latina' },
  { value: 'middle-eastern', label: 'Oriente Médio' },
  { value: 'mixed', label: 'Mista' },
  { value: 'south-asian', label: 'Sul-Asiática' },
];

const nicheOptions = [
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'adult', label: 'Adult' },
];

export function StepIdentity({ data, update }: Props) {
  return (
    <Card>
      <h3 className="text-lg font-bold text-sidebar mb-1">Identidade</h3>
      <p className="text-sm text-gray-500 mb-5">Informações básicas da sua modelo</p>

      <div className="space-y-4">
        <Input
          label="Nome"
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Ex: Aiyara, Luna, Nova..."
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Idade: {data.age} anos
          </label>
          <input
            type="range"
            min={18}
            max={35}
            value={data.age}
            onChange={(e) => update({ age: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>18</span>
            <span>35</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Etnia"
            value={data.ethnicity}
            onChange={(e) => update({ ethnicity: e.target.value })}
            placeholder="Selecione"
            options={ethnicityOptions}
          />
          <Select
            label="Nicho"
            value={data.niche}
            onChange={(e) => update({ niche: e.target.value })}
            placeholder="Selecione"
            options={nicheOptions}
          />
        </div>

        <Input
          label="Localidade"
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="Ex: São Paulo, BR"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Bio <span className="text-gray-400 font-normal">({data.bio.length}/200)</span>
          </label>
          <textarea
            value={data.bio}
            onChange={(e) => update({ bio: e.target.value.slice(0, 200) })}
            placeholder="Descreva a personalidade e vibe da modelo..."
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>
      </div>
    </Card>
  );
}

import { Card, Input } from '../../components/ui';
import type { ModelFormData } from './CreateModelWizard';

interface Props {
  data: ModelFormData;
  update: (partial: Partial<ModelFormData>) => void;
}

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Idade</label>
            <input
              type="number"
              min={18}
              max={99}
              value={data.age}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v >= 0 && v <= 99) update({ age: v });
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Ex: 25"
            />
          </div>
          <Input
            label="Etnia"
            value={data.ethnicity}
            onChange={(e) => update({ ethnicity: e.target.value })}
            placeholder="Ex: Latina, Asiática, Mista..."
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
            Bio / Personalidade <span className="text-gray-400 font-normal">({data.bio.length}/200)</span>
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

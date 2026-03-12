import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, StepIndicator, Badge } from '../../components/ui';
import { CREDITS } from '../../types';
import { StepIdentity } from './StepIdentity';
import { StepFace } from './StepFace';
import { StepBody } from './StepBody';
import { StepScenario } from './StepScenario';

export interface ModelFormData {
  // Step 1 — Identity
  name: string;
  age: number;
  ethnicity: string;
  location: string;
  niche: string;
  bio: string;
  // Step 2 — Face (photos)
  photos: File[];
  photoPreviews: string[];
  // Step 3 — Body
  skinTone: string;
  bodyType: string;
  height: number;
  hairColor: string;
  hairType: string;
  hairLength: string;
  eyeColor: string;
  extras: string[];
  // Step 4 — Scenario
  environment: string;
  roomStyle: string;
  lighting: string;
  personalityTags: string[];
}

const initialData: ModelFormData = {
  name: '',
  age: 23,
  ethnicity: '',
  location: '',
  niche: '',
  bio: '',
  photos: [],
  photoPreviews: [],
  skinTone: '',
  bodyType: '',
  height: 165,
  hairColor: '',
  hairType: '',
  hairLength: '',
  eyeColor: '',
  extras: [],
  environment: '',
  roomStyle: '',
  lighting: '',
  personalityTags: [],
};

const steps = [
  { label: 'Identidade', description: 'Nome, nicho, bio' },
  { label: 'Rosto', description: 'Upload de fotos' },
  { label: 'Corpo', description: 'Características físicas' },
  { label: 'Cenário', description: 'Ambiente e estilo' },
];

export function CreateModelWizard() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<ModelFormData>(initialData);
  const [creating, setCreating] = useState(false);

  const update = (partial: Partial<ModelFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const next = () => setCurrent((s) => Math.min(s + 1, 4));
  const prev = () => setCurrent((s) => Math.max(s - 1, 0));

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      navigate('/models');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-sidebar">Criar Nova Modelo</h2>
          <p className="text-sm text-gray-500">Preencha as informações em 4 passos</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/models')}>
          ✕ Cancelar
        </Button>
      </div>

      <StepIndicator steps={steps} current={current} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {current === 0 && <StepIdentity data={data} update={update} />}
          {current === 1 && <StepFace data={data} update={update} />}
          {current === 2 && <StepBody data={data} update={update} />}
          {current === 3 && <StepScenario data={data} update={update} />}
          {current === 4 && (
            <Card>
              <h3 className="text-lg font-bold text-sidebar mb-4">Resumo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Identidade</p>
                  <p className="font-semibold text-sidebar">{data.name || '—'}</p>
                  <p className="text-gray-500">{data.age} anos · {data.ethnicity || '—'}</p>
                  <p className="text-gray-500">{data.location || '—'}</p>
                  <Badge variant="primary" className="mt-1">{data.niche || '—'}</Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Fotos</p>
                  <p className="font-semibold text-sidebar">{data.photos.length} fotos</p>
                  {data.photoPreviews.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {data.photoPreviews.slice(0, 4).map((url, i) => (
                        <img key={i} src={url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      ))}
                      {data.photoPreviews.length > 4 && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          +{data.photoPreviews.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Corpo</p>
                  <p className="text-gray-500">Pele: {data.skinTone || '—'}</p>
                  <p className="text-gray-500">Tipo: {data.bodyType || '—'}</p>
                  <p className="text-gray-500">Altura: {data.height}cm</p>
                  <p className="text-gray-500">Cabelo: {data.hairColor} {data.hairType} {data.hairLength}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Cenário</p>
                  <p className="text-gray-500">Ambiente: {data.environment || '—'}</p>
                  <p className="text-gray-500">Iluminação: {data.lighting || '—'}</p>
                  {data.personalityTags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {data.personalityTags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{CREDITS.CREATE_MODEL} créditos</Badge>
                  <span className="text-xs text-gray-400">serão debitados</span>
                </div>
                <p className="text-xs text-gray-500">{data.bio}</p>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={prev} disabled={current === 0}>
          ← Voltar
        </Button>
        {current < 4 ? (
          <Button onClick={next}>
            Próximo →
          </Button>
        ) : (
          <Button onClick={handleCreate} loading={creating}>
            🚀 Criar Modelo ({CREDITS.CREATE_MODEL} créditos)
          </Button>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, StepIndicator, Badge } from '../../components/ui';
import { CREDITS } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createModel, uploadModelPhotos } from '../../lib/models';
import { deductCredits } from '../../lib/credits';
import { StepIdentity } from './StepIdentity';
import { StepFace } from './StepFace';
import { StepBody } from './StepBody';

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
  breastSize: string;
  buttSize: string;
  height: number;
  hairColor: string;
  hairType: string;
  hairLength: string;
  eyeColor: string;
  extras: string[];
  // Legacy (kept for compatibility)
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
  breastSize: '',
  buttSize: '',
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
  { title: 'Identidade', description: 'Nome, idade, etnia' },
  { title: 'Rosto', description: 'Fotos de referência' },
  { title: 'Corpo', description: 'Características físicas' },
];

export function CreateModelWizard() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ModelFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateData = (partial: Partial<ModelFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const canAdvance = () => {
    switch (currentStep) {
      case 0: return !!formData.name && !!formData.ethnicity;
      case 1: return formData.photos.length >= 1;
      case 2: return !!formData.skinTone && !!formData.bodyType && !!formData.breastSize && !!formData.buttSize;
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    if (!profile) {
      setError('Perfil não carregado. Recarregue a página e tente novamente.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      // Check credits
      if (!profile.is_dev && profile.credits < CREDITS.CREATE_MODEL) {
        setError(`Créditos insuficientes. Você precisa de ${CREDITS.CREATE_MODEL} créditos para criar um modelo.`);
        setSaving(false);
        return;
      }

      // Deduct credits
      console.log('[Wizard] Deducting credits...');
      const ok = await deductCredits(user.id, CREDITS.CREATE_MODEL, `Novo modelo: ${formData.name}`);
      if (!ok) {
        setError('Falha ao deduzir créditos. Tente novamente.');
        setSaving(false);
        return;
      }

      // Create model
      console.log('[Wizard] Creating model...');
      const model = await createModel(user.id, {
        name: formData.name,
        age: formData.age,
        ethnicity: formData.ethnicity,
        location: formData.location,
        niche: formData.niche,
        bio: formData.bio,
        config: {
          skinTone: formData.skinTone,
          bodyType: formData.bodyType,
          breastSize: formData.breastSize,
          buttSize: formData.buttSize,
          height: formData.height,
          hairColor: formData.hairColor,
          hairType: formData.hairType,
          hairLength: formData.hairLength,
          eyeColor: formData.eyeColor,
          extras: formData.extras,
        },
      });
      console.log('[Wizard] Model created:', model.id);

      // Upload photos (non-blocking — don't let this block navigation)
      if (formData.photos.length > 0) {
        console.log('[Wizard] Uploading photos...');
        try {
          await uploadModelPhotos(model.id, formData.photos);
          console.log('[Wizard] Photos uploaded');
        } catch (uploadErr) {
          console.error('[Wizard] Photo upload failed (model still created):', uploadErr);
        }
      }

      // Refresh profile (credits updated)
      await refreshProfile().catch(() => {});

      // Navigate to models list
      navigate('/models');
    } catch (err) {
      console.error('[Wizard] Error:', err);
      setError(err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-black" style={{ letterSpacing: '-0.02em' }}>
            Criar Novo Modelo
          </h1>
          <p className="text-[14px] text-gray-400 mt-1">
            Etapa {currentStep + 1} de {steps.length} — {steps[currentStep].description}
          </p>
        </div>
        <Badge variant="warning">{CREDITS.CREATE_MODEL} créditos</Badge>
      </div>

      <StepIndicator
        steps={steps.map((s) => ({ label: s.title, description: s.description }))}
        current={currentStep}
      />

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200/50 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <Card className="!p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && <StepIdentity data={formData} update={updateData} />}
            {currentStep === 1 && <StepFace data={formData} update={updateData} />}
            {currentStep === 2 && <StepBody data={formData} update={updateData} />}
          </motion.div>
        </AnimatePresence>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => currentStep === 0 ? navigate('/models') : setCurrentStep((s) => s - 1)}
        >
          {currentStep === 0 ? 'Cancelar' : 'Voltar'}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            Próxima Etapa
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!canAdvance() || saving}
            loading={saving}
          >
            {saving ? 'Criando Modelo...' : `Criar Modelo · ${CREDITS.CREATE_MODEL} créditos`}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

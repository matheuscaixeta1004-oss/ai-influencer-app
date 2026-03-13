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
  { title: 'Identity', description: 'Name, age, niche' },
  { title: 'Face', description: 'Reference photos' },
  { title: 'Body', description: 'Physical traits' },
  { title: 'Scenario', description: 'Style & personality' },
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
      case 0: return !!formData.name && !!formData.ethnicity && !!formData.niche;
      case 1: return formData.photos.length >= 1;
      case 2: return !!formData.skinTone && !!formData.bodyType;
      case 3: return !!formData.environment;
      default: return false;
    }
  };

  const handleFinish = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setError('');

    try {
      // Check credits
      if (!profile.is_dev && profile.credits < CREDITS.CREATE_MODEL) {
        setError(`Not enough credits. You need ${CREDITS.CREATE_MODEL} credits to create a model.`);
        setSaving(false);
        return;
      }

      // Deduct credits
      const ok = await deductCredits(user.id, CREDITS.CREATE_MODEL, `New model: ${formData.name}`);
      if (!ok) {
        setError('Failed to deduct credits. Please try again.');
        setSaving(false);
        return;
      }

      // Create model
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
          height: formData.height,
          hairColor: formData.hairColor,
          hairType: formData.hairType,
          hairLength: formData.hairLength,
          eyeColor: formData.eyeColor,
          extras: formData.extras,
          environment: formData.environment,
          roomStyle: formData.roomStyle,
          lighting: formData.lighting,
          personalityTags: formData.personalityTags,
        },
      });

      // Upload photos
      if (formData.photos.length > 0) {
        await uploadModelPhotos(model.id, formData.photos);
      }

      // Refresh profile (credits updated)
      await refreshProfile();

      // Navigate to models list
      navigate('/models');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
            Create New Model
          </h1>
          <p className="text-[14px] text-gray-400 mt-1">
            Step {currentStep + 1} of {steps.length} — {steps[currentStep].description}
          </p>
        </div>
        <Badge variant="warning">{CREDITS.CREATE_MODEL} credits</Badge>
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
            {currentStep === 3 && <StepScenario data={formData} update={updateData} />}
          </motion.div>
        </AnimatePresence>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={() => currentStep === 0 ? navigate('/models') : setCurrentStep((s) => s - 1)}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={!canAdvance() || saving}
            loading={saving}
          >
            {saving ? 'Creating Model...' : `Create Model · ${CREDITS.CREATE_MODEL} credits`}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

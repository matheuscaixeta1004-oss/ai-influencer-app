import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Button, Badge, Input, Select } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { getModel, getModelPhotos, uploadModelPhotos } from '../../lib/models';
import { supabase } from '../../lib/supabase';
import type { AIModel, ModelPhoto } from '../../types';

/* ─── Photo Card Selector (same as StepBody) ─── */
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
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              selected === opt.value ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img src={opt.image} alt={opt.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div className={`py-2 px-1 text-center ${selected === opt.value ? 'bg-primary/5' : 'bg-white'}`}>
              <span className={`text-[11px] font-semibold ${selected === opt.value ? 'text-primary' : 'text-gray-600'}`}>{opt.label}</span>
            </div>
            {selected === opt.value && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Reference data ─── */
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
const hairTypeOptions: PhotoOption[] = [
  { value: 'straight', label: 'Liso', image: '/images/references/hair/straight.jpg' },
  { value: 'wavy', label: 'Ondulado', image: '/images/references/hair/wavy.jpg' },
  { value: 'curly', label: 'Cacheado', image: '/images/references/hair/curly.jpg' },
  { value: 'coily', label: 'Crespo', image: '/images/references/hair/coily.jpg' },
];
const hairLengthOpts = [
  { value: 'short', label: 'Curto' },
  { value: 'medium', label: 'Médio' },
  { value: 'long', label: 'Longo' },
  { value: 'extra-long', label: 'Extra Longo' },
];
const eyeColors = [
  { value: 'brown', label: 'Castanho', color: '#8B4513' },
  { value: 'hazel', label: 'Avelã', color: '#9B7D4C' },
  { value: 'green', label: 'Verde', color: '#2E8B57' },
  { value: 'blue', label: 'Azul', color: '#4169E1' },
  { value: 'gray', label: 'Cinza', color: '#808080' },
  { value: 'amber', label: 'Âmbar', color: '#FFBF00' },
];

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function EditModel() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [model, setModel] = useState<AIModel | null>(null);
  const [photos, setPhotos] = useState<ModelPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable fields
  const [name, setName] = useState('');
  const [age, setAge] = useState(23);
  const [ethnicity, setEthnicity] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [extrasText, setExtrasText] = useState('');

  // New photos to upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const updateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!id) return;
    loadModel();
  }, [id]);

  const loadModel = async () => {
    try {
      const m = await getModel(id!);
      if (!m) { navigate('/models'); return; }
      setModel(m);
      setName(m.name);
      setAge(m.age || 23);
      setEthnicity(m.ethnicity);
      setLocation(m.location || '');
      setBio(m.bio || '');
      const cfg = (m.config as Record<string, any>) || {};
      setConfig(cfg);
      setExtrasText((cfg.extras || []).join(', '));

      const p = await getModelPhotos(id!);
      setPhotos(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFiles = useCallback((files: File[]) => {
    const valid = files.filter(f => ACCEPTED_TYPES.includes(f.type));
    const previews = valid.map(f => URL.createObjectURL(f));
    setNewFiles(prev => [...prev, ...valid]);
    setNewPreviews(prev => [...prev, ...previews]);
  }, []);

  const removeNewFile = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const deleteExistingPhoto = async (photo: ModelPhoto) => {
    try {
      await supabase.storage.from('model-photos').remove([photo.storage_path]);
      await supabase.from('model_photos').delete().eq('id', photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  const handleSave = async () => {
    if (!user || !model) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update model record
      const extras = extrasText.split(',').map(s => s.trim()).filter(Boolean);
      const updatedConfig = { ...config, extras };

      const { error: updateErr } = await supabase
        .from('ai_models')
        .update({
          name,
          age,
          ethnicity,
          location,
          bio,
          config: updatedConfig,
          updated_at: new Date().toISOString(),
        })
        .eq('id', model.id);

      if (updateErr) throw updateErr;

      // Upload new photos
      if (newFiles.length > 0) {
        await uploadModelPhotos(model.id, newFiles);
        setNewFiles([]);
        setNewPreviews([]);
        // Reload photos
        const p = await getModelPhotos(model.id);
        setPhotos(p);
      }

      setSuccess('Modelo atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('[Edit] Error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Carregando modelo...</p>
        </div>
      </div>
    );
  }

  if (!model) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/models')} className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Voltar
          </button>
          <h1 className="text-[22px] font-medium text-black" style={{ letterSpacing: '-0.02em' }}>
            Editar Modelo
          </h1>
        </div>
        <Badge variant="default">{model.status === 'active' ? 'Ativo' : model.status === 'draft' ? 'Rascunho' : 'Treinando'}</Badge>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200/50 text-[13px] text-red-600">{error}</div>}
      {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200/50 text-[13px] text-emerald-600">{success}</div>}

      {/* Identity */}
      <Card className="!p-6">
        <h3 className="text-[15px] font-semibold text-black mb-4">Identidade</h3>
        <div className="space-y-4">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Idade</label>
              <input type="number" min={18} max={99} value={age} onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <Input label="Etnia" value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} />
          </div>
          <Input label="Localidade" value={location} onChange={(e) => setLocation(e.target.value)} />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio ({bio.length}/200)</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 200))} rows={3} maxLength={200}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
        </div>
      </Card>

      {/* Photos */}
      <Card className="!p-6">
        <h3 className="text-[15px] font-semibold text-black mb-4">Fotos do Rosto ({photos.length + newFiles.length})</h3>

        {/* Existing photos */}
        {photos.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-4">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative group aspect-square">
                <img src={photo.url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
                <button onClick={() => deleteExistingPhoto(photo)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm">
                  ✕
                </button>
                {photo.is_primary && <div className="absolute bottom-1 left-1"><Badge variant="primary">Principal</Badge></div>}
              </div>
            ))}
          </div>
        )}

        {/* New photos preview */}
        {newPreviews.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-4">
            {newPreviews.map((url, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={url} alt={`Nova ${i + 1}`} className="w-full h-full object-cover rounded-xl ring-2 ring-primary/30" />
                <button onClick={() => removeNewFile(i)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm">
                  ✕
                </button>
                <div className="absolute bottom-1 left-1"><Badge variant="warning">Nova</Badge></div>
              </div>
            ))}
          </div>
        )}

        {/* Upload */}
        <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all">
          <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => {
            if (e.target.files) handleAddFiles(Array.from(e.target.files));
            e.target.value = '';
          }} />
          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
          <p className="text-[13px] text-gray-400">Clique para adicionar mais fotos</p>
          <p className="text-[11px] text-gray-300 mt-1">JPG, PNG ou WEBP, máx 10MB</p>
        </label>
      </Card>

      {/* Physical characteristics */}
      <Card className="!p-6">
        <h3 className="text-[15px] font-semibold text-black mb-5">Características Físicas</h3>
        <div className="space-y-8">
          <PhotoCardGrid label="Tom de Pele" options={skinTones} selected={config.skinTone || ''} onSelect={(v) => updateConfig('skinTone', v)} columns={6} />
          <PhotoCardGrid label="Tipo de Corpo" options={bodyTypes} selected={config.bodyType || ''} onSelect={(v) => updateConfig('bodyType', v)} columns={5} />
          <PhotoCardGrid label="Tamanho do Busto" options={breastSizes} selected={config.breastSize || ''} onSelect={(v) => updateConfig('breastSize', v)} columns={4} />
          <PhotoCardGrid label="Tamanho do Bumbum" options={buttSizes} selected={config.buttSize || ''} onSelect={(v) => updateConfig('buttSize', v)} columns={4} />

          {/* Height */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Altura: {config.height || 165}cm</label>
            <input type="range" min={145} max={195} value={config.height || 165} onChange={(e) => updateConfig('height', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>145cm</span><span>195cm</span></div>
          </div>

          {/* Hair */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Cabelo</label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {hairTypeOptions.map((ht) => (
                <button key={ht.value} onClick={() => updateConfig('hairType', ht.value)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    config.hairType === ht.value ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img src={ht.image} alt={ht.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <div className={`py-2 text-center ${config.hairType === ht.value ? 'bg-primary/5' : 'bg-white'}`}>
                    <span className={`text-[11px] font-semibold ${config.hairType === ht.value ? 'text-primary' : 'text-gray-500'}`}>{ht.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cor do Cabelo</label>
                <input type="text" value={config.hairColor || ''} onChange={(e) => updateConfig('hairColor', e.target.value)} placeholder="Ex: Castanho escuro..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              </div>
              <Select label="Comprimento" value={config.hairLength || ''} onChange={(e) => updateConfig('hairLength', e.target.value)} placeholder="Selecione" options={hairLengthOpts} />
            </div>
          </div>

          {/* Eye Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor dos Olhos</label>
            <div className="flex gap-3 flex-wrap">
              {eyeColors.map((eye) => (
                <button key={eye.value} onClick={() => updateConfig('eyeColor', eye.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    config.eyeColor === eye.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: eye.color }} />
                  <span className="text-xs font-medium text-gray-700">{eye.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Extras <span className="text-gray-400 font-normal text-xs">(opcional)</span></label>
            <textarea value={extrasText} onChange={(e) => setExtrasText(e.target.value)} placeholder="Sardas, tatuagem no braço, piercing..." rows={2}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pb-8">
        <Button variant="secondary" onClick={() => navigate('/models')}>Cancelar</Button>
        <Button onClick={handleSave} loading={saving} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </motion.div>
  );
}

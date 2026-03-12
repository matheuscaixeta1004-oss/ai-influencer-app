import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Button, Select, Badge } from '../components/ui';
import { mockModels } from '../data/mock';
import { CREDITS } from '../types';

const styleOptions = [
  { value: 'golden-hour', label: '🌅 Golden Hour' },
  { value: 'editorial', label: '📸 Editorial' },
  { value: 'cyberpunk', label: '🌃 Cyberpunk' },
  { value: 'studio', label: '💡 Studio' },
  { value: 'casual', label: '👕 Casual' },
  { value: 'glamour', label: '✨ Glamour' },
];

const qualityOptions = [
  { value: 'standard', label: `Standard (${CREDITS.GENERATE_STANDARD} créditos)` },
  { value: 'hd', label: `HD (${CREDITS.GENERATE_HD} créditos)` },
];

export function Generate() {
  const [selectedModel, setSelectedModel] = useState('');
  const [quality, setQuality] = useState('standard');
  const [style, setStyle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const creditCost = quality === 'hd' ? CREDITS.GENERATE_HD : CREDITS.GENERATE_STANDARD;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-5">
          <Card>
            <CardHeader title="Gerar Conteúdo" subtitle="Crie imagens com IA para suas modelos" />

            <div className="space-y-4">
              <Select
                label="Modelo"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="Selecione uma modelo"
                options={mockModels.filter(m => m.status === 'active').map((m) => ({ value: m.id, label: m.name }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Qualidade"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  options={qualityOptions}
                />
                <Select
                  label="Estilo"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="Escolha um estilo"
                  options={styleOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Descreva a cena, pose, ambiente..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white text-sidebar placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">
                    {creditCost} créditos
                  </Badge>
                  <span className="text-xs text-gray-400">por geração</span>
                </div>
                <Button
                  onClick={handleGenerate}
                  loading={isGenerating}
                  disabled={!selectedModel || !style}
                >
                  {isGenerating ? 'Gerando...' : '✨ Gerar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Preview" />
            <div className="aspect-[3/4] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Gerando...</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <span className="text-4xl mb-2 block">🖼️</span>
                  <p className="text-sm">O resultado aparece aqui</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Custos" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Standard</span>
                <span className="font-semibold">{CREDITS.GENERATE_STANDARD} créditos</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">HD</span>
                <span className="font-semibold">{CREDITS.GENERATE_HD} créditos</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Criar modelo</span>
                <span className="font-semibold">{CREDITS.CREATE_MODEL} créditos</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Upload fotos</span>
                <span className="font-semibold text-emerald-600">Grátis</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

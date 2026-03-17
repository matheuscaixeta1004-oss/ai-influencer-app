import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CREDITS } from '../types';
import type { AIModel } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getModels, getModelPhotos } from '../lib/models';
import { deductCredits } from '../lib/credits';
import { supabase } from '../lib/supabase';

const scenarios = [
  { id: 'beach', emoji: '🏖️', label: 'Praia', prompt: 'Relaxing at a tropical beach, golden hour, bikini, ocean waves' },
  { id: 'gym', emoji: '💪', label: 'Academia', prompt: 'Post-workout selfie at the gym, sports bra, sweaty, confident' },
  { id: 'cafe', emoji: '☕', label: 'Café', prompt: 'Sitting at a trendy coffee shop, casual outfit, latte, warm light' },
  { id: 'nightout', emoji: '🍸', label: 'Balada', prompt: 'Rooftop bar at night, cocktail dress, city lights, glamorous' },
  { id: 'bedroom', emoji: '🛏️', label: 'Quarto', prompt: 'Morning in bed, oversized shirt, natural light, cozy intimate' },
  { id: 'urban', emoji: '🏙️', label: 'Rua', prompt: 'Walking down city street, trendy outfit, shopping bags, candid' },
  { id: 'pool', emoji: '🏊', label: 'Piscina', prompt: 'Luxury pool, swimsuit, palm trees, tropical villa, summer vibes' },
  { id: 'studio', emoji: '📸', label: 'Estúdio', prompt: 'Professional studio portrait, dramatic lighting, high fashion' },
  { id: 'mirror', emoji: '🪞', label: 'Espelho', prompt: 'Mirror selfie, stylish outfit, walk-in closet, full body' },
  { id: 'dinner', emoji: '🍷', label: 'Jantar', prompt: 'Candlelit restaurant dinner, elegant dress, wine glass, romantic' },
  { id: 'bath', emoji: '🛁', label: 'Banho', prompt: 'Bubble bath, candles, champagne glass, relaxing luxury' },
  { id: 'cooking', emoji: '🍳', label: 'Cozinha', prompt: 'Cooking in kitchen, casual wear, morning vibes, playful' },
];

const aspectRatios = [
  { id: '1:1', label: '1:1', w: 1, h: 1 },
  { id: '4:5', label: '4:5', w: 4, h: 5 },
  { id: '3:4', label: '3:4', w: 3, h: 4 },
  { id: '9:16', label: '9:16', w: 9, h: 16 },
];

const historyImages = [
  { id: 1, src: '/images/mosaic/1.jpg' },
  { id: 2, src: '/images/mosaic/7.jpg' },
  { id: 3, src: '/images/mosaic/4.jpg' },
  { id: 4, src: '/images/mosaic/15.jpg' },
  { id: 5, src: '/images/mosaic/11.jpg' },
  { id: 6, src: '/images/mosaic/19.jpg' },
  { id: 7, src: '/images/mosaic/3.jpg' },
  { id: 8, src: '/images/mosaic/9.jpg' },
];

interface ModelWithAvatar extends AIModel {
  _avatar: string;
  _photosCount: number;
}

export function Generate() {
  const { user, refreshProfile } = useAuth();
  const [models, setModels] = useState<ModelWithAvatar[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [aspectRatio, setAspectRatio] = useState('4:5');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<number | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const rawModels = await getModels();
      const withAvatars: ModelWithAvatar[] = await Promise.all(
        rawModels.map(async (m) => {
          const photos = await getModelPhotos(m.id);
          const primary = photos.find(p => p.is_primary) || photos[0];
          return {
            ...m,
            _avatar: primary?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
            _photosCount: photos.length,
          };
        })
      );
      setModels(withAvatars);
      if (withAvatars.length > 0 && !selectedModel) {
        setSelectedModel(withAvatars[0].id);
      }
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };

  const creditCost = quality === 'hd' ? CREDITS.GENERATE_HD : CREDITS.GENERATE_STANDARD;
  const activeModels = models.filter(m => m.status === 'active');
  const currentModel = models.find(m => m.id === selectedModel);
  const currentAR = aspectRatios.find(a => a.id === aspectRatio)!;

  const handleGenerate = async () => {
    if (!prompt || isGenerating || !user) return;
    setIsGenerating(true);
    setGeneratedImage('');
    setSelectedHistory(null);

    try {
      // Deduct credits
      const success = await deductCredits(user.id, creditCost, `Geração de foto — ${currentModel?.name || 'Desconhecido'} (${quality === 'standard' ? 'padrão' : 'HD'})`);
      if (!success) {
        alert('Créditos insuficientes!');
        setIsGenerating(false);
        return;
      }

      // Create content record
      await supabase.from('content').insert({
        user_id: user.id,
        model_id: selectedModel,
        prompt,
        image_url: `/images/mosaic/${Math.floor(Math.random() * 20) + 1}.jpg`,
        status: 'draft',
        credits_used: creditCost,
        metadata: { quality, aspectRatio },
      });

      // Refresh profile to update credits
      await refreshProfile();

      // Simulate generation delay
      setTimeout(() => {
        setIsGenerating(false);
        const idx = Math.floor(Math.random() * 20) + 1;
        setGeneratedImage(`/images/mosaic/${idx}.jpg`);
      }, 3000);
    } catch (err) {
      console.error('Generation failed:', err);
      setIsGenerating(false);
    }
  };

  const displayImage = selectedHistory !== null ? historyImages[selectedHistory]?.src : generatedImage;

  return (
    <div
      className="flex h-[calc(100vh-56px)] -mx-8 -my-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {/* ── MAIN CANVAS ── */}
      <div className="flex-1 flex flex-col relative">

        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center p-6 pb-0">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="relative w-16 h-16 mb-5">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping" />
                  <div className="relative w-16 h-16 rounded-2xl bg-primary/[0.08] flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                </div>
                <p className="text-[15px] font-medium text-black">Gerando...</p>
                <p className="text-[13px] text-gray-400 mt-1">~15-30 segundos</p>
                <div className="w-48 h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 3, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ) : displayImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative max-h-full"
              >
                <img
                  src={displayImage}
                  alt="Gerada"
                  className="max-h-[calc(100vh-200px)] rounded-xl object-contain shadow-[0_8px_40px_rgba(0,0,0,0.08)]"
                  style={{ aspectRatio: `${currentAR.w}/${currentAR.h}` }}
                />

                {/* Overlay actions */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 cursor-pointer transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 cursor-pointer transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                </div>

                {/* Model tag */}
                {currentModel && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-sm">
                    <img src={currentModel._avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[12px] text-white font-medium">{currentModel.name}</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
                  <svg className="w-9 h-9 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="text-[16px] font-medium text-gray-800">Crie algo incrível</p>
                <p className="text-[13px] text-gray-400 mt-1.5 max-w-xs">Descreva uma cena ou escolha um cenário abaixo, depois clique em Gerar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── BOTTOM PROMPT BAR ── */}
        <div className="px-6 pb-5 pt-4">
          <div
            className="relative rounded-2xl bg-white border border-gray-200/80 overflow-visible"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)' }}
          >
            {/* Prompt input */}
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                placeholder="Descreva a cena, ou escolha um cenário..."
                rows={2}
                className="flex-1 text-[14px] text-black placeholder:text-gray-300 resize-none focus:outline-none bg-transparent leading-relaxed"
              />

              {/* Model avatar + reference */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                {currentModel && (
                  <div className="relative">
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="flex items-center gap-0 cursor-pointer group"
                    >
                      <img src={currentModel._avatar} alt="" className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm group-hover:border-primary/30 transition-colors" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                    </button>

                    {/* Model picker dropdown */}
                    <AnimatePresence>
                      {showModelPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute bottom-14 right-0 w-52 bg-white rounded-xl border border-gray-200 shadow-lg p-2 z-50"
                        >
                          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 px-2 py-1.5">Personagem</p>
                          {activeModels.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => { setSelectedModel(m.id); setShowModelPicker(false); }}
                              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                                selectedModel === m.id ? 'bg-primary/[0.06]' : 'hover:bg-gray-50'
                              }`}
                            >
                              <img src={m._avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                              <div className="text-left">
                                <p className="text-[13px] font-medium text-black">{m.name}</p>
                                <p className="text-[10px] text-gray-400">{m._photosCount} fotos</p>
                              </div>
                              {selectedModel === m.id && (
                                <svg className="w-4 h-4 text-primary ml-auto" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Reference slot */}
                <button className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-primary/30 cursor-pointer transition-colors group">
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-primary/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                  className="h-10 px-5 rounded-xl text-[13px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                    boxShadow: 'inset -2px -3px 12px 0px rgba(255,255,255,0.12), inset 2px 2px 6px 0px rgba(0,0,0,0.15)',
                  }}
                >
                  {isGenerating ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <>
                      Gerar
                      <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center gap-1 px-4 pb-3 pt-0.5">
              {/* Character label */}
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-[12px] text-gray-500 cursor-pointer transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                {currentModel?.name || 'Personagem'}
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <div className="w-px h-4 bg-gray-100" />

              {/* Quality */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-[12px] text-gray-500 cursor-pointer transition-colors"
                >
                  {quality === 'hd' ? 'HD' : '1K'}
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute bottom-10 left-0 bg-white rounded-xl border border-gray-200 shadow-lg p-2 z-50 w-28"
                    >
                      {(['standard', 'hd'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => { setQuality(q); setShowSettings(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] cursor-pointer transition-colors ${
                            quality === q ? 'bg-primary/[0.06] text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {q === 'standard' ? '1K · Padrão' : 'HD · Alta Definição'}
                          <span className="block text-[10px] text-gray-400 mt-0.5">{q === 'standard' ? `${CREDITS.GENERATE_STANDARD} créditos` : `${CREDITS.GENERATE_HD} créditos`}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-4 bg-gray-100" />

              {/* Aspect ratio */}
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
                      aspectRatio === ar.id
                        ? 'bg-primary/[0.08] text-primary'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>

              <div className="w-px h-4 bg-gray-100" />

              {/* Explore scenarios */}
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-[12px] text-gray-500 cursor-pointer transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Explorar
              </button>

              {/* Credit cost */}
              <div className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                {creditCost} créditos por imagem
              </div>
            </div>

            {/* Scenarios dropdown */}
            <AnimatePresence>
              {showScenarios && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-6 gap-2">
                    {scenarios.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setPrompt(s.prompt); setShowScenarios(false); }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl hover:bg-primary/[0.04] cursor-pointer transition-colors"
                      >
                        <span className="text-[20px]">{s.emoji}</span>
                        <span className="text-[11px] font-medium text-gray-500">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── RIGHT: History strip ── */}
      <div className="w-[140px] border-l border-gray-100 bg-white flex flex-col">
        <div className="px-3 py-4">
          <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-gray-200 text-[11px] text-gray-400 hover:border-primary/30 hover:text-primary cursor-pointer transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Enviar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide">
          {historyImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedHistory(i)}
              className={`w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-150 ${
                selectedHistory === i
                  ? 'ring-2 ring-primary ring-offset-1'
                  : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-1'
              }`}
            >
              <img src={img.src} alt="" className="w-full aspect-[4/5] object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

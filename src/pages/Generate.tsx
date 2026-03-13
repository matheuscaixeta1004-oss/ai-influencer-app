import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockModels } from '../data/mock';
import { CREDITS } from '../types';

const scenarios = [
  { id: 'beach', label: 'Beach', emoji: '🏖️', prompt: 'Relaxing at a tropical beach, golden hour, bikini, ocean waves' },
  { id: 'gym', label: 'Gym', emoji: '💪', prompt: 'Post-workout selfie at the gym, sports bra, sweaty, confident' },
  { id: 'cafe', label: 'Café', emoji: '☕', prompt: 'Sitting at a trendy coffee shop, casual outfit, latte, warm light' },
  { id: 'nightout', label: 'Night Out', emoji: '🍸', prompt: 'Rooftop bar at night, cocktail dress, city lights, glamorous' },
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️', prompt: 'Morning in bed, oversized shirt, natural light, cozy intimate' },
  { id: 'urban', label: 'Street', emoji: '🏙️', prompt: 'Walking down city street, trendy outfit, shopping bags, candid' },
  { id: 'pool', label: 'Pool', emoji: '🏊', prompt: 'Luxury pool, swimsuit, palm trees, tropical villa, summer vibes' },
  { id: 'studio', label: 'Studio', emoji: '📸', prompt: 'Professional studio portrait, dramatic lighting, high fashion' },
  { id: 'mirror', label: 'Mirror', emoji: '🪞', prompt: 'Mirror selfie, stylish outfit, walk-in closet, full body' },
  { id: 'dinner', label: 'Dinner', emoji: '🍷', prompt: 'Candlelit restaurant dinner, elegant dress, wine glass, romantic' },
  { id: 'cooking', label: 'Kitchen', emoji: '🍳', prompt: 'Cooking in kitchen, casual wear, morning vibes, playful' },
  { id: 'bath', label: 'Bath', emoji: '🛁', prompt: 'Bubble bath, candles, champagne glass, relaxing luxury' },
];

const aspectRatios = [
  { id: '1:1', label: '1:1', w: 1, h: 1 },
  { id: '3:4', label: '3:4', w: 3, h: 4 },
  { id: '4:3', label: '4:3', w: 4, h: 3 },
  { id: '9:16', label: '9:16', w: 9, h: 16 },
];

const recentGenerations = [
  { id: 1, src: '/images/mosaic/1.jpg', model: 'Aiyara', time: '2m ago' },
  { id: 2, src: '/images/mosaic/7.jpg', model: 'Aiyara', time: '5m ago' },
  { id: 3, src: '/images/mosaic/4.jpg', model: 'Aiyara', time: '12m ago' },
  { id: 4, src: '/images/mosaic/15.jpg', model: 'Luna', time: '18m ago' },
  { id: 5, src: '/images/mosaic/11.jpg', model: 'Luna', time: '25m ago' },
  { id: 6, src: '/images/mosaic/19.jpg', model: 'Aiyara', time: '30m ago' },
];

export function Generate() {
  const [selectedModel, setSelectedModel] = useState('1');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [imageCount, setImageCount] = useState(1);

  const creditCost = (quality === 'hd' ? CREDITS.GENERATE_HD : CREDITS.GENERATE_STANDARD) * imageCount;
  const activeModels = mockModels.filter(m => m.status === 'active');
  const currentModel = mockModels.find(m => m.id === selectedModel);

  const handleScenario = (s: typeof scenarios[0]) => {
    setSelectedScenario(s.id);
    setPrompt(s.prompt);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedImage('');
    setTimeout(() => {
      setIsGenerating(false);
      // Pick a random mosaic image as "result"
      const idx = Math.floor(Math.random() * 20) + 1;
      setGeneratedImage(`/images/mosaic/${idx}.jpg`);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1100px] mx-auto"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <div className="flex gap-6">

        {/* ── LEFT: Controls ── */}
        <div className="w-[420px] flex-shrink-0 space-y-5">

          {/* Model Selector */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">Model</p>
            <div className="flex gap-2">
              {activeModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex-1 ${
                    selectedModel === m.id
                      ? 'border-primary bg-primary/[0.04] shadow-[0_0_0_1px_#00AFF0]'
                      : 'border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <img src={m._avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-black leading-tight">{m.name}</p>
                    <p className="text-[10px] text-gray-400">{m._photosCount} photos</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Presets */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">Scenario</p>
            <div className="grid grid-cols-4 gap-1.5">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleScenario(s)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center transition-all duration-150 cursor-pointer ${
                    selectedScenario === s.id
                      ? 'bg-primary/[0.06] border border-primary/20 shadow-[0_0_0_1px_rgba(0,175,240,0.15)]'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <span className="text-[18px]">{s.emoji}</span>
                  <span className={`text-[11px] font-medium ${selectedScenario === s.id ? 'text-primary' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Prompt</p>
              {prompt && (
                <button onClick={() => { setPrompt(''); setSelectedScenario(''); }} className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setSelectedScenario(''); }}
              placeholder="Describe the scene, pose, outfit, setting, lighting..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200/80 text-[14px] bg-gray-50/50 text-black placeholder:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 focus:bg-white resize-none"
            />
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {['confident pose', 'natural light', 'close-up', 'full body', 'looking at camera'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setPrompt(p => p ? `${p}, ${tag}` : tag)}
                  className="px-2.5 py-1 rounded-lg bg-gray-50 text-[11px] text-gray-500 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors border border-gray-100"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Row */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3">Settings</p>

            {/* Quality toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-gray-600">Quality</span>
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['standard', 'hd'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                      quality === q
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {q === 'standard' ? 'Standard' : 'HD'}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] text-gray-600">Aspect Ratio</span>
              <div className="flex gap-1.5">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
                      aspectRatio === ar.id
                        ? 'bg-primary/[0.08] border border-primary/20 text-primary'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <div
                      className={`border-2 rounded-sm ${aspectRatio === ar.id ? 'border-primary' : 'border-gray-300'}`}
                      style={{ width: `${ar.w * 4 + 4}px`, height: `${ar.h * 4 + 4}px` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Image count */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-600">Images</span>
              <div className="flex gap-1.5">
                {[1, 2, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setImageCount(n)}
                    className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                      imageCount === n
                        ? 'bg-primary/[0.08] border border-primary/20 text-primary'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={!selectedModel || !prompt || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[15px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
              style={{
                background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
              }}
            >
              {isGenerating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Generate · {creditCost} credits
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Canvas + History ── */}
        <div className="flex-1 space-y-5">

          {/* Generation Canvas */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Result</p>
              {generatedImage && (
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[3/4] bg-gray-50 rounded-xl flex flex-col items-center justify-center"
                >
                  {/* Animated generation state */}
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping" />
                    <div className="relative w-16 h-16 rounded-2xl bg-primary/[0.08] flex items-center justify-center">
                      <svg className="w-7 h-7 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[15px] font-medium text-black">Generating your image...</p>
                  <p className="text-[13px] text-gray-400 mt-1">This usually takes 15-30 seconds</p>

                  {/* Progress bar */}
                  <div className="w-48 h-1 bg-gray-200 rounded-full mt-5 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 3, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative group"
                >
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-xl object-cover"
                    style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                  />
                  {/* Model tag overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
                    <img src={currentModel?._avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[12px] text-white font-medium">{currentModel?.name}</span>
                    <span className="text-[11px] text-white/50">·</span>
                    <span className="text-[11px] text-white/50">{quality.toUpperCase()}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-[3/4] bg-gray-50/50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-gray-400">Your generated image will appear here</p>
                  <p className="text-[12px] text-gray-300 mt-1">Select a model and write a prompt to start</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Generations */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Recent</p>
              <span className="text-[11px] text-gray-300">{recentGenerations.length} images</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {recentGenerations.map((gen) => (
                <div key={gen.id} className="relative group cursor-pointer">
                  <img src={gen.src} alt="" className="w-full aspect-[3/4] object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-all duration-200 flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white font-medium">{gen.model}</span>
                      <span className="text-[10px] text-white/50">{gen.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

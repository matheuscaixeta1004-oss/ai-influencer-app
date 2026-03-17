import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';


import type { AIModel, Content } from '../types';
import { Skeleton } from '../components/ui';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

interface ModelWithMeta extends AIModel {
  _avatar: string;
  _photosCount: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [models, setModels] = useState<ModelWithMeta[]>([]);
  const [recentContent, setRecentContent] = useState<(Content & { _modelName: string; _thumbnail: string })[]>([]);
  const [creditsUsedToday, setCreditsUsedToday] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load everything in parallel — single batch
      const [modelsRes, allPhotosRes, contentRes, txnsRes] = await Promise.all([
        supabase.from('ai_models').select('*').order('created_at', { ascending: false }),
        supabase.from('model_photos').select('id, model_id, url, is_primary'),
        supabase.from('content').select('*, ai_models(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('credit_transactions').select('amount, created_at').eq('user_id', user.id).lt('amount', 0).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString()),
      ]);

      const rawModels = modelsRes.data || [];
      const allPhotos = allPhotosRes.data || [];

      // Group photos by model_id (no N+1)
      const photosByModel: Record<string, typeof allPhotos> = {};
      for (const p of allPhotos) {
        (photosByModel[p.model_id] ??= []).push(p);
      }

      const modelsWithMeta: ModelWithMeta[] = rawModels.map(m => {
        const photos = photosByModel[m.id] || [];
        const primary = photos.find(p => p.is_primary) || photos[0];
        return {
          ...m,
          _avatar: primary?.url || '',
          _photosCount: photos.length,
        };
      });
      setModels(modelsWithMeta);
      setTotalPhotos(allPhotos.length);

      // Content
      const enrichedContent = (contentRes.data || []).map((c: any) => ({
        ...c,
        _modelName: c.ai_models?.name || 'Desconhecido',
        _thumbnail: c.image_url || '',
      }));
      setRecentContent(enrichedContent);

      // Credits used today
      const usedToday = (txnsRes.data || []).reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
      setCreditsUsedToday(usedToday);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const creditsBalance = profile?.credits ?? 0;
  const userName = profile?.name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1100px] mx-auto"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >

      {/* ── Hero greeting with model preview ── */}
      <motion.div variants={item} className="relative rounded-2xl overflow-hidden mb-8">
        {/* Background mosaic strip */}
        <div className="absolute inset-0 flex gap-1">
          {['/images/mosaic/7.jpg', '/images/mosaic/19.jpg', '/images/mosaic/4.jpg', '/images/mosaic/15.jpg', '/images/mosaic/17.jpg'].map((src, i) => (
            <div key={i} className="flex-1">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />

        <div className="relative z-10 px-10 py-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 mb-3">Painel</p>
            <h1 className="text-[32px] font-medium text-white" style={{ letterSpacing: '-0.03em' }}>
              Bem-vindo de volta, <span className="text-primary">{userName}</span>
            </h1>
            <p className="text-[15px] text-white/70 mt-2">
              {loading ? 'Carregando...' : `Você tem ${models.length} modelos e ${totalPhotos} fotos.`}
            </p>
          </div>

          <div className="flex items-center gap-8">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="text-center">
                  <Skeleton className="h-7 w-12 bg-white/10 mb-1" />
                  <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
              ))
            ) : (
              [
                { value: models.length.toString(), label: 'Modelos' },
                { value: totalPhotos.toLocaleString(), label: 'Fotos' },
                { value: creditsBalance.toLocaleString(), label: 'Créditos' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-[24px] font-semibold text-white">{s.value}</p>
                  <p className="text-[11px] text-white/60 uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions — pill buttons ── */}
      <motion.div variants={item} className="flex items-center gap-2.5 mb-8">
        {[
          { label: 'Gerar Conteúdo', path: '/generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z', primary: true },
          { label: 'Studio', path: '/studio', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
          { label: 'Novo Modelo', path: '/models/create', icon: 'M12 4.5v15m7.5-7.5h-15' },
          { label: 'Galeria', path: '/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { label: 'Comprar Créditos', path: '/credits', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer ${
              a.primary
                ? 'text-white hover:brightness-110'
                : 'text-gray-500 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary'
            }`}
            style={a.primary ? {
              background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
              boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
            } : undefined}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
            </svg>
            {a.label}
          </button>
        ))}
      </motion.div>

      {/* ── Your Models — visual cards ── */}
      <motion.div variants={item} className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">Seus Modelos</p>
          <button onClick={() => navigate('/models')} className="text-[12px] font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors">
            Ver tudo
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden">
                <Skeleton className="h-[180px] rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 text-sm">Nenhum modelo ainda. Crie o seu primeiro!</p>
            <button
              onClick={() => navigate('/models/create')}
              className="mt-3 px-5 py-2 text-sm font-medium text-primary hover:text-primary-dark cursor-pointer"
            >
              Criar Modelo →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => navigate('/models')}
                className="rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
              >
                <div className="h-[180px] overflow-hidden relative">
                  <img
                    src={model._avatar}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                      model.status === 'active'
                        ? 'text-emerald-700 bg-emerald-100/90'
                        : model.status === 'training'
                        ? 'text-amber-700 bg-amber-100/90'
                        : 'text-gray-600 bg-gray-100/90'
                    }`}>
                      {model.status === 'active' ? 'Ativo' : model.status === 'training' ? 'Treinando' : 'Rascunho'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-black">{model.name}</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">{model.niche}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                    <div>
                      <p className="text-[14px] font-semibold text-black">{model._photosCount}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">Fotos</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Bottom row: Activity + Credits ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Recent Activity */}
        <motion.div variants={item} className="col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">Atividade Recente</p>
              <button onClick={() => navigate('/gallery')} className="text-[12px] font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors">
                Ver tudo
              </button>
            </div>

            {loading ? (
              <div className="px-6 pb-4 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : recentContent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum conteúdo ainda. Comece a gerar!</p>
            ) : (
              recentContent.map((c, i) => (
                <div key={c.id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <img src={c._thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-black truncate" style={{ letterSpacing: '-0.01em' }}>{c.prompt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-gray-400">{c._modelName}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                      <span className="text-[12px] text-gray-300">{new Date(c.created_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                    c.status === 'approved'
                      ? 'text-emerald-600 bg-emerald-50'
                      : c.status === 'archived'
                      ? 'text-gray-500 bg-gray-100'
                      : 'text-amber-600 bg-amber-50'
                  }`}>
                    {c.status === 'approved' ? 'Publicado' : c.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                  </span>
                  <span className="text-[12px] text-gray-300 w-10 text-right">{c.credits_used} cr</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div variants={item}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 h-full flex flex-col">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">Saldo de Créditos</p>

            <div className="flex-1">
              {loading ? (
                <Skeleton className="h-12 w-32" />
              ) : (
                <p className="text-[48px] font-bold text-black" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {creditsBalance.toLocaleString()}
                </p>
              )}
              <p className="text-[13px] text-gray-400 mt-2">{creditsUsedToday} créditos usados hoje</p>

              {/* Cost reference */}
              <div className="mt-6 space-y-2.5">
                {[
                  { label: 'Foto padrão', cost: '2 cr', icon: '🖼' },
                  { label: 'Foto HD', cost: '5 cr', icon: '✨' },
                  { label: 'Novo modelo', cost: '10 cr', icon: '👤' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="text-black font-medium">{r.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/credits')}
              className="mt-6 w-full py-3.5 rounded-xl text-[14px] font-medium text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
              }}
            >
              Comprar Créditos
            </button>
          </div>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="h-8" />
    </motion.div>
  );
}

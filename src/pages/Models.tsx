import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton, EmptyState } from '../components/ui';
import { CREDITS } from '../types';
import type { AIModel } from '../types';
import { getUserModels } from '../lib/models';
import { supabase } from '../lib/supabase';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Models() {
  const navigate = useNavigate();
  const [models, setModels] = useState<AIModel[]>([]);
  const [primaryPhotos, setPrimaryPhotos] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      // Batch: load models + all photos in parallel
      const [modelsRes, photosRes] = await Promise.all([
        getUserModels(),
        supabase.from('model_photos').select('model_id, url, is_primary'),
      ]);
      setModels(modelsRes);

      // Group by model — no N+1
      const photos: Record<string, string> = {};

      const allPhotos = photosRes.data || [];
      for (const p of allPhotos) {
        if (!photos[p.model_id] || p.is_primary) {
          photos[p.model_id] = p.url;
        }
      }
      setPrimaryPhotos(photos);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-gray-500">
          {models.length}/{CREDITS.MAX_FREE_MODELS} modelos
        </p>
        <button
          onClick={() => navigate('/models/create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white cursor-pointer transition-all hover:brightness-110"
          style={{
            background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
            boxShadow: 'inset -2px -3px 12px 0px rgba(255,255,255,0.12), inset 2px 2px 6px 0px rgba(0,0,0,0.15)',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Criar Novo
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
              <Skeleton className="aspect-[3/4] rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && models.length === 0 && (
        <EmptyState
          icon={
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          }
          title="Nenhum modelo ainda"
          description="Crie seu primeiro modelo para começar a gerar conteúdo."
          actionLabel="Criar Seu Primeiro Modelo"
          onAction={() => navigate('/models/create')}
        />
      )}

      {/* Grid */}
      {!loading && models.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {models.map((model) => (
            <motion.div key={model.id} variants={item}>
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200">
                {/* Photo — large */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {primaryPhotos[model.id] ? (
                    <img
                      src={primaryPhotos[model.id]}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                    </div>
                  )}
                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); /* TODO: confirm delete */ }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer group"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-[18px] font-semibold text-black">{model.name}</h3>
                  <p className="text-[13px] text-gray-400 mt-1">
                    {model.ethnicity} · {model.age} anos · {model.location}
                  </p>

                  {/* Actions */}
                  <div className="space-y-2.5 mt-5">
                    <button
                      onClick={() => navigate(`/models/${model.id}/edit`)}
                      className="w-full py-3 rounded-xl text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                    >
                      Editar Modelo
                    </button>
                    <button
                      onClick={() => navigate('/generate')}
                      className="w-full py-3 rounded-xl text-[13px] font-medium text-white cursor-pointer transition-all hover:brightness-110"
                      style={{
                        background: 'linear-gradient(180deg, #111 0%, #000 100%)',
                      }}
                    >
                      Gerar Imagens
                    </button>
                  </div>

                  {/* Date */}
                  <p className="text-[11px] text-gray-300 mt-4">
                    Criado em {new Date(model.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

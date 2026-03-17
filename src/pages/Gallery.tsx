import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Select, Skeleton } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getModels } from '../lib/models';
import type { AIModel, Content } from '../types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

interface GalleryItem extends Content {
  _modelName: string;
}

export function Gallery() {
  const { user } = useAuth();
  const [filterModel, setFilterModel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<GalleryItem[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load models for filter
      const m = await getModels();
      setModels(m);

      // Load content with model names
      const { data } = await supabase
        .from('content')
        .select('*, ai_models(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const items: GalleryItem[] = (data || []).map((c: any) => ({
        ...c,
        _modelName: c.ai_models?.name || 'Desconhecido',
      }));
      setContent(items);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'archived' | 'draft') => {
    await supabase.from('content').update({ status }).eq('id', id);
    setContent(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const filtered = content
    .filter(c => filterModel === 'all' || c.model_id === filterModel)
    .filter(c => filterStatus === 'all' || c.status === filterStatus);

  const selectedItem = content.find((c) => c.id === selected);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            options={[
              { value: 'all', label: 'Todas as modelos' },
              ...models.map((m) => ({ value: m.id, label: m.name })),
            ]}
          />
        </div>
        <div className="w-40">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'Todos os status' },
              { value: 'draft', label: 'Rascunho' },
              { value: 'approved', label: 'Aprovado' },
              { value: 'archived', label: 'Arquivado' },
            ]}
          />
        </div>
        <p className="text-sm text-gray-500">{filtered.length} itens</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">Nenhum conteúdo encontrado.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filtered.map((c) => (
            <motion.div key={c.id} variants={item} layout>
              <div
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelected(c.id)}
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.prompt}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-sm">Sem imagem</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-semibold">{c._modelName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={c.status === 'approved' ? 'success' : c.status === 'archived' ? 'default' : 'warning'}>
                        {c.status === 'approved' ? 'Aprovado' : c.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                      </Badge>
                      <span className="text-white/80 text-xs">{c.credits_used} cr</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.image_url && (
                <img src={selectedItem.image_url} alt="" className="w-full h-[500px] object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sidebar">{selectedItem._modelName}</h3>
                  <Badge variant={selectedItem.status === 'approved' ? 'success' : selectedItem.status === 'archived' ? 'default' : 'warning'}>
                    {selectedItem.status === 'approved' ? 'Aprovado' : selectedItem.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedItem.prompt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>{selectedItem.credits_used} créditos</span>
                  <span>{new Date(selectedItem.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {selectedItem.status !== 'approved' && (
                    <button
                      onClick={() => { updateStatus(selectedItem.id, 'approved'); setSelected(null); }}
                      className="px-4 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 cursor-pointer"
                    >
                      ✓ Aprovar
                    </button>
                  )}
                  {selectedItem.status !== 'archived' && (
                    <button
                      onClick={() => { updateStatus(selectedItem.id, 'archived'); setSelected(null); }}
                      className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      Arquivar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

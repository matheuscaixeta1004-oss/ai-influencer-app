import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, Select, Skeleton, EmptyState } from '../components/ui';
import { CREDITS } from '../types';
import type { AIModel } from '../types';
import { getUserModels, getModelPhotos } from '../lib/models';

const statusMap = {
  active: { label: 'Active', variant: 'success' as const },
  draft: { label: 'Draft', variant: 'default' as const },
  training: { label: 'Training', variant: 'warning' as const },
};

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
  const [filter, setFilter] = useState('all');
  const [models, setModels] = useState<AIModel[]>([]);
  const [primaryPhotos, setPrimaryPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await getUserModels();
      setModels(data);

      // Load primary photo for each model
      const photos: Record<string, string> = {};
      await Promise.all(data.map(async (m) => {
        const modelPhotos = await getModelPhotos(m.id);
        const primary = modelPhotos.find(p => p.is_primary) || modelPhotos[0];
        if (primary) photos[m.id] = primary.url;
      }));
      setPrimaryPhotos(photos);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all'
    ? models
    : models.filter(m => m.status === filter);

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-[13px] text-gray-500">
            {models.length}/{CREDITS.MAX_FREE_MODELS} models
          </p>
          <div className="w-36">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'training', label: 'Training' },
              ]}
            />
          </div>
        </div>
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
          New Model
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <Card key={i} padding="none">
              <Skeleton className="h-52 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            </Card>
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
          title="No models yet"
          description="Create your first AI model to start generating content."
          actionLabel="Create Your First Model"
          onAction={() => navigate('/models/create')}
        />
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((model) => (
            <motion.div key={model.id} variants={item}>
              <Card padding="none" hover>
                <div className="relative h-52 overflow-hidden rounded-t-2xl bg-gray-100">
                  {primaryPhotos[model.id] ? (
                    <img
                      src={primaryPhotos[model.id]}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge variant={statusMap[model.status].variant} dot>
                      {statusMap[model.status].label}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-[16px] font-semibold text-black">{model.name}</h3>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {model.ethnicity} · {model.age} yrs · {model.location}
                  </p>
                  <p className="text-[12px] text-gray-400 mt-1 line-clamp-2">{model.bio}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] font-medium text-primary bg-primary/[0.06] px-2.5 py-1 rounded-lg">
                      {model.niche}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

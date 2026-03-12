import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, Button, Select } from '../components/ui';
import { mockModels } from '../data/mock';
import { CREDITS } from '../types';

const statusMap = {
  active: { label: 'Ativo', variant: 'success' as const },
  draft: { label: 'Rascunho', variant: 'default' as const },
  training: { label: 'Treinando', variant: 'warning' as const },
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

  const filtered = filter === 'all'
    ? mockModels
    : mockModels.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            {mockModels.length}/{CREDITS.MAX_FREE_MODELS} modelos
          </p>
          <div className="w-40">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Ativos' },
                { value: 'draft', label: 'Rascunho' },
                { value: 'training', label: 'Treinando' },
              ]}
            />
          </div>
        </div>
        <Button icon={<span>+</span>} onClick={() => navigate('/models/create')}>
          Nova Modelo
        </Button>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filtered.map((model) => (
          <motion.div key={model.id} variants={item}>
            <Card padding="none" hover>
              <div className="relative">
                <img
                  src={model._avatar}
                  alt={model.name}
                  className="w-full h-52 object-cover rounded-t-2xl"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={statusMap[model.status].variant} dot>
                    {statusMap[model.status].label}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-sidebar">{model.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{model.ethnicity} · {model.age} anos · {model.location}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{model.bio}</p>

                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="primary">{model.niche}</Badge>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <div className="text-center flex-1">
                    <p className="text-lg font-extrabold text-sidebar">{model._photosCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fotos</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-extrabold text-sidebar">{model._followers.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Followers</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* FAB */}
      <button
        onClick={() => navigate('/models/create')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center text-2xl hover:bg-primary-dark transition-colors cursor-pointer z-40"
      >
        +
      </button>
    </div>
  );
}

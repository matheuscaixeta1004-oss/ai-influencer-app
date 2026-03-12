import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Select } from '../components/ui';
import { mockPhotos, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export function Gallery() {
  const [filterModel, setFilterModel] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = filterModel === 'all'
    ? mockPhotos
    : mockPhotos.filter((p) => p.modelId === filterModel);

  const selectedPhoto = mockPhotos.find((p) => p.id === selected);

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
              ...mockModels.map((m) => ({ value: m.id, label: m.name })),
            ]}
          />
        </div>
        <p className="text-sm text-gray-500">{filtered.length} fotos</p>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filtered.map((photo) => (
          <motion.div key={photo.id} variants={item} layout>
            <div
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setSelected(photo.id)}
            >
              <img
                src={photo.url}
                alt={photo.prompt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold">{photo.modelName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary">{photo.style}</Badge>
                    <span className="text-white/80 text-xs">❤️ {photo.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
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
              <img src={selectedPhoto.url} alt="" className="w-full h-[500px] object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sidebar">{selectedPhoto.modelName}</h3>
                  <Badge variant="primary">{selectedPhoto.style}</Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedPhoto.prompt}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>❤️ {selectedPhoto.likes} likes</span>
                  <span>{new Date(selectedPhoto.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

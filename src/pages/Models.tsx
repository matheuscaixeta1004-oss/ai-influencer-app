import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { mockModels } from '../data/mock';

const statusMap = {
  active: { label: 'Ativo', variant: 'success' as const },
  draft: { label: 'Rascunho', variant: 'default' as const },
  paused: { label: 'Pausado', variant: 'warning' as const },
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{mockModels.length} modelos criados</p>
        </div>
        <Button icon={<span>+</span>}>Nova Modelo</Button>
      </div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {mockModels.map((model) => (
          <motion.div key={model.id} variants={item}>
            <Card padding="none" hover>
              {/* Avatar */}
              <div className="relative">
                <img
                  src={model.avatar}
                  alt={model.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={statusMap[model.status].variant} dot>
                    {statusMap[model.status].label}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-sidebar">{model.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{model.persona}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                  <div className="text-center flex-1">
                    <p className="text-lg font-extrabold text-sidebar">{model.photosCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fotos</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-extrabold text-sidebar">{model.reelsCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Reels</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center flex-1">
                    <p className="text-lg font-extrabold text-sidebar">{model.followers.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Followers</p>
                  </div>
                </div>

                {/* Style tag */}
                <div className="mt-3">
                  <span className="text-xs text-gray-400">Estilo: </span>
                  <span className="text-xs font-medium text-primary">{model.style}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Card, CardHeader, Badge } from '../components/ui';
import { mockStats, mockContent, mockModels } from '../data/mock';

const statCards = [
  { label: 'Modelos Ativos', value: mockStats.totalModels, icon: '👤', color: 'bg-primary-light text-primary' },
  { label: 'Fotos Geradas', value: mockStats.totalPhotos, icon: '📸', color: 'bg-purple-50 text-purple-600' },
  { label: 'Reels Criados', value: mockStats.totalReels, icon: '🎬', color: 'bg-pink-50 text-pink-600' },
  { label: 'Créditos', value: mockStats.creditsBalance, icon: '💰', color: 'bg-amber-50 text-amber-600' },
  { label: 'Usados Hoje', value: mockStats.creditsUsedToday, icon: '📉', color: 'bg-red-50 text-red-500' },
  { label: 'Agendados', value: mockStats.scheduledPosts, icon: '📅', color: 'bg-emerald-50 text-emerald-600' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="text-center">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-extrabold text-sidebar">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader title="Conteúdo Recente" subtitle="Últimas publicações e agendamentos" />
            <div className="space-y-3">
              {mockContent.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <img src={c.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar truncate">{c.caption}</p>
                    <p className="text-xs text-gray-500">{c.modelName} · {c.type === 'photo' ? '📸' : '🎬'} {c.type}</p>
                  </div>
                  <Badge
                    variant={c.status === 'published' ? 'success' : c.status === 'scheduled' ? 'info' : 'default'}
                    dot
                  >
                    {c.status === 'published' ? 'Publicado' : c.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                  </Badge>
                  {c.engagement > 0 && (
                    <span className="text-xs font-semibold text-emerald-600">{c.engagement}%</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Models */}
        <motion.div variants={item}>
          <Card>
            <CardHeader title="Top Modelos" subtitle="Por engajamento" />
            <div className="space-y-3">
              {mockModels.filter(m => m.status === 'active').map((model, i) => (
                <div key={model.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <span className="text-lg font-bold text-gray-300 w-5">#{i + 1}</span>
                  <img src={model.avatar} alt={model.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar">{model.name}</p>
                    <p className="text-xs text-gray-500">{model.followers.toLocaleString()} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sidebar">{model.photosCount}</p>
                    <p className="text-[10px] text-gray-400">fotos</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, Badge, Button } from '../components/ui';
import { mockStats, mockContent, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const quickActions = [
  { label: 'Gerar Conteúdo', icon: '✨', path: '/generate', color: 'bg-primary text-white' },
  { label: 'Ver Galeria', icon: '🖼️', path: '/gallery', color: 'bg-purple-500 text-white' },
  { label: 'Nova Modelo', icon: '👤', path: '/models', color: 'bg-pink-500 text-white' },
  { label: 'Configurações', icon: '⚙️', path: '/settings', color: 'bg-gray-700 text-white' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const activeModel = mockModels.find(m => m.status === 'active');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-extrabold text-sidebar">Olá, Matheus 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Aqui está o resumo do seu estúdio.</p>
      </motion.div>

      {/* Top row: Active model + Credits + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Model Card */}
        <motion.div variants={item}>
          <Card hover onClick={() => navigate('/models')}>
            <CardHeader title="Modelo Ativa" />
            {activeModel && (
              <div className="flex items-center gap-4">
                <img
                  src={activeModel._avatar}
                  alt={activeModel.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-sidebar text-lg">{activeModel.name}</h4>
                  <p className="text-xs text-gray-500">{activeModel.niche}</p>
                  <Badge variant="success" dot className="mt-1.5">{activeModel.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-sidebar">{activeModel._photosCount}</p>
                  <p className="text-[10px] text-gray-400">fotos</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Credits Widget */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-sidebar to-[#2a2a4e] text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">Créditos</span>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-extrabold">{mockStats.creditsBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{mockStats.creditsUsedToday} usados hoje</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/credits')}
            >
              Comprar Créditos
            </Button>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card>
            <CardHeader title="Ações Rápidas" />
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`
                    ${action.color} rounded-xl p-3 text-left
                    hover:opacity-90 transition-opacity cursor-pointer
                  `}
                >
                  <span className="text-xl block mb-1">{action.icon}</span>
                  <span className="text-xs font-semibold">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Modelos', value: mockStats.totalModels, icon: '👤' },
            { label: 'Fotos', value: mockStats.totalPhotos, icon: '📸' },
            { label: 'Conteúdo', value: mockStats.totalContent, icon: '🎬' },
            { label: 'Créditos', value: mockStats.creditsBalance, icon: '💰' },
            { label: 'Hoje', value: mockStats.creditsUsedToday, icon: '📉' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xl font-extrabold text-sidebar mt-1">{stat.value.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader title="Atividade Recente" subtitle="Últimas gerações e publicações" />
            <div className="space-y-3">
              {mockContent.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <img src={c._thumbnail} alt="" className="w-11 h-11 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar truncate">{c.prompt}</p>
                    <p className="text-xs text-gray-500">{c._modelName} · {c.credits_used} créditos</p>
                  </div>
                  <Badge
                    variant={c.status === 'approved' ? 'success' : c.status === 'archived' ? 'default' : 'warning'}
                    dot
                  >
                    {c.status === 'approved' ? 'Aprovado' : c.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader title="Suas Modelos" />
            <div className="space-y-3">
              {mockModels.map((model) => (
                <div key={model.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <img src={model._avatar} alt={model.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar">{model.name}</p>
                    <p className="text-xs text-gray-500">{model.niche}</p>
                  </div>
                  <Badge
                    variant={model.status === 'active' ? 'success' : model.status === 'training' ? 'warning' : 'default'}
                    dot
                  >
                    {model.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

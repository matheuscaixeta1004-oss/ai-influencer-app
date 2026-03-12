import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, Badge, Button } from '../components/ui';
import { mockStats, mockContent, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

const stats = [
  { label: 'Modelos', value: mockStats.totalModels, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Fotos geradas', value: mockStats.totalPhotos, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Conteúdo total', value: mockStats.totalContent, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { label: 'Créditos', value: mockStats.creditsBalance, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Usados hoje', value: mockStats.creditsUsedToday, icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6' },
];

const quickActions = [
  { label: 'Gerar conteúdo', path: '/generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: 'Ver galeria', path: '/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Nova modelo', path: '/models/create', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  { label: 'Configurações', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const activeModel = mockModels.find(m => m.status === 'active');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-lg font-semibold text-text-primary">Olá, Matheus</h1>
        <p className="text-sm text-text-secondary">Aqui está o resumo do seu estúdio.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
                <span className="text-xs text-text-secondary">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value.toLocaleString()}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Model */}
        <motion.div variants={item}>
          <Card hover onClick={() => navigate('/models')}>
            <CardHeader title="Modelo ativa" />
            {activeModel && (
              <div className="flex items-center gap-3">
                <img src={activeModel._avatar} alt={activeModel.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{activeModel.name}</p>
                  <p className="text-xs text-text-secondary">{activeModel.niche}</p>
                </div>
                <Badge variant="success" dot>Ativo</Badge>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-text-secondary">
              <span>{activeModel?._photosCount} fotos</span>
              <span>{activeModel?._followers.toLocaleString()} followers</span>
            </div>
          </Card>
        </motion.div>

        {/* Credits */}
        <motion.div variants={item}>
          <Card>
            <CardHeader title="Créditos" />
            <p className="text-3xl font-bold text-text-primary">{mockStats.creditsBalance.toLocaleString()}</p>
            <p className="text-xs text-text-secondary mt-1">{mockStats.creditsUsedToday} usados hoje</p>
            <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => navigate('/credits')}>
              Comprar créditos
            </Button>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card>
            <CardHeader title="Ações rápidas" />
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                  <span className="text-xs font-medium text-text-primary">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader title="Atividade recente" />
            <div className="space-y-0">
              {mockContent.slice(0, 5).map((c, i) => (
                <div key={c.id} className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  <img src={c._thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{c.prompt}</p>
                    <p className="text-xs text-text-secondary">{c._modelName} · {c.credits_used} créditos</p>
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

        {/* Models list */}
        <motion.div variants={item}>
          <Card>
            <CardHeader title="Suas modelos" />
            <div className="space-y-0">
              {mockModels.map((model, i) => (
                <div key={model.id} className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                  <img src={model._avatar} alt={model.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{model.name}</p>
                    <p className="text-xs text-text-secondary">{model.niche}</p>
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

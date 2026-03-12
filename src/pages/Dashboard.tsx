import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { mockStats, mockContent, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const navigate = useNavigate();
  const activeModel = mockModels.find(m => m.status === 'active');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Modelos', value: mockStats.totalModels },
          { label: 'Fotos geradas', value: mockStats.totalPhotos },
          { label: 'Conteúdo', value: mockStats.totalContent },
          { label: 'Créditos', value: mockStats.creditsBalance },
          { label: 'Usados hoje', value: mockStats.creditsUsedToday },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card>
              <p className="text-[13px] text-gray-500 mb-1">{stat.label}</p>
              <p className="text-[22px] font-semibold text-black">{stat.value.toLocaleString()}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Active model */}
        <motion.div variants={item}>
          <Card hover onClick={() => navigate('/models')}>
            <p className="text-[13px] text-gray-500 mb-3">Modelo ativa</p>
            {activeModel && (
              <>
                <div className="flex items-center gap-3">
                  <img src={activeModel._avatar} alt={activeModel.name} className="w-11 h-11 rounded-lg object-cover" />
                  <div>
                    <p className="text-[15px] font-semibold text-black">{activeModel.name}</p>
                    <p className="text-[12px] text-gray-500">{activeModel.niche}</p>
                  </div>
                </div>
                <div className="flex gap-6 mt-4 pt-3 border-t border-gray-100 text-[12px] text-gray-500">
                  <span><strong className="text-black">{activeModel._photosCount}</strong> fotos</span>
                  <span><strong className="text-black">{activeModel._followers.toLocaleString()}</strong> followers</span>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Credits */}
        <motion.div variants={item}>
          <Card>
            <p className="text-[13px] text-gray-500 mb-3">Créditos</p>
            <p className="text-[28px] font-semibold text-black">{mockStats.creditsBalance.toLocaleString()}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">{mockStats.creditsUsedToday} usados hoje</p>
            <Button size="sm" className="mt-4 w-full" onClick={() => navigate('/credits')}>
              Comprar créditos
            </Button>
          </Card>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item}>
          <Card>
            <p className="text-[13px] text-gray-500 mb-3">Ações rápidas</p>
            <div className="space-y-2">
              {[
                { label: 'Gerar conteúdo', path: '/generate' },
                { label: 'Ver galeria', path: '/gallery' },
                { label: 'Nova modelo', path: '/models/create' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-black hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>{action.label}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity */}
        <motion.div variants={item} className="col-span-2">
          <Card>
            <p className="text-[13px] text-gray-500 mb-3">Atividade recente</p>
            <table className="w-full">
              <thead>
                <tr className="text-[11px] text-gray-400 uppercase tracking-wider">
                  <th className="text-left pb-2 font-medium">Conteúdo</th>
                  <th className="text-left pb-2 font-medium">Modelo</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-right pb-2 font-medium">Créditos</th>
                </tr>
              </thead>
              <tbody>
                {mockContent.slice(0, 5).map((c) => (
                  <tr key={c.id} className="border-t border-gray-50">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <img src={c._thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                        <span className="text-[13px] text-black truncate max-w-[200px]">{c.prompt}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[13px] text-gray-500">{c._modelName}</td>
                    <td className="py-2.5">
                      <Badge
                        variant={c.status === 'approved' ? 'success' : c.status === 'archived' ? 'default' : 'warning'}
                      >
                        {c.status === 'approved' ? 'Aprovado' : c.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-[13px] text-gray-500 text-right">{c.credits_used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </motion.div>

        {/* Models */}
        <motion.div variants={item}>
          <Card>
            <p className="text-[13px] text-gray-500 mb-3">Suas modelos</p>
            <div className="space-y-0">
              {mockModels.map((model, i) => (
                <div key={model.id} className={`flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <img src={model._avatar} alt={model.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-black">{model.name}</p>
                    <p className="text-[11px] text-gray-500">{model.niche}</p>
                  </div>
                  <Badge
                    variant={model.status === 'active' ? 'success' : model.status === 'training' ? 'warning' : 'default'}
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, Button, Input, Badge } from '../components/ui';

const integrations = [
  { name: 'Supabase', status: 'connected', icon: '🟢', description: 'Database + Auth + Storage' },
  { name: 'Nano Banana Pro', status: 'connected', icon: '🟢', description: 'Geração de imagens' },
  { name: 'Kling AI', status: 'connected', icon: '🟢', description: 'Geração de vídeos/reels' },
  { name: 'Instagram', status: 'pending', icon: '🟡', description: 'Publicação automática' },
  { name: 'TikTok', status: 'disconnected', icon: '🔴', description: 'Publicação automática' },
  { name: 'Fanvue', status: 'disconnected', icon: '🔴', description: 'Plataforma de assinatura' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl space-y-6">
      {/* Profile */}
      <motion.div variants={item}>
        <Card>
          <CardHeader title="Perfil" subtitle="Informações da conta" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome" defaultValue="Matheus" />
            <Input label="Email" defaultValue="matheus@waao.com.br" type="email" />
            <Input label="Plano" defaultValue="Pro" disabled />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dev Mode</label>
              <div className="flex items-center gap-3 py-2">
                <Badge variant="primary" dot>is_dev = true</Badge>
                <Badge variant="info">♾️ Créditos infinitos</Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <Button>Salvar Alterações</Button>
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={item}>
        <Card>
          <CardHeader title="Preferências" />
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="text-sm font-semibold text-sidebar">Dark Mode</p>
                <p className="text-xs text-gray-500">Ativar tema escuro</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-sidebar">Notificações</p>
                <p className="text-xs text-gray-500">Receber alertas de geração</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${notifications ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Integrations */}
      <motion.div variants={item}>
        <Card>
          <CardHeader title="Integrações" subtitle="Serviços conectados" />
          <div className="space-y-3">
            {integrations.map((int) => (
              <div key={int.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{int.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-sidebar">{int.name}</p>
                    <p className="text-xs text-gray-500">{int.description}</p>
                  </div>
                </div>
                <Badge
                  variant={int.status === 'connected' ? 'success' : int.status === 'pending' ? 'warning' : 'default'}
                  dot
                >
                  {int.status === 'connected' ? 'Conectado' : int.status === 'pending' ? 'Pendente' : 'Desconectado'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card className="border-red-100">
          <CardHeader title="Zona de Perigo" subtitle="Ações irreversíveis" />
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
              <div>
                <p className="text-sm font-semibold text-red-700">Resetar todos os dados</p>
                <p className="text-xs text-red-500">Remove modelos, fotos e configurações</p>
              </div>
              <Button variant="danger" size="sm">Resetar</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
              <div>
                <p className="text-sm font-semibold text-red-700">Excluir conta</p>
                <p className="text-xs text-red-500">Remove permanentemente todos os dados</p>
              </div>
              <Button variant="danger" size="sm">Excluir</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

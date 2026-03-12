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
            <Input label="API Key" defaultValue="sk-••••••••••••••••" type="password" />
          </div>
          <div className="flex justify-end mt-5">
            <Button>Salvar Alterações</Button>
          </div>
        </Card>
      </motion.div>

      {/* Integrations */}
      <motion.div variants={item}>
        <Card>
          <CardHeader title="Integrações" subtitle="Serviços conectados" />
          <div className="space-y-3">
            {integrations.map((int) => (
              <div key={int.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
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
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-semibold text-red-700">Resetar todos os dados</p>
              <p className="text-xs text-red-500">Remove modelos, fotos e configurações</p>
            </div>
            <Button variant="danger" size="sm">Resetar</Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

import { useLocation } from 'react-router-dom';
import { Input } from '../ui';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Visão geral do seu império' },
  '/models': { title: 'Modelos', subtitle: 'Gerencie suas AI influencers' },
  '/models/create': { title: 'Nova Modelo', subtitle: 'Wizard de criação' },
  '/gallery': { title: 'Galeria', subtitle: 'Todas as fotos geradas' },
  '/generate': { title: 'Gerar Conteúdo', subtitle: 'Crie fotos e reels com IA' },
  '/credits': { title: 'Créditos', subtitle: 'Saldo e histórico de transações' },
  '/settings': { title: 'Settings', subtitle: 'Configurações da plataforma' },
};

export function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'AI Influencer', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-bold text-sidebar">{page.title}</h2>
        <p className="text-xs text-gray-500 -mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-64">
          <Input placeholder="Buscar..." icon={<span className="text-sm">🔍</span>} />
        </div>

        {/* Credits — gold coin */}
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
          <span className="text-base">🪙</span>
          <span className="text-sm font-bold text-credit-gold">1,343</span>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer">
          <span className="text-lg">🔔</span>
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          M
        </div>
      </div>
    </header>
  );
}

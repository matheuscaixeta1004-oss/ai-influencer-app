import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview' },
  '/models': { title: 'Modelos', subtitle: 'Gerencie suas AI influencers' },
  '/models/create': { title: 'Nova Modelo', subtitle: 'Criar modelo' },
  '/gallery': { title: 'Galeria', subtitle: 'Fotos geradas' },
  '/generate': { title: 'Gerar', subtitle: 'Criar conteúdo com IA' },
  '/credits': { title: 'Créditos', subtitle: 'Saldo e transações' },
  '/settings': { title: 'Settings', subtitle: 'Configurações' },
};

export function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'AI Influencer', subtitle: '' };

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{page.title}</h2>
        <p className="text-xs text-text-secondary">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            placeholder="Buscar..."
            className="w-52 pl-9 pr-3 py-1.5 text-sm border border-border rounded-lg bg-white text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Credits */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg">
          <svg className="w-4 h-4 text-credit-gold" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a5.389 5.389 0 01-.421-.821H10a1 1 0 100-2H8.014a7.365 7.365 0 010-1H10a1 1 0 100-2H8.315c.163-.292.347-.559.421-.821z" />
          </svg>
          <span className="text-sm font-semibold text-text-primary">1,343</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer">
          <svg className="w-[18px] h-[18px] text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-text-primary text-xs font-medium cursor-pointer">
          M
        </div>
      </div>
    </header>
  );
}

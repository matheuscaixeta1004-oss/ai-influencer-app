import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/models': 'Modelos',
  '/models/create': 'Nova Modelo',
  '/gallery': 'Galeria',
  '/generate': 'Gerar',
  '/credits': 'Créditos',
  '/settings': 'Settings',
};

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'AI Influencer';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="text-[15px] font-semibold text-black">{title}</h2>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            placeholder="Search"
            className="w-44 pl-8 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Credits */}
        <div className="flex items-center gap-1 text-[13px] font-medium text-black">
          <span className="text-credit-gold">$</span>
          <span>1,343</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-medium text-gray-600 cursor-pointer">
          M
        </div>
      </div>
    </header>
  );
}

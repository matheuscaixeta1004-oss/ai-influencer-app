import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/models': 'Models',
  '/models/create': 'New Model',
  '/gallery': 'Gallery',
  '/generate': 'Generate',
  '/credits': 'Credits',
  '/settings': 'Settings',
};

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'AI Influencer';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="text-[15px] font-medium text-black" style={{ letterSpacing: '-0.02em' }}>{title}</h2>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            placeholder="Search..."
            className="w-48 pl-9 pr-3 py-1.5 text-[13px] border border-gray-100 rounded-lg text-black placeholder:text-gray-300 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Credits */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 text-[13px] font-medium">
          <svg className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a5.95 5.95 0 01-.4-.771H10a1 1 0 100-2H8.022a7.348 7.348 0 010-1H10a1 1 0 100-2H8.336c.13-.27.277-.524.4-.771z" />
          </svg>
          <span className="text-amber-700">1,343</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <svg className="w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[12px] font-medium text-white cursor-pointer">
          M
        </div>
      </div>
    </header>
  );
}

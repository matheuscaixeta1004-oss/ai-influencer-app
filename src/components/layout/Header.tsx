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
    <header className="h-14 flex items-center justify-between px-8 sticky top-0 z-20 bg-[#FAFAFA]">
      <div className="flex items-center gap-3">
        <h2 className="text-[15px] font-medium text-black" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            placeholder="Search..."
            className="w-52 pl-9 pr-3 py-2 text-[13px] border border-gray-200/80 rounded-xl bg-white text-black placeholder:text-gray-300 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center hover:bg-white rounded-xl cursor-pointer transition-colors">
          <svg className="w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
      </div>
    </header>
  );
}

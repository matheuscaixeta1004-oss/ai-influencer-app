import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/models', label: 'Modelos', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { to: '/gallery', label: 'Galeria', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/generate', label: 'Gerar', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { to: '/credits', label: 'Créditos', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center border-b border-white/5">
        <span className="text-white font-semibold text-[15px] tracking-tight">AI Influencer</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-px">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-[13px]
              transition-colors duration-100
              ${isActive
                ? 'text-primary bg-sidebar-active'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }
            `}
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-[11px] font-medium">
            M
          </div>
          <div>
            <p className="text-white text-[13px] font-medium">Matheus</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

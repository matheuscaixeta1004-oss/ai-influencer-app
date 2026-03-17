import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Geist', sans-serif" }}>
      <Sidebar />
      {/* offset: sidebar 220px + left margin 12px + gap 12px = 244px */}
      <div className="ml-[244px]">
        <Header />
        <main className="px-8 py-6 max-w-[1200px] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

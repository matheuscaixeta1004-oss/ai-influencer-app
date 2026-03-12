import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #0F0F23 100%)' }}>
      <Sidebar />
      <div className="ml-60">
        <Header />
        <main className="px-8 py-6 max-w-[1280px] bg-white min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

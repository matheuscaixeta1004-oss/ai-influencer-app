import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="ml-60">
        <Header />
        <main className="px-8 py-6 max-w-[1280px] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

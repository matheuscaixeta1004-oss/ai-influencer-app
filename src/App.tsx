import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { Layout } from './components/layout';
import { Dashboard, Models, Gallery, Generate, Credits, Settings } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/models" element={<Models />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { Layout } from './components/layout';
import { Auth, Dashboard, Models, Gallery, Generate, Credits, Settings, CreateModelWizard } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/models" element={<Models />} />
            <Route path="/models/create" element={<CreateModelWizard />} />
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

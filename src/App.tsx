import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout';
import { Auth, Landing, Dashboard, Models, Gallery, Generate, Credits, Settings, Studio, CreateModelWizard, EditModel, MissionControl } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/create" element={<CreateModelWizard />} />
              <Route path="/models/:id/edit" element={<EditModel />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/mission-control" element={<MissionControl />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

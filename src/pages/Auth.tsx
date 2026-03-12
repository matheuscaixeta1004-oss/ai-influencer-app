import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '../components/ui';

type Mode = 'login' | 'register';

export function Auth() {
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-[#0066CC] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-extrabold mx-auto mb-8">
            AI
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">AI Influencer Studio</h1>
          <p className="text-lg text-white/80 max-w-md">
            Crie modelos virtuais com IA, gere conteúdo profissional e gerencie seu império digital.
          </p>

          <div className="flex items-center gap-8 mt-12 text-white/60 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4</p>
              <p>AI Models</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">519</p>
              <p>Fotos Geradas</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">12.4K</p>
              <p>Followers</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h2 className="text-xl font-bold text-sidebar">AI Influencer Studio</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-extrabold text-sidebar">
                {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-8">
                {mode === 'login'
                  ? 'Entre na sua conta para continuar'
                  : 'Comece com 50 créditos grátis'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <Input label="Nome" placeholder="Seu nome" required />
                )}
                <Input label="Email" type="email" placeholder="seu@email.com" required />
                <Input label="Senha" type="password" placeholder="••••••••" required />
                {mode === 'register' && (
                  <Input label="Confirmar senha" type="password" placeholder="••••••••" required />
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-600">Lembrar de mim</span>
                    </label>
                    <button type="button" className="text-sm text-primary hover:text-primary-dark font-medium cursor-pointer">
                      Esqueci a senha
                    </button>
                  </div>
                )}

                {mode === 'register' && (
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5" required />
                    <span className="text-sm text-gray-600">
                      Concordo com os <a href="#" className="text-primary font-medium">Termos de Uso</a> e{' '}
                      <a href="#" className="text-primary font-medium">Política de Privacidade</a>
                    </span>
                  </label>
                )}

                <Button className="w-full" loading={loading} size="lg">
                  {mode === 'login' ? 'Entrar' : 'Criar conta'}
                </Button>
              </form>

              <p className="text-sm text-center text-gray-500 mt-6">
                {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary font-semibold hover:text-primary-dark cursor-pointer"
                >
                  {mode === 'login' ? 'Criar conta grátis' : 'Fazer login'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

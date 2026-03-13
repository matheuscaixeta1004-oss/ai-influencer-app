import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register';

const mosaicImages = [
  '/images/mosaic/1.jpg',
  '/images/mosaic/7.jpg',
  '/images/mosaic/4.jpg',
  '/images/mosaic/15.jpg',
  '/images/mosaic/19.jpg',
  '/images/mosaic/11.jpg',
  '/images/mosaic/17.jpg',
  '/images/mosaic/8.jpg',
  '/images/mosaic/12.jpg',
];

export function Auth() {
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Already logged in → redirect
  if (!authLoading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(email, password, name);
        if (err) {
          setError(err);
        } else {
          // Supabase may require email confirmation depending on config
          // If auto-confirm is on, onAuthStateChange will fire and redirect
          navigate('/');
        }
      } else {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err);
        } else {
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'Geist', sans-serif" }}>

      {/* Left — Photo mosaic */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-1.5 p-1.5">
          {mosaicImages.map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <h2 className="text-[32px] font-medium text-white" style={{ letterSpacing: '-0.03em' }}>
            Create your{' '}
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>AI influencer</span>
          </h2>
          <p className="text-[15px] text-white/60 mt-3 max-w-[360px] leading-relaxed">
            Design hyper-realistic virtual models. Generate thousands of consistent photos. Build an audience.
          </p>
          <div className="flex items-center gap-6 mt-6">
            {[
              { value: '50K+', label: 'Models' },
              { value: '2.4M', label: 'Photos' },
              { value: '12K+', label: 'Creators' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <span className="w-px h-6 bg-white/20" />}
                <div className={i > 0 ? 'ml-3' : ''}>
                  <p className="text-[18px] font-semibold text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/40">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-[400px]">

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00BFF5, #0099D4)' }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-black tracking-tight">AI Influencer</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-[28px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-[15px] text-gray-400 mt-2 mb-8">
                {mode === 'login'
                  ? 'Sign in to continue to your dashboard.'
                  : 'Start with 50 free credits. No credit card required.'}
              </p>

              {/* Error */}
              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200/50 text-[13px] text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Google */}
              <button
                onClick={handleGoogle}
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-[14px] font-medium text-black hover:bg-gray-50 transition-colors cursor-pointer mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[12px] text-gray-300 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[13px] font-medium text-black mb-1.5">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-black placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-medium text-black mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-black placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[13px] font-medium text-black">Password</label>
                    {mode === 'login' && (
                      <button type="button" className="text-[12px] text-primary hover:text-primary-dark font-medium cursor-pointer transition-colors">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-black placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-[13px] font-medium text-black mb-1.5">Confirm password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-black placeholder:text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-[14px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                    boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                    </div>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account — Free'
                  )}
                </button>
              </form>

              <p className="text-[14px] text-center text-gray-400 mt-8">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                  className="text-primary font-medium hover:text-primary-dark cursor-pointer transition-colors"
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>

              {mode === 'register' && (
                <div className="flex items-center justify-center gap-5 mt-6 text-[11px] text-gray-300">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    SSL Encrypted
                  </span>
                  <span>·</span>
                  <span>50 free credits</span>
                  <span>·</span>
                  <span>No credit card</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

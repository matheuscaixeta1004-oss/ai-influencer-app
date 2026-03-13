import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockStats, mockContent, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } },
};

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1100px] mx-auto"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >

      {/* ── Hero greeting with model preview ── */}
      <motion.div variants={item} className="relative rounded-2xl overflow-hidden mb-8">
        {/* Background mosaic strip */}
        <div className="absolute inset-0 flex gap-1">
          {['/images/mosaic/7.jpg', '/images/mosaic/19.jpg', '/images/mosaic/4.jpg', '/images/mosaic/15.jpg', '/images/mosaic/17.jpg'].map((src, i) => (
            <div key={i} className="flex-1">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

        <div className="relative z-10 px-10 py-10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 mb-3">Dashboard</p>
            <h1 className="text-[32px] font-medium text-white" style={{ letterSpacing: '-0.03em' }}>
              Welcome back, <span className="text-primary">Matheus</span>
            </h1>
            <p className="text-[15px] text-white/50 mt-2">Your AI models generated 47 images this week.</p>
          </div>

          <div className="flex items-center gap-8">
            {[
              { value: mockStats.totalModels.toString(), label: 'Models' },
              { value: mockStats.totalPhotos.toLocaleString(), label: 'Photos' },
              { value: mockStats.creditsBalance.toLocaleString(), label: 'Credits' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[24px] font-semibold text-white">{s.value}</p>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions — pill buttons ── */}
      <motion.div variants={item} className="flex items-center gap-2.5 mb-8">
        {[
          { label: 'Generate Content', path: '/generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z', primary: true },
          { label: 'New Model', path: '/models/create', icon: 'M12 4.5v15m7.5-7.5h-15' },
          { label: 'Gallery', path: '/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { label: 'Buy Credits', path: '/credits', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer ${
              a.primary
                ? 'text-white hover:brightness-110'
                : 'text-gray-500 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary'
            }`}
            style={a.primary ? {
              background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
              boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
            } : undefined}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
            </svg>
            {a.label}
          </button>
        ))}
      </motion.div>

      {/* ── Your Models — visual cards like Showcase ── */}
      <motion.div variants={item} className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">Your Models</p>
          <button onClick={() => navigate('/models')} className="text-[12px] font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors">
            View all
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {mockModels.map((model) => (
            <div
              key={model.id}
              onClick={() => navigate('/models')}
              className="rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-200 cursor-pointer group"
            >
              <div className="h-[180px] overflow-hidden relative">
                <img
                  src={model._avatar}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                    model.status === 'active'
                      ? 'text-emerald-700 bg-emerald-100/90'
                      : model.status === 'training'
                      ? 'text-amber-700 bg-amber-100/90'
                      : 'text-gray-600 bg-gray-100/90'
                  }`}>
                    {model.status === 'active' ? 'Active' : model.status === 'training' ? 'Training' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-semibold text-black">{model.name}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">{model.niche}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-[14px] font-semibold text-black">{model._photosCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Photos</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-black">{model._followers.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Followers</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Bottom row: Activity + Credits ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Recent Activity */}
        <motion.div variants={item} className="col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400">Recent Activity</p>
              <button onClick={() => navigate('/gallery')} className="text-[12px] font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors">
                View all
              </button>
            </div>

            {mockContent.slice(0, 5).map((c, i) => (
              <div key={c.id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                <img src={c._thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-black truncate" style={{ letterSpacing: '-0.01em' }}>{c.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-gray-400">{c._modelName}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                    <span className="text-[12px] text-gray-300">{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                  c.status === 'approved'
                    ? 'text-emerald-600 bg-emerald-50'
                    : c.status === 'archived'
                    ? 'text-gray-500 bg-gray-100'
                    : 'text-amber-600 bg-amber-50'
                }`}>
                  {c.status === 'approved' ? 'Published' : c.status === 'archived' ? 'Archived' : 'Draft'}
                </span>
                <span className="text-[12px] text-gray-300 w-10 text-right">{c.credits_used} cr</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div variants={item}>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 h-full flex flex-col">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">Credits Balance</p>

            <div className="flex-1">
              <p className="text-[48px] font-bold text-black" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>
                {mockStats.creditsBalance.toLocaleString()}
              </p>
              <p className="text-[13px] text-gray-400 mt-2">{mockStats.creditsUsedToday} credits used today</p>

              {/* Cost reference */}
              <div className="mt-6 space-y-2.5">
                {[
                  { label: 'Standard photo', cost: '2 cr', icon: '🖼' },
                  { label: 'HD photo', cost: '5 cr', icon: '✨' },
                  { label: 'New model', cost: '10 cr', icon: '👤' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-[13px]">
                    <span className="text-gray-400">{r.label}</span>
                    <span className="text-black font-medium">{r.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/credits')}
              className="mt-6 w-full py-3.5 rounded-xl text-[14px] font-medium text-white cursor-pointer transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
              }}
            >
              Buy Credits
            </button>
          </div>
        </motion.div>
      </div>

      {/* Spacer */}
      <div className="h-8" />
    </motion.div>
  );
}

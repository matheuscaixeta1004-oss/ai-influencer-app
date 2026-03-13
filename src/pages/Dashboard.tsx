import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockStats, mockContent, mockModels } from '../data/mock';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function Icon({ d, className = 'w-5 h-5' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const statCards = [
  { label: 'AI Models', key: 'totalModels' as const, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'text-primary bg-primary/8' },
  { label: 'Photos Generated', key: 'totalPhotos' as const, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-violet-500 bg-violet-50' },
  { label: 'Content Posts', key: 'totalContent' as const, icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', color: 'text-emerald-500 bg-emerald-50' },
  { label: 'Credits Balance', key: 'creditsBalance' as const, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-500 bg-amber-50' },
];

const quickActions = [
  { label: 'Generate Content', desc: 'Create new AI photos', path: '/generate', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { label: 'New Model', desc: 'Design a new AI influencer', path: '/models/create', icon: 'M12 4.5v15m7.5-7.5h-15' },
  { label: 'View Gallery', desc: 'Browse all generated photos', path: '/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Buy Credits', desc: 'Top up your balance', path: '/credits', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
];

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-[28px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
          Welcome back
        </h1>
        <p className="text-[15px] text-gray-400 mt-1">Here's what's happening with your AI models today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div key={stat.key} variants={item}>
            <div className="p-5 rounded-2xl border border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-gray-400 font-medium">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon d={stat.icon} className="w-[18px] h-[18px]" />
                </div>
              </div>
              <p className="text-[32px] font-semibold text-black tracking-tight">{mockStats[stat.key].toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Active Model */}
      <div className="grid grid-cols-3 gap-4">
        {/* Quick Actions */}
        <motion.div variants={item} className="col-span-2">
          <div className="p-6 rounded-2xl border border-gray-100 bg-white">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-150 cursor-pointer text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-primary/8 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                    <Icon d={action.icon} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-black">{action.label}</p>
                    <p className="text-[12px] text-gray-400">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credits Card */}
        <motion.div variants={item}>
          <div className="p-6 rounded-2xl border border-gray-100 bg-white h-full flex flex-col">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">Credits</p>
            <div className="flex-1">
              <p className="text-[42px] font-bold text-black tracking-tight">{mockStats.creditsBalance.toLocaleString()}</p>
              <p className="text-[13px] text-gray-400 mt-1">{mockStats.creditsUsedToday} used today</p>

              {/* Mini usage bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                  <span>Monthly usage</span>
                  <span className="text-black font-medium">67%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/credits')}
              className="mt-5 w-full py-3 rounded-xl bg-primary text-white text-[14px] font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Buy Credits
            </button>
          </div>
        </motion.div>
      </div>

      {/* Activity + Models */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Activity */}
        <motion.div variants={item} className="col-span-2">
          <div className="p-6 rounded-2xl border border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Recent Activity</p>
              <button onClick={() => navigate('/gallery')} className="text-[12px] font-medium text-primary hover:text-primary-dark cursor-pointer transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-0">
              {mockContent.slice(0, 5).map((c, i) => (
                <div key={c.id} className={`flex items-center gap-4 py-3.5 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <img src={c._thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-black truncate">{c.prompt}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{c._modelName} · {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      c.status === 'approved' 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : c.status === 'archived' 
                        ? 'text-gray-500 bg-gray-100' 
                        : 'text-amber-600 bg-amber-50'
                    }`}>
                      {c.status === 'approved' ? 'Published' : c.status === 'archived' ? 'Archived' : 'Draft'}
                    </span>
                    <span className="text-[12px] text-gray-400 w-14 text-right">{c.credits_used} cr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Your Models */}
        <motion.div variants={item}>
          <div className="p-6 rounded-2xl border border-gray-100 bg-white h-full">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Your Models</p>
              <span className="text-[11px] text-gray-300">{mockModels.length}/5</span>
            </div>
            <div className="space-y-0">
              {mockModels.map((model, i) => (
                <div
                  key={model.id}
                  onClick={() => navigate('/models')}
                  className={`flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}
                >
                  <img src={model._avatar} alt={model.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-black">{model.name}</p>
                    <p className="text-[11px] text-gray-400">{model.niche}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    model.status === 'active' ? 'bg-emerald-400' : model.status === 'training' ? 'bg-amber-400' : 'bg-gray-300'
                  }`} />
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/models/create')}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-200 rounded-xl text-[13px] text-gray-400 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Model
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

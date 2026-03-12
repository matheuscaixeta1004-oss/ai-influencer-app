import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const photos = {
  col1: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=550&fit=crop',
  ],
  col2: [
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=550&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop',
  ],
  col3: [
    'https://images.unsplash.com/photo-1515023115894-bacee399a264?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=550&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
  ],
  col4: [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=550&fit=crop',
  ],
  col5: [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1464863979621-258859e62245?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=450&fit=crop',
    'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=550&fit=crop',
  ],
};

const starIcons = Array(5).fill(null);

export function Landing() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background — Photo Mosaic */}
      <div className="absolute inset-0 z-0">
        <div className="flex gap-3 h-full px-4">
          {Object.values(photos).map((col, colIdx) => (
            <div
              key={colIdx}
              className="flex-1 flex flex-col gap-3"
              style={{
                animation: `mosaicScroll ${20 + colIdx * 4}s linear infinite`,
                animationDirection: colIdx % 2 === 0 ? 'normal' : 'reverse',
              }}
            >
              {[...col, ...col].map((src, i) => (
                <div key={i} className="flex-shrink-0">
                  <img
                    src={src}
                    alt=""
                    className="w-full rounded-2xl object-cover"
                    style={{ height: `${300 + (i % 3) * 60}px` }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* White overlay — heavy center fade for text readability */}
        <div className="absolute inset-0 bg-white/80" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)',
          }}
        />
        {/* Edge fades */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content — Centered */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[240px] pb-20 flex flex-col items-center gap-8"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-center"
          style={{ fontFamily: "'Geist', sans-serif", fontWeight: 500, letterSpacing: '-0.04em' }}
        >
          <span className="text-[80px] leading-[1.05] text-black">
            Create your{' '}
            <span
              className="text-primary"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '100px' }}
            >
              AI influencer
            </span>
            <br />
            in minutes
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-center text-[18px] leading-[1.6] max-w-[554px]"
          style={{ fontFamily: "'Geist', sans-serif", color: 'rgba(55, 58, 70, 0.8)' }}
        >
          Generate hyper-realistic AI models, create stunning content, and build your virtual influencer empire — all from one platform.
        </motion.p>

        {/* Email Input + CTA */}
        <motion.div variants={fadeUp} className="w-full max-w-[520px]">
          <div
            className="flex items-center gap-2 rounded-[40px] bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-2"
            style={{ boxShadow: '0px 10px 40px 5px rgba(194,194,194,0.25)' }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent px-5 py-3 text-[15px] text-black placeholder:text-gray-400 focus:outline-none"
              style={{ fontFamily: "'Geist', sans-serif" }}
            />
            <button
              onClick={() => navigate('/auth')}
              className="flex-shrink-0 rounded-[32px] px-7 py-3.5 text-[14px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110"
              style={{
                fontFamily: "'Geist', sans-serif",
                background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)',
              }}
            >
              Create Free Account
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex items-center gap-0.5">
              {starIcons.map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[14px] font-medium text-gray-600" style={{ fontFamily: "'Geist', sans-serif" }}>
              1,020+ Reviews
            </span>
            <div className="flex items-center -space-x-1.5 ml-1">
              {['G', 'T', 'P', 'C'].map((letter, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes mosaicScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}

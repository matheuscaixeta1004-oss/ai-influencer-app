import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
};

// Placeholder photos — varied AI model shots
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
};

const features = [
  'Hyper-realistic — fans can\'t tell',
  'No training. No waiting. Instant.',
  'A month of content in an afternoon',
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left — Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-center w-[52%] pl-16 pr-12 py-20"
        >
          {/* Heading */}
          <motion.h1 variants={fadeUp}>
            <span
              className="block text-[64px] leading-[1.05] font-bold tracking-tight"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              <span className="text-primary">The #1 AI Studio</span>
              <br />
              <span className="text-black">Built Just For</span>
              <br />
              <span className="text-primary">
                <span
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '72px' }}
                >
                  Creators
                </span>
              </span>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-[17px] leading-[1.7] max-w-[480px]"
            style={{ fontFamily: "'Geist', sans-serif", color: '#555' }}
          >
            Upload 3 photos. Generate unlimited, hyper-realistic content.
            Turn your likeness into an infinite content engine.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-8">
            <button
              onClick={() => navigate('/auth')}
              className="px-12 py-4 text-[15px] font-semibold tracking-wider uppercase text-white rounded-full cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                fontFamily: "'Geist', sans-serif",
                background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #111111 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(201,201,201,0.08), inset 4px 4px 10px 0px rgba(29,29,29,0.24)',
              }}
            >
              Get Started
            </button>
          </motion.div>

          {/* Features card */}
          <motion.div
            variants={fadeUp}
            className="mt-10 max-w-[380px] bg-white border border-gray-200 rounded-2xl p-6"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
          >
            <p
              className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-4"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              The AI Content Studio for Creators
            </p>
            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[14px] text-black" style={{ fontFamily: "'Geist', sans-serif" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — Photo Mosaic */}
        <div className="relative w-[48%] overflow-hidden">
          {/* Fade overlays */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent" />
          </div>

          {/* Scrolling columns */}
          <div className="flex gap-3 h-full pt-4">
            {Object.values(photos).map((col, colIdx) => (
              <div
                key={colIdx}
                className="flex-1 flex flex-col gap-3"
                style={{
                  animation: `mosaicScroll ${18 + colIdx * 3}s linear infinite`,
                  animationDirection: colIdx % 2 === 0 ? 'normal' : 'reverse',
                }}
              >
                {/* Duplicate for seamless loop */}
                {[...col, ...col].map((src, i) => (
                  <div key={i} className="flex-shrink-0">
                    <img
                      src={src}
                      alt=""
                      className="w-full rounded-xl object-cover"
                      style={{ height: `${280 + (i % 3) * 60}px` }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mosaic scroll animation */}
      <style>{`
        @keyframes mosaicScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </section>
  );
}

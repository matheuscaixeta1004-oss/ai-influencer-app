import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
};

const starIcons = Array(5).fill(null);

export function Landing() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        {/* White gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[290px] flex flex-col items-center gap-8"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          className="text-center"
          style={{ fontFamily: "'Geist', sans-serif", fontWeight: 500, letterSpacing: '-0.04em' }}
        >
          <span className="text-[80px] leading-[1.05] text-black">
            Simple{' '}
            <span
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '100px' }}
            >
              management
            </span>
            <br />
            for your remote team
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          className="text-center text-[18px] leading-[1.6] max-w-[554px]"
          style={{ fontFamily: "'Geist', sans-serif", color: 'rgba(55, 58, 70, 0.8)' }}
        >
          Streamline your workflow, track progress, and keep your distributed team aligned — all in one beautifully simple platform.
        </motion.p>

        {/* Email Input + CTA */}
        <motion.div variants={fadeUp} className="w-full max-w-[520px]">
          <div
            className="flex items-center gap-2 rounded-[40px] bg-[#fcfcfc] border border-gray-200 px-2 py-2"
            style={{ boxShadow: '0px 10px 40px 5px rgba(194,194,194,0.25)' }}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent px-5 py-3 text-[15px] text-black placeholder:text-gray-400 focus:outline-none"
              style={{ fontFamily: "'Geist', sans-serif" }}
            />
            <button
              className="flex-shrink-0 rounded-[32px] px-7 py-3.5 text-[14px] font-medium text-white cursor-pointer transition-transform duration-150 active:scale-[0.97]"
              style={{
                fontFamily: "'Geist', sans-serif",
                background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #111111 100%)',
                boxShadow: 'inset -4px -6px 25px 0px rgba(201,201,201,0.08), inset 4px 4px 10px 0px rgba(29,29,29,0.24)',
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
            <span className="text-[14px] font-medium text-gray-500" style={{ fontFamily: "'Geist', sans-serif" }}>
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
    </section>
  );
}

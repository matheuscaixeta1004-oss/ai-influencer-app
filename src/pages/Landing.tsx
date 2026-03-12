import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

/* ─── Animations ─── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
};
const sectionFade = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ─── Mosaic Photos (AI-generated via Nano Banana Pro) ─── */
const mosaicCols = [
  [
    '/images/mosaic/1.jpg',   // Mirror selfie, walk-in closet
    '/images/mosaic/2.jpg',   // Restaurant candlelit dinner
    '/images/mosaic/3.jpg',   // Morning in bed
    '/images/mosaic/4.jpg',   // Beach sunbathing
  ],
  [
    '/images/mosaic/5.jpg',   // Gym mirror selfie
    '/images/mosaic/6.jpg',   // Fitting room
    '/images/mosaic/7.jpg',   // Rooftop bar nightlife
    '/images/mosaic/8.jpg',   // Car selfie
  ],
  [
    '/images/mosaic/9.jpg',   // Shopping city walk
    '/images/mosaic/10.jpg',  // Getting ready makeup
    '/images/mosaic/11.jpg',  // Bubble bath champagne
    '/images/mosaic/12.jpg',  // Festival selfie
  ],
  [
    '/images/mosaic/13.jpg',  // Cooking morning
    '/images/mosaic/14.jpg',  // Cafe laptop
    '/images/mosaic/15.jpg',  // Pool villa tropical
    '/images/mosaic/16.jpg',  // Brunch with friends
  ],
  [
    '/images/mosaic/17.jpg',  // Getting out of car NYC night
    '/images/mosaic/18.jpg',  // Morning stretch skyline
    '/images/mosaic/19.jpg',  // Beach sunset arms open
    '/images/mosaic/20.jpg',  // Couch takeout fairy lights
  ],
];

/* ─── Data ─── */
const stats = [
  { value: '50K+', label: 'Models Created' },
  { value: '2.4M', label: 'Images Generated' },
  { value: '12K+', label: 'Active Creators' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const steps = [
  {
    num: '01',
    title: 'Design Your Character',
    desc: 'Choose ethnicity, body type, hair, eyes, and personality traits. Our AI creates a unique, consistent model that\'s exclusively yours.',
    detail: 'Average creation time: 2 minutes',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    num: '02',
    title: 'Generate Unlimited Content',
    desc: 'Write a prompt or pick a scenario — beach, gym, bedroom, studio. Each photo maintains your model\'s exact face and body. No inconsistencies.',
    detail: 'Standard: ~15s · HD: ~30s per image',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    num: '03',
    title: 'Publish & Monetize',
    desc: 'Post directly to Instagram, TikTok, OnlyFans, or Patreon. Grow a following, sell subscriptions, brand deals — your AI works while you sleep.',
    detail: 'Top creators earn $5K-$50K/month',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const featureBlocks = [
  {
    tag: 'Core Technology',
    title: 'One face. Infinite content.',
    desc: 'Our proprietary consistency engine ensures your AI model looks identical across every single generation. Same bone structure, same skin texture, same proportions — whether she\'s at the beach or in a studio.',
    points: ['Face-lock technology across all generations', 'Consistent body proportions in any pose', 'Natural skin textures and lighting adaptation'],
    visual: 'consistency',
  },
  {
    tag: 'Speed',
    title: 'A month of content in an afternoon.',
    desc: 'Traditional photoshoots take days of planning, thousands in budget, and hours of editing. With AI Influencer, you generate professional-grade content in seconds. One afternoon = 30 days of daily posts.',
    points: ['Generate 100+ images per session', 'No scheduling photographers or models', 'Instant variations: same outfit, different pose'],
    visual: 'speed',
  },
  {
    tag: 'Scenarios',
    title: 'Every setting. Every mood.',
    desc: 'Beach sunset, luxury apartment, gym selfie, coffee shop candid, bedroom intimate, urban street style — choose from 50+ pre-built scenarios or write your own custom prompts for complete creative control.',
    points: ['50+ built-in professional scenarios', 'Custom prompt support for any setting', '4 lighting modes: natural, studio, golden hour, dramatic'],
    visual: 'scenarios',
  },
];

const showcaseModels = [
  { name: 'Sophia', niche: 'Fitness & Wellness', followers: '124K', posts: '2.4K', earnings: '$8.2K/mo' },
  { name: 'Luna', niche: 'Lifestyle & Travel', followers: '89K', posts: '1.8K', earnings: '$5.1K/mo' },
  { name: 'Mia', niche: 'Fashion & Luxury', followers: '210K', posts: '3.2K', earnings: '$15.4K/mo' },
  { name: 'Ava', niche: 'Cosplay & Gaming', followers: '156K', posts: '2.1K', earnings: '$11.7K/mo' },
];

const testimonials = [
  { name: 'Alex M.', role: 'Content Agency Owner', avatar: 'A', text: 'I replaced 3 human models with AI Influencer. Same quality, 10x the output, fraction of the cost. My clients can\'t tell the difference.', metric: '10x output increase' },
  { name: 'Sarah K.', role: 'Solo Creator', avatar: 'S', text: 'Went from 0 to 45K subscribers in 4 months. The consistency is what keeps people believing she\'s real. Best investment I\'ve made.', metric: '45K subs in 4 months' },
  { name: 'Marcus R.', role: 'Digital Entrepreneur', avatar: 'M', text: 'Running 5 AI models simultaneously, each with their own personality and niche. The platform makes it effortless to manage all of them.', metric: '5 models, $28K/mo' },
  { name: 'Jessica L.', role: 'Marketing Manager', avatar: 'J', text: 'We use AI Influencer for product photography and social media. The speed alone saved us $40K in production costs this quarter.', metric: '$40K saved/quarter' },
];

const plans = [
  { name: 'Starter', price: 0, period: 'Free forever', desc: 'Try it out, no commitment', credits: 50, models: 1, features: ['50 credits on signup', '1 AI model', 'Standard quality', 'Basic scenarios', 'Community support'] },
  { name: 'Creator', price: 29, period: '/month', desc: 'For serious content creators', credits: 500, models: 5, popular: true, features: ['500 credits/month', '5 AI models', 'HD quality', 'All 50+ scenarios', 'Priority support', 'Analytics dashboard', 'Direct download'] },
  { name: 'Agency', price: 99, period: '/month', desc: 'For teams and agencies', credits: 2500, models: 25, features: ['2,500 credits/month', '25 AI models', 'HD + 4K quality', 'Custom scenarios', 'Dedicated manager', 'API access', 'White-label', 'Bulk generation'] },
];

const faqs = [
  { q: 'How realistic are the generated images?', a: 'Extremely. Our AI produces images that are virtually indistinguishable from real photographs. We use proprietary face-consistency technology that maintains identical facial features, skin texture, and body proportions across every generation. Many of our creators\' followers genuinely believe the models are real people.' },
  { q: 'Do I own the generated content?', a: 'Yes, 100%. All content generated on the platform is yours to use commercially — post on social media, sell subscriptions, license to brands, or use in advertising. There are no royalty fees or usage restrictions.' },
  { q: 'How does the credit system work?', a: 'Credits are the currency for generating content. Standard quality (1024×1024) costs 2 credits per image. HD quality (2048×2048) costs 5 credits. Creating a new model costs 10 credits. Free accounts start with 50 credits, and paid plans include monthly credit allowances.' },
  { q: 'Can I create NSFW content?', a: 'Yes. AI Influencer supports adult content creation for platforms like OnlyFans, Fansly, and Patreon. You have full control over the content style and level of explicitness. All content is generated responsibly with built-in safety guidelines.' },
  { q: 'How is this different from Midjourney or DALL-E?', a: 'The key difference is consistency. General AI image tools create a different face every time. AI Influencer creates a persistent model with locked facial features — the same person appears in every image, making it possible to build a believable online presence with a consistent identity.' },
  { q: 'What if I\'m not satisfied with my model?', a: 'You can adjust any aspect of your model at any time — facial features, body type, hair, skin tone. If you want to start over, creating a new model costs 10 credits. Most users find their ideal model within 1-2 iterations.' },
];

/* ─── Helpers ─── */
function Icon({ d, className = 'w-6 h-6' }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array(5).fill(null).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < count ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Visual blocks for features ─── */
function FeatureVisual({ type }: { type: string }) {
  if (type === 'consistency') {
    return (
      <div className="flex gap-3 items-center justify-center py-8">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="relative">
            <div className="w-20 h-24 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        ))}
        <div className="ml-2 text-[11px] text-emerald-500 font-medium">100% match</div>
      </div>
    );
  }
  if (type === 'speed') {
    return (
      <div className="flex items-center gap-6 py-8 justify-center">
        <div className="text-center">
          <div className="text-[32px] font-bold text-red-400 line-through opacity-50">$3,200</div>
          <div className="text-[11px] text-gray-400 mt-1">Traditional shoot</div>
        </div>
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="text-center">
          <div className="text-[32px] font-bold text-primary">$0.12</div>
          <div className="text-[11px] text-gray-400 mt-1">Per AI image</div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-2 py-8">
      {['Beach', 'Studio', 'Urban', 'Gym', 'Bedroom', 'Office', 'Rooftop', 'Nature'].map((s) => (
        <div key={s} className="bg-gray-50 rounded-lg py-2.5 text-center text-[11px] text-gray-500 font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-default">
          {s}
        </div>
      ))}
    </div>
  );
}

/* ─── Landing ─── */
export function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="bg-white" style={{ fontFamily: "'Geist', sans-serif" }}>

      {/* ── Nav — Liquid Glass ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto">
        <div
          className="flex items-center gap-1 px-2 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
        >
          <span className="text-[15px] font-semibold text-black/80 tracking-tight pl-4 pr-6">AI Influencer</span>
          {['Features', 'Pricing', 'FAQ'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="px-4 py-2 text-[13px] font-medium text-black/50 hover:text-black/80 hover:bg-white/40 rounded-full transition-all duration-200">
              {l}
            </a>
          ))}
          <button onClick={() => navigate('/auth')} className="ml-1 px-5 py-2 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════ */}
      {/* ── 1. HERO ── */}
      {/* ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        {/* Mosaic BG */}
        <motion.div className="absolute inset-0 z-0" style={{ opacity: heroOpacity }}>
          <div className="flex gap-3 h-full px-4">
            {mosaicCols.map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-3" style={{ animation: `mosaicScroll ${20 + colIdx * 4}s linear infinite`, animationDirection: colIdx % 2 === 0 ? 'normal' : 'reverse' }}>
                {[...col, ...col].map((src, i) => (
                  <div key={i} className="flex-shrink-0">
                    <img src={src} alt="" className="w-full rounded-2xl object-cover" style={{ height: `${300 + (i % 3) * 60}px` }} loading="lazy" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0.7) 80%, rgba(255,255,255,0.55) 100%)' }} />
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[200px] pb-20 flex flex-col items-center gap-8">
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-medium text-primary">Now in public beta — 50 free credits on signup</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} className="text-center" style={{ fontWeight: 500, letterSpacing: '-0.04em' }}>
            <span className="text-[76px] leading-[1.05] text-black">
              Create your{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '96px' }}>
                AI influencer
              </span>
              <br />in minutes
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeUp} className="text-center text-[18px] leading-[1.65] max-w-[540px]" style={{ color: '#666' }}>
            Design a hyper-realistic virtual model. Generate thousands of consistent photos. Build a following and monetize — without ever hiring a photographer.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} className="w-full max-w-[520px]">
            <div className="flex items-center gap-2 rounded-[40px] bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-2" style={{ boxShadow: '0px 10px 40px 5px rgba(194,194,194,0.25)' }}>
              <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-5 py-3 text-[15px] text-black placeholder:text-gray-400 focus:outline-none" />
              <button onClick={() => navigate('/auth')} className="flex-shrink-0 rounded-[32px] px-7 py-3.5 text-[14px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110" style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}>
                Start Creating — Free
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1.5">
                <StarRating count={5} />
                <span className="text-[13px] font-medium text-gray-500">4.9/5</span>
              </div>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-[13px] text-gray-400">1,020+ reviews</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-[13px] text-gray-400">No credit card required</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating UI preview card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.8 }}
          className="relative z-10 mx-auto max-w-[900px] -mt-4 mb-12 px-6"
        >
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 mx-8">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-[11px] text-gray-400 w-48">app.aiinfluencer.com/generate</div>
              </div>
            </div>
            {/* Mock app content */}
            <div className="p-6 flex gap-6">
              <div className="w-48 space-y-3">
                <div className="w-full h-56 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-2 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 h-10 rounded-lg bg-gray-50 border border-gray-100" />
                  <div className="w-24 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-medium text-primary">Generate</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map(n => (
                    <div key={n} className="aspect-[3/4] rounded-lg bg-gradient-to-b from-gray-50 to-gray-100" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 2. STATS BAR ── */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-16 border-y border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
                <p className="text-[36px] font-bold text-black tracking-tight">{s.value}</p>
                <p className="text-[13px] text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 3. HOW IT WORKS ── */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">How it works</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Three steps to your first AI model
            </h2>
          </motion.div>

          <div className="space-y-20">
            {steps.map((step, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className={`flex items-center gap-16 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  {/* Text side */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary text-[13px] font-bold">{step.num}</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <h3 className="text-[28px] font-medium text-black mb-3" style={{ letterSpacing: '-0.02em' }}>{step.title}</h3>
                    <p className="text-[15px] text-gray-400 leading-relaxed mb-4">{step.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-primary">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {step.detail}
                    </span>
                  </div>
                  {/* Visual side */}
                  <div className="flex-1">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 h-[280px] flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center text-primary">
                        <Icon d={step.icon} className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 4. FEATURES (alternating blocks) ── */}
      {/* ══════════════════════════════════════════ */}
      <section id="features" className="py-28 bg-gray-50/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Features</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Built for creators who want results
            </h2>
            <p className="mt-4 text-[16px] text-gray-400 max-w-[480px] mx-auto">Not another AI toy. A professional content studio designed for monetization.</p>
          </motion.div>

          <div className="space-y-24">
            {featureBlocks.map((block, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className={`flex items-start gap-16 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary">{block.tag}</span>
                    <h3 className="text-[28px] font-medium text-black mt-3 mb-4" style={{ letterSpacing: '-0.02em' }}>{block.title}</h3>
                    <p className="text-[15px] text-gray-400 leading-relaxed mb-6">{block.desc}</p>
                    <ul className="space-y-3">
                      {block.points.map((p, pi) => (
                        <li key={pi} className="flex items-center gap-3 text-[14px] text-gray-600">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <FeatureVisual type={block.visual} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 5. SHOWCASE ── */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Showcase</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Real results from real creators
            </h2>
            <p className="mt-4 text-[16px] text-gray-400 max-w-[480px] mx-auto">These AI models were created on our platform. Every image, every post — generated by AI.</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-5">
            {showcaseModels.map((m, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
                  {/* Photo placeholder */}
                  <div className="w-full h-[260px] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[16px] font-semibold text-black">{m.name}</h4>
                      <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <p className="text-[13px] text-gray-400 mb-4">{m.niche}</p>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-[14px] font-semibold text-black">{m.followers}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Followers</p>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-black">{m.posts}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Posts</p>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-primary">{m.earnings}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 6. TESTIMONIALS ── */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28 bg-gray-50/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Testimonials</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Trusted by thousands of creators
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="bg-white p-7 rounded-2xl border border-gray-100 h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white text-[14px] font-semibold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-black">{t.name}</p>
                      <p className="text-[12px] text-gray-400">{t.role}</p>
                    </div>
                    <div className="ml-auto">
                      <StarRating count={5} />
                    </div>
                  </div>
                  <p className="text-[15px] text-gray-500 leading-relaxed mb-5">"{t.text}"</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-[12px] font-medium text-primary">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {t.metric}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 7. PRICING ── */}
      {/* ══════════════════════════════════════════ */}
      <section id="pricing" className="py-28">
        <div className="max-w-[1050px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Pricing</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Start free. Scale when ready.
            </h2>
            <p className="mt-4 text-[16px] text-gray-400">No hidden fees. Cancel anytime. All plans include core features.</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`relative p-8 rounded-2xl border h-full flex flex-col ${plan.popular ? 'border-primary shadow-[0_0_0_1px_#00AFF0]' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-semibold px-4 py-1 rounded-full">Most Popular</span>
                  )}
                  <div className="mb-6">
                    <h3 className="text-[18px] font-semibold text-black">{plan.name}</h3>
                    <p className="text-[13px] text-gray-400 mt-1">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-[42px] font-bold text-black tracking-tight">${plan.price}</span>
                    <span className="text-[14px] text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5 text-[14px] text-gray-500">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/auth')} className={`w-full py-3.5 rounded-xl text-[14px] font-medium cursor-pointer transition-all duration-150 ${plan.popular ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 8. FAQ ── */}
      {/* ══════════════════════════════════════════ */}
      <section id="faq" className="py-28 bg-gray-50/40">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">FAQ</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>Common questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group">
                    <span className="text-[15px] font-medium text-black pr-4">{faq.q}</span>
                    <svg className={`w-5 h-5 text-gray-300 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? 'max-h-[300px]' : 'max-h-0'}`}>
                    <div className="px-6 pb-5">
                      <p className="text-[14px] text-gray-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 9. FINAL CTA ── */}
      {/* ══════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Your AI influencer is{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                waiting
              </span>
            </h2>
            <p className="mt-5 text-[17px] text-gray-400 leading-relaxed">
              Join 12,000+ creators already building their virtual empire.<br />
              Start free. 50 credits included. No credit card.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <button onClick={() => navigate('/auth')} className="px-10 py-4 text-[15px] font-medium text-white rounded-full cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110" style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}>
                Get Started — It's Free
              </button>
              <a href="#features" className="px-6 py-4 text-[15px] font-medium text-gray-500 hover:text-black transition-colors">
                Learn more
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* ── 10. FOOTER ── */}
      {/* ══════════════════════════════════════════ */}
      <footer className="py-14 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-2">
              <span className="text-[18px] font-bold text-black tracking-tight">AI Influencer</span>
              <p className="mt-4 text-[14px] text-gray-400 leading-relaxed max-w-[280px]">
                The #1 AI studio for creating, managing, and monetizing virtual influencers. Built for creators who want real results.
              </p>
            </div>
            {Object.entries({ Product: ['Features', 'Pricing', 'Gallery', 'API Docs'], Company: ['About', 'Blog', 'Careers'], Legal: ['Privacy', 'Terms', 'Cookies'] }).map(([title, links]) => (
              <div key={title}>
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => <li key={link}><a href="#" className="text-[14px] text-gray-400 hover:text-black transition-colors">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[13px] text-gray-300">&copy; 2026 AI Influencer. All rights reserved.</p>
            <div className="flex gap-5">
              {['Twitter', 'Instagram', 'TikTok', 'Discord'].map((s) => (
                <a key={s} href="#" className="text-[13px] text-gray-300 hover:text-black transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes mosaicScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}

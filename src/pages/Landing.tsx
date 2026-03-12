import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─── Data ─── */
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

const steps = [
  {
    num: '01',
    title: 'Create Your Model',
    desc: 'Define appearance, personality, niche, and style. Our AI builds a unique, consistent character in seconds.',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    num: '02',
    title: 'Generate Content',
    desc: 'Create stunning photos, reels, and stories. Every image stays consistent with your model\'s identity.',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    num: '03',
    title: 'Monetize & Grow',
    desc: 'Post to social platforms, grow followers, sell subscriptions. Your AI influencer works 24/7.',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const features = [
  {
    title: 'Hyper-Realistic Generation',
    desc: 'Our AI produces images indistinguishable from real photos. Fans won\'t be able to tell the difference.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    title: 'Consistent Identity',
    desc: 'Same face, same body, every time. Your model maintains perfect consistency across all generated content.',
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0',
  },
  {
    title: 'Multiple Scenarios',
    desc: 'Beach, gym, bedroom, office, urban — generate content in any environment with one click.',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Instant Results',
    desc: 'No training, no waiting days. Upload references and start generating content in minutes, not weeks.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Full Control',
    desc: 'Adjust poses, expressions, outfits, and settings. You direct every shot like a professional photographer.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Track credits, generated content, model performance, and growth — all from a single clean dashboard.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

const showcaseModels = [
  { name: 'Sophia', niche: 'Fitness', age: 24, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop', followers: '124K' },
  { name: 'Luna', niche: 'Lifestyle', age: 22, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop', followers: '89K' },
  { name: 'Mia', niche: 'Fashion', age: 26, img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop', followers: '210K' },
  { name: 'Ava', niche: 'Travel', age: 23, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop', followers: '156K' },
  { name: 'Isabella', niche: 'Art', age: 25, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop', followers: '67K' },
  { name: 'Valentina', niche: 'Glamour', age: 21, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop', followers: '340K' },
];

const testimonials = [
  { name: 'Alex M.', text: 'I created 3 AI influencers and they already generate more engagement than my real accounts. Insane quality.', rating: 5 },
  { name: 'Sarah K.', text: 'The consistency is what sold me. Same face across hundreds of photos — my subscribers can\'t tell it\'s AI.', rating: 5 },
  { name: 'Marcus R.', text: 'Started as a test, now it\'s my main income stream. The generation speed is incredible.', rating: 5 },
  { name: 'Jessica L.', text: 'Finally a platform that understands what creators need. Clean interface, fast results, great support.', rating: 4 },
];

const plans = [
  { name: 'Starter', price: 0, period: 'Free forever', credits: 50, models: 1, features: ['50 credits on signup', '1 AI model', 'Standard quality', 'Basic scenarios', 'Community support'] },
  { name: 'Creator', price: 29, period: '/month', credits: 500, models: 5, features: ['500 credits/month', '5 AI models', 'HD quality', 'All scenarios', 'Priority support', 'Analytics dashboard'], popular: true },
  { name: 'Agency', price: 99, period: '/month', credits: 2500, models: 25, features: ['2,500 credits/month', '25 AI models', 'HD + 4K quality', 'Custom scenarios', 'Dedicated support', 'API access', 'White-label options'] },
];

const faqs = [
  { q: 'How realistic are the generated images?', a: 'Our AI produces hyper-realistic images that are virtually indistinguishable from real photographs. We use state-of-the-art generation models trained specifically for consistent, high-quality output.' },
  { q: 'Do I need to upload real photos?', a: 'No. You can create a completely original AI model from scratch by defining physical attributes, or you can upload reference photos to guide the AI\'s generation style.' },
  { q: 'How does the credit system work?', a: 'Credits are used to generate content. Standard quality costs 2 credits per image, HD costs 5 credits. You receive free credits on signup and can purchase more or subscribe to a plan.' },
  { q: 'Can I monetize the generated content?', a: 'Absolutely. All generated content is yours to use commercially. Many users post on social media, sell subscriptions, or license content to brands.' },
  { q: 'Is the AI model consistent across generations?', a: 'Yes — that\'s our core technology. Once you create a model, every generated image maintains the same facial features, body type, and identity.' },
  { q: 'How fast is content generation?', a: 'Standard quality images generate in under 30 seconds. HD takes about 60 seconds. No training period required — start generating immediately after creating your model.' },
];

const footerLinks = {
  Product: ['Features', 'Pricing', 'Gallery', 'API'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

/* ─── Section components ─── */
function SectionHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      {label && (
        <p className="text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3" style={{ fontFamily: "'Geist', sans-serif" }}>
          {label}
        </p>
      )}
      <h2
        className="text-[40px] font-semibold text-black leading-tight tracking-tight"
        style={{ fontFamily: "'Geist', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[17px] text-gray-500 max-w-[560px] mx-auto leading-relaxed" style={{ fontFamily: "'Geist', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

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
        <svg key={i} className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Landing ─── */
export function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white" style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-[18px] font-bold text-black tracking-tight">AI Influencer</span>
          <div className="flex items-center gap-8">
            {['Features', 'Pricing', 'FAQ'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-[14px] text-gray-500 hover:text-black transition-colors">
                {l}
              </a>
            ))}
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── 1. Hero ── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Mosaic BG */}
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
                    <img src={src} alt="" className="w-full rounded-2xl object-cover" style={{ height: `${300 + (i % 3) * 60}px` }} loading="lazy" />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Diagonal gradient: solid white top-left → reveals mosaic bottom-right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 25%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 mx-auto max-w-[1200px] px-6 pt-[240px] pb-20 flex flex-col items-center gap-8">
          <motion.h1 variants={fadeUp} className="text-center" style={{ fontWeight: 500, letterSpacing: '-0.04em' }}>
            <span className="text-[80px] leading-[1.05] text-black">
              Create your{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '100px' }}>
                AI influencer
              </span>
              <br />in minutes
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-center text-[18px] leading-[1.6] max-w-[554px]" style={{ color: 'rgba(55, 58, 70, 0.8)' }}>
            Generate hyper-realistic AI models, create stunning content, and build your virtual influencer empire — all from one platform.
          </motion.p>

          <motion.div variants={fadeUp} className="w-full max-w-[520px]">
            <div className="flex items-center gap-2 rounded-[40px] bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-2" style={{ boxShadow: '0px 10px 40px 5px rgba(194,194,194,0.25)' }}>
              <input type="email" placeholder="Enter your email address" className="flex-1 bg-transparent px-5 py-3 text-[15px] text-black placeholder:text-gray-400 focus:outline-none" />
              <button
                onClick={() => navigate('/auth')}
                className="flex-shrink-0 rounded-[32px] px-7 py-3.5 text-[14px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110"
                style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}
              >
                Create Free Account
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-5">
              <StarRating count={5} />
              <span className="text-[14px] font-medium text-gray-600">1,020+ Reviews</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. Social Proof ── */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-[12px] font-medium tracking-widest uppercase text-gray-400 mb-6">Trusted by creators worldwide</p>
          <div className="flex items-center justify-center gap-12 opacity-40">
            {['TikTok', 'Instagram', 'OnlyFans', 'Twitter', 'YouTube', 'Patreon'].map((p) => (
              <span key={p} className="text-[16px] font-semibold text-gray-800">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. How It Works ── */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="How it works" title="From zero to content in 3 steps" subtitle="No training. No waiting. Start generating professional content in minutes." />
          </motion.div>

          <div className="grid grid-cols-3 gap-8 mt-4">
            {steps.map((step, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="relative p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <span className="text-[48px] font-bold text-gray-100">{step.num}</span>
                  <div className="mt-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <Icon d={step.icon} className="w-5 h-5" />
                    </div>
                    <h3 className="text-[18px] font-semibold text-black mb-2">{step.title}</h3>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Features ── */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="Features" title="Everything you need to create" subtitle="A complete studio for building, generating, and managing your AI influencers." />
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Icon d={f.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-black mb-2">{f.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Showcase ── */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="Showcase" title="Meet our AI influencers" subtitle="Real models created by real users on the platform. Every image is AI-generated." />
          </motion.div>

          <div className="grid grid-cols-6 gap-4">
            {showcaseModels.map((m, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
                  <img src={m.img} alt={m.name} className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-[14px]">{m.name}, {m.age}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-white/70 text-[12px]">{m.niche}</span>
                      <span className="text-white/70 text-[12px]">{m.followers}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="Reviews" title="What our users say" />
          </motion.div>

          <div className="grid grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 h-full flex flex-col">
                  <StarRating count={t.rating} />
                  <p className="mt-4 text-[14px] text-gray-600 leading-relaxed flex-1">"{t.text}"</p>
                  <p className="mt-4 text-[13px] font-semibold text-black">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Pricing ── */}
      <section id="pricing" className="py-24">
        <div className="max-w-[1000px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="Pricing" title="Simple, transparent pricing" subtitle="Start free. Upgrade when you're ready to scale." />
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`relative p-7 rounded-2xl border h-full flex flex-col ${plan.popular ? 'border-primary bg-primary/[0.02]' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-[16px] font-semibold text-black">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold text-black">${plan.price}</span>
                    <span className="text-[14px] text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2.5 text-[14px] text-gray-600">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/auth')}
                    className={`mt-6 w-full py-3 rounded-xl text-[14px] font-medium cursor-pointer transition-colors ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    {plan.price === 0 ? 'Start Free' : 'Get Started'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section id="faq" className="py-24 bg-gray-50/50">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <SectionHeader label="FAQ" title="Frequently asked questions" />
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
                  >
                    <span className="text-[15px] font-medium text-black">{faq.q}</span>
                    <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-[14px] text-gray-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Final CTA ── */}
      <section className="py-24">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-[40px] font-semibold text-black tracking-tight">
              Ready to create your{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                AI influencer
              </span>
              ?
            </h2>
            <p className="mt-4 text-[17px] text-gray-500">
              Start free. No credit card required. 50 credits included.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="mt-8 px-10 py-4 text-[15px] font-medium text-white rounded-full cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110"
              style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}
            >
              Get Started — It's Free
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 10. Footer ── */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <span className="text-[18px] font-bold text-black tracking-tight">AI Influencer</span>
              <p className="mt-3 text-[13px] text-gray-500 leading-relaxed">
                The #1 platform for creating and monetizing AI-generated virtual influencers.
              </p>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <p className="text-[12px] font-semibold tracking-widest uppercase text-gray-400 mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[14px] text-gray-500 hover:text-black transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[13px] text-gray-400">&copy; 2026 AI Influencer. All rights reserved.</p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'TikTok'].map((s) => (
                <a key={s} href="#" className="text-[13px] text-gray-400 hover:text-black transition-colors">{s}</a>
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

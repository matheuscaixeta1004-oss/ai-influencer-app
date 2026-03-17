import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
  ['/images/mosaic/1.jpg', '/images/mosaic/2.jpg', '/images/mosaic/3.jpg', '/images/mosaic/4.jpg'],
  ['/images/mosaic/5.jpg', '/images/mosaic/6.jpg', '/images/mosaic/7.jpg', '/images/mosaic/8.jpg'],
  ['/images/mosaic/9.jpg', '/images/mosaic/10.jpg', '/images/mosaic/11.jpg', '/images/mosaic/12.jpg'],
  ['/images/mosaic/13.jpg', '/images/mosaic/14.jpg', '/images/mosaic/15.jpg', '/images/mosaic/16.jpg'],
  ['/images/mosaic/17.jpg', '/images/mosaic/18.jpg', '/images/mosaic/19.jpg', '/images/mosaic/20.jpg'],
];

/* ─── Data ─── */
const stats = [
  { value: '50K+', label: 'Modelos Criados' },
  { value: '2.4M', label: 'Imagens Geradas' },
  { value: '12K+', label: 'Criadores Ativos' },
  { value: '98%', label: 'Taxa de Satisfação' },
];

const steps = [
  {
    num: '01',
    title: 'Crie Sua Personagem',
    desc: 'Escolha etnia, tipo corporal, cabelo, olhos e traços de personalidade. Nossa IA cria um modelo único e consistente que é exclusivamente seu.',
    detail: 'Tempo médio de criação: 2 minutos',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    num: '02',
    title: 'Gere Conteúdo Ilimitado',
    desc: 'Escreva um prompt ou escolha um cenário — praia, academia, quarto, estúdio. Cada foto mantém exatamente o rosto e corpo do seu modelo. Sem inconsistências.',
    detail: 'Padrão: ~15s · HD: ~30s por imagem',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    num: '03',
    title: 'Publique e Monetize',
    desc: 'Poste direto no Instagram, TikTok, OnlyFans ou Patreon. Cresça sua audiência, venda assinaturas, feche parcerias — sua IA trabalha enquanto você dorme.',
    detail: 'Top criadores faturam R$25K-R$250K/mês',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const featureBlocks = [
  {
    tag: 'Tecnologia Central',
    title: 'Um rosto. Conteúdo infinito.',
    desc: 'Nosso motor proprietário de consistência garante que seu modelo de IA pareça idêntico em cada geração. Mesma estrutura óssea, mesma textura de pele, mesmas proporções — na praia ou no estúdio.',
    points: ['Tecnologia face-lock em todas as gerações', 'Proporções corporais consistentes em qualquer pose', 'Texturas de pele e iluminação naturais'],
    visual: 'consistency',
  },
  {
    tag: 'Velocidade',
    title: 'Um mês de conteúdo em uma tarde.',
    desc: 'Ensaios tradicionais levam dias de planejamento, milhares em orçamento e horas de edição. Com AI Influencer, você gera conteúdo profissional em segundos. Uma tarde = 30 dias de posts diários.',
    points: ['Gere mais de 100 imagens por sessão', 'Sem agendar fotógrafos ou modelos', 'Variações instantâneas: mesma roupa, pose diferente'],
    visual: 'speed',
  },
  {
    tag: 'Cenários',
    title: 'Qualquer ambiente. Qualquer clima.',
    desc: 'Pôr do sol na praia, apartamento luxuoso, selfie na academia, café instagramável, quarto íntimo, street style urbano — escolha entre 50+ cenários prontos ou escreva seus próprios prompts para controle total.',
    points: ['50+ cenários profissionais prontos', 'Suporte a prompts customizados', '4 modos de iluminação: natural, estúdio, golden hour, dramático'],
    visual: 'scenarios',
  },
];

const showcaseModels = [
  { name: 'Sophia', niche: 'Fitness & Bem-estar', followers: '124K', posts: '2.4K', earnings: 'R$41K/mês', photo: '/images/showcase/sophia.jpg' },
  { name: 'Luna', niche: 'Lifestyle & Viagem', followers: '89K', posts: '1.8K', earnings: 'R$25K/mês', photo: '/images/showcase/luna.jpg' },
  { name: 'Mia', niche: 'Moda & Luxo', followers: '210K', posts: '3.2K', earnings: 'R$77K/mês', photo: '/images/showcase/mia.jpg' },
  { name: 'Ava', niche: 'Cosplay & Games', followers: '156K', posts: '2.1K', earnings: 'R$58K/mês', photo: '/images/showcase/ava.jpg' },
];

const testimonials = [
  { name: 'Alex M.', role: 'Dono de Agência de Conteúdo', avatar: 'A', text: 'Substituí 3 modelos humanas por AI Influencer. Mesma qualidade, 10x mais produção, fração do custo. Meus clientes não percebem a diferença.', metric: '10x mais produção' },
  { name: 'Sarah K.', role: 'Criadora Solo', avatar: 'S', text: 'Saí de 0 para 45K assinantes em 4 meses. A consistência é o que faz as pessoas acreditarem que ela é real. Melhor investimento que já fiz.', metric: '45K subs em 4 meses' },
  { name: 'Marcus R.', role: 'Empreendedor Digital', avatar: 'M', text: 'Gerencio 5 modelos de IA simultaneamente, cada uma com personalidade e nicho próprios. A plataforma torna simples administrar todas elas.', metric: '5 modelos, R$140K/mês' },
  { name: 'Jéssica L.', role: 'Gerente de Marketing', avatar: 'J', text: 'Usamos AI Influencer para fotografia de produtos e redes sociais. Só a velocidade nos economizou R$200K em custos de produção neste trimestre.', metric: 'R$200K economizados/tri' },
];

const plans = [
  { name: 'Starter', price: 0, period: 'Grátis pra sempre', desc: 'Experimente sem compromisso', credits: 50, models: 1, features: ['50 créditos no cadastro', '1 modelo de IA', 'Qualidade padrão', 'Cenários básicos', 'Suporte da comunidade'] },
  { name: 'Creator', price: 29, period: '/mês', desc: 'Para criadores dedicados', credits: 500, models: 5, popular: true, features: ['500 créditos/mês', '5 modelos de IA', 'Qualidade HD', 'Todos os 50+ cenários', 'Suporte prioritário', 'Painel de analytics', 'Download direto'] },
  { name: 'Agency', price: 99, period: '/mês', desc: 'Para equipes e agências', credits: 2500, models: 25, features: ['2.500 créditos/mês', '25 modelos de IA', 'Qualidade HD + 4K', 'Cenários customizados', 'Gerente dedicado', 'Acesso à API', 'White-label', 'Geração em lote'] },
];

const faqs = [
  { q: 'Quão realistas são as imagens geradas?', a: 'Extremamente. Nossa IA produz imagens virtualmente indistinguíveis de fotografias reais. Usamos tecnologia proprietária de consistência facial que mantém traços faciais, textura de pele e proporções corporais idênticos em cada geração. Muitos seguidores dos nossos criadores genuinamente acreditam que os modelos são pessoas reais.' },
  { q: 'Eu sou dono do conteúdo gerado?', a: 'Sim, 100%. Todo conteúdo gerado na plataforma é seu para uso comercial — poste em redes sociais, venda assinaturas, licencie para marcas ou use em publicidade. Não há taxas de royalty ou restrições de uso.' },
  { q: 'Como funciona o sistema de créditos?', a: 'Créditos são a moeda para gerar conteúdo. Qualidade padrão (1024×1024) custa 2 créditos por imagem. Qualidade HD (2048×2048) custa 5 créditos. Criar um novo modelo custa 10 créditos. Contas gratuitas começam com 50 créditos, e planos pagos incluem créditos mensais.' },
  { q: 'Posso criar conteúdo adulto (NSFW)?', a: 'Sim. AI Influencer suporta criação de conteúdo adulto para plataformas como OnlyFans, Fansly e Patreon. Você tem controle total sobre o estilo e nível de explicitude do conteúdo. Todo conteúdo é gerado de forma responsável com diretrizes de segurança integradas.' },
  { q: 'Qual a diferença pro Midjourney ou DALL-E?', a: 'A diferença-chave é a consistência. Ferramentas genéricas de IA criam um rosto diferente a cada vez. AI Influencer cria um modelo persistente com traços faciais fixos — a mesma pessoa aparece em toda imagem, tornando possível construir uma presença online crível com identidade consistente.' },
  { q: 'E se eu não gostar do meu modelo?', a: 'Você pode ajustar qualquer aspecto do seu modelo a qualquer momento — traços faciais, tipo corporal, cabelo, tom de pele. Se quiser recomeçar, criar um novo modelo custa 10 créditos. A maioria dos usuários encontra seu modelo ideal em 1-2 iterações.' },
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
        <div className="ml-2 text-[11px] text-emerald-500 font-medium">100% idêntico</div>
      </div>
    );
  }
  if (type === 'speed') {
    return (
      <div className="flex items-center gap-6 py-8 justify-center">
        <div className="text-center">
          <div className="text-[32px] font-bold text-red-400 line-through opacity-50">R$16K</div>
          <div className="text-[11px] text-gray-400 mt-1">Ensaio tradicional</div>
        </div>
        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        <div className="text-center">
          <div className="text-[32px] font-bold text-primary">R$0,60</div>
          <div className="text-[11px] text-gray-400 mt-1">Por imagem com IA</div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 gap-2 py-8">
      {['Praia', 'Estúdio', 'Urbano', 'Academia', 'Quarto', 'Escritório', 'Rooftop', 'Natureza'].map((s) => (
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
  const { user, loading: authLoading } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Already logged in → go to dashboard
  if (!authLoading && user) return <Navigate to="/dashboard" replace />;
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
          {[{ label: 'Recursos', href: 'features' }, { label: 'Preços', href: 'pricing' }, { label: 'FAQ', href: 'faq' }].map((l) => (
            <a key={l.href} href={`#${l.href}`} className="px-4 py-2 text-[13px] font-medium text-black/50 hover:text-black/80 hover:bg-white/40 rounded-full transition-all duration-200">
              {l.label}
            </a>
          ))}
          <button onClick={() => navigate('/auth')} className="ml-1 px-5 py-2 text-[13px] font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors cursor-pointer">
            Começar Agora
          </button>
        </div>
      </nav>

      {/* ── 1. HERO ── */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
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
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[12px] font-medium text-primary">Em beta público — 50 créditos grátis no cadastro</span>
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-center" style={{ fontWeight: 500, letterSpacing: '-0.04em' }}>
            <span className="text-[76px] leading-[1.05] text-black">
              Crie sua{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: '96px' }}>
                AI influencer
              </span>
              <br />em minutos
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-center text-[18px] leading-[1.65] max-w-[540px]" style={{ color: '#666' }}>
            Crie uma modelo virtual hiper-realista. Gere milhares de fotos consistentes. Construa uma audiência e monetize — sem nunca contratar um fotógrafo.
          </motion.p>

          <motion.div variants={fadeUp} className="w-full max-w-[520px]">
            <div className="flex items-center gap-2 rounded-[40px] bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-2" style={{ boxShadow: '0px 10px 40px 5px rgba(194,194,194,0.25)' }}>
              <input type="email" placeholder="Digite seu email" className="flex-1 bg-transparent px-5 py-3 text-[15px] text-black placeholder:text-gray-400 focus:outline-none" />
              <button onClick={() => navigate('/auth')} className="flex-shrink-0 rounded-[32px] px-7 py-3.5 text-[14px] font-medium text-white cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110" style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}>
                Começar Grátis
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1.5">
                <StarRating count={5} />
                <span className="text-[13px] font-medium text-gray-500">4.9/5</span>
              </div>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-[13px] text-gray-400">1.020+ avaliações</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="text-[13px] text-gray-400">Sem cartão de crédito</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.8 }} className="relative z-10 mx-auto max-w-[900px] -mt-4 mb-12 px-6">
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 mx-8">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-[11px] text-gray-400 w-48">app.aiinfluencer.com/gerar</div>
              </div>
            </div>
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
                  <div className="w-24 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-medium text-primary">Gerar</div>
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

      {/* ── 2. STATS BAR ── */}
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

      {/* ── 3. HOW IT WORKS ── */}
      <section className="py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Como funciona</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Três passos para seu primeiro modelo de IA
            </h2>
          </motion.div>

          <div className="space-y-20">
            {steps.map((step, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <div className={`flex items-center gap-16 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
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

      {/* ── 4. FEATURES ── */}
      <section id="features" className="py-28 bg-gray-50/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-20">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Recursos</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Feito para criadores que querem resultados
            </h2>
            <p className="mt-4 text-[16px] text-gray-400 max-w-[480px] mx-auto">Não é mais um brinquedo de IA. Um estúdio profissional de conteúdo projetado para monetização.</p>
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

      {/* ── 5. SHOWCASE ── */}
      <section className="py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Vitrine</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Resultados reais de criadores reais
            </h2>
            <p className="mt-4 text-[16px] text-gray-400 max-w-[480px] mx-auto">Esses modelos de IA foram criados na nossa plataforma. Cada imagem, cada post — gerado por IA.</p>
          </motion.div>

          <div className="grid grid-cols-4 gap-5">
            {showcaseModels.map((m, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
                  <div className="w-full h-[260px] overflow-hidden">
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[16px] font-semibold text-black">{m.name}</h4>
                      <span className="text-[11px] font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Ativo</span>
                    </div>
                    <p className="text-[13px] text-gray-400 mb-4">{m.niche}</p>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-[14px] font-semibold text-black">{m.followers}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Seguidores</p>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-black">{m.posts}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Posts</p>
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-primary">{m.earnings}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Receita</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-28 bg-gray-50/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Depoimentos</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Aprovado por milhares de criadores
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

      {/* ── 7. PRICING ── */}
      <section id="pricing" className="py-28">
        <div className="max-w-[1050px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">Preços</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Comece grátis. Escale quando quiser.
            </h2>
            <p className="mt-4 text-[16px] text-gray-400">Sem taxas ocultas. Cancele quando quiser. Todos os planos incluem recursos essenciais.</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={i} variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`relative p-8 rounded-2xl border h-full flex flex-col ${plan.popular ? 'border-primary shadow-[0_0_0_1px_#00AFF0]' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-semibold px-4 py-1 rounded-full">Mais Popular</span>
                  )}
                  <div className="mb-6">
                    <h3 className="text-[18px] font-semibold text-black">{plan.name}</h3>
                    <p className="text-[13px] text-gray-400 mt-1">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-[42px] font-bold text-black tracking-tight">R${plan.price}</span>
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
                    {plan.price === 0 ? 'Começar Grátis' : 'Começar Agora'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section id="faq" className="py-28 bg-gray-50/40">
        <div className="max-w-[720px] mx-auto px-6">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-4">FAQ</p>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>Perguntas frequentes</h2>
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

      {/* ── 9. FINAL CTA ── */}
      <section className="py-28">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <motion.div variants={sectionFade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-[40px] font-medium text-black" style={{ letterSpacing: '-0.03em' }}>
              Sua AI influencer está{' '}
              <span className="text-primary" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
                esperando
              </span>
            </h2>
            <p className="mt-5 text-[17px] text-gray-400 leading-relaxed">
              Junte-se a mais de 12.000 criadores já construindo seu império virtual.<br />
              Comece grátis. 50 créditos inclusos. Sem cartão de crédito.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <button onClick={() => navigate('/auth')} className="px-10 py-4 text-[15px] font-medium text-white rounded-full cursor-pointer transition-all duration-150 active:scale-[0.97] hover:brightness-110" style={{ background: 'linear-gradient(180deg, #00BFF5 0%, #00AFF0 50%, #0099D4 100%)', boxShadow: 'inset -4px -6px 25px 0px rgba(255,255,255,0.12), inset 4px 4px 10px 0px rgba(0,0,0,0.15)' }}>
                Começar Agora — É Grátis
              </button>
              <a href="#features" className="px-6 py-4 text-[15px] font-medium text-gray-500 hover:text-black transition-colors">
                Saiba mais
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="py-14 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-2">
              <span className="text-[18px] font-bold text-black tracking-tight">AI Influencer</span>
              <p className="mt-4 text-[14px] text-gray-400 leading-relaxed max-w-[280px]">
                O estúdio #1 de IA para criar, gerenciar e monetizar influencers virtuais. Feito para criadores que querem resultados reais.
              </p>
            </div>
            {Object.entries({ Produto: ['Recursos', 'Preços', 'Galeria', 'API Docs'], Empresa: ['Sobre', 'Blog', 'Carreiras'], Legal: ['Privacidade', 'Termos', 'Cookies'] }).map(([title, links]) => (
              <div key={title}>
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => <li key={link}><a href="#" className="text-[14px] text-gray-400 hover:text-black transition-colors">{link}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[13px] text-gray-300">&copy; 2026 AI Influencer. Todos os direitos reservados.</p>
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

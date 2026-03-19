# MEMORY.md — Long-Term Memory

_Last synced: 2026-03-19 11:06 UTC_

---

## 👤 User: Matheus
- Comunicação em português (pt-BR)
- Trabalha com AI influencer / criação de conteúdo
- Projetos principais: AI Influencer App (Studio), Genviral, TikTok/IG growth
- Prefere dark themes no estilo Freepik Dreamachine
- Ícones: Material Symbols Rounded (zero emojis no app)
- Deploy: Vercel (frontend), Supabase (backend/auth/DB)
- Git: GitHub via SSH ("Gengis Khan VPS")

## 🚀 AI Influencer App — Studio
- Stack: React + ReactFlow + Supabase
- Studio = canvas visual com cards (Image Gen, Video Gen, Model Ref)
- Persistência de projetos no Supabase (tabela `studio_projects`, RLS configurado)
- Auto-save debounced 2s com refs (bug de loop infinito corrigido)
- Tema: migrado de dark para **light theme** (token object `CARD`)
- Spaces view: landing page estilo Freepik com grid de projetos
- Drag-to-create: arrastar handle → espaço vazio → menu → auto-connect
- Conexões type-safe: text↔text, image↔image, video↔video, audio↔audio
- **Lição ReactFlow:** Handle deve SER o elemento visual, não overlay invisível sobre ele
- Auth: Supabase com persistSession, autoRefreshToken, OAuth redirect → /dashboard

### Pendências Studio
- [ ] Dropdown customizado (nativo herda dark mode do OS)
- [ ] Testar auto-save pós-fix loop infinito

## 📊 Analytics (2026-03-17)
- TikTok: 28.200 seguidores (+4%), 1.88M views
- Instagram: 16.373 seguidores (+8.8%)
- Engagement TikTok em queda: 10.62 → 9.94 → 9.38 → 8.88% (4ª queda seguida)

## 💡 Intel & Decisões Pendentes
- Fanvue Series A $22M, AI Voice Calls, perfis AI monetizando com ~800 seg IG
- Kling MC 3.0 rollout completo (múltiplas refs de rosto)
- Nicho AI influencer se comoditizando — diferencial = storytelling + persona
- **Pendente:** Soft launch Fanvue agora vs esperar 100K TikTok?
- **Pendente:** Migração EvoLink v3 — go/no-go?
- **Pendente:** Persona de voz da Aiyara — brief?

## 🔧 Infra
- SSH Ed25519 configurado no servidor, push via git@github.com
- Branch limpa: só `main` no remote
- Cron de memory sync a cada 2h

## 📝 Lessons Learned
- ReactFlow: Handle IS the visual circle — nunca usar overlay invisível
- Supabase auto-save: usar refs para todas dependências (zero deps no useCallback) pra evitar loop infinito
- Auth Supabase: sempre persistSession + autoRefreshToken + detectSessionInUrl

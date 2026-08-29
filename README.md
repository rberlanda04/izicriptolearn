# iziCripto — Plataforma de Cursos

Plataforma de cursos sobre Web3/cripto: catálogo, leitor de aulas (React Router), contas de
usuário com progresso salvo, paywall de cursos Pro, e um painel administrativo com CRUD
completo de cursos, módulos e aulas.

## Stack

- `server/` — API REST (Express) + banco de dados via **Prisma** (SQLite em dev, troca de
  1 linha para Postgres em produção). Autenticação por e-mail/senha (bcrypt + JWT).
  Assinatura via **Stripe** (opcional, desligada por padrão — ver seção Billing).
- `client/` — React + React Router DOM + Tailwind v4.

## Como rodar

```bash
# Backend
cd server
npm install
cp .env.example .env        # edite JWT_SECRET (ver instruções no arquivo)
npm run prisma:push         # cria o banco SQLite local (server/prisma/dev.db)
npm run seed                # popula 6 cursos (39 aulas) + usuário admin
npm start                   # API em http://localhost:4100

# Frontend (outro terminal)
cd client
npm install
npm run dev                 # http://localhost:5180 (proxy de /api para o backend)
```

Sem `ADMIN_SEED_PASSWORD` definida no `.env`, o seed cria o admin com uma senha de
desenvolvimento óbvia (avisada no terminal) — defina essa variável antes de rodar contra
qualquer banco que não seja local/descartável.

## Contas e planos

- Qualquer pessoa pode criar conta gratuita (`/registrar`) e acessar os cursos marcados
  como gratuitos, com progresso salvo por aula.
- Cursos marcados `isPro` ficam bloqueados (conteúdo das aulas não é nem enviado pela API)
  até o usuário ter `plan: "pro"` — usuários com `role: "admin"` sempre veem tudo.
- `/admin` é protegido por rota (`role: "admin"`) — só o usuário de seed e quem for
  promovido manualmente no banco têm acesso.

## Billing (Stripe)

Desligado por padrão — `/api/billing/status` retorna `configured: false` e o botão
"Assinar Pro" mostra aviso de que nenhuma cobrança será feita. Para ativar:

1. Crie um preço recorrente no dashboard da Stripe (modo teste primeiro).
2. Preencha `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO` e `STRIPE_WEBHOOK_SECRET` no `.env`.
3. Configure o endpoint de webhook da Stripe apontando para `/api/billing/webhook`.

Nunca cole chaves da Stripe em chat/commit — elas só devem existir no `.env` local
(já está no `.gitignore`).

## Rotas do app

- `/`, `/cursos`, `/cursos/:id`, `/cursos/:id/aulas/:lessonId`, `/glossario`, `/precos`
- `/entrar`, `/registrar` — autenticação
- `/admin`, `/admin/cursos/:id` — protegidas, só `role: admin`

## Documentos de planejamento

- Plano de negócio completo (modelo de receita, mercado, roadmap, escalabilidade técnica,
  projeções ilustrativas) e o portal educativo público — publicados como Artifacts,
  links compartilhados na conversa que gerou este projeto.

## Aviso

Conteúdo educativo — nada aqui é recomendação de investimento. Ver seção 9 do plano de
negócio para considerações legais (LGPD, disclaimers) antes de operar com usuários reais.

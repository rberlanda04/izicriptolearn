require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { WebSocketServer } = require('ws');
const { prisma } = require('./db');
const { hashPassword, verifyPassword, signToken, verifyToken, authenticate, optionalAuthenticate, requireAdmin } = require('./auth');
const { isBillingConfigured, createCheckoutSession, constructWebhookEvent } = require('./billing');
const { SimulatorSessionManager } = require('./simulator/sessionManager');
const { defaultSimulatorConfig } = require('./simulator/config');
const { runBacktest } = require('./simulator/backtest');

const app = express();

// Proteção de cabeçalhos HTTP via Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Desabilitado no backend para permitir flexibilidade com SPA e conexões WebSocket
}));

// CORS flexível
app.use(cors());

// Rate Limiters para proteção contra DoS, Brute-force e abuso de IA/Backtest
const generalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 400,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas requisições. Aguarde um momento antes de tentar novamente.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.' },
});

const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Limite de consultas à IA atingido. Aguarde um minuto.' },
});

const backtestLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Limite de execuções de backtest atingido. Tente novamente em alguns minutos.' },
});

app.use('/api', generalLimiter);

// Simulador de trade educacional: cada conta logada tem sua própria carteira simulada
// (saldo, posições, histórico, reset), criada sob demanda no primeiro acesso — ver
// sessionManager.js. Os dados de mercado (OKX) e o analista de IA continuam
// compartilhados entre todas as sessões, só a contabilidade de cada usuário é isolada.
const simulatorSessions = new SimulatorSessionManager({ ...defaultSimulatorConfig });

// Envolve toda rota async: sem isso, um erro (ex: Prisma rejeitando uma query) vira uma
// promise rejeitada sem handler e derruba o processo Node inteiro — uma única requisição
// mal formada tirava a API do ar para todo mundo. Com isso, o erro vai para o middleware
// de erro abaixo e vira uma resposta 500 comum, sem matar o servidor.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Webhook da Stripe precisa do corpo bruto (para verificar a assinatura) — por isso
// vem antes do express.json() global, que consumiria o corpo como JSON já parseado.
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), wrap(async (req, res) => {
    if (!isBillingConfigured()) return res.status(400).send('Billing não configurado.');
    let event;
    try {
        event = constructWebhookEvent(req.body, req.headers['stripe-signature']);
    } catch (err) {
        return res.status(400).send(`Webhook signature inválida: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        if (userId) {
            await prisma.user.update({ where: { id: userId }, data: { plan: 'pro' } }).catch(() => {});
        }
    }
    res.json({ received: true });
}));

app.use(express.json({ limit: '2mb' }));

function publicUser(user) {
    return { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan };
}

// Ter conta é o requisito mínimo pra ler qualquer aula, mesmo em curso gratuito — o
// catálogo continua público (título/resumo), só o conteúdo em si exige login. Cursos Pro
// seguem exigindo, além disso, plano pro (ou ser admin).
function isUnlocked(course, user) {
    if (!user) return false;
    if (!course.isPro) return true;
    return user.role === 'admin' || user.plan === 'pro';
}

// ---------- Auth ----------

app.post('/api/auth/register', authLimiter, wrap(async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: 'E-mail e senha (mín. 6 caracteres) são obrigatórios.' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Já existe uma conta com este e-mail.' });

    const user = await prisma.user.create({
        data: { email, passwordHash: await hashPassword(password), name: name || null },
    });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
}));

app.post('/api/auth/login', authLimiter, wrap(async (req, res) => {
    const { email, password } = req.body || {};
    const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
    if (!user || !(await verifyPassword(password || '', user.passwordHash))) {
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
}));

app.get('/api/auth/me', authenticate, wrap(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(publicUser(user));
}));

// ---------- Courses ----------

app.get('/api/courses', optionalAuthenticate, wrap(async (req, res) => {
    const courses = await prisma.course.findMany({
        orderBy: { order: 'asc' },
        include: { modules: { include: { lessons: true } } },
    });
    res.json(courses.map((c) => ({
        id: c.id, title: c.title, summary: c.summary, level: c.level, category: c.category,
        isPro: c.isPro, unlocked: isUnlocked(c, req.user),
        moduleCount: c.modules.length,
        lessonCount: c.modules.reduce((s, m) => s + m.lessons.length, 0),
        updatedAt: c.updatedAt,
    })));
}));

app.get('/api/courses/:id', optionalAuthenticate, wrap(async (req, res) => {
    const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: { modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } } },
    });
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const unlocked = isUnlocked(course, req.user);
    const payload = {
        ...course,
        unlocked,
        modules: course.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) => (unlocked ? l : { ...l, content: null, locked: true })),
        })),
    };
    res.json(payload);
}));

app.post('/api/courses', authenticate, requireAdmin, wrap(async (req, res) => {
    const { title, summary, level, category, isPro } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ error: 'Título é obrigatório.' });

    const base = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let id = base, n = 2;
    while (await prisma.course.findUnique({ where: { id } })) { id = `${base}-${n}`; n++; }

    const count = await prisma.course.count();
    const course = await prisma.course.create({
        data: { id, title: title.trim(), summary: summary || '', level: level || 'iniciante', category: category || 'Geral', isPro: Boolean(isPro), order: count },
    });
    res.status(201).json(course);
}));

app.put('/api/courses/:id', authenticate, requireAdmin, wrap(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const { title, summary, level, category, isPro } = req.body || {};
    const updated = await prisma.course.update({
        where: { id: req.params.id },
        data: { title, summary, level, category, isPro },
    });
    res.json(updated);
}));

app.delete('/api/courses/:id', authenticate, requireAdmin, wrap(async (req, res) => {
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });
    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).end();
}));

// ---------- Modules ----------

app.post('/api/courses/:id/modules', authenticate, requireAdmin, wrap(async (req, res) => {
    const { title } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ error: 'Título do módulo é obrigatório.' });
    const course = await prisma.course.findUnique({ where: { id: req.params.id } });
    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const count = await prisma.module.count({ where: { courseId: req.params.id } });
    await prisma.module.create({ data: { title: title.trim(), courseId: req.params.id, order: count } });
    res.status(201).json(await getFullCourse(req.params.id));
}));

app.put('/api/courses/:id/modules/:moduleId', authenticate, requireAdmin, wrap(async (req, res) => {
    const mod = await prisma.module.findUnique({ where: { id: req.params.moduleId } });
    if (!mod || mod.courseId !== req.params.id) return res.status(404).json({ error: 'Módulo não encontrado.' });
    await prisma.module.update({ where: { id: req.params.moduleId }, data: { title: req.body?.title } });
    res.json(await getFullCourse(req.params.id));
}));

app.delete('/api/courses/:id/modules/:moduleId', authenticate, requireAdmin, wrap(async (req, res) => {
    const mod = await prisma.module.findUnique({ where: { id: req.params.moduleId } });
    if (!mod || mod.courseId !== req.params.id) return res.status(404).json({ error: 'Módulo não encontrado.' });
    await prisma.module.delete({ where: { id: req.params.moduleId } });
    res.json(await getFullCourse(req.params.id));
}));

// ---------- Lessons ----------

app.post('/api/courses/:id/modules/:moduleId/lessons', authenticate, requireAdmin, wrap(async (req, res) => {
    const { title, content, durationMin } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ error: 'Título da aula é obrigatório.' });
    const mod = await prisma.module.findUnique({ where: { id: req.params.moduleId } });
    if (!mod || mod.courseId !== req.params.id) return res.status(404).json({ error: 'Módulo não encontrado.' });

    const count = await prisma.lesson.count({ where: { moduleId: req.params.moduleId } });
    await prisma.lesson.create({
        data: { title: title.trim(), content: content || '', durationMin: Number(durationMin) || 5, moduleId: req.params.moduleId, order: count },
    });
    res.status(201).json(await getFullCourse(req.params.id));
}));

app.put('/api/courses/:id/modules/:moduleId/lessons/:lessonId', authenticate, requireAdmin, wrap(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.lessonId } });
    if (!lesson || lesson.moduleId !== req.params.moduleId) return res.status(404).json({ error: 'Aula não encontrada.' });

    const { title, content, durationMin, diagramKey } = req.body || {};
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (durationMin !== undefined) data.durationMin = Number(durationMin);
    if (diagramKey !== undefined) data.diagramKey = diagramKey || null;
    await prisma.lesson.update({ where: { id: req.params.lessonId }, data });
    res.json(await getFullCourse(req.params.id));
}));

app.delete('/api/courses/:id/modules/:moduleId/lessons/:lessonId', authenticate, requireAdmin, wrap(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.lessonId } });
    if (!lesson || lesson.moduleId !== req.params.moduleId) return res.status(404).json({ error: 'Aula não encontrada.' });
    await prisma.lesson.delete({ where: { id: req.params.lessonId } });
    res.json(await getFullCourse(req.params.id));
}));

async function getFullCourse(id) {
    return prisma.course.findUnique({
        where: { id },
        include: { modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } } },
    });
}

// ---------- Progress ----------

app.get('/api/progress', authenticate, wrap(async (req, res) => {
    const rows = await prisma.progress.findMany({ where: { userId: req.user.sub } });
    res.json(rows.map((r) => r.lessonId));
}));

app.post('/api/progress/:lessonId', authenticate, wrap(async (req, res) => {
    const lesson = await prisma.lesson.findUnique({ where: { id: req.params.lessonId } });
    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada.' });

    await prisma.progress.upsert({
        where: { userId_lessonId: { userId: req.user.sub, lessonId: req.params.lessonId } },
        create: { userId: req.user.sub, lessonId: req.params.lessonId },
        update: {},
    });
    res.status(204).end();
}));

app.delete('/api/progress/:lessonId', authenticate, wrap(async (req, res) => {
    await prisma.progress.delete({
        where: { userId_lessonId: { userId: req.user.sub, lessonId: req.params.lessonId } },
    }).catch(() => {});
    res.status(204).end();
}));

// ---------- Jornada (progresso agregado + próxima aula + sequência de dias) ----------
// Alimenta o painel "Sua Jornada" da home logada: uma visão única que conecta cursos e
// simulador, em vez de o usuário ter que descobrir sozinho onde parou ou o que fazer a seguir.

app.get('/api/journey', authenticate, wrap(async (req, res) => {
    const userId = req.user.sub;
    const [progressRows, courses] = await Promise.all([
        prisma.progress.findMany({ where: { userId } }),
        prisma.course.findMany({
            orderBy: { order: 'asc' },
            include: { modules: { orderBy: { order: 'asc' }, include: { lessons: { orderBy: { order: 'asc' } } } } },
        }),
    ]);

    const completedIds = new Set(progressRows.map((r) => r.lessonId));
    const totalLessons = courses.reduce((s, c) => s + c.modules.reduce((s2, m) => s2 + m.lessons.length, 0), 0);

    // Sequência (streak): dias de calendário (UTC) consecutivos, terminando hoje ou ontem,
    // com pelo menos uma aula concluída em cada um.
    const daysWithActivity = new Set(progressRows.map((r) => r.completedAt.toISOString().slice(0, 10)));
    let streakDays = 0;
    const cursor = new Date();
    if (!daysWithActivity.has(cursor.toISOString().slice(0, 10))) cursor.setUTCDate(cursor.getUTCDate() - 1);
    while (daysWithActivity.has(cursor.toISOString().slice(0, 10))) {
        streakDays++;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    let nextLesson = null;
    const courseProgress = [];
    for (const course of courses) {
        const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
        const completed = lessonIds.filter((id) => completedIds.has(id)).length;
        courseProgress.push({ id: course.id, title: course.title, isPro: course.isPro, completed, total: lessonIds.length });

        if (nextLesson || !isUnlocked(course, req.user)) continue;
        for (const mod of course.modules) {
            const lesson = mod.lessons.find((l) => !completedIds.has(l.id));
            if (lesson) { nextLesson = { courseId: course.id, courseTitle: course.title, lessonId: lesson.id, lessonTitle: lesson.title }; break; }
        }
    }

    res.json({
        streakDays,
        totalCompleted: completedIds.size,
        totalLessons,
        xp: completedIds.size * 10,
        nextLesson,
        courseProgress,
    });
}));

// ---------- Billing ----------

app.get('/api/billing/status', (req, res) => {
    res.json({ configured: isBillingConfigured() });
});

app.post('/api/billing/checkout', authenticate, wrap(async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
        const session = await createCheckoutSession(user);
        res.json({ url: session.url });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

// ---------- Simulador de trade (educacional) ----------
// Cada conta logada opera sua própria carteira simulada isolada (ver sessionManager.js) —
// por isso toda rota abaixo exige login, inclusive as de leitura: não existe mais "o"
// estado do simulador, só "o seu" estado.

function redactSimulatorConfig(config) {
    const { aiAnalyst, ...safe } = config;
    return { ...safe, aiAnalyst: { enabled: Boolean(aiAnalyst?.enabled) } };
}

function redactSimulatorSnapshot(snapshot) {
    return { ...snapshot, config: redactSimulatorConfig(snapshot.config) };
}

app.get('/api/simulator/status', authenticate, (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    res.json(redactSimulatorSnapshot(sim.getSnapshot()));
});

app.get('/api/simulator/config', authenticate, (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    res.json(redactSimulatorConfig(sim.config));
});

app.get('/api/simulator/trades', authenticate, (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    res.json(sim.engine.trades);
});

app.post('/api/simulator/backtest', authenticate, backtestLimiter, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    const days = Math.min(30, Math.max(1, Number(req.body?.days || 7)));
    try {
        const result = await runBacktest({ ...sim.config }, days);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}));

app.post('/api/simulator/ai-chat', authenticate, aiLimiter, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    if (!sim.aiAnalyst.isEnabled()) {
        return res.status(400).json({ error: 'Analista de IA não configurado neste ambiente.' });
    }
    const history = Array.isArray(req.body?.messages) ? req.body.messages.slice(-20) : [];
    if (history.length === 0) return res.status(400).json({ error: 'Envie ao menos uma mensagem em "messages".' });

    const reply = await sim.chatWithAnalyst(history);
    if (!reply) return res.status(502).json({ error: 'IA não respondeu (indisponível no momento).' });
    res.json({ reply });
}));

app.post('/api/simulator/ai-insight/:symbol', authenticate, aiLimiter, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    if (!sim.aiAnalyst.isEnabled()) {
        return res.status(400).json({ error: 'Analista de IA não configurado neste ambiente.' });
    }
    const text = await sim.requestMarketRead(decodeURIComponent(req.params.symbol));
    if (!text) return res.status(502).json({ error: 'IA não retornou análise (sem dados de mercado ainda, ou indisponível).' });
    res.json({ text });
}));

// ---------- Rotas de Operação Manual & Gestão de Posições (Exchange Style) ----------

app.post('/api/simulator/trade/open', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    try {
        const position = sim.openManualPosition(req.body || {});
        res.status(201).json({ ok: true, position });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

app.post('/api/simulator/trade/close', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    const { symbol, reason } = req.body || {};
    if (!symbol) return res.status(400).json({ error: 'Símbolo é obrigatório.' });
    try {
        const trade = sim.closePositionManual(symbol, reason || 'MANUAL_CLOSE');
        res.json({ ok: true, trade });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

app.post('/api/simulator/trade/close-all', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    try {
        const closed = sim.closeAllPositionsManual(req.body?.reason || 'MANUAL_CLOSE_ALL');
        res.json({ ok: true, closedCount: closed.length, closed });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

app.post('/api/simulator/trade/update-stops', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    const { symbol, takeProfit, stopLoss, isTrailingStop } = req.body || {};
    if (!symbol) return res.status(400).json({ error: 'Símbolo é obrigatório.' });
    try {
        const position = sim.updateStopsManual(symbol, { takeProfit, stopLoss, isTrailingStop });
        res.json({ ok: true, position });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

app.post('/api/simulator/reset', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    try {
        const initialCapital = Number(req.body?.initialCapital) || 10000;
        const result = sim.resetAccount(initialCapital);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}));

app.post('/api/simulator/toggle-bot', authenticate, wrap(async (req, res) => {
    const sim = simulatorSessions.getOrCreate(req.user.sub);
    const result = sim.toggleBotAuto(req.body?.enabled);
    res.json(result);
}));

// ---------- 404 + tratamento de erro global ----------
// Sem isso, qualquer erro não previsto (Prisma, bug de lógica, etc.) derruba o
// processo Node inteiro em vez de responder 500 só para quem fez aquela requisição.

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
    console.error('[ERRO NÃO TRATADO]', err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION]', err);
});

const PORT = process.env.PORT || 4100;

// Auto-seed no boot, sempre (não só quando o banco está vazio): em hosts de plano gratuito
// (ex: Render free tier) o disco não é garantidamente persistente entre reinícios — a
// instância pode "dormir" por inatividade e voltar com um banco vazio, recriando catálogo
// e admin automaticamente. Rodar sempre (não só quando courseCount===0) também garante que
// cursos novos adicionados a seedData.js entrem em produção no próximo deploy, sem precisar
// de acesso manual ao banco remoto — seed() usa upsert por id de curso, então isso nunca
// apaga módulos/aulas de cursos já existentes nem contas/progresso de usuários reais.
async function ensureSeeded() {
    try {
        const { seed } = require('./seedPrisma');
        await seed();
    } catch (err) {
        console.error('[SEED] Falha ao verificar/aplicar seed inicial:', err.message);
    }
}

// WebSocket do simulador de trade: uma conexão por usuário, escutando só os eventos da
// carteira DELE (ver sessionManager.js). O navegador não consegue mandar um header
// Authorization num WebSocket, então o token vem via query string (?token=...) e é
// validado aqui do mesmo jeito que o middleware `authenticate` faria numa rota REST.
const SIMULATOR_WS_EVENTS = ['log', 'analysis', 'trade_opened', 'trade_closed', 'stats', 'optimizer', 'circuit_breaker', 'ai_insight'];

const httpServer = http.createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws/simulator' });

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');

    let userId;
    try {
        userId = verifyToken(token).sub;
    } catch {
        ws.close(4001, 'Não autenticado');
        return;
    }

    const sim = simulatorSessions.getOrCreate(userId);
    ws.send(JSON.stringify({ type: 'snapshot', payload: redactSimulatorSnapshot(sim.getSnapshot()) }));

    const handlers = SIMULATOR_WS_EVENTS.map((evt) => {
        const handler = (payload) => { if (ws.readyState === 1) ws.send(JSON.stringify({ type: evt, payload })); };
        sim.on(evt, handler);
        return [evt, handler];
    });

    ws.on('close', () => {
        for (const [evt, handler] of handlers) sim.off(evt, handler);
    });
});

ensureSeeded().finally(() => {
    httpServer.listen(PORT, () => {
        console.log(`iziCripto Platform API rodando em http://localhost:${PORT}`);
        console.log(`Billing (Stripe) configurado: ${isBillingConfigured()}`);
    });
});

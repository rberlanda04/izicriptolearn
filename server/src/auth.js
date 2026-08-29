const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado no .env — defina um valor antes de iniciar o servidor.');
}

const TOKEN_TTL = '30d';

function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function signToken(user) {
    return jwt.sign({ sub: user.id, role: user.role, plan: user.plan }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Não autenticado.' });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }
}

// Autentica se houver token válido, mas não bloqueia se não houver — usado em rotas
// públicas cujo conteúdo varia conforme o usuário estar logado/ter plano pro ou não.
function optionalAuthenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
        try { req.user = jwt.verify(token, JWT_SECRET); } catch { /* ignora token inválido */ }
    }
    next();
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    next();
}

module.exports = { hashPassword, verifyPassword, signToken, authenticate, optionalAuthenticate, requireAdmin };

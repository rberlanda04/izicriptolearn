// Firestore substitui o SQLite/Prisma como armazenamento persistente. Motivo: o disco do
// Render (plano free, sem volume anexado) é apagado a cada novo deploy — qualquer conta ou
// progresso de usuário real criado nesse meio-tempo se perdia. Firestore é um banco gerenciado
// de verdade, sobrevive a qualquer deploy/redeploy.
//
// firebase-admin v14+ usa API modular (require('firebase-admin/app') etc.) em vez do antigo
// objeto de namespace único — sem isso, `admin.apps`/`admin.firestore()` vêm undefined.
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

function loadCredential() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (raw) {
        // Validação explícita em cada etapa: sem isso, um valor truncado ou colado errado
        // no painel do Render vira um erro genérico de "Cannot find module" (o fallback do
        // arquivo local, que nunca existe em produção) — sem pista nenhuma do que realmente
        // deu errado, obrigando a adivinhar às cegas a partir de um log incompleto.
        let json;
        try {
            json = Buffer.from(raw, 'base64').toString('utf8');
        } catch (err) {
            throw new Error(`FIREBASE_SERVICE_ACCOUNT_BASE64 está definida (${raw.length} caracteres) mas não é base64 válido: ${err.message}`);
        }
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (err) {
            throw new Error(
                `FIREBASE_SERVICE_ACCOUNT_BASE64 está definida (${raw.length} caracteres) e decodifica, mas o resultado ` +
                `não é um JSON válido (provável truncamento ao colar no painel do Render — o valor original tem 3176 ` +
                `caracteres em uma linha só). Erro ao parsear: ${err.message}`
            );
        }
        if (!parsed.project_id || !parsed.private_key || !parsed.client_email) {
            throw new Error(
                'FIREBASE_SERVICE_ACCOUNT_BASE64 decodifica para um JSON válido, mas faltam campos ' +
                'obrigatórios (project_id/private_key/client_email) — confira se o valor colado é o arquivo ' +
                'de credencial completo, não um trecho dele.'
            );
        }
        return parsed;
    }

    // Dev local: usa o arquivo de credencial baixado via `gcloud iam service-accounts keys
    // create` — nunca commitado (ver .gitignore: server/secrets/).
    try {
        return require('../secrets/firebase-admin.json');
    } catch {
        throw new Error(
            'Nem FIREBASE_SERVICE_ACCOUNT_BASE64 (env var) nem server/secrets/firebase-admin.json (arquivo local) ' +
            'foram encontrados — sem uma credencial do Firebase Admin, não é possível conectar ao Firestore. ' +
            'Em produção (Render), defina FIREBASE_SERVICE_ACCOUNT_BASE64 no painel Environment.'
        );
    }
}

if (!getApps().length) {
    initializeApp({ credential: cert(loadCredential()) });
}

const db = getFirestore();

module.exports = { db, FieldValue };

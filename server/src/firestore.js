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
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
        return JSON.parse(json);
    }
    // Dev local: usa o arquivo de credencial baixado via `gcloud iam service-accounts keys
    // create` — nunca commitado (ver .gitignore: server/secrets/).
    return require('../secrets/firebase-admin.json');
}

if (!getApps().length) {
    initializeApp({ credential: cert(loadCredential()) });
}

const db = getFirestore();

module.exports = { db, FieldValue };

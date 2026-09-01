// Firestore substitui o SQLite/Prisma como armazenamento persistente. Banco gerenciado de
// verdade, sobrevive a qualquer deploy/redeploy — ao contrário de disco efêmero.
//
// firebase-admin v14+ usa API modular (require('firebase-admin/app') etc.) em vez do antigo
// objeto de namespace único — sem isso, `admin.apps`/`admin.firestore()` vêm undefined.
const path = require('node:path');
const { initializeApp, getApps, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Em produção (Cloud Run), a service account anexada ao serviço já fornece credenciais via
// Application Default Credentials — nada a configurar. Em dev local, usamos a chave baixada
// via `gcloud iam service-accounts keys create` (nunca commitada — ver .gitignore) porque
// pedir pro dev logar com `gcloud auth application-default login` é mais atrito e fácil de
// acabar autenticado com a conta Google errada.
function loadCredential() {
    try {
        return cert(require(path.join(__dirname, '..', 'secrets', 'firebase-admin.json')));
    } catch {
        return applicationDefault();
    }
}

if (!getApps().length) {
    initializeApp({ credential: loadCredential(), projectId: 'izicriptolearn' });
}

const db = getFirestore();

module.exports = { db, FieldValue };

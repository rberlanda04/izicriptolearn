/**
 * Cobrança via Stripe — o padrão de mercado para assinatura recorrente.
 *
 * Fica completamente inerte (endpoints respondem com erro claro, nunca com sucesso
 * fingido) enquanto STRIPE_SECRET_KEY não estiver configurada. Isso é proposital:
 * a plataforma nunca deve fingir que processou um pagamento que não processou.
 * Ativar cobrança real é sempre uma decisão explícita e local (editar .env), nunca
 * um efeito colateral de código.
 */
const isConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
const stripe = isConfigured ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

function isBillingConfigured() {
    return isConfigured;
}

function isAnnualConfigured() {
    return Boolean(process.env.STRIPE_PRICE_ID_PRO_ANNUAL);
}

// Mensal é o preço "clássico" (STRIPE_PRICE_ID_PRO, mantido pelo nome de sempre pra não
// quebrar quem já configurou); anual é opcional — sem ele, só o mensal fica disponível.
function priceIdForPeriod(period) {
    if (period === 'annual') return process.env.STRIPE_PRICE_ID_PRO_ANNUAL || null;
    return process.env.STRIPE_PRICE_ID_PRO || null;
}

async function createCheckoutSession(user, period = 'monthly') {
    if (!stripe) throw new Error('Stripe não configurado neste ambiente (defina STRIPE_SECRET_KEY no .env do servidor).');
    const priceId = priceIdForPeriod(period);
    if (!priceId) {
        throw new Error(
            period === 'annual'
                ? 'STRIPE_PRICE_ID_PRO_ANNUAL não configurado — crie o preço anual no dashboard da Stripe e cole o ID aqui.'
                : 'STRIPE_PRICE_ID_PRO não configurado — crie um preço recorrente no dashboard da Stripe e cole o ID aqui.'
        );
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email,
        client_reference_id: user.id,
        success_url: `${process.env.CLIENT_URL}/conta?checkout=sucesso`,
        cancel_url: `${process.env.CLIENT_URL}/precos?checkout=cancelado`,
    });
    return session;
}

function constructWebhookEvent(rawBody, signature) {
    if (!stripe) throw new Error('Stripe não configurado.');
    if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET não configurado.');
    return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

module.exports = { isBillingConfigured, isAnnualConfigured, createCheckoutSession, constructWebhookEvent };

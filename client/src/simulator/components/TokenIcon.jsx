// Ícones desenhados à mão (SVG inline) em vez de puxar de um CDN de terceiros — não depende
// de rede externa, não quebra se o serviço cair, e cobre exatamente os pares que o simulador
// usa (ver config.js: BTC/ETH/SOL). Um símbolo novo cai no ícone genérico automaticamente.

function Base({ children, bg }) {
  return (
    <svg viewBox="0 0 32 32" className="shrink-0" width="1em" height="1em">
      <circle cx="16" cy="16" r="16" fill={bg} />
      {children}
    </svg>
  );
}

function BtcIcon() {
  return (
    <Base bg="#F7931A">
      <text x="16" y="22" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">฿</text>
    </Base>
  );
}

function EthIcon() {
  return (
    <Base bg="#3C3C3D">
      <path d="M16 5 L16 13.5 L23 16.8 Z" fill="#8A92B2" />
      <path d="M16 5 L9 16.8 L16 13.5 Z" fill="#fff" />
      <path d="M16 15 L16 21.5 L23 18.2 Z" fill="#62688F" />
      <path d="M16 15 L9 18.2 L16 21.5 Z" fill="#C4C9E5" />
      <path d="M16 22.8 L16 27 L23 19.6 Z" fill="#8A92B2" />
      <path d="M16 22.8 L9 19.6 L16 27 Z" fill="#fff" />
    </Base>
  );
}

function SolIcon() {
  return (
    <Base bg="#111827">
      <defs>
        <linearGradient id="solGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <rect x="8" y="9" width="16" height="3" rx="1.2" fill="url(#solGrad)" />
      <rect x="8" y="14.5" width="16" height="3" rx="1.2" fill="url(#solGrad)" />
      <rect x="8" y="20" width="16" height="3" rx="1.2" fill="url(#solGrad)" />
    </Base>
  );
}

function GenericIcon({ letter }) {
  return (
    <Base bg="#5B8DFF">
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">{letter}</text>
    </Base>
  );
}

const ICONS = { BTC: BtcIcon, ETH: EthIcon, SOL: SolIcon };

export function TokenIcon({ symbol, className = '' }) {
  const base = (symbol || '').split('/')[0].toUpperCase();
  const Icon = ICONS[base];
  return (
    <span className={className} style={{ display: 'inline-flex', fontSize: 'inherit' }}>
      {Icon ? <Icon /> : <GenericIcon letter={base.slice(0, 1) || '?'} />}
    </span>
  );
}

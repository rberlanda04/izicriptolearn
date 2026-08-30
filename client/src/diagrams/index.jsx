import { Figure } from './Figure.jsx';

const mono = { fontFamily: 'JetBrains Mono, monospace' };
const body = { fontFamily: 'Varela Round, sans-serif' };

// ---------- 1. Fundamentos de Blockchain ----------

function BlockchainChain() {
  const blocks = [
    { x: 20, n: 100, hash: '— (gênese)' },
    { x: 260, n: 101, hash: '0x7f3a…' },
    { x: 500, n: 102, hash: '0x91be…' },
  ];
  return (
    <Figure
      viewBox="0 0 700 190"
      ariaLabel="Três blocos em sequência, cada um guardando o hash do bloco anterior; mudar um dado antigo quebraria essa cadeia de referências."
      caption="Cada bloco novo guarda o hash do anterior — mudar um dado antigo invalidaria essa referência e todos os blocos seguintes."
    >
      {blocks.map((b, i) => (
        <g key={b.n} transform={`translate(${b.x},30)`}>
          <rect width="180" height="130" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="90" y="26" textAnchor="middle" fontWeight="700" fontSize="13" style={mono}>BLOCO {b.n}</text>
          <line x1="14" y1="38" x2="166" y2="38" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
          <text x="90" y="58" textAnchor="middle" fontSize="11" style={body}>3 transações</text>
          <text x="90" y="80" textAnchor="middle" fontSize="10" style={mono} opacity="0.75">hash anterior:</text>
          <text x="90" y="94" textAnchor="middle" fontSize="10" style={mono} opacity="0.75">{b.hash}</text>
          <text x="90" y="116" textAnchor="middle" fontSize="10" fontWeight="600" style={mono}>hash: 0x{i === 0 ? '7f3a…' : i === 1 ? '91be…' : 'c204…'}</text>
        </g>
      ))}
      <line x1="200" y1="95" x2="256" y2="95" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#lesson-arrow)" />
      <line x1="440" y1="95" x2="496" y2="95" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#lesson-arrow)" />
      <text x="228" y="83" textAnchor="middle" fontSize="9.5" style={mono}>referencia</text>
      <text x="468" y="83" textAnchor="middle" fontSize="9.5" style={mono}>referencia</text>
    </Figure>
  );
}

function TransactionFlow() {
  const steps = [
    ['CARTEIRA', 'assina a transação'],
    ['REDE DE NÓS', 'espera na mempool'],
    ['BLOCO CANDIDATO', 'validadores ordenam'],
    ['BLOCO CONFIRMADO', 'anexado à cadeia'],
  ];
  const labels = ['envia', 'agrupa', 'confirma'];
  return (
    <Figure
      viewBox="0 0 800 150"
      ariaLabel="Fluxo de uma transação: carteira assina, rede recebe na mempool, validadores agrupam num bloco candidato, rede confirma e o bloco é anexado à cadeia."
      caption="Cada etapa depende só de nós concordando entre si — nenhuma empresa central aprova a transação."
    >
      {steps.map(([title, sub], i) => (
        <g key={title} transform={`translate(${20 + i * 206},30)`}>
          <rect width="150" height="90" rx="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="75" y="38" textAnchor="middle" fontSize="11" fontWeight="700" style={mono}>{title}</text>
          <text x="75" y="58" textAnchor="middle" fontSize="10.5" style={body}>{sub}</text>
        </g>
      ))}
      {labels.map((l, i) => (
        <g key={l}>
          <line x1={170 + i * 206} y1="75" x2={226 + i * 206} y2="75" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#lesson-arrow)" />
          <text x={198 + i * 206} y="65" textAnchor="middle" fontSize="9.5" style={mono}>{l}</text>
        </g>
      ))}
    </Figure>
  );
}

function PowVsPos() {
  return (
    <Figure
      viewBox="0 0 620 220"
      ariaLabel="Comparação entre Proof of Work e Proof of Stake: no primeiro, mineradores gastam energia competindo; no segundo, validadores travam capital que pode ser confiscado em caso de fraude."
      caption="Os dois resolvem o mesmo problema — impedir fraude — cobrando um custo diferente de quem tentar trapacear."
    >
      <line x1="310" y1="10" x2="310" y2="210" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
      <text x="155" y="26" textAnchor="middle" fontSize="13" fontWeight="700" style={mono}>PROOF OF WORK</text>
      <rect x="45" y="42" width="220" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <text x="155" y="63" textAnchor="middle" fontSize="11" style={body}>Mineradores competem</text>
      <text x="155" y="79" textAnchor="middle" fontSize="11" style={body}>resolvendo cálculos</text>
      <line x1="155" y1="92" x2="155" y2="112" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />
      <rect x="45" y="114" width="220" height="46" rx="8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <text x="155" y="141" textAnchor="middle" fontSize="11" style={body}>Vencedor propõe o bloco</text>
      <text x="155" y="188" textAnchor="middle" fontSize="10" style={mono} opacity="0.8">trapacear custa:</text>
      <text x="155" y="203" textAnchor="middle" fontSize="10.5" fontWeight="600" style={mono}>hardware + eletricidade perdidos</text>

      <text x="465" y="26" textAnchor="middle" fontSize="13" fontWeight="700" style={mono}>PROOF OF STAKE</text>
      <rect x="355" y="42" width="220" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <text x="465" y="63" textAnchor="middle" fontSize="11" style={body}>Validadores travam</text>
      <text x="465" y="79" textAnchor="middle" fontSize="11" style={body}>capital como garantia</text>
      <line x1="465" y1="92" x2="465" y2="112" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />
      <rect x="355" y="114" width="220" height="46" rx="8" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <text x="465" y="135" textAnchor="middle" fontSize="11" style={body}>Sorteado (proporcional</text>
      <text x="465" y="150" textAnchor="middle" fontSize="11" style={body}>ao capital) propõe o bloco</text>
      <text x="465" y="188" textAnchor="middle" fontSize="10" style={mono} opacity="0.8">trapacear custa:</text>
      <text x="465" y="203" textAnchor="middle" fontSize="10.5" fontWeight="600" style={mono}>capital travado é queimado</text>
    </Figure>
  );
}

function MarketMetrics() {
  const cols = [
    ['MARKET CAP', 'preço × unidades em circulação', 'mostra tamanho, não qualidade'],
    ['VOLUME', 'quanto foi negociado em 24h', 'baixo = fácil de manipular'],
    ['LIQUIDEZ', 'dá pra vender sem mover o preço?', 'baixa = saída cara em pânico'],
  ];
  return (
    <Figure
      viewBox="0 0 660 160"
      ariaLabel="Três métricas de mercado — market cap, volume e liquidez — cada uma respondendo uma pergunta diferente, nenhuma sozinha indicando qualidade de um projeto."
      caption="As três métricas respondem perguntas diferentes — nenhuma isolada diz se um ativo é bom."
    >
      {cols.map(([title, def, note], i) => (
        <g key={title} transform={`translate(${20 + i * 210},20)`}>
          <rect width="190" height="120" rx="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <text x="95" y="30" textAnchor="middle" fontSize="12" fontWeight="700" style={mono}>{title}</text>
          <line x1="16" y1="42" x2="174" y2="42" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
          <text x="95" y="66" textAnchor="middle" fontSize="10.5" style={body}>{def}</text>
          <text x="95" y="100" textAnchor="middle" fontSize="9.5" style={mono} opacity="0.75">{note}</text>
        </g>
      ))}
    </Figure>
  );
}

// ---------- 2. Carteiras e Segurança ----------

function CustodySpectrum() {
  const points = [
    ['Exchange\n(custodial)', 'empresa guarda a chave', 'mais conveniente'],
    ['App de carteira\n(hot wallet)', 'você guarda, sempre online', ''],
    ['Hardware wallet\n(cold wallet)', 'você guarda, offline', ''],
    ['Papel / metal\noffline', 'você guarda, nunca conectado', 'mais seguro p/ guardar'],
  ];
  return (
    <Figure
      viewBox="0 0 680 190"
      ariaLabel="Espectro de opções de carteira, da mais conveniente (exchange custodial) à mais segura para guarda de longo prazo (papel offline), passando por hot wallet e hardware wallet."
      caption="Conveniência e segurança de guarda puxam para lados opostos — a maioria usa mais de um tipo ao mesmo tempo."
    >
      <line x1="60" y1="90" x2="620" y2="90" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#lesson-arrow)" />
      {points.map(([title, sub], i) => (
        <g key={title} transform={`translate(${100 + i * 160},0)`}>
          <circle cx="0" cy="90" r="6" fill="currentColor" />
          {title.split('\n').map((line, li) => (
            <text key={li} x="0" y={35 + li * 14} textAnchor="middle" fontSize="11" fontWeight="600" style={mono}>{line}</text>
          ))}
          <text x="0" y="118" textAnchor="middle" fontSize="9.5" style={body}>{sub}</text>
        </g>
      ))}
      <text x="60" y="160" textAnchor="start" fontSize="9.5" fontStyle="italic" style={mono} opacity="0.7">mais conveniente</text>
      <text x="620" y="160" textAnchor="end" fontSize="9.5" fontStyle="italic" style={mono} opacity="0.7">mais seguro p/ guardar</text>
    </Figure>
  );
}

function KeyPairFlow() {
  return (
    <Figure
      viewBox="0 0 620 160"
      ariaLabel="Fluxo de uma via: chave privada gera a chave pública, que gera o endereço. Não é possível fazer o caminho inverso a partir do endereço."
      caption="A seta só funciona num sentido: dá pra ir de chave privada até endereço, nunca o contrário."
    >
      {[['CHAVE PRIVADA', 'secreta — nunca compartilhe'], ['CHAVE PÚBLICA', 'pode ser derivada da privada'], ['ENDEREÇO', 'o que você compartilha']].map(([t, s], i) => (
        <g key={t} transform={`translate(${20 + i * 210},30)`}>
          <rect width="180" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <text x="90" y="30" textAnchor="middle" fontSize="11.5" fontWeight="700" style={mono}>{t}</text>
          <text x="90" y="50" textAnchor="middle" fontSize="10" style={body}>{s}</text>
        </g>
      ))}
      <line x1="200" y1="65" x2="216" y2="65" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#lesson-arrow)" />
      <line x1="410" y1="65" x2="426" y2="65" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#lesson-arrow)" />
      <text x="310" y="120" textAnchor="middle" fontSize="9.5" style={mono} opacity="0.7">↑ sentido único — não existe seta voltando</text>
    </Figure>
  );
}

// ---------- 3. DeFi na Prática ----------

function DefiLendingFlow() {
  return (
    <Figure
      viewBox="0 0 620 260"
      ariaLabel="Fluxo de empréstimo em DeFi: depositar colateral, tomar emprestado, monitorar preço do colateral, e liquidação automática se o valor cair abaixo do limite de segurança."
      caption="A liquidação é automática e imediata — não existe carência nem negociação como num banco tradicional."
    >
      <rect x="200" y="10" width="220" height="46" rx="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="310" y="38" textAnchor="middle" fontSize="11.5" style={body}>Deposita colateral (ex: $150 em ETH)</text>
      <line x1="310" y1="56" x2="310" y2="76" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />

      <rect x="200" y="78" width="220" height="46" rx="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="310" y="106" textAnchor="middle" fontSize="11.5" style={body}>Toma $100 emprestado</text>
      <line x1="310" y1="124" x2="310" y2="144" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />

      <polygon points="310,146 380,180 310,214 240,180" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <text x="310" y="176" textAnchor="middle" fontSize="9.5" style={body}>colateral ainda</text>
      <text x="310" y="189" textAnchor="middle" fontSize="9.5" style={body}>cobre a dívida?</text>

      <line x1="380" y1="180" x2="440" y2="180" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />
      <text x="410" y="172" textAnchor="middle" fontSize="9" style={mono}>não</text>
      <rect x="442" y="157" width="150" height="46" rx="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="517" y="177" textAnchor="middle" fontSize="10.5" style={body}>Liquidação automática</text>
      <text x="517" y="192" textAnchor="middle" fontSize="10.5" style={body}>(venda + multa)</text>

      <path d="M 240 180 C 150 180, 150 100, 200 101" fill="none" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />
      <text x="145" y="145" textAnchor="middle" fontSize="9" style={mono}>sim, segue monitorando</text>
    </Figure>
  );
}

function AmmSwap() {
  return (
    <Figure
      viewBox="0 0 640 200"
      ariaLabel="Pool de liquidez de um AMM antes e depois de uma troca: ao trocar Token A por Token B, a proporção da reserva muda e o preço se ajusta automaticamente."
      caption="Não há livro de ofertas — o preço vem só da proporção entre os dois ativos na reserva."
    >
      <g transform="translate(30,30)">
        <text x="110" y="0" textAnchor="middle" fontSize="11.5" fontWeight="700" style={mono}>POOL — ANTES</text>
        <rect width="220" height="90" rx="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="110" y="38" textAnchor="middle" fontSize="11" style={body}>1000 Token A</text>
        <text x="110" y="58" textAnchor="middle" fontSize="11" style={body}>1000 Token B</text>
        <text x="110" y="115" textAnchor="middle" fontSize="10" style={mono} opacity="0.75">preço: 1 A = 1 B</text>
      </g>
      <line x1="270" y1="80" x2="330" y2="80" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#lesson-arrow)" />
      <text x="300" y="68" textAnchor="middle" fontSize="9.5" style={mono}>troca 50 A</text>
      <g transform="translate(360,30)">
        <text x="110" y="0" textAnchor="middle" fontSize="11.5" fontWeight="700" style={mono}>POOL — DEPOIS</text>
        <rect width="220" height="90" rx="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="110" y="38" textAnchor="middle" fontSize="11" style={body}>1050 Token A</text>
        <text x="110" y="58" textAnchor="middle" fontSize="11" style={body}>952 Token B</text>
        <text x="110" y="115" textAnchor="middle" fontSize="10" fontWeight="600" style={mono}>preço mudou: 1 A ≈ 0,91 B</text>
      </g>
    </Figure>
  );
}

function ImpermanentLoss() {
  return (
    <Figure
      viewBox="0 0 560 220"
      ariaLabel="Gráfico de barras comparando o valor de guardar dois ativos separados versus fornecer liquidez numa pool, depois que o preço de um deles sobe bastante — a posição em pool vale menos."
      caption="Quando o preço diverge bastante, a pool 'vende' automaticamente o ativo que sobe — por isso rende menos que apenas guardar os dois."
    >
      <line x1="60" y1="180" x2="520" y2="180" stroke="currentColor" strokeWidth="1.3" />
      <g transform="translate(140,0)">
        <text x="0" y="30" textAnchor="middle" fontSize="10.5" style={body}>guardando os</text>
        <text x="0" y="44" textAnchor="middle" fontSize="10.5" style={body}>2 ativos separados</text>
        <rect x="-35" y="60" width="70" height="120" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="0" y="200" textAnchor="middle" fontSize="10" style={mono}>$1.400</text>
      </g>
      <g transform="translate(340,0)">
        <text x="0" y="30" textAnchor="middle" fontSize="10.5" style={body}>fornecendo</text>
        <text x="0" y="44" textAnchor="middle" fontSize="10.5" style={body}>liquidez na pool</text>
        <rect x="-35" y="95" width="70" height="85" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="0" y="200" textAnchor="middle" fontSize="10" style={mono}>$1.280</text>
      </g>
      <line x1="175" y1="60" x2="305" y2="95" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <text x="240" y="115" textAnchor="middle" fontSize="9.5" style={mono} opacity="0.8">perda impermanente</text>
    </Figure>
  );
}

// ---------- 4. NFTs, Tokens e DAOs ----------

function TokenTypes() {
  return (
    <Figure
      viewBox="0 0 600 190"
      ariaLabel="Comparação entre tokens fungíveis, onde cada unidade é idêntica e intercambiável, e tokens não-fungíveis, onde cada unidade é única e rastreável individualmente."
      caption="Fungível = qualquer unidade serve. Não-fungível = importa exatamente qual unidade é."
    >
      <text x="150" y="24" textAnchor="middle" fontSize="12" fontWeight="700" style={mono}>FUNGÍVEL</text>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={90 + i * 60} cy="70" r="24" fill="none" stroke="currentColor" strokeWidth="1.4" />
      ))}
      <text x="150" y="120" textAnchor="middle" fontSize="10.5" style={body}>qualquer unidade =</text>
      <text x="150" y="134" textAnchor="middle" fontSize="10.5" style={body}>qualquer outra unidade</text>

      <line x1="300" y1="10" x2="300" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />

      <text x="450" y="24" textAnchor="middle" fontSize="12" fontWeight="700" style={mono}>NÃO-FUNGÍVEL</text>
      <rect x="366" y="46" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <polygon points="450,46 470,86 430,86" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="494" cy="66" r="20" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text x="450" y="120" textAnchor="middle" fontSize="10.5" style={body}>cada item é único</text>
      <text x="450" y="134" textAnchor="middle" fontSize="10.5" style={body}>e rastreável</text>
    </Figure>
  );
}

function DaoGovernanceFlow() {
  return (
    <Figure
      viewBox="0 0 640 160"
      ariaLabel="Fluxo de governança de uma DAO: alguém propõe, a comunidade vota com peso proporcional a tokens, e se aprovada a execução é automática via contrato inteligente."
      caption="O peso do voto é proporcional a quanto token cada um tem — não é 'uma pessoa, um voto'."
    >
      {[['PROPOSTA', 'holder sugere mudança'], ['VOTAÇÃO', 'peso = quantidade de token'], ['EXECUÇÃO', 'automática, via contrato']].map(([t, s], i) => (
        <g key={t} transform={`translate(${20 + i * 210},30)`}>
          <rect width="180" height="70" rx="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <text x="90" y="30" textAnchor="middle" fontSize="11.5" fontWeight="700" style={mono}>{t}</text>
          <text x="90" y="50" textAnchor="middle" fontSize="10" style={body}>{s}</text>
        </g>
      ))}
      <line x1="200" y1="65" x2="216" y2="65" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#lesson-arrow)" />
      <line x1="410" y1="65" x2="426" y2="65" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#lesson-arrow)" />
      <text x="310" y="122" textAnchor="middle" fontSize="9.5" style={mono} opacity="0.7">aprovada só se o quórum e a maioria de votos-token forem atingidos</text>
    </Figure>
  );
}

// ---------- 5. Stablecoins e Gestão de Risco ----------

function StablecoinModels() {
  const cols = [
    { title: 'LASTREADA EM FIAT', sub: 'reserva em banco', risk: 'risco: confiar no emissor', danger: false },
    { title: 'COLATERAL CRIPTO', sub: 'sobrecolateralizada (~150%)', risk: 'risco: queda rápida do colateral', danger: false },
    { title: 'ALGORÍTMICA', sub: 'sem colateral direto', risk: 'risco: quebra de paridade em pânico', danger: true },
  ];
  return (
    <Figure
      viewBox="0 0 660 170"
      ariaLabel="Três modelos de stablecoin: lastreada em moeda tradicional, colateralizada por outra criptomoeda com margem de segurança, e algorítmica sem colateral direto — esta última com o maior risco histórico de quebra de paridade."
      caption="As três miram US$ 1 — mas o que segura essa paridade, e o que acontece se falhar, é bem diferente em cada uma."
    >
      {cols.map((c, i) => (
        <g key={c.title} transform={`translate(${15 + i * 215},15)`}>
          <rect
            width="195" height="140" rx="10" fill="none"
            stroke={c.danger ? '#E8973A' : 'currentColor'}
            strokeWidth={c.danger ? 2 : 1.4}
            strokeDasharray={c.danger ? '5 3' : undefined}
          />
          <text x="97" y="28" textAnchor="middle" fontSize="11" fontWeight="700" style={mono}>{c.title}</text>
          <text x="97" y="52" textAnchor="middle" fontSize="10" style={body}>{c.sub}</text>
          <text x="97" y="80" textAnchor="middle" fontSize="13" fontWeight="700" style={mono}>1 = US$ 1(?)</text>
          <text x="97" y="118" textAnchor="middle" fontSize="9" style={mono} fill={c.danger ? '#E8973A' : 'currentColor'} opacity={c.danger ? 1 : 0.75}>{c.risk}</text>
        </g>
      ))}
    </Figure>
  );
}

// ---------- 6. Riscos, Golpes e Como se Proteger ----------

function ScamAnatomy() {
  const steps = ['Contato inicial\n(online)', 'Semanas de\nconfiança', 'Sugere\ninvestimento', 'Vítima deposita\ncada vez mais', 'Tenta sacar →\nbloqueado'];
  return (
    <Figure
      viewBox="0 0 680 160"
      ariaLabel="Linha do tempo do golpe do relacionamento (pig butchering): contato inicial, semanas de confiança construída, sugestão de investimento, depósitos crescentes da vítima, e bloqueio no momento do saque."
      caption="O tempo investido na confiança é o próprio golpe — quanto mais longo, mais convincente fica o pedido final."
    >
      <line x1="50" y1="70" x2="630" y2="70" stroke="currentColor" strokeWidth="1.3" markerEnd="url(#lesson-arrow)" />
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${90 + i * 130},0)`}>
          <circle cx="0" cy="70" r="6" fill={i === steps.length - 1 ? '#E8973A' : 'currentColor'} />
          {s.split('\n').map((line, li) => (
            <text key={li} x="0" y={100 + li * 13} textAnchor="middle" fontSize="10" style={body}>{line}</text>
          ))}
        </g>
      ))}
    </Figure>
  );
}

export const diagrams = {
  'blockchain-chain': BlockchainChain,
  'transaction-flow': TransactionFlow,
  'pow-vs-pos': PowVsPos,
  'market-metrics': MarketMetrics,
  'custody-spectrum': CustodySpectrum,
  'key-pair-flow': KeyPairFlow,
  'defi-lending-flow': DefiLendingFlow,
  'amm-swap': AmmSwap,
  'impermanent-loss': ImpermanentLoss,
  'token-types': TokenTypes,
  'dao-governance-flow': DaoGovernanceFlow,
  'stablecoin-models': StablecoinModels,
  'scam-anatomy': ScamAnatomy,
};

export function LessonDiagram({ diagramKey }) {
  const Component = diagrams[diagramKey];
  if (!Component) return null;
  return <Component />;
}

export const DIAGRAM_OPTIONS = Object.keys(diagrams);

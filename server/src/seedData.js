// Conteúdo real dos cursos iniciais da plataforma. Nada aqui é lorem ipsum — é o material
// didático de fato, escrito para ser correto e honesto sobre riscos, não só sobre potencial.
const courses = [
  {
    id: 'fundamentos-blockchain',
    title: 'Fundamentos de Blockchain',
    summary: 'As três ideias que sustentam todo o resto: registro distribuído, consenso e como ler o mercado sem se enganar.',
    level: 'iniciante',
    category: 'Fundamentos',
    modules: [
      {
        id: 'mod-fb-1',
        title: 'O que é blockchain, de verdade',
        lessons: [
          {
            id: 'les-fb-1-1',
            title: 'Um livro-razão sem dono',
            durationMin: 7,
            content: `Antes de blockchain, "confiar em um registro financeiro" significava confiar em alguém: um banco, um cartório, um governo. Esse alguém guardava a verdade sobre quem tinha o quê, e todo mundo dependia da honestidade e da disponibilidade dele.\n\nUma blockchain propõe outra coisa: em vez de um único guardião, milhares de computadores independentes (chamados de nós) guardam, cada um, uma cópia completa e idêntica do mesmo histórico de transações. Ninguém precisa confiar em ninguém especificamente — basta confiar que a maioria dos nós está seguindo as mesmas regras matemáticas.\n\nIsso não elimina a necessidade de confiança; ela só muda de lugar. Você passa a confiar no protocolo (as regras do software, públicas e auditáveis por qualquer um) e na descentralização (é caro e difícil um único agente controlar a maioria dos nós), em vez de confiar numa instituição específica.\n\nEssa mudança tem um preço: sem uma instituição central, também não existe "central de atendimento" para reverter uma transação errada, recuperar uma senha esquecida, ou congelar fundos roubados. A responsabilidade se desloca do sistema para o usuário.`,
          },
          {
            id: 'les-fb-1-2',
            title: 'Blocos, hashes e a cadeia',
            durationMin: 8,
            content: `Uma blockchain organiza transações em blocos — pense num bloco como uma página de um livro contábil, com um conjunto de transações registradas nela. Cada página nova é adicionada ao final do livro, nunca no meio.\n\nO que impede alguém de rasgar uma página antiga e reescrevê-la é o hash: uma função matemática que pega qualquer quantidade de dados e produz um código curto e único, como uma impressão digital. Cada bloco novo guarda o hash do bloco anterior dentro de si. Se você mudar uma única letra de uma transação antiga, o hash daquele bloco muda completamente — e, como o próximo bloco depende desse hash, ele também ficaria inválido, e o próximo, e o próximo.\n\nPara "consertar" um registro antigo de forma que a rede aceitasse, seria preciso recalcular todos os blocos seguintes e convencer a maioria dos nós, ao mesmo tempo, a aceitar essa nova versão — em redes grandes e ativas, isso exige um poder computacional (ou capital, no caso de Proof of Stake) tão grande que, na prática, deixa de ser viável.\n\nÉ importante notar a palavra "na prática": isso não é uma impossibilidade matemática absoluta, é uma barreira econômica. Redes pequenas e pouco distribuídas já sofreram ataques desse tipo. O tamanho e a distribuição real da rede importam mais do que a tecnologia em si.`,
          },
          {
            id: 'les-fb-1-3',
            title: 'Público não é a mesma coisa que anônimo',
            durationMin: 6,
            content: `Um erro comum de quem está começando é achar que blockchain é sinônimo de anonimato total. Na maioria das blockchains públicas (Bitcoin, Ethereum e a maior parte das redes conhecidas), é o oposto: todo o histórico de transações é público e permanente, visível para qualquer pessoa que queira olhar.\n\nO que existe é pseudonimato: as transações ficam associadas a endereços (uma sequência de caracteres), não diretamente ao seu nome. Mas se, em algum momento, um endereço for associado a uma identidade real — por exemplo, ao enviar fundos de uma exchange que exige verificação de identidade (KYC) — todo o histórico daquele endereço pode, em princípio, ser rastreado até essa pessoa.\n\nEmpresas de análise on-chain existem justamente para fazer esse tipo de rastreamento, e são usadas por autoridades em investigações. Achar que "é tudo anônimo" é um dos motivos pelos quais pessoas se sentem seguras cometendo ou sendo vítimas de golpes que, na verdade, deixam rastro.`,
          },
        ],
      },
      {
        id: 'mod-fb-2',
        title: 'Consenso: como a rede concorda sem um chefe',
        lessons: [
          {
            id: 'les-fb-2-1',
            title: 'O problema da confiança distribuída',
            durationMin: 6,
            content: `Se milhares de computadores independentes guardam cópias do mesmo livro-razão, como garantir que todos concordam sobre qual é a versão correta — especialmente quando duas transações conflitantes chegam quase ao mesmo tempo, ou quando alguém tenta gastar o mesmo dinheiro duas vezes (o chamado "double spending")?\n\nEsse é o problema central que qualquer blockchain precisa resolver, e a solução se chama mecanismo de consenso: um conjunto de regras que determina como a rede escolhe, de forma objetiva e sem depender de uma autoridade central, qual será o próximo bloco válido.\n\nOs dois mecanismos mais conhecidos são Proof of Work e Proof of Stake, e a escolha entre eles tem implicações reais de custo, velocidade, segurança e impacto ambiental — não é só um detalhe técnico de bastidores.`,
          },
          {
            id: 'les-fb-2-2',
            title: 'Proof of Work: segurança via gasto de energia',
            durationMin: 8,
            content: `No Proof of Work (usado pelo Bitcoin), participantes chamados de mineradores competem para resolver um problema matemático que só pode ser resolvido por tentativa e erro — não existe atalho, só poder de processamento. Quem resolve primeiro propõe o próximo bloco e recebe uma recompensa em cripto.\n\nA segurança vem do custo: para tentar fraudar a rede, alguém precisaria controlar mais de 50% de todo o poder computacional dedicado a ela (um "ataque de 51%"), o que exigiria um investimento em hardware e eletricidade tão grande que, para redes estabelecidas como o Bitcoin, é considerado economicamente inviável.\n\nO lado negativo mais discutido é o consumo de energia: a rede Bitcoin, sozinha, consome eletricidade comparável a países de porte médio. Defensores argumentam que parte dessa energia vem de fontes que seriam desperdiçadas de outra forma; críticos apontam o impacto ambiental absoluto. Os dois argumentos são debatidos ativamente, e não há consenso definitivo sobre o balanço final.`,
          },
          {
            id: 'les-fb-2-3',
            title: 'Proof of Stake: segurança via capital em risco',
            durationMin: 7,
            content: `No Proof of Stake (usado pela Ethereum desde setembro de 2022, numa transição conhecida como "The Merge"), não existe competição por poder computacional. Em vez disso, participantes chamados de validadores travam ("stake") uma quantidade de criptomoeda como garantia e são sorteados, proporcionalmente ao que travaram, para propor e confirmar blocos.\n\nA segurança vem de outro tipo de custo: se um validador tenta trapacear (por exemplo, validar duas versões conflitantes do histórico), uma parte do capital que ele travou é destruída automaticamente pelo protocolo — mecanismo chamado de "slashing". Errar ou trapacear custa dinheiro real e imediato, não eletricidade.\n\nO consumo de energia do Proof of Stake é drasticamente menor — a própria Ethereum estima uma redução de mais de 99% após a transição. Em compensação, esse modelo levanta outra discussão: quem já tem mais capital consegue validar mais blocos e ganhar mais recompensas, o que pode, ao longo do tempo, concentrar poder de validação em poucos participantes grandes.`,
          },
        ],
      },
      {
        id: 'mod-fb-3',
        title: 'Lendo o mercado sem se enganar',
        lessons: [
          {
            id: 'les-fb-3-1',
            title: 'Market cap, volume e liquidez',
            durationMin: 7,
            content: `Três números aparecem em qualquer site de cotação, e é fácil interpretá-los errado.\n\nMarket cap (capitalização de mercado) é o preço de uma unidade multiplicado pelo total de unidades em circulação. Ele mostra o tamanho relativo de um ativo, mas não diz nada sobre a qualidade do projeto — é perfeitamente possível um token com pouquíssimo uso real ter um market cap alto, simplesmente porque seu preço foi inflado artificialmente com baixa liquidez.\n\nVolume mostra quanto foi negociado num período (geralmente 24h). Volume muito baixo é um sinal de alerta: significa que poucas pessoas estão comprando e vendendo aquele ativo, o que facilita manipulação de preço por quem tem mais capital.\n\nLiquidez mostra o quão fácil é comprar ou vender uma quantidade razoável do ativo sem mover o preço sozinho. Baixa liquidez significa que, mesmo que o "preço" mostrado pareça atrativo, tentar vender uma posição grande pode derrubar o preço no processo — um problema comum em tokens novos e pouco negociados.\n\nNenhuma dessas três métricas, isoladamente, diz se vale a pena. Elas servem para triangular: um projeto com market cap alto, volume real consistente e liquidez saudável já eliminou algumas das bandeiras vermelhas mais óbvias — mas isso ainda não é uma recomendação, é só o começo da análise.`,
          },
          {
            id: 'les-fb-3-2',
            title: 'Ciclos de alta e baixa não são garantia de nada',
            durationMin: 6,
            content: `O mercado cripto historicamente passou por ciclos pronunciados de alta forte seguida de queda forte. É tentador olhar para gráficos passados e concluir que "sempre sobe depois", mas isso é um raciocínio perigoso por dois motivos.\n\nPrimeiro, viés de sobrevivência: só continuamos falando dos ativos que se recuperaram. Milhares de outros, que também "sempre tinham subido antes", simplesmente foram a zero e desapareceram — e ninguém faz gráfico bonito sobre eles.\n\nSegundo, desempenho passado não é garantia de desempenho futuro — essa frase parece clichê, mas é literalmente verdadeira em qualquer mercado financeiro, cripto incluído. Cada ciclo tem causas específicas (mudanças regulatórias, taxas de juros globais, eventos específicos de cada projeto) que não se repetem de forma idêntica.\n\nO hábito mais útil não é tentar prever o próximo ciclo, e sim nunca investir mais do que você aceitaria perder por completo, dado que perdas totais já aconteceram — e vão continuar acontecendo — com ativos que pareciam promissores.`,
          },
        ],
      },
    ],
  },
  {
    id: 'carteiras-e-seguranca',
    title: 'Carteiras e Segurança',
    summary: 'Quem tem a chave, tem os fundos. Este curso existe para você nunca perder a sua.',
    level: 'iniciante',
    category: 'Segurança',
    modules: [
      {
        id: 'mod-cs-1',
        title: 'Tipos de carteira',
        lessons: [
          {
            id: 'les-cs-1-1',
            title: 'Custodial vs. não-custodial',
            durationMin: 6,
            content: `A primeira decisão que qualquer pessoa toma, geralmente sem perceber, é: quem vai guardar minha chave privada?\n\nNuma carteira custodial — como a conta numa exchange (Binance, Coinbase, Mercado Bitcoin, etc.) — a própria empresa guarda as chaves em nome de todos os usuários. Isso é mais simples: você usa login e senha como em qualquer serviço online, pode recuperar acesso perdendo a senha, e a empresa geralmente tem seguro e processos de segurança dedicados. O custo é a dependência: se a exchange for hackeada, entrar em falência ou congelar sua conta, você não tem controle direto sobre os fundos até que ela decida liberar.\n\nNuma carteira não-custodial — como uma extensão de navegador (MetaMask), um app de carteira (Phantom, Trust Wallet) ou um hardware wallet — só você tem a chave. Isso dá controle total, mas também responsabilidade total: perdeu a chave (ou a seed phrase que a recria), perdeu o acesso, definitivamente. Não existe "esqueci minha senha" numa carteira não-custodial de verdade.\n\nA frase que resume essa diferença, comum na comunidade cripto, é "not your keys, not your coins" — se você não controla a chave, você não controla, de fato, o ativo; você tem uma promessa de acesso a ele.`,
          },
          {
            id: 'les-cs-1-2',
            title: 'Hot wallet vs. cold wallet',
            durationMin: 6,
            content: `Independente de ser custodial ou não, uma carteira também se classifica por estar ou não conectada à internet.\n\nUma hot wallet fica conectada — um app no celular, uma extensão no navegador. É prática para o dia a dia: você assina transações rapidamente, interage com aplicativos descentralizados, movimenta pequenos valores com facilidade. A desvantagem é a superfície de ataque: qualquer malware no seu dispositivo, extensão maliciosa, ou site de phishing tem, em teoria, uma via de acesso até ela.\n\nUma cold wallet fica desconectada da internet na maior parte do tempo — o exemplo mais comum é um hardware wallet, um dispositivo físico dedicado só a guardar chaves e assinar transações offline, conectando-se ao computador apenas no momento da assinatura. Isso reduz drasticamente a exposição a ataques remotos, ao custo de ser mais lenta e menos prática para uso frequente.\n\nA prática recomendada por especialistas em segurança é segmentar: usar uma hot wallet com pouco capital para o dia a dia, e uma cold wallet para guardar a maior parte dos fundos por longos períodos — nunca colocar tudo no mesmo lugar, seja ele qual for.`,
          },
        ],
      },
      {
        id: 'mod-cs-2',
        title: 'Chaves e seed phrase',
        lessons: [
          {
            id: 'les-cs-2-1',
            title: 'Chave pública e chave privada',
            durationMin: 7,
            content: `Toda carteira não-custodial se baseia em um par de chaves matemáticas relacionadas: uma chave pública e uma chave privada.\n\nA chave pública gera o seu endereço — pode ser compartilhada livremente, é o que você dá para alguém te enviar fundos, funciona como um número de conta. Não há problema nenhum em divulgar um endereço público.\n\nA chave privada é o que prova posse e autoriza movimentar os fundos daquele endereço — é matematicamente ligada à chave pública, mas não pode ser descoberta a partir dela (a relação funciona só num sentido). Qualquer pessoa que tenha acesso à sua chave privada pode assinar transações e mover seus fundos, exatamente como se fosse você — sem precisar de senha adicional, sem verificação de identidade, sem processo de recuperação.\n\nÉ por isso que toda a segurança de uma carteira não-custodial se resume, no fim das contas, a uma única pergunta: quem mais, além de você, teve contato com essa chave privada (ou com a seed phrase que a gera)?`,
          },
          {
            id: 'les-cs-2-2',
            title: 'A seed phrase é a chave mestra',
            durationMin: 6,
            content: `A maioria das carteiras modernas não pede para você guardar a chave privada diretamente — em vez disso, ela gera uma seed phrase (também chamada de frase de recuperação ou mnemônica): uma sequência de 12 ou 24 palavras em ordem específica, que consegue recriar todas as chaves privadas daquela carteira.\n\nIsso existe para facilitar backup: 24 palavras em português ou inglês são mais fáceis de anotar e conferir corretamente do que uma sequência de caracteres aleatórios. Mas a implicação de segurança é a mesma: quem tiver essas palavras, na ordem certa, recria sua carteira inteira em qualquer dispositivo, em qualquer lugar do mundo, e controla os fundos por completo.\n\nIsso não é uma senha que pode ser trocada depois de vazada — é mais parecido com a estrutura genética da sua carteira. Se ela for exposta (mesmo que você "ache" que ninguém viu), a única ação de segurança real é mover os fundos para uma carteira nova, com uma seed phrase gerada do zero, o quanto antes.`,
          },
          {
            id: 'les-cs-2-3',
            title: 'Como guardar sua seed phrase com segurança',
            durationMin: 7,
            content: `Algumas práticas são consenso entre especialistas em segurança de criptoativos:\n\nNunca digite sua seed phrase em nenhum site, aplicativo de chat, formulário online ou assistente de IA — nenhum serviço legítimo jamais precisa dela para "verificar", "sincronizar" ou "recuperar" sua conta. Se algo pede isso, é golpe, sem exceção.\n\nNunca tire foto da sua seed phrase nem a guarde em texto puro num serviço de nuvem, e-mail, ou aplicativo de notas conectado à internet — esses locais podem ser comprometidos remotamente, e você nem fica sabendo até ser tarde.\n\nO método mais recomendado é anotar à mão em papel (ou gravar em metal, para resistência a fogo e água) e guardar fisicamente em um lugar seguro — e, para valores maiores, considerar dividir o armazenamento em mais de um local, ou usar soluções específicas de backup distribuído.\n\nSe você tem herdeiros ou pessoas que dependem desses fundos, vale planejar como essa informação seria acessada em caso de morte ou incapacidade — sem, é claro, comprometer a segurança em vida. Esse é um problema real e ainda mal resolvido em todo o ecossistema.`,
          },
        ],
      },
      {
        id: 'mod-cs-3',
        title: 'Higiene de segurança no dia a dia',
        lessons: [
          {
            id: 'les-cs-3-1',
            title: 'Phishing e sites falsos',
            durationMin: 6,
            content: `Phishing continua sendo o vetor de ataque mais comum contra usuários de cripto — não porque seja sofisticado, mas porque é barato de executar e explora um momento de distração.\n\nAs variações mais comuns incluem: sites clonados de exchanges ou carteiras populares com URL quase idêntica ao original; anúncios pagos em buscadores que levam a esses sites falsos, muitas vezes aparecendo ACIMA do resultado oficial; e pop-ups de "conectar carteira" em sites comprometidos ou falsos que, na verdade, pedem uma assinatura maliciosa.\n\nA defesa mais simples e mais eficaz é conferir a URL, letra por letra, sempre que for inserir credenciais ou conectar uma carteira — e preferir digitar o endereço manualmente ou usar um favorito salvo, em vez de clicar em links recebidos por e-mail, mensagem direta ou anúncio.`,
          },
          {
            id: 'les-cs-3-2',
            title: 'O que você está realmente assinando',
            durationMin: 7,
            content: `Ao interagir com aplicativos descentralizados, sua carteira frequentemente pede para você "assinar" ou "aprovar" alguma coisa. Muita gente clica em "confirmar" sem ler, do mesmo jeito que se aceita termos de uso — e é exatamente aí que golpes de aprovação de token acontecem.\n\nUma aprovação de token pode dar a um contrato permissão para movimentar uma quantidade (às vezes ilimitada) de um ativo específico da sua carteira, sem pedir confirmação de novo no futuro. Um site malicioso pode disfarçar essa aprovação como se fosse uma ação inofensiva ("verificar elegibilidade", "reivindicar airdrop") e, depois, esvaziar a carteira usando essa permissão já concedida.\n\nCarteiras modernas mostram, geralmente em texto simples antes da confirmação, o que está sendo autorizado. Vale o hábito de parar e ler essa tela — e, periodicamente, revisar e revogar aprovações antigas que não são mais necessárias, usando ferramentas específicas para isso.`,
          },
          {
            id: 'les-cs-3-3',
            title: 'Golpes de suporte falso',
            durationMin: 5,
            content: `Um padrão recorrente: alguém entra em contato — por Discord, Telegram, redes sociais ou até ligação telefônica — se passando por suporte técnico de uma exchange, carteira ou projeto conhecido, alegando um problema urgente na sua conta.\n\nO objetivo final é sempre o mesmo: fazer você compartilhar sua seed phrase, sua senha, ou instalar um software de acesso remoto no seu computador "para resolver o problema". Suporte técnico legítimo nunca inicia contato dessa forma, e nunca, em nenhuma circunstância, precisa da sua seed phrase para resolver qualquer problema — porque nenhum problema legítimo se resolve com ela.\n\nSe você recebeu uma mensagem inesperada alegando um problema na sua conta, o caminho seguro é ignorá-la e acessar o serviço diretamente pelo aplicativo oficial ou pelo site digitado manualmente — nunca por um link enviado na própria mensagem suspeita.`,
          },
        ],
      },
    ],
  },
  {
    id: 'defi-na-pratica',
    title: 'DeFi na Prática',
    summary: 'Empréstimo, troca e rendimento sem banco no meio — e os riscos específicos que vêm junto.',
    level: 'intermediario',
    category: 'DeFi',
    modules: [
      {
        id: 'mod-df-1',
        title: 'O que muda sem o banco',
        lessons: [
          {
            id: 'les-df-1-1',
            title: 'Contratos inteligentes como intermediário',
            durationMin: 7,
            content: `DeFi (finanças descentralizadas) é o nome dado a um conjunto de serviços financeiros — empréstimo, troca de ativos, rendimento, seguros — que, em vez de serem operados por uma instituição, são executados por contratos inteligentes: programas que rodam sobre uma blockchain e fazem exatamente o que o código determina, sem exceção e sem julgamento humano no meio.\n\nIsso tem uma vantagem real: qualquer pessoa com conexão à internet e uma carteira pode acessar esses serviços, sem análise de crédito, sem horário comercial, sem depender de estar em um país com sistema bancário desenvolvido. E tem uma desvantagem simétrica: não existe atendimento ao cliente para reverter um erro, negociar um prazo, ou aplicar bom senso numa situação que o código não previu.\n\n"Confiar no código" substitui "confiar numa instituição" — e isso significa que a qualidade e a auditoria daquele código passam a ser, literalmente, tudo o que protege seu dinheiro.`,
          },
          {
            id: 'les-df-1-2',
            title: 'Custódia própria e suas responsabilidades',
            durationMin: 5,
            content: `Usar DeFi normalmente significa interagir diretamente com contratos a partir de uma carteira não-custodial — não existe "central de atendimento DeFi" para recuperar uma senha ou reverter uma transação enviada para o endereço errado.\n\nIsso muda o perfil de risco em relação a usar uma exchange centralizada: você troca o risco de contraparte (a empresa pode falir, congelar fundos, ser hackeada) pelo risco técnico (o código pode ter um bug, o protocolo pode ser mal desenhado) e pelo risco operacional próprio (você pode errar um endereço, aprovar algo que não devia, perder acesso à sua própria carteira).\n\nNenhuma dessas categorias de risco é objetivamente "melhor" — são diferentes, e vale entender qual delas você está mais preparado para gerenciar antes de mover capital significativo para DeFi.`,
          },
        ],
      },
      {
        id: 'mod-df-2',
        title: 'Os blocos de construção do DeFi',
        lessons: [
          {
            id: 'les-df-2-1',
            title: 'Lending e borrowing',
            durationMin: 8,
            content: `Protocolos de empréstimo (lending) em DeFi funcionam com uma lógica diferente de um banco tradicional: em vez de análise de crédito, eles exigem colateral — você deposita um ativo como garantia para poder tomar outro emprestado.\n\nNa prática, isso normalmente significa sobrecolateralização: para tomar emprestado o equivalente a $100, você pode precisar depositar $150 em garantia, justamente porque o protocolo precisa de uma margem de segurança contra a queda de preço do colateral.\n\nSe o valor do colateral cair abaixo de um limite definido pelo protocolo, ele é liquidado automaticamente — vendido no mercado para cobrir o empréstimo — sem aviso prévio, sem prazo de carência, e geralmente com uma multa (taxa de liquidação) sobre o valor liquidado. Isso pode acontecer em minutos, durante uma queda brusca de mercado, mesmo que a intenção original fosse manter a posição por muito mais tempo.`,
          },
          {
            id: 'les-df-2-2',
            title: 'DEXs e AMMs',
            durationMin: 8,
            content: `Uma exchange centralizada (CEX) funciona com um livro de ofertas: compradores e vendedores publicam preços, e a exchange casa as ordens compatíveis. A maioria das exchanges descentralizadas (DEXs) usa um modelo diferente, chamado AMM (Automated Market Maker, ou "formador de mercado automatizado").\n\nEm um AMM, não existe um livro de ofertas — existe uma pool de liquidez: uma reserva com dois (ou mais) ativos, fornecida por outros usuários. Quando você troca um ativo por outro, você está negociando diretamente contra essa reserva, e o preço se ajusta automaticamente conforme a proporção entre os dois ativos muda a cada troca, seguindo uma fórmula matemática definida pelo protocolo.\n\nQuem fornece liquidez a essas pools ganha uma fração das taxas pagas por quem troca — mas assume, em troca, o risco de perda impermanente, abordado na próxima lição.`,
          },
          {
            id: 'les-df-2-3',
            title: 'Staking e yield farming',
            durationMin: 6,
            content: `Render juros sobre criptoativos parados é uma das propostas mais atrativas do DeFi — e uma das mais mal compreendidas.\n\nStaking, no contexto de Proof of Stake, significa travar tokens para ajudar a validar a rede, recebendo uma recompensa por isso — um rendimento com origem relativamente clara (a própria emissão de novos tokens da rede, mais taxas de transação).\n\nYield farming é um termo mais amplo, que inclui fornecer liquidez a pools DeFi, participar de programas de incentivo de novos protocolos, e outras estratégias combinadas. A taxa anunciada (APY, rendimento percentual anual) pode ter origens muito diferentes: juros reais pagos por tomadores de empréstimo, taxas de troca, ou simplesmente emissão de um novo token do próprio protocolo como recompensa — que só tem valor real se houver demanda sustentável por esse token depois.\n\nAPYs muito acima da média do mercado quase sempre significam que uma parte relevante do "rendimento" vem de emissão de token novo, não de atividade econômica real — o que pode diluir o valor do que você já tem, mesmo que o número pareça alto.`,
          },
        ],
      },
      {
        id: 'mod-df-3',
        title: 'Riscos específicos do DeFi',
        lessons: [
          {
            id: 'les-df-3-1',
            title: 'Risco de contrato inteligente',
            durationMin: 6,
            content: `Um contrato inteligente é código, e código pode ter bugs. Diferente de um sistema bancário tradicional, onde um erro de software geralmente pode ser corrigido e revertido internamente, um bug explorado num contrato inteligente já implantado costuma ser irreversível: os fundos já saíram, a transação já foi confirmada pela rede.\n\nProtocolos DeFi sérios contratam auditorias de segurança independentes antes de lançar — mas auditoria reduz risco, não elimina. Já houve casos de protocolos auditados por empresas respeitadas que, mesmo assim, foram explorados por vulnerabilidades que a auditoria não pegou.\n\nA implicação prática: quanto maior o valor total travado (TVL) e mais tempo um protocolo está no ar sem incidentes, mais evidência (não garantia) existe de que o código é robusto — mas nenhum histórico, por mais longo, elimina completamente esse risco.`,
          },
          {
            id: 'les-df-3-2',
            title: 'Perda impermanente',
            durationMin: 7,
            content: `Quem fornece liquidez a uma pool AMM está exposto a um efeito chamado perda impermanente: se o preço relativo entre os dois ativos da pool mudar muito depois que você forneceu liquidez, o valor que você consegue retirar pode ser menor do que se você simplesmente tivesse guardado os dois ativos separados, sem fornecer liquidez.\n\nIsso acontece porque o mecanismo do AMM rebalanceia automaticamente a proporção da pool conforme o preço muda — na prática, isso tende a fazer você vender o ativo que está subindo e comprar o que está caindo, o oposto do que a maioria das pessoas gostaria de fazer.\n\nO termo "impermanente" existe porque, se os preços voltarem à proporção original, a perda desaparece — mas se você retirar sua liquidez enquanto os preços estão divergentes, ela se torna uma perda real e definitiva. As taxas de negociação recebidas por fornecer liquidez podem compensar parte ou toda essa perda, dependendo do volume da pool — mas isso não é garantido, e precisa ser calculado, não presumido.`,
          },
          {
            id: 'les-df-3-3',
            title: 'Liquidação em cascata',
            durationMin: 6,
            content: `Em momentos de queda brusca de mercado, muitas posições alavancadas em diferentes protocolos podem atingir seu limite de liquidação ao mesmo tempo. Cada liquidação envolve vender o colateral no mercado — o que empurra o preço ainda mais para baixo, disparando novas liquidações em cadeia.\n\nEsse efeito, conhecido informalmente como "cascata de liquidação", pode acontecer em minutos e amplifica quedas que, sem alavancagem envolvida, seriam bem menos severas. Ele afeta não só quem está alavancado diretamente, mas todo o mercado daquele ativo, pela pressão de venda repentina.\n\nA lição prática para quem usa DeFi com alavancagem é manter uma margem de segurança bem acima do mínimo exigido pelo protocolo — a distância entre "confortável" e "liquidado" pode ser muito menor do que parece durante um mercado calmo.`,
          },
        ],
      },
    ],
  },
  {
    id: 'nfts-tokens-daos',
    title: 'NFTs, Tokens e DAOs',
    summary: 'O que um token realmente representa, além da arte digital e do hype de 2021.',
    level: 'intermediario',
    category: 'Tokens & Governança',
    modules: [
      {
        id: 'mod-nt-1',
        title: 'Tokens fungíveis e não-fungíveis',
        lessons: [
          {
            id: 'les-nt-1-1',
            title: 'O que realmente é um token',
            durationMin: 6,
            content: `Um token é um registro de posse programável, emitido sobre uma blockchain já existente (em vez de ter sua própria rede dedicada, como o Bitcoin tem). Tecnicamente, é um contrato inteligente que segue um padrão — no Ethereum, os mais comuns são ERC-20 (para tokens fungíveis) e ERC-721 (para tokens não-fungíveis).\n\nO que aquele token representa depende inteiramente de quem o criou e das regras que programou: pode ser uma moeda, uma cota de participação, um direito de voto, o registro de posse de um item digital, ou até um ativo do mundo real tokenizado (como um imóvel fracionado). A tecnologia é a mesma; o significado econômico e legal por trás dela é que muda completamente.\n\nIsso importa porque "é um token" não diz nada, por si só, sobre valor, legitimidade ou risco — da mesma forma que "é um papel assinado" não diz se um contrato é justo ou uma fraude.`,
          },
          {
            id: 'les-nt-1-2',
            title: 'NFTs além da arte',
            durationMin: 7,
            content: `NFT significa "token não-fungível" — cada unidade é única e não pode ser trocada 1-para-1 por outra unidade idêntica, ao contrário de uma moeda fungível. O boom de 2021-2022 associou o termo quase exclusivamente a arte colecionável digital, com preços que, em muitos casos, subiram por especulação e depois caíram mais de 90% — boa parte desses projetos hoje vale uma fração ínfima do pico.\n\nMas o conceito técnico de "posse única e verificável" tem aplicações que vão além disso: ingressos de eventos que impedem falsificação, itens de jogos que o jogador realmente possui (podendo vender ou transferir fora do jogo), certificados educacionais ou profissionais verificáveis publicamente, e registros de propriedade fracionada de ativos físicos.\n\nA lição honesta sobre o ciclo de 2021-2022 não é que "NFT é golpe" — é que a maior parte da demanda daquele período foi especulativa, comprando pela expectativa de revenda por um preço maior, não pelo uso real do ativo. Isso não é exclusivo de NFT; é o padrão clássico de qualquer bolha especulativa, em qualquer mercado, ao longo da história.`,
          },
        ],
      },
      {
        id: 'mod-nt-2',
        title: 'Governança descentralizada',
        lessons: [
          {
            id: 'les-nt-2-1',
            title: 'Como funciona uma DAO',
            durationMin: 7,
            content: `Uma DAO (Organização Autônoma Descentralizada) é uma estrutura em que decisões coletivas — sobre um protocolo, um fundo, ou um projeto — são tomadas por voto de detentores de um token de governança, em vez de por uma diretoria tradicional.\n\nO fluxo típico é: alguém com tokens suficientes submete uma proposta (mudar um parâmetro do protocolo, alocar fundos de um tesouro, etc.); a comunidade vota durante um período determinado, geralmente com peso de voto proporcional à quantidade de tokens; se aprovada, a execução pode ser automática via contrato inteligente, ou depender de uma equipe designada para implementar.\n\nEssa estrutura tenta resolver um problema real: como coordenar decisões num grupo grande e distribuído globalmente, sem uma hierarquia formal — mas ela cria seus próprios desafios de coordenação, discutidos na próxima lição.`,
          },
          {
            id: 'les-nt-2-2',
            title: 'Limites reais da descentralização',
            durationMin: 7,
            content: `Na teoria, uma DAO distribui poder de decisão amplamente. Na prática, três problemas recorrentes aparecem na maioria das DAOs reais.\n\nConcentração de voto: como o peso do voto costuma ser proporcional à quantidade de tokens, detentores grandes ("baleias") — que podem incluir os próprios fundadores, investidores iniciais ou fundos — têm influência desproporcional sobre qualquer decisão, mesmo que tecnicamente qualquer holder pudesse votar.\n\nParticipação baixa: a maioria dos detentores de token de governança nunca vota, seja por falta de tempo, de interesse, ou de entendimento técnico da proposta — o que amplifica ainda mais o peso relativo de quem participa ativamente.\n\nAmbiguidade legal: quem responde legalmente pelas decisões de uma DAO — pelos danos causados por uma proposta aprovada, por exemplo — ainda é uma área cinzenta na maioria das jurisdições, incluindo o Brasil. Alguns países começaram a criar estruturas legais específicas para DAOs, mas isso está longe de ser padrão global.\n\nNenhum desses problemas invalida o conceito, mas eles significam que "é uma DAO" não é sinônimo automático de "é justo" ou "é descentralizado de fato" — vale sempre olhar a distribuição real de tokens antes de assumir isso.`,
          },
        ],
      },
    ],
  },
  {
    id: 'stablecoins-e-risco',
    title: 'Stablecoins e Gestão de Risco',
    summary: 'O "porto seguro" do mundo cripto — e como pensar em tamanho de posição como alguém que gerencia risco de verdade.',
    level: 'intermediario',
    category: 'Estabilidade & Risco',
    modules: [
      {
        id: 'mod-sr-1',
        title: 'Tipos de stablecoin',
        lessons: [
          {
            id: 'les-sr-1-1',
            title: 'Lastreadas em moeda tradicional',
            durationMin: 6,
            content: `A categoria mais simples de stablecoin promete manter reserva de moeda tradicional (dólar, geralmente) equivalente à quantidade de tokens emitidos: para cada unidade em circulação, a empresa emissora afirma manter um dólar (ou equivalente em títulos de curto prazo) guardado.\n\nO risco central aqui não é técnico, é de confiança institucional: você está confiando que a empresa emissora realmente mantém essa reserva integral, que ela é auditada de forma independente e transparente, e que ela vai honrar o resgate mesmo em cenário de estresse de mercado com muita gente pedindo resgate ao mesmo tempo.\n\nDiferentes emissores têm diferentes níveis de transparência sobre suas reservas — alguns publicam auditorias regulares de empresas independentes, outros historicamente foram mais opacos sobre a composição exata do que garantia seus tokens. Essa diferença de transparência é um fator de risco relevante e específico de cada stablecoin, não generalizável para a categoria toda.`,
          },
          {
            id: 'les-sr-1-2',
            title: 'Colateralizadas em cripto',
            durationMin: 6,
            content: `Outra abordagem usa outras criptomoedas como colateral, geralmente de forma sobrecolateralizada: para emitir $100 em stablecoin, o protocolo pode exigir $150 ou mais em outro ativo cripto como garantia, travado num contrato inteligente.\n\nA sobrecolateralização existe justamente para absorver a volatilidade do ativo de garantia — se o colateral cair de valor, o protocolo tem uma margem antes de ficar subcolateralizado. Se essa margem se esgotar, o mecanismo de liquidação automática entra em ação, de forma parecida com o que acontece em protocolos de empréstimo.\n\nO risco aqui é uma combinação: risco de contrato inteligente (o código do protocolo precisa funcionar corretamente) mais risco de mercado (uma queda rápida e extrema do colateral pode superar a margem de segurança antes que as liquidações consigam acompanhar).`,
          },
          {
            id: 'les-sr-1-3',
            title: 'Algorítmicas: o modelo de maior risco histórico',
            durationMin: 7,
            content: `Stablecoins algorítmicas tentam manter a paridade sem reserva direta de colateral — usando, em vez disso, incentivos econômicos e algoritmos que ajustam a oferta automaticamente (emitindo mais quando o preço sobe acima da paridade, retirando de circulação quando cai abaixo).\n\nEsse modelo depende inteiramente da confiança do mercado no mecanismo continuar funcionando. Historicamente, stablecoins algorítmicas já sofreram quebras de paridade (de-peg) catastróficas: em cenários de pânico, quando muita gente tenta sair ao mesmo tempo, o próprio mecanismo de ajuste pode entrar num ciclo vicioso que acelera a queda em vez de conter, levando o token a perder a maior parte ou a totalidade do seu valor em questão de dias.\n\nEssa é, historicamente, a categoria de stablecoin com o maior risco estrutural das três — o que não significa que toda stablecoin algorítmica vá necessariamente falhar, mas significa que o risco de cauda (eventos raros, porém catastróficos) é significativamente mais alto do que nas outras categorias, e deve ser avaliado com esse peso.`,
          },
        ],
      },
      {
        id: 'mod-sr-2',
        title: 'Gestão de risco de portfólio',
        lessons: [
          {
            id: 'les-sr-2-1',
            title: 'Dimensionamento de posição',
            durationMin: 6,
            content: `Uma das perguntas mais importantes em qualquer investimento — e uma das mais ignoradas por iniciantes em cripto — não é "o que comprar", é "quanto colocar".\n\nUm princípio simples e amplamente usado por gestores de risco profissionais: nunca arrisque, numa única posição, mais do que você aceitaria perder por completo sem que isso comprometa sua vida financeira. Isso vale ainda mais para ativos de alta volatilidade e projetos novos, onde a possibilidade de perda total (não só de queda, perda total mesmo) é real e não hipotética.\n\nTer 100% do seu capital de investimento num único ativo cripto novo é uma decisão de risco categoricamente diferente de ter 2% do seu capital nele — mesmo que a "escolha do ativo" seja idêntica nos dois casos. O tamanho da posição é, sozinho, uma das variáveis de risco mais importantes que você controla diretamente.`,
          },
          {
            id: 'les-sr-2-2',
            title: 'Diversificação não é só "ter moedas diferentes"',
            durationMin: 6,
            content: `Um erro comum é achar que possuir dez tokens diferentes já significa estar diversificado. Se todos esses tokens reagem de forma parecida ao mesmo tipo de evento (por exemplo, todos caem juntos numa correção geral do mercado cripto, ou todos dependem do sucesso da mesma rede), a diversificação real é muito menor do que o número de ativos sugere.\n\nDiversificação de verdade considera correlação: o quanto ativos diferentes tendem a se mover juntos ou de forma independente. Isso também vale entre classes de ativos — misturar cripto com outras formas de investimento, e não só entre criptoativos diferentes entre si.\n\nO objetivo da diversificação não é eliminar risco (isso é impossível), é evitar que um único evento — a falha de um único projeto, de uma única exchange, de um único mecanismo — seja capaz de comprometer todo o seu capital de uma vez.`,
          },
        ],
      },
    ],
  },
  {
    id: 'riscos-e-golpes',
    title: 'Riscos, Golpes e Como se Proteger',
    summary: 'A seção que a maioria dos cursos de cripto não quer dar. Golpes reais, sem eufemismo, e o que fazer se acontecer com você.',
    level: 'iniciante',
    category: 'Riscos & Golpes',
    modules: [
      {
        id: 'mod-rg-1',
        title: 'Golpes mais comuns',
        lessons: [
          {
            id: 'les-rg-1-1',
            title: 'Rug pull',
            durationMin: 6,
            content: `Rug pull ("puxar o tapete") é quando os criadores de um projeto abandonam repentinamente, retirando toda a liquidez ou os fundos captados e desaparecendo, geralmente logo depois de uma campanha de marketing intensa para atrair o máximo de investidores possível antes de sumir.\n\nSinais de alerta comuns: equipe totalmente anônima sem histórico verificável, promessas de valorização rápida e desproporcional, pressão para investir "antes que acabe" ou "antes de todo mundo descobrir", contrato do token com funções que permitem à equipe retirar liquidez unilateralmente (algo verificável, com conhecimento técnico, em exploradores de blockchain públicos).\n\nNenhum sinal isolado garante que é golpe, mas a combinação de vários — especialmente equipe anônima mais promessa de retorno rápido — é motivo suficiente para redobrar a cautela antes de colocar qualquer dinheiro.`,
          },
          {
            id: 'les-rg-1-2',
            title: 'Phishing de carteira',
            durationMin: 5,
            content: `Já coberto em detalhe no curso de Carteiras e Segurança, mas vale reforçar aqui como um dos golpes mais frequentes: sites falsos, pop-ups maliciosos e anúncios que imitam serviços legítimos, com o objetivo de fazer você digitar sua seed phrase ou assinar uma transação que transfere seus fundos.\n\nA defesa central é sempre a mesma: nunca digitar a seed phrase em lugar nenhum, e conferir cuidadosamente qualquer URL antes de conectar uma carteira ou inserir credenciais.`,
          },
          {
            id: 'les-rg-1-3',
            title: 'Esquemas de retorno garantido',
            durationMin: 6,
            content: `"Deposite X e receba Y% garantido todo mês" é a estrutura clássica de esquema de pirâmide (ou "esquema Ponzi", em referência ao golpista que popularizou o modelo há mais de um século): os primeiros investidores são pagos com o dinheiro dos investidores seguintes, não com lucro real gerado por alguma atividade — até que o fluxo de novos investidores não seja mais suficiente para pagar os antigos, e o esquema colapsa, geralmente de forma repentina.\n\nEsses esquemas frequentemente se apresentam com nomes técnicos ("robô de arbitragem", "fundo quantitativo automatizado", "pool de mineração exclusiva") para parecer legítimos, e às vezes chegam a pagar os primeiros retornos prometidos — justamente para gerar confiança e atrair indicações para amigos e familiares, ampliando o alcance antes do colapso.\n\nNão existe retorno garantido em nenhum investimento real, cripto ou tradicional — mercados envolvem risco por definição. Qualquer oferta que combine "garantido" com um percentual alto é, por si só, motivo suficiente para desconfiar, independente de quão convincente pareça a pessoa ou a plataforma que está oferecendo.`,
          },
          {
            id: 'les-rg-1-4',
            title: 'Golpe do relacionamento (pig butchering)',
            durationMin: 7,
            content: `Um dos golpes mais sofisticados e financeiramente devastadores dos últimos anos começa de forma completamente diferente dos outros: não com uma oferta de investimento, mas com um relacionamento — romântico ou de amizade — construído ao longo de semanas ou meses, geralmente iniciado em redes sociais, aplicativos de namoro ou por mensagem "enviada por engano".\n\nO termo em inglês, "pig butchering" (literalmente "abate de porco"), vem da metáfora cruel de "engordar o animal antes do abate": o golpista investe tempo genuíno construindo confiança emocional antes de, eventualmente, mencionar um investimento supostamente muito lucrativo que ele mesmo estaria usando, convidando a vítima a participar através de uma plataforma controlada pelo golpista.\n\nA plataforma frequentemente mostra ganhos falsos crescendo ao longo do tempo, incentivando a vítima a investir cada vez mais — até o momento em que ela tenta sacar e descobre que os fundos, e a pessoa do outro lado, desapareceram.\n\nO sinal de alerta mais confiável é o padrão em si: alguém que você conheceu recentemente online, com quem desenvolveu uma conexão pessoal forte e rápida, eventualmente sugerindo — direta ou indiretamente — que vocês invistam juntos numa plataforma específica que só ele ou ela indicou.`,
          },
        ],
      },
      {
        id: 'mod-rg-2',
        title: 'Construindo hábitos seguros',
        lessons: [
          {
            id: 'les-rg-2-1',
            title: 'Checklist antes de investir em qualquer projeto novo',
            durationMin: 6,
            content: `Antes de colocar dinheiro em qualquer projeto cripto novo, algumas perguntas ajudam a filtrar os casos mais óbvios de risco elevado:\n\nA equipe é identificável publicamente, com histórico verificável fora do próprio projeto? Existe um caso de uso real e compreensível, ou o "produto" é apenas a promessa de valorização do próprio token? O contrato do token foi auditado por uma empresa de segurança independente e reconhecida? A liquidez está bloqueada por um período verificável, ou a equipe pode retirá-la a qualquer momento? O retorno prometido é compatível com o risco real de mercado, ou parece bom demais para ser verdade?\n\nResponder "não" ou "não sei" para várias dessas perguntas não significa automaticamente que é golpe — mas significa que o nível de risco é alto, e o valor investido deveria refletir isso.`,
          },
          {
            id: 'les-rg-2-2',
            title: 'O que fazer se você foi vítima',
            durationMin: 6,
            content: `Se você identificou que caiu em um golpe, a velocidade de reação importa mais do que qualquer outra coisa.\n\nSe uma seed phrase ou chave privada foi exposta, mova imediatamente qualquer fundo restante para uma carteira nova, criada do zero — não continue usando a carteira comprometida, mesmo que pareça que "nada mais sumiu ainda".\n\nDocumente tudo: capturas de tela de conversas, endereços de carteira envolvidos, valores e datas das transações. Blockchains públicas registram tudo permanentemente, o que ajuda em investigações, mesmo que a recuperação dos fundos não seja garantida.\n\nRegistre um boletim de ocorrência — no Brasil, crimes cibernéticos e estelionato têm previsão legal específica, e o registro formal é necessário para qualquer possibilidade futura de rastreamento ou ação legal, mesmo que a recuperação direta seja rara em golpes internacionais.\n\nPor fim, e talvez o passo mais difícil emocionalmente: evite o golpe secundário comum que atinge vítimas de golpes cripto — perfis que se oferecem para "recuperar seus fundos perdidos" mediante pagamento adiantado. Isso, quase sempre, é um segundo golpe explorando a mesma vulnerabilidade.`,
          },
        ],
      },
    ],
  },
];

module.exports = { courses };

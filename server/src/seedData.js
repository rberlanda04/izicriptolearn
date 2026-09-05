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
            diagramKey: 'blockchain-chain',
            quiz: {
              question: 'Por que mudar uma transação num bloco antigo invalida todos os blocos seguintes?',
              options: [
                'Porque cada bloco guarda o hash do bloco anterior, e mudar os dados muda o hash',
                'Porque a rede detecta automaticamente qualquer erro de digitação',
                'Porque os blocos são criptografados com a chave privada do usuário',
                'Porque existe um administrador central que revisa cada bloco',
              ],
              correct: 0,
              explanation: 'Cada bloco armazena o hash do anterior; se um dado antigo mudar, o hash daquele bloco muda, invalidando a referência guardada no próximo — e assim por diante.',
            },
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
            diagramKey: 'transaction-flow',
            quiz: {
              question: 'No fluxo de uma transação em blockchain, o que precisa acontecer antes de ela ser considerada confirmada?',
              options: [
                'Ela é aprovada automaticamente assim que sai da carteira do remetente',
                'Ela precisa ser agrupada em um bloco e validada pelas regras da rede',
                'Um banco intermediário precisa aprová-la manualmente',
                'O destinatário precisa confirmar o recebimento por e-mail',
              ],
              correct: 1,
              explanation: 'Depois de enviada, a transação fica pendente até ser agrupada em um bloco por um nó/minerador e validada pelas regras da rede — só aí passa a fazer parte do histórico permanente.',
            },
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
            diagramKey: 'pow-vs-pos',
            quiz: {
              question: 'Qual é a principal diferença entre Proof of Work e Proof of Stake na forma como cada um desincentiva fraude?',
              options: [
                'PoW torna fraude cara em hardware e eletricidade; PoS torna fraude cara em capital travado que pode ser confiscado',
                'PoW usa votação de usuários; PoS usa aprovação de um banco central',
                'Os dois métodos são idênticos, só muda o nome',
                'PoS não tem nenhum mecanismo de segurança, só confia nos validadores',
              ],
              correct: 0,
              explanation: 'Nos dois casos, fraudar custa caro — só que o custo é diferente: hardware/energia perdidos em PoW, ou capital travado (stake) que pode ser confiscado (slashing) em PoS.',
            },
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
            diagramKey: 'market-metrics',
            quiz: {
              question: 'Um token tem preço de $10 mas volume de negociação muito baixo. O que isso sugere sobre vender uma posição grande nele?',
              options: [
                'O preço de venda será exatamente $10 por unidade, não importa o tamanho',
                'A venda provavelmente vai sofrer slippage significativo, derrubando o preço médio recebido',
                'Baixo volume garante que o preço vai subir',
                'Volume não tem relação nenhuma com a capacidade de vender sem afetar o preço',
              ],
              correct: 1,
              explanation: 'Baixa liquidez/volume significa poucas ofertas de compra disponíveis perto do preço atual — uma venda grande consome essas ofertas e derruba o preço médio recebido (slippage).',
            },
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
            diagramKey: 'custody-spectrum',
            quiz: {
              question: 'Qual situação apresenta o maior risco de um hacker remoto roubar seus fundos?',
              options: [
                'Uma seed phrase de uma cold wallet guardada em papel numa gaveta',
                'Uma chave privada armazenada numa hot wallet conectada à internet',
                'Um hardware wallet nunca conectado a nenhum computador',
                'Fundos numa cold wallet que nunca foi conectada à internet',
              ],
              correct: 1,
              explanation: 'Hot wallets ficam conectadas à internet para facilitar o uso do dia a dia — isso é exatamente o que também as expõe a ataques remotos. Cold wallets isolam a chave privada do mundo online.',
            },
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
            diagramKey: 'key-pair-flow',
            quiz: {
              question: 'O que, entre as opções abaixo, você pode compartilhar com segurança sem risco de perder seus fundos?',
              options: [
                'Sua chave privada',
                'Sua seed phrase',
                'Seu endereço público (derivado da chave pública)',
                'O PIN do seu hardware wallet',
              ],
              correct: 2,
              explanation: 'O endereço público serve exatamente para ser compartilhado — é como um número de conta. Chave privada e seed phrase nunca devem ser reveladas a ninguém.',
            },
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
            diagramKey: 'defi-lending-flow',
            quiz: {
              question: 'Por que protocolos de empréstimo em DeFi exigem colateral maior do que o valor emprestado (sobrecolateralização)?',
              options: [
                'Para gerar lucro extra para o protocolo',
                'Para absorver a volatilidade do colateral e proteger o protocolo caso o valor caia',
                'É uma exigência legal em todos os países',
                'Para impedir que qualquer pessoa tome empréstimos',
              ],
              correct: 1,
              explanation: 'Sem um banco avaliando risco de crédito, o protocolo se protege exigindo mais garantia do que o valor emprestado — assim, mesmo se o colateral cair de valor, ainda cobre o empréstimo até ser liquidado.',
            },
            content: `Protocolos de empréstimo (lending) em DeFi funcionam com uma lógica diferente de um banco tradicional: em vez de análise de crédito, eles exigem colateral — você deposita um ativo como garantia para poder tomar outro emprestado.\n\nNa prática, isso normalmente significa sobrecolateralização: para tomar emprestado o equivalente a $100, você pode precisar depositar $150 em garantia, justamente porque o protocolo precisa de uma margem de segurança contra a queda de preço do colateral.\n\nSe o valor do colateral cair abaixo de um limite definido pelo protocolo, ele é liquidado automaticamente — vendido no mercado para cobrir o empréstimo — sem aviso prévio, sem prazo de carência, e geralmente com uma multa (taxa de liquidação) sobre o valor liquidado. Isso pode acontecer em minutos, durante uma queda brusca de mercado, mesmo que a intenção original fosse manter a posição por muito mais tempo.`,
          },
          {
            id: 'les-df-2-2',
            title: 'DEXs e AMMs',
            durationMin: 8,
            diagramKey: 'amm-swap',
            quiz: {
              question: 'Num AMM (Automated Market Maker), quem determina o preço de troca entre dois tokens?',
              options: [
                'Uma fórmula matemática baseada nas quantidades de cada token no pool de liquidez',
                'Um corretor humano que aprova cada troca',
                'O governo do país onde o protocolo foi criado',
                'Sempre o preço da última negociação numa exchange centralizada',
              ],
              correct: 0,
              explanation: 'AMMs usam uma fórmula (como x*y=k) que ajusta o preço automaticamente conforme a proporção de cada token no pool muda a cada troca — sem um livro de ofertas tradicional.',
            },
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
            diagramKey: 'impermanent-loss',
            quiz: {
              question: 'Um fornecedor de liquidez sofre perda impermanente quando...',
              options: [
                '...o preço dos tokens no pool se move de forma diferente do que se ele tivesse apenas guardado os tokens',
                '...ele nunca fez nenhum depósito no pool',
                '...o protocolo é hackeado',
                '...ele paga taxa de gas para retirar os fundos',
              ],
              correct: 0,
              explanation: 'A perda impermanente vem da forma como o AMM rebalanceia o pool conforme o preço muda — o valor final pode ficar menor do que se o fornecedor tivesse simplesmente guardado os dois ativos ("hold") sem fornecer liquidez.',
            },
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
            diagramKey: 'token-types',
            quiz: {
              question: 'O que tecnicamente diferencia um NFT de um token fungível como um criptoativo comum?',
              options: [
                'NFTs são sempre mais caros',
                'Cada NFT tem um identificador único e não é intercambiável 1:1 com outro do mesmo tipo',
                'NFTs não podem ser comprados ou vendidos',
                'Tokens fungíveis só existem no Bitcoin',
              ],
              correct: 1,
              explanation: 'Fungível significa que cada unidade é idêntica e intercambiável (como uma nota de R$10). Um NFT é único e não-fungível — mesmo dentro da mesma coleção, cada um tem um identificador próprio.',
            },
            content: `NFT significa "token não-fungível" — cada unidade é única e não pode ser trocada 1-para-1 por outra unidade idêntica, ao contrário de uma moeda fungível. O boom de 2021-2022 associou o termo quase exclusivamente a arte colecionável digital, com preços que, em muitos casos, subiram por especulação e depois caíram mais de 90% — boa parte desses projetos hoje vale uma fração ínfima do pico.\n\nMas o conceito técnico de "posse única e verificável" tem aplicações que vão além disso: ingressos de eventos que impedem falsificação, itens de jogos que o jogador realmente possui (podendo vender ou transferir fora do jogo), certificados educacionais ou profissionais verificáveis publicamente, e registros de propriedade fracionada de ativos físicos.\n\nA lição honesta sobre o ciclo de 2021-2022 não é que "NFT é golpe" — é que a maior parte da demanda daquele período foi especulativa, comprando pela expectativa de revenda por um preço maior, não pelo uso real do ativo. Isso não é exclusivo de NFT; é o padrão clássico de qualquer bolha especulativa, em qualquer mercado, ao longo da história.`,
          },
          {
            id: 'les-nt-1-3',
            title: 'Como avaliar um token na prática',
            durationMin: 7,
            quiz: {
              question: 'Um projeto anuncia "supply total de 1 bilhão de tokens, dos quais 40% ficam com a equipe, sem período de carência (vesting)". O que esse dado sinaliza?',
              options: [
                'Nada — o percentual da equipe não importa',
                'Risco alto: a equipe pode vender uma fatia enorme a qualquer momento, pressionando o preço para baixo',
                'É garantia de que o projeto é sério, já que a equipe "acredita" no próprio token',
                'Só importa o preço atual do token, não a distribuição',
              ],
              correct: 1,
              explanation: 'Alocação grande para a equipe não é necessariamente um problema — mas sem vesting (um cronograma que trava a venda por um tempo), nada impede que a equipe venda tudo de uma vez, derrubando o preço para quem comprou depois.',
            },
            content: `Antes de "isso vai subir?", a pergunta mais útil sobre qualquer token é: quem tem quanto, e quando pode vender? Isso se chama tokenomics — a economia por trás do token — e três números concentram a maior parte do sinal.\n\nSupply e distribuição: quantos tokens existem no total, e como estão divididos entre equipe, investidores iniciais, tesouro do projeto e público. Uma concentração muito alta em poucas carteiras (equipe e investidores iniciais) significa que poucas pessoas podem mover o preço sozinhas, em qualquer direção.\n\nVesting (cronograma de liberação): mesmo quando a equipe tem uma alocação grande, um bom projeto trava essa alocação por um período (meses ou anos), liberando aos poucos. Isso alinha o incentivo da equipe com o sucesso de longo prazo do projeto, em vez de permitir uma venda em massa logo após o lançamento.\n\nUtilidade real: o que o token faz, além de ser negociado? Dá direito a algo (governança, taxa reduzida, acesso a um serviço), ou existe só para ser especulado? Nenhum desses três pontos garante sucesso — mas a ausência deles (supply concentrado, sem vesting, sem utilidade clara) é um padrão que se repete em projetos que não duram.`,
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
            diagramKey: 'dao-governance-flow',
            quiz: {
              question: 'Numa DAO com governança por token, o que normalmente determina o peso do voto de um participante?',
              options: [
                'O tempo de conta na comunidade',
                'A quantidade de tokens de governança que ele possui',
                'Um voto por pessoa, como numa eleição tradicional',
                'A aprovação de um administrador central',
              ],
              correct: 1,
              explanation: 'Na maioria dos modelos de governança on-chain, o poder de voto é proporcional à quantidade de tokens detidos — o que também é uma crítica comum ao modelo (concentração de poder em quem tem mais capital).',
            },
            content: `Uma DAO (Organização Autônoma Descentralizada) é uma estrutura em que decisões coletivas — sobre um protocolo, um fundo, ou um projeto — são tomadas por voto de detentores de um token de governança, em vez de por uma diretoria tradicional.\n\nO fluxo típico é: alguém com tokens suficientes submete uma proposta (mudar um parâmetro do protocolo, alocar fundos de um tesouro, etc.); a comunidade vota durante um período determinado, geralmente com peso de voto proporcional à quantidade de tokens; se aprovada, a execução pode ser automática via contrato inteligente, ou depender de uma equipe designada para implementar.\n\nEssa estrutura tenta resolver um problema real: como coordenar decisões num grupo grande e distribuído globalmente, sem uma hierarquia formal — mas ela cria seus próprios desafios de coordenação, discutidos na próxima lição.`,
          },
          {
            id: 'les-nt-2-2',
            title: 'Limites reais da descentralização',
            durationMin: 7,
            content: `Na teoria, uma DAO distribui poder de decisão amplamente. Na prática, três problemas recorrentes aparecem na maioria das DAOs reais.\n\nConcentração de voto: como o peso do voto costuma ser proporcional à quantidade de tokens, detentores grandes ("baleias") — que podem incluir os próprios fundadores, investidores iniciais ou fundos — têm influência desproporcional sobre qualquer decisão, mesmo que tecnicamente qualquer holder pudesse votar.\n\nParticipação baixa: a maioria dos detentores de token de governança nunca vota, seja por falta de tempo, de interesse, ou de entendimento técnico da proposta — o que amplifica ainda mais o peso relativo de quem participa ativamente.\n\nAmbiguidade legal: quem responde legalmente pelas decisões de uma DAO — pelos danos causados por uma proposta aprovada, por exemplo — ainda é uma área cinzenta na maioria das jurisdições, incluindo o Brasil. Alguns países começaram a criar estruturas legais específicas para DAOs, mas isso está longe de ser padrão global.\n\nNenhum desses problemas invalida o conceito, mas eles significam que "é uma DAO" não é sinônimo automático de "é justo" ou "é descentralizado de fato" — vale sempre olhar a distribuição real de tokens antes de assumir isso.`,
          },
          {
            id: 'les-nt-2-3',
            title: 'O tesouro (treasury) de uma DAO',
            durationMin: 6,
            content: `Muitas DAOs administram um tesouro coletivo — um fundo, geralmente formado por tokens do próprio projeto mais outros ativos (stablecoins, ETH), guardado num contrato inteligente e movimentado só por decisão de governança aprovada.\n\nEsse tesouro paga por desenvolvimento contínuo, auditorias de segurança, programas de recompensa para quem encontra falhas (bug bounties) e, em alguns casos, distribuições para os próprios detentores do token. O tamanho e a transparência do tesouro são informações públicas em qualquer DAO on-chain de verdade — dá para conferir diretamente no explorador de blockchain quanto existe e para onde já foi.\n\nO ponto de atenção prático: um tesouro grande, mas concentrado em token do próprio projeto (em vez de ativos diversificados), vale muito menos do que parece em cenário de queda de preço — porque o valor do tesouro cai junto com o token que ele deveria sustentar, exatamente no momento em que mais precisaria de recursos estáveis para agir.`,
          },
        ],
      },
      {
        id: 'mod-nt-3',
        title: 'Riscos específicos de tokens e DAOs',
        lessons: [
          {
            id: 'les-nt-3-1',
            title: 'Ataques de governança',
            durationMin: 7,
            content: `Se o poder de voto é proporcional a tokens, e esses tokens podem ser adquiridos temporariamente, surge um vetor de ataque real: o "empréstimo instantâneo" (flash loan) permite tomar emprestado um volume enorme de tokens sem garantia, desde que devolvido dentro da mesma transação — tempo suficiente, em alguns protocolos mal desenhados, para votar numa proposta maliciosa antes de devolver o empréstimo.\n\nJá houve casos documentados de protocolos DeFi que perderam fundos exatamente dessa forma: alguém tomou emprestado tokens de governança suficientes para aprovar sozinho uma proposta que redirecionava fundos do tesouro para a própria carteira, tudo dentro de poucos segundos.\n\nProtocolos mais maduros se defendem com mecanismos como período de espera entre votação e execução (dando tempo para a comunidade reagir a uma proposta suspeita) e exigência de que os tokens de voto fiquem travados por um tempo antes de contar como peso de voto, não apenas detidos no momento exato da votação. A existência desses mecanismos de defesa — ou a ausência deles — é algo que dá para verificar na documentação técnica de qualquer DAO antes de confiar nela com fundos relevantes.`,
          },
          {
            id: 'les-nt-3-2',
            title: 'Sinais de alerta num projeto de token',
            durationMin: 6,
            quiz: {
              question: 'Qual combinação de sinais é a mais preocupante ao avaliar um novo projeto de token?',
              options: [
                'Equipe pública com histórico verificável, mas sem marketing agressivo',
                'Equipe anônima, grande alocação sem vesting, e promessas de valorização garantida',
                'Token com utilidade clara, mas preço ainda baixo',
                'Projeto auditado por empresa de segurança independente',
              ],
              correct: 1,
              explanation: 'Nenhum sinal isolado é definitivo, mas a combinação de equipe anônima, tokens da equipe sem trava de venda, e promessa de retorno garantido é o padrão mais recorrente em projetos que terminam mal.',
            },
            content: `Juntando os conceitos deste módulo, alguns sinais de alerta se repetem com frequência alta o bastante para merecer desconfiar por padrão, não caso a caso: equipe totalmente anônima sem nenhum histórico profissional verificável publicamente; grande parte do supply nas mãos da equipe sem vesting; roadmap cheio de promessas grandiosas e vago sobre como tecnicamente serão entregues; ênfase do marketing em "quanto vai valorizar" em vez de "o que o token faz".\n\nNenhum desses pontos, isolado, condena um projeto — muitos projetos legítimos têm equipes que preferem privacidade por motivos razoáveis, por exemplo. O que importa é a combinação: quanto mais sinais de alerta se acumulam no mesmo projeto, menor deveria ser a disposição de colocar dinheiro nele, e menor ainda deveria ser o percentual do seu capital total exposto a ele — o mesmo princípio de dimensionamento de posição que aparece no curso de Stablecoins e Gestão de Risco se aplica aqui com ainda mais força.`,
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
            diagramKey: 'stablecoin-models',
            quiz: {
              question: 'Qual é o principal risco de uma stablecoin lastreada em dólar, mesmo mantendo a paridade de $1 no dia a dia?',
              options: [
                'Confiar que a emissora realmente mantém a reserva integral e vai honrar o resgate',
                'O preço variar mais que o Bitcoin',
                'Não poder ser negociada em nenhuma exchange',
                'Ser automaticamente mais segura que qualquer outro ativo',
              ],
              correct: 0,
              explanation: 'O risco central é institucional, não de mercado: você está confiando que a empresa emissora realmente guarda a reserva prometida e vai honrar resgates, inclusive em cenário de estresse.',
            },
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
          {
            id: 'les-sr-2-3',
            title: 'Stop loss: proteção real e armadilhas',
            durationMin: 6,
            quiz: {
              question: 'Qual é uma limitação real de uma ordem de stop loss que todo investidor deveria conhecer antes de confiar nela cegamente?',
              options: [
                'Ela garante que você nunca vai perder dinheiro',
                'Em movimentos muito rápidos e voláteis, o preço de execução pode ficar bem abaixo do preço de disparo definido (slippage)',
                'Ela só funciona em ações, não em cripto',
                'Ela impede automaticamente qualquer taxa de corretagem',
              ],
              correct: 1,
              explanation: 'Um stop loss dispara uma ordem de venda quando o preço atinge determinado nível, mas não garante o preço de execução — em quedas rápidas e voláteis (comuns em cripto), o preço real de venda pode ser bem pior que o nível definido.',
            },
            content: `Stop loss é uma ordem programada para vender automaticamente um ativo se o preço cair até um nível definido antecipadamente — uma ferramenta de disciplina, pensada para limitar perda numa posição sem exigir que você fique olhando o mercado o tempo todo.\n\nA armadilha menos discutida: stop loss não garante o preço de saída, garante apenas o disparo da ordem. Em quedas rápidas e voláteis — comuns em cripto, onde movimentos de dois dígitos percentuais num único dia não são raros — o preço real de execução pode ficar significativamente abaixo do nível que você definiu, fenômeno chamado de slippage (deslizamento).\n\nOutra armadilha comportamental: colocar o stop loss num nível "óbvio" (um número redondo, ou logo abaixo de um suporte visualmente claro no gráfico) é exatamente onde muitos outros participantes também colocam o deles — criando concentração de ordens de venda naquele ponto, que pode acentuar a própria queda que o stop tentava evitar. Nenhuma dessas limitações significa "não use stop loss" — significa que ele é uma ferramenta de gestão de risco, não uma garantia absoluta de proteção.`,
          },
          {
            id: 'les-sr-2-4',
            title: 'Rebalanceamento: disciplina, não previsão',
            durationMin: 6,
            content: `Rebalancear um portfólio significa ajustar periodicamente as posições para voltar a uma alocação-alvo definida previamente — por exemplo, "60% em Bitcoin, 40% no restante" — vendendo um pouco do que subiu mais e comprando um pouco do que ficou para trás, para restaurar essa proporção original.\n\nA lógica por trás disso não depende de prever o futuro: se um ativo cresceu muito e passou a representar uma fatia maior do portfólio do que o planejado, rebalancear reduz automaticamente a exposição a ele — disciplinando o instinto comum de "deixar rodar" justamente o ativo que já ficou mais concentrado e, por isso, mais arriscado para o portfólio como um todo.\n\nRebalancear com frequência exagerada gera custos de transação e possíveis eventos tributáveis sem benefício proporcional; rebalancear raramente demais deixa a alocação real se distanciar bastante da planejada. Um ponto de partida comum usado por gestores de portfólio é revisar em intervalos fixos (trimestral, por exemplo) ou quando algum ativo se desvia além de um limite predefinido (como 10 pontos percentuais da alocação-alvo) — não como reação a notícia ou movimento de preço do dia.`,
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
            diagramKey: 'scam-anatomy',
            quiz: {
              question: 'Qual é o sinal de alerta mais confiável do golpe conhecido como "pig butchering"?',
              options: [
                'Um anúncio pop-up oferecendo um airdrop gratuito',
                'Alguém conhecido recentemente online sugerir, após ganhar confiança pessoal, investir juntos numa plataforma específica',
                'Um e-mail de uma exchange conhecida pedindo verificação de conta',
                'Um projeto com equipe totalmente pública e auditada',
              ],
              correct: 1,
              explanation: 'O padrão característico é a construção deliberada de uma conexão emocional antes de introduzir o "investimento" — o vínculo pessoal é o que reduz a desconfiança da vítima.',
            },
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
  {
    id: 'bitcoin-rede-e-halving',
    title: 'Bitcoin: Rede, Mineração e Halving',
    summary: 'Como o Bitcoin funciona por dentro — escassez programada, mineração, segurança da rede e o que os dados realmente mostram sobre ele como reserva de valor.',
    level: 'intermediario',
    category: 'Bitcoin',
    modules: [
      {
        id: 'mod-btc-1',
        title: 'Como o Bitcoin realmente funciona',
        lessons: [
          {
            id: 'les-btc-1-1',
            title: 'A escassez programada de 21 milhões',
            durationMin: 7,
            content: `O Bitcoin tem um limite máximo de emissão fixado no próprio protocolo: nunca vão existir mais de 21 milhões de unidades. Esse número não é uma meta ou uma promessa de marketing — é uma regra matemática que qualquer nó da rede pode verificar de forma independente, e que só mudaria se a esmagadora maioria da rede concordasse em alterar o protocolo, algo que nunca aconteceu com essa regra específica.\n\nA emissão de novos bitcoins acontece através da mineração, como recompensa paga a quem processa blocos de transações. Essa recompensa começou em 50 BTC por bloco em 2009 e vem sendo cortada pela metade periodicamente, num evento chamado halving — por isso a emissão total se aproxima de 21 milhões de forma decrescente, sem nunca ultrapassar o limite.\n\nEssa escassez é frequentemente comparada a metais preciosos como o ouro, mas com uma diferença importante: a escassez do Bitcoin é verificável matematicamente por qualquer pessoa com um nó completo, enquanto a escassez real de reservas de ouro depende de estimativas geológicas e de confiança em quem reporta essas estimativas.\n\nÉ importante separar dois fatos: escassez programada é uma característica técnica real e verificável; ela não é, sozinha, uma garantia de valorização futura. Um ativo pode ser escasso e ainda assim perder valor de mercado, se a demanda por ele cair.`,
          },
          {
            id: 'les-btc-1-2',
            title: 'O que é mineração, de verdade',
            durationMin: 8,
            diagramKey: 'pow-vs-pos',
            quiz: {
              question: 'Por que não existe um atalho matemático conhecido para minerar um bloco de Bitcoin mais rápido?',
              options: [
                'Porque encontrar o nonce válido exige tentativa e erro por força bruta, sem função inversa conhecida',
                'Porque o algoritmo muda a cada bloco',
                'Porque só empresas licenciadas podem minerar',
                'Porque existe, mas é segredo',
              ],
              correct: 0,
              explanation: 'Proof of Work depende de uma função hash: dado um hash-alvo, não existe forma conhecida de calcular diretamente qual entrada o produz — só testar valores (nonces) até acertar por sorte estatística.',
            },
            content: `Minerar Bitcoin não é "resolver um problema matemático útil" no sentido de pesquisa científica — é competir para ser o primeiro a encontrar um número (chamado nonce) que, combinado com os dados do bloco, produza um hash abaixo de um valor-alvo definido pela rede. Esse processo, chamado Proof of Work, só pode ser feito por tentativa e erro: não existe atalho matemático conhecido, só poder de processamento.\n\nQuem encontra esse número primeiro propõe o próximo bloco à rede e recebe a recompensa: os bitcoins recém-emitidos mais as taxas de todas as transações incluídas naquele bloco. Todos os outros mineradores descartam o trabalho que estavam fazendo e recomeçam a competição para o bloco seguinte.\n\nEsse gasto de energia real e verificável é, propositalmente, o que torna caro forjar o histórico da rede: para reescrever um bloco antigo, seria preciso refazer todo esse trabalho computacional mais rápido do que o resto da rede consegue produzir novos blocos legítimos — algo economicamente inviável numa rede do tamanho do Bitcoin hoje.\n\nA dificuldade do problema se ajusta automaticamente a cada 2016 blocos (cerca de duas semanas) para manter o tempo médio entre blocos perto de 10 minutos, independentemente de quanto poder computacional total a rede tenha naquele momento.`,
          },
          {
            id: 'les-btc-1-3',
            title: 'Halving: por que acontece e o que muda',
            durationMin: 7,
            content: `A cada 210.000 blocos minerados — aproximadamente a cada quatro anos — a recompensa por bloco é cortada pela metade: de 50 para 25, depois 12,5, depois 6,25, e assim por diante, até eventualmente chegar a zero, por volta do ano 2140.\n\nO efeito direto e imediato do halving é reduzir a taxa de novos bitcoins entrando em circulação a cada dia. O efeito sobre o preço de mercado é bem mais incerto do que costuma ser apresentado: reduzir a oferta nova só pressiona o preço para cima se a demanda se mantiver constante ou crescer — algo que não é garantido, e que depende de fatores completamente alheios ao protocolo, como cenário macroeconômico, regulação e sentimento geral de mercado.\n\nHistoricamente, os halvings anteriores foram seguidos por períodos de valorização significativa, mas também por quedas expressivas meses depois — e quatro eventos históricos não são uma amostra estatística grande o suficiente para tratar esse padrão como uma lei confiável. Tratar "o halving vai fazer o preço subir" como uma certeza é um raciocínio mais próximo de superstição de mercado do que de análise financeira.\n\nUm efeito colateral real e menos discutido: quando a recompensa em bitcoins cai, a receita dos mineradores cai junto (a menos que o preço suba o suficiente para compensar), o que pode forçar operações menos eficientes a desligar equipamentos — reduzindo temporariamente o hash rate total da rede até a dificuldade se reajustar.`,
          },
        ],
      },
      {
        id: 'mod-btc-2',
        title: 'Rede e segurança',
        lessons: [
          {
            id: 'les-btc-2-1',
            title: 'Hash rate: a métrica de segurança da rede',
            durationMin: 6,
            content: `Hash rate é a soma de todo o poder computacional dedicado a minerar Bitcoin em um dado momento, medido em tentativas de hash por segundo. Quanto maior o hash rate total, mais caro e difícil fica para qualquer entidade única acumular poder computacional suficiente para atacar a rede.\n\nO cenário de risco mais discutido é o chamado "ataque de 51%": se uma única entidade (ou um grupo coordenado) controlar mais da metade do hash rate total, ela ganha a capacidade de, em teoria, reverter suas próprias transações recentes ou impedir que transações de terceiros sejam confirmadas — mas mesmo nesse cenário extremo, ela não consegue criar bitcoins do nada, nem roubar fundos de carteiras que não controla, nem alterar transações já profundamente enterradas no histórico.\n\nNo tamanho atual da rede Bitcoin, acumular hash rate suficiente para um ataque de 51% exigiria um investimento em hardware e energia elétrica na casa de bilhões de dólares, além da dificuldade logística de adquirir esse hardware sem ser notado — o que torna esse ataque uma possibilidade teórica remota, não uma ameaça prática atual, embora a matemática por trás dele seja real.`,
          },
          {
            id: 'les-btc-2-2',
            title: 'Nó completo vs. minerador: papéis diferentes',
            durationMin: 6,
            content: `É comum confundir os dois papéis, mas eles são distintos. Um nó completo (full node) baixa e verifica de forma independente todo o histórico de transações da blockchain, checando que cada bloco e cada transação segue as regras do protocolo — qualquer pessoa pode rodar um em um computador comum, sem hardware especializado.\n\nJá o minerador é quem compete para produzir novos blocos, usando hardware especializado (ASICs, hoje em dia) e consumo de energia elevado. Um minerador também roda um nó completo por trás, mas a atividade de "propor blocos" é uma camada adicional além de apenas verificar o histórico.\n\nEsse desenho é o que garante que o poder de decidir as regras do protocolo não fica concentrado só em quem tem mais hardware: se os mineradores tentassem produzir blocos que quebrassem as regras, os nós completos — inclusive os rodados por usuários comuns, exchanges e desenvolvedores — simplesmente rejeitariam esses blocos como inválidos, tornando o esforço de mineração inútil. É essa rejeição descentralizada, e não apenas o hash rate, que efetivamente define as regras que valem.`,
          },
          {
            id: 'les-btc-2-3',
            title: 'Lightning Network: pagamentos instantâneos por fora da camada principal',
            durationMin: 7,
            content: `A blockchain principal do Bitcoin processa, na prática, algumas transações por segundo — suficiente para liquidação de valor com alta segurança, mas inadequado para usar como meio de pagamento do dia a dia em grande escala, como comprar um café. A Lightning Network foi criada para resolver esse gargalo sem alterar as regras da camada principal.\n\nO funcionamento básico: duas partes abrem um "canal de pagamento" registrando uma transação na blockchain principal, depositando fundos nele. A partir daí, elas podem trocar qualquer quantidade de pagamentos entre si instantaneamente e com taxas mínimas, sem registrar cada transação individual na blockchain — apenas a abertura e o fechamento do canal ficam registrados on-chain.\n\nCanais podem ser conectados entre si, formando uma rede: você pode pagar alguém com quem nunca abriu um canal diretamente, desde que exista um caminho de canais conectados entre vocês, com o pagamento sendo roteado automaticamente por esse caminho.\n\nO trade-off é real: para receber pagamentos pela Lightning, é preciso ter liquidez travada no canal, a gestão de canais tem complexidade técnica maior que uma transação on-chain simples, e a rede ainda é mais nova e menos testada em escala do que a camada principal — não é uma tecnologia livre de riscos ou de curva de aprendizado.`,
          },
        ],
      },
      {
        id: 'mod-btc-3',
        title: 'Bitcoin como reserva de valor',
        lessons: [
          {
            id: 'les-btc-3-1',
            title: 'Volatilidade e ciclos: o que os dados históricos mostram (e não mostram)',
            durationMin: 7,
            content: `O histórico de preço do Bitcoin mostra ciclos de valorização extrema seguidos de quedas de 70% a 80% do topo — isso não é uma exceção rara, é um padrão que se repetiu em múltiplos ciclos ao longo da história do ativo. Qualquer análise que ignore essa volatilidade característica está incompleta.\n\nEsses ciclos são frequentemente associados aos halvings, mas também coincidem com mudanças no cenário macroeconômico global (taxas de juros, liquidez em dólar, apetite geral por risco), o que torna difícil isolar uma única causa para qualquer movimento específico de preço.\n\nA volatilidade histórica alta não significa que o padrão vá necessariamente se repetir da mesma forma no futuro — mercados evoluem, a base de investidores institucionais mudou significativamente nos últimos anos, e eventos passados não são garantia estatística de eventos futuros. Qualquer projeção de preço que ignore essa incerteza fundamental deve ser tratada com ceticismo, venha ela de onde vier.`,
          },
          {
            id: 'les-btc-3-2',
            title: 'Dollar-Cost Averaging sem promessas de retorno',
            durationMin: 6,
            content: `Dollar-Cost Averaging (DCA) é a estratégia de investir um valor fixo em intervalos regulares (semanal, mensal), independentemente do preço no momento, em vez de tentar acertar o momento "ideal" de comprar tudo de uma vez.\n\nA vantagem prática do DCA não é matemática — em retrospecto, comprar tudo no ponto mais baixo sempre teria rendido mais — a vantagem é comportamental: ele remove a necessidade (e a tentação, quase sempre mal-sucedida) de prever o fundo do mercado, e reduz o impacto emocional de ver o preço cair logo após um aporte único grande.\n\nDCA não elimina o risco de perda: se o ativo perder valor de forma sustentada e prolongada, uma estratégia de DCA também perde dinheiro, só que de forma mais gradual e psicologicamente mais suportável do que um aporte único no pior momento possível. Nenhuma estratégia de entrada, por si só, torna um ativo de risco elevado em um ativo seguro.`,
          },
          {
            id: 'les-btc-3-3',
            title: 'Autocustódia: por que "not your keys, not your coins" também vale pro Bitcoin',
            durationMin: 6,
            diagramKey: 'custody-spectrum',
            quiz: {
              question: 'Historicamente, as maiores perdas de Bitcoin por usuários comuns vieram principalmente de:',
              options: [
                'Falhas no protocolo Proof of Work do Bitcoin',
                'Falências, hacks ou fraudes de exchanges centralizadas onde os fundos estavam depositados',
                'Ataques de 51% bem-sucedidos contra a rede',
                'Erros no algoritmo de halving',
              ],
              correct: 1,
              explanation: 'O mecanismo central do Bitcoin nunca foi comprometido — as grandes perdas históricas vieram de custódia de terceiros (exchanges) falhando, não do protocolo em si.',
            },
            content: `Tudo que foi coberto no curso de Carteiras e Segurança sobre custódia se aplica integralmente ao Bitcoin, e vale reforçar aqui pelo tamanho do valor tipicamente envolvido: manter Bitcoin numa exchange significa que você tem um direito contratual sobre um saldo, não a posse direta do ativo — a exchange é quem efetivamente controla as chaves privadas.\n\nHistoricamente, algumas das maiores perdas de Bitcoin por usuários comuns não vieram de falhas do protocolo (que nunca foi comprometido em seu mecanismo central), e sim de falências, hacks ou fraudes de exchanges centralizadas onde os fundos estavam depositados.\n\nPara quantias que você pretende manter por longo prazo, mover para uma carteira própria (hardware wallet, para valores maiores) onde só você controla a chave privada elimina esse risco de contraparte específico — trocando-o pelo risco, também real, de você mesmo perder ou expor essa chave. A escolha entre os dois riscos deve ser deliberada, não por omissão.`,
          },
        ],
      },
    ],
  },
  {
    id: 'trading-e-gestao-de-risco',
    title: 'Trading e Gestão de Risco',
    summary: 'Por que a maioria perde dinheiro operando, o que a análise técnica realmente prevê, e as regras de gestão de risco que separam sobreviver de quebrar a conta.',
    level: 'intermediario',
    category: 'Trading',
    modules: [
      {
        id: 'mod-tr-1',
        title: 'Antes de operar',
        lessons: [
          {
            id: 'les-tr-0-1',
            title: 'Pratique no Simulador de Trade (antes de arriscar dinheiro de verdade)',
            durationMin: 4,
            content: `Antes de entrar na teoria, vale conhecer o Simulador de Trade da plataforma — uma ferramenta que roda, ao vivo e com dados reais da OKX, exatamente a mesma estratégia quantitativa usada como exemplo neste curso. O saldo é 100% fictício; o comportamento do mercado é 100% real.\n\nO objetivo não é te mostrar um jeito de ganhar dinheiro. É o oposto: mostrar, com números reais e atualizados, o que de fato acontece quando uma estratégia baseada em indicadores técnicos (RSI, MACD, Bollinger Bands, médias móveis) enfrenta o mercado de verdade, depois de descontar taxa e slippage — os custos que a maioria do conteúdo sobre trading finge que não existem.\n\nHistoricamente, em backtests dessa mesma estratégia, o resultado líquido ficou perto de zero ou negativo na maior parte das janelas testadas — não porque a lógica seja mal implementada, mas porque bater o mercado de forma consistente é genuinamente difícil, mesmo com regras claras e disciplina perfeita (a disciplina perfeita, aliás, é fácil de simular e difícil de manter com dinheiro de verdade).\n\nUse o simulador para observar o comportamento do mercado em tempo real, testar backtests com períodos diferentes e conversar com o analista de IA sobre por que cada trade foi aberto ou fechado. Ele fica disponível, para qualquer conta logada, no menu principal em "Simulador".`,
          },
          {
            id: 'les-tr-1-1',
            title: 'Investir, especular e apostar: diferenças que importam',
            durationMin: 6,
            content: `Investir, especular e apostar não são sinônimos, mesmo que na prática envolvam colocar dinheiro em algo incerto. Investir geralmente significa alocar capital com expectativa de retorno baseada em algum fundamento (fluxo de caixa, utilidade real, crescimento de rede), com um horizonte de tempo longo o suficiente para esse fundamento se realizar.\n\nEspecular é apostar em movimento de preço no curto prazo, frequentemente sem relação direta com fundamentos — o especulador está tentando prever o comportamento de outros participantes do mercado, não o valor "real" do ativo. Especular não é imoral nem irracional por definição, mas é um jogo estatisticamente mais difícil do que costuma parecer, especialmente contra participantes mais experientes ou com mais informação.\n\nApostar, no sentido estrito, é colocar dinheiro num resultado de probabilidade conhecida e desfavorável no agregado (como um cassino). A linha entre "especular" e "apostar" fica perigosamente tênue quando alguém opera sem nenhuma estratégia, sem gestão de risco e movido inteiramente por impulso — nesse ponto, a diferença prática desaparece.`,
          },
          {
            id: 'les-tr-1-2',
            title: 'Por que a maioria de quem opera perde dinheiro',
            durationMin: 7,
            content: `Estudos e dados divulgados por corretoras (que são obrigadas, em algumas jurisdições, a publicar essas estatísticas para produtos alavancados) mostram consistentemente que a maioria das contas de varejo que operam ativamente perde dinheiro no longo prazo — em muitos levantamentos, a proporção fica entre 70% e 90% das contas.\n\nAs razões mais comuns não são "falta de uma dica boa": são custos de transação e spread que corroem lucros pequenos e frequentes, ausência de gestão de risco (posições grandes demais, sem stop-loss), viés de confirmação (buscar só informação que confirma a posição que já se tem) e comportamento reativo a notícias e movimentos de curto prazo, que tende a levar a comprar caro por euforia e vender barato por pânico.\n\nIsso não significa que seja impossível operar de forma lucrativa e consistente — existem traders profissionais que o fazem — mas significa que fazer isso de forma sustentável exige disciplina, gestão de risco rigorosa e realismo sobre taxas de acerto, não sorte ou uma estratégia secreta infalível. Qualquer pessoa vendendo um método "sem erro" para operar está, no mínimo, sendo imprecisa.`,
          },
          {
            id: 'les-tr-1-3',
            title: 'Spot, margem e derivativos: o que muda no risco',
            durationMin: 7,
            content: `Operar no mercado à vista (spot) significa comprar e vender o ativo real, com seu próprio capital — a perda máxima possível é limitada a 100% do que você investiu, se o ativo for a zero.\n\nOperar com margem significa emprestar capital adicional (da própria corretora, tipicamente) para abrir uma posição maior do que seu capital próprio permitiria — isso amplifica tanto ganhos quanto perdas proporcionalmente, e pode gerar uma dívida além do capital inicial investido caso a posição se mova contra você antes de ser liquidada.\n\nDerivativos como contratos futuros e perpétuos alavancados levam essa amplificação ainda mais longe: alavancagens de 10x, 50x ou até mais são oferecidas em algumas plataformas, o que significa que um movimento de preço de apenas 2% a 10% contra a posição pode ser suficiente para liquidar (zerar) toda a margem colocada, dependendo da alavancagem escolhida.\n\nQuanto maior a alavancagem, menor a margem de erro tolerável — não existe alavancagem "segura" no sentido absoluto, existe alavancagem compatível ou incompatível com o tamanho da posição e com a sua tolerância real a perdas rápidas e totais.`,
          },
        ],
      },
      {
        id: 'mod-tr-2',
        title: 'Ferramentas de análise',
        lessons: [
          {
            id: 'les-tr-2-1',
            title: 'Análise técnica: o que ela pode e não pode prever',
            durationMin: 7,
            content: `Análise técnica é o estudo do histórico de preço e volume de um ativo para tentar identificar padrões que se repetem e informar decisões de entrada e saída. Ela parte da premissa de que o comportamento coletivo de compradores e vendedores deixa rastros reconhecíveis no gráfico.\n\nO que ela pode oferecer, de forma realista: um framework estruturado para definir pontos de entrada, saída e stop-loss, e uma linguagem comum para descrever tendências e níveis de preço relevantes onde historicamente houve reação de compra ou venda.\n\nO que ela não pode oferecer, apesar de como às vezes é vendida: previsão garantida de movimentos futuros. Padrões técnicos são probabilísticos, não determinísticos — o mesmo padrão que "funcionou" em um caso histórico falha em muitos outros, e não existe validação estatística robusta e amplamente aceita de que qualquer padrão específico tenha uma taxa de acerto consistentemente alta o suficiente para ser usado isoladamente, sem gestão de risco.\n\nTratar análise técnica como um sistema de previsão infalível é o erro mais comum de quem está começando — o uso mais honesto dela é como uma ferramenta de estruturação de risco, não de adivinhação.`,
          },
          {
            id: 'les-tr-2-2',
            title: 'Indicadores básicos sem misticismo: médias móveis e RSI',
            durationMin: 6,
            content: `Uma média móvel é simplesmente a média do preço de um ativo ao longo de um número definido de períodos (por exemplo, 50 ou 200 dias), recalculada continuamente. Ela suaviza o ruído de curto prazo do preço, ajudando a visualizar a direção geral de uma tendência — mas, por definição, ela reage ao que já aconteceu, não ao que vai acontecer.\n\nO RSI (Índice de Força Relativa) mede a velocidade e magnitude de movimentos recentes de preço numa escala de 0 a 100, sendo tradicionalmente interpretado como "sobrecomprado" acima de 70 e "sobrevendido" abaixo de 30. Esses limiares são convenções amplamente usadas, não leis físicas — um ativo em tendência forte pode permanecer "sobrecomprado" por muito tempo antes de qualquer correção.\n\nAmbos os indicadores são derivados matematicamente do próprio preço — eles não trazem nenhuma informação nova que não estivesse já, de alguma forma, no gráfico de preço original. Eles ajudam a organizar a leitura visual, não substituem a necessidade de gestão de risco.`,
          },
          {
            id: 'les-tr-2-3',
            title: 'Liquidez e slippage: o preço que você vê não é o preço que você paga',
            durationMin: 7,
            diagramKey: 'market-metrics',
            quiz: {
              question: 'Se você precisa vender uma posição grande rapidamente, o que mais afeta o preço médio que você vai realmente receber?',
              options: [
                'A cor do gráfico de preço',
                'A liquidez disponível perto do preço atual (profundidade do livro de ofertas)',
                'O horário do dia em que a bolsa fecha',
                'O nome da exchange, independente do volume negociado',
              ],
              correct: 1,
              explanation: 'Quanto menos liquidez disponível perto do preço exibido, mais sua ordem grande vai "consumir" ofertas piores, aumentando o slippage — o preço médio real fica pior que o preço marginal exibido.',
            },
            content: `O preço exibido numa exchange geralmente reflete a última transação executada — não necessariamente o preço pelo qual você conseguirá comprar ou vender uma quantidade específica agora. Slippage é a diferença entre o preço esperado e o preço efetivamente executado.\n\nEm ativos com baixa liquidez (pouco volume de compra e venda disponível perto do preço atual), uma ordem de tamanho moderado pode "consumir" várias camadas de ofertas de preço no livro de ofertas, resultando numa execução média bem pior do que o preço que estava sendo exibido antes da ordem.\n\nIsso é especialmente relevante em tokens de baixa capitalização de mercado: o preço marginal (o de uma transação pequena) pode estar muito distante do preço que você conseguiria realmente obter para uma posição de tamanho relevante — tanto na compra quanto, principalmente, na saída, quando você mais precisa de liquidez disponível.\n\nAntes de assumir uma posição, vale considerar não só "esse ativo pode subir", mas "se eu precisar sair rápido, existe liquidez suficiente para eu sair sem um deslizamento de preço que destrua o ganho esperado?".`,
          },
        ],
      },
      {
        id: 'mod-tr-3',
        title: 'Gestão de risco de verdade',
        lessons: [
          {
            id: 'les-tr-3-1',
            title: 'Tamanho de posição e stop-loss: as duas variáveis que você controla',
            durationMin: 7,
            content: `Você não controla se um trade vai dar certo. Você controla, com precisão, duas coisas: quanto capital arrisca em cada operação, e em que ponto de perda você sai automaticamente se estiver errado.\n\nUma prática amplamente usada por gestores de risco profissionais é limitar o risco de qualquer operação individual a uma fração pequena do capital total disponível para operar — frequentemente entre 0,5% e 2% por operação — de forma que uma sequência de várias operações perdedoras seguidas (que vai acontecer, mesmo com uma boa estratégia) não seja capaz de comprometer a capacidade de continuar operando.\n\nO stop-loss é a ordem que fecha automaticamente a posição se o preço atingir um nível predefinido de perda aceitável, definido antes de entrar na operação — não depois, quando a perda já está maior do que o planejado e o vínculo emocional com a posição já distorce o julgamento.\n\nEssas duas variáveis, combinadas, definem matematicamente sua perda máxima possível numa operação — algo que a maioria de quem perde dinheiro operando nunca calculou explicitamente antes de entrar.`,
          },
          {
            id: 'les-tr-3-2',
            title: 'O erro clássico: aumentar uma posição perdedora',
            durationMin: 6,
            content: `Aumentar uma posição perdedora esperando que o preço "volte" — às vezes chamado de "fazer preço médio para baixo" — é uma das formas mais consistentes de transformar uma perda administrável numa perda catastrófica.\n\nA lógica que motiva essa decisão é psicologicamente compreensível: se o ativo estava bom no preço anterior, mais barato deveria ser ainda melhor. O problema é que essa lógica ignora a possibilidade real de que a tese original estava simplesmente errada, e que o preço pode continuar caindo por razões que não têm relação nenhuma com o quanto você já investiu nele.\n\nA diferença entre "adicionar a uma posição vencedora, dentro de um plano de gestão de risco pré-definido" e "aumentar uma posição perdedora por apego emocional ou negação" não está na ação em si, está em ter (ou não ter) decidido esse critério antes da operação começar, com a cabeça fria — e não durante o momento de maior desconforto financeiro, quando o julgamento tende a estar mais comprometido.`,
          },
          {
            id: 'les-tr-3-3',
            title: 'Psicologia: FOMO, revenge trading e disciplina',
            durationMin: 7,
            content: `FOMO ("fear of missing out", medo de ficar de fora) leva a entrar numa posição tarde demais, geralmente perto de um topo de curto prazo, motivado pelo desconforto de ver outras pessoas "ganhando" enquanto você fica de fora — não por uma análise própria do momento de entrada.\n\nRevenge trading é o padrão de, logo após uma perda, abrir uma nova posição maior e mais impulsiva na tentativa de "recuperar" rapidamente o que foi perdido — geralmente pulando por cima de toda a gestão de risco que seria seguida em condições normais, precisamente no momento em que o julgamento está mais comprometido pela frustração.\n\nAmbos os padrões têm a mesma raiz: decisões tomadas sob emoção intensa (euforia ou frustração) em vez de seguir um plano definido com a cabeça fria. A defesa mais eficaz e mais chata de implementar é também a mais simples: definir as regras de entrada, saída, tamanho de posição e stop-loss antes de abrir qualquer operação, e tratar o desvio dessas regras no calor do momento como uma falha de processo — não como uma exceção justificável "só dessa vez".\n\nQuem opera profissionalmente por muito tempo geralmente relata que a parte mais difícil não é encontrar boas oportunidades, é manter a disciplina de seguir o próprio plano quando a emoção do momento empurra na direção contrária.`,
          },
        ],
      },
    ],
  },
];

module.exports = { courses };

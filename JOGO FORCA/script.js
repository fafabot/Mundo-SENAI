/* ==========================================================================
   Forca do Conhecimento — lógica do jogo
   Organização:
     1. Banco de palavras (dados, separado da interface)
     2. Configurações (níveis, temas, regras)
     3. Utilidades (normalização de letras, armazenamento seguro)
     4. Sorteio de palavras
     5. Processamento de letras
     6. Desenho da forca
     7. Atualização da interface
     8. Resultado
     9. Troca de tema
    10. Eventos e inicialização
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. Banco de palavras
   O tamanho considera apenas letras (espaços e hífens não contam).
   Fácil: 4 a 6 letras · Médio: 7 a 9 letras · Difícil: 10 letras ou mais.
   ========================================================================== */
const WORD_BANK = {
  facil: [
    {
      palavra: "SOLDA",
      categoria: "Metalurgia",
      dica: "Une peças de metal com calor, formando um cordão resistente.",
      explicacao: "A solda é o material ou a junção obtida ao fundir metais para uni-los. É base de profissões como soldador e caldeireiro."
    },
    {
      palavra: "TORNO",
      categoria: "Mecânica",
      dica: "Máquina que gira a peça enquanto uma ferramenta retira material.",
      explicacao: "O torno é usado na usinagem para fabricar eixos, pinos e roscas com precisão, girando a peça contra uma ferramenta de corte."
    },
    {
      palavra: "FIAÇÃO",
      categoria: "Elétrica",
      dica: "Conjunto de condutores que leva energia aos pontos de uma instalação.",
      explicacao: "A fiação é o conjunto de fios e cabos de uma instalação elétrica. Precisa ser dimensionada e identificada conforme as normas técnicas."
    },
    {
      palavra: "TIJOLO",
      categoria: "Construção civil",
      dica: "Bloco de barro cozido usado para levantar paredes.",
      explicacao: "O tijolo é um dos elementos mais comuns da alvenaria. Pode ser maciço ou furado e é assentado com argamassa."
    },
    {
      palavra: "FORNO",
      categoria: "Alimentos",
      dica: "Equipamento de padarias e cozinhas industriais que assa massas.",
      explicacao: "O forno controla temperatura e tempo de cocção. Na panificação, o domínio do forno define a cor, a crosta e o miolo do pão."
    },
    {
      palavra: "MOLDE",
      categoria: "Plásticos e metalurgia",
      dica: "Cavidade que dá forma a um material derretido ou injetado.",
      explicacao: "O molde define o formato final de peças plásticas ou metálicas. É projetado e fabricado em ferramentarias com alta precisão."
    },
    {
      palavra: "REDE",
      categoria: "Informática",
      dica: "Interligação de computadores para trocar dados.",
      explicacao: "Uma rede de computadores conecta equipamentos por cabos ou sem fio. Profissionais de redes instalam, configuram e mantêm essa estrutura."
    },
    {
      palavra: "ROBÔ",
      categoria: "Automação",
      dica: "Máquina programável que executa tarefas repetitivas na linha de produção.",
      explicacao: "Robôs industriais realizam soldagem, pintura e montagem com rapidez e repetibilidade, sob programação de técnicos e engenheiros."
    },
    {
      palavra: "TINTA",
      categoria: "Construção civil",
      dica: "Produto aplicado em paredes para proteger e dar cor.",
      explicacao: "A tinta protege superfícies contra umidade e desgaste. O pintor escolhe o tipo adequado para cada base, como alvenaria, madeira ou metal."
    },
    {
      palavra: "TECIDO",
      categoria: "Têxtil e vestuário",
      dica: "Material formado pelo entrelaçamento de fios, matéria-prima das roupas.",
      explicacao: "O tecido é produzido em teares a partir de fios. Na área de vestuário, é cortado e costurado para criar peças de roupa."
    },
    {
      palavra: "CABO",
      categoria: "Elétrica",
      dica: "Condutor isolado, às vezes com vários fios, que transporta energia ou sinal.",
      explicacao: "O cabo elétrico possui isolação e, muitas vezes, cobertura extra. A bitola correta evita aquecimento e perdas na instalação."
    },
    {
      palavra: "CARGA",
      categoria: "Logística",
      dica: "Mercadoria transportada de um ponto a outro.",
      explicacao: "Na logística, a carga precisa ser embalada, identificada e acomodada corretamente para chegar ao destino com segurança."
    },
    {
      palavra: "LUVA",
      categoria: "Segurança do trabalho",
      dica: "Equipamento de proteção individual para as mãos.",
      explicacao: "A luva é um EPI que protege contra cortes, calor, produtos químicos ou choque elétrico, conforme o tipo de risco da atividade."
    },
    {
      palavra: "SERRA",
      categoria: "Marcenaria",
      dica: "Ferramenta com dentes usada para cortar madeira ou metal.",
      explicacao: "A serra pode ser manual ou elétrica, como a circular e a de fita. É essencial na marcenaria e exige atenção às normas de segurança."
    },
    {
      palavra: "MOTOR",
      categoria: "Mecânica automotiva",
      dica: "Transforma energia em movimento para fazer o veículo andar.",
      explicacao: "O motor converte energia química ou elétrica em movimento. Mecânicos diagnosticam e fazem a manutenção de seus componentes."
    },
    {
      palavra: "PRUMO",
      categoria: "Construção civil",
      dica: "Instrumento com peso na ponta de um fio para conferir a vertical.",
      explicacao: "O prumo verifica se paredes e pilares estão perfeitamente na vertical, garantindo qualidade e segurança na obra."
    },
    {
      palavra: "CÓDIGO",
      categoria: "Programação",
      dica: "Conjunto de instruções escritas para um computador executar.",
      explicacao: "O código-fonte é escrito em linguagens de programação. Desenvolvedores o criam, testam e mantêm para construir sistemas e aplicativos."
    },
    {
      palavra: "FREIO",
      categoria: "Mecânica automotiva",
      dica: "Sistema que reduz a velocidade ou para o veículo.",
      explicacao: "O sistema de freio usa atrito entre pastilhas e discos ou lonas e tambores. Sua manutenção é fundamental para a segurança no trânsito."
    },
    {
      palavra: "PALETE",
      categoria: "Logística",
      dica: "Estrado que facilita mover mercadorias com empilhadeira.",
      explicacao: "O palete padroniza a movimentação e a armazenagem de cargas, agilizando o carregamento de caminhões e a organização de armazéns."
    }
  ],

  medio: [
    {
      palavra: "MECÂNICA",
      categoria: "Mecânica",
      dica: "Área que estuda movimentos, forças e o funcionamento de máquinas.",
      explicacao: "A mecânica está presente na fabricação e manutenção de máquinas, veículos e equipamentos industriais."
    },
    {
      palavra: "LOGÍSTICA",
      categoria: "Logística",
      dica: "Planeja o fluxo de materiais, do fornecedor até o cliente.",
      explicacao: "A logística organiza compras, armazenagem, transporte e distribuição para que o produto certo chegue no prazo e com menor custo."
    },
    {
      palavra: "USINAGEM",
      categoria: "Metalmecânica",
      dica: "Processo que dá forma a peças retirando material em cavacos.",
      explicacao: "A usinagem utiliza tornos, fresadoras e centros CNC para produzir peças com medidas precisas a partir de blocos ou barras."
    },
    {
      palavra: "ALGORITMO",
      categoria: "Programação",
      dica: "Sequência lógica de passos para resolver um problema.",
      explicacao: "O algoritmo é a base de qualquer programa: descreve, passo a passo, como chegar a um resultado antes de escrever o código."
    },
    {
      palavra: "TORNEIRO",
      categoria: "Metalmecânica",
      dica: "Profissional que opera a máquina que gira a peça para usiná-la.",
      explicacao: "O torneiro mecânico interpreta desenhos técnicos e opera tornos convencionais ou CNC para fabricar peças cilíndricas."
    },
    {
      palavra: "PEDREIRO",
      categoria: "Construção civil",
      dica: "Profissional que levanta paredes, assenta blocos e faz reboco.",
      explicacao: "O pedreiro executa alvenarias, contrapisos e revestimentos, seguindo o projeto e as normas de segurança da obra."
    },
    {
      palavra: "ARMAZÉM",
      categoria: "Logística",
      dica: "Local onde as mercadorias são guardadas antes da distribuição.",
      explicacao: "O armazém organiza o estoque em endereços definidos, facilitando a separação de pedidos e o controle de entradas e saídas."
    },
    {
      palavra: "SOFTWARE",
      categoria: "Informática",
      dica: "Parte lógica do computador, formada por programas.",
      explicacao: "Software é o conjunto de programas que faz o equipamento funcionar, como sistemas operacionais, aplicativos e sistemas de gestão."
    },
    {
      palavra: "CALDEIRA",
      categoria: "Mecânica industrial",
      dica: "Equipamento que produz vapor sob pressão para a indústria.",
      explicacao: "A caldeira aquece água para gerar vapor usado em aquecimento e acionamento de máquinas. Sua operação exige treinamento e inspeções periódicas."
    },
    {
      palavra: "EXTINTOR",
      categoria: "Segurança do trabalho",
      dica: "Equipamento portátil para combater princípios de incêndio.",
      explicacao: "Cada extintor é indicado para uma classe de fogo. Conhecer o tipo correto e saber usá-lo faz parte da prevenção de incêndios."
    },
    {
      palavra: "MODELISTA",
      categoria: "Vestuário",
      dica: "Profissional que transforma o desenho de uma roupa em moldes.",
      explicacao: "O modelista interpreta o croqui do estilista e cria moldes em papel ou digitais, definindo medidas e caimento das peças."
    },
    {
      palavra: "ALVENARIA",
      categoria: "Construção civil",
      dica: "Técnica de erguer paredes com blocos unidos por argamassa.",
      explicacao: "A alvenaria pode ter função de vedação ou estrutural. A qualidade do assentamento influencia o prumo, o nível e a resistência da parede."
    },
    {
      palavra: "PADEIRO",
      categoria: "Alimentos",
      dica: "Profissional que prepara massas, controla a fermentação e assa pães.",
      explicacao: "O padeiro domina receitas, fermentação e forneamento, aplicando boas práticas de higiene na produção de alimentos."
    },
    {
      palavra: "SOLDAGEM",
      categoria: "Metalurgia",
      dica: "Processo de unir metais por fusão, com ou sem material de adição.",
      explicacao: "A soldagem é usada em estruturas, tubulações e veículos. Processos comuns incluem eletrodo revestido, MIG/MAG e TIG."
    },
    {
      palavra: "CIRCUITO",
      categoria: "Elétrica e eletrônica",
      dica: "Caminho fechado por onde a corrente elétrica percorre.",
      explicacao: "Um circuito reúne fonte, condutores e cargas. Pode ser simples, como o de uma lâmpada, ou complexo, como o de uma placa eletrônica."
    },
    {
      palavra: "EMBALAGEM",
      categoria: "Logística e alimentos",
      dica: "Protege o produto e informa o consumidor sobre ele.",
      explicacao: "A embalagem conserva, protege e identifica produtos. Na indústria de alimentos, também garante a segurança e o prazo de validade."
    },
    {
      palavra: "AUTOMAÇÃO",
      categoria: "Automação industrial",
      dica: "Uso de sensores, controladores e atuadores para que processos funcionem sozinhos.",
      explicacao: "A automação aumenta a produtividade e a segurança, usando CLPs, sensores e robôs para controlar máquinas e linhas de produção."
    }
  ],

  dificil: [
    {
      palavra: "ELETROTÉCNICA",
      categoria: "Elétrica",
      dica: "Área técnica que projeta e mantém sistemas de geração e distribuição de energia.",
      explicacao: "A eletrotécnica aplica a eletricidade em instalações prediais e industriais, motores, comandos elétricos e sistemas de energia."
    },
    {
      palavra: "MECATRÔNICA",
      categoria: "Automação industrial",
      dica: "Integra mecânica, eletrônica e computação em um só sistema.",
      explicacao: "A mecatrônica une diferentes áreas para criar e manter máquinas inteligentes, como robôs e linhas automatizadas."
    },
    {
      palavra: "ELETRICISTA",
      categoria: "Elétrica",
      dica: "Profissional que instala e conserta redes, tomadas e quadros de energia.",
      explicacao: "O eletricista executa instalações e manutenções elétricas seguindo normas técnicas e de segurança, como a NR-10."
    },
    {
      palavra: "PROGRAMADOR",
      categoria: "Tecnologia da informação",
      dica: "Profissional que escreve, testa e corrige instruções para computadores.",
      explicacao: "O programador desenvolve sistemas, sites e aplicativos, transformando necessidades em soluções digitais por meio do código."
    },
    {
      palavra: "PANIFICAÇÃO",
      categoria: "Alimentos",
      dica: "Área dedicada à produção de pães e massas fermentadas.",
      explicacao: "A panificação envolve escolha de ingredientes, fermentação, modelagem e forneamento, sempre com atenção às boas práticas de fabricação."
    },
    {
      palavra: "HIDRÁULICA",
      categoria: "Mecânica industrial",
      dica: "Usa a pressão de líquidos, como o óleo, para transmitir força.",
      explicacao: "Sistemas hidráulicos movem prensas, escavadeiras e elevadores com grande força, usando bombas, válvulas e cilindros."
    },
    {
      palavra: "PNEUMÁTICA",
      categoria: "Automação industrial",
      dica: "Usa ar comprimido para acionar cilindros e válvulas.",
      explicacao: "A pneumática é comum em linhas de produção por ser rápida, limpa e segura, movimentando peças com ar comprimido."
    },
    {
      palavra: "ELETRÔNICA",
      categoria: "Eletrônica",
      dica: "Estuda componentes como resistores, transistores e circuitos integrados.",
      explicacao: "A eletrônica está em celulares, computadores e máquinas industriais, controlando sinais elétricos com componentes semicondutores."
    },
    {
      palavra: "FERRAMENTARIA",
      categoria: "Metalmecânica",
      dica: "Setor que fabrica moldes, matrizes e dispositivos de alta precisão.",
      explicacao: "A ferramentaria produz as ferramentas que outras máquinas usam, como moldes de injeção e matrizes de estampagem."
    },
    {
      palavra: "SERRALHEIRO",
      categoria: "Metalurgia",
      dica: "Profissional que fabrica portões, grades e estruturas metálicas.",
      explicacao: "O serralheiro corta, dobra e solda perfis metálicos para produzir esquadrias, portões, grades e estruturas."
    },
    {
      palavra: "METROLOGIA",
      categoria: "Qualidade",
      dica: "Ciência das medições, com uso de paquímetros e micrômetros.",
      explicacao: "A metrologia garante que as medidas sejam confiáveis e rastreáveis, permitindo controlar a qualidade das peças fabricadas."
    },
    {
      palavra: "BANCO DE DADOS",
      categoria: "Tecnologia da informação",
      dica: "Estrutura organizada para guardar e consultar informações de um sistema.",
      explicacao: "Um banco de dados armazena informações de forma organizada. Profissionais de TI o modelam e consultam com linguagens como SQL."
    },
    {
      palavra: "AR-CONDICIONADO",
      categoria: "Refrigeração e climatização",
      dica: "Equipamento que controla temperatura e umidade de um ambiente.",
      explicacao: "Técnicos em refrigeração e climatização instalam e fazem a manutenção desses aparelhos, cuidando do gás refrigerante e da limpeza."
    },
    {
      palavra: "SEGURANÇA DO TRABALHO",
      categoria: "Segurança do trabalho",
      dica: "Área que previne acidentes e doenças ocupacionais nas empresas.",
      explicacao: "A segurança do trabalho identifica riscos, orienta o uso de EPIs e aplica as normas regulamentadoras para proteger os trabalhadores."
    },
    {
      palavra: "CONFEITARIA",
      categoria: "Alimentos",
      dica: "Arte de produzir bolos, doces e sobremesas decoradas.",
      explicacao: "A confeitaria exige precisão nas medidas e técnicas de decoração, além de cuidados com higiene e conservação dos produtos."
    },
    {
      palavra: "INFORMÁTICA",
      categoria: "Tecnologia da informação",
      dica: "Área que trata da informação por meio de computadores.",
      explicacao: "A informática abrange manutenção de computadores, redes, programação e suporte, presente em praticamente todos os setores."
    },
    {
      palavra: "MANUTENÇÃO",
      categoria: "Indústria",
      dica: "Conjunto de ações que mantém máquinas funcionando e evita paradas.",
      explicacao: "A manutenção pode ser corretiva, preventiva ou preditiva. Ela aumenta a vida útil dos equipamentos e a segurança da produção."
    },
    {
      palavra: "CIBERSEGURANÇA",
      categoria: "Tecnologia da informação",
      dica: "Proteção de sistemas, redes e dados contra ataques digitais.",
      explicacao: "A cibersegurança aplica senhas fortes, criptografia, cópias de segurança e monitoramento para proteger empresas e pessoas."
    },
    {
      palavra: "MARCENARIA",
      categoria: "Madeira e mobiliário",
      dica: "Ofício de projetar e fabricar móveis de madeira.",
      explicacao: "A marcenaria envolve leitura de projetos, corte, montagem e acabamento de móveis, com uso seguro de máquinas e ferramentas."
    }
  ]
};

/* ==========================================================================
   2. Configurações
   ========================================================================== */
const MAX_ERRORS = 6;

const LEVELS = {
  facil: { label: "Fácil" },
  medio: { label: "Médio" },
  dificil: { label: "Difícil" }
};

/* Para incluir um tema: adicione aqui e crie o bloco [data-theme] no CSS */
const THEMES = [
  { id: "padrao", label: "Padrão", swatches: ["#C1272C", "#164194", "#FFFFFF"] },
  { id: "escuro", label: "Escuro", swatches: ["#1C1D20", "#3A3C42", "#C9343A"] },
  { id: "azul", label: "Azul tecnológico", swatches: ["#0B2A5B", "#6FB1F2", "#FFFFFF"] },
  { id: "verde", label: "Verde", swatches: ["#1E5B3A", "#A9CDA0", "#F6F2E7"] },
  { id: "roxo", label: "Roxo", swatches: ["#4B1D7A", "#C7A9EC", "#F6F3FA"] }
];

const DEFAULT_THEME = "padrao";
const THEME_STORAGE_KEY = "forca-conhecimento:tema";

const BODY_PARTS = ["cabeça", "tronco", "braço esquerdo", "braço direito", "perna esquerda", "perna direita"];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* Estado da partida atual. Reiniciado por completo em startRound(). */
const state = {
  level: "facil",
  entry: null,          // entrada do banco de palavras
  letters: [],          // [{ char, base, isLetter, revealed }]
  guessed: new Set(),   // letras-base já escolhidas (A–Z)
  errors: 0,
  active: false         // true apenas durante uma partida em andamento
};

/* Sacolas de sorteio por nível: evitam repetição imediata da palavra */
const drawBags = { facil: [], medio: [], dificil: [] };
const lastDrawn = { facil: null, medio: null, dificil: null };

/* Referências aos elementos da página */
const els = {};

/* ==========================================================================
   3. Utilidades
   ========================================================================== */

/* Converte uma letra para sua forma-base: "Ã" -> "A", "ç" -> "C" */
function toBaseLetter(char) {
  return char
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

function isLetterChar(char) {
  return /^[A-Z]$/.test(toBaseLetter(char));
}

/* Conta apenas letras (ignora espaços e hífens) */
function countLetters(word) {
  return Array.from(word).filter(isLetterChar).length;
}

/* Acesso ao localStorage protegido: se indisponível, o jogo segue normal */
function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    /* Armazenamento bloqueado ou cheio: apenas não persiste a preferência */
  }
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural;
}

/* ==========================================================================
   4. Sorteio de palavras
   ========================================================================== */
function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/*
  Retira a próxima palavra da "sacola" do nível. Todas as palavras saem uma
  vez antes de a sacola ser reabastecida, e a primeira do novo ciclo nunca é
  igual à última sorteada.
*/
function drawWord(level) {
  const pool = WORD_BANK[level];

  if (drawBags[level].length === 0) {
    const bag = shuffle(pool.map((_, index) => index));
    const last = lastDrawn[level];
    if (pool.length > 1 && bag[bag.length - 1] === last) {
      [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    drawBags[level] = bag;
  }

  const index = drawBags[level].pop();
  lastDrawn[level] = index;
  return pool[index];
}

/* ==========================================================================
   5. Processamento de letras
   ========================================================================== */

/* Prepara a palavra: símbolos (espaço, hífen) já começam revelados */
function buildLetters(word) {
  return Array.from(word).map((char) => {
    const isLetter = isLetterChar(char);
    return {
      char,
      base: isLetter ? toBaseLetter(char) : null,
      isLetter,
      revealed: !isLetter
    };
  });
}

function isWordComplete() {
  return state.letters.every((item) => item.revealed);
}

/*
  Processa um palpite. Retorna sem efeito se a partida não estiver ativa,
  se o caractere não for uma letra ou se a letra já tiver sido escolhida.
*/
function handleGuess(rawLetter) {
  if (!state.active) return;

  const letter = toBaseLetter(rawLetter);
  if (!/^[A-Z]$/.test(letter)) return;

  if (state.guessed.has(letter)) {
    announce(`A letra ${letter} já foi escolhida.`, "");
    return;
  }

  state.guessed.add(letter);

  // Revela todas as ocorrências, incluindo as acentuadas
  const newlyRevealed = [];
  state.letters.forEach((item, index) => {
    if (item.isLetter && item.base === letter && !item.revealed) {
      item.revealed = true;
      newlyRevealed.push(index);
    }
  });

  const isHit = newlyRevealed.length > 0;

  if (isHit) {
    revealSlots(newlyRevealed);
    const count = newlyRevealed.length;
    announce(
      `Acertou! A letra ${letter} aparece ${count} ${pluralize(count, "vez", "vezes")}.`,
      "is-hit"
    );
  } else {
    state.errors += 1;
    drawHangman(state.errors);
    const remaining = MAX_ERRORS - state.errors;
    announce(
      `A letra ${letter} não está na palavra. ${remaining} ${pluralize(remaining, "tentativa restante", "tentativas restantes")}.`,
      "is-miss"
    );
  }

  updateKey(letter, isHit);
  updateAttempts();
  updateWordDescription();
  checkEndOfRound();
}

function checkEndOfRound() {
  if (isWordComplete()) {
    finishRound(true);
  } else if (state.errors >= MAX_ERRORS) {
    finishRound(false);
  }
}

/* ==========================================================================
   6. Desenho da forca
   ========================================================================== */
function drawHangman(errorCount) {
  els.hangmanParts.forEach((part, index) => {
    part.classList.toggle("is-visible", index < errorCount);
  });

  const drawn = BODY_PARTS.slice(0, errorCount);
  els.hangmanTitle.textContent = drawn.length === 0
    ? "Forca: nenhuma parte do personagem desenhada"
    : `Forca: ${drawn.length} de ${MAX_ERRORS} partes desenhadas (${drawn.join(", ")})`;
}

/* ==========================================================================
   7. Atualização da interface
   ========================================================================== */

/* Cria as 26 teclas uma única vez; os eventos usam delegação no container */
function buildKeyboard() {
  const fragment = document.createDocumentFragment();
  ALPHABET.forEach((letter) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "key";
    key.dataset.letter = letter;
    key.innerHTML = `<span class="key__letter">${letter}</span><span class="key__mark" aria-hidden="true"></span>`;
    fragment.appendChild(key);
  });
  els.keyboard.appendChild(fragment);
  els.keys = new Map(
    Array.from(els.keyboard.querySelectorAll(".key")).map((key) => [key.dataset.letter, key])
  );
}

/* Volta todas as teclas ao estado "disponível" */
function resetKeyboard() {
  els.keys.forEach((key, letter) => {
    key.className = "key";
    key.removeAttribute("aria-disabled");
    key.setAttribute("aria-label", `Letra ${letter}`);
    key.querySelector(".key__mark").textContent = "";
  });
}

function updateKey(letter, isHit) {
  const key = els.keys.get(letter);
  if (!key) return;
  key.classList.add(isHit ? "is-hit" : "is-miss");
  key.setAttribute("aria-disabled", "true");
  key.setAttribute("aria-label", `Letra ${letter}, ${isHit ? "correta" : "incorreta"}`);
  key.querySelector(".key__mark").textContent = isHit ? "✓" : "✕";
}

/* Bloqueia as teclas restantes quando a partida termina */
function lockKeyboard() {
  els.keys.forEach((key, letter) => {
    if (key.getAttribute("aria-disabled") === "true") return;
    key.classList.add("is-locked");
    key.setAttribute("aria-disabled", "true");
    key.setAttribute("aria-label", `Letra ${letter}, indisponível`);
  });
}

/*
  Monta as lacunas da palavra. Cada palavra separada por espaço vira um
  grupo que não quebra internamente; --n informa ao CSS o maior grupo para
  ajustar o tamanho das lacunas.
*/
function renderWord() {
  els.word.textContent = "";
  els.slots = [];

  // Espaços separam grupos; após um hífen a palavra também pode quebrar linha
  const groups = [[]];
  state.letters.forEach((item, index) => {
    if (item.char === " ") {
      groups.push([]);
      return;
    }
    groups[groups.length - 1].push(index);
    if (item.char === "-") groups.push([]);
  });

  const longestGroup = Math.max(...groups.map((group) => group.length));
  els.word.style.setProperty("--n", String(Math.max(longestGroup, 6)));
  els.word.classList.toggle("word--long", longestGroup > 10);

  groups.forEach((group) => {
    const groupEl = document.createElement("span");
    groupEl.className = "word__group";
    group.forEach((index) => {
      const item = state.letters[index];
      const slot = document.createElement("span");
      slot.className = item.isLetter ? "word__slot" : "word__slot word__slot--symbol";
      slot.textContent = item.isLetter ? "" : item.char;
      els.slots[index] = slot;
      groupEl.appendChild(slot);
    });
    els.word.appendChild(groupEl);
  });
}

/* Mostra apenas as lacunas recém-descobertas, com animação */
function revealSlots(indexes) {
  indexes.forEach((index) => {
    const slot = els.slots[index];
    slot.textContent = state.letters[index].char;
    slot.classList.add("is-revealed");
  });
}

/* Na derrota, completa a palavra destacando as letras que faltaram */
function revealMissingSlots() {
  state.letters.forEach((item, index) => {
    if (item.isLetter && !item.revealed) {
      const slot = els.slots[index];
      slot.textContent = item.char;
      slot.classList.add("is-missed");
    }
  });
}

/* Descrição para leitores de tela, sem revelar letras ainda ocultas */
function updateWordDescription() {
  const total = state.letters.filter((item) => item.isLetter).length;
  const found = state.letters.filter((item) => item.isLetter && item.revealed).length;
  const pattern = state.letters
    .map((item) => {
      if (item.char === " ") return "espaço";
      if (item.char === "-") return "hífen";
      return item.revealed ? item.char : "lacuna";
    })
    .join(", ");
  els.wordDescription.textContent =
    `Palavra com ${total} letras, ${found} ${pluralize(found, "descoberta", "descobertas")}: ${pattern}.`;
}

function updateAttempts() {
  els.errorCount.textContent = String(state.errors);
  els.remainingCount.textContent = String(MAX_ERRORS - state.errors);
  els.meterPips.forEach((pip, index) => {
    pip.classList.toggle("is-used", index < state.errors);
  });
}

function updateClue() {
  els.levelInfo.textContent = LEVELS[state.level].label;
  els.categoryInfo.textContent = state.entry.categoria;
  els.hintInfo.textContent = state.entry.dica;
}

/* Mensagem visível e anunciada pelo aria-live */
function announce(message, tone) {
  els.feedback.className = tone ? `feedback ${tone}` : "feedback";
  els.feedback.textContent = message;
}

/*
  Mostra uma das telas: "abertura", "inicio" (dificuldade) ou "jogo".
  As demais recebem hidden, então não recebem foco nem aparecem para leitores de tela.
*/
function showScreen(name) {
  const isSplash = name === "abertura";
  els.splashScreen.hidden = !isSplash;
  els.splashScreen.classList.remove("is-leaving");
  els.header.hidden = isSplash;
  els.screensWrap.hidden = isSplash;
  els.startScreen.hidden = name !== "inicio";
  els.gameScreen.hidden = name !== "jogo";
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ==========================================================================
   Controle de partidas
   ========================================================================== */

/* Inicia uma nova partida no nível informado, limpando todo o estado anterior */
function startRound(level) {
  state.level = level;
  state.entry = drawWord(level);
  state.letters = buildLetters(state.entry.palavra);
  state.guessed = new Set();
  state.errors = 0;
  state.active = true;

  hideResult();
  resetKeyboard();
  renderWord();
  drawHangman(0);
  updateAttempts();
  updateClue();
  updateWordDescription();

  const total = countLetters(state.entry.palavra);
  announce(`Nova palavra com ${total} letras. Você tem ${MAX_ERRORS} tentativas.`, "");

  showScreen("jogo");
}

/* Abertura -> seleção de dificuldade, com saída suave (sem iniciar partida) */
let isLeavingSplash = false;

function enterFromSplash() {
  if (isLeavingSplash) return;
  isLeavingSplash = true;

  const finish = () => {
    isLeavingSplash = false;
    showScreen("inicio");
    els.startTitle.focus();
  };

  if (prefersReducedMotion()) {
    finish();
  } else {
    els.splashScreen.classList.add("is-leaving");
    window.setTimeout(finish, 280);
  }
}

function goToSplash() {
  state.active = false;
  showScreen("abertura");
  els.splashTitle.focus();
}

function goToStart() {
  state.active = false;
  showScreen("inicio");
  // Mantém a dificuldade atual marcada na tela inicial
  const radio = els.startForm.querySelector(`input[name="dificuldade"][value="${state.level}"]`);
  if (radio) radio.checked = true;
  els.startTitle.focus();
}

/* ==========================================================================
   8. Resultado
   ========================================================================== */
function finishRound(won) {
  state.active = false;
  lockKeyboard();

  const word = state.entry.palavra;
  const message = won
    ? "Parabéns! Você descobriu a palavra."
    : `As tentativas acabaram. A palavra correta era: ${word}.`;

  if (!won) revealMissingSlots();
  els.hangman.classList.toggle("is-won", won);

  els.resultTitle.textContent = message;
  els.resultWord.textContent = word;
  els.resultCategory.textContent = state.entry.categoria;
  els.resultExplanation.textContent = state.entry.explicacao;
  els.result.classList.toggle("is-won", won);
  els.result.classList.toggle("is-lost", !won);
  els.result.hidden = false;

  // O anúncio só revela a palavra agora, com a partida encerrada
  announce(
    won ? `${message} ${word}.` : message,
    won ? "is-hit" : "is-miss"
  );
  // A mensagem já aparece no painel de resultado: fica só para leitores de tela
  els.feedback.classList.add("visually-hidden");
  els.wordDescription.textContent = `Palavra completa: ${word}.`;

  els.resultTitle.focus();
}

function hideResult() {
  els.result.hidden = true;
  els.result.classList.remove("is-won", "is-lost");
  els.hangman.classList.remove("is-won");
}

/* ==========================================================================
   9. Troca de tema
   Altera apenas o atributo data-theme: o estado da partida não é tocado.
   ========================================================================== */
function isValidTheme(themeId) {
  return THEMES.some((theme) => theme.id === themeId);
}

function applyTheme(themeId, { persist = true } = {}) {
  const theme = isValidTheme(themeId) ? themeId : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", theme);

  const radio = els.themeOptions.querySelector(`input[value="${theme}"]`);
  if (radio) radio.checked = true;

  if (persist) writeStorage(THEME_STORAGE_KEY, theme);
}

function buildThemePicker() {
  const fragment = document.createDocumentFragment();
  THEMES.forEach((theme) => {
    const wrapper = document.createElement("div");
    wrapper.className = "theme-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "tema";
    input.id = `tema-${theme.id}`;
    input.value = theme.id;

    const label = document.createElement("label");
    label.htmlFor = input.id;
    // Amostras com as cores do tema e o nome da opção
    const swatches = document.createElement("span");
    swatches.className = "swatches";
    swatches.setAttribute("aria-hidden", "true");
    theme.swatches.forEach((color) => {
      const dot = document.createElement("span");
      dot.style.background = color;
      swatches.appendChild(dot);
    });
    const name = document.createElement("span");
    name.textContent = theme.label;
    label.append(swatches, name);

    wrapper.append(input, label);
    fragment.appendChild(wrapper);
  });
  els.themeOptions.appendChild(fragment);
}

/* ==========================================================================
   10. Eventos e inicialização
   ========================================================================== */

/* Campos em que o teclado físico não deve registrar palpites */
function isInteractiveField(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("input, select, textarea, [contenteditable='true']"));
}

function handlePhysicalKeyboard(event) {
  if (!state.active || els.gameScreen.hidden) return;
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.key.length !== 1) return;            // ignora Enter, Tab, setas etc.
  if (isInteractiveField(event.target)) return;  // não interfere nos seletores

  const letter = toBaseLetter(event.key);
  if (!/^[A-Z]$/.test(letter)) return;           // ignora números e símbolos

  event.preventDefault();
  handleGuess(letter);
}

function bindEvents() {
  els.enterButton.addEventListener("click", enterFromSplash);
  els.backToSplashButton.addEventListener("click", goToSplash);

  els.startForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = els.startForm.querySelector('input[name="dificuldade"]:checked');
    startRound(selected ? selected.value : "facil");
    els.gameTitle.focus();
  });

  // Delegação: um único ouvinte para as 26 teclas
  els.keyboard.addEventListener("click", (event) => {
    const key = event.target.closest(".key");
    if (!key || key.getAttribute("aria-disabled") === "true") return;
    handleGuess(key.dataset.letter);
  });

  els.newWordButton.addEventListener("click", () => {
    startRound(state.level);
    els.gameTitle.focus();
  });

  els.playAgainButton.addEventListener("click", () => {
    startRound(state.level);
    els.gameTitle.focus();
  });

  els.backButton.addEventListener("click", goToStart);
  els.chooseLevelButton.addEventListener("click", goToStart);

  els.themeOptions.addEventListener("change", (event) => {
    if (event.target.name === "tema") applyTheme(event.target.value);
  });

  document.addEventListener("keydown", handlePhysicalKeyboard);
}

function cacheElements() {
  els.header = document.getElementById("cabecalho");
  els.splashScreen = document.getElementById("tela-abertura");
  els.splashTitle = document.getElementById("titulo-abertura");
  els.enterButton = document.getElementById("btn-entrar");
  els.backToSplashButton = document.getElementById("btn-voltar-abertura");
  els.screensWrap = document.getElementById("telas-jogo");
  els.startScreen = document.getElementById("tela-inicial");
  els.gameScreen = document.getElementById("tela-jogo");
  els.startTitle = document.getElementById("titulo-inicial");
  els.gameTitle = document.getElementById("titulo-jogo");
  els.startForm = document.getElementById("form-inicio");
  els.themeOptions = document.getElementById("theme-options");

  els.hangman = document.getElementById("forca");
  els.hangmanTitle = document.getElementById("forca-titulo");
  els.hangmanParts = Array.from(document.querySelectorAll(".hangman__part"))
    .sort((a, b) => Number(a.dataset.part) - Number(b.dataset.part));

  els.errorCount = document.getElementById("contador-erros");
  els.remainingCount = document.getElementById("contador-restantes");
  els.meterPips = Array.from(document.querySelectorAll("#medidor-erros span"));

  els.levelInfo = document.getElementById("info-nivel");
  els.categoryInfo = document.getElementById("info-categoria");
  els.hintInfo = document.getElementById("info-dica");

  els.word = document.getElementById("palavra");
  els.wordDescription = document.getElementById("palavra-descricao");
  els.feedback = document.getElementById("feedback");
  els.keyboard = document.getElementById("teclado");

  els.result = document.getElementById("resultado");
  els.resultTitle = document.getElementById("resultado-titulo");
  els.resultWord = document.getElementById("resultado-palavra");
  els.resultCategory = document.getElementById("resultado-categoria");
  els.resultExplanation = document.getElementById("resultado-explicacao");

  els.newWordButton = document.getElementById("btn-nova-palavra");
  els.backButton = document.getElementById("btn-voltar");
  els.playAgainButton = document.getElementById("btn-jogar-novamente");
  els.chooseLevelButton = document.getElementById("btn-escolher-dificuldade");
}

function init() {
  cacheElements();
  buildThemePicker();
  buildKeyboard();
  bindEvents();
  showScreen("abertura"); // toda abertura ou recarga começa pela tela de abertura
  // Restaura o tema salvo (ou usa o padrão se não houver/armazenamento indisponível)
  applyTheme(readStorage(THEME_STORAGE_KEY) || DEFAULT_THEME, { persist: false });
}

document.addEventListener("DOMContentLoaded", init);

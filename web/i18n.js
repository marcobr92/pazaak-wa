'use strict';

/* ──────────────────────────────────────────────────────────────────────────
   i18n — dicionário plano, uma chave por texto. pt é a referência.
   Regra: toda chave precisa existir nos 6 idiomas (tools/check-i18n.mjs).
   ────────────────────────────────────────────────────────────────────────── */

const LANGS = [
  { code: 'pt', label: 'PORTUGUÊS', short: 'PT' },
  { code: 'en', label: 'ENGLISH', short: 'EN' },
  { code: 'es', label: 'ESPAÑOL', short: 'ES' },
  { code: 'ru', label: 'РУССКИЙ', short: 'RU' },
  { code: 'zh', label: '中文', short: 'ZH' },
  { code: 'ja', label: '日本語', short: 'JA' },
];

const I18N = {
  pt: {
    'html.title': 'Pazaak WA',
    'ui.rules': 'REGRAS DO JOGO',
    'ui.close': 'FECHAR ✕',
    'home.sub': '// simulação tática de cartas',
    'ui.back': 'VOLTAR',
    'ui.exit': 'SAIR',
    'ui.you': 'VOCÊ',
    'ui.opponent': 'OPONENTE',
    'ui.lastDraw': 'ÚLTIMA COMPRA',
    'ui.lastDrawMine': 'SUA ÚLTIMA COMPRA',
    'ui.lastDrawOpp': 'ÚLTIMA COMPRA DO OPONENTE',
    'ui.yourTurn': 'É A SUA VEZ',
    'ui.oppTurn': 'É A VEZ DO OPONENTE {name}',
    'ui.set': 'SET {n}',
    'ui.endTurn': 'PEDIR',
    'ui.stand': 'PARAR',
    'ui.continue': 'CONTINUAR',
    'ui.yourHand': 'SUA MÃO',
    'ui.pause': 'II',
    'ui.shuffle': 'SORTEIO',
    'ui.setOver': 'SET ENCERRADO',
    'ui.matchOver': 'PARTIDA ENCERRADA',

    'home.learn.title': 'APRENDA A JOGAR',
    'home.learn.desc': 'partida guiada, sem pressa',
    'home.campaign.title': 'CAMPANHA',
    'home.campaign.desc': '10 oponentes · ordem aleatória',
    'home.challenge.title': 'DESAFIO',
    'home.challenge.desc': 'partidas infinitas até perder',
    'home.deck.title': 'CRIAR SEU DECK',
    'home.deck.desc': 'dez cartas. escolha com cabeça.',
    'home.disclaimer': 'Projeto de fã, não oficial, sem fins lucrativos. Pazaak, Star Wars e todos os elementos relacionados pertencem à Lucasfilm / The Walt Disney Company. Nenhum recurso é vendido, doado ou monetizado.',

    'campaign.title': 'CAMPANHA',
    'campaign.done': 'VENCIDO',
    'campaign.current': 'EM CURSO',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': 'FASE LIMPA',
    'campaign.stageClearSub': '{name} derrotado · sets {n} de 3',
    'campaign.next': 'PRÓXIMO',
    'campaign.defeat': 'DERROTA',
    'campaign.defeatSub': '{name} levou a melhor',
    'campaign.retry': 'TENTAR DE NOVO',
    'campaign.cleared': 'CAMPANHA CONCLUÍDA',
    'campaign.clearedSub': 'os dez caíram',
    'campaign.home': 'VOLTAR AO INÍCIO',

    'challenge.win': 'VITÓRIA',
    'challenge.winSub': 'sequência: {n}',
    'challenge.next': 'PRÓXIMO DESAFIANTE',
    'challenge.over': 'FIM DA LINHA',
    'challenge.overSub': 'você parou em {n} vitórias',
    'challenge.restart': 'RECOMEÇAR',

    'deck.title': 'CRIAR SEU DECK',
    'deck.help': 'Dez cartas. Máximo de duas cópias de cada tipo. O deck vale para todos os modos.',
    'deck.save': 'SALVAR DECK',
    'deck.clear': 'ZERAR',
    'deck.reset': 'RESTAURAR PADRÃO',
    'deck.count': '{n} / 10',

    'set.win': 'VOCÊ VENCEU ESSE SET',
    'set.lose': '{name} VENCEU ESSE SET',
    'set.tie': 'SET EMPATADO',
    'set.score': 'você {p} de 3 · {name} {o} de 3',
    'set.youBust': 'suas cartas chegaram a {p}; {name} estava em {o}',
    'set.oppBust': '{name} estourou em {o}; você estava em {p}',
    'set.bothStand': 'você parou em {p}; {name} parou em {o}',
    'set.fullYou': 'mesa cheia a seu favor: {p} contra {o}',
    'set.fullOpp': 'mesa cheia para {name}: {o} contra {p}',
    'set.tieLine': 'os dois terminaram em {p} — set sem vencedor',

    'log.youDraw': 'você comprou',
    'log.youEnd': 'você pediu carta',
    'log.youStand': 'você parou',
    'log.oppCard': 'oponente jogou carta',
    'log.oppStand': 'oponente parou',
    'log.oppEnd': 'oponente comprou e encerrou',
    'log.timeout': 'tempo esgotado — turno encerrado',
    'log.setStart': 'set {n} — {name}',
    'log.setFresh': 'set {n} — cartas na mesa',
    'log.bonus': 'vantagem de aula: você começa 1 set à frente',

    'tut.opponent': 'Agora o oponente. Ele compra sozinho — repare no total dele.',
    'tut.played': 'Carta jogada. Pedir compra outra; parar trava o total.',
    'tut.sixteen': '16 no total. O +4 da sua mão fecha exatamente em 20 — e 20 para sozinho. Clique nele.',
    'tut.bonus': 'Você começa 1 set à frente — é aula, o ponto é seu. Pedir compra outra carta; parar trava o total.',
    'tut.draw': 'Você comprou uma carta. Pedir compra outra; parar trava o total.',
    'tut.generic': 'Um turno: compra uma carta, opcionalmente joga uma da mão, e pede ou para.',
    'tut.afterFirst': 'A partir daqui é com você: mesmas regras, sem dica.',
    'tut.setEnd': 'Set encerrado. Quem chegou mais perto de 20 sem estourar leva o ponto.',
    'tut.guide': 'clique aqui',

    'intro.tag': 'AULA DE PAZAAK',
    'intro.head': 'Chegue perto de 20 sem estourar',
    'intro.li1': 'a cada turno você compra uma carta de 1 a 10 — ela soma no seu total',
    'intro.li2': 'passar de 20 no fim do turno é estourar: você perde o set',
    'intro.li3': 'na mão há quatro cartas para corrigir a soma, uma por turno',
    'intro.li4': 'pedir compra outra carta; parar trava o seu total',
    'intro.li5': 'quem ganha três sets leva a partida',
    'intro.note': 'Nesta aula você começa 1 set à frente, joga sem relógio, e eu aponto onde clicar. As cartas são sempre as mesmas — dá para repetir quantas vezes quiser.',
    'intro.start': 'COMEÇAR A AULA',

    'coin.title': 'SORTEIO DE INÍCIO',
    'coin.pick': 'escolha seu lado',
    'coin.heads': 'CARA · REPÚBLICA',
    'coin.tails': 'COROA · IMPÉRIO',
    'coin.spin': 'girando…',
    'coin.headsFace': 'cara',
    'coin.tailsFace': 'coroa',
    'coin.youStart': 'você começa',
    'coin.oppStarts': '{name} começa',

    'audio.mute': 'SILENCIAR',
    'audio.unmute': 'ATIVAR SOM',
    'audio.test': 'TESTAR ÁUDIO',

    'tip.end.head': 'PEDIR',
    'tip.end.body': 'pede mais uma carta do baralho. seu total sobe e você segue tentando chegar perto de 20 sem estourar.',
    'tip.pause.head': 'PAUSAR',
    'tip.pause.body': 'congela o relógio de 10s e segura o oponente. o jogo só anda quando você retomar.',
    'tip.stand.head': 'PARAR',
    'tip.stand.body': 'trava o seu total neste set. você não compra mais cartas — o oponente segue jogando até parar ou estourar.',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': 'sessão em uso: MAGI {name}',
    'tip.opp.won': 'vencido',
    'tip.opp.now': 'agora',

    'card.tip.plus': 'soma {v} ao seu total no set.',
    'card.tip.minus': 'subtrai {v} do seu total. serve para desfazer estouro.',
    'card.tip.pm': 'ao jogar, você escolhe: soma {v} ou subtrai {v}.',
    'card.tip.flip24': 'inverte o sinal de todas as cartas 2 e 4 na mesa — inclusive as do oponente.',
    'card.tip.flip36': 'inverte o sinal de todas as cartas 3 e 6 na mesa — inclusive as do oponente.',
    'card.tip.double': 'dobra a última carta que você comprou do baralho principal.',
    'card.tip.tie': 'vale ±1 e, se o set empatar, a vitória é sua.',
    'card.tip.advanced': 'carta avançada · KOTOR II',

    'opp.k7': 'Droide de carga que aprendeu pazaak esperando peça. Não tem pressa e não tem medo de estourar.',
    'opp.vex': 'Contrabandista. Aposta alto justamente quando o deck está ruim — e às vezes dá certo.',
    'opp.sarna': 'Mercenária. Joga como atira: sem aviso e sem segunda chance.',
    'opp.dorn': 'Piloto de carga. Conta as cartas do baralho principal de cabeça, por tédio.',
    'opp.ilyra': 'Contadora. Prefere perder pouco a ganhar com risco.',
    'opp.brask': 'Caçador. Espera você parar para só então decidir o set.',
    'opp.nima': 'Vidente. Diz que lê o baralho; no fundo, só blefa bem.',
    'opp.hask': 'Capitão. Joga pelo placar, não pela mão.',
    'opp.zeth': 'Mestre de mesa. Já reconhece a cara de quem tem ±6 na mão.',
    'opp.melchior': 'Núcleo lógico. Não sente nada, o que é uma vantagem injusta.',

    'rules.body': `<h3>Objetivo</h3>
      <p>Chegar a 20, ou o mais perto possível sem estourar. Quem ganha <strong>3 sets</strong> ganha a partida.</p>
      <p>Quem começa é decidido no sorteio da moeda. O vencedor de cada set começa o set seguinte.</p>
      <h3>Baralho principal</h3>
      <p>40 cartas: quatro de cada valor, de 1 a 10. Compra-se uma por turno.</p>
      <h3>Baralho lateral</h3>
      <p>Dez cartas escolhidas por você. No início da partida, <strong>quatro</strong> são sorteadas e formam sua mão. Cada carta da mão só pode ser usada <strong>uma vez por partida</strong>.</p>
      <h3>Turno</h3>
      <ol><li>Você compra uma carta do baralho principal.</li>
      <li>Pode jogar <strong>uma</strong> carta da mão (opcional).</li>
      <li>Depois, escolhe <strong>pedir</strong> (compra de novo) ou <strong>parar</strong>.</li></ol>
      <p>Se passar de 20 no fim do turno, estoura e perde o set.</p>
      <h3>Tipos de carta</h3>
      <ul><li><b class="c-plus">+</b> soma o valor.</li>
      <li><b class="c-minus">−</b> subtrai o valor.</li>
      <li><b class="c-pm">±</b> você decide, na hora de jogar, se soma ou subtrai.</li>
      <li><b class="c-gold">FLIP</b> inverte o sinal de todas as cartas 2 e 4 (ou 3 e 6) na mesa, dos dois lados.</li>
      <li><b class="c-gold">2×</b> dobra a última carta que você comprou do baralho principal.</li>
      <li><b class="c-gold">TIE</b> vale ±1 e, se houver empate, o desempate é seu.</li></ul>
      <h3>Fim do set</h3>
      <ul><li>Ganha quem tiver o maior valor sem estourar, depois que os dois param.</li>
      <li>Estourou, perde o set.</li>
      <li>Nove cartas na mesa sem estourar: vitória automática.</li>
      <li>Empate não pontua: joga-se outro set.</li></ul>
      <h3>Aviso</h3>
      <p>Fan game sem fins lucrativos. Pazaak e Star Wars pertencem à Lucasfilm / Disney.</p>`,
  },

  en: {
    'html.title': 'Pazaak WA',
    'ui.rules': 'GAME RULES',
    'ui.close': 'CLOSE ✕',
    'home.sub': '// tactical card simulation',
    'ui.back': 'BACK',
    'ui.exit': 'EXIT',
    'ui.you': 'YOU',
    'ui.opponent': 'OPPONENT',
    'ui.lastDraw': 'LAST DRAW',
    'ui.lastDrawMine': 'YOUR LAST DRAW',
    'ui.lastDrawOpp': 'OPPONENT LAST DRAW',
    'ui.yourTurn': 'YOUR TURN',
    'ui.oppTurn': "OPPONENT {name}'S TURN",
    'ui.set': 'SET {n}',
    'ui.endTurn': 'HIT',
    'ui.stand': 'STAND',
    'ui.continue': 'CONTINUE',
    'ui.yourHand': 'YOUR HAND',
    'ui.pause': 'II',
    'ui.shuffle': 'DRAWING',
    'ui.setOver': 'SET OVER',
    'ui.matchOver': 'MATCH OVER',

    'home.learn.title': 'LEARN TO PLAY',
    'home.learn.desc': 'guided match, no rush',
    'home.campaign.title': 'CAMPAIGN',
    'home.campaign.desc': '10 opponents · random order',
    'home.challenge.title': 'CHALLENGE',
    'home.challenge.desc': 'endless matches until you lose',
    'home.deck.title': 'BUILD YOUR DECK',
    'home.deck.desc': 'ten cards. choose wisely.',
    'home.disclaimer': 'Fan project, unofficial, non-profit. Pazaak, Star Wars and all related elements belong to Lucasfilm / The Walt Disney Company. Nothing here is sold, donated or monetized.',

    'campaign.title': 'CAMPAIGN',
    'campaign.done': 'BEATEN',
    'campaign.current': 'IN PROGRESS',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': 'STAGE CLEAR',
    'campaign.stageClearSub': '{name} defeated · sets {n} of 3',
    'campaign.next': 'NEXT',
    'campaign.defeat': 'DEFEAT',
    'campaign.defeatSub': '{name} got the better of you',
    'campaign.retry': 'TRY AGAIN',
    'campaign.cleared': 'CAMPAIGN COMPLETE',
    'campaign.clearedSub': 'all ten are down',
    'campaign.home': 'BACK TO START',

    'challenge.win': 'VICTORY',
    'challenge.winSub': 'streak: {n}',
    'challenge.next': 'NEXT CHALLENGER',
    'challenge.over': 'END OF THE LINE',
    'challenge.overSub': 'you stopped at {n} wins',
    'challenge.restart': 'START OVER',

    'deck.title': 'BUILD YOUR DECK',
    'deck.help': 'Ten cards. At most two copies of each type. This deck is used in every mode.',
    'deck.save': 'SAVE DECK',
    'deck.clear': 'CLEAR',
    'deck.reset': 'RESTORE DEFAULT',
    'deck.count': '{n} / 10',

    'set.win': 'YOU WON THIS SET',
    'set.lose': '{name} WON THIS SET',
    'set.tie': 'SET TIED',
    'set.score': 'you {p} of 3 · {name} {o} of 3',
    'set.youBust': 'your cards reached {p}; {name} was at {o}',
    'set.oppBust': '{name} busted at {o}; you were at {p}',
    'set.bothStand': 'you stood at {p}; {name} stood at {o}',
    'set.fullYou': 'table filled in your favor: {p} to {o}',
    'set.fullOpp': 'table filled for {name}: {o} to {p}',
    'set.tieLine': 'both ended at {p} — no winner',

    'log.youDraw': 'you drew',
    'log.youEnd': 'you hit',
    'log.youStand': 'you stood',
    'log.oppCard': 'opponent played a card',
    'log.oppStand': 'opponent stood',
    'log.oppEnd': 'opponent drew and ended',
    'log.timeout': 'time out — turn ended',
    'log.setStart': 'set {n} — {name}',
    'log.setFresh': 'set {n} — cards on the table',
    'log.bonus': 'lesson bonus: you start 1 set ahead',

    'tut.opponent': 'Now the opponent. They draw on their own — watch their total.',
    'tut.played': 'Card played. Hit draws again; stand locks the total.',
    'tut.sixteen': '16 total. The +4 in your hand lands exactly on 20 — and 20 stands by itself. Click it.',
    'tut.bonus': 'You start 1 set ahead — it is a lesson, the point is yours. Hit draws another card; stand locks the total.',
    'tut.draw': 'You drew a card. Hit draws another; standing locks your total.',
    'tut.generic': 'A turn: draw a card, optionally play one from your hand, then hit or stand.',
    'tut.afterFirst': 'From here it is on you: same rules, no hints.',
    'tut.setEnd': 'Set over. Whoever got closest to 20 without busting takes the point.',
    'tut.guide': 'click here',

    'intro.tag': 'PAZAAK LESSON',
    'intro.head': 'Get close to 20 without busting',
    'intro.li1': 'every turn you draw a card from 1 to 10 — it adds to your total',
    'intro.li2': 'going over 20 at the end of your turn is a bust: you lose the set',
    'intro.li3': 'your hand holds four cards to fix the total, one per turn',
    'intro.li4': 'hit draws another card; standing locks your total',
    'intro.li5': 'win three sets and you win the match',
    'intro.note': 'In this lesson you start 1 set ahead, play without a clock, and I point where to click. The cards are always the same — replay as often as you like.',
    'intro.start': 'START THE LESSON',

    'coin.title': 'STARTING TOSS',
    'coin.pick': 'pick your side',
    'coin.heads': 'HEADS · REPUBLIC',
    'coin.tails': 'TAILS · EMPIRE',
    'coin.spin': 'spinning…',
    'coin.headsFace': 'heads',
    'coin.tailsFace': 'tails',
    'coin.youStart': 'you start',
    'coin.oppStarts': '{name} starts',

    'audio.mute': 'MUTE',
    'audio.unmute': 'UNMUTE',
    'audio.test': 'TEST AUDIO',

    'tip.end.head': 'HIT',
    'tip.end.body': 'takes another card from the deck. your total goes up and you keep trying to get close to 20 without busting.',
    'tip.pause.head': 'PAUSE',
    'tip.pause.body': 'freezes the 10s clock and holds the opponent. the game only moves when you resume.',
    'tip.stand.head': 'STAND',
    'tip.stand.body': 'locks your total for this set. you draw no more cards — the opponent keeps playing until they stand or bust.',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': 'session running: MAGI {name}',
    'tip.opp.won': 'beaten',
    'tip.opp.now': 'now',

    'card.tip.plus': 'adds {v} to your total this set.',
    'card.tip.minus': 'subtracts {v} from your total. useful to undo a bust.',
    'card.tip.pm': 'when played, you choose: add {v} or subtract {v}.',
    'card.tip.flip24': 'flips the sign of every 2 and 4 on the table — including the opponent side.',
    'card.tip.flip36': 'flips the sign of every 3 and 6 on the table — including the opponent side.',
    'card.tip.double': 'doubles the last card you drew from the main deck.',
    'card.tip.tie': 'counts as ±1 and wins the set on a tie.',
    'card.tip.advanced': 'advanced card · KOTOR II',

    'opp.k7': 'A cargo droid that learned pazaak waiting for parts. No hurry, no fear of busting.',
    'opp.vex': 'Smuggler. Bets big exactly when the deck is bad — and sometimes it works.',
    'opp.sarna': 'Mercenary. Plays like she shoots: no warning, no second chance.',
    'opp.dorn': 'Cargo pilot. Counts the main deck in his head, out of boredom.',
    'opp.ilyra': 'Accountant. Prefers losing little to winning with risk.',
    'opp.brask': 'Hunter. Waits for you to stand before deciding the set.',
    'opp.nima': 'Seer. Says she reads the deck; mostly she bluffs well.',
    'opp.hask': 'Captain. Plays the score, not the hand.',
    'opp.zeth': 'Table master. Already knows the face of someone holding ±6.',
    'opp.melchior': 'Logic core. Feels nothing, which is an unfair advantage.',

    'rules.body': `<h3>Goal</h3>
      <p>Reach 20, or as close as you can without busting. First to win <strong>3 sets</strong> wins the match.</p>
      <p>A coin toss decides who starts. The winner of each set starts the next one.</p>
      <h3>Main deck</h3>
      <p>40 cards: four of each value, 1 to 10. One is drawn per turn.</p>
      <h3>Side deck</h3>
      <p>Ten cards you choose. At the start of the match <strong>four</strong> are drawn to form your hand. Each hand card can be used <strong>once per match</strong>.</p>
      <h3>Turn</h3>
      <ol><li>You draw a card from the main deck.</li>
      <li>You may play <strong>one</strong> card from your hand (optional).</li>
      <li>Then you choose to <strong>hit</strong> (draw again) or <strong>stand</strong>.</li></ol>
      <p>Going over 20 at the end of the turn is a bust: you lose the set.</p>
      <h3>Card types</h3>
      <ul><li><b class="c-plus">+</b> adds its value.</li>
      <li><b class="c-minus">−</b> subtracts its value.</li>
      <li><b class="c-pm">±</b> you decide, when playing, whether to add or subtract.</li>
      <li><b class="c-gold">FLIP</b> flips every 2 and 4 (or 3 and 6) on both sides of the table.</li>
      <li><b class="c-gold">2×</b> doubles the last card you drew from the main deck.</li>
      <li><b class="c-gold">TIE</b> counts as ±1 and wins the tiebreak.</li></ul>
      <h3>End of set</h3>
      <ul><li>Highest total without busting wins, once both stand.</li>
      <li>If you bust, you lose the set.</li>
      <li>Nine cards on the table without busting: automatic win.</li>
      <li>A tie scores nothing: another set is played.</li></ul>
      <h3>Notice</h3>
      <p>Non-profit fan game. Pazaak and Star Wars belong to Lucasfilm / Disney.</p>`,
  },

  es: {
    'html.title': 'Pazaak WA',
    'ui.rules': 'REGLAS DEL JUEGO',
    'ui.close': 'CERRAR ✕',
    'home.sub': '// simulación táctica de cartas',
    'ui.back': 'VOLVER',
    'ui.exit': 'SALIR',
    'ui.you': 'TÚ',
    'ui.opponent': 'RIVAL',
    'ui.lastDraw': 'ÚLTIMA CARTA',
    'ui.lastDrawMine': 'TU ÚLTIMA CARTA',
    'ui.lastDrawOpp': 'ÚLTIMA CARTA DEL RIVAL',
    'ui.yourTurn': 'ES TU TURNO',
    'ui.oppTurn': 'TURNO DEL RIVAL {name}',
    'ui.set': 'SET {n}',
    'ui.endTurn': 'PEDIR',
    'ui.stand': 'PLANTARSE',
    'ui.continue': 'CONTINUAR',
    'ui.yourHand': 'TU MANO',
    'ui.pause': 'II',
    'ui.shuffle': 'SORTEO',
    'ui.setOver': 'SET TERMINADO',
    'ui.matchOver': 'PARTIDA TERMINADA',

    'home.learn.title': 'APRENDE A JUGAR',
    'home.learn.desc': 'partida guiada, sin prisa',
    'home.campaign.title': 'CAMPAÑA',
    'home.campaign.desc': '10 rivales · orden aleatorio',
    'home.challenge.title': 'DESAFÍO',
    'home.challenge.desc': 'partidas infinitas hasta perder',
    'home.deck.title': 'CREA TU MAZO',
    'home.deck.desc': 'diez cartas. elige con cabeza.',
    'home.disclaimer': 'Proyecto de fans, no oficial, sin fines de lucro. Pazaak, Star Wars y todos los elementos relacionados pertenecen a Lucasfilm / The Walt Disney Company. Nada se vende, dona ni monetiza.',

    'campaign.title': 'CAMPAÑA',
    'campaign.done': 'VENCIDO',
    'campaign.current': 'EN CURSO',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': 'FASE SUPERADA',
    'campaign.stageClearSub': '{name} derrotado · sets {n} de 3',
    'campaign.next': 'SIGUIENTE',
    'campaign.defeat': 'DERROTA',
    'campaign.defeatSub': '{name} te superó',
    'campaign.retry': 'INTENTAR DE NUEVO',
    'campaign.cleared': 'CAMPAÑA COMPLETADA',
    'campaign.clearedSub': 'los diez cayeron',
    'campaign.home': 'VOLVER AL INICIO',

    'challenge.win': 'VICTORIA',
    'challenge.winSub': 'racha: {n}',
    'challenge.next': 'SIGUIENTE RIVAL',
    'challenge.over': 'FIN DEL CAMINO',
    'challenge.overSub': 'te detuviste en {n} victorias',
    'challenge.restart': 'EMPEZAR DE NUEVO',

    'deck.title': 'CREA TU MAZO',
    'deck.help': 'Diez cartas. Como máximo dos copias de cada tipo. El mazo vale para todos los modos.',
    'deck.save': 'GUARDAR MAZO',
    'deck.clear': 'BORRAR',
    'deck.reset': 'RESTAURAR POR DEFECTO',
    'deck.count': '{n} / 10',

    'set.win': 'GANASTE ESTE SET',
    'set.lose': '{name} GANÓ ESTE SET',
    'set.tie': 'SET EMPATADO',
    'set.score': 'tú {p} de 3 · {name} {o} de 3',
    'set.youBust': 'tus cartas llegaron a {p}; {name} estaba en {o}',
    'set.oppBust': '{name} se pasó en {o}; tú estabas en {p}',
    'set.bothStand': 'te plantaste en {p}; {name} en {o}',
    'set.fullYou': 'mesa llena a tu favor: {p} contra {o}',
    'set.fullOpp': 'mesa llena para {name}: {o} contra {p}',
    'set.tieLine': 'los dos terminaron en {p} — set sin ganador',

    'log.youDraw': 'robaste',
    'log.youEnd': 'pediste carta',
    'log.youStand': 'te plantaste',
    'log.oppCard': 'el rival jugó una carta',
    'log.oppStand': 'el rival se plantó',
    'log.oppEnd': 'el rival robó y terminó',
    'log.timeout': 'tiempo agotado — turno cerrado',
    'log.setStart': 'set {n} — {name}',
    'log.setFresh': 'set {n} — cartas en la mesa',
    'log.bonus': 'ventaja de clase: empiezas 1 set arriba',

    'tut.opponent': 'Ahora el rival. Roba solo — mira su total.',
    'tut.played': 'Carta jugada. Pedir roba otra; plantarte fija el total.',
    'tut.sixteen': '16 en total. El +4 de tu mano cae justo en 20 — y 20 se planta solo. Haz clic.',
    'tut.bonus': 'Empiezas 1 set arriba — es clase, el punto es tuyo. Pedir roba otra carta; plantarte fija el total.',
    'tut.draw': 'Robaste una carta. Pedir roba otra; plantarte fija el total.',
    'tut.generic': 'Un turno: robas, opcionalmente juegas una carta de la mano, y pides o te plantas.',
    'tut.afterFirst': 'De aquí en adelante es tuyo: mismas reglas, sin pistas.',
    'tut.setEnd': 'Set terminado. Quien quedó más cerca de 20 sin pasarse se lleva el punto.',
    'tut.guide': 'haz clic aquí',

    'intro.tag': 'CLASE DE PAZAAK',
    'intro.head': 'Acércate a 20 sin pasarte',
    'intro.li1': 'cada turno robas una carta de 1 a 10 — suma a tu total',
    'intro.li2': 'pasar de 20 al final del turno es pasarse: pierdes el set',
    'intro.li3': 'en la mano tienes cuatro cartas para corregir el total, una por turno',
    'intro.li4': 'pedir roba otra carta; plantarte fija tu total',
    'intro.li5': 'quien gana tres sets gana la partida',
    'intro.note': 'En esta clase empiezas 1 set arriba, juegas sin reloj y yo señalo dónde hacer clic. Las cartas son siempre las mismas — repite cuando quieras.',
    'intro.start': 'EMPEZAR LA CLASE',

    'coin.title': 'SORTEO INICIAL',
    'coin.pick': 'elige tu lado',
    'coin.heads': 'CARA · REPÚBLICA',
    'coin.tails': 'CRUZ · IMPERIO',
    'coin.spin': 'girando…',
    'coin.headsFace': 'cara',
    'coin.tailsFace': 'cruz',
    'coin.youStart': 'empiezas tú',
    'coin.oppStarts': 'empieza {name}',

    'audio.mute': 'SILENCIAR',
    'audio.unmute': 'ACTIVAR SONIDO',
    'audio.test': 'PROBAR AUDIO',

    'tip.end.head': 'PEDIR',
    'tip.end.body': 'pides otra carta del mazo. tu total sube y sigues buscando acercarte a 20 sin pasarte.',
    'tip.pause.head': 'PAUSA',
    'tip.pause.body': 'congela el reloj de 10s y detiene al rival. el juego solo avanza cuando reanudas.',
    'tip.stand.head': 'PLANTARSE',
    'tip.stand.body': 'fija tu total en este set. no robas más cartas — el rival sigue hasta plantarse o pasarse.',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': 'sesión en uso: MAGI {name}',
    'tip.opp.won': 'vencido',
    'tip.opp.now': 'ahora',

    'card.tip.plus': 'suma {v} a tu total en el set.',
    'card.tip.minus': 'resta {v} de tu total. sirve para deshacer una pasada.',
    'card.tip.pm': 'al jugarla eliges: suma {v} o resta {v}.',
    'card.tip.flip24': 'invierte el signo de todos los 2 y 4 de la mesa — incluidos los del rival.',
    'card.tip.flip36': 'invierte el signo de todos los 3 y 6 de la mesa — incluidos los del rival.',
    'card.tip.double': 'duplica la última carta que robaste del mazo principal.',
    'card.tip.tie': 'vale ±1 y gana el set en caso de empate.',
    'card.tip.advanced': 'carta avanzada · KOTOR II',

    'opp.k7': 'Droide de carga que aprendió pazaak esperando piezas. Sin prisa y sin miedo a pasarse.',
    'opp.vex': 'Contrabandista. Apuesta alto justo cuando el mazo está mal — y a veces sale bien.',
    'opp.sarna': 'Mercenaria. Juega como dispara: sin aviso y sin segunda oportunidad.',
    'opp.dorn': 'Piloto de carga. Cuenta el mazo principal de memoria, por aburrimiento.',
    'opp.ilyra': 'Contable. Prefiere perder poco a ganar con riesgo.',
    'opp.brask': 'Cazador. Espera a que te plantes para decidir el set.',
    'opp.nima': 'Vidente. Dice que lee el mazo; en el fondo solo farolea bien.',
    'opp.hask': 'Capitán. Juega al marcador, no a la mano.',
    'opp.zeth': 'Maestro de mesa. Ya reconoce la cara del que tiene ±6.',
    'opp.melchior': 'Núcleo lógico. No siente nada, lo que es una ventaja injusta.',

    'rules.body': `<h3>Objetivo</h3>
      <p>Llegar a 20, o lo más cerca posible sin pasarte. Quien gana <strong>3 sets</strong> gana la partida.</p>
      <p>Una moneda decide quién empieza. El ganador de cada set empieza el siguiente.</p>
      <h3>Mazo principal</h3>
      <p>40 cartas: cuatro de cada valor, del 1 al 10. Se roba una por turno.</p>
      <h3>Mazo lateral</h3>
      <p>Diez cartas elegidas por ti. Al inicio se sortean <strong>cuatro</strong> para tu mano. Cada carta de la mano se usa <strong>una vez por partida</strong>.</p>
      <h3>Turno</h3>
      <ol><li>Robas una carta del mazo principal.</li>
      <li>Puedes jugar <strong>una</strong> carta de la mano (opcional).</li>
      <li>Luego eliges <strong>pedir</strong> (robas otra) o <strong>plantarte</strong>.</li></ol>
      <p>Pasar de 20 al final del turno es pasarse: pierdes el set.</p>
      <h3>Tipos de carta</h3>
      <ul><li><b class="c-plus">+</b> suma su valor.</li>
      <li><b class="c-minus">−</b> resta su valor.</li>
      <li><b class="c-pm">±</b> tú decides, al jugarla, si suma o resta.</li>
      <li><b class="c-gold">FLIP</b> invierte los 2 y 4 (o 3 y 6) de ambos lados de la mesa.</li>
      <li><b class="c-gold">2×</b> duplica la última carta robada del mazo principal.</li>
      <li><b class="c-gold">TIE</b> vale ±1 y gana el desempate.</li></ul>
      <h3>Fin del set</h3>
      <ul><li>Gana el total más alto sin pasarse, cuando ambos se plantan.</li>
      <li>Si te pasas, pierdes el set.</li>
      <li>Nueve cartas en la mesa sin pasarte: victoria automática.</li>
      <li>El empate no puntúa: se juega otro set.</li></ul>
      <h3>Aviso</h3>
      <p>Fan game sin fines de lucro. Pazaak y Star Wars pertenecen a Lucasfilm / Disney.</p>`,
  },

  ru: {
    'html.title': 'Pazaak WA',
    'ui.rules': 'ПРАВИЛА ИГРЫ',
    'ui.close': 'ЗАКРЫТЬ ✕',
    'home.sub': '// тактическая карточная симуляция',
    'ui.back': 'НАЗАД',
    'ui.exit': 'ВЫЙТИ',
    'ui.you': 'ВЫ',
    'ui.opponent': 'СОПЕРНИК',
    'ui.lastDraw': 'ПОСЛЕДНЯЯ КАРТА',
    'ui.lastDrawMine': 'ВАША ПОСЛЕДНЯЯ КАРТА',
    'ui.lastDrawOpp': 'ПОСЛЕДНЯЯ КАРТА СОПЕРНИКА',
    'ui.yourTurn': 'ВАШ ХОД',
    'ui.oppTurn': 'ХОД СОПЕРНИКА {name}',
    'ui.set': 'СЕТ {n}',
    'ui.endTurn': 'ВЗЯТЬ',
    'ui.stand': 'СТОП',
    'ui.continue': 'ПРОДОЛЖИТЬ',
    'ui.yourHand': 'ВАША РУКА',
    'ui.pause': 'II',
    'ui.shuffle': 'ЖРЕБИЙ',
    'ui.setOver': 'СЕТ ОКОНЧЕН',
    'ui.matchOver': 'ПАРТИЯ ОКОНЧЕНА',

    'home.learn.title': 'УЧИМСЯ ИГРАТЬ',
    'home.learn.desc': 'партия с подсказками, без спешки',
    'home.campaign.title': 'КАМПАНИЯ',
    'home.campaign.desc': '10 соперников · случайный порядок',
    'home.challenge.title': 'ИСПЫТАНИЕ',
    'home.challenge.desc': 'партии подряд до первого поражения',
    'home.deck.title': 'СОБРАТЬ КОЛОДУ',
    'home.deck.desc': 'десять карт. выбирайте головой.',
    'home.disclaimer': 'Фанатский проект, неофициальный, без коммерческой цели. Pazaak, Star Wars и все связанные элементы принадлежат Lucasfilm / The Walt Disney Company. Ничего не продаётся и не монетизируется.',

    'campaign.title': 'КАМПАНИЯ',
    'campaign.done': 'ПОБЕЖДЁН',
    'campaign.current': 'В ИГРЕ',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': 'ЭТАП ПРОЙДЕН',
    'campaign.stageClearSub': '{name} побеждён · сеты {n} из 3',
    'campaign.next': 'ДАЛЬШЕ',
    'campaign.defeat': 'ПОРАЖЕНИЕ',
    'campaign.defeatSub': '{name} оказался сильнее',
    'campaign.retry': 'ПОПРОБОВАТЬ СНОВА',
    'campaign.cleared': 'КАМПАНИЯ ПРОЙДЕНА',
    'campaign.clearedSub': 'все десять пали',
    'campaign.home': 'В НАЧАЛО',

    'challenge.win': 'ПОБЕДА',
    'challenge.winSub': 'серия: {n}',
    'challenge.next': 'СЛЕДУЮЩИЙ СОПЕРНИК',
    'challenge.over': 'КОНЕЦ ПУТИ',
    'challenge.overSub': 'вы остановились на {n} победах',
    'challenge.restart': 'НАЧАТЬ ЗАНОВО',

    'deck.title': 'СОБРАТЬ КОЛОДУ',
    'deck.help': 'Десять карт. Не больше двух копий каждого типа. Колода работает во всех режимах.',
    'deck.save': 'СОХРАНИТЬ КОЛОДУ',
    'deck.clear': 'ОЧИСТИТЬ',
    'deck.reset': 'ВЕРНУТЬ ПО УМОЛЧАНИЮ',
    'deck.count': '{n} / 10',

    'set.win': 'ВЫ ВЫИГРАЛИ СЕТ',
    'set.lose': '{name} ВЫИГРАЛ СЕТ',
    'set.tie': 'СЕТ — НИЧЬЯ',
    'set.score': 'вы {p} из 3 · {name} {o} из 3',
    'set.youBust': 'ваши карты дошли до {p}; у {name} было {o}',
    'set.oppBust': '{name} перебрал на {o}; у вас было {p}',
    'set.bothStand': 'вы остановились на {p}; {name} на {o}',
    'set.fullYou': 'стол заполнен в вашу пользу: {p} против {o}',
    'set.fullOpp': 'стол заполнил {name}: {o} против {p}',
    'set.tieLine': 'оба закончили на {p} — победителя нет',

    'log.youDraw': 'вы взяли карту',
    'log.youEnd': 'вы взяли ещё',
    'log.youStand': 'вы остановились',
    'log.oppCard': 'соперник сыграл карту',
    'log.oppStand': 'соперник остановился',
    'log.oppEnd': 'соперник взял и завершил',
    'log.timeout': 'время вышло — ход завершён',
    'log.setStart': 'сет {n} — {name}',
    'log.setFresh': 'сет {n} — карты на столе',
    'log.bonus': 'бонус урока: вы начинаете с форой в 1 сет',

    'tut.opponent': 'Теперь соперник. Он берёт карты сам — следите за его суммой.',
    'tut.played': 'Карта сыграна. Взять — ещё карта; стоп — зафиксировать сумму.',
    'tut.sixteen': 'У вас 16. Карта +4 в руке даёт ровно 20 — а 20 останавливается сама. Нажмите на неё.',
    'tut.bonus': 'Вы начинаете с форой в 1 сет — это урок, очко ваше. Взять — ещё карта; стоп — зафиксировать сумму.',
    'tut.draw': 'Вы взяли карту. Взять — ещё карта; стоп фиксирует сумму.',
    'tut.generic': 'Ход: взять карту, по желанию сыграть одну из руки, затем взять ещё или стоп.',
    'tut.afterFirst': 'Дальше сами: те же правила, без подсказок.',
    'tut.setEnd': 'Сет окончен. Кто ближе к 20 без перебора, тот берёт очко.',
    'tut.guide': 'нажмите здесь',

    'intro.tag': 'УРОК PAZAAK',
    'intro.head': 'Подойдите близко к 20, не перебрав',
    'intro.li1': 'каждый ход вы берёте карту от 1 до 10 — она прибавляется к сумме',
    'intro.li2': 'больше 20 в конце хода — перебор: вы теряете сет',
    'intro.li3': 'в руке четыре карты, чтобы поправить сумму — по одной за ход',
    'intro.li4': 'взять — ещё карта; стоп фиксирует сумму',
    'intro.li5': 'кто выиграет три сета, тот выиграл партию',
    'intro.note': 'На этом уроке вы начинаете с форой в 1 сет, играете без таймера, а я показываю, куда нажимать. Карты всегда одни и те же — можно повторять сколько угодно.',
    'intro.start': 'НАЧАТЬ УРОК',

    'coin.title': 'ЖРЕБИЙ ПЕРЕД ПАРТИЕЙ',
    'coin.pick': 'выберите сторону',
    'coin.heads': 'ОРЁЛ · РЕСПУБЛИКА',
    'coin.tails': 'РЕШКА · ИМПЕРИЯ',
    'coin.spin': 'крутится…',
    'coin.headsFace': 'орёл',
    'coin.tailsFace': 'решка',
    'coin.youStart': 'начинаете вы',
    'coin.oppStarts': 'начинает {name}',

    'audio.mute': 'БЕЗ ЗВУКА',
    'audio.unmute': 'ВКЛЮЧИТЬ ЗВУК',
    'audio.test': 'ПРОВЕРИТЬ ЗВУК',

    'tip.end.head': 'ВЗЯТЬ',
    'tip.end.body': 'берёте ещё одну карту из колоды. сумма растёт, и вы продолжаете идти к 20 без перебора.',
    'tip.pause.head': 'ПАУЗА',
    'tip.pause.body': 'замораживает таймер на 10с и держит соперника. игра идёт только после продолжения.',
    'tip.stand.head': 'СТОП',
    'tip.stand.body': 'фиксирует вашу сумму в сете. вы больше не берёте карт — соперник играет, пока не остановится или не переберёт.',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': 'активная сессия: MAGI {name}',
    'tip.opp.won': 'побеждён',
    'tip.opp.now': 'сейчас',

    'card.tip.plus': 'прибавляет {v} к вашей сумме в сете.',
    'card.tip.minus': 'вычитает {v} из суммы. помогает выйти из перебора.',
    'card.tip.pm': 'при игре вы выбираете: прибавить {v} или вычесть {v}.',
    'card.tip.flip24': 'меняет знак у всех 2 и 4 на столе — включая карты соперника.',
    'card.tip.flip36': 'меняет знак у всех 3 и 6 на столе — включая карты соперника.',
    'card.tip.double': 'удваивает последнюю карту, взятую из основной колоды.',
    'card.tip.tie': 'считается как ±1 и выигрывает сет при равенстве.',
    'card.tip.advanced': 'продвинутая карта · KOTOR II',

    'opp.k7': 'Грузовой дроид, выучивший пазаак в ожидании деталей. Не спешит и не боится перебора.',
    'opp.vex': 'Контрабандист. Ставит много именно тогда, когда колода плоха — и иногда выходит.',
    'opp.sarna': 'Наёмница. Играет как стреляет: без предупреждения и без второго шанса.',
    'opp.dorn': 'Грузовой пилот. Считает основную колоду в уме от скуки.',
    'opp.ilyra': 'Бухгалтер. Лучше потерять мало, чем выиграть с риском.',
    'opp.brask': 'Охотник. Ждёт, пока вы остановитесь, и только потом решает сет.',
    'opp.nima': 'Провидица. Говорит, что читает колоду; на деле просто хорошо блефует.',
    'opp.hask': 'Капитан. Играет по счёту, а не по руке.',
    'opp.zeth': 'Мастер стола. Уже узнаёт лицо того, у кого ±6.',
    'opp.melchior': 'Логическое ядро. Ничего не чувствует — нечестное преимущество.',

    'rules.body': `<h3>Цель</h3>
      <p>Дойти до 20 или как можно ближе, не перебрав. Кто выиграет <strong>3 сета</strong>, тот выиграл партию.</p>
      <p>Кто начинает, решает жребий. Победитель сета начинает следующий.</p>
      <h3>Основная колода</h3>
      <p>40 карт: по четыре каждого значения от 1 до 10. Одна карта за ход.</p>
      <h3>Боковая колода</h3>
      <p>Десять карт на ваш выбор. В начале партии <strong>четыре</strong> из них становятся вашей рукой. Каждую карту руки можно использовать <strong>один раз за партию</strong>.</p>
      <h3>Ход</h3>
      <ol><li>Вы берёте карту из основной колоды.</li>
      <li>Можете сыграть <strong>одну</strong> карту из руки (не обязательно).</li>
      <li>Затем выбираете: <strong>взять</strong> (ещё карту) или <strong>стоп</strong>.</li></ol>
      <p>Перебор больше 20 в конце хода — вы теряете сет.</p>
      <h3>Типы карт</h3>
      <ul><li><b class="c-plus">+</b> прибавляет значение.</li>
      <li><b class="c-minus">−</b> вычитает значение.</li>
      <li><b class="c-pm">±</b> вы решаете при игре, прибавить или вычесть.</li>
      <li><b class="c-gold">FLIP</b> меняет знак у 2 и 4 (или 3 и 6) на обеих сторонах стола.</li>
      <li><b class="c-gold">2×</b> удваивает последнюю взятую карту.</li>
      <li><b class="c-gold">TIE</b> считается как ±1 и выигрывает при равенстве.</li></ul>
      <h3>Конец сета</h3>
      <ul><li>Побеждает большая сумма без перебора, когда оба остановились.</li>
      <li>Перебрали — сет проигран.</li>
      <li>Девять карт на столе без перебора: автоматическая победа.</li>
      <li>Ничья не даёт очков: играется новый сет.</li></ul>
      <h3>Примечание</h3>
      <p>Фанатская игра без коммерческой цели. Pazaak и Star Wars принадлежат Lucasfilm / Disney.</p>`,
  },

  zh: {
    'html.title': 'Pazaak WA',
    'ui.rules': '游戏规则',
    'ui.close': '关闭 ✕',
    'home.sub': '// 战术卡牌模拟',
    'ui.back': '返回',
    'ui.exit': '退出',
    'ui.you': '你',
    'ui.opponent': '对手',
    'ui.lastDraw': '最近抽牌',
    'ui.lastDrawMine': '你的最近抽牌',
    'ui.lastDrawOpp': '对手的最近抽牌',
    'ui.yourTurn': '轮到你了',
    'ui.oppTurn': '对手 {name} 的回合',
    'ui.set': '第 {n} 局',
    'ui.endTurn': '要牌',
    'ui.stand': '停牌',
    'ui.continue': '继续',
    'ui.yourHand': '你的手牌',
    'ui.pause': 'II',
    'ui.shuffle': '抽签',
    'ui.setOver': '本局结束',
    'ui.matchOver': '比赛结束',

    'home.learn.title': '学习玩法',
    'home.learn.desc': '引导对局，不用着急',
    'home.campaign.title': '战役',
    'home.campaign.desc': '10 名对手 · 顺序随机',
    'home.challenge.title': '挑战',
    'home.challenge.desc': '一直打到失败为止',
    'home.deck.title': '组建你的牌组',
    'home.deck.desc': '十张牌。好好选。',
    'home.disclaimer': '粉丝项目，非官方，非营利。Pazaak、Star Wars 及相关元素归 Lucasfilm / The Walt Disney Company 所有。本项目不出售、不接受捐赠、不投放广告。',

    'campaign.title': '战役',
    'campaign.done': '已击败',
    'campaign.current': '进行中',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': '阶段通过',
    'campaign.stageClearSub': '击败 {name} · {n} 局共 3 局',
    'campaign.next': '下一个',
    'campaign.defeat': '失败',
    'campaign.defeatSub': '{name} 更胜一筹',
    'campaign.retry': '再试一次',
    'campaign.cleared': '战役完成',
    'campaign.clearedSub': '十人全部倒下',
    'campaign.home': '回到首页',

    'challenge.win': '胜利',
    'challenge.winSub': '连胜：{n}',
    'challenge.next': '下一位挑战者',
    'challenge.over': '到此为止',
    'challenge.overSub': '你停在了 {n} 场胜利',
    'challenge.restart': '重新开始',

    'deck.title': '组建你的牌组',
    'deck.help': '十张牌。每种最多两张。此牌组在所有模式通用。',
    'deck.save': '保存牌组',
    'deck.clear': '清空',
    'deck.reset': '恢复默认',
    'deck.count': '{n} / 10',

    'set.win': '你赢下了这一局',
    'set.lose': '{name} 赢下了这一局',
    'set.tie': '本局平局',
    'set.score': '你 {p} / 3 · {name} {o} / 3',
    'set.youBust': '你的牌到了 {p}；{name} 是 {o}',
    'set.oppBust': '{name} 爆牌于 {o}；你是 {p}',
    'set.bothStand': '你停在 {p}；{name} 停在 {o}',
    'set.fullYou': '桌面填满，你占优：{p} 比 {o}',
    'set.fullOpp': '{name} 填满桌面：{o} 比 {p}',
    'set.tieLine': '双方都是 {p} — 本局无人获胜',

    'log.youDraw': '你抽了牌',
    'log.youEnd': '你要了一张牌',
    'log.youStand': '你停牌了',
    'log.oppCard': '对手打出一张牌',
    'log.oppStand': '对手停牌',
    'log.oppEnd': '对手抽牌并结束',
    'log.timeout': '时间到 — 回合结束',
    'log.setStart': '第 {n} 局 — {name}',
    'log.setFresh': '第 {n} 局 — 桌上发牌',
    'log.bonus': '教学优势：你以 1 局领先开局',

    'tut.opponent': '现在轮到对手。他自己抽牌 — 注意他的总分。',
    'tut.played': '已出牌。要牌会再抽一张；停牌会锁定总分。',
    'tut.sixteen': '总分 16。手牌里的 +4 正好到 20 —— 而 20 会自动停牌。点它。',
    'tut.bonus': '你以 1 局领先开局 —— 这是教学，分是你的。要牌会再抽一张；停牌锁定总分。',
    'tut.draw': '你抽了一张牌。要牌会再抽一张；停牌锁定总分。',
    'tut.generic': '一个回合：抽一张牌，可选打出一张手牌，然后要牌或停牌。',
    'tut.afterFirst': '接下来靠你自己：规则相同，不再提示。',
    'tut.setEnd': '本局结束。没有爆牌且最接近 20 的一方得分。',
    'tut.guide': '点这里',

    'intro.tag': 'PAZAAK 教学',
    'intro.head': '接近 20，但不要爆牌',
    'intro.li1': '每个回合你抽一张 1 到 10 的牌 —— 它加进你的总分',
    'intro.li2': '回合结束时超过 20 就是爆牌：你输掉这一局',
    'intro.li3': '手上有四张牌可以修正总分，每回合一张',
    'intro.li4': '要牌会再抽一张；停牌锁定你的总分',
    'intro.li5': '赢下三局就赢下整场比赛',
    'intro.note': '本节课你以 1 局领先开局，没有计时器，我会指出该点哪里。牌序始终相同 —— 可以反复练习。',
    'intro.start': '开始教学',

    'coin.title': '开局掷币',
    'coin.pick': '选择你的面',
    'coin.heads': '正面 · 共和国',
    'coin.tails': '反面 · 帝国',
    'coin.spin': '旋转中…',
    'coin.headsFace': '正面',
    'coin.tailsFace': '反面',
    'coin.youStart': '你先手',
    'coin.oppStarts': '{name} 先手',

    'audio.mute': '静音',
    'audio.unmute': '开启声音',
    'audio.test': '测试声音',

    'tip.end.head': '要牌',
    'tip.end.body': '再抽一张牌。总分增加，继续接近 20 而不爆牌。',
    'tip.pause.head': '暂停',
    'tip.pause.body': '冻结 10 秒计时并停住对手。你继续后游戏才会推进。',
    'tip.stand.head': '停牌',
    'tip.stand.body': '锁定你本局的总分。你不再抽牌 —— 对手会一直玩到他停牌或爆牌。',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': '当前会话：MAGI {name}',
    'tip.opp.won': '已击败',
    'tip.opp.now': '现在',

    'card.tip.plus': '本局总分加 {v}。',
    'card.tip.minus': '总分减 {v}。用来撤销爆牌。',
    'card.tip.pm': '打出时你选择：加 {v} 或减 {v}。',
    'card.tip.flip24': '翻转桌面上所有 2 和 4 的正负 —— 包括对手的。',
    'card.tip.flip36': '翻转桌面上所有 3 和 6 的正负 —— 包括对手的。',
    'card.tip.double': '让你从主牌堆抽到的最后一张牌翻倍。',
    'card.tip.tie': '按 ±1 计算，平局时判你赢。',
    'card.tip.advanced': '高级牌 · KOTOR II',

    'opp.k7': '一架在等零件时学会 pazaak 的货运机器人。不着急，也不怕爆牌。',
    'opp.vex': '走私客。偏偏在牌运差时下重注 —— 有时还真灵。',
    'opp.sarna': '雇佣兵。打牌像开枪：不警告，也不给第二次机会。',
    'opp.dorn': '货运飞行员。无聊时会心算主牌堆。',
    'opp.ilyra': '会计。宁可少输，也不冒险赢。',
    'opp.brask': '猎人。等你先停牌，再决定这一局。',
    'opp.nima': '先知。说能读牌堆，其实只是擅长诈唬。',
    'opp.hask': '船长。看比分打牌，不看手牌。',
    'opp.zeth': '牌桌老手。一眼就认出谁手里有 ±6。',
    'opp.melchior': '逻辑核心。没有情绪，这是不公平的优势。',

    'rules.body': `<h3>目标</h3>
      <p>达到 20，或尽可能接近而不要爆牌。先赢下 <strong>3 局</strong> 者赢下比赛。</p>
      <p>谁先手由掷币决定。每局的赢家先手下一局。</p>
      <h3>主牌堆</h3>
      <p>40 张：1 到 10 每个数值四张。每回合抽一张。</p>
      <h3>副牌堆</h3>
      <p>你自己选的十张牌。开局时随机 <strong>四张</strong> 成为手牌。每张手牌整场只能用 <strong>一次</strong>。</p>
      <h3>回合</h3>
      <ol><li>你从主牌堆抽一张牌。</li>
      <li>可以打出 <strong>一张</strong> 手牌（可选）。</li>
      <li>然后选择 <strong>要牌</strong>（再抽一张）或 <strong>停牌</strong>。</li></ol>
      <p>回合结束时超过 20 就是爆牌，输掉本局。</p>
      <h3>牌的種類</h3>
      <ul><li><b class="c-plus">+</b> 加上数值。</li>
      <li><b class="c-minus">−</b> 减去数值。</li>
      <li><b class="c-pm">±</b> 打出时由你决定加还是减。</li>
      <li><b class="c-gold">FLIP</b> 翻转双方桌面上所有 2 和 4（或 3 和 6）的正负。</li>
      <li><b class="c-gold">2×</b> 让你最后抽到的牌翻倍。</li>
      <li><b class="c-gold">TIE</b> 按 ±1 计算，平局时判你赢。</li></ul>
      <h3>一局结束</h3>
      <ul><li>双方停牌后，未爆牌且总分更高者获胜。</li>
      <li>爆牌即输掉本局。</li>
      <li>桌上九张牌且未爆牌：自动获胜。</li>
      <li>平局不计分：再打一局。</li></ul>
      <h3>声明</h3>
      <p>非营利粉丝游戏。Pazaak 与 Star Wars 归 Lucasfilm / Disney 所有。</p>`,
  },

  ja: {
    'html.title': 'Pazaak WA',
    'ui.rules': 'ゲームのルール',
    'ui.close': '閉じる ✕',
    'home.sub': '// タクティカル・カード・シミュレーション',
    'ui.back': '戻る',
    'ui.exit': '退出',
    'ui.you': 'あなた',
    'ui.opponent': '相手',
    'ui.lastDraw': '直前のドロー',
    'ui.lastDrawMine': 'あなたの直前のドロー',
    'ui.lastDrawOpp': '相手の直前のドロー',
    'ui.yourTurn': 'あなたの番です',
    'ui.oppTurn': '相手 {name} の番です',
    'ui.set': 'セット {n}',
    'ui.endTurn': 'ヒット',
    'ui.stand': 'ステイ',
    'ui.continue': '続ける',
    'ui.yourHand': '手札',
    'ui.pause': 'II',
    'ui.shuffle': '抽選',
    'ui.setOver': 'セット終了',
    'ui.matchOver': '試合終了',

    'home.learn.title': '遊び方を学ぶ',
    'home.learn.desc': '案内付きの試合、急がずに',
    'home.campaign.title': 'キャンペーン',
    'home.campaign.desc': '10人の相手 · 順番はランダム',
    'home.challenge.title': 'チャレンジ',
    'home.challenge.desc': '負けるまで続く連戦',
    'home.deck.title': 'デッキを作る',
    'home.deck.desc': '10枚。よく考えて選ぶ。',
    'home.disclaimer': 'ファン制作、非公式、非営利。Pazaak、Star Wars および関連要素は Lucasfilm / The Walt Disney Company に帰属します。販売・寄付・広告収益はありません。',

    'campaign.title': 'キャンペーン',
    'campaign.done': '撃破',
    'campaign.current': '進行中',
    'campaign.progress': '{done} / {total}',
    'campaign.stageClear': 'ステージクリア',
    'campaign.stageClearSub': '{name} を破った · セット {n} / 3',
    'campaign.next': '次へ',
    'campaign.defeat': '敗北',
    'campaign.defeatSub': '{name} に敗れた',
    'campaign.retry': 'もう一度',
    'campaign.cleared': 'キャンペーン制覇',
    'campaign.clearedSub': '10人すべて撃破',
    'campaign.home': '最初へ戻る',

    'challenge.win': '勝利',
    'challenge.winSub': '連勝：{n}',
    'challenge.next': '次の挑戦者',
    'challenge.over': 'ここまで',
    'challenge.overSub': '{n} 勝で止まりました',
    'challenge.restart': 'やり直す',

    'deck.title': 'デッキを作る',
    'deck.help': '10枚。同じ種類は最大2枚まで。このデッキは全モードで使われます。',
    'deck.save': 'デッキを保存',
    'deck.clear': 'クリア',
    'deck.reset': '初期状態に戻す',
    'deck.count': '{n} / 10',

    'set.win': 'このセットを取りました',
    'set.lose': '{name} がこのセットを取りました',
    'set.tie': 'セットは引き分け',
    'set.score': 'あなた {p} / 3 · {name} {o} / 3',
    'set.youBust': 'あなたの合計は {p}、{name} は {o} でした',
    'set.oppBust': '{name} が {o} でバースト、あなたは {p}',
    'set.bothStand': 'あなたは {p} でステイ、{name} は {o}',
    'set.fullYou': 'テーブルを埋めて有利：{p} 対 {o}',
    'set.fullOpp': '{name} がテーブルを埋めた：{o} 対 {p}',
    'set.tieLine': '両者 {p} — 勝者なし',

    'log.youDraw': 'カードを引きました',
    'log.youEnd': 'ヒットしました',
    'log.youStand': 'ステイしました',
    'log.oppCard': '相手がカードを出しました',
    'log.oppStand': '相手がステイしました',
    'log.oppEnd': '相手は引いてターン終了',
    'log.timeout': '時間切れ — ターン終了',
    'log.setStart': 'セット {n} — {name}',
    'log.setFresh': 'セット {n} — テーブルに配牌',
    'log.bonus': 'レッスン特典：1セット先行で開始',

    'tut.opponent': '次は相手です。自分で引くので、合計を見ておきましょう。',
    'tut.played': 'カードを出しました。ヒットで次を引き、ステイで合計を固定します。',
    'tut.sixteen': '合計16。手札の +4 でちょうど20 — 20は自動でステイします。クリックしましょう。',
    'tut.bonus': '1セット先行で開始します — レッスンなので点はあなたのもの。ヒットで引き直し、ステイで合計を固定します。',
    'tut.draw': 'カードを引きました。ヒットで次を引き、ステイで合計を固定します。',
    'tut.generic': '1ターン：カードを引き、必要なら手札を1枚出し、ヒットかステイを選びます。',
    'tut.afterFirst': 'ここからは自分で。ルールは同じ、ヒントはありません。',
    'tut.setEnd': 'セット終了。バーストせず20に最も近い方が点を取ります。',
    'tut.guide': 'ここをクリック',

    'intro.tag': 'PAZAAK レッスン',
    'intro.head': '20に近づく。超えないこと',
    'intro.li1': '毎ターン1〜10のカードを引き、合計に加わります',
    'intro.li2': 'ターン終了時に20を超えるとバースト：セットを失います',
    'intro.li3': '手札には合計を調整する4枚があり、1ターンに1枚使えます',
    'intro.li4': 'ヒットでカードを引き、ステイで合計を固定します',
    'intro.li5': '3セット先取で試合の勝ちです',
    'intro.note': 'このレッスンでは1セット先行で始まり、タイマーなし、次に押す場所を私が示します。カードは毎回同じなので、何度でも練習できます。',
    'intro.start': 'レッスンを始める',

    'coin.title': '開始のコイントス',
    'coin.pick': '面を選んでください',
    'coin.heads': '表 · 共和国',
    'coin.tails': '裏 · 帝国',
    'coin.spin': '回転中…',
    'coin.headsFace': '表',
    'coin.tailsFace': '裏',
    'coin.youStart': 'あなたから',
    'coin.oppStarts': '{name} から',

    'audio.mute': 'ミュート',
    'audio.unmute': '音を出す',
    'audio.test': '音をテスト',

    'tip.end.head': 'ヒット',
    'tip.end.body': '山からもう1枚引きます。合計が増え、20に近づきます。',
    'tip.pause.head': '一時停止',
    'tip.pause.body': '10秒タイマーを止め、相手も止めます。再開するまでゲームは進みません。',
    'tip.stand.head': 'ステイ',
    'tip.stand.body': 'このセットの合計を固定します。もう引きません — 相手はステイかバーストまで続けます。',
    'tip.magi.head': 'MAGI SYSTEM',
    'tip.magi.body': '使用中のセッション：MAGI {name}',
    'tip.opp.won': '撃破済み',
    'tip.opp.now': '現在',

    'card.tip.plus': 'このセットの合計に {v} を加えます。',
    'card.tip.minus': '合計から {v} を引きます。バーストの立て直しに。',
    'card.tip.pm': '出すときに選べます：{v} を足すか引くか。',
    'card.tip.flip24': 'テーブル上の2と4の符号を反転します — 相手側も含みます。',
    'card.tip.flip36': 'テーブル上の3と6の符号を反転します — 相手側も含みます。',
    'card.tip.double': 'メインデッキから最後に引いたカードを2倍にします。',
    'card.tip.tie': '±1として扱い、同点なら勝ちになります。',
    'card.tip.advanced': '上級カード · KOTOR II',

    'opp.k7': '部品待ちの間にパザークを覚えた貨物ドロイド。急がず、バーストも怖がらない。',
    'opp.vex': '密輸業者。デッキが悪いときに限って大きく張る — たまに当たる。',
    'opp.sarna': '傭兵。撃つように打つ：予告なし、二度目なし。',
    'opp.dorn': '貨物パイロット。退屈しのぎにメインデッキを暗算する。',
    'opp.ilyra': '会計士。危険を冒して勝つより、少し負ける方を選ぶ。',
    'opp.brask': '狩人。あなたがステイするのを待ってからセットを決める。',
    'opp.nima': '予言者。デッキが読めると言うが、実際はブラフが上手いだけ。',
    'opp.hask': '船長。手札ではなくスコアで打つ。',
    'opp.zeth': '卓の達人。±6を持つ顔はもう見分ける。',
    'opp.melchior': '論理コア。感情がない — それは不公平な強み。',

    'rules.body': `<h3>目的</h3>
      <p>20に到達するか、超えずにできるだけ近づきます。<strong>3セット</strong>先取で試合の勝ちです。</p>
      <p>先手はコイントスで決まります。各セットの勝者が次のセットの先手です。</p>
      <h3>メインデッキ</h3>
      <p>40枚：1〜10が各4枚。1ターンに1枚引きます。</p>
      <h3>サイドデッキ</h3>
      <p>自分で選ぶ10枚。試合開始時に<strong>4枚</strong>が手札になります。手札は1試合に<strong>1回ずつ</strong>しか使えません。</p>
      <h3>ターン</h3>
      <ol><li>メインデッキから1枚引きます。</li>
      <li>手札から<strong>1枚</strong>出せます（任意）。</li>
      <li>その後<strong>ヒット</strong>（もう1枚引く）か<strong>ステイ</strong>を選びます。</li></ol>
      <p>ターン終了時に20を超えるとバーストでセットを失います。</p>
      <h3>カードの種類</h3>
      <ul><li><b class="c-plus">+</b> 値を足す。</li>
      <li><b class="c-minus">−</b> 値を引く。</li>
      <li><b class="c-pm">±</b> 出すときに足すか引くかを選ぶ。</li>
      <li><b class="c-gold">FLIP</b> 両側の2と4（または3と6）の符号を反転。</li>
      <li><b class="c-gold">2×</b> 最後に引いたカードを2倍。</li>
      <li><b class="c-gold">TIE</b> ±1として扱い、同点なら勝ち。</li></ul>
      <h3>セット終了</h3>
      <ul><li>両者がステイした後、バーストせず高い合計の方が勝ち。</li>
      <li>バーストしたらセットを失う。</li>
      <li>9枚置いてバーストしていなければ自動勝利。</li>
      <li>同点は得点なし：次のセットへ。</li></ul>
      <h3>注意</h3>
      <p>非営利のファンゲーム。Pazaak と Star Wars は Lucasfilm / Disney に帰属します。</p>`,
  },
};

/* ── runtime ─────────────────────────────────────────────────────────────── */
const I18N_STATE = { lang: 'pt' };

function langTag(code) {
  if (code === 'zh') return 'zh-CN';
  if (code === 'pt') return 'pt-BR';
  return code;
}

function i18nInit() {
  try {
    const saved = localStorage.getItem('pazaak.lang');
    if (saved && I18N[saved]) I18N_STATE.lang = saved;
  } catch (e) { /* sem storage */ }
  document.documentElement.lang = langTag(I18N_STATE.lang);
}

function currentLang() { return I18N_STATE.lang; }

function t(key, vars) {
  const dict = I18N[I18N_STATE.lang] || I18N.pt;
  let s = dict[key];
  if (s === undefined) s = I18N.pt[key];
  if (s === undefined) return key;
  if (vars) {
    for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  }
  return s;
}

function applyStatic() {
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.getAttribute('data-i18n'));
  }
  const rules = document.getElementById('rules-body');
  if (rules) rules.innerHTML = t('rules.body');
  document.title = t('html.title');
}

function setLang(code) {
  if (!I18N[code]) return;
  I18N_STATE.lang = code;
  try { localStorage.setItem('pazaak.lang', code); } catch (e) { /* ok */ }
  document.documentElement.lang = langTag(code);
  applyStatic();
  if (typeof window.onLangChange === 'function') window.onLangChange();
}

'use strict';

/* ──────────────────────────────────────────────────────────────────────────
   Pazaak — camada de tela. Regras, estado e IA vivem no wasm.
   ────────────────────────────────────────────────────────────────────────── */

const T = { PLUS: 0, MINUS: 1, PM: 2, FLIP24: 3, FLIP36: 4, DOUBLE: 5, TIE: 6 };
const C = (t, v = 0) => ((t << 4) | (v & 0xF)) & 0xFF;

const POOL = [];
for (let v = 1; v <= 6; v++) POOL.push({ code: C(T.PLUS, v), t: T.PLUS, v });
for (let v = 1; v <= 6; v++) POOL.push({ code: C(T.MINUS, v), t: T.MINUS, v });
for (let v = 1; v <= 6; v++) POOL.push({ code: C(T.PM, v), t: T.PM, v });
POOL.push({ code: C(T.FLIP24), t: T.FLIP24, v: 0 });
POOL.push({ code: C(T.FLIP36), t: T.FLIP36, v: 0 });
POOL.push({ code: C(T.DOUBLE), t: T.DOUBLE, v: 0 });
POOL.push({ code: C(T.TIE, 1), t: T.TIE, v: 1 });

function cardLabel(code) {
  const t = code >> 4, v = code & 0xF;
  if (t === T.PLUS) return '+' + v;
  if (t === T.MINUS) return '−' + v;
  if (t === T.PM) return '±' + v;
  if (t === T.FLIP24) return '2&4';
  if (t === T.FLIP36) return '3&6';
  if (t === T.DOUBLE) return '2×';
  if (t === T.TIE) return 'TIE';
  return '?';
}
function cardClass(code) {
  const t = code >> 4;
  if (t === T.PLUS) return 'plus';
  if (t === T.MINUS) return 'minus';
  if (t === T.PM) return 'pm';
  return 'gold';
}

const DEFAULT_DECK = [
  C(T.PM, 3), C(T.PM, 4), C(T.PLUS, 5), C(T.MINUS, 4), C(T.PM, 2),
  C(T.PLUS, 1), C(T.MINUS, 2), C(T.TIE, 1), C(T.FLIP24), C(T.DOUBLE),
];

/* ── oponentes ───────────────────────────────────────────────────────────── */
const OPPONENTS = [
  { name: 'K-7 · FERRO-VELHO', tag: 'droide de carga', diff: 0,
    deck: [C(T.PLUS,1),C(T.PLUS,2),C(T.PLUS,3),C(T.PLUS,4),C(T.MINUS,1),C(T.MINUS,2),C(T.PM,1),C(T.PM,2),C(T.PLUS,5),C(T.MINUS,3)] },
  { name: 'VEX CORREL', tag: 'contrabandista', diff: 0,
    deck: [C(T.PLUS,2),C(T.PLUS,3),C(T.PLUS,4),C(T.PM,2),C(T.PM,3),C(T.MINUS,2),C(T.MINUS,3),C(T.DOUBLE),C(T.PLUS,1),C(T.MINUS,1)] },
  { name: 'SARNA VELL', tag: 'mercenária', diff: 1,
    deck: [C(T.PM,3),C(T.PM,4),C(T.PM,5),C(T.PLUS,6),C(T.MINUS,4),C(T.MINUS,5),C(T.FLIP24),C(T.PLUS,2),C(T.MINUS,2),C(T.PM,1)] },
  { name: 'DORN KALEK', tag: 'piloto de carga', diff: 1,
    deck: [C(T.PLUS,3),C(T.PLUS,4),C(T.PLUS,5),C(T.PLUS,6),C(T.MINUS,3),C(T.MINUS,4),C(T.PM,4),C(T.DOUBLE),C(T.PLUS,2),C(T.MINUS,2)] },
  { name: 'ILYRA SAN', tag: 'contadora', diff: 1,
    deck: [C(T.PM,2),C(T.PM,3),C(T.PM,4),C(T.PM,5),C(T.FLIP36),C(T.MINUS,5),C(T.PLUS,5),C(T.TIE,1),C(T.MINUS,2),C(T.PLUS,2)] },
  { name: 'BRASK ORDO', tag: 'caçador', diff: 2,
    deck: [C(T.PM,4),C(T.PM,5),C(T.PM,6),C(T.FLIP24),C(T.FLIP36),C(T.DOUBLE),C(T.MINUS,6),C(T.PLUS,6),C(T.TIE,1),C(T.PM,3)] },
  { name: 'NIMA TESH', tag: 'vidente', diff: 2,
    deck: [C(T.PM,6),C(T.PM,5),C(T.PM,4),C(T.FLIP36),C(T.DOUBLE),C(T.TIE,1),C(T.MINUS,6),C(T.PLUS,6),C(T.FLIP24),C(T.PM,2)] },
  { name: 'HASK VORN', tag: 'capitão', diff: 2,
    deck: [C(T.PM,5),C(T.PM,6),C(T.PM,3),C(T.DOUBLE),C(T.FLIP24),C(T.MINUS,6),C(T.PLUS,6),C(T.TIE,1),C(T.PM,4),C(T.PLUS,5)] },
  { name: 'ZETH ARU', tag: 'mestre de mesa', diff: 2,
    deck: [C(T.PM,6),C(T.PM,6),C(T.DOUBLE),C(T.FLIP36),C(T.FLIP24),C(T.TIE,1),C(T.MINUS,6),C(T.PLUS,6),C(T.PM,5),C(T.PM,1)] },
  { name: 'MELCHIOR', tag: 'núcleo lógico', diff: 2,
    deck: [C(T.PM,6),C(T.PM,6),C(T.DOUBLE),C(T.DOUBLE),C(T.FLIP24),C(T.TIE,1),C(T.MINUS,6),C(T.PLUS,6),C(T.PM,5),C(T.FLIP36)] },
];

/* ── estado da tela ──────────────────────────────────────────────────────── */
const S = {
  wasm: null,
  view: 'home',
  mode: null,
  opp: null,
  order: [],
  step: 0,
  streak: 0,
  busy: false,
  pending: -1,
  deck: loadDeck(),
};

function loadDeck() {
  try {
    const raw = localStorage.getItem('pazaak.deck');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length === 10) return arr;
    }
  } catch (e) { /* sem storage, sem drama */ }
  return DEFAULT_DECK.slice();
}

const $ = (sel) => document.querySelector(sel);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── carregamento do wasm ────────────────────────────────────────────────── */
async function loadWasm() {
  let bytes = null;
  try {
    const res = await fetch('pazaak.wasm');
    if (res.ok) bytes = new Uint8Array(await res.arrayBuffer());
  } catch (e) { /* file:// cai no base64 */ }
  if (!bytes && window.PAZAAK_WASM_B64) {
    const bin = atob(window.PAZAAK_WASM_B64);
    bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  }
  if (!bytes) throw new Error('pazaak.wasm não encontrado');
  const { instance } = await WebAssembly.instantiate(bytes, {});
  return instance.exports;
}

/* ── navegação ───────────────────────────────────────────────────────────── */
function show(view) {
  S.view = view;
  for (const el of document.querySelectorAll('.view')) el.classList.add('hidden');
  const target = document.getElementById('view-' + view);
  if (target) target.classList.remove('hidden');
}

/* ── render da mesa ──────────────────────────────────────────────────────── */
function cardEl(code, extra = '') {
  const d = document.createElement('div');
  d.className = 'card ' + cardClass(code) + (extra ? ' ' + extra : '');
  d.textContent = cardLabel(code);
  return d;
}

function renderTable() {
  const w = S.wasm;
  if (!w) return;

  $('#p-cards').replaceChildren();
  const pn = w.pa_p_n();
  for (let i = 0; i < pn; i++) {
    const v = w.pa_p_card(i);
    const d = document.createElement('div');
    d.className = 'card main';
    d.textContent = v;
    $('#p-cards').appendChild(d);
  }

  $('#o-cards').replaceChildren();
  const on = w.pa_o_n();
  for (let i = 0; i < on; i++) {
    const v = w.pa_o_card(i);
    const d = document.createElement('div');
    d.className = 'card main';
    d.textContent = v;
    $('#o-cards').appendChild(d);
  }

  const ps = w.pa_p_sum(), os = w.pa_o_sum();
  const pSum = $('#p-sum'), oSum = $('#o-sum');
  pSum.textContent = ps;
  oSum.textContent = os;
  pSum.className = 'sum' + (ps > 20 ? ' bust' : ps === 20 ? ' twenty' : '');
  oSum.className = 'sum' + (os > 20 ? ' bust' : os === 20 ? ' twenty' : '');

  const last = w.pa_last();
  $('#last-card').textContent = last > 0 ? last : '—';

  const sets = `${w.pa_sets_p()} — ${w.pa_sets_o()}`;
  $('#set-score').textContent = sets;

  const phase = w.pa_phase();
  const turn = w.pa_turn();
  const tag = $('#turn-tag');
  if (tag) {
    tag.textContent =
      phase === 3 ? 'PARTIDA ENCERRADA' : phase === 2 ? 'SET ENCERRADO' :
      turn === 0 ? 'SUA VEZ' : 'VEZ DO OPONENTE';
  }
  const sideP = $('#side-p');
  const sideO = $('#side-o');
  if (sideP) sideP.classList.toggle('active', phase === 1 && turn === 0);
  if (sideO) sideO.classList.toggle('active', (phase === 0 || phase === 1) && turn === 1);

  renderHand();
  updateActions();

  const hint = $('#hint');
  if (hint) {
    let txt = '';
    if (S.mode === 'tutorial') {
      if (phase === 3) txt = '';
      else if (phase === 0 && turn === 0) txt = 'comprando…';
      else if (phase === 1 && turn === 0) {
        txt = w.pa_played() === 1
          ? 'carta jogada. encerrar turno compra outra; parar guarda o total.'
          : 'some com a mão se precisar, ou encerre o turno. passar de 20 estoura.';
      } else txt = 'o oponente joga. observe o total dele.';
    }
    hint.textContent = txt;
  }
}

function renderHand() {
  const w = S.wasm;
  const hand = $('#hand');
  hand.replaceChildren();
  const locked = w.pa_played() === 1;
  for (let i = 0; i < 4; i++) {
    const code = w.pa_hand(i);
    if (!code) {
      const empty = document.createElement('div');
      empty.className = 'card used';
      empty.textContent = '—';
      hand.appendChild(empty);
      continue;
    }
    const el = cardEl(code);
    if (locked) {
      el.classList.add('used');
    } else {
      if (S.pending === i) el.classList.add('chosen');
      el.addEventListener('click', () => onHandClick(i, code));
    }
    hand.appendChild(el);
  }
}

function updateActions() {
  const w = S.wasm;
  const mine = w.pa_phase() === 1 && w.pa_turn() === 0;
  $('#btn-end').disabled = !mine || S.pending >= 0;
  $('#btn-stand').disabled = !mine || S.pending >= 0;
  const panel = $('#sign-panel');
  if (panel) panel.classList.toggle('hidden', S.pending < 0);
}

/* ── ações do jogador ────────────────────────────────────────────────────── */
function onHandClick(i, code) {
  const w = S.wasm;
  if (w.pa_phase() !== 1 || w.pa_turn() !== 0) return;
  const t = code >> 4;
  if (t === T.PM || t === T.TIE) {
    S.pending = i;
    renderHand();
    updateActions();
    return;
  }
  playCard(i, 1);
}

function playCard(i, sign) {
  const w = S.wasm;
  S.pending = -1;
  const ok = w.pa_play_hand(i, sign);
  if (!ok) { renderTable(); return; }
  renderTable();
  if (w.pa_p_sum() === 20 || w.pa_p_n() >= 9) { setTimeout(() => stand(), 450); return; }
  updateActions();
}

function endTurn() {
  const w = S.wasm;
  S.pending = -1;
  if (!w.pa_end_turn()) return;
  log('você encerrou o turno');
  renderTable();
  loop();
}

function stand() {
  const w = S.wasm;
  S.pending = -1;
  if (!w.pa_stand()) return;
  log('você parou');
  renderTable();
  loop();
}

function log(msg) {
  const el = $('#log');
  if (el) el.textContent = msg;
}

/* ── laço de turnos ──────────────────────────────────────────────────────── */
async function loop() {
  if (S.busy) return;
  S.busy = true;
  try {
    let guard = 0;
    while (guard++ < 200) {
      const w = S.wasm;
      const phase = w.pa_phase();

      if (phase === 3) {
        S.busy = false;
        return matchOver();
      }
      if (phase === 2) {
        renderTable();
        const sw = w.pa_set_winner();
        const title = sw === 0 ? 'SET SEU' : sw === 1 ? 'SET DO OPONENTE' : 'EMPATE';
        await flash(title, '');
        w.pa_next_set();
        renderTable();
        continue;
      }
      if (phase === 0) {
        if (w.pa_turn() === 0) {
          w.pa_begin_turn();
          renderTable();
          log('você comprou');
          await wait(420);
          if (w.pa_p_sum() >= 20 || w.pa_p_n() >= 9) {
            w.pa_stand();
            renderTable();
            await wait(350);
            continue;
          }
          S.busy = false;
          return;
        }
        await wait(520);
        w.pa_ai_turn();
        renderTable();
        await wait(380);
        continue;
      }
      if (phase === 1) {
        S.busy = false;
        return;
      }
      break;
    }
  } finally {
    S.busy = false;
  }
}

function flash(title, sub) {
  const b = $('#banner');
  b.querySelector('.banner-title').textContent = title;
  b.querySelector('.banner-sub').textContent = sub;
  b.querySelector('#banner-btn').classList.add('hidden');
  b.classList.remove('hidden');
  return wait(1200).then(() => b.classList.add('hidden'));
}

function banner(title, sub, btnLabel, onBtn) {
  const b = $('#banner');
  b.querySelector('.banner-title').textContent = title;
  b.querySelector('.banner-sub').textContent = sub;
  const btn = b.querySelector('#banner-btn');
  btn.textContent = btnLabel;
  btn.classList.remove('hidden');
  btn.onclick = () => { b.classList.add('hidden'); onBtn(); };
  b.classList.remove('hidden');
}

function matchOver() {
  const w = S.wasm;
  const win = w.pa_match_winner() === 0;
  renderTable();

  if (S.mode === 'campaign') {
    if (win) {
      banner('FASE LIMPA', `${S.opp.name} derrotado`, 'PRÓXIMO', () => {
        S.step++;
        if (S.step >= OPPONENTS.length) {
          banner('CAMPANHA CONCLUÍDA', 'os dez caíram', 'VOLTAR AO INÍCIO', () => goHome());
        } else {
          startCampaignMatch();
        }
      });
    } else {
      banner('DERROTA', `${S.opp.name} levou a melhor`, 'TENTAR DE NOVO', () => startCampaignMatch());
    }
    return;
  }

  if (S.mode === 'challenge') {
    if (win) {
      S.streak++;
      banner('VITÓRIA', `sequência: ${S.streak}`, 'PRÓXIMO DESAFIANTE', () => startChallengeMatch());
    } else {
      const streak = S.streak;
      S.streak = 0;
      banner('FIM DA LINHA', `você parou em ${streak} ${streak === 1 ? 'vitória' : 'vitórias'}`, 'RECOMEÇAR', () => {
        startChallengeMatch();
      });
    }
    return;
  }

  banner(win ? 'VITÓRIA' : 'DERROTA', '', 'VOLTAR', () => goHome());
}

/* ── partidas ────────────────────────────────────────────────────────────── */
function seedNow() {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}

function prepareMatch(opp) {
  S.opp = opp;
  S.pending = -1;
  const w = S.wasm;
  for (let i = 0; i < 10; i++) {
    w.pa_set_deck(i, S.deck[i] || 0);
    w.pa_set_opp_deck(i, opp.deck[i] || 0);
  }
  $('#opp-name').textContent = opp.name;
  show('game');
  w.pa_start_match(seedNow(), opp.diff);
  renderTable();
  log('set 1 — ' + opp.name);
  loop();
}

function startCampaignMatch() {
  S.opp = OPPONENTS[S.order[S.step]];
  prepareMatch(S.opp);
  renderLadder();
}

function startChallengeMatch() {
  const diff = Math.min(2, Math.floor(S.streak / 3));
  const pool = OPPONENTS.filter((o) => o.diff <= diff);
  const opp = pool[Math.floor(Math.random() * pool.length)];
  prepareMatch(opp);
}

function goHome() {
  show('home');
  S.mode = null;
  S.opp = null;
}

/* ── campanha ────────────────────────────────────────────────────────────── */
function startCampaign() {
  S.mode = 'campaign';
  S.step = 0;
  S.order = OPPONENTS.map((_, i) => i);
  for (let i = S.order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [S.order[i], S.order[j]] = [S.order[j], S.order[i]];
  }
  renderLadder();
  show('campaign');
  startCampaignMatch();
}

function renderLadder() {
  const ul = $('#ladder');
  ul.replaceChildren();
  S.order.forEach((idx, i) => {
    const o = OPPONENTS[idx];
    const li = document.createElement('li');
    li.className = i < S.step ? 'done' : i === S.step ? 'current' : '';
    li.innerHTML = `<span class="stage">${String(i + 1).padStart(2, '0')}</span>
      <span class="who">${o.name}</span>
      <span class="tag">${i < S.step ? 'VENCIDO' : i === S.step ? 'EM CURSO' : o.tag}</span>`;
    ul.appendChild(li);
  });
  $('#camp-progress').textContent = `${S.step} / ${OPPONENTS.length}`;
}

/* ── deck builder ────────────────────────────────────────────────────────── */
const draft = new Map();

function openDeck() {
  draft.clear();
  for (const c of S.deck) draft.set(c, (draft.get(c) || 0) + 1);
  renderDeck();
  show('deck');
}

function deckTotal() {
  let n = 0;
  for (const v of draft.values()) n += v;
  return n;
}

function renderDeck() {
  const grid = $('#deck-grid');
  grid.replaceChildren();
  for (const card of POOL) {
    const n = draft.get(card.code) || 0;
    const cell = document.createElement('div');
    cell.className = 'deck-cell';
    cell.appendChild(cardEl(card.code));
    const qty = document.createElement('div');
    qty.className = 'qty';
    const minus = document.createElement('button');
    minus.textContent = '−';
    minus.disabled = n === 0;
    minus.onclick = () => { setCount(card.code, n - 1); };
    const plus = document.createElement('button');
    plus.textContent = '+';
    plus.disabled = n >= 2 || deckTotal() >= 10;
    plus.onclick = () => { setCount(card.code, n + 1); };
    const num = document.createElement('span');
    num.className = 'n';
    num.textContent = n;
    qty.append(minus, num, plus);
    cell.appendChild(qty);
    grid.appendChild(cell);
  }
  const total = deckTotal();
  $('#deck-count').textContent = `${total} / 10`;
  $('#btn-deck-save').disabled = total !== 10;
}

function setCount(code, n) {
  if (n <= 0) draft.delete(code);
  else if (n <= 2 && deckTotal() + (draft.has(code) ? 0 : 1) <= 10) draft.set(code, n);
  renderDeck();
}

function saveDeck() {
  const arr = [];
  for (const [code, n] of draft) for (let i = 0; i < n; i++) arr.push(code);
  if (arr.length !== 10) return;
  S.deck = arr;
  try { localStorage.setItem('pazaak.deck', JSON.stringify(arr)); } catch (e) {}
  show('home');
}

/* ── boot ────────────────────────────────────────────────────────────────── */
function bind() {
  for (const btn of document.querySelectorAll('[data-mode]')) {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'tutorial') {
        S.mode = 'tutorial';
        prepareMatch(OPPONENTS[0]);
      } else if (mode === 'campaign') {
        startCampaign();
      } else if (mode === 'challenge') {
        S.mode = 'challenge';
        S.streak = 0;
        startChallengeMatch();
      }
    });
  }

  $('#btn-deck').addEventListener('click', openDeck);
  $('#btn-deck-save').addEventListener('click', saveDeck);
  $('#btn-deck-reset').addEventListener('click', () => {
    draft.clear();
    for (const c of DEFAULT_DECK) draft.set(c, (draft.get(c) || 0) + 1);
    renderDeck();
  });

  for (const b of document.querySelectorAll('[data-back]')) {
    b.addEventListener('click', () => {
      if (S.view === 'game') { goHome(); return; }
      if (S.view === 'deck') { show('home'); return; }
      if (S.view === 'campaign') { goHome(); return; }
      show('home');
    });
  }

  $('#btn-end').addEventListener('click', endTurn);
  $('#btn-stand').addEventListener('click', stand);

  $('#btn-rules').addEventListener('click', () => $('#modal-rules').classList.remove('hidden'));
  $('#btn-rules-close').addEventListener('click', () => $('#modal-rules').classList.add('hidden'));
  $('#modal-rules').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rules') $('#modal-rules').classList.add('hidden');
  });

  const panel = document.createElement('div');
  panel.id = 'sign-panel';
  panel.className = 'actions hidden';
  panel.innerHTML = `
    <button class="act" data-sg="1">SOMAR</button>
    <button class="act" data-sg="-1">SUBTRAIR</button>
    <button class="act act-alt" data-sg="0">CANCELAR</button>`;
  document.querySelector('.hand-wrap').after(panel);
  panel.addEventListener('click', (e) => {
    const sg = e.target.dataset.sg;
    if (sg === undefined) return;
    if (sg === '0') { S.pending = -1; renderTable(); return; }
    playCard(S.pending, Number(sg));
  });
}

async function boot() {
  try {
    S.wasm = await loadWasm();
  } catch (e) {
    document.body.innerHTML =
      `<pre style="padding:40px;color:#ff4136">falha ao carregar o motor:\n${e.message}</pre>`;
    return;
  }
  bind();
  show('home');
}

boot();

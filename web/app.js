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
  C(T.PLUS, 1), C(T.MINUS, 2), C(T.PLUS, 2), C(T.MINUS, 1), C(T.MINUS, 5),
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

/* ── fala fixa de cada oponente (chave do dicionário) ────────────────────── */
const OPP_LINES = {
  'K-7 · FERRO-VELHO': 'opp.k7',
  'VEX CORREL': 'opp.vex',
  'SARNA VELL': 'opp.sarna',
  'DORN KALEK': 'opp.dorn',
  'ILYRA SAN': 'opp.ilyra',
  'BRASK ORDO': 'opp.brask',
  'NIMA TESH': 'opp.nima',
  'HASK VORN': 'opp.hask',
  'ZETH ARU': 'opp.zeth',
  'MELCHIOR': 'opp.melchior',
};

/* ── tutorial: semente, decks e oponente fixos ───────────────────────────── */
const TUTORIAL = {
  seed: 626,
  deck: [
    C(T.PLUS, 4), C(T.PLUS, 2), C(T.MINUS, 3), C(T.PM, 2), C(T.PLUS, 5),
    C(T.MINUS, 1), C(T.PLUS, 1), C(T.MINUS, 2), C(T.PLUS, 3), C(T.PM, 1),
  ],
  oppDeck: [
    C(T.PLUS, 1), C(T.PLUS, 2), C(T.PLUS, 3), C(T.PLUS, 4), C(T.MINUS, 1),
    C(T.MINUS, 2), C(T.PM, 1), C(T.PM, 2), C(T.PLUS, 5), C(T.MINUS, 3),
  ],
};

const TUTORIAL_OPP = { name: 'K-7 · FERRO-VELHO', tag: 'instrutor', diff: 0, deck: TUTORIAL.oppDeck };

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
  reentry: false,
  paused: false,
  pending: -1,
  coinPending: false,
  deck: loadDeck(),
  clock: { id: null, end: 0 },
};

function loadDeck() {
  try {
    const raw = localStorage.getItem('pazaak.deck.v2');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length === 10) return arr;
    }
  } catch (e) { /* sem storage, sem drama */ }
  return DEFAULT_DECK.slice();
}

const $ = (sel) => document.querySelector(sel);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── som sintetizado (sem arquivo, sem licença, alguns bytes de código) ──── */
const sfx = {
  ctx: null,
  muted: false,

  init() {
    try { this.muted = localStorage.getItem('pazaak.mute') === '1'; } catch (e) { /* ok */ }
    this.paintMute();
  },

  ctxGet() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  tone(freq, dur, type = 'square', vol = 0.04, delay = 0) {
    if (this.muted) return;
    const ctx = this.ctxGet();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  },

  seq(notes, step, type, vol) {
    notes.forEach((f, i) => this.tone(f, step * 1.4, type, vol, i * step));
  },

  click() { this.tone(190, 0.045, 'square', 0.025); },
  select() { this.seq([440, 660], 0.07, 'triangle', 0.04); },
  boot() { this.seq([262, 392, 523], 0.12, 'sine', 0.035); },
  card() { this.tone(330, 0.05, 'triangle', 0.045); this.tone(247, 0.07, 'triangle', 0.035, 0.045); },
  coin() { this.tone(900, 0.05, 'square', 0.03); this.tone(1360, 0.09, 'sine', 0.025, 0.02); },
  setWin() { this.seq([523, 784], 0.09, 'triangle', 0.05); },
  setLose() { this.seq([392, 262], 0.11, 'sawtooth', 0.04); },
  tie() { this.tone(440, 0.18, 'sine', 0.045); },
  matchWin() { this.seq([523, 659, 784, 1046], 0.11, 'triangle', 0.05); },
  matchLose() { this.seq([392, 330, 262, 196], 0.13, 'sawtooth', 0.04); },

  toggle() {
    this.muted = !this.muted;
    try { localStorage.setItem('pazaak.mute', this.muted ? '1' : '0'); } catch (e) { /* ok */ }
    this.paintMute();
    if (!this.muted) this.click();
  },

  /* O navegador bloqueia áudio antes do primeiro gesto. Se o contexto nascer
     suspenso, o som de abertura fica armado para o primeiro clique/tecla. */
  bootOnLoad() {
    if (this.booted) return 'ja';
    this.booted = true;
    const ctx = this.ctxGet();
    if (!ctx || ctx.state !== 'running') {
      const arm = () => {
        window.removeEventListener('pointerdown', arm);
        window.removeEventListener('keydown', arm);
        this.boot();
      };
      window.addEventListener('pointerdown', arm, { once: true });
      window.addEventListener('keydown', arm, { once: true });
      return 'armado';
    }
    this.boot();
    return 'tocado';
  },

  paintMute() {
    const btn = $('#btn-mute');
    if (!btn) return;
    btn.textContent = this.muted ? '✕' : '♪';
    btn.classList.toggle('muted', this.muted);
    btn.setAttribute('aria-label', this.muted ? 'som desligado' : 'som ligado');
    const tog = $('#audio-menu [data-audio="toggle"]');
    if (tog) tog.textContent = this.muted ? t('audio.unmute') : t('audio.mute');
  },

  /* Teste toca mesmo se estiver mudo, e devolve o estado depois. */
  testThree() {
    const wasMuted = this.muted;
    this.muted = false;
    for (let i = 0; i < 3; i++) setTimeout(() => this.click(), i * 230);
    setTimeout(() => { this.muted = wasMuted; }, 900);
  },
};

/* ── relógio do turno (10s, aviso a partir de 6s, pausável) ──────────────── */
const TURN_MS = 10000;
const WARN_MS = 6000;

function clockPaint(left) {
  const box = $('#turn-clock');
  const view = $('#view-game');
  if (!box) return;
  const elapsed = TURN_MS - Math.max(0, left);
  const fill = $('#clock-fill');
  if (fill) fill.style.transform = `scaleX(${Math.max(0, left / TURN_MS)})`;
  const label = $('#clock-label');
  if (label) label.textContent = Math.max(0, Math.ceil(left / 1000)) + 's';
  const alert = Math.max(0, Math.min(1, (elapsed - WARN_MS) / (TURN_MS - WARN_MS)));
  if (view) view.style.setProperty('--alert', alert.toFixed(3));
  box.classList.toggle('urgent', elapsed >= WARN_MS);
}

function clockPauseBtn() {
  const btn = $('#btn-pause');
  if (!btn) return;
  btn.textContent = S.paused ? '▶' : 'II';
  btn.classList.toggle('paused', S.paused);
  btn.setAttribute('aria-label', S.paused ? 'retomar o jogo' : 'pausar o jogo');
}

function clockRun() {
  if (S.clock.id) clearInterval(S.clock.id);
  S.clock.id = setInterval(() => {
    if (S.paused) return;
    const left = S.clock.end - performance.now();
    clockPaint(left);
    if (left <= 0) {
      stopClock();
      turnTimeout();
    }
  }, 100);
}

function stopClock() {
  if (S.clock.id) { clearInterval(S.clock.id); S.clock.id = null; }
  S.clock.end = 0;
  S.clock.left = TURN_MS;
  const view = $('#view-game');
  if (view) view.style.setProperty('--alert', '0');
  const box = $('#turn-clock');
  if (box) { box.classList.add('hidden'); box.classList.remove('urgent'); }
  const fill = $('#clock-fill');
  if (fill) fill.style.transform = 'scaleX(1)';
}

function startClock() {
  stopClock();
  const box = $('#turn-clock');
  if (!box) return;
  box.classList.remove('hidden');
  S.clock.left = TURN_MS;
  S.clock.end = performance.now() + TURN_MS;
  clockPaint(TURN_MS);
  if (!S.paused) clockRun();
}

function setPaused(on) {
  if (S.paused === on) return;
  S.paused = on;
  const c = S.clock;
  if (on) {
    c.wasRunning = !!c.id;
    if (c.id) {
      c.left = Math.max(0, c.end - performance.now());
      clearInterval(c.id);
      c.id = null;
    }
  } else {
    if (c.wasRunning && !$('#turn-clock').classList.contains('hidden')) {
      c.end = performance.now() + c.left;
      clockRun();
    }
    c.wasRunning = false;
    loop();
  }
  clockPauseBtn();
}

function togglePause() {
  if (S.view !== 'game' || !S.wasm) return;
  if (S.wasm.pa_phase() === 3) return;
  setPaused(!S.paused);
}

async function pauseGate() {
  while (S.paused && S.view === 'game') await wait(120);
}

function turnTimeout() {
  const w = S.wasm;
  if (w.pa_phase() !== 1 || w.pa_turn() !== 0) return;
  S.pending = -1;
  w.pa_end_turn();
  renderTable();
  log(t('log.timeout'));
  loop();
}

function aiDelay() {
  const w = S.wasm;
  const behind = w.pa_sets_o() < w.pa_sets_p() || w.pa_o_sum() < w.pa_p_sum();
  let ms = 1500 + Math.random() * 1100;
  if (behind) ms += 800 + Math.random() * 2000;
  return Math.min(TURN_MS, Math.round(ms));
}

/* ── balão de ajuda (cartas e cabeçalho) ─────────────────────────────────── */
let tipPinned = false;

function hideTip() {
  tipPinned = false;
  const box = $('#tipbox');
  if (box) box.classList.remove('on');
}

function positionTip(el) {
  const box = $('#tipbox');
  if (!box) return;
  const r = el.getBoundingClientRect();
  const bw = box.offsetWidth;
  const bh = box.offsetHeight;
  let left = r.left + r.width / 2 - bw / 2;
  left = Math.max(8, Math.min(window.innerWidth - bw - 8, left));
  let top = r.top - bh - 10;
  if (top < 8) top = r.bottom + 10;
  box.style.left = Math.round(left) + 'px';
  box.style.top = Math.round(top) + 'px';
}

function showTip(el, parts) {
  const box = $('#tipbox');
  if (!box) return;
  box.replaceChildren();
  if (parts.head) {
    const h = document.createElement('div');
    h.className = 'tip-head';
    h.textContent = parts.head;
    box.appendChild(h);
  }
  if (parts.body) {
    const b = document.createElement('div');
    b.textContent = parts.body;
    box.appendChild(b);
  }
  if (parts.adv) {
    const a = document.createElement('span');
    a.className = 'adv';
    a.textContent = parts.adv;
    box.appendChild(a);
  }
  if (parts.items && parts.items.length) {
    const list = document.createElement('div');
    list.className = 'tip-list';
    for (const item of parts.items) {
      const row = document.createElement('div');
      row.className = 'tip-row' + (item.dim ? ' dim' : '');
      const name = document.createElement('span');
      name.textContent = item.text;
      row.appendChild(name);
      if (item.tag) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = item.tag;
        row.appendChild(tag);
      }
      list.appendChild(row);
    }
    box.appendChild(list);
  }
  box.classList.add('on');
  positionTip(el);
}

function attachTip(el, provider, opts = {}) {
  if (!el) return;
  const get = () => (typeof provider === 'function' ? provider() : provider);
  el.addEventListener('mouseenter', () => { if (!tipPinned) showTip(el, get()); });
  el.addEventListener('mouseleave', () => { if (!tipPinned) hideTip(); });
  el.addEventListener('focus', () => showTip(el, get()));
  el.addEventListener('blur', () => { if (!tipPinned) hideTip(); });
  if (opts.tabbable) el.tabIndex = 0;
  if (opts.pin) {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (tipPinned) { hideTip(); return; }
      tipPinned = true;
      showTip(el, get());
    });
  }
}

function opponentTip() {
  const opp = S.opp;
  if (!opp) return { head: 'oponente', body: '' };
  const short = opp.name.split('·')[0].trim();
  const parts = { head: short, body: t(OPP_LINES[opp.name] || 'opp.k7') };
  if (S.mode === 'campaign' && S.order.length) {
    parts.items = S.order.map((idx, i) => {
      const o = OPPONENTS[idx];
      const done = i < S.step;
      return {
        text: String(i + 1).padStart(2, '0') + ' ' + o.name.split('·')[0].trim(),
        tag: done ? t('tip.opp.won') : i === S.step ? t('tip.opp.now') : '',
        dim: done,
      };
    });
  }
  return parts;
}

function cardTip(code) {
  const ct = code >> 4;
  const v = code & 0xF;
  const adv = t('card.tip.advanced');
  switch (ct) {
    case T.PLUS:
      return { head: '+' + v, body: t('card.tip.plus', { v }) };
    case T.MINUS:
      return { head: '−' + v, body: t('card.tip.minus', { v }) };
    case T.PM:
      return { head: '±' + v, body: t('card.tip.pm', { v }) };
    case T.FLIP24:
      return { head: '2&4', body: t('card.tip.flip24'), adv };
    case T.FLIP36:
      return { head: '3&6', body: t('card.tip.flip36'), adv };
    case T.DOUBLE:
      return { head: '2×', body: t('card.tip.double'), adv };
    case T.TIE:
      return { head: 'TIE', body: t('card.tip.tie'), adv };
    default:
      return { head: cardLabel(code), body: '' };
  }
}

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
  paintLink();
}

/* telemetria do rodapé: o "link" acompanha a tela/modo em uso */
const LINK_VIEW = { home: '00', campaign: '02', deck: '04', game: null };
const LINK_MODE = { tutorial: '01', campaign: '02', challenge: '03' };

function paintLink() {
  const el = $('#link-id');
  if (!el) return;
  let n;
  if (S.view === 'game') n = LINK_MODE[S.mode] || '00';
  else n = LINK_VIEW[S.view] || '00';
  el.textContent = n;
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
  pSum.className = 'sum p' + (ps > 20 ? ' bust' : ps === 20 ? ' twenty' : '');
  oSum.className = 'sum o' + (os > 20 ? ' bust' : os === 20 ? ' twenty' : '');

  const last = w.pa_last();
  $('#last-card').textContent = last > 0 ? last : '—';

  const phase = w.pa_phase();
  const turn = w.pa_turn();

  const pips = (el, n) => {
    if (!el) return;
    el.replaceChildren();
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('span');
      d.className = 'pip' + (i < n ? ' on' : '');
      el.appendChild(d);
    }
  };
  pips($('#p-pips'), w.pa_sets_p());
  pips($('#o-pips'), w.pa_sets_o());

  const setIdx = $('#set-index');
  if (setIdx) setIdx.textContent = t('ui.set', { n: w.pa_set_no() });

  const waiting = (phase === 0 || phase === 1) && turn === 1;
  const gameView = $('#view-game');
  if (gameView) gameView.classList.toggle('waiting', waiting);

  const myTurn = phase === 1 && turn === 0;
  if (S.mode === 'tutorial') {
    if (S.clock.id) stopClock();
  } else if (myTurn && !S.clock.id) startClock();
  else if (!myTurn && S.clock.id) stopClock();

  const tag = $('#turn-tag');
  if (tag) {
    const short = S.opp && S.opp.name ? S.opp.name.split('·')[0].trim() : 'oponente';
    tag.textContent =
      phase === 3 ? t('ui.matchOver') : phase === 2 ? t('ui.setOver') :
      turn === 0 ? t('ui.yourTurn') : t('ui.oppTurn', { name: short });
    tag.classList.toggle('mine', phase === 1 && turn === 0);
  }
  const sideP = $('#side-p');
  const sideO = $('#side-o');
  if (sideP) sideP.classList.toggle('active', phase === 1 && turn === 0);
  if (sideO) sideO.classList.toggle('active', (phase === 0 || phase === 1) && turn === 1);

  renderHand();
  updateActions();
  renderGuide(phase, turn);
}

/* ── tutorial: mensagem + destaque do próximo clique ─────────────────────── */
let guideTarget = null;

function setGuide(el) {
  const arrow = $('#guide-arrow');
  if (guideTarget === el) {
    if (el) positionArrow(el);
    return;
  }
  if (guideTarget) guideTarget.classList.remove('guide');
  guideTarget = el;
  if (!el) { if (arrow) arrow.classList.remove('on'); return; }
  el.classList.add('guide');
  if (arrow) {
    arrow.classList.add('on');
    positionArrow(el);
  }
}

function positionArrow(el) {
  const arrow = $('#guide-arrow');
  if (!arrow) return;
  const r = el.getBoundingClientRect();
  const w = arrow.offsetWidth || 90;
  const h = arrow.offsetHeight || 30;
  const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
  // encosta a ponta dentro do alvo para não pairar sobre o elemento vizinho
  let top = r.top - h + 7;
  const flip = top < 8;
  if (flip) top = r.bottom - 7;
  arrow.classList.toggle('flip', flip);
  arrow.style.left = Math.round(left) + 'px';
  arrow.style.top = Math.round(top) + 'px';
}

function renderGuide(phase, turn) {
  const hint = $('#hint');
  const tut = S.mode === 'tutorial';
  hint?.classList.toggle('guided', tut);
  if (!tut) { setGuide(null); if (hint) hint.textContent = ''; return; }

  const w = S.wasm;
  let text = '';
  let target = null;

  if (w.pa_set_no() > 1) {
    text = t('tut.afterFirst');
  } else if (phase === 3) {
    text = '';
  } else if (phase === 2) {
    text = t('tut.setEnd');
  } else if (phase === 0 && turn === 1) {
    text = t('tut.opponent');
    target = null;
  } else if (phase === 1 && turn === 0) {
    if (w.pa_played() === 1) {
      text = t('tut.played');
      target = $('#btn-stand');
    } else if (w.pa_p_sum() === 16) {
      text = t('tut.sixteen');
      target = document.querySelector('#hand .card[data-code="4"]');
    } else {
      text = w.pa_set_no() === 1 && w.pa_sets_p() === 1 ? t('tut.bonus') : t('tut.draw');
      target = $('#btn-end');
    }
  } else {
    text = t('tut.generic');
  }

  if (hint) hint.textContent = text;
  setGuide(target);
}

function renderHand() {
  const w = S.wasm;
  const hand = $('#hand');
  hand.replaceChildren();
  const locked = w.pa_phase() === 1 && w.pa_turn() === 0 && w.pa_played() === 1;
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
    el.dataset.code = String(code);
    attachTip(el, () => cardTip(code), { tabbable: true });
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
  const pause = $('#btn-pause');
  if (pause) pause.disabled = S.view !== 'game' || w.pa_phase() === 3;
  clockPauseBtn();
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
  sfx.card();
  renderTable();
  if (w.pa_p_sum() === 20 || w.pa_p_n() >= 9) { setTimeout(() => stand(), 450); return; }
  updateActions();
}

function endTurn() {
  const w = S.wasm;
  S.pending = -1;
  if (!w.pa_end_turn()) return;
  log(t('log.youEnd'));
  renderTable();
  loop();
}

function stand() {
  const w = S.wasm;
  S.pending = -1;
  if (!w.pa_stand()) return;
  log(t('log.youStand'));
  renderTable();
  loop();
}

const LOG = [];

function log(msg) {
  LOG.push(msg);
  if (LOG.length > 3) LOG.shift();
  const el = $('#log');
  if (!el) return;
  el.replaceChildren();
  LOG.forEach((m, i) => {
    const line = document.createElement('div');
    line.textContent = m;
    if (i === LOG.length - 1) line.className = 'last';
    el.appendChild(line);
  });
}

/* ── laço de turnos ──────────────────────────────────────────────────────── */
async function loop() {
  if (S.busy) { S.reentry = true; return; }
  S.busy = true;
  try {
    for (;;) {
      if (S.view !== 'game') return;
      await pauseGate();
      const w = S.wasm;
      const phase = w.pa_phase();

      if (phase === 3) { matchOver(); return; }

      if (phase === 2) {
        renderTable();
        const sw = w.pa_set_winner();
        const name = S.opp && S.opp.name ? S.opp.name.split('·')[0].trim() : 'oponente';
        const note = t('set.score', { p: w.pa_sets_p(), o: w.pa_sets_o(), name });
        let title;
        if (sw === 0) { title = t('set.win'); sfx.setWin(); }
        else if (sw === 1) { title = t('set.lose', { name }); sfx.setLose(); }
        else { title = t('set.tie'); sfx.tie(); }
        await flash(title, setResultLine(sw), note);
        if (S.view !== 'game') return;
        w.pa_next_set();
        renderTable();
        log(t('log.setFresh', { n: w.pa_set_no() }));
        continue;
      }

      if (phase === 0) {
        if (w.pa_turn() === 0) {
          w.pa_begin_turn();
          renderTable();
          log(t('log.youDraw'));
          await wait(420);
          continue; // estado pode ter mudado durante a animação
        }
        await wait(aiDelay());
        if (S.view !== 'game') return;
        await pauseGate();
        w.pa_ai_turn();
        const act = w.pa_log();
        if (act === 2) sfx.card();
        log(act === 2 ? t('log.oppCard') : act === 3 ? t('log.oppStand') : t('log.oppEnd'));
        renderTable();
        await wait(380);
        continue;
      }

      // phase 1
      if (w.pa_turn() !== 0) { await wait(200); continue; }
      if (w.pa_p_sum() >= 20 || w.pa_p_n() >= 9) {
        w.pa_stand();
        renderTable();
        await wait(350);
        continue;
      }
      return; // sua vez: espera ação
    }
  } finally {
    S.busy = false;
    if (S.reentry) { S.reentry = false; loop(); }
  }
}

function flash(title, sub, note) {
  const b = $('#banner');
  b.querySelector('.banner-title').textContent = title;
  b.querySelector('.banner-sub').textContent = sub || '';
  const noteEl = b.querySelector('.banner-note');
  if (noteEl) {
    noteEl.textContent = note || '';
    noteEl.classList.toggle('hidden', !note);
  }
  b.querySelector('#banner-btn').classList.add('hidden');
  b.classList.remove('hidden');
  return wait(2100).then(() => b.classList.add('hidden'));
}

function setResultLine(sw) {
  const w = S.wasm;
  const ps = w.pa_p_sum();
  const os = w.pa_o_sum();
  const nome = S.opp && S.opp.name ? S.opp.name.split('·')[0].trim() : 'oponente';
  const pBust = ps > 20;
  const oBust = os > 20;
  const pFull = w.pa_p_n() >= 9;
  const oFull = w.pa_o_n() >= 9;

  if (sw === 0) {
    if (oBust) return t('set.oppBust', { p: ps, o: os, name: nome });
    if (pFull) return t('set.fullYou', { p: ps, o: os, name: nome });
    return t('set.bothStand', { p: ps, o: os, name: nome });
  }
  if (sw === 1) {
    if (pBust) return t('set.youBust', { p: ps, o: os, name: nome });
    if (oFull) return t('set.fullOpp', { p: ps, o: os, name: nome });
    return t('set.bothStand', { p: ps, o: os, name: nome });
  }
  return t('set.tieLine', { p: ps, o: os, name: nome });
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
  if (win) sfx.matchWin(); else sfx.matchLose();
  renderTable();

  if (S.mode === 'campaign') {
    if (win) {
      banner(t('campaign.stageClear'), t('campaign.stageClearSub', { name: S.opp.name, n: w.pa_sets_p() }), t('campaign.next'), () => {
        S.step++;
        if (S.step >= OPPONENTS.length) {
          banner(t('campaign.cleared'), t('campaign.clearedSub'), t('campaign.home'), () => goHome());
        } else {
          startCampaignMatch();
        }
      });
    } else {
      banner(t('campaign.defeat'), t('campaign.defeatSub', { name: S.opp.name }), t('campaign.retry'), () => startCampaignMatch());
    }
    return;
  }

  if (S.mode === 'challenge') {
    if (win) {
      S.streak++;
      banner(t('challenge.win'), t('challenge.winSub', { n: S.streak }), t('challenge.next'), () => startChallengeMatch());
    } else {
      const streak = S.streak;
      S.streak = 0;
      banner(t('challenge.over'), t('challenge.overSub', { n: streak }), t('challenge.restart'), () => {
        startChallengeMatch();
      });
    }
    return;
  }

  banner(win ? t('challenge.win') : t('campaign.defeat'), '', t('ui.back'), () => goHome());
}

/* ── partidas ────────────────────────────────────────────────────────────── */
function seedNow() {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
}

function blankTable() {
  stopClock();
  for (const id of ['#p-cards', '#o-cards', '#p-pips', '#o-pips']) {
    const el = $(id);
    if (el) el.replaceChildren();
  }
  const ps = $('#p-sum');
  const os = $('#o-sum');
  if (ps) { ps.textContent = '0'; ps.className = 'sum p'; }
  if (os) { os.textContent = '0'; os.className = 'sum o'; }
  const last = $('#last-card');
  if (last) last.textContent = '—';
  const tag = $('#turn-tag');
  if (tag) { tag.textContent = t('ui.shuffle'); tag.classList.remove('mine'); }
  const setIdx = $('#set-index');
  if (setIdx) setIdx.textContent = t('ui.set', { n: 1 });
  const hand = $('#hand');
  if (hand) {
    hand.replaceChildren();
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      d.className = 'card used';
      d.textContent = '—';
      hand.appendChild(d);
    }
  }
  const logEl = $('#log');
  if (logEl) logEl.replaceChildren();
  const view = $('#view-game');
  if (view) view.classList.remove('waiting');
  const hint = $('#hint');
  if (hint) hint.textContent = '';
}

function openCoin() {
  const modal = $('#coin-modal');
  if (!modal) { startWithFirst(0); return; }
  const coin = $('#coin');
  const line = $('#coin-line');
  const actions = $('#coin-actions');
  S.coinPending = true;
  coin.style.transition = 'none';
  coin.style.transform = 'rotateY(0deg)';
  void coin.offsetWidth;
  coin.style.transition = '';
  line.textContent = t('coin.pick');
  actions.classList.remove('hidden');
  modal.classList.remove('hidden');
}

function resolveCoin(pick) {
  if (!S.coinPending) return;
  S.coinPending = false;
  const coin = $('#coin');
  const line = $('#coin-line');
  const actions = $('#coin-actions');
  actions.classList.add('hidden');

  const side = Math.random() < 0.5 ? 0 : 1; // 0 = cara (república), 1 = coroa (império)
  const won = side === pick;
  sfx.coin();

  coin.style.transform = `rotateY(${5 * 360 + (side === 1 ? 180 : 0)}deg)`;
  line.textContent = t('coin.spin');

  setTimeout(() => {
    const face = side === 0 ? t('coin.headsFace') : t('coin.tailsFace');
    const rival = S.opp ? S.opp.name.split('·')[0].trim() : 'oponente';
    line.textContent = `${face} · ${won ? t('coin.youStart') : t('coin.oppStarts', { name: rival })}`;
    setTimeout(() => {
      const modal = $('#coin-modal');
      if (modal) modal.classList.add('hidden');
      startWithFirst(won ? 0 : 1);
    }, 1100);
  }, 1300);
}

function startWithFirst(first) {
  if (S.view !== 'game' || !S.opp) return;
  const w = S.wasm;
  const tut = S.mode === 'tutorial';
  w.pa_start_match(tut ? TUTORIAL.seed : seedNow(), S.opp.diff, first);
  if (tut) {
    // aula: o set de vantagem é dado, não conquistado
    w.pa_grant_set(0);
    log(t('log.bonus'));
  }
  renderTable();
  log(t('log.setStart', { n: 1, name: S.opp.name }));
  loop();
}

function prepareMatch(opp) {
  S.opp = opp;
  S.pending = -1;
  S.coinPending = false;
  S.reentry = false;
  LOG.length = 0;
  const tut = S.mode === 'tutorial';
  const w = S.wasm;
  for (let i = 0; i < 10; i++) {
    w.pa_set_deck(i, tut ? TUTORIAL.deck[i] : (S.deck[i] || 0));
    w.pa_set_opp_deck(i, tut ? TUTORIAL.oppDeck[i] : (opp.deck[i] || 0));
  }
  $('#opp-name').textContent = opp.name;
  show('game');
  blankTable();
  if (tut) startWithFirst(0);
  else openCoin();
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

function openAudioMenu() {
  const menu = $('#audio-menu');
  const btn = $('#btn-mute');
  if (!menu || !btn) return;
  const r = btn.getBoundingClientRect();
  menu.classList.remove('hidden');
  const w = menu.offsetWidth || 158;
  const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w));
  menu.style.left = Math.round(left) + 'px';
  menu.style.top = Math.round(r.bottom + 8) + 'px';
  sfx.paintMute();
}

function closeAudioMenu() {
  const menu = $('#audio-menu');
  if (menu) menu.classList.add('hidden');
}

function toggleAudioMenu() {
  const menu = $('#audio-menu');
  if (!menu) return;
  if (menu.classList.contains('hidden')) openAudioMenu();
  else closeAudioMenu();
}

/* ── menu de idiomas ─────────────────────────────────────────────────────── */
function buildLangMenu() {
  const menu = $('#lang-menu');
  if (!menu) return;
  menu.replaceChildren();
  for (const lang of LANGS) {
    const b = document.createElement('button');
    b.dataset.lang = lang.code;
    b.textContent = lang.label;
    if (lang.code === currentLang()) b.classList.add('active');
    menu.appendChild(b);
  }
}

function openLangMenu() {
  const menu = $('#lang-menu');
  const btn = $('#btn-lang');
  if (!menu || !btn) return;
  buildLangMenu();
  const r = btn.getBoundingClientRect();
  menu.classList.remove('hidden');
  const w = menu.offsetWidth || 158;
  const left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w));
  menu.style.left = Math.round(left) + 'px';
  menu.style.top = Math.round(r.bottom + 8) + 'px';
}

function closeLangMenu() {
  const menu = $('#lang-menu');
  if (menu) menu.classList.add('hidden');
}

function toggleLangMenu() {
  const menu = $('#lang-menu');
  if (!menu) return;
  if (menu.classList.contains('hidden')) openLangMenu();
  else closeLangMenu();
}

function onLangChange() {
  sfx.paintMute();
  buildLangMenu();
  if (S.view === 'game' && S.wasm) renderTable();
  if (S.view === 'campaign') renderLadder();
  if (S.view === 'deck') renderDeck();
}

function goHome() {
  stopClock();
  S.pending = -1;
  S.coinPending = false;
  const modal = $('#coin-modal');
  if (modal) modal.classList.add('hidden');
  const tutModal = $('#tutorial-modal');
  if (tutModal) tutModal.classList.add('hidden');
  S.mode = null;
  S.opp = null;
  show('home');
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
      <span class="tag">${i < S.step ? t('campaign.done') : i === S.step ? t('campaign.current') : o.tag}</span>`;
    ul.appendChild(li);
  });
  $('#camp-progress').textContent = t('campaign.progress', { done: S.step, total: OPPONENTS.length });
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
    const face = cardEl(card.code);
    const info = cardTip(card.code);
    face.setAttribute('aria-label', `${info.head}: ${info.body}${info.adv ? ' — ' + info.adv : ''}`);
    attachTip(face, () => cardTip(card.code));
    cell.appendChild(face);
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
  $('#deck-count').textContent = t('deck.count', { n: total });
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
  try { localStorage.setItem('pazaak.deck.v2', JSON.stringify(arr)); } catch (e) {}
  show('home');
}

/* ── núcleo MAGI: unidade ativa + telemetria de sync ───────────────────────
   Um único dono do estado e dos três temporizadores. Ninguém mais mexe
   nesses elementos: qualquer mudança visual passa por magiRender().        */
const MAGI = ['caspar', 'balthasar', 'melchior'];
const SYNC_MIN = 90;
const SYNC_TICK_MS = 1000;
const MAGI_ROTATE_MS = 10000;
const SYNC_ALERT_MS = 1000;
const UNIT_FLASH_MS = 700;

const magi = {
  idx: 0,
  sync: 100,
  alerting: false,
  syncTimer: 0,
  rotateTimer: 0,
  alertTimer: 0,
  flashTimer: 0,
};

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function magiRender() {
  const name = MAGI[magi.idx];

  const unit = $('#sys-unit');
  if (unit) {
    unit.textContent = name;
    unit.classList.toggle('alert', magi.alerting);
  }

  const sync = $('#sync-value');
  if (sync) {
    sync.textContent = magi.sync + '%';
    sync.classList.toggle('alert', magi.alerting);
  }

  const btn = $('#btn-sys');
  if (btn) btn.setAttribute('aria-label', 'MAGI SYSTEM — sessão em uso: ' + name);

  for (const el of document.querySelectorAll('.statusbar .unit')) {
    el.classList.toggle('active', el.dataset.unit === name);
  }
}

function magiFlash() {
  const unit = $('#sys-unit');
  if (!unit) return;
  clearTimeout(magi.flashTimer);
  unit.classList.remove('flash');
  void unit.offsetWidth; // reinicia a animação
  unit.classList.add('flash');
  magi.flashTimer = setTimeout(() => unit.classList.remove('flash'), UNIT_FLASH_MS);
}

function magiScheduleSync() {
  clearTimeout(magi.syncTimer);
  magi.syncTimer = setTimeout(() => {
    if (!magi.alerting) {
      // garante que o número mude a cada tique, senão parece travado
      let next = randInt(SYNC_MIN, 100);
      if (next === magi.sync) next = next === 100 ? 99 : next + 1;
      magi.sync = next;
      magiRender();
    }
    magiScheduleSync();
  }, SYNC_TICK_MS);
}

function magiScheduleRotate() {
  clearTimeout(magi.rotateTimer);
  magi.rotateTimer = setTimeout(magiRotate, MAGI_ROTATE_MS);
}

function magiRotate() {
  // 1) queda de sincronia: valor abaixo do piso, tudo em vermelho
  magi.alerting = true;
  magi.sync = randInt(55, SYNC_MIN - 1);
  magiRender();

  // 2) depois de 1s: entra a nova unidade, pisca, e o sync volta ao normal
  magi.alertTimer = setTimeout(() => {
    magi.alerting = false;
    magi.idx = (magi.idx + randInt(1, MAGI.length - 1)) % MAGI.length;
    magi.sync = randInt(SYNC_MIN, 100);
    magiRender();
    magiFlash();
    magiScheduleRotate();
  }, SYNC_ALERT_MS);
}

function magiStart() {
  clearTimeout(magi.syncTimer);
  clearTimeout(magi.rotateTimer);
  clearTimeout(magi.alertTimer);
  clearTimeout(magi.flashTimer);
  magi.idx = randInt(0, MAGI.length - 1);
  magi.sync = randInt(SYNC_MIN, 100);
  magi.alerting = false;
  magiRender();
  magiScheduleSync();
  magiScheduleRotate();
}

/* ── boot ────────────────────────────────────────────────────────────────── */
function bind() {
  for (const btn of document.querySelectorAll('[data-mode]')) {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode === 'tutorial') {
        S.mode = 'tutorial';
        $('#tutorial-modal').classList.remove('hidden');
      } else if (mode === 'campaign') {
        startCampaign();
      } else if (mode === 'challenge') {
        S.mode = 'challenge';
        S.streak = 0;
        startChallengeMatch();
      }
    });
  }

  $('#btn-tutorial-start').addEventListener('click', () => {
    $('#tutorial-modal').classList.add('hidden');
    prepareMatch(TUTORIAL_OPP);
  });

  $('#btn-deck').addEventListener('click', openDeck);
  $('#btn-deck-clear').addEventListener('click', () => {
    draft.clear();
    renderDeck();
  });
  $('#btn-home').addEventListener('click', goHome);
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
  $('#btn-pause').addEventListener('click', togglePause);

  attachTip($('#btn-end'), () => ({
    head: t('tip.end.head'),
    body: t('tip.end.body'),
  }));
  attachTip($('#btn-pause'), () => ({
    head: t('tip.pause.head'),
    body: t('tip.pause.body'),
  }));
  attachTip($('#btn-stand'), () => ({
    head: t('tip.stand.head'),
    body: t('tip.stand.body'),
  }));

  buildLangMenu();
  $('#btn-lang').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleLangMenu();
  });
  $('#lang-menu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-lang]');
    if (!item) return;
    e.stopPropagation();
    setLang(item.dataset.lang);
    closeLangMenu();
  });

  $('#btn-mute').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudioMenu();
  });
  $('#audio-menu').addEventListener('click', (e) => {
    const item = e.target.closest('[data-audio]');
    if (!item) return;
    e.stopPropagation();
    if (item.dataset.audio === 'toggle') sfx.toggle();
    else sfx.testThree();
    closeAudioMenu();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#btn-mute') && !e.target.closest('#audio-menu')) closeAudioMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAudioMenu();
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'btn-mute' || btn.closest('#audio-menu')) return;
    if (btn.dataset.mode || btn.id === 'btn-deck') sfx.select();
    else sfx.click();
  });
  $('#btn-rules').addEventListener('click', () => $('#modal-rules').classList.remove('hidden'));
  $('#btn-rules-close').addEventListener('click', () => $('#modal-rules').classList.add('hidden'));
  $('#modal-rules').addEventListener('click', (e) => {
    if (e.target.id === 'modal-rules') $('#modal-rules').classList.add('hidden');
  });

  $('#coin-actions').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pick]');
    if (btn) resolveCoin(Number(btn.dataset.pick));
  });

  attachTip($('#opp-name'), opponentTip, { tabbable: true });

  const sysBtn = $('#btn-sys');
  if (sysBtn) {
    attachTip(
      sysBtn,
      () => ({ head: t('tip.magi.head'), body: t('tip.magi.body', { name: MAGI[magi.idx] }) }),
      { pin: true },
    );
  }
  document.addEventListener('click', () => { if (tipPinned) hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });
  window.addEventListener('resize', hideTip);

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
  i18nInit();
  applyStatic();
  window.onLangChange = onLangChange;
  bind();
  sfx.init();
  sfx.bootOnLoad();
  magiStart();
  applyStatic();
  show('home');
}

boot();

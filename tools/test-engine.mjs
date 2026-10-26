// Teste de fumaça do motor: joga partidas inteiras sem navegador e confere invariantes.
// Uso: node tools/test-engine.mjs [caminho-do-wasm]
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL('../web/pazaak.wasm', import.meta.url));
const bytes = readFileSync(target);
const { instance } = await WebAssembly.instantiate(bytes, {});
const w = instance.exports;

const DECK = [0x23, 0x24, 0x05, 0x14, 0x22, 0x01, 0x12, 0x61, 0x30, 0x50];
const OPP = [0x26, 0x26, 0x50, 0x50, 0x30, 0x61, 0x16, 0x06, 0x25, 0x40];

function setup() {
  for (let i = 0; i < 10; i++) {
    w.pa_set_deck(i, DECK[i]);
    w.pa_set_opp_deck(i, OPP[i]);
  }
}

function tableSum(n, getter) {
  let s = 0;
  for (let i = 0; i < n; i++) s += getter(i);
  return s;
}

function check(tag) {
  const pn = w.pa_p_n(), on = w.pa_o_n();
  if (pn > 9 || on > 9) throw new Error(`${tag}: mesa com mais de 9 cartas`);
  if (tableSum(pn, (i) => w.pa_p_card(i)) !== w.pa_p_sum()) throw new Error(`${tag}: soma do jogador inconsistente`);
  if (tableSum(on, (i) => w.pa_o_card(i)) !== w.pa_o_sum()) throw new Error(`${tag}: soma do oponente inconsistente`);
}

function bestCard(sum) {
  for (let i = 0; i < 4; i++) {
    const c = w.pa_hand(i);
    if (!c) continue;
    const t = c >> 4, v = c & 0xF;
    let cand = null;
    if (t === 0) cand = sum + v;
    else if (t === 1) cand = sum - v;
    else if (t === 2) cand = sum + v;
    if (cand !== null && cand >= 17 && cand <= 20) return i;
  }
  return -1;
}

let matches = 0, wins = 0, sets = 0;
for (let m = 0; m < 200; m++) {
  setup();
  w.pa_start_match((m * 2654435761) >>> 0, m % 3);
  let guard = 0;
  while (w.pa_phase() !== 3 && guard++ < 2000) {
    const phase = w.pa_phase();
    if (phase === 2) { w.pa_next_set(); check('next_set'); continue; }
    if (phase === 0) {
      if (w.pa_turn() === 0) w.pa_begin_turn();
      else w.pa_ai_turn();
      check('draw');
      continue;
    }
    if (phase === 1) {
      if (w.pa_turn() === 1) { w.pa_end_turn(); continue; }
      const sum = w.pa_p_sum();
      const idx = bestCard(sum);
      if (idx >= 0 && w.pa_play_hand(idx, 1)) {
        check('play');
        if (w.pa_played() === 1) {
          for (let k = 0; k < 4; k++) {
            if (w.pa_hand(k) && w.pa_play_hand(k, 1) !== 0) {
              throw new Error('aceitou segunda carta no mesmo turno');
            }
          }
        }
        continue;
      }
      if (sum >= 16) w.pa_stand();
      else w.pa_end_turn();
      check('end');
      continue;
    }
    throw new Error('fase desconhecida ' + phase);
  }
  if (guard >= 2000) throw new Error('partida não terminou — possível loop');
  matches++;
  sets += w.pa_set_no();
  if (w.pa_match_winner() === 0) wins++;
}

console.log(`wasm: ${target}`);
console.log(`partidas: ${matches}  sets: ${sets}  vitórias do jogador: ${wins}`);
console.log('invariantes: ok');

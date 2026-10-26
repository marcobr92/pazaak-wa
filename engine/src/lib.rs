//! Pazaak engine — regras, estado e IA. Sem alocação, sem std, sem wasm-bindgen.
//! Toda a interface é feita em JS; aqui só vive a verdade do jogo.

#![no_std]

use core::panic::PanicInfo;

#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

// ── Cartas ───────────────────────────────────────────────────────────────────
// u8 = (tipo << 4) | valor
const T_PLUS: u8 = 0; // +1..+6   azul
const T_MINUS: u8 = 1; // -1..-6  vermelho
const T_PM: u8 = 2; // ±1..±6   azul/vermelho
const T_FLIP24: u8 = 3; // inverte 2 e 4
const T_FLIP36: u8 = 4; // inverte 3 e 6
const T_DOUBLE: u8 = 5; // dobra a última carta do baralho principal
const T_TIE: u8 = 6; // desempata

#[inline]
fn ctype(c: u8) -> u8 {
    c >> 4
}
#[inline]
fn cval(c: u8) -> i32 {
    (c & 0x0F) as i32
}

// ── Estado ───────────────────────────────────────────────────────────────────
#[derive(Clone, Copy)]
struct P {
    hand: [u8; 4],
    used: [u8; 4],
    table: [i32; 9],
    n: u8,
    sum: i32,
    stood: bool,
    bust: bool,
    tie: bool,
    played: bool,  // já jogou carta da mão neste turno
    last_main: u8, // índice+1 da última carta vinda do baralho principal
    sets: u8,
}

impl P {
    const fn new() -> P {
        P {
            hand: [0; 4],
            used: [0; 4],
            table: [0; 9],
            n: 0,
            sum: 0,
            stood: false,
            bust: false,
            tie: false,
            played: false,
            last_main: 0,
            sets: 0,
        }
    }

    fn clear_table(&mut self) {
        self.table = [0; 9];
        self.n = 0;
        self.sum = 0;
        self.stood = false;
        self.bust = false;
        self.tie = false;
        self.played = false;
        self.last_main = 0;
    }
}

struct Game {
    main: [u8; 40],
    mlen: u8,
    p: [P; 2],
    turn: u8,
    first: u8,
    phase: u8, // 0 = aguarda compra | 1 = aguarda ação | 2 = fim de set | 3 = fim de partida
    last: i32,
    set_no: u8,
    set_winner: i8,
    match_winner: i8,
    rng: u64,
    diff: u8,
    deck: [u8; 10],
    odeck: [u8; 10],
    log: u8, // 1 = comprou e encerrou | 2 = jogou carta | 3 = parou
}

impl Game {
    const fn new() -> Game {
        Game {
            main: [0; 40],
            mlen: 0,
            p: [P::new(); 2],
            turn: 0,
            first: 0,
            phase: 0,
            last: 0,
            set_no: 0,
            set_winner: -1,
            match_winner: -1,
            rng: 1,
            diff: 1,
            deck: [0; 10],
            odeck: [0; 10],
            log: 0,
        }
    }
}

static mut G: Game = Game::new();

#[inline]
fn g() -> &'static mut Game {
    unsafe { &mut *(&raw mut G) }
}

#[inline]
fn rnd(g: &mut Game, n: u32) -> u32 {
    let mut x = g.rng;
    x ^= x << 13;
    x ^= x >> 7;
    x ^= x << 17;
    if x == 0 {
        x = 0x9E37_79B9_7F4A_7C15;
    }
    g.rng = x;
    (x % n as u64) as u32
}

// ── Baralho ──────────────────────────────────────────────────────────────────
fn shuffle_main(g: &mut Game) {
    let mut i = 0usize;
    while i < 40 {
        g.main[i] = ((i % 10) + 1) as u8;
        i += 1;
    }
    let mut i = 39usize;
    while i > 0 {
        let j = rnd(g, (i + 1) as u32) as usize;
        g.main.swap(i, j);
        i -= 1;
    }
    g.mlen = 40;
}

fn push_value(g: &mut Game, who: usize, v: i32, from_main: bool) {
    let p = &mut g.p[who];
    if p.n < 9 {
        p.table[p.n as usize] = v;
        p.n += 1;
        p.sum += v;
        if from_main {
            p.last_main = p.n;
        }
    }
}

fn draw(g: &mut Game, who: usize) -> i32 {
    if g.mlen == 0 {
        return -1;
    }
    g.mlen -= 1;
    let v = g.main[g.mlen as usize] as i32;
    push_value(g, who, v, true);
    v
}

fn deal_hand(g: &mut Game, who: usize) {
    let mut idx = [0u8; 10];
    let mut i = 0usize;
    while i < 10 {
        idx[i] = i as u8;
        i += 1;
    }
    let mut k = 0usize;
    while k < 4 {
        let j = k + rnd(g, (10 - k) as u32) as usize;
        idx.swap(k, j);
        k += 1;
    }
    k = 0;
    while k < 4 {
        let c = if who == 0 {
            g.deck[idx[k] as usize]
        } else {
            g.odeck[idx[k] as usize]
        };
        g.p[who].hand[k] = c;
        g.p[who].used[k] = 0;
        k += 1;
    }
}

// ── Sets ─────────────────────────────────────────────────────────────────────
fn start_set(g: &mut Game) {
    g.p[0].clear_table();
    g.p[1].clear_table();
    shuffle_main(g);
    g.last = 0;
    g.set_winner = -1;
    g.set_no += 1;
    g.turn = g.first;
    g.phase = 0;
}

fn end_set(g: &mut Game, w: i8) {
    g.set_winner = w;
    if w < 0 {
        g.first = 1 - g.first;
        g.phase = 2;
        return;
    }
    let wi = w as usize;
    g.p[wi].sets += 1;
    g.first = w as u8;
    if g.p[wi].sets >= 3 {
        g.match_winner = w;
        g.phase = 3;
    } else {
        g.phase = 2;
    }
}

fn resolve_standoff(g: &mut Game) {
    let a = g.p[0].sum;
    let b = g.p[1].sum;
    let w: i8 = if a > b {
        0
    } else if b > a {
        1
    } else if g.p[0].tie && !g.p[1].tie {
        0
    } else if g.p[1].tie && !g.p[0].tie {
        1
    } else {
        -1
    };
    end_set(g, w);
}

fn advance(g: &mut Game) {
    let cur = g.turn as usize;
    // mesa cheia sem estourar: vitória automática
    if g.p[cur].n >= 9 && g.p[cur].sum <= 20 {
        g.p[cur].stood = true;
        end_set(g, cur as i8);
        return;
    }
    if g.p[cur].sum > 20 {
        g.p[cur].bust = true;
        end_set(g, (1 - cur) as i8);
        return;
    }
    if g.p[cur].sum == 20 {
        g.p[cur].stood = true;
    }
    let other = 1 - cur;
    if g.p[cur].stood && g.p[other].stood {
        resolve_standoff(g);
        return;
    }
    if g.p[cur].stood {
        g.turn = other as u8;
        g.phase = 0;
        return;
    }
    if g.p[other].stood {
        g.phase = 0;
        return;
    }
    g.turn = other as u8;
    g.phase = 0;
}

// ── Cartas da mão ────────────────────────────────────────────────────────────
fn flip_tables(g: &mut Game, t: u8) {
    let a = if t == T_FLIP24 { 2 } else { 3 };
    let b = if t == T_FLIP24 { 4 } else { 6 };
    let mut w = 0usize;
    while w < 2 {
        let mut k = 0usize;
        while k < g.p[w].n as usize {
            let x = g.p[w].table[k];
            let ax = if x < 0 { -x } else { x };
            if ax == a || ax == b {
                g.p[w].table[k] = -x;
                g.p[w].sum += -2 * x;
            }
            k += 1;
        }
        w += 1;
    }
}

fn play_card(g: &mut Game, who: usize, idx: usize, sign: i32) -> i32 {
    if idx > 3 {
        return 0;
    }
    if g.p[who].played {
        return 0;
    }
    let c = g.p[who].hand[idx];
    if c == 0 || g.p[who].used[idx] != 0 {
        return 0;
    }
    let t = ctype(c);
    let v = cval(c);
    let sg = if sign < 0 { -1 } else { 1 };
    let needs_slot = t == T_PLUS || t == T_MINUS || t == T_PM || t == T_TIE;
    if needs_slot && g.p[who].n >= 9 {
        return 0;
    }
    g.p[who].used[idx] = 1;
    match t {
        T_PLUS => push_value(g, who, v, false),
        T_MINUS => push_value(g, who, -v, false),
        T_PM => push_value(g, who, v * sg, false),
        T_TIE => {
            push_value(g, who, v * sg, false);
            g.p[who].tie = true;
        }
        T_DOUBLE => {
            let li = g.p[who].last_main as usize;
            if li > 0 {
                let old = g.p[who].table[li - 1];
                let new = old * 2;
                g.p[who].table[li - 1] = new;
                g.p[who].sum += new - old;
            }
        }
        T_FLIP24 | T_FLIP36 => flip_tables(g, t),
        _ => {}
    }
    g.p[who].played = true;
    1
}

// ── IA ───────────────────────────────────────────────────────────────────────
fn sim_sum(g: &Game, who: usize, c: u8, sign: i32) -> i32 {
    let p = &g.p[who];
    let t = ctype(c);
    let v = cval(c);
    match t {
        T_PLUS => p.sum + v,
        T_MINUS => p.sum - v,
        T_PM | T_TIE => p.sum + v * sign,
        T_DOUBLE => {
            let li = p.last_main as usize;
            if li > 0 {
                p.sum + p.table[li - 1]
            } else {
                p.sum
            }
        }
        T_FLIP24 | T_FLIP36 => {
            let a = if t == T_FLIP24 { 2 } else { 3 };
            let b = if t == T_FLIP24 { 4 } else { 6 };
            let mut d = 0;
            let mut w = 0usize;
            while w < 2 {
                let mut k = 0usize;
                while k < g.p[w].n as usize {
                    let x = g.p[w].table[k];
                    let ax = if x < 0 { -x } else { x };
                    if ax == a || ax == b {
                        d += -2 * x;
                    }
                    k += 1;
                }
                w += 1;
            }
            p.sum + d
        }
        _ => p.sum,
    }
}

fn best_fix(g: &Game, who: usize, want_low: bool) -> Option<(usize, i32)> {
    let mut best: Option<(usize, i32)> = None;
    let mut best_score = i32::MIN;
    let mut i = 0usize;
    while i < 4 {
        if g.p[who].used[i] == 0 && g.p[who].hand[i] != 0 {
            let c = g.p[who].hand[i];
            let t = ctype(c);
            let mut s = 0i32;
            while s < 2 {
                let sign = if s == 0 { 1 } else { -1 };
                if s == 1 && !(t == T_PM || t == T_TIE) {
                    break;
                }
                let total = sim_sum(g, who, c, sign);
                let score = if total > 20 {
                    -1000 - (total - 20)
                } else if want_low {
                    -total
                } else if total == 20 {
                    1000
                } else if total >= 17 {
                    500 + total
                } else {
                    total
                };
                if score > best_score {
                    best_score = score;
                    best = Some((i, sign));
                }
                s += 1;
            }
        }
        i += 1;
    }
    best
}

fn ai_play(g: &mut Game) -> u8 {
    let sum = g.p[1].sum;
    if sum > 20 {
        if let Some((i, sg)) = best_fix(g, 1, false) {
            if sim_sum(g, 1, g.p[1].hand[i], sg) <= 20 {
                play_card(g, 1, i, sg);
                return 2;
            }
        }
        return 3;
    }
    // tenta fechar em 18..20
    if sum < 18 {
        if let Some((i, sg)) = best_fix(g, 1, false) {
            let total = sim_sum(g, 1, g.p[1].hand[i], sg);
            if total >= 18 && total <= 20 {
                play_card(g, 1, i, sg);
                return 2;
            }
        }
    }
    // decisão de parar
    let opp = g.p[0].sum;
    let threshold: i32 = match g.diff {
        0 => 15,
        1 => 17,
        _ => 18,
    };
    let must_beat = g.p[0].stood && g.p[1].sum <= opp;
    if g.p[1].sum == 20 || (!must_beat && g.p[1].sum >= threshold) || (g.p[0].stood && g.p[1].sum > opp) {
        3
    } else {
        1
    }
}

// ── API exportada ────────────────────────────────────────────────────────────
#[no_mangle]
pub extern "C" fn pa_set_deck(i: u32, v: u32) {
    let idx = (i as usize) % 10;
    g().deck[idx] = (v & 0xFF) as u8;
}

#[no_mangle]
pub extern "C" fn pa_set_opp_deck(i: u32, v: u32) {
    let idx = (i as usize) % 10;
    g().odeck[idx] = (v & 0xFF) as u8;
}

#[no_mangle]
pub extern "C" fn pa_start_match(seed: u32, diff: u32, first: u32) -> i32 {
    let g = g();
    g.rng = (seed as u64) | 1;
    g.diff = (diff % 3) as u8;
    g.p[0] = P::new();
    g.p[1] = P::new();
    deal_hand(g, 0);
    deal_hand(g, 1);
    g.first = if first == 1 { 1 } else { 0 };
    g.set_no = 0;
    g.set_winner = -1;
    g.match_winner = -1;
    start_set(g);
    0
}

#[no_mangle]
pub extern "C" fn pa_grant_set(who: u32) -> i32 {
    let g = g();
    if g.phase == 3 {
        return 0;
    }
    let w = (who as usize) & 1;
    if g.p[w].sets >= 3 {
        return 0;
    }
    g.p[w].sets += 1;
    1
}

#[no_mangle]
pub extern "C" fn pa_next_set() -> i32 {
    let g = g();
    if g.phase != 2 {
        return 0;
    }
    start_set(g);
    1
}

#[no_mangle]
pub extern "C" fn pa_begin_turn() -> i32 {
    let g = g();
    if g.phase != 0 {
        return -1;
    }
    if g.p[g.turn as usize].stood {
        let other = 1 - g.turn as usize;
        if g.p[other].stood {
            resolve_standoff(g);
            return -1;
        }
        g.turn = other as u8;
    }
    let who = g.turn as usize;
    g.p[who].played = false;
    let v = draw(g, who);
    g.last = v;
    g.phase = 1;
    v
}

#[no_mangle]
pub extern "C" fn pa_play_hand(idx: u32, sign: i32) -> i32 {
    let g = g();
    if g.phase != 1 {
        return 0;
    }
    let who = g.turn as usize;
    play_card(g, who, idx as usize, sign)
}

#[no_mangle]
pub extern "C" fn pa_end_turn() -> i32 {
    let g = g();
    if g.phase != 1 {
        return 0;
    }
    advance(g);
    1
}

#[no_mangle]
pub extern "C" fn pa_stand() -> i32 {
    let g = g();
    if g.phase != 1 {
        return 0;
    }
    let who = g.turn as usize;
    g.p[who].stood = true;
    advance(g);
    1
}

#[no_mangle]
pub extern "C" fn pa_ai_turn() -> i32 {
    let g = g();
    if g.phase != 0 {
        return 0;
    }
    g.turn = 1;
    if g.p[1].stood {
        let other = 0usize;
        if g.p[other].stood {
            resolve_standoff(g);
            return 0;
        }
        g.turn = 0;
        return 0;
    }
    let v = draw(g, 1);
    g.p[1].played = false;
    g.last = v;
    g.phase = 1;
    g.log = 1;
    let action = ai_play(g);
    g.log = action;
    if action == 3 {
        g.p[1].stood = true;
    }
    advance(g);
    1
}

// ── Leitura de estado ────────────────────────────────────────────────────────
#[no_mangle]
pub extern "C" fn pa_phase() -> i32 {
    g().phase as i32
}
#[no_mangle]
pub extern "C" fn pa_turn() -> i32 {
    g().turn as i32
}
#[no_mangle]
pub extern "C" fn pa_p_sum() -> i32 {
    g().p[0].sum
}
#[no_mangle]
pub extern "C" fn pa_o_sum() -> i32 {
    g().p[1].sum
}
#[no_mangle]
pub extern "C" fn pa_p_n() -> i32 {
    g().p[0].n as i32
}
#[no_mangle]
pub extern "C" fn pa_o_n() -> i32 {
    g().p[1].n as i32
}
#[no_mangle]
pub extern "C" fn pa_p_card(i: u32) -> i32 {
    let g = g();
    let idx = i as usize;
    if idx < g.p[0].n as usize {
        g.p[0].table[idx]
    } else {
        0
    }
}
#[no_mangle]
pub extern "C" fn pa_o_card(i: u32) -> i32 {
    let g = g();
    let idx = i as usize;
    if idx < g.p[1].n as usize {
        g.p[1].table[idx]
    } else {
        0
    }
}
#[no_mangle]
pub extern "C" fn pa_hand(i: u32) -> i32 {
    let g = g();
    let idx = i as usize;
    if idx < 4 && g.p[0].used[idx] == 0 {
        g.p[0].hand[idx] as i32
    } else {
        0
    }
}
#[no_mangle]
pub extern "C" fn pa_o_hand(i: u32) -> i32 {
    let g = g();
    let idx = i as usize;
    if idx < 4 {
        g.p[1].hand[idx] as i32
    } else {
        0
    }
}
#[no_mangle]
pub extern "C" fn pa_last() -> i32 {
    g().last
}
#[no_mangle]
pub extern "C" fn pa_sets_p() -> i32 {
    g().p[0].sets as i32
}
#[no_mangle]
pub extern "C" fn pa_sets_o() -> i32 {
    g().p[1].sets as i32
}
#[no_mangle]
pub extern "C" fn pa_set_winner() -> i32 {
    g().set_winner as i32
}
#[no_mangle]
pub extern "C" fn pa_match_winner() -> i32 {
    g().match_winner as i32
}
#[no_mangle]
pub extern "C" fn pa_set_no() -> i32 {
    g().set_no as i32
}
#[no_mangle]
pub extern "C" fn pa_log() -> i32 {
    g().log as i32
}
#[no_mangle]
pub extern "C" fn pa_p_stood() -> i32 {
    g().p[0].stood as i32
}
#[no_mangle]
pub extern "C" fn pa_o_stood() -> i32 {
    g().p[1].stood as i32
}
#[no_mangle]
pub extern "C" fn pa_played() -> i32 {
    let g = g();
    g.p[g.turn as usize].played as i32
}

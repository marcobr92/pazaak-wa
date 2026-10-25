# pazaak-wa

Pazaak jogável no navegador. Regras e IA em WebAssembly (Rust, `no_std`), tela em HTML/CSS/JS puro.

Fan game, sem fins lucrativos. Pazaak e Star Wars pertencem à Lucasfilm / The Walt Disney Company.

## Rodar

O site é estático: abrir `web/index.html` já funciona (o wasm vai embutido em base64 como fallback).
Para o caminho normal, sirva a pasta:

```powershell
node tools/serve.mjs 8787 web
# http://127.0.0.1:8787
```

## Build

```powershell
./build.ps1
```

Compila o motor para `wasm32-unknown-unknown`, copia para `web/pazaak.wasm` e gera `web/wasm.js`
com a cópia em base64. Precisa de Rust + alvo wasm:

```powershell
rustup target add wasm32-unknown-unknown
```

O binário sai com ~5 KB: sem `std`, sem alocador, sem `wasm-bindgen`, sem dependência nenhuma.

## Estrutura

```
engine/        motor em Rust — regras, estado, IA (a verdade do jogo)
web/           index.html, style.css, app.js, pazaak.wasm, wasm.js
tools/serve.mjs  servidor estático de teste
build.ps1      build + cópia do wasm + base64
```

A fronteira é dura de propósito: o JS nunca decide regra, só desenha e chama função.
Toda leitura de estado passa pelos getters `pa_*` exportados pelo wasm.

## Modos

- **Aprenda a jogar** — partida contra oponente fácil.
- **Campanha** — dez oponentes com decks próprios, ordem sorteada a cada partida.
- **Desafio** — partidas seguidas até a primeira derrota.
- **Criar seu deck** — dez cartas, no máximo duas de cada tipo; fica salvo no navegador.

## Regras implementadas

Baralho principal de 40 cartas (quatro de cada, 1–10). Baralho lateral de dez, do qual quatro são
sorteadas por partida e duram todos os sets. Um set termina por estouro, por ambos pararem, ou por
mesa cheia (nove cartas) sem passar de 20. Empate não pontua. Três sets ganham a partida.

Cartas: `+`, `−`, `±`, flip 2&4, flip 3&6, dobra e desempate.

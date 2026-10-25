#!/usr/bin/env pwsh
# Build do motor wasm + cópia para web/ + base64 de fallback (file://).
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"

Push-Location (Join-Path $root 'engine')
cargo build --release --target wasm32-unknown-unknown
Pop-Location

$wasm = Join-Path $root 'engine\target\wasm32-unknown-unknown\release\pazaak_engine.wasm'
if (-not (Test-Path $wasm)) { throw 'build falhou: binário não gerado' }

Copy-Item $wasm (Join-Path $root 'web\pazaak.wasm') -Force

$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($wasm))
Set-Content -Path (Join-Path $root 'web\wasm.js') -Value "window.PAZAAK_WASM_B64='$b64';" -Encoding ascii

$kb = (Get-Item $wasm).Length / 1KB
Write-Host ("wasm ok: {0:N1} KB  ->  web/pazaak.wasm + web/wasm.js" -f $kb)

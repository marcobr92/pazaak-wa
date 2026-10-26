// Confere o dicionário: chaves faltando por idioma e chaves usadas que não existem.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const ctx = vm.createContext({});
vm.runInContext(read('web/i18n.js'), ctx);
const I18N = vm.runInContext('I18N', ctx);
const LANGS = vm.runInContext('LANGS', ctx);

const base = Object.keys(I18N.pt);
let bad = 0;

for (const { code } of LANGS) {
  const keys = I18N[code] ? Object.keys(I18N[code]) : [];
  const missing = base.filter((k) => !keys.includes(k));
  const extra = keys.filter((k) => !base.includes(k));
  if (!I18N[code]) { console.log(`${code}: idioma ausente`); bad++; continue; }
  if (missing.length) { console.log(`${code}: faltam ${missing.length} — ${missing.slice(0, 6).join(', ')}`); bad++; }
  if (extra.length) { console.log(`${code}: sobram ${extra.length} — ${extra.slice(0, 6).join(', ')}`); bad++; }
}

const refs = new Set();
for (const line of read('web/app.js').matchAll(/\bt\('([^']+)'/g)) refs.add(line[1]);
for (const line of read('web/index.html').matchAll(/data-i18n="([^"]+)"/g)) refs.add(line[1]);

const undefinedKeys = [...refs].filter((k) => !I18N.pt[k]);
if (undefinedKeys.length) {
  console.log(`usadas mas inexistentes: ${undefinedKeys.join(', ')}`);
  bad++;
}

const unused = base.filter((k) => !refs.has(k));
console.log(`chaves: ${base.length} · idiomas: ${LANGS.length} · referências: ${refs.size}`);
if (unused.length) console.log(`não referenciadas (ok se dinâmicas): ${unused.join(', ')}`);

if (bad) { console.log('FALHOU'); process.exit(1); }
console.log('dicionário íntegro');

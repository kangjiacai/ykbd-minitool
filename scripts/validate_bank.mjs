/**
 * 题库与指纹自检。
 * node scripts/validate_bank.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const window = {};
eval(fs.readFileSync(path.join(root, 'data/bank.js'), 'utf8'));
eval(fs.readFileSync(path.join(root, 'js/fingerprint.js'), 'utf8'));
const bank = window.YKBD_BANK;
const F = window.YKBD_F;
const errors = [];
const required = ['id', 'cat', 'zhPrompt', 'options', 'correctIndex', 'difficulty', 'fact', 'svgHint', 'fig'];

function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}
function lev(a, b) {
  const m = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b[i - 1] === a[j - 1]
        ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1;
    }
  }
  return m[b.length][a.length];
}

if (!Array.isArray(bank) || bank.length < 200) errors.push('count ' + (bank && bank.length));
const ids = new Set();
const answers = [];
const dist = { 1: 0, 2: 0, 3: 0 };
bank.forEach((q, i) => {
  required.forEach((k) => {
    if (q[k] == null || q[k] === '') errors.push('missing ' + k + ' @' + i);
  });
  if (q.idx !== i) errors.push('idx ' + q.id);
  if (ids.has(q.id)) errors.push('dup id ' + q.id);
  ids.add(q.id);
  if (!Array.isArray(q.options) || q.options.length !== 4) errors.push('options ' + q.id);
  else {
    const folded = q.options.map(norm);
    if (new Set(folded).size !== 4) errors.push('option dup ' + q.id);
    if (q.correctIndex < 0 || q.correctIndex > 3) errors.push('correctIndex ' + q.id);
    else if (!q.options[q.correctIndex]) errors.push('answer missing ' + q.id);
  }
  if (![1, 2, 3].includes(q.difficulty)) errors.push('difficulty ' + q.id);
  else dist[q.difficulty]++;
  if (i >= 64 && !String(q.fig).includes('f-u') && !String(q.fig).includes('#2B44C9')) errors.push('highlight ' + q.id);
  if (String(q.fact).includes('冷知识') || String(q.zhPrompt).includes('冷知识')) errors.push('冷知识 ' + q.id);
  if (i >= 64) {
    const line = String(q.zhPrompt).split('<br>')[0];
    if (line.length > 16) errors.push('prompt ' + q.id + ' ' + line.length);
  }
  answers.push(q.options[q.correctIndex]);
});

const norms = answers.map(norm);
norms.forEach((n, i) => {
  for (let j = 0; j < i; j++) {
    if (n === norms[j]) errors.push('dup answer ' + answers[i]);
    else if (n && norms[j] && Math.abs(n.length - norms[j].length) <= 2 && lev(n, norms[j]) <= 1) {
      errors.push('near ' + answers[i] + ' / ' + answers[j]);
    }
  }
});
function rounds(idxs, correct, t) {
  return idxs.map((idx, i) => ({ idx: idx, correct: correct[i], t: t[i] }));
}
const hi = rounds([0, 64, 199, 7, 128], [true, false, true, true, false], [1, 3.2, 14, 8, 0]);
const code = F.encode(hi);
const back = F.decode(code);
if (!back) errors.push('v2 decode failed ' + code);
else hi.forEach((r, i) => {
  if (back[i].idx !== r.idx) errors.push('idx drift ' + r.idx + ' -> ' + back[i].idx);
  if (back[i].correct !== r.correct) errors.push('correct drift ' + i);
  const band = Math.min(3, Math.floor(Math.max(0, Math.min(15, Math.ceil(r.t))) / 4)) * 4;
  if (back[i].t !== band) errors.push('time drift ' + r.t + ' -> ' + back[i].t);
});
const low = rounds([1, 2, 3, 4, 5], [true, true, false, true, false], [2, 6, 9, 13, 0]);
if (F.encode(low) === F.encode(rounds([1, 2, 3, 4, 5 + 64], [true, true, false, true, false], [2, 6, 9, 13, 0]))) {
  errors.push('idx 5 and 69 share a fingerprint');
}

/* 手写一条 v1：版本 1，五题 1/2/3/4/5，全对，用时 2,6,9,13,0 */
function pushBits(arr, val, n) { for (let i = n - 1; i >= 0; i--) arr.push((val >> i) & 1); }
function readBits(arr, pos, n) { let v = 0; for (let i = 0; i < n; i++) v = (v << 1) | arr[pos + i]; return v; }
function check(bits) { let c = 0; for (let i = 0; i < bits.length; i++) c = (c + bits[i] * ((i % 7) + 1)) % 8; return c; }
const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const bits = [];
pushBits(bits, 1, 2);
[[1, 1, 2], [2, 1, 6], [3, 0, 9], [4, 1, 13], [5, 0, 0]].forEach((r) => {
  pushBits(bits, r[0], 6);
  pushBits(bits, r[1], 1);
  pushBits(bits, r[2], 4);
});
pushBits(bits, check(bits), 3);
let v1 = '';
for (let i = 0; i < bits.length; i += 5) v1 += ALPHA.charAt(readBits(bits, i, 5));
v1 = v1.slice(0, 4) + '-' + v1.slice(4, 8) + '-' + v1.slice(8, 12);
const oldRound = F.decode(v1);
if (!oldRound || oldRound[0].idx !== 1 || oldRound[2].correct !== false || oldRound[3].t !== 13 || oldRound[4].idx !== 5) {
  errors.push('v1 decode ' + v1 + ' ' + JSON.stringify(oldRound));
}
if (F.decode('0000-0000-0000') !== null) errors.push('bogus code accepted');

const text = fs.readFileSync(path.join(root, 'data/bank.js'), 'utf8')
  + fs.readFileSync(path.join(root, 'index.html'), 'utf8')
  + fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
if (text.includes('冷知识')) errors.push('冷知识 still in sources');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('PASS', bank.length, 'difficulty', dist);
console.log('sample v2', code);
console.log('sample v1', v1);

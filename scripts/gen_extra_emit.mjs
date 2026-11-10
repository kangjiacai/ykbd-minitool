/**
 * 校验新题并追加到 data/bank.js。可重复运行：先去掉上一次追加的标记段。
 */
import fs from 'node:fs';
import './gen_extra_more.mjs';
import './gen_extra_d3.mjs';
import { RAW } from './gen_extra_bank.mjs';

const bankPath = new URL('../data/bank.js', import.meta.url);
let src = fs.readFileSync(bankPath, 'utf8');
const MARK = '    /* —— v1.5 追加，勿插入到此标记之前 —— */\n';
const cut = src.indexOf(MARK);
if (cut >= 0) {
  const end = src.indexOf('\n  ];', cut);
  src = src.slice(0, cut) + src.slice(end + 1);
}

const window = {};
eval(src);
const old = window.YKBD_BANK;
const oldIds = new Set(old.map((q) => q.id));
const oldAnswers = old.map((q) => q.options[q.correctIndex]);

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
function js(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

const errors = [];
if (RAW.length !== 136) errors.push('new count ' + RAW.length + ' !== 136');
const ids = new Set();
const answers = [];
const dcount = { 1: 0, 2: 0, 3: 0 };
RAW.forEach((row, i) => {
  const [id, cat, d, prompt, answer, wrongs, fact, hint, fig] = row;
  if (!id || !cat || !prompt || !answer || !fact || !hint || !fig) errors.push('missing field ' + id);
  if (ids.has(id) || oldIds.has(id)) errors.push('dup id ' + id);
  ids.add(id);
  if (![1, 2, 3].includes(d)) errors.push('bad d ' + id);
  dcount[d]++;
  if (!Array.isArray(wrongs) || wrongs.length !== 3) errors.push('wrongs ' + id);
  const opts = new Set([answer, ...(wrongs || [])].map(norm));
  if (opts.size !== 4) errors.push('option collision ' + id);
  const line = String(prompt).split('<br>')[0];
  if (line.length > 16) errors.push('prompt line ' + line.length + ' ' + id + ' ' + line);
  if (!prompt.includes('<br>') || !prompt.includes('？')) errors.push('prompt shape ' + id);
  if (fact.includes('冷知识') || prompt.includes('冷知识')) errors.push('冷知识 ' + id);
  if (!fig.includes('f-u') && !fig.includes('#2B44C9')) errors.push('no highlight ' + id);
  if (!fig.includes('f-r')) errors.push('no ring ' + id);
  answers.push(answer);
});

const allAnswers = oldAnswers.concat(answers);
const norms = allAnswers.map(norm);
norms.forEach((n, i) => {
  if (!n) errors.push('empty answer norm ' + allAnswers[i]);
  for (let j = 0; j < i; j++) {
    if (n === norms[j]) errors.push('dup answer ' + allAnswers[i] + ' / ' + allAnswers[j]);
    else if (Math.abs(n.length - norms[j].length) <= 2 && lev(n, norms[j]) <= 1) {
      errors.push('near dup ' + allAnswers[i] + ' / ' + allAnswers[j]);
    }
  }
});
const answerSet = new Set(norms);
RAW.forEach((row) => {
  row[5].forEach((w) => {
    if (answerSet.has(norm(w))) errors.push('distractor is an answer: ' + w + ' in ' + row[0]);
  });
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const lines = RAW.map((row, i) => {
  const [id, cat, d, prompt, answer, wrongs, fact, hint, fig] = row;
  const opts = wrongs.slice();
  const at = id.length % 4;
  opts.splice(at, 0, answer);
  const comma = i === RAW.length - 1 ? '' : ',';
  return [
    '    { id: ' + js(id) + ', cat: ' + js(cat) + ', d: ' + d + ',',
    '      q: ' + js(prompt) + ',',
    '      o: [' + opts.map(js).join(', ') + '], a: ' + at + ',',
    '      fact: ' + js(fact) + ',',
    '      hint: ' + js(hint) + ',',
    '      fig: ' + js(fig) + ' }' + comma
  ].join('\n');
});

src = src.replace(
  '/* 你可能不知道 · 内置题库 v1（64 条）\n * 字段：id / cat / zhPrompt / options[4] / correctIndex / difficulty(1-3) / fact / svgHint / fig\n * 颜色类：f-i 黑 / f-s 黑线 / f-p 白底黑边 / f-g 浅灰 / f-n 灰无边 / f-u 黄绿被问部件 / f-r 虚线圈\n * 内联 stroke="#2B44C9" 会在运行时换成荧光黄绿。\n * 顺序即指纹序号（6 bit，0–63）：只能在末尾追加，不得插入或重排。\n */',
  '/* 你可能不知道 · 内置题库 v2（200 条）\n * 字段：id / cat / zhPrompt / options[4] / correctIndex / difficulty(1-3) / fact / svgHint / fig\n * 颜色类：f-i 黑 / f-s 黑线 / f-p 白底黑边 / f-g 浅灰 / f-n 灰无边 / f-u 黄绿被问部件 / f-r 虚线圈\n * 内联 stroke="#2B44C9" 会在运行时换成荧光黄绿。\n * 顺序即指纹序号。v2 指纹用 8 bit 存题号（0–255）：只能在末尾追加，不得插入或重排。\n */'
);

const needle = '\n  ];\n  window.YKBD_BANK';
const at = src.indexOf(needle);
if (at < 0) {
  console.error('anchor missing');
  process.exit(1);
}
let prefix = src.slice(0, at);
if (!prefix.trimEnd().endsWith(',')) prefix += ',';
src = prefix + '\n' + MARK + lines.join('\n') + src.slice(at);
fs.writeFileSync(bankPath, src);
console.log('appended', RAW.length, 'difficulty', dcount, 'total', old.length + RAW.length);

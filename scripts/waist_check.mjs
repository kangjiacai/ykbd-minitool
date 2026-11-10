/**
 * 腰缝自检：每种衣服 × 每种姿势，再加 50 个随机种子。
 * 光栅扫描腿根到下摆之间，背景像素必须是 0。包围盒不算数。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
global.window = global;
(0, eval)(fs.readFileSync(path.join(root, 'js/figure-avatar.js'), 'utf8'));

const api = global.YKBD_FIGURE;
const bodyDim = api.dims.filter((d) => d.key === 'body')[0];
const poseDim = api.dims.filter((d) => d.key === 'pose')[0];
const failures = [];

function check(seed, label) {
  const model = api.figureModel(seed);
  const shapes = api.figureShapes(seed);
  const problems = api.audit(model, shapes).filter((p) => String(p).indexOf('waist') === 0);
  if (problems.length) failures.push(label + ' ' + problems.join('; '));
}

for (let b = 0; b < bodyDim.options.length; b++) {
  for (let p = 0; p < poseDim.options.length; p++) {
    const seed = api.seedFor({
      hair: 0, eyes: 0, mouth: 0, body: b, pose: p, main: 0, accent: 1, accessory: 0
    });
    check(seed, bodyDim.options[b].id + '/' + poseDim.options[p].id);
  }
}

const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
let rng = 0x12345678;
function rnd() {
  rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
  return rng;
}
const randomSeeds = [];
for (let n = 0; n < 50; n++) {
  let s = '';
  for (let i = 0; i < 12; i++) s += alphabet[rnd() % alphabet.length];
  s = s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12);
  randomSeeds.push(s);
  check(s, 'seed ' + s);
}
check('GG2F-08G8-8783', '棉线杯子');

if (failures.length) {
  console.error(failures.slice(0, 30).join('\n'));
  console.error('FAIL', failures.length);
  process.exit(1);
}
console.log('PASS waist', bodyDim.options.length * poseDim.options.length, 'combos +', randomSeeds.length, 'seeds');
console.log('棉线杯子', api.figureModel('GG2F-08G8-8783').body.id, api.figureModel('GG2F-08G8-8783').pose.id);

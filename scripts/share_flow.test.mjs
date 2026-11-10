/**
 * Headless check for 发笔记 and 关注作者.
 * Mocks window.xhs.miniTool plus a canvas/Image so
 * SVG → data URI → canvas → writeTempFile → postNote runs without a browser.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const failures = [];
function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const ctx = {
  texts: [],
  images: [],
  save() {},
  restore() {},
  beginPath() {},
  closePath() {},
  moveTo() {},
  arc() {},
  arcTo() {},
  fill() {},
  stroke() {},
  fillRect() {},
  translate() {},
  rotate() {},
  scale() {},
  measureText(s) { return { width: String(s).length * 18 }; },
  fillText(s) { this.texts.push(String(s)); },
  drawImage(img, x, y, w, h) { this.images.push({ src: img && img.src, x, y, w, h }); }
};
const canvasEl = {
  width: 10,
  height: 10,
  getContext() { return ctx; },
  toDataURL(type) {
    this.lastType = type;
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }
};

function MockImage() {
  this.naturalWidth = 840;
  this.naturalHeight = 1512;
  this.complete = false;
  this._src = '';
}
Object.defineProperty(MockImage.prototype, 'src', {
  get() { return this._src; },
  set(v) {
    this._src = v;
    this.complete = true;
    if (typeof this.onload === 'function') this.onload();
  }
});

global.window = global;
global.document = {
  getElementById(id) { return id === 'cv' ? canvasEl : null; },
  fonts: { load() { return Promise.resolve(); } }
};
global.Image = MockImage;

function load(rel) {
  (0, eval)(read(rel));
}

load('js/fingerprint.js');
load('js/figure-avatar.js');
load('js/render.js');
load('js/share.js');
const platformSrc = read('js/platform.js');

function bootPlatform(xhs) {
  global.window.xhs = xhs;
  (0, eval)(platformSrc);
  return global.window.YKBD_P;
}

const SAMPLE = {
  fp: 'B665-6G14-RPME',
  name: '盐巴气球',
  score: 87,
  correct: 4,
  title: '全对大师',
  time: '12.5'
};

const drew = { n: 0 };
const realDraw = global.YKBD_FIGURE.drawFigure;
global.YKBD_FIGURE.drawFigure = function () {
  drew.n += 1;
  return realDraw.apply(this, arguments);
};

let seenExport = null;
const calls = { write: [], post: [] };
const P = bootPlatform({
  launchOptions: { miniToolEnv: { buildVersion: 9510004 } },
  miniTool: {
    writeTempFile: async (o) => {
      calls.write.push(o);
      return { filePath: 'xhsfile://tmp/card.png' };
    },
    postNote: async (o) => {
      calls.post.push(o);
      return { errMsg: 'ok' };
    },
    getFollowStatus: async () => ({ follow_status: 0 }),
    followAuthor: async () => ({ follow_status: 1 })
  }
});

const poster = global.YKBD_S.createPoster({
  canPost: () => P.canPostNote(),
  ensureFonts: () => Promise.resolve(),
  exportCard: (card) => {
    seenExport = card;
    return global.YKBD_R.exportShareCard(card);
  },
  postPhoto: (opts) => P.postPhotoNote(opts)
});

const posted = await poster.tap(SAMPLE);
assert(posted.ok === true, 'post ok');
assert(posted.filePath === 'xhsfile://tmp/card.png', 'filePath from writeTempFile');
assert(drew.n === 0, 'share export must not call drawFigure');
assert(seenExport && seenExport.fp === SAMPLE.fp && seenExport.name === SAMPLE.name, 'export gets name and code');
assert(seenExport.score === undefined && seenExport.title === undefined && seenExport.correct === undefined, 'score stays off the card export');
assert(canvasEl.width === 1080 && canvasEl.height === 1440, 'canvas 1080x1440');
assert(canvasEl.lastType === 'image/png', 'png data url');
assert(ctx.images.length === 1, 'figure drawn from image');
assert(String(ctx.images[0].src).indexOf('data:image/svg+xml') === 0, 'svg data uri');
const svg = decodeURIComponent(String(ctx.images[0].src).split(',')[1] || '');
assert(svg.indexOf('<svg') >= 0 && svg.indexOf('viewBox="0 0 400 720"') >= 0, 'figure svg');
assert(svg.indexOf('全对大师') < 0 && svg.indexOf('答对') < 0, 'svg has no score copy');
const painted = ctx.texts.join('\n');
assert(painted.indexOf('你可能不知道') >= 0, 'brand on card');
assert(painted.indexOf('盐巴气球') >= 0, 'name on card');
assert(painted.indexOf('B665-6G14-RPME') >= 0, 'code on card');
assert(painted.indexOf('87') < 0 && painted.indexOf('全对大师') < 0 && painted.indexOf('答对') < 0, 'no score on card');
assert(calls.write.length === 1 && calls.write[0].data.indexOf('data:image/png') === 0, 'writeTempFile png');
const note = calls.post[0];
assert(note.pageType === 'photo_publish', 'photo_publish');
assert(note.mediaInfo.image_resources.length === 1, 'one image');
assert(note.mediaInfo.image_resources[0].url === 'xhsfile://tmp/card.png', 'note uses filePath');
assert(note.title.length <= 20, 'title <= 20');
assert(note.title === '我抽到了「盐巴气球」！', 'title copy');
assert(note.content.length <= 1000, 'content <= 1000');
assert(note.content.indexOf('本局答对 4/5、得分 87、用时 12.5 秒') >= 0, 'score in body');
assert(note.content.indexOf('#小红书小工具 #你可能不知道 #冷门单词') >= 0, 'tags');
assert(note.content.indexOf('冷知识') < 0, 'no 冷知识');

const longTitle = global.YKBD_S.noteTitle('盐'.repeat(40));
assert(longTitle.length <= 20, 'long title clipped');
assert(longTitle.indexOf('我抽到了「') === 0 && longTitle.slice(-2) === '」！', 'title keeps brackets');
const emojiTitle = global.YKBD_S.noteTitle('😀'.repeat(20));
assert(emojiTitle.length <= 20, 'emoji title clipped');
assert(emojiTitle.charCodeAt(emojiTitle.length - 3) < 0xD800 || emojiTitle.charCodeAt(emojiTitle.length - 3) > 0xDBFF, 'no split surrogate before tail');

let gates = 0;
let release;
const gate = new Promise((res) => { release = res; });
const slow = global.YKBD_S.createPoster({
  canPost: () => true,
  exportCard: () => gate.then(() => 'data:image/png;base64,xx'),
  postPhoto: async () => { gates += 1; return { ok: true, filePath: 'p' }; }
});
const first = slow.tap(SAMPLE);
const second = await slow.tap(SAMPLE);
assert(second.reason === 'pending', 'double tap blocked');
release();
const firstRes = await first;
assert(firstRes.ok === true && gates === 1, 'only one post');

const fallen = { posts: [] };
const P2 = bootPlatform({
  miniTool: {
    writeTempFile: async () => { throw new Error('disk'); },
    postNote: async (o) => { fallen.posts.push(o); return {}; }
  }
});
const viaData = await P2.postPhotoNote({ title: 't', content: 'c', dataUrl: 'data:image/png;base64,abc' });
assert(viaData.ok && viaData.filePath === 'data:image/png;base64,abc', 'writeTempFile failure falls back');
assert(fallen.posts[0].mediaInfo.image_resources[0].url === 'data:image/png;base64,abc', 'fallback url');

const direct = { posts: [] };
const P3 = bootPlatform({
  miniTool: {
    postNote: async (o) => { direct.posts.push(o); return {}; }
  }
});
const viaMissing = await P3.postPhotoNote({ title: 't', content: 'c', dataUrl: 'data:image/png;base64,abc' });
assert(viaMissing.filePath === 'data:image/png;base64,abc', 'missing writeTempFile uses data uri');
assert(direct.posts.length === 1, 'postNote still called');

const P4 = bootPlatform({ miniTool: {} });
const missing = await global.YKBD_S.createPoster({
  canPost: () => P4.canPostNote(),
  exportCard: async () => { throw new Error('should not export'); },
  postPhoto: async () => { throw new Error('should not post'); }
}).tap(SAMPLE);
assert(missing.reason === 'noxhs', 'no postNote');
assert(P4.canPostNote() === false, 'feature detect');

async function followCase(build, status, followImpl, launchVia) {
  let reads = 0;
  let follows = 0;
  const miniTool = {
    getFollowStatus: async () => { reads += 1; return { follow_status: status }; },
    followAuthor: async () => {
      follows += 1;
      if (followImpl) return followImpl();
      return { follow_status: 1 };
    }
  };
  const xhs = { miniTool };
  if (launchVia === 'async') miniTool.getLaunchOptions = async () => ({ miniToolEnv: { buildVersion: build } });
  else if (build != null) xhs.launchOptions = { miniToolEnv: { buildVersion: build } };
  const Plat = bootPlatform(xhs);
  const ctl = global.YKBD_S.createFollow({
    supported: () => Plat.canFollow(),
    read: () => Plat.readFollowStatus(),
    follow: () => Plat.requestFollow()
  });
  const view = await ctl.load();
  return { Plat, ctl, view, reads, follows: () => follows };
}

const unfollowed = await followCase(9510000, 0);
assert(unfollowed.view.hidden === false && unfollowed.view.label === '关注作者' && unfollowed.view.disabled === false, 'status 0');
assert(unfollowed.reads === 1, 'getFollowStatus on load');

const followed = await followCase(9512001, 1);
assert(followed.view.label === '已关注' && followed.view.disabled === true && followed.view.hidden === false, 'status 1');

const self = await followCase(9510004, 2);
assert(self.view.hidden === true, 'status 2 hidden');

const unknown = await followCase('9510004', -1);
assert(unknown.view.hidden === false && unknown.view.label === '关注作者' && unknown.view.disabled === false, 'status -1 shows button');

const old = await followCase(9509999, 0);
assert(old.view.hidden === true && old.reads === 0, '9.50 hides and does not query');

const none = await followCase(null, 0);
assert(none.view.hidden === true && none.reads === 0, 'missing version hides');

const asyncVer = await followCase(9510001, 0, null, 'async');
assert(asyncVer.view.label === '关注作者' && asyncVer.reads === 1, 'getLaunchOptions version');

const noApi = bootPlatform({ launchOptions: { miniToolEnv: { buildVersion: 9600001 } }, miniTool: {} });
const noApiCtl = global.YKBD_S.createFollow({
  supported: () => noApi.canFollow(),
  read: async () => { throw new Error('should not read'); },
  follow: async () => { throw new Error('should not follow'); }
});
const noApiView = await noApiCtl.load();
assert(noApiView.hidden === true, 'missing follow API hides');

const closed = await followCase(9510004, 0, async () => { throw { errCode: 20002, errMsg: 'cancel' }; });
const closedTap = await closed.ctl.tap();
assert(closedTap.notice === '' && closedTap.view.label === '关注作者', '20002 silent');

const limited = await followCase(9510004, 0, async () => { throw { errCode: 15404 }; });
const limitedTap = await limited.ctl.tap();
assert(limitedTap.notice === '今天先到这儿啦' && limitedTap.view.label === '关注作者', '15404 toast copy');

const busyFollow = await followCase(9510004, 0, async () => { throw { errCode: 10003 }; });
const busyTap = await busyFollow.ctl.tap();
assert(busyTap.notice === '' && busyTap.view.label === '关注作者', '10003 ignored');

const okFollow = await followCase(9510004, 0);
const okTap = await okFollow.ctl.tap();
assert(okTap.view.label === '已关注' && okTap.view.disabled === true, 'follow success');

let followHits = 0;
let openGate;
const followGate = new Promise((res) => { openGate = res; });
const dbl = await followCase(9510004, 0, () => { followHits += 1; return followGate.then(() => ({ follow_status: 1 })); });
const tapA = dbl.ctl.tap();
const tapB = await dbl.ctl.tap();
assert(tapB.type === 'pending', 'follow double tap');
openGate();
await tapA;
assert(followHits === 1, 'followAuthor once');

const sources = ['index.html', 'js/app.js', 'js/share.js', 'js/platform.js', 'js/render.js', 'css/app.css', 'README.md']
  .map(read).join('\n');
assert(sources.indexOf('冷知识') < 0, 'sources avoid 冷知识');
assert(sources.indexOf('onclick=') < 0, 'no inline handlers');
assert(sources.indexOf('用这张卡发笔记') >= 0, 'post button copy');
assert(sources.indexOf('id="r-post"') >= 0 && sources.indexOf('id="d-post"') >= 0, 'result and detail buttons');
assert(sources.indexOf('id="me-follow"') >= 0 && sources.indexOf('id="r-follow"') >= 0, 'follow buttons');
assert(read('js/app.js').indexOf("addEventListener('click', function () { onPost(current); })") >= 0, 'result tap only');
assert(read('js/app.js').indexOf('fetch(') < 0 && read('js/share.js').indexOf('fetch(') < 0, 'no fetch');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('PASS share flow', calls.post[0].title);

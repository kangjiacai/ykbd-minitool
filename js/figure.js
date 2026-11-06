/* 抽卡形象 · 离线 SVG（由 gen-b3 精简移植）
 * 图层：hairBehind → body → neck → head → hairSet → face
 * 头 = 头 + 脖子肤色；身体含完整领口；脖子底伸进领口。
 */
(function () {
/** 脖子矩形（viewBox 坐标）—— 断言与绘制共用；只肤色，不含衣领 */
const NECK_RECT = { x: 176, y: 262, w: 48, h: 74 }; // 底=336，伸进领口 ≥20px（勿拔出）
/** 衣领开口（画在身体上；比脖子略宽）。yTop 上移缩短「头底→领口」可见肤色段 */
const COLLAR_OPEN = { x0: 164, x1: 236, yTop: 290, yDip: 336 }; // 可见脖≈头底282→290=8px（用户再短一点）
const HEAD_BOTTOM_Y = 282; // 头椭圆底 cy+ry
/** 额头采样带：bangs 类必须盖住（禁秃额） */
const FOREHEAD_BAND = { x0: 130, x1: 270, y0: 110, y1: 160 };
/** 额头几何参考（盖额采样）；绘制不再单独 clip 刘海层 */
const HEAD_CLIP = { cx: 200, cy: 188, rx: 91, ry: 97 };

/**
 * 精致轻 Neo-Brutal 全身角色（可收藏感）
 * 硬规则绘制顺序（不可改）：
 *   身后披发（可空）→ 身体衣服手臂腿 → 脖子 → 头 → 发型一整套 → 五官
 * 身首拆分：头部部件=头+脖子肤色段（绝不连带衣领）；身体部件=整件衣服含完整衣领开口。
 * 脖子底端伸进衣领开口；四肢/脖子锚点定在身体上。
 * 可见脖保持短版；任何发型须露脖；bangs 盖额，short 可露额。
 */
function figureSVGv2(cfg) {
  const {
    skin = '#F4D9C6',
    shirt = '#C9B8FF',
    pants = '#2A2A2A',
    shoes = '#111',
    hair = '#1A1A1A',
    accent = '#C8F542',
    hairStyle = 'fringe',
    eyes = 'wink',
    mouth = 'grin',
    pose = 'wave',
    top = 'tee',
    shoeType = 'sneaker',
    sole = '#fff',
  } = cfg;

  const SW = 7;
  const parts = [];

  // —— 硬投影 silhouette（整身偏移）——
  parts.push(`<g opacity="1" transform="translate(10,12)">`);
  parts.push(bodySilhouette('#111', pose));
  parts.push(`</g>`);

  // ========== L1 身后披发（仅长发；可为空）==========
  parts.push(`<!--L:hairBehind-->`);
  parts.push(hairBehind(hairStyle, hair, SW));

  // ========== L2 身体：腿鞋 → 衣身 → 手臂 ==========
  parts.push(`<!--L:body-->`);
  if (pose === 'wave' || pose === 'out') {
    parts.push(`<path d="M162 498 C154 555 145 618 136 666 L180 670 C186 618 192 555 196 508 Z" fill="${pants}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M238 498 C246 555 255 618 270 664 L226 670 C220 618 214 555 204 508 Z" fill="${pants}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M116 660 C116 660 106 678 128 682 L182 682 C192 682 194 670 184 666 Z" fill="${shoes}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M244 660 C244 660 234 678 256 682 L310 680 C320 678 318 666 308 664 Z" fill="${shoes}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M128 676 h50" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`);
    parts.push(`<path d="M256 676 h48" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`);
  } else {
    parts.push(`<path d="M162 505 C155 575 148 635 142 665 L176 668 C180 635 186 575 190 512 Z" fill="${pants}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M238 505 C245 575 252 635 258 665 L224 668 C220 635 214 575 210 512 Z" fill="${pants}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M122 658 C122 658 112 676 132 680 L178 680 C188 680 188 668 178 664 Z" fill="${shoes}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<path d="M222 658 C222 658 212 676 232 680 L278 680 C288 680 288 668 278 664 Z" fill="${shoes}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
  }

  parts.push(shoeDetail(shoeType, shoes, sole, accent, pose));

  // 衣身：绕脖子切口的完整衣服（开口宽 > 脖宽；禁封闭横顶边；禁身后拱起衣色领）
  // 路径从左肩 → 左领口 → 沿脖子左侧下行绕脖底 → 右领口 → 右肩 → 衣身
  {
    const n = NECK_RECT;
    const c = COLLAR_OPEN;
    const ySide = n.y + n.h - 12; // 324
    const yBot = n.y + n.h;       // 336
    const yRim = c.yTop;          // 领口顶：可见脖更短
    const openL = c.x0; // 164
    const openR = c.x1; // 236
    parts.push(`<path id="torso" d="M122 340
      C122 312 140 ${yRim} ${openL} ${yRim}
      L${n.x} ${yRim}
      L${n.x} ${ySide}
      C${n.x + 4} ${yBot} ${n.x + n.w - 4} ${yBot} ${n.x + n.w} ${ySide}
      L${n.x + n.w} ${yRim}
      L${openR} ${yRim}
      C260 ${yRim} 278 312 278 340
      L278 495
      C278 520 250 538 200 538
      C150 538 122 520 122 495 Z"
      fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    // 领口缘描边（衣服上）
    parts.push(`<path d="M${openL} ${yRim} L${n.x} ${yRim} M${n.x + n.w} ${yRim} L${openR} ${yRim}" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`);
  }
  parts.push(clothesDetail(top, shirt, accent, SW));

  if (pose === 'wave') {
    parts.push(`<path d="M130 330
      C110 350 78 390 62 430
      C58 442 68 452 80 448
      C100 400 118 362 136 342 Z"
      fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="68" cy="448" rx="22" ry="20" fill="${skin}" stroke="#111" stroke-width="6"/>`);
    parts.push(`<path d="M58 448 Q68 458 80 448" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>`);
    parts.push(`<path d="M270 328
      C290 300 310 250 322 210
      C328 198 344 202 342 216
      C328 270 300 320 278 348 Z"
      fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="334" cy="204" rx="24" ry="22" fill="${skin}" stroke="#111" stroke-width="6"/>`);
    parts.push(`<path d="M318 192 C308 180 318 172 326 180" fill="${skin}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`);
  } else if (pose === 'out') {
    parts.push(`<path d="M128 335 C90 360 48 400 36 438 C32 450 44 460 56 454 C78 410 108 370 140 348 Z" fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="40" cy="452" rx="22" ry="20" fill="${skin}" stroke="#111" stroke-width="6"/>`);
    parts.push(`<path d="M272 335 C310 360 352 400 364 438 C368 450 356 460 344 454 C322 410 292 370 260 348 Z" fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="360" cy="452" rx="22" ry="20" fill="${skin}" stroke="#111" stroke-width="6"/>`);
  } else {
    parts.push(`<path d="M128 340 C95 380 78 440 92 470 C100 482 116 476 118 462 C112 430 120 385 140 350 Z" fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="98" cy="472" rx="20" ry="18" fill="${skin}" stroke="#111" stroke-width="6"/>`);
    parts.push(`<path d="M272 340 C305 380 322 440 308 470 C300 482 284 476 282 462 C288 430 280 385 260 350 Z" fill="${shirt}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"/>`);
    parts.push(`<ellipse cx="302" cy="472" rx="20" ry="18" fill="${skin}" stroke="#111" stroke-width="6"/>`);
  }

  // ========== L3 脖子（压在身体之上、头之下；后发不得最终盖死）==========
  parts.push(`<!--L:neck-->`);
  // 脖子：仅肤色；顶咬头底；底伸进领口内（y=336）；可见段由领口顶决定
  {
    const n = NECK_RECT;
    const ySide = n.y + n.h - 12;
    const yBot = n.y + n.h;
    parts.push(`<path id="neck" d="M${n.x} ${n.y} L${n.x} ${ySide} C${n.x + 4} ${yBot} ${n.x + n.w - 4} ${yBot} ${n.x + n.w} ${ySide} L${n.x + n.w} ${n.y} Z" fill="${skin}" stroke="#111" stroke-width="5.5" stroke-linejoin="round"/>`);
  }

  // ========== L4 头 ==========
  parts.push(`<!--L:head-->`);
  // 头椭圆底 ≈ y=282，与脖子顶咬合
  parts.push(`<ellipse cx="200" cy="188" rx="88" ry="94" fill="${skin}" stroke="#111" stroke-width="${SW}"/>`);
  // 耳朵：豆形 + 淡内弧（禁止竖椭圆+竖缝）
  parts.push(`<path d="M102 182 C92 184 88 198 94 210 C100 220 112 218 116 208" fill="${skin}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`);
  parts.push(`<path d="M108 196 Q102 202 108 208" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round" opacity="0.55"/>`);
  parts.push(`<path d="M298 182 C308 184 312 198 306 210 C300 220 288 218 284 208" fill="${skin}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>`);
  parts.push(`<path d="M292 196 Q298 202 292 208" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="round" opacity="0.55"/>`);

  // ========== L5 发型一整套（头顶+额前同一套，不分刘海层）==========
  parts.push(`<!--L:hair-->`);
  parts.push(hairSet(hairStyle, hair, SW));

  // —— 五官（发型之后的可见区）——
  parts.push(`<!--L:face-->`);
  parts.push(`<path d="M148 168 Q165 160 180 168" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`);
  if (eyes !== 'wink') {
    parts.push(`<path d="M220 168 Q235 160 252 168" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`);
  } else {
    parts.push(`<path d="M220 172 Q235 164 252 170" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>`);
  }

  if (eyes === 'open') {
    parts.push(`<ellipse cx="164" cy="192" rx="18" ry="20" fill="#fff" stroke="#111" stroke-width="5.5"/>`);
    parts.push(`<ellipse cx="236" cy="192" rx="18" ry="20" fill="#fff" stroke="#111" stroke-width="5.5"/>`);
    parts.push(`<circle cx="166" cy="194" r="9" fill="#111"/>`);
    parts.push(`<circle cx="238" cy="194" r="9" fill="#111"/>`);
    parts.push(`<circle cx="169" cy="190" r="3.2" fill="#fff"/>`);
    parts.push(`<circle cx="241" cy="190" r="3.2" fill="#fff"/>`);
  } else if (eyes === 'wink') {
    parts.push(`<ellipse cx="164" cy="192" rx="18" ry="20" fill="#fff" stroke="#111" stroke-width="5.5"/>`);
    parts.push(`<circle cx="166" cy="194" r="9" fill="#111"/>`);
    parts.push(`<circle cx="169" cy="190" r="3.2" fill="#fff"/>`);
    parts.push(`<path d="M218 195 Q236 182 254 195" fill="none" stroke="#111" stroke-width="6.5" stroke-linecap="round"/>`);
  } else {
    parts.push(`<rect x="128" y="176" width="58" height="44" rx="14" fill="#fff" stroke="#111" stroke-width="6.5"/>`);
    parts.push(`<rect x="214" y="176" width="58" height="44" rx="14" fill="#fff" stroke="#111" stroke-width="6.5"/>`);
    parts.push(`<path d="M186 198 h28" stroke="#111" stroke-width="5.5" fill="none"/>`);
    parts.push(`<path d="M128 192 H110" stroke="#111" stroke-width="5.5"/>`);
    parts.push(`<path d="M272 192 H290" stroke="#111" stroke-width="5.5"/>`);
    parts.push(`<circle cx="157" cy="198" r="9" fill="#111"/>`);
    parts.push(`<circle cx="243" cy="198" r="9" fill="#111"/>`);
    parts.push(`<circle cx="160" cy="194" r="3" fill="#fff"/>`);
    parts.push(`<circle cx="246" cy="194" r="3" fill="#fff"/>`);
  }

  parts.push(`<path d="M200 208 L196 226 Q200 230 204 226 Z" fill="#111" opacity="0.85"/>`);

  if (mouth === 'grin') {
    parts.push(`<path d="M168 242 Q200 278 232 242" fill="#111" stroke="#111" stroke-width="4" stroke-linejoin="round"/>`);
    parts.push(`<path d="M176 244 Q200 266 224 244" fill="${accent}"/>`);
    parts.push(`<path d="M182 248 Q200 258 218 248" fill="#fff" opacity="0.9"/>`);
  } else if (mouth === 'smile') {
    parts.push(`<path d="M172 248 Q200 272 228 248" fill="none" stroke="#111" stroke-width="6.5" stroke-linecap="round"/>`);
  } else if (mouth === 'flat') {
    parts.push(`<path d="M178 250 h44" stroke="#111" stroke-width="6.5" stroke-linecap="round"/>`);
  } else {
    parts.push(`<ellipse cx="200" cy="252" rx="14" ry="16" fill="#111"/>`);
    parts.push(`<ellipse cx="200" cy="256" rx="8" ry="6" fill="${accent}" opacity="0.85"/>`);
  }

  parts.push(`<ellipse cx="128" cy="228" rx="14" ry="10" fill="${accent}" opacity="0.75"/>`);
  parts.push(`<ellipse cx="272" cy="228" rx="14" ry="10" fill="${accent}" opacity="0.75"/>`);

  const svg = `<svg viewBox="0 0 400 720" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g stroke-linejoin="round" stroke-linecap="round">${parts.join('')}</g>
  </svg>`;

  assertFigureHardRules(hairStyle, svg);
  return svg;
}

function bodySilhouette(fill, pose) {
  let arms = '';
  if (pose === 'wave') {
    arms = `<path d="M120 330 L55 450 L90 455 L145 350Z"/><path d="M270 325 L320 200 L355 215 L290 350Z"/>`;
  } else if (pose === 'out') {
    arms = `<path d="M120 335 L30 455 L70 460 L145 350Z"/><path d="M280 335 L370 455 L330 460 L255 350Z"/>`;
  } else {
    arms = `<path d="M120 340 L85 475 L120 480 L150 355Z"/><path d="M280 340 L315 475 L280 480 L250 355Z"/>`;
  }
  return `
    <ellipse cx="200" cy="188" rx="90" ry="96"/>
    <path d="M122 340 C122 312 140 290 164 290 L176 290 L176 320 C180 336 220 336 224 320 L224 290 L236 290 C260 290 278 312 278 340 L280 505 C280 530 245 550 200 550 C155 550 120 530 120 505Z"/>
    ${arms}
    <path d="M165 500 L130 680 L175 685 L195 515Z"/>
    <path d="M235 500 L270 680 L225 685 L205 515Z"/>
  `.replace(/<(ellipse|path)/g, `<$1 fill="${fill}"`);
}


// ===== 发型一整套用发际边（与皇冠合成单一 path）=====
const EDGES = {
  // 刘海下沿贴眉上（额央 y≈160–166），禁秃额；不蒙眼（眉在 ~168）
  fringe: 'L300 214 L288 186 Q276 168 260 164 Q246 172 230 162 Q216 172 200 162 Q184 172 170 162 Q154 172 140 164 Q124 168 112 186 L100 214',
  swept:  'L300 214 L292 186 C278 168 252 160 228 162 C210 170 192 164 174 166 C154 170 132 178 112 190 L100 214',
  spiky:  'L300 214 L288 188 L274 164 L258 168 L242 158 L224 168 L200 156 L176 168 L158 158 L142 168 L126 164 L112 188 L100 214',
  curly:  'L300 214 L290 186 Q284 168 266 166 Q252 178 236 168 Q220 180 200 168 Q180 180 164 168 Q148 178 134 166 Q116 168 110 186 L100 214',
};
// 露额短发：发际线在额上方（额央 y≈118–126），额头露出
EDGES.crop = 'L300 214 L294 170 Q284 128 262 122 Q236 116 200 120 Q164 116 138 122 Q116 128 106 170 L100 214';
/** 发型类型：bangs=带刘海/长发前发（须盖额到眉上）；short=短发（允许露额，不强制覆盖） */
const HAIR_TYPE = { fringe: 'bangs', swept: 'bangs', long: 'bangs', bun: 'bangs', spiky: 'short', curly: 'short', crop: 'short' };
const EDGE_OF = { crop: 'crop', fringe: 'fringe', bun: 'fringe', long: 'swept', swept: 'swept', spiky: 'spiky', curly: 'curly' };

/** 解析刘海边路径上的 (x,y) 控制/端点，供断言用 */

/** 只取各子命令落点（忽略 Q/C 控制点） */
function parseEdgeEndpoints(edge) {
  const pts = [];
  const re = /([MLQC])|(-?\d+(?:\.\d+)?)/g;
  let m, cmd = null, nums = [];
  const flush = () => {
    if (!cmd || !nums.length) return;
    if (cmd === 'L' || cmd === 'M') {
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
    } else if (cmd === 'Q') {
      for (let i = 0; i + 3 < nums.length; i += 4) pts.push({ x: nums[i + 2], y: nums[i + 3] });
    } else if (cmd === 'C') {
      for (let i = 0; i + 5 < nums.length; i += 6) pts.push({ x: nums[i + 4], y: nums[i + 5] });
    }
    nums = [];
  };
  while ((m = re.exec(edge))) {
    if (m[1]) { flush(); cmd = m[1]; }
    else nums.push(Number(m[2]));
  }
  flush();
  return pts;
}

function parseEdgePoints(edge) {
  const pts = [];
  const re = /([MLQC])|(-?\d+(?:\.\d+)?)/g;
  let m, cmd = null, nums = [];
  const flush = () => {
    if (!cmd || !nums.length) return;
    if (cmd === 'L' || cmd === 'M') {
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
    } else if (cmd === 'Q') {
      for (let i = 0; i + 3 < nums.length; i += 4) {
        pts.push({ x: nums[i], y: nums[i + 1] });
        pts.push({ x: nums[i + 2], y: nums[i + 3] });
      }
    } else if (cmd === 'C') {
      for (let i = 0; i + 5 < nums.length; i += 6) {
        pts.push({ x: nums[i], y: nums[i + 1] });
        pts.push({ x: nums[i + 2], y: nums[i + 3] });
        pts.push({ x: nums[i + 4], y: nums[i + 5] });
      }
    }
    nums = [];
  };
  while ((m = re.exec(edge))) {
    if (m[1]) { flush(); cmd = m[1]; }
    else nums.push(Number(m[2]));
  }
  flush();
  return pts;
}

/** 近似：点是否落在一整套发型额前填充内（发际边沿之上） */
function pointInFrontHair(x, y, edgeKey) {
  const { cx, cy, rx, ry } = HEAD_CLIP;
  if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 1) return false;
  // 刘海边：取近邻 x 的边沿 y，填充在边沿上方（y 更小）
  const pts = parseEdgePoints(EDGES[edgeKey]);
  const near = pts.filter((p) => Math.abs(p.x - x) <= 40);
  if (!near.length) return y <= 212;
  const edgeY = near.reduce((s, p) => s + p.y, 0) / near.length;
  return y <= edgeY + 2;
}

/**
 * 硬规则断言（生成后必跑；失败抛错）
 * 1) 图层顺序：hairBehind → body → neck → head → hair
 * 2) 发型一整套（禁 frontHair）；额头覆盖按 HAIR_TYPE
 * 3) 脖子矩形不得被「压在脖子之上的头发」完全覆盖
 * 4) 身首拆分：禁身后拱起衣色领、禁衣身封闭横顶边
 * 5) 脖子底采样须落在衣领 U 开口区域内（伸进 ≥20px）
 */
let __lastForehead = null;
function assertFigureHardRules(hairStyle, svg) {
  const order = ['L:hairBehind', 'L:body', 'L:neck', 'L:head', 'L:hair'];
  let last = -1;
  for (const marker of order) {
    const i = svg.indexOf(`<!--${marker}-->`);
    if (i < 0) throw new Error(`[RULE] 缺少图层标记 ${marker}（发型=${hairStyle}）`);
    if (i < last) throw new Error(`[RULE] 图层顺序错误：${marker} 出现过早（发型=${hairStyle}）`);
    last = i;
  }
  if (!svg.includes('id="neck"')) {
    throw new Error(`[RULE] 缺少脖子路径（发型=${hairStyle}）`);
  }
  if (svg.includes('L:frontHair') || svg.includes('L:backHair') || /function (front|back)Hair/.test(svg)) {
    throw new Error(`[RULE] 禁止刘海/头顶分立图层（须发型一整套）：${hairStyle}`);
  }
  if (!svg.includes('id="hair"')) {
    throw new Error(`[RULE] 缺少一整套发型 id="hair"：${hairStyle}`);
  }
  if (/clipPath id="hc"/.test(svg) && /ellipse cx="200" cy="160" rx="102"/.test(svg)) {
    throw new Error(`[RULE] 禁止头顶层+前发 clip 分层：${hairStyle}`);
  }

  const edgeKey = EDGE_OF[hairStyle];
  if (!edgeKey || !EDGES[edgeKey]) {
    throw new Error(`[RULE] 未知发型或未映射刘海边：${hairStyle}`);
  }

  const hairType = HAIR_TYPE[hairStyle];
  if (!hairType) throw new Error(`[RULE] 发型未声明类型(bangs/short)：${hairStyle}`);
  const { x0, x1, y0, y1 } = FOREHEAD_BAND;
  let foreheadHit = 0, foreheadTotal = 0;
  for (let y = y0; y <= y1; y += 6) {
    for (let x = x0; x <= x1; x += 6) {
      foreheadTotal++;
      if (pointInFrontHair(x, y, edgeKey)) foreheadHit++;
    }
  }
  const foreheadRatio = foreheadHit / foreheadTotal;
  const endPts = parseEdgeEndpoints(EDGES[edgeKey]);
  const centerYs = endPts.filter((p) => p.x >= 150 && p.x <= 250).map((p) => p.y);
  if (!centerYs.length) throw new Error(`[RULE] 刘海边无额央点：${hairStyle}`);
  const minY = Math.min(...centerYs), maxY = Math.max(...centerYs);
  if (hairType === 'bangs') {
    // 2a) 带刘海/长发前发：盖额到眉上，禁秃额
    if (foreheadRatio < 0.70) throw new Error(`[RULE] 秃额/刘海不足：${hairStyle} 额头覆盖率=${foreheadRatio.toFixed(2)}（须≥0.70）`);
    if (minY < 154 || maxY > 172) throw new Error(`[RULE] 刘海深度异常：${hairStyle} centerY∈[${minY},${maxY}]，须约 158–170（盖到眉上）`);
  } else {
    // 2b) 短发：允许露额，不强制覆盖；仅禁止前发蒙眼（眉 ~168）
    if (maxY > 172) throw new Error(`[RULE] 短发前发过低蒙眼：${hairStyle} maxY=${maxY}`);
  }
  if (hairStyle === 'crop' && foreheadRatio > 0.45) throw new Error(`[RULE] 露额短发未露额：覆盖率=${foreheadRatio.toFixed(2)}`);
  __lastForehead = { hairStyle, hairType, foreheadRatio };

  // 3) 脖子矩形：压在脖子之上的前发不得完全覆盖
  const n = NECK_RECT;
  let covered = 0, total = 0;
  for (let y = n.y + 4; y < n.y + n.h - 2; y += 4) {
    for (let x = n.x + 4; x < n.x + n.w - 4; x += 4) {
      total++;
      if (pointInFrontHair(x, y, edgeKey)) covered++;
    }
  }
  if (total > 0 && covered === total) {
    throw new Error(`[RULE] 脖子矩形被头发完全覆盖：${hairStyle} covered=${covered}/${total}`);
  }
  // 额外：可见脖子比例至少一半（前发几乎不该碰到脖子）
  if (covered / total > 0.35) {
    throw new Error(`[RULE] 脖子被前发遮太多：${hairStyle} covered=${covered}/${total}`);
  }

  // 4) 身首拆分：禁止身后拱起衣色领 / 封闭衣顶
  if (/M138\s+318\s+C128\s+268/.test(svg) || /M138 318 C128 268/.test(svg)) {
    throw new Error(`[RULE] 禁止 hoodie 身后拱起衣色领（自带黄领）：${hairStyle}`);
  }
  // 封闭顶边特征：C128 314 … 200 308 C252 308 …（旧衣身）
  if (/C128\s+314\s+148\s+308\s+200\s+308/.test(svg)) {
    throw new Error(`[RULE] 禁止衣身封闭横顶边：${hairStyle}`);
  }
  if (!svg.includes('id="torso"')) {
    throw new Error(`[RULE] 缺少 torso 衣身路径：${hairStyle}`);
  }

  // 5) 脖子底必须落在衣领开口区域内
  const c = COLLAR_OPEN;
  const neckBotY = n.y + n.h;
  const neckMidX = n.x + n.w / 2;
  if (n.w < 46 || n.w > 50) {
    throw new Error(`[RULE] 脖子宽须约 48：got ${n.w}`);
  }
  if (neckBotY < 330 || neckBotY > 338) {
    throw new Error(`[RULE] 脖子底须约 y=330–338（伸进领口）：got ${neckBotY}`);
  }
  if (neckBotY < c.yTop + 20) {
    throw new Error(`[RULE] 脖子底伸进领口不足 20px：bot=${neckBotY} collarTop=${c.yTop}`);
  }
  // 可见脖长：头底 → 领口顶（再缩短后约 6–10）
  const visible = c.yTop - HEAD_BOTTOM_Y;
  if (visible < 5 || visible > 12) {
    throw new Error(`[RULE] 可见脖长异常：${visible}px（头底${HEAD_BOTTOM_Y}→领口${c.yTop}，须约 6–10）`);
  }
  if (neckMidX < c.x0 || neckMidX > c.x1) {
    throw new Error(`[RULE] 脖子中线不在领口开口宽内：x=${neckMidX} open=[${c.x0},${c.x1}]`);
  }
  if (n.x < c.x0 - 2 || n.x + n.w > c.x1 + 2) {
    throw new Error(`[RULE] 领口开口须略宽于脖子：neck=[${n.x},${n.x + n.w}] open=[${c.x0},${c.x1}]`);
  }
  // 采样脖子底附近点须在开口 x 范围且低于领口顶
  let inOpen = 0, openTotal = 0;
  for (let x = n.x + 6; x < n.x + n.w - 6; x += 4) {
    openTotal++;
    const y = neckBotY - 4;
    if (x >= c.x0 && x <= c.x1 && y > c.yTop && y <= c.yDip) inOpen++;
  }
  if (openTotal === 0 || inOpen < openTotal) {
    throw new Error(`[RULE] 脖子底采样未全部落在衣领开口内：${hairStyle} ${inOpen}/${openTotal}`);
  }
}

/** 身后披发：只有需要落到身体后方的部分（长发披肩）。短发/头顶发量不在此画。 */
function hairBehind(style, hair, SW) {
  if (style !== 'long') return '';
  const st = `fill="${hair}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"`;
  let o = '';
  // 披肩长发：中间会被身体盖住；两侧肩后露出（禁止当「前发层」）
  o += `<path d="M120 175
    C100 210 95 300 105 420
    C110 500 160 530 200 535
    C240 530 290 500 295 420
    C305 300 300 210 280 175
    C265 148 240 128 200 124
    C160 128 135 148 120 175 Z" ${st}/>`;
  o += `<path d="M95 190 C60 240 48 330 55 430 C58 490 88 505 108 485 C90 430 82 330 100 240 Z" ${st}/>`;
  o += `<path d="M305 190 C340 240 352 330 345 430 C342 490 312 505 292 485 C310 430 318 330 300 240 Z" ${st}/>`;
  return o;
}

/**
 * 发型一整套：头顶轮廓 + 额前/发际边是同一 path（同色块一组）。
 * 禁止再拆成「头顶椭圆一层 + 刘海 clip 一层」。
 */
function hairSet(style, hair, SW) {
  const st = `fill="${hair}" stroke="#111" stroke-width="${SW}" stroke-linejoin="round"`;
  const edgeKey = EDGE_OF[style] || 'fringe';
  const edge = EDGES[edgeKey];
  // edge 形如 "L300 214 L288 … L100 214"；去掉起点 L300 y，接在皇冠右侧
  const bangsFromRight = edge.replace(/^L300 \d+\s+/, '');
  // 圆润弧顶皇冠：顶峰两侧控制点 y≈顶峰 y（水平切线），禁尖顶/三角顶
  const CROWN_ROUND = `M100 214
      C85 160 125 70 200 66
      C275 70 315 160 300 214`;
  let o = `<g id="hair">`;

  if (style === 'spiky') {
    // 刺头：整体圆顶 + 轻微波浪纹理（禁尖刺当头顶）
    o += `<path d="M104 178
      C96 140 108 88 150 76
      C168 70 182 78 200 72
      C218 78 232 70 250 76
      C292 88 304 140 298 188
      ${bangsFromRight} Z" ${st}/>`;
  } else if (style === 'curly') {
    // 卷发：主发块 + 同色卷体（同一套，非前发分层）
    o += `<path d="${CROWN_ROUND}
      ${bangsFromRight} Z" ${st}/>`;
    for (const [x, y] of [[112, 150], [122, 112], [146, 84], [178, 72], [212, 72], [246, 82], [272, 108], [288, 142]]) {
      o += `<circle cx="${x}" cy="${y}" r="28" ${st}/>`;
    }
  } else if (style === 'bun') {
    o += `<path d="${CROWN_ROUND}
      ${bangsFromRight} Z" ${st}/>`;
    o += `<circle cx="200" cy="78" r="36" ${st}/>`;
    o += `<path d="M178 96 Q200 108 222 96" stroke="#C8F542" stroke-width="8" fill="none"/>`;
  } else if (style === 'crop') {
    // 露额短发：更矮更圆的弧顶（勿尖撮）
    o += `<path d="M100 214
      C88 165 130 92 200 88
      C270 92 312 165 300 214
      ${bangsFromRight} Z" ${st}/>`;
  } else {
    // fringe / swept / long：圆润皇冠弧 + 发际/刘海边 = 单一闭合 path
    o += `<path d="${CROWN_ROUND}
      ${bangsFromRight} Z" ${st}/>`;
  }

  // 高光（装饰，仍属同一套）
  o += `<path d="M150 112 Q170 100 190 106 M214 104 Q236 100 252 114" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.35"/>`;
  o += `</g>`;
  return o;
}



function clothesDetail(top, shirt, accent, SW) {
  const k = `stroke="#111" stroke-linecap="round" stroke-linejoin="round"`;
  // 领口描边统一由 torso + 通用 rim 承担；此处只加各款式身体装饰（白内领也属身体衣服）
  if (top === 'hoodie') return `
    <path d="M184 308 v52 M216 308 v52" ${k} stroke-width="4"/><circle cx="184" cy="374" r="6" fill="${accent}" ${k} stroke-width="3"/><circle cx="216" cy="374" r="6" fill="${accent}" ${k} stroke-width="3"/>
    <path d="M150 470 L162 420 H238 L250 470 Z" fill="none" ${k} stroke-width="5"/>
    <path d="M132 500 H268" stroke="#111" stroke-width="4"/>`;
  if (top === 'overall') return `
    <path d="M150 320 L160 400 M250 320 L240 400" ${k} stroke-width="10" stroke="${accent}"/>
    <path d="M150 320 L160 400 M250 320 L240 400" fill="none" ${k} stroke-width="3"/>
    <path d="M152 390 H248 L262 520 C230 536 170 536 138 520 Z" fill="${accent}" ${k} stroke-width="5"/>
    <circle cx="164" cy="402" r="6" fill="#111"/><circle cx="236" cy="402" r="6" fill="#111"/>
    <rect x="180" y="418" width="40" height="32" rx="6" fill="none" ${k} stroke-width="4"/>`;
  if (top === 'jacket') return `
    <path d="M164 ${COLLAR_OPEN.yTop} L200 378 L236 ${COLLAR_OPEN.yTop}" fill="#fff" ${k} stroke-width="5"/>
    <path d="M200 360 V530" ${k} stroke-width="5"/>
    <path d="M164 ${COLLAR_OPEN.yTop} L150 350 L186 360 Z M236 ${COLLAR_OPEN.yTop} L250 350 L214 360 Z" fill="${shirt}" ${k} stroke-width="4.5"/>
    <path d="M144 440 h36 M220 440 h36" ${k} stroke-width="5"/>
    <circle cx="200" cy="400" r="5" fill="${accent}" ${k} stroke-width="2"/><circle cx="200" cy="450" r="5" fill="${accent}" ${k} stroke-width="2"/>`;
  return `
    <rect x="214" y="400" width="42" height="36" rx="8" fill="none" ${k} stroke-width="4.5"/><path d="M214 412 h42" stroke="#111" stroke-width="4"/>
    <circle cx="200" cy="360" r="6" fill="#111"/><circle cx="200" cy="392" r="6" fill="#111"/>
    <path d="M132 470 H268" stroke="${accent}" stroke-width="10"/>`;
}

function shoeDetail(type, shoes, sole, accent, pose) {
  const L = pose === 'akimbo' ? [[124, 180, 632], [222, 262, 632]] : [[132, 184, 630], [226, 272, 630]];
  const k = `stroke="#111" stroke-width="5" stroke-linejoin="round"`;
  let o = '';
  const soles = pose === 'akimbo' ? [[118, 674, 66], [220, 672, 66]] : [[112, 676, 74], [240, 674, 74]];
  for (const [x, y, w] of soles) o += `<rect x="${x}" y="${y}" width="${w}" height="12" rx="6" fill="${sole}" ${k}/>`;
  if (type === 'boot') for (const [a, b, y] of L) o += `<path d="M${a + 4} ${y} H${b - 4} L${b} 670 H${a} Z" fill="${shoes}" ${k}/>`;
  if (type === 'hightop') for (const [a, b, y] of L) o += `<path d="M${a + 6} ${y + 14} H${b - 6} L${b - 2} 668 H${a + 2} Z" fill="${shoes}" ${k}/><path d="M${a + 14} ${y + 26} h${b - a - 28} M${a + 14} ${y + 38} h${b - a - 28}" stroke="${accent}" stroke-width="4"/>`;
  return o;
}

function seedRng(str) {
  let h = 1779033703 ^ str.length;
  for (const c of str) {
    h = Math.imul(h ^ c.charCodeAt(0), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function figFromSeed(code) {
  const r = seedRng(code), pick = (a) => a[Math.floor(r() * a.length)];
  return {
    hairStyle: pick(['fringe', 'swept', 'spiky', 'curly', 'bun', 'long', 'crop']),
    hair: pick(['#1A1A1A', '#5B3A1E', '#C9B8FF', '#E8743B', '#3B4CCA']),
    skin: pick(['#F4D9C6', '#E8C2A0', '#C68E64', '#8D5A3B']),
    top: pick(['tee', 'hoodie', 'overall', 'jacket']),
    shirt: pick(['#C9B8FF', '#FFFFFF', '#FF8FA3', '#7FD3FF', '#FFD84D']),
    pants: pick(['#2A2A2A', '#3B4CCA', '#6B5B3E', '#C9B8FF']),
    shoes: pick(['#111', '#FF5A36', '#3B4CCA', '#C8F542', '#FFFFFF']),
    shoeType: pick(['sneaker', 'boot', 'hightop']),
    sole: '#fff', accent: '#C8F542',
    eyes: pick(['open', 'wink', 'glasses']),
    mouth: pick(['grin', 'smile', 'o', 'flat']),
    pose: pick(['wave', 'out', 'akimbo']),
  };
}


  var HAIRS = ['fringe', 'swept', 'spiky', 'curly', 'bun', 'long', 'crop'];
  for (var hi = 0; hi < HAIRS.length; hi++) {
    figureSVGv2({ hairStyle: HAIRS[hi], pose: 'wave', top: 'tee', eyes: 'open', mouth: 'smile' });
  }

  window.YKBD_FIG = {
    svg: function (cfg) { return figureSVGv2(cfg); },
    fromSeed: figFromSeed,
    render: function (code, over) {
      var cfg = figFromSeed(code);
      if (over) {
        for (var k in over) if (Object.prototype.hasOwnProperty.call(over, k)) cfg[k] = over[k];
      }
      return figureSVGv2(cfg);
    }
  };
})();

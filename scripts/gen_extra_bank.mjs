/**
 * 把 136 道新题追加进 data/bank.js。只在生成时运行，运行时题库仍以 bank.js 为准。
 * node scripts/gen_extra_bank.mjs
 */
import fs from 'node:fs';

function ring(cx, cy, r) {
  return '<circle class="f-r" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
}
function fig(body, cx, cy, r) {
  return body + ring(cx, cy, r);
}

/** [id, cat, d, prompt, answer, wrongs[3], fact, hint, fig] */
const RAW = [];
function add(id, cat, d, prompt, answer, wrongs, fact, hint, body, cx, cy, r) {
  RAW.push([id, cat, d, prompt, answer, wrongs, fact, hint, fig(body, cx, cy, r)]);
}

add('serif', '字母', 1,
  '字母笔画末端的小脚，<br>英文叫什么？',
  'serif', ['swash', 'glyph', 'spine'],
  'serif 是笔画末端多出来的短横或小脚；没有这截的字体叫 sans serif。',
  '大写 T 的四只小脚为黄绿',
  '<rect class="f-i" x="158" y="62" width="24" height="120"/><rect class="f-i" x="112" y="62" width="116" height="20"/><rect class="f-u" x="96" y="62" width="22" height="20"/><rect class="f-u" x="222" y="62" width="22" height="20"/><rect class="f-u" x="146" y="162" width="22" height="20"/><rect class="f-u" x="172" y="162" width="22" height="20"/>',
  170, 112, 90);

add('ampersand', '符号', 1,
  '这个 & 符号，<br>英文叫什么？',
  'ampersand', ['plus', 'slash', 'caret'],
  'ampersand 由拉丁文 et（和）连写变来，本身就是「and」。',
  '白卡片中央一枚黄绿 &',
  '<rect class="f-p" x="90" y="40" width="160" height="170"/><text x="170" y="158" font-size="110" text-anchor="middle" fill="#2B44C9" font-family="YK, sans-serif" font-weight="700">&amp;</text>',
  170, 125, 96);

add('zest', '橙子', 1,
  '橙子最外面有颜色的那层皮，<br>英文叫什么？',
  'zest', ['albedo', 'pulp', 'segment'],
  'zest 只指带颜色的外皮；里面白色的那层是 pith，不是 zest。',
  '橙子横切，最外一圈为黄绿',
  '<circle class="f-g" cx="170" cy="125" r="90"/><circle class="f-u" cx="170" cy="125" r="90"/><circle class="f-p" cx="170" cy="125" r="74"/><path class="f-s" d="M170 125 L170 58 M170 125 L228 92 M170 125 L228 158 M170 125 L170 192 M170 125 L112 158 M170 125 L112 92"/>',
  170, 125, 100);

add('cuticle', '指甲', 1,
  '指甲根部那圈贴着的死皮，<br>英文叫什么？',
  'cuticle', ['matrix', 'nailbed', 'plate'],
  'cuticle 是甲根那圈死皮；甲面上的白色月牙叫 lunula，不是它。',
  '指甲根部一圈皮为黄绿',
  '<path class="f-g" d="M110 230 L110 100 Q110 40 170 40 Q230 40 230 100 L230 230"/><path class="f-p" d="M132 168 L132 96 Q132 64 170 64 Q208 64 208 96 L208 168 Z"/><path class="f-u" d="M128 150 Q170 118 212 150 L208 168 L132 168 Z"/>',
  170, 148, 48);

add('uvula', '喉咙', 1,
  '张嘴时喉咙口垂着的那一小块，<br>英文叫什么？',
  'uvula', ['tonsil', 'palate', 'adenoid'],
  'uvula 是软腭末端的小肉垂，吞咽时会跟着抬起来。',
  '张开的嘴，喉口垂块为黄绿',
  '<path class="f-p" d="M70 70 Q170 20 270 70 L250 190 Q170 230 90 190 Z"/><path class="f-i" d="M110 150 Q170 120 230 150 L220 190 Q170 210 120 190 Z"/><path class="f-u" d="M160 118 Q180 118 178 168 Q170 182 162 168 Q158 118 160 118 Z"/>',
  170, 148, 36);

add('hangnail', '指甲', 1,
  '指甲旁边撕起来的那条倒刺，<br>英文叫什么？',
  'hangnail', ['whitlow', 'splinter', 'thorn'],
  'hangnail 是甲缘撕起的一小条皮，不是木头刺，也不是甲沟炎。',
  '指尖指甲旁一条翘起的皮为黄绿',
  '<path class="f-g" d="M120 230 L120 90 Q120 46 170 46 Q220 46 220 90 L220 230"/><path class="f-p" d="M142 160 L142 88 Q142 66 170 66 Q198 66 198 88 L198 160 Z"/><path class="f-u" d="M198 100 L214 78 L222 88 L204 112 Z"/>',
  208, 94, 28);

add('widows-peak', '头发', 1,
  '额头发际线中间那个尖，<br>英文叫什么？',
  "widow's peak", ['bangs', 'parting', 'tuft'],
  "widow's peak 是额心向下的 V 形发际，跟头顶翘起的 cowlick 不是一处。",
  '发际线正中向下尖出，尖端为黄绿',
  '<path class="f-p" d="M80 230 L80 140 Q80 60 170 60 Q260 60 260 140 L260 230 Z"/><path class="f-i" d="M80 150 Q80 70 130 78 L170 118 L210 78 Q260 70 260 150 L260 170 Q170 140 80 170 Z"/><path class="f-u" d="M150 86 L170 124 L190 86 Z"/>',
  170, 108, 32);

add('tongue', '鞋', 1,
  '鞋带下面盖住脚背的那片，<br>英文叫什么？',
  'tongue', ['lacing', 'collar', 'sock'],
  'tongue 是鞋带底下那片鞋舌；包住脚背前半的大片叫 vamp。',
  '鞋子侧面，鞋带下的鞋舌为黄绿',
  '<path class="f-p" d="M36 196 L36 140 Q48 108 100 100 L150 70 L210 70 Q250 120 304 150 Q324 168 316 196 Z"/><rect class="f-i" x="36" y="196" width="280" height="14"/><path class="f-u" d="M168 74 L196 74 L188 150 L156 150 Z"/><circle class="f-p" cx="176" cy="96" r="5"/><circle class="f-p" cx="180" cy="116" r="5"/>',
  176, 112, 48);

add('bobbin', '缝纫', 1,
  '缝纫机下面绕底线的小线轴，<br>英文叫什么？',
  'bobbin', ['shuttle', 'cop', 'spindle'],
  'bobbin 是缝纫机梭心里那只绕底线的小轴，上面的大轴才叫 spool。',
  '缝纫机针下，一只小线轴为黄绿',
  '<rect class="f-g" x="40" y="40" width="200" height="150"/><rect class="f-i" x="150" y="40" width="10" height="70"/><circle class="f-p" cx="250" cy="150" r="36"/><rect class="f-u" x="232" y="126" width="36" height="48"/><circle class="f-p" cx="250" cy="150" r="10"/>',
  250, 150, 48);

add('thimble', '缝纫', 1,
  '缝衣服时套在指头上的小帽，<br>英文叫什么？',
  'thimble', ['plectrum', 'sheath', 'mitt'],
  'thimble 是顶针，圆点是为了把针尾顶进去。',
  '指头上的圆帽为黄绿，帽面有小点',
  '<rect class="f-g" x="150" y="120" width="40" height="100"/><path class="f-u" d="M146 120 L194 120 L194 150 Q170 70 146 150 Z"/><circle class="f-i" cx="162" cy="112" r="3"/><circle class="f-i" cx="178" cy="108" r="3"/><circle class="f-i" cx="170" cy="124" r="3"/>',
  170, 112, 40);

add('raglan', '袖子', 1,
  '从腋下一直斜到领口的那种袖子，<br>英文叫什么？',
  'raglan', ['dolman', 'kimono', 'bishop'],
  'raglan 袖的缝不绕着臂根，而是从腋下斜到领口。',
  '上衣轮廓，斜到领口的袖缝为黄绿',
  '<path class="f-p" d="M120 70 L150 46 L190 46 L220 70 L250 150 L210 160 L190 100 L190 220 L150 220 L150 100 L130 160 L90 150 Z"/><path d="M150 52 L130 158 M190 52 L210 158" fill="none" stroke="#2B44C9" stroke-width="6"/>',
  168, 100, 50);

add('riser', '楼梯', 1,
  '楼梯每一级竖直的那块板，<br>英文叫什么？',
  'riser', ['tread', 'landing', 'stringer'],
  'riser 是竖板；脚踩的平面叫 tread，探出的前缘叫 nosing。',
  '楼梯侧面，竖板为黄绿',
  '<path class="f-g" d="M40 200 H120 V140 H200 V80 H280 V40 H200 V100 H120 V160 H40 Z"/><rect class="f-u" x="120" y="140" width="16" height="60"/><rect class="f-p" x="136" y="140" width="64" height="16"/>',
  128, 170, 36);

add('gargoyle', '排水', 1,
  '屋顶上会把雨水吐出去的石兽，<br>英文叫什么？',
  'gargoyle', ['grotesque', 'corbel', 'chimera'],
  'gargoyle 必须是排水口；只做装饰、不吐水的石兽叫 grotesque。',
  '屋檐兽头，嘴里吐出的水为黄绿',
  '<path class="f-g" d="M40 80 H200 L200 150 L40 190 Z"/><path class="f-p" d="M170 96 Q230 70 280 110 Q250 130 210 124 Q230 150 190 156 Q170 130 170 96 Z"/><circle class="f-i" cx="236" cy="104" r="5"/><path class="f-u" d="M268 112 Q300 140 250 150 Q270 128 268 112 Z"/>',
  270, 132, 36);

add('spoke', '自行车', 1,
  '自行车轮毂和轮圈之间的细条，<br>英文叫什么？',
  'spoke', ['stay', 'strut', 'rib'],
  'spoke 是辐条，从花鼓拉到钢圈，用来把力量传过去。',
  '车轮里一根辐条为黄绿',
  '<circle class="f-p" cx="170" cy="125" r="90"/><circle class="f-g" cx="170" cy="125" r="70"/><circle class="f-i" cx="170" cy="125" r="14"/><path class="f-s" d="M170 125 L210 70 M170 125 L230 150 M170 125 L120 180 M170 125 L110 80"/><path d="M170 125 L236 60" fill="none" stroke="#2B44C9" stroke-width="5"/>',
  210, 86, 30);

add('fret', '吉他', 1,
  '吉他指板上横着的金属小条，<br>英文叫什么？',
  'fret', ['inlay', 'marker', 'binding'],
  'fret 是品格上的金属条，手指按在它后面，音高才准。',
  '琴颈上一条金属品丝为黄绿',
  '<path class="f-g" d="M70 70 H270 L250 190 H90 Z"/><path class="f-s" d="M150 78 L158 182 M190 74 L186 186"/><rect class="f-u" x="118" y="78" width="8" height="100"/><circle class="f-i" cx="200" cy="120" r="6"/>',
  122, 128, 28);

add('fingerboard', '小提琴', 1,
  '小提琴上按弦的那块黑木板，<br>英文叫什么？',
  'fingerboard', ['scroll', 'tailpiece', 'neck'],
  'fingerboard 是指板；琴头的蜗牛卷叫 scroll，拖住弦的叫 tailpiece。',
  '琴身上方的黑色指板为黄绿',
  '<ellipse class="f-p" cx="150" cy="160" rx="70" ry="80"/><rect class="f-g" x="200" y="40" width="28" height="70"/><rect class="f-u" x="198" y="70" width="36" height="120"/><circle class="f-i" cx="150" cy="150" r="16"/>',
  216, 130, 40);

add('pickguard', '吉他', 1,
  '吉他面板上防拨片刮花的那片，<br>英文叫什么？',
  'pickguard', ['binding', 'veneer', 'cavity'],
  'pickguard 是护板，挡的是拨片，不是琴身边上的镶线。',
  '吉他面板上的护板为黄绿',
  '<path class="f-p" d="M110 40 H230 Q270 110 240 200 Q170 230 120 190 Q80 120 110 40 Z"/><circle class="f-i" cx="160" cy="100" r="16"/><path class="f-u" d="M168 120 Q230 130 210 190 Q160 170 150 140 Z"/>',
  190, 156, 46);

add('dipstick', '引擎', 1,
  '抽出来看机油还剩多少的那根杆，<br>英文叫什么？',
  'dipstick', ['gauge', 'probe', 'funnel'],
  'dipstick 是量油尺，末端有刻度，擦干再插回去才准。',
  '引擎盖下一根抽出的尺为黄绿',
  '<path class="f-g" d="M70 80 H250 L270 200 H50 Z"/><rect class="f-i" x="150" y="48" width="28" height="20"/><rect class="f-u" x="158" y="20" width="12" height="90"/><rect class="f-p" x="154" y="16" width="20" height="14"/>',
  164, 50, 30);

add('trivet', '厨房', 1,
  '垫在热锅下面、免得烫桌子的架子，<br>英文叫什么？',
  'trivet', ['coaster', 'tripod', 'platter'],
  'trivet 把热锅架离桌面；杯子底下那片薄的叫 coaster。',
  '三脚架上一口锅，架子为黄绿',
  '<ellipse class="f-p" cx="170" cy="120" rx="70" ry="22"/><path class="f-g" d="M110 120 L120 170 H220 L230 120"/><path class="f-u" d="M90 176 H250 L230 196 H110 Z"/><path class="f-u" d="M120 196 L100 220 M170 196 L170 224 M220 196 L240 220" fill="none" stroke="#2B44C9" stroke-width="8"/>',
  170, 200, 50);

add('dovetail', '木工', 1,
  '两块木头咬在一起的扇形榫，<br>英文叫什么？',
  'dovetail', ['finger', 'scarf', 'bridle'],
  'dovetail 是燕尾榫，一头宽一头窄，拉开时会互相卡住。',
  '两块木板相接，扇形榫头为黄绿',
  '<rect class="f-g" x="30" y="80" width="140" height="90"/><rect class="f-p" x="170" y="80" width="140" height="90"/><path class="f-u" d="M150 92 L190 104 L150 122 Z"/><path class="f-u" d="M150 132 L190 144 L150 162 Z"/>',
  170, 124, 36);

add('rafter', '屋顶', 1,
  '沿着斜屋顶、从屋脊撑到檐口的梁，<br>英文叫什么？',
  'rafter', ['purlin', 'stud', 'beam'],
  'rafter 是斜着的椽条；横着托住它们的才叫 purlin。',
  '人字屋顶里一根斜梁为黄绿',
  '<path class="f-p" d="M40 170 L170 50 L300 170 Z"/><rect class="f-g" x="70" y="170" width="200" height="40"/><path class="f-u" d="M150 78 L176 78 L250 160 L224 160 Z"/>',
  196, 118, 40);

add('joist', '楼板', 1,
  '平行排着、托住地板的水平梁，<br>英文叫什么？',
  'joist', ['girder', 'stud', 'nogging'],
  'joist 是搁栅，一根根横在楼板底下；竖直的墙骨叫 stud。',
  '楼板底下并排的梁，其中一根为黄绿',
  '<rect class="f-g" x="40" y="60" width="260" height="28"/><rect class="f-p" x="60" y="88" width="22" height="110"/><rect class="f-u" x="120" y="88" width="22" height="110"/><rect class="f-p" x="180" y="88" width="22" height="110"/><rect class="f-p" x="240" y="88" width="22" height="110"/>',
  131, 143, 36);

add('keystone', '拱门', 1,
  '拱顶正中那块楔形石头，<br>英文叫什么？',
  'keystone', ['impost', 'springer', 'capstone'],
  'keystone 是拱心石，抽掉它，两边的楔形石会松。',
  '半圆拱正中的楔形石为黄绿',
  '<path class="f-g" d="M50 200 V120 Q170 10 290 120 V200"/><path class="f-p" d="M70 200 V130 Q170 40 270 130 V200"/><path class="f-u" d="M156 58 L184 58 L196 96 L144 96 Z"/>',
  170, 76, 36);

add('dormer', '屋顶', 1,
  '从斜屋顶上竖着长出来的小窗，<br>英文叫什么？',
  'dormer', ['skylight', 'oriel', 'bay'],
  'dormer 自带一小段竖直墙和自己的小屋顶；平贴在斜面上的是天窗。',
  '斜屋顶上凸出的竖窗为黄绿',
  '<path class="f-g" d="M20 190 L170 60 L320 190 Z"/><path class="f-u" d="M130 130 L170 96 L210 130 V176 H130 Z"/><rect class="f-p" x="148" y="140" width="24" height="28"/>',
  170, 136, 46);

add('gable', '屋顶', 1,
  '双坡屋顶两端那面三角形的墙，<br>英文叫什么？',
  'gable', ['pediment', 'hip', 'parapet'],
  'gable 是山墙；如果四面都是斜坡、没有这面三角墙，那是 hip roof。',
  '房子端部的三角墙为黄绿',
  '<rect class="f-p" x="70" y="140" width="200" height="80"/><path class="f-u" d="M50 140 L170 50 L290 140 Z"/><rect class="f-i" x="150" y="168" width="40" height="52"/>',
  170, 96, 50);

add('eave', '屋顶', 1,
  '屋顶伸出外墙的那一截，<br>英文叫什么？',
  'eave', ['verge', 'cornice', 'drip'],
  'eave 是屋檐挑出的部分，雨水从这里离开墙面。',
  '墙体上方挑出的檐口为黄绿',
  '<rect class="f-g" x="90" y="120" width="160" height="100"/><path class="f-p" d="M40 120 L170 40 L300 120 Z"/><rect class="f-u" x="40" y="112" width="260" height="18"/>',
  170, 121, 40);

add('lintel', '门口', 1,
  '门洞上方横跨过去的那根梁，<br>英文叫什么？',
  'lintel', ['sill', 'jamb', 'threshold'],
  'lintel 是门窗洞口上的横梁；两边竖框叫 jamb，脚下那条叫 threshold。',
  '门洞上方的横梁为黄绿',
  '<rect class="f-g" x="50" y="40" width="240" height="180"/><rect class="f-p" x="110" y="90" width="120" height="130"/><rect class="f-u" x="90" y="70" width="160" height="22"/>',
  170, 81, 40);

add('umlaut', '字母', 1,
  '德语里改变元音的两点，<br>比如 ü 上的，叫什么？',
  'umlaut', ['diaeresis', 'macron', 'breve'],
  'umlaut 改变元音的音；样子相同、只表示两个元音分开读的叫 diaeresis。',
  '字母 u 头顶两点为黄绿',
  '<text class="f-t" x="170" y="180" font-size="120" text-anchor="middle">u</text><circle class="f-u" cx="138" cy="78" r="10"/><circle class="f-u" cx="176" cy="78" r="10"/>',
  157, 78, 40);

add('cedilla', '字母', 1,
  '字母 c 下面那个小钩，<br>比如 ç，叫什么？',
  'cedilla', ['ogonek', 'caron', 'macron'],
  'cedilla 是 ç 下面的钩，告诉你这个 c 读成 s。',
  '字母 c 下方的小钩为黄绿',
  '<text class="f-t" x="170" y="150" font-size="120" text-anchor="middle">c</text><path class="f-u" d="M150 156 Q170 210 196 168" fill="none" stroke="#2B44C9" stroke-width="10"/>',
  172, 180, 36);

add('em-dash', '标点', 1,
  '句子里那条最长的横线破折号，<br>英文叫什么？',
  'em dash', ['en dash', 'hyphen', 'minus'],
  'em dash 大约有一个字母 m 那么长；短一点的 en dash 多用来表示范围。',
  '三个符号并列，最长的一条为黄绿',
  '<rect class="f-i" x="60" y="120" width="36" height="8"/><rect class="f-i" x="130" y="120" width="70" height="8"/><rect class="f-u" x="220" y="116" width="90" height="14"/>',
  265, 123, 40);

add('nib', '钢笔', 1,
  '钢笔尖上那片开了缝的金属，<br>英文叫什么？',
  'nib', ['beak', 'reservoir', 'breather'],
  'nib 是笔尖；墨水从中间那条缝流到纸上。',
  '钢笔笔尖为黄绿，中间有一条缝',
  '<rect class="f-g" x="150" y="30" width="40" height="80"/><path class="f-u" d="M146 100 L194 100 L184 190 L156 190 Z"/><path d="M170 120 L170 180" fill="none" stroke="#111" stroke-width="2"/><circle class="f-i" cx="170" cy="132" r="5"/>',
  170, 145, 46);

add('reed', '单簧管', 1,
  '单簧管吹口上那片会振动的薄片，<br>英文叫什么？',
  'reed', ['mouthpiece', 'barrel', 'bell'],
  'reed 是哨片，多半用芦竹做；箍住它的金属圈叫 ligature。',
  '吹口上的薄哨片为黄绿',
  '<rect class="f-p" x="140" y="70" width="50" height="120"/><path class="f-u" d="M168 40 L196 70 L176 150 L156 70 Z"/><rect class="f-i" x="160" y="78" width="28" height="10"/>',
  176, 90, 40);

add('bridge', '小提琴', 1,
  '小提琴上把弦撑起来的那块小木，<br>英文叫什么？',
  'bridge', ['nut', 'tailpiece', 'bassbar'],
  'bridge 是琴码，把弦的振动传给面板；琴里面那根小柱子另叫 sound post。',
  '两只 f 孔之间的琴码为黄绿',
  '<ellipse class="f-p" cx="170" cy="130" rx="80" ry="90"/><path class="f-i" d="M110 90 Q124 130 110 170"/><path class="f-i" d="M230 90 Q216 130 230 170"/><path class="f-u" d="M150 78 H190 L184 150 H156 Z"/><path class="f-s" d="M60 70 H280"/>',
  170, 114, 40);

add('buttress', '墙', 1,
  '墙外斜撑着墙的那一垛，<br>英文叫什么？',
  'buttress', ['pier', 'pilaster', 'rampart'],
  'buttress 是扶壁，斜着把侧推力传回地面。',
  '高墙外侧的斜撑为黄绿',
  '<rect class="f-g" x="70" y="40" width="70" height="180"/><path class="f-u" d="M140 90 L230 200 H140 Z"/>',
  180, 150, 50);

add('calyx', '草莓', 1,
  '草莓顶端那一整圈绿叶，<br>合起来叫什么？',
  'calyx', ['sepal', 'bract', 'corona'],
  '每一片叶子叫 sepal，合在一起才是 calyx。',
  '草莓顶部的一圈绿叶为黄绿',
  '<path class="f-p" d="M120 80 Q170 40 220 80 Q250 140 170 200 Q90 140 120 80 Z"/><path class="f-u" d="M170 96 L150 48 L170 70 L190 44 L184 96 Z"/><path class="f-u" d="M150 100 L110 70 L146 108 Z"/><path class="f-u" d="M190 100 L230 70 L194 108 Z"/>',
  170, 74, 40);

add('pincushion', '缝纫', 1,
  '插针用的那个小软垫，<br>英文叫什么？',
  'pincushion', ['cushion', 'spool', 'tray'],
  'pincushion 是针插，针尖插进去，针头留在外面。',
  '圆垫上几根针，垫子为黄绿',
  '<ellipse class="f-u" cx="170" cy="140" rx="80" ry="50"/><path class="f-i" d="M140 140 L150 70 M170 130 L176 60 M196 138 L210 78"/><circle class="f-p" cx="150" cy="68" r="6"/><circle class="f-p" cx="176" cy="58" r="6"/><circle class="f-p" cx="210" cy="76" r="6"/>',
  170, 140, 70);

add('seam-ripper', '缝纫', 1,
  '拆线时用的那把小叉刀，<br>英文叫什么？',
  'seam ripper', ['snips', 'awl', 'stiletto'],
  'seam ripper 一头是叉，叉尖有一小段刃，专门挑开线迹。',
  '笔形小工具，叉头为黄绿',
  '<rect class="f-p" x="150" y="70" width="28" height="120"/><path class="f-u" d="M150 70 L164 30 L178 70 Z"/><path class="f-u" d="M164 48 L210 20 L206 36 L164 58 Z"/><circle class="f-i" cx="208" cy="28" r="5"/>',
  176, 48, 36);

add('lapel', '西装', 1,
  '西装领子翻开的那两片，<br>英文叫什么？',
  'lapel', ['collar', 'gorge', 'notch'],
  'lapel 是驳头；它和领座交界的那条缝叫 gorge。',
  '西装前襟，翻开的驳头为黄绿',
  '<path class="f-p" d="M90 40 H250 L270 220 H70 Z"/><path class="f-u" d="M170 70 L110 150 L150 160 L170 90 Z"/><path class="f-u" d="M170 70 L230 150 L190 160 L170 90 Z"/><path class="f-s" d="M170 70 V220"/>',
  140, 120, 40);

add('insole', '鞋', 1,
  '鞋里直接贴着脚的那层垫，<br>英文叫什么？',
  'insole', ['lining', 'cushion', 'sock'],
  'insole 是鞋内底，贴着脚；真正踩到地上的那层叫 outsole。',
  '鞋子剖开，内底一层为黄绿',
  '<path class="f-p" d="M40 150 Q80 90 160 86 Q250 96 300 150 L290 190 H50 Z"/><rect class="f-i" x="50" y="176" width="240" height="18"/><path class="f-u" d="M70 150 Q150 132 270 156 L260 172 H80 Z"/>',
  170, 156, 50);

add('filament', '灯泡', 1,
  '白炽灯泡里会发光的那根细丝，<br>英文叫什么？',
  'filament', ['electrode', 'coil', 'envelope'],
  'filament 是灯丝；外面那层玻璃壳叫 envelope，不是发光的部分。',
  '灯泡里弯曲的灯丝为黄绿',
  '<circle class="f-p" cx="170" cy="110" r="70"/><rect class="f-g" x="150" y="175" width="40" height="30"/><rect class="f-i" x="158" y="205" width="24" height="16"/><path d="M145 120 Q170 80 195 120 Q170 150 145 120" fill="none" stroke="#2B44C9" stroke-width="4"/>',
  170, 116, 40);

add('tendril', '藤蔓', 1,
  '豌豆藤上卷成弹簧的那根细须，<br>英文叫什么？',
  'tendril', ['vine', 'stem', 'clasper'],
  'tendril 是卷须，碰到支架就会缠上去。',
  '藤茎旁一根卷曲的须为黄绿',
  '<path class="f-g" d="M80 210 Q90 80 150 70"/><path d="M150 90 Q190 90 190 130 Q190 170 230 160 Q260 150 250 120" fill="none" stroke="#2B44C9" stroke-width="6"/>',
  210, 130, 50);

add('floret', '西兰花', 1,
  '西兰花上可以掰下来的一小朵，<br>英文叫什么？',
  'floret', ['curd', 'bud', 'spear'],
  'floret 是小花球；花椰菜整颗头更常叫 curd。',
  '一棵西兰花，顶端一小朵为黄绿',
  '<rect class="f-g" x="156" y="140" width="28" height="70"/><circle class="f-p" cx="140" cy="120" r="28"/><circle class="f-p" cx="200" cy="120" r="28"/><circle class="f-p" cx="170" cy="96" r="30"/><circle class="f-u" cx="214" cy="86" r="22"/>',
  214, 86, 32);

add('bristle', '牙刷', 1,
  '牙刷头上那一根根毛，<br>英文叫什么？',
  'bristle', ['fiber', 'tuft', 'quill'],
  'bristle 是刷毛；牙刷上的一簇毛可以叫 tuft，单根才是 bristle。',
  '牙刷头上几根毛为黄绿',
  '<rect class="f-p" x="40" y="150" width="180" height="18"/><rect class="f-g" x="210" y="140" width="90" height="36"/><path d="M224 140 L220 90 M244 140 L246 84 M264 140 L270 88 M286 140 L292 96" fill="none" stroke="#2B44C9" stroke-width="4"/>',
  258, 112, 40);

add('clove', '大蒜', 1,
  '大蒜里可以掰开的一瓣，<br>英文叫什么？',
  'clove', ['bulb', 'wedge', 'pearl'],
  'clove 是蒜瓣；整头蒜叫 bulb。',
  '一头蒜里分开的一瓣为黄绿',
  '<circle class="f-g" cx="170" cy="125" r="78"/><path class="f-p" d="M170 125 L170 60 A70 70 0 0 1 230 150 Z"/><path class="f-p" d="M170 125 L120 80 A70 70 0 0 1 170 60 Z"/><path class="f-u" d="M170 125 L230 150 A70 70 0 0 1 120 160 Z"/>',
  180, 168, 40);

export { add, RAW, fs };

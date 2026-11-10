import { add } from './gen_extra_bank.mjs';

add('helix', '耳朵', 2,
  '耳廓最外圈卷起的软骨，<br>英文叫什么？',
  'helix', ['antihelix', 'scapha', 'crus'],
  'helix 是耳廓外缘那一圈；里面平行的那道棱叫 antihelix。',
  '耳朵外圈软骨为黄绿',
  '<path class="f-p" d="M150 40 Q80 70 96 140 Q112 210 170 220 Q210 210 196 140 Q186 80 164 52 Z"/><path class="f-g" d="M168 78 Q140 110 150 156 Q164 190 186 168 Q172 120 180 92 Z"/><path class="f-u" d="M150 40 Q78 68 94 142 Q108 200 150 214 L156 190 Q112 180 112 140 Q100 80 156 58 Z"/>',
  112, 120, 48);

add('lobule', '耳朵', 2,
  '耳垂的解剖名，<br>叫什么？',
  'lobule', ['pinna', 'auricle', 'flap'],
  '口语叫 earlobe；解剖书写法是 lobule，不含上方的软骨圈。',
  '耳朵最下方的软垂为黄绿',
  '<path class="f-p" d="M150 36 Q78 70 92 140 Q108 200 168 188 Q200 176 190 120 Q180 70 164 48 Z"/><ellipse class="f-u" cx="150" cy="196" rx="36" ry="28"/>',
  150, 196, 40);

add('frenulum', '舌头', 2,
  '舌下连着口腔底的那条筋，<br>英文叫什么？',
  'frenulum', ['ligament', 'tether', 'band'],
  'frenulum 是舌系带，把舌头拉向口腔底，太短就会影响发音。',
  '舌下正中一条筋为黄绿',
  '<path class="f-p" d="M70 80 Q170 20 270 80 L250 160 Q170 200 90 160 Z"/><path class="f-g" d="M110 120 Q170 90 230 120 L210 160 Q170 180 130 160 Z"/><rect class="f-u" x="162" y="118" width="16" height="48"/>',
  170, 142, 30);

add('papilla', '舌头', 2,
  '舌面上一粒粒的小突起，<br>英文叫什么？',
  'papilla', ['taste bud', 'nodule', 'villus'],
  'papilla 是舌乳头，味蕾长在它上面，本身不是味蕾。',
  '舌面上几粒突起为黄绿',
  '<path class="f-p" d="M60 130 Q170 60 280 130 Q170 210 60 130 Z"/><circle class="f-u" cx="130" cy="120" r="8"/><circle class="f-u" cx="170" cy="108" r="8"/><circle class="f-u" cx="210" cy="120" r="8"/><circle class="f-u" cx="150" cy="146" r="7"/><circle class="f-u" cx="196" cy="146" r="7"/>',
  170, 126, 50);

add('epiglottis', '喉咙', 2,
  '吞咽时盖住气管的那片软骨，<br>英文叫什么？',
  'epiglottis', ['glottis', 'larynx', 'valve'],
  'epiglottis 是会厌，吃饭时盖住气道；glottis 是声门那个开口。',
  '喉部剖面，盖片为黄绿',
  '<path class="f-g" d="M120 40 H220 V230 H120 Z"/><path class="f-p" d="M140 70 H200 L190 200 H150 Z"/><path class="f-u" d="M150 78 Q200 60 206 110 L150 96 Z"/>',
  180, 88, 36);

add('mastoid', '耳朵', 2,
  '耳朵后面摸得到的那块骨突，<br>英文叫什么？',
  'mastoid', ['occiput', 'temporal', 'bump'],
  'mastoid 是颞骨乳突，就在耳廓正后方。',
  '头侧面，耳后骨突为黄绿',
  '<circle class="f-p" cx="150" cy="120" r="70"/><path class="f-g" d="M112 100 Q100 140 120 170"/><ellipse class="f-u" cx="108" cy="150" rx="22" ry="28"/>',
  108, 150, 32);

add('whorl', '头发', 2,
  '头顶头发旋出的那个涡，<br>英文叫什么？',
  'whorl', ['swirl', 'vertex', 'parting'],
  'whorl 是发旋；翘起来的一撮叫 cowlick，位置和样子都不同。',
  '头顶一个旋涡为黄绿',
  '<path class="f-p" d="M80 210 Q80 70 170 60 Q260 70 260 210 Z"/><path class="f-i" d="M90 150 Q100 80 170 78 Q240 80 250 150 Q200 120 170 130 Q140 120 90 150 Z"/><path class="f-u" d="M170 96 Q196 110 184 140 Q170 122 150 142 Q158 108 170 96 Z"/>',
  172, 118, 36);

add('quick', '指甲', 2,
  '指甲下面一剪就疼的活肉，<br>英文叫什么？',
  'quick', ['pulp', 'dermis', 'matrix'],
  'quick 是甲下的敏感活肉；长指甲的那块甲根叫 matrix。',
  '指甲盖下方的一层肉为黄绿',
  '<path class="f-g" d="M120 220 L120 90 Q120 40 170 40 Q220 40 220 90 L220 220"/><path class="f-p" d="M140 150 L140 86 Q140 62 170 62 Q200 62 200 86 L200 150 Z"/><rect class="f-u" x="146" y="108" width="48" height="36"/>',
  170, 126, 36);

add('cilia', '眼睛', 2,
  '睫毛的解剖用词，<br>叫什么？',
  'cilia', ['seta', 'villus', 'fringe'],
  'cilia 在解剖里既指细胞上的纤毛，也指眼睫毛。',
  '眼睛上缘一排睫毛为黄绿',
  '<path class="f-p" d="M60 130 Q120 80 200 130 Q120 180 60 130 Z"/><circle class="f-i" cx="130" cy="130" r="16"/><path d="M80 108 L74 78 M110 92 L108 64 M140 88 L146 60 M170 96 L180 70" fill="none" stroke="#2B44C9" stroke-width="4"/>',
  124, 84, 40);

add('nasolabial', '脸', 2,
  '从鼻翼拉到嘴角的那道纹，<br>英文叫什么？',
  'nasolabial fold', ['crease', 'furrow', 'wrinkle'],
  'nasolabial fold 就是法令纹，从鼻翼连到嘴角。',
  '面部下半，鼻翼到嘴角的纹为黄绿',
  '<path class="f-p" d="M90 40 Q170 10 250 40 L260 160 Q170 230 80 160 Z"/><path class="f-g" d="M120 90 Q170 120 220 90"/><path class="f-u" d="M124 118 Q150 160 168 176" fill="none" stroke="#2B44C9" stroke-width="8"/><path class="f-i" d="M110 180 Q170 210 230 180" fill="none"/>',
  146, 148, 36);

add('cupids-bow', '嘴唇', 2,
  '上唇正中那道双峰曲线，<br>英文叫什么？',
  "Cupid's bow", ['arc', 'peak', 'notch'],
  "Cupid's bow 指上唇唇红缘中间的 M 形双峰。",
  '上唇双峰曲线为黄绿',
  '<path class="f-g" d="M70 80 H270 V200 H70 Z"/><path class="f-u" d="M80 120 L120 100 L150 124 L170 108 L190 124 L220 100 L260 120 L240 150 Q170 170 100 150 Z"/>',
  170, 124, 70);

add('hypothenar', '手掌', 2,
  '手掌小指一侧那块肉垫，<br>英文叫什么？',
  'hypothenar', ['mount', 'pad', 'palm'],
  '大拇指根的肉垫叫 thenar，小指这一侧才是 hypothenar。',
  '摊开的手掌，小指侧肉垫为黄绿',
  '<path class="f-p" d="M120 40 H230 V160 Q220 220 150 226 Q70 210 90 140 Q100 70 130 80 Z"/><rect class="f-g" x="176" y="16" width="22" height="36"/><ellipse class="f-u" cx="196" cy="170" rx="36" ry="40"/>',
  196, 170, 48);

add('laryngeal', '脖子', 2,
  '喉结的解剖名，<br>叫什么？',
  'laryngeal prominence', ['thyroid', 'cartilage', 'tubercle'],
  '喉结是甲状软骨向前的突起，解剖名 laryngeal prominence。',
  '脖子正面隆起的喉结为黄绿',
  '<path class="f-g" d="M110 30 H230 L210 230 H130 Z"/><path class="f-u" d="M150 90 L190 90 L200 130 L170 156 L140 130 Z"/>',
  170, 122, 40);

add('hackles', '狗', 2,
  '狗后颈上会竖起来的毛，<br>英文叫什么？',
  'hackles', ['ruff', 'mane', 'scruff'],
  'hackles 是能竖起的颈背毛；平时披着的一圈长毛叫 ruff。',
  '狗的后颈，竖起的毛为黄绿',
  '<path class="f-g" d="M40 160 Q120 120 200 150 L230 120 L260 170 L200 190 L80 200 Z"/><circle class="f-p" cx="250" cy="110" r="28"/><path d="M150 150 L140 90 M170 146 L174 86 M190 148 L200 96" fill="none" stroke="#2B44C9" stroke-width="5"/>',
  170, 116, 40);

add('crop', '鸟', 2,
  '鸟喉咙里暂存食物的囊，<br>英文叫什么？',
  'crop', ['pouch', 'throat', 'stomach'],
  'crop 是嗉囊，在食道上临时存食物；磨食物的是后面的 gizzard。',
  '鸟颈侧面鼓起的囊为黄绿',
  '<circle class="f-p" cx="210" cy="80" r="36"/><path class="f-i" d="M230 96 L270 110 L232 120 Z"/><path class="f-g" d="M180 110 Q150 160 160 220"/><ellipse class="f-u" cx="150" cy="150" rx="28" ry="22"/>',
  150, 150, 36);

add('dewlap', '牛', 2,
  '牛喉下那片松松的皮，<br>英文叫什么？',
  'dewlap', ['jowl', 'pouch', 'fold'],
  'dewlap 是喉下垂皮；鸡下巴那两片另叫 wattle。',
  '牛头下方垂下的皮为黄绿',
  '<ellipse class="f-p" cx="170" cy="80" rx="70" ry="40"/><rect class="f-g" x="150" y="110" width="40" height="40"/><path class="f-u" d="M156 146 Q170 210 200 150 Q176 170 156 146 Z"/>',
  176, 172, 36);

add('spur', '公鸡', 2,
  '公鸡腿上向后的尖刺，<br>英文叫什么？',
  'spur', ['spike', 'claw', 'talon'],
  'spur 是距，长在公鸡跗跖后面，不是脚趾上的爪。',
  '鸡腿后侧一根尖刺为黄绿',
  '<rect class="f-g" x="150" y="40" width="28" height="150"/><path class="f-p" d="M150 170 L120 210 H190 L178 170 Z"/><path class="f-u" d="M150 120 L90 150 L150 140 Z"/>',
  120, 134, 32);

add('beard', '火鸡', 2,
  '火鸡胸口那撮硬毛，<br>英文叫什么？',
  'beard', ['tassel', 'tuft', 'plume'],
  '火鸡胸口那撮又黑又硬的毛叫 beard；额头垂下来的肉叫 snood。',
  '火鸡胸前一撮毛为黄绿',
  '<ellipse class="f-g" cx="170" cy="150" rx="80" ry="60"/><circle class="f-p" cx="170" cy="70" r="28"/><path class="f-u" d="M170 120 Q160 160 150 190 M170 120 Q180 165 190 196 M170 120 L170 186" fill="none" stroke="#2B44C9" stroke-width="4"/>',
  170, 156, 36);

add('plastron', '乌龟', 2,
  '龟壳朝下的那一整块，<br>英文叫什么？',
  'plastron', ['belly', 'scute', 'shield'],
  'plastron 是腹甲；背上那块圆壳叫 carapace。',
  '乌龟翻过来，腹甲为黄绿',
  '<ellipse class="f-g" cx="170" cy="130" rx="100" ry="60"/><ellipse class="f-u" cx="170" cy="136" rx="70" ry="40"/><path class="f-s" d="M120 136 H220 M170 104 V176"/>',
  170, 136, 70);

add('baleen', '鲸', 2,
  '须鲸嘴里那些角质滤片，<br>英文叫什么？',
  'baleen', ['filter', 'plate', 'fringe'],
  'baleen 是鲸须，一排角质片用来滤出小鱼和磷虾。',
  '鲸嘴上缘垂下的滤片为黄绿',
  '<path class="f-p" d="M60 80 Q170 40 280 90 L260 150 Q170 120 80 160 Z"/><path d="M100 96 L96 150 M130 90 L128 156 M160 86 L160 150 M190 88 L194 148 M220 94 L226 140" fill="none" stroke="#2B44C9" stroke-width="6"/>',
  160, 120, 50);

add('fluke', '鲸', 2,
  '鲸尾左右张开的那一叶，<br>英文叫什么？',
  'fluke', ['fin', 'lobe', 'paddle'],
  '鲸尾的每一叶叫 fluke，两叶合称 flukes，不是普通的鳍。',
  '鲸尾的一侧叶为黄绿',
  '<path class="f-g" d="M40 140 Q120 100 170 120 Q220 100 300 140 Q220 160 170 140 Q120 160 40 140 Z"/><path class="f-u" d="M170 120 Q230 104 300 140 Q230 156 170 140 Z"/>',
  230, 132, 46);

add('withers', '马', 2,
  '马肩胛之间隆起的背，<br>英文叫什么？',
  'withers', ['crest', 'croup', 'scrag'],
  'withers 是鬐甲，量马的身高就从这里量到地面。',
  '马背肩胛之间的隆起为黄绿',
  '<path class="f-g" d="M40 150 Q100 140 140 100 Q170 70 210 110 Q250 140 300 146 L300 180 Q180 160 40 180 Z"/><path class="f-u" d="M130 112 Q160 78 196 112 Q170 100 130 112 Z"/><rect class="f-p" x="70" y="170" width="16" height="40"/><rect class="f-p" x="230" y="168" width="16" height="40"/>',
  164, 98, 36);

add('gizzard', '鸟', 2,
  '鸟用来磨碎食物的肌肉胃，<br>英文叫什么？',
  'gizzard', ['proventriculus', 'maw', 'stomach'],
  'gizzard 是肌胃，靠砂石把食物磨碎；它前面的腺胃叫 proventriculus。',
  '鸟身体里一只厚壁的胃为黄绿',
  '<ellipse class="f-p" cx="170" cy="130" rx="70" ry="80"/><ellipse class="f-u" cx="170" cy="140" rx="40" ry="46"/><circle class="f-i" cx="158" cy="136" r="5"/><circle class="f-i" cx="182" cy="150" r="4"/>',
  170, 140, 52);

add('hock', '马', 2,
  '马后腿向后弯的那个关节，<br>英文叫什么？',
  'hock', ['stifle', 'ankle', 'hamstring'],
  'hock 相当于人的脚踝，向后弯；往前弯的那个才是 stifle。',
  '马后腿向后的关节为黄绿',
  '<path class="f-g" d="M150 40 H190 L176 120 L210 200 H150 L170 120 Z"/><circle class="f-u" cx="184" cy="124" r="18"/>',
  184, 124, 28);

add('carapace', '乌龟', 2,
  '龟壳朝上的那块硬壳，<br>英文叫什么？',
  'carapace', ['shell', 'scute', 'dome'],
  'carapace 是背甲；腹面那块叫 plastron，壳上的一块鳞片叫 scute。',
  '乌龟背上的圆壳为黄绿',
  '<ellipse class="f-u" cx="170" cy="130" rx="100" ry="62"/><ellipse class="f-p" cx="170" cy="130" rx="46" ry="28"/><path class="f-s" d="M170 72 V188 M90 130 H250"/>',
  170, 130, 90);

add('dewclaw', '狗', 2,
  '狗腿内侧够不着地的爪，<br>英文叫什么？',
  'dewclaw', ['thumb', 'nail', 'digit'],
  'dewclaw 是悬爪，长得比其他脚趾更高，走路时通常碰不到地。',
  '狗爪内侧更高的一只为黄绿',
  '<path class="f-g" d="M110 200 Q170 150 250 190 L230 230 H90 Z"/><ellipse class="f-p" cx="130" cy="188" rx="16" ry="22"/><ellipse class="f-p" cx="170" cy="180" rx="16" ry="22"/><ellipse class="f-p" cx="206" cy="186" rx="16" ry="22"/><ellipse class="f-u" cx="118" cy="146" rx="14" ry="18"/>',
  118, 146, 26);

add('colophon', '书', 2,
  '书末交代出版信息的文字，<br>英文叫什么？',
  'colophon', ['imprint', 'afterword', 'errata'],
  'colophon 原来印在书的末尾，写明印坊和刊刻；出版社的标志后来也叫这个。',
  '书最后一页底部的小字块为黄绿',
  '<rect class="f-p" x="90" y="30" width="160" height="200"/><rect class="f-n" x="110" y="56" width="120" height="8"/><rect class="f-n" x="110" y="76" width="100" height="8"/><rect class="f-n" x="110" y="96" width="120" height="8"/><rect class="f-u" x="110" y="180" width="90" height="24"/>',
  155, 192, 36);

add('meniscus', '杯子', 2,
  '杯中液面弯弯的那一层，<br>英文叫什么？',
  'meniscus', ['surface', 'lens', 'tension'],
  'meniscus 是液面因为附着力弯起来的弧，水在玻璃杯里通常中间低。',
  '杯中液面的弧线为黄绿',
  '<path class="f-p" d="M90 50 H250 L230 210 H110 Z"/><path class="f-g" d="M102 130 H238 L226 200 H114 Z"/><path class="f-u" d="M104 130 Q170 156 236 130" fill="none" stroke="#2B44C9" stroke-width="8"/>',
  170, 136, 50);

add('capsule', '酒瓶', 2,
  '红酒瓶口包住木塞的封帽，<br>英文叫什么？',
  'capsule', ['hood', 'wrapper', 'sleeve'],
  'capsule 是酒帽，包在木塞和瓶口外面；铁丝笼另叫 muselet。',
  '瓶颈上的封帽为黄绿',
  '<path class="f-g" d="M140 120 H200 V150 Q240 180 240 230 H100 Q100 180 140 150 Z"/><rect class="f-p" x="148" y="70" width="44" height="52"/><rect class="f-u" x="142" y="46" width="56" height="36"/>',
  170, 64, 36);

add('charger', '餐盘', 2,
  '正餐盘下面那只更大的盘，<br>英文叫什么？',
  'charger', ['platter', 'salver', 'liner'],
  'charger 是垫盘，菜不放在它上面，它只托住上面的正餐盘。',
  '大盘中央叠着小盘，大盘为黄绿',
  '<ellipse class="f-u" cx="170" cy="140" rx="120" ry="36"/><ellipse class="f-p" cx="170" cy="130" rx="78" ry="24"/><ellipse class="f-g" cx="170" cy="126" rx="40" ry="12"/>',
  170, 156, 70);

add('bain-marie', '厨房', 2,
  '隔水加热那套锅的法文名，<br>叫什么？',
  'bain-marie', ['steamer', 'saucepan', 'insert'],
  'bain-marie 是隔水炖，外锅装热水，内锅慢慢受热。',
  '大锅里坐着一口小锅，热水为黄绿',
  '<path class="f-p" d="M70 110 H270 L250 200 H90 Z"/><path class="f-u" d="M90 150 H250 L240 196 H100 Z"/><path class="f-g" d="M110 90 H230 L220 150 H120 Z"/>',
  170, 172, 50);

add('reamer', '厨房', 2,
  '挤柠檬用的锥形头，<br>英文叫什么？',
  'reamer', ['zester', 'press', 'extractor'],
  'reamer 是锥形挤汁头，棱线把果肉刮下来。',
  '杯中一只带棱的锥为黄绿',
  '<path class="f-p" d="M80 170 H260 L240 210 H100 Z"/><path class="f-u" d="M170 60 L210 170 H130 Z"/><path class="f-s" d="M170 70 L160 160 M170 70 L180 160"/>',
  170, 120, 46);

add('fore-edge', '书', 2,
  '书页上跟书脊相对的外边，<br>英文叫什么？',
  'fore-edge', ['face', 'tail', 'opening'],
  'fore-edge 是切口中朝外的那一边；书脊在对面，下边叫 tail。',
  '书本右侧页面的外边为黄绿',
  '<rect class="f-g" x="70" y="40" width="28" height="170"/><rect class="f-p" x="98" y="46" width="150" height="158"/><rect class="f-u" x="240" y="46" width="14" height="158"/>',
  247, 125, 30);

add('ascender', '字母', 2,
  '高出小写 x 的那截笔画，<br>英文叫什么？',
  'ascender', ['stem', 'extender', 'upstroke'],
  'ascender 是 b、d、h 高出 x 高度的那一截，向下的叫 descender。',
  '字母 b 伸出的上半截为黄绿',
  '<text class="f-t" x="120" y="180" font-size="80">x</text><rect class="f-u" x="210" y="50" width="22" height="70"/><rect class="f-i" x="210" y="120" width="22" height="60"/><circle class="f-i" cx="232" cy="150" r="28" fill="none" stroke="#111" stroke-width="18"/>',
  221, 80, 30);

add('descender', '字母', 2,
  '掉到基线以下的那截笔画，<br>英文叫什么？',
  'descender', ['loop', 'drop', 'hook'],
  'descender 是 g、y、p 落到基线下面的部分。',
  '字母 y 落到基线以下的一截为黄绿',
  '<path class="f-s" d="M60 150 H300"/><text class="f-t" x="150" y="150" font-size="100" text-anchor="middle">y</text><rect class="f-u" x="168" y="140" width="22" height="55"/>',
  179, 168, 30);

add('endpaper', '书', 2,
  '封面和正文之间的衬纸，<br>英文叫什么？',
  'endpaper', ['flyleaf', 'pastedown', 'liner'],
  '整张叫 endpaper；粘在封面上的半张是 pastedown，能翻开的半张是 flyleaf。',
  '打开的封面内侧，衬纸为黄绿',
  '<path class="f-g" d="M40 40 H160 V210 H40 Z"/><rect class="f-u" x="160" y="40" width="140" height="170"/><rect class="f-p" x="188" y="56" width="90" height="140"/>',
  200, 125, 50);

add('gutter', '书', 2,
  '书缝靠近装订的那条沟，<br>英文叫什么？',
  'gutter', ['margin', 'spine', 'trough'],
  'gutter 是订口那边的凹槽，文字通常不会排进这里。',
  '摊开的书，中间那条沟为黄绿',
  '<path class="f-p" d="M30 50 H155 Q170 80 170 125 Q170 170 155 200 H30 Z"/><path class="f-p" d="M310 50 H185 Q170 80 170 125 Q170 170 185 200 H310 Z"/><rect class="f-u" x="160" y="50" width="20" height="150"/>',
  170, 125, 30);

add('pommel', '剑', 2,
  '剑柄末端那颗配重圆头，<br>英文叫什么？',
  'pommel', ['knob', 'butt', 'counterweight'],
  'pommel 在柄尾，用来平衡剑刃；帘杆头上的圆饰叫 finial，不是它。',
  '剑柄末端的圆头为黄绿',
  '<path class="f-p" d="M40 112 H150 L170 100 H230 L250 112 V138 L230 150 H170 L150 138 H40 Z"/><circle class="f-u" cx="70" cy="125" r="22"/>',
  70, 125, 32);

add('peen', '锤子', 2,
  '圆头锤上那个球形的一端，<br>英文叫什么？',
  'peen', ['poll', 'claw', 'cheek'],
  'peen 是锤头上不是平锤面的那一端，圆的就叫 ball peen。',
  '锤头球形的一端为黄绿',
  '<rect class="f-g" x="158" y="40" width="16" height="80"/><rect class="f-p" x="90" y="110" width="150" height="40"/><circle class="f-u" cx="250" cy="130" r="24"/><rect class="f-i" x="70" y="112" width="24" height="36"/>',
  250, 130, 34);

add('brad', '木工', 2,
  '木工用的那种头很小的细钉，<br>英文叫什么？',
  'brad', ['tack', 'sprig', 'pin'],
  'brad 是扁头细钉，用来钉饰条，钉进去之后几乎看不出帽。',
  '木条上几颗细钉，钉头为黄绿',
  '<rect class="f-g" x="60" y="90" width="220" height="70"/><rect class="f-u" x="100" y="70" width="8" height="40"/><rect class="f-u" x="150" y="66" width="8" height="44"/><rect class="f-u" x="200" y="72" width="8" height="38"/><rect class="f-i" x="96" y="66" width="16" height="6"/><rect class="f-i" x="146" y="62" width="16" height="6"/><rect class="f-i" x="196" y="68" width="16" height="6"/>',
  154, 80, 30);

add('shackle', '挂锁', 2,
  '挂锁上那根 U 形梁，<br>英文叫什么？',
  'shackle', ['hoop', 'link', 'body'],
  'shackle 是锁梁，打开时从锁体里抽上来。',
  '挂锁顶部的 U 形梁为黄绿',
  '<rect class="f-p" x="110" y="110" width="120" height="90"/><path class="f-u" d="M130 110 V80 Q170 30 210 80 V110" fill="none" stroke="#2B44C9" stroke-width="14"/>',
  170, 70, 46);

add('aerator', '水龙头', 2,
  '水龙头出口的那层细网，<br>英文叫什么？',
  'aerator', ['strainer', 'nozzle', 'diffuser'],
  'aerator 是起泡器，网片把水和空气混在一起，水流才不溅。',
  '龙头出口的网片为黄绿',
  '<rect class="f-g" x="70" y="40" width="40" height="70"/><rect class="f-p" x="70" y="100" width="160" height="28"/><rect class="f-i" x="210" y="108" width="30" height="14"/><circle class="f-u" cx="250" cy="140" r="22"/><path class="f-s" d="M238 140 H262 M250 128 V152"/>',
  250, 140, 32);

add('trap', '水管', 2,
  '洗手池下方的存水弯，<br>英文叫什么？',
  'trap', ['elbow', 'sump', 'drain'],
  'trap 里总留着一汪水，挡住下水道的气味。',
  '水槽下的 U 形管为黄绿',
  '<rect class="f-g" x="80" y="30" width="180" height="28"/><rect class="f-p" x="150" y="58" width="20" height="40"/><path class="f-u" d="M160 98 V140 Q160 190 210 190 H250" fill="none" stroke="#2B44C9" stroke-width="16"/>',
  190, 160, 46);

add('welt', '鞋', 2,
  '鞋面和鞋底之间的皮条，<br>英文叫什么？',
  'welt', ['rand', 'midsole', 'tape'],
  'welt 把鞋面缝到鞋底上；帆布鞋底边那圈橡胶另叫 foxing。',
  '鞋侧，鞋面与鞋底之间的皮条为黄绿',
  '<path class="f-p" d="M40 150 Q80 90 160 80 Q240 90 300 140 L290 160 Q180 130 50 168 Z"/><rect class="f-u" x="40" y="158" width="250" height="14"/><rect class="f-i" x="40" y="172" width="260" height="16"/>',
  160, 165, 40);

add('quarter', '鞋', 2,
  '鞋子后半段两侧的布片，<br>英文叫什么？',
  'quarter', ['counter', 'backstay', 'collar'],
  'quarter 是鞋后帮；里面撑住后跟的硬壳叫 heel counter。',
  '鞋子后半侧片为黄绿',
  '<path class="f-p" d="M40 190 L40 130 Q60 90 130 80 L220 70 Q270 120 300 160 L300 190 Z"/><path class="f-u" d="M40 190 L40 130 Q60 96 110 92 L150 150 L70 190 Z"/><rect class="f-i" x="40" y="190" width="260" height="14"/>',
  90, 140, 46);

add('toecap', '鞋', 2,
  '鞋头最前面的那块包头，<br>英文叫什么？',
  'toecap', ['bumper', 'puff', 'tip'],
  'toecap 是鞋头外面的包头；里面那层硬衬叫 toe puff。',
  '鞋子最前方的包头为黄绿',
  '<path class="f-p" d="M40 180 L40 130 Q70 90 150 86 L230 100 Q280 130 300 170 L300 190 Z"/><path class="f-u" d="M210 104 Q270 130 292 172 L300 190 L230 190 Q220 140 210 104 Z"/><rect class="f-i" x="40" y="190" width="260" height="12"/>',
  260, 150, 40);

add('grommet', '鞋带', 2,
  '穿绳孔上的金属圈，<br>英文叫什么？',
  'grommet', ['washer', 'bushing', 'liner'],
  'grommet 是加固孔洞的金属圈；孔本身更常叫 eyelet。',
  '布面上一枚金属圈为黄绿',
  '<rect class="f-g" x="70" y="50" width="200" height="150"/><circle class="f-u" cx="170" cy="125" r="28"/><circle cx="170" cy="125" r="12" fill="#E8EBEF" stroke="#111" stroke-width="2"/>',
  170, 125, 40);

add('yoke', '衬衫', 2,
  '衬衫肩背单独拼的那块布，<br>英文叫什么？',
  'yoke', ['panel', 'saddle', 'shoulder'],
  'yoke 是过肩，从肩线拼到后背；钉扣子的门襟叫 placket。',
  '衬衫上半，过肩拼片为黄绿',
  '<path class="f-p" d="M90 80 L130 50 H210 L250 80 L280 140 L230 150 V230 H110 V150 L60 140 Z"/><path class="f-u" d="M100 86 L136 58 H204 L240 86 L230 120 H110 Z"/>',
  170, 92, 50);

add('inseam', '裤子', 2,
  '裤腿内侧的那条缝，<br>英文叫什么？',
  'inseam', ['outseam', 'crotch', 'rise'],
  'inseam 是内侧缝，从裆部一直到裤脚；外侧那条叫 outseam。',
  '裤子内侧一条缝为黄绿',
  '<path class="f-p" d="M110 40 H230 L250 220 H180 L170 120 L160 220 H90 Z"/><path class="f-u" d="M170 120 L162 220" fill="none" stroke="#2B44C9" stroke-width="6"/>',
  166, 170, 30);

export {};

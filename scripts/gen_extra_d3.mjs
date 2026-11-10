import { add } from './gen_extra_bank.mjs';

add('pawl', '自行车', 3,
  '飞轮里卡住齿轮的小棘爪，<br>英文叫什么？',
  'pawl', ['ratchet', 'detent', 'click'],
  'pawl 是棘爪：正向踩踏时顶住齿，倒转时让开，轮子才能滑行。',
  '齿轮旁一只小棘爪为黄绿',
  '<circle class="f-p" cx="150" cy="130" r="70"/><path class="f-s" d="M150 70 L150 110 M190 90 L168 118 M200 130 L164 130 M180 170 L158 146"/><path class="f-u" d="M210 100 L250 86 L246 112 Z"/>',
  232, 98, 28);

add('concha', '耳朵', 3,
  '耳廓里面那只凹下的碗，<br>英文叫什么？',
  'concha', ['bowl', 'fossa', 'shell'],
  'concha 是耳甲，耳机塞进去时最先围住它的就是这块凹陷。',
  '耳廓内部的碗状凹陷为黄绿',
  '<path class="f-p" d="M160 36 Q86 70 100 140 Q116 214 176 220 Q214 200 198 130 Q188 78 170 50 Z"/><ellipse class="f-u" cx="158" cy="140" rx="28" ry="36"/><path class="f-g" d="M176 150 Q200 170 188 196"/>',
  158, 140, 40);

add('caruncle', '眼睛', 3,
  '内眼角那颗粉红小肉球，<br>英文叫什么？',
  'caruncle', ['plica', 'nodule', 'tear'],
  '内眼角这颗叫 lacrimal caruncle；紧挨着的半月形小皱褶不是它。',
  '眼角内侧的小肉球为黄绿',
  '<path class="f-p" d="M50 125 Q130 70 230 125 Q130 180 50 125 Z"/><circle class="f-i" cx="150" cy="125" r="16"/><circle class="f-u" cx="78" cy="125" r="12"/>',
  78, 125, 24);

add('punctum', '眼睛', 3,
  '眼皮内侧排泪的小孔，<br>英文叫什么？',
  'lacrimal punctum', ['ostium', 'pore', 'duct'],
  'lacrimal punctum 在上下眼睑靠近鼻子的边缘，眼泪从这里流进鼻泪管。',
  '下眼睑靠近鼻侧的小孔为黄绿',
  '<path class="f-p" d="M60 110 Q140 70 240 116 Q140 150 60 110 Z"/><path class="f-g" d="M60 140 Q140 170 240 136"/><circle class="f-u" cx="86" cy="128" r="7"/>',
  86, 128, 20);

add('limbus', '眼睛', 3,
  '黑眼珠和眼白交界的圈，<br>英文叫什么？',
  'limbus', ['iris', 'cornea', 'margin'],
  'limbus 是角膜和巩膜交界的那一圈，虹膜的颜色到这里为止。',
  '眼球上，虹膜外缘一圈为黄绿',
  '<circle class="f-p" cx="170" cy="125" r="70"/><circle class="f-u" cx="170" cy="125" r="36"/><circle class="f-i" cx="170" cy="125" r="28"/><circle class="f-i" cx="170" cy="125" r="12"/>',
  170, 125, 46);

add('vermilion', '嘴唇', 3,
  '嘴唇上带颜色的那一段，<br>英文叫什么？',
  'vermilion', ['mucosa', 'carmine', 'blush'],
  'vermilion 是唇红；它和周围皮肤的交界叫 vermilion border。',
  '嘴唇有颜色的部分为黄绿',
  '<path class="f-g" d="M60 80 H280 V190 H60 Z"/><path class="f-u" d="M80 110 Q120 96 150 116 Q170 100 190 116 Q220 96 260 110 Q230 150 170 156 Q110 150 80 110 Z"/><path class="f-p" d="M90 156 Q170 186 250 156 Q170 176 90 156 Z"/>',
  170, 126, 70);

add('ala', '鼻子', 3,
  '鼻孔外侧软软的鼻翼，<br>英文叫什么？',
  'ala', ['nostril', 'flare', 'lobe'],
  'ala 是鼻翼，全称 ala nasi；两个鼻孔中间那条另叫 columella。',
  '鼻底一侧的鼻翼为黄绿',
  '<path class="f-g" d="M110 40 Q170 20 230 70 L220 160 Q170 200 120 160 Z"/><ellipse class="f-i" cx="150" cy="150" rx="16" ry="10"/><ellipse class="f-i" cx="196" cy="150" rx="16" ry="10"/><path class="f-u" d="M210 120 Q248 140 214 176 Q190 160 210 120 Z"/>',
  226, 148, 32);

add('suprasternal', '脖子', 3,
  '锁骨中间喉咙下的小坑，<br>英文叫什么？',
  'suprasternal notch', ['fossa', 'dimple', 'hollow'],
  'suprasternal notch 在两根锁骨和胸骨交界处，也叫 jugular notch。',
  '锁骨之间的小坑为黄绿',
  '<path class="f-g" d="M70 80 Q170 40 270 80 L250 200 H90 Z"/><path class="f-p" d="M80 120 Q140 150 170 120"/><path class="f-p" d="M260 120 Q200 150 170 120"/><ellipse class="f-u" cx="170" cy="132" rx="18" ry="12"/>',
  170, 132, 28);

add('xiphoid', '胸骨', 3,
  '胸骨最下端的那小片，<br>英文叫什么？',
  'xiphoid', ['sternum', 'manubrium', 'cartilage'],
  'xiphoid 是剑突，在胸骨最下端，按上去往往是软骨。',
  '胸骨下端一小片为黄绿',
  '<rect class="f-p" x="145" y="40" width="50" height="36"/><rect class="f-g" x="140" y="76" width="60" height="90"/><path class="f-u" d="M150 166 H190 L170 210 Z"/>',
  170, 186, 30);

add('hyoid', '脖子', 3,
  '脖子里不跟别的骨头相连的骨头，<br>英文叫什么？',
  'hyoid', ['larynx', 'atlas', 'clavicle'],
  'hyoid 是舌骨，靠韧带和肌肉悬着，吞咽时能摸到它移动。',
  '喉上方一块马蹄形小骨为黄绿',
  '<path class="f-g" d="M120 40 H220 L200 220 H140 Z"/><path class="f-u" d="M110 100 Q170 70 230 100 L214 118 Q170 96 126 118 Z"/>',
  170, 100, 46);

add('olecranon', '手肘', 3,
  '肘尖那块骨头，<br>英文叫什么？',
  'olecranon', ['epicondyle', 'condyle', 'elbow'],
  'olecranon 是尺骨鹰嘴，就是肘尖；两侧的骨性小突起叫 epicondyle。',
  '弯曲的手臂，肘尖为黄绿',
  '<path class="f-g" d="M40 80 H150 L170 125 L150 170 H40 Z"/><path class="f-g" d="M170 110 H300 V150 H170 Z"/><circle class="f-u" cx="168" cy="125" r="22"/>',
  168, 125, 32);

add('popliteal', '膝盖', 3,
  '膝盖后面的那块窝，<br>英文叫什么？',
  'popliteal fossa', ['ham', 'crease', 'pit'],
  'popliteal fossa 是腘窝，膝后那块菱形软窝。',
  '弯曲的膝后方，窝为黄绿',
  '<path class="f-g" d="M120 30 H200 L220 110 L180 230 H110 L150 110 Z"/><ellipse class="f-u" cx="176" cy="120" rx="28" ry="22"/>',
  176, 120, 34);

add('malleolus', '脚踝', 3,
  '脚踝两侧鼓起的骨点，<br>英文叫什么？',
  'malleolus', ['condyle', 'knob', 'process'],
  'malleolus 是踝部，内侧是胫骨，外侧是腓骨末端。',
  '小腿下端两侧的骨点为黄绿',
  '<rect class="f-g" x="150" y="30" width="40" height="120"/><path class="f-p" d="M120 170 H220 L200 230 H140 Z"/><circle class="f-u" cx="142" cy="156" r="16"/><circle class="f-u" cx="198" cy="156" r="16"/>',
  142, 156, 24);

add('hyponychium', '指甲', 3,
  '指甲伸出指头下面的皮，<br>英文叫什么？',
  'hyponychium', ['nailbed', 'sole', 'bed'],
  'hyponychium 在游离甲缘下面，把甲床和指尖皮肤接起来。',
  '指甲游离缘下方的一条皮为黄绿',
  '<path class="f-g" d="M110 220 L110 100 Q110 40 170 40 Q230 40 230 100 L230 220"/><path class="f-p" d="M136 150 L136 78 Q136 58 170 58 Q204 58 204 78 L204 120 L136 150 Z"/><rect class="f-u" x="136" y="118" width="68" height="16"/>',
  170, 126, 40);

add('vellus', '汗毛', 3,
  '脸上细软的汗毛，<br>英文叫什么？',
  'vellus', ['down', 'fuzz', 'pile'],
  'vellus 是毫毛，又短又软；胎儿和新生儿身上更细的那层叫 lanugo。',
  '脸颊上几根细毛为黄绿',
  '<circle class="f-p" cx="170" cy="130" r="80"/><path d="M120 100 L112 70 M145 88 L140 58 M170 82 L170 52 M196 90 L204 60" fill="none" stroke="#2B44C9" stroke-width="3"/>',
  156, 76, 40);

add('lanugo', '婴儿', 3,
  '新生儿身上的那层细毛，<br>英文叫什么？',
  'lanugo', ['down', 'fleece', 'wool'],
  'lanugo 是胎毛，大多在出生前后脱落，和脸上的毫毛不是同一层。',
  '婴儿身体轮廓上的细毛为黄绿',
  '<circle class="f-p" cx="170" cy="70" r="28"/><path class="f-g" d="M140 100 H200 L214 200 H126 Z"/><path d="M150 120 L140 100 M170 124 L166 102 M190 120 L200 100 M156 150 L146 132 M184 150 L196 132" fill="none" stroke="#2B44C9" stroke-width="3"/>',
  170, 124, 40);

add('vibrissae', '猫', 3,
  '猫胡须的正式名称，<br>叫什么？',
  'vibrissae', ['feeler', 'antenna', 'barb'],
  'vibrissae 是触须，猫脸上这几根硬毛能感知距离。',
  '猫脸两侧伸出的胡须为黄绿',
  '<circle class="f-p" cx="170" cy="120" r="50"/><circle class="f-i" cx="152" cy="112" r="5"/><circle class="f-i" cx="188" cy="112" r="5"/><path class="f-i" d="M160 136 Q170 146 180 136"/><path d="M120 110 L40 90 M118 124 L30 124 M122 136 L46 156 M220 110 L300 90 M222 124 L310 124 M218 136 L294 156" fill="none" stroke="#2B44C9" stroke-width="3"/>',
  80, 124, 40);

add('snuffbox', '手腕', 3,
  '拇指翘起时腕背的三角窝，<br>英文叫什么？',
  'anatomical snuffbox', ['fossa', 'dimple', 'pocket'],
  'anatomical snuffbox 在腕背桡侧，拇指伸直时最清楚，以前用来放鼻烟。',
  '翘起的拇指旁，腕背三角窝为黄绿',
  '<path class="f-g" d="M80 180 L140 80 L180 40 L210 90 L250 200 H100 Z"/><path class="f-u" d="M150 120 L190 150 L150 170 Z"/>',
  168, 146, 30);

add('ricasso', '刀', 3,
  '靠近刀柄、故意不开刃的一截，<br>英文叫什么？',
  'ricasso', ['choil', 'fuller', 'spine'],
  'ricasso 是刃末到护手之间没有开口的那段，手指可以搭在这里。',
  '刀刃靠近刀柄的平段为黄绿',
  '<path class="f-p" d="M30 118 L180 104 L180 146 L50 146 Q30 136 30 118 Z"/><rect class="f-u" x="180" y="108" width="46" height="34"/><rect class="f-g" x="226" y="96" width="70" height="58"/>',
  203, 125, 30);

add('mortise', '木工', 3,
  '榫卯里凹进去的那个孔，<br>英文叫什么？',
  'mortise', ['tenon', 'dowel', 'pocket'],
  'mortise 是卯眼；插进去的那个舌头叫 tenon。',
  '木板上的方孔为黄绿',
  '<rect class="f-g" x="40" y="70" width="170" height="110"/><rect class="f-u" x="90" y="100" width="40" height="50"/><rect class="f-p" x="210" y="108" width="90" height="34"/>',
  110, 125, 32);

add('rabbet', '木工', 3,
  '木板边缘的台阶形缺口，<br>英文叫什么？',
  'rabbet', ['groove', 'chamfer', 'fillet'],
  'rabbet 是边部的台阶槽，另一块板可以搭进来；斜切一刀则叫 chamfer。',
  '木板边缘的台阶缺口为黄绿',
  '<path class="f-g" d="M40 80 H240 V140 H300 V190 H40 Z"/><path class="f-u" d="M240 80 H300 V140 H240 Z"/>',
  270, 110, 36);

add('dado', '木工', 3,
  '横着木纹切出的槽，<br>英文叫什么？',
  'dado', ['trench', 'channel', 'plow'],
  'dado 横跨木纹；沿着木纹刨出的槽更常叫 plow。',
  '木板中部一道横槽为黄绿',
  '<rect class="f-g" x="40" y="70" width="260" height="110"/><path class="f-s" d="M40 100 H300 M40 150 H300"/><rect class="f-u" x="40" y="108" width="260" height="28"/>',
  170, 122, 40);

add('gullet', '锯子', 3,
  '锯齿之间的空当，<br>英文叫什么？',
  'gullet', ['throat', 'notch', 'root'],
  'gullet 是齿沟，锯屑从这里排出；锯出来的那道缝另叫 kerf。',
  '锯片上两齿之间的空当为黄绿',
  '<rect class="f-p" x="40" y="80" width="260" height="28"/><path class="f-i" d="M70 108 L90 150 L110 108 Z"/><path class="f-i" d="M150 108 L170 150 L190 108 Z"/><path class="f-u" d="M110 108 L130 140 L150 108 Z"/>',
  130, 124, 26);

add('soffit', '屋檐', 3,
  '屋檐挑出部分的底面，<br>英文叫什么？',
  'soffit', ['ceiling', 'deck', 'lining'],
  'soffit 是挑檐的底板，从下往上看见的那一面。',
  '屋檐下方的底板为黄绿',
  '<rect class="f-g" x="80" y="120" width="120" height="90"/><path class="f-p" d="M40 120 H300 L260 70 H80 Z"/><rect class="f-u" x="40" y="120" width="180" height="16"/>',
  130, 128, 36);

add('fascia', '屋檐', 3,
  '屋檐外沿的竖直挡板，<br>英文叫什么？',
  'fascia', ['barge', 'frieze', 'verge'],
  'fascia 是檐口封板，水槽通常就钉在它外面。',
  '檐口外沿的竖板为黄绿',
  '<path class="f-g" d="M40 150 H220 L260 80 H80 Z"/><rect class="f-p" x="70" y="150" width="140" height="60"/><rect class="f-u" x="210" y="80" width="18" height="130"/>',
  219, 145, 30);

add('astragal', '门', 3,
  '双开门中间挡缝的木条，<br>英文叫什么？',
  'astragal', ['mullion', 'batten', 'stop'],
  'astragal 盖住两扇门碰上的那条缝，风和光就不容易钻进来。',
  '两扇门中间的挡缝条为黄绿',
  '<rect class="f-p" x="50" y="40" width="110" height="180"/><rect class="f-p" x="180" y="40" width="110" height="180"/><rect class="f-u" x="154" y="40" width="22" height="180"/>',
  165, 130, 30);

add('fanlight', '门', 3,
  '门上方的半圆小窗，<br>英文叫什么？',
  'fanlight', ['transom', 'sidelight', 'oculus'],
  'fanlight 是门上的扇形窗；横长的矩形气窗一般叫 transom。',
  '门顶上方的半圆窗为黄绿',
  '<rect class="f-g" x="110" y="110" width="120" height="110"/><path class="f-u" d="M80 110 Q170 20 260 110 Z"/><path class="f-s" d="M170 40 V110 M120 70 L170 110 L220 70"/>',
  170, 70, 50);

add('voussoir', '拱门', 3,
  '拱里的每一块楔形石，<br>英文叫什么？',
  'voussoir', ['springer', 'impost', 'quoin'],
  'voussoir 是拱石，每一块都是楔形；正中那一块另叫 keystone。',
  '拱上一块楔形石为黄绿',
  '<path class="f-g" d="M50 190 V130 Q170 20 290 130 V190"/><path class="f-p" d="M70 190 V136 Q170 46 270 136 V190"/><path class="f-u" d="M196 58 L230 78 L214 112 L176 96 Z"/>',
  206, 84, 30);

add('dentil', '檐口', 3,
  '檐口下面那排小方齿，<br>英文叫什么？',
  'dentil', ['modillion', 'corbel', 'dogtooth'],
  'dentil 是齿饰，一排小方块；下面托着的支架叫 modillion 或 corbel。',
  '檐口下一排小方块，其中一块为黄绿',
  '<rect class="f-g" x="40" y="60" width="260" height="24"/><rect class="f-p" x="56" y="84" width="22" height="28"/><rect class="f-u" x="96" y="84" width="22" height="28"/><rect class="f-p" x="136" y="84" width="22" height="28"/><rect class="f-p" x="176" y="84" width="22" height="28"/><rect class="f-p" x="216" y="84" width="22" height="28"/><rect class="f-p" x="256" y="84" width="22" height="28"/>',
  107, 98, 24);

add('feed-dog', '缝纫', 3,
  '缝纫机针板下送布的齿，<br>英文叫什么？',
  'feed dog', ['looper', 'hook', 'puller'],
  'feed dog 是送布牙，咬住布料往前送，压脚只是从上面临时按住。',
  '针板缝里露出的齿条为黄绿',
  '<rect class="f-p" x="60" y="90" width="220" height="80"/><rect class="f-i" x="164" y="40" width="10" height="70"/><rect class="f-u" x="120" y="118" width="100" height="16"/><path class="f-i" d="M130 118 L138 108 L146 118 M156 118 L164 108 L172 118 M182 118 L190 108 L198 118 M208 118 L216 108"/>',
  170, 126, 40);

add('bar-tack', '牛仔裤', 3,
  '口袋角上加密的加固针，<br>英文叫什么？',
  'bar tack', ['staystitch', 'box', 'whip'],
  'bar tack 是打枣，一小块密针，专门守在容易撕开的角上。',
  '口袋开口一端的密针为黄绿',
  '<path class="f-p" d="M70 70 H250 L230 190 H90 Z"/><path class="f-s" d="M110 70 V150"/><rect class="f-u" x="96" y="140" width="28" height="18"/>',
  110, 149, 24);

add('foxing', '鞋', 3,
  '帆布鞋底边那圈橡胶条，<br>英文叫什么？',
  'foxing', ['rand', 'mudguard', 'bumper'],
  '鞋上的 foxing 是包住鞋面和鞋底接缝的橡胶条；旧书上的褐斑也叫 foxing，是另一回事。',
  '帆布鞋底边的橡胶圈为黄绿',
  '<path class="f-p" d="M50 150 Q90 80 170 78 Q260 86 300 150 L280 180 H70 Z"/><rect class="f-i" x="60" y="176" width="230" height="18"/><path class="f-u" d="M64 164 H286 L276 180 H74 Z"/>',
  170, 172, 40);

add('purfling', '小提琴', 3,
  '小提琴边缘的一圈嵌线，<br>英文叫什么？',
  'purfling', ['binding', 'inlay', 'lining'],
  'purfling 是琴边的镶线，既装饰，也让面板边缘不那么容易裂开。',
  '琴身边缘的一圈线为黄绿',
  '<path class="f-p" d="M120 40 Q170 20 220 40 Q250 90 230 140 Q250 190 210 220 Q170 240 130 220 Q90 190 110 140 Q90 90 120 40 Z"/><path d="M132 52 Q170 36 208 52 Q230 92 214 136 Q232 184 196 208 Q170 222 144 208 Q108 184 126 136 Q110 92 132 52 Z" fill="none" stroke="#2B44C9" stroke-width="4"/>',
  170, 130, 80);

add('sound-post', '小提琴', 3,
  '小提琴里面顶住面板的木柱，<br>英文叫什么？',
  'sound post', ['bass bar', 'soundboard', 'dowel'],
  'sound post 立在面板和背板之间，就在琴码高音弦那一侧。',
  '琴身剖面里一根小木柱为黄绿',
  '<path class="f-p" d="M80 50 H260 V90 Q240 130 260 200 H80 Q100 130 80 90 Z"/><rect class="f-g" x="90" y="70" width="160" height="16"/><rect class="f-g" x="90" y="170" width="160" height="16"/><rect class="f-u" x="176" y="86" width="14" height="84"/>',
  183, 128, 24);

add('ligature', '单簧管', 3,
  '箍住哨片的那只金属箍，<br>英文叫什么？',
  'ligature', ['clamp', 'collar', 'brace'],
  'ligature 把哨片固定在吹口上，拧松才能换 reed。',
  '吹口上的金属箍为黄绿',
  '<rect class="f-p" x="145" y="40" width="50" height="150"/><path class="f-g" d="M160 40 L190 70 L170 160 L150 70 Z"/><rect class="f-u" x="138" y="90" width="64" height="22"/>',
  170, 101, 36);

add('cere', '鸟喙', 3,
  '鹦鹉喙根那圈蜡膜，<br>英文叫什么？',
  'cere', ['rictus', 'gape', 'nares'],
  'cere 是蜡膜，鹦鹉和鸽子的鼻孔就开在这层光滑的皮上。',
  '喙根的蜡膜为黄绿',
  '<circle class="f-p" cx="140" cy="120" r="46"/><circle class="f-i" cx="156" cy="108" r="5"/><path class="f-i" d="M176 116 L250 128 L176 142 Z"/><path class="f-u" d="M168 112 Q190 104 188 136 Q170 144 164 128 Z"/>',
  178, 122, 24);

add('deckle', '纸', 3,
  '手工纸毛茸茸的自然边，<br>英文叫什么？',
  'deckle', ['burr', 'feather', 'waney'],
  'deckle 是纸帘留下的毛边，不是裁纸刀切出来的。',
  '纸张一侧的毛边为黄绿',
  '<rect class="f-p" x="70" y="50" width="180" height="150"/><path class="f-u" d="M250 50 L270 62 L248 78 L272 96 L246 112 L274 132 L250 150 L268 168 L246 190 L250 200 L230 200 L230 50 Z"/>',
  256, 125, 30);

add('busk', '束身', 3,
  '束身衣正面那根硬撑，<br>英文叫什么？',
  'busk', ['boning', 'stay', 'rib'],
  'busk 是前中那根可开合的硬片；散在布里的细撑条叫 boning。',
  '束身衣正中的硬片为黄绿',
  '<path class="f-p" d="M110 40 H230 L250 210 H90 Z"/><rect class="f-u" x="158" y="50" width="24" height="150"/><circle class="f-i" cx="170" cy="80" r="4"/><circle class="f-i" cx="170" cy="120" r="4"/><circle class="f-i" cx="170" cy="160" r="4"/>',
  170, 125, 30);

add('manicule', '符号', 3,
  '旧书页边指向文字的小手，<br>英文叫什么？',
  'manicule', ['dagger', 'fleuron', 'asterisk'],
  'manicule 是指示手，食指伸出，用来把读者带到某一行。',
  '页边一只指向字行的小手为黄绿',
  '<rect class="f-n" x="150" y="70" width="140" height="10"/><rect class="f-n" x="150" y="96" width="120" height="10"/><rect class="f-n" x="150" y="122" width="140" height="10"/><path class="f-u" d="M40 130 H110 V118 H150 V108 H120 V96 H150 V86 H116 V150 H70 L60 160 Z"/>',
  100, 120, 46);

add('alula', '鸟翼', 3,
  '鸟翅前缘那一小撮羽，<br>英文叫什么？',
  'alula', ['covert', 'pinion', 'remex'],
  'alula 长在翅膀的“拇指”上，飞得慢时会掀开，帮忙保持升力。',
  '翅膀前缘一小撮羽为黄绿',
  '<path class="f-g" d="M40 150 Q120 60 280 130 L260 170 Q140 120 50 180 Z"/><path class="f-u" d="M70 140 Q110 90 150 110 Q120 130 80 156 Z"/>',
  110, 122, 36);

add('hilum', '豆子', 3,
  '豆子侧面那块浅色的疤，<br>英文叫什么？',
  'hilum', ['micropyle', 'raphe', 'testa'],
  'hilum 是种脐，豆子从豆荚上掉下来后留下的疤。',
  '豆子侧面的浅疤为黄绿',
  '<ellipse class="f-p" cx="170" cy="130" rx="70" ry="46"/><ellipse class="f-u" cx="150" cy="128" rx="16" ry="10"/>',
  150, 128, 24);

add('lenticel', '苹果', 3,
  '苹果皮上透气的小褐点，<br>英文叫什么？',
  'lenticel', ['stoma', 'speckle', 'pore'],
  'lenticel 是皮孔，让果皮下面还能换气，不是碰伤。',
  '苹果皮上几点为黄绿',
  '<circle class="f-p" cx="170" cy="130" r="80"/><path class="f-g" d="M160 54 Q170 30 180 54"/><circle class="f-u" cx="140" cy="110" r="5"/><circle class="f-u" cx="190" cy="124" r="5"/><circle class="f-u" cx="156" cy="160" r="5"/><circle class="f-u" cx="200" cy="168" r="4"/>',
  170, 136, 40);

add('achene', '草莓', 3,
  '草莓表面像种子的小果，<br>英文叫什么？',
  'achene', ['seed', 'pip', 'nutlet'],
  '草莓表面那一粒是 achene，真正的种子包在这个小瘦果里面。',
  '草莓表面一粒小果为黄绿',
  '<path class="f-p" d="M120 90 Q170 40 220 90 Q250 150 170 200 Q90 150 120 90 Z"/><circle class="f-i" cx="150" cy="120" r="5"/><circle class="f-u" cx="190" cy="130" r="7"/><circle class="f-i" cx="160" cy="160" r="5"/><circle class="f-i" cx="200" cy="166" r="4"/>',
  190, 130, 18);

export {};

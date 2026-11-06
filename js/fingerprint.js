/* 卡指纹 + 计分 + 称号 + 指纹中文名
 * 指纹 = 版本(2bit) + 5 × [题库序号 N bit, 对错 1bit, 用时秒 4bit] + 校验 3bit
 *   - 64 题：N=6，60bit → 12 位码
 *   - 200 题：N=8，70bit → 14 位码（题库扩过 63 条时自动切）
 * 可由指纹逆推本局抽了哪 5 题、对错、每题用时。形象与中文名都由这串编码决定。
 */
(function () {
  var F = {};
  var ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  var BANK_LEN = (window.YKBD_BANK && window.YKBD_BANK.length) || 64;
  /* 6 bit 装 64 条（idx 0–63）；超过 64 条时自动用 8 bit，码从 12 位变 14 位 */
  var IDX_BITS = BANK_LEN > 64 ? 8 : 6;
  var VER = IDX_BITS === 8 ? 2 : 1;
  var CODE_LEN = (2 + 5 * (IDX_BITS + 5) + 3) / 5;
  F.TIME_LIMIT = 14;
  F.PACK_MAX = 8;
  F.IDX_BITS = IDX_BITS;
  F.VER = VER;
  F.CODE_LEN = CODE_LEN;

  function pushBits(arr, val, n) { for (var i = n - 1; i >= 0; i--) arr.push((val >> i) & 1); }
  function readBits(arr, pos, n) { var v = 0; for (var i = 0; i < n; i++) v = (v << 1) | arr[pos + i]; return v; }
  function check(bits) { var c = 0; for (var i = 0; i < bits.length; i++) c = (c + bits[i] * ((i % 7) + 1)) % 8; return c; }
  function fmt(s) {
    var out = '';
    for (var i = 0; i < s.length; i += 4) { if (i) out += '-'; out += s.slice(i, i + 4); }
    return out;
  }

  F.encode = function (rounds) {
    var bits = [];
    pushBits(bits, VER, 2);
    rounds.forEach(function (r) {
      pushBits(bits, r.idx & ((1 << IDX_BITS) - 1), IDX_BITS);
      pushBits(bits, r.correct ? 1 : 0, 1);
      pushBits(bits, Math.max(0, Math.min(15, Math.ceil(r.t))), 4);
    });
    pushBits(bits, check(bits), 3);
    var s = '';
    for (var i = 0; i < bits.length; i += 5) s += ALPHA.charAt(readBits(bits, i, 5));
    return fmt(s);
  };

  F.decode = function (code) {
    var s = String(code || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    var idxBits = s.length === 12 ? 6 : (s.length === 14 ? 8 : 0);
    if (!idxBits) return null;
    var bits = [];
    for (var i = 0; i < s.length; i++) {
      var v = ALPHA.indexOf(s.charAt(i));
      if (v < 0) return null;
      pushBits(bits, v, 5);
    }
    var bodyLen = 2 + 5 * (idxBits + 5);
    if (bits.length !== bodyLen + 3) return null;
    if (readBits(bits, bodyLen, 3) !== check(bits.slice(0, bodyLen))) return null;
    if (readBits(bits, 0, 2) !== (idxBits === 6 ? 1 : 2)) return null;
    var rounds = [];
    var p = 2;
    for (var k = 0; k < 5; k++) {
      rounds.push({
        idx: readBits(bits, p, idxBits),
        correct: !!bits[p + idxBits],
        t: readBits(bits, p + idxBits + 1, 4)
      });
      p += idxBits + 5;
    }
    return rounds;
  };

  /* 答对得 难度×10；连对从第 2 题起加 2×(连击-1)，单题最多 +6；全对 +15；错 / 超时 0 */
  F.score = function (rounds, bank) {
    var total = 0, streak = 0, detail = [];
    rounds.forEach(function (r) {
      var q = bank[r.idx], pts = 0, bonus = 0;
      if (r.correct && q) {
        streak++;
        pts = q.difficulty * 10;
        if (streak >= 2) bonus = Math.min(6, 2 * (streak - 1));
      } else streak = 0;
      total += pts + bonus;
      detail.push({ pts: pts, bonus: bonus });
    });
    var correct = rounds.filter(function (r) { return r.correct; }).length;
    var allBonus = correct === rounds.length && rounds.length > 0 ? 15 : 0;
    return { total: total + allBonus, correct: correct, allBonus: allBonus, detail: detail };
  };

  F.title = function (correct) {
    if (correct >= 5) return '全对大师';
    if (correct === 4) return '你可能知道一点';
    if (correct >= 2) return '日常猎奇员';
    return '路人观察员';
  };

  F.levelInfo = function (totalCorrect) {
    var tiers = [
      { lv: 1, name: '见习', next: 10, nextName: '侦探' },
      { lv: 2, name: '侦探', next: 30, nextName: '图鉴官' },
      { lv: 3, name: '图鉴官', next: 60, nextName: '词源玩家' },
      { lv: 4, name: '词源玩家', next: null, nextName: '' }
    ];
    var t = tiers[0];
    if (totalCorrect >= 60) t = tiers[3];
    else if (totalCorrect >= 30) t = tiers[2];
    else if (totalCorrect >= 10) t = tiers[1];
    var prev = t.lv === 1 ? 0 : (t.lv === 2 ? 10 : (t.lv === 3 ? 30 : 60));
    var span = t.next == null ? 1 : (t.next - prev);
    var cur = t.next == null ? 1 : Math.min(span, Math.max(0, totalCorrect - prev));
    var ratio = t.next == null ? 1 : cur / span;
    var left = t.next == null ? 0 : Math.max(0, t.next - totalCorrect);
    return { lv: t.lv, name: t.name, nextName: t.nextName, left: left, ratio: ratio, maxed: t.next == null };
  };

  F.vibe = function (d) {
    if (d >= 3) return '猎奇';
    if (d === 2) return '冷门';
    return '眼熟';
  };

  /* 四字中文名：两字气质 + 两字物件。样张编码钉死，其余由指纹切段。 */
  var NAME_A = ['盐巴','雾窗','纸鹤','晴天','月光','夜航','柠檬','邮戳','麦浪','松果','潮汐','糖纸','风铃','墨点','星子','雨棚','茶渍','棉线','石阶','萤火','晚风','书脊','海盐','薄荷','灯芯','雪粒','木勺','青苔','果酱','云朵','铁盒','暖阳','巷口','蝶翅','稻香','葡萄','露珠','柿饼','竹影','麦芽','银杏','焦糖','春泥','沙漏','枫糖','松烟','冰箱','巷灯'];
  var NAME_B = ['气球','火柴','汽水','板栗','拉面','纽扣','信封','枕头','车票','风筝','饼干','雨靴','台灯','口袋','口琴','船锚','蜡笔','铃铛','手套','地图','汤圆','邮票','钥匙','围巾','抽屉','糖罐','信鸽','纸船','时钟','毛线','花瓶','铅笔','泡泡','云梯','伞骨','石子','杯子','窗花','背包','棋子','海螺','豆包','风车','墨盒','竹篮','灯笼','弹珠','信纸'];
  var NAME_PIN = {
    'B665-6G14-RPME': '盐巴气球',
    'Q7RF-3M2K-ZP8D': '雾窗火柴',
    'D9LA-4F7Q-NU3H': '纸鹤汽水',
    'K2TS-8H5W-CR0P': '晴天板栗',
    'L0NG-7B4N-GS9E': '月光拉面'
  };

  function fnv(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }

  F.chineseName = function (code) {
    var key = String(code || '').toUpperCase();
    if (NAME_PIN[key]) return NAME_PIN[key];
    var h = fnv('name:' + key);
    var i = h % NAME_A.length;
    var j = Math.floor(h / NAME_A.length) % NAME_B.length;
    return NAME_A[i] + NAME_B[j];
  };

  window.YKBD_F = F;
})();

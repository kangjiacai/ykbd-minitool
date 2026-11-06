/* 你可能不知道 · 首页 → 5 题限时四选一 → 抽卡结算 → 卡包 / 我的 */
(function () {
  var BANK = window.YKBD_BANK;
  var P = window.YKBD_P;
  var F = window.YKBD_F;
  var R = window.YKBD_R;
  var FIG = window.YKBD_FIG;
  var ROUND = 5;
  var LIMIT = F.TIME_LIMIT;
  var PACK_MAX = F.PACK_MAX;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var K_PACK = 'ykbd_v1_pack';
  var K_STATS = 'ykbd_v1_stats';

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function ymd(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function prevDay(s) {
    var p = String(s || '').split('-');
    if (p.length !== 3) return '';
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    d.setDate(d.getDate() - 1);
    return ymd(d);
  }
  function fmtDate(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '.' + pad2(d.getMonth() + 1) + '.' + pad2(d.getDate()) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function promptHTML(q) {
    var parts = String(q).split('<br>');
    var joined = parts.length > 1 && parts[0].length > 16 ? parts.join('') : parts.join('\n');
    return esc(joined).replace(/\n/g, '<br>');
  }
  function figMarkup(q) {
    var raw = String(q.fig).replace(/#2B44C9/g, '#C8F031');
    return '<svg class="fig" viewBox="0 0 340 250" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(q.svgHint) + '">' + raw + '</svg>';
  }

  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast on';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 2400);
  }
  function show(id) {
    var ids = ['v-home', 'v-quiz', 'v-result', 'v-me'];
    for (var i = 0; i < ids.length; i++) {
      var el = $(ids[i]);
      el.className = 'view' + (ids[i] === id ? ' on' : '');
    }
    var cur = $(id);
    if (cur) cur.scrollTop = 0;
  }

  var pack = [];
  var stats = { games: 0, totalCorrect: 0, bestScore: 0, bestStreak: 0, dex: [], days: 0, lastDay: '' };

  function emptyStats() {
    return { games: 0, totalCorrect: 0, bestScore: 0, bestStreak: 0, dex: [], days: 0, lastDay: '' };
  }
  function normStats(s) {
    var b = emptyStats();
    if (!s || typeof s !== 'object') return b;
    b.games = s.games | 0;
    b.totalCorrect = s.totalCorrect | 0;
    b.bestScore = s.bestScore | 0;
    b.bestStreak = s.bestStreak | 0;
    b.days = s.days | 0;
    b.lastDay = typeof s.lastDay === 'string' ? s.lastDay : '';
    b.dex = Array.isArray(s.dex) ? s.dex.filter(function (n) { return typeof n === 'number' && n >= 0 && n < BANK.length; }) : [];
    return b;
  }
  async function loadData() {
    var p = await P.getData(K_PACK, []);
    pack = Array.isArray(p) ? p.filter(function (c) { return c && c.fp; }).slice(0, PACK_MAX) : [];
    stats = normStats(await P.getData(K_STATS, null));
  }
  async function saveData() {
    var a = await P.setData(K_PACK, pack);
    var b = await P.setData(K_STATS, stats);
    return a && b;
  }
  function touchDay() {
    var today = ymd(new Date());
    if (stats.lastDay === today) return;
    stats.days = stats.lastDay === prevDay(today) ? (stats.days || 0) + 1 : 1;
    stats.lastDay = today;
  }

  function renderHome() {
    var info = F.levelInfo(stats.totalCorrect);
    $('home-day').textContent = stats.days > 0 ? ('连续 ' + stats.days + ' 天') : '还没开局';
    $('home-pack-n').textContent = String(pack.length);
    $('home-pack-max').textContent = '/' + PACK_MAX;
    $('home-level').textContent = info.name;
    $('home-lv').textContent = 'Lv.' + info.lv;
    var figs = '';
    var n = Math.min(3, pack.length);
    for (var i = 0; i < n; i++) figs += FIG.render(pack[i].fp);
    $('home-figs').innerHTML = figs;
  }

  var G = null;
  var raf = 0;

  function startGame() {
    closeSheets();
    var idxs = shuffle(BANK.map(function (q) { return q.idx; })).slice(0, ROUND);
    G = {
      picks: idxs, i: 0, rounds: [], streak: 0, maxStreak: 0,
      start: 0, hiddenAt: 0, answered: false, order: []
    };
    show('v-quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = BANK[G.picks[G.i]];
    G.answered = false;
    G.order = shuffle([0, 1, 2, 3]);
    $('q-count').textContent = (G.i + 1) + ' / ' + ROUND;
    $('q-prog').style.width = ((G.i + 1) / ROUND * 100) + '%';
    $('q-fig').innerHTML = figMarkup(q);
    $('q-vibe').textContent = F.vibe(q.difficulty);
    $('q-text').innerHTML = promptHTML(q.zhPrompt);
    $('q-fact').className = 'box fact';
    $('q-fact-t').textContent = '';
    $('q-pts').textContent = '';
    var h = '';
    G.order.forEach(function (oi, k) {
      h += '<button class="box opt" type="button" data-oi="' + oi + '"><span class="letter">' + LETTERS[k] + '</span><b>' + esc(q.options[oi]) + '</b></button>';
    });
    $('q-opts').innerHTML = h;
    $('q-opts').className = 'opts';
    $('q-next').className = 'box btn-main btn-next';
    G.start = now();
    tick();
  }

  function elapsed() { return (now() - G.start) / 1000; }
  function tick() {
    cancelAnimationFrame(raf);
    if (!G || G.answered) return;
    if (G.hiddenAt) { raf = requestAnimationFrame(tick); return; }
    var left = LIMIT - elapsed();
    if (left <= 0) { answer(-1); return; }
    var sec = Math.ceil(left);
    var el = $('q-sec');
    var txt = '剩 ' + sec + ' 秒';
    if (el.textContent !== txt) el.textContent = txt;
    el.className = 'pill timer-pill' + (sec <= 5 ? ' urgent' : '');
    raf = requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange', function () {
    if (!G || G.answered) return;
    if (document.hidden) G.hiddenAt = now();
    else if (G.hiddenAt) { G.start += now() - G.hiddenAt; G.hiddenAt = 0; }
  });

  function answer(oi) {
    if (!G || G.answered) return;
    G.answered = true;
    cancelAnimationFrame(raf);
    var q = BANK[G.picks[G.i]];
    var t = Math.min(LIMIT, Math.max(0, elapsed()));
    var timeout = oi < 0;
    var correct = oi === q.correctIndex;
    G.rounds.push({ idx: q.idx, correct: correct, t: timeout ? LIMIT : t });
    if (correct) {
      G.streak += 1;
      if (G.streak > G.maxStreak) G.maxStreak = G.streak;
      P.vibrate('medium');
    } else {
      G.streak = 0;
    }
    var sc = F.score(G.rounds, BANK).detail[G.i];
    var btns = $('q-opts').querySelectorAll('.opt');
    for (var b = 0; b < btns.length; b++) {
      var boi = +btns[b].getAttribute('data-oi');
      if (boi === q.correctIndex) btns[b].className = 'box opt ok';
      else if (boi === oi) btns[b].className = 'box opt bad';
      else btns[b].className = 'box opt dim';
    }
    $('q-opts').className = 'opts locked';
    var pts = sc.pts + sc.bonus;
    var label = correct ? ('+' + pts + (sc.bonus ? '  连击 +' + sc.bonus : '')) : (timeout ? '超时  +0' : '没认出  +0');
    $('q-pts').textContent = label;
    $('q-fact-t').textContent = q.fact;
    $('q-fact').className = 'box fact on';
    $('q-sec').textContent = timeout ? '时间到' : (t.toFixed(1) + ' 秒');
    $('q-sec').className = 'pill timer-pill';
    $('q-next-t').textContent = G.i + 1 >= ROUND ? '看这张卡' : '下一题';
    $('q-next').className = 'box btn-main btn-next on';
  }

  var current = null;
  async function finish() {
    if (!G) return;
    var rounds = G.rounds.map(function (r) { return { idx: r.idx, correct: r.correct, t: r.t }; });
    var maxStreak = G.maxStreak;
    G = null;
    var fp = F.encode(rounds);
    var sc = F.score(rounds, BANK);
    var time = rounds.reduce(function (s, r) { return s + r.t; }, 0);
    var ts = Date.now();
    var card = {
      fp: fp,
      name: F.chineseName(fp),
      score: sc.total,
      correct: sc.correct,
      title: F.title(sc.correct),
      time: time.toFixed(1),
      ts: ts,
      date: fmtDate(ts),
      rounds: rounds.map(function (r) { return { idx: r.idx, correct: r.correct, t: Math.round(r.t * 10) / 10 }; })
    };
    current = card;
    pack.unshift(card);
    if (pack.length > PACK_MAX) pack = pack.slice(0, PACK_MAX);
    stats.games += 1;
    stats.totalCorrect += card.correct;
    if (card.score > stats.bestScore) stats.bestScore = card.score;
    if (maxStreak > stats.bestStreak) stats.bestStreak = maxStreak;
    rounds.forEach(function (r) {
      if (r.correct && stats.dex.indexOf(r.idx) < 0) stats.dex.push(r.idx);
    });
    touchDay();
    renderResult(card);
    show('v-result');
    var ok = await saveData();
    $('r-saved').textContent = ok ? '已入卡包' : '未保存';
    if (!ok) toast('本地保存失败，这张卡只在这次打开里有效');
  }

  function listHTML(card) {
    var detail = F.score(card.rounds, BANK).detail;
    var h = '';
    card.rounds.forEach(function (r, k) {
      var q = BANK[r.idx];
      if (!q) return;
      var d = detail[k];
      var m = r.correct ? ('+' + (d.pts + d.bonus)) : '没认出';
      h += '<li><em>' + esc(q.options[q.correctIndex]) + '</em><span class="m' + (r.correct ? ' ok' : '') + '">' + m + '</span></li>';
    });
    var all = F.score(card.rounds, BANK).allBonus;
    if (all) h += '<li><em>全对</em><span class="m ok">+' + all + '</span></li>';
    return h;
  }
  function paintGacha(figId, nameId, codeId, card) {
    $(figId).innerHTML = FIG.render(card.fp);
    $(nameId).textContent = card.name || F.chineseName(card.fp);
    $(codeId).textContent = card.fp;
  }
  function renderResult(card) {
    paintGacha('r-fig', 'r-name', 'r-code', card);
    $('r-title').textContent = card.title;
    $('r-score').textContent = String(card.score);
    $('r-correct').textContent = card.correct + '/5';
    $('r-time').textContent = card.time + ' 秒';
    $('r-list').innerHTML = listHTML(card);
    $('r-saved').textContent = '已入卡包';
  }

  function renderMe() {
    var info = F.levelInfo(stats.totalCorrect);
    $('p-level').textContent = info.name;
    $('p-lv').textContent = 'Lv.' + info.lv;
    $('p-prog').style.width = Math.round(info.ratio * 100) + '%';
    $('p-next').textContent = info.maxed ? '已经是词源玩家' : ('再答对 ' + info.left + ' 题升级「' + info.nextName + '」');
    $('p-correct').textContent = String(stats.totalCorrect);
    $('p-games').textContent = String(stats.games);
    $('p-streak').textContent = String(stats.bestStreak);
    $('pack-count').textContent = pack.length + ' / ' + PACK_MAX;
    $('p-dex').textContent = stats.dex.length + ' / ' + BANK.length;
    if (!pack.length) {
      $('pack-list').innerHTML = '<div class="pack-empty">还没有卡。打完一局，会抽到一张只属于这局的卡。</div>';
    } else {
      var h = '';
      pack.forEach(function (c, i) {
        var name = c.name || F.chineseName(c.fp);
        h += '<button class="box pack-item" type="button" data-i="' + i + '"><div class="av">' + FIG.render(c.fp) + '</div>' +
          '<div class="pi-main"><div class="pi-t">' + esc(name) + '</div><div class="pi-s">' + esc(c.fp) + '　' + esc(c.date || '') + '</div></div></button>';
      });
      $('pack-list').innerHTML = h;
    }
    var dex = '';
    BANK.forEach(function (q) {
      var on = stats.dex.indexOf(q.idx) >= 0;
      if (on) {
        dex += '<button class="box dex-item on" type="button" data-i="' + q.idx + '"><b>' + esc(q.options[q.correctIndex]) + '</b><span>' + esc(q.cat) + '</span></button>';
      } else {
        dex += '<div class="box dex-item lock"><b>·</b><span>未遇见</span></div>';
      }
    });
    $('dex-list').innerHTML = dex;
  }

  var detailCard = null;
  function openDetail(i) {
    var c = pack[i];
    if (!c) return;
    detailCard = c;
    detailCard._i = i;
    if (!detailCard.name) detailCard.name = F.chineseName(c.fp);
    paintGacha('d-fig', 'd-name', 'd-code', detailCard);
    $('d-title').textContent = c.title + '　' + c.score + ' 分';
    $('d-sub').textContent = (c.date || '') + '　答对 ' + c.correct + '/5　用时 ' + c.time + ' 秒';
    $('d-list').innerHTML = listHTML(c);
    $('sheet').className = 'sheet on';
  }
  function openWord(i) {
    var q = BANK[i];
    if (!q || stats.dex.indexOf(q.idx) < 0) return;
    $('w-cat').textContent = q.cat;
    $('w-fig').innerHTML = figMarkup(q);
    $('w-name').textContent = q.options[q.correctIndex];
    $('w-q').innerHTML = promptHTML(q.zhPrompt);
    $('w-fact').textContent = q.fact;
    $('word').className = 'sheet on';
  }
  function closeSheets() {
    $('sheet').className = 'sheet';
    $('word').className = 'sheet';
    $('preview').className = 'sheet';
    $('pv-img').removeAttribute('src');
  }

  var busy = false;
  async function saveImg(kind, card) {
    if (busy || !card) return;
    busy = true;
    try {
      await R.ensureFonts();
      var url = kind === 'card' ? await R.drawCard(card) : await R.drawFigure(card);
      var res = await P.saveImage(url);
      if (res.ok) {
        toast(kind === 'card' ? '卡已存到相册' : '形象已存到相册');
        P.vibrate('medium');
      } else if (res.reason === 'noxhs') {
        $('pv-tip').textContent = '请在小红书里打开，才能一键存到相册。浏览器里可以长按图片另存。';
        $('pv-img').src = url;
        $('preview').className = 'sheet on';
      } else if (res.reason === 'oldclient') {
        $('pv-tip').textContent = '当前小红书版本暂不支持存相册，升级后再试。下面是图片预览。';
        $('pv-img').src = url;
        $('preview').className = 'sheet on';
      } else {
        toast('没存成功，可能还没允许相册权限');
      }
    } catch (e) {
      toast('生成图片失败');
    } finally {
      busy = false;
    }
  }

  function goMe(anchor) {
    renderMe();
    show('v-me');
    if (anchor) {
      var el = $(anchor);
      if (el && el.scrollIntoView) el.scrollIntoView();
    }
  }

  function bind() {
    $('btn-start').addEventListener('click', startGame);
    $('btn-pack').addEventListener('click', function () { goMe('pack-anchor'); });
    $('btn-me').addEventListener('click', function () { goMe(''); });
    $('q-opts').addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== this && !(el.className && String(el.className).indexOf('opt') >= 0)) el = el.parentNode;
      if (!el || el === this) return;
      answer(+el.getAttribute('data-oi'));
    });
    $('q-next').addEventListener('click', function () {
      if (!G || !G.answered) return;
      if (G.i + 1 >= ROUND) { finish(); return; }
      G.i += 1;
      renderQuestion();
      $('v-quiz').scrollTop = 0;
    });
    $('r-save-card').addEventListener('click', function () { saveImg('card', current); });
    $('r-save-av').addEventListener('click', function () { saveImg('avatar', current); });
    $('r-again').addEventListener('click', startGame);
    $('r-home').addEventListener('click', function () { renderHome(); show('v-home'); });
    $('me-home').addEventListener('click', function () { renderHome(); show('v-home'); });
    $('pack-start').addEventListener('click', startGame);
    $('pack-list').addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== this && !el.getAttribute('data-i')) el = el.parentNode;
      if (el && el !== this) openDetail(+el.getAttribute('data-i'));
    });
    $('dex-list').addEventListener('click', function (e) {
      var el = e.target;
      while (el && el !== this && !el.getAttribute('data-i')) el = el.parentNode;
      if (el && el !== this) openWord(+el.getAttribute('data-i'));
    });
    $('d-close').addEventListener('click', function () { $('sheet').className = 'sheet'; });
    $('d-save-card').addEventListener('click', function () { saveImg('card', detailCard); });
    $('d-save-av').addEventListener('click', function () { saveImg('avatar', detailCard); });
    $('d-del').addEventListener('click', async function () {
      if (!detailCard) return;
      if (!window.confirm('把这张卡移出卡包？')) return;
      pack.splice(detailCard._i, 1);
      $('sheet').className = 'sheet';
      await saveData();
      renderMe();
      renderHome();
    });
    $('w-close').addEventListener('click', function () { $('word').className = 'sheet'; });
    $('pv-close').addEventListener('click', function () {
      $('preview').className = 'sheet';
      $('pv-img').removeAttribute('src');
    });
    $('p-clear').addEventListener('click', async function () {
      if (!window.confirm('清除这台设备上的局数、图鉴和卡包？')) return;
      pack = [];
      stats = emptyStats();
      await saveData();
      renderMe();
      renderHome();
      toast('已清除本机记录');
    });
  }

  window.YKBD_APP = {
    state: function () { return G; },
    bank: BANK,
    pack: function () { return pack; },
    stats: function () { return stats; }
  };

  bind();
  loadData().then(function () { renderHome(); }, function () { renderHome(); });
})();

/* 你可能不知道 · v1.1
 * 首页 → 答题（弹窗反馈）→ 结算（手动入包）→ 我的 / 卡包 / 图鉴 / 垃圾桶
 * 右上角留给容器胶囊。新局不自动入卡包。满员不静默踢人。
 */
(function () {
  var BANK = window.YKBD_BANK;
  var P = window.YKBD_P;
  var F = window.YKBD_F;
  var R = window.YKBD_R;
  var FIG = window.YKBD_FIG;
  var ROUND = 5;
  var LIMIT = F.TIME_LIMIT;
  var PACK_MAX = F.PACK_MAX;
  var TRASH_MAX = 20;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var VIEWS = ['v-home', 'v-quiz', 'v-result', 'v-me', 'v-pack', 'v-dex', 'v-trash'];
  var SHEETS = ['q-modal', 'sheet', 'word', 'preview', 'full', 'drop'];
  var K_OLD = 'ykbd_v1_pack';
  var K_ALBUM = 'ykbd_v1_album';
  var K_TRASH = 'ykbd_v1_trash';
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
  function copyCard(c) {
    var o = {};
    for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) o[k] = c[k];
    if (!o.name) o.name = F.chineseName(o.fp);
    return o;
  }
  function normCards(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(function (c) { return c && c.fp; }).map(copyCard);
  }

  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast on';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 2400);
  }

  function sheetOpen(id) {
    return $(id).className.indexOf(' on') >= 0;
  }
  function anySheet() {
    for (var i = 0; i < SHEETS.length; i++) if (sheetOpen(SHEETS[i])) return true;
    return false;
  }
  function setSheet(id, on) {
    var el = $(id);
    var base = el.getAttribute('data-sheet') || 'sheet';
    el.className = base + (on ? ' on' : '');
    document.body.className = anySheet() ? 'modal-open' : '';
  }
  function closeSheets() {
    for (var i = 0; i < SHEETS.length; i++) setSheet(SHEETS[i], false);
    $('pv-img').removeAttribute('src');
    document.body.className = '';
  }

  var stack = ['v-home'];
  function paint(id) {
    for (var i = 0; i < VIEWS.length; i++) {
      var el = $(VIEWS[i]);
      var on = VIEWS[i] === id;
      var fit = el.getAttribute('data-fit') === '1';
      el.className = 'view' + (fit ? ' fit' : '') + (on ? ' on' : '');
    }
    var cur = $(id);
    if (cur) {
      cur.scrollTop = 0;
      var stage = cur.querySelector('.stage');
      if (stage) stage.scrollTop = 0;
    }
    if (id === 'v-home') renderHome();
    if (id === 'v-me') renderMe();
    if (id === 'v-pack') renderPack();
    if (id === 'v-dex') renderDex();
    if (id === 'v-trash') renderTrash();
    if (id === 'v-result' && current) renderResult(current);
  }
  function go(id) { stack = [id]; paint(id); }
  function openPage(id) { stack.push(id); paint(id); }
  function back() {
    if (stack.length > 1) stack.pop();
    paint(stack[stack.length - 1] || 'v-home');
  }

  var album = [];
  var trash = [];
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
    var albumRaw = await P.getData(K_ALBUM, { __missing: 1 });
    if (albumRaw && albumRaw.__missing) {
      album = normCards(await P.getData(K_OLD, []));
      await P.setData(K_ALBUM, album);
    } else {
      album = normCards(albumRaw);
    }
    trash = normCards(await P.getData(K_TRASH, [])).slice(0, TRASH_MAX);
    stats = normStats(await P.getData(K_STATS, null));
  }
  async function saveData() {
    var a = await P.setData(K_ALBUM, album);
    var b = await P.setData(K_TRASH, trash);
    var c = await P.setData(K_STATS, stats);
    return a && b && c;
  }
  function touchDay() {
    var today = ymd(new Date());
    if (stats.lastDay === today) return;
    stats.days = stats.lastDay === prevDay(today) ? (stats.days || 0) + 1 : 1;
    stats.lastDay = today;
  }
  function inAlbum(card) {
    if (!card) return false;
    for (var i = 0; i < album.length; i++) if (album[i].fp === card.fp) return true;
    return false;
  }
  function pushTrash(card) {
    trash.unshift(copyCard(card));
    var evicted = false;
    if (trash.length > TRASH_MAX) {
      trash = trash.slice(0, TRASH_MAX);
      evicted = true;
    }
    return evicted;
  }

  function renderHome() {
    var info = F.levelInfo(stats.totalCorrect);
    $('home-day').textContent = stats.days > 0 ? ('连续 ' + stats.days + ' 天') : '还没开局';
    $('home-pack-n').textContent = String(album.length);
    $('home-pack-max').textContent = '/' + PACK_MAX;
    $('home-level').textContent = info.name;
    $('home-lv').textContent = 'Lv.' + info.lv;
    var figs = '';
    var n = Math.min(2, album.length);
    for (var i = 0; i < n; i++) figs += FIG.render(album[i].fp);
    $('home-figs').innerHTML = figs;
  }

  function cardRow(c, i, extra) {
    var name = c.name || F.chineseName(c.fp);
    return '<button class="box pack-item" type="button" data-i="' + i + '"><div class="av">' + FIG.render(c.fp) + '</div>' +
      '<div class="pi-main"><div class="pi-t">' + esc(name) + '</div><div class="pi-s">' + esc(c.fp) + (extra || '') + '</div></div></button>';
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
    $('me-pack-n').textContent = album.length + ' / ' + PACK_MAX;
    $('me-dex-t').textContent = '图鉴 ' + stats.dex.length + ' / ' + BANK.length;
    $('me-trash-t').textContent = '垃圾桶 ' + trash.length;
    if (!album.length) {
      $('me-pack-preview').innerHTML = '<div class="pack-empty">卡包是空的。结算页点「加入卡包」，才会收进来。</div>';
    } else {
      var h = '';
      var n = Math.min(3, album.length);
      for (var i = 0; i < n; i++) h += cardRow(album[i], i, '<br>' + esc(album[i].date || ''));
      $('me-pack-preview').innerHTML = h;
    }
  }
  function renderPack() {
    $('pack-count').textContent = album.length + ' / ' + PACK_MAX + ' · 点开一张可以丢进垃圾桶';
    if (!album.length) {
      $('pack-list').innerHTML = '<div class="pack-empty">卡包是空的。打完一局，在结算页点「加入卡包」。</div>';
      return;
    }
    var h = '';
    album.forEach(function (c, i) { h += cardRow(c, i, '<br>' + esc(c.date || '')); });
    $('pack-list').innerHTML = h;
  }
  function renderDex() {
    $('dex-count').textContent = '已遇见 ' + stats.dex.length + ' / ' + BANK.length;
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
  function renderTrash() {
    $('trash-count').textContent = trash.length + ' / ' + TRASH_MAX;
    if (!trash.length) {
      $('trash-list').innerHTML = '<div class="pack-empty">垃圾桶是空的。从卡包丢出来的卡会在这里，可以找回。</div>';
      return;
    }
    var h = '';
    trash.forEach(function (c, i) {
      var name = c.name || F.chineseName(c.fp);
      h += '<div class="box trash-item" data-i="' + i + '"><div class="trash-main"><div class="av">' + FIG.render(c.fp) + '</div>' +
        '<div class="pi-main"><div class="pi-t">' + esc(name) + '</div><div class="pi-s">' + esc(c.fp) + '</div></div></div>' +
        '<div class="trash-acts"><button class="box act act-lime" type="button" data-act="back">找回</button>' +
        '<button class="box act" type="button" data-act="drop">彻底删除</button></div></div>';
    });
    $('trash-list').innerHTML = h;
  }

  var G = null;
  var raf = 0;
  var current = null;
  var detailCard = null;
  var pending = null;
  var replaceIndex = -1;
  var dropIndex = -1;

  function startGame() {
    closeSheets();
    var idxs = shuffle(BANK.map(function (q) { return q.idx; })).slice(0, ROUND);
    G = {
      picks: idxs, i: 0, rounds: [], streak: 0, maxStreak: 0,
      start: 0, hiddenAt: 0, answered: false, order: []
    };
    go('v-quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = BANK[G.picks[G.i]];
    G.answered = false;
    G.order = shuffle([0, 1, 2, 3]);
    setSheet('q-modal', false);
    $('q-count').textContent = (G.i + 1) + ' / ' + ROUND;
    $('q-prog').style.width = ((G.i + 1) / ROUND * 100) + '%';
    $('q-fig').innerHTML = figMarkup(q);
    $('q-vibe').textContent = F.vibe(q.difficulty);
    $('q-text').innerHTML = promptHTML(q.zhPrompt);
    var h = '';
    G.order.forEach(function (oi, k) {
      h += '<button class="box opt" type="button" data-oi="' + oi + '"><span class="letter">' + LETTERS[k] + '</span><b>' + esc(q.options[oi]) + '</b></button>';
    });
    $('q-opts').innerHTML = h;
    $('q-opts').className = 'opts';
    $('q-next-t').textContent = '先选一个';
    $('q-next').className = 'box btn-main is-off';
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
    } else G.streak = 0;
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
    var label = correct ? ('+' + pts + (sc.bonus ? '  连击 +' + sc.bonus : '')) : (timeout ? '超时 +0' : '没认出 +0');
    $('q-pts').textContent = label;
    $('q-pts').className = 'pill ' + (correct ? 'pill-lime' : '');
    $('q-modal-word').textContent = (correct ? '正名  ' : '正名是  ') + q.options[q.correctIndex];
    $('q-fact-t').textContent = q.fact;
    $('q-sec').textContent = timeout ? '时间到' : (t.toFixed(1) + ' 秒');
    $('q-sec').className = 'pill timer-pill';
    $('q-next-t').textContent = G.i + 1 >= ROUND ? '看结算' : '下一题';
    $('q-next').className = 'box btn-main';
    setSheet('q-modal', true);
  }

  function listHTML(card) {
    var detail = F.score(card.rounds, BANK).detail;
    var h = '';
    card.rounds.forEach(function (r, k) {
      var q = BANK[r.idx];
      if (!q) return;
      var d = detail[k];
      var m = r.correct ? ('+' + (d.pts + d.bonus)) : '没认出';
      h += '<li><em>' + esc(q.options[q.correctIndex]) + '</em><span class="m">' + m + '</span></li>';
    });
    var all = F.score(card.rounds, BANK).allBonus;
    if (all) h += '<li><em>全对</em><span class="m">+' + all + '</span></li>';
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
    $('r-list').className = 'r-list is-collapsed';
    $('r-toggle-t').textContent = '展开词表';
    var joined = inAlbum(card);
    $('r-add-t').textContent = joined ? '已在卡包' : '加入卡包';
    $('r-add').className = 'box btn-main' + (joined ? ' is-off' : '');
  }

  async function finish() {
    if (!G) return;
    var rounds = G.rounds.map(function (r) { return { idx: r.idx, correct: r.correct, t: r.t }; });
    var maxStreak = G.maxStreak;
    G = null;
    setSheet('q-modal', false);
    var fp = F.encode(rounds);
    var sc = F.score(rounds, BANK);
    var time = rounds.reduce(function (s, r) { return s + r.t; }, 0);
    var ts = Date.now();
    current = {
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
    stats.games += 1;
    stats.totalCorrect += current.correct;
    if (current.score > stats.bestScore) stats.bestScore = current.score;
    if (maxStreak > stats.bestStreak) stats.bestStreak = maxStreak;
    rounds.forEach(function (r) {
      if (r.correct && stats.dex.indexOf(r.idx) < 0) stats.dex.push(r.idx);
    });
    touchDay();
    go('v-result');
    var ok = await saveData();
    if (!ok) toast('局数没存上，这局卡片只在这次打开里有效');
  }

  function openFull(card, opt) {
    pending = { card: copyCard(card), fromTrash: opt && typeof opt.fromTrash === 'number' ? opt.fromTrash : -1 };
    replaceIndex = -1;
    $('full-ask').textContent = '';
    $('full-acts').className = 'grid2 sheet-acts';
    var h = '';
    album.forEach(function (c, i) { h += cardRow(c, i, ''); });
    $('full-list').innerHTML = h;
    setSheet('full', true);
  }
  async function commitAdd(card, replaced) {
    if (replaced) {
      var old = album[replaced.index];
      album.splice(replaced.index, 1);
      if (replaced.fromTrash >= 0) trash.splice(replaced.fromTrash, 1);
      album.unshift(copyCard(card));
      var evicted = pushTrash(old);
      var ok = await saveData();
      if (!ok) { toast('没存上'); return; }
      toast(evicted ? '已换上。垃圾桶满了，最早一张被清掉' : '已换上，旧的在垃圾桶');
    } else {
      if (pending && pending.fromTrash >= 0) trash.splice(pending.fromTrash, 1);
      album.unshift(copyCard(card));
      var ok2 = await saveData();
      if (!ok2) { toast('没存上'); return; }
      toast('已加入卡包');
    }
    setSheet('full', false);
    pending = null;
    replaceIndex = -1;
    if (current && current.fp === card.fp) {
      $('r-add-t').textContent = '已在卡包';
      $('r-add').className = 'box btn-main is-off';
    }
    renderHome();
    var here = stack[stack.length - 1];
    if (here === 'v-trash') renderTrash();
    if (here === 'v-pack') renderPack();
    if (here === 'v-me') renderMe();
  }
  async function addToAlbum(card, fromTrash) {
    if (!card) return;
    if (inAlbum(card)) {
      toast('这张已经在卡包里');
      if (current && current.fp === card.fp) {
        $('r-add-t').textContent = '已在卡包';
        $('r-add').className = 'box btn-main is-off';
      }
      return;
    }
    if (album.length >= PACK_MAX) {
      openFull(card, { fromTrash: fromTrash });
      return;
    }
    pending = { card: copyCard(card), fromTrash: typeof fromTrash === 'number' ? fromTrash : -1 };
    await commitAdd(card, null);
    pending = null;
  }

  var detailFrom = 'album';
  function openDetail(i, from) {
    var list = from === 'album' ? album : album;
    var c = list[i];
    if (!c) return;
    detailCard = c;
    detailCard._i = i;
    detailFrom = 'album';
    paintGacha('d-fig', 'd-name', 'd-code', c);
    $('d-title').textContent = (c.title || '') + '　' + (c.score || 0) + ' 分';
    $('d-sub').textContent = (c.date || '') + '　答对 ' + c.correct + '/5　用时 ' + c.time + ' 秒';
    $('d-list').innerHTML = c.rounds ? listHTML(c) : '';
    $('d-trash').style.display = '';
    setSheet('sheet', true);
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
        setSheet('preview', true);
      } else if (res.reason === 'oldclient') {
        $('pv-tip').textContent = '当前小红书版本暂不支持存相册，升级后再试。下面是图片预览。';
        $('pv-img').src = url;
        setSheet('preview', true);
      } else toast('没存成功，可能还没允许相册权限');
    } catch (e) {
      toast('生成图片失败');
    } finally { busy = false; }
  }

  function openWord(i) {
    var q = BANK[i];
    if (!q || stats.dex.indexOf(q.idx) < 0) return;
    $('w-cat').textContent = q.cat;
    $('w-fig').innerHTML = figMarkup(q);
    $('w-name').textContent = q.options[q.correctIndex];
    $('w-q').innerHTML = promptHTML(q.zhPrompt);
    $('w-fact').textContent = q.fact;
    setSheet('word', true);
  }

  function bindMask(id) {
    $(id).addEventListener('click', function (e) {
      if (e.target === this) setSheet(id, false);
    });
  }
  function findAttr(node, root, name) {
    var el = node;
    while (el && el !== root && !el.getAttribute(name)) el = el.parentNode;
    if (!el || el === root) return null;
    return el;
  }

  function bind() {
    $('btn-start').addEventListener('click', startGame);
    $('btn-pack').addEventListener('click', function () { openPage('v-pack'); });
    $('btn-me').addEventListener('click', function () { openPage('v-me'); });
    $('me-back').addEventListener('click', back);
    $('pack-back').addEventListener('click', back);
    $('dex-back').addEventListener('click', back);
    $('trash-back').addEventListener('click', back);
    $('me-pack-more').addEventListener('click', function () { openPage('v-pack'); });
    $('me-dex').addEventListener('click', function () { openPage('v-dex'); });
    $('me-trash').addEventListener('click', function () { openPage('v-trash'); });

    $('q-opts').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-oi');
      if (!el) return;
      answer(+el.getAttribute('data-oi'));
    });
    $('q-next').addEventListener('click', function () {
      if (!G || !G.answered) return;
      setSheet('q-modal', false);
      if (G.i + 1 >= ROUND) { finish(); return; }
      G.i += 1;
      renderQuestion();
    });
    $('q-modal-x').addEventListener('click', function () { setSheet('q-modal', false); });

    $('r-toggle').addEventListener('click', function () {
      var open = $('r-list').className.indexOf('is-collapsed') >= 0;
      $('r-list').className = open ? 'r-list' : 'r-list is-collapsed';
      $('r-toggle-t').textContent = open ? '收起' : '展开词表';
    });
    $('r-add').addEventListener('click', function () { addToAlbum(current, -1); });
    $('r-save-av').addEventListener('click', function () { saveImg('avatar', current); });
    $('r-again').addEventListener('click', startGame);
    $('r-home').addEventListener('click', function () { go('v-home'); });
    $('r-me').addEventListener('click', function () { openPage('v-me'); });

    function onPackClick(e, root) {
      var el = findAttr(e.target, root, 'data-i');
      if (!el) return;
      openDetail(+el.getAttribute('data-i'));
    }
    $('pack-list').addEventListener('click', function (e) { onPackClick(e, this); });
    $('me-pack-preview').addEventListener('click', function (e) { onPackClick(e, this); });
    $('dex-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-i');
      if (el) openWord(+el.getAttribute('data-i'));
    });
    $('trash-list').addEventListener('click', function (e) {
      var act = findAttr(e.target, this, 'data-act');
      if (!act) return;
      var item = act;
      while (item && item !== this && !item.getAttribute('data-i')) item = item.parentNode;
      if (!item || item === this) return;
      var i = +item.getAttribute('data-i');
      if (act.getAttribute('data-act') === 'back') addToAlbum(trash[i], i);
      else {
        dropIndex = i;
        var name = trash[i] && (trash[i].name || '');
        $('drop-text').textContent = '彻底删除「' + name + '」？删掉就找不回来了。';
        setSheet('drop', true);
      }
    });

    $('d-close').addEventListener('click', function () { setSheet('sheet', false); });
    $('d-save-card').addEventListener('click', function () { saveImg('card', detailCard); });
    $('d-save-av').addEventListener('click', function () { saveImg('avatar', detailCard); });
    $('d-trash').addEventListener('click', async function () {
      if (!detailCard) return;
      var i = detailCard._i;
      var card = album[i];
      if (!card) return;
      album.splice(i, 1);
      var evicted = pushTrash(card);
      setSheet('sheet', false);
      var ok = await saveData();
      if (!ok) toast('没存上');
      else toast(evicted ? '已丢进垃圾桶。垃圾桶满了，最早一张被清掉' : '已丢进垃圾桶');
      if (current && current.fp === card.fp) {
        $('r-add-t').textContent = '加入卡包';
        $('r-add').className = 'box btn-main';
      }
      renderPack();
      renderMe();
      renderHome();
    });

    $('full-x').addEventListener('click', function () { setSheet('full', false); });
    $('full-goto').addEventListener('click', function () {
      setSheet('full', false);
      openPage('v-pack');
    });
    $('full-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-i');
      if (!el || !pending) return;
      replaceIndex = +el.getAttribute('data-i');
      var old = album[replaceIndex];
      $('full-ask').textContent = '用「' + pending.card.name + '」换掉「' + (old.name || '') + '」？换下的进垃圾桶。';
      $('full-acts').className = 'grid2 sheet-acts on';
    });
    $('full-no').addEventListener('click', function () {
      replaceIndex = -1;
      $('full-ask').textContent = '';
      $('full-acts').className = 'grid2 sheet-acts';
    });
    $('full-yes').addEventListener('click', function () {
      if (!pending || replaceIndex < 0) return;
      commitAdd(pending.card, { index: replaceIndex, fromTrash: pending.fromTrash });
    });

    function closeDrop() {
      setSheet('drop', false);
      dropIndex = -1;
      $('drop-yes').textContent = '删除';
    }
    $('drop-x').addEventListener('click', closeDrop);
    $('drop-no').addEventListener('click', closeDrop);
    $('drop-yes').addEventListener('click', async function () {
      if (dropIndex === -2) {
        album = [];
        trash = [];
        stats = emptyStats();
        current = null;
        closeDrop();
        var cleared = await saveData();
        renderHome();
        renderMe();
        toast(cleared ? '已清除本机记录' : '清除没存上');
        return;
      }
      if (dropIndex < 0) return;
      trash.splice(dropIndex, 1);
      closeDrop();
      await saveData();
      renderTrash();
      toast('已彻底删除');
    });

    $('w-close').addEventListener('click', function () { setSheet('word', false); });
    $('pv-close').addEventListener('click', function () {
      setSheet('preview', false);
      $('pv-img').removeAttribute('src');
    });
    SHEETS.forEach(function (id) {
      if (id === 'drop') {
        $('drop').addEventListener('click', function (e) { if (e.target === this) closeDrop(); });
      } else bindMask(id);
    });

    $('p-clear').addEventListener('click', function () {
      dropIndex = -2;
      $('drop-text').textContent = '清除这台手机上的局数、图鉴、卡包和垃圾桶？';
      $('drop-yes').textContent = '清除';
      setSheet('drop', true);
    });
  }

  window.YKBD_APP = {
    state: function () { return G; },
    bank: BANK,
    album: function () { return album; },
    trash: function () { return trash; },
    stats: function () { return stats; }
  };

  bind();
  loadData().then(function () { renderHome(); }, function () { renderHome(); });
})();

/* 你可能不知道 · v1.5
 * 首页 → 答题（弹窗反馈）→ 结算（自动入卡册）→ 卡册 / 精选 / 图鉴 / 垃圾桶
 * 卡册不限量；精选 8 张展示在首页。卡面形象与命名以本仓库 v1.4 引擎为准。
 */
(function () {
  var BANK = window.YKBD_BANK;
  var P = window.YKBD_P;
  var F = window.YKBD_F;
  var R = window.YKBD_R;
  var FIG = window.YKBD_FIG;
  var ROUND = 5;
  var LIMIT = F.TIME_LIMIT;
  var FAV_MAX = 8;
  var TRASH_MAX = 20;
  var PACK_PAGE = 30;
  var LETTERS = ['A', 'B', 'C', 'D'];
  var VIEWS = ['v-home', 'v-quiz', 'v-result', 'v-me', 'v-pack', 'v-dex', 'v-trash'];
  var SHEETS = ['q-modal', 'sheet', 'word', 'preview', 'drop'];
  var K_OLD = 'ykbd_v1_pack';
  var K_ALBUM = 'ykbd_v1_album';
  var K_TRASH = 'ykbd_v1_trash';
  var K_STATS = 'ykbd_v1_stats';
  var K_FAV = 'ykbd_v1_fav';

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
  function findIdx(arr, fp) {
    for (var i = 0; i < arr.length; i++) if (arr[i].fp === fp) return i;
    return -1;
  }

  var toastTimer = 0;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'toast on';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = 'toast'; }, 2400);
  }

  function sheetOpen(id) { return $(id).className.indexOf(' on') >= 0; }
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

  /* ---------- 视图栈：二级页统一 back() ---------- */
  var stack = ['v-home'];
  function show(id, opts) {
    opts = opts || {};
    if (opts.root) stack = [id];
    else if (opts.replace) {
      if (stack.length) stack[stack.length - 1] = id;
      else stack = [id];
    } else if (stack[stack.length - 1] !== id) {
      stack.push(id);
    }
    paint(id);
  }
  function back() {
    if (stack.length > 1) {
      stack.pop();
      paint(stack[stack.length - 1]);
    } else {
      show('v-home', { root: true });
    }
  }

  var G = null;
  var raf = 0;
  var current = null;
  var detailCard = null;
  var packTab = 'all';
  var packLimit = PACK_PAGE;
  var dropFp = '';
  var albumBusy = false;

  function paint(id) {
    if (id !== 'v-quiz' && G && !G.answered) {
      G.hiddenAt = now();
      cancelAnimationFrame(raf);
    }
    for (var i = 0; i < VIEWS.length; i++) {
      var el = $(VIEWS[i]);
      var on = VIEWS[i] === id;
      var fit = el.getAttribute('data-fit') === '1';
      var tab = on && (VIEWS[i] === 'v-home' || VIEWS[i] === 'v-me');
      var soft = on && (VIEWS[i] === 'v-pack' || VIEWS[i] === 'v-dex' || VIEWS[i] === 'v-trash');
      el.className = 'view' + (fit ? ' fit' : '') + (on ? ' on' : '') + (tab ? ' has-tab' : '') + (soft ? ' enter-soft' : '');
    }
    var cur = $(id);
    if (cur) {
      cur.scrollTop = 0;
      var stage = cur.querySelector('.stage');
      if (stage) stage.scrollTop = 0;
    }
    if (id === 'v-quiz' && G && !G.answered && G.hiddenAt) {
      G.start += now() - G.hiddenAt;
      G.hiddenAt = 0;
      tick();
    }
    var tabOn = id === 'v-home' || id === 'v-me';
    $('tabbar').className = tabOn ? 'tabbar on' : 'tabbar';
    $('tab-home').className = 'tab' + (id === 'v-home' ? ' on' : '');
    $('tab-me').className = 'tab' + (id === 'v-me' ? ' on' : '');
    if (id === 'v-home') renderHome();
    if (id === 'v-me') renderMe();
    if (id === 'v-pack') renderPack();
    if (id === 'v-dex') renderDex();
    if (id === 'v-trash') renderTrash();
    if (id === 'v-result' && current) renderResult(current);
  }

  /* ---------- 数据 ---------- */
  var album = [];
  var trash = [];
  var favorites = [];
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

    var favRaw = await P.getData(K_FAV, { __missing: 1 });
    if (favRaw && favRaw.__missing) {
      /* 老版本没有精选：把现有卡册前 8 张设为精选，首页看起来不变 */
      favorites = album.slice(0, FAV_MAX).map(function (c) { return c.fp; });
      await P.setData(K_FAV, favorites);
    } else if (Array.isArray(favRaw)) {
      favorites = favRaw.filter(function (fp) {
        return typeof fp === 'string' && findIdx(album, fp) >= 0;
      }).slice(0, FAV_MAX);
    } else {
      favorites = [];
    }
  }
  async function saveData() {
    var a = await P.setData(K_ALBUM, album);
    var b = await P.setData(K_TRASH, trash);
    var c = await P.setData(K_STATS, stats);
    var d = await P.setData(K_FAV, favorites);
    return a && b && c && d;
  }
  function touchDay() {
    var today = ymd(new Date());
    if (stats.lastDay === today) return;
    stats.days = stats.lastDay === prevDay(today) ? (stats.days || 0) + 1 : 1;
    stats.lastDay = today;
  }
  function inAlbum(card) {
    if (!card) return false;
    return findIdx(album, card.fp) >= 0;
  }
  function inFav(fp) { return favorites.indexOf(fp) >= 0; }
  function cardByFp(fp) {
    var i = findIdx(album, fp);
    return i >= 0 ? album[i] : null;
  }
  function addCard(card) {
    if (!card || inAlbum(card)) return false;
    album.unshift(copyCard(card));
    return true;
  }
  function removeCard(fp) {
    var i = findIdx(album, fp);
    if (i < 0) return null;
    var card = album[i];
    album.splice(i, 1);
    var fi = favorites.indexOf(fp);
    if (fi >= 0) favorites.splice(fi, 1);
    return card;
  }
  function pushTrash(card) {
    var i = findIdx(trash, card.fp);
    if (i >= 0) trash.splice(i, 1);
    trash.unshift(copyCard(card));
    var evicted = false;
    if (trash.length > TRASH_MAX) {
      trash = trash.slice(0, TRASH_MAX);
      evicted = true;
    }
    return evicted;
  }
  function toggleFav(fp) {
    var i = favorites.indexOf(fp);
    if (i >= 0) { favorites.splice(i, 1); return 'removed'; }
    if (favorites.length >= FAV_MAX) return 'full';
    favorites.unshift(fp);
    return 'added';
  }
  function refreshLists() {
    renderHome();
    renderMe();
    renderPack();
  }

  function renderHome() {
    $('home-day').textContent = stats.days > 0 ? ('连续 ' + stats.days + ' 天') : '还没开局';
    $('home-pack-n').textContent = String(album.length);
    $('home-pack-max').textContent = ' 张';
    $('home-fav-n').textContent = '精选 ' + favorites.length + '/' + FAV_MAX;
    var list = favorites.length ? favorites : album.slice(0, 2).map(function (c) { return c.fp; });
    var figs = '';
    for (var i = 0; i < list.length; i++) figs += FIG.render(list[i]);
    $('home-figs').innerHTML = figs;
  }

  function cardRow(c) {
    var name = c.name || F.chineseName(c.fp);
    var meta = [c.score ? (c.score + ' 分') : '', c.title || '', c.date || ''].filter(function (s) { return !!s; }).join(' · ');
    return '<button class="box pack-item" type="button" data-fp="' + esc(c.fp) + '"><div class="av">' + FIG.render(c.fp) + '</div>' +
      '<div class="pi-main"><div class="pi-t">' + esc(name) + (inFav(c.fp) ? '<span class="pi-fav">★</span>' : '') + '</div>' +
      '<div class="pi-s">' + esc(c.fp) + '</div>' +
      (meta ? '<div class="pi-m">' + esc(meta) + '</div>' : '') +
      '</div></button>';
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
    $('me-pack-n').textContent = album.length + ' · 精选 ' + favorites.length + '/' + FAV_MAX;
    $('me-dex-t').textContent = '图鉴 ' + stats.dex.length + ' / ' + BANK.length;
    $('me-trash-t').textContent = '垃圾桶 ' + trash.length;
    var list = favorites.length ? favorites.map(cardByFp).filter(Boolean) : album.slice(0, 3);
    list = list.slice(0, 3);
    if (!list.length) {
      $('me-pack-preview').innerHTML = '<div class="pack-empty">卡册是空的。打完一局会自动收进来。</div>';
    } else {
      var h = '';
      for (var i = 0; i < list.length; i++) h += cardRow(list[i]);
      $('me-pack-preview').innerHTML = h;
    }
  }

  function renderPack() {
    $('pack-count').textContent = '全部 ' + album.length + ' 张 · 精选 ' + favorites.length + '/' + FAV_MAX;
    $('pack-tab-all-n').textContent = String(album.length);
    $('pack-tab-fav-n').textContent = String(favorites.length);
    $('pack-tab-all').className = 'seg-b' + (packTab === 'all' ? ' on' : '');
    $('pack-tab-fav').className = 'seg-b' + (packTab === 'fav' ? ' on' : '');
    var list = packTab === 'fav' ? favorites.map(cardByFp).filter(Boolean) : album;
    if (!list.length) {
      $('pack-list').innerHTML = '<div class="pack-empty">' + (packTab === 'fav'
        ? '精选还是空的。点开一张卡，选「设为精选」。'
        : '卡册是空的。打完一局会自动收进来。') + '</div>';
      $('pack-more').style.display = 'none';
      return;
    }
    var shown = list.slice(0, packLimit);
    var h = '';
    for (var i = 0; i < shown.length; i++) h += cardRow(shown[i]);
    $('pack-list').innerHTML = h;
    var more = list.length > shown.length;
    $('pack-more').style.display = more ? 'block' : 'none';
    $('pack-more-t').textContent = more ? ('已显示 ' + shown.length + ' / ' + list.length) : '';
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
      $('trash-list').innerHTML = '<div class="pack-empty">垃圾桶是空的。从卡册删掉的卡会在这里，可以找回。</div>';
      return;
    }
    var h = '';
    for (var i = 0; i < trash.length; i++) {
      var c = trash[i];
      var name = c.name || F.chineseName(c.fp);
      h += '<div class="box trash-item" data-fp="' + esc(c.fp) + '"><div class="trash-main"><div class="av">' + FIG.render(c.fp) + '</div>' +
        '<div class="pi-main"><div class="pi-t">' + esc(name) + '</div><div class="pi-s">' + esc(c.fp) + '</div></div></div>' +
        '<div class="trash-acts"><button class="box act act-lime" type="button" data-act="back">找回</button>' +
        '<button class="box act" type="button" data-act="drop">彻底删除</button></div></div>';
    }
    $('trash-list').innerHTML = h;
  }

  /* ---------- 答题 ---------- */
  function startGame() {
    closeSheets();
    var idxs = shuffle(BANK.map(function (q) { return q.idx; })).slice(0, ROUND);
    G = {
      picks: idxs, i: 0, rounds: [], streak: 0, maxStreak: 0,
      start: 0, hiddenAt: 0, answered: false, order: []
    };
    show('v-quiz', { replace: true });
    renderQuestion();
  }

  function renderQuestion() {
    var q = BANK[G.picks[G.i]];
    G.answered = false;
    G.order = shuffle([0, 1, 2, 3]);
    setSheet('q-modal', false);
    $('q-dock').className = 'dock is-hidden';
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
    $('q-pts').textContent = correct ? '对了' : (timeout ? '时间到了，没关系' : '差一点点');
    $('q-pts').className = 'sheet-kicker' + (correct ? ' ok' : '');
    $('q-modal-word').textContent = q.options[q.correctIndex];
    $('q-fact-t').textContent = q.fact;
    $('q-bonus').textContent = correct ? ('+' + pts + (sc.bonus ? '　连击 +' + sc.bonus : '')) : '';
    $('q-sec').textContent = timeout ? '时间到' : (t.toFixed(1) + ' 秒');
    $('q-sec').className = 'pill timer-pill';
    var nextLabel = G.i + 1 >= ROUND ? '看结算' : '下一题';
    $('q-next-t').textContent = nextLabel;
    $('q-dock-t').textContent = nextLabel;
    $('q-dock').className = 'dock is-hidden';
    setSheet('q-modal', true);
  }
  function advance() {
    if (!G || !G.answered) return;
    setSheet('q-modal', false);
    $('q-dock').className = 'dock is-hidden';
    if (G.i + 1 >= ROUND) { finish(); return; }
    G.i += 1;
    renderQuestion();
  }

  /* ---------- 结算 ---------- */
  function listHTML(card) {
    var detail = F.score(card.rounds, BANK).detail;
    var h = '';
    card.rounds.forEach(function (r, k) {
      var q = BANK[r.idx];
      if (!q) return;
      var d = detail[k];
      var m = r.correct ? ('+' + (d.pts + d.bonus)) : '没认出';
      h += '<li data-idx="' + r.idx + '"><em>' + esc(q.options[q.correctIndex]) + '</em><span class="m">' + m + '</span><i class="chev">›</i></li>';
    });
    var all = F.score(card.rounds, BANK).allBonus;
    if (all) h += '<li class="all"><em>全对</em><span class="m">+' + all + '</span></li>';
    return h;
  }
  function paintGacha(figId, nameId, codeId, card) {
    $(figId).innerHTML = FIG.render(card.fp);
    $(nameId).textContent = card.name || F.chineseName(card.fp);
    $(codeId).textContent = card.fp;
  }
  function renderResult(card) {
    var gacha = $('r-card');
    if (gacha.getAttribute('data-in') !== card.fp) {
      gacha.setAttribute('data-in', card.fp);
      gacha.className = 'gacha gacha-fit';
      if (gacha.offsetWidth) gacha.className = 'gacha gacha-fit enter';
    }
    paintGacha('r-fig', 'r-name', 'r-code', card);
    $('r-title').textContent = card.title;
    $('r-score').textContent = String(card.score);
    $('r-correct').textContent = card.correct + '/5';
    $('r-time').textContent = card.time + ' 秒';
    $('r-list').innerHTML = listHTML(card);
    $('r-list').className = 'r-list is-collapsed';
    $('r-toggle-t').textContent = '展开';
  }

  async function finish() {
    if (!G) return;
    var rounds = G.rounds.map(function (r) { return { idx: r.idx, correct: r.correct, t: r.t }; });
    var maxStreak = G.maxStreak;
    G = null;
    setSheet('q-modal', false);
    $('q-dock').className = 'dock is-hidden';
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
    var already = inAlbum(current);
    if (!already) album.unshift(copyCard(current));
    show('v-result', { replace: true });
    var ok = await saveData();
    if (!ok) {
      if (!already) {
        var i = findIdx(album, current.fp);
        if (i >= 0) album.splice(i, 1);
      }
      toast('这局没存上');
      return;
    }
    toast(already ? '这张已经在卡册' : '已收入卡册');
  }

  /* ---------- 卡册 / 词条 / 删除 ---------- */
  function setDetailFav() {
    var on = detailCard && inFav(detailCard.fp);
    $('d-fav').textContent = on ? '取消精选' : '设为精选';
    $('d-fav').className = 'box act fav-btn' + (on ? ' act-lime' : '');
  }
  function openDetail(fp) {
    var c = cardByFp(fp);
    if (!c) return;
    detailCard = c;
    paintGacha('d-fig', 'd-name', 'd-code', c);
    $('d-title').textContent = (c.title || '') + '　' + (c.score || 0) + ' 分';
    $('d-sub').textContent = (c.date || '') + '　答对 ' + c.correct + '/5　用时 ' + c.time + ' 秒';
    $('d-list').innerHTML = c.rounds ? listHTML(c) : '';
    setDetailFav();
    $('d-trash').style.display = '';
    setSheet('sheet', true);
  }

  function openWord(i, force) {
    var q = BANK[i];
    if (!q) return;
    if (!force && stats.dex.indexOf(q.idx) < 0) return;
    $('w-cat').textContent = q.cat;
    $('w-fig').innerHTML = figMarkup(q);
    $('w-name').textContent = q.options[q.correctIndex];
    $('w-q').innerHTML = promptHTML(q.zhPrompt);
    $('w-fact').textContent = q.fact;
    setSheet('word', true);
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
        toast(kind === 'card' ? '卡片已存到相册' : '小人已存到相册');
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

  function openDrop(fp) {
    var i = findIdx(trash, fp);
    if (i < 0) return;
    dropFp = fp;
    var name = trash[i].name || F.chineseName(trash[i].fp);
    $('drop-text').textContent = '彻底删除「' + name + '」？删掉就找不回来了。';
    $('drop-yes').textContent = '删除';
    setSheet('drop', true);
  }
  function openClear() {
    dropFp = '__all__';
    $('drop-text').textContent = '清除这台手机上的局数、图鉴、卡册和垃圾桶？';
    $('drop-yes').textContent = '清除';
    setSheet('drop', true);
  }
  function closeDrop() {
    dropFp = '';
    $('drop-yes').textContent = '删除';
    setSheet('drop', false);
  }

  async function restoreCard(fp) {
    if (albumBusy) return;
    var i = findIdx(trash, fp);
    if (i < 0) return;
    albumBusy = true;
    var card = trash[i];
    if (inAlbum(card)) {
      trash.splice(i, 1);
      await saveData();
      renderTrash();
      renderMe();
      renderHome();
      albumBusy = false;
      toast('这张已经在卡册');
      return;
    }
    trash.splice(i, 1);
    album.unshift(copyCard(card));
    var ok = await saveData();
    albumBusy = false;
    if (!ok) {
      toast('没存上');
      return;
    }
    renderTrash();
    renderMe();
    renderPack();
    renderHome();
    toast('已找回');
  }

  async function deleteDetailCard() {
    if (!detailCard || albumBusy) return;
    var fp = detailCard.fp;
    var card = removeCard(fp);
    if (!card) return;
    albumBusy = true;
    var evicted = pushTrash(card);
    setSheet('sheet', false);
    var ok = await saveData();
    albumBusy = false;
    if (!ok) {
      toast('没存上');
      return;
    }
    toast(evicted ? '已丢进垃圾桶。垃圾桶满了，最早一张被清掉' : '已丢进垃圾桶');
    renderPack();
    renderMe();
    renderHome();
  }

  /* ---------- 绑定 ---------- */
  function bindMask(id) {
    $(id).addEventListener('click', function (e) {
      if (e.target !== this) return;
      setSheet(id, false);
      if (id === 'q-modal') $('q-dock').className = (G && G.answered) ? 'dock' : 'dock is-hidden';
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
    $('btn-pack').addEventListener('click', function () { show('v-pack'); });
    $('tab-home').addEventListener('click', function () { closeSheets(); show('v-home', { root: true }); });
    $('tab-me').addEventListener('click', function () { closeSheets(); show('v-me', { root: true }); });
    $('pack-back').addEventListener('click', back);
    $('dex-back').addEventListener('click', back);
    $('trash-back').addEventListener('click', back);
    $('me-pack-more').addEventListener('click', function () { show('v-pack'); });
    $('me-dex').addEventListener('click', function () { show('v-dex'); });
    $('me-trash').addEventListener('click', function () { show('v-trash'); });
    $('q-home').addEventListener('click', function () {
      closeSheets();
      G = null;
      cancelAnimationFrame(raf);
      show('v-home', { root: true });
    });

    $('pack-tab-all').addEventListener('click', function () { packTab = 'all'; packLimit = PACK_PAGE; renderPack(); });
    $('pack-tab-fav').addEventListener('click', function () { packTab = 'fav'; packLimit = PACK_PAGE; renderPack(); });
    $('pack-more').addEventListener('click', function () { packLimit += PACK_PAGE; renderPack(); });

    $('q-opts').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-oi');
      if (!el) return;
      answer(+el.getAttribute('data-oi'));
    });
    $('q-next').addEventListener('click', advance);
    $('q-dock-next').addEventListener('click', advance);

    $('r-toggle').addEventListener('click', function () {
      var open = $('r-list').className.indexOf('is-collapsed') >= 0;
      $('r-list').className = open ? 'r-list' : 'r-list is-collapsed';
      $('r-toggle-t').textContent = open ? '收起' : '展开';
    });
    $('r-again').addEventListener('click', startGame);
    $('r-save-card').addEventListener('click', function () { saveImg('card', current); });
    $('r-save-av').addEventListener('click', function () { saveImg('avatar', current); });
    $('r-home').addEventListener('click', function () { closeSheets(); show('v-home', { root: true }); });
    $('r-me').addEventListener('click', function () { show('v-pack'); });

    $('r-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-idx');
      if (el) openWord(+el.getAttribute('data-idx'), true);
    });
    $('d-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-idx');
      if (el) openWord(+el.getAttribute('data-idx'), true);
    });

    $('pack-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-fp');
      if (el) openDetail(el.getAttribute('data-fp'));
    });
    $('me-pack-preview').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-fp');
      if (el) openDetail(el.getAttribute('data-fp'));
    });
    $('dex-list').addEventListener('click', function (e) {
      var el = findAttr(e.target, this, 'data-i');
      if (el) openWord(+el.getAttribute('data-i'));
    });
    $('trash-list').addEventListener('click', function (e) {
      var act = findAttr(e.target, this, 'data-act');
      if (!act) return;
      var item = act;
      while (item && item !== this && !item.getAttribute('data-fp')) item = item.parentNode;
      if (!item || item === this) return;
      var fp = item.getAttribute('data-fp');
      if (act.getAttribute('data-act') === 'back') restoreCard(fp);
      else openDrop(fp);
    });

    $('d-close').addEventListener('click', function () { setSheet('sheet', false); });
    $('d-save-card').addEventListener('click', function () { saveImg('card', detailCard); });
    $('d-save-av').addEventListener('click', function () { saveImg('avatar', detailCard); });
    $('d-fav').addEventListener('click', async function () {
      if (!detailCard) return;
      var r = toggleFav(detailCard.fp);
      if (r === 'full') { toast('精选已满 8 张，先去卡册取消一张'); return; }
      setDetailFav();
      renderPack();
      renderMe();
      renderHome();
      var ok = await saveData();
      toast(!ok ? '没存上' : (r === 'added' ? '已设为精选' : '已取消精选'));
    });
    $('d-trash').addEventListener('click', deleteDetailCard);

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

    $('drop-x').addEventListener('click', closeDrop);
    $('drop-no').addEventListener('click', closeDrop);
    $('drop-yes').addEventListener('click', async function () {
      if (dropFp === '__all__') {
        album = [];
        trash = [];
        favorites = [];
        stats = emptyStats();
        current = null;
        closeDrop();
        var cleared = await saveData();
        renderHome();
        renderMe();
        renderPack();
        toast(cleared ? '已清除本机记录' : '清除没存上');
        return;
      }
      if (!dropFp) return;
      var i = findIdx(trash, dropFp);
      if (i < 0) { closeDrop(); return; }
      trash.splice(i, 1);
      closeDrop();
      await saveData();
      renderTrash();
      renderMe();
      toast('已彻底删除');
    });

    $('p-clear').addEventListener('click', openClear);
  }

  window.YKBD_APP = {
    state: function () { return G; },
    bank: BANK,
    album: function () { return album; },
    trash: function () { return trash; },
    favorites: function () { return favorites; },
    stats: function () { return stats; }
  };

  bind();
  loadData().then(function () { show('v-home', { root: true }); }, function () { show('v-home', { root: true }); });
})();

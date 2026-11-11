/* 发笔记文案、关注按钮状态、点击守卫。不直接碰 DOM。 */
(function () {
  var S = {};

  function clip(s, n) {
    s = String(s == null ? '' : s);
    if (s.length <= n) return s;
    var out = s.slice(0, n);
    var last = out.charCodeAt(out.length - 1);
    if (last >= 0xD800 && last <= 0xDBFF) out = out.slice(0, -1);
    return out;
  }
  S.clip = clip;

  /* 标题最长 20 字。四字名刚好放进「我抽到了「NAME」！」。 */
  S.noteTitle = function (name) {
    var head = '我抽到了「';
    var tail = '」！';
    var room = 20 - head.length - tail.length;
    if (room < 1) return clip(head + (name || ''), 20);
    return head + clip(name || '', room) + tail;
  };

  /* 分数、用时只进正文，不进卡图。 */
  S.noteBody = function (card) {
    var c = card || {};
    var correct = c.correct == null ? 0 : c.correct;
    var score = c.score == null ? 0 : c.score;
    var time = c.time == null ? 0 : c.time;
    var text = '本局答对 ' + correct + '/5、得分 ' + score + '、用时 ' + time + ' 秒。来一局「你可能不知道」，冷门叫法就在手边。#小红书小工具 #你可能不知道 #冷门单词';
    return clip(text, 1000);
  };

  /* 0 关注作者；1 已关注并禁用；2 作者本人隐藏；-1 仍显示按钮。null 表示接口不可用。 */
  S.followView = function (status, pending) {
    if (status === null || status === undefined || status === 2) {
      return { hidden: true, label: '', disabled: true };
    }
    if (status === 1) return { hidden: false, label: '已关注', disabled: true };
    return { hidden: false, label: '关注作者', disabled: !!pending };
  };

  S.createPoster = function (deps) {
    var pending = false;
    return {
      pending: function () { return pending; },
      tap: async function (card) {
        if (pending) return { ok: false, reason: 'pending' };
        if (!deps.canPost()) return { ok: false, reason: 'noxhs' };
        if (!card || !card.fp) return { ok: false, reason: 'render' };
        pending = true;
        try {
          var url;
          try {
            if (deps.ensureFonts) await deps.ensureFonts();
            url = await deps.exportCard({ fp: card.fp, name: card.name || '' });
          } catch (e) {
            return { ok: false, reason: 'render' };
          }
          if (!url || String(url).indexOf('data:') !== 0) return { ok: false, reason: 'render' };
          try {
            return await deps.postPhoto({
              title: S.noteTitle(card.name || ''),
              content: S.noteBody(card),
              dataUrl: url
            });
          } catch (e2) {
            return { ok: false, reason: 'fail' };
          }
        } finally {
          pending = false;
        }
      }
    };
  };

  S.createFollow = function (deps) {
    var pending = false;
    var status = null;
    return {
      pending: function () { return pending; },
      view: function () { return S.followView(status, pending); },
      load: async function () {
        var ok = false;
        try { ok = await deps.supported(); } catch (e) { ok = false; }
        if (!ok) {
          status = null;
          return S.followView(status, pending);
        }
        try { status = await deps.read(); } catch (e2) { status = -1; }
        if (typeof status !== 'number') status = -1;
        return S.followView(status, pending);
      },
      tap: async function () {
        if (pending) return { type: 'pending', notice: '', view: S.followView(status, pending) };
        if (status === null || status === 1 || status === 2) {
          return { type: 'skip', notice: '', view: S.followView(status, pending) };
        }
        pending = true;
        var notice = '';
        try {
          var res = await deps.follow();
          if (res && res.type === 'ok' && typeof res.status === 'number') status = res.status;
          else if (res && res.type === 'limit') notice = '今天先到这儿啦';
        } finally {
          pending = false;
        }
        return { type: 'done', notice: notice, view: S.followView(status, pending) };
      }
    };
  };

  window.YKBD_S = S;
})();

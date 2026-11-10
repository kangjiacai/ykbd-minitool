/* 把抽卡成绩卡 / 单独形象画成 PNG，供存相册。不依赖外链。 */
(function () {
  var R = {};
  var FONT = 'YK, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';

  R.ensureFonts = function () {
    if (!document.fonts || typeof document.fonts.load !== 'function') return Promise.resolve();
    var loads = [
      document.fonts.load('400 32px YK', '你可能不知道'),
      document.fonts.load('700 72px YK', '盐巴气球编码')
    ];
    var timeout = new Promise(function (res) { setTimeout(res, 1800); });
    return Promise.race([Promise.all(loads).catch(function () {}), timeout]);
  };

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function canvas(w, h) {
    var cv = document.getElementById('cv');
    cv.width = w;
    cv.height = h;
    var ctx = cv.getContext('2d');
    ctx.textBaseline = 'alphabetic';
    return { cv: cv, ctx: ctx };
  }

  function hardShadow(ctx, x, y, w, h, r, dx, dy) {
    ctx.fillStyle = '#111';
    roundRect(ctx, x + dx, y + dy, w, h, r);
    ctx.fill();
  }

  function fillStroke(ctx, x, y, w, h, r, fill, sw) {
    roundRect(ctx, x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = sw;
    ctx.strokeStyle = '#111';
    ctx.stroke();
  }

  function text(ctx, s, x, y, size, weight, color, align) {
    ctx.font = weight + ' ' + size + 'px ' + FONT;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.fillText(s, x, y);
  }

  /* 导出卡对齐 B3：黄绿卡、斜白贴纸、全身居中，右侧只有四字名，右下是编码。 */
  R.drawCard = function (card) {
    return Promise.resolve().then(function () {
      var o = canvas(1080, 1440);
      var ctx = o.ctx;
      var G = window.YKBD_FIGURE;
      ctx.fillStyle = '#E8EBEF';
      ctx.fillRect(0, 0, 1080, 1440);

      var x = 60, y = 64, w = 960, h = 1312;
      hardShadow(ctx, x, y, w, h, 36, 12, 12);
      fillStroke(ctx, x, y, w, h, 36, '#C8F031', 6);

      ctx.save();
      ctx.translate(x + 36, y + 36);
      ctx.rotate(-3 * Math.PI / 180);
      hardShadow(ctx, 0, 0, 280, 58, 29, 5, 5);
      fillStroke(ctx, 0, 0, 280, 58, 29, '#fff', 4);
      text(ctx, '你可能不知道', 22, 40, 26, '700', '#111', 'left');
      ctx.restore();

      var dotR = 70;
      var dotCx = x + w - 72 - dotR;
      var dotCy = y + 148 + dotR;
      ctx.beginPath();
      ctx.arc(dotCx + 8, dotCy + 8, dotR, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotCx, dotCy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = '#C4B5FD';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#111';
      ctx.stroke();

      var sx = x + 56, sy = y + 168, sw = 560, sh = 980;
      ctx.save();
      ctx.translate(sx + sw / 2, sy + sh / 2);
      ctx.rotate(-6 * Math.PI / 180);
      hardShadow(ctx, -sw / 2, -sh / 2, sw, sh, 32, 14, 14);
      fillStroke(ctx, -sw / 2, -sh / 2, sw, sh, 32, '#fff', 6);
      var fw = 420;
      var fh = fw * (720 / 400);
      G.drawFigure(ctx, card.fp, -fw / 2, -fh / 2, fw);
      ctx.restore();

      ctx.save();
      ctx.translate(x + w - 40 - 360, y + 560);
      ctx.rotate(4 * Math.PI / 180);
      hardShadow(ctx, 0, 0, 360, 132, 22, 8, 8);
      fillStroke(ctx, 0, 0, 360, 132, 22, '#fff', 6);
      text(ctx, card.name, 28, 88, 60, '700', '#111', 'left');
      ctx.restore();

      ctx.save();
      ctx.font = '700 28px ' + FONT;
      var tw = Math.max(340, ctx.measureText(card.fp).width + 44);
      ctx.translate(x + w - 48 - tw, y + h - 96 - 70);
      ctx.rotate(-2 * Math.PI / 180);
      hardShadow(ctx, 0, 0, tw, 70, 18, 6, 6);
      fillStroke(ctx, 0, 0, tw, 70, 18, '#C4B5FD', 5);
      text(ctx, card.fp, 22, 46, 28, '700', '#111', 'left');
      ctx.restore();

      return o.cv.toDataURL('image/png');
    });
  };

  R.drawFigure = function (card) {
    return Promise.resolve().then(function () {
      var o = canvas(1080, 1440);
      var ctx = o.ctx;
      ctx.fillStyle = '#E8EBEF';
      ctx.fillRect(0, 0, 1080, 1440);
      hardShadow(ctx, 70, 70, 940, 1300, 40, 16, 16);
      fillStroke(ctx, 70, 70, 940, 1300, 40, '#fff', 10);
      var fw = 520;
      window.YKBD_FIGURE.drawFigure(ctx, card.fp, (1080 - fw) / 2, 120, fw);
      text(ctx, card.name, 540, 1168, 64, '700', '#111', 'center');
      text(ctx, card.fp, 540, 1252, 32, '700', '#111', 'center');
      return o.cv.toDataURL('image/png');
    });
  };

  window.YKBD_R = R;
})();

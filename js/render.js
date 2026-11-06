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

  function svgImage(svg) {
    var xml = svg;
    if (xml.indexOf('width=') < 0) xml = xml.replace('<svg ', '<svg width="400" height="720" ');
    var blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve({ img: img, url: url }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
      img.src = url;
    });
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

  R.drawCard = function (card) {
    return svgImage(window.YKBD_FIG.render(card.fp)).then(function (loaded) {
      var img = loaded.img;
      var o = canvas(1080, 1440);
      var ctx = o.ctx;
      ctx.fillStyle = '#E8EBEF';
      ctx.fillRect(0, 0, 1080, 1440);
      hardShadow(ctx, 70, 70, 940, 1300, 48, 16, 16);
      fillStroke(ctx, 70, 70, 940, 1300, 48, '#C8F031', 10);

      ctx.save();
      ctx.translate(118, 148);
      ctx.rotate(-0.05);
      hardShadow(ctx, 0, 0, 250, 64, 32, 6, 6);
      fillStroke(ctx, 0, 0, 250, 64, 32, '#fff', 6);
      text(ctx, '你可能不知道', 28, 44, 28, '700', '#111', 'left');
      ctx.restore();

      ctx.save();
      ctx.translate(860, 210);
      ctx.beginPath();
      ctx.arc(16, 16, 78, 0, Math.PI * 2);
      ctx.fillStyle = '#111';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 78, 0, Math.PI * 2);
      ctx.fillStyle = '#C4B5FD';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#111';
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(400, 760);
      ctx.rotate(-6 * Math.PI / 180);
      hardShadow(ctx, -270, -470, 540, 920, 40, 18, 18);
      roundRect(ctx, -270, -470, 540, 920, 40);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#111';
      ctx.stroke();
      ctx.save();
      roundRect(ctx, -270, -470, 540, 920, 40);
      ctx.clip();
      var fw = 460;
      var fh = fw * (720 / 400);
      ctx.drawImage(img, -fw / 2, -fh / 2 + 10, fw, fh);
      ctx.restore();
      ctx.restore();

      ctx.save();
      ctx.translate(760, 700);
      ctx.rotate(4 * Math.PI / 180);
      hardShadow(ctx, 0, 0, 250, 150, 28, 12, 12);
      fillStroke(ctx, 0, 0, 250, 150, 28, '#fff', 8);
      text(ctx, card.name, 28, 96, 52, '700', '#111', 'left');
      ctx.restore();

      ctx.save();
      ctx.translate(690, 1120);
      ctx.rotate(3 * Math.PI / 180);
      ctx.font = '700 32px ' + FONT;
      var tw = Math.max(280, ctx.measureText(card.fp).width + 48);
      hardShadow(ctx, 0, 0, tw, 78, 18, 8, 8);
      fillStroke(ctx, 0, 0, tw, 78, 18, '#C4B5FD', 6);
      text(ctx, card.fp, 24, 52, 32, '700', '#111', 'left');
      ctx.restore();

      var url = o.cv.toDataURL('image/png');
      URL.revokeObjectURL(loaded.url);
      return url;
    });
  };

  R.drawFigure = function (card) {
    return svgImage(window.YKBD_FIG.render(card.fp)).then(function (loaded) {
      var img = loaded.img;
      var o = canvas(1080, 1440);
      var ctx = o.ctx;
      ctx.fillStyle = '#E8EBEF';
      ctx.fillRect(0, 0, 1080, 1440);
      hardShadow(ctx, 70, 70, 940, 1300, 40, 16, 16);
      fillStroke(ctx, 70, 70, 940, 1300, 40, '#fff', 10);
      var fh = 980;
      var fw = fh * (400 / 720);
      ctx.drawImage(img, (1080 - fw) / 2, 110, fw, fh);
      text(ctx, card.name, 540, 1188, 64, '700', '#111', 'center');
      text(ctx, card.fp, 540, 1260, 32, '700', '#111', 'center');
      var url = o.cv.toDataURL('image/png');
      URL.revokeObjectURL(loaded.url);
      return url;
    });
  };

  window.YKBD_R = R;
})();

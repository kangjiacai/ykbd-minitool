/* 平台能力封装：按 2026-10-30 在线文档（§3.1 / §3.4 / §3.5 / §3.6 / §3.7 / §3.13）
 * 一律先判 window.xhs.miniTool 与方法存在，再判客户端版本；全部失败可降级。
 */
(function () {
  var P = {};
  var cachedBuild = null;

  function mt() { return (window.xhs && window.xhs.miniTool) || null; }
  function has(name) { var m = mt(); return !!(m && typeof m[name] === 'function'); }

  function readBuildVersion(lo) {
    var env = lo && lo.miniToolEnv;
    return Number(env && env.buildVersion) || 0;
  }
  async function getBuildVersion() {
    if (cachedBuild !== null) return cachedBuild;
    var xhs = window.xhs;
    var v = readBuildVersion(xhs && xhs.launchOptions);
    if (!v && has('getLaunchOptions')) {
      try { v = readBuildVersion(await mt().getLaunchOptions()); } catch (e) { v = 0; }
    }
    cachedBuild = v;
    return v;
  }
  async function atLeast(minClient) {
    var b = await getBuildVersion();
    return Math.floor(b / 1000) >= minClient;
  }
  P.inXhs = function () { return !!mt(); };
  P.getBuildVersion = getBuildVersion;

  /* ---------- 存储：9.46+ 用 Storage API，否则 localStorage，最后内存 ---------- */
  var mem = {};
  async function useXhsStorage() { return has('setStorage') && has('getStorage') && (await atLeast(9460)); }

  P.setData = async function (key, data) {
    var s;
    try { s = JSON.stringify(data); } catch (e) { return false; }
    if (typeof s !== 'string') return false;
    mem[key] = s;
    if (await useXhsStorage()) {
      try { await mt().setStorage({ key: key, data: s }); return true; } catch (e) { return false; }
    }
    try { window.localStorage.setItem(key, s); return true; } catch (e) { return false; }
  };
  P.getData = async function (key, fallback) {
    var s = null;
    if (await useXhsStorage()) {
      try { var r = await mt().getStorage({ key: key }); s = r ? r.data : null; } catch (e) { s = null; }
      /* 低版本升级上来：旧数据可能还在 localStorage，读一次做迁移兜底 */
      if (s === null || s === undefined) { try { s = window.localStorage.getItem(key); } catch (e2) { s = null; } }
    } else {
      try { s = window.localStorage.getItem(key); } catch (e) { s = null; }
    }
    if (s === null || s === undefined) s = mem[key] || null;
    if (s === null) return fallback;
    try { return JSON.parse(s); } catch (e) { return fallback; }
  };

  /* ---------- 存相册：9.42+；先 writeTempFile 换 filePath，失败再直接传 dataURL ---------- */
  P.saveImage = async function (dataUrl) {
    var m = mt();
    if (!m || typeof m.saveImageToPhotosAlbum !== 'function') return { ok: false, reason: 'noxhs' };
    var b = await getBuildVersion();
    if (b && Math.floor(b / 1000) < 9420) return { ok: false, reason: 'oldclient' };
    var filePath = dataUrl;
    if (typeof m.writeTempFile === 'function') {
      try { var w = await m.writeTempFile({ data: dataUrl }); if (w && w.filePath) filePath = w.filePath; } catch (e) { filePath = dataUrl; }
    }
    try { await m.saveImageToPhotosAlbum({ filePath: filePath }); return { ok: true }; }
    catch (e) { return { ok: false, reason: 'fail', msg: (e && (e.errMsg || e.message)) || '' }; }
  };

  /* ---------- 振动：9.50+，可选；不阻塞 ---------- */
  P.vibrate = function (type) {
    if (!has('vibrateShort')) return;
    atLeast(9500).then(function (ok) {
      if (!ok) return;
      try {
        var r = mt().vibrateShort({ type: type || 'light' });
        if (r && typeof r.catch === 'function') r.catch(function () {});
      } catch (e) { /* 忽略 */ }
    });
  };

  window.YKBD_P = P;
})();

# 你可能不知道 · 小工具 v1

离线好奇心闯关。每局从内置题库无放回抽 5 题，四选一，限时 14 秒。结算抽一张只属于这局的卡：卡面只有指纹形象、四字中文名和指纹码。分数、答对数、用时和称号在卡外的「本局详情」。

## 本地打开

在仓库根目录起一个静态服务（不要直接双击 `index.html` 时依赖外链；本包全部相对路径，用本地服务最稳）：

```bash
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765/`。走完一局：首页 → 答题 → 结算卡。浏览器里没有小红书容器时，「存到相册 / 只存形象」会打开预览，可长按图片另存。

## 题库

**64 题。** 指纹用 6 bit 存题号，编码固定 12 位（`XXXX-XXXX-XXXX`），所以 v1 题库停在 64，没有扩到 80–100。再加题要升指纹版本、把编码加长。题只能在 `data/bank.js` 末尾追加，不能插队或重排，否则旧指纹对不上题。

## 上传包

`dist/你可能不知道-v1.zip` 的根目录就是 `index.html`。包内没有网络请求、没有 `type=module`、没有内联脚本。高消耗场景标记为 `false`（不用 Worker、WASM、离屏画布或游戏引擎）。

重新打包（`scripts/` 里的两个检查脚本不要打进 zip）：

```bash
rm -rf /tmp/ykbd-stage
mkdir -p /tmp/ykbd-stage/css /tmp/ykbd-stage/js /tmp/ykbd-stage/data /tmp/ykbd-stage/fonts
cp index.html /tmp/ykbd-stage/
cp css/app.css /tmp/ykbd-stage/css/
cp js/*.js /tmp/ykbd-stage/js/
cp data/bank.js /tmp/ykbd-stage/data/
cp fonts/*.woff2 /tmp/ykbd-stage/fonts/
node scripts/write_manifest.mjs /tmp/ykbd-stage false
node scripts/audit_artifact.mjs /tmp/ykbd-stage
cd /tmp/ykbd-stage && zip -r -X "$OLDPWD/dist/你可能不知道-v1.zip" . -x '*.DS_Store'
node scripts/audit_artifact.mjs "$OLDPWD/dist/你可能不知道-v1.zip"
```

## 本机记录

优先 `xhs.miniTool.setStorage` / `getStorage`（客户端 9.46+），否则 `localStorage`。卡包最多 8 张，满了挤掉最早的。答对会在有 `vibrateShort` 时以 `medium` 短振。换机或清数据会丢。不做云存档、排行榜、AI 出题。

## 已知缺口

- 题库 64，不是 80–100。见上。
- 没在小红书真机或 Chrome 61 WebView 上跑过。脚本按 ES2017 写，样式按 Chrome 61 基线写。
- 相册保存依赖容器里的 `saveImageToPhotosAlbum`（大图先 `writeTempFile`）。浏览器只有预览。
- 累计等级是见习 → 侦探 → 图鉴官 → 词源玩家。文案不用「冷知识」。

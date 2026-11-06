# 你可能不知道 · 小工具 v1.1

离线好奇心闯关。每局从内置题库无放回抽 5 题，四选一，限时 14 秒。结算抽一张卡：卡面只有指纹形象、四字中文名和指纹码。分数、答对、用时和称号在卡外的「本局详情」。

## 本地打开

```bash
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765/`。建议走一遍：首页 → 答题（选完出弹窗）→ 结算点「加入卡包」→ 我的 → 卡包 / 图鉴 / 垃圾桶。

浏览器里没有小红书容器时，「存形象」会打开预览，可长按图片另存。

## 题库

**64 题。** 指纹用 6 bit 存题号，编码固定 12 位（`XXXX-XXXX-XXXX`），所以没有扩到 80–100。再加题要升指纹版本。题只能在 `data/bank.js` 末尾追加，不能插队或重排。

## 上传包

`dist/你可能不知道-v1.1.zip`（约 323 KB），根目录是 `index.html`。`mini_tool.json` 为 `is_high_consumption_scene: false`。

重新打包（`scripts/` 不要打进 zip）：

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
cd /tmp/ykbd-stage && zip -r -X "$OLDPWD/dist/你可能不知道-v1.1.zip" . -x '*.DS_Store'
```

## v1.1 和 v1 的差别

- 顶栏右侧留出约 100px，不放会跟容器「更多 / 关闭」抢位的按钮。返回在左侧。
- 首页、答题、结算、我的、卡包、图鉴、垃圾桶分页。我的只放等级、最多 3 张卡预览和图鉴 / 垃圾桶入口。
- 答完或超时，对错和短解释进弹窗。「下一题 / 看结算」固定在底栏。
- 结算不自动入卡包。要自己点「加入卡包」。满 8 张不静默挤掉旧卡，可以去卡包腾位置，或点名替换（换下的进垃圾桶）。
- 从卡包丢出进垃圾桶（最多 20，超出丢掉最早的一张）。垃圾桶可找回；卡包满时同样要选择替换。也可彻底删除。
- 旧的 `ykbd_v1_pack` 会迁进 `ykbd_v1_album`。新局不再自动写入。

## 已知缺口

- 没在小红书真机或 Chrome 61 WebView 上复测这一版。脚本按 ES2017 写，样式按 Chrome 61 基线写。
- 题库仍是 64。
- 相册保存依赖容器里的 `saveImageToPhotosAlbum`。

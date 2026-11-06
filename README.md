# 你可能不知道 · 小工具 v1.2

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

`dist/你可能不知道-v1.2.zip`，根目录是 `index.html`。`mini_tool.json` 为 `is_high_consumption_scene: false`。

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
cd /tmp/ykbd-stage && zip -r -X "$OLDPWD/dist/你可能不知道-v1.2.zip" . -x '*.DS_Store'
```

## v1.2

- 官方返回会直接退出小工具，页内不靠它。首页和「我的」在内容区互切；卡包 / 图鉴 / 垃圾桶在内容区放「回我的」。这些按钮都在导航栏下方，不进顶栏左上或右上。
- 页面整体下沉：`padding-top` 为安全区再加 48px 导航带。
- 答完从底部升起行动表。对错、正名、一句解释和「下一题 / 看结算」都在表里。点遮罩可收起，底栏仍留同一个按钮。
- 结算仍不自动入卡包。满 8 张要自己腾位置或点名替换。垃圾桶可找回、可彻底删除。旧的 `ykbd_v1_pack` 会迁进 `ykbd_v1_album`。

## 已知缺口

- 没在小红书真机或 Chrome 61 WebView 上复测这一版。脚本按 ES2017 写，样式按 Chrome 61 基线写。
- 题库仍是 64。
- 相册保存依赖容器里的 `saveImageToPhotosAlbum`。

# 你可能不知道 · 小工具 v1.6.0

离线好奇心闯关。每局从内置题库无放回抽 5 题，四选一，限时 14 秒。结算抽一张卡：卡面只有指纹形象、四字中文名和指纹码。分数、答对、用时和称号在卡外的「本局详情」。

## 本地打开

```bash
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765/`。建议走一遍：首页 → 答题（选完出弹窗）→ 结算点「加入卡包」→ 我的 → 卡包 / 图鉴 / 垃圾桶。

浏览器里没有小红书容器时，「存形象」会打开预览，可长按图片另存。

## 题库

**200 题。** 仍是四选一，每局无放回抽 5 题。难度 1 / 2 / 3 分别对应眼熟、冷门、猎奇。题只能在 `data/bank.js` 末尾追加，不能插队或重排。

指纹仍是 12 位（`XXXX-XXXX-XXXX`）。v1 用 6 bit 存题号，只够 64 题。v1.5 起新局写 v2：题号 8 bit（到 255），用时收成 4 秒一档，校验不变。已经发出的 v1 码还能解码。

自检：`node scripts/validate_bank.mjs`

## 上传包

`dist/你可能不知道-v1.6.zip`，根目录是 `index.html`。`mini_tool.json` 为 `is_high_consumption_scene: false`。动效清单见 `MOTION.md`。

重新打包（`scripts/` 不要打进 zip）：

```bash
rm -rf /tmp/ykbd-stage
mkdir -p /tmp/ykbd-stage/css /tmp/ykbd-stage/js /tmp/ykbd-stage/data /tmp/ykbd-stage/fonts
cp index.html favicon.ico /tmp/ykbd-stage/
cp css/app.css /tmp/ykbd-stage/css/
cp js/*.js /tmp/ykbd-stage/js/
cp data/bank.js /tmp/ykbd-stage/data/
cp fonts/*.woff2 /tmp/ykbd-stage/fonts/
node scripts/write_manifest.mjs /tmp/ykbd-stage false
node scripts/audit_artifact.mjs /tmp/ykbd-stage
cd /tmp/ykbd-stage && zip -r -X "$OLDPWD/dist/你可能不知道-v1.6.zip" . -x '*.DS_Store'
```

## v1.6.0

形象换成 B3 全身引擎（`ykbd-figure-parts` `a9a3acb`，`js/figure-avatar.js`）。画布 400×720。结算卡、卡包、首页缩略、垃圾桶，以及「存形象 / 存到相册」都走这套绘制。指纹仍是原来的 12 位 Crockford 码，原样传进引擎。四字名仍由本工具的指纹函数决定，样张编码不变。卡面只有形象、名字和编码。题库和规则没动。

## v1.5

题库从 64 加到 200，只在末尾追加。新局指纹升到 v2，题号改用 8 bit，用时改成 4 秒一档，卡面仍是 12 位。

## v1.4

动效只做了 7 处，曲线和时长写在 `MOTION.md`。底栏换页不滑动。答题表和结算卡是两处稍明显的动作。

## v1.3

- 首页和「我的」是一级页，用底部导航切换。卡包、图鉴、垃圾桶、答题、结算不显示底栏。
- 二级页在内容区放「回我的」。答题内容区有「回首页」，结算底栏也有。官方返回仍会直接退出小工具。
- 页面整体下沉：`padding-top` 为安全区再加 48px 导航带。
- 答完从底部升起行动表。对错、正名、一句解释和「下一题 / 看结算」都在表里。点遮罩可收起，底栏仍留同一个按钮。
- 结算仍不自动入卡包。满 8 张要自己腾位置或点名替换。垃圾桶可找回、可彻底删除。旧的 `ykbd_v1_pack` 会迁进 `ykbd_v1_album`。

## 已知缺口

- 没在小红书真机或 Chrome 61 WebView 上复测这一版。脚本按 ES2017 写，样式按 Chrome 61 基线写。
- 指纹 v2 逆推出来的用时是 0 / 4 / 8 / 12 秒，卡上存的逐题用时仍是原值。
- 相册保存依赖容器里的 `saveImageToPhotosAlbum`。

# 你可能不知道 · 小工具 v1.5

离线好奇心闯关。每局从内置题库无放回抽 5 题，四选一，限时 14 秒。结算自动收进卡册：卡面只有指纹形象、四字中文名和指纹码；分数、答对、用时和称号在卡外的「本局详情」。

卡册不限量，精选 8 张展示在首页。

## 本地打开

```bash
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765/`。建议走一遍：首页 → 答题（选完出弹层）→ 结算（自动入册）→ 查看卡册 / 精选 / 图鉴 / 垃圾桶。

浏览器里没有小红书容器时，「存卡片 / 存小人」会打开预览，可长按图片另存。

## 题库与指纹

**64 题。** 指纹用 6 bit 存题号，编码 12 位（`XXXX-XXXX-XXXX`）。

`js/fingerprint.js` 会按 `window.YKBD_BANK.length` 自动选择位宽：

- 64 条以内：6 bit，12 位码，和 v1.4 完全一致；
- 超过 64 条：8 bit，14 位码（`XXXX-XXXX-XXXX-XX`）。老 12 位码仍能解码，老卡形象不变；卡面码牌会按码长自动缩字号。

题只能在 `data/bank.js` 末尾追加，不能插队或重排。扩到 200 题是上线前的独立任务，扩完要重新验证 14 位码、卡面码牌、图鉴分组和等级曲线。

## 卡册模型

- 每局结算**自动入册**，不再需要点「加入卡包」，也没有「满包替换」流程。
- 卡册**不限量**；**精选最多 8 张**，首页展示精选，卡册页分「全部 / 精选」。
- 卡册行显示 `分数 · 称号 · 日期`；单页先渲染 30 张，更多用「显示更多」。
- 垃圾桶最多 20 张，可找回 / 彻底删除。
- 迁移：旧的 `ykbd_v1_pack` 会迁进 `ykbd_v1_album`；第一次加载 v1.5 时，旧卡册前 8 张会自动设为精选，首页看起来不变。

## 上传包

`dist/你可能不知道-v1.5.zip`，根目录是 `index.html`。`mini_tool.json` 为 `{"is_high_consumption_scene":false}`：本工具没有 Worker、离屏渲染、WebAssembly 或游戏引擎。

重新打包（`scripts/`、`previews/` 不要打进 zip）。按 `minitool-zip-builder` 规范，用它的脚本生成 manifest、审计并压缩：

```bash
SKILL="$HOME/.agents/skills/minitool-zip-builder"
rm -rf /tmp/ykbd-stage
mkdir -p /tmp/ykbd-stage/css /tmp/ykbd-stage/js /tmp/ykbd-stage/data /tmp/ykbd-stage/fonts
cp index.html /tmp/ykbd-stage/
cp css/app.css /tmp/ykbd-stage/css/
cp js/*.js /tmp/ykbd-stage/js/
cp data/bank.js /tmp/ykbd-stage/data/
cp fonts/*.woff2 /tmp/ykbd-stage/fonts/
node "$SKILL/scripts/write_manifest.mjs" /tmp/ykbd-stage false
node "$SKILL/scripts/audit_artifact.mjs" /tmp/ykbd-stage
cd /tmp/ykbd-stage && zip -r -X "$OLDPWD/dist/你可能不知道-v1.5.zip" . -x '*.DS_Store'
cd "$OLDPWD"
node "$SKILL/scripts/audit_artifact.mjs" "dist/你可能不知道-v1.5.zip"
```

## v1.5

- **结算**：卡自动入册；第一屏是「再来一局」+「存卡片 / 存小人」+「查看卡册」；「本局详情」默认收起，展开后每行可点开词条看 fact。
- **卡册**：不限量 + 8 精选；卡册行带分数/称号/日期；分页 30 张；空态和精选空态分开。
- **导航**：二级页统一 `back()` 视图栈；首页进卡册再返回会回首页，结算进卡册再返回会回结算。垃圾桶找回后列表和计数立即刷新，不再出现旧的 `stack is not defined`。
- **答题**：320×568 下四个选项同屏；结果列表不再被 `max-height` 裁掉；底部弹层在桌面宽度下限制 480px。
- **提示**：toast 移到顶部居中偏下，不再压住卡面左上角的「你可能不知道」标签。
- **编码**：12 位 / 14 位双格式；64 题仍输出 12 位，扩到 200 时自动 14 位，卡面码牌自动缩字号。
- **导出**：卡片图/小人图的码牌按码长自适应。

## v1.4

动效只做了 7 处，曲线和时长写在 `MOTION.md`。底栏换页不滑动。答题表和结算卡是两处稍明显的动作。

## 已知缺口

- **没有在小红书真机或 Chrome 61 WebView 上复测这一版。** 脚本按 ES2017 写，样式按 Chrome 61 基线写；本地 Chrome 只能做逻辑验证，官方模拟器也只做了首页 / 答题 / 超时 / 结算冒烟。上线前仍需在创服平台模拟器、Android 真机和 iOS 真机扫码验证。
- 题库仍是 64；200 题扩容由另一条工作流负责，扩完前不要依赖 14 位码路径。
- 图鉴在 200 题时是 200 格，当前没有分组/筛选；扩题前要补。
- 相册保存依赖容器里的 `saveImageToPhotosAlbum`；未登录或未授权时走预览。
- 没有做登录、上传、预览、送审、编辑；这些操作仍需要单独的授权。

# 动效机会（find）与落地（v1.4）

曲线只用这三支，不另造：

- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` 进入 / 退出 / 按下
- `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` 屏内移动（本版未用到）
- `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` 底部行动表
- 颜色变化用内置 `ease`（表里「hover / color」那一档）

只动 `transform` 和 `opacity`。`prefers-reduced-motion: reduce` 去掉位移，保留 200ms 透明度。Chrome 61 不认这条媒体查询时，走完整动效。

## 做

| # | 位置 | 目的 | 频率 | 做法 |
| --- | --- | --- | --- | --- |
| 1 | 四选一 `.opt:active` | Feedback | 每局几次 | `transform` 160ms `--ease-out`，按下 `translate(2px,2px) scale(0.97)` |
| 2 | 主按钮 `.btn-main` `.act` `.row-link` `.pack-item` `.dex-item` `.text-back` | Feedback | 偶尔到每天十几次 | 同上 160ms `--ease-out` |
| 3 | 答题表 `.sheet-bottom` / `.sheet-panel` | Spatial | 每题一次 | 遮罩 `opacity` 280ms `--ease-drawer`；面板 `translateY(100%)` ↔ `0`，同曲线同时长。CSS transition，可从半途折返 |
| 4 | 答对 `.opt.ok` | State | 每局最多 5 次 | `opt-ok` 160ms `--ease-out`，从 `scale(0.97)` 回到 1。底色仍瞬间切换（不动画 `background-color`） |
| 5 | 结算卡 `.gacha-fit.enter` | Delight | 每局一次 | `card-in` 280ms `--ease-out`，`scale(0.95)` + `opacity: 0` → 到位。同一张卡不重播 |
| 6 | 卡包 / 图鉴 / 垃圾桶 `.view.enter-soft` | 避免硬切 | 偶尔 | `page-in` 200ms `--ease-out`，`translateY(10px)` + 淡入 |
| 7 | 提示 `.toast` | Feedback | 偶尔 | `opacity` + `translateY(100%)` 200ms `--ease-out`，进出同一条路径。底栏选中只改 `background-color` 150ms `ease`，页面不滑 |

## 不做

- 底栏切换整页滑动。高频导航，滑轨会拖。只留选中色。
- 选项底色过渡。`background-color` 要重绘；对错靠瞬间换色加第 4 条的轻缩放已经够读。
- 四题错开进场。每题都看，装饰会挡阅读。
- 词表展开的高度动画。布局属性，而且是要读的明细。
- 进度条宽度。功能条，不是情绪。

## reduced-motion

- 按下：取消 `transform`，颜色仍可 150ms。
- 行动表：取消 `translateY`，遮罩仍 200ms 淡入淡出。
- 答对缩放、抽卡位移、二级页位移：改成 200ms 只淡入（`fade-in`）。
- 提示：取消 `translateY`，只留透明度。

桌面截图看得到终态，看不到中间帧。真机上的手感需要再确认。

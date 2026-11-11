# 期权大白话 · 站内阅读预览方案

给 TT 过目。这一刀只做可点击的阅读预览和这份方案。

不合并、不配 `options.maoxunxing.com`、不改 Firebase 生产配置、不加 Cloudflare、不做 Stripe。购买只跳亚马逊。

## 书目（以 Amazon 商品页为准，未改书名）

| | 中文（本预览在读的这一本） | 英文（只留入口） |
|---|---|---|
| 书名 | 期权大白话: 告别投机，建立你的第一套交易系统 | Options Trading Made Simple: Build Your First Options Trading System Without Speculation |
| 版本 | Traditional Chinese Edition | — |
| 作者 | Momo | Momo |
| ASIN | B0F6NSTGPQ | B0FQ32FWGM |
| 链接 | https://www.amazon.com/dp/B0F6NSTGPQ | https://www.amazon.com/dp/B0FQ32FWGM |
| 篇幅 / 出版 | 约 84 页，2025-04-28 | 商品页没有写进本预览 |

Amazon 商品页没有目录。仓库里没有正文。下面的章节全部是占位。

## 信息架构

仍是现在的 Hugo 站，双语路径，好让这个 PR 走现有的 Firebase Deploy Preview。

- 首页「也可以随便逛逛」下面一张次级卡，链到阅读预览。英雄区仍是「AI 全栈 · 独立开发者」。
- 中文目录：`/zh-cn/options-dabaihua/`
- 中文章节：`/zh-cn/options-dabaihua/01/` … `/08/`
- 英文只有一页：`/en/options-dabaihua/`。说明站内阅读是中文版，并链到英文版亚马逊。没有英文章节页。

8 个条目只为把目录、进度、上一章 / 下一章、免费 / 锁定走通。**不是本书章数，也不是官方目录。** 章名统一写成「第 N 章（占位，待正文）」。

这些页面 `noindex`，不进 sitemap，front matter 写了 `index: false`（Algolia 会跳过），并且 `build.list: never`，所以不会出现在首页最新文章里。

全站 `<base>` 指的是生产环境 permalink。阅读页不输出这颗 `<base>`，否则 Deploy Preview 上的样式、脚本和章节链接会被指回 `maoxunxing.com`，而生产上还没有这些文件。首页那张卡在点击时改写成当前域名，预览里点开会留在预览。

## 阅读 UI

- 封面用正式书名、Traditional Chinese Edition、作者、约 84 页、出版日期、ASIN。没有自绘封面，避免被看成商品图。
- 目录里每一行都有「免费预览」或「锁定」。两段之间有一句分界说明。
- 章节页是一条适合长时间阅读的版心（衬线、约 66 字宽、行高偏松），带章序进度（第 n / 8 章）和页内滚动进度。
- 上一章、目录、下一章。锁章的下一章 / 上一章会再标一次「锁定」。
- 目录会记住上次读到的章（浏览器本地），出现「继续阅读」。
- 免费章正文只有一句「此处待放入原稿。」没有模拟书稿。
- 锁章只渲染章名和购买引导，模板不输出正文。

## 免费 / 锁定怎么实现

分界写在 `data/optionsDabaihua.yaml` 的 `demoFreeThrough: 2`：第 1–2 章可打开，第 3 章起锁定。

这是预览机制演示。页面上写明：**此分界为预览机制演示，正式免费章待 TT 定。** 不是最终决定。TT 定了真实免费章之后，改这个数字，并换成真实章名。不要把现在的 2 当成产品决定。

锁定发生在构建时：`layouts/options-dabaihua/single.html` 在章号大于 `demoFreeThrough` 时不渲染 `.Content`。不是用 CSS 把正文藏起来。锁章的 markdown 本身也没有正文。

仓库是公开的。等真有原稿时，免费章可以进仓库；**锁定章的正文不能提交到这个公开仓库**，只靠模板不输出挡不住看源码的人。锁定正文应在构建时从私有来源注入，或锁章页面永远只有购买引导。

## Amazon CTA

- 中文目录和锁章的购买链接只用 `https://www.amazon.com/dp/B0F6NSTGPQ`，新窗口，`rel="noopener noreferrer"`。中文目录不放英文版 ASIN。
- 英文入口页 `/en/options-dabaihua/` 使用 `https://www.amazon.com/dp/B0FQ32FWGM`，同样新窗口。
- 没有站内支付，没有 Stripe，没有「全书免费读」。

按钮上同时写出完整 URL，方便核对 ASIN。

## 日后怎么挂 options.maoxunxing.com

本刀不改 `firebase.json`、`.firebaserc`，也不加域名。预览就住在主站语言路径上，Deploy Preview 能直接打开。

上线时仍用 Hugo + Firebase Hosting（项目 `blog-6a0bf`），不要为这件事新加 Cloudflare。

1. 在同一个 Firebase 项目里另开一个 Hosting site（不要改现在主站那个 site 的生产 redirects，直到决定真的切过去）。
2. 阅读页继续由这个仓库构建。推荐第二个 site 只用一份阅读用的 Hugo 配置，`baseURL` 设为 `https://options.maoxunxing.com/`，只发布这一节。主站那张卡改成链到子域。
3. 若希望子域尽快成为现在这条路径的别名，也可以让子域指向现成的 `/zh-cn/options-dabaihua/`。这样最快，但子域上会带着主站导航。正经读书站更适合第 2 步的独立站点。
4. DNS 在 `maoxunxing.com` 现在的托管商加 `options` 记录，目标用 Firebase 控制台给新 site 的值。不在本仓库写生产域名。
5. 上线前：换上原稿和 TT 定的免费章，去掉 `noindex`，再决定要不要动下面两个旧入口。

## 这次故意没改的旧入口

- 页脚「期权电子书」仍指向 `https://leanpub.com/optionsmadesimple`。
- 项目页「期权大白话」已经指向中文 ASIN `B0F6NSTGPQ`，那是购买，不是阅读预览。

首页只加了阅读预览这一张卡，避免变成书店，也避免一次改掉两条购买链接。TT 可以决定页脚要不要改去亚马逊或阅读站。

## 阻塞项

1. **没有正文。** 免费章只能显示「此处待放入原稿。」
2. **没有官方目录。** Amazon 商品页没有目录。现在的 8 章和「第 N 章（占位，待正文）」都是占位，不能当成真实章名或章数。
3. **免费章还没定。** 前 2 章免费、第 3 章起锁定，只为演示。正式分界等 TT。
4. 锁定章的正式正文不能进公开 git（见上）。
5. 页脚 Leanpub 链接和项目页亚马逊卡这次没动，上线前要一起定入口。

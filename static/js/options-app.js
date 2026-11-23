(function () {
  "use strict";

  var root = document.querySelector("[data-options-reader]");
  if (!root) return;

  var isEn = root.getAttribute("data-lang") === "en";
  var STORAGE_CHAPTER = "options-dabaihua-last-chapter";
  var STORAGE_TYPO = "options-dabaihua-typo";

  /* ---------- 1. Git LFS Local Fallback for Book & Chapter Diagrams ---------- */
  function fixLfsImages() {
    var imgs = document.querySelectorAll('img[src*="/images/options-dabaihua/"]');
    Array.prototype.forEach.call(imgs, function (img) {
      function swapToProd() {
        var raw = img.getAttribute("src") || "";
        if (raw.indexOf("/images/options-dabaihua/") === 0) {
          img.src = "https://maoxunxing.com" + raw;
        }
      }
      if (img.complete && img.naturalWidth === 0) {
        swapToProd();
      } else {
        img.addEventListener("error", swapToProd, { once: true });
        img.addEventListener("load", function () {
          if (img.naturalWidth === 0) swapToProd();
        });
      }
    });
  }
  fixLfsImages();

  /* ---------- 2. Reading Progress Persistence ---------- */
  var currentChapter = root.getAttribute("data-chapter");
  if (currentChapter) {
    try {
      localStorage.setItem(STORAGE_CHAPTER, currentChapter);
    } catch (e) {}
  }

  var resumeBanner = document.querySelector("[data-options-resume]");
  if (resumeBanner) {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_CHAPTER);
    } catch (e) {}
    var chNum = parseInt(saved, 10);
    var totalCh = parseInt(root.getAttribute("data-total") || "7", 10);
    if (chNum >= 1 && chNum <= totalCh) {
      var slug = String(chNum).padStart(2, "0");
      var base = root.getAttribute("data-base") || "/zh-cn/options-dabaihua/";
      var resumeLink = resumeBanner.querySelector("a");
      var resumeText = resumeBanner.querySelector("[data-options-resume-text]");
      if (resumeLink) {
        resumeLink.href = base + slug + "/";
      }
      if (resumeText) {
        resumeText.textContent = isEn
          ? "Last read: Chapter " + chNum + " of " + totalCh
          : "上次阅读进度：第 " + chNum + " / " + totalCh + " 章";
      }
      resumeBanner.hidden = false;
    }
  }

  /* ---------- 3. Scroll Progress Ribbon ---------- */
  var progressBar = document.querySelector("[data-scroll-progress]");
  if (progressBar) {
    var updateScroll = function () {
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      var pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0;
      progressBar.style.width = pct.toFixed(1) + "%";
    };
    document.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    updateScroll();
  }

  /* ---------- 4. Black-Scholes Options & Greeks Flight Simulator ---------- */
  var simSvg = document.getElementById("ob-svg");
  if (simSvg) {
    var sInput = document.getElementById("ob-s");
    var kInput = document.getElementById("ob-k");
    var tInput = document.getElementById("ob-t");
    var ivInput = document.getElementById("ob-iv");

    var sOut = document.getElementById("ob-s-val");
    var kOut = document.getElementById("ob-k-val");
    var tOut = document.getElementById("ob-t-val");
    var ivOut = document.getElementById("ob-iv-val");

    var kpiPrem = document.getElementById("ob-kpi-prem");
    var kpiBe = document.getElementById("ob-kpi-be");
    var kpiState = document.getElementById("ob-kpi-state");

    var gDelta = document.getElementById("ob-g-delta");
    var gDeltaBar = document.getElementById("ob-g-delta-bar");
    var gDeltaDesc = document.getElementById("ob-g-delta-desc");

    var gTheta = document.getElementById("ob-g-theta");
    var gThetaBar = document.getElementById("ob-g-theta-bar");
    var gThetaDesc = document.getElementById("ob-g-theta-desc");

    var gVega = document.getElementById("ob-g-vega");
    var gVegaBar = document.getElementById("ob-g-vega-bar");
    var gVegaDesc = document.getElementById("ob-g-vega-desc");

    var diagText = document.getElementById("ob-diag-text");
    var stratBtns = document.querySelectorAll("[data-ob-strat]");
    var presetBtns = document.querySelectorAll("[data-ob-preset]");

    var currentStrat = "long-call";
    var RISK_FREE = 0.045;

    var PRESETS = {
      "tsla-call": { strat: "long-call", s: 200, k: 200, t: 30, iv: 45 },
      "house-deposit": { strat: "long-call", s: 225, k: 200, t: 60, iv: 35 },
      "crash-insurance": { strat: "long-put", s: 200, k: 195, t: 45, iv: 50 },
      "landlord-put": { strat: "short-put", s: 205, k: 190, t: 30, iv: 40 },
      "zero-dte": { strat: "long-call", s: 194, k: 205, t: 1, iv: 85 }
    };

    function normPDF(x) {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }

    function normCDF(x) {
      var a1 = 0.254829592;
      var a2 = -0.284496736;
      var a3 = 1.421413741;
      var a4 = -1.453152027;
      var a5 = 1.061405429;
      var p = 0.3275911;
      var sign = x < 0 ? -1 : 1;
      var absX = Math.abs(x) / Math.sqrt(2);
      var t = 1.0 / (1.0 + p * absX);
      var y =
        1.0 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
          Math.exp(-absX * absX);
      return 0.5 * (1.0 + sign * y);
    }

    function blackScholes(S, K, Tdays, ivPct, isCall) {
      var T = Math.max(Tdays / 365, 0.0005);
      var sigma = Math.max(ivPct / 100, 0.01);
      var sqrtT = Math.sqrt(T);
      var d1 =
        (Math.log(S / K) + (RISK_FREE + 0.5 * sigma * sigma) * T) /
        (sigma * sqrtT);
      var d2 = d1 - sigma * sqrtT;
      var discount = Math.exp(-RISK_FREE * T);

      var price, delta, thetaAnnual;
      if (isCall) {
        price = S * normCDF(d1) - K * discount * normCDF(d2);
        delta = normCDF(d1);
        thetaAnnual =
          -(S * normPDF(d1) * sigma) / (2 * sqrtT) -
          RISK_FREE * K * discount * normCDF(d2);
      } else {
        price = K * discount * normCDF(-d2) - S * normCDF(-d1);
        delta = normCDF(d1) - 1;
        thetaAnnual =
          -(S * normPDF(d1) * sigma) / (2 * sqrtT) +
          RISK_FREE * K * discount * normCDF(-d2);
      }

      var thetaDay = thetaAnnual / 365;
      var vegaPct = (S * sqrtT * normPDF(d1)) / 100;

      return {
        price: Math.max(0.05, price),
        delta: delta,
        theta: thetaDay,
        vega: vegaPct
      };
    }

    function renderSimulator() {
      var S = parseFloat(sInput.value);
      var K = parseFloat(kInput.value);
      var T = parseFloat(tInput.value);
      var IV = parseFloat(ivInput.value);

      var isCall = currentStrat.indexOf("call") !== -1;
      var isLong = currentStrat.indexOf("long") !== -1;
      var sign = isLong ? 1 : -1;

      sOut.textContent = "$" + S;
      kOut.textContent = "$" + K;
      tOut.textContent = T + (isEn ? (T === 1 ? " day" : " days") : " 天");
      ivOut.textContent = IV + "%";

      var bs = blackScholes(S, K, T, IV, isCall);
      var prem = bs.price;
      var posDelta = bs.delta * sign;
      var posTheta = bs.theta * sign;
      var posVega = bs.vega * sign;

      var be = isCall ? K + prem : K - prem;
      kpiPrem.innerHTML =
        (isLong ? "-" : "+") +
        "$" +
        prem.toFixed(2) +
        " <small>(" +
        (isLong ? (isEn ? "Cost " : "成本 ") : (isEn ? "Credit " : "收租 ")) +
        "$" +
        Math.round(prem * 100).toLocaleString() +
        ")</small>";
      kpiBe.textContent = "$" + be.toFixed(2);

      // Moneyness state
      var diffPct = ((S - K) / K) * (isCall ? 1 : -1);
      var stateLabel = "";
      var stateCls = "ob-state-badge ";
      if (T <= 3 && diffPct < -0.01) {
        stateLabel = isEn ? "⚠️ 0DTE OTM Casino" : "⚠️ 末日虚值赌场";
        stateCls += "is-danger";
      } else if (Math.abs(diffPct) <= 0.025) {
        stateLabel = isEn ? "At-The-Money (ATM)" : "平值期权 (ATM)";
        stateCls += "is-atm";
      } else if (diffPct > 0.025) {
        stateLabel = isEn ? "In-The-Money (ITM)" : "实值期权 (ITM)";
        stateCls += "is-itm";
      } else {
        stateLabel = isEn ? "Out-of-The-Money (OTM)" : "虚值期权 (OTM)";
        stateCls += "is-otm";
      }
      kpiState.className = stateCls;
      kpiState.textContent = stateLabel;

      // Greeks updates
      var deltaStr = (posDelta >= 0 ? "+" : "") + posDelta.toFixed(2);
      gDelta.textContent = deltaStr;
      gDeltaBar.style.width = Math.min(100, Math.round(Math.abs(posDelta) * 100)) + "%";
      var itmProb = Math.round(Math.abs(bs.delta) * 100);
      gDeltaDesc.textContent = isEn
        ? "Stock +$1 → Position " + (posDelta >= 0 ? "+$" : "-$") + Math.abs(posDelta * 100).toFixed(0) + "/contract (~" + itmProb + "% ITM prob)"
        : "股价每涨 $1，单张合约约变动 " + (posDelta >= 0 ? "+$" : "-$") + Math.abs(posDelta * 100).toFixed(0) + "（到期实值率 ~" + itmProb + "%）";

      var thetaStr = (posTheta >= 0 ? "+$" : "-$") + Math.abs(posTheta).toFixed(2) + (isEn ? "/d" : "/天");
      gTheta.textContent = thetaStr;
      gThetaBar.style.width = Math.min(100, Math.round((Math.abs(posTheta) / 1.5) * 100)) + "%";
      gThetaDesc.textContent = isEn
        ? "Time decay: " + (posTheta >= 0 ? "+$" : "-$") + Math.abs(posTheta * 100).toFixed(0) + "/day per contract (" + (isLong ? "buyer pays time" : "seller collects rent") + ")"
        : "股价不动每过 1 天，单张合约自动 " + (posTheta >= 0 ? "+$" : "-$") + Math.abs(posTheta * 100).toFixed(0) + "（" + (isLong ? "买方烧时间油耗" : "卖方收时间租金") + "）";

      var vegaStr = (posVega >= 0 ? "+$" : "-$") + Math.abs(posVega).toFixed(2) + "/1%";
      gVega.textContent = vegaStr;
      gVegaBar.style.width = Math.min(100, Math.round((Math.abs(posVega) / 0.5) * 100)) + "%";
      gVegaDesc.textContent = isEn
        ? "IV +1% → Contract " + (posVega >= 0 ? "+$" : "-$") + Math.abs(posVega * 100).toFixed(0) + " (" + (isLong ? "long volatility" : "short volatility") + ")"
        : "隐含波动率 IV 每变动 +1%，单张合约 " + (posVega >= 0 ? "+$" : "-$") + Math.abs(posVega * 100).toFixed(0) + "（" + (isLong ? "做多波动率" : "做空波动率") + "）";

      // Plain-Language Diagnosis
      if (T <= 3 && isLong && diffPct < 0) {
        diagText.textContent = isEn
          ? "🎰 0DTE Casino Alert (Sec 1.5): With only " + T + " day(s) left and the option Out-of-The-Money, Theta burns $" + Math.abs(posTheta * 100).toFixed(0) + "/day. Unless the stock surges past $" + be.toFixed(1) + " immediately, this contract goes to zero."
          : "🎰 末日期权赌场警报（第 1.5 节）：仅剩 " + T + " 天到期且处于虚值状态，Theta 油耗高达每天 -$" + Math.abs(posTheta * 100).toFixed(0) + "/张！除非股价立刻暴拉突破 $" + be.toFixed(1) + "，否则权利金极易在几小时内归零。";
      } else if (currentStrat === "long-call") {
        diagText.textContent = isEn
          ? "🚀 Long Call (Sec 1.1 & 1.2): You paid $" + Math.round(prem * 100) + " deposit to control 100 shares at $" + K + ". Max loss is strictly capped at $" + Math.round(prem * 100) + ", while upside above $" + be.toFixed(1) + " is uncapped."
          : "🚀 买入看涨（第 1.1 & 1.2 节）：你花 $" + Math.round(prem * 100) + "“定金”锁定了以 $" + K + " 买入 100 股的权利。最大亏损锁死在 $" + Math.round(prem * 100) + "，只要到期涨破 $" + be.toFixed(1) + " 就进入加速盈利区。";
      } else if (currentStrat === "long-put") {
        diagText.textContent = isEn
          ? "🛡️ Long Put Insurance (Sec 1.4 & 4.5): You paid $" + Math.round(prem * 100) + " insurance premium to lock in a $" + K + " sell floor. If the market crashes below $" + be.toFixed(1) + ", this put explodes in value to protect your portfolio."
          : "🛡️ 买入看跌车险（第 1.4 & 4.5 节）：你支付 $" + Math.round(prem * 100) + " 保费锁定了以 $" + K + " 卖出的底线。若市场暴跌跌破 $" + be.toFixed(1) + "，这张保单将大幅升值对冲你的持仓下跌。";
      } else if (currentStrat === "short-put") {
        diagText.textContent = isEn
          ? "🏦 Short Put Rent Collector (Sec 3.2): You collect $" + Math.round(prem * 100) + " upfront and earn +$" + Math.abs(posTheta * 100).toFixed(0) + "/day in Theta decay. As long as the stock stays above $" + be.toFixed(1) + ", you win—or you buy the stock at a net cost of $" + be.toFixed(1) + "."
          : "🏦 卖出看跌清仓特卖员（第 3.2 节）：你先收 $" + Math.round(prem * 100) + " 权利金，每天躺赚 +$" + Math.abs(posTheta * 100).toFixed(0) + " 时间租金（Theta）。只要到期股价不跌破 $" + be.toFixed(1) + " 就稳赚；就算跌破也是按净成本 $" + be.toFixed(1) + " 打折接盘好股票。";
      } else {
        diagText.textContent = isEn
          ? "🏠 Short Call Landlord (Sec 3.3): You collect $" + Math.round(prem * 100) + " rent upfront (+Theta), capping profit at $" + Math.round(prem * 100) + ". Warning: Naked short calls carry unlimited upside risk if the stock squeezes above $" + be.toFixed(1) + " (always pair with stock as a Covered Call!)."
          : "🏠 卖出看涨收租（第 3.3 节）：你预先收租 $" + Math.round(prem * 100) + " 并享受每日正 Theta，但若股价暴涨突破 $" + be.toFixed(1) + "，裸卖看涨将面临无限逼空风险——务必持有正股做成“备兑看涨（Covered Call）”当稳健房东！";
      }

      // Draw SVG Payoff & T+0 Theoretical Curve
      drawChart(S, K, T, IV, isCall, isLong, prem, be);
    }

    function drawChart(S, K, T, IV, isCall, isLong, prem, be) {
      var W = 620;
      var H = 250;
      var padL = 54;
      var padR = 24;
      var padT = 22;
      var padB = 34;
      var plotW = W - padL - padR;
      var plotH = H - padT - padB;

      var minPrice = Math.max(50, Math.round(K * 0.65));
      var maxPrice = Math.round(K * 1.35);
      var steps = 56;

      var expPts = [];
      var nowPts = [];
      var sign = isLong ? 1 : -1;
      var maxAbsY = Math.max(prem * 100 * 2.4, 1500);

      for (var i = 0; i <= steps; i++) {
        var px = minPrice + ((maxPrice - minPrice) * i) / steps;
        var intrinsic = isCall ? Math.max(0, px - K) : Math.max(0, K - px);
        var expPnl = (intrinsic - prem) * sign * 100;
        var nowBs = blackScholes(px, K, T, IV, isCall);
        var nowPnl = (nowBs.price - prem) * sign * 100;
        expPts.push({ p: px, y: expPnl });
        nowPts.push({ p: px, y: nowPnl });
        if (Math.abs(expPnl) > maxAbsY) maxAbsY = Math.abs(expPnl);
      }

      maxAbsY = Math.min(Math.max(maxAbsY, 1200), 8000);

      function toX(price) {
        return padL + ((price - minPrice) / (maxPrice - minPrice)) * plotW;
      }

      function toY(pnl) {
        var clamped = Math.max(-maxAbsY, Math.min(maxAbsY, pnl));
        return padT + plotH / 2 - (clamped / maxAbsY) * (plotH / 2 - 10);
      }

      var zeroY = toY(0);
      var expPath = expPts
        .map(function (pt, idx) {
          return (idx === 0 ? "M" : "L") + toX(pt.p).toFixed(1) + "," + toY(pt.y).toFixed(1);
        })
        .join(" ");

      var nowPath = nowPts
        .map(function (pt, idx) {
          return (idx === 0 ? "M" : "L") + toX(pt.p).toFixed(1) + "," + toY(pt.y).toFixed(1);
        })
        .join(" ");

      var areaPath =
        expPath +
        " L" +
        toX(maxPrice).toFixed(1) +
        "," +
        zeroY.toFixed(1) +
        " L" +
        toX(minPrice).toFixed(1) +
        "," +
        zeroY.toFixed(1) +
        " Z";

      var xS = toX(Math.max(minPrice, Math.min(maxPrice, S)));
      var xK = toX(Math.max(minPrice, Math.min(maxPrice, K)));
      var xBE = toX(Math.max(minPrice, Math.min(maxPrice, be)));
      var curIntrinsic = isCall ? Math.max(0, S - K) : Math.max(0, K - S);
      var curExpPnl = (curIntrinsic - prem) * sign * 100;
      var ySExp = toY(curExpPnl);

      simSvg.innerHTML =
        "<defs>" +
        '<linearGradient id="ob-grad-area" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#34d399" stop-opacity="0.28"/>' +
        '<stop offset="50%" stop-color="#34d399" stop-opacity="0.03"/>' +
        '<stop offset="50%" stop-color="#fb7185" stop-opacity="0.03"/>' +
        '<stop offset="100%" stop-color="#fb7185" stop-opacity="0.26"/>' +
        "</linearGradient>" +
        "</defs>" +
        // Grid lines
        '<line x1="' + padL + '" y1="' + padT + '" x2="' + (W - padR) + '" y2="' + padT + '" stroke="rgba(255,255,255,0.06)" />' +
        '<line x1="' + padL + '" y1="' + (H - padB) + '" x2="' + (W - padR) + '" y2="' + (H - padB) + '" stroke="rgba(255,255,255,0.06)" />' +
        // Zero baseline
        '<line x1="' + padL + '" y1="' + zeroY.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + zeroY.toFixed(1) + '" stroke="rgba(255,255,255,0.25)" stroke-dasharray="4 4" />' +
        '<text x="' + (padL - 8) + '" y="' + (zeroY + 4).toFixed(1) + '" text-anchor="end" fill="#94a3b8" font-size="11" font-family="DM Mono, monospace">$0</text>' +
        '<text x="' + (padL - 8) + '" y="' + (padT + 10) + '" text-anchor="end" fill="#34d399" font-size="10.5" font-family="DM Mono, monospace">+$' + Math.round(maxAbsY) + "</text>" +
        '<text x="' + (padL - 8) + '" y="' + (H - padB - 2) + '" text-anchor="end" fill="#fb7185" font-size="10.5" font-family="DM Mono, monospace">-$' + Math.round(maxAbsY) + "</text>" +
        // Shaded area & curves
        '<path d="' + areaPath + '" fill="url(#ob-grad-area)" />' +
        '<path d="' + expPath + '" fill="none" stroke="#34d399" stroke-width="2.6" stroke-linecap="round" />' +
        '<path d="' + nowPath + '" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 4" />' +
        // Strike K vertical marker
        '<line x1="' + xK.toFixed(1) + '" y1="' + padT + '" x2="' + xK.toFixed(1) + '" y2="' + (H - padB) + '" stroke="rgba(148,163,184,0.35)" stroke-dasharray="2 3" />' +
        '<text x="' + xK.toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="DM Mono, monospace">K=$' + K + "</text>" +
        // Break-even dot
        '<circle cx="' + xBE.toFixed(1) + '" cy="' + zeroY.toFixed(1) + '" r="4.5" fill="#fbbf24" stroke="#0b0e17" stroke-width="2" />' +
        '<text x="' + xBE.toFixed(1) + '" y="' + (zeroY - 9).toFixed(1) + '" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="700" font-family="DM Mono, monospace">BE $' + be.toFixed(0) + "</text>" +
        // Current stock price S marker
        '<line x1="' + xS.toFixed(1) + '" y1="' + padT + '" x2="' + xS.toFixed(1) + '" y2="' + (H - padB) + '" stroke="rgba(129,140,248,0.65)" stroke-width="1.5" />' +
        '<circle cx="' + xS.toFixed(1) + '" cy="' + ySExp.toFixed(1) + '" r="5.5" fill="#818cf8" stroke="#ffffff" stroke-width="2" />' +
        '<text x="' + xS.toFixed(1) + '" y="' + (padT + 12) + '" text-anchor="middle" fill="#c7d2fe" font-size="11" font-weight="700" font-family="DM Mono, monospace">S=$' + S + "</text>";
    }

    Array.prototype.forEach.call(stratBtns, function (btn) {
      btn.addEventListener("click", function () {
        currentStrat = btn.getAttribute("data-ob-strat");
        Array.prototype.forEach.call(stratBtns, function (b) {
          b.classList.toggle("is-on", b === btn);
        });
        renderSimulator();
      });
    });

    Array.prototype.forEach.call(presetBtns, function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-ob-preset");
        var cfg = PRESETS[key];
        if (!cfg) return;
        currentStrat = cfg.strat;
        sInput.value = cfg.s;
        kInput.value = cfg.k;
        tInput.value = cfg.t;
        ivInput.value = cfg.iv;

        Array.prototype.forEach.call(presetBtns, function (b) {
          b.classList.toggle("is-on", b === btn);
        });
        Array.prototype.forEach.call(stratBtns, function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-ob-strat") === currentStrat);
        });
        renderSimulator();
      });
    });

    [sInput, kInput, tInput, ivInput].forEach(function (inp) {
      if (!inp) return;
      inp.addEventListener("input", renderSimulator);
    });

    renderSimulator();
  }

  /* ---------- 5. Curriculum Filter Tabs ---------- */
  var filterBtns = document.querySelectorAll("[data-ob-filter]");
  var chCards = document.querySelectorAll("[data-ob-ch]");
  if (filterBtns.length && chCards.length) {
    Array.prototype.forEach.call(filterBtns, function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-ob-filter");
        Array.prototype.forEach.call(filterBtns, function (b) {
          b.classList.toggle("is-on", b === btn);
        });
        Array.prototype.forEach.call(chCards, function (card) {
          var access = card.getAttribute("data-ob-access");
          card.hidden = mode !== "all" && access !== mode;
        });
      });
    });
  }

  /* ---------- 6. Copy ASIN Buttons ---------- */
  var copyBtns = document.querySelectorAll("[data-ob-copy]");
  Array.prototype.forEach.call(copyBtns, function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.getAttribute("data-ob-copy");
      var span = btn.querySelector("span");
      var orig = span ? span.textContent : "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).catch(function () {});
      }
      if (span) {
        span.textContent = isEn ? "Copied ✓" : "已复制 ✓";
        setTimeout(function () {
          span.textContent = orig;
        }, 1600);
      }
    });
  });

  /* ---------- 7. Chapter Reader Typography, Section Scroll-Spy & Lightbox ---------- */
  var readerPage = document.getElementById("ob-reader");
  if (readerPage) {
    // Load saved typography
    var typo = { font: "serif", size: "md" };
    try {
      var rawTypo = localStorage.getItem(STORAGE_TYPO);
      if (rawTypo) typo = JSON.parse(rawTypo);
    } catch (e) {}

    function applyTypo() {
      readerPage.setAttribute("data-font", typo.font || "serif");
      readerPage.setAttribute("data-size", typo.size || "md");
      Array.prototype.forEach.call(
        readerPage.querySelectorAll("[data-ob-font]"),
        function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-ob-font") === typo.font);
        }
      );
      Array.prototype.forEach.call(
        readerPage.querySelectorAll("[data-ob-size]"),
        function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-ob-size") === typo.size);
        }
      );
      try {
        localStorage.setItem(STORAGE_TYPO, JSON.stringify(typo));
      } catch (e) {}
    }

    Array.prototype.forEach.call(
      readerPage.querySelectorAll("[data-ob-font]"),
      function (btn) {
        btn.addEventListener("click", function () {
          typo.font = btn.getAttribute("data-ob-font");
          applyTypo();
        });
      }
    );

    Array.prototype.forEach.call(
      readerPage.querySelectorAll("[data-ob-size]"),
      function (btn) {
        btn.addEventListener("click", function () {
          typo.size = btn.getAttribute("data-ob-size");
          applyTypo();
        });
      }
    );
    applyTypo();

    // Auto-link sidebar in-chapter TOC to h2 elements inside #ob-prose
    var prose = document.getElementById("ob-prose");
    var subtoc = document.getElementById("ob-side-subtoc");
    if (prose && subtoc) {
      var h2s = Array.prototype.slice.call(prose.querySelectorAll("h2"));
      var items = Array.prototype.slice.call(subtoc.querySelectorAll("li"));
      var links = [];

      h2s.forEach(function (h, idx) {
        if (!h.id) h.id = "sec-" + (idx + 1);
        if (items[idx]) {
          var label = items[idx].textContent;
          items[idx].innerHTML =
            '<a href="#' + h.id + '">' + label + "</a>";
          links.push({ h: h, a: items[idx].querySelector("a") });
        }
      });

      if (links.length) {
        var spy = function () {
          var active = links[0];
          for (var i = 0; i < links.length; i++) {
            if (links[i].h.getBoundingClientRect().top <= 140) {
              active = links[i];
            }
          }
          links.forEach(function (item) {
            item.a.classList.toggle("is-active", item === active);
          });
        };
        document.addEventListener("scroll", spy, { passive: true });
        spy();
      }
    }

    // Figure click-to-zoom lightbox
    var lightbox = document.getElementById("ob-lightbox");
    var lbImg = document.getElementById("ob-lightbox-img");
    var lbCap = document.getElementById("ob-lightbox-cap");
    var lbClose = document.getElementById("ob-lightbox-close");

    if (prose && lightbox && lbImg) {
      Array.prototype.forEach.call(prose.querySelectorAll("img"), function (img) {
        img.addEventListener("click", function () {
          lbImg.src = img.currentSrc || img.src;
          lbImg.alt = img.alt || "";
          if (lbCap) lbCap.textContent = img.alt || "";
          lightbox.hidden = false;
        });
      });

      var closeLb = function () {
        lightbox.hidden = true;
      };
      if (lbClose) lbClose.addEventListener("click", closeLb);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLb();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !lightbox.hidden) closeLb();
      });
    }
  }
})();

/* HTML-in-Canvas for the Huang feature.
   Detection follows Chrome's documented check: set content="drawable"
   and read canvas.content. DOM mode is a normal document, never described
   as native. https://developer.chrome.com/blog/html-in-canvas */
(function () {
  "use strict";

  var root = document.getElementById("jh-root");
  if (!root || root.dataset.bound === "1") return;
  root.dataset.bound = "1";

  var statusEl = document.getElementById("jh-status");
  var canvas = document.getElementById("jh-canvas");
  var sheet = document.getElementById("jh-sheet");
  var viewport = document.getElementById("jh-viewport");
  var pauseBtn = document.getElementById("jh-pause");
  var scenes = Array.prototype.slice.call(
    sheet.querySelectorAll("[data-jh-plate]")
  );

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var forceDom = /(?:\?|&)render=dom(?:&|$)/.test(location.search);
  var nativeOn = false;
  var paused = false;
  var ctx = null;
  var scaleX = 1;
  var scaleY = 1;
  var positions = [];
  var animStart = 0;
  var animating = false;
  var lastCssW = -1;
  var sizeObserver = null;
  var widthObserver = null;

  var TEXT = {
    dom: "兼容阅读：这个浏览器没有把 HTML 画进画布的接口。正文是普通网页，不是原生绘制，也不是盖在画布上的一层。",
    forced:
      "兼容阅读：地址里指定了 render=dom，所以没有启用原生绘制。正文是普通网页。",
    native:
      "原生 HTML-in-Canvas：这些板块是画布的 drawable 子孙，由 drawElementImage() 画入画布。不是 DOM 覆盖层。",
    error: "原生绘制没有成功，已退回普通网页。正文仍全部可见。",
    partial:
      "画布接受 content=drawable，但没有 drawElementImage()。已保持普通网页，不把它称作原生。",
  };

  function setMode(mode, text) {
    root.dataset.renderMode = mode;
    if (statusEl) statusEl.textContent = text;
    if (pauseBtn) {
      var show = mode === "native" && !reduced.matches;
      pauseBtn.hidden = !show;
    }
  }

  function supportsHtmlInCanvas() {
    if (typeof document === "undefined") return false;
    var probe = document.createElement("canvas");
    probe.setAttribute("content", "drawable");
    var reflected = probe.content === "drawable";
    var canDraw =
      typeof CanvasRenderingContext2D !== "undefined" &&
      typeof CanvasRenderingContext2D.prototype.drawElementImage === "function";
    root.dataset.apiContent = reflected ? "drawable" : "no";
    root.dataset.apiDraw = canDraw ? "yes" : "no";
    return reflected && canDraw;
  }

  function cssColor(name, fallback) {
    var value = getComputedStyle(root).getPropertyValue(name).trim();
    return value || fallback;
  }

  function currentT() {
    if (paused || reduced.matches || !animating) return 1;
    var raw = Math.min(1, (performance.now() - animStart) / 900);
    return 1 - Math.pow(1 - raw, 3);
  }

  function relayout() {
    var cssW = viewport.clientWidth || root.clientWidth;
    if (cssW < 40) return;
    var plateW = Math.max(240, Math.floor(cssW - 36));
    var y = 12;
    var gap = 16;
    positions = [];
    scenes.forEach(function (el) {
      el.style.boxSizing = "border-box";
      el.style.width = plateW + "px";
      var h = el.offsetHeight || 0;
      positions.push({ el: el, y: y, h: h });
      y += h + gap;
    });
    canvas.style.height = Math.max(240, y + 8) + "px";
  }

  function drawThread(t) {
    var split = null;
    for (var i = 0; i < positions.length; i++) {
      if (positions[i].el.id === "scene-split") split = positions[i];
    }
    if (!split) return;
    var x = 14 * scaleX;
    var top = 18 * scaleY;
    var bottom = (canvas.height || 0) - 18 * scaleY;
    var mid = (split.y + split.h * 0.62) * scaleY;
    var gap = 48 * scaleY * t;
    var warm = cssColor("--warm", "#e4b56a");
    var cool = cssColor("--cool", "#9eb4c4");
    ctx.lineWidth = Math.max(1.5, scaleX);
    ctx.lineCap = "square";
    ctx.strokeStyle = warm;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, Math.max(top, mid - gap / 2));
    ctx.stroke();
    ctx.strokeStyle = cool;
    ctx.beginPath();
    ctx.moveTo(x, Math.min(bottom, mid + gap / 2));
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  function paint() {
    if (!nativeOn || !ctx) return;
    if (!canvas.width || !canvas.height) return;
    if (typeof ctx.reset === "function") ctx.reset();
    else ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = cssColor("--paper", "#14120f");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var t = currentT();
    drawThread(t);
    positions.forEach(function (p) {
      ctx.drawElementImage(p.el, 28 * scaleX, p.y * scaleY);
    });
    if (animating && t < 1 && typeof canvas.requestPaint === "function") {
      canvas.requestPaint();
    } else if (animating && t >= 1) {
      animating = false;
    }
  }

  function onPaint() {
    try {
      paint();
    } catch (err) {
      leaveNative();
    }
  }

  function syncBitmap(entry) {
    var cssW = entry ? entry.contentRect.width : canvas.clientWidth;
    var cssH = entry ? entry.contentRect.height : canvas.clientHeight;
    if (!cssW || !cssH) return;
    var dpr = window.devicePixelRatio || 1;
    var dpc = entry && entry.devicePixelContentBoxSize;
    var wFromDpr = Math.round(cssW * dpr);
    var hFromDpr = Math.round(cssH * dpr);
    var w = dpc && dpc[0] ? Math.round(dpc[0].inlineSize) : wFromDpr;
    var h = dpc && dpc[0] ? Math.round(dpc[0].blockSize) : hFromDpr;
    if (w < wFromDpr) w = wFromDpr;
    if (h < hFromDpr) h = hFromDpr;
    w = Math.max(1, w);
    h = Math.max(1, h);
    root.dataset.bitmapScale = cssW
      ? String(Math.round((w / cssW) * 100) / 100)
      : "";
    var resized = canvas.width !== w || canvas.height !== h;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    scaleX = canvas.width / cssW;
    scaleY = canvas.height / cssH;
    if (resized && typeof canvas.requestPaint === "function") {
      canvas.requestPaint();
    }
  }

  function restoreDom() {
    scenes.forEach(function (el) {
      el.removeAttribute("drawable");
      el.style.width = "";
      sheet.appendChild(el);
    });
    canvas.removeAttribute("content");
    canvas.hidden = true;
    canvas.style.height = "";
    nativeOn = false;
    animating = false;
    ctx = null;
  }

  function disconnect() {
    if (sizeObserver) sizeObserver.disconnect();
    if (widthObserver) widthObserver.disconnect();
    sizeObserver = null;
    widthObserver = null;
    canvas.removeEventListener("paint", onPaint);
    window.removeEventListener("pagehide", cleanup);
  }

  function leaveNative() {
    disconnect();
    restoreDom();
    setMode("error", TEXT.error);
  }

  function cleanup() {
    disconnect();
  }

  function verifyGeometry() {
    if (!nativeOn) return;
    var claim = document.getElementById("jh-claim");
    if (!claim) return;
    var rect = claim.getBoundingClientRect();
    var box = canvas.getBoundingClientRect();
    var inside =
      rect.width > 8 &&
      rect.height > 8 &&
      rect.left >= box.left - 4 &&
      rect.right <= box.right + 4 &&
      rect.top >= box.top - 4 &&
      rect.bottom <= box.bottom + 8;
    root.dataset.geometry = inside ? "match" : "miss";
    if (!inside) leaveNative();
  }

  function activate() {
    canvas.hidden = false;
    canvas.setAttribute("content", "drawable");
    if (canvas.content !== "drawable") {
      canvas.hidden = true;
      canvas.removeAttribute("content");
      setMode("dom", TEXT.dom);
      return;
    }
    scenes.forEach(function (el) {
      el.setAttribute("drawable", "");
      canvas.appendChild(el);
    });
    ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx || typeof ctx.drawElementImage !== "function") {
      restoreDom();
      setMode("dom", TEXT.partial);
      return;
    }
    nativeOn = true;
    relayout();
    if (!positions.length || !positions[0].h) {
      leaveNative();
      return;
    }
    canvas.addEventListener("paint", onPaint);
    var boxOption = {};
    if (
      typeof ResizeObserverEntry !== "undefined" &&
      "devicePixelContentBoxSize" in ResizeObserverEntry.prototype
    ) {
      boxOption = { box: "device-pixel-content-box" };
    }
    sizeObserver = new ResizeObserver(function (entries) {
      syncBitmap(entries[0]);
    });
    sizeObserver.observe(canvas, boxOption);
    widthObserver = new ResizeObserver(function () {
      var w = viewport.clientWidth;
      if (Math.abs(w - lastCssW) < 1) return;
      lastCssW = w;
      if (!nativeOn) return;
      relayout();
    });
    widthObserver.observe(viewport);
    lastCssW = viewport.clientWidth;
    syncBitmap(null);
    if (!reduced.matches) {
      animating = true;
      animStart = performance.now();
    }
    if (typeof canvas.requestPaint === "function") canvas.requestPaint();
    else onPaint();
    setMode("native", TEXT.native);
    window.addEventListener("pagehide", cleanup);
    requestAnimationFrame(function () {
      requestAnimationFrame(verifyGeometry);
    });
  }

  function boot() {
    var api = supportsHtmlInCanvas();
    if (forceDom || !api) {
      setMode(
        "dom",
        forceDom ? TEXT.forced : api ? TEXT.dom : canvasProbeMessage()
      );
      return;
    }
    try {
      activate();
    } catch (err) {
      leaveNative();
    }
  }

  function canvasProbeMessage() {
    if (
      root.dataset.apiContent === "drawable" &&
      root.dataset.apiDraw !== "yes"
    ) {
      return TEXT.partial;
    }
    return TEXT.dom;
  }

  var shareBtn = document.getElementById("jh-share");
  var shareNote = document.getElementById("jh-share-note");
  var shareInput = document.getElementById("jh-share-url");

  function note(text) {
    if (shareNote) shareNote.textContent = text;
  }

  if (shareBtn && shareInput) {
    shareBtn.addEventListener("click", function () {
      var url = (root.dataset.shareUrl || shareInput.textContent || "").trim();
      var title = document.title;
      var copied = function () {
        note("链接已复制");
      };
      var showManual = function () {
        shareInput.focus();
        var range = document.createRange();
        range.selectNodeContents(shareInput);
        var selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        note("无法写入剪贴板，地址已选中，请手动复制");
      };
      if (navigator.share) {
        navigator
          .share({ title: title, url: url })
          .then(function () {
            note("已打开系统分享");
          })
          .catch(function (err) {
            if (err && err.name === "AbortError") return;
            copyUrl(url, copied, showManual);
          });
        return;
      }
      copyUrl(url, copied, showManual);
    });
  }

  function copyUrl(url, ok, fail) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(ok)
        .catch(function () {
          legacyCopy(url, ok, fail);
        });
      return;
    }
    legacyCopy(url, ok, fail);
  }

  function legacyCopy(url, ok, fail) {
    var range = document.createRange();
    range.selectNodeContents(shareInput);
    var selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    var done = false;
    try {
      done = document.execCommand("copy");
    } catch (err) {
      done = false;
    }
    if (done) ok();
    else fail();
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      paused = !paused;
      pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      pauseBtn.textContent = paused ? "继续动效" : "暂停动效";
      animating = false;
      if (nativeOn && typeof canvas.requestPaint === "function") {
        canvas.requestPaint();
      } else if (nativeOn) {
        onPaint();
      }
    });
  }

  if (reduced.addEventListener) {
    reduced.addEventListener("change", function () {
      if (!nativeOn) return;
      animating = false;
      if (pauseBtn) pauseBtn.hidden = reduced.matches;
      if (typeof canvas.requestPaint === "function") canvas.requestPaint();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

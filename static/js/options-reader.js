(function () {
  var root = document.querySelector("[data-options-reader]");
  if (!root) return;

  var key = "options-dabaihua-last-chapter";
  var chapter = root.getAttribute("data-chapter");
  if (chapter) {
    try {
      localStorage.setItem(key, chapter);
    } catch (e) {}
  }

  var resume = document.querySelector("[data-options-resume]");
  if (resume) {
    var last = null;
    try {
      last = localStorage.getItem(key);
    } catch (e) {}
    var n = parseInt(last, 10);
    var total = parseInt(root.getAttribute("data-total") || "0", 10);
    if (n >= 1 && n <= total) {
      var link = resume.querySelector("a");
      var slug = String(n).padStart(2, "0");
      var base = root.getAttribute("data-base") || "";
      if (link) {
        link.href = base + slug + "/";
        link.textContent = "继续阅读";
      }
      resume.hidden = false;
    }
  }

  var bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  var tick = function () {
    var el = document.documentElement;
    var max = el.scrollHeight - el.clientHeight;
    var p = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;
    bar.style.width = p + "%";
  };

  document.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  tick();
})();

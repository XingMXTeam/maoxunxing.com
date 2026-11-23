(function () {
  "use strict";

  function init() {
    var root = document.getElementById("hx");
    if (!root) return;

    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer =
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    initReveal(root, reducedMotion);
    initCounters(root, reducedMotion);
    initRotator(root, reducedMotion);
    initTerminal(root, reducedMotion);
    if (finePointer && !reducedMotion) {
      initTilt(root);
      initSpotlight(root);
    }
    initWritingMore(root);
    initCopyEmail(root);
  }

  /* ------------------------------------------------------------
     1. Scroll Reveal
     ------------------------------------------------------------ */
  function initReveal(root, reducedMotion) {
    var els = Array.prototype.slice.call(
      root.querySelectorAll("[data-hx-reveal]")
    );
    if (!els.length) return;

    function show(el) {
      el.classList.add("is-in");
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var vh =
          window.innerHeight || document.documentElement.clientHeight || 900;
        entries.forEach(function (entry) {
          if (
            entry.isIntersecting ||
            entry.boundingClientRect.top < vh + 120
          ) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px 0px", threshold: 0.01 }
    );

    function scanVisible() {
      var currentVh =
        window.innerHeight || document.documentElement.clientHeight || 900;
      var remaining = 0;
      els.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < currentVh + 120) {
          show(el);
          observer.unobserve(el);
        } else {
          remaining += 1;
        }
      });
      if (remaining === 0) {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      }
    }

    var scrollRaf = 0;
    function onScroll() {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(function () {
        scrollRaf = 0;
        scanVisible();
      });
    }

    var vh = window.innerHeight || document.documentElement.clientHeight || 900;
    els.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh + 80) {
        show(el);
      } else {
        observer.observe(el);
      }
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(scanVisible, 1800);
  }

  /* ------------------------------------------------------------
     2. Animated KPI Counters
     ------------------------------------------------------------ */
  function initCounters(root, reducedMotion) {
    var counters = Array.prototype.slice.call(
      root.querySelectorAll("[data-hx-count]")
    );
    if (!counters.length) return;

    function runCounter(el) {
      if (el.dataset.hxCountDone === "1") return;
      el.dataset.hxCountDone = "1";
      var target = parseInt(el.getAttribute("data-hx-count"), 10);
      if (isNaN(target)) return;

      if (reducedMotion || typeof requestAnimationFrame !== "function") {
        el.textContent = String(target);
        return;
      }

      var duration = 900;
      var start = performance.now();

      function tick(now) {
        var progress = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = String(target);
        }
      }

      el.textContent = "0";
      requestAnimationFrame(tick);
    }

    var statsEl = root.querySelector(".hx-stats");
    if (!statsEl || reducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            counters.forEach(runCounter);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    obs.observe(statsEl);
  }

  /* ------------------------------------------------------------
     3. Hero Typewriter Word Cycler
     ------------------------------------------------------------ */
  function initRotator(root, reducedMotion) {
    var el = root.querySelector(".hx-rotator-word[data-words]");
    if (!el || reducedMotion) return;

    var words = (el.getAttribute("data-words") || "")
      .split("|")
      .map(function (w) {
        return w.trim();
      })
      .filter(Boolean);

    if (words.length < 2) return;

    var wordIdx = 0;
    var charIdx = words[0].length;
    var deleting = false;

    function step() {
      var current = words[wordIdx];

      if (!deleting) {
        if (charIdx < current.length) {
          charIdx += 1;
          el.textContent = current.slice(0, charIdx);
          setTimeout(step, 75);
        } else {
          deleting = true;
          setTimeout(step, 2000);
        }
      } else {
        if (charIdx > 0) {
          charIdx -= 1;
          el.textContent = current.slice(0, charIdx);
          setTimeout(step, 40);
        } else {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(step, 300);
        }
      }
    }

    setTimeout(function () {
      deleting = true;
      step();
    }, 2200);
  }

  /* ------------------------------------------------------------
     4. Live Agent Harness Terminal Replay
     ------------------------------------------------------------ */
  function initTerminal(root, reducedMotion) {
    var body = root.querySelector("[data-hx-term]");
    if (!body) return;

    var replayBtn = root.querySelector(".hx-term-replay");
    var lines = Array.prototype.slice.call(body.querySelectorAll(".hx-tl"));
    if (!lines.length) return;

    // Snapshot original innerHTML and typed strings once
    var snapshots = lines.map(function (line) {
      var typeEl = line.querySelector("[data-type]");
      return {
        el: line,
        html: line.innerHTML,
        typeText: typeEl ? typeEl.textContent : null,
      };
    });

    var timers = [];

    function clearTimers() {
      timers.forEach(function (id) {
        clearTimeout(id);
      });
      timers = [];
    }

    function later(fn, delay) {
      var id = setTimeout(fn, delay);
      timers.push(id);
      return id;
    }

    function showComplete() {
      clearTimers();
      snapshots.forEach(function (snap) {
        snap.el.innerHTML = snap.html;
        snap.el.classList.remove("is-pending");
        var bar = snap.el.querySelector(".hx-bar > span");
        if (bar) bar.style.width = "100%";
      });
    }

    if (reducedMotion) {
      showComplete();
      if (replayBtn) {
        replayBtn.addEventListener("click", showComplete);
      }
      return;
    }

    function playSequence() {
      clearTimers();

      // Reset all lines
      snapshots.forEach(function (snap) {
        snap.el.innerHTML = snap.html;
        snap.el.classList.add("is-pending");
        var typeEl = snap.el.querySelector("[data-type]");
        if (typeEl) typeEl.textContent = "";
        var bar = snap.el.querySelector(".hx-bar > span");
        if (bar) {
          bar.style.transition = "none";
          bar.style.width = "0%";
        }
        var em = snap.el.querySelector("em");
        if (em) em.style.opacity = "0";
      });

      var t = 180;

      snapshots.forEach(function (snap) {
        var line = snap.el;
        var typeText = snap.typeText;

        if (typeText !== null) {
          later(function () {
            line.classList.remove("is-pending");
          }, t);

          var charDelay = 18;
          for (var c = 1; c <= typeText.length; c++) {
            (function (len, at) {
              later(function () {
                var target = line.querySelector("[data-type]");
                if (target) target.textContent = typeText.slice(0, len);
              }, at);
            })(c, t + c * charDelay);
          }
          t += typeText.length * charDelay + 240;
        } else if (line.classList.contains("hx-tl-agent")) {
          (function (startAt) {
            later(function () {
              line.classList.remove("is-pending");
              var bar = line.querySelector(".hx-bar > span");
              var em = line.querySelector("em");
              if (bar) {
                // Force reflow so width transition animates from 0 -> 100%
                void bar.offsetWidth;
                bar.style.transition =
                  "width 0.52s cubic-bezier(0.22, 1, 0.36, 1)";
                bar.style.width = "100%";
              }
              later(function () {
                if (em) {
                  em.style.transition = "opacity 0.2s ease";
                  em.style.opacity = "1";
                }
              }, 380);
            }, startAt);
          })(t);
          t += 220;
        } else {
          (function (startAt) {
            later(function () {
              line.classList.remove("is-pending");
            }, startAt);
          })(t);
          t += line.classList.contains("hx-tl-final") ? 360 : 210;
        }
      });
    }

    // Start animation when hero terminal enters view (immediately on initial load)
    playSequence();

    if (replayBtn) {
      replayBtn.addEventListener("click", function (e) {
        e.preventDefault();
        playSequence();
      });
    }
  }

  /* ------------------------------------------------------------
     5. Subtle 3D Perspective Tilt
     ------------------------------------------------------------ */
  function initTilt(root) {
    var items = Array.prototype.slice.call(
      root.querySelectorAll("[data-hx-tilt]")
    );
    if (!items.length) return;

    items.forEach(function (el) {
      var raf = 0;

      el.addEventListener("pointermove", function (e) {
        if (raf) cancelAnimationFrame(raf);
        var clientX = e.clientX;
        var clientY = e.clientY;
        raf = requestAnimationFrame(function () {
          var rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          var px = (clientX - rect.left) / rect.width - 0.5;
          var py = (clientY - rect.top) / rect.height - 0.5;
          var rx = (-py * 8).toFixed(2);
          var ry = (px * 10).toFixed(2);
          el.style.transform =
            "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        });
      });

      el.addEventListener("pointerleave", function () {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------
     6. Cursor-Tracking Card Spotlight
     ------------------------------------------------------------ */
  function initSpotlight(root) {
    var cards = Array.prototype.slice.call(
      root.querySelectorAll("[data-hx-spot]")
    );
    if (!cards.length) return;

    cards.forEach(function (card) {
      var raf = 0;
      card.addEventListener("pointermove", function (e) {
        if (raf) cancelAnimationFrame(raf);
        var clientX = e.clientX;
        var clientY = e.clientY;
        raf = requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          var x = clientX - rect.left;
          var y = clientY - rect.top;
          card.style.setProperty("--mx", x.toFixed(1) + "px");
          card.style.setProperty("--my", y.toFixed(1) + "px");
        });
      });
    });
  }

  /* ------------------------------------------------------------
     7. Latest Writing Collapsible List (with /js/content-filter.js)
     ------------------------------------------------------------ */
  function initWritingMore(root) {
    var list = root.querySelector(".hx-posts");
    var wrap = root.querySelector(".hx-posts-more-wrap");
    var btn = root.querySelector(".hx-posts-more");
    if (!list || !wrap || !btn) return;

    var items = Array.prototype.slice.call(list.querySelectorAll(".hx-post"));
    var CAP = 12;
    if (items.length <= CAP) return;

    var isExpanded = false;
    var moreTpl = btn.getAttribute("data-more-label") || "Show {n} more";
    var lessLabel = btn.getAttribute("data-less-label") || "Show less";
    var extraCount = items.length - CAP;

    function getActiveFilter() {
      var activeBtn = root.querySelector(".hx-filter .filter-btn.active");
      return activeBtn ? activeBtn.getAttribute("data-filter") || "all" : "all";
    }

    function applyState() {
      var filter = getActiveFilter();

      if (filter !== "all") {
        items.forEach(function (item) {
          item.classList.remove("hx-post-collapsed");
        });
        wrap.hidden = true;
        return;
      }

      wrap.hidden = false;
      items.forEach(function (item, idx) {
        var shouldCollapse = !isExpanded && idx >= CAP;
        item.classList.toggle("hx-post-collapsed", shouldCollapse);
      });

      btn.textContent = isExpanded
        ? lessLabel
        : moreTpl.replace("{n}", String(extraCount));
      btn.setAttribute("aria-expanded", String(isExpanded));
    }

    btn.addEventListener("click", function () {
      isExpanded = !isExpanded;
      applyState();
    });

    var filterBtns = root.querySelectorAll(".hx-filter .filter-btn");
    Array.prototype.forEach.call(filterBtns, function (fBtn) {
      fBtn.addEventListener("click", function () {
        setTimeout(applyState, 0);
      });
    });

    applyState();
  }

  /* ------------------------------------------------------------
     8. One-Click Email Copy
     ------------------------------------------------------------ */
  function initCopyEmail(root) {
    var btns = Array.prototype.slice.call(
      root.querySelectorAll("[data-hx-copy]")
    );
    if (!btns.length) return;

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(ta);
    }

    btns.forEach(function (btn) {
      var timer = 0;
      var textEl = btn.querySelector(".hx-email-text");
      var iconEl = btn.querySelector("i");
      var value = btn.getAttribute("data-hx-copy") || "";
      var copiedLabel = btn.getAttribute("data-copied") || "Copied ✓";
      var origLabel = textEl ? textEl.textContent : value;
      var origIconClass = iconEl ? iconEl.className : "";

      btn.addEventListener("click", function () {
        if (!value) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).catch(function () {
            fallbackCopy(value);
          });
        } else {
          fallbackCopy(value);
        }

        btn.classList.add("is-copied");
        if (textEl) textEl.textContent = copiedLabel;
        if (iconEl) iconEl.className = "fas fa-check";

        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove("is-copied");
          if (textEl) textEl.textContent = origLabel;
          if (iconEl) iconEl.className = origIconClass;
        }, 2200);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

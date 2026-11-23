(function () {
  "use strict";

  function init() {
    var root = document.getElementById("ps");
    var dataEl = document.getElementById("ps-data");
    if (!root || !dataEl) return;

    var payload;
    try {
      payload = JSON.parse(dataEl.textContent);
    } catch (err) {
      return;
    }

    var pageLang = root.getAttribute("data-default-lang") === "en" ? "en" : "zh";
    var isPageZh = pageLang === "zh";
    var STORAGE_KEY = "momo_prompts_v1";

    var categories = payload.categories || [];
    var presets = payload.presets || [];
    var items = payload.items || [];

    var catMap = {};
    categories.forEach(function (c) {
      catMap[c.id] = c;
    });

    var itemMap = {};
    items.forEach(function (it) {
      itemMap[it.id] = it;
    });

    var persisted = loadState();
    var langPrefKey = "lang_" + pageLang;

    var state = {
      lang: persisted[langPrefKey] === "en" || persisted[langPrefKey] === "zh"
        ? persisted[langPrefKey]
        : pageLang,
      view: persisted.view === "grid" ? "grid" : "list",
      category: "all",
      query: "",
      activeId: items[0] ? items[0].id : "",
      favorites: Array.isArray(persisted.favorites)
        ? persisted.favorites.filter(function (id) { return !!itemMap[id]; })
        : [],
      recent: Array.isArray(persisted.recent)
        ? persisted.recent.filter(function (id) { return !!itemMap[id]; })
        : [],
      chain: Array.isArray(persisted.chain)
        ? persisted.chain.filter(function (id) { return !!itemMap[id]; })
        : [],
      varValues: persisted.varValues && typeof persisted.varValues === "object"
        ? persisted.varValues
        : {},
      dockPreviewOpen: false
    };

    // Cache DOM refs
    var searchInput = document.getElementById("ps-search");
    var searchClear = document.getElementById("ps-search-clear");
    var countBadge = document.getElementById("ps-count");
    var favCountEl = document.getElementById("ps-fav-count");
    var recentCountEl = document.getElementById("ps-recent-count");
    var workspace = document.getElementById("ps-workspace");
    var listEl = document.getElementById("ps-list");
    var emptyEl = document.getElementById("ps-empty");
    var resetBtn = document.getElementById("ps-reset-filters");
    var backdrop = document.getElementById("ps-backdrop");
    var inspector = document.getElementById("ps-inspector");

    var inspCat = document.getElementById("ps-insp-cat");
    var inspStage = document.getElementById("ps-insp-stage");
    var inspTitle = document.getElementById("ps-insp-title");
    var inspSummary = document.getElementById("ps-insp-summary");
    var inspTags = document.getElementById("ps-insp-tags");
    var inspVarsBox = document.getElementById("ps-vars");
    var inspVarsFields = document.getElementById("ps-vars-fields");
    var varsDefaultsBtn = document.getElementById("ps-vars-defaults");
    var varsClearBtn = document.getElementById("ps-vars-clear");
    var codeLangEl = document.getElementById("ps-code-lang");
    var codeCharsEl = document.getElementById("ps-code-chars");
    var inspCode = document.getElementById("ps-insp-code");
    var inspFavBtn = document.getElementById("ps-insp-fav");
    var inspShareBtn = document.getElementById("ps-insp-share");
    var inspCloseBtn = document.getElementById("ps-insp-close");
    var inspCopyBtn = document.getElementById("ps-insp-copy");
    var inspCopyAltBtn = document.getElementById("ps-insp-copy-alt");
    var inspChainBtn = document.getElementById("ps-insp-chain");

    var dock = document.getElementById("ps-dock");
    var dockPreview = document.getElementById("ps-dock-preview");
    var dockCode = document.getElementById("ps-dock-code");
    var dockChips = document.getElementById("ps-dock-chips");
    var dockTogglePreview = document.getElementById("ps-dock-toggle-preview");
    var dockPreviewClose = document.getElementById("ps-dock-preview-close");
    var dockClear = document.getElementById("ps-dock-clear");
    var dockCopy = document.getElementById("ps-dock-copy");
    var dockCopyLabel = document.getElementById("ps-dock-copy-label");
    var toastEl = document.getElementById("ps-toast");

    var rowsById = {};
    var rowEls = Array.prototype.slice.call(listEl.querySelectorAll(".ps-row"));
    rowEls.forEach(function (row) {
      rowsById[row.getAttribute("data-id")] = row;
    });

    // Precompute searchable haystack per item
    var searchIndex = {};
    items.forEach(function (it) {
      var parts = [
        it.id,
        it.stage || "",
        it.stage_en || "",
        it.title_zh || "",
        it.title_en || "",
        it.summary_zh || "",
        it.summary_en || "",
        (it.tags_zh || []).join(" "),
        (it.tags_en || []).join(" "),
        it.body_zh || "",
        it.body_en || ""
      ];
      searchIndex[it.id] = parts.join(" ").toLowerCase();
    });

    function loadState() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveState() {
      try {
        var stored = loadState();
        stored[langPrefKey] = state.lang;
        stored.view = state.view;
        stored.favorites = state.favorites;
        stored.recent = state.recent;
        stored.chain = state.chain;
        stored.varValues = state.varValues;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {}
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).catch(function () {
          return fallbackCopy(text);
        });
      }
      return fallbackCopy(text);
    }

    function fallbackCopy(text) {
      return new Promise(function (resolve) {
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
        resolve();
      });
    }

    var toastTimer = 0;
    function showToast(msg) {
      if (!toastEl) return;
      toastEl.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> <span>' + escapeHtml(msg) + "</span>";
      toastEl.hidden = false;
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        toastEl.hidden = true;
      }, 2100);
    }

    function getItemVars(item, lang) {
      var body = (lang === "en" ? item.body_en : item.body_zh) || "";
      var defined = Array.isArray(item.vars) ? item.vars : [];
      var list = [];
      var seen = {};

      defined.forEach(function (v) {
        var key = lang === "en" ? v.key_en : v.key_zh;
        if (!key || seen[key]) return;
        seen[key] = true;
        list.push({
          key: key,
          label: (lang === "en" ? v.label_en : v.label_zh) || key,
          def: (lang === "en" ? v.default_en : v.default_zh) || ""
        });
      });

      var re = /\{\{([^}]+)\}\}/g;
      var m;
      while ((m = re.exec(body)) !== null) {
        var k = m[1].trim();
        if (k && !seen[k]) {
          seen[k] = true;
          list.push({ key: k, label: k, def: "" });
        }
      }

      return list;
    }

    function getVarVal(itemId, key) {
      return (state.varValues[itemId] && state.varValues[itemId][key]) || "";
    }

    function setVarVal(itemId, key, val) {
      if (!state.varValues[itemId]) state.varValues[itemId] = {};
      if (val) {
        state.varValues[itemId][key] = val;
      } else {
        delete state.varValues[itemId][key];
      }
      saveState();
    }

    function resolvePromptText(item, lang) {
      var body = (lang === "en" ? item.body_en : item.body_zh) || "";
      return body.replace(/\{\{([^}]+)\}\}/g, function (full, rawKey) {
        var k = rawKey.trim();
        var v = getVarVal(item.id, k);
        return v ? v : full;
      });
    }

    function renderHighlightedCode(item, lang) {
      var body = (lang === "en" ? item.body_en : item.body_zh) || "";
      var out = "";
      var last = 0;
      var re = /\{\{([^}]+)\}\}/g;
      var m;

      while ((m = re.exec(body)) !== null) {
        out += escapeHtml(body.slice(last, m.index));
        var k = m[1].trim();
        var v = getVarVal(item.id, k);
        if (v) {
          out += '<mark class="ps-var-token is-filled">' + escapeHtml(v) + "</mark>";
        } else {
          out += '<mark class="ps-var-token">' + escapeHtml(m[0]) + "</mark>";
        }
        last = re.lastIndex;
      }
      out += escapeHtml(body.slice(last));
      return out;
    }

    function recordRecent(id) {
      state.recent = [id].concat(
        state.recent.filter(function (x) { return x !== id; })
      ).slice(0, 12);
      saveState();
      updateCounters();
    }

    function flashCopyFeedback(btn, labelText) {
      if (!btn) return;
      var span = btn.querySelector("span");
      var icon = btn.querySelector("i");
      if (!btn.dataset.origLabel && span) btn.dataset.origLabel = span.textContent;
      if (!btn.dataset.origIcon && icon) btn.dataset.origIcon = icon.className;

      btn.classList.add("is-copied");
      if (span) span.textContent = labelText || (isPageZh ? "已复制" : "Copied");
      if (icon) icon.className = "fas fa-check";

      if (btn._copyTimer) clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(function () {
        btn.classList.remove("is-copied");
        if (span && btn.dataset.origLabel) span.textContent = btn.dataset.origLabel;
        if (icon && btn.dataset.origIcon) icon.className = btn.dataset.origIcon;
      }, 1500);
    }

    function copyItem(id, langOverride, triggerBtn) {
      var item = itemMap[id];
      if (!item) return;
      var useLang = langOverride || state.lang;
      var text = resolvePromptText(item, useLang);
      var title = (useLang === "en" ? item.title_en : item.title_zh) || "";

      copyText(text).then(function () {
        recordRecent(id);
        flashCopyFeedback(triggerBtn, isPageZh ? "已复制 ✓" : "Copied ✓");
        showToast(
          (isPageZh ? "已复制：" : "Copied: ") + title +
            " (" + (useLang === "en" ? "EN" : "中文") + ")"
        );
      });
    }

    function updateCounters() {
      if (favCountEl) favCountEl.textContent = String(state.favorites.length);
      if (recentCountEl) recentCountEl.textContent = String(state.recent.length);
    }

    function syncRowLangAndButtons() {
      var lang = state.lang;
      items.forEach(function (item) {
        var row = rowsById[item.id];
        if (!row) return;
        var cat = catMap[item.category] || {};
        var titleEl = row.querySelector(".ps-row-title");
        var snipEl = row.querySelector(".ps-row-snippet");
        var catEl = row.querySelector(".ps-row-cat");
        var metaEl = row.querySelector(".ps-row-meta");
        var favBtn = row.querySelector("[data-ps-fav]");
        var chainBtn = row.querySelector("[data-ps-chain]");

        var title = lang === "en" ? item.title_en : item.title_zh;
        var body = (lang === "en" ? item.body_en : item.body_zh) || "";
        var snippet = body.replace(/\s+/g, " ").trim().slice(0, 140);
        if (titleEl) titleEl.textContent = title;
        if (snipEl) snipEl.textContent = snippet;
        if (catEl) catEl.textContent = lang === "en" ? cat.name_en : cat.name_zh;

        if (metaEl) {
          var tags = (lang === "en" ? item.tags_en : item.tags_zh) || [];
          var oldTags = metaEl.querySelectorAll(".ps-tag");
          Array.prototype.forEach.call(oldTags, function (el) { el.remove(); });
          tags.slice(0, 2).forEach(function (t) {
            var span = document.createElement("span");
            span.className = "ps-tag";
            span.textContent = t;
            metaEl.appendChild(span);
          });
        }

        if (favBtn) {
          var isFav = state.favorites.indexOf(item.id) !== -1;
          favBtn.classList.toggle("is-on", isFav);
          favBtn.setAttribute("aria-pressed", String(isFav));
        }

        if (chainBtn) {
          var inChain = state.chain.indexOf(item.id) !== -1;
          chainBtn.classList.toggle("is-on", inChain);
          chainBtn.setAttribute("aria-pressed", String(inChain));
          var ico = chainBtn.querySelector("i");
          if (ico) ico.className = inChain ? "fas fa-check" : "fas fa-plus";
        }
      });
    }

    function getVisibleIds() {
      var tokens = state.query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      var visible = [];
      items.forEach(function (item) {
        if (state.category === "fav") {
          if (state.favorites.indexOf(item.id) === -1) return;
        } else if (state.category === "recent") {
          if (state.recent.indexOf(item.id) === -1) return;
        } else if (state.category !== "all") {
          if (item.category !== state.category) return;
        }

        if (tokens.length > 0) {
          var hay = searchIndex[item.id] || "";
          for (var i = 0; i < tokens.length; i++) {
            if (hay.indexOf(tokens[i]) === -1) return;
          }
        }

        visible.push(item.id);
      });

      if (state.category === "recent") {
        visible.sort(function (a, b) {
          return state.recent.indexOf(a) - state.recent.indexOf(b);
        });
      }

      return visible;
    }

    function applyFilterAndOrder() {
      var visibleIds = getVisibleIds();
      var visibleSet = {};
      visibleIds.forEach(function (id) { visibleSet[id] = true; });

      // Reorder DOM rows cleanly (recent mode orders by recency; otherwise data order)
      var orderedIds = state.category === "recent"
        ? visibleIds.concat(items.map(function (it) { return it.id; }).filter(function (id) { return !visibleSet[id]; }))
        : items.map(function (it) { return it.id; });

      orderedIds.forEach(function (id) {
        var row = rowsById[id];
        if (!row) return;
        listEl.appendChild(row);
        row.hidden = !visibleSet[id];
      });

      if (countBadge) {
        countBadge.textContent = isPageZh
          ? "显示 " + visibleIds.length + " / " + items.length + " 条"
          : visibleIds.length + " / " + items.length + " prompts";
      }

      if (emptyEl) emptyEl.hidden = visibleIds.length > 0;

      if (visibleIds.length > 0 && visibleIds.indexOf(state.activeId) === -1) {
        setActiveItem(visibleIds[0], false);
      } else {
        updateActiveHighlight();
      }
    }

    function updateActiveHighlight() {
      rowEls.forEach(function (row) {
        var isActive = row.getAttribute("data-id") === state.activeId;
        row.classList.toggle("is-active", isActive);
        row.setAttribute("aria-selected", String(isActive));
      });
    }

    function renderInspector() {
      var item = itemMap[state.activeId] || items[0];
      if (!item) return;

      var lang = state.lang;
      var cat = catMap[item.category] || {};

      if (inspCat) {
        inspCat.style.setProperty("--c", cat.color || "#6366f1");
        inspCat.innerHTML =
          '<i class="fas ' + escapeHtml(cat.icon || "fa-bolt") + '" aria-hidden="true"></i>' +
          "<span>" + escapeHtml(lang === "en" ? cat.name_en : cat.name_zh) + "</span>";
      }
      if (inspStage) {
        inspStage.textContent = (lang === "en" ? (item.stage_en || item.stage) : item.stage) || "";
      }
      if (inspTitle) inspTitle.textContent = lang === "en" ? item.title_en : item.title_zh;
      if (inspSummary) inspSummary.textContent = lang === "en" ? item.summary_en : item.summary_zh;

      if (inspTags) {
        var tags = (lang === "en" ? item.tags_en : item.tags_zh) || [];
        inspTags.innerHTML = tags.map(function (t) {
          return '<span class="ps-tag">' + escapeHtml(t) + "</span>";
        }).join("");
      }

      // Per-inspector language buttons sync
      Array.prototype.forEach.call(
        root.querySelectorAll("[data-ps-insp-lang]"),
        function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-ps-insp-lang") === lang);
        }
      );

      // Variables
      var vars = getItemVars(item, lang);
      if (inspVarsBox && inspVarsFields) {
        if (vars.length === 0) {
          inspVarsBox.hidden = true;
          inspVarsFields.innerHTML = "";
        } else {
          inspVarsBox.hidden = false;
          inspVarsFields.innerHTML = "";
          vars.forEach(function (v) {
            var wrap = document.createElement("div");
            wrap.className = "ps-var-field";
            var label = document.createElement("label");
            var inputId = "ps-var-" + item.id + "-" + v.key.replace(/\s+/g, "_");
            label.setAttribute("for", inputId);
            label.textContent = "{{" + v.key + "}}";

            var input = document.createElement("input");
            input.type = "text";
            input.id = inputId;
            input.value = getVarVal(item.id, v.key);
            input.placeholder = v.def || v.label;

            input.addEventListener("input", function () {
              setVarVal(item.id, v.key, input.value);
              updateInspectorCode(item);
              updateDockPreview();
            });

            wrap.appendChild(label);
            wrap.appendChild(input);
            inspVarsFields.appendChild(wrap);
          });
        }
      }

      updateInspectorCode(item);

      var isFav = state.favorites.indexOf(item.id) !== -1;
      if (inspFavBtn) {
        inspFavBtn.classList.toggle("is-on", isFav);
        inspFavBtn.setAttribute("aria-pressed", String(isFav));
      }

      var inChain = state.chain.indexOf(item.id) !== -1;
      if (inspChainBtn) {
        inspChainBtn.classList.toggle("is-on", inChain);
        inspChainBtn.innerHTML =
          '<i class="fas ' + (inChain ? "fa-check" : "fa-plus") + '" aria-hidden="true"></i>' +
          "<span>" +
          (inChain
            ? (isPageZh ? "已在组合中" : "In Stack")
            : (isPageZh ? "加入组合" : "Add to stack")) +
          "</span>";
      }

      if (inspCopyAltBtn) {
        var altSpan = inspCopyAltBtn.querySelector("span");
        if (altSpan) {
          altSpan.textContent = lang === "zh"
            ? (isPageZh ? "复制英文版" : "Copy English")
            : (isPageZh ? "复制中文版" : "Copy Chinese");
        }
      }

      if (codeLangEl) {
        codeLangEl.textContent = lang === "en" ? "PROMPT · EN" : "PROMPT · 中文";
      }
    }

    function updateInspectorCode(item) {
      var lang = state.lang;
      if (inspCode) {
        inspCode.innerHTML = renderHighlightedCode(item, lang);
      }
      if (codeCharsEl) {
        var resolved = resolvePromptText(item, lang);
        codeCharsEl.textContent = resolved.length + (isPageZh ? " 字" : " chars");
      }
    }

    function setActiveItem(id, openDrawerIfNeeded) {
      if (!itemMap[id]) return;
      state.activeId = id;
      updateActiveHighlight();
      renderInspector();

      if (
        openDrawerIfNeeded &&
        (window.innerWidth <= 1080 || state.view === "grid")
      ) {
        openDrawer();
      }
    }

    function openDrawer() {
      workspace.classList.add("is-drawer-open");
      if (backdrop) backdrop.hidden = false;
    }

    function closeDrawer() {
      workspace.classList.remove("is-drawer-open");
      if (backdrop) backdrop.hidden = true;
    }

    function isDrawerMode() {
      return window.innerWidth <= 1080 || state.view === "grid";
    }

    function setLang(newLang) {
      if (newLang !== "zh" && newLang !== "en") return;
      state.lang = newLang;
      saveState();

      Array.prototype.forEach.call(
        root.querySelectorAll("[data-ps-lang]"),
        function (btn) {
          btn.classList.toggle("is-on", btn.getAttribute("data-ps-lang") === newLang);
        }
      );

      syncRowLangAndButtons();
      renderInspector();
      renderDock();
    }

    function setView(newView) {
      if (newView !== "list" && newView !== "grid") return;
      state.view = newView;
      saveState();
      workspace.setAttribute("data-view", newView);
      if (newView === "list" && window.innerWidth > 1080) {
        closeDrawer();
      }
      Array.prototype.forEach.call(
        root.querySelectorAll("[data-ps-view]"),
        function (btn) {
          btn.classList.toggle("is-on", btn.getAttribute("data-ps-view") === newView);
        }
      );
    }

    function setCategory(catId) {
      state.category = catId;
      Array.prototype.forEach.call(
        root.querySelectorAll("[data-ps-cat]"),
        function (btn) {
          var on = btn.getAttribute("data-ps-cat") === catId;
          btn.classList.toggle("is-on", on);
          btn.setAttribute("aria-selected", String(on));
        }
      );
      applyFilterAndOrder();
    }

    function toggleFavorite(id) {
      var idx = state.favorites.indexOf(id);
      if (idx === -1) {
        state.favorites.push(id);
        showToast(isPageZh ? "已加入收藏 ★" : "Added to Starred ★");
      } else {
        state.favorites.splice(idx, 1);
      }
      saveState();
      updateCounters();
      syncRowLangAndButtons();
      if (state.activeId === id) renderInspector();
      if (state.category === "fav") applyFilterAndOrder();
    }

    function toggleChain(id) {
      var idx = state.chain.indexOf(id);
      if (idx === -1) {
        state.chain.push(id);
        var item = itemMap[id];
        var title = item ? (state.lang === "en" ? item.title_en : item.title_zh) : "";
        showToast((isPageZh ? "已加入组合：" : "Added to stack: ") + title);
      } else {
        state.chain.splice(idx, 1);
      }
      saveState();
      syncRowLangAndButtons();
      if (state.activeId === id) renderInspector();
      renderDock();
    }

    function loadPreset(presetId) {
      var found = null;
      presets.forEach(function (p) {
        if (p.id === presetId) found = p;
      });
      if (!found) return;
      state.chain = found.ids.filter(function (id) { return !!itemMap[id]; });
      state.dockPreviewOpen = false;
      saveState();
      syncRowLangAndButtons();
      renderInspector();
      renderDock();
      showToast(
        (isPageZh ? "已装填组合：" : "Loaded stack: ") +
          (state.lang === "en" ? found.name_en : found.name_zh)
      );
    }

    function buildCombinedText() {
      return state.chain.map(function (id, idx) {
        var item = itemMap[id];
        if (!item) return "";
        var title = state.lang === "en" ? item.title_en : item.title_zh;
        return "## " + (idx + 1) + ". " + title + "\n" + resolvePromptText(item, state.lang);
      }).filter(Boolean).join("\n\n---\n\n");
    }

    function updateDockPreview() {
      if (!dockCode || !state.dockPreviewOpen) return;
      dockCode.textContent = buildCombinedText();
    }

    function renderDock() {
      if (!dock || !dockChips) return;
      if (state.chain.length === 0) {
        dock.hidden = true;
        state.dockPreviewOpen = false;
        if (dockPreview) dockPreview.hidden = true;
        return;
      }

      dock.hidden = false;
      dockChips.innerHTML = "";
      state.chain.forEach(function (id, idx) {
        var item = itemMap[id];
        if (!item) return;
        var chip = document.createElement("div");
        chip.className = "ps-dock-chip";

        var num = document.createElement("b");
        num.textContent = String(idx + 1);

        var name = document.createElement("span");
        name.textContent = state.lang === "en" ? item.title_en : item.title_zh;
        name.style.cursor = "pointer";
        name.addEventListener("click", function () {
          setActiveItem(id, true);
        });

        var rm = document.createElement("button");
        rm.type = "button";
        rm.setAttribute("aria-label", isPageZh ? "移除" : "Remove");
        rm.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        rm.addEventListener("click", function () {
          toggleChain(id);
        });

        chip.appendChild(num);
        chip.appendChild(name);
        chip.appendChild(rm);
        dockChips.appendChild(chip);
      });

      if (dockCopyLabel) {
        dockCopyLabel.textContent = isPageZh
          ? "复制组合 (" + state.chain.length + " 条)"
          : "Copy Stack (" + state.chain.length + ")";
      }

      if (dockPreview) {
        dockPreview.hidden = !state.dockPreviewOpen;
        updateDockPreview();
      }
    }

    // Event Wiring
    rowEls.forEach(function (row) {
      var id = row.getAttribute("data-id");
      row.addEventListener("click", function (e) {
        if (e.target.closest("button")) return;
        setActiveItem(id, true);
      });

      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && document.activeElement === row) {
          e.preventDefault();
          setActiveItem(id, false);
          copyItem(id, state.lang, row.querySelector("[data-ps-copy]"));
        }
      });
    });

    listEl.addEventListener("click", function (e) {
      var copyBtn = e.target.closest("[data-ps-copy]");
      if (copyBtn) {
        e.stopPropagation();
        var cid = copyBtn.getAttribute("data-ps-copy");
        setActiveItem(cid, false);
        copyItem(cid, state.lang, copyBtn);
        return;
      }

      var favBtn = e.target.closest("[data-ps-fav]");
      if (favBtn) {
        e.stopPropagation();
        toggleFavorite(favBtn.getAttribute("data-ps-fav"));
        return;
      }

      var chainBtn = e.target.closest("[data-ps-chain]");
      if (chainBtn) {
        e.stopPropagation();
        toggleChain(chainBtn.getAttribute("data-ps-chain"));
        return;
      }

      var inspectBtn = e.target.closest("[data-ps-inspect]");
      if (inspectBtn) {
        e.stopPropagation();
        setActiveItem(inspectBtn.getAttribute("data-ps-inspect"), true);
      }
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value;
        if (searchClear) searchClear.hidden = state.query.length === 0;
        applyFilterAndOrder();
      });
    }

    if (searchClear) {
      searchClear.addEventListener("click", function () {
        state.query = "";
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        searchClear.hidden = true;
        applyFilterAndOrder();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.query = "";
        if (searchInput) searchInput.value = "";
        if (searchClear) searchClear.hidden = true;
        setCategory("all");
      });
    }

    Array.prototype.forEach.call(root.querySelectorAll("[data-ps-lang]"), function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-ps-lang"));
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-ps-insp-lang]"), function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-ps-insp-lang"));
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-ps-view]"), function (btn) {
      btn.addEventListener("click", function () {
        setView(btn.getAttribute("data-ps-view"));
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-ps-cat]"), function (btn) {
      btn.addEventListener("click", function () {
        setCategory(btn.getAttribute("data-ps-cat"));
      });
    });

    Array.prototype.forEach.call(root.querySelectorAll("[data-ps-preset]"), function (btn) {
      btn.addEventListener("click", function () {
        loadPreset(btn.getAttribute("data-ps-preset"));
      });
    });

    if (inspFavBtn) {
      inspFavBtn.addEventListener("click", function () {
        toggleFavorite(state.activeId);
      });
    }

    if (inspChainBtn) {
      inspChainBtn.addEventListener("click", function () {
        toggleChain(state.activeId);
      });
    }

    if (inspShareBtn) {
      inspShareBtn.addEventListener("click", function () {
        var url = location.origin + location.pathname + "#p=" + encodeURIComponent(state.activeId);
        copyText(url).then(function () {
          showToast(isPageZh ? "已复制本条 Prompt 分享链接" : "Copied deep link");
        });
      });
    }

    if (inspCopyBtn) {
      inspCopyBtn.addEventListener("click", function () {
        copyItem(state.activeId, state.lang, inspCopyBtn);
      });
    }

    if (inspCopyAltBtn) {
      inspCopyAltBtn.addEventListener("click", function () {
        var altLang = state.lang === "zh" ? "en" : "zh";
        copyItem(state.activeId, altLang, inspCopyAltBtn);
      });
    }

    if (varsDefaultsBtn) {
      varsDefaultsBtn.addEventListener("click", function () {
        var item = itemMap[state.activeId];
        if (!item) return;
        var vars = getItemVars(item, state.lang);
        vars.forEach(function (v) {
          if (v.def) setVarVal(item.id, v.key, v.def);
        });
        renderInspector();
        updateDockPreview();
      });
    }

    if (varsClearBtn) {
      varsClearBtn.addEventListener("click", function () {
        if (state.varValues[state.activeId]) {
          delete state.varValues[state.activeId];
          saveState();
        }
        renderInspector();
        updateDockPreview();
      });
    }

    if (inspCloseBtn) inspCloseBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    if (dockTogglePreview) {
      dockTogglePreview.addEventListener("click", function () {
        state.dockPreviewOpen = !state.dockPreviewOpen;
        renderDock();
      });
    }

    if (dockPreviewClose) {
      dockPreviewClose.addEventListener("click", function () {
        state.dockPreviewOpen = false;
        renderDock();
      });
    }

    if (dockClear) {
      dockClear.addEventListener("click", function () {
        state.chain = [];
        state.dockPreviewOpen = false;
        saveState();
        syncRowLangAndButtons();
        renderInspector();
        renderDock();
      });
    }

    if (dockCopy) {
      dockCopy.addEventListener("click", function () {
        var combined = buildCombinedText();
        if (!combined) return;
        copyText(combined).then(function () {
          flashCopyFeedback(dockCopy, isPageZh ? "已复制组合 ✓" : "Copied Stack ✓");
          showToast(
            isPageZh
              ? "已复制 " + state.chain.length + " 条组合 Prompt"
              : "Copied " + state.chain.length + " stacked prompts"
          );
        });
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", function (e) {
      var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      var typing = tag === "input" || tag === "textarea" || tag === "select";

      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (searchInput) searchInput.focus();
        return;
      }

      if (e.key === "Escape") {
        if (workspace.classList.contains("is-drawer-open")) {
          closeDrawer();
        } else if (state.dockPreviewOpen) {
          state.dockPreviewOpen = false;
          renderDock();
        } else if (state.query) {
          state.query = "";
          if (searchInput) searchInput.value = "";
          if (searchClear) searchClear.hidden = true;
          applyFilterAndOrder();
        }
        return;
      }

      if (typing) return;

      if ((e.key === "e" || e.key === "E") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setLang(state.lang === "zh" ? "en" : "zh");
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        var vis = getVisibleIds();
        if (!vis.length) return;
        e.preventDefault();
        var cur = vis.indexOf(state.activeId);
        var next = e.key === "ArrowDown"
          ? vis[(cur + 1) % vis.length]
          : vis[(cur - 1 + vis.length) % vis.length];
        setActiveItem(next, false);
        var targetRow = rowsById[next];
        if (targetRow && targetRow.scrollIntoView) {
          targetRow.scrollIntoView({ block: "nearest" });
        }
        return;
      }

      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && tag !== "button" && tag !== "a") {
        if (state.activeId && itemMap[state.activeId]) {
          e.preventDefault();
          copyItem(state.activeId, state.lang, inspCopyBtn);
        }
      }
    });

    // Cursor spotlight for grid cards (fine pointer only)
    var finePointer =
      window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (finePointer && !reducedMotion) {
      rowEls.forEach(function (card) {
        var raf = 0;
        card.addEventListener("pointermove", function (e) {
          if (state.view !== "grid") return;
          if (raf) cancelAnimationFrame(raf);
          var cx = e.clientX;
          var cy = e.clientY;
          raf = requestAnimationFrame(function () {
            var rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", (cx - rect.left).toFixed(1) + "px");
            card.style.setProperty("--my", (cy - rect.top).toFixed(1) + "px");
          });
        });
      });
    }

    // Handle deep link (#p=<id>)
    function applyHash() {
      var hash = location.hash || "";
      if (hash.indexOf("#p=") === 0) {
        var targetId = decodeURIComponent(hash.slice(3));
        if (itemMap[targetId]) {
          setCategory("all");
          setActiveItem(targetId, isDrawerMode());
          var row = rowsById[targetId];
          if (row && row.scrollIntoView) {
            setTimeout(function () {
              row.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
            }, 80);
          }
        }
      }
    }

    window.addEventListener("hashchange", applyHash);

    // Initial Hydration
    setView(state.view);
    setLang(state.lang);
    updateCounters();
    applyFilterAndOrder();
    renderDock();
    applyHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

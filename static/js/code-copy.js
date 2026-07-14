(function () {
  "use strict";

  var isChinese =
    document.documentElement.lang.toLowerCase().indexOf("zh") === 0;
  var labels = isChinese
    ? { copy: "复制代码", copied: "已复制", failed: "复制失败" }
    : { copy: "Copy code", copied: "Copied", failed: "Copy failed" };

  function copyWithFallback(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (!document.execCommand("copy")) {
          throw new Error("Copy command was rejected");
        }
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  function setButtonState(button, state) {
    var label = labels[state];
    button.dataset.state = state;
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.querySelector("span").textContent = label;

    window.clearTimeout(button._copyResetTimer);
    if (state !== "copy") {
      button._copyResetTimer = window.setTimeout(function () {
        setButtonState(button, "copy");
      }, 1800);
    }
  }

  function createButton(pre) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.innerHTML =
      '<svg class="code-copy-icon code-copy-icon--copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path></svg>' +
      '<svg class="code-copy-icon code-copy-icon--success" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg>' +
      "<span></span>";
    setButtonState(button, "copy");

    button.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = (code || pre).textContent.replace(/\n$/, "");

      copyWithFallback(text).then(
        function () {
          setButtonState(button, "copied");
        },
        function () {
          setButtonState(button, "failed");
        }
      );
    });

    return button;
  }

  function enhanceCodeBlocks() {
    document.querySelectorAll(".content article pre").forEach(function (pre) {
      if (
        pre.dataset.copyEnhanced === "true" ||
        pre.classList.contains("mermaid") ||
        pre.querySelector("code.language-mermaid")
      ) {
        return;
      }

      var highlight = pre.closest(".highlight");
      var host = highlight;

      if (!host) {
        host = document.createElement("div");
        host.className = "code-block-shell";
        pre.parentNode.insertBefore(host, pre);
        host.appendChild(pre);
      }

      if (!host.querySelector(":scope > .code-copy-button")) {
        host.appendChild(createButton(pre));
      }
      host.classList.add("has-code-copy");
      pre.dataset.copyEnhanced = "true";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceCodeBlocks);
  } else {
    enhanceCodeBlocks();
  }
})();

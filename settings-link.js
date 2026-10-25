// ===== Code Master: settings-link.js =====
// Har page par ek floating ⚙️ Settings button lagata hai
(function () {
  "use strict";
  // Back dabane par browser purani page memory se dikha deta hai.
  // Agar Settings mein theme/language/naam badla ho, to page apne aap reload ho.
  function cmSnap() {
    try {
      return [
        localStorage.getItem("cm_theme"),
        localStorage.getItem("cm_ai_language"),
        localStorage.getItem("cm_user_name")
      ].join("|");
    } catch (e) { return ""; }
  }
  var cmSnapAtLeave = cmSnap();
  window.addEventListener("pagehide", function () { cmSnapAtLeave = cmSnap(); });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && cmSnap() !== cmSnapAtLeave) location.reload();
  });

    // AI ke andar ki duplicate settings chhupao (delete nahi, sirf hide)
  var hideStyle = document.createElement("style");
  hideStyle.textContent =
    "#cm-settings-btn, #cm-settings-overlay { display: none !important; }" +
    ".cma-header-actions select[title='Language'] { display: none !important; }";
  document.head.appendChild(hideStyle);

  // Settings page par button ki zaroorat nahi
  var page = location.pathname.split("/").pop();
  if (page === "settings.html") return;
  if (document.getElementById("cm-settings-fab")) return;

  var a = document.createElement("a");
  a.id = "cm-settings-fab";
  a.href = "settings.html";
  a.title = "Settings";
  a.setAttribute("aria-label", "Settings");
  a.textContent = "⚙️";
  a.style.cssText =
    "position:fixed;left:16px;bottom:16px;width:48px;height:48px;" +
    "border-radius:50%;display:flex;align-items:center;justify-content:center;" +
    "font-size:22px;text-decoration:none;background:#1e1e2e;color:#fff;" +
    "box-shadow:0 4px 12px rgba(0,0,0,.35);z-index:2147483647;";
  document.body.appendChild(a);

  // Dusre tab mein language badli to ye tab bhi turant update ho jaye
  window.addEventListener("storage", function (e) {
    if (e.key === "cm_ai_language" && e.newValue) {
      if (window.CMLang && typeof window.CMLang.setLang === "function") {
        window.CMLang.setLang(e.newValue);
      } else {
        location.reload();
      }
    }
  });
})();
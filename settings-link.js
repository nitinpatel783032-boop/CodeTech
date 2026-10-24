// ===== Code Master: settings-link.js =====
// Har page par ek floating ⚙️ Settings button lagata hai
(function () {
  "use strict";

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
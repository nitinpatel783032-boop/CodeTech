// ============================================
// Code Master AI - Chat Widget Logic
// Works in two modes: "bubble" (floating) and "fullpage"
// ============================================

// 👉 IMPORTANT: replace this with YOUR real Flask backend URL
// e.g. "https://code-master-ai-backend.onrender.com/api/chat"
const CMA_BACKEND_URL = "https://code-master-ai-backend.onrender.com/api/chat";

function initCodeMasterAI(mode = "bubble", mountSelector = null) {
  let conversation = [];

  const windowEl = document.createElement("div");
  windowEl.className = "cma-window" + (mode === "fullpage" ? " cma-fullpage" : "");
  windowEl.innerHTML = `
    <div class="cma-header">
      <span>🤖 Code Master AI</span>
      ${mode === "bubble" ? '<button class="cma-close-btn">&times;</button>' : ""}
    </div>
    <div class="cma-messages"></div>
    <div class="cma-typing" style="display:none;">Code Master AI is typing...</div>
    <div class="cma-input-row">
      <textarea class="cma-input" rows="1" placeholder="Ask me about HTML, CSS, JS, React..."></textarea>
      <button class="cma-send-btn">Send</button>
    </div>
  `;

  const messagesEl = windowEl.querySelector(".cma-messages");
  const inputEl = windowEl.querySelector(".cma-input");
  const sendBtn = windowEl.querySelector(".cma-send-btn");
  const typingEl = windowEl.querySelector(".cma-typing");

  if (mode === "bubble") {
    document.body.appendChild(windowEl);

    const bubbleBtn = document.createElement("button");
    bubbleBtn.className = "cma-bubble-btn";
    bubbleBtn.innerHTML = "💬";
    document.body.appendChild(bubbleBtn);

    bubbleBtn.addEventListener("click", () => {
      windowEl.classList.toggle("cma-open");
    });
    windowEl.querySelector(".cma-close-btn").addEventListener("click", () => {
      windowEl.classList.remove("cma-open");
    });
  } else {
    const mountPoint = document.querySelector(mountSelector);
    if (mountPoint) mountPoint.appendChild(windowEl);
  }

  addMessage(
    "assistant",
    "Yo! 👋 Main Code Master AI hoon, tumhara coding buddy. HTML, CSS, JS, React, Node.js, Git, ya Python — kuch bhi pucho, chalo shuru karte hain! 🔥"
  );

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatMessage(text) {
    let escaped = escapeHtml(text);

    escaped = escaped.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\n/g, "<br>");

    return escaped;
  }

  function addMessage(role, text) {
    const msgEl = document.createElement("div");
    msgEl.className = `cma-msg ${role}`;
    if (role === "assistant") {
      msgEl.innerHTML = formatMessage(text);
    } else {
      msgEl.textContent = text;
    }
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage("user", text);
    conversation.push({ role: "user", content: text });
    inputEl.value = "";
    sendBtn.disabled = true;
    typingEl.style.display = "block";

    try {
      const res = await fetch(CMA_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      const data = await res.json();

      if (data.error) {
        addMessage("assistant", "Oops, kuch gadbad ho gayi: " + data.error);
      } else {
        addMessage("assistant", data.reply);
        conversation.push({ role: "assistant", content: data.reply });
      }
    } catch (err) {
      addMessage(
        "assistant",
        "Hmm, server tak nahi pahunch paya. Internet check karo aur phir try karo."
      );
    } finally {
      typingEl.style.display = "none";
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

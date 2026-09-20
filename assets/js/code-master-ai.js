// ============================================
// Code Master AI - Chat Widget Logic (v2)
// New in this version:
//   - Voice input (speech-to-text) + voice output (text-to-speech)
//   - Clear chat menu (Clear All / Clear Last / Cancel)
//   - Image upload + screenshot analysis (sent to Claude's vision)
//   - Auto-growing multi-line input
//   - Voice selection (pick which system voice replies)
//   - "+" button with a quick menu of all these tools
// ============================================

// 👉 IMPORTANT: replace this with YOUR real Flask backend URL
const CMA_BACKEND_URL = "https://codetech-2-0.onrender.com/api/chat";

function initCodeMasterAI(mode = "bubble", mountSelector = null) {
  // conversation[] is what we send to the backend/Claude.
  // Each item looks like: { role: "user"|"assistant", content: [ {type:"text",...} , {type:"image",...} ] }
  let conversation = [];

  // pendingImage holds an image the user picked but hasn't sent yet.
  let pendingImage = null; // { base64, mediaType, previewUrl }

  // ---------- Build the widget DOM ----------
  const windowEl = document.createElement("div");
  windowEl.className = "cma-window" + (mode === "fullpage" ? " cma-fullpage" : "");
  windowEl.innerHTML = `
    <div class="cma-header">
      <span class="cma-title">🤖 Code Master AI</span>
      <div class="cma-header-actions">
        <button class="cma-icon-btn cma-voice-toggle" title="Voice replies on/off">🔈</button>
        <button class="cma-icon-btn cma-clear-btn" title="Clear chat">🗑️</button>
        ${mode === "bubble" ? '<button class="cma-icon-btn cma-close-btn">&times;</button>' : ""}
      </div>
    </div>

    <div class="cma-messages"></div>
    <div class="cma-typing" style="display:none;">Code Master AI is typing...</div>

    <!-- Clear chat popup -->
    <div class="cma-popup cma-clear-popup" style="display:none;">
      <button data-action="all">🗑️ Clear All Chats</button>
      <button data-action="last">⏪ Clear Last Chat</button>
      <button data-action="cancel">✖ Cancel</button>
    </div>

    <!-- "+" quick menu -->
    <div class="cma-popup cma-plus-menu" style="display:none;">
      <button data-action="image">📷 Upload Image / Screenshot</button>
      <button data-action="voice-input">🎤 Voice Input</button>
      <button data-action="voice-select">🔊 Voice Selection</button>
      <button data-action="clear">🗑️ Clear Chat</button>
    </div>

    <!-- Voice selection popup -->
    <div class="cma-popup cma-voice-popup" style="display:none;">
      <div class="cma-voice-list"></div>
    </div>

    <div class="cma-input-area">
      <button class="cma-plus-btn" title="More options">+</button>

      <div class="cma-input-wrap">
        <div class="cma-image-preview">
          <img src="" alt="preview">
          <span>Image attached</span>
          <button class="cma-remove-image" title="Remove image">&times;</button>
        </div>
        <textarea class="cma-input" rows="1" placeholder="Ask me about HTML, CSS, JS, React..."></textarea>
      </div>

      <button class="cma-mic-btn" title="Voice input">🎤</button>
      <button class="cma-send-btn" title="Send">➤</button>
      <input type="file" class="cma-file-input" accept="image/*" style="display:none;">
    </div>
  `;

  // ---------- Grab references to the pieces we need ----------
  const messagesEl     = windowEl.querySelector(".cma-messages");
  const inputEl        = windowEl.querySelector(".cma-input");
  const sendBtn        = windowEl.querySelector(".cma-send-btn");
  const typingEl       = windowEl.querySelector(".cma-typing");
  const plusBtn        = windowEl.querySelector(".cma-plus-btn");
  const micBtn         = windowEl.querySelector(".cma-mic-btn");
  const fileInput      = windowEl.querySelector(".cma-file-input");
  const imagePreview   = windowEl.querySelector(".cma-image-preview");
  const imagePreviewImg = imagePreview.querySelector("img");
  const removeImageBtn = windowEl.querySelector(".cma-remove-image");
  const clearBtn       = windowEl.querySelector(".cma-clear-btn");
  const clearPopup     = windowEl.querySelector(".cma-clear-popup");
  const plusMenu       = windowEl.querySelector(".cma-plus-menu");
  const voicePopup     = windowEl.querySelector(".cma-voice-popup");
  const voiceListEl    = windowEl.querySelector(".cma-voice-list");
  const voiceToggleBtn = windowEl.querySelector(".cma-voice-toggle");

  // ---------- Mount the widget into the page ----------
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

  addTextMessage(
    "assistant",
    "Yo! 👋 Main Code Master AI hoon. Type karo, bolke pucho (🎤), ya screenshot bhejo (📷) — jo bhi comfortable ho!"
  );

  // ============================================================
  // TEXT FORMATTING (markdown-ish code blocks -> safe HTML)
  // ============================================================
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatMessage(text) {
    let escaped = escapeHtml(text);
    escaped = escaped.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\n/g, "<br>");
    return escaped;
  }

  // Plain text version for text-to-speech (strip code/markdown noise)
    function stripForSpeech(text) {
    return text
      .replace(/```[\s\S]*?```/g, " code snippet ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[*_#>~]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F]/gu,
        ""
      )
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  // ============================================================
  // RENDERING MESSAGES
  // ============================================================
  function addTextMessage(role, text) {
    const row = document.createElement("div");
    row.className = `cma-msg-row ${role}`;

    const bubble = document.createElement("div");
    bubble.className = `cma-msg ${role}`;
    if (role === "assistant") {
      bubble.innerHTML = formatMessage(text);
    } else {
      bubble.textContent = text;
    }
    row.appendChild(bubble);

    // Assistant messages get a small "play voice" button so the user
    // can hear any reply out loud, even if auto-voice is switched off.
        if (role === "assistant") {
      const actions = document.createElement("div");
      actions.className = "cma-msg-actions";
      actions.innerHTML = `<button class="cma-play-btn">🔊 Play</button>`;
      const playBtn = actions.querySelector(".cma-play-btn");
      playBtn.addEventListener("click", () => {
        speakText(text, playBtn);
      });
      row.appendChild(actions);
    }
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return row;
  }

  function addImageUserMessage(previewUrl, captionText) {
    const row = document.createElement("div");
    row.className = "cma-msg-row user";

    const bubble = document.createElement("div");
    bubble.className = "cma-msg user";

    const img = document.createElement("img");
    img.className = "cma-msg-image";
    img.src = previewUrl;
    bubble.appendChild(img);

    if (captionText) {
      const p = document.createElement("div");
      p.textContent = captionText;
      bubble.appendChild(p);
    }

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ============================================================
  // AUTO-GROWING INPUT
  // ============================================================
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
  });

  // ============================================================
  // POPUP HELPERS (only one popup open at a time)
  // ============================================================
  function closeAllPopups() {
    clearPopup.style.display = "none";
    plusMenu.style.display = "none";
    voicePopup.style.display = "none";
  }

  function togglePopup(popupEl) {
    const isOpen = popupEl.style.display === "block";
    closeAllPopups();
    popupEl.style.display = isOpen ? "none" : "block";
  }

  // Close popups if the user clicks outside them
  document.addEventListener("click", (e) => {
    if (!windowEl.contains(e.target)) return; // click was fully outside the widget, ignore
    const clickedInsidePopup =
      clearPopup.contains(e.target) || plusMenu.contains(e.target) || voicePopup.contains(e.target);
    const clickedTrigger =
      e.target === clearBtn || e.target === plusBtn;
    if (!clickedInsidePopup && !clickedTrigger) closeAllPopups();
  });

  // ============================================================
  // CLEAR CHAT
  // ============================================================
  clearBtn.addEventListener("click", () => togglePopup(clearPopup));

  clearPopup.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === "all") {
      conversation = [];
      messagesEl.innerHTML = "";
      addTextMessage("assistant", "Chat clear kar diya bro! Naye sawaal se shuru karte hain. 🔄");
    } else if (action === "last") {
      // Remove the last user+assistant pair from both the display and the conversation sent to the API
      if (conversation.length >= 2) conversation.splice(-2, 2);
      else if (conversation.length === 1) conversation.splice(-1, 1);
      const rows = messagesEl.querySelectorAll(".cma-msg-row");
      if (rows.length >= 2) {
        rows[rows.length - 1].remove();
        rows[rows.length - 2].remove();
      } else if (rows.length === 1) {
        rows[0].remove();
      }
    }
    closeAllPopups();
  });

  // ============================================================
  // "+" QUICK MENU
  // ============================================================
  plusBtn.addEventListener("click", () => togglePopup(plusMenu));

  plusMenu.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    if (!action) return;
    closeAllPopups();

    if (action === "image") fileInput.click();
    else if (action === "voice-input") toggleVoiceInput();
    else if (action === "voice-select") { populateVoiceList(); voicePopup.style.display = "block"; }
    else if (action === "clear") clearPopup.style.display = "block";
  });

  // ============================================================
  // IMAGE UPLOAD / SCREENSHOT ANALYSIS
  // ============================================================
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addTextMessage("assistant", "Ye image file nahi lag rahi bro, koi screenshot/photo try karo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result; // e.g. "data:image/png;base64,AAAA..."
      const base64 = dataUrl.split(",")[1];
      pendingImage = { base64, mediaType: file.type, previewUrl: dataUrl };

      imagePreviewImg.src = dataUrl;
      imagePreview.classList.add("cma-show");
      inputEl.focus();
    };
    reader.readAsDataURL(file);
    fileInput.value = ""; // reset so the same file can be picked again later
  });

  removeImageBtn.addEventListener("click", () => {
    pendingImage = null;
    imagePreview.classList.remove("cma-show");
  });

  // ============================================================
  // SENDING A MESSAGE (text and/or image)
  // ============================================================
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text && !pendingImage) return; // nothing to send

    // Build the content blocks for THIS message
    const blocks = [];
    if (pendingImage) {
      blocks.push({
        type: "image",
        source: { type: "base64", media_type: pendingImage.mediaType, data: pendingImage.base64 },
      });
    }
    blocks.push({ type: "text", text: text || "Is screenshot mein kya coding error hai? Kaise fix karu?" });

    // Show it in the chat window
    if (pendingImage) {
      addImageUserMessage(pendingImage.previewUrl, text);
    } else {
      addTextMessage("user", text);
    }

    conversation.push({ role: "user", content: blocks });

    // Reset the input area
    inputEl.value = "";
    inputEl.style.height = "auto";
    pendingImage = null;
    imagePreview.classList.remove("cma-show");

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
        addTextMessage("assistant", "Oops, kuch gadbad ho gayi: " + data.error);
      }else {
        const newRow = addTextMessage("assistant", data.reply);
        conversation.push({ role: "assistant", content: [{ type: "text", text: data.reply }] });
        if (voiceRepliesOn) {
          const newPlayBtn = newRow.querySelector(".cma-play-btn");
          speakText(data.reply, newPlayBtn);
        }
      }
    } catch (err) {
      addTextMessage("assistant", "Hmm, server tak nahi pahunch paya. Internet check karo aur phir try karo.");
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

  // ============================================================
  // VOICE INPUT (speech-to-text)
  // ============================================================
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isRecording = false;

  if (SpeechRecognitionAPI) {
    recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-IN"; // handles Hinglish reasonably well
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript;
      inputEl.value = (inputEl.value ? inputEl.value + " " : "") + said;
      inputEl.dispatchEvent(new Event("input")); // trigger auto-resize
      inputEl.focus();
    };
    recognition.onend = () => {
      isRecording = false;
      micBtn.classList.remove("cma-recording");
    };
    recognition.onerror = () => {
      isRecording = false;
      micBtn.classList.remove("cma-recording");
      addTextMessage("assistant", "Voice input samajh nahi aaya, phir se try karo ya type kar do.");
    };
  }

  function toggleVoiceInput() {
    if (!recognition) {
      addTextMessage("assistant", "Ye browser voice input support nahi karta — Chrome try karo.");
      return;
    }
    if (isRecording) {
      recognition.stop();
      return;
    }
    isRecording = true;
    micBtn.classList.add("cma-recording");
    recognition.start();
  }

  micBtn.addEventListener("click", toggleVoiceInput);

  // ============================================================
  // VOICE OUTPUT (text-to-speech) + VOICE SELECTION
  // ============================================================
  let voiceRepliesOn = localStorage.getItem("cma_voice_enabled") === "true";
  updateVoiceToggleBtn();

  voiceToggleBtn.addEventListener("click", () => {
    voiceRepliesOn = !voiceRepliesOn;
    localStorage.setItem("cma_voice_enabled", voiceRepliesOn ? "true" : "false");
    updateVoiceToggleBtn();
  });

  function updateVoiceToggleBtn() {
    voiceToggleBtn.textContent = voiceRepliesOn ? "🔊" : "🔈";
    voiceToggleBtn.classList.toggle("cma-active", voiceRepliesOn);
    voiceToggleBtn.title = voiceRepliesOn ? "Voice replies: ON" : "Voice replies: OFF";
  }

    function getSelectedVoice() {
    const savedURI = localStorage.getItem("cma_voice_uri");
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    if (savedURI) {
      const match = voices.find((v) => v.voiceURI === savedURI);
      if (match) return match;
    }
    // Google/Natural/Online voices browser ki default OS voice se kaafi clear hoti hain
    const preferred = voices.find(
      (v) => v.lang && v.lang.startsWith("en") && /Google|Natural|Online|Enhanced/i.test(v.name)
    );
    return preferred || voices.find((v) => v.lang && v.lang.startsWith("en")) || voices[0] || null;
  }
    let currentUtterance = null;
  let currentPlayBtn = null;

  function resetPlayBtn(btn) {
    if (btn) btn.textContent = "🔊 Play";
  }

  function speakText(text, btnEl) {
    if (!window.speechSynthesis) {
      addTextMessage("assistant", "Ye browser voice output support nahi karta.");
      return;
    }

    // Same message ka button dobara dabaya -> pause/resume karo, restart mat karo
    if (btnEl && currentUtterance && currentPlayBtn === btnEl) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        btnEl.textContent = "▶ Resume";
        return;
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        btnEl.textContent = "⏸ Pause";
        return;
      }
    }

    // Naya message -> jo bhi pehle chal raha tha use rok do
    window.speechSynthesis.cancel();
    resetPlayBtn(currentPlayBtn);

    const utterance = new SpeechSynthesisUtterance(stripForSpeech(text));
    const voice = getSelectedVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.98;  // thoda slow = zyada clear sunta hai
    utterance.pitch = 1;

    utterance.onstart = () => { if (btnEl) btnEl.textContent = "⏸ Pause"; };
    utterance.onend = () => { resetPlayBtn(btnEl); currentUtterance = null; currentPlayBtn = null; };
    utterance.onerror = () => { resetPlayBtn(btnEl); currentUtterance = null; currentPlayBtn = null; };

    currentUtterance = utterance;
    currentPlayBtn = btnEl;
    window.speechSynthesis.speak(utterance);
  }
  function populateVoiceList() {
    if (!window.speechSynthesis) {
      voiceListEl.innerHTML = "<button disabled>Voice output supported nahi hai</button>";
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    const savedURI = localStorage.getItem("cma_voice_uri");

    if (!voices.length) {
      voiceListEl.innerHTML = "<button disabled>Voices load ho rahi hain, dobara try karo...</button>";
      return;
    }

    voiceListEl.innerHTML = voices
      .map((v) => {
        const active = v.voiceURI === savedURI ? "cma-voice-active" : "";
        return `<button class="${active}" data-uri="${v.voiceURI}">${v.name} (${v.lang})</button>`;
      })
      .join("");

    voiceListEl.querySelectorAll("button[data-uri]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem("cma_voice_uri", btn.dataset.uri);
        closeAllPopups();
        speakText("Ye meri awaaz hai!");
      });
    });
  }

  // Some browsers load voices asynchronously
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (voicePopup.style.display === "block") populateVoiceList();
    };
  }
}

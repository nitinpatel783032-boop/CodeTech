// ============================================
// Code Master AI - Chat Widget Logic (v3)
// - Voice input (speech-to-text) + voice output (ElevenLabs TTS)
// - Clear chat menu (Clear All / Clear Last / Cancel)
// - Image upload + screenshot analysis
// - Auto-growing multi-line input
// - Male/Female voice toggle
// - Copy button on code blocks
// - AI Voice Mode (hands-free talk mode)
// - "+" button with a quick menu of all these tools
// ============================================

const CMA_BACKEND_URL = "https://codetech-2-0.onrender.com/api/chat";

function initCodeMasterAI(mode = "bubble", mountSelector = null) {
  injectExtraStyles();

  let conversation = [];
  let pendingImage = null;

  const windowEl = document.createElement("div");
  windowEl.className = "cma-window" + (mode === "fullpage" ? " cma-fullpage" : "");
  windowEl.innerHTML = `
    <div class="cma-header">
      <span class="cma-title">🤖 Code Master AI</span>
      <div class="cma-header-actions">
        <button class="cma-icon-btn cma-voice-toggle" title="Voice replies on/off">🔈</button>
        <button class="cma-icon-btn cma-gender-toggle" title="Male/Female voice">👨</button>
        <button class="cma-icon-btn cma-clear-btn" title="Clear chat">🗑️</button>
        ${mode === "bubble" ? '<button class="cma-icon-btn cma-close-btn">&times;</button>' : ""}
      </div>
    </div>

    <div class="cma-messages"></div>
    <div class="cma-typing" style="display:none;">Code Master AI is typing...</div>

    <div class="cma-popup cma-clear-popup" style="display:none;">
      <button data-action="all">🗑️ Clear All Chats</button>
      <button data-action="last">⏪ Clear Last Chat</button>
      <button data-action="cancel">✖ Cancel</button>
    </div>

    <div class="cma-popup cma-plus-menu" style="display:none;">
      <button data-action="image">📷 Upload Image / Screenshot</button>
      <button data-action="voice-input">🎤 Voice Input</button>
      <button data-action="voice-mode">🎙️ AI Voice Mode (Bolke Baat Karo)</button>
      <button data-action="voice-select">🔊 Voice Selection</button>
      <button data-action="clear">🗑️ Clear Chat</button>
    </div>

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
  const genderToggleBtn = windowEl.querySelector(".cma-gender-toggle");
    // ---- Language dropdown ----
  const LANGS = { en: "English", hi: "हिन्दी", hinglish: "Hinglish", ta: "தமிழ்", te: "తెలుగు", bn: "বাংলা", mr: "मराठी", gu: "ગુજરાતી", pa: "ਪੰਜਾਬੀ", ur: "اردو", kn: "ಕನ್ನಡ", ml: "മലയാളം", or: "ଓଡ଼ିଆ", es: "Español", fr: "Français", de: "Deutsch", ar: "العربية", ja: "日本語", zh: "中文" };
  const langSelect = document.createElement("select");
  langSelect.title = "Language";
  langSelect.style.cssText = "background:#1e2140;color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:8px;padding:5px;font-size:12px;max-width:105px;";
  langSelect.innerHTML = Object.entries(LANGS).map(([c, n]) => `<option value="${c}">${n}</option>`).join("");
  langSelect.value = localStorage.getItem("cma_language") || "en";
  if (!langSelect.value) langSelect.value = "en";
  langSelect.addEventListener("change", () => localStorage.setItem("cma_language", langSelect.value));
  windowEl.querySelector(".cma-header-actions").prepend(langSelect);

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

  messagesEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".cma-copy-btn");
    if (!btn) return;
    const codeEl = btn.closest(".cma-code-block").querySelector("code");
    const codeText = codeEl.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
      const original = btn.textContent;
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    }).catch(() => {
      btn.textContent = "❌ Failed";
      setTimeout(() => { btn.textContent = "📋 Copy"; }, 1500);
    });
  });

  // ============================================================
  // TEXT FORMATTING
  // ============================================================
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatMessage(text) {
    const codeBlocks = [];
    let working = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({ lang: (lang || "code").trim(), code: code.replace(/\n$/, "") });
      return `\u0000CODEBLOCK${idx}\u0000`;
    });

    let escaped = escapeHtml(working);
    escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
    escaped = escaped.replace(/\n/g, "<br>");

    escaped = escaped.replace(/\u0000CODEBLOCK(\d+)\u0000/g, (m, idx) => {
      const block = codeBlocks[Number(idx)];
      const escapedCode = escapeHtml(block.code);
      return `<div class="cma-code-block"><div class="cma-code-header"><span class="cma-code-lang">${block.lang}</span><button class="cma-copy-btn">📋 Copy</button></div><pre><code>${escapedCode}</code></pre></div>`;
    });

    return escaped;
  }

    function stripForSpeech(text) {
    return text
      // 1. code blocks aur links
      .replace(/```[\s\S]*?```/g, " code snippet ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, " link ")
      .replace(/`([^`]+)`/g, "$1")
      // 2. emoji hatao
      .replace(
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F]/gu,
        ""
      )
      // 3. list bullets / headings / quotes
      .replace(/^\s*[-*•>#]+\s+/gm, "")
      // 4. dashes ko pause bana do
      .replace(/[—–]/g, ", ")
      .replace(/\s-\s/g, ", ")
      // 5. kuch symbols ko bolne layak shabd
      .replace(/&/g, " and ")
      .replace(/%/g, " percent")
      .replace(/[:;]/g, ",")
      // 6. baaki saare brackets / operators / symbols hata do
      .replace(/[-_()\[\]{}<>\\\/|=+*#~^@$"“”‘’`]/g, " ")
      // 7. newline ko pause banao
      .replace(/\s*\n+\s*/g, ". ")
      // 8. safai
      .replace(/\s+([,.?!])/g, "$1")
      .replace(/([,.?!])(\s*[,.])+/g, "$1")
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
  // POPUP HELPERS
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

  document.addEventListener("click", (e) => {
    if (!windowEl.contains(e.target)) return;
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
    else if (action === "voice-mode") openVoiceMode();
    else if (action === "voice-select") { populateVoiceList(); voicePopup.style.display = "block"; }
    else if (action === "clear") clearPopup.style.display = "block";
  });

  // ============================================================
  // IMAGE UPLOAD
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
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      pendingImage = { base64, mediaType: file.type, previewUrl: dataUrl };

      imagePreviewImg.src = dataUrl;
      imagePreview.classList.add("cma-show");
      inputEl.focus();
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  });

  removeImageBtn.addEventListener("click", () => {
    pendingImage = null;
    imagePreview.classList.remove("cma-show");
  });

  // ============================================================
  // SENDING A MESSAGE
  // ============================================================
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text && !pendingImage) return;

    const blocks = [];
    if (pendingImage) {
      blocks.push({
        type: "image",
        source: { type: "base64", media_type: pendingImage.mediaType, data: pendingImage.base64 },
      });
    }
    blocks.push({ type: "text", text: text || "Is screenshot mein kya coding error hai? Kaise fix karu?" });

    if (pendingImage) {
      addImageUserMessage(pendingImage.previewUrl, text);
    } else {
      addTextMessage("user", text);
    }

    conversation.push({ role: "user", content: blocks });

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
        body: JSON.stringify({ messages: conversation, language: langSelect.value }),
      });
      const data = await res.json();

      if (data.error) {
        addTextMessage("assistant", "Oops, kuch gadbad ho gayi: " + data.error);
      } else {
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
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript;
      inputEl.value = (inputEl.value ? inputEl.value + " " : "") + said;
      inputEl.dispatchEvent(new Event("input"));
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
  // VOICE OUTPUT (ElevenLabs TTS) + GENDER TOGGLE
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

  let voiceGender = localStorage.getItem("cma_voice_gender") || "male";
  updateGenderToggleBtn();

  genderToggleBtn.addEventListener("click", () => {
    voiceGender = voiceGender === "male" ? "female" : "male";
    localStorage.setItem("cma_voice_gender", voiceGender);
    updateGenderToggleBtn();
  });

  function updateGenderToggleBtn() {
    genderToggleBtn.textContent = voiceGender === "male" ? "👨" : "👩";
    genderToggleBtn.title = voiceGender === "male" ? "Voice: Male (tap for Female)" : "Voice: Female (tap for Male)";
  }

  let currentAudio = null;
  let currentPlayBtn = null;

  function resetPlayBtn(btn) {
    if (btn) btn.textContent = "🔊 Play";
  }

  async function speakText(text, btnEl) {
    if (btnEl && currentAudio && currentPlayBtn === btnEl) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        btnEl.textContent = "▶ Resume";
        return;
      } else {
        currentAudio.play();
        btnEl.textContent = "⏸ Pause";
        return;
      }
    }

    if (currentAudio) {
      currentAudio.pause();
      resetPlayBtn(currentPlayBtn);
    }

    if (btnEl) btnEl.textContent = "⏳ Loading...";

    try {
      const cleanText = stripForSpeech(text);
      const res = await fetch(CMA_BACKEND_URL.replace("/api/chat", "/api/tts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voice: voiceGender }),
      });

      if (!res.ok) {
        resetPlayBtn(btnEl);
        addTextMessage("assistant", "Voice generate nahi ho payi, phir se try karo.");
        return;
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onplay = () => { if (btnEl) btnEl.textContent = "⏸ Pause"; };
      audio.onended = () => { resetPlayBtn(btnEl); currentAudio = null; currentPlayBtn = null; };
      audio.onerror = () => { resetPlayBtn(btnEl); currentAudio = null; currentPlayBtn = null; };

      currentAudio = audio;
      currentPlayBtn = btnEl;
      audio.play();
    } catch (err) {
      resetPlayBtn(btnEl);
      addTextMessage("assistant", "Voice service tak nahi pahunch paya.");
    }
  }

  function populateVoiceList() {
    voiceListEl.innerHTML = `
      <button data-gender="male">👨 Male Voice (Chris)</button>
      <button data-gender="female">👩 Female Voice</button>
    `;
    voiceListEl.querySelectorAll("button[data-gender]").forEach((btn) => {
      btn.addEventListener("click", () => {
        voiceGender = btn.dataset.gender;
        localStorage.setItem("cma_voice_gender", voiceGender);
        updateGenderToggleBtn();
        closeAllPopups();
        speakText("Ye meri awaaz hai!", null);
      });
    });
  }

  // ============================================================
  // AI VOICE MODE (hands-free talk mode)
  // ============================================================
  function openVoiceMode() {
    if (!SpeechRecognitionAPI) {
      addTextMessage("assistant", "Ye browser voice mode support nahi karta — Chrome try karo.");
      return;
    }

    let modeActive = true;
    let muted = false;
    let liveRecognition = null;

    const overlay = document.createElement("div");
    overlay.className = "cma-voice-overlay";
    overlay.innerHTML = `
      <div class="cma-voice-circle" id="cma-vc"></div>
      <div class="cma-voice-status" id="cma-vs">Sun rha hoon...</div>
      <div class="cma-voice-controls">
        <button class="cma-voice-btn" id="cma-vmute">🎤</button>
        <button class="cma-voice-btn cma-voice-close" id="cma-vclose">✕</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const circleEl = overlay.querySelector("#cma-vc");
    const statusEl = overlay.querySelector("#cma-vs");
    const muteBtn  = overlay.querySelector("#cma-vmute");
    const closeBtn = overlay.querySelector("#cma-vclose");

    muteBtn.addEventListener("click", () => {
      muted = !muted;
      muteBtn.textContent = muted ? "🔇" : "🎤";
      if (muted) {
        stopListening();
        statusEl.textContent = "Mic band hai";
        circleEl.className = "cma-voice-circle";
      } else {
        startListening();
      }
    });

    closeBtn.addEventListener("click", closeMode);

    function startListening() {
      if (!modeActive || muted) return;
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }

      liveRecognition = new SpeechRecognitionAPI();
      liveRecognition.lang = "en-IN";
      liveRecognition.continuous = false;
      liveRecognition.interimResults = false;

      circleEl.className = "cma-voice-circle listening";
      statusEl.textContent = "Sun rha hoon...";

      liveRecognition.onresult = async (event) => {
        const said = event.results[0][0].transcript;
        if (!said || !said.trim()) { if (modeActive && !muted) startListening(); return; }
        circleEl.className = "cma-voice-circle";
        statusEl.textContent = "Soch raha hoon...";
        await handleVoiceMessage(said);
      };
      liveRecognition.onerror = () => { if (modeActive && !muted) startListening(); };
      liveRecognition.start();
    }

    function stopListening() {
      if (liveRecognition) {
        liveRecognition.onresult = null;
        liveRecognition.onerror = null;
        try { liveRecognition.stop(); } catch (e) {}
        liveRecognition = null;
      }
    }

    async function handleVoiceMessage(text) {
      addTextMessage("user", text);
      conversation.push({ role: "user", content: [{ type: "text", text }] });

      try {
        const res = await fetch(CMA_BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: conversation }),
        });
        const data = await res.json();

        if (data.error) {
          addTextMessage("assistant", "Oops, kuch gadbad ho gayi: " + data.error);
          statusEl.textContent = "Error aayi, phir try karo";
          if (modeActive && !muted) startListening();
          return;
        }

        addTextMessage("assistant", data.reply);
        conversation.push({ role: "assistant", content: [{ type: "text", text: data.reply }] });

        statusEl.textContent = "Bol raha hoon...";
        circleEl.className = "cma-voice-circle speaking";

        const cleanText = stripForSpeech(data.reply);
        const ttsRes = await fetch(CMA_BACKEND_URL.replace("/api/chat", "/api/tts"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: cleanText, voice: voiceGender }),
        });

        if (!ttsRes.ok) {
          circleEl.className = "cma-voice-circle";
          if (modeActive && !muted) startListening();
          return;
        }

        const audioBlob = await ttsRes.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        currentAudio = audio;

        audio.onended = () => {
          circleEl.className = "cma-voice-circle";
          currentAudio = null;
          if (modeActive && !muted) startListening();
        };
        audio.onerror = () => {
          circleEl.className = "cma-voice-circle";
          if (modeActive && !muted) startListening();
        };
        audio.play();
      } catch (err) {
        statusEl.textContent = "Server tak nahi pahuncha";
        circleEl.className = "cma-voice-circle";
        if (modeActive && !muted) startListening();
      }
    }

    function closeMode() {
      modeActive = false;
      stopListening();
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      overlay.remove();
    }

    startListening();
  }

  // ============================================================
  // EXTRA STYLES (code blocks + voice mode overlay)
  // ============================================================
  function injectExtraStyles() {
    if (document.getElementById("cma-extra-styles")) return;
    const style = document.createElement("style");
    style.id = "cma-extra-styles";
    style.textContent = `
      .cma-code-block { margin: 8px 0; border-radius: 8px; overflow: hidden; background: #1e1e1e; border: 1px solid #333; }
      .cma-code-header { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: #2a2a2a; }
      .cma-code-lang { color: #9ca3af; font-size: 0.75rem; text-transform: uppercase; }
      .cma-copy-btn { background: #3f3f46; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; cursor: pointer; }
      .cma-copy-btn:hover { background: #52525b; }
      .cma-code-block pre { margin: 0; padding: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; }
      .cma-code-block code { color: #e5e7eb; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }

      .cma-voice-overlay { position: fixed; inset: 0; background: rgba(10,10,15,0.97); z-index: 999999; display:flex; flex-direction:column; align-items:center; justify-content:center; }
      .cma-voice-circle { width:160px; height:160px; border-radius:50%; background: radial-gradient(circle at 30% 30%, #7c3aed, #4c1d95); box-shadow: 0 0 60px rgba(124,58,237,0.6); transition: transform 0.3s ease; }
      .cma-voice-circle.listening { animation: cma-pulse 1.2s ease-in-out infinite; }
      .cma-voice-circle.speaking { animation: cma-speak 0.5s ease-in-out infinite alternate; }
      @keyframes cma-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
      @keyframes cma-speak { 0% { transform: scale(1); } 100% { transform: scale(1.06); } }
      .cma-voice-status { color:#e5e7eb; margin-top:28px; font-size:1rem; font-family:inherit; text-align:center; padding:0 20px; }
      .cma-voice-controls { position:absolute; bottom:48px; display:flex; gap:24px; }
      .cma-voice-btn { width:56px; height:56px; border-radius:50%; border:none; background:#27272a; color:#fff; font-size:1.4rem; cursor:pointer; display:flex; align-items:center; justify-content:center; }
      .cma-voice-btn:hover { background:#3f3f46; }
      .cma-voice-btn.cma-voice-close { background:#dc2626; }
    `;
    document.head.appendChild(style);
  }
}

// ===== Code Master AI: Language Settings (paste at the END of the file) =====
(function () {
  const SHOW_ON_ALL_PAGES = false; // true karoge to gear har page pe dikhega
  const STORAGE_KEY = "cm_ai_language";

  // IMPORTANT: "value" app.py ke LANGUAGES dictionary ki keys se match hona chahiye
  const LANGS = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी (Hindi)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "te", label: "తెలుగు (Telugu)" }
  ];

  const getLang = () => localStorage.getItem(STORAGE_KEY) || "en";

  // Har /api/chat request mein selected language automatically add karta hai
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    try {
      const u = typeof url === "string" ? url : url.url;
      if (u && u.includes("/api/chat") && options && typeof options.body === "string") {
        const body = JSON.parse(options.body);
        body.language = getLang();
        options = Object.assign({}, options, { body: JSON.stringify(body) });
      }
    } catch (e) {}
    return originalFetch.call(this, url, options);
  };

  function buildSettingsUI() {
    if (!SHOW_ON_ALL_PAGES && !location.pathname.includes("code-master-ai")) return;

    const style = document.createElement("style");
    style.textContent = `
      #cm-settings-btn{position:fixed;right:20px;bottom:90px;width:46px;height:46px;border-radius:50%;
        border:none;background:#1f2937;color:#fff;font-size:22px;cursor:pointer;z-index:9998;
        box-shadow:0 4px 14px rgba(0,0,0,.35)}
      #cm-settings-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;
        align-items:center;justify-content:center;z-index:9999}
      #cm-settings-overlay.open{display:flex}
      #cm-settings-box{background:#111827;color:#fff;width:90%;max-width:340px;border-radius:14px;
        padding:20px;font-family:inherit}
      #cm-settings-box h3{margin:0 0 14px}
      #cm-settings-box label{display:block;margin-bottom:6px;font-size:14px;opacity:.85}
      #cm-settings-box select{width:100%;padding:10px;border-radius:8px;border:1px solid #374151;
        background:#1f2937;color:#fff;font-size:15px}
      #cm-settings-close{margin-top:16px;width:100%;padding:10px;border:none;border-radius:8px;
        background:#2563eb;color:#fff;font-size:15px;cursor:pointer}
    `;
    document.head.appendChild(style);

    const btn = document.createElement("button");
    btn.id = "cm-settings-btn";
    btn.title = "Settings";
    btn.textContent = "⚙️";

    const overlay = document.createElement("div");
    overlay.id = "cm-settings-overlay";
    overlay.innerHTML = `
      <div id="cm-settings-box">
        <h3>⚙️ Settings</h3>
        <label for="cm-lang-select">AI Reply Language</label>
        <select id="cm-lang-select"></select>
        <button id="cm-settings-close">Done</button>
      </div>`;

    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    const select = overlay.querySelector("#cm-lang-select");
    LANGS.forEach(function (l) {
      const opt = document.createElement("option");
      opt.value = l.value;
      opt.textContent = l.label;
      select.appendChild(opt);
    });
    select.value = getLang();

    select.addEventListener("change", function () {
      localStorage.setItem(STORAGE_KEY, select.value);
    });
    btn.addEventListener("click", function () { overlay.classList.add("open"); });
    overlay.querySelector("#cm-settings-close").addEventListener("click", function () {
      overlay.classList.remove("open");
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSettingsUI);
  } else {
    buildSettingsUI();
  }
})();

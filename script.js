/*/* ================================================================
   ✅ NAYI ADDITIONS — script.js ke BILKUL SHURUAT mein paste karo
      (sab existing code ke UPAR)
   ================================================================ */

// ══════════════════════════════════════════════════════════════
//  ⚠️  APNA GOOGLE CLIENT ID YAHAN DAALO
//  Google Cloud Console → APIs & Services → Credentials
//  → Create OAuth 2.0 Client ID → Web application
//  Authorized origins mein apna domain add karo
// ══════════════════════════════════════════════════════════════
// const GOOGLE_CLIENT_ID = '1020951287947-scj6pdg9rcvipui55vh84ucv8gd6fh1i.apps.googleusercontent.com';

// ──────────────────────────────────────────────────────────────
//  ONBOARDING STATE
// ──────────────────────────────────────────────────────────────
let obUserName    = '';
let obUserEmail   = '';
let obAnswers     = { why: [], pc: [] };
let obAutoClose   = null;

// ──────────────────────────────────────────────────────────────
//  INIT — DOMContentLoaded par sab shuru hoga
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initOnboarding();
});

// ══════════════════════════════════════════════════════════════
//  ONBOARDING
// ══════════════════════════════════════════════════════════════

function initOnboarding() {
  const overlay = document.getElementById('obOverlay');
  if (!overlay) return;

  // Har baar dikhao (agar sirf pehli baar chahiye to niche wali
  // 2 lines uncomment karo aur niche wali "overlay.style" line
  // comment karo):
  // if (localStorage.getItem('cm_onboarded')) { overlay.remove(); return; }

  overlay.style.display = 'flex';
  updateObDots(1);

  // Google Sign-In button
  const gBtn = document.getElementById('obGoogleBtn');
  if (gBtn) gBtn.addEventListener('click', triggerGoogleSignIn);

  // Enter key on name input → go step 2
  const nameInput = document.getElementById('obNameInput');
  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') obGoStep2();
    });
  }
}

// ── Google Sign-In ──────────────────────────────────────────
function triggerGoogleSignIn() {
  if (typeof google === 'undefined' || !google.accounts) {
    // Google GIS load nahi hua — naam se continue karo
    alert('Google Sign-In abhi load nahi hua. Naam likho ya continue karo.');
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  google.accounts.id.prompt();
}

function handleGoogleCredential(response) {
  try {
    // JWT decode (middle part)
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    obUserName  = payload.given_name || payload.name || '';
    obUserEmail = payload.email || '';

    // Name field bhi fill karo
    const nameInput = document.getElementById('obNameInput');
    if (nameInput && obUserName) nameInput.value = obUserName;

    obGoStep2();
  } catch (err) {
    console.error('Google credential parse error:', err);
    obGoStep2();
  }
}

// ── Dot progress ───────────────────────────────────────────
function updateObDots(activeCount) {
  const dots = document.querySelectorAll('.ob-dot');
  dots.forEach(function (d, i) {
    d.classList.toggle('active', i < activeCount);
  });
}

// ── Step activation ────────────────────────────────────────
function activateObStep(stepEl, isBack) {
  document.querySelectorAll('.ob-step').forEach(function (s) {
    s.classList.remove('active', 'ob-go-back');
  });
  stepEl.classList.add('active');
  if (isBack) stepEl.classList.add('ob-go-back');
}

// ── Navigation ──────────────────────────────────────────────
function obGoStep1(isBack) {
  updateObDots(1);
  activateObStep(document.getElementById('obStep1'), isBack);
}

function obGoStep2(isBack) {
  // Naam le lo input se
  const nameInput = document.getElementById('obNameInput');
  if (nameInput && nameInput.value.trim()) {
    obUserName = nameInput.value.trim();
  }
  updateObDots(2);
  activateObStep(document.getElementById('obStep2'), !!isBack);
}

function obGoStep3(isBack) {
  updateObDots(3);
  activateObStep(document.getElementById('obStep3'), !!isBack);
}

function obSkipAll() {
  obUserName = '';
  _showWelcome(true);
}

function obFinish() {
  _showWelcome(false);
  localStorage.setItem('obCompleted', 'true');
}

// ── Welcome screen ─────────────────────────────────────────
function _showWelcome(skipped) {
  const welcomeEl    = document.getElementById('obWelcome');
  const nameEl       = document.getElementById('obWelcomeName');
  const msgEl        = document.getElementById('obWelcomeMsg');
  const tagsEl       = document.getElementById('obWelcomeTags');
  const loaderFill   = document.getElementById('obLoaderFill');

  // Name
  const displayName = obUserName.trim() || 'Friend';
  if (nameEl) nameEl.textContent = displayName;

  // Personalised message
  let msg = 'Aapka coding journey ab shuru hota hai!';
  if (skipped) {
    msg = 'Seedha action mein aaye ho — respect! 🔥';
  } else if (obAnswers.why.some(function(a){ return a.includes('Freelancing'); })) {
    msg = 'Freelancing se apni zindagi control karo — sahi raah hai! 💪';
  } else if (obAnswers.why.some(function(a){ return a.includes('Startup') || a.includes('Project'); })) {
    msg = 'Apna startup banana hai? Coding tumhari superpower hai! 🦸';
  } else if (obAnswers.why.some(function(a){ return a.includes('Career') || a.includes('Naukri'); })) {
    msg = 'Career mein coding ek game-changer hai — bilkul sahi decision! 🎯';
  } else if (obAnswers.why.some(function(a){ return a.includes('Student'); })) {
    msg = 'Students ke liye coding — ek best skill ever. Jalte raho! 🔥';
  }
  if (msgEl) msgEl.textContent = msg;

  // Tags
  if (tagsEl) {
    var tags = [];
    if (obAnswers.pc.some(function(a){ return a.includes('PC'); }))     tags.push('🖥️ Desktop Ready');
    if (obAnswers.pc.some(function(a){ return a.includes('Laptop'); })) tags.push('💻 Laptop Ready');
    if (obAnswers.pc.some(function(a){ return a.includes('Dono'); }))   tags.push('🖥️💻 Power User');
    if (obAnswers.pc.some(function(a){ return a.includes('Mobile'); })) tags.push('📱 Mobile Learner');
    if (obAnswers.why.length > 0 && !skipped) tags.push('🎯 Goal Focused');
    tags.push('🚀 Journey Started');

    tagsEl.innerHTML = tags.map(function(t) {
      return '<span class="ob-welcome-tag">' + t + '</span>';
    }).join('');
  }

  // Activate step
  updateObDots(3);
  activateObStep(welcomeEl, false);

  // Confetti
  _makeConfetti();

  // Loader bar animate
  setTimeout(function () {
    if (loaderFill) loaderFill.style.width = '100%';
  }, 120);

  // All dots fill
  document.querySelectorAll('.ob-dot').forEach(function(d){ d.classList.add('active'); });

  // Auto-close after 4 seconds
  obAutoClose = setTimeout(obClose, 4000);
}

function obClose() {
  if (obAutoClose) clearTimeout(obAutoClose);
  const overlay = document.getElementById('obOverlay');
  if (!overlay) return;

  overlay.classList.add('ob-closing');
  localStorage.setItem('cm_user_name',  obUserName || 'Friend');
  if (obUserEmail) localStorage.setItem('cm_user_email', obUserEmail);
  localStorage.setItem('cm_onboarded', '1');

  setTimeout(function () {
    overlay.style.display = 'none';
  }, 560);
}

// ── Option multi-select ─────────────────────────────────────
function selectObOption(el) {
  var group = el.dataset.group;
  el.classList.toggle('selected');

  var text = (el.querySelector('span:last-child') || el).textContent.trim();
  if (!obAnswers[group]) obAnswers[group] = [];

  if (el.classList.contains('selected')) {
    if (obAnswers[group].indexOf(text) === -1) obAnswers[group].push(text);
  } else {
    obAnswers[group] = obAnswers[group].filter(function(a){ return a !== text; });
  }
}

// ── Confetti ────────────────────────────────────────────────
function _makeConfetti() {
  var wrap = document.getElementById('obConfettiWrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  var colors = ['#00d4ff','#00ff88','#a855f7','#f7df1e','#ff6b47','#ff77aa','#ffffff'];

  for (var i = 0; i < 50; i++) {
    var piece = document.createElement('div');
    piece.className = 'ob-confetti-piece';
    var size   = 5 + Math.random() * 8;
    var isCirc = Math.random() > 0.5;
    piece.style.cssText = [
      'left:'              + (Math.random() * 100) + '%',
      'width:'             + size + 'px',
      'height:'            + size + 'px',
      'background:'        + colors[Math.floor(Math.random() * colors.length)],
      'border-radius:'     + (isCirc ? '50%' : '2px'),
      'animation-duration:'+ (1.2 + Math.random() * 2) + 's',
      'animation-delay:'   + (Math.random() * 0.8) + 's',
    ].join(';');
    wrap.appendChild(piece);
  }
}

// ══════════════════════════════════════════════════════════════
//  THEME TOGGLE  (Dark ↔ Night)
//
//  Dark Mode  = existing cool blue-dark (default)
//  Night Mode = warm amber-dark (blue light kam, aankhen
//               thak ti nahi)
// ══════════════════════════════════════════════════════════════
var _isNightMode = false;

function initTheme() {
  var saved = localStorage.getItem('cm_theme');
  if (saved === 'night') {
    _isNightMode = true;
    document.body.classList.add('night-mode');
  }
  _updateThemeBtn();
}

function toggleTheme() {
  _isNightMode = !_isNightMode;
  document.body.classList.toggle('night-mode', _isNightMode);
  localStorage.setItem('cm_theme', _isNightMode ? 'night' : 'dark');
  _updateThemeBtn();
}

function _updateThemeBtn() {
  var icon  = document.getElementById('themeIcon');
  var label = document.getElementById('themeLabel');
  if (!icon || !label) return;

  if (_isNightMode) {
    // Ab night hai → button Dark dikhaye (switch back option)
    icon.className  = 'fas fa-desktop';
    label.textContent = 'Dark';
  } else {
    // Ab dark hai → button Night dikhaye
    icon.className  = 'fas fa-moon';
    label.textContent = 'Night';
  }
}

/* ================================================================
   ✅ YAHAN TAK NAYI CODE — Iske NEECHE apna purana script.js
      ka content aata hai (modalData etc.)
   ================================================================ */
let hamburger = document.getElementById('hamburger');
let mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ===== FLOATING CODE BACKGROUND =====
let floatingCode = document.getElementById('floatingCode');
if (floatingCode) {
  let lines = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <title>My Page</title>',
    '  </head>',
    '  <body>',
    '    <h1>Hello World!</h1>',
    '    <p>Web dev seekho!</p>',
    '',
    '  body {',
    '    background: #0a0e1a;',
    '    color: #e2e8f0;',
    '    font-family: monospace;',
    '  }',
    '',
    '  let greet = (name) => {',
    '    return `Hello, ${name}!`;',
    '  };',
    '',
    '  console.log(greet("World"));',
    '',
    '  .hero { display: flex; }',
    '  .btn { border-radius: 8px; }',
    '',
    '  function init() {',
    '    document.ready(() => {',
    '      loadApp();',
    '    });',
    '  }',
    '',
    '  <section class="hero">',
    '    <div class="container">',
    '      <h2>Learn to Code</h2>',
    '    </div>',
    '  </section>',
  ];
  floatingCode.textContent = lines.join('\n').repeat(3);
}

// ===== TYPING ANIMATION (Hero) =====
let typingCode = document.getElementById('typingCode');
if (typingCode) {
  let codeLines = [
    { type: 'comment', text: '<!-- HTML ka structure -->' },
    { type: 'tag', text: '<!DOCTYPE html>' },
    { type: 'tag', text: '<html lang="hi">' },
    { type: 'attr', text: '<head>' },
    { type: 'val', text: '  <title>Meri Website</title>' },
    { type: 'attr', text: '</head>' },
    { type: 'attr', text: '<body>' },
    { type: 'tag', text: '<h1 class="title">' },
    { type: 'txt', text: '    Hello, Dear Friend! 👋' },
     { type: 'txt', text: '    Thank you for visiting my website.' },
    { type: 'txt', text: '    This is a free Website for Learning HTML, CSS '},
    { type: 'txt', text: '    and JavaScript.'},
    { type: 'tag', text: '</h1>' },
    { type: 'val', text: ' <p> Seekhna shuru karne k liye! SURU KARO button ko' },
    { type: 'val', text: ' click karo or sikna suru karo.</p>' },
    { type: 'attr', text: '  </body>' },
    { type: 'tag', text: '</html>' },
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let displayedLines = [];

  function typeNextChar() {
    if (lineIdx >= codeLines.length) return;

    let line = codeLines[lineIdx];
    let text = line.text;

    if (charIdx <= text.length) {
      displayedLines[lineIdx] = { type: line.type, text: text.slice(0, charIdx) };
      charIdx++;
      renderCode();
      setTimeout(typeNextChar, 40);
    } else {
      lineIdx++;
      charIdx = 0;
      if (lineIdx < codeLines.length) {
        displayedLines.push({ type: codeLines[lineIdx]?.type || 'txt', text: '' });
      }
      setTimeout(typeNextChar, 120);
    }
  }

  function renderCode() {
    let colorMap = {
      comment: '#5c6370',
      tag: '#e06c75',
      attr: '#d19a66',
      val: '#98c379',
      txt: '#abb2bf',
    };
    typingCode.innerHTML = displayedLines
      .map((l, i) => {
        let color = colorMap[l.type] || '#abb2bf';
        let cursor = (i === lineIdx) ? '<span class="cursor"></span>' : '';
        return `<span style="color:${color}">${escapeHtml(l.text)}${cursor}</span>`;
      })
      .join('\n');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  setTimeout(typeNextChar, 800);
}

// ===== QUICK EXAMPLE EDITOR =====
let examples = {
  html: {
    label: 'HTML Code',
    code: `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background: #1a1a2e;
        color: #e2e2e2;
        font-family: sans-serif;
        text-align: center;
        padding: 30px;
      }
      h1 { color: #00d4ff; font-size: 2rem; }
      p  { color: #94a3b8; }
      .box {
        background: #0f1526;
        border: 1px solid #1e2d4a;
        border-radius: 12px;
        padding: 20px;
        margin: 20px auto;
        max-width: 300px;
      }
    </style>
  </head>
  <body>
    <h1>🚀 Hello, World!</h1>
    <p>Mera pehla HTML page</p>
    <div class="box">
      <p>Yeh ek box hai CSS se banaya!</p>
    </div>
  </body>
</html>`,
  },
  css: {
    label: 'CSS Code',
    code: `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background: #0a0e1a;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: sans-serif;
      }
      .card {
        background: linear-gradient(135deg, #1a1a3e, #0d1117);
        border: 2px solid #00d4ff;
        border-radius: 16px;
        padding: 30px 40px;
        text-align: center;
        color: white;
        box-shadow: 0 0 30px rgba(0,212,255,0.3);
        animation: glow 2s ease-in-out infinite;
      }
      .card h2 { color: #00d4ff; margin-bottom: 10px; }
      .card p  { color: #94a3b8; }
      @keyframes glow {
        0%,100% { box-shadow: 0 0 20px rgba(0,212,255,0.3); }
        50%      { box-shadow: 0 0 40px rgba(0,212,255,0.6); }
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>✨ CSS Magic!</h2>
      <p>Animations aur styling seekho</p>
    </div>
  </body>
</html>`,
  },
  js: {
    label: 'JavaScript Code',
    code: `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background: #0a0e1a; color: #e2e8f0;
        font-family: sans-serif; text-align: center;
        padding: 30px;
      }
      #output {
        background: #0f1526; border: 1px solid #1e2d4a;
        border-radius: 12px; padding: 20px;
        margin: 20px auto; max-width: 320px;
        font-size: 1.1rem; color: #00d4ff;
      }
      button {
        background: #00d4ff; color: #0a0e1a;
        border: none; padding: 10px 24px;
        border-radius: 8px; font-size: 1rem;
        cursor: pointer; font-weight: bold;
        margin: 8px;
      }
      button:hover { background: #00ff88; }
    </style>
  </head>
  <body>
    <h2>🎯 JS Counter</h2>
    <div id="output">Count: 0</div>
    <button onclick="change(1)">➕ Badhao</button>
    <button onclick="change(-1)">➖ Ghataao</button>
    <button onclick="reset()">🔄 Reset</button>
    <script>
      let count = 0;
      function change(n) {
        count += n;
        document.getElementById('output').textContent = 'Count: ' + count;
      }
      function reset() {
        count = 0;
        document.getElementById('output').textContent = 'Count: 0';
      }
    <\/script>
  </body>
</html>`,
  },
};

let currentEx = 'html';

function showEx(type) {
  currentEx = type;
  let data = examples[type];
  let input = document.getElementById('codeInput');
  let label = document.getElementById('exLabel');
  let tabs = document.querySelectorAll('.ex-tab');
  if (!input) return;
  input.value = data.code;
  if (label) label.textContent = data.label;
  tabs.forEach(t => t.classList.remove('active'));
  let idx = ['html','css','js'].indexOf(type);
  if (tabs[idx]) tabs[idx].classList.add('active');
  runCode();
}

function runCode() {
  let input = document.getElementById('codeInput');
  let frame = document.getElementById('outputFrame');
  if (!input || !frame) return;
  let doc = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(input.value);
  doc.close();
}

// Init example
// script.js ke top pe ya DOMContentLoaded ke andar

window.addEventListener('DOMContentLoaded', () => {
  
  // ✅ Agar pehle complete kar chuka hai toh mat dikhao
 const obOverlay = document.getElementById('obOverlay');
if (!obOverlay) return;
if (localStorage.getItem('obCompleted') === 'true') {
    obOverlay.style.display = 'none';
  } else {
    obOverlay.style.display = 'flex';
  }

});

// ===== SCROLL FADE IN =====
let observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// ===== SCROLL FADE IN =====
document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));

// ===== COPY BUTTON =====
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn')) {
    let pre = e.target.closest('.code-block')?.querySelector('pre');
    if (pre) {
      navigator.clipboard.writeText(pre.innerText).then(() => {
        e.target.textContent = 'Copied!';
        setTimeout(() => e.target.textContent = 'Copy', 2000);
      });
    }
  }
});

// ===== SIDEBAR ACTIVE =====
function initSidebar() {
  let links = document.querySelectorAll('.sidebar-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

initSidebar();

// ===== TRY IT BOXES =====
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('try-it-run') || e.target.closest('.try-it-run')) {
    let box = e.target.closest('.try-it-box');
    if (!box) return;
    let ta = box.querySelector('textarea');
    let iframe = box.querySelector('iframe');
    if (!ta || !iframe) return;
    let doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(ta.value);
    doc.close();
  }
});

// ===== VIDEO FILTER =====
function initVideoFilter() {
  let btns = document.querySelectorAll('.filter-btn');
  let cards = document.querySelectorAll('.video-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

initVideoFilter();

let introData = {
  Intro: {
    videoId: 'BsDoLVMnmZs'  // Code With Harry — Web Dev Full Course
  }
};

function openVideo(key) {
  let data = introData[key];
  if (!data) return;
  let modal  = document.getElementById('videoModal');
  let iframe = document.getElementById('modalIframe');
  iframe.src = 'https://www.youtube.com/embed/' + data.videoId + '?autoplay=1';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  let modal  = document.getElementById('videoModal');
  let iframe = document.getElementById('modalIframe');
  iframe.src = '';
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
// Cube overlay ke andar click block na kare
document.querySelector('.cube-hover-overlay')
  ?.addEventListener('click', () => openVideo('Intro'));

// =============================================
//  MODAL DATA
//  videoId: YouTube video ID daalo
//  Agar koi video nahi hai toh videoId: '' chhod do
//  Example: https://www.youtube.com/watch?v=qz0aGYrrlhU
//           videoId = 'qz0aGYrrlhU'
// =============================================

let modalData = {
  dom: {
    tag: 'HTML', tagClass: 'tag-html',
    title: 'HTML DOM Tree — Hd Tour',
    desc: 'Document Object Model (DOM) ek tree structure hai jisme sare HTML elements nodes hote hain. JavaScript in nodes ko read aur modify kar sakti hai.',
    duration: '4:12', level: 'Beginner', views: '12.4k',
    videoId: 'Rhj6KWFw7AA'
  },
  boxmodel: {
    tag: 'CSS', tagClass: 'tag-css',
    title: 'Box Model — Hd Explode View',
    desc: 'Har HTML element ek rectangular box hai jisme Content, Padding, Border, aur Margin hote hain. Box Model CSS layout ka sabse important concept hai.',
    duration: '3:45', level: 'Beginner', views: '18.2k',
    videoId: '5koxb4JaDqc'
  },
  loops: {
    tag: 'JS', tagClass: 'tag-js',
    title: 'Loops — hd Visual',
    desc: 'Loops se repetitive tasks efficiently karte hain. for loop ek counter se chalta hai, while condition check karta hai, forEach arrays pe kaam karta hai.',
    duration: '5:20', level: 'Beginner', views: '9.8k',
    videoId: 'XKyyM1VWtUE'
  },
  flexbox: {
    tag: 'CSS', tagClass: 'tag-css',
    title: 'Flexbox — Live Animation',
    desc: 'Flexbox ek 1D layout system hai jo items ko row ya column mein arrange karta hai. justify-content, align-items se positioning control hoti hai.',
    duration: '6:30', level: 'Intermediate', views: '22.1k',
    videoId: '4ykmsTpIn08'
  },
  grid: {
    tag: 'CSS', tagClass: 'tag-css',
    title: 'CSS Grid — Hd Layout Builder',
    desc: 'CSS Grid ek 2D layout system hai jo rows aur columns dono mein items place karta hai. Complex page layouts ke liye Grid perfect hai.',
    duration: '7:15', level: 'Intermediate', views: '14.7k',
    videoId: 'BNmxUzPRYdw'
  },
  events: {
    tag: 'JS', tagClass: 'tag-js',
    title: 'DOM Events — Ripple Effect',
    desc: 'Events user actions ke responses hain — click, hover, keypress, submit. addEventListener se JavaScript in events ko "sun" sakti hai.',
    duration: '4:55', level: 'Intermediate', views: '11.3k',
    videoId: 'rFq0HVOdDo4'
  },
  async: {
    tag: 'JS', tagClass: 'tag-js',
    title: 'Async/Await — Data Flow',
    desc: 'JavaScript single-threaded hai but asynchronous code se non-blocking operations karte hain. Promises aur async/await se API calls aur file reads handle hote hain.',
    duration: '8:10', level: 'Advanced', views: '7.9k',
    videoId: 'AyJq1RRaY_k'
  },
  responsive: {
    tag: 'CSS', tagClass: 'tag-css',
    title: 'Responsive Design — Media Queries',
    desc: 'Media Queries se CSS different screen sizes ke liye alag rules define karta hai. Mobile-first approach mein pehle mobile design, phir desktop mein expand karte hain.',
    duration: '5:40', level: 'Intermediate', views: '16.5k',
    videoId: '8KVrdL0VcAk'
  },
  forms: {
    tag: 'HTML', tagClass: 'tag-html',
    title: 'HTML Forms — Complete Guide',
    desc: 'HTML Forms user se data collect karte hain. Input types (text, email, password, number, checkbox), validation attributes, aur form submission sab yahan cover hota hai.',
    duration: '6:25', level: 'Beginner', views: '13.8k',
    videoId: 'KqJikDzb3l4'
  }
};

// =============================================
//  MODAL OPEN — ek hi definition (duplicate hata diya)
// =============================================
function openModal(id) {
  let d = modalData[id];
  if (!d) return;

  let screen = document.getElementById('modalScreen');
  let hasVideo = d.videoId && d.videoId !== 'NO_VIDEO_YET';

  if (hasVideo) {
    // ✅ YouTube Embed — autoplay + proper permissions
    screen.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${d.videoId}?autoplay=1&rel=0&modestbranding=1"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        title="${d.title}">
      </iframe>
      <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>`;
  } else {
    // ⚠️ Video nahi hai — placeholder dikhao
    screen.innerHTML = `
      <div class="modal-placeholder">
        <i class="fab fa-youtube ph-icon"></i>
        <p>Video jald aayegi!</p>
        <p style="opacity:0.5; font-size:0.72rem;">Abhi koi YouTube video link nahi hai.</p>
      </div>
      <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>`;
  }

  // Info fill karo
  document.getElementById('modalTag').textContent   = d.tag;
  document.getElementById('modalTag').className     = 'video-tag ' + d.tagClass;
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalDesc').textContent  = d.desc;
  document.getElementById('modalMeta').innerHTML =
    `<span><i class="fas fa-clock"></i> ${d.duration}</span>
     <span><i class="fas fa-signal"></i> ${d.level}</span>
     <span><i class="fas fa-eye"></i> ${d.views} views</span>`;

  // YouTube direct link button
  let ytLinkBox = document.getElementById('modalYTLink');
  let ytLink    = document.getElementById('ytDirectLink');
  if (hasVideo) {
    ytLinkBox.style.display = 'block';
    ytLink.href = `https://www.youtube.com/watch?v=${d.videoId}`;
  } else {
    ytLinkBox.style.display = 'none';
  }

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// =============================================
//  MODAL CLOSE — ek hi definition
// =============================================
function closeModal() {
  // iframe hata do taaki video ruk jaye
  document.getElementById('modalScreen').innerHTML =
    `<button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>`;
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target.id === 'modalOverlay') closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Active nav highlight on scroll ──────────────────────────────────────────
const sections     = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');
const mobileLinks  = document.querySelectorAll('.mobile-nav-link');

function setActiveLink() {
  const scrollY = window.scrollY;
  let current = '';

  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  sidebarLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });

  mobileLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// ── Mobile nav toggle ────────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ── Starfield background ─────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const STAR_COUNT = 200;
  const DRIFT_SPEED = 0.15;   // base upward drift px/frame
  const SCROLL_FACTOR = 0.3;  // how much scroll amplifies drift
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,          // radius 0.3–1.7
        alpha: Math.random() * 0.5 + 0.15,      // opacity 0.15–0.65
        drift: (Math.random() * 0.5 + 0.5) * DRIFT_SPEED,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  let scrollDelta = 0;
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
  }, { passive: true });

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    frame++;

    for (const s of stars) {
      // Move star upward: base drift + scroll-driven movement
      s.y -= s.drift + scrollDelta * SCROLL_FACTOR * s.drift * 4;

      // Wrap around when off-screen
      if (s.y < -2)  s.y = h + 2;
      if (s.y > h + 2) s.y = -2;

      // Twinkle
      const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinkleOffset);
      const alpha = s.alpha + twinkle * 0.15;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, alpha)})`;
      ctx.fill();
    }

    scrollDelta *= 0.85; // decay scroll influence
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
})();

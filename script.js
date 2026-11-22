// ── Mobile nav ───────────────────────────────────────────────────────────
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  });

  links.addEventListener('click', e => {
    if (!e.target.closest('.nav-link')) return;
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  });
})();

// ── Scroll reveal ────────────────────────────────────────────────────────
(function () {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  targets.forEach(el => io.observe(el));
})();

// ── Gallery lightbox ─────────────────────────────────────────────────────
(function () {
  const tiles = [...document.querySelectorAll('#gallery .g-tile')];
  const box = document.getElementById('lightbox');
  if (!tiles.length || !box || typeof box.showModal !== 'function') return;

  const img   = box.querySelector('.lb-img');
  const count = box.querySelector('.lb-count');
  let i = 0;

  function show(n) {
    i = (n + tiles.length) % tiles.length;
    img.src = tiles[i].dataset.full;
    img.alt = tiles[i].dataset.alt || '';
    count.textContent = (i + 1) + ' / ' + tiles.length;
    const next = new Image(); next.src = tiles[(i + 1) % tiles.length].dataset.full;
  }

  tiles.forEach((t, n) => t.addEventListener('click', () => { show(n); box.showModal(); }));
  box.querySelector('.lb-close').addEventListener('click', () => box.close());
  box.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('close', () => tiles[i].focus());

  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); show(i - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1); }
  });

  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

// ── Posts carousel ───────────────────────────────────────────────────────
(function () {
  const track = document.getElementById('postsTrack');
  if (!track) return;
  const prev = document.getElementById('postsPrev');
  const next = document.getElementById('postsNext');
  const wrap = track.parentElement;

  const step = () => {
    const card = track.querySelector('.post');
    return card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
  };
  function update() {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = track.scrollLeft <= 2;
    if (next) next.disabled = track.scrollLeft >= max;
    wrap.classList.toggle('at-end', track.scrollLeft >= max);
  }
  prev && prev.addEventListener('click', () => track.scrollBy({ left: -step() }));
  next && next.addEventListener('click', () => track.scrollBy({ left:  step() }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

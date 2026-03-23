// ── Active nav highlight on scroll ──────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollY = window.scrollY;
  let current = '';

  sections.forEach(section => {
    const top = section.offsetTop - 80;
    if (scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// ── Mobile nav toggle ────────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

navToggle.addEventListener('click', () => {
  siteNav.classList.toggle('open');
});

// Close mobile nav when a link is tapped
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
  });
});

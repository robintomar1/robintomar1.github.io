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

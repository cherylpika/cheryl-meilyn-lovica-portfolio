// Mobile menu
const menu = document.querySelector('.menu'), nav = document.querySelector('nav');
menu.addEventListener('click', () => menu.setAttribute('aria-expanded', nav.classList.toggle('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });

// Dark mode
const root = document.documentElement, tbtn = document.getElementById('theme');
const setTheme = t => { root.dataset.theme = t; tbtn.innerHTML = t === 'dark' ? '&#9728;' : '&#9790;'; };
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || 'light');
tbtn.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(t);
  try { localStorage.setItem('theme', t); } catch (e) {}
});

// Scroll reveal and counters
const count = el => {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', t0 = performance.now();
  (function tick(t) {
    const k = Math.min((t - t0) / 1200, 1);
    el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suf;
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(count);
  io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll('.eyebrow,h2,.sub,.two>*,.grid3>.card,.internship-entry,.proj,.course-card,.credential-card,.activity-entry').forEach(el => { el.classList.add('rv'); io.observe(el); });

// Progress bar, header shadow, active link
const prog = document.querySelector('.prog'), header = document.querySelector('.top');
const secs = [...document.querySelectorAll('main section[id]')], links = [...document.querySelectorAll('nav a')];
addEventListener('scroll', () => {
  prog.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  header.classList.toggle('scrolled', scrollY > 10);
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 120) cur = s.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

// Certificate viewer
const dlg = document.getElementById('cert');
document.querySelectorAll('.internship-docs button, .certificate-viewer').forEach(btn => btn.addEventListener('click', () => {
  const title = document.getElementById('ct');
  title.textContent = btn.dataset.title || '';
  title.hidden = !btn.dataset.title;
  const img = document.getElementById('ci');
  const pdf = document.getElementById('cp');
  const file = btn.dataset.file || btn.dataset.img;
  const isPdf = /\.pdf(?:$|[?#])/i.test(file);
  img.hidden = isPdf;
  pdf.hidden = !isPdf;
  img.src = isPdf ? '' : encodeURI(file);
  img.alt = btn.dataset.title ? 'Certificate: ' + btn.dataset.title : btn.dataset.alt || '';
  pdf.src = isPdf ? encodeURI(file) : 'about:blank';
  dlg.showModal();
}));

dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && dlg.open) dlg.close();
});
document.getElementById('yr').textContent = new Date().getFullYear();
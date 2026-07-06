/* navbar scroll */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('up', scrollY > 60), { passive: true });

/* hamburger */
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mobNav');
hbg.addEventListener('click', () => {
  const o = mob.classList.toggle('open');
  hbg.classList.toggle('x', o);
  hbg.setAttribute('aria-expanded', o);
  document.body.style.overflow = o ? 'hidden' : '';
});
mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mob.classList.remove('open');
  hbg.classList.remove('x');
  hbg.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}));

/* reveal on scroll */
const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* active nav (only affects same-page anchors, e.g. on the homepage) */
const secs = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('#navUl a');
const activeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.45 });
secs.forEach(s => activeObs.observe(s));

# Páginas de Servicio SEO — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 5 new SEO-targeted service landing pages for loginco.com.mx (agencia aduanal, comercio exterior, depósito fiscal, transporte de carga, envíos de contenedores), each in its own folder for clean URLs, and extract the shared CSS/JS from `index.html` so all 6 pages stay in sync.

**Architecture:** Static HTML site, no build tooling, no framework. Shared CSS moves from `index.html`'s inline `<style>` into `style.css`; shared JS (nav scroll, hamburger menu, scroll-reveal) moves into `main.js`. Each new page is `<slug>/index.html`, linking the same `style.css`/`main.js`, with its own JSON-LD (`Service`, `BreadcrumbList`, `FAQPage`) and root-relative links back into `index.html`'s sections.

**Tech Stack:** Plain HTML5, CSS3, vanilla JS. No package.json, no test runner.

## Global Constraints

- Site is static HTML/CSS/JS with no build system and no test framework. **Verification for every task** uses a local static server rather than unit tests: `python3 -m http.server 8000 --directory /home/tony/Developer/WebLoginco2026` (start once, in the background, leave running across tasks), then `curl -s http://localhost:8000/<path>` to fetch pages.
- Every new page lives at `<slug>/index.html` (folder + index file) so the URL has no `.html` extension.
- All asset and internal links inside the 5 new pages (and the footer/nav duplicated onto them) must be **root-relative** (leading `/`): `/style.css`, `/main.js`, `/img/...`, `/favicon.svg`, `/#servicios`, etc. — the pages live one directory below root.
- Reuse only real, existing brand facts: founded 2017, 9+ años de experiencia, 5 patentes aduanales (3517, 1656, 1627, 3474, 1927), instalaciones en Ciudad Lázaro Cárdenas, Michoacán (2,200 m² y 550 m² cubiertos, 9,000 m² totales), tel `+52 753 537 7838`, email `info@loginco.com.mx`. No invented data or stats.
- No Open Graph / Twitter Card meta tags (matches current `index.html`, which has none).
- No new images or photography — reuse existing files in `/img/` and the inline SVG service icons already in `index.html`.
- No per-page contact form — every CTA links to `/#contacto` on the homepage.
- Exact URL slugs (already approved): `/agencia-aduanal-mexico/`, `/comercio-exterior-mexico/`, `/deposito-fiscal-mexico/`, `/transporte-de-carga-mexico/`, `/envios-de-contenedores-mexico/`.

---

## Task 1: Extract shared CSS into `style.css`

**Files:**
- Create: `style.css` (currently exists, empty)
- Modify: `index.html:90-708` (replace inline `<style>` block with a stylesheet link)

**Interfaces:**
- Produces: CSS classes consumed by every later task — `:root` variables (`--navy`, `--blue`, `--teal`, `--teal-d`, `--white`, `--bg`, `--border`, `--muted`, `--dark`, `--grad-hero`, `--r`, `--rl`, `--t`, `--font-display`, `--font-heading`, `--font-body`), layout (`.wrap`, `section`), nav/footer/button classes, `.srv-grid`/`.srv-card`/`.srv-ico`/`.srv-t`/`.srv-d`, plus **new** classes this task adds: `.page-hero`, `.breadcrumb`, `.svc-block`, `.faq`, `.faq-item`, `.cross-links`, `.cross-grid`, `.cross-card`, `a.srv-card`.

- [ ] **Step 1: Extract the existing inline CSS to `style.css`**

```bash
cd /home/tony/Developer/WebLoginco2026
sed -n '91,707p' index.html > style.css
wc -l style.css
```

Expected: `617 style.css` (lines 91 through 707 of the original file).

- [ ] **Step 2: Append new shared component CSS for the service pages**

```bash
cat >> style.css <<'EOF'

/* ── PAGE HERO (service landing pages) ──────────────────────────────── */
.page-hero { padding:9rem 0 4rem; background:var(--grad-hero); color:var(--white); }
.page-hero .wrap { max-width:900px; }
.breadcrumb {
  font-family:var(--font-heading); font-size:.8rem; font-weight:600;
  letter-spacing:.04em; opacity:.75; margin-bottom:1rem;
}
.breadcrumb a { color:var(--white); text-decoration:underline; text-underline-offset:3px; }
.page-hero h1 {
  font-family:var(--font-display); font-size:clamp(2rem,4.5vw,3rem);
  font-weight:800; line-height:1.15; margin-bottom:1rem;
}
.page-hero p { font-size:1.1rem; max-width:640px; opacity:.9; line-height:1.6; }
.page-hero .btn-row { display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem; }

/* ── SERVICE DETAIL BLOCK ────────────────────────────────────────────── */
.svc-block { padding:5rem 0; }
.svc-block .wrap { max-width:900px; }
.svc-block h2 { font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--navy); margin-bottom:1.2rem; }
.svc-block p { color:var(--muted); line-height:1.75; margin-bottom:1rem; font-size:1.05rem; }
.svc-block p strong { color:var(--dark); }

/* ── FAQ ─────────────────────────────────────────────────────────────── */
.faq { padding:5rem 0; background:var(--bg); }
.faq .wrap { max-width:800px; }
.faq h2 { font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--navy); margin-bottom:2rem; text-align:center; }
.faq-item { background:var(--white); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; margin-bottom:1rem; box-shadow:var(--shadow-s); }
.faq-item h3 { font-family:var(--font-heading); font-size:1.05rem; font-weight:700; color:var(--dark); margin-bottom:.5rem; }
.faq-item p { color:var(--muted); line-height:1.6; font-size:.95rem; }

/* ── CROSS-LINKS ("otros servicios") ─────────────────────────────────── */
.cross-links { padding:5rem 0; }
.cross-links h2 { font-family:var(--font-display); font-size:1.8rem; font-weight:800; color:var(--navy); margin-bottom:2rem; text-align:center; }
.cross-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.5rem; }
.cross-card { display:block; background:var(--white); border:1px solid var(--border); border-radius:var(--r); padding:1.5rem; box-shadow:var(--shadow-s); transition:transform var(--t), box-shadow var(--t); }
.cross-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-m); }
.cross-card h3 { font-family:var(--font-heading); font-size:1rem; font-weight:700; color:var(--navy); margin-bottom:.4rem; }
.cross-card p { color:var(--muted); font-size:.9rem; line-height:1.5; }

/* ── SERVICE CARDS AS LINKS (homepage #servicios) ────────────────────── */
a.srv-card { display:block; cursor:pointer; }
EOF
```

- [ ] **Step 3: Replace the inline `<style>` block in `index.html` with a stylesheet link**

```bash
sed -i '90,708d' index.html
sed -i '89a\  <link rel="stylesheet" href="/style.css">' index.html
sed -n '85,93p' index.html
```

Expected output: the `<noscript>` font line, a blank line, then `  <link rel="stylesheet" href="/style.css">`, then `</head>` shortly after.

- [ ] **Step 4: Verify `index.html` no longer contains inline CSS and still renders styled**

```bash
grep -c '<style>' index.html
```

Expected: `0`

```bash
python3 -m http.server 8000 --directory /home/tony/Developer/WebLoginco2026 &
sleep 1
curl -s http://localhost:8000/style.css | grep -c 'srv-card'
curl -s http://localhost:8000/ | grep -o '<link rel="stylesheet" href="/style.css">'
```

Expected: a non-zero count from the first `curl`, and the link tag echoed by the second. Leave the server running — later tasks reuse it.

- [ ] **Step 5: Commit**

```bash
git add style.css index.html
git commit -m "Extract shared CSS from index.html into style.css"
```

---

## Task 2: Extract shared JS into `main.js`

**Files:**
- Create: `main.js`
- Modify: `index.html:1126-1214` (the closing `<script>` block)

**Interfaces:**
- Consumes: DOM ids/classes produced by the nav/footer markup — `#nav`, `#hbg`, `#mobNav`, `#navUl a`, `.rv`, `section[id]`.
- Produces: nothing new consumed by later tasks (later tasks just include `<script src="/main.js"></script>` verbatim).

The current inline `<script>` in `index.html` mixes reusable behavior (navbar shrink-on-scroll, hamburger menu, scroll-reveal, active-nav highlighting) with page-specific behavior (stats counter animation, contact form submit) — and contains a dead first attempt at "active nav" immediately superseded by a second "safer active nav" block. This task splits it: reusable behavior → `main.js` (used by all 6 pages, dead code dropped), page-specific behavior stays inline in `index.html` only.

- [ ] **Step 1: Create `main.js` with the shared behavior**

```javascript
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
```

- [ ] **Step 2: Replace `index.html`'s closing `<script>` block**

Use the Edit tool. The `old_string` is the **entire** current block (lines 1126-1214):

```html
<script>
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

  /* active nav */
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('#navUl a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold: 0.45 }).forEach ? null :
  (() => {
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { threshold: 0.45 });
    secs.forEach(s => o.observe(s));
  })();
  /* safer active nav */
  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold: 0.45 });
  secs.forEach(s => activeObs.observe(s));

  /* counter animation */
  function countUp(el) {
    const t = parseInt(el.dataset.target.replace(/,/g, ''));
    const dur = 1800, s = performance.now();
    const big = t >= 1000;
    (function tick(now) {
      const p = Math.min((now - s) / dur, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * t);
      el.textContent = big ? v.toLocaleString('es-MX') : v;
      if (p < 1) requestAnimationFrame(tick);
    })(s);
  }
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cntObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

  /* form */
  document.getElementById('cForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const n = document.getElementById('fn').value.trim();
    const em = document.getElementById('fem').value.trim();
    if (!n || !em) { alert('Por favor completa los campos requeridos (Nombre y Correo).'); return; }
    const btn = document.getElementById('btnSend');
    btn.textContent = '¡Solicitud enviada! Te contactaremos pronto.';
    btn.classList.add('ok');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar Solicitud';
      btn.classList.remove('ok');
      btn.disabled = false;
      this.reset();
    }, 4500);
  });
</script>
```

The `new_string`:

```html
<script src="/main.js"></script>
<script>
  /* counter animation */
  function countUp(el) {
    const t = parseInt(el.dataset.target.replace(/,/g, ''));
    const dur = 1800, s = performance.now();
    const big = t >= 1000;
    (function tick(now) {
      const p = Math.min((now - s) / dur, 1);
      const v = Math.round((1 - Math.pow(1 - p, 3)) * t);
      el.textContent = big ? v.toLocaleString('es-MX') : v;
      if (p < 1) requestAnimationFrame(tick);
    })(s);
  }
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cntObs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

  /* form */
  document.getElementById('cForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const n = document.getElementById('fn').value.trim();
    const em = document.getElementById('fem').value.trim();
    if (!n || !em) { alert('Por favor completa los campos requeridos (Nombre y Correo).'); return; }
    const btn = document.getElementById('btnSend');
    btn.textContent = '¡Solicitud enviada! Te contactaremos pronto.';
    btn.classList.add('ok');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Enviar Solicitud';
      btn.classList.remove('ok');
      btn.disabled = false;
      this.reset();
    }, 4500);
  });
</script>
```

- [ ] **Step 3: Verify**

```bash
grep -c 'src="/main.js"' index.html
grep -c 'safer active nav' index.html
curl -s http://localhost:8000/main.js | grep -c 'IntersectionObserver'
```

Expected: `1`, `0` (dead code gone), and a non-zero count.

- [ ] **Step 4: Commit**

```bash
git add main.js index.html
git commit -m "Extract shared nav/menu/scroll-reveal JS into main.js"
```

---

## Task 3: Create `/agencia-aduanal-mexico/index.html`

**Files:**
- Create: `agencia-aduanal-mexico/index.html`

**Interfaces:**
- Consumes: `/style.css` classes from Task 1 (`.page-hero`, `.svc-block`, `.srv-grid`/`.srv-card`, `.faq`, `.cross-links`), `/main.js` from Task 2.
- Produces: URL `/agencia-aduanal-mexico/` linked from the cross-links block of every other service page and from the hub page (Task 4).

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /home/tony/Developer/WebLoginco2026/agencia-aduanal-mexico
```

Write `agencia-aduanal-mexico/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Agencia aduanal en México con 5 patentes y más de 9 años de experiencia. Despacho aduanero para importación y exportación con cumplimiento total.">
  <meta name="keywords" content="agencia aduanal méxico, importación y exportación méxico, despacho aduanero, agencia aduanal">
  <title>Agencia Aduanal en México | Despacho Aduanero – Loginco</title>

  <link rel="canonical" href="https://loginco.com.mx/agencia-aduanal-mexico/">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/img/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/img/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
  <link rel="shortcut icon" href="/favicon.ico">

  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Agencia Aduanal / Despacho Aduanero",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.",
      "url": "https://loginco.com.mx"
    },
    "areaServed": { "@type": "Country", "name": "México" },
    "description": "Agencia aduanal con 5 patentes y más de 9 años de experiencia gestionando despacho aduanero de importación y exportación en México."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://loginco.com.mx/" },
      { "@type": "ListItem", "position": 2, "name": "Agencia Aduanal en México", "item": "https://loginco.com.mx/agencia-aduanal-mexico/" }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué diferencia hay entre una agencia aduanal y un agente aduanal?",
        "acceptedAnswer": { "@type": "Answer", "text": "Una agencia aduanal, como Loginco, opera con varias patentes aduanales y un equipo completo de especialistas, lo que da mayor cobertura y respaldo que depender de un solo agente aduanal individual." }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo toma un despacho aduanero de importación?",
        "acceptedAnswer": { "@type": "Answer", "text": "Depende del tipo de mercancía y los permisos requeridos, pero con la documentación completa la mayoría de los despachos se resuelven en 24 a 72 horas hábiles." }
      },
      {
        "@type": "Question",
        "name": "¿Loginco gestiona exportaciones además de importaciones?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, ofrecemos despacho aduanero completo tanto para importación como para exportación de mercancías hacia y desde México." }
      },
      {
        "@type": "Question",
        "name": "¿En qué aduanas opera Loginco?",
        "acceptedAnswer": { "@type": "Answer", "text": "Operamos principalmente en la aduana de Ciudad Lázaro Cárdenas, Michoacán, con cobertura para operaciones relacionadas en otras aduanas del país." }
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav id="nav">
  <a href="/" class="nav-logo">
    <img src="/img/Logotipo-Horizontal-Comercial.png" alt="Loginco – Agencia Aduanal" decoding="async">
  </a>
  <ul class="nav-ul" id="navUl">
    <li><a href="/">Inicio</a></li>
    <li><a href="/#nosotros">Nosotros</a></li>
    <li><a href="/#servicios">Servicios</a></li>
    <li><a href="/#almacen">Almacén</a></li>
    <li><a href="/#contacto" class="nav-cta">Contacto</a></li>
  </ul>
  <button class="hbg" id="hbg" aria-label="Menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<nav class="mob-nav" id="mobNav">
  <a href="/">Inicio</a>
  <a href="/#nosotros">Nosotros</a>
  <a href="/#servicios">Servicios</a>
  <a href="/#almacen">Almacén</a>
  <a href="/#contacto">Contacto</a>
</nav>

<section class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Inicio</a> / Agencia Aduanal</div>
    <h1 class="rv">Agencia Aduanal en México</h1>
    <p class="rv d1">Despacho aduanero para importación y exportación, con 5 patentes aduanales y más de 9 años de experiencia respaldando operaciones de comercio exterior en México.</p>
    <div class="btn-row rv d2">
      <a href="/#contacto" class="btn btn-teal">Solicitar Cotización</a>
      <a href="/#servicios" class="btn btn-ghost">Ver Todos los Servicios</a>
    </div>
  </div>
</section>

<section class="svc-block">
  <div class="wrap">
    <h2 class="rv">¿Qué es una agencia aduanal?</h2>
    <p class="rv d1">Una agencia aduanal es el intermediario autorizado ante el Servicio de Administración Tributaria (SAT) para gestionar el despacho aduanero de mercancías que entran o salen de México. <strong>Loginco opera con 5 patentes aduanales (3517, 1656, 1627, 3474 y 1927)</strong> desde Ciudad Lázaro Cárdenas, Michoacán, uno de los puertos de mayor movimiento de carga en el Pacífico mexicano.</p>
    <p class="rv d2">Con más de 9 años de experiencia, gestionamos la importación y exportación de mercancías con pleno cumplimiento regulatorio: clasificación arancelaria, pago de contribuciones, gestión de permisos ante dependencias como SAGARPA y COFEPRIS, y coordinación directa con las autoridades aduaneras para evitar demoras y contratiempos en tu operación.</p>
  </div>
</section>

<section class="svc-block" style="padding-top:0;">
  <div class="wrap">
    <div class="srv-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="srv-card rv d1">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.89 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 16h8v2H8v-2zm0-4h8v2H8v-2z"/></svg></div>
        <h3 class="srv-t">Cumplimiento Regulatorio</h3>
        <div class="srv-d">Clasificación arancelaria correcta y gestión completa de permisos y autorizaciones para que tu mercancía cruce la aduana sin contratiempos.</div>
      </div>
      <div class="srv-card rv d2">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 13.41L8.59 12 7.17 13.41 11 17.25l6.83-6.84-1.41-1.41L11 14.41z"/></svg></div>
        <h3 class="srv-t">Experiencia Comprobada</h3>
        <div class="srv-d">9+ años y 5 patentes aduanales respaldando operaciones de importación y exportación en el Pacífico mexicano.</div>
      </div>
      <div class="srv-card rv d3">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        <h3 class="srv-t">Atención Integral</h3>
        <div class="srv-d">Coordinamos despacho aduanero, almacenaje y transporte como un solo servicio, sin intermediarios adicionales.</div>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-item"><h3>¿Qué diferencia hay entre una agencia aduanal y un agente aduanal?</h3><p>Una agencia aduanal, como Loginco, opera con varias patentes aduanales y un equipo completo de especialistas, lo que da mayor cobertura y respaldo que depender de un solo agente aduanal individual.</p></div>
    <div class="faq-item"><h3>¿Cuánto tiempo toma un despacho aduanero de importación?</h3><p>Depende del tipo de mercancía y los permisos requeridos, pero con la documentación completa la mayoría de los despachos se resuelven en 24 a 72 horas hábiles.</p></div>
    <div class="faq-item"><h3>¿Loginco gestiona exportaciones además de importaciones?</h3><p>Sí, ofrecemos despacho aduanero completo tanto para importación como para exportación de mercancías hacia y desde México.</p></div>
    <div class="faq-item"><h3>¿En qué aduanas opera Loginco?</h3><p>Operamos principalmente en la aduana de Ciudad Lázaro Cárdenas, Michoacán, con cobertura para operaciones relacionadas en otras aduanas del país.</p></div>
  </div>
</section>

<section class="cross-links">
  <div class="wrap">
    <h2>Otros Servicios de Comercio Exterior</h2>
    <div class="cross-grid">
      <a class="cross-card" href="/comercio-exterior-mexico/"><h3>Comercio Exterior en México</h3><p>Conoce nuestra logística de importación integral: aduana, almacenaje y transporte en un solo aliado.</p></a>
      <a class="cross-card" href="/deposito-fiscal-mexico/"><h3>Depósito Fiscal</h3><p>Almacenaje y desconsolidación de mercancía en instalaciones de 9,000 m².</p></a>
      <a class="cross-card" href="/transporte-de-carga-mexico/"><h3>Transporte de Carga</h3><p>Flete terrestre nacional con seguimiento continuo de tu mercancía.</p></a>
      <a class="cross-card" href="/envios-de-contenedores-mexico/"><h3>Envíos de Contenedores</h3><p>Flete marítimo internacional con red de navieros en Europa, Asia y América.</p></a>
    </div>
  </div>
</section>

<footer>
  <div class="ft-g">
    <div class="ft-brand">
      <img src="/img/Logotipo-Horizontal-Descriptivo.png" alt="Loginco – Logística Internacional y Comercio Exterior" class="ft-logo" loading="lazy" decoding="async">
      <p>Logística Internacional y Servicios en Comercio Exterior, S.C. Tu solución integral en el comercio global.</p>
      <div class="ft-social">
        <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="ft-col">
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="/#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="/#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="/#nosotros">Nosotros</a></li>
        <li><a href="/#almacen">Infraestructura</a></li>
        <li><a href="/#porque">Por Qué Loginco</a></li>
        <li><a href="/#contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Contacto</h5>
      <ul>
        <li><a href="tel:+527535377838">753 537 7838</a></li>
        <li><a href="mailto:info@loginco.com.mx">info@loginco.com.mx</a></li>
        <li><a href="https://loginco.com.mx" target="_blank" rel="noopener">loginco.com.mx</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bot">
    <p>&copy; 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.</p>
    <div class="ft-pts">Patentes Aduanales: 3517 · 1656 · 1627 · 3474 · 1927</div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify JSON-LD is valid and content is correct**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("agencia-aduanal-mexico/index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
assert len(blocks) == 3, f"expected 3 JSON-LD blocks, found {len(blocks)}"
for b in blocks:
    json.loads(b)
print("OK: 3 valid JSON-LD blocks")
EOF
curl -s http://localhost:8000/agencia-aduanal-mexico/ | grep -o '<h1[^>]*>[^<]*</h1>'
curl -s http://localhost:8000/agencia-aduanal-mexico/ | grep -c 'href="/deposito-fiscal-mexico/"'
```

Expected: `OK: 3 valid JSON-LD blocks`, the H1 text `Agencia Aduanal en México`, and a count of at least `1`.

- [ ] **Step 3: Commit**

```bash
git add agencia-aduanal-mexico/
git commit -m "Add /agencia-aduanal-mexico/ service landing page"
```

---

## Task 4: Create `/comercio-exterior-mexico/index.html` (hub page)

**Files:**
- Create: `comercio-exterior-mexico/index.html`

**Interfaces:**
- Consumes: same shared CSS/JS as Task 3.
- Produces: URL `/comercio-exterior-mexico/`, linked from the other 4 pages' cross-links blocks and from `index.html`'s footer (Task 8).

This page follows the same template as Task 3, but its "otros servicios" block is promoted higher on the page (right after the descriptive intro) since this page's job is to summarize and route to the other 4, per the approved design.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /home/tony/Developer/WebLoginco2026/comercio-exterior-mexico
```

Write `comercio-exterior-mexico/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Soluciones de comercio exterior y logística de importación en México: despacho aduanero, depósito fiscal, flete terrestre y marítimo con Loginco.">
  <meta name="keywords" content="comercio exterior méxico, logística de importación, agencia aduanal, comercio exterior">
  <title>Comercio Exterior en México | Logística de Importación – Loginco</title>

  <link rel="canonical" href="https://loginco.com.mx/comercio-exterior-mexico/">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/img/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/img/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
  <link rel="shortcut icon" href="/favicon.ico">

  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Comercio Exterior / Logística de Importación",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.",
      "url": "https://loginco.com.mx"
    },
    "areaServed": { "@type": "Country", "name": "México" },
    "description": "Soluciones integrales de comercio exterior y logística de importación en México: despacho aduanero, depósito fiscal, flete terrestre y marítimo."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://loginco.com.mx/" },
      { "@type": "ListItem", "position": 2, "name": "Comercio Exterior en México", "item": "https://loginco.com.mx/comercio-exterior-mexico/" }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué servicios de comercio exterior ofrece Loginco?",
        "acceptedAnswer": { "@type": "Answer", "text": "Despacho aduanero, depósito fiscal y almacenaje, transporte de carga terrestre, flete marítimo internacional y gestión de permisos regulatorios." }
      },
      {
        "@type": "Question",
        "name": "¿Por qué Ciudad Lázaro Cárdenas es estratégica para el comercio exterior?",
        "acceptedAnswer": { "@type": "Answer", "text": "Es uno de los puertos de mayor calado del Pacífico mexicano, con conexión ferroviaria y carretera directa al centro y occidente de México, lo que reduce tiempos y costos de logística de importación." }
      },
      {
        "@type": "Question",
        "name": "¿Loginco atiende empresas de cualquier tamaño?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, trabajamos tanto con empresas que importan o exportan de forma recurrente como con operaciones puntuales de comercio exterior." }
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav id="nav">
  <a href="/" class="nav-logo">
    <img src="/img/Logotipo-Horizontal-Comercial.png" alt="Loginco – Agencia Aduanal" decoding="async">
  </a>
  <ul class="nav-ul" id="navUl">
    <li><a href="/">Inicio</a></li>
    <li><a href="/#nosotros">Nosotros</a></li>
    <li><a href="/#servicios">Servicios</a></li>
    <li><a href="/#almacen">Almacén</a></li>
    <li><a href="/#contacto" class="nav-cta">Contacto</a></li>
  </ul>
  <button class="hbg" id="hbg" aria-label="Menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<nav class="mob-nav" id="mobNav">
  <a href="/">Inicio</a>
  <a href="/#nosotros">Nosotros</a>
  <a href="/#servicios">Servicios</a>
  <a href="/#almacen">Almacén</a>
  <a href="/#contacto">Contacto</a>
</nav>

<section class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Inicio</a> / Comercio Exterior</div>
    <h1 class="rv">Comercio Exterior en México</h1>
    <p class="rv d1">Logística de importación integral: agencia aduanal, depósito fiscal, transporte terrestre y marítimo en un solo aliado con más de 9 años de experiencia.</p>
    <div class="btn-row rv d2">
      <a href="/#contacto" class="btn btn-teal">Solicitar Cotización</a>
      <a href="/#servicios" class="btn btn-ghost">Ver Todos los Servicios</a>
    </div>
  </div>
</section>

<section class="svc-block">
  <div class="wrap">
    <h2 class="rv">Un solo aliado para tu comercio exterior</h2>
    <p class="rv d1">México es uno de los países con mayor actividad de comercio exterior en América Latina, con Ciudad Lázaro Cárdenas, Michoacán, consolidado como puerto estratégico del Pacífico para la logística de importación y exportación hacia el centro y occidente del país.</p>
    <p class="rv d2"><strong>Loginco acompaña cada etapa de tu operación de comercio exterior</strong>: desde el despacho aduanero de tu mercancía, pasando por su almacenaje en depósito fiscal, hasta su transporte final por tierra o mar. Una sola agencia aduanal con 5 patentes y 9+ años de experiencia, en vez de coordinar varios proveedores por separado.</p>
  </div>
</section>

<section class="cross-links">
  <div class="wrap">
    <h2>Nuestros Servicios de Comercio Exterior</h2>
    <div class="cross-grid">
      <a class="cross-card" href="/agencia-aduanal-mexico/"><h3>Agencia Aduanal</h3><p>Despacho aduanero para importación y exportación con 5 patentes y cumplimiento regulatorio total.</p></a>
      <a class="cross-card" href="/deposito-fiscal-mexico/"><h3>Depósito Fiscal</h3><p>Almacenaje y desconsolidación de mercancía en instalaciones de 9,000 m² en Ciudad Lázaro Cárdenas.</p></a>
      <a class="cross-card" href="/transporte-de-carga-mexico/"><h3>Transporte de Carga</h3><p>Flete terrestre nacional con seguimiento continuo de tu mercancía hasta su destino final.</p></a>
      <a class="cross-card" href="/envios-de-contenedores-mexico/"><h3>Envíos de Contenedores</h3><p>Flete marítimo internacional con una amplia red de navieros en Europa, Asia y América.</p></a>
    </div>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-item"><h3>¿Qué servicios de comercio exterior ofrece Loginco?</h3><p>Despacho aduanero, depósito fiscal y almacenaje, transporte de carga terrestre, flete marítimo internacional y gestión de permisos regulatorios.</p></div>
    <div class="faq-item"><h3>¿Por qué Ciudad Lázaro Cárdenas es estratégica para el comercio exterior?</h3><p>Es uno de los puertos de mayor calado del Pacífico mexicano, con conexión ferroviaria y carretera directa al centro y occidente de México, lo que reduce tiempos y costos de logística de importación.</p></div>
    <div class="faq-item"><h3>¿Loginco atiende empresas de cualquier tamaño?</h3><p>Sí, trabajamos tanto con empresas que importan o exportan de forma recurrente como con operaciones puntuales de comercio exterior.</p></div>
  </div>
</section>

<footer>
  <div class="ft-g">
    <div class="ft-brand">
      <img src="/img/Logotipo-Horizontal-Descriptivo.png" alt="Loginco – Logística Internacional y Comercio Exterior" class="ft-logo" loading="lazy" decoding="async">
      <p>Logística Internacional y Servicios en Comercio Exterior, S.C. Tu solución integral en el comercio global.</p>
      <div class="ft-social">
        <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="ft-col">
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="/#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="/#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="/#nosotros">Nosotros</a></li>
        <li><a href="/#almacen">Infraestructura</a></li>
        <li><a href="/#porque">Por Qué Loginco</a></li>
        <li><a href="/#contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Contacto</h5>
      <ul>
        <li><a href="tel:+527535377838">753 537 7838</a></li>
        <li><a href="mailto:info@loginco.com.mx">info@loginco.com.mx</a></li>
        <li><a href="https://loginco.com.mx" target="_blank" rel="noopener">loginco.com.mx</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bot">
    <p>&copy; 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.</p>
    <div class="ft-pts">Patentes Aduanales: 3517 · 1656 · 1627 · 3474 · 1927</div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("comercio-exterior-mexico/index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
assert len(blocks) == 3, f"expected 3 JSON-LD blocks, found {len(blocks)}"
for b in blocks:
    json.loads(b)
print("OK: 3 valid JSON-LD blocks")
EOF
curl -s http://localhost:8000/comercio-exterior-mexico/ | grep -c 'cross-card'
```

Expected: `OK: 3 valid JSON-LD blocks` and a count of `4` (one cross-card per other service page).

- [ ] **Step 3: Commit**

```bash
git add comercio-exterior-mexico/
git commit -m "Add /comercio-exterior-mexico/ hub landing page"
```

---

## Task 5: Create `/deposito-fiscal-mexico/index.html`

**Files:**
- Create: `deposito-fiscal-mexico/index.html`

**Interfaces:**
- Consumes: same shared CSS/JS as Task 3.
- Produces: URL `/deposito-fiscal-mexico/`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /home/tony/Developer/WebLoginco2026/deposito-fiscal-mexico
```

Write `deposito-fiscal-mexico/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Depósito fiscal en México con 9,000 m² de instalaciones en Lázaro Cárdenas, Michoacán. Almacenaje y desconsolidación de carga con respaldo aduanal.">
  <meta name="keywords" content="depósito fiscal méxico, almacenaje, desconsolidación, comercio exterior">
  <title>Depósito Fiscal en México | Almacenaje – Loginco</title>

  <link rel="canonical" href="https://loginco.com.mx/deposito-fiscal-mexico/">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/img/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/img/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
  <link rel="shortcut icon" href="/favicon.ico">

  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Depósito Fiscal / Desconsolidación y Almacenaje",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.",
      "url": "https://loginco.com.mx"
    },
    "areaServed": { "@type": "Country", "name": "México" },
    "description": "Depósito fiscal y almacenaje en instalaciones de 9,000 m² en Ciudad Lázaro Cárdenas, Michoacán, con desconsolidación de contenedores."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://loginco.com.mx/" },
      { "@type": "ListItem", "position": 2, "name": "Depósito Fiscal en México", "item": "https://loginco.com.mx/deposito-fiscal-mexico/" }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué mercancía puede entrar a depósito fiscal?",
        "acceptedAnswer": { "@type": "Answer", "text": "La mayoría de las mercancías de comercio exterior, salvo restricciones específicas por tipo de producto o normativa aplicable." }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo puede permanecer la mercancía en depósito fiscal?",
        "acceptedAnswer": { "@type": "Answer", "text": "El plazo depende del régimen aduanero elegido; te asesoramos según el tipo de operación para definir el tiempo óptimo." }
      },
      {
        "@type": "Question",
        "name": "¿El depósito fiscal incluye seguridad de la mercancía?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, nuestras instalaciones cuentan con resguardo, y ofrecemos custodia armada adicional para traslados de alto valor." }
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav id="nav">
  <a href="/" class="nav-logo">
    <img src="/img/Logotipo-Horizontal-Comercial.png" alt="Loginco – Agencia Aduanal" decoding="async">
  </a>
  <ul class="nav-ul" id="navUl">
    <li><a href="/">Inicio</a></li>
    <li><a href="/#nosotros">Nosotros</a></li>
    <li><a href="/#servicios">Servicios</a></li>
    <li><a href="/#almacen">Almacén</a></li>
    <li><a href="/#contacto" class="nav-cta">Contacto</a></li>
  </ul>
  <button class="hbg" id="hbg" aria-label="Menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<nav class="mob-nav" id="mobNav">
  <a href="/">Inicio</a>
  <a href="/#nosotros">Nosotros</a>
  <a href="/#servicios">Servicios</a>
  <a href="/#almacen">Almacén</a>
  <a href="/#contacto">Contacto</a>
</nav>

<section class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Inicio</a> / Depósito Fiscal</div>
    <h1 class="rv">Depósito Fiscal en México</h1>
    <p class="rv d1">Almacenaje y desconsolidación de mercancía bajo régimen de depósito fiscal, en instalaciones de 9,000 m² en Ciudad Lázaro Cárdenas, Michoacán.</p>
    <div class="btn-row rv d2">
      <a href="/#contacto" class="btn btn-teal">Solicitar Cotización</a>
      <a href="/#servicios" class="btn btn-ghost">Ver Todos los Servicios</a>
    </div>
  </div>
</section>

<section class="svc-block">
  <div class="wrap">
    <h2 class="rv">¿Qué es el depósito fiscal?</h2>
    <p class="rv d1">El depósito fiscal es el régimen aduanero que permite almacenar mercancía de comercio exterior sin haber pagado aún los impuestos y aranceles correspondientes, dando flexibilidad a tu operación de importación mientras defines el destino final de la carga.</p>
    <p class="rv d2">Loginco opera instalaciones con <strong>2,200 m² y 550 m² bajo cubierta, más 9,000 m² totales con patio de maniobras</strong>, funcionando como CEDIS estratégico dentro de tu cadena de suministro. Además de almacenaje, ofrecemos desconsolidación de contenedores para fraccionar cargas y distribuirlas según las necesidades de tu negocio.</p>
  </div>
</section>

<section class="svc-block" style="padding-top:0;">
  <div class="wrap">
    <div class="srv-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="srv-card rv d1">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M2 3h20v5H2V3zm1 6h18v12H3V9zm3 2v2h5v-2H6zm0 4v2h5v-2H6zm7 0v2h2v-2h-2z"/></svg></div>
        <h3 class="srv-t">Instalaciones Propias</h3>
        <div class="srv-d">9,000 m² totales, con áreas cubiertas y patio de maniobras en Ciudad Lázaro Cárdenas.</div>
      </div>
      <div class="srv-card rv d2">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg></div>
        <h3 class="srv-t">Desconsolidación</h3>
        <div class="srv-d">Fraccionamos contenedores completos para distribución flexible de tu mercancía.</div>
      </div>
      <div class="srv-card rv d3">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.89 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 16h8v2H8v-2zm0-4h8v2H8v-2z"/></svg></div>
        <h3 class="srv-t">Respaldo Aduanal</h3>
        <div class="srv-d">Al operar bajo nuestras propias patentes, coordinamos el depósito fiscal directamente con el despacho aduanero.</div>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-item"><h3>¿Qué mercancía puede entrar a depósito fiscal?</h3><p>La mayoría de las mercancías de comercio exterior, salvo restricciones específicas por tipo de producto o normativa aplicable.</p></div>
    <div class="faq-item"><h3>¿Cuánto tiempo puede permanecer la mercancía en depósito fiscal?</h3><p>El plazo depende del régimen aduanero elegido; te asesoramos según el tipo de operación para definir el tiempo óptimo.</p></div>
    <div class="faq-item"><h3>¿El depósito fiscal incluye seguridad de la mercancía?</h3><p>Sí, nuestras instalaciones cuentan con resguardo, y ofrecemos custodia armada adicional para traslados de alto valor.</p></div>
  </div>
</section>

<section class="cross-links">
  <div class="wrap">
    <h2>Otros Servicios de Comercio Exterior</h2>
    <div class="cross-grid">
      <a class="cross-card" href="/comercio-exterior-mexico/"><h3>Comercio Exterior en México</h3><p>Conoce nuestra logística de importación integral: aduana, almacenaje y transporte en un solo aliado.</p></a>
      <a class="cross-card" href="/agencia-aduanal-mexico/"><h3>Agencia Aduanal</h3><p>Despacho aduanero para importación y exportación con 5 patentes.</p></a>
      <a class="cross-card" href="/transporte-de-carga-mexico/"><h3>Transporte de Carga</h3><p>Flete terrestre nacional con seguimiento continuo de tu mercancía.</p></a>
      <a class="cross-card" href="/envios-de-contenedores-mexico/"><h3>Envíos de Contenedores</h3><p>Flete marítimo internacional con red de navieros en Europa, Asia y América.</p></a>
    </div>
  </div>
</section>

<footer>
  <div class="ft-g">
    <div class="ft-brand">
      <img src="/img/Logotipo-Horizontal-Descriptivo.png" alt="Loginco – Logística Internacional y Comercio Exterior" class="ft-logo" loading="lazy" decoding="async">
      <p>Logística Internacional y Servicios en Comercio Exterior, S.C. Tu solución integral en el comercio global.</p>
      <div class="ft-social">
        <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="ft-col">
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="/#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="/#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="/#nosotros">Nosotros</a></li>
        <li><a href="/#almacen">Infraestructura</a></li>
        <li><a href="/#porque">Por Qué Loginco</a></li>
        <li><a href="/#contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Contacto</h5>
      <ul>
        <li><a href="tel:+527535377838">753 537 7838</a></li>
        <li><a href="mailto:info@loginco.com.mx">info@loginco.com.mx</a></li>
        <li><a href="https://loginco.com.mx" target="_blank" rel="noopener">loginco.com.mx</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bot">
    <p>&copy; 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.</p>
    <div class="ft-pts">Patentes Aduanales: 3517 · 1656 · 1627 · 3474 · 1927</div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("deposito-fiscal-mexico/index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
assert len(blocks) == 3, f"expected 3 JSON-LD blocks, found {len(blocks)}"
for b in blocks:
    json.loads(b)
print("OK: 3 valid JSON-LD blocks")
EOF
curl -s http://localhost:8000/deposito-fiscal-mexico/ | grep -o '<h1[^>]*>[^<]*</h1>'
```

Expected: `OK: 3 valid JSON-LD blocks` and H1 text `Depósito Fiscal en México`.

- [ ] **Step 3: Commit**

```bash
git add deposito-fiscal-mexico/
git commit -m "Add /deposito-fiscal-mexico/ service landing page"
```

---

## Task 6: Create `/transporte-de-carga-mexico/index.html`

**Files:**
- Create: `transporte-de-carga-mexico/index.html`

**Interfaces:**
- Consumes: same shared CSS/JS as Task 3.
- Produces: URL `/transporte-de-carga-mexico/`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /home/tony/Developer/WebLoginco2026/transporte-de-carga-mexico
```

Write `transporte-de-carga-mexico/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Transporte de carga terrestre en México con seguimiento continuo de tu mercancía. Servicio nacional respaldado por una agencia aduanal con 9+ años.">
  <meta name="keywords" content="transporte de carga méxico, flete terrestre, comercio exterior">
  <title>Transporte de Carga en México | Flete Terrestre – Loginco</title>

  <link rel="canonical" href="https://loginco.com.mx/transporte-de-carga-mexico/">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/img/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/img/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
  <link rel="shortcut icon" href="/favicon.ico">

  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Transporte de Carga / Flete Terrestre",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.",
      "url": "https://loginco.com.mx"
    },
    "areaServed": { "@type": "Country", "name": "México" },
    "description": "Transporte de carga terrestre local y nacional en México, con seguimiento continuo desde Ciudad Lázaro Cárdenas, Michoacán."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://loginco.com.mx/" },
      { "@type": "ListItem", "position": 2, "name": "Transporte de Carga en México", "item": "https://loginco.com.mx/transporte-de-carga-mexico/" }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Loginco transporta carga a cualquier estado de México?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, ofrecemos flete terrestre nacional, con mayor cobertura hacia el centro y occidente del país desde Ciudad Lázaro Cárdenas." }
      },
      {
        "@type": "Question",
        "name": "¿Puedo contratar solo el transporte sin el despacho aduanero?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, aunque la mayoría de nuestros clientes aprovechan el servicio integral de comercio exterior de principio a fin." }
      },
      {
        "@type": "Question",
        "name": "¿Qué tipo de mercancía puede transportar Loginco?",
        "acceptedAnswer": { "@type": "Answer", "text": "Manejamos carga general y mercancía de alto valor, con opción de custodia armada cuando la operación lo requiere." }
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav id="nav">
  <a href="/" class="nav-logo">
    <img src="/img/Logotipo-Horizontal-Comercial.png" alt="Loginco – Agencia Aduanal" decoding="async">
  </a>
  <ul class="nav-ul" id="navUl">
    <li><a href="/">Inicio</a></li>
    <li><a href="/#nosotros">Nosotros</a></li>
    <li><a href="/#servicios">Servicios</a></li>
    <li><a href="/#almacen">Almacén</a></li>
    <li><a href="/#contacto" class="nav-cta">Contacto</a></li>
  </ul>
  <button class="hbg" id="hbg" aria-label="Menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<nav class="mob-nav" id="mobNav">
  <a href="/">Inicio</a>
  <a href="/#nosotros">Nosotros</a>
  <a href="/#servicios">Servicios</a>
  <a href="/#almacen">Almacén</a>
  <a href="/#contacto">Contacto</a>
</nav>

<section class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Inicio</a> / Transporte de Carga</div>
    <h1 class="rv">Transporte de Carga en México</h1>
    <p class="rv d1">Flete terrestre nacional con seguimiento continuo, respaldado por una agencia aduanal con más de 9 años de experiencia en comercio exterior.</p>
    <div class="btn-row rv d2">
      <a href="/#contacto" class="btn btn-teal">Solicitar Cotización</a>
      <a href="/#servicios" class="btn btn-ghost">Ver Todos los Servicios</a>
    </div>
  </div>
</section>

<section class="svc-block">
  <div class="wrap">
    <h2 class="rv">Transporte de carga con seguimiento continuo</h2>
    <p class="rv d1">El transporte de carga es la etapa que conecta tu mercancía, ya despachada en aduana, con su destino final dentro de México. Loginco ofrece <strong>flete terrestre local y nacional</strong>, con seguimiento continuo durante todo el trayecto para garantizar la integridad y puntualidad de tu carga.</p>
    <p class="rv d2">Al operar transporte de carga y despacho aduanero bajo un mismo proveedor, evitas la coordinación entre múltiples empresas y reduces los tiempos muertos entre que tu mercancía sale de la aduana y llega a su destino.</p>
  </div>
</section>

<section class="svc-block" style="padding-top:0;">
  <div class="wrap">
    <div class="srv-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="srv-card rv d1">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg></div>
        <h3 class="srv-t">Seguimiento Continuo</h3>
        <div class="srv-d">Monitoreo de tu carga durante todo el trayecto terrestre.</div>
      </div>
      <div class="srv-card rv d2">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        <h3 class="srv-t">Cobertura Nacional</h3>
        <div class="srv-d">Rutas locales y nacionales desde Ciudad Lázaro Cárdenas hacia el resto de México.</div>
      </div>
      <div class="srv-card rv d3">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 13.41L8.59 12 7.17 13.41 11 17.25l6.83-6.84-1.41-1.41L11 14.41z"/></svg></div>
        <h3 class="srv-t">Custodia Disponible</h3>
        <div class="srv-d">Protección armada para mercancía de alto valor en rutas urbanas y carreteras.</div>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-item"><h3>¿Loginco transporta carga a cualquier estado de México?</h3><p>Sí, ofrecemos flete terrestre nacional, con mayor cobertura hacia el centro y occidente del país desde Ciudad Lázaro Cárdenas.</p></div>
    <div class="faq-item"><h3>¿Puedo contratar solo el transporte sin el despacho aduanero?</h3><p>Sí, aunque la mayoría de nuestros clientes aprovechan el servicio integral de comercio exterior de principio a fin.</p></div>
    <div class="faq-item"><h3>¿Qué tipo de mercancía puede transportar Loginco?</h3><p>Manejamos carga general y mercancía de alto valor, con opción de custodia armada cuando la operación lo requiere.</p></div>
  </div>
</section>

<section class="cross-links">
  <div class="wrap">
    <h2>Otros Servicios de Comercio Exterior</h2>
    <div class="cross-grid">
      <a class="cross-card" href="/comercio-exterior-mexico/"><h3>Comercio Exterior en México</h3><p>Conoce nuestra logística de importación integral: aduana, almacenaje y transporte en un solo aliado.</p></a>
      <a class="cross-card" href="/agencia-aduanal-mexico/"><h3>Agencia Aduanal</h3><p>Despacho aduanero para importación y exportación con 5 patentes.</p></a>
      <a class="cross-card" href="/deposito-fiscal-mexico/"><h3>Depósito Fiscal</h3><p>Almacenaje y desconsolidación de mercancía en instalaciones de 9,000 m².</p></a>
      <a class="cross-card" href="/envios-de-contenedores-mexico/"><h3>Envíos de Contenedores</h3><p>Flete marítimo internacional con red de navieros en Europa, Asia y América.</p></a>
    </div>
  </div>
</section>

<footer>
  <div class="ft-g">
    <div class="ft-brand">
      <img src="/img/Logotipo-Horizontal-Descriptivo.png" alt="Loginco – Logística Internacional y Comercio Exterior" class="ft-logo" loading="lazy" decoding="async">
      <p>Logística Internacional y Servicios en Comercio Exterior, S.C. Tu solución integral en el comercio global.</p>
      <div class="ft-social">
        <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="ft-col">
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="/#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="/#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="/#nosotros">Nosotros</a></li>
        <li><a href="/#almacen">Infraestructura</a></li>
        <li><a href="/#porque">Por Qué Loginco</a></li>
        <li><a href="/#contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Contacto</h5>
      <ul>
        <li><a href="tel:+527535377838">753 537 7838</a></li>
        <li><a href="mailto:info@loginco.com.mx">info@loginco.com.mx</a></li>
        <li><a href="https://loginco.com.mx" target="_blank" rel="noopener">loginco.com.mx</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bot">
    <p>&copy; 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.</p>
    <div class="ft-pts">Patentes Aduanales: 3517 · 1656 · 1627 · 3474 · 1927</div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("transporte-de-carga-mexico/index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
assert len(blocks) == 3, f"expected 3 JSON-LD blocks, found {len(blocks)}"
for b in blocks:
    json.loads(b)
print("OK: 3 valid JSON-LD blocks")
EOF
curl -s http://localhost:8000/transporte-de-carga-mexico/ | grep -o '<h1[^>]*>[^<]*</h1>'
```

Expected: `OK: 3 valid JSON-LD blocks` and H1 text `Transporte de Carga en México`.

- [ ] **Step 3: Commit**

```bash
git add transporte-de-carga-mexico/
git commit -m "Add /transporte-de-carga-mexico/ service landing page"
```

---

## Task 7: Create `/envios-de-contenedores-mexico/index.html`

**Files:**
- Create: `envios-de-contenedores-mexico/index.html`

**Interfaces:**
- Consumes: same shared CSS/JS as Task 3.
- Produces: URL `/envios-de-contenedores-mexico/`.

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p /home/tony/Developer/WebLoginco2026/envios-de-contenedores-mexico
```

Write `envios-de-contenedores-mexico/index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Envíos de contenedores a México por flete marítimo, con red de navieros que conecta los principales puertos de Europa, Asia y América.">
  <meta name="keywords" content="envíos de contenedores a méxico, flete marítimo, comercio exterior">
  <title>Envíos de Contenedores a México | Flete Marítimo – Loginco</title>

  <link rel="canonical" href="https://loginco.com.mx/envios-de-contenedores-mexico/">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/img/favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/img/favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="/img/apple-touch-icon.png" sizes="180x180">
  <link rel="shortcut icon" href="/favicon.ico">

  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Envíos de Contenedores / Flete Marítimo",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.",
      "url": "https://loginco.com.mx"
    },
    "areaServed": { "@type": "Country", "name": "México" },
    "description": "Envíos de contenedores a México por flete marítimo internacional, con red de navieros que conecta Europa, Asia y América con Ciudad Lázaro Cárdenas."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://loginco.com.mx/" },
      { "@type": "ListItem", "position": 2, "name": "Envíos de Contenedores a México", "item": "https://loginco.com.mx/envios-de-contenedores-mexico/" }
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué tipo de contenedores maneja Loginco?",
        "acceptedAnswer": { "@type": "Answer", "text": "Contenedores completos (FCL) y consolidados, según el volumen y tipo de mercancía de tu envío." }
      },
      {
        "@type": "Question",
        "name": "¿Desde qué regiones puedo enviar contenedores a México con Loginco?",
        "acceptedAnswer": { "@type": "Answer", "text": "Nuestra red de navieros cubre las principales rutas desde Europa, Asia y América hacia el puerto de Ciudad Lázaro Cárdenas." }
      },
      {
        "@type": "Question",
        "name": "¿Loginco se encarga del despacho aduanero del contenedor al llegar?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí, coordinamos el despacho aduanero, almacenaje en depósito fiscal y transporte terrestre como parte del mismo servicio." }
      }
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"></noscript>

  <link rel="stylesheet" href="/style.css">
</head>
<body>

<nav id="nav">
  <a href="/" class="nav-logo">
    <img src="/img/Logotipo-Horizontal-Comercial.png" alt="Loginco – Agencia Aduanal" decoding="async">
  </a>
  <ul class="nav-ul" id="navUl">
    <li><a href="/">Inicio</a></li>
    <li><a href="/#nosotros">Nosotros</a></li>
    <li><a href="/#servicios">Servicios</a></li>
    <li><a href="/#almacen">Almacén</a></li>
    <li><a href="/#contacto" class="nav-cta">Contacto</a></li>
  </ul>
  <button class="hbg" id="hbg" aria-label="Menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<nav class="mob-nav" id="mobNav">
  <a href="/">Inicio</a>
  <a href="/#nosotros">Nosotros</a>
  <a href="/#servicios">Servicios</a>
  <a href="/#almacen">Almacén</a>
  <a href="/#contacto">Contacto</a>
</nav>

<section class="page-hero">
  <div class="wrap">
    <div class="breadcrumb"><a href="/">Inicio</a> / Envíos de Contenedores</div>
    <h1 class="rv">Envíos de Contenedores a México</h1>
    <p class="rv d1">Flete marítimo internacional con una amplia red de navieros que conecta los principales puertos de Europa, Asia y América con México.</p>
    <div class="btn-row rv d2">
      <a href="/#contacto" class="btn btn-teal">Solicitar Cotización</a>
      <a href="/#servicios" class="btn btn-ghost">Ver Todos los Servicios</a>
    </div>
  </div>
</section>

<section class="svc-block">
  <div class="wrap">
    <h2 class="rv">Flete marítimo con cobertura global</h2>
    <p class="rv d1">Loginco cuenta con una <strong>amplia red de navieros</strong> que conecta los principales puertos de Europa, Asia y América con Ciudad Lázaro Cárdenas, Michoacán, uno de los puertos de mayor movimiento de contenedores del Pacífico mexicano.</p>
    <p class="rv d2">Cubrimos todas las rutas internacionales relevantes para tu envío de contenedores a México, coordinando directamente con los mejores operadores del mercado global y complementando el servicio con despacho aduanero, depósito fiscal y transporte terrestre hasta el destino final.</p>
  </div>
</section>

<section class="svc-block" style="padding-top:0;">
  <div class="wrap">
    <div class="srv-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="srv-card rv d1">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg></div>
        <h3 class="srv-t">Red Global de Navieros</h3>
        <div class="srv-d">Conexión con los principales puertos de Europa, Asia y América.</div>
      </div>
      <div class="srv-card rv d2">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>
        <h3 class="srv-t">Puerto Estratégico</h3>
        <div class="srv-d">Ciudad Lázaro Cárdenas, punto clave de entrada al Pacífico mexicano.</div>
      </div>
      <div class="srv-card rv d3">
        <div class="srv-ico"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.89 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 16h8v2H8v-2zm0-4h8v2H8v-2z"/></svg></div>
        <h3 class="srv-t">Servicio Integral</h3>
        <div class="srv-d">Del contenedor al destino final: aduana, depósito fiscal y transporte terrestre.</div>
      </div>
    </div>
  </div>
</section>

<section class="faq">
  <div class="wrap">
    <h2>Preguntas Frecuentes</h2>
    <div class="faq-item"><h3>¿Qué tipo de contenedores maneja Loginco?</h3><p>Contenedores completos (FCL) y consolidados, según el volumen y tipo de mercancía de tu envío.</p></div>
    <div class="faq-item"><h3>¿Desde qué regiones puedo enviar contenedores a México con Loginco?</h3><p>Nuestra red de navieros cubre las principales rutas desde Europa, Asia y América hacia el puerto de Ciudad Lázaro Cárdenas.</p></div>
    <div class="faq-item"><h3>¿Loginco se encarga del despacho aduanero del contenedor al llegar?</h3><p>Sí, coordinamos el despacho aduanero, almacenaje en depósito fiscal y transporte terrestre como parte del mismo servicio.</p></div>
  </div>
</section>

<section class="cross-links">
  <div class="wrap">
    <h2>Otros Servicios de Comercio Exterior</h2>
    <div class="cross-grid">
      <a class="cross-card" href="/comercio-exterior-mexico/"><h3>Comercio Exterior en México</h3><p>Conoce nuestra logística de importación integral: aduana, almacenaje y transporte en un solo aliado.</p></a>
      <a class="cross-card" href="/agencia-aduanal-mexico/"><h3>Agencia Aduanal</h3><p>Despacho aduanero para importación y exportación con 5 patentes.</p></a>
      <a class="cross-card" href="/deposito-fiscal-mexico/"><h3>Depósito Fiscal</h3><p>Almacenaje y desconsolidación de mercancía en instalaciones de 9,000 m².</p></a>
      <a class="cross-card" href="/transporte-de-carga-mexico/"><h3>Transporte de Carga</h3><p>Flete terrestre nacional con seguimiento continuo de tu mercancía.</p></a>
    </div>
  </div>
</section>

<footer>
  <div class="ft-g">
    <div class="ft-brand">
      <img src="/img/Logotipo-Horizontal-Descriptivo.png" alt="Loginco – Logística Internacional y Comercio Exterior" class="ft-logo" loading="lazy" decoding="async">
      <p>Logística Internacional y Servicios en Comercio Exterior, S.C. Tu solución integral en el comercio global.</p>
      <div class="ft-social">
        <a href="https://facebook.com" target="_blank" rel="noopener" class="soc" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
      </div>
    </div>
    <div class="ft-col">
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="/#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="/#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Empresa</h5>
      <ul>
        <li><a href="/#nosotros">Nosotros</a></li>
        <li><a href="/#almacen">Infraestructura</a></li>
        <li><a href="/#porque">Por Qué Loginco</a></li>
        <li><a href="/#contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="ft-col">
      <h5>Contacto</h5>
      <ul>
        <li><a href="tel:+527535377838">753 537 7838</a></li>
        <li><a href="mailto:info@loginco.com.mx">info@loginco.com.mx</a></li>
        <li><a href="https://loginco.com.mx" target="_blank" rel="noopener">loginco.com.mx</a></li>
      </ul>
    </div>
  </div>
  <div class="ft-bot">
    <p>&copy; 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C.</p>
    <div class="ft-pts">Patentes Aduanales: 3517 · 1656 · 1627 · 3474 · 1927</div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("envios-de-contenedores-mexico/index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
assert len(blocks) == 3, f"expected 3 JSON-LD blocks, found {len(blocks)}"
for b in blocks:
    json.loads(b)
print("OK: 3 valid JSON-LD blocks")
EOF
curl -s http://localhost:8000/envios-de-contenedores-mexico/ | grep -o '<h1[^>]*>[^<]*</h1>'
```

Expected: `OK: 3 valid JSON-LD blocks` and H1 text `Envíos de Contenedores a México`.

- [ ] **Step 3: Commit**

```bash
git add envios-de-contenedores-mexico/
git commit -m "Add /envios-de-contenedores-mexico/ service landing page"
```

---

## Task 8: Link the 4 mapped service cards and footer in `index.html`, add `url` to JSON-LD offers

**Files:**
- Modify: `index.html` (servicios cards, footer, JSON-LD `hasOfferCatalog`)

**Interfaces:**
- Consumes: the 5 URLs created in Tasks 3-7.

- [ ] **Step 1: Turn the 4 mapped service cards into links**

Use the Edit tool, 4 separate replacements in `index.html`:

Replacement 1 — Despacho Aduanero card:
- `old_string`:
```html
      <div class="srv-card rv d1">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.89 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 16h8v2H8v-2zm0-4h8v2H8v-2z"/></svg>
        </div>
        <h3 class="srv-t">Despacho Aduanero</h3>
        <div class="srv-d">Rapidez y eficacia para tus despachos de importación y exportación. Gestionamos todos los trámites aduanales con precisión, experiencia y pleno cumplimiento regulatorio.</div>
      </div>
```
- `new_string`:
```html
      <a class="srv-card rv d1" href="/agencia-aduanal-mexico/">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.89 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5 18.5 9H13V3.5zM8 16h8v2H8v-2zm0-4h8v2H8v-2z"/></svg>
        </div>
        <h3 class="srv-t">Despacho Aduanero</h3>
        <div class="srv-d">Rapidez y eficacia para tus despachos de importación y exportación. Gestionamos todos los trámites aduanales con precisión, experiencia y pleno cumplimiento regulatorio.</div>
      </a>
```

Replacement 2 — Desconsolidación & Almacenaje card:
- `old_string`:
```html
      <div class="srv-card rv d2">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M2 3h20v5H2V3zm1 6h18v12H3V9zm3 2v2h5v-2H6zm0 4v2h5v-2H6zm7 0v2h2v-2h-2z"/></svg>
        </div>
        <h3 class="srv-t">Desconsolidación &amp; Almacenaje</h3>
        <div class="srv-d">Instalaciones con 2,200 m² y 550 m² bajo cubierta, más 9,000 m² totales con patio de maniobras. Funciona como CEDIS estratégico en tu cadena de suministro.</div>
      </div>
```
- `new_string`:
```html
      <a class="srv-card rv d2" href="/deposito-fiscal-mexico/">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M2 3h20v5H2V3zm1 6h18v12H3V9zm3 2v2h5v-2H6zm0 4v2h5v-2H6zm7 0v2h2v-2h-2z"/></svg>
        </div>
        <h3 class="srv-t">Desconsolidación &amp; Almacenaje</h3>
        <div class="srv-d">Instalaciones con 2,200 m² y 550 m² bajo cubierta, más 9,000 m² totales con patio de maniobras. Funciona como CEDIS estratégico en tu cadena de suministro.</div>
      </a>
```

Replacement 3 — Flete Terrestre card:
- `old_string`:
```html
      <div class="srv-card rv d4">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <h3 class="srv-t">Flete Terrestre</h3>
        <div class="srv-d">Transporte local y nacional de mercancías rápido y eficiente. Tu carga recibe seguimiento continuo durante todo el trayecto, garantizando su integridad y puntualidad.</div>
      </div>
```
- `new_string`:
```html
      <a class="srv-card rv d4" href="/transporte-de-carga-mexico/">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <h3 class="srv-t">Flete Terrestre</h3>
        <div class="srv-d">Transporte local y nacional de mercancías rápido y eficiente. Tu carga recibe seguimiento continuo durante todo el trayecto, garantizando su integridad y puntualidad.</div>
      </a>
```

Replacement 4 — Flete Marítimo card:
- `old_string`:
```html
      <div class="srv-card rv d5">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>
        </div>
        <h3 class="srv-t">Flete Marítimo</h3>
        <div class="srv-d">Amplia red de navieros que conecta los principales puertos de Europa, Asia y América. Cubrimos todas las rutas internacionales con los mejores operadores del mercado global.</div>
      </div>
```
- `new_string`:
```html
      <a class="srv-card rv d5" href="/envios-de-contenedores-mexico/">
        <div class="srv-ico">
          <svg viewBox="0 0 24 24"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>
        </div>
        <h3 class="srv-t">Flete Marítimo</h3>
        <div class="srv-d">Amplia red de navieros que conecta los principales puertos de Europa, Asia y América. Cubrimos todas las rutas internacionales con los mejores operadores del mercado global.</div>
      </a>
```

- [ ] **Step 2: Update the footer service links and add the hub link**

- `old_string`:
```html
      <h5>Servicios</h5>
      <ul>
        <li><a href="#servicios">Despacho Aduanero</a></li>
        <li><a href="#servicios">Almacenaje</a></li>
        <li><a href="#servicios">Custodia</a></li>
        <li><a href="#servicios">Flete Terrestre</a></li>
        <li><a href="#servicios">Flete Marítimo</a></li>
        <li><a href="#servicios">Gestión de Permisos</a></li>
      </ul>
```
- `new_string`:
```html
      <h5>Servicios</h5>
      <ul>
        <li><a href="/agencia-aduanal-mexico/">Despacho Aduanero</a></li>
        <li><a href="/deposito-fiscal-mexico/">Almacenaje</a></li>
        <li><a href="#servicios">Custodia</a></li>
        <li><a href="/transporte-de-carga-mexico/">Flete Terrestre</a></li>
        <li><a href="/envios-de-contenedores-mexico/">Flete Marítimo</a></li>
        <li><a href="#servicios">Gestión de Permisos</a></li>
        <li><a href="/comercio-exterior-mexico/">Comercio Exterior en México</a></li>
      </ul>
```

- [ ] **Step 3: Add `url` to the 4 mapped offers in the JSON-LD `hasOfferCatalog`**

Read the current `hasOfferCatalog` block first (`index.html:57-66` per the original file) to get the exact current text, then replace it.

- `old_string`:
```html
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios Aduanales y Logísticos",
          "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Despacho Aduanero"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Desconsolidación y Almacenaje"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Custodia de Carga"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Flete Terrestre"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Flete Marítimo"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Gestión de Permisos Regulatorios"}}
          ]
        },
```
- `new_string`:
```html
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios Aduanales y Logísticos",
          "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Despacho Aduanero", "url": "https://loginco.com.mx/agencia-aduanal-mexico/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Desconsolidación y Almacenaje", "url": "https://loginco.com.mx/deposito-fiscal-mexico/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Custodia de Carga"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Flete Terrestre", "url": "https://loginco.com.mx/transporte-de-carga-mexico/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Flete Marítimo", "url": "https://loginco.com.mx/envios-de-contenedores-mexico/"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Gestión de Permisos Regulatorios"}}
          ]
        },
```

- [ ] **Step 4: Verify**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, json
html = open("index.html", encoding="utf-8").read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
for b in blocks:
    json.loads(b)
print("OK: index.html JSON-LD still valid")
EOF
grep -c 'href="/agencia-aduanal-mexico/"' index.html
grep -c 'href="/comercio-exterior-mexico/"' index.html
curl -s http://localhost:8000/ | grep -o '<a class="srv-card rv d1" href="[^"]*"'
```

Expected: `OK: index.html JSON-LD still valid`, each grep count `≥1`, and the last `curl` showing `href="/agencia-aduanal-mexico/"`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Link homepage service cards and footer to new SEO service pages"
```

---

## Task 9: Add the 5 new URLs to `sitemap.xml`

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Read current sitemap.xml and add the 5 new URLs**

- `old_string`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://loginco.com.mx/</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
- `new_string`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://loginco.com.mx/</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://loginco.com.mx/agencia-aduanal-mexico/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://loginco.com.mx/comercio-exterior-mexico/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://loginco.com.mx/deposito-fiscal-mexico/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://loginco.com.mx/transporte-de-carga-mexico/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://loginco.com.mx/envios-de-contenedores-mexico/</loc>
    <lastmod>2026-07-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify well-formed XML**

```bash
python3 -c "import xml.dom.minidom; xml.dom.minidom.parse('sitemap.xml'); print('OK: valid XML')"
grep -c '<loc>' sitemap.xml
```

Expected: `OK: valid XML` and `6`.

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml
git commit -m "Add 5 new service pages to sitemap.xml"
```

---

## Task 10: Full-site verification

**Files:** none (verification only)

- [ ] **Step 1: Confirm every internal link across all 6 pages resolves (no 404s)**

```bash
cd /home/tony/Developer/WebLoginco2026
python3 - <<'EOF'
import re, urllib.request

pages = [
    "/", "/agencia-aduanal-mexico/", "/comercio-exterior-mexico/",
    "/deposito-fiscal-mexico/", "/transporte-de-carga-mexico/",
    "/envios-de-contenedores-mexico/",
]
base = "http://localhost:8000"
seen_paths = set()
for p in pages:
    html = urllib.request.urlopen(base + p).read().decode("utf-8")
    for href in re.findall(r'href="(/[^"#]*)"', html):
        seen_paths.add(href)

for path in sorted(seen_paths):
    if path in ("/style.css", "/main.js", "/favicon.ico"):
        continue
    url = base + path
    try:
        code = urllib.request.urlopen(url).getcode()
        status = "OK" if code == 200 else f"HTTP {code}"
    except Exception as e:
        status = f"FAIL ({e})"
    print(f"{status:10s} {path}")
EOF
```

Expected: `OK` for every internal path (`/`, all 5 slugs, `/img/...` assets referenced). Investigate and fix any `FAIL` or non-`OK` line before proceeding — most likely cause is a missing leading `/` on an asset or link.

- [ ] **Step 2: Manual browser check**

Open `http://localhost:8000/` and click through:
- Each of the 4 linked service cards in `#servicios` → lands on the right page.
- Footer "Comercio Exterior en México" link → lands on the hub page.
- From `/comercio-exterior-mexico/`, click each of the 4 cross-link cards → lands on the right page.
- On a subpage, click "Inicio" in the nav → returns to `/`.
- On a subpage, resize to mobile width and confirm the hamburger menu opens/closes (verifies `main.js` wiring).

- [ ] **Step 3: Stop the local server**

```bash
kill %1 2>/dev/null || pkill -f "http.server 8000"
```

- [ ] **Step 4: Final review**

Confirm `git log --oneline -10` shows one commit per task (CSS extraction, JS extraction, 5 pages, homepage linking, sitemap), and `git status` is clean.

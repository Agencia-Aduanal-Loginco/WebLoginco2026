# Loginco – Agencia Aduanal (WebLoginco2026)

## Sistema tipográfico establecido
- `--font-display`: 'Gentona', 'Montserrat', sans-serif — headings hero y section h2
- `--font-heading`: 'Montserrat', sans-serif — UI labels, botones, stats, nav
- `--font-body`: 'Inter', sans-serif — body text, inputs/formularios

## Fuentes y origen
- **Montserrat**: TODAS las variantes locales en `/font/` (Thin–Black + Italics)
- **Gentona**: local en `/font/Gentona.otf` (un solo peso: Regular 400), uso display
- **Inter**: Google Fonts (sin archivo local disponible)

## Dónde se usa Gentona (font-display)
- `.hero-h1` — headline principal del hero (font-weight:400, letter-spacing:-.02em)
- `.h2` — section headings en todo el sitio (font-weight:400, letter-spacing:-.01em)
- `.perm-txt h3` — heading de la banda de permisos (font-weight:400)

## Paleta de colores
- `--navy: #00018d` | `--blue: #3839bc` | `--lavender: #7e71b7`
- `--teal: #08b8b5` | `--teal-d: #069896`
- `--dark: #12132a` | `--bg: #f4f6fb` | `--white: #ffffff`
- `--muted: #7a8499` | `--border: #e8ecf5`

## Arquitectura del proyecto
- Un solo archivo: `/home/tony/Developer/WebLoginco2026/index.html` (CSS inline en `<style>`)
- `/home/tony/Developer/WebLoginco2026/style.css` — vacío (no usar)
- `/home/tony/Developer/WebLoginco2026/font/` — fuentes locales
- `/home/tony/Developer/WebLoginco2026/img/` — imágenes

## Sector y contexto
- Agencia aduanal mexicana con 9+ años de experiencia
- Público: importadores/exportadores, empresas de comercio exterior
- Tono: confianza, eficiencia, profesionalismo corporativo

## Convenciones CSS
- Variables con `--` para colores, sombras, border-radius, timing
- Nomenclatura descriptiva funcional (`.hero-h1`, `.srv-card`, `.stat-n`)
- No usa BEM — clases cortas y descriptivas
- Breakpoints: 1024px, 900px, 768px, 500px
- Animaciones con `IntersectionObserver` y clase `.rv` + `.in`

## Decisiones de UX/UI relevantes
- Gentona se aplica con `font-weight:400` porque es una display font de un solo peso;
  el impacto visual viene del tamaño y tracking negativo, no del weight
- `@font-face` con `font-display: swap` en todos los pesos locales para evitar FOIT
- El fallback de `--font-display` incluye Montserrat antes de sans-serif por consistencia
- Google Fonts link solo carga Inter (Montserrat eliminado de CDN por ser local)

## Detalles técnicos
- 973 líneas total en index.html (al momento de la sesión)
- 20 declaraciones `@font-face` para Montserrat (10 pesos x 2 estilos)
- 1 declaración `@font-face` para Gentona

# Rendimiento / Core Web Vitals

Optimizaciones aplicadas en la rama `perf/core-web-vitals` (2026-08-27) para
subir la puntuación de PageSpeed Insights en móvil (partía de 88: FCP 2.6 s,
LCP 2.9 s, Speed Index 4.7 s).

## Cambios en el repo

### 1. Fuentes: de `.otf` sin comprimir a `woff2` subconjunto latin
- **Antes:** `style.css` declaraba 18 `@font-face` de Montserrat apuntando a
  archivos `.otf` de ~230 KB cada uno (en `/font/`). En móvil se descargaban
  varios cientos de KB de fuente sin comprimir. Inter venía de Google Fonts.
- **Ahora:** archivos locales `woff2`, subconjunto latin, solo los pesos usados:
  - `font/montserrat-{400,500,600,700,800,900}.woff2` (~16 KB c/u)
  - `font/inter.woff2` — fuente **variable** 100–900 (~48 KB, un solo archivo)
- Se eliminaron los 19 `.otf` (Montserrat + Gentona sin uso). El original se
  conserva en el historial de git si hiciera falta regenerar.
- Se quitó por completo la carga desde `fonts.googleapis.com` /
  `fonts.gstatic.com` (2 `preconnect` + 1 CSS de terceros en la ruta crítica).

**Regenerar los subconjuntos** (si se cambian pesos o glifos):
```bash
python3 -m venv .venv && .venv/bin/pip install fonttools brotli
SUBSET="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
.venv/bin/pyftsubset font/Montserrat-Regular.otf --unicodes="$SUBSET" \
  --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk" --flavor=woff2 \
  --desubroutinize --output-file=font/montserrat-400.woff2
# inter.woff2 se descargó tal cual del subconjunto "latin" de Google Fonts (v20)
```

### 2. CSS
- `style.css` (fuente) → `style.min.css` (servido), minificado con
  `npx lightningcss-cli --minify` (32 KB → 22 KB, ~4.5 KB con brotli).
- Referenciado con `?v=AAAAMMDD` para invalidar caché en cada despliegue.
- Añadido bloque `@media (prefers-reduced-motion: reduce)` que desactiva las
  animaciones en bucle (glows con `blur(80px)`) para GPU de gama baja.

**Regenerar** tras editar `style.css`:
```bash
npx lightningcss-cli --minify --targets ">= 0.25%" style.css -o style.min.css
```
Y subir el número de `?v=` en los 6 `index.html`.

### 3. Imágenes de logotipo
Los logos se renderizan como silueta blanca (`filter:brightness(0) invert(1)`),
así que se redujeron a su tamaño real de pantalla (2×) y se aplanaron a blanco:

| Antes | px | peso | Ahora | px | peso |
|---|---|---|---|---|---|
| `Logotipo-Horizontal-Comercial.png` | 2363×680 | 53 KB | `logo-nav.png` | 334×96 | 4.8 KB |
| `Logotipo-Vertical-Descriptivo.png` | 2213×1881 | 136 KB | `logo-hero.png` | 224×190 | 9.6 KB |
| `Logotipo-Horizontal-Descriptivo.png` | 2363×680 | 72 KB | `logo-footer.png` | 320×92 | 6.6 KB |

Los PNG originales grandes se conservan porque el JSON-LD (`logo`, `image`) los
referencia como URL absolutas (Google los quiere en alta resolución para el
schema). Todos los `<img>` llevan ahora `width`/`height` explícitos.

## Pendiente: cabeceras del servidor (DigitalOcean App Platform)

App Platform ya aplica **gzip/brotli automáticamente** a HTML/CSS/JS/SVG, así que
la auditoría "Habilitar compresión de texto" debería pasar sin tocar nada.

Falta verificar la **política de caché**. Comprobar en producción:
```bash
curl -sI https://loginco.com.mx/style.min.css | grep -i cache-control
curl -sI https://loginco.com.mx/font/inter.woff2 | grep -i cache-control
curl -sI https://loginco.com.mx/img/logo-hero.png | grep -i cache-control
```
- Los nombres de `font/*.woff2` y `img/logo-*.png` son inmutables por contenido
  y `style.min.css` lleva `?v=`, así que es seguro un `max-age` largo
  (`public, max-age=31536000, immutable`).
- Si App Platform no permite configurar `Cache-Control` por ruta para el
  componente de sitio estático, la alternativa es poner el dominio detrás de
  Cloudflare (plan gratuito) y fijar ahí las reglas de caché.

## Opcional (siguiente iteración si FCP sigue en ámbar)
- Extraer el CSS crítico del hero + nav (~3 KB) e insertarlo inline en `<head>`,
  cargando `style.min.css` de forma no bloqueante (mismo patrón `preload`+`onload`
  que ya se usa). Se dejó fuera ahora para no fragilizar el mantenimiento de 6
  páginas sin un paso de build.

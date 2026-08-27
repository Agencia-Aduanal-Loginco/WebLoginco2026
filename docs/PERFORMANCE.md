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
./build.sh
```
`build.sh` minifica `style.css` → `style.min.css` **y lo incrusta inline** en el
`<head>` de los 6 `index.html`, entre los marcadores `<!--CSS:START-->` y
`<!--CSS:END-->`. No hay `<link rel="stylesheet">`: cero peticiones que bloqueen
el render (elimina la auditoría "Solicitudes que bloquean el renderizado").
`style.min.css` se mantiene como artefacto pero ya no se sirve.

> Tras cualquier cambio en `style.css` hay que ejecutar `./build.sh` y commitear
> los HTML resultantes.

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

## Pendiente MANUAL: cabeceras de caché (DigitalOcean App Platform · Static Site)

Es la auditoría que queda por cerrar ("Usar tiempos de vida de caché eficientes").
App Platform ya aplica **gzip/brotli automáticamente**; la compresión no hay que
tocarla. Falta el `Cache-Control`.

En el panel de DigitalOcean:
**Apps → (tu app) → Settings → el componente Static Site → "HTTP Response Headers"
→ Edit**, y añadir reglas por prefijo de ruta:

| Path (prefijo) | Header | Valor |
|---|---|---|
| `/font/` | `Cache-Control` | `public, max-age=31536000, immutable` |
| `/img/`  | `Cache-Control` | `public, max-age=31536000, immutable` |

Los nombres de `font/*.woff2` e `img/*` son estables por contenido, así que un
año de caché es seguro. Si cambias un logo, renómbralo (`logo-hero-2.png`).
El CSS ya no necesita regla porque va inline en el HTML.

Verificar tras desplegar:
```bash
curl -sI https://loginco.com.mx/font/inter.woff2  | grep -i 'cache-control\|content-encoding'
curl -sI https://loginco.com.mx/img/logo-hero.png | grep -i cache-control
curl -sw 'TTFB: %{time_starttransfer}s\n' -o /dev/null -s https://loginco.com.mx/
```
Si el TTFB de la última línea sale > 1 s de forma constante, el problema es la
CDN/región de App Platform, no el código; considerar Cloudflare (gratis) delante.

## Notas
- `build.sh` requiere `npx` (descarga `lightningcss-cli`) y `python3`.
- Los 19 `.otf` viejos siguen en el historial de git por si hay que regenerar
  subconjuntos con otros glifos.

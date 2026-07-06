# Diseño: Páginas de servicio para SEO (comercio exterior)

## Contexto y objetivo

`loginco.com.mx` es actualmente un sitio de una sola página (`index.html`) para
Loginco, agencia aduanal en Ciudad Lázaro Cárdenas, Michoacán. El sitio ya
tiene una base SEO sólida (meta tags, JSON-LD `LocalBusiness`, sitemap).

El objetivo de este proyecto es crear 5 páginas nuevas, cada una enfocada en
un grupo de keywords relacionadas, para mejorar el posicionamiento orgánico
en búsquedas de comercio exterior en México:

- comercio exterior méxico
- envíos de contenedores a méxico
- transporte de carga méxico
- importación y exportación méxico
- agencia aduanal méxico
- depósito fiscal méxico
- logística de importación

Estas 7 keywords se agrupan en 5 páginas para evitar canibalización (varias
páginas del mismo sitio compitiendo por la misma intención de búsqueda):

| Página | Keywords cubiertas | Servicio existente relacionado |
|---|---|---|
| `agencia-aduanal-mexico` | agencia aduanal méxico, importación y exportación méxico | Despacho Aduanero |
| `comercio-exterior-mexico` (hub) | comercio exterior méxico, logística de importación | — (resumen general, enlaza a las otras 4) |
| `deposito-fiscal-mexico` | depósito fiscal méxico | Desconsolidación & Almacenaje |
| `transporte-de-carga-mexico` | transporte de carga méxico | Flete Terrestre |
| `envios-de-contenedores-mexico` | envíos de contenedores a méxico | Flete Marítimo |

Los servicios "Custodia" y "Gestión de Permisos" no tienen keyword objetivo
asignada por el usuario, así que no reciben página propia en este proyecto;
siguen existiendo solo como tarjetas en `index.html#servicios`.

## Estructura de archivos

```
/
├── index.html                          (modificado)
├── style.css                            (nuevo contenido — actualmente vacío)
├── main.js                              (nuevo — JS compartido del menú móvil, extraído de index.html)
├── agencia-aduanal-mexico/index.html
├── comercio-exterior-mexico/index.html
├── deposito-fiscal-mexico/index.html
├── transporte-de-carga-mexico/index.html
└── envios-de-contenedores-mexico/index.html
```

Carpeta + `index.html` dentro produce URLs limpias sin extensión
(`loginco.com.mx/agencia-aduanal-mexico/`), sin requerir configuración de
servidor adicional en hosting estático.

### CSS

`index.html` actualmente define ~500 líneas de CSS dentro de un único
`<style>` inline. Este proyecto:

1. Extrae a `style.css` todo lo compartido entre las 6 páginas: variables
   `:root` (colores, sombras, radios, tipografía), reset, layout base
   (`.wrap`, `section`), header/nav (desktop y móvil), botones (`.btn-*`),
   footer, wave dividers, y componentes reutilizados como `.srv-card`.
2. Actualiza `index.html` para enlazar `<link rel="stylesheet" href="/style.css">`
   en vez de su bloque `<style>` inline, removiendo lo que ya vive en
   `style.css`. El CSS específico de las secciones únicas de `index.html`
   (hero de home, stats, almacén, porqué) que no se reutiliza en otras
   páginas puede quedarse inline en `index.html` o moverse también a
   `style.css` si es igual de simple mantenerlo ahí — se decide durante la
   implementación, priorizando no duplicar reglas.
3. Cada una de las 5 páginas nuevas enlaza el mismo `style.css` y añade,
   si hace falta, un `<style>` pequeño solo con reglas propias de esa
   página (ej. layout específico del FAQ o del hero de servicio) que no
   amerite ir al archivo compartido.

### JavaScript

El toggle del menú móvil (hamburguesa) que hoy vive en un `<script>` inline
de `index.html` se mueve a `main.js`, enlazado por las 6 páginas.

## Estructura de cada página de servicio

Header y footer idénticos a `index.html` (mismo nav, mismo logo, "Inicio"
apunta a `/`). El contenido central de cada página:

1. **Hero de servicio** — H1 con la keyword principal, párrafo de apoyo,
   botones CTA ("Solicitar Cotización" → `/#contacto`, "Ver todos los
   servicios" → `/#servicios`).
2. **Bloque descriptivo** — qué es el servicio y por qué importa, apoyado en
   datos reales de marca ya existentes en `index.html` (9+ años de
   experiencia, 5 patentes aduanales, instalaciones en Ciudad Lázaro
   Cárdenas/Michoacán, 9,000 m² totales donde aplique).
3. **Beneficios / proceso** — 3-4 tarjetas o pasos (reutilizando el estilo
   visual de `.srv-card`) explicando cómo trabaja Loginco en ese servicio.
4. **FAQ** — 3-4 preguntas frecuentes relacionadas a la keyword, para
   capturar variantes long-tail y habilitar rich snippets.
5. **Enlaces cruzados** — bloque "Otros servicios" con enlaces a las otras 4
   páginas de servicio.
6. **CTA final + footer** — igual a `index.html`.

La página hub (`comercio-exterior-mexico`) sigue esta misma estructura, pero
su bloque descriptivo funciona como resumen general de comercio exterior en
México, y su sección de enlaces cruzados es más prominente: describe cada
uno de los 4 servicios en 1-2 líneas con un enlace "Conoce más" hacia su
página dedicada.

Contenido redactado por Claude (no proporcionado por el usuario), en tono
igual al de `index.html` (directo, profesional, español de México), ~600-900
palabras por página, usando solo datos reales de la marca — sin contenido
genérico o inventado.

## SEO metadata y datos estructurados

Por cada una de las 5 páginas nuevas:

- `<title>` único con la keyword principal.
- `meta description` (~155 caracteres) con la keyword + llamado a la acción.
- `meta keywords` con la keyword objetivo + variantes relacionadas.
- `canonical` apuntando a la URL propia de la página.
- Meta de favicon/robots igual a `index.html`.
- JSON-LD `Service` (mismo patrón que el `LocalBusiness` existente):
  `serviceType`, `provider` referenciando a Loginco, `areaServed: México`.
- JSON-LD `BreadcrumbList`: Inicio → nombre del servicio.
- JSON-LD `FAQPage` generado desde las preguntas de la sección FAQ.

No se agregan Open Graph/Twitter cards (index.html tampoco los tiene
actualmente — se mantiene consistencia; puede evaluarse como proyecto
separado más adelante).

## Cambios a archivos existentes

- **`index.html` → `#servicios`**: las tarjetas de Despacho Aduanero,
  Desconsolidación & Almacenaje, Flete Terrestre y Flete Marítimo se vuelven
  clickeables hacia sus páginas nuevas correspondientes. Custodia y Gestión
  de Permisos no cambian.
- **`index.html` → footer**: los mismos 4 enlaces de servicio se actualizan
  de `#servicios` a la URL real de su página nueva. Se añade un enlace nuevo
  "Comercio Exterior en México" → `/comercio-exterior-mexico/`.
- **`index.html` → JSON-LD `hasOfferCatalog`**: se agrega `"url"` a cada
  `Offer` correspondiente a un servicio con página propia.
- **`sitemap.xml`**: se agregan las 5 URLs nuevas (`lastmod` de la fecha de
  publicación, `priority` 0.8).
- **`robots.txt`**: sin cambios necesarios.

## Fuera de alcance

- Páginas dedicadas para "Custodia" y "Gestión de Permisos" (sin keyword
  objetivo asignada).
- Open Graph / Twitter card metadata.
- Imágenes o fotografía nueva (se reutilizan los assets existentes en
  `/img/` y los íconos SVG inline ya usados en `#servicios`).
- Formulario de contacto propio por página (las páginas enlazan a
  `/#contacto` en vez de duplicar el formulario).

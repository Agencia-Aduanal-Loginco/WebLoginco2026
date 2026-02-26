# Loginco – Agencia Aduanal

Sitio web institucional de **Loginco** (Logística Internacional y Servicios en Comercio Exterior, S.C.), agencia aduanal con más de 9 años de experiencia en comercio exterior.

## Vista previa

Landing page responsive con secciones de servicios, infraestructura, estadísticas y formulario de contacto.

## Estructura del proyecto

```
WebLoginco2026/
├── index.html       # Página principal (HTML + CSS embebido + JS)
├── style.css        # Hoja de estilos externa (reservado)
├── index.js         # Script externo (reservado)
├── img/             # Logotipos e isotipos (PNG, SVG)
├── font/            # Tipografía Montserrat (OTF, todos los pesos)
└── paletaColores.png # Referencia de paleta de colores
```

## Tecnologías

- **HTML5** semántico
- **CSS3** — variables custom, grid, flexbox, animaciones, diseño responsive
- **JavaScript** vanilla — IntersectionObserver, contadores animados, navegación activa
- **Google Fonts** — Inter (body)
- **Montserrat** — carga local (display/headings)

## Secciones

- **Hero** — Presentación con animaciones y CTAs
- **Nosotros** — Historia, pilares y experiencia
- **Servicios** — Despacho aduanero, almacenaje, custodia, flete terrestre/marítimo, permisos
- **Estadísticas** — Contadores animados (años, superficie, patentes, servicios)
- **Almacén** — Infraestructura y capacidad (9,000 m² totales)
- **¿Por qué Loginco?** — Diferenciadores
- **Contacto** — Formulario de cotización e información de contacto

## Uso

Abrir `index.html` en cualquier navegador. No requiere build ni dependencias externas.

```bash
# Opción rápida con servidor local
python3 -m http.server 8000
# Abrir http://localhost:8000
```

## Responsive

Breakpoints: 1024px, 900px, 768px, 500px. Incluye menú hamburguesa para móvil.

## Licencia

© 2026 Loginco – Logística Internacional y Servicios en Comercio Exterior, S.C. Todos los derechos reservados.

# Landing — Entre Dos Copas (Barras móviles)
Estructura separada en **HTML / CSS / JS**.

## Estructura
.
├── index.html
└── assets
    ├── css
    │   └── style.css
    └── js
        └── main.js

## Antes de publicar
1) En `assets/js/main.js`, reemplaza `WHATSAPP_NUMBER` por tu número (solo dígitos, con país). Ej: `54911XXXXXXXX`.
2) Ajusta los precios “Desde $…” en `index.html` (sección Precios).
3) Si publicas en **GitHub Pages**, cambia el formulario a **Formspree**:
   - Regístrate en https://formspree.io/ y crea un formulario.
   - En `index.html`, busca el `<form ...>` y:
     - Elimina `data-netlify="true"` y `netlify-honeypot="bot-field"`
     - Agrega `action="https://formspree.io/f/TU_ID"` y `method="POST"`
4) Si publicas en **Netlify**, déjalo como está (Netlify Forms lo detecta).

## Publicar rápido
- **Netlify (recomendado):** arrastra la carpeta al dashboard de Netlify → Deploy. Obtendrás `https://tusitio.netlify.app`.
- **GitHub Pages:** sube a un repo, activa Pages desde Settings.
- **Vercel:** importa el repo desde GitHub y deploy.

## Personalización
- Cambia títulos, textos y enlaces (Instagram, dominio).
- Sube tus fotos (o usa las de `picsum.photos` hasta tener material propio).
- Paleta actual: **blanco/negro con acentos rojos**.

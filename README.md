# Contrasecuencia Films

Portafolio estático de fotografía y audiovisual. Los archivos que se publican
están en `dist/`; el material descargado original permanece en `../img/`.

## Edición

- `dist/index.html`: secciones, navegación, presentación y contacto.
- `dist/styles.css`: apariencia, adaptación móvil y animaciones.
- `dist/header.css`: encabezado oscuro, navegación y adaptación del menú móvil.
- `dist/app.js`: filtros, galerías, ampliación de fotos, reproductores y menú móvil.
- `dist/catalog.js`: títulos, categorías, fotografías y videos de cada trabajo.
- `dist/assets/`: fotografías optimizadas a WebP, videos y miniaturas.

Para una vista previa local desde esta carpeta:

```powershell
py -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Abre http://127.0.0.1:8765/. Las galerías también funcionan abriendo
`dist/index.html` directamente, aunque la vista por servidor es preferible.

## Contenido de esta primera versión

Diez galerías con 130 fotografías únicas y seis videos. Los títulos son editoriales
provisionales basados en el contenido visible, sin atribuir fechas de partidos ni
clientes. El contacto abre el perfil real de Instagram de la productora; no hay
un formulario de envío ni datos de teléfono/correo inventados.

La marca del encabezado es una composición tipográfica temporal. Sustituirla por
el logo oficial cuando esté disponible. Los archivos servidos conservan el material
descargado de Instagram; para la versión definitiva conviene usar los originales
del realizador y confirmar selección, nombres de proyectos y permisos de publicación.

## Publicación

El identificador de Sites está en `.openai/hosting.json`. Se utiliza publicación
privada para revisión; el sitio no se configura como público en esta entrega.

## GitHub y Vercel

El portafolio también se puede alojar directamente en Vercel. No depende de
Sites para funcionar y no requiere compilación, instalación de paquetes ni
variables de entorno.

Para un repositorio dedicado, coloca estos archivos en su raíz:

```text
.gitignore
README.md
vercel.json
dist/
  index.html
  styles.css
  header.css
  app.js
  catalog.js
  assets/
```

Incluye `dist/assets/` completo: ahí están las fotos, miniaturas y videos que usa
la página. `.openai/`, `.sites-runtime/`, `../img/` y `../.portfolio-review/` no
son necesarios para esta publicación. Conserva la configuración local de Sites
si deseas seguir utilizando también el enlace de revisión existente.

En Vercel, crea un proyecto e importa el repositorio de GitHub. Con la estructura
anterior, usa la raíz del repositorio como Root Directory. `vercel.json` establece:

- Framework Preset: Other.
- Build Command e Install Command: vacíos.
- Output Directory: `dist`.

Si el repositorio incluye la carpeta `portfolio/` dentro de otra raíz, elige
`portfolio` como Root Directory; el directorio de salida sigue siendo `dist`.
Después de conectar GitHub, las actualizaciones de la rama de producción
generarán nuevos despliegues automáticamente.

Documentación oficial:
[configuración de proyectos](https://vercel.com/docs/project-configuration/vercel-json),
[publicación desde GitHub](https://vercel.com/docs/git/vercel-for-github).

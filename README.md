# MathWorld

MathWorld es un videojuego educativo web para niños de 7 a 10 años, diseñado para practicar reconocimiento numérico, conteo secuencial, asociación número-cantidad, operaciones básicas y problemas simples en un entorno positivo y accesible.

## Tecnologías

- HTML5, CSS3 y JavaScript Vanilla.
- Canvas API para minijuegos interactivos.
- Three.js ligero local para una escena 3D animada.
- GSAP ligero local para transiciones.
- Howler.js ligero local para música.
- Particles.js ligero local para fondo dinámico.
- localStorage para guardado automático.

## Estructura

```text
MathWorld/
├── assets/
├── css/
├── js/
├── libs/
├── worlds/
├── index.html
├── README.md
└── package.json
```

## Uso local

Abre `index.html` directamente en el navegador o sirve la carpeta con cualquier servidor estático.

```bash
npm install
npm start
```

En Windows también puedes ejecutar:

```powershell
powershell -ExecutionPolicy Bypass -File .\serve-local.ps1
```

## Despliegue en GitHub Pages

1. Sube la carpeta `MathWorld` a un repositorio.
2. En GitHub, abre Settings > Pages.
3. Selecciona la rama principal y la carpeta raíz.
4. Guarda los cambios y espera la URL pública.

## Accesibilidad y enfoque pedagógico

- Botones grandes y legibles.
- Instrucciones visuales y narradas con síntesis de voz del navegador.
- Retroalimentación inmediata sin castigos.
- Dificultad ajustada automáticamente por edad.
- Progreso, puntos, estrellas, medallas y desbloqueo progresivo.

## Niveles

1. Exploración de números: un personaje pide una cantidad y el niño entrega objetos.
2. Siguiendo la secuencia: secuencias numéricas con dificultad por edad.
3. Tienda matemática: suma del valor de dos productos.
4. Problemas matemáticos: historias visuales sencillas.
5. Sigue la secuencia: patrones visuales con emojis y figuras.

La narración hablada fue retirada para que las actividades respondan más rápido. El juego conserva música suave, efectos positivos y retroalimentación visual inmediata.

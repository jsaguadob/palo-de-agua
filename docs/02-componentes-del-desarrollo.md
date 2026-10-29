# 2. Componentes del desarrollo

## Tecnología

| Capa | Tecnología | Nota |
| --- | --- | --- |
| Estructura | HTML5 | Una sola página con pantallas que se muestran u ocultan. |
| Estilo | CSS3 | Variables de color, diseño adaptable (responsive). |
| Lógica | JavaScript (sin framework) | Validaciones, cálculo, gráfica y manejo de pantallas. |
| Datos | `localStorage` del navegador | Guarda los registros sin necesidad de servidor. |
| Fuentes | Alfa Slab One, Karla (mockup); Caveat (wireframe) | Google Fonts. |
| Diseño | Figma + HTML (`wireframe.html`, `mockup.html`) | Ver la carpeta del repo. |

## Pantallas

| # | Pantalla | Qué hace |
| --- | --- | --- |
| 1 | **Ingreso** | Usuario y contraseña. Solo sirve CVC / Lluvias. |
| 2 | **Panel principal** | Formulario de registro, resultado con reloj, foto y gráfica por zona. |
| 3 | **Clave de seguridad** | Cinco casillas para autorizar el registro de otra zona. |

## Módulos de la aplicación

| Módulo | Responsabilidad | Historias |
| --- | --- | --- |
| `auth` | Validar el ingreso, abrir y cerrar sesión. | HU-01, HU-09 |
| `registro` | Leer y validar el formulario (zona, horas, mm, quién registra). | HU-02, HU-10 |
| `calculo` | Calcular frente al estándar de 14 mm y aplicar el ajuste del 5,3 %. | HU-03, HU-05 |
| `reloj` | Animación de espera antes de mostrar el resultado. | HU-04 |
| `clave` | Pedir y validar la clave de seguridad. | HU-06 |
| `grafica` | Dibujar las barras por zona (naranja si pasa el estándar, azul si no). | HU-07 |
| `foto` | Capturar o subir la foto de la zona. | HU-08 |
| `almacen` | Guardar y leer los registros en `localStorage`. | HU-11, HU-13 |

## Modelo de datos (propuesto)

```json
{
  "id": "2026-10-29T15:40:00-pance",
  "zona": "Pance",
  "direccion": "Vía a Pance, km 2",
  "horaInicio": "15:40",
  "horaFin": "17:10",
  "milimetros": 22,
  "registradoPor": "Laura Quintero",
  "pasaEstandar": true,
  "excesoMm": 8,
  "ajusteAplicado": true,
  "total": 486.5,
  "foto": "data:image/jpeg;base64,..."
}
```

## Flujo principal

```
Ingreso ──(credenciales correctas)──▶ Panel
Panel: llenar formulario ─▶ Calcular y registrar ─▶ reloj de espera ─▶ resultado + barra nueva
Registrar otra zona ─▶ Pantalla de clave ──(clave correcta)──▶ Panel con campos limpios
                                         └─(clave incorrecta)─▶ alerta y vuelta al Ingreso
```

## Estructura de carpetas propuesta para la fase de desarrollo

```
palo-de-agua/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── auth.js
│   ├── registro.js
│   ├── calculo.js
│   ├── reloj.js
│   ├── clave.js
│   ├── grafica.js
│   ├── foto.js
│   └── almacen.js
├── img/                 (logos)
├── diseno/              (wireframe.html, mockup.html)
└── docs/
```

## Requisitos no funcionales

| # | Requisito |
| --- | --- |
| RNF-1 | Funciona en los navegadores actuales (Chrome, Edge, Firefox, Safari). |
| RNF-2 | Se puede usar desde el celular, porque el registro se hace en campo. |
| RNF-3 | Contraste y tamaño de letra legibles bajo el sol. |
| RNF-4 | Los registros no se pierden al recargar la página. |
| RNF-5 | Los datos de la foto y de los registros se manejan solo en el navegador (sin servidor). |

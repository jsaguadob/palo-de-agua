# 4. Backlog del producto

**Prioridad (MoSCoW):** M = debe tenerse · S = debería · C = podría.
**Puntos:** estimación relativa (serie Fibonacci). Son valores iniciales; el equipo debe ajustarlos.
**Estado:** Hecho · En curso · Pendiente.

## Backlog priorizado

| Orden | ID | Historia | Épica | Req | Prior. | Puntos | Sprint | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | HU-01 | Ingresar a la aplicación | E1 | 1 | M | 3 | 1 | Pendiente |
| 2 | HU-02 | Registrar un aguacero | E2 | 2 | M | 5 | 1 | Pendiente |
| 3 | HU-10 | Validar los datos del formulario | E2 | 2 | M | 3 | 1 | Pendiente |
| 4 | HU-03 | Comparar con el estándar de 14 mm | E2 | 2 | M | 3 | 2 | Pendiente |
| 5 | HU-05 | Aplicar el ajuste del 5,3 % | E2 | 4 | M | 3 | 2 | Pendiente |
| 6 | HU-04 | Reloj de espera | E2 | 2 | M | 3 | 2 | Pendiente |
| 7 | HU-06 | Clave de seguridad | E1 | 3 | M | 5 | 2 | Pendiente |
| 8 | HU-11 | Conservar registros al recargar | E5 | — | M | 3 | 3 | Pendiente |
| 9 | HU-07 | Gráfica de barras por zona | E3 | 5 | M | 8 | 3 | Pendiente |
| 10 | HU-08 | Foto de la zona | E4 | 5 | M | 5 | 3 | Pendiente |
| 11 | HU-09 | Cerrar sesión | E1 | 1 | S | 2 | 3 | Pendiente |
| 12 | HU-12 | Uso en celular (responsive) | E5 | — | S | 5 | 4 | Pendiente |
| 13 | HU-13 | Historial de registros | E3 | — | S | 5 | 4 | Pendiente |
| 14 | HU-14 | Exportar registros a CSV | E5 | — | C | 3 | 4 | Pendiente |

**Total estimado:** 56 puntos.

## Trabajo ya realizado (Sprint 0 · Diseño)

| Entregable | Estado |
| --- | --- |
| Identidad: logo (original, vertical y horizontal) y paleta | Hecho |
| Wireframe de las 3 pantallas (`wireframe.html`) | Hecho |
| Mockup de alta fidelidad (`mockup.html`) | Hecho |
| Diseño en Figma (páginas "1 · Wireframe" y "2 · Mockup") | Hecho |
| Documentación: contexto, componentes, historias y backlog | Hecho |

## Plan de sprints (propuesto)

| Sprint | Meta | Historias | Puntos |
| --- | --- | --- | --- |
| 0 | Diseño y documentación | — | — |
| 1 | Entrar y registrar un aguacero | HU-01, HU-02, HU-10 | 11 |
| 2 | Calcular y proteger el registro | HU-03, HU-04, HU-05, HU-06 | 14 |
| 3 | Ver y respaldar la información | HU-07, HU-08, HU-09, HU-11 | 18 |
| 4 | Pulido y extras | HU-12, HU-13, HU-14 | 13 |

## Definición de "Hecho"

Una historia está terminada cuando:

1. Cumple todos sus criterios de aceptación.
2. Funciona en Chrome y en un celular.
3. No genera errores en la consola del navegador.
4. Coincide con el mockup (colores, tipografías y textos).
5. El código está subido al repositorio con un mensaje de commit claro.

## Riesgos

| Riesgo | Efecto | Qué hacer |
| --- | --- | --- |
| La fórmula del cálculo no está confirmada | Resultados incorrectos | Aclararla con el enunciado antes del Sprint 2. |
| Credenciales y clave escritas en el código | No son seguras | Aceptable solo para el caso de estudio; documentarlo. |
| La foto en `localStorage` ocupa mucho espacio | Se llena el almacenamiento | Reducir el tamaño de la imagen antes de guardarla. |
| Permiso de cámara denegado | No se puede tomar foto | Ofrecer subir una imagen. |

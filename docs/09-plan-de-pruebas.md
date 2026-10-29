# 9. Plan de pruebas

## 9.1 Estrategia

| Nivel | Qué prueba | Herramienta | Dónde |
| --- | --- | --- | --- |
| Unitarias | La función de cálculo (base, ajuste, exceso, límites). | Node.js (`assert`) | `tests/calculo.test.js` |
| De punta a punta | Una persona usando la aplicación: ingreso, validaciones, registro, reloj, clave, gráfica, historial, ejemplo y borrado. | Node.js + jsdom (navegador simulado) | `tests/e2e.test.js` |
| Manuales | Cámara, descarga de archivos, navegadores, teclado. | Revisión humana | Sección 9.4 |

**Cómo ejecutarlas:**

```bash
npm install
npm test
```

## 9.2 Resultado de la última ejecución

- **Fecha:** 29/10/2026.
- **Automáticas:** 37 de 37 pruebas de punta a punta pasaron, más las pruebas unitarias del cálculo.
- **Fallas:** 0.

## 9.3 Pruebas automáticas

| Código | Requisito | Qué verifica | Resultado |
| --- | --- | --- | --- |
| CP-CAL-01 | RF-07 | Ejemplo del mockup: 22 mm de 3:40 a 5:10 p. m. da base 462 | Pasó |
| CP-CAL-02 | RF-08 | Con ajuste del 5,3 % el total es 486,5 | Pasó |
| CP-CAL-03 | RF-06 | 22 mm pasa el estándar por 8 mm | Pasó |
| CP-CAL-04 | RF-08 | Aguacero de mañana: sin ajuste y no pasa el estándar | Pasó |
| CP-CAL-05 | RF-06 | 14 mm exactos no pasa el estándar | Pasó |
| CP-CAL-06 | RF-08 | Inicio a las 3:00 p. m. recibe el ajuste | Pasó |
| CP-CAL-07 | RF-08 | Inicio a las 6:00 p. m. no recibe el ajuste | Pasó |
| CP-ING-01 | RF-01 | La aplicación arranca en el ingreso | Pasó |
| CP-ING-02 | RF-02 | Campos vacíos muestran un error | Pasó |
| CP-ING-03 | RF-02 | Contraseña incorrecta: error y sigue en el ingreso | Pasó |
| CP-ING-04 | RF-01 | CVC / Lluvias entra al panel (usuario sin distinguir mayúsculas) | Pasó |
| CP-REG-01 | RF-05 | Formulario vacío: muestra los 6 errores | Pasó |
| CP-REG-02 | RF-05 | Hora de fin anterior a la de inicio: error | Pasó |
| CP-REG-03 | RF-05 | Milímetros negativos: error | Pasó |
| CP-REG-04 | RF-09 | Mientras calcula: botón deshabilitado y mensaje «Calculando…» | Pasó |
| CP-REG-05 | RF-06 | El resultado muestra 22 mm | Pasó |
| CP-REG-06 | RF-06 | Muestra «Pasa el estándar de Cali por 8 mm» | Pasó |
| CP-REG-07 | RF-07 | Muestra la cuenta 22 × 14 × 1,5 h = 462, ajuste de 5,3 % y total 486,5 | Pasó |
| CP-REG-08 | RF-10 | El reloj dibuja el tramo de lluvia | Pasó |
| CP-REG-09 | RF-11 | Se guardó un solo registro (el doble envío no duplica) | Pasó |
| CP-REG-10 | RF-12 | El formulario se bloquea y el botón dice «Registrar otra zona» | Pasó |
| CP-GRA-01 | RF-14 | La gráfica muestra una barra naranja para la zona que pasa el estándar | Pasó |
| CP-HIS-01 | RF-16 | El historial tiene una fila por registro | Pasó |
| CP-CLA-01 | RF-12 | «Registrar otra zona» lleva a la pantalla de clave | Pasó |
| CP-CLA-02 | RF-13 | La clave tiene 5 casillas | Pasó |
| CP-CLA-03 | RF-13 | Clave incorrecta: aparece la alerta | Pasó |
| CP-CLA-04 | RF-13 | Tras la alerta vuelve al ingreso y cierra la sesión | Pasó |
| CP-REG-11 | RF-11 | Los registros siguen ahí al volver a entrar | Pasó |
| CP-CLA-05 | RF-13 | Clave correcta (AGUA1): vuelve al panel con los campos limpios | Pasó |
| CP-REG-12 | RF-06 | Registro de 9 mm de mañana: no pasa el estándar y no lleva ajuste | Pasó |
| CP-GRA-02 | RF-14 | La gráfica muestra una barra azul para la zona que no pasa | Pasó |
| CP-DAT-01 | RF-18 | «Cargar ejemplo» agrega 5 registros (total 7) | Pasó |
| CP-GRA-03 | RF-14 | La gráfica dibuja las barras de los registros | Pasó |
| CP-GRA-04 | RF-14 | Aparece la línea del estándar de 14 mm | Pasó |
| CP-DAT-02 | RF-18 | Borrar pide confirmación y no borra al primer clic | Pasó |
| CP-DAT-03 | RF-18 | El segundo clic borra todo y la gráfica lo indica | Pasó |
| CP-SES-01 | RF-03 | Salir cierra la sesión y vuelve al ingreso | Pasó |

## 9.4 Pruebas manuales

| Código | Requisito | Qué verifica | Resultado |
| --- | --- | --- | --- |
| CP-RES-01 | RNF-02 | La aplicación se ve completa, sin desplazamiento horizontal, en un ancho de 390 px. | Pasó (revisión visual con Chromium) |
| CP-FOT-01 | RF-15 | En un celular, *Tomar foto de la zona* abre la cámara y muestra la vista previa. | **Pendiente** |
| CP-FOT-02 | RF-15 | Una foto tomada después de guardar queda asociada al registro y aparece en el historial. | **Pendiente** |
| CP-FOT-03 | RF-15 | Elegir un archivo que no es imagen muestra un aviso. | **Pendiente** |
| CP-CSV-01 | RF-17 | *Exportar CSV* descarga un archivo que abre bien en Excel (tildes y decimales con coma). | **Pendiente** |
| CP-NAV-01 | RNF-03 | La aplicación funciona igual en Chrome, Edge, Firefox y Safari. | **Pendiente** (probada solo en Chromium) |
| CP-ACC-01 | RNF-07 | Se puede completar un registro usando solo el teclado, y el foco se ve. | **Pendiente** |
| CP-STO-01 | RNF-05 | Con `localStorage` bloqueado, la aplicación sigue funcionando y avisa si no puede guardar. | **Pendiente** |
| CP-USA-01 | RNF-01 | Una persona sin capacitación registra un aguacero en menos de 2 minutos. | **Pendiente** (requiere usuarios reales) |

## 9.5 Criterios de aceptación de la entrega

La versión se acepta cuando:

1. Todas las pruebas automáticas pasan (`npm test`).
2. Las pruebas manuales marcadas como pendientes se ejecutan y no tienen fallas graves.
3. Las preguntas abiertas P-1 a P-5 se confirman con el docente o la entidad, o se documenta la decisión tomada.

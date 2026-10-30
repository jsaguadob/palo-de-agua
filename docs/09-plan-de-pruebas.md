# 9. Plan de pruebas

## 9.1 Estrategia

| Nivel | Qué prueba | Herramienta | Dónde |
| --- | --- | --- | --- |
| Unitarias | La función de cálculo (base, ajuste, exceso, límites). | Node.js (`assert`) | `tests/calculo.test.js` |
| De punta a punta | Una persona usando la aplicación: ingreso, selección de horas, validaciones (nombre, dirección, horas y milímetros), registro, reloj, clave, foto (con cámara simulada), gráfica, historial, ejemplo y borrado. | Node.js + jsdom (navegador simulado) | `tests/e2e.test.js` |
| Manuales | Cámara física, descarga de archivos, navegadores, teclado. | Revisión humana | Sección 9.4 |

**Cómo ejecutarlas:**

```bash
npm install
npm test
```

## 9.2 Resultado de la última ejecución

- **Fecha:** 29/10/2026.
- **Automáticas:** 72 de 72 pruebas de punta a punta pasaron, más las pruebas unitarias del cálculo.
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
| CP-HOR-01 | RF-04 | La hora se elige en 3 listas: hora (1 a 12), minutos (de 5 en 5) y a. m./p. m. | Pasó |
| CP-HOR-02 | RF-04 | Elegir 3:40 p. m. guarda la hora 15:40 | Pasó |
| CP-HOR-03 | RF-04 | 12:00 a. m. equivale a 00:00 | Pasó |
| CP-HOR-04 | RF-04 | 12:00 p. m. equivale a 12:00 | Pasó |
| CP-HOR-05 | RF-05 | Sin elegir la hora, el valor queda vacío (y se pedirá) | Pasó |
| CP-REG-01 | RF-05 | Formulario vacío: muestra los 6 errores | Pasó |
| CP-REG-02 | RF-05 | Hora de fin anterior a la de inicio: error | Pasó |
| CP-REG-03 | RF-05 | Milímetros negativos: error («no puede ser negativa») | Pasó |
| CP-VAL-01 | RF-05 | Un nombre con números («Laura2», «123») se rechaza | Pasó |
| CP-VAL-02 | RF-05 | Un nombre con símbolos («Laura@#», «<b>x</b>») se rechaza | Pasó |
| CP-VAL-03 | RF-05 | Nombres reales con tildes, ñ, apóstrofo, guion y punto se aceptan | Pasó |
| CP-VAL-04 | RF-05 | Un nombre de 1 letra o de más de 60 caracteres se rechaza | Pasó |
| CP-VAL-05 | RF-05 | Una dirección solo con números o símbolos se rechaza | Pasó |
| CP-VAL-06 | RF-05 | Direcciones normales («Cra. 28D # 72-15», «Calle 14, Jamundí») se aceptan | Pasó |
| CP-VAL-07 | RF-05 | Un nombre de solo espacios se rechaza | Pasó |
| CP-VAL-10 | RF-05 | Precipitaciones raras se rechazan: negativas, cero, letras, 1e3, 0x10, Infinity, más de 500 o con 3 decimales | Pasó |
| CP-VAL-11 | RF-05 | Precipitaciones válidas se aceptan: 0,5 · 22 · 22,5 · 22.55 · 500 (con coma o punto) | Pasó |
| CP-VAL-12 | RF-05 | La coma decimal se interpreta bien (22,5 → 22.5) | Pasó |
| CP-VAL-13 | RF-05 | Direcciones raras se rechazan: etiquetas HTML, comillas con ;, emojis, {{ }}, =, @, solo números o símbolos, muy largas | Pasó |
| CP-VAL-14 | RF-05 | Los espacios repetidos se limpian al guardar («Cra.   52   con  calle 1» → «Cra. 52 con calle 1») | Pasó |
| CP-VAL-15 | RF-05 | Mientras se escribe, una precipitación negativa muestra el aviso al instante | Pasó |
| CP-VAL-16 | RF-05 | Mientras se escribe, una dirección rara muestra el aviso al instante | Pasó |
| CP-CSV-02 | RF-17 | En el CSV, un texto que empieza con «=» se neutraliza para que Excel no lo tome como fórmula | Pasó |
| CP-VAL-08 | RF-05 | Mientras se escribe, un número en el nombre muestra el aviso al instante | Pasó |
| CP-VAL-09 | RF-05 | Al corregir el nombre, el aviso desaparece | Pasó |
| CP-REG-04 | RF-09 | Mientras calcula: botón deshabilitado y mensaje «Calculando…» | Pasó |
| CP-REG-05 | RF-06 | El resultado muestra 22 mm | Pasó |
| CP-REG-06 | RF-06 | Muestra «Pasa el estándar de Cali por 8 mm» | Pasó |
| CP-REG-07 | RF-07 | Muestra la cuenta 22 × 14 × 1,5 h = 462, ajuste de 5,3 % y total 486,5 | Pasó |
| CP-REG-08 | RF-10 | El reloj dibuja el tramo de lluvia | Pasó |
| CP-REG-09 | RF-11 | Se guardó un solo registro (el doble envío no duplica) | Pasó |
| CP-REG-10 | RF-12 | El formulario se bloquea y el botón dice «Registrar otra zona» | Pasó |
| CP-GRA-01 | RF-14 | La gráfica muestra una barra naranja para la zona que pasa el estándar | Pasó |
| CP-HIS-01 | RF-16 | El historial tiene una fila por registro | Pasó |
| CP-FOT-03 | RF-15 | El recuadro ofrece dos botones: «Tomar foto» y «Subir foto» | Pasó |
| CP-FOT-04 | RF-15 | «Tomar foto» activa la cámara (trasera por defecto) y muestra la vista previa | Pasó |
| CP-FOT-05 | RF-15 | Con más de una cámara aparece el botón «Girar cámara» | Pasó |
| CP-FOT-06 | RF-15 | «Girar cámara» cambia a la cámara frontal | Pasó |
| CP-FOT-07 | RF-15 | «Capturar» muestra la foto, cierra la cámara y la apaga | Pasó |
| CP-FOT-08 | RF-15 | Foto tomada con el registro ya guardado: queda asociada y aparece en el historial | Pasó |
| CP-FOT-09 | RF-15 | «Cancelar» cierra la cámara y la apaga sin cambiar la foto | Pasó |
| CP-FOT-10 | RF-20 | Sin permiso a la cámara: aviso que recomienda «Subir foto» y el diálogo se cierra | Pasó |
| CP-FOT-11 | RF-20 | Navegador sin cámara disponible: avisa y recomienda «Subir foto» | Pasó |
| CP-FOT-12 | RF-19 | «Subir foto» rechaza un archivo que no es imagen | Pasó |
| CP-FOT-13 | RF-19 | «Subir foto» abre el selector de archivos del dispositivo | Pasó |
| CP-CLA-01 | RF-12 | «Registrar otra zona» lleva a la pantalla de clave | Pasó |
| CP-CLA-02 | RF-13 | La clave tiene 5 casillas | Pasó |
| CP-CLA-03 | RF-13 | Clave incorrecta: aparece la alerta | Pasó |
| CP-CLA-04 | RF-13 | Tras la alerta vuelve al ingreso y cierra la sesión | Pasó |
| CP-REG-11 | RF-11 | Los registros siguen ahí al volver a entrar | Pasó |
| CP-CLA-05 | RF-13 | Clave correcta (AGUA1): vuelve al panel con los campos limpios | Pasó |
| CP-HOR-06 | RF-13 | Al limpiar el formulario las listas de hora vuelven a «--» | Pasó |
| CP-REG-12 | RF-06 | Registro de 9 mm de mañana: no pasa el estándar y no lleva ajuste | Pasó |
| CP-FOT-14 | RF-15 | Foto tomada antes de calcular: se guarda junto con el nuevo registro | Pasó |
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
| CP-FOT-01 | RF-15 | En un celular y en un computador con cámara física, *Tomar foto* abre la cámara, muestra la vista previa y *Capturar* guarda la foto. | **Parcial**: pasó con la cámara de prueba de Chromium; falta una cámara física y un celular |
| CP-FOT-02 | RF-20 | En un navegador real, negar el permiso de la cámara muestra el aviso y *Subir foto* sigue funcionando. | **Pendiente** |
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

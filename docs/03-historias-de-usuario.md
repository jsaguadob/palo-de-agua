# 3. Historias de usuario

**Formato:** *Como [rol], quiero [acción] para [beneficio].*
**Criterios de aceptación:** Dado / Cuando / Entonces.

**Roles:** Registrador (personal de campo) · Supervisor (consulta y vigilancia) · Equipo de desarrollo.

## Épicas

| Épica | Nombre | Historias |
| --- | --- | --- |
| E1 | Acceso y seguridad | HU-01, HU-06, HU-09 |
| E2 | Registro y cálculo | HU-02, HU-03, HU-04, HU-05, HU-10 |
| E3 | Visualización | HU-07, HU-13 |
| E4 | Evidencia | HU-08 |
| E5 | Datos y calidad | HU-11, HU-12, HU-14 |

---

## E1 · Acceso y seguridad

### HU-01 · Ingresar a la aplicación (Req 1)
**Como** registrador, **quiero** ingresar con mi usuario y contraseña **para** que solo el personal autorizado use la aplicación.

- **Dado** que estoy en la pantalla de ingreso, **cuando** escribo el usuario `CVC` y la contraseña `Lluvias`, **entonces** se oculta el ingreso y aparece el panel principal.
- **Dado** que escribo credenciales incorrectas, **cuando** pulso *Ingresar*, **entonces** veo un mensaje de error y sigo en el ingreso.
- **Dado** que dejo un campo vacío, **cuando** pulso *Ingresar*, **entonces** se me indica cuál falta.

### HU-06 · Autorizar con clave de seguridad (Req 3)
**Como** registrador, **quiero** escribir una clave después de guardar un registro **para** poder registrar otra zona de forma controlada.

- **Dado** que guardé un registro, **cuando** quiero registrar otra zona, **entonces** se muestra la pantalla de clave con cinco casillas.
- **Dado** que escribo la clave correcta, **cuando** pulso *Continuar*, **entonces** vuelvo al panel con los campos limpios.
- **Dado** que escribo una clave incorrecta, **cuando** pulso *Continuar*, **entonces** aparece una alerta y regreso al ingreso.

### HU-09 · Cerrar sesión
**Como** registrador, **quiero** salir de mi sesión **para** que nadie más use la aplicación con mi acceso.

- **Dado** que estoy en el panel, **cuando** pulso *Salir*, **entonces** vuelvo al ingreso y el panel deja de estar disponible.

---

## E2 · Registro y cálculo

### HU-02 · Registrar un aguacero (Req 2)
**Como** registrador, **quiero** anotar la zona, la hora de inicio y de fin, los milímetros y quién registra **para** dejar constancia del aguacero.

- **Dado** que estoy en el panel, **cuando** lleno todos los campos y pulso *Calcular y registrar*, **entonces** el registro se guarda y se muestra su resultado.
- **Dado** que falta algún campo, **cuando** pulso *Calcular y registrar*, **entonces** no se guarda y se indica qué falta.

### HU-03 · Comparar con el estándar de Cali (Req 2)
**Como** registrador, **quiero** ver si la lluvia pasó el estándar de 14 mm **para** saber si la zona está en alerta.

- **Dado** que registro 22 mm, **cuando** se calcula, **entonces** se muestra "Pasa el estándar de Cali por 8 mm".
- **Dado** que registro 9 mm, **cuando** se calcula, **entonces** se indica que **no** pasa el estándar.
- **Dado** que registro exactamente 14 mm, **cuando** se calcula, **entonces** se indica que no lo supera.

### HU-04 · Ver el reloj de espera (Req 2)
**Como** registrador, **quiero** ver un reloj mientras se calcula **para** saber que la aplicación está procesando.

- **Dado** que pulsé *Calcular y registrar*, **cuando** se procesa, **entonces** el reloj gira durante unos segundos y luego se muestra el resultado.
- **Dado** que el reloj está girando, **cuando** intento pulsar de nuevo el botón, **entonces** no se duplica el registro.

### HU-05 · Aplicar el ajuste del 5,3 % (Req 4)
**Como** supervisor, **quiero** que el cálculo sume el 5,3 % a las lluvias entre las 3:00 y las 6:00 p. m. **para** cumplir la regla del caso de estudio.

- **Dado** un aguacero de 3:40 a 5:10 p. m., **cuando** se calcula, **entonces** se aplica el ajuste y se muestra la cuenta con el total (ejemplo: 462 → 486,5).
- **Dado** un aguacero a las 8:00 a. m., **cuando** se calcula, **entonces** **no** se aplica el ajuste.
- *(Pendiente de confirmar: qué pasa si el aguacero cruza el límite de las 3:00 o las 6:00 p. m.)*

### HU-10 · Validar los datos del formulario
**Como** registrador, **quiero** que la aplicación rechace datos imposibles **para** no guardar errores.

- **Dado** una hora de fin anterior a la de inicio, **cuando** pulso *Calcular y registrar*, **entonces** se muestra un error.
- **Dado** unos milímetros negativos o no numéricos, **cuando** pulso *Calcular y registrar*, **entonces** se muestra un error.

---

## E3 · Visualización

### HU-07 · Ver la gráfica de lluvia por zona (Req 5)
**Como** supervisor, **quiero** una gráfica de barras con los registros **para** ver de un vistazo qué zonas pasan el estándar.

- **Dado** que existen registros, **cuando** abro el panel, **entonces** cada zona aparece como una barra que cuelga del palo, con su valor y su nombre.
- **Dado** que una zona pasa de 14 mm, **cuando** se dibuja, **entonces** su barra es **naranja**; si no, es **azul**.
- **Dado** que se guarda un registro nuevo, **cuando** vuelvo al panel, **entonces** aparece una barra nueva.
- **Dado** la línea de referencia, **entonces** se ve marcada la línea del **estándar de 14 mm**.

### HU-13 · Consultar el historial de registros
**Como** supervisor, **quiero** ver la lista de registros guardados **para** revisar lo ocurrido en días anteriores.

- **Dado** que hay registros guardados, **cuando** abro el historial, **entonces** veo zona, fecha, horario, milímetros y si pasó el estándar.

---

## E4 · Evidencia

### HU-08 · Tomar la foto de la zona (Req 5)
**Como** registrador, **quiero** tomar o subir una foto de la zona **para** dejar evidencia en el reporte.

- **Dado** que estoy en el panel, **cuando** pulso *Tomar foto de la zona*, **entonces** puedo capturar con la cámara o elegir una imagen.
- **Dado** que elegí una foto, **cuando** guardo el registro, **entonces** la foto queda asociada a ese registro.
- **Dado** que no doy permiso a la cámara, **cuando** pulso el botón, **entonces** se me ofrece subir una imagen desde el dispositivo.

---

## E5 · Datos y calidad

### HU-11 · Conservar los registros al recargar
**Como** registrador, **quiero** que mis registros sigan ahí al recargar la página **para** no perder el trabajo.

- **Dado** que guardé registros, **cuando** recargo el navegador, **entonces** los registros y la gráfica siguen visibles.

### HU-12 · Usar la aplicación en el celular
**Como** registrador de campo, **quiero** usarla desde el teléfono **para** registrar sin volver a la oficina.

- **Dado** una pantalla de 360 px de ancho, **cuando** abro la aplicación, **entonces** el panel se acomoda en una columna y todo es legible y tocable.

### HU-14 · Exportar los registros *(opcional)*
**Como** supervisor, **quiero** descargar los registros en un archivo **para** usarlos en un informe.

- **Dado** que hay registros, **cuando** pulso *Exportar*, **entonces** se descarga un archivo CSV con todos los registros.

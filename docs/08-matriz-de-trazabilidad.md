# 8. Matriz de trazabilidad

Permite seguir cada requisito desde su origen hasta su prueba. Si cambia un requisito, esta matriz indica qué más hay que revisar.

**Estados:** Implementado = está en la aplicación · Verificado = además tiene pruebas que pasaron.

## 8.1 Requisitos funcionales

| RF | Necesidad | Caso de estudio | Historia | Caso de uso | Módulo | Pruebas | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RF-01 | NEC-01 | Req 1 | HU-01 | CU-01 | `auth.js`, `app.js` | CP-ING-01, CP-ING-04 | Verificado |
| RF-02 | NEC-01 | — | HU-01 | CU-01 | `app.js` | CP-ING-02, CP-ING-03 | Verificado |
| RF-03 | NEC-01 | — | HU-09 | CU-08 | `auth.js`, `app.js` | CP-SES-01 | Verificado |
| RF-04 | NEC-02 | Req 2 | HU-02 | CU-02 | `index.html`, `app.js` | CP-REG-05 a CP-REG-12 (indirecta) | Verificado |
| RF-05 | NEC-02 | — | HU-10 | CU-02 | `registro.js` | CP-REG-01, CP-REG-02, CP-REG-03 | Verificado |
| RF-06 | NEC-03 | Req 2 | HU-03 | CU-02 | `calculo.js` | CP-CAL-03, CP-CAL-05, CP-REG-05, CP-REG-06, CP-REG-12 | Verificado |
| RF-07 | NEC-03 | Req 2 | HU-03 | CU-02 | `calculo.js` | CP-CAL-01, CP-REG-07 | Verificado |
| RF-08 | NEC-04 | Req 4 | HU-05 | CU-02 | `calculo.js` | CP-CAL-02, CP-CAL-04, CP-CAL-06, CP-CAL-07 | Verificado |
| RF-09 | NEC-05 | Req 2 | HU-04 | CU-02 | `reloj.js`, `app.js` | CP-REG-04 | Verificado |
| RF-10 | NEC-05 | — | HU-04 | CU-02 | `reloj.js` | CP-REG-08 | Verificado |
| RF-11 | NEC-02 | — | HU-11 | CU-02 | `almacen.js` | CP-REG-09, CP-REG-11 | Verificado |
| RF-12 | NEC-06 | Req 3 | HU-06 | CU-03 | `app.js` | CP-REG-10, CP-CLA-01 | Verificado |
| RF-13 | NEC-06 | Req 3 | HU-06 | CU-03 | `clave.js`, `app.js` | CP-CLA-02 a CP-CLA-05 | Verificado |
| RF-14 | NEC-07 | Req 5 | HU-07 | CU-04 | `grafica.js` | CP-GRA-01 a CP-GRA-04 | Verificado |
| RF-15 | NEC-08 | Req 5 | HU-08 | CU-05 | `foto.js`, `app.js` | CP-FOT-01 a CP-FOT-03 (manuales) | Implementado |
| RF-16 | NEC-09 | — | HU-13 | CU-04 | `app.js` | CP-HIS-01 | Verificado |
| RF-17 | NEC-09 | — | HU-14 | CU-06 | `app.js` | CP-CSV-01 (manual) | Implementado |
| RF-18 | NEC-09 | — | — | CU-07 | `app.js`, `almacen.js` | CP-DAT-01 a CP-DAT-03 | Verificado |

## 8.2 Requisitos no funcionales

| RNF | Cómo se cumple | Evidencia | Estado |
| --- | --- | --- | --- |
| RNF-01 Usabilidad | Formulario corto, mensajes claros por campo | CP-USA-01 (pendiente) | Implementado |
| RNF-02 Pantallas pequeñas | CSS adaptable con puntos de corte en 980 px y 480 px | CP-RES-01 | Verificado |
| RNF-03 Navegadores | HTML, CSS y JavaScript estándar, sin dependencias | CP-NAV-01 (pendiente) | Implementado |
| RNF-04 Eficiencia | Sin servidor; cálculo local | Inspección | Implementado |
| RNF-05 Fiabilidad | `localStorage` con respaldo en memoria | CP-REG-11, CP-STO-01 (pendiente) | Implementado |
| RNF-06 Seguridad | Ingreso y clave (con la limitación documentada) | Inspección de `js/config.js` | Implementado |
| RNF-07 Accesibilidad | Etiquetas, `role="alert"`, `aria-live`, foco visible, reducir movimiento | CP-ACC-01 (pendiente) | Implementado |
| RNF-08 Mantenibilidad | Módulos y configuración central | Inspección; `npm test` | Verificado |
| RNF-09 Portabilidad | Archivos estáticos que abren con doble clic | Demostración | Verificado |
| RNF-10 Localización | `js/util.js` (coma decimal, 12 h, dd/mm/aaaa) | CP-REG-07 | Verificado |
| RNF-11 Privacidad | Sin envío de datos a servidores | Inspección | Verificado |

## 8.3 Reglas del negocio

| Regla | Requisitos que la aplican | Pruebas |
| --- | --- | --- |
| RN-1 Estándar de 14 mm | RF-06 | CP-CAL-03, CP-CAL-05 |
| RN-2 Informar el exceso | RF-06 | CP-REG-06 |
| RN-3 Ajuste del 5,3 % | RF-08 | CP-CAL-02, CP-CAL-04, CP-CAL-06, CP-CAL-07 |
| RN-4 Clave para otra zona | RF-12 | CP-REG-10, CP-CLA-01 |
| RN-5 Clave incorrecta vuelve al ingreso | RF-13 | CP-CLA-03, CP-CLA-04 |
| RN-6 Acceso restringido | RF-01, RF-02 | CP-ING-01 a CP-ING-04 |

## 8.4 Cobertura

- **18 requisitos funcionales:** 16 verificados con pruebas automáticas y 2 implementados con prueba manual pendiente (RF-15 y RF-17).
- **11 requisitos no funcionales:** 5 verificados (RNF-02, 08, 09, 10 y 11) y 6 implementados. De estos, RNF-01, 03, 05 y 07 tienen una prueba manual pendiente; RNF-04 y RNF-06 se revisan por inspección.
- **Casos de uso:** los 8 tienen requisitos asociados. Seis tienen pruebas automáticas; CU-05 (foto) y CU-06 (CSV) solo tienen pruebas manuales, todavía pendientes.

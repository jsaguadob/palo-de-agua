# 1. Contexto del problema

## Situación

En Cali, los aguaceros fuertes (en el habla local, un **"palo de agua"**) afectan zonas como Pance, Siloé, Jamundí, Aguablanca y Granada. Hoy el registro de cuánta lluvia cayó, dónde y a qué hora depende de anotaciones en papel y de la memoria de quien estuvo en campo. Eso dificulta saber **qué zonas superan el estándar de precipitación** y reaccionar a tiempo.

## Problema

No existe una herramienta sencilla que permita al personal autorizado:

- registrar un aguacero con su zona, horario y milímetros de lluvia;
- compararlo de inmediato con el **estándar de Cali (14 mm)**;
- aplicar los ajustes que la norma exige según la hora del evento;
- ver de un vistazo **cuáles zonas pasan el estándar**;
- dejar evidencia (foto) del lugar.

## Solución propuesta

**Palo de Agua** es una aplicación web de monitoreo de lluvia por zonas. Se presenta como una **libreta de campo digital**: el papel milimetrado es la base de la gráfica, y cada registro "cuelga" de un palo como una gota o barra nueva.

## Objetivos

| Tipo | Objetivo |
| --- | --- |
| General | Registrar y vigilar la lluvia por zonas de Cali, comparándola con el estándar de 14 mm. |
| Específico | Restringir el acceso a personal autorizado (CVC). |
| Específico | Calcular la precipitación frente al estándar, con ajuste del 5,3 % entre 3:00 y 6:00 p. m. |
| Específico | Visualizar los registros en una gráfica de barras por zona. |
| Específico | Permitir adjuntar una foto de la zona como evidencia. |

## Alcance

**Dentro del alcance (fase actual):** aplicación front-end en HTML, CSS y JavaScript; ingreso, registro, cálculo, clave de seguridad, gráfica y foto.

**Fuera del alcance (por ahora):** servidor y base de datos centralizada, sensores automáticos de lluvia, alertas por mensaje o correo, aplicación móvil nativa, usuarios múltiples con roles reales.

## Usuarios

| Persona | Rol | Necesidad |
| --- | --- | --- |
| Laura Quintero (ejemplo del mockup) | Registradora de campo | Anotar rápido un aguacero y saber si pasó el estándar. |
| Supervisor / analista de la CVC | Consulta y vigilancia | Ver qué zonas superan los 14 mm y revisar la evidencia. |

## Reglas del negocio (tomadas del diseño)

| # | Regla |
| --- | --- |
| RN-1 | El estándar de Cali es de **14 mm**. |
| RN-2 | Si la lluvia supera el estándar, se muestra **por cuántos mm** lo pasa (ejemplo: 22 mm → pasa por 8 mm). |
| RN-3 | Si el aguacero ocurre **entre las 3:00 p. m. y las 6:00 p. m.**, se aplica un **ajuste del 5,3 %**. |
| RN-4 | Después de guardar un registro, para registrar **otra zona** hay que escribir la **clave de seguridad**. |
| RN-5 | Si la clave no coincide, se vuelve al ingreso. |
| RN-6 | El acceso es solo para el personal autorizado (en el diseño: usuario `CVC`, contraseña `Lluvias`). |

### Ejemplo del cálculo mostrado en el mockup

Registro: Vía a Pance, km 2 · 3:40 p. m. a 5:10 p. m. (1,5 h) · 22 mm.

```
22 × 14 × 1,5 h = 462
Ajuste 5,3 % (evento entre 3 y 6 p. m.) → total 486,5
Exceso sobre el estándar: 22 − 14 = 8 mm
```

## Supuestos y preguntas abiertas

Este documento se armó a partir del README, el wireframe y el mockup. **No se contó con el enunciado original del caso de estudio**, así que estos puntos deben confirmarse:

1. **Fórmula del cálculo.** El mockup muestra `mm × 14 × horas = 462`. Falta confirmar con el enunciado qué representa ese resultado y si el exceso de 8 mm se calcula aparte.
2. **Ajuste del 5,3 %.** ¿Aplica si el aguacero está *completamente* dentro de 3:00 a 6:00 p. m., o si *se cruza* con ese horario?
3. **Clave de seguridad.** Tiene 5 casillas en el diseño, pero no está definido cuál es ni si es fija.
4. **Reloj de espera.** No está definida su duración.
5. **Credenciales.** Estar escritas en el código es aceptable para un caso de estudio, pero **no es seguro** en un sistema real.

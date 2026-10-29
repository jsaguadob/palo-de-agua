# Palo de Agua

Aplicación web para registrar y vigilar la lluvia por zonas en Cali. El nombre viene del colombianismo "palo de agua", que es un aguacero fuerte.

Caso de estudio: monitoreo de lluvia y precipitación (HTML, CSS y JavaScript).

## Estado

Aplicación **funcionando** (HTML, CSS y JavaScript, sin servidor). Abre `index.html` en el navegador para usarla.

## Cómo usarla

1. Abre `index.html` (doble clic) o la página publicada.
2. Ingresa con usuario `CVC` y contraseña `Lluvias`.
3. Llena el formulario y pulsa **Calcular y registrar**. El reloj gira y luego aparece el resultado frente al estándar de 14 mm.
4. Para registrar otra zona, pulsa **Registrar otra zona** y escribe la clave de seguridad: `AGUA1`.
5. Si la clave es incorrecta, aparece una alerta y vuelves al ingreso.
6. Usa **Cargar ejemplo** para ver la gráfica con datos de muestra.

Los registros se guardan en el navegador (`localStorage`), así que siguen ahí al recargar la página.

> Las credenciales y la clave están escritas en `js/config.js`. Es aceptable para un caso de estudio, pero **no es seguro** para un sistema real.

## Documentación

| Documento | Qué contiene |
| --- | --- |
| [Contexto del problema](docs/01-contexto-del-problema.md) | Situación, problema, objetivos, alcance, usuarios, reglas del negocio y preguntas abiertas |
| [Componentes del desarrollo](docs/02-componentes-del-desarrollo.md) | Tecnología, pantallas, módulos, modelo de datos, flujo y requisitos no funcionales |
| [Historias de usuario](docs/03-historias-de-usuario.md) | 14 historias con criterios de aceptación, agrupadas en 5 épicas |
| [Backlog](docs/04-backlog.md) | Backlog priorizado, plan de sprints, definición de "Hecho" y riesgos |
| [Ingeniería de requerimientos](docs/05-ingenieria-de-requerimientos.md) | Proceso, fuentes, interesados, necesidades, priorización, validación y pendientes |
| [Especificación de requisitos (ERS)](docs/06-especificacion-de-requisitos.md) | 18 requisitos funcionales, 11 no funcionales, reglas del negocio y modelo de datos |
| [Casos de uso](docs/07-casos-de-uso.md) | 8 casos de uso con diagrama, flujos y estados de la interfaz |
| [Matriz de trazabilidad](docs/08-matriz-de-trazabilidad.md) | Necesidad → requisito → historia → caso de uso → módulo → prueba |
| [Plan de pruebas](docs/09-plan-de-pruebas.md) | Estrategia, 37 pruebas automáticas con resultado y pruebas manuales |
| [Arquitectura y diseño](docs/10-arquitectura-y-diseno.md) | Módulos, secuencia, modelo de datos y decisiones de diseño |

## Estructura

```
index.html          Aplicación (3 pantallas: ingreso, panel y clave)
css/estilos.css     Estilos
js/                 config, util, calculo, almacen, auth, registro, reloj, clave, grafica, foto y app
img/                Logo: original, vertical, horizontal y versiones para la web
diseno/             wireframe.html (boceto a mano) y mockup.html (alta fidelidad)
docs/               Contexto, componentes, historias de usuario y backlog
tests/              Pruebas automáticas (npm install y npm test)
```

## Qué cubre la aplicación

1. Ingreso con usuario y contraseña.
2. Registro de zona, horas y milímetros, con cálculo frente al estándar de Cali (14 mm) y reloj de espera.
3. Clave de seguridad para registrar otra zona.
4. Ajuste del 5,3 % para lluvias entre las 3:00 p. m. y las 6:00 p. m.
5. Gráfica de barras de los registros y captura de foto de la zona.

## Paleta

Noche `#10262F` · Guadua `#2E7D5B` · Aguacero `#3FA7C8` · Chontaduro `#F28C28` · Neblina `#EAF2F0`

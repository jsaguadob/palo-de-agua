/* Pruebas de punta a punta (simulan a una persona usando la app en un navegador de prueba).
   Ejecutar:  npm install  y luego  npm test
   Cada prueba tiene un código CP-xxx y el requisito (RF-xx) que verifica. */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const R = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

// Arma una sola página con el CSS y los scripts dentro (así jsdom no necesita cargar archivos)
let html = R('index.html').replace('<link rel="stylesheet" href="css/estilos.css">', '<style>' + R('css/estilos.css') + '</style>');
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (m, f) => '<script>' + R(f) + '</script>');

const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'dangerously', pretendToBeVisual: true });
const w = dom.window, d = w.document, $ = (id) => d.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const submit = (f) => f.dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true }));
const set = (id, v) => { $(id).value = v; };
const elegir = (sels, h, m, p) => { sels[0].value = h; sels[1].value = m; sels[2].value = p; sels.forEach((x) => x.dispatchEvent(new w.Event('change', { bubbles: true }))); };
const hora = (campo, hhmm) => {            // elige la hora en las listas, como lo haría una persona
  const [H, M] = hhmm.split(':').map(Number);
  elegir($('g-' + campo)._selects, String(H % 12 === 0 ? 12 : H % 12), ('0' + M).slice(-2), H >= 12 ? 'PM' : 'AM');
};
const activa = () => [...d.querySelectorAll('.pantalla.activa')].map((e) => e.id).join();

let fallas = 0;
const t = (id, rf, desc, ok, extra) => {
  console.log((ok ? 'PASS' : 'FAIL') + ' | ' + id + ' | ' + rf + ' | ' + desc + (extra !== undefined && !ok ? '  -> ' + extra : ''));
  if (!ok) fallas++;
};

(async () => {
  await wait(150); w.scrollTo = () => {};
  const PA = w.PA; PA.CONFIG.ESPERA_MS = 60;

  // Cálculo
  const r = PA.calculo.calcular({ milimetros: 22, horaInicio: '15:40', horaFin: '17:10' });
  t('CP-CAL-01', 'RF-07', 'Ejemplo del mockup: 22 mm de 3:40 a 5:10 p. m. da base 462', r.base === 462, r.base);
  t('CP-CAL-02', 'RF-08', 'Con ajuste del 5,3 % el total es 486,5', r.total === 486.5 && r.aplicaAjuste, r.total);
  t('CP-CAL-03', 'RF-06', '22 mm pasa el estándar por 8 mm', r.excesoMm === 8 && r.pasaEstandar);
  const r2 = PA.calculo.calcular({ milimetros: 9, horaInicio: '08:00', horaFin: '09:00' });
  t('CP-CAL-04', 'RF-08', 'Aguacero de mañana: sin ajuste y no pasa el estándar', !r2.aplicaAjuste && !r2.pasaEstandar && r2.total === 126, r2.total);
  t('CP-CAL-05', 'RF-06', '14 mm exactos no pasa el estándar', PA.calculo.calcular({ milimetros: 14, horaInicio: '10:00', horaFin: '11:00' }).pasaEstandar === false);
  t('CP-CAL-06', 'RF-08', 'Inicio a las 3:00 p. m. recibe el ajuste', PA.calculo.calcular({ milimetros: 10, horaInicio: '15:00', horaFin: '16:00' }).aplicaAjuste);
  t('CP-CAL-07', 'RF-08', 'Inicio a las 6:00 p. m. no recibe el ajuste', !PA.calculo.calcular({ milimetros: 10, horaInicio: '18:00', horaFin: '19:00' }).aplicaAjuste);

  // Ingreso
  t('CP-ING-01', 'RF-01', 'La aplicación arranca en el ingreso', activa() === 'pantalla-ingreso', activa());
  submit($('form-ingreso'));
  t('CP-ING-02', 'RF-02', 'Campos vacíos muestran un error', !$('in-error').hidden);
  set('in-usuario', 'CVC'); set('in-clave', 'mala'); submit($('form-ingreso'));
  t('CP-ING-03', 'RF-02', 'Contraseña incorrecta: error y sigue en el ingreso', !$('in-error').hidden && activa() === 'pantalla-ingreso');
  set('in-usuario', 'cvc'); set('in-clave', 'Lluvias'); submit($('form-ingreso'));
  t('CP-ING-04', 'RF-01', 'CVC / Lluvias entra al panel (usuario sin distinguir mayúsculas)', activa() === 'pantalla-panel' && $('usuario-sesion').textContent === 'CVC', activa());

  // Selección de horas (sin escribir)
  const gi = $('g-horaInicio')._selects;
  t('CP-HOR-01', 'RF-04', 'La hora se elige en 3 listas: hora (1 a 12), minutos (de 5 en 5) y a. m./p. m.', gi[0].options.length === 13 && gi[1].options.length === 12 && gi[2].options.length === 2);
  elegir(gi, '3', '40', 'PM');
  t('CP-HOR-02', 'RF-04', 'Elegir 3:40 p. m. guarda la hora 15:40', $('r-inicio').value === '15:40', $('r-inicio').value);
  elegir(gi, '12', '00', 'AM');
  t('CP-HOR-03', 'RF-04', '12:00 a. m. equivale a 00:00', $('r-inicio').value === '00:00', $('r-inicio').value);
  elegir(gi, '12', '00', 'PM');
  t('CP-HOR-04', 'RF-04', '12:00 p. m. equivale a 12:00', $('r-inicio').value === '12:00', $('r-inicio').value);
  elegir(gi, '', '00', 'AM');
  t('CP-HOR-05', 'RF-05', 'Sin elegir la hora, el valor queda vacío (y se pedirá)', $('r-inicio').value === '');

  // Validación
  submit($('form-registro'));
  t('CP-REG-01', 'RF-05', 'Formulario vacío: muestra los 6 errores', ['direccion', 'zona', 'registradoPor', 'horaInicio', 'horaFin', 'milimetros'].every((n) => $('m-' + n).textContent));
  set('r-direccion', 'Vía a Pance, km 2'); set('r-zona', 'Pance'); set('r-registrador', 'Laura Quintero');
  hora('horaInicio', '17:00'); hora('horaFin', '16:00'); set('r-mm', '-3'); submit($('form-registro'));
  t('CP-REG-02', 'RF-05', 'Hora de fin anterior a la de inicio: error', /después/.test($('m-horaFin').textContent), $('m-horaFin').textContent);
  t('CP-REG-03', 'RF-05', 'Milímetros negativos: error', /mayores que 0/.test($('m-milimetros').textContent), $('m-milimetros').textContent);

  // Registro válido
  hora('horaInicio', '15:40'); hora('horaFin', '17:10'); set('r-mm', '22'); submit($('form-registro'));
  t('CP-REG-04', 'RF-09', 'Mientras calcula: botón deshabilitado y mensaje «Calculando…»', $('btn-registrar').disabled && /Calculando/.test($('res-estado').textContent));
  submit($('form-registro'));
  await wait(200);
  t('CP-REG-05', 'RF-06', 'El resultado muestra 22 mm', /^22/.test($('res-mm').textContent), $('res-mm').textContent);
  t('CP-REG-06', 'RF-06', 'Muestra «Pasa el estándar de Cali por 8 mm»', /Pasa el estándar de Cali por 8 mm/.test($('res-estado').textContent), $('res-estado').textContent);
  t('CP-REG-07', 'RF-07', 'Muestra la cuenta 22 × 14 × 1,5 h = 462, ajuste de 5,3 % y total 486,5', /22 × 14 × 1,5 h = 462\..*5,3 %.*486,5/.test($('res-cuenta').textContent), $('res-cuenta').textContent);
  t('CP-REG-08', 'RF-10', 'El reloj dibuja el tramo de lluvia', $('reloj-tramo').getAttribute('d').startsWith('M40 40L'));
  t('CP-REG-09', 'RF-11', 'Se guardó un solo registro (el doble envío no duplica)', PA.almacen.todos().length === 1, PA.almacen.todos().length);
  t('CP-REG-10', 'RF-12', 'El formulario se bloquea y el botón dice «Registrar otra zona»', $('r-mm').disabled && $('btn-registrar').textContent === 'Registrar otra zona');

  // Gráfica e historial
  t('CP-GRA-01', 'RF-14', 'La gráfica muestra una barra naranja para la zona que pasa el estándar', d.querySelectorAll('#grafica rect[fill="#F28C28"]').length >= 1 && /Pance/.test($('grafica').textContent));
  t('CP-HIS-01', 'RF-16', 'El historial tiene una fila por registro', d.querySelectorAll('#tabla-historial tbody tr').length === 1);

  // Clave de seguridad
  submit($('form-registro'));
  t('CP-CLA-01', 'RF-12', '«Registrar otra zona» lleva a la pantalla de clave', activa() === 'pantalla-clave', activa());
  t('CP-CLA-02', 'RF-13', 'La clave tiene 5 casillas', d.querySelectorAll('#casillas input').length === 5);
  [...d.querySelectorAll('#casillas input')].forEach((c, i) => { c.value = 'Z'; });
  submit($('form-clave'));
  t('CP-CLA-03', 'RF-13', 'Clave incorrecta: aparece la alerta', !$('aviso').hidden && /incorrecta/i.test($('aviso-titulo').textContent));
  $('aviso-ok').click();
  t('CP-CLA-04', 'RF-13', 'Tras la alerta vuelve al ingreso y cierra la sesión', activa() === 'pantalla-ingreso' && !PA.auth.activa(), activa());
  set('in-usuario', 'CVC'); set('in-clave', 'Lluvias'); submit($('form-ingreso'));
  t('CP-REG-11', 'RF-11', 'Los registros siguen ahí al volver a entrar', PA.almacen.todos().length === 1);
  submit($('form-registro'));
  'AGUA1'.split('').forEach((c, i) => { d.querySelectorAll('#casillas input')[i].value = c; });
  submit($('form-clave'));
  t('CP-CLA-05', 'RF-13', 'Clave correcta (AGUA1): vuelve al panel con los campos limpios', activa() === 'pantalla-panel' && $('r-mm').value === '' && !$('r-mm').disabled && $('btn-registrar').textContent === 'Calcular y registrar', activa());

  t('CP-HOR-06', 'RF-13', 'Al limpiar el formulario las listas de hora vuelven a «--»', $('g-horaInicio')._selects[0].value === '' && $('r-inicio').value === '' && $('r-fin').value === '');

  // Segundo registro
  set('r-direccion', 'Cra. 52 con calle 1'); set('r-zona', 'Siloé'); set('r-registrador', 'Laura Quintero');
  hora('horaInicio', '10:00'); hora('horaFin', '10:45'); set('r-mm', '9'); submit($('form-registro')); await wait(200);
  t('CP-REG-12', 'RF-06', 'Registro de 9 mm de mañana: no pasa el estándar y no lleva ajuste', /No pasa/.test($('res-estado').textContent) && /sin ajuste/.test($('res-cuenta').textContent), $('res-cuenta').textContent);
  t('CP-GRA-02', 'RF-14', 'La gráfica muestra una barra azul para la zona que no pasa', d.querySelectorAll('#grafica rect[fill="#3FA7C8"]').length >= 1);

  // Datos de ejemplo, gráfica, borrado
  $('btn-ejemplo').click();
  t('CP-DAT-01', 'RF-18', '«Cargar ejemplo» agrega 5 registros (total 7)', PA.almacen.todos().length === 7, PA.almacen.todos().length);
  t('CP-GRA-03', 'RF-14', 'La gráfica dibuja las barras de los registros', d.querySelectorAll('#grafica g > title').length === 7);
  t('CP-GRA-04', 'RF-14', 'Aparece la línea del estándar de 14 mm', /Estándar 14 mm/.test($('grafica').textContent));
  $('btn-borrar').click();
  t('CP-DAT-02', 'RF-18', 'Borrar pide confirmación y no borra al primer clic', PA.almacen.todos().length === 7);
  $('btn-borrar').click();
  t('CP-DAT-03', 'RF-18', 'El segundo clic borra todo y la gráfica lo indica', PA.almacen.todos().length === 0 && /Aún no hay/.test($('grafica').textContent));
  $('btn-salir').click();
  t('CP-SES-01', 'RF-03', 'Salir cierra la sesión y vuelve al ingreso', activa() === 'pantalla-ingreso' && !PA.auth.activa());

  console.log(fallas ? '\n' + fallas + ' FALLAS' : '\nE2E: todas las pruebas pasaron');
  process.exit(fallas ? 1 : 0);
})();

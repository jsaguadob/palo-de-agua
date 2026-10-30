/* Palo de Agua · conecta las pantallas, el cálculo, la gráfica y el almacenamiento */
(function (g) {
  var PA = g.PA, C = PA.CONFIG, U = PA.util, doc = g.document;
  var estado = { calculando: false, guardado: false, ultimoId: null, fotoPendiente: null, confirmarBorrar: null, toast: null };
  var CAMPOS = ['direccion', 'zona', 'registradoPor', 'horaInicio', 'horaFin', 'milimetros'];

  function $(id) { return doc.getElementById(id); }

  /* ---------- Pantallas, avisos y mensajes ---------- */
  function mostrar(id) {
    ['pantalla-ingreso', 'pantalla-panel', 'pantalla-clave'].forEach(function (p) {
      $(p).classList.toggle('activa', p === id);
    });
    g.scrollTo && g.scrollTo(0, 0);
  }
  function toast(texto) {
    var t = $('toast');
    t.textContent = texto; t.classList.add('ver');
    clearTimeout(estado.toast);
    estado.toast = setTimeout(function () { t.classList.remove('ver'); }, 3200);
  }
  function aviso(titulo, texto, alCerrar) {
    $('aviso-titulo').textContent = titulo; $('aviso-texto').textContent = texto;
    $('aviso').hidden = false; $('aviso-ok').focus();
    $('aviso-ok').onclick = function () { $('aviso').hidden = true; if (alCerrar) alCerrar(); };
  }

  /* ---------- Ingreso (Req 1) ---------- */
  function entrar() {
    $('usuario-sesion').textContent = PA.auth.usuario();
    mostrar('pantalla-panel');
    $('r-direccion').focus();
  }
  function salir() {
    PA.auth.cerrar();
    $('form-ingreso').reset(); $('in-error').hidden = true;
    mostrar('pantalla-ingreso'); $('in-usuario').focus();
  }
  function enviarIngreso(ev) {
    ev.preventDefault();
    var u = $('in-usuario').value, c = $('in-clave').value, err = $('in-error');
    if (!u.trim() || !c) { err.textContent = 'Escribe el usuario y la contraseña.'; err.hidden = false; return; }
    if (!PA.auth.validar(u, c)) { err.textContent = 'Usuario o contraseña incorrectos.'; err.hidden = false; $('in-clave').value = ''; $('in-clave').focus(); return; }
    err.hidden = true; PA.auth.abrir(u); entrar();
  }

  /* ---------- Horas: se eligen en listas (hora, minutos y a. m./p. m.) ---------- */
  var HORAS = { horaInicio: 'r-inicio', horaFin: 'r-fin' };
  function opcion(valor, texto) { return U.el('option', { value: valor }, texto); }
  function armarHora(campo) {
    var grupo = $('g-' + campo), oculto = $(HORAS[campo]), nombre = campo === 'horaInicio' ? 'inicio' : 'fin';
    var hh = U.el('select', { 'class': 'campo', 'aria-label': 'Hora de ' + nombre + ': hora' });
    var mm = U.el('select', { 'class': 'campo', 'aria-label': 'Hora de ' + nombre + ': minutos' });
    var pp = U.el('select', { 'class': 'campo', 'aria-label': 'Hora de ' + nombre + ': a. m. o p. m.' });
    hh.appendChild(opcion('', '--'));
    for (var h = 1; h <= 12; h++) hh.appendChild(opcion(String(h), String(h)));
    for (var m = 0; m < 60; m += 5) mm.appendChild(opcion(('0' + m).slice(-2), ('0' + m).slice(-2)));
    pp.appendChild(opcion('AM', 'a. m.')); pp.appendChild(opcion('PM', 'p. m.'));
    function sincronizar() {
      if (!hh.value) { oculto.value = ''; return; }
      var h24 = (+hh.value % 12) + (pp.value === 'PM' ? 12 : 0);
      oculto.value = ('0' + h24).slice(-2) + ':' + mm.value;
    }
    [hh, mm, pp].forEach(function (s) { s.addEventListener('change', sincronizar); grupo.appendChild(s); });
    grupo._selects = [hh, mm, pp];
    grupo._reiniciar = function () { hh.value = ''; mm.value = '00'; pp.value = 'AM'; oculto.value = ''; };
  }
  function elementoCampo(n) { return HORAS[n] ? $('g-' + n)._selects[0] : $('form-registro').elements[n]; }

  /* ---------- Formulario de registro (Req 2) ---------- */
  function leerForm() {
    var f = $('form-registro'), d = {};
    CAMPOS.forEach(function (n) { d[n] = f.elements[n].value; });
    return d;
  }
  function mostrarErrores(errores) {
    CAMPOS.forEach(function (n) {
      $('m-' + n).textContent = errores[n] || '';
      var els = HORAS[n] ? $('g-' + n)._selects : [$('form-registro').elements[n]];
      els.forEach(function (e) { e.setAttribute('aria-invalid', errores[n] ? 'true' : 'false'); });
    });
    for (var i = 0; i < CAMPOS.length; i++) if (errores[CAMPOS[i]]) { elementoCampo(CAMPOS[i]).focus(); break; }
  }
  function bloquear(si) {
    Array.prototype.forEach.call($('form-registro').querySelectorAll('input,select'), function (e) { e.disabled = si; });
    $('btn-registrar').textContent = si ? 'Registrar otra zona' : 'Calcular y registrar';
  }
  function limpiarForm() {
    $('form-registro').reset();
    Object.keys(HORAS).forEach(function (n) { $('g-' + n)._reiniciar(); });
    mostrarErrores({});
    bloquear(false);
    estado.guardado = false; estado.ultimoId = null; estado.fotoPendiente = null;
    ponerFoto(null);
    PA.reloj.reposo();
    $('res-mm').innerHTML = '—<small> mm</small>';
    $('res-estado').textContent = 'Llena el formulario y pulsa «Calcular y registrar».';
    $('res-cuenta').textContent = '';
  }

  function pintarResultado(r) {
    var mm = $('res-mm'); mm.textContent = U.num(r.milimetros);
    mm.appendChild(U.el('small', null, ' mm'));
    var e = $('res-estado'); e.textContent = '';
    if (r.pasaEstandar) { e.appendChild(doc.createTextNode('Pasa el estándar de Cali por ')); e.appendChild(U.el('em', null, U.num(r.excesoMm) + ' mm')); }
    else { e.appendChild(doc.createTextNode('No pasa el estándar de Cali ')); e.appendChild(U.el('em', { 'class': 'bien' }, C.ESTANDAR_MM + ' mm')); }
    var cuenta = U.num(r.milimetros) + ' × ' + C.ESTANDAR_MM + ' × ' + U.num(r.horas) + ' h = ' + U.num(r.base) + '. ';
    cuenta += r.aplicaAjuste
      ? 'Lluvia entre las 3 y las 6 p. m.: ajuste de ' + U.num(C.AJUSTE * 100) + ' %, total ' + U.num(r.total) + '.'
      : 'Fuera del horario de 3 a 6 p. m.: sin ajuste, total ' + U.num(r.total) + '.';
    $('res-cuenta').textContent = cuenta;
  }

  function enviarRegistro(ev) {
    ev.preventDefault();
    if (estado.calculando) return;
    if (estado.guardado) { irClave(); return; }
    var v = PA.registro.validar(leerForm());
    mostrarErrores(v.errores);
    if (!v.ok) return;

    estado.calculando = true;
    $('btn-registrar').disabled = true;
    $('res-estado').textContent = 'Calculando…';
    PA.reloj.girar();
    var reducido = g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      var d = v.datos, r = PA.calculo.calcular(d);
      var reg = {
        id: Date.now() + '-' + d.zona, fecha: new Date().toISOString(), zona: d.zona, direccion: d.direccion,
        horaInicio: d.horaInicio, horaFin: d.horaFin, milimetros: d.milimetros, registradoPor: d.registradoPor,
        pasaEstandar: r.pasaEstandar, excesoMm: r.excesoMm, ajusteAplicado: r.aplicaAjuste, base: r.base, total: r.total,
        foto: estado.fotoPendiente
      };
      var res = PA.almacen.agregar(reg);
      PA.reloj.mostrar(d.horaInicio, d.horaFin);
      pintarResultado(r);
      estado.calculando = false; estado.guardado = true; estado.ultimoId = reg.id;
      bloquear(true); $('btn-registrar').disabled = false;
      refrescar();
      if (!res.ok) toast('Registro calculado, pero no se pudo guardar en este navegador.');
      else if (res.sinFoto) { ponerFoto(null); toast('Registro guardado sin la foto (almacenamiento lleno).'); }
      else toast('Registro guardado');
    }, reducido ? 600 : C.ESPERA_MS);
  }

  /* ---------- Clave de seguridad (Req 3) ---------- */
  function irClave() {
    PA.clave.limpiar(); mostrar('pantalla-clave'); PA.clave.foco();
  }
  function enviarClave(ev) {
    ev.preventDefault();
    if (PA.clave.valor().length < 5) { toast('Escribe los 5 caracteres de la clave.'); return; }
    if (PA.clave.correcta()) { limpiarForm(); mostrar('pantalla-panel'); $('r-direccion').focus(); toast('Listo: ya puedes registrar otra zona.'); }
    else aviso('Clave incorrecta', 'La clave no coincide. Por seguridad volverás al ingreso.', salir);
  }

  /* ---------- Foto (Req 5) ---------- */
  function ponerFoto(url) {
    var img = $('foto-vista'), caja = $('foto-caja');
    if (url) { img.src = url; img.hidden = false; caja.classList.add('con-foto'); }
    else { img.removeAttribute('src'); img.hidden = true; caja.classList.remove('con-foto'); }
  }
  function alTenerFoto(url) {
    ponerFoto(url);
    if (estado.guardado && estado.ultimoId) {
      if (PA.almacen.actualizar(estado.ultimoId, { foto: url })) { toast('Foto agregada al registro'); refrescar(); }
      else toast('No se pudo guardar la foto (almacenamiento lleno).');
    } else { estado.fotoPendiente = url; toast('Foto lista: se guardará con el registro'); }
  }

  /* ---------- Gráfica e historial (Req 5) ---------- */
  function filaVacia(tbody) {
    var tr = U.el('tr'), td = U.el('td', { colspan: 7, 'class': 'vacio' }, 'Todavía no hay registros.');
    tr.appendChild(td); tbody.appendChild(tr);
  }
  function refrescar() {
    var regs = PA.almacen.todos();
    PA.grafica.render($('grafica'), regs);
    var tb = $('tabla-historial').tBodies[0]; tb.innerHTML = '';
    if (!regs.length) { filaVacia(tb); return; }
    regs.slice().reverse().forEach(function (r) {
      var tr = U.el('tr');
      tr.appendChild(U.el('td', null, U.fecha(r.fecha)));
      var z = U.el('td', null, r.zona); z.appendChild(U.el('small', null, r.direccion)); tr.appendChild(z);
      tr.appendChild(U.el('td', null, U.hora12(r.horaInicio) + ' – ' + U.hora12(r.horaFin)));
      tr.appendChild(U.el('td', null, U.num(r.milimetros)));
      tr.appendChild(U.el('td', null, U.num(r.total)));
      var e = U.el('td'); e.appendChild(U.el('span', { 'class': 'pill' + (r.pasaEstandar ? ' alta' : '') },
        r.pasaEstandar ? 'Pasa +' + U.num(r.excesoMm) + ' mm' : 'Dentro')); tr.appendChild(e);
      var f = U.el('td');
      if (r.foto) f.appendChild(U.el('img', { 'class': 'miniatura', src: r.foto, alt: 'Foto de ' + r.zona })); else f.textContent = '—';
      tr.appendChild(f); tb.appendChild(tr);
    });
  }

  function cargarEjemplo() {
    var base = [['Pance', 'Vía a Pance, km 2', '15:40', '17:10', 22, 'Laura Quintero'], ['Siloé', 'Cra. 52 con calle 1', '10:00', '10:45', 9, 'Laura Quintero'],
      ['Jamundí', 'Calle 14, Jamundí', '16:20', '17:00', 16, 'Laura Quintero'], ['Aguablanca', 'Cra. 28D con calle 72', '07:30', '09:30', 31, 'Laura Quintero'],
      ['Granada', 'Av. 9N con calle 17', '13:00', '13:40', 12, 'Laura Quintero']];
    var arr = PA.almacen.todos();
    base.forEach(function (b, i) {
      var d = { horaInicio: b[2], horaFin: b[3], milimetros: b[4] }, r = PA.calculo.calcular(d), f = new Date();
      f.setHours(+b[2].split(':')[0], +b[2].split(':')[1], 0, 0);
      arr.push({ id: 'ej-' + Date.now() + '-' + i, fecha: f.toISOString(), zona: b[0], direccion: b[1], horaInicio: b[2], horaFin: b[3],
        milimetros: b[4], registradoPor: b[5], pasaEstandar: r.pasaEstandar, excesoMm: r.excesoMm, ajusteAplicado: r.aplicaAjuste,
        base: r.base, total: r.total, foto: null });
    });
    PA.almacen.reemplazar(arr); refrescar(); toast('Se cargaron 5 registros de ejemplo');
  }
  function borrarTodo() {
    var b = $('btn-borrar');
    if (!estado.confirmarBorrar) {
      b.textContent = '¿Seguro? Pulsa otra vez'; b.classList.add('peligro');
      estado.confirmarBorrar = setTimeout(function () { b.textContent = 'Borrar registros'; b.classList.remove('peligro'); estado.confirmarBorrar = null; }, 4000);
      return;
    }
    clearTimeout(estado.confirmarBorrar); estado.confirmarBorrar = null;
    b.textContent = 'Borrar registros'; b.classList.remove('peligro');
    PA.almacen.borrarTodo(); refrescar(); toast('Registros borrados');
  }
  function exportarCSV() {
    var regs = PA.almacen.todos();
    if (!regs.length) { toast('No hay registros para exportar.'); return; }
    var q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    var filas = [['fecha', 'zona', 'direccion', 'hora_inicio', 'hora_fin', 'milimetros', 'registrado_por', 'pasa_estandar', 'exceso_mm', 'ajuste_5_3', 'total']];
    regs.forEach(function (r) {
      filas.push([U.fecha(r.fecha), U.csvSeguro(r.zona), U.csvSeguro(r.direccion), r.horaInicio, r.horaFin, U.num(r.milimetros), U.csvSeguro(r.registradoPor),
        r.pasaEstandar ? 'Sí' : 'No', U.num(r.excesoMm), r.ajusteAplicado ? 'Sí' : 'No', U.num(r.total)]);
    });
    var texto = '\ufeff' + filas.map(function (f) { return f.map(q).join(';'); }).join('\r\n');
    var url = g.URL.createObjectURL(new g.Blob([texto], { type: 'text/csv;charset=utf-8' }));
    var a = U.el('a', { href: url, download: 'palo-de-agua-registros.csv' });
    doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
    setTimeout(function () { g.URL.revokeObjectURL(url); }, 1000);
    toast('Descargando palo-de-agua-registros.csv');
  }

  /* ---------- Inicio ---------- */
  function iniciar() {
    var sel = $('r-zona');
    sel.appendChild(U.el('option', { value: '' }, 'Elige la zona'));
    C.ZONAS.forEach(function (z) { sel.appendChild(U.el('option', { value: z }, z)); });
    Object.keys(HORAS).forEach(armarHora);
    PA.clave.init($('casillas'));
    PA.reloj.reposo();
    PA.foto.init({
      input: $('foto-input'), btnSubir: $('btn-subir'), btnTomar: $('btn-tomar'), modal: $('camara'), video: $('cam-video'),
      btnCapturar: $('cam-capturar'), btnCancelar: $('cam-cancelar'), btnGirar: $('cam-girar'), msg: $('cam-msg'),
      onFoto: alTenerFoto, onError: toast
    });
    $('form-ingreso').addEventListener('submit', enviarIngreso);
    $('form-registro').addEventListener('submit', enviarRegistro);
    $('form-clave').addEventListener('submit', enviarClave);
    // Aviso inmediato mientras se escribe el nombre (no se borra nada: solo se avisa)
    $('r-registrador').addEventListener('input', function () {
      var v = $('r-registrador').value, malo = v.trim() !== '' && /[^\p{L} .'’-]/u.test(v);
      $('m-registradoPor').textContent = malo ? PA.registro.mensajeNombre(v) : '';
      $('r-registrador').setAttribute('aria-invalid', malo ? 'true' : 'false');
    });
    $('r-mm').addEventListener('input', function () {
      var v = $('r-mm').value, m = v.trim() === '' ? '' : PA.registro.mensajeMm(v);
      $('m-milimetros').textContent = m; $('r-mm').setAttribute('aria-invalid', m ? 'true' : 'false');
    });
    $('r-direccion').addEventListener('input', function () {
      var v = $('r-direccion').value, m = v.trim().length < 3 ? '' : PA.registro.mensajeDireccion(v);
      $('m-direccion').textContent = m; $('r-direccion').setAttribute('aria-invalid', m ? 'true' : 'false');
    });
    $('btn-salir').addEventListener('click', salir);
    $('btn-volver').addEventListener('click', function () { mostrar('pantalla-panel'); });
    $('btn-ejemplo').addEventListener('click', cargarEjemplo);
    $('btn-csv').addEventListener('click', exportarCSV);
    $('btn-borrar').addEventListener('click', borrarTodo);
    refrescar();
    if (PA.auth.activa()) entrar();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})(window);

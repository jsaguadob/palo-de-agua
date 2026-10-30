/* Lectura y validación del formulario de registro (Req 2) */
(function (g) {
  var PA = (g.PA = g.PA || {});

  /* Nombre: solo letras (con tildes, ñ y ü), espacios, punto, apóstrofo y guion. Sin números ni símbolos. */
  var RE_NOMBRE = /^\p{L}+(?:[ .'’-]+\p{L}+)*\.?$/u;
  /* Dirección: letras, números, espacios y . , # ° ' / ( ) - (para «Cra. 28D # 72-15») */
  var RE_DIRECCION = /^[\p{L}\p{N} .,#°'’\/()\-–]+$/u;

  function nombreValido(s) {
    s = String(s).trim();
    return s.length >= 2 && s.length <= 60 && RE_NOMBRE.test(s);
  }
  function mensajeNombre(s) {
    s = String(s).trim();
    if (s.length < 2) return 'Escribe quién registra (mínimo 2 letras).';
    if (s.length > 60) return 'El nombre es demasiado largo (máximo 60 caracteres).';
    if (!RE_NOMBRE.test(s)) return 'Escribe solo letras: el nombre no puede llevar números ni símbolos.';
    return '';
  }
  function mensajeDireccion(s) {
    s = String(s || '').trim();
    if (s.length < 3) return 'Escribe la dirección de la zona.';
    if (s.length > 100) return 'La dirección es demasiado larga (máximo 100 caracteres).';
    if (!RE_DIRECCION.test(s)) return 'La dirección tiene caracteres no permitidos.';
    if (!/\p{L}/u.test(s)) return 'La dirección debe incluir al menos una letra.';
    return '';
  }

  function validar(d) {
    var e = {}, mm = Number(String(d.milimetros).replace(',', '.'));
    var md = mensajeDireccion(d.direccion); if (md) e.direccion = md;
    if (!d.zona) e.zona = 'Elige la zona.';
    var mn = mensajeNombre(d.registradoPor || ''); if (mn) e.registradoPor = mn;
    if (!d.horaInicio) e.horaInicio = 'Falta la hora de inicio.';
    if (!d.horaFin) e.horaFin = 'Falta la hora de fin.';
    if (d.horaInicio && d.horaFin && PA.calculo.aMin(d.horaFin) <= PA.calculo.aMin(d.horaInicio))
      e.horaFin = 'La hora de fin debe ser después de la de inicio.';
    if (String(d.milimetros).trim() === '' || isNaN(mm)) e.milimetros = 'Escribe los milímetros (solo números).';
    else if (mm <= 0) e.milimetros = 'Los milímetros deben ser mayores que 0.';
    else if (mm > 500) e.milimetros = 'Valor demasiado alto (máximo 500 mm).';
    var ok = Object.keys(e).length === 0;
    return {
      ok: ok, errores: e,
      datos: ok ? {
        direccion: d.direccion.trim(), zona: d.zona, registradoPor: d.registradoPor.trim(),
        horaInicio: d.horaInicio, horaFin: d.horaFin, milimetros: mm
      } : null
    };
  }
  PA.registro = { validar: validar, nombreValido: nombreValido, mensajeNombre: mensajeNombre, mensajeDireccion: mensajeDireccion };
})(typeof window !== 'undefined' ? window : globalThis);

/* Lectura y validación del formulario de registro (Req 2) */
(function (g) {
  var PA = (g.PA = g.PA || {});

  /* Nombre: solo letras (con tildes, ñ y ü), espacios, punto, apóstrofo y guion. Sin números ni símbolos. */
  var RE_NOMBRE = /^\p{L}+(?:[ .'’-]+\p{L}+)*\.?$/u;
  /* Dirección: letras, números, espacios y . , # ° ' / ( ) - (para «Cra. 28D # 72-15») */
  var RE_DIRECCION = /^[\p{L}\p{N} .,#°'’\/()\-–]+$/u;

  function nombreValido(s) {
    s = normalizar(s);
    return s.length >= 2 && s.length <= 60 && RE_NOMBRE.test(s);
  }
  function mensajeNombre(s) {
    s = normalizar(s);
    if (s.length < 2) return 'Escribe quién registra (mínimo 2 letras).';
    if (s.length > 60) return 'El nombre es demasiado largo (máximo 60 caracteres).';
    if (!RE_NOMBRE.test(s)) return 'Escribe solo letras: el nombre no puede llevar números ni símbolos.';
    return '';
  }
  function mensajeDireccion(s) {
    s = normalizar(s);
    if (s.length < 3) return 'Escribe la dirección de la zona.';
    if (s.length > 100) return 'La dirección es demasiado larga (máximo 100 caracteres).';
    if (!RE_DIRECCION.test(s)) return 'La dirección tiene caracteres no permitidos.';
    if (!/\p{L}/u.test(s)) return 'La dirección debe incluir al menos una letra.';
    return '';
  }

  function normalizar(s) { return String(s == null ? '' : s).trim().replace(/\s+/g, ' '); }

  /* Precipitación: número positivo, con coma o punto, hasta 2 decimales y máximo 500 mm.
     Se rechazan negativos, letras, notación científica (1e3), hexadecimal (0x10) e infinito. */
  function mensajeMm(v) {
    var s = String(v == null ? '' : v).trim();
    if (s === '') return 'Escribe los milímetros de lluvia.';
    if (/^[-−–]/.test(s)) return 'La precipitación no puede ser negativa.';
    if (!/^\d+(?:[.,]\d+)?$/.test(s)) return 'Escribe solo números (ejemplo: 22 o 22,5).';
    if (/[.,]\d{3,}$/.test(s)) return 'Usa máximo 2 decimales.';
    var n = Number(s.replace(',', '.'));
    if (n <= 0) return 'Los milímetros deben ser mayores que 0.';
    if (n > 500) return 'Valor demasiado alto: el máximo es 500 mm.';
    return '';
  }

  function validar(d) {
    var e = {}, mm = Number(String(d.milimetros == null ? '' : d.milimetros).trim().replace(',', '.'));
    var md = mensajeDireccion(d.direccion); if (md) e.direccion = md;
    if (!d.zona) e.zona = 'Elige la zona.';
    var mn = mensajeNombre(d.registradoPor || ''); if (mn) e.registradoPor = mn;
    if (!d.horaInicio) e.horaInicio = 'Falta la hora de inicio.';
    if (!d.horaFin) e.horaFin = 'Falta la hora de fin.';
    if (d.horaInicio && d.horaFin && PA.calculo.aMin(d.horaFin) <= PA.calculo.aMin(d.horaInicio))
      e.horaFin = 'La hora de fin debe ser después de la de inicio.';
    var mmMsg = mensajeMm(d.milimetros); if (mmMsg) e.milimetros = mmMsg;
    var ok = Object.keys(e).length === 0;
    return {
      ok: ok, errores: e,
      datos: ok ? {
        direccion: normalizar(d.direccion), zona: d.zona, registradoPor: normalizar(d.registradoPor),
        horaInicio: d.horaInicio, horaFin: d.horaFin, milimetros: mm
      } : null
    };
  }
  PA.registro = { validar: validar, nombreValido: nombreValido, mensajeNombre: mensajeNombre, mensajeDireccion: mensajeDireccion, mensajeMm: mensajeMm };
})(typeof window !== 'undefined' ? window : globalThis);

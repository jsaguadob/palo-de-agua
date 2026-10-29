/* Lectura y validación del formulario de registro (Req 2) */
(function (g) {
  var PA = (g.PA = g.PA || {});

  function validar(d) {
    var e = {}, mm = Number(String(d.milimetros).replace(',', '.'));
    if (!d.direccion || d.direccion.trim().length < 3) e.direccion = 'Escribe la dirección de la zona.';
    if (!d.zona) e.zona = 'Elige la zona.';
    if (!d.registradoPor || d.registradoPor.trim().length < 2) e.registradoPor = 'Escribe quién registra.';
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
  PA.registro = { validar: validar };
})(typeof window !== 'undefined' ? window : globalThis);

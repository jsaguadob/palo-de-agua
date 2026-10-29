/* Cálculo frente al estándar de Cali y ajuste del 5,3 % (Req 2 y 4) */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var C = PA.CONFIG;

  function aMin(hhmm) {
    var p = String(hhmm).split(':');
    return +p[0] * 60 + +p[1];
  }
  function redondear(n, d) {
    var f = Math.pow(10, d);
    return Math.round((n + Number.EPSILON) * f) / f;
  }

  /* datos: { milimetros, horaInicio:"HH:MM", horaFin:"HH:MM" }
     Cuenta del mockup: mm × estándar × horas; si el aguacero inicia entre
     las 3:00 y las 6:00 p. m., se suma el ajuste del 5,3 %. */
  function calcular(d) {
    var mm = Number(d.milimetros);
    var ini = aMin(d.horaInicio), fin = aMin(d.horaFin);
    var horas = (fin - ini) / 60;
    var base = mm * C.ESTANDAR_MM * horas;
    var aplica = ini >= aMin(C.VENTANA_DESDE) && ini < aMin(C.VENTANA_HASTA);
    var total = aplica ? base * (1 + C.AJUSTE) : base;
    return {
      milimetros: mm,
      horas: horas,
      base: redondear(base, 1),
      aplicaAjuste: aplica,
      total: redondear(total, 1),
      excesoMm: redondear(Math.max(0, mm - C.ESTANDAR_MM), 1),
      pasaEstandar: mm > C.ESTANDAR_MM
    };
  }

  PA.calculo = { calcular: calcular, aMin: aMin, redondear: redondear };
  if (typeof module === 'object' && module.exports) module.exports = PA.calculo;
})(typeof window !== 'undefined' ? window : globalThis);

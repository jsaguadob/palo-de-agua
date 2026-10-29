/* Reloj de espera (Req 2): gira mientras se calcula y luego muestra el tramo de lluvia */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var timer = null, aH = 305, aM = 60;

  function $(id) { return document.getElementById(id); }
  function poner() {
    $('mano-h').setAttribute('transform', 'rotate(' + aH + ' 40 40)');
    $('mano-m').setAttribute('transform', 'rotate(' + aM + ' 40 40)');
  }
  function punto(a) {
    var r = a * Math.PI / 180;
    return (40 + 30 * Math.sin(r)).toFixed(1) + ' ' + (40 - 30 * Math.cos(r)).toFixed(1);
  }
  function angulo(hhmm) {
    var p = hhmm.split(':'), h = +p[0], m = +p[1];
    return ((h % 12) + m / 60) * 30;
  }
  function reposo() {
    detener(); aH = 305; aM = 60; poner();
    $('reloj-tramo').setAttribute('d', '');
  }
  function girar() {
    detener();
    $('reloj-tramo').setAttribute('d', '');
    $('reloj').classList.add('girando');
    var reducido = g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido) return;
    timer = setInterval(function () { aM = (aM + 14) % 360; aH = (aH + 14 / 12) % 360; poner(); }, 40);
  }
  function detener() {
    if (timer) { clearInterval(timer); timer = null; }
    $('reloj').classList.remove('girando');
  }
  /* Muestra el tramo de inicio a fin y deja las manecillas en la hora de fin */
  function mostrar(ini, fin) {
    detener();
    var a1 = angulo(ini), a2 = angulo(fin), span = (a2 - a1 + 360) % 360;
    var min = PA.calculo.aMin(fin) - PA.calculo.aMin(ini);
    var d = min >= 720 ? 'M40 10A30 30 0 1 1 39.9 10Z'
      : 'M40 40L' + punto(a1) + 'A30 30 0 ' + (span > 180 ? 1 : 0) + ' 1 ' + punto(a2) + 'Z';
    $('reloj-tramo').setAttribute('d', d);
    aH = a2; aM = (+fin.split(':')[1]) * 6; poner();
    $('reloj').setAttribute('aria-label', 'Reloj con el tramo de ' + PA.util.hora12(ini) + ' a ' + PA.util.hora12(fin));
  }
  PA.reloj = { girar: girar, detener: detener, mostrar: mostrar, reposo: reposo };
})(typeof window !== 'undefined' ? window : globalThis);

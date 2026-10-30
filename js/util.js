/* Utilidades: formato de números, horas y fechas */
(function (g) {
  var PA = (g.PA = g.PA || {});
  function num(n) {                       // 486.5 -> "486,5"
    var r = Math.round((Number(n) + Number.EPSILON) * 10) / 10;
    return String(r).replace('.', ',');
  }
  function hora12(hhmm) {                 // "15:40" -> "3:40 p. m."
    var p = String(hhmm).split(':'), h = +p[0], m = p[1];
    var suf = h >= 12 ? 'p. m.' : 'a. m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + m + ' ' + suf;
  }
  function fecha(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2);
    return dd + '/' + mm + '/' + d.getFullYear();
  }
  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (texto != null) e.textContent = texto;
    return e;
  }
  /* Evita que Excel tome un texto como fórmula (=, +, -, @): le antepone un apóstrofo */
  function csvSeguro(v) {
    v = String(v);
    return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
  }
  PA.util = { num: num, hora12: hora12, fecha: fecha, el: el, csvSeguro: csvSeguro };
})(typeof window !== 'undefined' ? window : globalThis);

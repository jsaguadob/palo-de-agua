/* Gráfica de barras colgantes sobre papel milimetrado (Req 5) */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var NS = 'http://www.w3.org/2000/svg';

  function s(tag, attrs, texto) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (texto != null) e.textContent = texto;
    return e;
  }

  function render(cont, registros) {
    var C = PA.CONFIG, U = PA.util;
    var datos = registros.slice(-C.MAX_BARRAS), n = datos.length;
    var svg = s('svg', {
      viewBox: '0 0 640 272', role: 'img',
      'aria-label': 'Gráfica de barras colgantes de precipitación por zona frente al estándar de ' + C.ESTANDAR_MM + ' mm'
    });
    var defs = s('defs', {});
    var p1 = s('pattern', { id: 'mm', width: 6, height: 6, patternUnits: 'userSpaceOnUse' });
    p1.appendChild(s('path', { d: 'M6 0H0V6', fill: 'none', stroke: '#2E7D5B', 'stroke-opacity': '.12' }));
    var p2 = s('pattern', { id: 'mm5', width: 30, height: 30, patternUnits: 'userSpaceOnUse' });
    p2.appendChild(s('path', { d: 'M30 0H0V30', fill: 'none', stroke: '#2E7D5B', 'stroke-opacity': '.28' }));
    defs.appendChild(p1); defs.appendChild(p2); svg.appendChild(defs);
    svg.appendChild(s('rect', { x: 0, y: 0, width: 640, height: 272, fill: 'url(#mm)' }));
    svg.appendChild(s('rect', { x: 0, y: 0, width: 640, height: 272, fill: 'url(#mm5)' }));
    svg.appendChild(s('rect', { x: 10, y: 8, width: 620, height: 22, rx: 11, fill: '#2E7D5B' }));
    var postes = s('g', { fill: '#164A33' });
    for (var i = 1; i <= 4; i++) postes.appendChild(s('rect', { x: 10 + 620 * i / 5 - 3, y: 4, width: 6, height: 30, rx: 3 }));
    svg.appendChild(postes);

    var maxMm = 31;
    datos.forEach(function (d) { if (d.milimetros > maxMm) maxMm = d.milimetros; });
    var k = Math.min(6, 186 / maxMm);                      // píxeles por milímetro

    if (n === 0) {
      svg.appendChild(s('text', { x: 320, y: 150, 'text-anchor': 'middle', 'font-size': 18, fill: '#47636b', 'font-family': 'Karla,system-ui,sans-serif' },
        'Aún no hay registros. Guarda uno o carga el ejemplo.'));
    } else {
      var slot = 620 / n, fz = n > 6 ? 12 : 14;
      datos.forEach(function (d, i) {
        var cx = 10 + slot * (i + 0.5), h = Math.max(12, d.milimetros * k);
        var grupo = s('g', {});
        var tt = s('title', {}, d.zona + ' · ' + U.num(d.milimetros) + ' mm · ' + U.hora12(d.horaInicio) + ' a ' + U.hora12(d.horaFin) +
          (d.pasaEstandar ? ' · pasa el estándar por ' + U.num(d.excesoMm) + ' mm' : ' · dentro del estándar'));
        grupo.appendChild(tt);
        grupo.appendChild(s('rect', { x: cx - 13, y: 42, width: 26, height: h, rx: 13, fill: d.pasaEstandar ? '#F28C28' : '#3FA7C8' }));
        var vy = h < 34 ? 42 + h + 18 : 68;
        grupo.appendChild(s('text', { x: cx, y: vy, 'text-anchor': 'middle', 'font-size': 15, fill: '#0F2A33',
          'font-family': "Alfa Slab One,Rockwell,Georgia,serif" }, U.num(d.milimetros)));
        grupo.appendChild(s('text', { x: cx, y: 264, 'text-anchor': 'middle', 'font-size': fz, fill: '#0F2A33',
          'font-family': 'Karla,system-ui,sans-serif' }, d.zona));
        svg.appendChild(grupo);
      });
    }
    var ly = 42 + C.ESTANDAR_MM * k;
    svg.appendChild(s('line', { x1: 10, y1: ly, x2: 630, y2: ly, stroke: '#0F2A33', 'stroke-width': 2, 'stroke-dasharray': '7 6' }));
    svg.appendChild(s('text', { x: 628, y: ly + 18, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 700, fill: '#0F2A33',
      'font-family': 'Karla,system-ui,sans-serif' }, 'Estándar ' + C.ESTANDAR_MM + ' mm'));
    cont.innerHTML = '';
    cont.appendChild(svg);
  }
  PA.grafica = { render: render };
})(typeof window !== 'undefined' ? window : globalThis);

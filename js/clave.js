/* Clave de seguridad de 5 casillas (Req 3) */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var casillas = [];

  function init(contenedor) {
    contenedor.innerHTML = '';
    casillas = [];
    for (var i = 0; i < 5; i++) {
      var inp = PA.util.el('input', {
        type: 'text', maxlength: '1', inputmode: 'text', autocomplete: 'off', autocapitalize: 'characters',
        spellcheck: 'false', 'aria-label': 'Carácter ' + (i + 1) + ' de 5'
      });
      (function (idx, input) {
        input.addEventListener('input', function () {
          input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (input.value && idx < 4) casillas[idx + 1].focus();
        });
        input.addEventListener('keydown', function (ev) {
          if (ev.key === 'Backspace' && !input.value && idx > 0) { casillas[idx - 1].focus(); casillas[idx - 1].value = ''; }
          if (ev.key === 'ArrowLeft' && idx > 0) casillas[idx - 1].focus();
          if (ev.key === 'ArrowRight' && idx < 4) casillas[idx + 1].focus();
        });
        input.addEventListener('paste', function (ev) {
          var t = ((ev.clipboardData || g.clipboardData).getData('text') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (!t) return;
          ev.preventDefault();
          for (var j = 0; j < 5; j++) casillas[j].value = t[j] || '';
          casillas[Math.min(t.length, 4)].focus();
        });
      })(i, inp);
      casillas.push(inp);
      contenedor.appendChild(inp);
    }
  }
  function valor() { return casillas.map(function (c) { return c.value; }).join(''); }
  function limpiar() { casillas.forEach(function (c) { c.value = ''; }); }
  function foco() { if (casillas[0]) casillas[0].focus(); }
  function correcta() { return valor().toUpperCase() === PA.CONFIG.CLAVE_SEGURIDAD; }

  PA.clave = { init: init, valor: valor, limpiar: limpiar, foco: foco, correcta: correcta };
})(typeof window !== 'undefined' ? window : globalThis);

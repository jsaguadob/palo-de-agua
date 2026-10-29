/* Captura o carga de la foto de la zona (Req 5). Se reduce a 800 px para que quepa en localStorage */
(function (g) {
  var PA = (g.PA = g.PA || {});

  function reducir(archivo, cb, err) {
    var lector = new FileReader();
    lector.onerror = err;
    lector.onload = function () {
      var img = new Image();
      img.onerror = err;
      img.onload = function () {
        var max = 800, esc = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * esc); c.height = Math.round(img.height * esc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  }

  function init(input, boton, onFoto, onError) {
    boton.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) { onError('Elige un archivo de imagen.'); return; }
      reducir(f, onFoto, function () { onError('No se pudo leer la imagen.'); });
      input.value = '';
    });
  }
  PA.foto = { init: init };
})(typeof window !== 'undefined' ? window : globalThis);

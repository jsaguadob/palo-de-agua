/* Foto de la zona (Req 5): tomar con la cámara o subir una imagen.
   La foto se reduce a 800 px para que quepa en localStorage. */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var MAX = 800, CALIDAD = 0.72;
  var cfg = null, stream = null, orientacion = 'environment';

  function soportaCamara() {
    return !!(g.navigator && g.navigator.mediaDevices && g.navigator.mediaDevices.getUserMedia);
  }
  function aJpeg(fuente, ancho, alto) {
    var esc = Math.min(1, MAX / Math.max(ancho, alto));
    var c = g.document.createElement('canvas');
    c.width = Math.round(ancho * esc); c.height = Math.round(alto * esc);
    c.getContext('2d').drawImage(fuente, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', CALIDAD);
  }

  /* ----- Subir una imagen desde el dispositivo ----- */
  function reducirArchivo(archivo, ok, fallo) {
    var lector = new g.FileReader();
    lector.onerror = fallo;
    lector.onload = function () {
      var img = new g.Image();
      img.onerror = fallo;
      img.onload = function () { ok(aJpeg(img, img.width, img.height)); };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  }

  /* ----- Cámara ----- */
  function detener() {
    if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
    if (cfg && cfg.video) cfg.video.srcObject = null;
  }
  function motivo(e) {
    var n = e && e.name;
    if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') return 'No se dio permiso para usar la cámara.';
    if (n === 'NotFoundError' || n === 'DevicesNotFoundError') return 'No se encontró ninguna cámara.';
    return 'No se pudo abrir la cámara.';
  }
  function sinCamara(texto) {
    cerrar(false);
    cfg.onError(texto + ' Usa «Subir foto».');
    if (cfg.btnSubir && cfg.btnSubir.focus) cfg.btnSubir.focus();
  }
  function pedirFlujo() {
    detener();
    return g.navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: orientacion }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false
    }).then(function (s) {
      stream = s; cfg.video.srcObject = s;
      var p = cfg.video.play && cfg.video.play();
      if (p && p.catch) p.catch(function () {});
      cfg.btnCapturar.disabled = false; cfg.msg.textContent = '';
      var md = g.navigator.mediaDevices;
      if (md.enumerateDevices) md.enumerateDevices().then(function (l) {
        cfg.btnGirar.hidden = l.filter(function (d) { return d.kind === 'videoinput'; }).length < 2;
      }).catch(function () { cfg.btnGirar.hidden = true; });
      else cfg.btnGirar.hidden = true;
    });
  }
  function abrir() {
    if (!soportaCamara()) { cfg.onError('Este navegador o esta conexión no permite abrir la cámara. Usa «Subir foto».'); cfg.btnSubir.focus(); return; }
    cfg.modal.hidden = false; cfg.btnCapturar.disabled = true; cfg.btnGirar.hidden = true;
    cfg.msg.textContent = 'Abriendo la cámara… acepta el permiso si el navegador lo pide.';
    cfg.btnCancelar.focus();
    pedirFlujo().catch(function (e) { sinCamara(motivo(e)); });
  }
  function cerrar(devolverFoco) {
    detener();
    cfg.modal.hidden = true;
    if (devolverFoco !== false && cfg.btnTomar.focus) cfg.btnTomar.focus();
  }
  function capturar() {
    var v = cfg.video;
    if (!v.videoWidth) { cfg.msg.textContent = 'La cámara aún no está lista. Espera un momento.'; return; }
    var url = aJpeg(v, v.videoWidth, v.videoHeight);
    cerrar();
    cfg.onFoto(url);
  }
  function girar() {
    orientacion = orientacion === 'environment' ? 'user' : 'environment';
    cfg.btnCapturar.disabled = true;
    pedirFlujo().catch(function (e) { sinCamara(motivo(e)); });
  }

  /* cfg: { input, btnSubir, btnTomar, modal, video, btnCapturar, btnCancelar, btnGirar, msg, onFoto, onError } */
  function init(c) {
    cfg = c;
    c.btnTomar.addEventListener('click', abrir);
    c.btnCapturar.addEventListener('click', capturar);
    c.btnCancelar.addEventListener('click', function () { cerrar(); });
    c.btnGirar.addEventListener('click', girar);
    c.btnSubir.addEventListener('click', function () { c.input.click(); });
    c.modal.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') cerrar(); });
    c.input.addEventListener('change', function () {
      var f = c.input.files && c.input.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) { c.onError('Elige un archivo de imagen.'); c.input.value = ''; return; }
      reducirArchivo(f, c.onFoto, function () { c.onError('No se pudo leer la imagen.'); });
      c.input.value = '';
    });
  }
  PA.foto = { init: init, soportaCamara: soportaCamara };
})(typeof window !== 'undefined' ? window : globalThis);

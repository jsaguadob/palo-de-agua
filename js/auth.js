/* Ingreso y sesión (Req 1) */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var C = PA.CONFIG, sesion = null;

  function validar(usuario, clave) {
    return String(usuario).trim().toUpperCase() === C.USUARIO && String(clave) === C.CLAVE_ACCESO;
  }
  function abrir(usuario) {
    sesion = String(usuario).trim().toUpperCase();
    try { g.sessionStorage.setItem(C.SESSION_KEY, sesion); } catch (e) {}
  }
  function cerrar() {
    sesion = null;
    try { g.sessionStorage.removeItem(C.SESSION_KEY); } catch (e) {}
  }
  function usuario() {
    if (sesion) return sesion;
    try { sesion = g.sessionStorage.getItem(C.SESSION_KEY); } catch (e) {}
    return sesion;
  }
  PA.auth = { validar: validar, abrir: abrir, cerrar: cerrar, usuario: usuario, activa: function () { return !!usuario(); } };
})(typeof window !== 'undefined' ? window : globalThis);

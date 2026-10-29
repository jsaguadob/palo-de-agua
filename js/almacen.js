/* Guarda los registros en localStorage (con respaldo en memoria) */
(function (g) {
  var PA = (g.PA = g.PA || {});
  var KEY = PA.CONFIG.STORAGE_KEY;
  var memoria = [];

  function todos() {
    try {
      var raw = g.localStorage.getItem(KEY);
      if (raw) {
        var a = JSON.parse(raw);
        if (Array.isArray(a)) { memoria = a; return a.slice(); }
      }
    } catch (e) { /* sin acceso a localStorage: se usa la memoria */ }
    return memoria.slice();
  }
  function escribir(arr) {
    memoria = arr.slice();
    try { g.localStorage.setItem(KEY, JSON.stringify(arr)); return true; }
    catch (e) { return false; }
  }
  /* Devuelve { ok, sinFoto } */
  function agregar(reg) {
    var arr = todos(); arr.push(reg);
    if (escribir(arr)) return { ok: true };
    if (reg.foto) {                                  // almacenamiento lleno: se guarda sin foto
      reg.foto = null; arr[arr.length - 1] = reg;
      if (escribir(arr)) return { ok: true, sinFoto: true };
    }
    return { ok: false };
  }
  function actualizar(id, cambios) {
    var arr = todos(), ok = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) { for (var k in cambios) arr[i][k] = cambios[k]; ok = true; }
    }
    return ok && escribir(arr);
  }
  function reemplazar(arr) { return escribir(arr); }
  function borrarTodo() { return escribir([]); }

  PA.almacen = { todos: todos, agregar: agregar, actualizar: actualizar, reemplazar: reemplazar, borrarTodo: borrarTodo };
})(typeof window !== 'undefined' ? window : globalThis);

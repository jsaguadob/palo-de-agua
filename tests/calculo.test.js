/* Prueba del cálculo. Ejecutar con:  node tests/calculo.test.js  (no necesita instalar nada) */
const assert = require('assert');
require('../js/config.js');
const { calcular } = require('../js/calculo.js');

// Ejemplo del mockup: Vía a Pance, 3:40 p. m. a 5:10 p. m., 22 mm
let r = calcular({ milimetros: 22, horaInicio: '15:40', horaFin: '17:10' });
assert.strictEqual(r.horas, 1.5);
assert.strictEqual(r.base, 462);
assert.strictEqual(r.aplicaAjuste, true);
assert.strictEqual(r.total, 486.5);
assert.strictEqual(r.excesoMm, 8);
assert.strictEqual(r.pasaEstandar, true);

// Fuera del horario de 3 a 6 p. m.: sin ajuste
r = calcular({ milimetros: 9, horaInicio: '10:00', horaFin: '10:45' });
assert.strictEqual(r.aplicaAjuste, false);
assert.strictEqual(r.total, r.base);
assert.strictEqual(r.pasaEstandar, false);

// Límites: 14 mm exactos no pasa; 3:00 p. m. entra al ajuste; 6:00 p. m. no
assert.strictEqual(calcular({ milimetros: 14, horaInicio: '08:00', horaFin: '09:00' }).pasaEstandar, false);
assert.strictEqual(calcular({ milimetros: 10, horaInicio: '15:00', horaFin: '16:00' }).aplicaAjuste, true);
assert.strictEqual(calcular({ milimetros: 10, horaInicio: '18:00', horaFin: '19:00' }).aplicaAjuste, false);

console.log('Cálculo: todas las pruebas pasaron');

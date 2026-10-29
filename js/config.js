/* Configuración y reglas del negocio de Palo de Agua */
(function (g) {
  var PA = (g.PA = g.PA || {});
  PA.CONFIG = {
    USUARIO: 'CVC',               // usuario de acceso (Req 1)
    CLAVE_ACCESO: 'Lluvias',      // contraseña de acceso (Req 1)
    CLAVE_SEGURIDAD: 'AGUA1',     // clave para registrar otra zona (Req 3)
    ESTANDAR_MM: 14,              // estándar de Cali, en mm (Req 2)
    AJUSTE: 0.053,                // ajuste del 5,3 % (Req 4)
    VENTANA_DESDE: '15:00',       // el ajuste aplica si el aguacero inicia desde las 3:00 p. m.
    VENTANA_HASTA: '18:00',       // ... y antes de las 6:00 p. m.
    ESPERA_MS: 2800,              // duración del reloj de espera
    MAX_BARRAS: 8,                // barras visibles en la gráfica
    STORAGE_KEY: 'palo-de-agua:registros:v1',
    SESSION_KEY: 'palo-de-agua:sesion:v1',
    ZONAS: ['Pance', 'Siloé', 'Jamundí', 'Aguablanca', 'Granada', 'Otra zona']
  };
})(typeof window !== 'undefined' ? window : globalThis);

// Colores de marca. Ajustar aqui (y en web/app/globals.css) cuando se tenga el logo definitivo.
export const MARCA = {
  nombre: 'FarmaClínica Verde',
  siglas: 'FCV',
  azul: '#0B5CAB',
  azulOscuro: '#08427C',
  azulClaro: '#E8F1FB',
  verde: '#2E9E4F',
  verdeOscuro: '#217A3B',
  verdeClaro: '#E9F6ED',
  texto: '#1B2733',
  textoSuave: '#5B6875',
  borde: '#DCE3EA',
  fondo: '#F6F8FA',
  alerta: '#B45309',
  alertaClaro: '#FEF3C7',
  error: '#B42318',
  errorClaro: '#FDECEA',
};

export const CONTACTO = {
  whatsapp: '584145550100',
  whatsappVisible: '0414-555-0100',
  correo: 'atencion@farmaclinicaverde.example',
  telefono: '0212-555-0100',
};

export const COSTO_ENVIO_USD = 2;

export const DATOS_PAGO = {
  pago_movil: [
    ['Banco', 'Banco de Ejemplo (0000)'],
    ['RIF', 'J-00000000-0'],
    ['Teléfono', '0414-555-0100'],
  ],
  transferencia: [
    ['Banco', 'Banco de Ejemplo'],
    ['Cuenta corriente', '0000-0000-00-0000000000'],
    ['Titular', 'FarmaClínica Verde, C.A.'],
    ['RIF', 'J-00000000-0'],
  ],
  zelle: [
    ['Correo Zelle', 'pagos@farmaclinicaverde.example'],
    ['Titular', 'FarmaClinica Verde LLC'],
  ],
} as const;

// Textos y linea de tiempo de los pedidos.
import type { EstadoPago, EstadoPedido, EstadoRecipe, MetodoPago, ModoEntrega, Pedido } from './types';

export const METODOS_PAGO: { id: MetodoPago; nombre: string; detalle: string }[] = [
  { id: 'pago_movil', nombre: 'Pago Móvil', detalle: 'Confirmación automática con el banco' },
  { id: 'transferencia', nombre: 'Transferencia', detalle: 'Confirmación automática con el banco' },
  { id: 'zelle', nombre: 'Zelle', detalle: 'Verificación manual, queda en revisión' },
];

export function nombreMetodo(m: MetodoPago): string {
  return METODOS_PAGO.find((x) => x.id === m)?.nombre ?? m;
}

export function nombreModo(m: ModoEntrega): string {
  return m === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en tienda';
}

export type Tono = 'ok' | 'pendiente' | 'error' | 'neutro';

export function etiquetaEstado(p: Pedido): { texto: string; tono: Tono } {
  const textos: Record<EstadoPedido, string> = {
    recibido: 'Recibido',
    pago_confirmado: 'Pago confirmado',
    en_preparacion: 'En preparación',
    en_ruta: p.modoEntrega === 'domicilio' ? 'En camino' : 'Listo para retiro',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };
  const tono: Tono = p.estado === 'entregado' ? 'ok' : p.estado === 'cancelado' ? 'error' : 'pendiente';
  return { texto: textos[p.estado], tono };
}

export function etiquetaPago(e: EstadoPago): { texto: string; tono: Tono } {
  const mapa: Record<EstadoPago, { texto: string; tono: Tono }> = {
    por_verificar: { texto: 'Verificando', tono: 'pendiente' },
    confirmado: { texto: 'Confirmado', tono: 'ok' },
    en_revision: { texto: 'En revisión', tono: 'pendiente' },
    rechazado: { texto: 'Rechazado', tono: 'error' },
  };
  return mapa[e];
}

export function etiquetaRecipe(e: EstadoRecipe): { texto: string; tono: Tono } {
  const mapa: Record<EstadoRecipe, { texto: string; tono: Tono }> = {
    pendiente: { texto: 'Por validar', tono: 'pendiente' },
    aprobado: { texto: 'Aprobado', tono: 'ok' },
    rechazado: { texto: 'Rechazado', tono: 'error' },
  };
  return mapa[e];
}

export interface PasoLinea {
  clave: string;
  titulo: string;
  detalle: string;
  estado: 'hecho' | 'actual' | 'pendiente' | 'error';
}

const ORDEN: EstadoPedido[] = ['recibido', 'pago_confirmado', 'en_preparacion', 'en_ruta', 'entregado'];

export function lineaDeTiempo(p: Pedido): PasoLinea[] {
  const domicilio = p.modoEntrega === 'domicilio';
  const pagoRechazado = p.estadoPago === 'rechazado';
  const recipeRechazado = p.recipe?.estado === 'rechazado';

  let detallePago = 'Confirmado por el banco';
  if (p.estadoPago === 'en_revision') detallePago = 'Zelle en revisión por nuestro equipo';
  if (p.estadoPago === 'por_verificar') detallePago = 'Verificando con el banco';
  if (pagoRechazado) detallePago = 'No pudimos verificar el pago';

  let detallePreparacion = 'Armamos tu pedido en la sucursal';
  if (p.recipe?.estado === 'pendiente') detallePreparacion = 'Récipe en validación por el farmacéutico';
  if (p.recipe?.estado === 'aprobado') detallePreparacion = 'Récipe aprobado por el farmacéutico';
  if (recipeRechazado) detallePreparacion = 'El récipe fue rechazado';

  const pasos = [
    { clave: 'recibido', titulo: 'Pedido recibido', detalle: 'Registramos tu pedido' },
    { clave: 'pago_confirmado', titulo: 'Pago confirmado', detalle: detallePago },
    { clave: 'en_preparacion', titulo: 'En preparación', detalle: detallePreparacion },
    {
      clave: 'en_ruta',
      titulo: domicilio ? 'En camino' : 'Listo para retiro',
      detalle: domicilio ? 'El repartidor va hacia tu dirección' : 'Puedes pasar por la sucursal',
    },
    { clave: 'entregado', titulo: 'Entregado', detalle: 'Pedido completado' },
  ];

  // En un pedido cancelado, el paso que fallo queda marcado en rojo.
  const indiceError = pagoRechazado ? 1 : recipeRechazado ? 2 : -1;
  const indice = p.estado === 'cancelado' ? indiceError - 1 : ORDEN.indexOf(p.estado);

  return pasos.map((paso, i) => {
    let estado: PasoLinea['estado'] = 'pendiente';
    if (p.estado === 'cancelado') {
      estado = i < indiceError ? 'hecho' : i === indiceError ? 'error' : 'pendiente';
    } else if (p.estado === 'entregado' || i <= indice) {
      estado = 'hecho';
    } else if (i === indice + 1) {
      estado = 'actual';
    }
    return { ...paso, estado };
  });
}

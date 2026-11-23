// Estado en memoria compartido por la web y la app. Sin backend.
import { PEDIDOS_INICIALES, PRODUCTOS, productoPorId, sucursalPorId } from './catalogo';
import { COSTO_ENVIO_USD } from './marca';
import { TASA_BCV } from './tasa-bcv';
import type {
  Cliente,
  EstadoPedido,
  LineaCarrito,
  MetodoPago,
  ModoEntrega,
  Pedido,
  Producto,
  SucursalId,
} from './types';

export interface Estado {
  sucursalId: SucursalId;
  modoEntrega: ModoEntrega;
  carrito: LineaCarrito[];
  pedidos: Pedido[];
  stock: Record<string, Record<SucursalId, number>>;
  consecutivo: number;
}

export const CLIENTE_DEMO: Cliente = {
  nombre: 'María Pérez',
  telefono: '0414-555-0188',
  direccion: 'Av. Urdaneta, Res. Ejemplo, apto 7A, Caracas',
};

export const ESPERA_BANCO_MS = 2000;

function estadoInicial(): Estado {
  const stock: Estado['stock'] = {};
  for (const p of PRODUCTOS) stock[p.id] = { ...p.stock };
  return {
    sucursalId: 'centro',
    modoEntrega: 'domicilio',
    carrito: [],
    pedidos: PEDIDOS_INICIALES.map((p) => ({ ...p })),
    stock,
    consecutivo: 1007,
  };
}

let estado: Estado = estadoInicial();
const ESTADO_SERVIDOR: Estado = estadoInicial();
const oyentes = new Set<() => void>();

function fijar(parcial: Partial<Estado>) {
  estado = { ...estado, ...parcial };
  oyentes.forEach((f) => f());
}

export function obtenerEstado(): Estado {
  return estado;
}

export function obtenerEstadoServidor(): Estado {
  return ESTADO_SERVIDOR;
}

export function suscribir(f: () => void): () => void {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

// Permite a la web restaurar el estado guardado en el navegador.
export function restaurar(guardado: unknown) {
  const g = guardado as Partial<Estado> | null;
  if (!g || !Array.isArray(g.pedidos) || !Array.isArray(g.carrito) || !g.stock) return;
  fijar({ ...estadoInicial(), ...g });
}

export function reiniciarDemo() {
  fijar(estadoInicial());
}

// ---------- Consultas ----------

export function stockDe(e: Estado, productoId: string, sucursalId: SucursalId = e.sucursalId): number {
  return e.stock[productoId]?.[sucursalId] ?? 0;
}

export interface LineaDetalle {
  producto: Producto;
  cantidad: number;
  stock: number;
  disponible: boolean;
  subtotalUsd: number;
}

export function lineasCarrito(e: Estado): LineaDetalle[] {
  const lineas: LineaDetalle[] = [];
  for (const l of e.carrito) {
    const producto = productoPorId(l.productoId);
    if (!producto) continue;
    const stock = stockDe(e, producto.id);
    lineas.push({
      producto,
      cantidad: l.cantidad,
      stock,
      disponible: stock >= l.cantidad,
      subtotalUsd: producto.precioUsd * l.cantidad,
    });
  }
  return lineas;
}

export interface ResumenCarrito {
  lineas: LineaDetalle[];
  unidades: number;
  subtotalUsd: number;
  envioUsd: number;
  totalUsd: number;
  requiereRecipe: boolean;
  hayNoDisponibles: boolean;
}

export function resumenCarrito(e: Estado): ResumenCarrito {
  const lineas = lineasCarrito(e);
  const subtotalUsd = lineas.reduce((s, l) => s + l.subtotalUsd, 0);
  const envioUsd = e.modoEntrega === 'domicilio' && lineas.length > 0 ? COSTO_ENVIO_USD : 0;
  return {
    lineas,
    unidades: lineas.reduce((s, l) => s + l.cantidad, 0),
    subtotalUsd,
    envioUsd,
    totalUsd: subtotalUsd + envioUsd,
    requiereRecipe: lineas.some((l) => l.producto.requiere_recipe),
    hayNoDisponibles: lineas.some((l) => !l.disponible),
  };
}

export function pedidosPropios(e: Estado): Pedido[] {
  return e.pedidos.filter((p) => p.propio);
}

export function ultimoPedidoPropio(e: Estado): Pedido | undefined {
  return pedidosPropios(e)[0];
}

export function pedidoPorId(e: Estado, id: string): Pedido | undefined {
  return e.pedidos.find((p) => p.id === id);
}

// ---------- Acciones de compra ----------

export function elegirSucursal(sucursalId: SucursalId) {
  fijar({ sucursalId });
}

export function elegirModoEntrega(modoEntrega: ModoEntrega) {
  fijar({ modoEntrega });
}

// Devuelve la cantidad realmente agregada (limitada por el stock de la sucursal).
export function agregarAlCarrito(productoId: string, cantidad = 1): number {
  const stock = stockDe(estado, productoId);
  const actual = estado.carrito.find((l) => l.productoId === productoId)?.cantidad ?? 0;
  const nueva = Math.min(stock, actual + cantidad);
  if (nueva <= actual) return 0;
  const carrito = actual
    ? estado.carrito.map((l) => (l.productoId === productoId ? { ...l, cantidad: nueva } : l))
    : [...estado.carrito, { productoId, cantidad: nueva }];
  fijar({ carrito });
  return nueva - actual;
}

export function cambiarCantidad(productoId: string, cantidad: number) {
  if (cantidad <= 0) return quitarDelCarrito(productoId);
  const tope = Math.max(1, stockDe(estado, productoId));
  fijar({
    carrito: estado.carrito.map((l) =>
      l.productoId === productoId ? { ...l, cantidad: Math.min(cantidad, tope) } : l,
    ),
  });
}

export function quitarDelCarrito(productoId: string) {
  fijar({ carrito: estado.carrito.filter((l) => l.productoId !== productoId) });
}

export function vaciarCarrito() {
  fijar({ carrito: [] });
}

export interface ResultadoRepetir {
  agregados: number;
  sinStock: string[];
}

export function repetirPedido(pedidoId: string): ResultadoRepetir {
  const pedido = pedidoPorId(estado, pedidoId);
  const resultado: ResultadoRepetir = { agregados: 0, sinStock: [] };
  if (!pedido) return resultado;
  for (const item of pedido.items) {
    const agregado = agregarAlCarrito(item.productoId, item.cantidad);
    resultado.agregados += agregado;
    if (agregado < item.cantidad) {
      const enCarrito = estado.carrito.find((l) => l.productoId === item.productoId)?.cantidad ?? 0;
      if (enCarrito < item.cantidad) {
        resultado.sinStock.push(productoPorId(item.productoId)?.nombre ?? item.productoId);
      }
    }
  }
  return resultado;
}

export function mensajeRepetir(r: ResultadoRepetir): string {
  if (r.sinStock.length === 0) return 'Productos agregados al carrito.';
  const faltan = `Sin stock suficiente en esta sucursal: ${r.sinStock.join(', ')}.`;
  return r.agregados > 0 ? `Agregamos lo disponible. ${faltan}` : faltan;
}

export interface DatosCheckout {
  metodoPago: MetodoPago;
  referencia: string;
  cliente: Cliente;
  recipeImagen: string | null;
}

export function validarCheckout(e: Estado, datos: DatosCheckout): string | null {
  const r = resumenCarrito(e);
  if (r.lineas.length === 0) return 'Tu carrito está vacío.';
  if (r.hayNoDisponibles) return 'Hay productos sin stock en la sucursal seleccionada.';
  if (r.requiereRecipe && !datos.recipeImagen) return 'Adjunta la imagen del récipe médico para continuar.';
  if (!datos.cliente.nombre.trim() || !datos.cliente.telefono.trim()) return 'Indica tu nombre y teléfono.';
  if (e.modoEntrega === 'domicilio' && !datos.cliente.direccion.trim()) return 'Indica la dirección de entrega.';
  if (!datos.referencia.trim()) return 'Indica el número de referencia del pago.';
  return null;
}

function crearPedido(datos: DatosCheckout): Pedido {
  const r = resumenCarrito(estado);
  const sucursal = sucursalPorId(estado.sucursalId);
  const pedido: Pedido = {
    id: `FCV-${estado.consecutivo}`,
    fecha: new Date().toISOString(),
    propio: true,
    cliente: {
      ...datos.cliente,
      direccion: estado.modoEntrega === 'domicilio' ? datos.cliente.direccion : 'Retiro en tienda',
    },
    sucursalId: estado.sucursalId,
    modoEntrega: estado.modoEntrega,
    items: r.lineas.map((l) => ({
      productoId: l.producto.id,
      cantidad: l.cantidad,
      precioUsd: l.producto.precioUsd,
    })),
    envioUsd: r.envioUsd,
    totalUsd: r.totalUsd,
    tasaBcv: TASA_BCV,
    metodoPago: datos.metodoPago,
    referencia: datos.referencia.trim(),
    estadoPago: datos.metodoPago === 'zelle' ? 'en_revision' : 'por_verificar',
    recipe: r.requiereRecipe ? { imagen: datos.recipeImagen, estado: 'pendiente' } : null,
    estado: 'recibido',
    responsable: sucursal.responsable,
  };
  const stock = { ...estado.stock };
  for (const l of r.lineas) {
    stock[l.producto.id] = {
      ...stock[l.producto.id],
      [estado.sucursalId]: Math.max(0, stockDe(estado, l.producto.id) - l.cantidad),
    };
  }
  fijar({
    pedidos: [pedido, ...estado.pedidos],
    carrito: [],
    stock,
    consecutivo: estado.consecutivo + 1,
  });
  return pedido;
}

function esperar(ms: number): Promise<void> {
  return new Promise((ok) => setTimeout(ok, ms));
}

// Crea el pedido y simula la respuesta del banco.
// Pago Movil y transferencia: confirmacion automatica por API tras 2 segundos.
// Zelle: queda en revision manual (se confirma desde el panel).
export async function pagar(datos: DatosCheckout, alCrear?: (p: Pedido) => void): Promise<Pedido> {
  const error = validarCheckout(estado, datos);
  if (error) throw new Error(error);
  const pedido = crearPedido(datos);
  alCrear?.(pedido);
  if (datos.metodoPago !== 'zelle') {
    await esperar(ESPERA_BANCO_MS);
    confirmarPago(pedido.id);
  }
  return pedidoPorId(estado, pedido.id) ?? pedido;
}

// ---------- Acciones del panel interno ----------

function actualizarPedido(id: string, cambio: (p: Pedido) => Pedido) {
  fijar({ pedidos: estado.pedidos.map((p) => (p.id === id ? cambio(p) : p)) });
}

export function confirmarPago(id: string) {
  actualizarPedido(id, (p) => ({
    ...p,
    estadoPago: 'confirmado',
    estado: p.estado === 'recibido' ? 'pago_confirmado' : p.estado,
  }));
}

export function rechazarPago(id: string) {
  actualizarPedido(id, (p) => ({ ...p, estadoPago: 'rechazado', estado: 'cancelado' }));
}

export function aprobarRecipe(id: string) {
  actualizarPedido(id, (p) => (p.recipe ? { ...p, recipe: { ...p.recipe, estado: 'aprobado' } } : p));
}

export function rechazarRecipe(id: string) {
  actualizarPedido(id, (p) =>
    p.recipe ? { ...p, recipe: { ...p.recipe, estado: 'rechazado' }, estado: 'cancelado' } : p,
  );
}

const SIGUIENTE: Partial<Record<EstadoPedido, EstadoPedido>> = {
  pago_confirmado: 'en_preparacion',
  en_preparacion: 'en_ruta',
  en_ruta: 'entregado',
};

// Motivo por el que el pedido no puede avanzar, o null si puede.
export function bloqueoAvance(p: Pedido): string | null {
  if (p.estado === 'entregado') return 'Pedido entregado';
  if (p.estado === 'cancelado') return 'Pedido cancelado';
  if (p.estadoPago !== 'confirmado') return 'Pago sin confirmar';
  if (p.recipe && p.recipe.estado !== 'aprobado') return 'Récipe por aprobar';
  return null;
}

export function avanzarPedido(id: string) {
  actualizarPedido(id, (p) => {
    const siguiente = SIGUIENTE[p.estado];
    return siguiente && !bloqueoAvance(p) ? { ...p, estado: siguiente } : p;
  });
}

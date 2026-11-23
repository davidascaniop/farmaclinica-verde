export type SucursalId = 'centro' | 'este' | 'norte';
export type ModoEntrega = 'domicilio' | 'retiro';
export type MetodoPago = 'pago_movil' | 'transferencia' | 'zelle';
export type EstadoPago = 'por_verificar' | 'confirmado' | 'en_revision' | 'rechazado';
export type EstadoRecipe = 'pendiente' | 'aprobado' | 'rechazado';
export type EstadoPedido =
  | 'recibido'
  | 'pago_confirmado'
  | 'en_preparacion'
  | 'en_ruta'
  | 'entregado'
  | 'cancelado';

export interface Sucursal {
  id: SucursalId;
  nombre: string;
  ciudad: string;
  zona: string;
  direccion: string;
  horario: string;
  telefono: string;
  responsable: string;
  mapa: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  abreviatura: string;
  color: string;
}

export interface Producto {
  id: string;
  nombre: string;
  presentacion: string;
  laboratorio: string;
  categoria: string;
  descripcion: string;
  precioUsd: number;
  requiere_recipe: boolean;
  stock: Record<SucursalId, number>;
}

export interface LineaCarrito {
  productoId: string;
  cantidad: number;
}

export interface ItemPedido {
  productoId: string;
  cantidad: number;
  precioUsd: number;
}

export interface Recipe {
  imagen: string | null;
  estado: EstadoRecipe;
}

export interface Cliente {
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Pedido {
  id: string;
  fecha: string;
  propio: boolean;
  cliente: Cliente;
  sucursalId: SucursalId;
  modoEntrega: ModoEntrega;
  items: ItemPedido[];
  envioUsd: number;
  totalUsd: number;
  tasaBcv: number;
  metodoPago: MetodoPago;
  referencia: string;
  estadoPago: EstadoPago;
  recipe: Recipe | null;
  estado: EstadoPedido;
  responsable: string;
}

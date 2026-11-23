import sucursalesJson from './data/sucursales.json';
import categoriasJson from './data/categorias.json';
import productosJson from './data/productos.json';
import pedidosJson from './data/pedidos.json';
import { normalizar } from './formato';
import type { Categoria, Pedido, Producto, Sucursal, SucursalId } from './types';

export const SUCURSALES = sucursalesJson as Sucursal[];
export const CATEGORIAS = categoriasJson as Categoria[];
export const PRODUCTOS = productosJson as Producto[];
export const PEDIDOS_INICIALES = pedidosJson as Pedido[];

export function sucursalPorId(id: SucursalId): Sucursal {
  return SUCURSALES.find((s) => s.id === id) ?? SUCURSALES[0];
}

export function productoPorId(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}

export function categoriaPorId(id: string): Categoria {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[0];
}

export function buscarProductos(consulta: string, categoriaId: string | null): Producto[] {
  const q = normalizar(consulta);
  return PRODUCTOS.filter((p) => {
    if (categoriaId && p.categoria !== categoriaId) return false;
    if (!q) return true;
    return normalizar(`${p.nombre} ${p.presentacion} ${p.laboratorio} ${categoriaPorId(p.categoria).nombre}`).includes(q);
  });
}

export function buscarSucursales(consulta: string): Sucursal[] {
  const q = normalizar(consulta);
  if (!q) return SUCURSALES;
  return SUCURSALES.filter((s) => normalizar(`${s.ciudad} ${s.zona} ${s.nombre}`).includes(q));
}

export function enlaceMapa(s: Sucursal): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapa)}`;
}

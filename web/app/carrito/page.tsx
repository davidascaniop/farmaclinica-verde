"use client";
import Link from "next/link";
import { cambiarCantidad, formatoBs, formatoUsd, quitarDelCarrito, resumenCarrito, sucursalPorId } from "@shared";
import { useTienda } from "@/lib/tienda";
import { Etiqueta, ImagenProducto, Titulo } from "@/components/Comunes";
import ResumenCompra from "@/components/ResumenCompra";
import { SelectorEntrega, SelectorSucursal } from "@/components/Selectores";

export default function Carrito() {
  const tienda = useTienda();
  const resumen = resumenCarrito(tienda);
  const sucursal = sucursalPorId(tienda.sucursalId);

  if (resumen.lineas.length === 0) {
    return (
      <div className="contenedor py-8">
        <Titulo>Carrito</Titulo>
        <div className="tarjeta p-8 text-center">
          <p className="text-suave">Tu carrito está vacío.</p>
          <Link href="/" className="btn-primario mt-4">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor py-8">
      <Titulo sub={`Despacho desde ${sucursal.nombre}, ${sucursal.ciudad}`}>Carrito</Titulo>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="tarjeta grid gap-4 p-4 sm:grid-cols-2">
            <SelectorSucursal id="sucursal-carrito" />
            <SelectorEntrega />
          </div>
          {resumen.requiereRecipe && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Tu carrito incluye medicamentos con récipe. Ten a la mano una foto del récipe médico para adjuntarla al pagar.
            </p>
          )}
          <ul className="tarjeta divide-y divide-borde">
            {resumen.lineas.map((l) => (
              <li key={l.producto.id} className="flex gap-3 p-4">
                <ImagenProducto producto={l.producto} className="h-20 w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4">
                    <div>
                      <Link href={`/producto/${l.producto.id}`} className="font-semibold text-texto hover:text-azul">
                        {l.producto.nombre}
                      </Link>
                      <p className="text-sm text-suave">{l.producto.presentacion}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatoUsd(l.subtotalUsd)}</p>
                      <p className="text-xs text-suave">{formatoBs(l.subtotalUsd)}</p>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {l.producto.requiere_recipe && <Etiqueta texto="Requiere récipe" tono="pendiente" />}
                    {!l.disponible && (
                      <Etiqueta
                        texto={l.stock === 0 ? `Agotado en ${sucursal.nombre}` : `Solo ${l.stock} en ${sucursal.nombre}`}
                        tono="error"
                      />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-borde">
                      <button
                        className="h-11 w-11 cursor-pointer text-lg font-bold text-azul"
                        onClick={() => cambiarCantidad(l.producto.id, l.cantidad - 1)}
                        aria-label={`Restar ${l.producto.nombre}`}
                      >
                        -
                      </button>
                      <span className="w-9 text-center font-semibold">{l.cantidad}</span>
                      <button
                        className="h-11 w-11 cursor-pointer text-lg font-bold text-azul disabled:opacity-40"
                        onClick={() => cambiarCantidad(l.producto.id, l.cantidad + 1)}
                        disabled={l.cantidad >= l.stock}
                        aria-label={`Sumar ${l.producto.nombre}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="min-h-11 cursor-pointer px-2 text-sm font-semibold text-red-700 hover:underline"
                      onClick={() => quitarDelCarrito(l.producto.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ResumenCompra resumen={resumen}>
          {resumen.hayNoDisponibles && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Ajusta o quita los productos sin existencia en esta sucursal para continuar.
            </p>
          )}
          {resumen.hayNoDisponibles ? (
            <button className="btn-primario mt-4 w-full" disabled>
              Continuar al pago
            </button>
          ) : (
            <Link href="/checkout" className="btn-primario mt-4 w-full">
              Continuar al pago
            </Link>
          )}
          <Link href="/" className="btn-secundario mt-2 w-full">
            Seguir comprando
          </Link>
        </ResumenCompra>
      </div>
    </div>
  );
}

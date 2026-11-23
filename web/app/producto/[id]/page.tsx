"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SUCURSALES, categoriaPorId, elegirSucursal, productoPorId, stockDe } from "@shared";
import { useTienda } from "@/lib/tienda";
import { Etiqueta, ImagenProducto, Precio } from "@/components/Comunes";
import { BotonAgregar } from "@/components/TarjetaProducto";

export default function FichaProducto() {
  const { id } = useParams<{ id: string }>();
  const tienda = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const producto = productoPorId(id);
  if (!producto) {
    return (
      <div className="contenedor py-10">
        <p className="text-suave">Producto no encontrado.</p>
        <Link href="/" className="btn-secundario mt-4">
          Volver al inicio
        </Link>
      </div>
    );
  }
  const stock = stockDe(tienda, producto.id);
  const tope = Math.max(1, stock);
  return (
    <div className="contenedor py-6">
      <nav className="mb-4 text-sm text-suave" aria-label="Ruta">
        <Link href="/" className="hover:text-azul">
          Inicio
        </Link>{" "}
        / {categoriaPorId(producto.categoria).nombre}
      </nav>
      <div className="grid gap-6 md:grid-cols-2">
        <ImagenProducto producto={producto} className="aspect-square w-full md:aspect-[4/3]" />
        <div>
          <p className="text-sm text-suave">{producto.laboratorio}</p>
          <h1 className="text-2xl font-bold text-texto sm:text-3xl">{producto.nombre}</h1>
          <p className="text-suave">{producto.presentacion}</p>
          {producto.requiere_recipe && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              <strong>Requiere récipe médico.</strong> Deberás adjuntar una foto del récipe al pagar. Un farmacéutico lo
              valida antes de despachar.
            </div>
          )}
          <div className="mt-4">
            <Precio usd={producto.precioUsd} grande />
          </div>
          <p className="mt-4 text-texto">{producto.descripcion}</p>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div>
              <span className="etiqueta-campo">Cantidad</span>
              <div className="flex items-center rounded-lg border border-borde bg-white">
                <button
                  className="h-11 w-11 cursor-pointer text-lg font-bold text-azul disabled:opacity-40"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                  aria-label="Restar"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold" aria-live="polite">
                  {Math.min(cantidad, tope)}
                </span>
                <button
                  className="h-11 w-11 cursor-pointer text-lg font-bold text-azul disabled:opacity-40"
                  onClick={() => setCantidad((c) => Math.min(tope, c + 1))}
                  disabled={cantidad >= tope}
                  aria-label="Sumar"
                >
                  +
                </button>
              </div>
            </div>
            <BotonAgregar producto={producto} cantidad={Math.min(cantidad, tope)} className="flex-1 sm:flex-none sm:px-8" />
          </div>

          <section className="tarjeta mt-6 p-4" aria-labelledby="disp">
            <h2 id="disp" className="mb-2 font-semibold text-texto">
              Disponibilidad por sucursal
            </h2>
            <ul className="divide-y divide-borde">
              {SUCURSALES.map((s) => {
                const n = stockDe(tienda, producto.id, s.id);
                const activa = s.id === tienda.sucursalId;
                return (
                  <li key={s.id} className="flex min-h-11 items-center justify-between gap-3 py-1 text-sm">
                    <span>
                      {s.nombre} <span className="text-suave">({s.ciudad})</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <Etiqueta texto={n > 0 ? `${n} disponibles` : "Agotado"} tono={n > 0 ? "ok" : "error"} />
                      {activa ? (
                        <span className="w-20 text-right text-xs font-semibold text-azul">Tu sucursal</span>
                      ) : (
                        <button
                          className="min-h-11 w-20 cursor-pointer text-right text-xs font-semibold text-azul underline"
                          onClick={() => elegirSucursal(s.id)}
                        >
                          Cambiar
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

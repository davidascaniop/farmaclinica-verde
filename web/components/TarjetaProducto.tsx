"use client";
import Link from "next/link";
import { useState } from "react";
import { agregarAlCarrito, categoriaPorId, stockDe, sucursalPorId, type Producto } from "@shared";
import { useTienda } from "@/lib/tienda";
import { Etiqueta, ImagenProducto, Precio } from "./Comunes";

export function BotonAgregar({ producto, cantidad = 1, className = "", texto = "Agregar al carrito" }: { producto: Producto; cantidad?: number; className?: string; texto?: string }) {
  const tienda = useTienda();
  const [aviso, setAviso] = useState<string | null>(null);
  const stock = stockDe(tienda, producto.id);
  const agregar = () => {
    const n = agregarAlCarrito(producto.id, cantidad);
    setAviso(n > 0 ? "Agregado" : "Máximo disponible");
    setTimeout(() => setAviso(null), 1400);
  };
  if (stock === 0) {
    return (
      <button className={`btn-secundario ${className}`} disabled>
        Agotado
      </button>
    );
  }
  return (
    <button className={`btn-verde ${className}`} onClick={agregar} aria-live="polite">
      {aviso ?? texto}
    </button>
  );
}

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const tienda = useTienda();
  const stock = stockDe(tienda, producto.id);
  const agotado = stock === 0;
  return (
    <article className="tarjeta flex flex-col p-3">
      <Link href={`/producto/${producto.id}`} className="block">
        <div className="relative">
          <ImagenProducto producto={producto} className={`aspect-[4/3] w-full ${agotado ? "opacity-40" : ""}`} />
          {agotado && (
            <span className="absolute left-2 top-2">
              <Etiqueta texto="Agotado" tono="error" />
            </span>
          )}
        </div>
        <p className="mt-3 text-xs font-medium text-suave">{categoriaPorId(producto.categoria).nombre}</p>
        <h3 className="font-semibold leading-snug text-texto">{producto.nombre}</h3>
        <p className="text-sm text-suave">{producto.presentacion}</p>
      </Link>
      <div className="mt-2 min-h-6">
        {producto.requiere_recipe && <Etiqueta texto="Requiere récipe" tono="pendiente" />}
      </div>
      <div className="mt-auto pt-2">
        <Precio usd={producto.precioUsd} />
        <p className={`mt-1 text-xs ${agotado ? "text-red-700" : "text-verde-oscuro"}`}>
          {agotado
            ? `Sin existencia en ${sucursalPorId(tienda.sucursalId).nombre}`
            : `${stock} disponibles en ${sucursalPorId(tienda.sucursalId).nombre}`}
        </p>
        <BotonAgregar producto={producto} className="mt-3 w-full" texto="Agregar" />
      </div>
    </article>
  );
}

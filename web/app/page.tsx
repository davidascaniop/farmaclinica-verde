"use client";
import Link from "next/link";
import { useState } from "react";
import {
  CATEGORIAS,
  buscarProductos,
  formatoBs,
  formatoFecha,
  formatoTasa,
  formatoUsd,
  mensajeRepetir,
  productoPorId,
  repetirPedido,
  stockDe,
  sucursalPorId,
  ultimoPedidoPropio,
} from "@shared";
import { useTienda } from "@/lib/tienda";
import TarjetaProducto from "@/components/TarjetaProducto";
import { SelectorEntrega, SelectorSucursal } from "@/components/Selectores";

export default function Inicio() {
  const tienda = useTienda();
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const sucursal = sucursalPorId(tienda.sucursalId);
  const ultimo = ultimoPedidoPropio(tienda);
  const productos = buscarProductos(consulta, categoria)
    .slice()
    .sort((a, b) => Number(stockDe(tienda, a.id) === 0) - Number(stockDe(tienda, b.id) === 0));
  const agotados = productos.filter((p) => stockDe(tienda, p.id) === 0).length;

  return (
    <>
      <section className="border-b border-borde bg-azul-claro">
        <div className="contenedor py-6 sm:py-8">
          <h1 className="text-2xl font-bold text-azul-oscuro sm:text-3xl">Tu farmacia, a domicilio o para retirar</h1>
          <p className="mt-1 text-suave">
            Precios en dólares y en bolívares a la tasa BCV del día: <strong>{formatoTasa()}</strong> por USD.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.2fr_1.6fr]">
            <SelectorSucursal />
            <SelectorEntrega />
            <div>
              <label htmlFor="buscador" className="etiqueta-campo">
                Buscar
              </label>
              <input
                id="buscador"
                type="search"
                className="campo"
                placeholder="Medicamento, marca o categoría"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
              />
            </div>
          </div>
          <p className="mt-3 text-sm text-suave">
            {tienda.modoEntrega === "domicilio" ? "Despachamos desde" : "Retiras en"}{" "}
            <strong className="text-texto">{sucursal.nombre}</strong>: {sucursal.direccion}, {sucursal.ciudad}.
          </p>
        </div>
      </section>

      <div className="contenedor py-6">
        <nav aria-label="Categorías" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: null as string | null, nombre: "Todas" }, ...CATEGORIAS].map((c) => (
            <button
              key={c.id ?? "todas"}
              onClick={() => setCategoria(c.id)}
              aria-pressed={categoria === c.id}
              className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-semibold ${
                categoria === c.id
                  ? "border-azul bg-azul text-white"
                  : "border-borde bg-white text-texto hover:border-azul"
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </nav>

        {ultimo && !consulta && !categoria && (
          <section className="tarjeta mt-5 border-verde/40 bg-verde-claro p-4 sm:p-5" aria-labelledby="repite">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="repite" className="text-lg font-bold text-verde-oscuro">
                  Repite tu última compra
                </h2>
                <p className="text-sm text-suave">
                  Pedido {ultimo.id} del {formatoFecha(ultimo.fecha)}: {formatoUsd(ultimo.totalUsd)} (
                  {formatoBs(ultimo.totalUsd)} a la tasa de hoy)
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {ultimo.items.map((i) => (
                    <li key={i.productoId} className="rounded-full bg-white px-3 py-1 text-sm text-texto">
                      {i.cantidad} x {productoPorId(i.productoId)?.nombre}
                    </li>
                  ))}
                </ul>
                {aviso && (
                  <p className="mt-2 text-sm font-medium text-verde-oscuro" role="status">
                    {aviso}{" "}
                    <Link href="/carrito" className="underline">
                      Ver carrito
                    </Link>
                  </p>
                )}
              </div>
              <button className="btn-verde shrink-0" onClick={() => setAviso(mensajeRepetir(repetirPedido(ultimo.id)))}>
                Agregar todo al carrito
              </button>
            </div>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-bold text-texto">Productos</h2>
          <p className="text-sm text-suave">
            {productos.length} productos en {sucursal.nombre}
            {agotados > 0 && `, ${agotados} agotados`}
          </p>
        </div>
        {productos.length === 0 ? (
          <p className="tarjeta mt-4 p-8 text-center text-suave">No encontramos productos con esa búsqueda.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

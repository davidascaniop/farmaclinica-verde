"use client";
import { useState } from "react";
import {
  SUCURSALES,
  aprobarRecipe,
  avanzarPedido,
  bloqueoAvance,
  confirmarPago,
  etiquetaEstado,
  etiquetaPago,
  etiquetaRecipe,
  formatoBs,
  formatoFecha,
  formatoUsd,
  nombreMetodo,
  productoPorId,
  rechazarPago,
  rechazarRecipe,
  reiniciarDemo,
  sucursalPorId,
  type SucursalId,
} from "@shared";
import { useTienda } from "@/lib/tienda";
import { Etiqueta } from "@/components/Comunes";

export default function Panel() {
  const tienda = useTienda();
  const [filtro, setFiltro] = useState<SucursalId | "todas">("todas");
  const pedidos = tienda.pedidos.filter((p) => filtro === "todas" || p.sucursalId === filtro);
  const recipes = pedidos.filter((p) => p.recipe?.estado === "pendiente" && p.estado !== "cancelado");
  const pagos = pedidos.filter((p) => p.estadoPago === "en_revision" && p.estado !== "cancelado");
  const activos = pedidos.filter((p) => p.estado !== "entregado" && p.estado !== "cancelado");

  return (
    <div className="contenedor max-w-7xl py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-verde-oscuro">Uso interno</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Panel de pedidos</h1>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="filtro" className="etiqueta-campo">
              Sucursal
            </label>
            <select
              id="filtro"
              className="campo"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as SucursalId | "todas")}
            >
              <option value="todas">Todas las sucursales</option>
              {SUCURSALES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-secundario" onClick={reiniciarDemo}>
            Reiniciar datos de ejemplo
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { n: activos.length, t: "Pedidos activos" },
          { n: recipes.length, t: "Récipes por validar" },
          { n: pagos.length, t: "Pagos en revisión" },
        ].map((k) => (
          <div key={k.t} className="tarjeta p-4">
            <p className="text-2xl font-bold text-azul sm:text-3xl">{k.n}</p>
            <p className="text-xs text-suave sm:text-sm">{k.t}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="t-recipes">
          <h2 id="t-recipes" className="mb-3 text-lg font-bold">
            Récipes por aprobar
          </h2>
          {recipes.length === 0 && <p className="tarjeta p-5 text-sm text-suave">No hay récipes pendientes.</p>}
          <ul className="space-y-3">
            {recipes.map((p) => (
              <li key={p.id} className="tarjeta flex gap-4 p-4">
                {p.recipe?.imagen ? (
                  <a href={p.recipe.imagen} target="_blank" rel="noreferrer" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.recipe.imagen} alt={`Récipe del pedido ${p.id}`} className="h-24 w-24 rounded-lg border border-borde object-cover" />
                  </a>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-borde bg-fondo p-2 text-center text-xs text-suave">
                    Imagen de ejemplo
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {p.id} · {p.cliente.nombre}
                  </p>
                  <p className="text-sm text-suave">
                    {sucursalPorId(p.sucursalId).nombre} · {formatoFecha(p.fecha, true)}
                  </p>
                  <p className="mt-1 text-sm">
                    {p.items
                      .map((i) => productoPorId(i.productoId))
                      .filter((x) => x?.requiere_recipe)
                      .map((x) => x?.nombre)
                      .join(", ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-verde" onClick={() => aprobarRecipe(p.id)}>
                      Aprobar
                    </button>
                    <button className="btn-peligro" onClick={() => rechazarRecipe(p.id)}>
                      Rechazar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="t-pagos">
          <h2 id="t-pagos" className="mb-3 text-lg font-bold">
            Pagos en revisión
          </h2>
          {pagos.length === 0 && <p className="tarjeta p-5 text-sm text-suave">No hay pagos por revisar.</p>}
          <ul className="space-y-3">
            {pagos.map((p) => (
              <li key={p.id} className="tarjeta p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {p.id} · {p.cliente.nombre}
                    </p>
                    <p className="text-sm text-suave">
                      {nombreMetodo(p.metodoPago)} · Ref. {p.referencia} · {sucursalPorId(p.sucursalId).nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatoUsd(p.totalUsd)}</p>
                    <p className="text-xs text-suave">{formatoBs(p.totalUsd, p.tasaBcv)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-verde" onClick={() => confirmarPago(p.id)}>
                    Confirmar pago
                  </button>
                  <button className="btn-peligro" onClick={() => rechazarPago(p.id)}>
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8" aria-labelledby="t-pedidos">
        <h2 id="t-pedidos" className="mb-3 text-lg font-bold">
          Pedidos
        </h2>
        <div className="tarjeta overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-borde bg-fondo text-xs uppercase tracking-wide text-suave">
              <tr>
                {["Pedido", "Cliente", "Sucursal", "Pago", "Récipe", "Estado", "Responsable", "Acción"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {pedidos.map((p) => {
                const estado = etiquetaEstado(p);
                const pago = etiquetaPago(p.estadoPago);
                const bloqueo = bloqueoAvance(p);
                return (
                  <tr key={p.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{p.id}</p>
                      <p className="text-xs text-suave">{formatoFecha(p.fecha, true)}</p>
                      <p className="text-xs text-suave">{formatoUsd(p.totalUsd)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{p.cliente.nombre}</p>
                      <p className="text-xs text-suave">{p.cliente.telefono}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{sucursalPorId(p.sucursalId).nombre.replace("Sucursal ", "")}</p>
                      <p className="text-xs text-suave">{p.modoEntrega === "domicilio" ? "Domicilio" : "Retiro"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="mb-1">{nombreMetodo(p.metodoPago)}</p>
                      <Etiqueta texto={pago.texto} tono={pago.tono} />
                    </td>
                    <td className="px-4 py-3">
                      {p.recipe ? (
                        <Etiqueta {...etiquetaRecipe(p.recipe.estado)} />
                      ) : (
                        <span className="text-suave">No aplica</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Etiqueta texto={estado.texto} tono={estado.tono} />
                    </td>
                    <td className="px-4 py-3">{p.responsable}</td>
                    <td className="px-4 py-3">
                      {bloqueo ? (
                        <span className="text-xs text-suave">{bloqueo}</span>
                      ) : (
                        <button className="btn-secundario whitespace-nowrap" onClick={() => avanzarPedido(p.id)}>
                          Avanzar estado
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

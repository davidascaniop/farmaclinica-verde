"use client";
import {
  etiquetaEstado,
  etiquetaPago,
  formatoBs,
  formatoFecha,
  formatoUsd,
  nombreMetodo,
  nombreModo,
  productoPorId,
  sucursalPorId,
  type Pedido,
} from "@shared";
import { Etiqueta } from "./Comunes";

export function ItemsPedido({ pedido }: { pedido: Pedido }) {
  return (
    <ul className="space-y-1 text-sm">
      {pedido.items.map((i) => (
        <li key={i.productoId} className="flex justify-between gap-3">
          <span>
            {i.cantidad} x {productoPorId(i.productoId)?.nombre ?? i.productoId}
          </span>
          <span className="text-suave">{formatoUsd(i.precioUsd * i.cantidad)}</span>
        </li>
      ))}
      {pedido.envioUsd > 0 && (
        <li className="flex justify-between gap-3">
          <span>Envío</span>
          <span className="text-suave">{formatoUsd(pedido.envioUsd)}</span>
        </li>
      )}
    </ul>
  );
}

export function CabeceraPedido({ pedido }: { pedido: Pedido }) {
  const estado = etiquetaEstado(pedido);
  const pago = etiquetaPago(pedido.estadoPago);
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-bold text-texto">Pedido {pedido.id}</p>
        <p className="text-sm text-suave">
          {formatoFecha(pedido.fecha, true)} · {nombreModo(pedido.modoEntrega)} · {sucursalPorId(pedido.sucursalId).nombre}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-suave">
          {nombreMetodo(pedido.metodoPago)}
          {pedido.estadoPago !== "confirmado" && <Etiqueta texto={`Pago: ${pago.texto.toLowerCase()}`} tono={pago.tono} />}
          <Etiqueta texto={estado.texto} tono={estado.tono} />
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">{formatoUsd(pedido.totalUsd)}</p>
        <p className="text-xs text-suave">{formatoBs(pedido.totalUsd, pedido.tasaBcv)}</p>
      </div>
    </div>
  );
}

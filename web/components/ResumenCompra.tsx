"use client";
import { formatoBs, formatoTasa, formatoUsd, type ResumenCarrito } from "@shared";

export default function ResumenCompra({ resumen, children }: { resumen: ResumenCarrito; children?: React.ReactNode }) {
  return (
    <aside className="tarjeta h-fit p-4 lg:sticky lg:top-36">
      <h2 className="mb-3 text-lg font-bold text-texto">Resumen</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-suave">Subtotal ({resumen.unidades} {resumen.unidades === 1 ? "producto" : "productos"})</dt>
          <dd>{formatoUsd(resumen.subtotalUsd)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-suave">Envío</dt>
          <dd>{resumen.envioUsd > 0 ? formatoUsd(resumen.envioUsd) : "Sin costo"}</dd>
        </div>
        <div className="flex items-start justify-between border-t border-borde pt-3">
          <dt className="font-semibold">Total</dt>
          <dd className="text-right">
            <div className="text-2xl font-bold">{formatoUsd(resumen.totalUsd)}</div>
            <div className="text-suave">{formatoBs(resumen.totalUsd)}</div>
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-suave">Tasa BCV: {formatoTasa()} por USD</p>
      {children}
    </aside>
  );
}

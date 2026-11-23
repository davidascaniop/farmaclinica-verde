"use client";
import { categoriaPorId, formatoBs, formatoUsd, lineaDeTiempo, type Pedido, type Producto, type Tono } from "@shared";

const TONOS: Record<Tono, string> = {
  ok: "bg-verde-claro text-verde-oscuro",
  pendiente: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-700",
  neutro: "bg-fondo text-suave",
};

export function Etiqueta({ texto, tono = "neutro" }: { texto: string; tono?: Tono }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONOS[tono]}`}>
      {texto}
    </span>
  );
}

export function Precio({ usd, tasa, grande = false }: { usd: number; tasa?: number; grande?: boolean }) {
  return (
    <div>
      <div className={`font-bold text-texto ${grande ? "text-3xl" : "text-lg"}`}>{formatoUsd(usd)}</div>
      <div className={`text-suave ${grande ? "text-base" : "text-xs"}`}>{formatoBs(usd, tasa)}</div>
    </div>
  );
}

// Imagen de ejemplo del producto: mosaico con el color de la categoria.
export function ImagenProducto({ producto, className = "" }: { producto: Producto; className?: string }) {
  const c = categoriaPorId(producto.categoria);
  return (
    <div
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{ backgroundColor: `${c.color}14` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-1/2 w-1/2" fill="none">
        <rect x="14" y="20" width="36" height="34" rx="6" fill="#fff" stroke={c.color} strokeWidth="3" />
        <rect x="22" y="10" width="20" height="10" rx="3" fill={c.color} />
        <path d="M32 28v18M23 37h18" stroke={c.color} strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const PUNTO = {
  hecho: "border-verde bg-verde",
  actual: "border-azul bg-white ring-4 ring-azul/15",
  pendiente: "border-borde bg-white",
  error: "border-red-600 bg-red-600",
};

export function LineaTiempo({ pedido, compacta = false }: { pedido: Pedido; compacta?: boolean }) {
  const pasos = lineaDeTiempo(pedido);
  if (compacta) {
    return (
      <ol className="grid grid-cols-5" aria-label="Estado del pedido">
        {pasos.map((p, i) => (
          <li key={p.clave} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span
                className={`absolute right-1/2 top-[7px] h-0.5 w-full ${
                  p.estado === "hecho" ? "bg-verde" : "bg-borde"
                }`}
              />
            )}
            <span className={`relative z-10 h-4 w-4 rounded-full border-2 ${PUNTO[p.estado]}`} />
            <span
              className={`mt-1.5 px-0.5 text-[11px] leading-tight sm:text-xs ${
                p.estado === "pendiente" ? "text-suave" : "font-semibold text-texto"
              } ${p.estado === "error" ? "text-red-700" : ""}`}
            >
              {p.titulo}
            </span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol aria-label="Estado del pedido">
      {pasos.map((p, i) => (
        <li key={p.clave} className="relative flex gap-3 pb-6 last:pb-0">
          {i < pasos.length - 1 && (
            <span
              className={`absolute left-[9px] top-5 h-full w-0.5 ${
                pasos[i + 1].estado === "hecho" ? "bg-verde" : "bg-borde"
              }`}
            />
          )}
          <span className={`relative z-10 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 ${PUNTO[p.estado]}`} />
          <div>
            <p
              className={`text-sm ${p.estado === "pendiente" ? "text-suave" : "font-semibold text-texto"} ${
                p.estado === "error" ? "text-red-700" : ""
              }`}
            >
              {p.titulo}
              {p.estado === "actual" && <span className="ml-2 font-normal text-azul">En curso</span>}
            </p>
            <p className="text-sm text-suave">{p.detalle}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Titulo({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-texto sm:text-3xl">{children}</h1>
      {sub && <p className="mt-1 text-suave">{sub}</p>}
    </div>
  );
}

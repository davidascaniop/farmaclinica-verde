"use client";
import { SUCURSALES, elegirModoEntrega, elegirSucursal, type ModoEntrega, type SucursalId } from "@shared";
import { useTienda } from "@/lib/tienda";

export function SelectorSucursal({ id = "sucursal" }: { id?: string }) {
  const tienda = useTienda();
  return (
    <div>
      <label htmlFor={id} className="etiqueta-campo">
        Sucursal
      </label>
      <select
        id={id}
        className="campo"
        value={tienda.sucursalId}
        onChange={(e) => elegirSucursal(e.target.value as SucursalId)}
      >
        {SUCURSALES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre} ({s.ciudad})
          </option>
        ))}
      </select>
    </div>
  );
}

const MODOS: { id: ModoEntrega; texto: string }[] = [
  { id: "domicilio", texto: "A domicilio" },
  { id: "retiro", texto: "Retiro en tienda" },
];

export function SelectorEntrega() {
  const tienda = useTienda();
  return (
    <fieldset>
      <legend className="etiqueta-campo">Forma de entrega</legend>
      <div className="grid grid-cols-2 rounded-lg border border-borde bg-white p-1">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={tienda.modoEntrega === m.id}
            onClick={() => elegirModoEntrega(m.id)}
            className={`min-h-11 cursor-pointer rounded-md px-2 text-sm font-semibold sm:min-h-9 ${
              tienda.modoEntrega === m.id ? "bg-azul text-white" : "text-suave hover:bg-fondo"
            }`}
          >
            {m.texto}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

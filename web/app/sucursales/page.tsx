"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buscarSucursales, elegirSucursal, enlaceMapa } from "@shared";
import { useTienda } from "@/lib/tienda";
import { Etiqueta, Titulo } from "@/components/Comunes";

export default function Sucursales() {
  const tienda = useTienda();
  const router = useRouter();
  const [ciudad, setCiudad] = useState("");
  const lista = buscarSucursales(ciudad);
  return (
    <div className="contenedor py-8">
      <Titulo sub="Encuentra tu farmacia más cercana.">Sucursales</Titulo>
      <div className="max-w-md">
        <label htmlFor="ciudad" className="etiqueta-campo">
          Buscar por ciudad o zona
        </label>
        <input
          id="ciudad"
          type="search"
          className="campo"
          placeholder="Ej.: Caracas, Valencia"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
      </div>
      {lista.length === 0 ? (
        <p className="tarjeta mt-6 p-8 text-center text-suave">No tenemos sucursales en esa ciudad todavía.</p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((s) => (
            <li key={s.id} className="tarjeta flex flex-col p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-azul">{s.nombre}</h2>
                {tienda.sucursalId === s.id && <Etiqueta texto="Tu sucursal" tono="ok" />}
              </div>
              <p className="text-sm font-medium">
                {s.ciudad}, {s.zona}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-suave">Dirección</dt>
                  <dd>{s.direccion}</dd>
                </div>
                <div>
                  <dt className="text-suave">Horario</dt>
                  <dd>{s.horario}</dd>
                </div>
                <div>
                  <dt className="text-suave">Teléfono</dt>
                  <dd>
                    <a href={`tel:${s.telefono.replace(/-/g, "")}`} className="text-azul underline">
                      {s.telefono}
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-col gap-2 pt-4">
                <a href={enlaceMapa(s)} target="_blank" rel="noreferrer" className="btn-secundario">
                  Ver en Google Maps
                </a>
                <button
                  className="btn-primario"
                  onClick={() => {
                    elegirSucursal(s.id);
                    router.push("/");
                  }}
                >
                  Comprar en esta sucursal
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

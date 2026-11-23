"use client";
import Link from "next/link";
import { useState } from "react";
import { CLIENTE_DEMO, mensajeRepetir, pedidosPropios, repetirPedido } from "@shared";
import { useTienda } from "@/lib/tienda";
import { LineaTiempo, Titulo } from "@/components/Comunes";
import { CabeceraPedido, ItemsPedido } from "@/components/DetallePedido";

export default function Cuenta() {
  const tienda = useTienda();
  const pedidos = pedidosPropios(tienda);
  const [aviso, setAviso] = useState<{ id: string; texto: string } | null>(null);
  return (
    <div className="contenedor max-w-4xl py-8">
      <Titulo sub={`${CLIENTE_DEMO.nombre} · ${CLIENTE_DEMO.telefono}`}>Mi cuenta</Titulo>
      <h2 className="mb-3 text-lg font-bold">Historial de pedidos</h2>
      <ul className="space-y-4">
        {pedidos.map((p) => (
          <li key={p.id} className="tarjeta p-4 sm:p-5">
            <CabeceraPedido pedido={p} />
            <div className="my-5">
              <LineaTiempo pedido={p} compacta />
            </div>
            <div className="border-t border-borde pt-3">
              <ItemsPedido pedido={p} />
            </div>
            {aviso?.id === p.id && (
              <p className="mt-3 rounded-lg bg-verde-claro p-3 text-sm text-verde-oscuro" role="status">
                {aviso.texto}{" "}
                <Link href="/carrito" className="font-semibold underline">
                  Ver carrito
                </Link>
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link href={`/pedido/${p.id}`} className="btn-secundario">
                Ver detalle
              </Link>
              <button
                className="btn-primario"
                onClick={() => setAviso({ id: p.id, texto: mensajeRepetir(repetirPedido(p.id)) })}
              >
                Repetir pedido
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

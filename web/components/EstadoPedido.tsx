"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CONTACTO, formatoTasa, pedidoPorId, repetirPedido, sucursalPorId } from "@shared";
import { useTienda } from "@/lib/tienda";
import { LineaTiempo, Titulo } from "@/components/Comunes";
import { CabeceraPedido, ItemsPedido } from "@/components/DetallePedido";

export default function EstadoPedido() {
  const id = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const tienda = useTienda();
  const pedido = pedidoPorId(tienda, id);
  if (!pedido) {
    return (
      <div className="contenedor py-10">
        <p className="text-suave">No encontramos el pedido {id}.</p>
        <Link href="/cuenta" className="btn-secundario mt-4">
          Ir a mis pedidos
        </Link>
      </div>
    );
  }
  const sucursal = sucursalPorId(pedido.sucursalId);
  return (
    <div className="contenedor max-w-3xl py-8">
      <Titulo>Estado del pedido</Titulo>
      <div className="tarjeta p-4 sm:p-5">
        <CabeceraPedido pedido={pedido} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="tarjeta p-4 sm:p-5">
          <h2 className="mb-4 font-bold">Seguimiento</h2>
          <LineaTiempo pedido={pedido} />
        </section>
        <div className="space-y-4">
          <section className="tarjeta p-4 sm:p-5">
            <h2 className="mb-3 font-bold">Productos</h2>
            <ItemsPedido pedido={pedido} />
            <p className="mt-3 border-t border-borde pt-3 text-xs text-suave">
              Tasa BCV aplicada: {formatoTasa(pedido.tasaBcv)} por USD. Referencia: {pedido.referencia}
            </p>
          </section>
          <section className="tarjeta p-4 text-sm sm:p-5">
            <h2 className="mb-2 text-base font-bold">{pedido.modoEntrega === "domicilio" ? "Entrega" : "Retiro"}</h2>
            <p>{pedido.cliente.nombre}</p>
            <p className="text-suave">
              {pedido.modoEntrega === "domicilio" ? pedido.cliente.direccion : `${sucursal.nombre}: ${sucursal.direccion}`}
            </p>
            <p className="mt-2 text-suave">Responsable en sucursal: {pedido.responsable}</p>
          </section>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="btn-primario flex-1"
              onClick={() => {
                repetirPedido(pedido.id);
                router.push("/carrito");
              }}
            >
              Repetir pedido
            </button>
            <a
              className="btn-secundario flex-1"
              href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(`Hola, necesito ayuda con mi pedido ${pedido.id}`)}`}
              target="_blank"
              rel="noreferrer"
            >
              Ayuda por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

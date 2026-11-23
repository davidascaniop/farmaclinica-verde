import Link from "next/link";
import { CONTACTO } from "@shared";

const GRUPOS = [
  {
    titulo: "FarmaClínica Verde",
    enlaces: [
      { href: "/quienes-somos", texto: "Quiénes somos" },
      { href: "/sucursales", texto: "Sucursales" },
      { href: "/contacto", texto: "Contacto" },
    ],
  },
  {
    titulo: "Ayuda",
    enlaces: [
      { href: "/compras-y-devoluciones", texto: "Compras y devoluciones" },
      { href: "/privacidad", texto: "Política de privacidad" },
      { href: "/cuenta", texto: "Mis pedidos" },
    ],
  },
  {
    titulo: "Uso interno",
    enlaces: [{ href: "/panel", texto: "Panel de pedidos" }],
  },
];

export default function Pie() {
  return (
    <footer className="mt-12 border-t border-borde bg-white">
      <div className="contenedor grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <h2 className="mb-2 text-sm font-semibold text-azul">{g.titulo}</h2>
            <ul>
              {g.enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="flex min-h-11 items-center text-sm text-suave hover:text-azul sm:min-h-8">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-azul">Atención al cliente</h2>
          <p className="text-sm text-suave">Teléfono: {CONTACTO.telefono}</p>
          <p className="text-sm text-suave">WhatsApp: {CONTACTO.whatsappVisible}</p>
          <p className="break-all text-sm text-suave">{CONTACTO.correo}</p>
        </div>
      </div>
      <div className="border-t border-borde py-4 text-center text-xs text-suave">
        Prototipo con datos de ejemplo. Precios, existencias y datos de pago no son reales.
      </div>
    </footer>
  );
}

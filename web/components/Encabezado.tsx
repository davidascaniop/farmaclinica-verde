"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@assets/logo-fcv.png";
import { FECHA_TASA_BCV, formatoFecha, formatoTasa, resumenCarrito } from "@shared";
import { useTienda } from "@/lib/tienda";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/sucursales", texto: "Sucursales" },
  { href: "/cuenta", texto: "Mi cuenta" },
  { href: "/contacto", texto: "Contacto" },
];

export default function Encabezado() {
  const ruta = usePathname();
  const unidades = resumenCarrito(useTienda()).unidades;
  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-white">
      <div className="bg-azul-oscuro text-white">
        <div className="contenedor flex flex-wrap items-center justify-between gap-x-4 py-1 text-xs">
          <span>Prototipo con datos de ejemplo</span>
          <span>
            Tasa BCV: <strong>{formatoTasa()}</strong> por USD
            <span className="hidden sm:inline"> ({formatoFecha(FECHA_TASA_BCV + "T12:00:00Z")})</span>
          </span>
        </div>
      </div>
      <div className="contenedor flex items-center justify-between gap-4 py-2">
        <Link href="/" className="flex min-h-11 items-center" aria-label="FarmaClínica Verde, inicio">
          <Image src={logo} alt="FarmaClínica Verde" priority className="h-10 w-auto sm:h-12" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium ${
                ruta === e.href ? "bg-azul-claro text-azul" : "text-texto hover:bg-fondo"
              }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
        <Link href="/carrito" className="btn-primario shrink-0">
          Carrito
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-azul">{unidades}</span>
        </Link>
      </div>
      <nav className="flex border-t border-borde md:hidden" aria-label="Principal">
        {ENLACES.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className={`flex min-h-11 flex-1 items-center justify-center text-sm font-medium ${
              ruta === e.href ? "border-b-2 border-azul text-azul" : "text-suave"
            }`}
          >
            {e.texto}
          </Link>
        ))}
      </nav>
    </header>
  );
}

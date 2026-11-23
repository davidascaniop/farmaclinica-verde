"use client";
import Link from "next/link";
import { useState } from "react";
import {
  CLIENTE_DEMO,
  DATOS_PAGO,
  METODOS_PAGO,
  formatoBs,
  formatoUsd,
  nombreMetodo,
  nombreModo,
  pagar,
  resumenCarrito,
  sucursalPorId,
  validarCheckout,
  type MetodoPago,
  type Pedido,
} from "@shared";
import { reducirImagen, useTienda } from "@/lib/tienda";
import { Titulo } from "@/components/Comunes";
import ResumenCompra from "@/components/ResumenCompra";

type Fase = "formulario" | "verificando" | "confirmado" | "revision";

export default function Checkout() {
  const tienda = useTienda();
  const resumen = resumenCarrito(tienda);
  const sucursal = sucursalPorId(tienda.sucursalId);
  const [cliente, setCliente] = useState(CLIENTE_DEMO);
  const [metodo, setMetodo] = useState<MetodoPago>("pago_movil");
  const [referencia, setReferencia] = useState("");
  const [recipe, setRecipe] = useState<string | null>(null);
  const [errorRecipe, setErrorRecipe] = useState<string | null>(null);
  const [fase, setFase] = useState<Fase>("formulario");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  const datos = { metodoPago: metodo, referencia, cliente, recipeImagen: recipe };
  const faltaRecipe = resumen.requiereRecipe && !recipe;

  const adjuntar = async (archivo: File | undefined) => {
    setErrorRecipe(null);
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      setErrorRecipe("El archivo debe ser una imagen (JPG o PNG).");
      return;
    }
    try {
      setRecipe(await reducirImagen(archivo));
    } catch {
      setErrorRecipe("No pudimos leer la imagen. Intenta con otra foto.");
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const problema = validarCheckout(tienda, datos);
    if (problema) {
      setError(problema);
      return;
    }
    setError(null);
    try {
      const final = await pagar(datos, (creado) => {
        setPedido(creado);
        setFase(metodo === "zelle" ? "revision" : "verificando");
      });
      setPedido(final);
      if (metodo !== "zelle") setFase("confirmado");
    } catch (err) {
      setFase("formulario");
      setError(err instanceof Error ? err.message : "No pudimos procesar el pago.");
    }
  };

  if (fase !== "formulario" && pedido) {
    return (
      <div className="contenedor py-10">
        <div className="tarjeta mx-auto max-w-lg p-6 text-center sm:p-8" role="status" aria-live="polite">
          {fase === "verificando" && (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-azul-claro border-t-azul" />
              <h1 className="mt-5 text-xl font-bold">Verificando tu pago con el banco</h1>
              <p className="mt-1 text-suave">
                Consultando la referencia {pedido.referencia} por {nombreMetodo(pedido.metodoPago)}. No cierres esta página.
              </p>
            </>
          )}
          {fase === "confirmado" && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verde">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </div>
              <h1 className="mt-5 text-xl font-bold text-verde-oscuro">Pago confirmado</h1>
              <p className="mt-1 text-suave">
                El banco confirmó tu {nombreMetodo(pedido.metodoPago)} por {formatoBs(pedido.totalUsd, pedido.tasaBcv)} (
                {formatoUsd(pedido.totalUsd)}).
              </p>
            </>
          )}
          {fase === "revision" && (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-800">
                !
              </div>
              <h1 className="mt-5 text-xl font-bold">Pago en revisión</h1>
              <p className="mt-1 text-suave">
                Recibimos tu pedido. Los pagos por Zelle se verifican manualmente; te avisaremos cuando quede confirmado.
              </p>
            </>
          )}
          <p className="mt-4 text-sm">
            Pedido <strong>{pedido.id}</strong>
            {pedido.recipe && ". Tu récipe será validado por un farmacéutico antes del despacho."}
          </p>
          {fase !== "verificando" && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href={`/pedido?id=${pedido.id}`} className="btn-primario">
                Ver estado del pedido
              </Link>
              <Link href="/" className="btn-secundario">
                Seguir comprando
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (resumen.lineas.length === 0) {
    return (
      <div className="contenedor py-8">
        <Titulo>Pago</Titulo>
        <div className="tarjeta p-8 text-center">
          <p className="text-suave">No hay productos para pagar.</p>
          <Link href="/" className="btn-primario mt-4">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor py-8">
      <Titulo>Pago</Titulo>
      <form onSubmit={enviar} className="grid gap-6 lg:grid-cols-[1fr_340px]" noValidate>
        <div className="space-y-4">
          <section className="tarjeta p-4 sm:p-5">
            <h2 className="text-lg font-bold">1. Entrega</h2>
            <p className="mt-1 text-sm text-suave">
              {nombreModo(tienda.modoEntrega)} desde {sucursal.nombre}, {sucursal.ciudad}.{" "}
              <Link href="/carrito" className="font-semibold text-azul underline">
                Cambiar
              </Link>
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="etiqueta-campo">
                  Nombre y apellido
                </label>
                <input
                  id="nombre"
                  className="campo"
                  autoComplete="name"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="telefono" className="etiqueta-campo">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  className="campo"
                  type="tel"
                  autoComplete="tel"
                  value={cliente.telefono}
                  onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                />
              </div>
              {tienda.modoEntrega === "domicilio" ? (
                <div className="sm:col-span-2">
                  <label htmlFor="direccion" className="etiqueta-campo">
                    Dirección de entrega
                  </label>
                  <input
                    id="direccion"
                    className="campo"
                    autoComplete="street-address"
                    value={cliente.direccion}
                    onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                  />
                </div>
              ) : (
                <p className="text-sm text-suave sm:col-span-2">
                  Retiras en: {sucursal.direccion}. {sucursal.horario}
                </p>
              )}
            </div>
          </section>

          {resumen.requiereRecipe && (
            <section className={`tarjeta p-4 sm:p-5 ${faltaRecipe ? "border-amber-400" : "border-verde"}`}>
              <h2 className="text-lg font-bold">2. Récipe médico</h2>
              <p className="mt-1 text-sm text-suave">
                Requerido para:{" "}
                {resumen.lineas
                  .filter((l) => l.producto.requiere_recipe)
                  .map((l) => l.producto.nombre)
                  .join(", ")}
                . Adjunta una foto legible del récipe.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {recipe && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={recipe} alt="Récipe adjunto" className="h-24 w-24 rounded-lg border border-borde object-cover" />
                )}
                <div>
                  <label className="btn-secundario">
                    {recipe ? "Cambiar imagen" : "Adjuntar imagen del récipe"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => adjuntar(e.target.files?.[0])}
                    />
                  </label>
                  <p className={`mt-2 text-sm ${recipe ? "text-verde-oscuro" : "text-amber-800"}`}>
                    {recipe ? "Récipe adjunto. Puedes continuar con el pago." : "No podrás pagar hasta adjuntar el récipe."}
                  </p>
                  {errorRecipe && <p className="text-sm text-red-700">{errorRecipe}</p>}
                </div>
              </div>
            </section>
          )}

          <section className="tarjeta p-4 sm:p-5">
            <h2 className="text-lg font-bold">{resumen.requiereRecipe ? "3" : "2"}. Método de pago</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Método de pago">
              {METODOS_PAGO.map((m) => (
                <label
                  key={m.id}
                  className={`flex min-h-11 cursor-pointer flex-col rounded-lg border p-3 ${
                    metodo === m.id ? "border-azul bg-azul-claro" : "border-borde bg-white hover:border-azul"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <input
                      type="radio"
                      name="metodo"
                      className="accent-azul"
                      checked={metodo === m.id}
                      onChange={() => setMetodo(m.id)}
                    />
                    {m.nombre}
                  </span>
                  <span className="mt-1 text-xs text-suave">{m.detalle}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-fondo p-4">
              <p className="text-sm font-semibold">
                Paga {metodo === "zelle" ? formatoUsd(resumen.totalUsd) : formatoBs(resumen.totalUsd)} a estos datos:
              </p>
              <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {DATOS_PAGO[metodo].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 sm:block">
                    <dt className="text-suave">{k}</dt>
                    <dd className="break-all font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-4 max-w-sm">
              <label htmlFor="referencia" className="etiqueta-campo">
                Número de referencia o confirmación
              </label>
              <input
                id="referencia"
                className="campo"
                inputMode="numeric"
                placeholder="Ej.: 00123456"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
              />
            </div>
          </section>
        </div>

        <ResumenCompra resumen={resumen}>
          <ul className="mt-3 space-y-1 border-t border-borde pt-3 text-sm">
            {resumen.lineas.map((l) => (
              <li key={l.producto.id} className="flex justify-between gap-3">
                <span className="text-suave">
                  {l.cantidad} x {l.producto.nombre}
                </span>
                <span>{formatoUsd(l.subtotalUsd)}</span>
              </li>
            ))}
          </ul>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn-verde mt-4 w-full" disabled={faltaRecipe}>
            {faltaRecipe ? "Adjunta el récipe para pagar" : `Pagar ${formatoUsd(resumen.totalUsd)}`}
          </button>
        </ResumenCompra>
      </form>
    </div>
  );
}

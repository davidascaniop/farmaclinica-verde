"use client";
import { useState } from "react";
import { CONTACTO, SUCURSALES } from "@shared";
import { Titulo } from "@/components/Comunes";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  return (
    <div className="contenedor max-w-4xl py-8">
      <Titulo sub="Estamos para ayudarte con tus pedidos y consultas.">Contacto</Titulo>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="tarjeta p-5">
          <h2 className="text-lg font-bold text-azul">Atención al cliente</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-suave">Teléfono</dt>
              <dd className="font-medium">{CONTACTO.telefono}</dd>
            </div>
            <div>
              <dt className="text-suave">Correo</dt>
              <dd className="break-all font-medium">{CONTACTO.correo}</dd>
            </div>
            <div>
              <dt className="text-suave">Sucursales</dt>
              {SUCURSALES.map((s) => (
                <dd key={s.id}>
                  {s.nombre}: {s.telefono}
                </dd>
              ))}
            </div>
          </dl>
          <a
            href={`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent("Hola, necesito ayuda con mi compra")}`}
            target="_blank"
            rel="noreferrer"
            className="btn-verde mt-5 w-full"
          >
            Escribir por WhatsApp ({CONTACTO.whatsappVisible})
          </a>
        </section>
        <section className="tarjeta p-5">
          <h2 className="text-lg font-bold text-azul">Envíanos un mensaje</h2>
          {enviado ? (
            <p className="mt-3 rounded-lg bg-verde-claro p-4 text-sm text-verde-oscuro" role="status">
              Mensaje recibido. Te responderemos a la brevedad. (Envío simulado en el prototipo.)
            </p>
          ) : (
            <form
              className="mt-3 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                setEnviado(true);
              }}
            >
              <div>
                <label htmlFor="c-nombre" className="etiqueta-campo">
                  Nombre
                </label>
                <input id="c-nombre" className="campo" required autoComplete="name" />
              </div>
              <div>
                <label htmlFor="c-correo" className="etiqueta-campo">
                  Correo o teléfono
                </label>
                <input id="c-correo" className="campo" required />
              </div>
              <div>
                <label htmlFor="c-mensaje" className="etiqueta-campo">
                  Mensaje
                </label>
                <textarea id="c-mensaje" className="campo" rows={4} required />
              </div>
              <button className="btn-primario w-full">Enviar mensaje</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

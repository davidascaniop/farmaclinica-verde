import { Titulo } from "./Comunes";

export interface Seccion {
  titulo: string;
  parrafos: string[];
}

export default function PaginaTexto({
  titulo,
  sub,
  secciones,
  children,
}: {
  titulo: string;
  sub?: string;
  secciones: Seccion[];
  children?: React.ReactNode;
}) {
  return (
    <div className="contenedor max-w-3xl py-8">
      <Titulo sub={sub}>{titulo}</Titulo>
      <div className="tarjeta space-y-6 p-5 sm:p-8">
        {secciones.map((s) => (
          <section key={s.titulo}>
            <h2 className="text-lg font-bold text-azul">{s.titulo}</h2>
            {s.parrafos.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-texto">
                {p}
              </p>
            ))}
          </section>
        ))}
        {children}
      </div>
      <p className="mt-4 text-xs text-suave">Texto de ejemplo para el prototipo. No constituye un documento legal.</p>
    </div>
  );
}

import PaginaTexto from "@/components/PaginaTexto";

export const metadata = { title: "Quiénes somos | FarmaClínica Verde" };

export default function QuienesSomos() {
  return (
    <PaginaTexto
      titulo="Quiénes somos"
      sub="Una red de farmacias venezolana al servicio de tu salud."
      secciones={[
        {
          titulo: "Nuestra historia",
          parrafos: [
            "FarmaClínica Verde es una red de farmacias con presencia en Caracas y Valencia. Combinamos la atención cercana de la farmacia de siempre con la comodidad de comprar en línea.",
            "Contamos con tres sucursales (Centro, Este y Norte) atendidas por farmacéuticos colegiados que orientan a cada cliente sobre el uso correcto de sus medicamentos.",
          ],
        },
        {
          titulo: "Misión",
          parrafos: [
            "Facilitar el acceso a medicamentos y productos de salud de calidad, con precios claros en dólares y en bolívares a la tasa oficial del BCV.",
          ],
        },
        {
          titulo: "Nuestros compromisos",
          parrafos: [
            "Despachar medicamentos con récipe únicamente tras la validación de un farmacéutico.",
            "Mostrar la existencia real de cada sucursal para que sepas dónde está tu producto antes de salir de casa.",
            "Confirmar tus pagos en el momento y mantenerte informado del estado de tu pedido.",
          ],
        },
      ]}
    />
  );
}

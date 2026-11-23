import PaginaTexto from "@/components/PaginaTexto";

export const metadata = { title: "Política de privacidad | FarmaClínica Verde" };

export default function Privacidad() {
  return (
    <PaginaTexto
      titulo="Política de privacidad"
      sub="Cómo tratamos tus datos personales."
      secciones={[
        {
          titulo: "Datos que recopilamos",
          parrafos: [
            "Nombre, teléfono, dirección de entrega y datos del pedido. Cuando compras medicamentos con récipe, también la imagen del récipe médico que adjuntas.",
          ],
        },
        {
          titulo: "Para qué los usamos",
          parrafos: [
            "Para procesar y entregar tus pedidos, verificar tus pagos, validar los récipes por parte de un farmacéutico y atender tus consultas.",
            "No vendemos ni cedemos tus datos a terceros con fines publicitarios.",
          ],
        },
        {
          titulo: "Récipes médicos",
          parrafos: [
            "Las imágenes de récipes son datos de salud. Solo las consulta el personal farmacéutico autorizado y se conservan durante el tiempo que exige la normativa sanitaria.",
          ],
        },
        {
          titulo: "Tus derechos",
          parrafos: [
            "Puedes solicitar el acceso, la corrección o la eliminación de tus datos escribiendo a nuestro canal de atención al cliente.",
          ],
        },
      ]}
    />
  );
}

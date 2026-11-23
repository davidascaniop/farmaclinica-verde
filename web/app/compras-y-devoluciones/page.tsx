import PaginaTexto from "@/components/PaginaTexto";

export const metadata = { title: "Compras y devoluciones | FarmaClínica Verde" };

export default function ComprasDevoluciones() {
  return (
    <PaginaTexto
      titulo="Compras y devoluciones"
      sub="Condiciones de compra, entrega y devolución."
      secciones={[
        {
          titulo: "Precios y tasa de cambio",
          parrafos: [
            "Todos los precios se expresan en dólares (USD) y en bolívares calculados a la tasa oficial del BCV vigente al momento de la compra. La tasa aplicada queda registrada en cada pedido.",
          ],
        },
        {
          titulo: "Métodos de pago",
          parrafos: [
            "Aceptamos Pago Móvil, transferencia bancaria y Zelle. Los pagos por Pago Móvil y transferencia se confirman automáticamente con el banco. Los pagos por Zelle se verifican manualmente y el pedido queda en revisión hasta su confirmación.",
          ],
        },
        {
          titulo: "Entrega y retiro",
          parrafos: [
            "Puedes recibir tu pedido a domicilio dentro de la ciudad de la sucursal o retirarlo en tienda sin costo. La existencia mostrada corresponde a la sucursal seleccionada.",
          ],
        },
        {
          titulo: "Medicamentos con récipe",
          parrafos: [
            "Los medicamentos que requieren récipe solo se despachan tras la validación del récipe por un farmacéutico. Si el récipe es rechazado, el pedido se cancela y se reintegra el pago.",
          ],
        },
        {
          titulo: "Devoluciones",
          parrafos: [
            "Por razones sanitarias no se aceptan devoluciones de medicamentos, salvo error en el despacho o producto en mal estado. Para el resto de los productos dispones de 7 días continuos, con el empaque sin abrir y el comprobante de compra.",
          ],
        },
      ]}
    />
  );
}

import { Suspense } from "react";
import EstadoPedido from "@/components/EstadoPedido";

// El numero de pedido va en la URL (?id=FCV-1007) porque los pedidos se crean en el navegador.
export default function PaginaPedido() {
  return (
    <Suspense>
      <EstadoPedido />
    </Suspense>
  );
}

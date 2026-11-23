import { PRODUCTOS } from "@shared";
import FichaProducto from "@/components/FichaProducto";

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ id: p.id }));
}

export default async function PaginaProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FichaProducto id={id} />;
}

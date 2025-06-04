import ProductDetail from "@/app/UI/ProductDetail";

export default async function ProductPage({ params }: { params: { id: string } }) {
  if (!params || !params.id) {
    return <p>Cargando...</p>; // Evita acceder a `params.id` si no está disponible
  }

  return <ProductDetail productId={params.id} />;
}

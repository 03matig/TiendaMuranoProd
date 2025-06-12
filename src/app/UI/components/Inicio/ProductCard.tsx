import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";
import { getSupabase } from "@/lib/cs"; // 🔹 Importar configuración de Supabase

type Product = {
  id_prenda: string;
  nombre: string;
  precio: number;
  nombre_archivo: string;
  tallas: string[];
  descripcion?: string;
  imagen: string; // URL completa desde Supabase
};

const ProductCard = ({ product }: { product: Product }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const supabase = getSupabase();
      setLoading(true);

      // 🔹 Obtiene productos desde Supabase (puedes filtrar por destacados si tienes una columna específica)
      const { data, error } = await supabase
        .from("stock")
        .select("*")
        .eq("destacado", true)
        .limit(3); // 🔹 Opcional: Limitar la cantidad de productos

      if (error) {
        console.error("Error obteniendo productos destacados:", error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);
  // 🔹 Manejar el clic en una ProductCard
  const handleProductClick = (product: Product) => {
    console.log("Producto clickeado:", product);
    router.push(
      `/Vistas/product/${product.id_prenda}?image=${encodeURIComponent(product.nombre_archivo)}&name=${encodeURIComponent(product.nombre)}&desc=${encodeURIComponent(product.descripcion || "")}&price=${product.precio}&sizes=${encodeURIComponent(product.tallas ? product.tallas.join(",") : "")}`
    );
  };

  return (
      <div className={styles.card} onClick={() => handleProductClick(product)}>
        <Image
          src={product.imagen} // 🔹 Ahora usa la misma lógica que ProductDetail
          alt={product.nombre}
          width={200}
          height={200}
          className={styles.image} // 🔹 Redirige al detalle del producto al hacer clic
          unoptimized={true} // 🔹 Opción para evitar problemas en desarrollo
        />
        <h3 className={styles.name}>{product.nombre}</h3>
        <p className={styles.price}>{product.precio} CLP</p>
        <button className={styles.button}>Ver Detalle</button>
      </div>
  );
};

export default ProductCard;
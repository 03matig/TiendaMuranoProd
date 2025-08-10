import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./ProductCard.module.css";

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
  const router = useRouter();

  const handleClick = () => {
    router.push(`/Vistas/product/${product.id_prenda}`);
  };

  return (
    <div className={styles.card}>
      <Image
        src={product.imagen} // URL completa desde Supabase
        alt={product.nombre}
        width={200}
        height={200}
        className={styles.image}
        unoptimized={true} // 🔹 Deshabilita la optimización de Next.js
      />
      <h3 className={styles.name}>{product.nombre}</h3>
      <p className={styles.price}>${product.precio.toLocaleString()}</p>
      <button className={styles.button} onClick={handleClick}>Ver Detalle</button>
    </div>
  );
};

export default ProductCard;

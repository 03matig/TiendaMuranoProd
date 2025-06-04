"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import styles from "./FeaturedProducts.module.css";
import { useRouter } from "next/router";
import supabase from "@/lib/cs";

const FeaturedProducts = ({ displayOption = "grid" }) => {
  const router = useRouter;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
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
  const handleProductClick = (product) => {
    router.push(
      `/Vistas/product/${product.id_prenda}?image=${encodeURIComponent(product.nombre_archivo)}&name=${encodeURIComponent(product.nombre)}&desc=${encodeURIComponent(product.descripcion)}&price=${product.precio}&sizes=${encodeURIComponent(product.tallas ? product.tallas.join(",") : "")}`
    );
  };

  return (
    <div className={styles.featuredContainer}>
      <section className={styles.featuredSection}>
        <h2 className={styles.title}>Productos Destacados</h2>
        <div className={styles.container}>
          {loading ? (
            <p className={styles.loadingMessage}>Cargando productos...</p>
          ) : displayOption === "carousel" ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop
              className={styles.swiper}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id_prenda}>
                  <div onClick={() => handleProductClick(product)}>
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id_prenda} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeaturedProducts;

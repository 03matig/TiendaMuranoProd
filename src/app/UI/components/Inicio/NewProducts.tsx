"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import styles from "./NewProducts.module.css";
import supabase from "@/lib/cs"; // 🔹 Importar configuración de Supabase

type Product = {
  id_prenda: string;
  nombre: string;
  precio: number;
  nombre_archivo: string;
  tallas: string[];
  descripcion?: string;
  imagen: string; // URL completa desde Supabase
};

const NewProducts = ({ displayOption = "grid" }) => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);

      // 🔹 Consulta productos nuevos desde Supabase (puedes filtrar por fecha si tienes una columna para ello)
      const { data, error } = await supabase
        .from("stock")
        .select("*")
        .eq("nuevo", true)
        // .order("fecha", { ascending: false })
        .limit(5); // 🔹 Puedes ajustar la cantidad de productos nuevos a mostrar

      if (error) {
        console.error("Error obteniendo productos nuevos:", error.message);
      } else {
        setNewProducts(data);
      }

      setLoading(false);
    };

    fetchNewProducts();
  }, []);

  return (
    <section className={styles.newproductsSection}>
      <h2 className={styles.title}>Recién Llegados</h2>
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
            {newProducts.map((product) => (
              <SwiperSlide key={product.id_prenda}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={styles.grid}>
            {newProducts.map((product) => (
              <ProductCard key={product.id_prenda} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProducts;

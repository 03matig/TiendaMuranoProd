"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import ProductCard from "./components/Catalogo/ProductCard";
import Filters from "./components/Catalogo/Filters";
import Footer from "./components/Footer";
import styles from "./Catalog.module.css";
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


const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]); // 🔹 Estado para los productos
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // 🔹 Estado para los filtros
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // 🔹 Para redirigir al detalle del producto

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = getSupabase();
      setLoading(true);
      const { data, error } = await supabase.from("stock").select("*");

      if (error) {
        console.error("Error obteniendo productos:", error.message);
      } else {
        console.log("Valores de nombre_archivo:", data.map(p=>p.nombre_archivo));
        setProducts(data);
        setFilteredProducts(data); // Inicializa los filtros con los datos originales
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 🔹 Manejar el clic en una ProductCard
  const handleProductClick = (product: Product) => {
    router.push(
      `/Vistas/product/${product.id_prenda}?image=${encodeURIComponent(product.nombre_archivo)}&name=${encodeURIComponent(product.nombre)}&desc=${encodeURIComponent(product.descripcion || "")}&price=${product.precio}&sizes=${encodeURIComponent(product.tallas ? product.tallas.join(",") : "")}`
    );
  };

  return (
    <>
      <Header />
      <div className={styles.bodyPadding}>
        <div className={styles.catalogContainer}>
          {/* Sidebar con filtros */}
          <Filters setFilteredProducts={setFilteredProducts} />

          {/* Sección principal de productos */}
          <div className={styles.productsSection}>
            <h1 className={styles.title}>Catálogo</h1>

            {/* Mostrar mensaje de carga */}
            {loading ? (
              <p className={styles.loadingMessage}>Cargando productos...</p>
            ) : (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id_prenda} onClick={() => handleProductClick(product)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            <div className={styles.pagination}>
              <button className={styles.pageButton}>« Anterior</button>
              <span>Página 1 de 3</span>
              <button className={styles.pageButton}>Siguiente »</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;
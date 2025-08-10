"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "./ProductDetail.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const sizesParam = searchParams.get("sizes");
  const product = {
    id: searchParams.get("id") ?? crypto.randomUUID(),
    name: searchParams.get("name") ?? "Producto sin nombre",
    description: searchParams.get("desc") ?? "",
    price: parseFloat(searchParams.get("price") ?? "0"),
    imageName: `/images/${searchParams.get("image")}`,
    sizes: sizesParam ? sizesParam.split(",") : [],
  };

  if (!product.imageName || !product.name || isNaN(product.price) || product.price <= 0) {
    return <p>Producto no encontrado.</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.bodyPadding}>
        <div className={styles.productContainer}>
          {/* Imagen del producto */}
          <div className={styles.imageContainer}>
            <Image
              src={product.imageName}
              alt={product.name}
              width={400}
              height={400}
              className={styles.productImage}
              unoptimized={true}
            />
          </div>

          {/* Información del producto */}
          <div className={styles.detailsContainer}>
            <h1>{product.name}</h1>
            <p className={styles.description}>
              {product.description.trim() ? product.description : "Sin descripción disponible."}
            </p>
            <p className={styles.price}>
              ${product.price.toLocaleString()} CLP
            </p>

            {/* Dropdown para cantidad */}
            <label className={styles.label}>Cantidad:</label>
            <select className={styles.Dropdown}>
              {[...Array(10).keys()].map(n => (
                <option key={n + 1} value={n + 1}>{n + 1}</option>
              ))}
            </select>

            {/* Dropdown para talla */}
            {product.sizes.length > 1 && (
              <>
                <label className={styles.label}>Talla:</label>
                <select className={styles.Dropdown}>
                  {product.sizes.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </>
            )}

            {/* Botón para añadir al carrito */}
            <button className={styles.addToCartButton} onClick={() => {
              if (!product.name || isNaN(product.price) || product.price <= 0) {
                alert("Faltan datos del producto");
                return;
              }

              addToCart({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                imageName: product.imageName,
                sizes: product.sizes,
                quantity: 1
              });
            }}>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;

"use client";

import { useEffect, useState } from "react";
import styles from "./products.module.css";
import Sidebar from "../../components/Sidebar";

type Product = {
  id_prenda: string;
  nombre: string;
  precio: number;
  nombre_archivo: string;
  tallas: string[];
  desc: string | null;
  imagen: string;
  destacado: boolean;
  nuevo: boolean;
  disponible: boolean;
};

export default function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null);
  const [disponibilidadSeleccionada, setDisponibilidadSeleccionada] = useState<boolean | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products/view-products");
        const json = await res.json();
        setProducts(json.products);
      } catch (error) {
        console.error("Error al cargar productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDisponibilidadChange = (product: Product, disponible: boolean) => {
    setProductoSeleccionado(product);
    setDisponibilidadSeleccionada(disponible);
    setMostrarModal(true);
  };

  const confirmarCambioDisponibilidad = async () => {
    if (!productoSeleccionado || disponibilidadSeleccionada === null) return;

    try {
      const res = await fetch("/api/admin/products/update-disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_prenda: productoSeleccionado.id_prenda,
          nuevo_disponible: disponibilidadSeleccionada,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id_prenda === productoSeleccionado.id_prenda
              ? { ...product, disponible: disponibilidadSeleccionada }
              : product
          )
        );
      } else {
        console.error("Error al actualizar disponibilidad:", data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setMostrarModal(false);
      setProductoSeleccionado(null);
      setDisponibilidadSeleccionada(null);
    }
  };

  const cancelarCambio = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setDisponibilidadSeleccionada(null);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <section className={styles.section}>
        <h2 className={styles.heading}>Productos</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Disponible</th>
                  <th>Editar Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id_prenda}>
                    <td>{product.id_prenda}</td>
                    <td>{product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>{product.disponible ? "Sí" : "No"}</td>
                    <td>
                      <select
                        value={String(product.disponible)}
                        onChange={(e) =>
                          handleDisponibilidadChange(product, e.target.value === "true")
                        }
                        className={styles.select}
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mostrarModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>¿Desea confirmar el cambio de disponibilidad del producto?</p>
              <div className={styles.modalButtons}>
                <button onClick={confirmarCambioDisponibilidad}>Sí</button>
                <button onClick={cancelarCambio}>No</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

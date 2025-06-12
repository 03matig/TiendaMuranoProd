import React, { useState } from "react";
import styles from "./Filters.module.css";

type Product = {
  id_prenda: string;
  nombre: string;
  precio: number;
  nombre_archivo: string;
  tallas: string[];
  descripcion?: string;
};

const Filters = ({ setFilteredProducts }: { setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>> }) => {
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  const handleFilterChange = () => {
    // Simulación de filtrado (reemplazar con lógica real)
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => (priceFilter ? product.precio <= priceFilter : true))
    );
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.h3} >Filtrar Productos</h3>
      <p>Muestra 8 de 8 productos</p>
      
      <button className={styles.filterButton} onClick={handleFilterChange}>Aplicar filtros</button>

      {/* Filtro por precio */}
      <label>Ordenar por:</label>
      <select className={styles.select}>
        <option value="posicion">Posición</option>
        <option value="precio-asc">Precio: Menor a Mayor</option>
        <option value="precio-desc">Precio: Mayor a Menor</option>
      </select>

      <label>Filtrar por precio:</label>
      <input
        type="number"
        className={styles.input}
        placeholder="Máximo $"
        onChange={(e) => {
          const value = e.target.value;
          setPriceFilter(value !== "" ? parseInt(value, 10) : null);
        }}
      />
    </aside>
  );
};

export default Filters;

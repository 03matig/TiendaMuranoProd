import React, { useState } from "react";
import styles from "./Filters.module.css";

const Filters = ({ setFilteredProducts }) => {
  const [priceFilter, setPriceFilter] = useState("");

  const handleFilterChange = () => {
    // Simulación de filtrado (reemplazar con lógica real)
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => (priceFilter ? product.price <= priceFilter : true))
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
        onChange={(e) => setPriceFilter(e.target.value)}
      />
    </aside>
  );
};

export default Filters;

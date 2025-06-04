import React from "react";
import styles from "./Trustbar.module.css";

const Trustbar = () => {
  return (
    <div className={styles.trustbar}>
      <div>
        <h3>Envío Gratis</h3>
        <p>Obtén tus productos despachados gratuitamente sobre $50.</p>
      </div>
      <div>
        <h3>Pagos Seguros</h3>
        <p>Pagos certificados con tarjeta o transferencia.</p>
      </div>
      <div>
        <h3>Abierto 24 horas</h3>
        <p>Disponible todos los días de la semana.</p>
      </div>
    </div>
  );
};

export default Trustbar;

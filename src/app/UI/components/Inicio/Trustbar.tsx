import React from "react";
import styles from "./Trustbar.module.css";

const Trustbar = () => {
  return (
    <div className={styles.trustbar}>
      <div>
        <h3>Elige el método de envío</h3>
        <p>Tenemos múltiples opciones de envío externalizado para que elijas la opción más económica.</p>
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

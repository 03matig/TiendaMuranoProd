import React from "react";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo y Redes Sociales */}
        <div className={styles.section}>
          <Image src="/images/UI/LogoMurano.png" alt="Murano Logo" width={100} height={100} />
          <p className={styles.p}>Síguenos</p>
          <div className={styles.socialIcons}>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-x-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>

        {/* Categorías */}
        <div className={styles.section}>
          <h3>Categorías</h3>
          <a href="#">Contact</a>
        </div>

        {/* Información */}
        <div className={styles.section}>
          <h3>Información</h3>
          <a href="#">Términos y Condiciones</a>
          <a href="#">Contact</a>
          <a href="#">Política de reembolso</a>
          <a href="#">Política de privacidad</a>
        </div>

        {/* Contacto */}
        <div className={styles.section}>
          <h3>Contáctanos</h3>
          <p>📍 Murano Sport</p>
          <p>Santiago</p>
          <p>Santiago Metropolitan – Chile</p>
        </div>
      </div>

      {/* Línea divisoria y Derechos de Autor */}
      <hr className={styles.divider} />
      <p className={styles.copyright}>
        © 2025 Club Deportivo Murano. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;

"use client";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Slider from "./components/Inicio/Slider";
import Trustbar from "./components/Inicio/Trustbar";
import BannerCarousel from "./components/Inicio/BannerCarousel";
import FeaturedProducts from "./components/Inicio/FeaturedProducts";
import NewProducts from "./components/Inicio/NewProducts";
import Footer from "./components/Footer";
import styles from "./Inicio.module.css";
import AnimatedLogoMurano from "./components/AnimatedLogoMurano";

const Inicio = () => {
  const [contentVisible, setContentVisible] = useState(false);
  const [headerLogoVisible, setHeaderLogoVisible] = useState(false); // 👈

  useEffect(() => {
    const headerEl = document.querySelector("header") as HTMLElement | null;
    const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 0;
    document.documentElement.style.setProperty("--headerBottom", `${headerBottom}px`);
  }, []);

  return (
    <>
      {/* Al inicio NO mostramos el logo del header */}
      <Header showFixedLogo={headerLogoVisible} />

      {/* Animación de entrada: al terminar, se muestra el logo fijo y el contenido */}
      <AnimatedLogoMurano
        onArrive={() => {
          setHeaderLogoVisible(true);
          setContentVisible(true);
        }}
        loaderDuration={500}     // blanco, navbar visible
        pauseCenteredMs={1500}   // queda ~1.5s grande en el centro
        transitionMs={900}       // desplazamiento suave
      />

      <div
        className={styles.bodyPadding}
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 500ms ease",
          pointerEvents: contentVisible ? "auto" : "none",
        }}
      >
        <Slider />
        <Trustbar />
        <div className={styles.divider}></div>
        <BannerCarousel />
        <div className={styles.divider}></div>
        <FeaturedProducts />
        <div className={styles.divider}></div>
        <NewProducts />
      </div>

      <Footer />
    </>
  );
};

export default Inicio;

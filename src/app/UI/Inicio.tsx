"use client";
import React, { useState } from "react";
import Header from "./components/Header";
import Slider from "./components/Inicio/Slider";
import Trustbar from "./components/Inicio/Trustbar";
import BannerCarousel from "./components/Inicio/BannerCarousel";
import FeaturedProducts from "./components/Inicio/FeaturedProducts";
import NewProducts from "./components/Inicio/NewProducts";
import Footer from "./components/Footer";
import styles from "./Inicio.module.css";

const Inicio = () => {
  const [contentVisible, setContentVisible] = useState(false);

  return (
    <>
      <Header onLogoAnimationMoveStart={() => setContentVisible(true)} />

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

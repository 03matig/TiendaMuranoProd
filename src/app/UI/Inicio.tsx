import React from "react";
import Header from "./components/Header";
import Slider from "./components/Inicio/Slider";
import Trustbar from "./components/Inicio/Trustbar";
import BannerCarousel from "./components/Inicio/BannerCarousel";
import FeaturedProducts from "./components/Inicio/FeaturedProducts";
import NewProducts from "./components/Inicio/NewProducts";
import Footer from "./components/Footer";
import styles from "./Inicio.module.css";


const Inicio = () => {
    return (
        <>
        <Header />
        <div className={styles.bodyPadding}>
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
    )
}

export default Inicio;
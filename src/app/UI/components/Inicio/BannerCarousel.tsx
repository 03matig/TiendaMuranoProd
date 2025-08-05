"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import styles from "./BannerCarousel.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const banners = [
  {
    id: 1,
    image: "/images/UI/Foto1.png", // Reemplaza con la ruta de tu imagen
    text: "",
  },
  {
    id: 2,
    image: "/images/UI/Foto2.png",
    text: "",
  },
  {
    id: 3,
    image: "/images/UI/Club-Murano-Campeon.png",
    text: "",
  },
];

const BannerCarousel = () => {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className={styles.swiper}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={styles.banner}>
              <Image
                src={banner.image}
                alt="Banner"
                fill
                style={{ objectFit: "contain" }}
                className={styles.image}
              />
              <div className={styles.overlay}>
                <p>{banner.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;

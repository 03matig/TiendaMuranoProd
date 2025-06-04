"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Slider.module.css";

type Sponsor = {
  id_sponsor: string;
  nombre: string;
  nombre_archivo_imagen: string;
  nombre_archivo_logo: string;
  descripcion: string | null;
  link_website: string;
};

const Slider = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState(400);
  const [shouldScale, setShouldScale] = useState(true);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/sponsors/load-active-sponsors");
      const data = await res.json();
      setSponsors(data);
    } catch (error) {
      console.error("Error al cargar sponsors:", error);
    }
  };

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 8000);
  };

  const nextSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % sponsors.length);
      setIsFadingOut(false);
      setIsFadingIn(true);
      setTimeout(() => {
        setIsFadingIn(false);
        resetAutoplay();
      }, 500);
    }, 500);
  };

  const prevSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? sponsors.length - 1 : prev - 1
      );
      setIsFadingOut(false);
      setIsFadingIn(true);
      setTimeout(() => {
        setIsFadingIn(false);
        resetAutoplay();
      }, 500);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsFadingOut(false);
      setIsFadingIn(true);
      setTimeout(() => {
        setIsFadingIn(false);
        resetAutoplay();
      }, 500);
    }, 500);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sponsors]);

  useEffect(() => {
    if (!sponsors.length) return;

    const img = new window.Image();
    img.src = sponsors[currentIndex].nombre_archivo_imagen;

    img.onload = () => {
      if (img.width <= 150 || img.height <= 150) {
        setSliderHeight(400);
        setShouldScale(false);
      } else {
        const proportion = img.height / img.width;
        const newHeight = proportion * window.innerWidth;
        setSliderHeight(Math.min(newHeight, 700));
        setShouldScale(true);
      }
    };
  }, [currentIndex, sponsors]);

  if (sponsors.length === 0) return null;

  const current = sponsors[currentIndex];

  return (
    <div className={styles.slider} style={{ height: `${sliderHeight}px` }}>
      <div className={styles.slide}>
        {/* Imagen de fondo */}
        <Image
          key={currentIndex}
          ref={imageRef}
          src={current.nombre_archivo_imagen}
          alt={current.nombre}
          width={1920}
          height={1080}
          quality={100}
          className={`${styles.image} ${isFadingOut ? styles.fadeOut : ""} ${
            isFadingIn ? styles.fadeIn : ""
          } ${!shouldScale ? styles.noScale : ""}`}
          priority
        />

        {/* Overlay con logo clickeable */}
        <div className={styles.overlay}>
          <a
            href={current.link_website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={current.nombre_archivo_logo}
              alt={`Logo de ${current.nombre}`}
              width={200}
              height={200}
              quality={100}
              className={`${styles.logo} ${
                isFadingOut ? styles.fadeOut : ""
              } ${isFadingIn ? styles.fadeIn : ""} ${
                !shouldScale ? styles.noScale : ""
              }`}
              priority
            />
            <div className={styles.text}>
              <h2>{current.nombre}</h2>
              {current.descripcion && <p>{current.descripcion}</p>}
              <button className={styles.button}>¡Quiero visitar la página! →</button>
            </div>
          </a>
        </div>

        {/* Flechas de navegación */}
        <button className={styles.prev} onClick={prevSlide}>
          ←
        </button>
        <button className={styles.next} onClick={nextSlide}>
          →
        </button>
      </div>

      {/* Dots de navegación */}
      <div className={styles.dots}>
        {sponsors.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === currentIndex ? styles.activeDot : ""
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;

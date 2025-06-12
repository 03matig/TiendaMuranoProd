"use client";

import React, { useState } from "react";
import styles from "./Contact.module.css";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

const ContactForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.message) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }

    setSuccess("Mensaje enviado correctamente. ¡Nos pondremos en contacto!");
    setError("");
  };

  return (
    <>
      <Header />
        <div className={styles.bodyPadding}>
        <div className={styles.contactContainer}>
            <h2>Contáctanos</h2>
            <p className={styles.p}>
            Aquí puedes encontrar todos los canales disponibles mediante los cuales nos puedes contactar.
            </p>

            {/* Sección de dirección y redes sociales */}
            <div className={styles.contactInfo}>
            <div className={styles.address}>
                <p className={styles.p}>📍 <strong>Dirección</strong></p>
                <p className={styles.p}>Av. Padre Hurtado Sur 2650, Las Condes, Región Metropolitana, Chile</p>
            </div>
            </div>

            {/* Formulario de contacto */}
            <div className={styles.formWrapper}>
            <h3 className={styles.h3}>Mándanos un mensaje</h3>
            <p className={styles.p}>Llena todos los campos y envía tu mensaje. Te responderemos a la brevedad posible.</p>

            <form onSubmit={handleSubmit} className={styles.contactForm}>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <div className={styles.inputRow}>
                <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="E-mail *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    name="name"
                    placeholder="Nombre *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    className={styles.input}
                    type="tel"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                />
                </div>

                <textarea
                className={styles.textarea}
                name="message"
                placeholder="Mensaje *"
                value={formData.message}
                onChange={handleChange}
                required
                ></textarea>

                <p className={styles.requiredFields}>* Campos obligatorios</p>

                <button className={styles.button} type="submit">Enviar</button>
            </form>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;

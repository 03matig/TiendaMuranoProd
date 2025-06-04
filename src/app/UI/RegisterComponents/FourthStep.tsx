"use client";

import React, { useState, useEffect } from "react";
import styles from "../Register.module.css";

export default function FourthStep({ formData, setFormData, onBack }: any) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("murano_user_email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: formData.verificationCode,
          method: "email",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error de verificación");
      }

      setSuccess("¡Cuenta verificada correctamente!");
      // Aquí podrías redirigir al usuario o mostrar paso final
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <input
        className={styles.input}
        type="text"
        placeholder="Código de verificación"
        value={formData.verificationCode}
        onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
        required
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" className={styles.button} onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className={styles.button}>
          Verificar y Crear Cuenta
        </button>
      </div>
    </form>
  );
}

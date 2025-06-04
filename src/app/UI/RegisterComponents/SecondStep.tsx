"use client";

import React, { useState } from "react";
import styles from "../Register.module.css";

export default function SecondStep({ formData, setFormData, onNext, onBack }: any) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register/create-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Correo registrado:", data.email);
      
      // ✅ Guardar el user_id en localStorage
      if (data.id) {
        localStorage.setItem("UserID", data.id);
        localStorage.setItem("UserEmail", data.email);
      }

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la cuenta");
      }

      onNext(); // 👉 pasar al tercer paso
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      <input
        className={styles.input}
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <input
        className={styles.input}
        type="password"
        name="confirmPassword"
        placeholder="Confirmar Contraseña"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        required
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" className={styles.button} onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Registrando..." : "Continuar"}
        </button>
      </div>
    </form>
  );
}

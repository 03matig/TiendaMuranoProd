"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }
  
      // ✅ Almacenar los datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: "/images/default-avatar.png" // 🔹 Aquí puedes usar una URL real si la tienes
      }));
  
      // ✅ Redirigir al usuario a la página principal
      router.push("/");
  
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.loginContainer}>
      {/* Imagen de fondo */}
      <div className={styles.backgroundWrapper}>
        <Image 
          src="/images/UI/Foto2.png" 
          alt="Fondo Login" 
          layout="fill" 
          objectFit="cover" 
        />
      </div>

      {/* Capa oscura sobre la imagen */}
      <div className={styles.overlay}></div>

      {/* 🔥 Caja del formulario (debe estar después de la capa oscura) */}
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <input
            className={styles.input}
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">Ingresar</button>
        </form>
        <p className={styles.registerLink}>
          ¿No tienes cuenta? <a href="/Vistas/register">Regístrate aquí</a>
        </p>
        <p className={styles.registerLink}>
            <a href="/"> Regresar a la Página Principal </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

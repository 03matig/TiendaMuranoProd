"use client";

import React, { useState, useEffect } from "react";
import styles from "../Register.module.css";
import { useRouter } from "next/navigation";

export default function FourthStep({ formData, setFormData, onBack }: any) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("");
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const storedEmail = localStorage.getItem("UserEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleResend = async () => {
    setResendStatus("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/register/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, method: "email" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al reenviar el código.");
      }

      setResendStatus("✅ Código reenviado exitosamente.");
      setTimer(60);
    } catch (err: any) {
      setResendStatus("❌ " + err.message);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido.");
      }

      setSuccess("🎉 ¡Cuenta verificada correctamente!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRedirect = () => {
    router.push("/Vistas/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      {success ? (
        <>
          <h3 className={styles.successMessage}>🎉 ¡Cuenta verificada correctamente!</h3>
          <button
            type="button"
            className={styles.button}
            style={{ marginTop: "1rem", width: "100%" }}
            onClick={handleRedirect}
          >
            Ir al Login
          </button>
        </>
      ) : (
        <>
          {error && <p className={styles.error}>{error}</p>}
          {resendStatus && <p className={styles.info}>{resendStatus}</p>}

          <input
            className={styles.input}
            type="text"
            placeholder="Código de verificación"
            value={formData.verificationCode}
            onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
            required
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              className={styles.button}
              onClick={handleResend}
              disabled={resending || timer > 0}
            >
              {resending ? "Reenviando..." : timer > 0 ? `Reenviar en ${timer}s` : "Reenviar Código"}
            </button>
            <button type="submit" className={styles.button}>
              Verificar y Crear Cuenta
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="button" className={styles.button} onClick={onBack}>
              Atrás
            </button>
          </div>
        </>
      )}
    </form>
  );
}

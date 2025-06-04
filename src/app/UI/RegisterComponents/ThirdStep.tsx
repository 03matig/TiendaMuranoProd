"use client";

import React, { useState, useEffect } from "react";
import styles from "../Register.module.css";
import direcciones from "./Direcciones.json";

export default function ThirdStep({ formData, setFormData, onNext, onBack }: any) {
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedRegion = formData.region;
    if (selectedRegion && direcciones[selectedRegion]) {
      setCiudades(Object.keys(direcciones[selectedRegion]));
    } else {
      setCiudades([]);
    }
    setFormData((prev: any) => ({ ...prev, ciudad: "", comuna: "" }));
  }, [formData.region]);

  useEffect(() => {
    const selectedRegion = formData.region;
    const selectedCity = formData.ciudad;
    if (
      selectedRegion &&
      direcciones[selectedRegion] &&
      direcciones[selectedRegion][selectedCity]
    ) {
      setComunas(direcciones[selectedRegion][selectedCity]);
    } else {
      setComunas([]);
    }
    setFormData((prev: any) => ({ ...prev, comuna: "" }));
  }, [formData.ciudad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const user_id = localStorage.getItem("UserID");
      const userEmail = localStorage.getItem("UserEmail");
      console.log("userEmail:", userEmail);
      if (!user_id || !userEmail) {
        throw new Error("No se encontraron datos del usuario.");
      }
  
      // 📝 POST datos personales
      const response = await fetch("/api/auth/register/set-personal-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          fullName: formData.fullName,
          dob: formData.dob,
          phone_number: formData.phone_number,
          region: formData.region,
          ciudad: formData.ciudad,
          comuna: formData.comuna,
          calle: formData.calle,
          numero: formData.numero,
          descripcion: formData.descripcion,
          codigo_postal: formData.codigo_postal,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al guardar los datos personales");
      }
  
      console.log("✅ Datos personales registrados:", data);
  
      // 📩 Generar y enviar código de verificación
      const sendCodeRes = await fetch("/api/auth/register/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          method: "email", // puedes cambiar a "sms" si integras esa opción
        }),
      });
  
      const sendCodeData = await sendCodeRes.json();
      if (!sendCodeRes.ok) {
        throw new Error(sendCodeData.error || "Error al enviar el código de verificación");
      }
  
      console.log("📨 Código enviado exitosamente:", sendCodeData.message);
      onNext(); // Pasar al FourthStep
  
    } catch (err: any) {
      console.error("❌ Error en ThirdStep:", err.message);
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
        type="text"
        placeholder="Nombre Completo"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        required
      />

      <input
        className={styles.input}
        type="date"
        placeholder="Fecha de Nacimiento"
        value={formData.dob}
        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        required
      />

      <input
        className={styles.input}
        type="tel"
        placeholder="Teléfono"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        required
      />

      <select
        className={styles.input}
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
        required
      >
        <option value="">Selecciona una región</option>
        {Object.keys(direcciones).map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <select
        className={styles.input}
        value={formData.ciudad}
        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
        required
        disabled={!formData.region}
      >
        <option value="">Selecciona una ciudad</option>
        {ciudades.map((ciudad) => (
          <option key={ciudad} value={ciudad}>
            {ciudad}
          </option>
        ))}
      </select>

      <select
        className={styles.input}
        value={formData.comuna}
        onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
        required
        disabled={!formData.ciudad}
      >
        <option value="">Selecciona una comuna</option>
        {comunas.map((comuna) => (
          <option key={comuna} value={comuna}>
            {comuna}
          </option>
        ))}
      </select>

      <input
        className={styles.input}
        type="text"
        placeholder="Calle"
        value={formData.calle}
        onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
        required
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Número"
        value={formData.numero}
        onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
        required
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Descripción (opcional)"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Código Postal"
        value={formData.codigo_postal}
        onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
        required
      />

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" className={styles.button} onClick={onBack}>
          Atrás
        </button>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Guardando..." : "Continuar"}
        </button>
      </div>
    </form>
  );
}

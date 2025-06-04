"use client";

import React, { useEffect, useState } from "react";
import styles from "./preferencias.module.css";

const Preferencias = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    recibirCorreos: false,
    recibirPromociones: false,
    temaOscuro: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { id } = JSON.parse(storedUser);
      setUserId(id);

      // Cargar preferencias actuales
      fetch(`/api/user/get-preferences?id=${id}`)
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            setForm({
              recibirCorreos: data.recibir_correos ?? false,
              recibirPromociones: data.recibir_promociones ?? false,
              temaOscuro: data.tema_oscuro ?? false,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async () => {
    if (!userId) return;
    await fetch("/api/user/update-preferences", {
      method: "POST",
      body: JSON.stringify({ id: userId, ...form }),
    });
    alert("Preferencias guardadas.");
  };

  if (loading) return <p>Cargando preferencias...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Preferencias</h2>

      <div className={styles.option}>
        <label>
          <input
            type="checkbox"
            name="recibirCorreos"
            checked={form.recibirCorreos}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Recibir correos de confirmación de compra
        </label>
      </div>

      <div className={styles.option}>
        <label>
          <input
            type="checkbox"
            name="recibirPromociones"
            checked={form.recibirPromociones}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Recibir promociones y novedades
        </label>
      </div>

      <div className={styles.option}>
        <label>
          <input
            type="checkbox"
            name="temaOscuro"
            checked={form.temaOscuro}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Usar tema oscuro
        </label>
      </div>

      <button className={styles.button} onClick={handleSubmit}>
        Guardar preferencias
      </button>
    </div>
  );
};

export default Preferencias;

"use client";

import React, { useEffect, useState } from "react";
import styles from "./mis-direcciones.module.css";

interface Direccion {
  id: string;
  full_name: string;
  dob: string;
  phone_number: string;
  region: string;
  ciudad: string;
  comuna: string;
  calle: string;
  numero: string;
  descripcion: string;
  codigo_postal: string;
  created_at: string;
}

const MisDirecciones = () => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirecciones = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { id } = JSON.parse(storedUser);

      try {
        const res = await fetch(`/api/user/my-addresses?user_id=${id}`);
        const json = await res.json();
        if (json.data) {
          setDirecciones(json.data);
        }
      } catch (error) {
        console.error("Error al obtener direcciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirecciones();
  }, []);

  if (loading) return <p>Cargando direcciones...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis direcciones</h2>

      {direcciones.length === 0 ? (
        <p>No tienes direcciones registradas.</p>
      ) : (
        <div className={styles.grid}>
          {direcciones.map((dir) => (
            <div key={dir.id} className={styles.card}>
              <h3>{dir.full_name}</h3>
              <p><strong>Teléfono:</strong> {dir.phone_number}</p>
              <p><strong>Dirección:</strong> {`${dir.calle} ${dir.numero}, ${dir.comuna}, ${dir.ciudad}, ${dir.region}`}</p>
              <p><strong>Descripción:</strong> {dir.descripcion || "Sin detalles"}</p>
              <p><strong>Código Postal:</strong> {dir.codigo_postal}</p>
              <p className={styles.fecha}>Agregada: {new Date(dir.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisDirecciones;

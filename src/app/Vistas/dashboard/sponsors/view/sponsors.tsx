"use client";

import { useEffect, useState } from "react";
import styles from "./sponsors.module.css";
import Sidebar from "../../components/Sidebar";

type Sponsor = {
  id_sponsor: string;
  user_id: string;
  nombre: string;
  nombre_archivo_imagen: string;
  url_imagen: string;
  descripcion: string | null;
  link_website: string;
  orden: number;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  nombre_archivo_logo: string;
  url_logo: string;
};

export default function SponsorsView() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors/view-sponsors-table");
        const json = await res.json();
        setSponsors(json.sponsors);
      } catch (error) {
        console.error("Error al cargar sponsors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const handleEditClick = (sponsor: Sponsor) => {
    setEditingSponsor({ ...sponsor });
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingSponsor) return;
    const { name, value } = e.target;
    setEditingSponsor((prev) => prev && { ...prev, [name]: value });
  };

  const closeModal = () => {
    setEditingSponsor(null);
  };

  const handleSave = async () => {
    try {
      // Aquí iría la lógica de actualización vía API si lo deseas.
        if (!editingSponsor) return;

        const res = await fetch("/api/sponsors/update-sponsor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSponsor),
        });

        const data = await res.json();

        if (res.ok) {
        setSponsors((prev) =>
            prev.map((s) =>
            s.id_sponsor === editingSponsor.id_sponsor ? editingSponsor : s
            )
        );
        } else {
        console.error("Error al guardar cambios:", data.error);
        }
    } catch (error) {
      console.error("Error al guardar cambios", error);
    } finally {
      closeModal();
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <section className={styles.section}>
        <h2 className={styles.heading}>Sponsors</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Logo</th>
                  <th>Imagen</th>
                  <th>Link</th>
                  <th>Activo</th>
                  <th>Orden</th>
                  <th>Descripción</th>
                  <th></th> {/* Botón de edición */}
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id_sponsor}>
                    <td>{sponsor.id_sponsor}</td>
                    <td>{sponsor.nombre}</td>
                    <td>
                      <img
                        src={sponsor.url_logo}
                        alt={`Logo de ${sponsor.nombre}`}
                        width={60}
                        height={60}
                      />
                    </td>
                    <td>
                      <img
                        src={sponsor.url_imagen}
                        alt={`Imagen de ${sponsor.nombre}`}
                        width={100}
                        height={60}
                      />
                    </td>
                    <td>
                      <a href={sponsor.link_website} target="_blank" rel="noopener noreferrer">
                        {sponsor.link_website}
                      </a>
                    </td>
                    <td>{sponsor.activo ? "Sí" : "No"}</td>
                    <td>{sponsor.orden}</td>
                    <td>{sponsor.descripcion ?? "—"}</td>
                    <td>
                    <span
                        className={styles.editCell}
                        onClick={() => handleEditClick(sponsor)}
                    >
                        Editar Sponsor
                    </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de edición */}
        {editingSponsor && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Editar Sponsor</h3>
              <label>Nombre:</label>
              <input
                name="nombre"
                value={editingSponsor.nombre}
                onChange={handleFieldChange}
              />

              <label>Link Website:</label>
              <input
                name="link_website"
                value={editingSponsor.link_website}
                onChange={handleFieldChange}
              />

              <label>Orden:</label>
              <input
                name="orden"
                type="number"
                value={editingSponsor.orden}
                onChange={handleFieldChange}
              />

              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={editingSponsor.descripcion ?? ""}
                onChange={handleFieldChange}
              />

              <div className={styles.modalButtons}>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

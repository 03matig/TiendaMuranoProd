"use client";

import { useState } from "react";
import styles from "./cambiar-contrasena.module.css";

const CambiarContrasena = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setMsg("");

    if (newPassword1 !== newPassword2) {
      setMsg("Las nuevas contraseñas no coinciden.");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setMsg("No se encontró el usuario.");
      return;
    }

    const { id } = JSON.parse(storedUser);

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        userId: id,
        oldPassword,
        newPassword: newPassword1,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setMsg("Contraseña actualizada correctamente.");
    } else {
      setMsg(result.error || "Error al cambiar la contraseña.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cambiar contraseña</h2>

      <label>Contraseña actual</label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className={styles.input}
      />

      <label>Nueva contraseña</label>
      <input
        type="password"
        value={newPassword1}
        onChange={(e) => setNewPassword1(e.target.value)}
        className={styles.input}
      />

      <label>Repetir nueva contraseña</label>
      <input
        type="password"
        value={newPassword2}
        onChange={(e) => setNewPassword2(e.target.value)}
        className={styles.input}
      />

      <button onClick={handleSubmit} className={styles.button}>
        Guardar nueva contraseña
      </button>

      {msg && <p className={styles.msg}>{msg}</p>}
    </div>
  );
};

export default CambiarContrasena;

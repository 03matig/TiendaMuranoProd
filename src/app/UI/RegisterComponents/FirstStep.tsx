"use client";

import React from "react";
import styles from "../Register.module.css";

export default function FirstStep({ formData, setFormData, onNext }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder="Correo Electrónico"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <button className={styles.button} type="submit">
        Continuar
      </button>
    </form>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import styles from "./mis-pedidos.module.css";

interface Pedido {
  id_pedido: string;
  talla: string;
  cantidad: number;
  estado: string;
  fecha_ingreso: string;
  fecha_entrega: string | null;
}

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { id } = JSON.parse(storedUser);

      try {
        const res = await fetch(`/api/user/my-orders?id=${id}`);
        const json = await res.json();

        if (json.data) {
          setPedidos(json.data);
        }
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Mis pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos registrados.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha ingreso</th>
              <th>Fecha entrega</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>{pedido.id_pedido.slice(0, 8)}</td>
                <td>{pedido.talla}</td>
                <td>{pedido.cantidad}</td>
                <td>{pedido.estado}</td>
                <td>{pedido.fecha_ingreso}</td>
                <td>{pedido.fecha_entrega ?? "Pendiente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MisPedidos;

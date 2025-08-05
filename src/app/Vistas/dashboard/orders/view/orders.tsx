"use client";

import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import Sidebar from "../../components/Sidebar";
import { FaChevronDown } from "react-icons/fa";

type Order = {
  id_pedido: string;
  id_cliente: string;
  id_prenda: string;
  talla: string;
  cantidad: number;
  estado: string;
  updated_at: string;
};

const ESTADOS_VALIDOS = ["Pendiente", "Procesado", "En Reparto", "Entregado"];

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Order | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("murano_token");
        const res = await fetch("/api/admin/orders/view-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setOrders(json.pedidos);
      } catch (error) {
        console.error("Error al cargar pedidos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleEstadoSelect = (order: Order, nuevoEstado: string) => {
    setPedidoSeleccionado(order);
    setEstadoSeleccionado(nuevoEstado);
    setMostrarModal(true);
  };

  const confirmarCambioEstado = async () => {
    if (!pedidoSeleccionado) return;
    try {
      const token = localStorage.getItem("murano_token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      // 🔹 Llamada a la API para actualizar el estado del pedido
      const res = await fetch("/api/admin/orders/update-order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_pedido: pedidoSeleccionado.id_pedido,
          nuevo_estado: estadoSeleccionado,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id_pedido === pedidoSeleccionado.id_pedido
              ? { ...order, estado: estadoSeleccionado }
              : order
          )
        );
      } else {
        console.error("Error al actualizar estado:", data.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setMostrarModal(false);
      setPedidoSeleccionado(null);
      setEstadoSeleccionado("");
      setDropdownOpenId(null);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <section className={styles.section}>
        <h2 className={styles.heading}>Pedidos</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Cantidad</th>
                  <th className={styles.alignRight}>Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id_pedido}>
                    <td>{order.id_pedido}</td>
                    <td>{order.id_cliente}</td>
                    <td>{new Date(order.updated_at).toLocaleDateString()}</td>
                    <td>{order.estado}</td>
                    <td>{order.cantidad}</td>
                    <td className={styles.alignRight}>
                      <div className={styles.dropdownWrapper}>
                        <button
                          className={styles.dropdownButton}
                          onClick={() =>
                            setDropdownOpenId(
                              dropdownOpenId === order.id_pedido ? null : order.id_pedido
                            )
                          }
                        >
                          Cambiar <FaChevronDown size={12} />
                        </button>
                        {dropdownOpenId === order.id_pedido && (
                          <div className={styles.dropdownMenu}>
                            {ESTADOS_VALIDOS.map((estado) => (
                              <div
                                key={estado}
                                className={styles.dropdownItem}
                                onClick={() => handleEstadoSelect(order, estado)}
                              >
                                {estado}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mostrarModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>¿Deseas confirmar el cambio de estado del pedido?</p>
              <div className={styles.modalButtons}>
                <button onClick={confirmarCambioEstado}>Sí</button>
                <button
                  onClick={() => {
                    setMostrarModal(false);
                    setPedidoSeleccionado(null);
                    setDropdownOpenId(null);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

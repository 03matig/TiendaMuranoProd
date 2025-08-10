"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./cotizarPago.module.css";
import Header from "@/app/UI/components/Header";
import Footer from "@/app/UI/components/Footer";
import { useRouter } from "next/navigation";

const CotizarPago = () => {
  const { cart } = useCart();
  const router = useRouter();

  const [delivery, setDelivery] = useState("");
  const [payment, setPayment] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirm = () => {
    if (!delivery || !payment) {
      alert("Por favor selecciona un método de entrega y de pago.");
      return;
    }

    // Aquí puedes guardar la info temporalmente o pasarla por query
    console.log("Entrega:", delivery);
    console.log("Pago:", payment);

    router.push("/Vistas/cart/confirmarPago"); // 🔜 Próxima vista
  };

  return (
    <>
      <Header />
      <div className={styles.bodyPadding}>
        <div className={styles.checkoutContainer}>
          <h2>💳 Finaliza tu Compra</h2>

          {/* Resumen del carrito */}
          <div className={styles.summary}>
            <h3>Resumen del Pedido</h3>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} CLP</span>
              </div>
            ))}
            <hr />
            <div className={styles.summaryItem}>
              <strong>Total:</strong>
              <strong>${total.toLocaleString()} CLP</strong>
            </div>
          </div>

          {/* Método de entrega */}
          <div className={styles.selectionSection}>
            <h3>🚚 Método de Entrega</h3>
            <select className={styles.select} value={delivery} onChange={(e) => setDelivery(e.target.value)}>
              <option value="">Selecciona una opción</option>
              <option value="chilexpress">Chilexpress</option>
              <option value="bluexpress">Bluexpress</option>
              <option value="retiro">Retiro en Tienda</option>
            </select>
          </div>

          {/* Medio de pago */}
          <div className={styles.selectionSection}>
            <h3>💰 Medio de Pago</h3>
            <select className={styles.select} value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="">Selecciona una opción</option>
              <option value="webpay">Webpay (tarjetas)</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="efectivo">Pago en Efectivo</option>
            </select>
          </div>

          {/* Confirmar */}
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirmar y Continuar
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CotizarPago;

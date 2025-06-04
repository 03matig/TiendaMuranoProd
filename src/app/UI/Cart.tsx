"use client";

import React from "react";
import { useCart } from "@/context/CartContext"; // 🔹 Importamos el contexto del carrito
import styles from "./Cart.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart(); // 🔹 Extraemos funciones del contexto

  // Calcular total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Header />
      <div className={styles.bodyPadding}>
        <div className={styles.cartContainer}>
          <h2>🛒 Carrito de Compras</h2>

          {cart.length === 0 ? (
            <p className={styles.emptyMessage}>Tu carrito está vacío.</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.imageName} alt={item.name} className={styles.productImage} />
                    <div className={styles.itemDetails}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>${item.price.toLocaleString()} CLP</p>
                      <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartSummary}>
                <h3>Total: ${total.toLocaleString()} CLP</h3>
                <button className={styles.checkoutButton}>Ir a pagar</button>
                <button className={styles.clearCartButton} onClick={clearCart}>
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;

"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userAvatar, setUserAvatar] = useState("/images/default-avatar.png");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name || "Usuario");
      setUserRole(userData.role || "user");
      setUserAvatar(userData.avatar || "/images/default-avatar.png");
    }
  }, []);

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setUserAvatar("/images/default-avatar.png");
    router.push("/Vistas/login");
  };

  const handleNavigateToProfile = () => {
    router.push("/Vistas/profile");
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <p>Este es el texto del slide</p>
        <a href="#">Leer más</a>
      </div>

      <div className={styles.navBar}>
        <div className={styles.rightSection}>
          <input
            type="text"
            placeholder="Busque productos aquí..."
            className={styles.searchBar}
          />
        </div>

        <div className={styles.logo}>
          <Image
            src="/images/UI/LogoMurano.png"
            alt="Logo Murano"
            width={80}
            height={80}
            className={styles.logoHeader}
            onClick={() => router.push("/")}
          />
        </div>

        <div className={styles.rightSection}>
          {/* 🔹 Perfil */}
          {isLoggedIn && (
            <div
              className={styles.profileContainer}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={styles.profileIconButton}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <FaUserCircle size={40} color="#ccc" />
              </button>

              {isDropdownOpen && (
                <div
                  className={styles.profileDropdown}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <ul>
                    {(userRole === "admin" || userRole === "moderator") && (
                      <>
                        <li>
                          <Link href="/Vistas/dashboard">Dashboard</Link>
                        </li>
                        <hr className={styles.divider} />
                      </>
                    )}
                    <li onClick={handleNavigateToProfile}>Mi perfil</li>
                    <hr className={styles.divider} />
                    <li>Mis pedidos</li>
                    <hr className={styles.divider} />
                    <li onClick={handleLogout}>Cerrar sesión</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 🔹 Carrito */}
          <div
            className={styles.carritoContainer}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <div
              className={styles.carrito}
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <AiOutlineShoppingCart size={35} color="#4a4a4a" />
              <span>{totalItemsInCart}</span>
            </div>

            {isCartOpen && (
              <div
                className={`${styles.dropdown} ${styles.open}`}
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
              >
                {cart.length === 0 ? (
                  <p>Tu carrito está vacío.</p>
                ) : (
                  cart.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className={styles.cartItem}>
                        <Image
                          src={item.imageName}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <div>
                          <p>{item.name}</p>
                          <p>${item.price.toLocaleString()} CLP</p>
                          <div className={styles.quantityControls}>
                            <button className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button className={styles.quantityButton} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <button
                            className={styles.removeButton}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      {index !== cart.length - 1 && <hr className={styles.divider} />}
                    </React.Fragment>
                  ))
                )}
                <hr className={styles.divider} />
                <Link href="/Vistas/cart">
                  <button className={styles.checkoutButton}>Ir a pagar</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/Vistas/catalog">Catálogo</Link>
            </li>
            <li>
              <Link href="/Vistas/contact">Contacto</Link>
            </li>
          </ul>
        </nav>
      </div>

      {!isLoggedIn && (
        <div className={styles.loginregister}>
          <div className={styles.login}>
            <Link href="/Vistas/login">¡Inicia Sesión!</Link>
          </div>
          <div className={styles.registrarse}>
            <span>¿No tienes cuenta?</span>{" "}
            <Link href="/Vistas/register">¡Regístrate!</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

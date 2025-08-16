"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import AnimatedLogoMurano from "../components/AnimatedLogoMurano";

type HeaderProps = {
  showFixedLogo?: boolean;
  onLogoAnimationMoveStart?: () => void;
  onLogoAnimationEnd?: () => void;
};

const Header = ({
  showFixedLogo = true,
  onLogoAnimationMoveStart,
  onLogoAnimationEnd,
}: HeaderProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userAvatar, setUserAvatar] = useState("/images/default-avatar.png");
  const [isPhone, setIsPhone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Detectar solo celulares (<600px)
    const mq = window.matchMedia("(max-width: 599px)");
    const apply = () => setIsPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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

  const handleNavigateToCatalog = () => {
    router.push("/Vistas/catalog");
  };

  return (
    <header className={styles.header}>
      {/* Top bar con marquee + link */}
      <div className={styles.topBar}>
        <div className={styles.marquee}>
          <p>¡Ahora tenemos múltiples opciones para cotizar tu envío!</p>
        </div>
        <a className={styles.topBarLink} onClick={handleNavigateToCatalog}>
          Ver Catálogo de productos
        </a>
      </div>

      <div className={styles.navBar}>
        <div className={styles.rightSection}>
          <input
            type="text"
            placeholder={isPhone ? "🔍" : "Busque productos aquí..."}
            className={`${styles.searchBar} ${isPhone ? styles.searchBarPhone : ""}`}
          />
        </div>

        <div className={styles.logo}>
          <div
            id="murano-navbar-logo-anchor"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
            }}
          >
            <AnimatedLogoMurano
              finalSize={80}
              onMoveStart={onLogoAnimationMoveStart}
              onFinish={onLogoAnimationEnd}
            />
          </div>
        </div>

        <div
          className={`${styles.rightSection} ${
            isPhone ? styles.rightSectionPhone : ""
          }`}
        >
          {isLoggedIn && (
            <div
              className={`${styles.profileContainer} ${
                isPhone ? styles.profileContainerPhone : ""
              }`}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`${styles.profileIconButton} ${
                  isPhone ? styles.profileIconButtonPhone : ""
                }`}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <FaUserCircle size={isPhone ? 32 : 40} color="#ccc" />
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

          <div
            className={`${styles.carritoContainer} ${
              isPhone ? styles.carritoContainerPhone : ""
            }`}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <div
              className={`${styles.carrito} ${
                isPhone ? styles.carritoPhone : ""
              }`}
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <AiOutlineShoppingCart size={isPhone ? 30 : 35} color="#4a4a4a" />
              <span className={isPhone ? styles.cartBadgePhone : ""}>
                {totalItemsInCart}
              </span>
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
                            <button
                              className={styles.quantityButton}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className={styles.quantityButton}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            className={styles.removeButton}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      {index !== cart.length - 1 && (
                        <hr className={styles.divider} />
                      )}
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

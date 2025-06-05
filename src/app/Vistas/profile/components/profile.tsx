"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/UI/components/Header";
import Footer from "@/app/UI/components/Footer";
import styles from "./profile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCog,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

// 🧩 Importar componentes por opción
import MisPedidos from "./sidebar-options/mis-pedidos";
import MisDirecciones from "./sidebar-options/mis-direcciones";
import Preferencias from "./sidebar-options/preferencias";
import CambiarContrasena from "./sidebar-options/cambiar-contrasena";

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/images/default-avatar.png");
  const [userName, setUserName] = useState("");
  const [selectedOption, setSelectedOption] = useState("mis-pedidos");
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Nombre Apellido",
    email: "usuario@example.com",
    role: "usuario",
    avatar: "/images/default-avatar.png",
    createdAt: "2024-01-01",
    status: "Activo",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        name: parsed.name || "Nombre Apellido",
        email: parsed.email || "usuario@example.com",
        role: parsed.role || "usuario",
        avatar: parsed.avatar || "/images/default-avatar.png",
        createdAt: parsed.createdAt || "2024-01-01",
        status: "Activo",
      });
    }
  }, []);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName("");
    setUserAvatar("/images/default-avatar.png");
    router.push("/");
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "mis-pedidos":
        return <MisPedidos />;
      case "mis-direcciones":
        return <MisDirecciones />;
      case "preferencias":
        return <Preferencias />;
      case "cambiar-contrasena":
        return <CambiarContrasena />;
      case "cerrar-sesion":
        handleLogout();
        return <p>Sesión cerrada.</p>;
      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div>
      <Header />
      <main className={styles.pageWrapper}>
        {/* 🟦 Header */}
        <section className={styles.profileHeader}>
          <div className={styles.banner}></div>
          <div className={styles.cardContent}>
            <div className={styles.avatarContainer}>
              {user.avatar && user.avatar !== "/images/default-avatar.png" ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className={styles.avatar}
                />
              ) : (
                <FaUserCircle size={96} color="#ccc" className={styles.iconAvatar} />
              )}
            </div>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.email}>{user.email}</p>
            <div className={styles.tags}>
              <span className={styles.tag}>Rol: {user.role}</span>
              <span className={styles.tag}>Estado: {user.status}</span>
              <span className={styles.tag}>Desde: {user.createdAt}</span>
            </div>
            <button className={styles.editButton}>Editar perfil</button>
          </div>
        </section>

        {/* 🟨 Zona inferior */}
        <section className={styles.profileLayout}>
          <aside className={styles.profileMenu}>
            <ul>
              <li
                className={selectedOption === "mis-pedidos" ? styles.active : ""}
                onClick={() => handleSelect("mis-pedidos")}
              >
                <FaBoxOpen /> Mis pedidos
              </li>
              <li
                className={selectedOption === "mis-direcciones" ? styles.active : ""}
                onClick={() => handleSelect("mis-direcciones")}
              >
                <FaMapMarkerAlt /> Mis direcciones
              </li>
              <li
                className={selectedOption === "preferencias" ? styles.active : ""}
                onClick={() => handleSelect("preferencias")}
              >
                <FaCog /> Preferencias
              </li>
              <li
                className={selectedOption === "cambiar-contrasena" ? styles.active : ""}
                onClick={() => handleSelect("cambiar-contrasena")}
              >
                <FaKey /> Cambiar contraseña
              </li>
              <li
                className={selectedOption === "cerrar-sesion" ? styles.active : ""}
                onClick={() => handleSelect("cerrar-sesion")}
              >
                <FaSignOutAlt /> Cerrar sesión
              </li>
            </ul>
          </aside>

          <div className={styles.profileContent}>{renderContent()}</div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Profile;

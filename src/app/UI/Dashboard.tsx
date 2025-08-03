"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Dashboard.module.css";
import Sidebar from "../Vistas/dashboard/components/Sidebar";

const Dashboard = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userCount, setUserCount] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [productCount, setProductCount] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [pendingOrdersDetails, setPendingOrdersDetails] = useState<number | null>(null);

  // 🔹 Manejo de autenticación y redirección
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name || "Usuario");
      setUserRole(userData.role || "user");

      console.log("El rol del usuario es: " + userData.role);

      if (userData.role !== "admin" && userData.role !== "moderator") {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // 🔹 Obtener la cantidad de usuarios desde la API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/admin/users/users-count");
        const data = await response.json();
        if (response.ok) {
          setUserCount(data.count);
        } else {
          console.error("Error obteniendo usuarios:", data.error);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    fetchUserCount();
  }, []);

  // 🔹 Obtener la cantidad de productos desde la API
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const token = localStorage.getItem("murano_token");

        const response = await fetch("/api/admin/products/products-count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProductCount(data.count);
        } else {
          console.error("Error obteniendo productos:", data.error);
        }
      } catch (error) {
        console.error("Error en la petición:", error);
      }
    };

    fetchProductCount();
  }, []);


    // 🔹 Obtener la cantidad de pedidos pendientes desde la API
    useEffect(() => {
      const fetchPendingOrders = async () => {
        try {
          const token = localStorage.getItem("murano_token");

          const response = await fetch("/api/admin/orders/orders-pending", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setPendingOrders(data.count);
          } else {
            console.error("Error obteniendo pedidos pendientes:", data.error);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      };

      fetchPendingOrders();
    }, []);

    // Visualizar los pedidos singularmente desde la API
    useEffect(() => {
      const fetchPendingOrdersDetails = async () => {
        try {
          const response = await fetch("/api/admin/orders/view-orders");
          const datadetails = await response.json();
          if (response.ok) {
            setPendingOrdersDetails(datadetails);
          } else {
            console.error("Error obteniendo pedidos pendientes:", datadetails.error);
          }
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      }
    }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      {/* 🔹 Contenido principal */}
      <div className={styles.mainContent}>
        <h1 className={styles.h1}>Bienvenido, {userName} 👋</h1>
        <h2 className={styles.role}>Rol: {userRole}</h2>

        {/* 🔹 Sección de estadísticas */}
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 className={styles.h3}>Productos</h3>
            <p>{productCount !== null ? `${productCount} en stock` : "Cargando..."}</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.h3}>Usuarios registrados</h3>
            <p>{userCount !== null ? userCount : "Cargando..."}</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.h3}>Órdenes</h3>
            <p>{pendingOrders !== null ? `${pendingOrders} pendientes` : "Cargando..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

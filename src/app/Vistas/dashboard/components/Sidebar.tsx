"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Sidebar.module.css";
import {
  FaHome,
  FaUsers,
  FaFolder,
  FaCalendarAlt,
  FaFileAlt,
  FaChartPie,
  FaPlusCircle,
  FaUserPlus,
  FaUserCircle,
  FaUser
} from "react-icons/fa";

const Sidebar = () => {
  const router = useRouter();
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [precio, setPrecio] = useState("");
  const [desc, setDesc] = useState("");
  const [useCustomTallas, setUseCustomTallas] = useState(false);
  const [tallas, setTallas] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  const openStockModal = () => setIsStockModalOpen(true);
  const openSponsorModal = () => setIsSponsorModalOpen(true);
  const closeStockModal = () => setIsStockModalOpen(false);
  const closeSponsorModal = () => setIsSponsorModalOpen(false);

  // Nuevas variables para el segundo modal
  const [sponsorNombre, setSponsorNombre] = useState("");
  const [sponsorURL, setSponsorURL] = useState("");
  const [sponsorDesc, setSponsorDesc] = useState("");
  const [sponsorImg, setSponsorImg] = useState<File | null>(null);
  const [sponsorLogo, setSponsorLogo] = useState<File | null>(null);


  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sponsorImgRef = useRef<HTMLInputElement | null>(null);
  const sponsorLogoRef = useRef<HTMLInputElement | null>(null);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReturnToStore = () => {
    router.push("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || "Usuario");
    }
  }, []);

  const handleUpload = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("No se encontró el usuario. Intenta iniciar sesión nuevamente.");
      return;
    }
    const userData = JSON.parse(user);
    const userId = userData.id;

    if (!selectedFile || !nombre.trim() || !precio.trim()) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("nombre", nombre.trim());
    formData.append("precio", precio.trim());
    formData.append("userId", userId);
    formData.append("desc", desc.trim());

    const tallasToSend = useCustomTallas ? JSON.stringify(tallas) : "";
    formData.append("tallas", tallasToSend);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Producto agregado al stock con éxito!");
      closeStockModal();
      setNombre("");
      setPrecio("");
      setTallas([]);
      setUseCustomTallas(false);
      setDesc("");
      setSelectedFile(null);
    } else {
      alert("Error al subir el producto: " + data.error);
    }

    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSponsorUpload = async () => {
    const user = localStorage.getItem("user");
    if (!user) return alert("Debes iniciar sesión.");
    const { id: userId } = JSON.parse(user);

    if (!sponsorNombre.trim() || !sponsorURL.trim() || !sponsorImg || !sponsorLogo) {
      return alert("Todos los campos obligatorios deben estar llenos.");
    }

    const formData = new FormData();
    formData.append("nombre", sponsorNombre.trim());
    formData.append("link_website", sponsorURL.trim());
    formData.append("descripcion", sponsorDesc.trim());
    formData.append("user_id", userId);
    formData.append("imagen", sponsorImg);
    formData.append("logo", sponsorLogo);

    setUploading(true);
    const res = await fetch("/api/sponsors/upload-sponsor", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      alert("Sponsor agregado correctamente");
      closeSponsorModal();
      setSponsorNombre(""); setSponsorURL(""); setSponsorDesc("");
      setSponsorImg(null); setSponsorLogo(null);
    } else {
      alert("Error al agregar sponsor: " + data.error);
    }
    setUploading(false);
  };

  const handleAddTalla = () => {
    const newTalla = prompt("Ingrese la talla a agregar:");
    if (newTalla && !tallas.includes(newTalla)) {
      setTallas([...tallas, newTalla]);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1><span className={styles.title} onClick={() => router.push("/Vistas/dashboard/")}>Dashboard Murano</span></h1>
        <div className={styles.profileIcon}>
          <div className={styles.profilePicture}>
            <FaUserCircle size={40} color="#ccc" />
          </div>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <Image
              src="/images/UI/LogoMurano.png"
              className={styles.logoImage}
              alt="Logo Murano"
              width={40}
              height={40}
              onClick={handleReturnToStore}
            />
          </span>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navSection}>
            <li><a onClick={() => router.push("/Vistas/dashboard")} className={styles.clickable}><FaHome /> <span>Dashboard</span></a></li>
            <li><a onClick={() => router.push("/Vistas/dashboard/users")} className={styles.clickable}><FaUsers /> <span>Gestionar Usuarios</span></a></li>
            <li><a onClick={() => router.push("/Vistas/dashboard/products")} className={styles.clickable}><FaFolder /> <span>Administrar Productos</span></a></li>
            <li><a className={styles.clickable}><FaCalendarAlt /> <span>Calendario</span></a></li>
            <li><a onClick={() => router.push("/Vistas/dashboard/orders")} className={styles.clickable}><FaFileAlt /> <span>Revisar Pedidos</span></a></li>
            <li><a className={styles.clickable}><FaChartPie /> <span>Estadísticas de Venta</span></a></li>
            <li><a onClick={() => router.push("/Vistas/dashboard/sponsors")} className={styles.clickable}><FaUser /> <span>Visualizar Sponsors</span></a></li>

          </ul>

          <div className={styles.sectionTitle}>Acciones</div>
          <ul className={styles.navSection}>
            <li><a onClick={openStockModal} className={styles.clickable}><FaPlusCircle /> <span>Añadir Producto</span></a></li>
            <li><a onClick={openSponsorModal} className={styles.clickable}><FaUserPlus /> <span>Agregar Sponsor</span></a></li>
          </ul>
        </nav>

        <div className={styles.footer}>
          <span onClick={handleReturnToStore}>Volver a la Tienda</span>
        </div>
      </aside>

      {/* 🔹 Modal fuera del <aside> para ocupar toda la pantalla */}
      {isStockModalOpen && (
        <div className={styles.modalOverlay} onClick={closeStockModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.subirProducto}>Subir Producto</h2>
            <input className={styles.inputSubirProducto} type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input className={styles.inputSubirProducto} type="number" placeholder="Precio en CLP" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            <div className={styles.divider}></div>
            <div className={styles.uploadSection}>
              <input
                type="file"
                accept="image/png"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.hiddenFileInput}
              />

              <button
                type="button"
                className={styles.selectFileButton}
                onClick={handleBrowseClick}
              >
                Seleccionar archivo
              </button>

              <span className={styles.fileName}>
                {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
              </span>

              <small className={styles.advertenciaArchivo}>
                ⚠ Solo se permiten archivos en formato PNG.
              </small>
            </div>


            <div className={styles.divider}></div>
            <div className={styles.uploadSection}>
              <label className={styles.label}><input type="checkbox" checked={useCustomTallas} onChange={() => setUseCustomTallas(!useCustomTallas)} style={{ backgroundColor: "#ffffff" }}/> Agregar tallas manualmente</label>
              {!useCustomTallas && <small>⚠ Si no seleccionas ninguna, se usarán: ["S", "M", "L", "XL"].</small>}
              {useCustomTallas && (
                <>
                  <button onClick={handleAddTalla}>Agregar Talla</button>
                  <ul>{tallas.map((talla, index) => <li key={index}>{talla}</li>)}</ul>
                </>
              )}
            </div>
            <div className={styles.divider}></div>
            <input className={styles.inputSubirProducto} placeholder="Descripción (opcional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className={styles.modalButtons}>
              <button onClick={handleUpload} disabled={uploading}>{uploading ? "Subiendo..." : "Subir Producto"}</button>
              <button onClick={closeStockModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {isSponsorModalOpen && (
        <div className={styles.modalOverlay} onClick={closeSponsorModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.subirProducto}>Agregar Sponsor</h2>
            <input className={styles.inputSubirProducto} type="text" placeholder="Nombre del sponsor" value={sponsorNombre} onChange={(e) => setSponsorNombre(e.target.value)} />
            <input className={styles.inputSubirProducto} type="url" placeholder="URL del sitio web" value={sponsorURL} onChange={(e) => setSponsorURL(e.target.value)} />
            <input className={styles.inputSubirProducto} placeholder="Descripción (opcional)" value={sponsorDesc} onChange={(e) => setSponsorDesc(e.target.value)} />
            <div className={styles.uploadSection}>
              <label>Imagen principal (PNG):</label>
              <input
                type="file"
                accept="image/png"
                ref={sponsorImgRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) setSponsorImg(file);
                }}
              />
              <label>Logo (PNG):</label>
              <input
                type="file"
                accept="image/png"
                ref={sponsorLogoRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) setSponsorLogo(file);
                }}
/>
            </div>
            <div className={styles.modalButtons}>
              <button onClick={handleSponsorUpload} disabled={uploading}>{uploading ? "Subiendo..." : "Agregar Sponsor"}</button>
              <button onClick={closeSponsorModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/UI/components/Header";
import Footer from "@/app/UI/components/Footer";
import styles from "./addressSelection.module.css";
import direcciones from "@/app/UI/RegisterComponents/Direcciones.json";

type DeliveryAddress = {
  id: string;
  user_id: string;
  full_name: string;
  dob: string;
  phone_number: string;
  region: string;
  ciudad: string;   // provincia
  comuna: string;
  calle: string;
  numero: string;
  descripcion?: string;
  codigo_postal?: string;
  created_at?: string;
};

type ApiResponse = { data: DeliveryAddress[] };

const NUEVA_DIRECCION_ID = "new_address";

export default function AddressSelection() {
  const router = useRouter();

  // Paso 1: método de envío
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "delivery" | "">("");

  // Paso 2: direcciones (solo si delivery)
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Form "Nueva dirección"
  const [form, setForm] = useState<Omit<DeliveryAddress, "id" | "user_id" | "created_at">>({
    full_name: "",
    dob: "",
    phone_number: "",
    region: "",
    ciudad: "",
    comuna: "",
    calle: "",
    numero: "",
    descripcion: "",
    codigo_postal: "",
  });

  const [ciudades, setCiudades] = useState<string[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);

  // Cascada: al cambiar región -> ciudades
  useEffect(() => {
    const reg = form.region as keyof typeof direcciones;
    if (reg && direcciones[reg]) {
      setCiudades(Object.keys(direcciones[reg]));
    } else {
      setCiudades([]);
    }
    setForm(prev => ({ ...prev, ciudad: "", comuna: "" }));
  }, [form.region]);

  // Cascada: al cambiar ciudad -> comunas
  useEffect(() => {
    const reg = form.region as keyof typeof direcciones;
    const city = form.ciudad as keyof (typeof direcciones)[typeof reg];
    if (reg && city && direcciones[reg] && direcciones[reg][city]) {
      setComunas(direcciones[reg][city]);
    } else {
      setComunas([]);
    }
    setForm(prev => ({ ...prev, comuna: "" }));
  }, [form.ciudad]);

  // Cargar direcciones del usuario desde /api/user/my-addresses
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/user/my-addresses");
        const json: ApiResponse = await res.json();
        const arr = json?.data ?? [];
        setAddresses(arr);
        setSelectedId(arr[0]?.id ?? NUEVA_DIRECCION_ID);
      } catch {
        setAddresses([]);
        setSelectedId(NUEVA_DIRECCION_ID);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const selectedAddress: DeliveryAddress | null = useMemo(() => {
    if (selectedId === NUEVA_DIRECCION_ID) return null;
    return addresses.find(a => a.id === selectedId) || null;
  }, [addresses, selectedId]);

  function handleSelect(id: string) {
    setSelectedId(id);
    if (errors.selected) {
      setErrors(({ selected, ...rest }) => rest);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target as any;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _omit, ...rest } = prev;
        return rest;
      });
    }
  }

  function formatAddress(a: DeliveryAddress) {
    const linea1 = `${a.calle} ${a.numero}`;
    const linea2 = `${a.comuna}, ${a.ciudad}, ${a.region}`;
    const cp = a.codigo_postal ? ` · CP ${a.codigo_postal}` : "";
    return `${linea1} — ${linea2}${cp}`;
  }

  function validateNewAddress(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.full_name?.trim()) newErrors.full_name = "Ingresa el nombre completo.";
    if (!form.dob?.trim()) newErrors.dob = "Ingresa la fecha de nacimiento.";
    if (!form.phone_number?.trim()) newErrors.phone_number = "Ingresa un teléfono.";
    if (!form.region?.trim()) newErrors.region = "Selecciona una región.";
    if (!form.ciudad?.trim()) newErrors.ciudad = "Selecciona una ciudad (provincia).";
    if (!form.comuna?.trim()) newErrors.comuna = "Selecciona una comuna.";
    if (!form.calle?.trim()) newErrors.calle = "Ingresa la calle.";
    if (!form.numero?.trim()) newErrors.numero = "Ingresa el número.";
    if (!form.codigo_postal?.trim()) newErrors.codigo_postal = "Ingresa el código postal.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Continuar al cotizador
  async function handleContinue() {
    // Validar método
    if (!shippingMethod) {
      setErrors(prev => ({ ...prev, method: "Selecciona un método de envío." }));
      return;
    }

    localStorage.setItem("murano_shipping_method", shippingMethod);

    // Si es retiro en tienda: no requiere dirección
    if (shippingMethod === "pickup") {
      // Puedes guardar un objeto simbólico o limpiar el address
      localStorage.removeItem("murano_shipping_address");
      return router.push("/Vistas/cart/cotizarPago");
    }

    // Si es delivery: validar dirección
    if (selectedId !== NUEVA_DIRECCION_ID) {
      if (!selectedAddress) {
        setErrors(prev => ({ ...prev, selected: "Selecciona una dirección válida." }));
        return;
      }
      localStorage.setItem("murano_shipping_address", JSON.stringify(selectedAddress));
      return router.push("/Vistas/cart/cotizarPago");
    }

    // Nueva dirección
    if (!validateNewAddress()) return;

    const user_id = localStorage.getItem("UserID") || "";
    const newAddr: DeliveryAddress = {
      id: `tmp_${Date.now()}`,
      user_id,
      ...form,
    };

    localStorage.setItem("murano_shipping_address", JSON.stringify(newAddr));
    router.push("/Vistas/cart/cotizarPago");

    // 🔜 Para persistir en BD:
    // await fetch("/api/user/my-addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newAddr) });
  }

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Seleccionar método de envío</h1>
          <p className={styles.subtitle}>
            Elige si deseas <strong>Retiro en tienda</strong> o <strong>Delivery</strong>. 
            Si seleccionas Delivery, te pediremos tu dirección.
          </p>

          {/* Paso 1: Método de envío */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Método de envío</h2>
            </div>

            <div className={styles.methodGrid}>
              <label
                className={`${styles.methodCard} ${shippingMethod === "pickup" ? styles.methodSelected : ""}`}
                onClick={() => {
                  setShippingMethod("pickup");
                  setErrors(prev => { const { method, ...rest } = prev; return rest; });
                }}
              >
                <div className={styles.methodIcon}>🏬</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodHeading}>Retiro en tienda</div>
                  <div className={styles.methodDesc}>
                    Retira tu pedido en el punto de entrega de Murano. No necesitas dirección.
                  </div>
                </div>
                <input
                  type="radio"
                  name="shippingMethod"
                  className={styles.methodRadio}
                  checked={shippingMethod === "pickup"}
                  onChange={() => {}}
                />
              </label>

              <label
                className={`${styles.methodCard} ${shippingMethod === "delivery" ? styles.methodSelected : ""}`}
                onClick={() => {
                  setShippingMethod("delivery");
                  setErrors(prev => { const { method, ...rest } = prev; return rest; });
                }}
              >
                <div className={styles.methodIcon}>🚚</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodHeading}>Delivery</div>
                  <div className={styles.methodDesc}>
                    Enviamos a tu dirección con Chilexpress. Selecciona o crea una dirección.
                  </div>
                </div>
                <input
                  type="radio"
                  name="shippingMethod"
                  className={styles.methodRadio}
                  checked={shippingMethod === "delivery"}
                  onChange={() => {}}
                />
              </label>
            </div>

            {errors.method && <p className={styles.error}>{errors.method}</p>}
          </section>


          {/* Paso 2: Direcciones (solo si delivery) */}
          {shippingMethod === "delivery" && (
            <>
              {loading ? (
                <div className={styles.skeleton}>Cargando direcciones…</div>
              ) : (
                <>
                  <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2>Mis direcciones</h2>
                    </div>

                    <ul className={styles.addressList}>
                      {addresses.map(a => (
                        <li key={a.id} className={styles.addressItem}>
                          <label className={styles.addressRow}>
                            <input
                              type="radio"
                              name="selectedAddress"
                              className={styles.checkCircle}
                              checked={selectedId === a.id}
                              onChange={() => handleSelect(a.id)}
                            />
                            <div className={styles.addressInfo}>
                              <div className={styles.addressTop}>
                                <span className={styles.addressName}>{a.full_name}</span>
                              </div>
                              <div className={styles.addressText}>{formatAddress(a)}</div>
                              <div className={styles.addressMeta}>
                                <span>{a.phone_number}</span>
                                {a.descripcion ? <span> · {a.descripcion}</span> : null}
                              </div>
                            </div>
                          </label>
                        </li>
                      ))}

                      {/* Opción: Nueva dirección */}
                      <li className={styles.addressItem}>
                        <label className={styles.addressRow}>
                          <input
                            type="radio"
                            name="selectedAddress"
                            className={styles.checkCircle}
                            checked={selectedId === NUEVA_DIRECCION_ID}
                            onChange={() => handleSelect(NUEVA_DIRECCION_ID)}
                          />
                          <div className={styles.addressInfo}>
                            <div className={styles.addressTop}>
                              <span className={styles.addressName}>Añadir nueva dirección</span>
                              <span className={styles.badge}>Nueva</span>
                            </div>
                            <div className={styles.addressText}>
                              Ingresa los datos y la usaremos para esta compra.
                            </div>
                          </div>
                        </label>
                      </li>
                    </ul>

                    {errors.selected && <p className={styles.error}>{errors.selected}</p>}
                  </section>

                  {/* Formulario visible SOLO si se selecciona “Nueva dirección” */}
                  {selectedId === NUEVA_DIRECCION_ID && (
                    <section className={styles.section}>
                      <h2>Nueva dirección</h2>

                      <div className={styles.form}>
                        <div className={styles.grid2}>
                          <div className={styles.field}>
                            <label>Nombre completo *</label>
                            <input
                              name="full_name"
                              value={form.full_name}
                              onChange={handleChange}
                              placeholder="Ej: John Doe"
                            />
                            {errors.full_name && <span className={styles.error}>{errors.full_name}</span>}
                          </div>

                          <div className={styles.field}>
                            <label>Fecha de nacimiento *</label>
                            <input
                              type="date"
                              name="dob"
                              value={form.dob}
                              onChange={handleChange}
                            />
                            {errors.dob && <span className={styles.error}>{errors.dob}</span>}
                          </div>
                        </div>

                        <div className={styles.field}>
                          <label>Teléfono *</label>
                          <input
                            name="phone_number"
                            value={form.phone_number}
                            onChange={handleChange}
                            placeholder="+569..."
                          />
                          {errors.phone_number && <span className={styles.error}>{errors.phone_number}</span>}
                        </div>

                        <div className={styles.grid3}>
                          <div className={styles.field}>
                            <label>Región *</label>
                            <select name="region" value={form.region} onChange={handleChange}>
                              <option value="">Selecciona una región</option>
                              {Object.keys(direcciones).map(region => (
                                <option key={region} value={region}>{region}</option>
                              ))}
                            </select>
                            {errors.region && <span className={styles.error}>{errors.region}</span>}
                          </div>

                          <div className={styles.field}>
                            <label>Ciudad / Provincia *</label>
                            <select
                              name="ciudad"
                              value={form.ciudad}
                              onChange={handleChange}
                              disabled={!form.region}
                            >
                              <option value="">Selecciona una ciudad</option>
                              {ciudades.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            {errors.ciudad && <span className={styles.error}>{errors.ciudad}</span>}
                          </div>

                          <div className={styles.field}>
                            <label>Comuna *</label>
                            <select
                              name="comuna"
                              value={form.comuna}
                              onChange={handleChange}
                              disabled={!form.ciudad}
                            >
                              <option value="">Selecciona una comuna</option>
                              {comunas.map(cm => (
                                <option key={cm} value={cm}>{cm}</option>
                              ))}
                            </select>
                            {errors.comuna && <span className={styles.error}>{errors.comuna}</span>}
                          </div>
                        </div>

                        <div className={styles.grid3}>
                          <div className={styles.field}>
                            <label>Calle *</label>
                            <input
                              name="calle"
                              value={form.calle}
                              onChange={handleChange}
                              placeholder="Ej: Av. Providencia"
                            />
                            {errors.calle && <span className={styles.error}>{errors.calle}</span>}
                          </div>

                          <div className={styles.field}>
                            <label>Número *</label>
                            <input
                              name="numero"
                              value={form.numero}
                              onChange={handleChange}
                              placeholder="Ej: 900"
                            />
                            {errors.numero && <span className={styles.error}>{errors.numero}</span>}
                          </div>

                          <div className={styles.field}>
                            <label>Código Postal *</label>
                            <input
                              name="codigo_postal"
                              value={form.codigo_postal}
                              onChange={handleChange}
                              placeholder="111 1111"
                            />
                            {errors.codigo_postal && <span className={styles.error}>{errors.codigo_postal}</span>}
                          </div>
                        </div>

                        <div className={styles.field}>
                          <label>Descripción (opcional)</label>
                          <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Ej: Dejar en conserjería"
                            rows={2}
                          />
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => router.back()}
            >
              Volver
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleContinue}
            >
              {shippingMethod === "pickup" ? "Confirmar y continuar" : "Usar esta opción y continuar"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

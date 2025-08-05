"use client";

import React, { useState } from "react";
import styles from "./Register.module.css";
import Image from "next/image";

// Importar componentes por paso
import FirstStep from "./RegisterComponents/FirstStep";
import SecondStep from "./RegisterComponents/SecondStep";
import ThirdStep from "./RegisterComponents/ThirdStep";
import FourthStep from "./RegisterComponents/FourthStep";

const RegisterForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dob: "",
    phone_number: "",
    region: "",
    ciudad: "",
    comuna: "",
    calle: "",
    numero: "",
    descripcion: "",
    codigo_postal: "",
    verificationCode: "",
  });

  return (
    <div className={styles.registerContainer}>
      <div className={styles.backgroundWrapper}>
        <Image
          src="/images/UI/Foto2.png"
          alt="Fondo Registro"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.overlay}></div>

      <div className={styles.registerBox}>
        <h2>Crear Cuenta</h2>

        {step === 1 && (
          <FirstStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <SecondStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <ThirdStep
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <FourthStep
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterForm;

// src/lib/email-template/emailVerification.tsx

import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img
} from "@react-email/components";

interface EmailVerificationTemplateProps {
  code: string;
  userName?: string; // ➕ Parámetro opcional
}

export function EmailVerificationTemplate({ code, userName }: EmailVerificationTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu código de verificación - Club Deportivo Murano</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://qyybopfmhahloccijdgo.supabase.co/storage/v1/object/public/sponsors/Activos/Logo/LogoMurano.png"
            alt="Logo Club Deportivo Murano"
            width={100}
            height={100}
            style={logo}
          />

          <Heading style={heading}>Verificación de Cuenta</Heading>

          {/* 👋 Saludo personalizado */}
          {userName && <Text style={text}>Hola <strong>{userName}</strong>,</Text>}

          <Text style={text}>
            Gracias por registrarte en la plataforma del <strong>Club Deportivo Murano</strong>.
          </Text>

          <Text style={text}>Tu código de verificación es:</Text>

          <Section style={codeContainer}>
            <Text style={code}>{code}</Text>
          </Section>

          <Text style={text}>
            Este código expirará en <strong>10 minutos</strong>. Si no solicitaste este registro, ignora este correo.
          </Text>

          <Section style={buttonContainer}>
            <a href="http://localhost:3000/" style={button}>
              Ir a la Tienda Murano
            </a>
          </Section>

          <Hr />
          <Text style={footer}>
            © {new Date().getFullYear()} Club Deportivo Murano. Todos los derechos reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// 🎨 Estilos
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "500px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const logo = {
  display: "block",
  margin: "0 auto 20px auto",
  borderRadius: "50%",
  transform: "scale(1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  },
};

const logoHover = {
    transform: "scale(1.1)",
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer"
}

const heading = {
  color: "#0070f3",
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
};

const codeContainer = {
  backgroundColor: "#f0f4ff",
  padding: "20px",
  textAlign: "center" as const,
  borderRadius: "6px",
  margin: "20px 0",
};

const code = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#0070f3",
  letterSpacing: "2px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  display: "inline-block",
  backgroundColor: "#0070f3",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold",
  transition: "all 0.3s ease-in-out",
};

const footer = {
  fontSize: "12px",
  color: "#888",
  marginTop: "30px",
  textAlign: "center" as const,
};

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // 🔹 Importar el contexto del carrito

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Deportiva Murano",
  description: "Tienda oficial del club Murano",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <title>Tienda Deportiva Murano</title>
        <link rel="icon" href="/images/UI/LogoMurano.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider> {/* 🔹 Contexto del carrito envuelve toda la app */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

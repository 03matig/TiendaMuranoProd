// src/lib/verifyToken.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "murano_super_secreto";

export function verifyToken(authorizationHeader?: string) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Token no proporcionado");
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}

// middleware.ts (en la raíz del proyecto)
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/", "/Vistas/login", "/Vistas/catalog"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("murano_token")?.value || request.headers.get("authorization")?.split(" ")[1];

  const isPublic = PUBLIC_ROUTES.includes(request.nextUrl.pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/Vistas/login", request.url));
  }

  // 🔐 Si no hay token, redirige (por seguridad, doble validación)
  if (!token) {
    return NextResponse.redirect(new URL("/Vistas/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || "murano_super_secreto");
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/Vistas/login", request.url));
  }
}

export const config = {
  matcher: ["/Vistas/dashboard/:path*"],
};

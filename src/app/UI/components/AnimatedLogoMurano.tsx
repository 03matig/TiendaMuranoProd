"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LOGO_SRC = "/images/UI/LogoMurano.png";

type Phase = "idle" | "loading" | "big" | "moving" | "attached";

export default function AnimatedLogoMurano({
  finalSize = 80,
  loaderDuration = 500,
  pauseCenteredMs = 1100,
  transitionMs = 900,
  onMoveStart, // 👈 nuevo: avisar al COMENZAR el desplazamiento
  onFinish,    // opcional: avisar al terminar
}: {
  finalSize?: number;
  loaderDuration?: number;
  pauseCenteredMs?: number;
  transitionMs?: number;
  onMoveStart?: () => void;
  onFinish?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const containerRef = useRef<HTMLDivElement | null>(null); // destino en el header
  const overlayRef = useRef<HTMLDivElement | null>(null);   // wrapper del overlay
  const imgRef = useRef<HTMLImageElement | null>(null);     // imagen grande en overlay

  // 🔒 Guards para que la animación NO se dispare 2 veces (StrictMode / re-mount)
  const moveScheduledRef = useRef(false);
  const moveNotifiedRef = useRef(false);

  // Decidir si animar según ruta
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname === "/") {
      setPhase("loading");
    } else {
      setPhase("attached");  // fuera de home: logo directo y estático
      // Para que el resto del contenido aparezca de inmediato si lo esperas:
      if (!moveNotifiedRef.current) {
        onMoveStart?.();
        moveNotifiedRef.current = true;
      }
      onFinish?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Mantener --headerBottom para que el overlay no tape el Header
  useEffect(() => {
    if (phase === "idle") return;
    const headerEl = document.querySelector("header") as HTMLElement | null;

    const setHeaderBottom = () => {
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 0;
      document.documentElement.style.setProperty("--headerBottom", `${headerBottom}px`);
    };

    setHeaderBottom();
    window.addEventListener("resize", setHeaderBottom);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerEl) {
      ro = new ResizeObserver(setHeaderBottom);
      ro.observe(headerEl);
    }

    return () => {
      window.removeEventListener("resize", setHeaderBottom);
      if (ro && headerEl) ro.unobserve(headerEl);
    };
  }, [phase]);

  // Loader → Big
  useEffect(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => setPhase("big"), loaderDuration);
    return () => clearTimeout(t);
  }, [phase, loaderDuration]);

  // Big → Moving (calcular trayecto y DISPARAR el comienzo del movimiento)
  useEffect(() => {
    if (phase !== "big") return;
    if (moveScheduledRef.current) return; // 🔒 evitar doble programación
    moveScheduledRef.current = true;

    const t = setTimeout(() => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const img = imgRef.current;
      if (!container || !overlay || !img) {
        setPhase("attached");
        if (!moveNotifiedRef.current) {
          onMoveStart?.();
          moveNotifiedRef.current = true;
        }
        onFinish?.();
        return;
      }

      // Rects y centros
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      const currentCenter = {
        x: imgRect.left + imgRect.width / 2,
        y: imgRect.top + imgRect.height / 2,
      };
      const targetCenter = {
        x: containerRect.left + containerRect.width / 2,
        y: containerRect.top + containerRect.height / 2,
      };

      // Escala desde el tamaño actual (img grande) al tamaño final del contenedor
      const scale = (containerRect.width || finalSize) / imgRect.width;

      // Variables CSS para la animación
      overlay.style.setProperty("--tx", `${targetCenter.x - currentCenter.x}px`);
      overlay.style.setProperty("--ty", `${targetCenter.y - currentCenter.y}px`);
      overlay.style.setProperty("--scale", `${scale}`);
      overlay.style.setProperty("--dur", `${transitionMs}ms`);

      // 🚀 IMPORTANTE: avisar justo ANTES de empezar a moverse
      // y cambiar a fase "moving" (solo una vez)
      requestAnimationFrame(() => {
        if (!moveNotifiedRef.current) {
          onMoveStart?.();
          moveNotifiedRef.current = true;
        }
        setPhase("moving");
      });

      // Al terminar, quedamos estáticos en el header
      const done = setTimeout(() => {
        setPhase("attached");
        onFinish?.();
      }, transitionMs + 40);

      return () => clearTimeout(done);
    }, pauseCenteredMs);

    return () => clearTimeout(t);
  }, [phase, pauseCenteredMs, transitionMs, finalSize, onMoveStart, onFinish]);

  return (
    <>
      {/* DESTINO: contenedor en el header con tamaño final */}
      <div
        ref={containerRef}
        style={{
          width: finalSize,
          height: finalSize,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {phase === "attached" && (
          <img
            src={LOGO_SRC}
            alt="Logo Murano"
            style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        )}
      </div>

      {/* OVERLAY solo en home y durante la secuencia */}
      {pathname === "/" && (phase === "loading" || phase === "big" || phase === "moving") && (
        <>
          {/* Fondo blanco con loader (Header visible arriba) */}
          {phase === "loading" && (
            <div
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                top: "var(--headerBottom, 0px)",
                height: "calc(100vh - var(--headerBottom, 0px))",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1100,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: "4px solid #111",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "am-spin 0.9s linear infinite",
                }}
              />
            </div>
          )}

          {/* Imagen grande centrada → animación hacia el contenedor */}
          {(phase === "big" || phase === "moving") && (
            <div
              ref={overlayRef}
              style={{
                position: "fixed",
                top: "calc(50% + var(--headerBottom, 0px) / 2)",
                left: "50%",
                transform: `translate(-50%, -50%)`,
                zIndex: 1200,
                transition: phase === "moving" ? `transform var(--dur) ease-in-out` : "none",
                transformOrigin: "center center",
                willChange: "transform",
                ...(phase === "moving"
                  ? {
                      transform: `translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--scale))`,
                    }
                  : {}),
              }}
            >
              <img
                ref={imgRef}
                src={LOGO_SRC}
                alt="Murano Logo"
                style={{
                  width: 360,
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 6px 24px rgba(0,0,0,.28))",
                  borderRadius: 16,
                }}
              />
            </div>
          )}

          <style>{`@keyframes am-spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

const LOGO_SRC = "/images/UI/LogoMurano.png";

export default function AnimatedLogoMurano({
  onArrive,
  loaderDuration = 500,    // tiempo del loader
  pauseCenteredMs = 1100,  // tiempo en grande centrado
  transitionMs = 900,      // duración del movimiento
}: {
  onArrive: () => void;
  loaderDuration?: number;
  pauseCenteredMs?: number;
  transitionMs?: number;
}) {
  const [phase, setPhase] = useState<"loading" | "big" | "moving" | "done">("loading");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // 1) Loader → 2) Logo grande
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("big"), loaderDuration);
    return () => clearTimeout(t1);
  }, [loaderDuration]);

  // 2) Logo grande (pausa) → 3) Mover a anchor
  useEffect(() => {
    if (phase !== "big") return;
    const t2 = setTimeout(() => {
      const anchor = document.getElementById("murano-navbar-logo-anchor");
      const img = logoRef.current;
      const wrap = wrapperRef.current;
      if (!anchor || !img || !wrap) {
        setPhase("done");
        onArrive();
        return;
      }

      const headerEl = document.querySelector("header") as HTMLElement | null;
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 0;

      const anchorRect = anchor.getBoundingClientRect();
      const targetWidth = anchorRect.width || 80;
      const imgRect = img.getBoundingClientRect();

      const currentCenter = { x: imgRect.left + imgRect.width / 2, y: imgRect.top + imgRect.height / 2 };
      const targetCenter = { x: anchorRect.left + anchorRect.width / 2, y: anchorRect.top + anchorRect.height / 2 };

      const scale = targetWidth > 0 ? targetWidth / imgRect.width : 0.33;

      wrap.style.setProperty("--tx", `${targetCenter.x - currentCenter.x}px`);
      wrap.style.setProperty("--ty", `${targetCenter.y - currentCenter.y + 20}px`);
      wrap.style.setProperty("--scale", `${scale}`);
      wrap.style.setProperty("--dur", `${transitionMs}ms`);
      wrap.style.setProperty("--headerBottom", `${headerBottom}px`);

      requestAnimationFrame(() => setPhase("moving"));

      const doneTimer = setTimeout(() => {
        setPhase("done");
        onArrive();
      }, transitionMs + 40);

      return () => clearTimeout(doneTimer);
    }, pauseCenteredMs);

    return () => clearTimeout(t2);
  }, [phase, pauseCenteredMs, transitionMs, onArrive]);

  if (phase === "done") return null;

  return (
    <>
      {/* Loader con fondo blanco */}
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

      {/* Logo grande centrado → animación */}
      {(phase === "big" || phase === "moving") && (
        <div
          ref={wrapperRef}
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
            ref={logoRef}
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
  );
}

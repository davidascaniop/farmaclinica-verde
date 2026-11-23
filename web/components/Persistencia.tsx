"use client";
import { useEffect } from "react";
import { obtenerEstado, restaurar, suscribir } from "@shared";

const CLAVE = "fcv-prototipo-v1";

// Guarda el estado en el navegador para que la demo sobreviva a una recarga
// y el panel interno vea los mismos pedidos en otra pestaña.
export default function Persistencia() {
  useEffect(() => {
    const leer = () => {
      try {
        const texto = localStorage.getItem(CLAVE);
        if (texto) restaurar(JSON.parse(texto));
      } catch {}
    };
    leer();
    let ultimo = "";
    const guardar = () => {
      try {
        ultimo = JSON.stringify(obtenerEstado());
        localStorage.setItem(CLAVE, ultimo);
      } catch {}
    };
    const cancelar = suscribir(guardar);
    const otraPestana = (e: StorageEvent) => {
      if (e.key === CLAVE && e.newValue && e.newValue !== ultimo) {
        ultimo = e.newValue;
        try {
          restaurar(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", otraPestana);
    return () => {
      cancelar();
      window.removeEventListener("storage", otraPestana);
    };
  }, []);
  return null;
}

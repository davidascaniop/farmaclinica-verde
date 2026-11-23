"use client";
import { useSyncExternalStore } from "react";
import { obtenerEstado, obtenerEstadoServidor, suscribir, type Estado } from "@shared";

// Estado compartido de la tienda (definido en /shared).
export function useTienda(): Estado {
  return useSyncExternalStore(suscribir, obtenerEstado, obtenerEstadoServidor);
}

// Reduce la foto del recipe para poder guardarla en el navegador.
export function reducirImagen(archivo: File, lado = 900): Promise<string> {
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, lado / Math.max(img.width, img.height));
      const lienzo = document.createElement("canvas");
      lienzo.width = Math.round(img.width * escala);
      lienzo.height = Math.round(img.height * escala);
      lienzo.getContext("2d")?.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(url);
      resolver(lienzo.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rechazar(new Error("No pudimos leer la imagen."));
    };
    img.src = url;
  });
}

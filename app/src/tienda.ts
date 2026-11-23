import { useSyncExternalStore } from 'react';
import { obtenerEstado, suscribir, type Estado } from './compartido';

export function useTienda(): Estado {
  return useSyncExternalStore(suscribir, obtenerEstado);
}

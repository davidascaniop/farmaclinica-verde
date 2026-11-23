import { TASA_BCV } from './tasa-bcv';

function miles(entero: string, sep: string): string {
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

function redondear(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function aBs(usd: number, tasa: number = TASA_BCV): number {
  return redondear(usd * tasa);
}

export function formatoUsd(usd: number): string {
  const [e, d] = redondear(usd).toFixed(2).split('.');
  return `$${miles(e, ',')}.${d}`;
}

export function formatoBs(usd: number, tasa: number = TASA_BCV): string {
  const [e, d] = aBs(usd, tasa).toFixed(2).split('.');
  return `Bs. ${miles(e, '.')},${d}`;
}

export function formatoTasa(tasa: number = TASA_BCV): string {
  const [e, d] = tasa.toFixed(2).split('.');
  return `Bs. ${miles(e, '.')},${d}`;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Fecha corta en hora de Venezuela (UTC-4), sin depender de Intl.
export function formatoFecha(iso: string, conHora = false): string {
  const d = new Date(new Date(iso).getTime() - 4 * 3600 * 1000);
  const base = `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  if (!conHora) return base;
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${base}, ${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

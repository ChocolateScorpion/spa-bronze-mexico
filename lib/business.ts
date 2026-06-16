import businessConfig from "@/config/business.json";
import type { BusinessConfig } from "./types";

export const business = businessConfig as BusinessConfig;

export function cap(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function pluralize(word: string): string {
  return /[aeiouáéíóú]$/i.test(word) ? `${word}s` : `${word}es`;
}

export const vocab = {
  empleado: business.vocabulario.empleado ?? "empleado",
  servicio: business.vocabulario.servicio ?? "servicio",
  cliente: business.vocabulario.cliente ?? "cliente",
};

type ModuloInfo = {
  key: string;
  href: string;
  label: string;
};

const MODULO_INFO: Record<string, Omit<ModuloInfo, "key">> = {
  dashboard: { href: "/dashboard", label: "Dashboard" },
  agenda: { href: "/agenda", label: "Agenda" },
  cobros: { href: "/cobros", label: "Cobros" },
  clientes: { href: "/clientes", label: cap(pluralize(vocab.cliente)) },
  reportes: { href: "/reportes", label: "Reportes" },
};

/** Módulos activos según config/business.json, en el orden definido ahí. */
export const activeModules: ModuloInfo[] = business.modulos
  .filter((key) => key in MODULO_INFO)
  .map((key) => ({ key, ...MODULO_INFO[key] }));

import seed from "@/data/seed.json";
import type { SeedData } from "./types";

const data = seed as SeedData;

export function getClientas() {
  return data.clientas;
}

export function getCitasHoy() {
  return data.citasHoy;
}

export function getCobros() {
  return data.cobros;
}

export function getTerapeutas() {
  return data.terapeutas;
}

export function getProductos() {
  return data.productos;
}

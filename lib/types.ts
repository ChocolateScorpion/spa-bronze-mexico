export type BusinessConfig = {
  nombre: string;
  giro: string;
  colores: {
    primario: string;
    secundario: string;
  };
  modulos: string[];
  vocabulario: Record<string, string>;
};

export type Clienta = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  ultimaVisita: string;
  tratamientoFrecuente: string;
};

export type EstadoCita = "confirmada" | "pendiente" | "completada" | "cancelada";

export type CitaHoy = {
  id: string;
  hora: string;
  clienta: string;
  tratamiento: string;
  terapeuta: string;
  duracionMin: number;
  estado: EstadoCita;
};

export type MetodoPago = "efectivo" | "tarjeta" | "transferencia";

export type Confianza = "alta" | "media" | "baja";

/** Resultado de analizar un comprobante de pago con OCR (Gemini). */
export type ExtractedCobro = {
  monto: number | null;
  metodoPago: MetodoPago | null;
  concepto: string | null;
  confianza: Confianza;
};

export type Cobro = {
  id: string;
  fecha: string;
  clienta: string;
  tratamiento: string;
  monto: number;
  metodoPago: MetodoPago;
  terapeuta: string;
};

export type Terapeuta = {
  id: string;
  nombre: string;
  especialidad: string;
};

export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
};

export type SeedData = {
  clientas: Clienta[];
  citasHoy: CitaHoy[];
  cobros: Cobro[];
  terapeutas: Terapeuta[];
  productos: Producto[];
};

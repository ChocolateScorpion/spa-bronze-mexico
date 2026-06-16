import { GoogleGenerativeAI } from "@google/generative-ai";
import { business, vocab } from "./business";
import type { ExtractedCobro } from "./types";

// Modelos en orden de preferencia. Si el primero agota su cuota (429),
// se intenta el siguiente — cuotas independientes entre sí.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"] as const;

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests");
}

function buildPrompt(): string {
  return `Eres un asistente que extrae información de comprobantes de pago para un negocio de tipo "${business.giro}".

Analiza esta imagen de comprobante de pago (transferencia, terminal o ticket) y extrae:
1. El monto cobrado en pesos mexicanos MXN
2. El método de pago
3. El concepto o ${vocab.servicio} relacionado, si aparece

REGLAS:
- El monto debe ser SOLO el número, sin símbolo de moneda ni comas (ej: 850)
- Si no puedes determinar el monto, usa null
- Si no hay un concepto visible, usa null

Responde ÚNICAMENTE en este formato JSON exacto, sin texto adicional:
{
  "monto": 850,
  "metodoPago": "tarjeta",
  "concepto": "texto relevante encontrado",
  "confianza": "alta"
}

Valores para "metodoPago": "efectivo", "tarjeta", "transferencia", o null si no se distingue.
Valores para "confianza": "alta" (monto claramente visible), "media" (inferido), "baja" (imagen poco clara).`;
}

function fallbackResult(rawText: string): ExtractedCobro {
  return { monto: null, metodoPago: null, concepto: rawText.slice(0, 200) || null, confianza: "baja" };
}

/** Envía una imagen de comprobante a Gemini y devuelve los datos extraídos. */
export async function extractCobroFromImage(base64: string, mimeType: string): Promise<ExtractedCobro> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt();

  let lastErr: unknown;
  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const modelName = GEMINI_MODELS[i];
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        { inlineData: { mimeType, data: base64 } },
      ]);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallbackResult(text);

      try {
        return JSON.parse(jsonMatch[0]) as ExtractedCobro;
      } catch {
        return fallbackResult(jsonMatch[0]);
      }
    } catch (err) {
      lastErr = err;
      const hasNextModel = i < GEMINI_MODELS.length - 1;
      if (isQuotaError(err) && hasNextModel) {
        console.warn(`[OCR] ${modelName} sin cuota, probando ${GEMINI_MODELS[i + 1]}…`);
        continue;
      }
      throw err;
    }
  }

  throw lastErr ?? new Error("Todos los modelos Gemini fallaron");
}

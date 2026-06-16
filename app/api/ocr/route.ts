import { NextRequest, NextResponse } from "next/server";
import { extractCobroFromImage } from "@/lib/ocr";

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Sube una imagen del comprobante" }, { status: 400 });
    }
    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato no soportado. Usa JPG, PNG o WebP" }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "La imagen es muy grande (máx. 5MB)" }, { status: 400 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const data = await extractCobroFromImage(base64, file.type);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error && error.message === "GEMINI_API_KEY_MISSING") {
      return NextResponse.json(
        { error: "El OCR no está configurado. Define GEMINI_API_KEY en tu archivo .env.local." },
        { status: 503 }
      );
    }
    console.error("[OCR] Error:", error);
    return NextResponse.json({ error: "No se pudo procesar la imagen. Intenta de nuevo." }, { status: 500 });
  }
}

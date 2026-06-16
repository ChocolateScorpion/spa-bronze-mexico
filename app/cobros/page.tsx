import { getCobros } from "@/lib/data";
import CobrosClient from "./cobros-client";

export default function CobrosPage() {
  return <CobrosClient initialCobros={getCobros()} />;
}

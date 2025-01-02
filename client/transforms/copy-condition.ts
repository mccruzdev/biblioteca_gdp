export function transformCondition(condition: string): string {
  const conditions: Record<string, string> = {
    NEW: "Nuevo",
    GOOD: "Bueno",
    FAIR: "Regular",
    DAMAGED: "Dañado",
    BAD: "Malo",
  };
  return conditions[condition] || "Desconocido";
}

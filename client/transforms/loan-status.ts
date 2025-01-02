export function transformLoanStatus(status: string): string {
  const record: Record<string, string> = {
    ACTIVE: "Activo",
    RETURNED: "Devuelto",
    OVERDUE: "Vencido",
    CANCELLED: "Cancelado",
  };
  return record[status] || "Desconocido";
}

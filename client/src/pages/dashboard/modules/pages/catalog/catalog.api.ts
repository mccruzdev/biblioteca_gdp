import { Copy } from "@/types";
import { BACKEND_SERVER } from "../../../../../config/api";
export interface CreateReservationDTO {
  dueDate: string;
  status: string;
  copies: number[];
}

export const catalogApi = {
  getCopies: async (bookId: number, token: string): Promise<Copy[]> => {
    const response = await fetch(`${BACKEND_SERVER}/copy/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch copies");
    }
    const data = await response.json();
    return data.data;
  },

  createReservation: async (data: CreateReservationDTO, token: string) => {
    const response = await fetch(`${BACKEND_SERVER}/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create reservation");
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : null;
  },
};

import { BACKEND_SERVER } from "../../../../../config/api";
import { ReservationStatus } from "@/types";

export type Copy = {
    id: number;
    code: string | null;
    condition: string;
};

export interface CreateLoanDTO {
    dueDate: string;
    status: string;
    copies: number[];
}

export interface UpdateReservationDTO {
    dueDate: string;
    status: ReservationStatus;
    copies: number[];
}

export const loanApi = {
    getCopies: async (bookId: number, token: string): Promise<Copy[]> => {
        const response = await fetch(`${BACKEND_SERVER}/copy/${bookId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch copies');
        }
        const data = await response.json();
        return data.data;
    },

    createLoan: async (data: CreateLoanDTO, token: string) => {
        const response = await fetch(`${BACKEND_SERVER}/loan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create loan');
        }

        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : null;
    },

    updateReservation: async (id: number, data: UpdateReservationDTO, token: string) => {
        const response = await fetch(`${BACKEND_SERVER}/reservation/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update reservation');
        }

        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : null;
    }
};

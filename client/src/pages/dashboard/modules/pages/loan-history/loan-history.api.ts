import { BACKEND_SERVER } from "../../../../../config/api";

export type Copy = {
    id: number;
    code: string | null;
    condition: string;
};

/*export interface CreateLoanDTO {
    dueDate: string;
    status: string;
    copies: number[];
}*/

export const loanHistoryApi = {
    getCopies: async (bookId: number, token: string): Promise<Copy[]> => {
        const response = await fetch(`${BACKEND_SERVER}/copy/${bookId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch copies');
        }
        const data = await response.json();
        return data.data;
    }
};

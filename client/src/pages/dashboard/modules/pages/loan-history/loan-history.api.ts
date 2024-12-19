import { BACKEND_SERVER } from "../../../../../config/api";
import { LoanStatus } from "@/types";

export interface UpdateLoanDTO {
    dueDate: string;
    status: LoanStatus;
    copies: number[];
}

export const loanHistoryApi = {
    updateLoan: async (id: number, data: UpdateLoanDTO, token: string) => {
        const response = await fetch(`${BACKEND_SERVER}/loan/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update loan');
        }

        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : null;
    }
};

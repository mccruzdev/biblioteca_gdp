import { BACKEND_SERVER } from "../../../../../config/api";
import { DonationDTO } from "./edit/donation-edit-modal";

export const donationsApi = {
    createDonation: async (data: DonationDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donation`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al crear la donación');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en createDonation:', error);
            throw error;
        }
    },

    updateDonation: async (id: number, data: DonationDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donation/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al actualizar la donación');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en updateDonation:', error);
            throw error;
        }
    },

    deleteDonation: async (id: number, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donation/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseText = await response.text();

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al eliminar la donación');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en deleteDonation:', error);
            throw error;
        }
    },

};
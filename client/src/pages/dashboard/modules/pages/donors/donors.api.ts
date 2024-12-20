import { BACKEND_SERVER } from "../../../../../config/api";

export interface donorDTO {
    name: string;
    email: string;
}

export const donorsApi = {
    createDonor: async (data: donorDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donor`, {
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
                throw new Error(errorData.message || 'Error al crear el donador');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en createDonor:', error);
            throw error;
        }
    },

    updateDonor: async (id: number, data: donorDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donor/${id}`, {
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
                throw new Error(errorData.message || 'Error al actualizar a el donador');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en updateDonor:', error);
            throw error;
        }
    },

    deleteDonor: async (id: number, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/donor/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseText = await response.text();

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al eliminar a el donador');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en deleteDonor:', error);
            throw error;
        }
    },

};
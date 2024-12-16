import { BACKEND_SERVER } from "../../../../../config/api";

export interface bookDTO {
    title: string;
    pages: number;
    authors: { name: string }[];
    category: string;
    subcategory: string;
}

export const booksApi = {
    createBook: async (data: bookDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/book`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText); // Debug

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al crear el libro');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en createBook:', error);
            throw error;
        }
    }
};

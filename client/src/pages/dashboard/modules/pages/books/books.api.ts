import { BACKEND_SERVER } from "../../../../../config/api";

export interface bookDTO {
    title: string;
    pages: number;
    authors: {name: string}[];
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
    },

    deleteBook: async (bookId: string, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/book/${bookId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el libro');
            }

            return true;
        } catch (error) {
            console.error('Error en deleteBook:', error);
            throw error;
        }
    }
};

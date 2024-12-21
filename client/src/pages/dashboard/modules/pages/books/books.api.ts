import { BACKEND_SERVER } from "../../../../../config/api";

export interface bookDTO {
    title: string;
    pages: number;
    authors: { name: string }[];
    category: string;
    subcategory: string;
}

export enum BookCondition {
    NEW = "NEW",
    GOOD = "GOOD",
    FAIR = "FAIR",
    DAMAGED = "DAMAGED",
    BAD = "BAD"
}

export interface CopyDto {
    code: string;
    condition: BookCondition;
    location: {
        shelf: string;
        shelfColor: string;
        shelfLevel: string;
    };
    publisher: {
        name: string;
        email: string;
        country: string;
        address: string;
        phoneNumber: string;
        website: string;
    };
    bookId: number;
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

    updateBook: async (id: number, data: bookDTO, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/book/${id}`, {
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
                throw new Error(errorData.message || 'Error al actualizar el libro');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en updateBook:', error);
            throw error;
        }
    },

    deleteBook: async (id: number, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/book/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseText = await response.text();

            if (!response.ok) {
                const errorData = responseText ? JSON.parse(responseText) : { message: 'Error desconocido' };
                throw new Error(errorData.message || 'Error al eliminar el libro');
            }

            return responseText ? JSON.parse(responseText) : null;
        } catch (error) {
            console.error('Error en deleteBook:', error);
            throw error;
        }
    },

    createCopy: async (data: CopyDto, token: string) => {
        try {
            const response = await fetch(`${BACKEND_SERVER}/copy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al crear la copia');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            } else {
                // If the response is not JSON, we'll return a simple object indicating success
                return { success: true, message: 'Copia creada exitosamente' };
            }
        } catch (error) {
            console.error('Error creating copy:', error);
            throw error;
        }
    },
};


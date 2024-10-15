import { toast } from "sonner";

interface FloatingTabProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    message: React.ReactNode; // Cambiado a React.ReactNode
}

const FloatingTab: React.FC<FloatingTabProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const handleConfirm = async () => {
        try {
            await onConfirm();
            toast.success('Éxito');
            onClose();
        } catch (error) {
            toast.error("No éxito");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="mb-4 whitespace-pre-line">{message}</p>
                <div className="flex justify-between">
                    <button
                        className="bg-gray-300 text-black font-bold py-1 px-4 rounded-3xl"
                        onClick={onClose}
                    >
                        Volver
                    </button>
                    <button
                        className="bg-yellow-500 text-black font-bold py-1 px-4 rounded-3xl hover:bg-yellow-600 transition duration-300"
                        onClick={handleConfirm}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloatingTab;

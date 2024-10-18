import "../login/style.sass";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Button from "../login/components/Button";
import { BACKEND_SERVER } from "../../../../config/api";

export default function ConfirmedEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const confirmEmail = () => {
    fetch(`${BACKEND_SERVER}/auth/confirm-email?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/");
          toast.success("¡Correo confirmado exitosamente!");
        } else {
          toast.error("Error al confirmar correo");
        }
      })
      .catch(() => {
        toast.error("Ocurrió un error en la red. Por favor, intenta de nuevo.");
      });
  };

  return (
    <div className="Container min-h-screen flex flex-col items-center justify-center">
      <div className="z-10 text-center text-white mb-8">
        <img
          src="/logo-muni.png"
          alt="Logo"
          className="mx-auto w-32 h-32 mb-[-15px]"
        />
        <p className="text-xl2 font-semibold">SGB - MDG</p>
        <h1 className="mb-[-15px] font-medium">
          SISTEMA DE GESTION DE LA BIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>

      <div className="z-10 bg-white p-6 rounded-2xl shadow-lg w-full mb-8">
        <h2 className="text-2xl font-extrabold text-center mb-4">
          Confirma tu correo
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Da click en el siguiente botón para confirmar tu correo.
        </p>
        <div className="flex justify-center">
          <Button
            isLogin={true}
            onClick={confirmEmail}
            text="Confirmar Correo"
            rounded="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

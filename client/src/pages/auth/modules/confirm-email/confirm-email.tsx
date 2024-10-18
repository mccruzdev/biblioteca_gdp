import "../login/style.sass";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "../login/components/Button";
import { BACKEND_SERVER } from "../../../../config/api";

export default function ConfirmedEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `${BACKEND_SERVER}/auth/confirm-email`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }), 
          }
        );

        if (response.ok) {
          setIsConfirmed(true); 
          toast.success("¡Correo confirmado exitosamente!");
        } else {
          toast.error("Error al confirmar el correo. Intenta de nuevo.");
        }
      } catch (error) {
        toast.error("Ocurrió un error en la red. Por favor, intenta de nuevo.");
      }
    };

    if (token) {
      confirmEmail(); 
    } else {
      toast.error("Token no válido. No se puede confirmar el correo.");
    }
  }, [token]);

  const handleGoToLogin = () => {
    navigate("/"); 
  };

  return (
    <div className="Container min-h-screen flex flex-col items-center justify-center">
      <div className="z-10 text-center text-white mb-8">
        <img src="/logo-muni.png" alt="Logo" className="mx-auto w-32 h-32 mb-[-15px]" />
        <p className="text-xl2 font-semibold">SGB - MDG</p>
        <h1 className="mb-[-15px] font-medium">
          SISTEMA DE GESTION DE LA BIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>

      <div className="z-10 bg-white p-6 rounded-2xl shadow-lg w-full mb-8">
        {isConfirmed ? (
          <>
            <h2 className="text-2xl font-extrabold text-center mb-4">
              ¡Correo Confirmado!
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Tu correo ha sido verificado exitosamente. Ahora puedes acceder a todos los recursos.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-center mb-4">
              Confirmando tu correo...
            </h2>
            <p className="text-sm text-center text-gray-600 mb-6">
              Estamos verificando tu correo. Por favor, espera un momento.
            </p>
          </>
        )}
        <div className="flex justify-center">
          <Button
            isLogin={true}
            onClick={handleGoToLogin}
            text="Ir a Iniciar Sesión"
            rounded="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

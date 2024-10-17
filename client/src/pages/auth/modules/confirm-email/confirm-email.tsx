import "../login/style.sass";
import { useNavigate } from "react-router-dom";
import Button from "../login/components/Button";

export default function ConfirmedEmail() {
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-extrabold text-center mb-4">
          ¡Correo Confirmado!
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Tu correo ha sido verificado exitosamente. Ahora puedes acceder a todos los recursos.
        </p>
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
import "../login/style.sass";
import React, { useState } from "react";
import BaseInput from "../../../components/Input";
import Button from "../login/components/Button";
import { toast } from "sonner";
import { BACKEND_SERVER } from "../../../../config/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function ConfirmChangePassword() {
  const navigate = useNavigate();
  const location = useLocation(); // Get location to access URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // Extract token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Lógica para enviar la nueva contraseña y el token al backend
      //'http://localhost:8000/auth/confirm-change-password'
      //url: `${BACKEND_SERVER}/auth/login`,
      const response = await fetch(
        `${BACKEND_SERVER}/auth/confirm-change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password: newPassword }), // Send token and new password
        }
      );

      if (response.ok) {
        toast.success("Contraseña restablecida exitosamente.");
        navigate("/"); // Redirect to login after success
      } else {
        toast.error("Error al restablecer la contraseña.");
      }
    } else {
      toast.error("Las contraseñas no coinciden.");
    }
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
        <h2 className="text-2xl font-extrabold text-center mb-6">
          Restablece tu Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <BaseInput
            handleInputChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            name="newPassword"
            label="Nueva Contraseña"
            placeholder="Ingresa tu nueva contraseña"
            type="password"
          />
          <BaseInput
            handleInputChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            name="confirmPassword"
            label="Confirmar Contraseña"
            placeholder="Confirma tu nueva contraseña"
            type="password"
          />
          <Button
            isLogin={true}
            onClick={handleSubmit}
            text="Confirmar cambio"
            rounded="rounded-full"
            className="px-3 text-base"
          />
        </form>
      </div>
    </div>
  );
}

/*
    const navigate = useNavigate();
    const handleGoToLogin = () => {
        navigate("/");
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
                    ¡Cambio de contraseña exitoso!
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                    Tu cambio de contraseña ha sido exitoso. Ahora ingresa nuevamente y podrás acceder a todos los recursos.
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
    );*/

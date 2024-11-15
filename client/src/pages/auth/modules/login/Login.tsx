import "./style.sass";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInput from "../../../components/Input";
import Button from "./components/Button";
import { BACKEND_SERVER } from "../../../../config/api";
import { fetchJSON } from "../../../../services/fetch";
import FloatingTab from "./components/FloatingTab";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showTab, setShowTab] = useState(false);
  const [showChangePasswordTab, setShowChangePasswordTab] = useState(false); // Nuevo estado para el cambio de contraseña
  const [formData, setFormData] = useState({
    dni: "",
    password: "",
    email: "",
    names: "",
    lastName: "",
    phoneNumber: "",
  });
  const [dniForChange, setDniForChange] = useState(""); // Estado para el DNI en el FloatingTab
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const { response, json } = await fetchJSON<{ token: string }>(
        `${BACKEND_SERVER}/auth/login`,
        {
          method: "POST",
          body: {
            dni: formData.dni,
            password: formData.password,
          },
        }
      );

      if (response.ok) {
        localStorage.setItem("gdp-bm", json.token);
        navigate("/dashboard");
      } else {
        toast.error("Error al iniciar sesión. Por favor, verifica tus credenciales.");
      }
    } catch (error) {
      toast.error("Ocurrió un error en la red. Por favor, intenta de nuevo.");
    }
  };

  const handleRegister = async () => {
    try {
      const { response } = await fetchJSON(
        `${BACKEND_SERVER}/auth/create-user`,
        {
          method: "POST",
          json: false,
          body: {
            dni: formData.dni,
            names: formData.names,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
          },
        }
      );

      if (response.status === 204) {
        toast.success(
          "Registro exitoso. Por favor, confirma tu correo electrónico."
        );
      } else if (response.ok || response.status === 201) {
        toast.success(
          "Registro exitoso. Por favor, confirma tu correo electrónico."
        );
      } else {
        if (response.status === 409) {
          toast.error(
            "El usuario ya existe. Por favor, intenta con otro DNI o correo electrónico."
          );
        } else {
          toast.error("Error en el registro. Por favor, intenta de nuevo.");
        }
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error("Ocurrió un error en la red. Por favor, intenta de nuevo.");
    }
  };

  const handleRequestPasswordChange = () => {
    try {
      toast.promise(
        fetch(`${BACKEND_SERVER}/auth/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dni: dniForChange }), // Enviar el DNI al backend
        }),
        {
          loading: "Enviando...",
          success:
            "Solicitud de cambio de contraseña enviada. Revisa tu correo.",
          error: "Solicitud fallida.",
        }
      );
    } catch (error) {
      console.error("Error de red:", error);
    }

    setDniForChange("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Validaciones
      // Enviar datos validados al servidor
      await handleLogin();
    } else {
      setShowTab(true);
      // Validaciones
      // Enviar datos validos al servidor
      /*await handleRegister();*/
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
        <h1 className="mb-[-15px] font-medium ">
          SISTEMA DE GESTION DE LA BIBIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>
      <div className="z-10 bg-white p-4 rounded-2xl shadow-lg w-full mb-8 ">
        <h2 className="text-2xl font-extrabold text-center">
          {isLogin ? "Ingresa Aquí" : "Empieza Aquí"}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Accede a muchos libros y recursos
        </p>
        <div className="flex w-full justify-center">
          <div className="ButtonContainer flex mb-6 rounded-full p-0 w-72">
            <Button
              isLogin={isLogin}
              onClick={() => setIsLogin(true)}
              text="Iniciar sesión"
              rounded="rounded-full"
            />
            <Button
              isLogin={!isLogin}
              onClick={() => setIsLogin(false)}
              text="Registrarse"
              rounded="rounded-full"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <BaseInput
            handleInputChange={handleInputChange}
            value={formData.dni}
            name="dni"
            label="DNI"
            placeholder="Ingresa tu número de DNI"
          />

          {!isLogin && (
            <>
              <BaseInput
                handleInputChange={handleInputChange}
                value={formData.names}
                name="names"
                label="Nombres"
                placeholder="Ingresa tus nombres"
              />
              <BaseInput
                handleInputChange={handleInputChange}
                value={formData.lastName}
                name="lastName"
                label="Apellidos"
                placeholder="Ingresa tus apellidos"
              />
              <BaseInput
                handleInputChange={handleInputChange}
                value={formData.email}
                name="email"
                label="Correo Electrónico"
                placeholder="Ingresa tu correo electrónico"
                type="email"
              />
              <BaseInput
                handleInputChange={handleInputChange}
                value={formData.phoneNumber}
                name="phoneNumber"
                label="Teléfono"
                placeholder="Ingresa tu número de telefono"
                type="tel"
                required={false}
              />
            </>
          )}
          <BaseInput
            handleInputChange={handleInputChange}
            value={formData.password}
            name="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-1 rounded-full hover:bg-yellow-600 transition duration-300"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
        {isLogin && (
          <button
            onClick={() => setShowChangePasswordTab(true)}
            className="mt-4 ml-2 text-gray-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </div>
      <FloatingTab
        isOpen={showTab}
        onClose={() => setShowTab(false)}
        onConfirm={handleRegister}
        title="Confirma tus datos"
        message={
          <>
            <div>
              <div className="-mb-3">
              ¿Estás seguro de que deseas registrarte con los siguientes datos?
              </div>
              <br />
              <strong>DNI:</strong> {formData.dni}
              <br />
              <strong>Nombres:</strong> {formData.names}
              <br />
              <strong>Apellidos:</strong> {formData.lastName}
              <br />
              <strong>Correo Electrónico:</strong> {formData.email}
              <br />
              <strong>Teléfono:</strong> {formData.phoneNumber}
            </div>
          </>
        }
      />
      <FloatingTab
        isOpen={showChangePasswordTab}
        onClose={() => setShowChangePasswordTab(false)}
        onConfirm={handleRequestPasswordChange}
        title="Cambio de Contraseña"
        message={
          <>
            <div className="-mt-1">
              <label htmlFor="dniInput">Ingresa tu DNI:</label>
              <input
                id="dniInput"
                type="text"
                value={dniForChange}
                onChange={(e) => setDniForChange(e.target.value)} // Actualiza el estado con el valor ingresado
                placeholder="DNI"
                className="border w-full rounded-lg p-1 mt-3 mb-1 text"
              />
            </div>
          </>
        }
      />
    </div>
  );
}

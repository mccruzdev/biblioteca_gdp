import "./style.sass";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseInput from "../../../components/Input";
import Button from "./components/Button";
import { BACKEND_SERVER } from "../../../../config/api";
import { fetchJSON } from "../../../../services/fetch";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    dni: "",
    names: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { response, json } = await fetchJSON<{ token: string }>({
      url: `${BACKEND_SERVER}/auth/login`,
      method: "POST",
      body: {
        dni: formData.dni,
        password: formData.password,
      },
    });

    if (response.ok) {
      localStorage.setItem("gdp-bm", json.token);
      navigate("/dashboard");
    }
    // Si algo falla:
    //    Informar del error
  };
  const handleRegister = async () => {
    // Si va todo bien:
    //    Informar sobre que debe confirmar su correo
    //    Mostrar el login
    // Si algo falla:
    //    Informar del error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Validaciones
      // Enviar datos validados al servidor
      await handleLogin();
    } else {
      // Validaciones
      // Enviar datos validos al servidor
      await handleRegister();
    }
  };

  return (
    <div className="Container min-h-screen flex flex-col items-center justify-center">
      <div className="z-10 text-center text-white mb-8">
        <img src="/logo-muni.png" alt="Logo" className="mx-auto w-40 h-40" />
        <p className="text-1xl font-medium">SGB - MDG</p>
        <h1 className="mt-2 font-medium ">
          SISTEMA DE GESTION DE LA BIBIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE
        </h1>
      </div>
      <div className="z-10 bg-white p-5 rounded-lg shadow-lg w-full mb-8">
        <h2 className="text-3xl font-extrabold text-center">
          {isLogin ? "Ingresa Aquí" : "Empieza Aquí"}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Accede a muchos libros y recursos
        </p>
        <div className="ButtonContainer flex mb-8 rounded-3xl">
          <Button
            isLogin={isLogin}
            onClick={() => setIsLogin(true)}
            text="Iniciar sesión"
            rounded="rounded-l-md"
          />
          <Button
            isLogin={!isLogin}
            onClick={() => setIsLogin(false)}
            text="Registrarse"
            rounded="rounded-r-md"
          />
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
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}

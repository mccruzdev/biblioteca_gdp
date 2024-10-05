import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempted with DNI:', formData.dni);
    } else {
      console.log('Registration attempted with data:', formData);
    }
    // For demo purposes, let's just navigate to a hypothetical dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/path-to-your-background-image.jpg')"}}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 text-center text-white mb-8">
        <img src="/path-to-your-coat-of-arms.png" alt="Logo" className="mx-auto w-24 h-24 mb-4" />
        <h1 className="text-2xl font-bold">MUNICIPALIDAD DISTRITAL DE GUADALUPE</h1>
        <h2 className="text-xl">SGB - MDG</h2>
        <p className="mt-2">SISTEMA DE GESTION DE LA BIBIBLIOTECA DE LA MUNICIPALIDAD DE GUADALUPE</p>
      </div>
      <div className="z-10 bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-6">{isLogin ? 'Ingresa Aquí' : 'Empieza Aquí'}</h2>
        <p className="text-center text-gray-600 mb-6">Accede a muchos libros y recursos</p>
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 ${isLogin ? 'bg-yellow-500 text-white font-bold' : 'bg-yellow-200'} rounded-l-md transition duration-300`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 ${!isLogin ? 'bg-yellow-500 text-white font-bold' : 'bg-yellow-200'} rounded-r-md transition duration-300`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="dni"
              placeholder="DNI"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.dni}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="apellidos"
                  placeholder="Apellidos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo Electrónico"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}
          <div className="mb-6">
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.contrasena}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
}
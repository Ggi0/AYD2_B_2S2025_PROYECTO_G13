import React from 'react';
import { FaTruck, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/registro/tipos');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Determinar qué botones mostrar según la ruta actual
  const isLoginPage = location.pathname === '/login';
  const isRegistroPage = location.pathname === '/registro/tipos';
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Header/Navbar fijo */}
      <nav className="bg-transparent backdrop-blur-sm border-b border-white/10 fixed w-full z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y nombre de la empresa */}
            <div 
              onClick={handleLogoClick} 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                <FaTruck className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">LogiTrans</h1>
                <p className="text-xs text-gray-400">Guatemala, S.A.</p>
              </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center space-x-4">
              {isHomePage && (
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaSignInAlt />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={handleRegister}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaUserPlus />
                    <span className="hidden sm:inline">Registrarse</span>
                  </button>
                </>
              )}

              {isLoginPage && (
                <>
                  <button
                    onClick={handleRegister}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaUserPlus />
                    <span className="hidden sm:inline">Registrarse</span>
                  </button>
                  <button
                    onClick={handleLogoClick}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
                  >
                    <span>← Inicio</span>
                  </button>
                </>
              )}

              {isRegistroPage && (
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
                  >
                    <FaSignInAlt />
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={handleLogoClick}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
                  >
                    <span>← Inicio</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal con padding top para el navbar fijo */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
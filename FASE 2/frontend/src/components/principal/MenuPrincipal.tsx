import React from 'react';
import { FaTruck, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

interface MenuPrincipalProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const MenuPrincipal: React.FC<MenuPrincipalProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <nav className="bg-transparent backdrop-blur-sm border-b border-white/10 fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre de la empresa */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <FaTruck className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">LogiTrans</h1>
              <p className="text-xs text-gray-400">Guatemala, S.A.</p>
            </div>
          </div>

          {/* Botones de autenticación */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              <FaSignInAlt />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
            <button
              onClick={onRegisterClick}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FaUserPlus />
              <span className="hidden sm:inline">Registrarse</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuPrincipal;
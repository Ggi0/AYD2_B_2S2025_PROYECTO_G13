import React from 'react';
import MainLayout from '../../components/principal/MainLayout';
import { useAuth } from '../../context/AuthContext';

const PanelPrivado: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Panel Privado</h1>
        <p className="text-slate-300 mb-8">Este espacio ya esta protegido por JWT.</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-3">Sesion actual</h2>
          <p className="text-slate-300">Email: {user?.email || 'N/A'}</p>
          <p className="text-slate-300">Rol: {user?.role || 'N/A'}</p>
          <p className="text-slate-300">Id: {user?.id || 'N/A'}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PanelPrivado;

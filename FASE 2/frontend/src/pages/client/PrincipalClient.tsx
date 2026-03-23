// src/pages/client/PrincipalClient.tsx
import React, { useState } from 'react';
import { FaChartLine, FaTruck, FaFileInvoiceDollar, FaCreditCard } from 'react-icons/fa';
import MainLayout from '../../components/principal/MainLayout';
import ClientHeader from '../../components/client/ClientHeader';
import ClientMenu from '../../components/client/ClientMenu';
import ClientContractCard from '../../components/client/ClientContractCard';

interface DashboardStats {
  activeContracts: number;
  pendingOrders: number;
  pendingInvoices: number;
  availableCredit: number;
}

const PrincipalClient: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    activeContracts: 1,
    pendingOrders: 3,
    pendingInvoices: 2,
    availableCredit: 45000
  });

  // Datos de ejemplo para el contrato
  const [contract] = useState({
    id: '1',
    contractNumber: 'LOG-2024-001',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    creditLimit: 100000,
    usedCredit: 55000,
    availableCredit: 45000,
    paymentTerms: 30,
    rates: {
      light: 8.00,
      heavy: 12.50,
      tractor: 18.00
    },
    status: 'active' as const
  });

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const handleViewDetails = () => {
    console.log('Ver detalles del contrato');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <ClientHeader 
          companyName="Transportes del Valle S.A."
          userName="Jens Pablo"
        />
        <ClientMenu />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bienvenida */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido al dashboard de cliente</h1>
            <p className="text-gray-600 mt-1">Resumen de tu actividad y contratos</p>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FaFileInvoiceDollar}
              title="Contratos Activos"
              value={stats.activeContracts}
              color="bg-blue-500"
            />
            <StatCard
              icon={FaTruck}
              title="Órdenes Pendientes"
              value={stats.pendingOrders}
              color="bg-orange-500"
            />
            <StatCard
              icon={FaFileInvoiceDollar}
              title="Facturas Pendientes"
              value={stats.pendingInvoices}
              color="bg-red-500"
            />
            <StatCard
              icon={FaCreditCard}
              title="Crédito Disponible"
              value={`Q${stats.availableCredit.toLocaleString()}`}
              color="bg-green-500"
            />
          </div>

          {/* Contrato activo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mi Contrato Activo</h2>
            <ClientContractCard 
              contract={contract}
              onViewDetails={handleViewDetails}
            />
          </div>

          {/* Últimas actividades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <div key={item} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Orden de servicio #{2024001 + item}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Estado: En tránsito • Actualizado hace {item} horas
                      </p>
                    </div>
                    <span className="text-xs text-blue-600 cursor-pointer">Ver detalles →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrincipalClient;
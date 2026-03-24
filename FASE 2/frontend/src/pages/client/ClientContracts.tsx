// src/pages/client/ClientContracts.tsx
import React, { useState } from 'react';
import ClientHeader from '../../components/client/ClientHeader';
import ClientMenu from '../../components/client/ClientMenu';
import ClientContractCard from '../../components/client/ClientContractCard';
import { useAuth } from '../../context/AuthContext';

interface Contract {
  id: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  paymentTerms: number;
  rates: {
    light: number;
    heavy: number;
    tractor: number;
  };
  status: 'active' | 'expired' | 'pending';
}

const ClientContracts: React.FC = () => {
  const { user } = useAuth();
  
  // Obtener el nombre completo del usuario
  const userName = user?.nombres && user?.apellidos 
    ? `${user.nombres} ${user.apellidos}`
    : user?.email?.split('@')[0] || 'Usuario';
  
  // Obtener el nombre de la empresa del usuario (si está disponible)
  const companyName = user?.empresa || "Transportes del Valle S.A.";
  
  const [contracts] = useState<Contract[]>([
    {
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
      status: 'active'
    },
    {
      id: '2',
      contractNumber: 'LOG-2023-045',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
      creditLimit: 50000,
      usedCredit: 50000,
      availableCredit: 0,
      paymentTerms: 15,
      rates: {
        light: 7.50,
        heavy: 11.80,
        tractor: 17.00
      },
      status: 'expired'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    if (filter === 'active') return contract.status === 'active';
    if (filter === 'expired') return contract.status === 'expired';
    return true;
  });

  const handleViewDetails = (contractId: string) => {
    console.log('Ver detalles del contrato:', contractId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader 
        companyName={companyName}
        userName={userName}
      />
      <ClientMenu />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mis Contratos</h1>
          <p className="text-gray-600 mt-1">
            Visualiza todos tus contratos activos e históricos
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Activos
          </button>
          <button 
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'expired' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expirados
          </button>
        </div>

        {/* Lista de contratos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContracts.map((contract) => (
            <ClientContractCard
              key={contract.id}
              contract={contract}
              onViewDetails={() => handleViewDetails(contract.id)}
            />
          ))}
        </div>

        {/* Mensaje cuando no hay contratos */}
        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No tienes contratos registrados' 
                : filter === 'active' 
                  ? 'No tienes contratos activos' 
                  : 'No tienes contratos expirados'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientContracts;
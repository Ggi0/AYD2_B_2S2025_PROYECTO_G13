// src/pages/client/ClientContracts.tsx
import React, { useState } from 'react';
import MainLayout from '../../components/principal/MainLayout';
import ClientHeader from '../../components/client/ClientHeader';
import ClientMenu from '../../components/client/ClientMenu';
import ClientContractCard from '../../components/client/ClientContractCard';

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

  const handleViewDetails = (contractId: string) => {
    console.log('Ver detalles del contrato:', contractId);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <ClientHeader 
          companyName="Transportes del Valle S.A."
          userName="Carlos Méndez"
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Todos
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Activos
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              Expirados
            </button>
          </div>

          {/* Lista de contratos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contracts.map((contract) => (
              <ClientContractCard
                key={contract.id}
                contract={contract}
                onViewDetails={() => handleViewDetails(contract.id)}
              />
            ))}
          </div>

          {/* Mensaje cuando no hay contratos */}
          {contracts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No tienes contratos registrados</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientContracts;
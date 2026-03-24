// src/App.tsx
import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Principal from './pages/Principal/Principal';
import TiposRegistro from './pages/Registro/TiposRegistro';
import Login from './pages/Principal/Login';
import PrincipalClient from './pages/client/PrincipalClient';
import ClientContracts from './pages/client/ClientContracts';
import PrincipalLogistico from './pages/logistico/PrincipalLogistico';
import ContratosList from './pages/logistico/ContratosList';
import ContratoForm from './pages/logistico/ContratoForm';
import ContratoDetail from './pages/logistico/ContratoDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Principal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro/tipos" element={<TiposRegistro />} />
          
          {/* Rutas protegidas para clientes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client', 'cliente']}>
                <PrincipalClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/contracts"
            element={
              <ProtectedRoute allowedRoles={['client', 'cliente']}>
                <ClientContracts />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas protegidas para logística */}
          <Route
            path="/logistico/dashboard"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <PrincipalLogistico />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de Contratos */}
          <Route
            path="/logistico/contratos"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <ContratosList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/contratos/nuevo"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <ContratoForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/contratos/:id"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <ContratoDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/contratos/:id/editar"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <ContratoForm />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas pendientes - temporalmente redirigen al dashboard */}
          <Route
            path="/logistico/ordenes"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <PrincipalLogistico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/asignaciones"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <PrincipalLogistico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/clientes"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <PrincipalLogistico />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logistico/reportes"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'operativo', 'admin']}>
                <PrincipalLogistico />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
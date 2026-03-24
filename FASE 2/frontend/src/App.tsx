import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Principal from './pages/Principal/Principal';
import TiposRegistro from './pages/Registro/TiposRegistro';
import Login from './pages/Principal/Login';
import PrincipalClient from './pages/client/PrincipalClient';
import ClientContracts from './pages/client/ClientContracts';
import PrincipalLogistico from './pages/logistico/PrincipalLogistico'; // Importar la nueva vista
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
          <Route
            path="/client/orders"
            element={
              <ProtectedRoute allowedRoles={['client', 'cliente']}>
                <div>Ordenes de Servicio - Próximamente</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ProtectedRoute allowedRoles={['client', 'cliente']}>
                <div>Mis Facturas - Próximamente</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/payments"
            element={
              <ProtectedRoute allowedRoles={['client', 'cliente']}>
                <div>Mis Pagos - Próximamente</div>
              </ProtectedRoute>
            }
          />
          
          {/* Rutas protegidas para logística */}
          <Route
            path="/logistico/dashboard"
            element={
              <ProtectedRoute allowedRoles={['logistic', 'logistico', 'admin']}>
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
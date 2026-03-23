import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Principal from './pages/Principal/Principal';
import TiposRegistro from './pages/Registro/TiposRegistro';
import Login from './pages/Principal/Login';
import PrincipalClient from './pages/client/PrincipalClient';
import ClientContracts from './pages/client/ClientContracts';
import PanelPrivado from './pages/Principal/PanelPrivado';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Componente para proteger rutas de clientes
const ClientRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== 'client') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Principal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro/tipos" element={<TiposRegistro />} />
          <Route
            path="/client/dashboard"
            element={
              <ClientRoute>
                <PrincipalClient />
              </ClientRoute>
            }
          />
          <Route
            path="/client/contracts"
            element={
              <ClientRoute>
                <ClientContracts />
              </ClientRoute>
            }
          />
          <Route
            path="/client/orders"
            element={
              <ClientRoute>
                <div>Ordenes de Servicio - Proximamente</div>
              </ClientRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ClientRoute>
                <div>Mis Facturas - Proximamente</div>
              </ClientRoute>
            }
          />
          <Route
            path="/client/payments"
            element={
              <ClientRoute>
                <div>Mis Pagos - Proximamente</div>
              </ClientRoute>
            }
          />
          <Route
            path="/panel"
            element={(
              <ProtectedRoute>
                <PanelPrivado />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
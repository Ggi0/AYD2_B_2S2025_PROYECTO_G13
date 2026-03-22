import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Principal from './pages/Principal/Principal';
import TiposRegistro from './pages/Registro/TiposRegistro';
import Login from './pages/Principal/Login';
import PanelPrivado from './pages/Principal/PanelPrivado';
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
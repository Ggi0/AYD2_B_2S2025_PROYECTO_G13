import React, { useMemo, useState } from 'react';
import { FaUser, FaTruck, FaUserTie, FaMapMarkerAlt, FaFileInvoice, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/principal/MainLayout';
import { registerRequest } from '../../services/auth/authApi';

const TiposRegistro: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const roleLabel = useMemo(() => {
    if (selectedRole === 'cliente') return 'Cliente';
    if (selectedRole === 'piloto') return 'Piloto';
    if (selectedRole === 'finanzas') return 'Finanzas';
    return '';
  }, [selectedRole]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setError(null);
    setSuccess(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      setError('Selecciona un tipo de cuenta antes de registrarte.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await registerRequest({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
      });

      setSuccess(`${response.mensaje} Ahora puedes iniciar sesión.`);
      setFormData({
        nombres: '',
        apellidos: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo completar el registro.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClienteClick = () => handleRoleSelect('cliente');

  const handlePilotoClick = () => handleRoleSelect('piloto');

  const handleAdminClick = () => handleRoleSelect('finanzas');

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Crear Cuenta
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Selecciona el tipo de cuenta que deseas crear para acceder al sistema logístico de LogiTrans
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tarjeta Cliente */}
            <div 
              onClick={handleClienteClick}
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-blue-500/20 hover:border-blue-500/40 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors duration-300">
                  <FaUser className="text-4xl text-blue-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Cliente
                </h2>
                
                <p className="text-gray-400 mb-6">
                  Empresa que requiere servicios de transporte y logística para sus operaciones
                </p>
                
                <div className="space-y-3 text-left w-full mb-8">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Gestión de órdenes de servicio</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Seguimiento en tiempo real</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Facturación electrónica (FEL)</span>
                  </div>
                </div>
                
                <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300">
                  Registrarse como Cliente
                </button>
              </div>
            </div>

            {/* Tarjeta Piloto */}
            <div 
              onClick={handlePilotoClick}
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-purple-500/20 hover:border-purple-500/40 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <FaTruck className="text-4xl text-purple-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Piloto
                </h2>
                
                <p className="text-gray-400 mb-6">
                  Conductor de unidades de transporte que realiza las entregas y gestiona la bitácora de ruta
                </p>
                
                <div className="space-y-3 text-left w-full mb-8">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Registro de estados de envío</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Bitácora digital de ruta</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Evidencia digital de entregas</span>
                  </div>
                </div>
                
                <button className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300">
                  Registrarse como Piloto
                </button>
              </div>
            </div>

            {/* Tarjeta Administrador */}
            <div 
              onClick={handleAdminClick}
              className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-amber-500/20 hover:border-amber-500/40 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center mb-6 group-hover:bg-amber-500/30 transition-colors duration-300">
                  <FaUserTie className="text-4xl text-amber-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">
                  Finanzas
                </h2>
                
                <p className="text-gray-400 mb-6">
                  Personal de LogiTrans que gestiona clientes, pilotos, contratos y operaciones
                </p>
                
                <div className="space-y-3 text-left w-full mb-8">
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Gestión de contratos y tarifarios</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Dashboard con KPIs gerenciales</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Control de crédito y facturación</span>
                  </div>
                </div>
                
                <button className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-300">
                  Registrarse como Administrador
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-2">Formulario de Registro</h3>
            <p className="text-sm text-gray-300 mb-6">
              {selectedRole ? `Tipo de cuenta seleccionado: ${roleLabel}` : 'Selecciona arriba un tipo de cuenta para continuar.'}
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-emerald-200 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="Nombres"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="Apellidos"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Teléfono"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Contraseña"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmar contraseña"
                className="bg-slate-900/70 text-white border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-400"
              />

              <div className="md:col-span-2 mt-2">
                <button
                  type="submit"
                  disabled={isLoading || !selectedRole}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/60 text-white font-semibold py-3 transition"
                >
                  {isLoading ? 'Registrando...' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          </div>

          {/* Features adicionales */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Cobertura Nacional</p>
                <p className="text-sm text-gray-400">Guatemala, Xela, Pto. Barrios</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaFileInvoice className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Facturación FEL</p>
                <p className="text-sm text-gray-400">Integración con SAT</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Control de Crédito</p>
                <p className="text-sm text-gray-400">Bloqueo automático</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={handleLoginClick}
                className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TiposRegistro;
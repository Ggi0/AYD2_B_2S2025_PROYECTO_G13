import React, { useState } from 'react';
import { 
  FaTruck, 
  FaClipboardList, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaRoute,
  FaClock
} from 'react-icons/fa';
import LogisticHeader from '../../components/logistico/LogisticHeader';
import LogisticMenu from '../../components/logistico/LogisticMenu';
import { useAuth } from '../../context/AuthContext';

interface DashboardStats {
  activeOrders: number;
  pendingAssignments: number;
  completedToday: number;
  delayedOrders: number;
  vehiclesInRoute: number;
  availableVehicles: number;
}

interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  origin: string;
  destination: string;
  vehicleType: 'light' | 'heavy' | 'tractor';
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'delayed';
  createdAt: string;
  scheduledDate: string;
  driverName?: string;
  vehiclePlate?: string;
}

const PrincipalLogistico: React.FC = () => {
  const { user } = useAuth();
  
  // Obtener el nombre completo del usuario
  const userName = user?.nombres && user?.apellidos 
    ? `${user.nombres} ${user.apellidos}`
    : user?.email?.split('@')[0] || 'Operador Logístico';
  
  // Datos de ejemplo - Estos vendrán de la API más adelante
  const [stats] = useState<DashboardStats>({
    activeOrders: 24,
    pendingAssignments: 8,
    completedToday: 12,
    delayedOrders: 3,
    vehiclesInRoute: 15,
    availableVehicles: 7
  });

  // Datos de ejemplo para órdenes recientes
  const [recentOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      clientName: 'Transportes del Valle S.A.',
      origin: 'Zona 10, Guatemala',
      destination: 'Zona 12, Guatemala',
      vehicleType: 'heavy',
      status: 'in_transit',
      createdAt: '2024-03-20T10:00:00',
      scheduledDate: '2024-03-20',
      driverName: 'Carlos Méndez',
      vehiclePlate: 'P-123ABC'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      clientName: 'Logística Express',
      origin: 'Zona 1, Guatemala',
      destination: 'Mixco, Guatemala',
      vehicleType: 'light',
      status: 'pending',
      createdAt: '2024-03-20T11:30:00',
      scheduledDate: '2024-03-21'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      clientName: 'Carga Pesada S.A.',
      origin: 'Escuintla',
      destination: 'Quetzaltenango',
      vehicleType: 'tractor',
      status: 'assigned',
      createdAt: '2024-03-19T09:15:00',
      scheduledDate: '2024-03-20',
      driverName: 'Roberto González',
      vehiclePlate: 'T-789XYZ'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      clientName: 'Distribuidora Central',
      origin: 'Zona 4, Guatemala',
      destination: 'Villa Nueva',
      vehicleType: 'heavy',
      status: 'delayed',
      createdAt: '2024-03-19T14:20:00',
      scheduledDate: '2024-03-19',
      driverName: 'Luis Fernández',
      vehiclePlate: 'P-456DEF'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      clientName: 'Transportes del Valle S.A.',
      origin: 'Antigua Guatemala',
      destination: 'Chimaltenango',
      vehicleType: 'light',
      status: 'delivered',
      createdAt: '2024-03-19T08:00:00',
      scheduledDate: '2024-03-19',
      driverName: 'Miguel Ángel',
      vehiclePlate: 'L-987GHI'
    }
  ]);

  const StatCard = ({ icon: Icon, title, value, color, subtitle, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value} vs día anterior
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Pendiente',
      assigned: 'Asignado',
      in_transit: 'En Tránsito',
      delivered: 'Entregado',
      delayed: 'Retrasado'
    };
    return texts[status];
  };

  const getVehicleTypeText = (type: Order['vehicleType']) => {
    const texts = {
      light: 'Ligero',
      heavy: 'Pesado',
      tractor: 'Tractocamión'
    };
    return texts[type];
  };

  const getVehicleTypeColor = (type: Order['vehicleType']) => {
    const colors = {
      light: 'bg-green-100 text-green-800',
      heavy: 'bg-orange-100 text-orange-800',
      tractor: 'bg-purple-100 text-purple-800'
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LogisticHeader 
        userName={userName}
        userRole="Coordinador de Operaciones"
      />
      <LogisticMenu />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Logístico
          </h1>
          <p className="text-gray-600 mt-1">
            Panel de control para gestión de operaciones de transporte
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            icon={FaClipboardList}
            title="Órdenes Activas"
            value={stats.activeOrders}
            color="bg-blue-500"
            subtitle="En proceso"
            trend={{ positive: true, value: "+12%" }}
          />
          <StatCard
            icon={FaTruck}
            title="Por Asignar"
            value={stats.pendingAssignments}
            color="bg-yellow-500"
            subtitle="Requieren asignación"
          />
          <StatCard
            icon={FaCheckCircle}
            title="Completadas Hoy"
            value={stats.completedToday}
            color="bg-green-500"
            subtitle="Entregas exitosas"
          />
          <StatCard
            icon={FaExclamationTriangle}
            title="Órdenes Retrasadas"
            value={stats.delayedOrders}
            color="bg-red-500"
            subtitle="Requieren atención"
          />
          <StatCard
            icon={FaRoute}
            title="Vehículos en Ruta"
            value={stats.vehiclesInRoute}
            color="bg-purple-500"
            subtitle="En operación"
          />
          <StatCard
            icon={FaClock}
            title="Vehículos Disponibles"
            value={stats.availableVehicles}
            color="bg-teal-500"
            subtitle="Listos para asignar"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <FaTruck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Asignar Órdenes</h3>
                <p className="text-sm text-blue-100">Gestionar asignación de vehículos</p>
                <p className="text-xs text-blue-200 mt-1">{stats.pendingAssignments} órdenes pendientes</p>
              </div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <FaMapMarkerAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Seguimiento en Ruta</h3>
                <p className="text-sm text-green-100">Monitorear ubicación de vehículos</p>
                <p className="text-xs text-green-200 mt-1">{stats.vehiclesInRoute} vehículos activos</p>
              </div>
            </div>
          </button>
          
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Clientes</h3>
                <p className="text-sm text-purple-100">Gestionar información de clientes</p>
                <p className="text-xs text-purple-200 mt-1">Base de datos actualizada</p>
              </div>
            </div>
          </button>
        </div>

        {/* Órdenes Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h3>
              <p className="text-sm text-gray-500 mt-1">Últimas órdenes de servicio registradas</p>
            </div>
            <button className="text-sm text-orange-600 hover:text-orange-800 font-medium flex items-center space-x-1">
              <span>Ver todas</span>
              <span>→</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen → Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conductor/Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Programada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1 min-w-[200px]">
                        <span className="truncate max-w-[120px]">{order.origin}</span>
                        <span>→</span>
                        <span className="truncate max-w-[120px]">{order.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getVehicleTypeColor(order.vehicleType)}`}>
                        {getVehicleTypeText(order.vehicleType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.driverName ? (
                        <div>
                          <p className="text-sm font-medium">{order.driverName}</p>
                          <p className="text-xs text-gray-500">{order.vehiclePlate}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No asignado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.scheduledDate).toLocaleDateString('es-GT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-orange-600 hover:text-orange-900 font-medium">
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalLogistico;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  UtensilsCrossed,
  DollarSign,
  Package,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Loader,
  X
} from 'lucide-react';
import { foodApi, FoodMenuItem, FoodOrder, FoodVendorStats } from '../../../services/foodApi';

const FoodVendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<FoodVendorStats>({
    totalRevenue: 0,
    totalMenuItems: 0,
    totalOrders: 0,
    averageRating: 0
  });

  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>([]);
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [statsResponse, menuResponse, ordersResponse] = await Promise.all([
        foodApi.getVendorStats().catch(() => ({ data: { totalRevenue: 0, totalMenuItems: 0, totalOrders: 0, averageRating: 0 } })),
        foodApi.getVendorMenuItems().catch(() => ({ data: [] })),
        foodApi.getVendorOrders({ status: 'awaiting_vendor,accepted,preparing,ready_for_pickup' }).catch(() => ({ data: [] }))
      ]);

      if (statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (menuResponse.data) {
        setMenuItems(Array.isArray(menuResponse.data) ? menuResponse.data : []);
      }

      if (ordersResponse.data) {
        setOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsLoadingOrders(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await foodApi.deleteMenuItem(itemId);
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      setSuccessMessage('Menu item deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete menu item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleAvailability = async (itemId: number, currentStatus: boolean) => {
    try {
      await foodApi.toggleMenuItemAvailability(itemId, !currentStatus);
      setMenuItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, is_available: !currentStatus }
            : item
        )
      );
      setSuccessMessage(`Menu item ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update menu item');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await foodApi.acceptOrder(orderId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'accepted' }
            : order
        )
      );
      setSuccessMessage('Order accepted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to accept order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMarkPreparing = async (orderId: number) => {
    try {
      await foodApi.markOrderPreparing(orderId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'preparing' }
            : order
        )
      );
      setSuccessMessage('Order marked as preparing');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMarkReady = async (orderId: number) => {
    try {
      await foodApi.markOrderReady(orderId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: 'ready_for_pickup' }
            : order
        )
      );
      setSuccessMessage('Order marked as ready for pickup');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'ready_for_pickup':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
      case 'out-of-stock':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'awaiting_vendor':
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
      case 'assigned':
      case 'on_the_way':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-green-800">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-800">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-800">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <UtensilsCrossed className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalMenuItems}</div>
            <div className="text-sm text-gray-600">Menu Items</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <UtensilsCrossed className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No menu items yet</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium"
                  >
                    Add Your First Menu Item
                  </button>
                </div>
              ) : (
                menuItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image || item.image_urls?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.is_available ? 'available' : 'unavailable')}`}>
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{item.category}</span>
                            <span className="font-semibold text-green-600">{formatPrice(item.price)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {item.preparation_time_minutes} mins
                            </span>
                            {item.stock !== undefined && <span>Stock: {item.stock}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.is_available)}
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              item.is_available
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {item.is_available ? 'Disable' : 'Enable'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600">
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {orders.filter(order => order.status === 'awaiting_vendor').length} new
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {isLoadingOrders ? (
                <div className="text-center py-12">
                  <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600">No active orders</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed size={14} />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(order.created_at || '').toLocaleTimeString()}
                        </span>
                        <span className="font-semibold text-green-600">{formatPrice(order.total)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Delivery: {formatStatus(order.delivery_method)}
                      </div>
                    </div>

                    {order.status === 'awaiting_vendor' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Accept Order
                        </button>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => handleMarkPreparing(order.id)}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleMarkReady(order.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}

                    {order.status === 'ready_for_pickup' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-800 font-medium">Ready for Pickup</p>
                        <p className="text-xs text-green-600 mt-1">Waiting for rider/customer</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/dashboard/food-vendor/menu')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Menu</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/food-vendor/orders')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Package className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">View All Orders</span>
            </button>

            <button
              onClick={fetchDashboardData}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Refresh Data</span>
            </button>

            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <TrendingUp className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FoodVendorDashboard;

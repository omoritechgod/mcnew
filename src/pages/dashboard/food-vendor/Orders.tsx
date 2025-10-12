import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
  UtensilsCrossed,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { foodApi, FoodOrder } from '../../../services/foodApi';

const FoodVendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState<string>('active');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filter, orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await foodApi.getVendorOrders();

      if (response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    switch (filter) {
      case 'active':
        filtered = orders.filter(order =>
          ['awaiting_vendor', 'accepted', 'preparing', 'ready_for_pickup'].includes(order.status)
        );
        break;
      case 'awaiting':
        filtered = orders.filter(order => order.status === 'awaiting_vendor');
        break;
      case 'preparing':
        filtered = orders.filter(order => ['accepted', 'preparing'].includes(order.status));
        break;
      case 'ready':
        filtered = orders.filter(order => order.status === 'ready_for_pickup');
        break;
      case 'completed':
        filtered = orders.filter(order => ['delivered', 'completed'].includes(order.status));
        break;
      case 'all':
      default:
        filtered = orders;
    }

    setFilteredOrders(filtered);
  };

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await foodApi.acceptOrder(orderId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'accepted' } : order
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
          order.id === orderId ? { ...order, status: 'preparing' } : order
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
          order.id === orderId ? { ...order, status: 'ready_for_pickup' } : order
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
      case 'awaiting_vendor':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready_for_pickup':
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filters = [
    { id: 'active', label: 'Active Orders', count: orders.filter(o => ['awaiting_vendor', 'accepted', 'preparing', 'ready_for_pickup'].includes(o.status)).length },
    { id: 'awaiting', label: 'Awaiting', count: orders.filter(o => o.status === 'awaiting_vendor').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length },
    { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready_for_pickup').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => ['delivered', 'completed'].includes(o.status)).length },
    { id: 'all', label: 'All Orders', count: orders.length }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Food Orders</h1>
          <p className="text-gray-600">Manage your incoming food orders</p>
        </div>

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

        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filter !== 'all' ? 'No orders match this filter' : 'You have no orders yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                      {order.payment_status === 'paid' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₦{order.total.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{formatStatus(order.delivery_method)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {order.items && order.items.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <UtensilsCrossed size={16} />
                        Items ({order.items.length})
                      </h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.quantity}x Item #{item.food_menu_id || item.menu_id} - ₦{(item.total_price || 0).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.delivery_method === 'delivery' && order.shipping_address && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        Delivery Address
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.area}, {order.shipping_address.city}</p>
                        {order.shipping_address.landmark && (
                          <p className="text-gray-500">Landmark: {order.shipping_address.landmark}</p>
                        )}
                        {order.can_show_contacts && order.shipping_address.phone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone size={14} />
                            <span>{order.shipping_address.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {order.tip_amount && order.tip_amount > 0 && (
                  <div className="text-sm text-gray-600 mb-4">
                    Customer Tip: ₦{order.tip_amount.toLocaleString()}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {order.status === 'awaiting_vendor' && order.payment_status === 'paid' && (
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleMarkPreparing(order.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Start Preparing
                    </button>
                  )}

                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleMarkReady(order.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-800 font-medium">
                      <CheckCircle size={16} className="inline mr-1" />
                      Waiting for Pickup
                    </div>
                  )}

                  {(order.status === 'delivered' || order.status === 'completed') && (
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-800 font-medium">
                      <CheckCircle size={16} className="inline mr-1" />
                      Order {formatStatus(order.status)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FoodVendorOrders;

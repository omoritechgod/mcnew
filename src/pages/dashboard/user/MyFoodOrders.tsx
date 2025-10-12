import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  AlertCircle,
  Loader,
  Star,
  X
} from 'lucide-react';
import { foodApi, FoodOrder } from '../../../services/foodApi';

const MyFoodOrders: React.FC = () => {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      const filterParams = filter !== 'all' ? { status: filter } : undefined;
      const response = await foodApi.getUserOrders(filterParams);

      if (response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    if (!confirm('Mark this order as completed?')) return;

    try {
      await foodApi.completeOrder(orderId);
      setSuccessMessage('Order marked as completed');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to complete order');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
      case 'on_the_way':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending_payment', label: 'Pending Payment' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'on_the_way', label: 'On The Way' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Food Orders</h1>
          <p className="text-gray-600">Track your food delivery orders</p>
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
                {f.label}
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
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter !== 'all' ? 'No orders match this filter' : "You haven't placed any food orders yet"}
            </p>
            <button
              onClick={() => window.location.href = '/food-delivery'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Order Food Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₦{order.total.toLocaleString()}</div>
                    <div className={`text-sm font-medium ${
                      order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vendor</h4>
                    {order.vendor ? (
                      <div>
                        <p className="text-gray-900">{order.vendor.business_name}</p>
                        {order.can_show_contacts && order.vendor.contact_phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Phone size={14} />
                            <span>{order.vendor.contact_phone}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">N/A</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Method</h4>
                    <p className="text-gray-900">{formatStatus(order.delivery_method)}</p>
                    {order.delivery_fee !== undefined && order.delivery_fee > 0 && (
                      <p className="text-sm text-gray-600">Fee: ₦{order.delivery_fee.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.quantity}x Item #{item.food_menu_id || item.menu_id}
                          </span>
                          <span className="text-gray-900">₦{(item.total_price || 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.shipping_address && order.delivery_method === 'delivery' && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="mt-0.5" />
                      <div>
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.area}, {order.shipping_address.city}</p>
                        <p>{order.shipping_address.state}</p>
                        {order.shipping_address.landmark && (
                          <p className="text-gray-500">Landmark: {order.shipping_address.landmark}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {order.tip_amount && order.tip_amount > 0 && (
                  <div className="text-sm text-gray-600 mb-4">
                    Tip: ₦{order.tip_amount.toLocaleString()}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {order.status === 'delivered' && order.payment_status === 'paid' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      <CheckCircle size={16} className="inline mr-1" />
                      Mark as Completed
                    </button>
                  )}

                  {order.status === 'pending_payment' && (
                    <button
                      onClick={() => window.location.href = `/payment/${order.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      Complete Payment
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFoodOrders;

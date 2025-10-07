import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Package,
  Filter,
  Eye,
  RefreshCw,
  Loader2,
  User,
  Store,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { orderApi, Order, getOrderStatusColor, getOrderStatusLabel } from '../../../services/orderApi';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getMyOrders();
      setOrders(response);

      calculateStats(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersList: Order[]) => {
    const totalOrders = ordersList.length;
    const pendingOrders = ordersList.filter(o =>
      ['pending', 'pending_vendor', 'accepted', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered'].includes(o.status)
    ).length;
    const completedOrders = ordersList.filter(o => o.status === 'completed').length;
    const totalRevenue = ordersList
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => {
        const amount = typeof o.total_amount === 'string' ? parseFloat(o.total_amount) : o.total_amount;
        return sum + amount;
      }, 0);

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    });
  };

  const handleRefundOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to refund this order? This action cannot be undone.')) {
      return;
    }

    try {
      await orderApi.refundOrder(orderId);
      alert('Order refunded successfully');
      fetchOrders();
    } catch (error: any) {
      console.error('Error refunding order:', error);
      alert(error.message || 'Failed to refund order');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const totalAmount = typeof order.total_amount === 'string'
      ? parseFloat(order.total_amount)
      : order.total_amount;

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Order #{order.id}</div>
              <div className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{order.user?.name || 'Customer'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Store size={16} />
            <span>{order.vendor?.business_name || 'Vendor'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package size={16} />
            <span>{order.items?.length || 0} items</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign size={16} />
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => setSelectedOrder(order)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
          {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) && (
            <button
              onClick={() => handleRefundOrder(order.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Refund
            </button>
          )}
        </div>
      </div>
    );
  };

  const OrderDetailModal: React.FC<{ order: Order }> = ({ order }) => {
    const totalAmount = typeof order.total_amount === 'string'
      ? parseFloat(order.total_amount)
      : order.total_amount;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Created: {new Date(order.created_at).toLocaleString()}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm">
                  <div><strong>Name:</strong> {order.user?.name}</div>
                  <div><strong>Email:</strong> {order.user?.email}</div>
                  <div><strong>Phone:</strong> {order.user?.phone}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Vendor Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm">
                  <div><strong>Business:</strong> {order.vendor?.business_name}</div>
                  <div><strong>Category:</strong> {order.vendor?.category}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item) => {
                  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                  const subtotal = price * item.quantity;

                  return (
                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.svg'}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{item.product.title}</div>
                        <div className="text-sm text-gray-600 mb-2 capitalize">
                          Condition: {item.product.condition}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₦{price.toLocaleString()}
                          </div>
                          <div className="font-semibold text-gray-900">
                            ₦{subtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {['paid', 'processing', 'shipped', 'delivered'].includes(order.status) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                  <div className="flex-1">
                    <div className="font-medium text-red-900 mb-2">Admin Actions</div>
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        handleRefundOrder(order.id);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Process Refund
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Monitor and manage all marketplace orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-yellow-100 rounded-full p-3">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 rounded-full p-3">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedOrders}</div>
            <div className="text-sm text-gray-600">Completed Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 rounded-full p-3">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={20} className="text-gray-600" />
            {['all', 'pending', 'pending_vendor', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : getOrderStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No orders yet' : `No ${getOrderStatusLabel(filter)} orders`}
            </h2>
            <p className="text-gray-600">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {selectedOrder && <OrderDetailModal order={selectedOrder} />}
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;

// src/pages/dashboard/product-vendor/Orders.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Eye,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { orderApi, Order, getOrderStatusColor, getOrderStatusLabel } from '../../../services/orderApi';

const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getVendorOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: number) => {
    if (!confirm('Accept this order? Customer will be notified to proceed with payment.')) {
      return;
    }

    setActionLoading(true);
    try {
      await orderApi.acceptOrder(orderId);
      alert('Order accepted successfully!');
      fetchOrders();
    } catch (error: any) {
      console.error('Error accepting order:', error);
      alert(error.message || 'Failed to accept order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    if (!confirm('Reject this order? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      await orderApi.rejectOrder(orderId);
      alert('Order rejected');
      fetchOrders();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      alert(error.message || 'Failed to reject order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: 'processing' | 'shipped' | 'delivered') => {
    const messages = {
      processing: 'Mark order as processing?',
      shipped: 'Mark order as shipped?',
      delivered: 'Mark order as delivered? Customer will be able to release payment.',
    };

    if (!confirm(messages[status])) return;

    setActionLoading(true);
    try {
      await orderApi.updateOrderStatus(orderId, status);
      alert(`Order marked as ${status}`);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
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

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{order.user?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package size={16} />
            <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Delivery:</span> {order.delivery_method === 'pickup' ? 'Pickup' : 'Shipping'}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-sm text-gray-600">Order Total</div>
            <div className="text-xl font-bold text-blue-600">₦{totalAmount.toLocaleString()}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedOrder(order)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Eye size={16} />
              View
            </button>

            {order.status === 'pending_vendor' && (
              <>
                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  Accept
                </button>
                <button
                  onClick={() => handleRejectOrder(order.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}

            {order.status === 'paid' && (
              <button
                onClick={() => handleUpdateStatus(order.id, 'processing')}
                disabled={actionLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Mark Processing
              </button>
            )}

            {order.status === 'processing' && (
              <button
                onClick={() => handleUpdateStatus(order.id, 'shipped')}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Truck size={16} />
                Mark Shipped
              </button>
            )}

            {order.status === 'shipped' && (
              <button
                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                disabled={actionLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Mark Delivered
              </button>
            )}
          </div>
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
            {/* Order Status */}
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

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-600" />
                  <span className="text-sm">{order.user?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-600" />
                  <span className="text-sm">{order.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-600" />
                  <span className="text-sm">{order.user?.phone}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
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

            {/* Delivery Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Truck className="text-gray-600 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Method</div>
                    <div className="text-sm text-gray-600 capitalize">{order.delivery_method}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="text-gray-600 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Address</div>
                    <div className="text-sm text-gray-600">{order.delivery_address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {order.status === 'pending_vendor' && (
                <>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      handleAcceptOrder(order.id);
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    Accept Order
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      handleRejectOrder(order.id);
                    }}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={20} />
                    Reject Order
                  </button>
                </>
              )}

              {order.status === 'paid' && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    handleUpdateStatus(order.id, 'processing');
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
                >
                  Mark as Processing
                </button>
              )}

              {order.status === 'processing' && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    handleUpdateStatus(order.id, 'shipped');
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Truck size={20} />
                  Mark as Shipped
                </button>
              )}

              {order.status === 'shipped' && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    handleUpdateStatus(order.id, 'delivered');
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={20} />
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">{orders.length} total orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'pending_vendor', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : getOrderStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

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
    </DashboardLayout>
  );
};

export default VendorOrders;
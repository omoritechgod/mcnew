// src/pages/dashboard/user/MyOrders.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Loader2,
  Eye,
  Store,
} from 'lucide-react';
import { orderApi, Order, getOrderStatusColor, getOrderStatusLabel } from '../../../services/orderApi';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (order: Order) => {
    setActionLoading(true);
    try {
      const response = await orderApi.initiatePayment(order.id);
      
      // Redirect to Flutterwave payment page
      window.location.href = response.data.link;
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      alert(error.message || 'Failed to initiate payment');
      setActionLoading(false);
    }
  };

  const handleReleaseEscrow = async (order: Order) => {
    if (!confirm('Confirm that you have received your order? This will release payment to the vendor.')) {
      return;
    }

    setActionLoading(true);
    try {
      await orderApi.releaseEscrow(order.id);
      alert('Order marked as completed! Vendor has been paid.');
      fetchOrders();
    } catch (error: any) {
      console.error('Error releasing escrow:', error);
      alert(error.message || 'Failed to complete order');
    } finally {
      setActionLoading(false);
    }
  };

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

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Store size={16} />
            <span>{order.vendor?.business_name || 'Vendor'}</span>
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
            <div className="text-sm text-gray-600">Total Amount</div>
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

            {/* Show waiting status for pending orders waiting for vendor acceptance */}
            {order.status === 'pending_vendor' && (
              <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                Awaiting Vendor Acceptance
              </div>
            )}

            {/* Show Pay Now button for accepted orders (awaiting_payment status) */}
            {(order.status === 'pending' || order.status === 'accepted' || order.status === 'awaiting_payment') && (
              <button
                onClick={() => handlePayOrder(order)}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <CreditCard size={16} />
                Pay Now
              </button>
            )}

            {order.status === 'delivered' && (
              <button
                onClick={() => handleReleaseEscrow(order)}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Mark Completed
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
              {order.status === 'awaiting_payment' && (
                <div className="mt-2 text-sm text-green-700 font-medium">
                  ✓ Vendor has accepted your order - Product is available
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Vendor Information</h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{order.vendor?.business_name}</div>
                  <div className="text-sm text-gray-600">{order.vendor?.category}</div>
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
            <div className="space-y-3">
              {/* Order accepted notification */}
              {(order.status === 'accepted' || order.status === 'awaiting_payment') && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-0.5" size={20} />
                    <div className="flex-1">
                      <div className="font-medium text-green-900 mb-1">Order Accepted!</div>
                      <p className="text-sm text-green-800">
                        The vendor has accepted your order and confirmed product availability. Please proceed with payment to complete your purchase.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Awaiting vendor acceptance */}
              {order.status === 'pending_vendor' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="text-yellow-600 mt-0.5" size={20} />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900 mb-1">Awaiting Vendor Acceptance</div>
                      <p className="text-sm text-yellow-800">
                        Your order has been placed. Waiting for the vendor to accept it before you can proceed with payment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {(order.status === 'pending' || order.status === 'accepted' || order.status === 'awaiting_payment') && (
                  <button
                    onClick={() => handlePayOrder(order)}
                    disabled={actionLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                    Pay Now
                  </button>
                )}
              </div>

              {order.status === 'delivered' && (
                <button
                  onClick={() => handleReleaseEscrow(order)}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                  Mark as Completed
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">{orders.length} total orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to place your first order</p>
            <button
              onClick={() => window.location.href = '/ecommerce'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {selectedOrder && <OrderDetailModal order={selectedOrder} />}
      </div>
    </DashboardLayout>
  );
};

export default MyOrders;
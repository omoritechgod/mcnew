// src/pages/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShoppingCart,
  MapPin,
  Truck,
  Store,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { cartApi, CartItem } from '../services/cartApi';
import { orderApi } from '../services/orderApi';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [deliveryAddress, setDeliveryAddress] = useState(
    location.state?.deliveryAddress || ''
  );
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>(
    location.state?.deliveryMethod || 'pickup'
  );

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const items = await cartApi.getCart();
      
      if (items.length === 0) {
        alert('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.product.price === 'string' 
        ? parseFloat(item.product.price) 
        : item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    setProcessing(true);

    try {
      const response = await orderApi.checkout({
        delivery_address: deliveryAddress,
        delivery_method: deliveryMethod,
      });

      alert(`${response.orders.length} order(s) created successfully!`);
      
      // Navigate to orders page
      navigate('/dashboard/user/orders', {
        state: { fromCheckout: true }
      });
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Group items by vendor
  const itemsByVendor = cartItems.reduce((groups, item) => {
    const vendorId = item.product.vendor_id;
    if (!groups[vendorId]) {
      groups[vendorId] = {
        vendor: item.product.vendor,
        items: [],
      };
    }
    groups[vendorId].items.push(item);
    return groups;
  }, {} as Record<number, { vendor: any; items: CartItem[] }>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        {/* ADJUSTMENT: Added pt-32 to push content below fixed header */}
        <div className="flex items-center justify-center h-96 pt-32">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ADJUSTMENT: Added pt-32 to push content below fixed header (header height ~130px with spacing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and complete purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-600" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        deliveryMethod === 'pickup'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        className="sr-only"
                      />
                      <Store className="text-blue-600 mr-3" size={24} />
                      <div>
                        <div className="font-semibold text-gray-900">Pickup</div>
                        <div className="text-sm text-gray-600">Collect from vendor</div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        deliveryMethod === 'shipping'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value="shipping"
                        checked={deliveryMethod === 'shipping'}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        className="sr-only"
                      />
                      <Truck className="text-green-600 mr-3" size={24} />
                      <div>
                        <div className="font-semibold text-gray-900">Shipping</div>
                        <div className="text-sm text-gray-600">Deliver to address</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items by Vendor */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart size={24} className="text-blue-600" />
                Order Summary
              </h2>

              <div className="space-y-6">
                {Object.entries(itemsByVendor).map(([vendorId, group]) => {
                  const vendorTotal = group.items.reduce((sum, item) => {
                    const price = typeof item.product.price === 'string'
                      ? parseFloat(item.product.price)
                      : item.product.price;
                    return sum + (price * item.quantity);
                  }, 0);

                  return (
                    <div key={vendorId} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Store className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {group.vendor?.business_name || 'Vendor'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Subtotal</div>
                          <div className="font-bold text-gray-900">
                            ₦{vendorTotal.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const price = typeof item.product.price === 'string'
                            ? parseFloat(item.product.price)
                            : item.product.price;

                          return (
                            <div key={item.id} className="flex gap-3">
                              <img
                                src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.svg'}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.product.title}</div>
                                <div className="text-sm text-gray-600">
                                  Qty: {item.quantity} × ₦{price.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ₦{(price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Calculated later</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-blue-600">₦{calculateTotal().toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing || !deliveryAddress.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {processing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Place Order
                  </>
                )}
              </button>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Secure escrow payment - your money is protected</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Vendor must accept order before payment</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Release payment only after receiving items</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Orders will be created per vendor. Each vendor must accept before you can pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
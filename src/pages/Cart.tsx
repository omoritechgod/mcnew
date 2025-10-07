// src/pages/Cart.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Loader2,
  Store,
  Truck,
  MapPin,
} from 'lucide-react';
import { cartApi, CartItem } from '../services/cartApi';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'shipping'>('pickup');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const items = await cartApi.getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(cartId);
    try {
      await cartApi.updateCartItem(cartId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (cartId: number) => {
    if (!confirm('Remove this item from cart?')) return;

    try {
      await cartApi.removeFromCart(cartId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    // Navigate to checkout with delivery info
    navigate('/checkout', {
      state: {
        deliveryAddress,
        deliveryMethod,
      }
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate('/ecommerce')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors"
            >
              Browse Marketplace
              <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(itemsByVendor).map(([vendorId, group]) => (
                <div key={vendorId} className="bg-white rounded-2xl p-6 shadow-sm">
                  {/* Vendor Header */}
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Store className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {group.vendor?.business_name || 'Vendor'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    {group.items.map((item) => {
                      const price = typeof item.product.price === 'string'
                        ? parseFloat(item.product.price)
                        : item.product.price;
                      const subtotal = price * item.quantity;

                      return (
                        <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                          {/* Product Image */}
                          <img
                            src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.svg'}
                            alt={item.product.title}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                              {item.product.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 capitalize">
                              {item.product.condition}
                            </p>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-lg font-bold text-blue-600">
                                  ₦{price.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Subtotal: ₦{subtotal.toLocaleString()}
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItem === item.id}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-12 text-center font-medium">
                                  {updatingItem === item.id ? (
                                    <Loader2 className="animate-spin inline" size={16} />
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={
                                    item.quantity >= item.product.stock_quantity ||
                                    updatingItem === item.id
                                  }
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={14} />
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>

                            {/* Stock Warning */}
                            {item.quantity >= item.product.stock_quantity && (
                              <p className="text-xs text-red-600 mt-1">
                                Maximum stock reached
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Delivery Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Delivery Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Store className="mx-3 text-blue-600" size={20} />
                      <span className="text-sm font-medium">Pickup</span>
                    </label>

                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delivery"
                        value="shipping"
                        checked={deliveryMethod === 'shipping'}
                        onChange={(e) => setDeliveryMethod(e.target.value as any)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Truck className="mx-3 text-green-600" size={20} />
                      <span className="text-sm font-medium">Shipping</span>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="text-green-600">Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span className="text-blue-600">₦{calculateTotal().toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!deliveryAddress.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                {/* Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Secure Payment:</span> Your payment is protected by escrow until you confirm receipt of your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FoodMenuItem } from '../services/foodApi';

interface CartItem extends FoodMenuItem {
  quantity: number;
}

interface CartData {
  vendor_id: number;
  vendor_name?: string;
  items: CartItem[];
}

const FoodCart: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData>({ vendor_id: 0, items: [] });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('food_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCart = (updatedCart: CartData) => {
    try {
      localStorage.setItem('food_cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedItems = cart.items.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    saveCart({ ...cart, items: updatedItems });
  };

  const removeItem = (itemId: number) => {
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    saveCart({ ...cart, items: updatedItems });
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      localStorage.removeItem('food_cart');
      setCart({ vendor_id: 0, items: [] });
    }
  };

  const getSubtotal = (): number => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/food-checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate('/food-delivery')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious food to get started!</p>
            <button
              onClick={() => navigate('/food-delivery')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/food-delivery')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-sm text-gray-600">{getTotalItems()} items</p>
              </div>
            </div>

            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                    <img
                      src={item.image || item.image_urls?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200';
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">₦{item.price.toLocaleString()} each</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 text-sm mt-2"
                      >
                        <Trash2 size={16} className="inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₦{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>₦{getSubtotal().toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivery fee will be calculated at checkout
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate(`/food-vendor/${cart.vendor_id}`)}
                className="w-full mt-3 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                Add More Items
              </button>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Single Vendor Policy</p>
                    <p>Your cart can only contain items from one restaurant at a time.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCart;

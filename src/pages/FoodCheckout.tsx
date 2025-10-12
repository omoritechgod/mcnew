import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, User, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { foodApi, FoodMenuItem, CreateFoodOrderData } from '../services/foodApi';

interface CartItem extends FoodMenuItem {
  quantity: number;
}

interface CartData {
  vendor_id: number;
  vendor_name?: string;
  items: CartItem[];
}

interface ShippingAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  landmark?: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

const FoodCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData>({ vendor_id: 0, items: [] });
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState<ShippingAddress>({
    street: '',
    area: '',
    city: '',
    state: '',
    landmark: '',
    phone: ''
  });

  useEffect(() => {
    loadCart();
    loadSavedAddress();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('food_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
      } else {
        navigate('/food-delivery');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      navigate('/food-delivery');
    }
  };

  const loadSavedAddress = () => {
    try {
      const savedAddress = localStorage.getItem('saved_address');
      if (savedAddress) {
        setAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error('Failed to load saved address:', error);
    }
  };

  const saveAddress = () => {
    try {
      localStorage.setItem('saved_address', JSON.stringify(address));
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const getSubtotal = (): number => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTotal = (): number => {
    return getSubtotal() + tipAmount;
  };

  const validateForm = (): boolean => {
    if (deliveryMethod === 'delivery') {
      if (!address.street || !address.area || !address.city || !address.state || !address.phone) {
        setError('Please fill in all required address fields');
        return false;
      }

      const phoneRegex = /^0[789][01]\d{8}$/;
      if (!phoneRegex.test(address.phone)) {
        setError('Please enter a valid Nigerian phone number');
        return false;
      }
    }

    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const orderData: CreateFoodOrderData = {
        vendor_id: cart.vendor_id,
        items: cart.items.map(item => ({
          menu_id: item.id,
          quantity: item.quantity
        })),
        delivery_method: deliveryMethod,
        tip_amount: tipAmount
      };

      if (deliveryMethod === 'delivery') {
        orderData.shipping_address = address;
        saveAddress();
      }

      const response = await foodApi.placeOrder(orderData);

      if (response.data && response.data.order_id) {
        localStorage.removeItem('food_cart');

        navigate('/payment-success', {
          state: {
            orderId: response.data.order_id,
            orderType: 'food',
            amount: getTotal(),
            message: 'Order placed successfully! Please proceed with payment.'
          }
        });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-gray-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Please add items to your cart first</p>
          <button
            onClick={() => navigate('/food-delivery')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/food-cart')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Method</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 border-2 rounded-xl transition-colors ${
                    deliveryMethod === 'delivery'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="font-semibold">Delivery</div>
                    <div className="text-xs text-gray-600 mt-1">Get it delivered</div>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 border-2 rounded-xl transition-colors ${
                    deliveryMethod === 'pickup'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏃</div>
                    <div className="font-semibold">Pickup</div>
                    <div className="text-xs text-gray-600 mt-1">Collect yourself</div>
                  </div>
                </button>
              </div>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        placeholder="e.g., 123 Main Street"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area *
                      </label>
                      <input
                        type="text"
                        value={address.area}
                        onChange={(e) => handleAddressChange('area', e.target.value)}
                        placeholder="e.g., Ikeja"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="e.g., Lagos"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder="e.g., Lagos"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => handleAddressChange('landmark', e.target.value)}
                      placeholder="e.g., Opposite Unity Bank"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        placeholder="08012345678"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a Tip (Optional)</h2>

              <div className="grid grid-cols-4 gap-3">
                {[0, 50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`py-3 rounded-xl font-medium transition-colors ${
                      tipAmount === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : `₦${amount}`}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Tip Amount
                </label>
                <input
                  type="number"
                  value={tipAmount || ''}
                  onChange={(e) => setTipAmount(parseInt(e.target.value) || 0)}
                  placeholder="Enter custom amount"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₦{getSubtotal().toLocaleString()}</span>
                  </div>

                  {tipAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tip</span>
                      <span>₦{tipAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₦{getTotal().toLocaleString()}</span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Delivery fee will be added based on vendor's rate
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCheckout;

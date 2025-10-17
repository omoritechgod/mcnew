import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Clock, Star, Plus, Minus, MapPin, Phone, Mail, AlertCircle, Loader, Info } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { foodApi, FoodVendorProfile, FoodMenuItem } from '../services/foodApi';

interface CartItem extends FoodMenuItem {
  quantity: number;
}

const FoodVendorMenu: React.FC = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<FoodVendorProfile | null>(null);
  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetails(parseInt(vendorId));
      loadCartFromStorage();
    }
  }, [vendorId]);

  const fetchVendorDetails = async (id: number) => {
    try {
      setIsLoading(true);
      setError('');

      const vendorResponse = await foodApi.getPublicVendorDetails(id);

      if (vendorResponse && vendorResponse.vendor) {
        const data = vendorResponse.vendor;

        // Normalize data types for safety
        const normalizedVendor = {
          ...data,
          average_rating: Number(data.average_rating || 0),
          delivery_fee: Number(data.delivery_fee || 0),
          minimum_order_amount: Number(data.minimum_order_amount || 0),
          menu_items: Array.isArray(data.menu_items) ? data.menu_items.map((item: any) => ({
            ...item,
            price: Number(item.price || 0)
          })) : []
        };

        setVendor(normalizedVendor as FoodVendorProfile);
        setMenuItems(normalizedVendor.menu_items);
      } else {
        throw new Error('Invalid vendor data');
      }

    } catch (err: any) {
      console.error('Error loading vendor:', err);
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setIsLoading(false);
    }
  };


  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('food_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        if (cartData.vendor_id === parseInt(vendorId || '0')) {
          setCart(cartData.items || []);
        }
      }
    } catch {
      setCart([]);
    }
  };

  const saveCartToStorage = (items: CartItem[], currentVendorId: number) => {
    try {
      const cartData = {
        vendor_id: currentVendorId,
        items: items
      };
      localStorage.setItem('food_cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = (item: FoodMenuItem) => {
    if (!item.is_available) {
      alert('This item is currently unavailable');
      return;
    }

    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    let updatedCart: CartItem[];
    if (existingItemIndex >= 0) {
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(updatedCart);
    saveCartToStorage(updatedCart, vendor?.vendor_id || 0);
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    saveCartToStorage(updatedCart, vendor?.vendor_id || 0);
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart, vendor?.vendor_id || 0);
  };

  const getCartItemQuantity = (itemId: number): number => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const getTotalItems = (): number => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (vendor?.minimum_order_amount && getTotalPrice() < vendor.minimum_order_amount) {
      alert(`Minimum order amount is ₦${vendor.minimum_order_amount.toLocaleString()}`);
      return;
    }

    navigate('/food-checkout');
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Vendor</h2>
            <p className="text-gray-600 mb-6">{error || 'Vendor not found'}</p>
            <button
              onClick={() => navigate('/food-delivery')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Back to Restaurants
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/food-delivery')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{vendor.business_name}</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span>{vendor.average_rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={handleCheckout}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium"
              >
                <ShoppingCart size={20} />
                <span>{getTotalItems()} items</span>
                <span>₦{getTotalPrice().toLocaleString()}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{vendor.business_name}</h2>
              <p className="text-gray-600 mb-4">{vendor.description || vendor.specialty}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Prep time: {vendor.estimated_preparation_time || 30} mins</span>
                </div>
                {vendor.delivery_fee !== undefined && (
                  <div className="flex items-center gap-2">
                    <Info size={16} />
                    <span>Delivery fee: ₦{vendor.delivery_fee.toLocaleString()}</span>
                  </div>
                )}
                {vendor.minimum_order_amount && vendor.minimum_order_amount > 0 && (
                  <div className="flex items-center gap-2">
                    <Info size={16} />
                    <span>Min. order: ₦{vendor.minimum_order_amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              {vendor.cuisines && vendor.cuisines.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cuisines</h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.cuisines.map((cuisine, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!vendor.is_open && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 font-medium">Currently Closed</p>
                  <p className="text-red-600 text-sm">Check back during operating hours</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>

        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-600">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenuItems.map((item) => {
              const quantity = getCartItemQuantity(item.id);

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={item.image || item.image_urls?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500';
                      }}
                    />
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xl font-bold text-green-600">₦{item.price.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>{item.preparation_time_minutes} mins</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        {item.category}
                      </div>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {quantity === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available || !vendor.is_open}
                        className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                          item.is_available && vendor.is_open
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus size={16} className="inline mr-1" />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-lg">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:hidden">
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-between px-6"
          >
            <span>{getTotalItems()} items</span>
            <span>Checkout</span>
            <span>₦{getTotalPrice().toLocaleString()}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodVendorMenu;

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Search,
  ShoppingCart,
  UtensilsCrossed,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { foodApi, FoodVendorProfile, FoodMenuItem } from '../services/foodApi';

interface VendorWithMenus extends FoodVendorProfile {
  menu_items?: FoodMenuItem[];
}

const FoodDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<VendorWithMenus[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorWithMenus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    fetchVendors();
    loadCartCount();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchQuery, vendors]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      setError('');

      const vendorData = await foodApi.getPublicVendorsWithMenus();

      // Normalize numeric values from string to number to prevent .toFixed() crash
      const normalized = (vendorData || []).map(v => ({
        ...v,
        average_rating: Number(v.average_rating) || 0,
        delivery_fee: Number(v.delivery_fee) || 0,
        minimum_order_amount: Number(v.minimum_order_amount) || 0,
        estimated_preparation_time: Number(v.estimated_preparation_time) || 0,
        menu_items: v.menu_items?.map(i => ({
          ...i,
          price: Number(i.price) || 0
        }))
      }));

      setVendors(normalized);
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to load food vendors');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVendors = () => {
    if (!searchQuery.trim()) {
      setFilteredVendors(vendors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vendors.filter(
      vendor =>
        vendor.business_name?.toLowerCase().includes(query) ||
        vendor.specialty?.toLowerCase().includes(query) ||
        vendor.location?.toLowerCase().includes(query) ||
        vendor.cuisines?.some(cuisine => cuisine.toLowerCase().includes(query)) ||
        vendor.menu_items?.some(menu => menu.name.toLowerCase().includes(query))
    );
    setFilteredVendors(filtered);
  };

  const loadCartCount = () => {
    try {
      const cart = localStorage.getItem('food_cart');
      if (cart) {
        const cartData = JSON.parse(cart);
        const totalItems =
          cartData.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        setCartItems(totalItems);
      }
    } catch {
      setCartItems(0);
    }
  };

  const handleViewMenu = (vendorId: number) => {
    navigate(`/food-vendor/${vendorId}`);
  };

  const handleViewCart = () => {
    navigate('/food-cart');
  };

  const formatDeliveryFee = (fee?: number | string) => {
    const numericFee = Number(fee);
    if (!numericFee || numericFee === 0) return 'Free';
    return `₦${numericFee.toLocaleString()}`;
  };

  const formatRating = (rating?: number | string) => {
    const numericRating = Number(rating);
    if (isNaN(numericRating)) return '0.0';
    return numericRating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Food Delivery</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>Nigeria</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={handleViewCart}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Vendor List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading food vendors...</p>
            </div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No vendors found' : 'No food vendors available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Check back later for available food vendors'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery
                  ? `Search Results (${filteredVendors.length})`
                  : `Available Restaurants (${filteredVendors.length})`}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map(vendor => (
                <div
                  key={vendor.vendor_id || vendor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleViewMenu(vendor.vendor_id || vendor.id)}
                >
                  {/* Vendor Banner */}
                  <div className="relative">
                    <img
                      src={
                        vendor.logo ||
                        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'
                      }
                      alt={vendor.business_name}
                      className="w-full h-48 object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500';
                      }}
                    />
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${
                        vendor.is_open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {vendor.is_open ? '✓ Open Now' : 'Closed'}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold">
                        {formatRating(vendor.average_rating)}
                      </span>
                    </div>
                  </div>

                  {/* Vendor Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {vendor.business_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{vendor.specialty}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{vendor.estimated_preparation_time || 30} mins</span>
                      </div>
                      <div>Fee: {formatDeliveryFee(vendor.delivery_fee)}</div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin size={14} />
                      <span className="truncate">{vendor.location}</span>
                    </div>

                    {/* Menu Preview */}
                    {vendor.menu_items && vendor.menu_items.length > 0 && (
                      <div className="border-t border-gray-100 pt-3 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Popular Items
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {vendor.menu_items.slice(0, 3).map(item => (
                            <div key={item.id} className="text-center">
                              <img
                                src={item.image || 'https://via.placeholder.com/100'}
                                alt={item.name}
                                className="w-full h-20 object-cover rounded-lg mb-1"
                              />
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-green-600 font-semibold">
                                ₦{Number(item.price || 0).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className={`w-full font-semibold py-3 rounded-xl transition-colors ${
                        vendor.is_open
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!vendor.is_open}
                      onClick={e => {
                        e.stopPropagation();
                        handleViewMenu(vendor.vendor_id || vendor.id);
                      }}
                    >
                      {vendor.is_open ? 'View Full Menu' : 'Currently Closed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FoodDelivery;

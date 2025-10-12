import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Star, Search, ShoppingCart, UtensilsCrossed, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { foodApi, FoodVendorProfile } from '../services/foodApi';

const FoodDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<FoodVendorProfile[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<FoodVendorProfile[]>([]);
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

  // Replace the fetchVendors function:

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await foodApi.getPublicVendors();
      
      // The response is directly an array, not wrapped in data
      const vendorList = Array.isArray(response) ? response : [];
      console.log('Fetched vendors:', vendorList); // Debug log
      setVendors(vendorList);
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
    const filtered = vendors.filter(vendor =>
      vendor.business_name?.toLowerCase().includes(query) ||
      vendor.specialty?.toLowerCase().includes(query) ||
      vendor.location?.toLowerCase().includes(query) ||
      vendor.cuisines?.some(cuisine => cuisine.toLowerCase().includes(query))
    );
    setFilteredVendors(filtered);
  };

  const loadCartCount = () => {
    try {
      const cart = localStorage.getItem('food_cart');
      if (cart) {
        const cartData = JSON.parse(cart);
        const totalItems = cartData.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
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

  const formatDeliveryFee = (fee?: number) => {
    if (!fee || fee === 0) return 'Free';
    return `₦${fee.toLocaleString()}`;
  };

  const formatRating = (rating?: number) => {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

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
                {searchQuery ? `Search Results (${filteredVendors.length})` : `Available Restaurants (${filteredVendors.length})`}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleViewMenu(vendor.vendor_id)}
                >
                  <div className="relative">
                    <img
                      src={vendor.logo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'}
                      alt={vendor.business_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500';
                      }}
                    />
                    {vendor.is_open && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        ✓ Open Now
                      </div>
                    )}
                    {!vendor.is_open && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Closed
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold">{formatRating(vendor.average_rating)}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.business_name}</h3>
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

                    {vendor.cuisines && vendor.cuisines.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {vendor.cuisines.slice(0, 3).map((cuisine, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {cuisine}
                            </span>
                          ))}
                          {vendor.cuisines.length > 3 && (
                            <span className="text-gray-500 text-xs">+{vendor.cuisines.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {vendor.minimum_order_amount && vendor.minimum_order_amount > 0 && (
                      <div className="text-xs text-gray-500 mb-3">
                        Min. order: ₦{vendor.minimum_order_amount.toLocaleString()}
                      </div>
                    )}

                    {vendor.total_orders !== undefined && vendor.total_orders > 0 && (
                      <div className="text-xs text-gray-500 mb-3">
                        {vendor.total_orders} orders completed
                      </div>
                    )}

                    <button
                      className={`w-full font-semibold py-3 rounded-xl transition-colors ${
                        vendor.is_open
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!vendor.is_open}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewMenu(vendor.vendor_id);
                      }}
                    >
                      {vendor.is_open ? 'View Menu' : 'Currently Closed'}
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

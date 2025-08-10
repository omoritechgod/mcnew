import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Star, Filter, Search, ShoppingCart, UtensilsCrossed, Coffee, IceCream, Pizza } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FoodDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);

  const categories = [
    { id: 'all', name: 'All', icon: <UtensilsCrossed size={16} /> },
    { id: 'fast-food', name: 'Fast Food', icon: <Pizza size={16} /> },
    { id: 'local', name: 'Local Dishes', icon: <Coffee size={16} /> },
    { id: 'drinks', name: 'Drinks', icon: <Coffee size={16} /> },
    { id: 'desserts', name: 'Desserts', icon: <IceCream size={16} /> },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Mama's Kitchen",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500",
      rating: 4.8,
      deliveryTime: "25-35 min",
      deliveryFee: "₦200",
      category: "local",
      isVerified: true,
      specialties: ["Jollof Rice", "Pepper Soup", "Fried Rice"]
    },
    {
      id: 2,
      name: "Quick Bites",
      image: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=500",
      rating: 4.5,
      deliveryTime: "15-25 min",
      deliveryFee: "₦150",
      category: "fast-food",
      isVerified: true,
      specialties: ["Burgers", "Shawarma", "Pizza"]
    },
    {
      id: 3,
      name: "Sweet Treats",
      image: "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=500",
      rating: 4.7,
      deliveryTime: "20-30 min",
      deliveryFee: "₦100",
      category: "desserts",
      isVerified: true,
      specialties: ["Cakes", "Ice Cream", "Pastries"]
    }
  ];

  const featuredDeals = [
    {
      id: 1,
      title: "Free Delivery Weekend",
      description: "Get free delivery on orders above ₦2,000",
      discount: "Free Delivery",
      image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=500"
    },
    {
      id: 2,
      title: "Local Food Festival",
      description: "20% off on all local dishes",
      discount: "20% OFF",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500"
    }
  ];

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
                  <span>Plot 30 Ngari street off rumualogu ,Owhipa Choba ,Port Harcourt,Rivers state</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
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
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for restaurants or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Featured Deals */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredDeals.map((deal) => (
              <div key={deal.id} className="relative rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="p-6 text-white">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 inline-block">
                      {deal.discount}
                    </div>
                    <h3 className="text-lg font-bold mb-1">{deal.title}</h3>
                    <p className="text-sm opacity-90">{deal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                {restaurant.isVerified && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ✓ Verified
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">{restaurant.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div>Delivery: {restaurant.deliveryFee}</div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.specialties.slice(0, 2).map((specialty, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                    {restaurant.specialties.length > 2 && (
                      <span className="text-gray-500 text-xs">+{restaurant.specialties.length - 2} more</span>
                    )}
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {restaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              <UtensilsCrossed className="mx-auto text-gray-400" size={64} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDelivery;
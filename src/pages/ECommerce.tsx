import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ECommerce: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home & Garden', icon: '🏠' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
  ];

  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      category: "electronics",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500",
      price: "₦850,000",
      originalPrice: "₦900,000",
      rating: 4.8,
      reviews: 124,
      vendor: {
        name: "TechHub Lagos",
        verified: true,
        rating: 4.9
      },
      inStock: true,
      discount: 6,
      features: ["128GB Storage", "Pro Camera", "A16 Bionic Chip"]
    },
    {
      id: 2,
      name: "Nike Air Max 270",
      category: "fashion",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500",
      price: "₦45,000",
      originalPrice: "₦50,000",
      rating: 4.6,
      reviews: 89,
      vendor: {
        name: "Sneaker Palace",
        verified: true,
        rating: 4.7
      },
      inStock: true,
      discount: 10,
      features: ["Air Max Technology", "Breathable Mesh", "Durable Sole"]
    },
    {
      id: 3,
      name: "MacBook Pro 13-inch",
      category: "electronics",
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500",
      price: "₦1,200,000",
      originalPrice: null,
      rating: 4.9,
      reviews: 67,
      vendor: {
        name: "Apple Store Lagos",
        verified: true,
        rating: 4.9
      },
      inStock: true,
      discount: 0,
      features: ["M2 Chip", "8GB RAM", "256GB SSD"]
    },
    {
      id: 4,
      name: "Wireless Bluetooth Headphones",
      category: "electronics",
      image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
      price: "₦25,000",
      originalPrice: "₦35,000",
      rating: 4.4,
      reviews: 156,
      vendor: {
        name: "Audio World",
        verified: true,
        rating: 4.6
      },
      inStock: true,
      discount: 29,
      features: ["Noise Cancelling", "30hr Battery", "Quick Charge"]
    },
    {
      id: 5,
      name: "Designer Handbag",
      category: "fashion",
      image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500",
      price: "₦35,000",
      originalPrice: null,
      rating: 4.7,
      reviews: 43,
      vendor: {
        name: "Fashion Forward",
        verified: true,
        rating: 4.8
      },
      inStock: true,
      discount: 0,
      features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"]
    },
    {
      id: 6,
      name: "Smart Home Security Camera",
      category: "home",
      image: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=500",
      price: "₦18,000",
      originalPrice: "₦22,000",
      rating: 4.5,
      reviews: 78,
      vendor: {
        name: "Smart Home Solutions",
        verified: true,
        rating: 4.7
      },
      inStock: true,
      discount: 18,
      features: ["1080p HD", "Night Vision", "Motion Detection"]
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (productId: number) => {
    setCartItems(prev => prev + 1);
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
                <h1 className="text-xl font-bold text-gray-900">E-Commerce</h1>
                <div className="text-sm text-gray-600">Shop from verified vendors</div>
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
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>Filters</span>
          </button>
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
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Verified Vendor Badge */}
                {product.vendor.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ✓ Verified
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {/* Vendor Info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">{product.vendor.name}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{product.vendor.rating}</span>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                    {product.features.length > 2 && (
                      <span className="text-gray-500 text-xs">+{product.features.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECommerce;
// src/pages/ECommerce.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye,
  Package,
  Loader2,
  X,
  MapPin
} from 'lucide-react';
import { productApi, Product, SEEDED_CATEGORIES, MarketplaceFilters } from '../services/productApi';
import { cartApi } from '../services/cartApi';

const ECommerce: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<MarketplaceFilters>({
    category: searchParams.get('category') || '',
    q: searchParams.get('q') || '',
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    condition: searchParams.get('condition') as any || undefined,
    sort: searchParams.get('sort') as any || 'newest',
    page: 1,
    per_page: 20,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getMarketplaceProducts(filters);
      setProducts(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        total: response.meta.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const summary = await cartApi.getCartSummary();
      setCartCount(summary.totalItems);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFiltersInUrl();
  };

  const updateFiltersInUrl = () => {
    const params: any = {};
    if (filters.category) params.category = filters.category;
    if (filters.q) params.q = filters.q;
    if (filters.price_min) params.price_min = filters.price_min.toString();
    if (filters.price_max) params.price_max = filters.price_max.toString();
    if (filters.condition) params.condition = filters.condition;
    if (filters.sort) params.sort = filters.sort;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      q: '',
      price_min: undefined,
      price_max: undefined,
      condition: undefined,
      sort: 'newest',
      page: 1,
      per_page: 20,
    });
    setSearchParams({});
  };

  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await cartApi.addToCart({ product_id: productId, quantity: 1 });
      alert('Added to cart!');
      fetchCartCount();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      'phones-tablets': '📱',
      'electronics': '💻',
      'vehicles': '🚗',
      'property': '🏠',
      'home-furniture-appliances': '🛋️',
      'health-beauty': '💄',
      'fashion': '👕',
      'sports-arts-outdoors': '⚽',
      'jobs': '💼',
      'services': '🔧',
      'pets': '🐾',
      'babies-kids': '👶',
      'agriculture-food': '🌾',
      'commercial-equipment-tools': '🔨',
    };
    return icons[slug] || '🛍️';
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    return (
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
        onClick={() => navigate(`/ecommerce/product/${product.id}`)}
      >
        <div className="relative">
          <img 
            src={product.thumbnail || product.images?.[0] || '/placeholder.svg'} 
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Condition Badge */}
          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold capitalize">
            {product.condition}
          </div>
          
          {/* Verified Vendor Badge */}
          {product.vendor && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ✓ Verified
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Add to wishlist functionality
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <Heart size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ecommerce/product/${product.id}`);
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
          
          {/* Vendor Info */}
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={12} className="text-gray-400" />
            <span className="text-sm text-gray-600">{product.vendor?.business_name || 'Vendor'}</span>
          </div>

          {/* Category */}
          <div className="mb-3">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {product.category?.name}
            </span>
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Package size={14} />
            <span>{product.stock_quantity} left</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-blue-600">₦{price.toLocaleString()}</span>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={(e) => handleAddToCart(product.id, e)}
            disabled={product.stock_quantity === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>
                <div className="text-sm text-gray-600">Shop from verified vendors</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="₦0"
                  value={filters.price_min || ''}
                  onChange={(e) => setFilters({ ...filters, price_min: Number(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="₦1,000,000"
                  value={filters.price_max || ''}
                  onChange={(e) => setFilters({ ...filters, price_max: Number(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={filters.condition || ''}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value as any || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Conditions</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={updateFiltersInUrl}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilters({ ...filters, category: '' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                !filters.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>🛍️</span>
              <span className="font-medium">All Products</span>
            </button>
            {SEEDED_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters({ ...filters, category: category.slug })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  filters.category === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{getCategoryIcon(category.slug)}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${pagination.total} products found`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setFilters({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: Math.min(pagination.last_page, (filters.page || 1) + 1) })}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ECommerce;
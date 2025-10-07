// src/pages/dashboard/product-vendor/index.tsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ProductForm from './ProductForm';
import { Package, DollarSign, TrendingUp, Eye, CreditCard as Edit, Trash2, Plus, Star, ShoppingCart, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { productApi, Product } from '../../../services/productApi';

const ProductVendorDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getVendorProducts();
      setProducts(response.data);
      
      // Calculate stats from products
      const totalProducts = response.data.length;
      const totalValue = response.data.reduce((sum, p) => {
        const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        return sum + (price * p.stock_quantity);
      }, 0);

      setStats({
        totalRevenue: totalValue,
        totalProducts: totalProducts,
        totalOrders: 0, // Will be updated when orders API is integrated
        averageRating: 0 // Will be updated when ratings are available
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(productId);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setSelectedProduct(null);
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      used: 'bg-yellow-100 text-yellow-800',
      refurbished: 'bg-purple-100 text-purple-800',
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Stock Value</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₦{stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Inventory Value</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Products</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Orders</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Coming Soon</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500">Rating</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">N/A</div>
            <div className="text-sm text-gray-600">Coming Soon</div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start selling by adding your first product</p>
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <img
                      src={product.thumbnail || product.images?.[0] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1 truncate">{product.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionBadge(product.condition)}`}>
                            {product.condition}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Price: </span>
                            <span className="font-semibold text-gray-900">
                              ₦{typeof product.price === 'string' ? parseFloat(product.price).toLocaleString() : product.price.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Stock: </span>
                            <span className={`font-semibold ${product.stock_quantity === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {product.stock_quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Category: </span>
                            <span className="font-medium text-gray-900">{product.category?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {product.allow_pickup && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Pickup</span>
                            )}
                            {product.allow_shipping && (
                              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Shipping</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={handleAddProduct}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Plus className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Package className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Inventory</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard/product-vendor/orders'}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">View Orders</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <TrendingUp className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default ProductVendorDashboard;
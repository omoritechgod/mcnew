import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  ShoppingCart,
  Users,
  BarChart3
} from 'lucide-react';

const ProductVendorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProducts: 0,
    totalOrders: 0,
    averageRating: 0
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      category: 'Electronics',
      price: '₦850,000',
      stock: 15,
      sold: 8,
      rating: 4.8,
      status: 'active',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      category: 'Fashion',
      price: '₦45,000',
      stock: 25,
      sold: 12,
      rating: 4.6,
      status: 'active',
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 3,
      name: 'MacBook Pro 13-inch',
      category: 'Electronics',
      price: '₦1,200,000',
      stock: 5,
      sold: 3,
      rating: 4.9,
      status: 'low-stock',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200'
    }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      orderNumber: '#ORD-001',
      customer: 'John Doe',
      product: 'iPhone 14 Pro Max',
      amount: '₦850,000',
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: 2,
      orderNumber: '#ORD-002',
      customer: 'Jane Smith',
      product: 'Nike Air Max 270',
      amount: '₦45,000',
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: 3,
      orderNumber: '#ORD-003',
      customer: 'Mike Johnson',
      product: 'MacBook Pro 13-inch',
      amount: '₦1,200,000',
      status: 'delivered',
      date: '2024-01-13'
    }
  ]);

  useEffect(() => {
    // Simulate fetching vendor stats
    setStats({
      totalRevenue: 2450000,
      totalProducts: 45,
      totalOrders: 128,
      averageRating: 4.7
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

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
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Package className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+5</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+0.3</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                <Plus size={16} />
                Add Product
              </button>
            </div>
            
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{product.category}</span> • 
                        <span className="ml-1">{product.price}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span>Stock: {product.stock}</span>
                          <span>Sold: {product.sold}</span>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
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
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p className="font-medium">{order.product}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{order.amount}</span>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sales Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Monthly Sales</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sales chart will be implemented</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Plus className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Add Product</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Package className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Inventory</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ShoppingCart className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Process Orders</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <TrendingUp className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductVendorDashboard;

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  UtensilsCrossed, 
  DollarSign, 
  Package, 
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users
} from 'lucide-react';

const FoodVendorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalMenuItems: 0,
    totalOrders: 0,
    averageRating: 0
  });

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Jollof Rice with Chicken',
      category: 'Main Course',
      price: '₦2,500',
      preparationTime: '25 mins',
      orders: 45,
      rating: 4.8,
      status: 'available',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 2,
      name: 'Pepper Soup',
      category: 'Soup',
      price: '₦1,800',
      preparationTime: '20 mins',
      orders: 32,
      rating: 4.9,
      status: 'available',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: 3,
      name: 'Fried Rice',
      category: 'Main Course',
      price: '₦2,200',
      preparationTime: '30 mins',
      orders: 28,
      rating: 4.6,
      status: 'out-of-stock',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: '#FD-001',
      customer: 'Sarah Johnson',
      items: ['Jollof Rice with Chicken', 'Pepper Soup'],
      amount: '₦4,300',
      status: 'preparing',
      orderTime: '10 mins ago',
      deliveryTime: '25 mins'
    },
    {
      id: 2,
      orderNumber: '#FD-002',
      customer: 'David Okafor',
      items: ['Fried Rice', 'Chicken'],
      amount: '₦3,500',
      status: 'ready',
      orderTime: '15 mins ago',
      deliveryTime: '5 mins'
    },
    {
      id: 3,
      orderNumber: '#FD-003',
      customer: 'Mary Adebayo',
      items: ['Jollof Rice with Chicken'],
      amount: '₦2,500',
      status: 'new',
      orderTime: '2 mins ago',
      deliveryTime: '30 mins'
    }
  ]);

  useEffect(() => {
    // Simulate fetching food vendor stats
    setStats({
      totalRevenue: 185000,
      totalMenuItems: 24,
      totalOrders: 105,
      averageRating: 4.7
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteMenuItem = (itemId: number) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAcceptOrder = (orderId: number) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'preparing' }
          : order
      )
    );
  };

  const handleMarkReady = (orderId: number) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'ready' }
          : order
      )
    );
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
              <span className="text-sm font-medium text-green-600">+25%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <UtensilsCrossed className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+3</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalMenuItems}</div>
            <div className="text-sm text-gray-600">Menu Items</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Package className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+20%</span>
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
          {/* Menu Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                <Plus size={16} />
                Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.category}</span>
                          <span className="font-semibold text-green-600">{item.price}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {item.preparationTime}
                          </span>
                          <span>{item.orders} orders</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMenuItem(item.id)}
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

          {/* Orders Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {orders.filter(order => order.status === 'new').length} new
              </span>
            </div>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{order.orderNumber}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed size={14} />
                      <span>{order.items.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {order.orderTime}
                      </span>
                      <span className="font-semibold text-green-600">{order.amount}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Estimated delivery: {order.deliveryTime}
                    </div>
                  </div>
                  
                  {order.status === 'new' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptOrder(order.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Accept Order
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}

                  {order.status === 'preparing' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMarkReady(order.id)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Contact Customer
                      </button>
                    </div>
                  )}

                  {order.status === 'ready' && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Waiting for Pickup
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Contact Rider
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sales Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Daily Sales</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={32} className="text-gray-400 mx-auto mb-2" />
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
              <span className="text-sm font-medium">Add Menu Item</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <UtensilsCrossed className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Update Menu</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <CheckCircle className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Mark Available</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <AlertCircle className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Kitchen Status</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FoodVendorDashboard;

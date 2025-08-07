import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  Settings, 
  Bell,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  

  const stats = [
    {
      title: 'Total Revenue',
      value: '₦125,000',
      change: '+12%',
      icon: <DollarSign size={24} className="text-green-600" />
    },
    {
      title: 'Active Listings',
      value: '23',
      change: '+3',
      icon: <Package size={24} className="text-blue-600" />
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8%',
      icon: <Users size={24} className="text-purple-600" />
    },
    {
      title: 'Rating',
      value: '4.8',
      change: '+0.2',
      icon: <Star size={24} className="text-yellow-600" />
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      service: 'House Cleaning',
      amount: '₦15,000',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      service: 'Electrical Repair',
      amount: '₦8,500',
      status: 'in-progress',
      date: '2024-01-14'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      service: 'Plumbing Service',
      amount: '₦12,000',
      status: 'pending',
      date: '2024-01-13'
    }
  ];

  const listings = [
    {
      id: 1,
      title: 'Professional House Cleaning',
      category: 'Cleaning Services',
      price: '₦15,000',
      status: 'active',
      views: 45,
      bookings: 12
    },
    {
      id: 2,
      title: 'Electrical Installation & Repair',
      category: 'Electrical Services',
      price: '₦8,000 - ₦25,000',
      status: 'active',
      views: 32,
      bookings: 8
    },
    {
      id: 3,
      title: 'Plumbing Services',
      category: 'Plumbing',
      price: '₦10,000',
      status: 'pending',
      views: 18,
      bookings: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, John's Services</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => navigate('/dashboard/apartment/listing')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Add Listing
              </button>

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: <BarChart3 size={16} /> },
              { id: 'listings', name: 'My Listings', icon: <Package size={16} /> },
              { id: 'orders', name: 'Orders', icon: <Users size={16} /> },
              { id: 'profile', name: 'Profile', icon: <Settings size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-50 rounded-full p-3">
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600">{order.customer} • {order.service}</div>
                        <div className="text-xs text-gray-500">{order.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{order.amount}</div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart will be implemented with backend data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
              <button
                onClick={() => navigate('/dashboard/apartment/listing')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
              >
                <Plus size={16} />
                Create New Listing
              </button>

            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Service</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Views</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Bookings</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{listing.title}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{listing.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{listing.price}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{listing.views}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{listing.bookings}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600">
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.service}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <div className="font-medium">{order.customer}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <div className="font-medium">{order.amount}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <div className="font-medium">{order.date}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        View Details
                      </button>
                      {order.status === 'pending' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                          Accept Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vendor Profile</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      <input
                        type="text"
                        defaultValue="John's Services"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        defaultValue="john@johnsservices.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        defaultValue="123 Business Street, Lagos, Nigeria"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                    <textarea
                      rows={4}
                      defaultValue="Professional cleaning and maintenance services with over 5 years of experience. We provide reliable, high-quality services for homes and offices."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div>
                      <div className="font-medium text-green-800">Account Verified</div>
                      <div className="text-sm text-green-600">NIN Verified</div>
                    </div>
                    <div className="text-green-600">✓</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div>
                      <div className="font-medium text-green-800">Business Documents</div>
                      <div className="text-sm text-green-600">CAC Verified</div>
                    </div>
                    <div className="text-green-600">✓</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div>
                      <div className="font-medium text-blue-800">Account Status</div>
                      <div className="text-sm text-blue-600">Active & Live</div>
                    </div>
                    <div className="text-blue-600">✓</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600">
                    <strong>Account Rating:</strong> 4.8/5.0
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Total Reviews:</strong> 156
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
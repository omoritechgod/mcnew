import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star,
  Users,
  BarChart3,
  Calendar,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalListings: 0,
    totalCustomers: 0,
    averageRating: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'sale',
      title: 'New order received',
      description: 'Order #12345 from John Doe',
      amount: '₦15,000',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'review',
      title: 'New review received',
      description: '5-star review from Jane Smith',
      rating: 5,
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'listing',
      title: 'Listing updated',
      description: 'Professional Cleaning Service',
      time: '1 day ago'
    }
  ]);

  useEffect(() => {
    // Simulate fetching general vendor stats
    setStats({
      totalRevenue: 125000,
      totalListings: 12,
      totalCustomers: 45,
      averageRating: 4.6
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <DollarSign size={16} className="text-green-600" />;
      case 'review':
        return <Star size={16} className="text-yellow-600" />;
      case 'listing':
        return <Package size={16} className="text-blue-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to your Vendor Dashboard!</h2>
          <p className="text-blue-100">
            Manage your business, track performance, and grow your presence on McDee.
          </p>
        </div>

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
              <span className="text-sm font-medium text-green-600">+3</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalListings}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+8</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCustomers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+0.2</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                  <div className="bg-gray-50 rounded-full p-2">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      {activity.amount && (
                        <span className="font-semibold text-green-600">{activity.amount}</span>
                      )}
                      {activity.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(activity.rating)].map((_, i) => (
                            <Star key={i} size={12} className="text-yellow-500 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Performance chart will be implemented</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">85%</div>
                <div className="text-sm text-blue-700">Response Rate</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">92%</div>
                <div className="text-sm text-green-700">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Action Items</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-600" size={20} />
                <div>
                  <h4 className="font-medium text-yellow-800">Complete your profile</h4>
                  <p className="text-sm text-yellow-700">Add more details to improve your visibility</p>
                </div>
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Complete
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={20} />
                <div>
                  <h4 className="font-medium text-blue-800">Add more listings</h4>
                  <p className="text-sm text-blue-700">Increase your earning potential with more services</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Add Listing
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <h4 className="font-medium text-green-800">Verification complete</h4>
                  <p className="text-sm text-green-700">Your account is verified and ready to go</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">✓ Done</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Package className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Listings</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Users className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">View Customers</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <BarChart3 className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Analytics</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Settings className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
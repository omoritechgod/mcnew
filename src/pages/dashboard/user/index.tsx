import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Wallet, 
  Package, 
  Car, 
  Star, 
  TrendingUp, 
  Clock,
  MapPin,
  CreditCard,
  ShoppingBag,
  Calendar
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    totalRides: 0,
    walletBalance: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'ride',
      title: 'Ride to Victoria Island',
      amount: '₦1,200',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'order',
      title: 'Food Order - Mama\'s Kitchen',
      amount: '₦3,500',
      date: '2024-01-14',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'service',
      title: 'House Cleaning Service',
      amount: '₦15,000',
      date: '2024-01-13',
      status: 'completed'
    }
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 1,
      service: 'Service Apartment',
      location: 'Lekki Phase 1',
      date: '2024-01-20',
      time: '2:00 PM',
      amount: '₦25,000'
    },
    {
      id: 2,
      service: 'Auto Maintenance',
      location: 'Ikeja Workshop',
      date: '2024-01-22',
      time: '10:00 AM',
      amount: '₦12,000'
    }
  ]);

  useEffect(() => {
    // Simulate fetching user stats
    setStats({
      totalSpent: 125000,
      totalOrders: 23,
      totalRides: 45,
      walletBalance: 15000
    });
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <Car size={16} className="text-blue-600" />;
      case 'order':
        return <ShoppingBag size={16} className="text-green-600" />;
      case 'service':
        return <Package size={16} className="text-purple-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Wallet className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.walletBalance.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Wallet Balance</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <Package className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Car className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRides}</div>
            <div className="text-sm text-gray-600">Total Rides</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Spent</div>
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
                <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 rounded-full p-2">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-500">{activity.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{activity.amount}</div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{booking.service}</h4>
                    <span className="font-semibold text-blue-600">{booking.amount}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Car className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Book Ride</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ShoppingBag className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Order Food</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Package className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Shop Products</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <CreditCard className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Add Money</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
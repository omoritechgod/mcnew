import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Wrench, 
  DollarSign, 
  Calendar, 
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const ServiceVendorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalServices: 0,
    totalBookings: 0,
    averageRating: 0
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Professional House Cleaning',
      category: 'Cleaning',
      price: '₦15,000',
      duration: '3-4 hours',
      bookings: 24,
      rating: 4.9,
      status: 'active'
    },
    {
      id: 2,
      name: 'Electrical Installation & Repair',
      category: 'Electrical',
      price: '₦8,000 - ₦25,000',
      duration: '2-6 hours',
      bookings: 18,
      rating: 4.7,
      status: 'active'
    },
    {
      id: 3,
      name: 'Plumbing Services',
      category: 'Plumbing',
      price: '₦10,000',
      duration: '2-3 hours',
      bookings: 12,
      rating: 4.8,
      status: 'paused'
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Professional House Cleaning',
      customer: 'Sarah Johnson',
      date: '2024-01-16',
      time: '10:00 AM',
      location: 'Victoria Island, Lagos',
      amount: '₦15,000',
      status: 'confirmed'
    },
    {
      id: 2,
      service: 'Electrical Repair',
      customer: 'David Okafor',
      date: '2024-01-16',
      time: '2:00 PM',
      location: 'Ikeja, Lagos',
      amount: '₦12,000',
      status: 'pending'
    },
    {
      id: 3,
      service: 'Plumbing Services',
      customer: 'Mary Adebayo',
      date: '2024-01-17',
      time: '9:00 AM',
      location: 'Lekki, Lagos',
      amount: '₦10,000',
      status: 'confirmed'
    }
  ]);

  useEffect(() => {
    // Simulate fetching service vendor stats
    setStats({
      totalEarnings: 285000,
      totalServices: 8,
      totalBookings: 54,
      averageRating: 4.8
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleAcceptBooking = (bookingId: number) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' }
          : booking
      )
    );
  };

  const handleRejectBooking = (bookingId: number) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
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
              <span className="text-sm font-medium text-green-600">+22%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Wrench className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+2</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalServices}</div>
            <div className="text-sm text-gray-600">Active Services</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
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
          {/* Services Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                <Plus size={16} />
                Add Service
              </button>
            </div>
            
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{service.category}</span>
                      <span className="font-semibold text-green-600">{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {service.duration}
                      </span>
                      <span>{service.bookings} bookings</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{booking.service}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>{booking.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{booking.date} at {booking.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{booking.location}</span>
                      <span className="font-semibold text-green-600">{booking.amount}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRejectBooking(booking.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Start Service
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Contact
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Monthly Bookings</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Bookings chart will be implemented</p>
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
              <span className="text-sm font-medium">Add Service</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Calendar className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Schedule</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <CheckCircle className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Mark Available</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <AlertCircle className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Emergency Support</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceVendorDashboard;

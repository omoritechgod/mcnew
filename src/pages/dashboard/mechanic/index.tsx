import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Wrench, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const MechanicDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    activeRequests: 0,
    rating: 0
  });

  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      serviceType: 'Engine Repair',
      location: 'Victoria Island, Lagos',
      requestedTime: '2024-01-16 10:00 AM',
      estimatedCost: '₦25,000',
      status: 'pending',
      urgency: 'high',
      description: 'Car engine making strange noises and overheating'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      serviceType: 'Oil Change',
      location: 'Ikeja, Lagos',
      requestedTime: '2024-01-16 2:00 PM',
      estimatedCost: '₦8,000',
      status: 'accepted',
      urgency: 'medium',
      description: 'Regular oil change service needed'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      serviceType: 'Brake Repair',
      location: 'Lekki, Lagos',
      requestedTime: '2024-01-17 9:00 AM',
      estimatedCost: '₦15,000',
      status: 'pending',
      urgency: 'high',
      description: 'Brake pads need replacement, making squeaking noise'
    }
  ]);

  const [recentJobs, setRecentJobs] = useState([
    {
      id: 1,
      customerName: 'Alice Brown',
      serviceType: 'AC Repair',
      completedDate: '2024-01-15',
      amount: '₦18,000',
      rating: 5
    },
    {
      id: 2,
      customerName: 'Bob Wilson',
      serviceType: 'Engine Diagnostics',
      completedDate: '2024-01-14',
      amount: '₦12,000',
      rating: 4
    }
  ]);

  useEffect(() => {
    // Simulate fetching mechanic stats
    // Initialize with zero values - will be updated when backend data is fetched
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call to your Laravel backend
        // const response = await fetch('/api/mechanic/dashboard-summary', {
        //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        // });
        // const data = await response.json();
        
        // For now, set to zero until backend is connected
        setStats({
          totalEarnings: 0, // data.totalEarnings || 0
          completedJobs: 0, // data.completedJobs || 0
          activeRequests: 0, // data.activeRequests || 0
          rating: 0 // data.rating || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default zero values on error
        setStats({
          totalEarnings: 0,
          completedJobs: 0,
          activeRequests: 0,
          rating: 0
        });
      }
    };
    
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptRequest = (requestId: number) => {
    setServiceRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'accepted' }
          : request
      )
    );
  };

  const handleRejectRequest = (requestId: number) => {
    setServiceRequests(prev => 
      prev.filter(request => request.id !== requestId)
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
              <span className="text-sm font-medium text-green-600">+15%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ₦{stats.totalEarnings > 0 ? stats.totalEarnings.toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Wrench className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+8%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.completedJobs > 0 ? stats.completedJobs : '0'}
            </div>
            <div className="text-sm text-gray-600">Completed Jobs</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <Clock className="text-orange-600" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-600">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.activeRequests > 0 ? stats.activeRequests : '0'}
            </div>
            <div className="text-sm text-gray-600">Active Requests</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+0.2</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rating > 0 ? stats.rating.toFixed(1) : '0.0'}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {serviceRequests.length} pending
              </span>
            </div>
            
            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{request.serviceType}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>{request.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{request.requestedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      <span>{request.estimatedCost}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{request.description}</p>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Decline
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Phone size={16} />
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Start Job
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Phone size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{job.serviceType}</h4>
                    <span className="font-semibold text-green-600">{job.amount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{job.customerName}</span>
                    <span>{job.completedDate}</span>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${i < job.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({job.rating}/5)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Monthly Performance</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Performance chart will be implemented</p>
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
              <CheckCircle className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Mark Available</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Clock className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Set Schedule</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Wrench className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Update Services</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <AlertCircle className="text-red-600 mb-2" size={24} />
              <span className="text-sm font-medium">Emergency Mode</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MechanicDashboard;
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Car, 
  DollarSign, 
  Clock, 
  Star,
  MapPin,
  Navigation,
  Phone,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

const RiderDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalRides: 0,
    rating: 0,
    onlineTime: 0
  });

  const [rideRequests, setRideRequests] = useState([
    {
      id: 1,
      passengerName: 'Sarah Johnson',
      pickup: 'Victoria Island, Lagos',
      destination: 'Ikeja GRA, Lagos',
      distance: '12.5 km',
      estimatedFare: '₦1,200',
      estimatedTime: '25 mins',
      requestTime: '2 mins ago',
      passengerRating: 4.8
    },
    {
      id: 2,
      passengerName: 'David Okafor',
      pickup: 'Lekki Phase 1, Lagos',
      destination: 'Marina, Lagos',
      distance: '18.2 km',
      estimatedFare: '₦1,800',
      estimatedTime: '35 mins',
      requestTime: '5 mins ago',
      passengerRating: 4.6
    }
  ]);

  const [recentRides, setRecentRides] = useState([
    {
      id: 1,
      passengerName: 'John Doe',
      route: 'VI → Ikeja',
      completedTime: '1 hour ago',
      fare: '₦1,500',
      rating: 5,
      distance: '15.2 km'
    },
    {
      id: 2,
      passengerName: 'Jane Smith',
      route: 'Lekki → Surulere',
      completedTime: '3 hours ago',
      fare: '₦2,200',
      rating: 4,
      distance: '22.1 km'
    }
  ]);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Simulate fetching rider stats
    setStats({
      todayEarnings: 15600,
      totalRides: 8,
      rating: 4.9,
      onlineTime: 6.5
    });
  }, []);

  const handleAcceptRide = (rideId: number) => {
    const acceptedRide = rideRequests.find(ride => ride.id === rideId);
    if (acceptedRide) {
      setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
      // In a real app, this would navigate to the ride tracking screen
      console.log('Accepted ride:', acceptedRide);
    }
  };

  const handleDeclineRide = (rideId: number) => {
    setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Online Status Toggle */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Ready to accept ride requests' : 'Not accepting ride requests'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                isOnline 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+₦2,400</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.todayEarnings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Today's Earnings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Car className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+3</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRides}</div>
            <div className="text-sm text-gray-600">Rides Today</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="text-yellow-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+0.1</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.rating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Clock className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-blue-600">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.onlineTime}h</div>
            <div className="text-sm text-gray-600">Online Time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ride Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ride Requests</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {rideRequests.length} pending
              </span>
            </div>
            
            {isOnline ? (
              <div className="space-y-4">
                {rideRequests.length > 0 ? (
                  rideRequests.map((request) => (
                    <div key={request.id} className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{request.passengerName}</h4>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{request.passengerRating}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Pickup:</span>
                          <span>{request.pickup}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Drop-off:</span>
                          <span>{request.destination}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Navigation size={14} />
                            {request.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {request.estimatedTime}
                          </span>
                          <span className="font-semibold text-green-600">{request.estimatedFare}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>Requested {request.requestTime}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAcceptRide(request.id)}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Accept Ride
                        </button>
                        <button 
                          onClick={() => handleDeclineRide(request.id)}
                          className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Decline
                        </button>
                        <button className="px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Car className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No ride requests</h4>
                    <p className="text-gray-600">Stay online to receive ride requests from passengers</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="text-lg font-medium text-gray-900 mb-2">You're offline</h4>
                <p className="text-gray-600">Go online to start receiving ride requests</p>
              </div>
            )}
          </div>

          {/* Recent Rides */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Rides</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{ride.passengerName}</h4>
                    <span className="font-semibold text-green-600">{ride.fare}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{ride.route}</span>
                    <span>{ride.distance}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{ride.completedTime}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({ride.rating})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Earnings Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Weekly Earnings</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Earnings chart will be implemented</p>
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
              <MapPin className="text-blue-600 mb-2" size={24} />
              <span className="text-sm font-medium">Set Location</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Calendar className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">View Schedule</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <DollarSign className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Earnings Report</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Users className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Passenger History</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiderDashboard;
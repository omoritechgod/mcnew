import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, User, Star, Navigation, Phone, Locate, Shield, CheckCircle, AlertCircle, MessageCircle, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface Rider {
  id: number;
  name: string;
  rating: number;
  completedRides: number;
  estimatedTime: string;
  distance: string;
  fare: string;
  image: string;
  bikeModel: string;
  plateNumber: string;
  isOnline: boolean;
  location: Location;
  eta: number;
}

type RideStatus = 'booking' | 'searching' | 'found' | 'pickup' | 'ongoing' | 'completed';

const RideHailing: React.FC = () => {
  const navigate = useNavigate();
  const [rideStatus, setRideStatus] = useState<RideStatus>('booking');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRider, setSelectedRider] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const nearbyRiders: Rider[] = [
    {
      id: 1,
      name: "Ibrahim Okada",
      rating: 4.8,
      completedRides: 1250,
      estimatedTime: "3 min",
      distance: "0.5 km",
      fare: "₦800",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      bikeModel: "Bajaj Pulsar 200",
      plateNumber: "ABC-123-XY",
      isOnline: true,
      location: { lat: 6.5244, lng: 3.3792 },
      eta: 5
    },
    {
      id: 2,
      name: "Adebayo Johnson",
      rating: 4.9,
      completedRides: 980,
      estimatedTime: "5 min",
      distance: "0.8 km",
      fare: "₦750",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      bikeModel: "Honda CB150",
      plateNumber: "XYZ-456-AB",
      isOnline: true,
      location: { lat: 6.5344, lng: 3.3892 },
      eta: 3
    },
    {
      id: 3,
      name: "Emeka Okafor",
      rating: 4.7,
      completedRides: 756,
      estimatedTime: "7 min",
      distance: "1.2 km",
      fare: "₦900",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
      bikeModel: "TVS Apache",
      plateNumber: "DEF-789-CD",
      isOnline: true,
      location: { lat: 6.5144, lng: 3.3692 },
      eta: 7
    }
  ];

  const recentLocations = [
    { name: "Victoria Island", address: "Lagos Island, Lagos" },
    { name: "Ikeja GRA", address: "Ikeja, Lagos" },
    { name: "Lekki Phase 1", address: "Lekki, Lagos" },
    { name: "Yaba", address: "Yaba, Lagos" },
    { name: "Surulere", address: "Surulere, Lagos" }
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setPickupLocation("Current Location");
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert("Unable to get your location. Please enter manually.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert("Geolocation is not supported by this browser.");
    }
  };

  const calculateFare = (distance: number) => {
    const baseFare = 200;
    const perKmRate = 80;
    return Math.round(baseFare + (distance * perKmRate));
  };

  const calculateTime = (distance: number) => {
    return Math.round((distance / 25) * 60);
  };

  const handleBookRide = () => {
    if (!pickupLocation || !destination) return;

    const mockDistance = Math.random() * 15 + 2;
    const fare = calculateFare(mockDistance);
    const time = calculateTime(mockDistance);
    
    setEstimatedFare(fare);
    setEstimatedTime(time);
    setRideStatus('searching');
    
    // Simulate finding a rider
    setTimeout(() => {
      setRideStatus('found');
    }, 3000);
  };

  const handleAcceptRide = (riderId: number) => {
    setSelectedRider(riderId);
    setRideStatus('pickup');
    
    // Simulate driver arrival
    setTimeout(() => {
      setRideStatus('ongoing');
    }, 10000);
    
    // Simulate trip completion
    setTimeout(() => {
      setRideStatus('completed');
    }, 20000);
  };

  const resetRide = () => {
    setRideStatus('booking');
    setSelectedRider(null);
    setPickupLocation('');
    setDestination('');
    setEstimatedFare(0);
    setEstimatedTime(0);
  };

  const getRideStatusMessage = () => {
    switch (rideStatus) {
      case 'searching':
        return 'Searching for nearby riders...';
      case 'found':
        return 'Riders found! Choose your preferred rider';
      case 'pickup':
        return 'Rider is on the way to your location';
      case 'ongoing':
        return 'Ride in progress to destination';
      case 'completed':
        return 'Ride completed successfully!';
      default:
        return 'Ready to book your ride';
    }
  };

  const getStatusColor = (status: RideStatus) => {
    switch (status) {
      case 'booking':
        return 'bg-gray-100 text-gray-800';
      case 'searching':
        return 'bg-yellow-100 text-yellow-800';
      case 'found':
        return 'bg-blue-100 text-blue-800';
      case 'pickup':
        return 'bg-orange-100 text-orange-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-[#043873] to-[#3B82F6] rounded-lg p-2 mr-3">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#043873]">McDee Okada</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Information - Moved from header */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-600" />
            <span className="text-gray-600">Lagos, Nigeria</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rideStatus)}`}>
              {getRideStatusMessage()}
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Safe Rides
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Booking Form or Status */}
          <div className="space-y-6">
            {/* Booking Form */}
            {rideStatus === 'booking' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <Bike className="w-6 h-6 mr-3 text-[#043873]" />
                  <div>
                    <h2 className="text-2xl font-bold text-[#043873]">Book Your Okada Ride</h2>
                    <p className="text-gray-600">Fast, reliable motorcycle rides across the city</p>
                  </div>
                </div>
                
                {/* Location Inputs */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></div>
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043873] focus:border-transparent"
                    />
                    <button
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[#043873] hover:text-[#043873]/70 disabled:opacity-50"
                      title="Use current location"
                    >
                      <Locate size={20} className={isLoadingLocation ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043873] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Fare Estimate */}
                <div className="bg-gradient-to-r from-[#043873]/10 to-[#3B82F6]/10 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <span className="text-[#043873] mr-2">💰</span>
                      <span>Base Fare: ₦200</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-[#3B82F6] mr-2" />
                      <span>Rate: ₦80/km</span>
                    </div>
                  </div>
                </div>

                {/* Safety Notice */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Safety First</p>
                      <p>All our riders are verified and insured. Always wear the provided helmet.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookRide}
                  disabled={!pickupLocation || !destination}
                  className="w-full bg-[#043873] hover:bg-[#043873]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Bike className="w-4 h-4" />
                  Book Okada Ride
                </button>

                {/* Popular Destinations */}
                {!pickupLocation && !destination && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Recent locations</p>
                    <div className="space-y-2">
                      {recentLocations.map((location, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setPickupLocation(location.name)}
                        >
                          <div className="font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-600">{location.address}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Searching Status */}
            {rideStatus === 'searching' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#043873] mr-3"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#043873]">Finding Your Rider</h2>
                    <p className="text-gray-600">Searching for nearby okada riders...</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Destination</span>
                    <span className="text-gray-600">{destination}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Estimated Fare</span>
                    <span className="font-bold text-[#043873]">₦{estimatedFare}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Estimated Time</span>
                    <span className="text-gray-600">{estimatedTime} mins</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center mt-4">
                  Please wait while we connect you with a nearby rider
                </p>
              </div>
            )}

            {/* Available Riders */}
            {rideStatus === 'found' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#043873]">Available Riders</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{nearbyRiders.length} riders nearby</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {nearbyRiders.map((rider) => (
                    <div key={rider.id} className="border-2 border-[#043873]/20 rounded-xl p-4 hover:border-[#043873]/40 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={rider.image} 
                              alt={rider.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            {rider.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{rider.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-500 fill-current" />
                                <span className="font-medium">{rider.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{rider.completedRides} rides</span>
                              <span>•</span>
                              <span>{rider.bikeModel}</span>
                            </div>
                            <p className="text-sm text-gray-500">{rider.plateNumber}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-[#043873]">{rider.fare}</div>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{rider.estimatedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation size={12} />
                              <span>{rider.distance} away</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleAcceptRide(rider.id)}
                          className="flex-1 bg-[#043873] hover:bg-[#043873]/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Ride
                        </button>
                        <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rider Coming/Trip Status */}
            {(rideStatus === 'pickup' || rideStatus === 'ongoing') && selectedRider && (() => {
              const rider = nearbyRiders.find(r => r.id === selectedRider);
              return rider ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#043873]/20">
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex items-center">
                      <Bike className="w-5 h-5 mr-2 text-[#043873]" />
                      {rideStatus === 'pickup' ? 'Rider Coming' : 'Trip in Progress'}
                    </span>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={rider.image} 
                      alt={rider.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{rider.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{rider.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{rider.bikeModel}</span>
                      </div>
                      <p className="text-sm text-gray-500">{rider.plateNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#043873] text-lg">₦{estimatedFare}</div>
                      <div className="text-sm text-gray-500">Total Fare</div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        Destination
                      </span>
                      <span className="font-medium">{destination}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        {rideStatus === 'pickup' ? 'Arrival' : 'Trip Time'}
                      </span>
                      <span className="font-medium">
                        {rideStatus === 'pickup' ? '2-3 mins' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mb-4">
                    <button 
                      className={`flex-1 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                        rideStatus === 'pickup' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled
                    >
                      {rideStatus === 'pickup' ? (
                        <>
                          <Navigation className="w-4 h-4" />
                          Rider is Coming
                        </>
                      ) : (
                        <>
                          <Bike className="w-4 h-4" />
                          Trip in Progress
                        </>
                      )}
                    </button>
                    <button className="bg-[#25D366] text-white hover:bg-[#25D366]/90 px-4 py-3 rounded-xl transition-colors">
                      <Phone size={16} />
                    </button>
                    <button className="border border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-xl transition-colors">
                      <MessageCircle size={16} />
                    </button>
                  </div>

                  {/* Safety Info */}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-yellow-800">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="font-medium">Safety: </span>
                      <span className="ml-1">Share trip details with contacts for safety</span>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Completed Status */}
            {rideStatus === 'completed' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center text-green-600 mb-6">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  <div>
                    <h2 className="text-2xl font-bold">Ride Completed!</h2>
                    <p className="text-gray-600">Thank you for riding with us</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total Fare</span>
                    <span className="font-bold text-[#043873] text-lg">₦{estimatedFare}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rider</span>
                    <span className="text-gray-600">{nearbyRiders.find(r => r.id === selectedRider)?.name}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Rate Your Rider</h4>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="border border-gray-300 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={resetRide}
                    className="flex-1 bg-[#043873] hover:bg-[#043873]/90 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Book Another Ride
                  </button>
                  <button 
                    onClick={resetRide}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Safety Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                <h3 className="text-lg font-semibold">Safety Features</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Verified Riders</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>GPS Tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span>Insurance Coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Live Tracking */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-[#043873]" />
                  Live Tracking
                </span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(rideStatus)}`}>
                  {rideStatus === 'booking' ? 'Ready to Track' :
                   rideStatus === 'searching' ? 'Finding Rider' :
                   rideStatus === 'found' ? 'Rider Found' :
                   rideStatus === 'pickup' ? 'Rider Coming' :
                   rideStatus === 'ongoing' ? 'Trip in Progress' :
                   'Trip Completed'}
                </div>
              </div>

              {/* Map Container */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 h-96 flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-2 h-2 bg-[#043873] rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-6 w-1 h-1 bg-[#3B82F6] rounded-full animate-pulse delay-100"></div>
                  <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-[#043873] rounded-full animate-pulse delay-200"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse delay-300"></div>
                </div>

                <div className="text-center z-10">
                  {rideStatus === 'booking' && (
                    <>
                      <MapPin className="w-16 h-16 text-[#043873] mx-auto mb-4" />
                      <p className="text-lg font-medium text-[#043873] mb-2">Ready to Track</p>
                      <p className="text-gray-600">Book a ride to see real-time GPS tracking</p>
                    </>
                  )}

                  {rideStatus === 'searching' && (
                    <>
                      <div className="relative">
                        <Bike className="w-16 h-16 text-[#043873] mx-auto mb-4 animate-pulse" />
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-[#043873] border-opacity-20 rounded-full animate-ping gps-pulse"></div>
                      </div>
                      <p className="text-lg font-medium text-[#043873] mb-2">Searching for Riders</p>
                      <p className="text-gray-600">Scanning GPS for nearby riders...</p>
                    </>
                  )}

                  {(rideStatus === 'found' || rideStatus === 'pickup') && (
                    <>
                      <div className="relative">
                        <div className="flex items-center justify-center space-x-8 mb-4">
                          <MapPin className="w-12 h-12 text-blue-600" />
                          <div className="flex-1 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded animate-pulse"></div>
                          <Bike className="w-12 h-12 text-green-600 animate-bounce" />
                        </div>
                      </div>
                      <p className="text-lg font-medium text-[#043873] mb-2">
                        {rideStatus === 'found' ? 'Rider Available' : 'Rider on the Way'}
                      </p>
                      <p className="text-gray-600">
                        {rideStatus === 'found' ? 'Choose your preferred rider' : 'Live GPS tracking active'}
                      </p>
                    </>
                  )}

                  {rideStatus === 'ongoing' && (
                    <>
                      <div className="relative">
                        <Navigation className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-green-600 border-opacity-30 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-lg font-medium text-green-600 mb-2">Trip in Progress</p>
                      <p className="text-gray-600">Live GPS tracking • Real-time ETA updates</p>
                    </>
                  )}

                  {rideStatus === 'completed' && (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-lg font-medium text-green-600 mb-2">Destination Reached!</p>
                      <p className="text-gray-600">Thank you for riding with McDee Okada</p>
                    </>
                  )}
                </div>
              </div>

              {/* Location Info */}
              {userLocation && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-2 font-medium">GPS Coordinates (Demo)</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Navigation className="w-4 h-4 mr-2" />
                    <span>
                      Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </span>
                  </div>
                  {selectedRider && nearbyRiders.find(r => r.id === selectedRider) && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Bike className="w-4 h-4 mr-2" />
                      <span>
                        Rider Location: {nearbyRiders.find(r => r.id === selectedRider)?.location.lat.toFixed(4)}, {nearbyRiders.find(r => r.id === selectedRider)?.location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    * Live GPS tracking will be integrated with mapping service
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span className="text-blue-600 font-medium">Live ETA</span>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <Navigation className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <span className="text-green-600 font-medium">Route Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHailing;
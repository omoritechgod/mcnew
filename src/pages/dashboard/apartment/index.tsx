import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Wifi,
  Car,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

const ApartmentDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProperties: 0,
    totalBookings: 0,
    occupancyRate: 0
  });

  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Luxury Apartment - Victoria Island',
      type: 'Apartment',
      location: 'Victoria Island, Lagos',
      price: '₦25,000',
      priceUnit: 'per night',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      rating: 4.9,
      bookings: 18,
      status: 'active',
      image: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=200',
      amenities: ['WiFi', 'AC', 'Kitchen', 'Parking']
    },
    {
      id: 2,
      name: 'Budget Hotel - Ikeja',
      type: 'Hotel Room',
      location: 'Ikeja, Lagos',
      price: '₦12,000',
      priceUnit: 'per night',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      rating: 4.5,
      bookings: 12,
      status: 'active',
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=200',
      amenities: ['WiFi', 'AC', 'Restaurant']
    },
    {
      id: 3,
      name: 'Student Hostel - Yaba',
      type: 'Hostel',
      location: 'Yaba, Lagos',
      price: '₦5,000',
      priceUnit: 'per night',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      rating: 4.2,
      bookings: 8,
      status: 'maintenance',
      image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=200',
      amenities: ['WiFi', 'Study Area', 'Security']
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      property: 'Luxury Apartment - Victoria Island',
      guest: 'John Smith',
      checkIn: '2024-01-18',
      checkOut: '2024-01-20',
      guests: 2,
      amount: '₦50,000',
      status: 'confirmed'
    },
    {
      id: 2,
      property: 'Budget Hotel - Ikeja',
      guest: 'Mary Johnson',
      checkIn: '2024-01-16',
      checkOut: '2024-01-17',
      guests: 1,
      amount: '₦12,000',
      status: 'checked-in'
    },
    {
      id: 3,
      property: 'Luxury Apartment - Victoria Island',
      guest: 'David Wilson',
      checkIn: '2024-01-22',
      checkOut: '2024-01-25',
      guests: 4,
      amount: '₦75,000',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // Simulate fetching apartment stats
    setStats({
      totalRevenue: 485000,
      totalProperties: 12,
      totalBookings: 38,
      occupancyRate: 78
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi':
        return <Wifi size={14} />;
      case 'Parking':
        return <Car size={14} />;
      default:
        return <CheckCircle size={14} />;
    }
  };

  const handleDeleteProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(property => property.id !== propertyId));
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
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₦{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Building className="text-blue-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+2</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProperties}</div>
            <div className="text-sm text-gray-600">Total Properties</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+12</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">+5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.occupancyRate}%</div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties Management */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Properties</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
                <Plus size={16} />
                Add Property
              </button>
            </div>
            
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-20 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{property.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin size={14} />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{property.bedrooms} bed • {property.bathrooms} bath • {property.maxGuests} guests</span>
                          <span className="font-semibold text-green-600">{property.price}/{property.priceUnit}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{property.rating}</span>
                          <span className="text-sm text-gray-500">({property.bookings} bookings)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                          {property.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">+{property.amenities.length - 3}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600">
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProperty(property.id)}
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
                    <h4 className="font-medium text-gray-900 text-sm">{booking.property}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>{booking.guest} • {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{booking.checkIn} to {booking.checkOut}</span>
                    </div>
                    <div className="flex items-center justify-between">
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
                      <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Check-in Guest
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Contact
                      </button>
                    </div>
                  )}

                  {booking.status === 'checked-in' && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                        Check-out Guest
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Contact
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Occupancy Chart Placeholder */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-4">Monthly Occupancy</h4>
              <div className="h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Occupancy chart will be implemented</p>
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
              <span className="text-sm font-medium">Add Property</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Calendar className="text-green-600 mb-2" size={24} />
              <span className="text-sm font-medium">Manage Calendar</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Users className="text-purple-600 mb-2" size={24} />
              <span className="text-sm font-medium">Guest Management</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Clock className="text-orange-600 mb-2" size={24} />
              <span className="text-sm font-medium">Maintenance</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApartmentDashboard;
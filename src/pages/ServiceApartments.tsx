import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceApartments: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const categories = [
    { id: 'all', name: 'All Properties', icon: '🏠' },
    { id: 'hotel', name: 'Hotels', icon: '🏨' },
    { id: 'hostel', name: 'Hostels', icon: '🏠' },
    { id: 'shortlet', name: 'Shortlets', icon: '🏡' },
  ];

  const properties = [
    {
      id: 1,
      name: "Luxury Apartment - Victoria Island",
      type: "shortlet",
      image: "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=500",
      images: [
        "https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=500",
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500"
      ],
      rating: 4.9,
      reviews: 127,
      price: "₦25,000",
      priceUnit: "per night",
      location: "Victoria Island, Lagos",
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      isVerified: true,
      amenities: ["WiFi", "AC", "Kitchen", "Parking", "Security"],
      host: {
        name: "Adebayo Properties",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
        verified: true
      }
    },
    {
      id: 2,
      name: "Budget Hotel - Ikeja",
      type: "hotel",
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=500",
      images: [
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=500"
      ],
      rating: 4.5,
      reviews: 89,
      price: "₦12,000",
      priceUnit: "per night",
      location: "Ikeja, Lagos",
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      isVerified: true,
      amenities: ["WiFi", "AC", "Restaurant", "Laundry"],
      host: {
        name: "Ikeja Hotels Ltd",
        image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100",
        verified: true
      }
    },
    {
      id: 3,
      name: "Student Hostel - Yaba",
      type: "hostel",
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=500",
      images: [
        "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=500"
      ],
      rating: 4.2,
      reviews: 45,
      price: "₦5,000",
      priceUnit: "per night",
      location: "Yaba, Lagos",
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      isVerified: true,
      amenities: ["WiFi", "Study Area", "Common Kitchen", "Security"],
      host: {
        name: "Campus Hostels",
        image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
        verified: true
      }
    }
  ];

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi size={16} />,
    'AC': <span className="text-sm">❄️</span>,
    'Kitchen': <span className="text-sm">🍳</span>,
    'Parking': <Car size={16} />,
    'Security': <Shield size={16} />,
    'Restaurant': <Coffee size={16} />,
    'Laundry': <span className="text-sm">👕</span>,
    'Study Area': <span className="text-sm">📚</span>,
    'Common Kitchen': <span className="text-sm">🍳</span>
  };

  const filteredProperties = selectedCategory === 'all' 
    ? properties 
    : properties.filter(property => property.type === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Service Apartments</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>Plot 30 Ngari street off rumualogu ,Owhipa Choba ,Port Harcourt,Rivers state</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Stay</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
                {property.isVerified && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Shield size={12} />
                    Verified
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">{property.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{property.name}</h3>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin size={14} />
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{property.maxGuests} guests</span>
                  </div>
                  <span>•</span>
                  <span>{property.bedrooms} bed</span>
                  <span>•</span>
                  <span>{property.bathrooms} bath</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {amenityIcons[amenity]}
                      <span>{amenity}</span>
                    </div>
                  ))}
                  {property.amenities.length > 4 && (
                    <span className="text-gray-500 text-xs">+{property.amenities.length - 4} more</span>
                  )}
                </div>

                {/* Host Info */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  <img 
                    src={property.host.image} 
                    alt={property.host.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{property.host.name}</div>
                    <div className="text-xs text-gray-600">{property.reviews} reviews</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-gray-900">{property.price}</div>
                    <div className="text-sm text-gray-600">{property.priceUnit}</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceApartments;
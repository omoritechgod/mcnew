import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Star, Wifi, Car, Coffee, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingModal, { BookingFormData } from '../components/booking/BookingModal';
import { apartmentApi, ApartmentData } from '../services/apartmentApi';
import { bookingApi } from '../services/bookingApi';

const ServiceApartments: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Booking modal state
  const [selectedApartment, setSelectedApartment] = useState<ApartmentData | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Properties', icon: '🏠' },
    { id: 'hotel', name: 'Hotels', icon: '🏨' },
    { id: 'hostel', name: 'Hostels', icon: '🏠' },
    { id: 'shortlet', name: 'Shortlets', icon: '🏡' },
  ];

  // Fetch apartments from Laravel API
  const fetchApartments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apartmentApi.getApartments();
      
      if (response.data && Array.isArray(response.data)) {
        setApartments(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch apartments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // Transform API data to display format
  const transformApartmentData = (apartment: ApartmentData) => {
    return {
      id: apartment.id,
      name: apartment.title,
      type: apartment.type,
      image: apartment.images[0] || '/placeholder.svg?height=300&width=400&text=No+Image',
      images: apartment.images,
      rating: 4.5, // Default rating since not provided by API
      reviews: Math.floor(Math.random() * 100) + 10, // Random reviews for now
      price: `₦${parseFloat(apartment.price_per_night).toLocaleString()}`,
      priceUnit: "per night",
      location: apartment.location,
      maxGuests: 4, // Default value
      bedrooms: 2, // Default value
      bathrooms: 1, // Default value
      isVerified: apartment.is_verified === 1,
      amenities: ["WiFi", "AC", "Kitchen", "Security"], // Default amenities
      description: apartment.description,
      host: {
        name: `Vendor ${apartment.vendor_id}`,
        image: '/placeholder.svg?height=100&width=100&text=Host',
        verified: apartment.is_verified === 1
      },
      createdAt: apartment.created_at,
      updatedAt: apartment.updated_at
    };
  };

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

  // Filter apartments based on selected category
  const filteredApartments = selectedCategory === 'all' 
    ? apartments 
    : apartments.filter(apartment => apartment.type === selectedCategory);

  const transformedApartments = filteredApartments.map(transformApartmentData);

  // Handle booking modal
  const handleBookNow = (apartment: ApartmentData) => {
    setSelectedApartment(apartment);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      setBookingLoading(true);
      
      // Submit booking request to API
      const response = await bookingApi.createBooking(bookingData);
      
      // Close modal and show success message
      setShowBookingModal(false);
      setSelectedApartment(null);
      
      alert(`Booking request submitted successfully! 
        
Booking ID: #${response.data.id}
Status: ${response.data.status}

Your booking request has been sent for admin review. You'll be notified once it's approved and you can proceed with payment.`);
      
      // Optionally redirect to bookings page
      // navigate('/dashboard/bookings');
      
    } catch (error: any) {
      console.error('Booking submission error:', error);
      
      let errorMessage = 'Failed to submit booking request. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Booking Error: ${errorMessage}`);
    } finally {
      setBookingLoading(false);
    }
  };

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
                  <span>Nigeria</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {apartments.length} properties available
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading apartments...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <span className="text-xl">⚠️</span>
              <h3 className="font-semibold">Error Loading Apartments</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchApartments}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Apartments Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedApartments.map((property) => (
              <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={property.image || "/placeholder.svg"} 
                    alt={property.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg?height=300&width=400&text=No+Image';
                    }}
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

                  {/* Description */}
                  {property.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {property.description}
                    </p>
                  )}

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
                      src={property.host.image || "/placeholder.svg"} 
                      alt={property.host.name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg?height=100&width=100&text=Host';
                      }}
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
                    <button 
                      onClick={() => handleBookNow(apartments.find(apt => apt.id === property.id)!)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && transformedApartments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No apartments found</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? 'No apartments are currently available. Check back later!' 
                : `No ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} found. Try a different category.`
              }
            </p>
            <button 
              onClick={fetchApartments}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedApartment && (
        <BookingModal
          apartment={selectedApartment}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedApartment(null);
          }}
          onBookingSubmit={handleBookingSubmit}
          isLoading={bookingLoading}
        />
      )}
    </div>
  );
};

export default ServiceApartments;

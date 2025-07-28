import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Star, Clock, Shield, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GeneralServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🔧' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'gardening', name: 'Gardening', icon: '🌱' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'catering', name: 'Catering', icon: '🍽️' },
    { id: 'photography', name: 'Photography', icon: '📸' },
  ];

  const serviceProviders = [
    {
      id: 1,
      name: "CleanPro Services",
      category: "cleaning",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.9,
      completedJobs: 156,
      responseTime: "2 hours",
      location: "Victoria Island, Lagos",
      services: ["House Cleaning", "Office Cleaning", "Deep Cleaning"],
      priceRange: "₦5,000 - ₦25,000",
      isAvailable: true,
      verified: true,
      description: "Professional cleaning services for homes and offices with eco-friendly products.",
      contact: "+234 801 234 5678"
    },
    {
      id: 2,
      name: "PowerFix Electrical",
      category: "electrical",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.8,
      completedJobs: 203,
      responseTime: "1 hour",
      location: "Ikeja, Lagos",
      services: ["Wiring", "Generator Repair", "Solar Installation"],
      priceRange: "₦8,000 - ₦50,000",
      isAvailable: true,
      verified: true,
      description: "Licensed electricians providing safe and reliable electrical solutions.",
      contact: "+234 802 345 6789"
    },
    {
      id: 3,
      name: "AquaFlow Plumbing",
      category: "plumbing",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.7,
      completedJobs: 134,
      responseTime: "3 hours",
      location: "Lekki, Lagos",
      services: ["Pipe Repair", "Toilet Installation", "Water Heater Service"],
      priceRange: "₦6,000 - ₦30,000",
      isAvailable: true,
      verified: true,
      description: "Expert plumbing services for residential and commercial properties.",
      contact: "+234 803 456 7890"
    },
    {
      id: 4,
      name: "ColorMaster Painters",
      category: "painting",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.6,
      completedJobs: 89,
      responseTime: "4 hours",
      location: "Surulere, Lagos",
      services: ["Interior Painting", "Exterior Painting", "Decorative Painting"],
      priceRange: "₦15,000 - ₦100,000",
      isAvailable: true,
      verified: true,
      description: "Professional painters delivering quality finishes for homes and offices.",
      contact: "+234 804 567 8901"
    },
    {
      id: 5,
      name: "GreenThumb Gardens",
      category: "gardening",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.8,
      completedJobs: 67,
      responseTime: "6 hours",
      location: "Ikoyi, Lagos",
      services: ["Lawn Care", "Garden Design", "Tree Trimming"],
      priceRange: "₦10,000 - ₦75,000",
      isAvailable: true,
      verified: true,
      description: "Transform your outdoor space with our professional gardening services.",
      contact: "+234 805 678 9012"
    },
    {
      id: 6,
      name: "SecureGuard Services",
      category: "security",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.9,
      completedJobs: 234,
      responseTime: "30 minutes",
      location: "Lagos Island, Lagos",
      services: ["Security Guards", "CCTV Installation", "Access Control"],
      priceRange: "₦20,000 - ₦150,000",
      isAvailable: true,
      verified: true,
      description: "Comprehensive security solutions for homes and businesses.",
      contact: "+234 806 789 0123"
    }
  ];

  const filteredProviders = selectedCategory === 'all' 
    ? serviceProviders 
    : serviceProviders.filter(provider => provider.category === selectedCategory);

  const handleContactProvider = (providerId: number) => {
    console.log(`Contacting provider ${providerId}`);
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
                <h1 className="text-xl font-bold text-gray-900">General Services</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for services or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Categories</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-colors text-center ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-xs font-medium text-gray-900">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Service Providers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Service Providers' : `${serviceCategories.find(c => c.id === selectedCategory)?.name} Services`}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} available
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img 
                      src={provider.image} 
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {provider.isAvailable && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                      {provider.verified && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Shield size={12} />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span>{provider.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{provider.completedJobs} jobs completed</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin size={14} />
                      <span>{provider.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} />
                      <span>Responds in {provider.responseTime}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {provider.description}
                </p>

                {/* Services */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Services Offered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map((service, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Price range:</span> {provider.priceRange}
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleContactProvider(provider.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Contact Provider
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No service providers found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">How General Services Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-semibold mb-2">Browse Services</div>
              <div className="text-sm opacity-90">Find the right service provider for your needs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <div className="font-semibold mb-2">Contact Provider</div>
              <div className="text-sm opacity-90">Discuss your requirements and get a quote</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <div className="font-semibold mb-2">Schedule Service</div>
              <div className="text-sm opacity-90">Book a convenient time for the service</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-semibold mb-2">Pay Securely</div>
              <div className="text-sm opacity-90">Complete payment through our secure platform</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralServices;
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Wrench, Star, Phone, MessageCircle, Clock, DollarSign, Car, Zap, Droplets, Disc, Snowflake, Settings, AlertTriangle, CheckCircle, Locate, Truck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { maintenanceApi } from '../services/maintenanceApi';
import { logErrorToBackend } from '../utils/logError';

type MaintenanceStep = 'report' | 'mechanics' | 'payment';

const AutoMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<MaintenanceStep>('report');
  const [selectedService, setSelectedService] = useState('');
  const [carIssue, setCarIssue] = useState('');
  const [location, setLocation] = useState('');
  const [needsTowing, setNeedsTowing] = useState('no');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const serviceTypes = [
    { id: 'engine', name: 'Engine Repair', icon: <Settings size={24} />, price: '₦15,000 - ₦50,000' },
    { id: 'brake', name: 'Brake Service', icon: <Disc size={24} />, price: '₦8,000 - ₦25,000' },
    { id: 'oil', name: 'Oil Change', icon: <Droplets size={24} />, price: '₦5,000 - ₦12,000' },
    { id: 'tire', name: 'Tire Service', icon: <Car size={24} />, price: '₦3,000 - ₦15,000' },
    { id: 'electrical', name: 'Electrical', icon: <Zap size={24} />, price: '₦10,000 - ₦30,000' },
    { id: 'ac', name: 'AC Repair', icon: <Snowflake size={24} />, price: '₦12,000 - ₦35,000' },
  ];

  const nearbyMechanics = [
    {
      id: 1,
      name: "AutoFix Garage",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.8,
      reviews: 124,
      completedJobs: 245,
      distance: "0.5 km",
      specialties: ["Engine Repair", "Brake Service", "Electrical"],
      responseTime: "15 min",
      isAvailable: true,
      verified: true,
      priceRange: "₦15,000 - ₦50,000",
      contact: "+234 801 234 5678",
      address: "123 Main Street, Victoria Island",
      hasTowing: true
    },
    {
      id: 2,
      name: "Quick Service Motors",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.6,
      reviews: 89,
      completedJobs: 189,
      distance: "1.2 km",
      specialties: ["Transmission", "AC Repair", "Diagnostics"],
      responseTime: "25 min",
      isAvailable: true,
      verified: true,
      priceRange: "₦10,000 - ₦40,000",
      contact: "+234 802 345 6789",
      address: "456 Lagos Street, Ikeja",
      hasTowing: false
    },
    {
      id: 3,
      name: "Pro Mechanics Ltd",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 4.9,
      reviews: 203,
      completedJobs: 312,
      distance: "2.1 km",
      specialties: ["Electrical", "Body Work", "Towing"],
      responseTime: "10 min",
      isAvailable: true,
      verified: true,
      priceRange: "₦20,000 - ₦80,000",
      contact: "+234 803 456 7890",
      address: "789 Repair Avenue, Surulere",
      hasTowing: true
    }
  ];

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("Current Location");
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

  const handleSubmitRequest = async () => {
    if (!selectedService || !carIssue || !location) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSubmittingRequest(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const requestData = {
        location: location,
        service_type: selectedService,
        issue: carIssue,
        needs_towing: needsTowing === 'yes'
      };

      const response = await maintenanceApi.submitMaintenanceRequest(requestData);
      
      setSubmitMessage({ 
        type: 'success', 
        text: response.message || 'Maintenance request submitted successfully!' 
      });
      
      // Move to mechanics step after successful submission
      setActiveStep('mechanics');
    } catch (error: any) {
      console.error('Error submitting maintenance request:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: error.message || 'Failed to submit maintenance request. Please try again.' 
      });
      await logErrorToBackend('Maintenance Request Submission', error);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleSelectMechanic = (mechanic: any) => {
    setSelectedMechanic(mechanic);
    setActiveStep('payment');
  };

  const handleContactMechanic = (mechanicId: number) => {
    console.log(`Contacting mechanic ${mechanicId}`);
  };

  const getStepStatus = (step: MaintenanceStep) => {
    const steps = ['report', 'mechanics', 'payment'];
    const currentIndex = steps.indexOf(activeStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'active':
        return 'bg-[#043873] text-white';
      case 'pending':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-200 text-gray-600';
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
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#043873]">Auto Maintenance</h1>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified Mechanics
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStepColor(getStepStatus('report'))}`}>
                {getStepStatus('report') === 'completed' ? <CheckCircle size={20} /> : '1'}
              </div>
              <span className={`ml-3 font-medium ${getStepStatus('report') === 'active' ? 'text-[#043873]' : 'text-gray-600'}`}>
                Report Issue
              </span>
            </div>
            
            <div className="w-12 h-1 bg-gray-300 rounded">
              <div className={`h-full rounded transition-all duration-300 ${
                getStepStatus('mechanics') !== 'pending' ? 'bg-[#043873] w-full' : 'w-0'
              }`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStepColor(getStepStatus('mechanics'))}`}>
                {getStepStatus('mechanics') === 'completed' ? <CheckCircle size={20} /> : '2'}
              </div>
              <span className={`ml-3 font-medium ${getStepStatus('mechanics') === 'active' ? 'text-[#043873]' : 'text-gray-600'}`}>
                Find Mechanic
              </span>
            </div>
            
            <div className="w-12 h-1 bg-gray-300 rounded">
              <div className={`h-full rounded transition-all duration-300 ${
                getStepStatus('payment') !== 'pending' ? 'bg-[#043873] w-full' : 'w-0'
              }`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStepColor(getStepStatus('payment'))}`}>
                {getStepStatus('payment') === 'completed' ? <CheckCircle size={20} /> : '3'}
              </div>
              <span className={`ml-3 font-medium ${getStepStatus('payment') === 'active' ? 'text-[#043873]' : 'text-gray-600'}`}>
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Report Issue */}
        {activeStep === 'report' && (
          <div className="max-w-2xl mx-auto">
            {/* Message Display */}
            {submitMessage.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {submitMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <span>{submitMessage.text}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 mr-3 text-[#F76300]" />
                <div>
                  <h2 className="text-2xl font-bold text-[#043873]">Report Your Vehicle Issue</h2>
                  <p className="text-gray-600">Describe your vehicle problem and we'll connect you with nearby mechanics</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Location Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your current location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
                </div>

                {/* Service Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service Type *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service type or select from popular services below"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043873] focus:border-transparent mb-4"
                  />
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular Services:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setSelectedService(service.name)}
                          className={`p-3 rounded-xl border-2 transition-colors text-left hover:border-[#043873] hover:bg-blue-50 ${
                            selectedService === service.name
                              ? 'border-[#043873] bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-[#043873] mb-2">{service.icon}</div>
                          <div className="font-semibold text-gray-900 mb-1 text-sm">{service.name}</div>
                          <div className="text-xs text-gray-600">{service.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Remove the old service types grid */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select Service Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.name)}
                        className={`p-4 rounded-xl border-2 transition-colors text-left ${
                          selectedService === service.name
                            ? 'border-[#043873] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-[#043873] mb-2">{service.icon}</div>
                        <div className="font-semibold text-gray-900 mb-1">{service.name}</div>
                        <div className="text-sm text-gray-600">{service.price}</div>
                      </button>
                    ))}
                  </div>
                </div> */}

                {/* Issue Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the Problem *
                  </label>
                  <textarea
                    placeholder="Describe what's wrong with your vehicle (e.g., engine won't start, strange noise, overheating)"
                    value={carIssue}
                    onChange={(e) => setCarIssue(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043873] focus:border-transparent resize-none"
                  />
                </div>

                {/* Towing Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you need towing service?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="towing"
                        value="no"
                        checked={needsTowing === 'no'}
                        onChange={(e) => setNeedsTowing(e.target.value)}
                        className="w-4 h-4 text-[#043873] border-gray-300 focus:ring-[#043873]"
                      />
                      <span className="ml-3 text-gray-700">No, I can drive to the garage</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="towing"
                        value="yes"
                        checked={needsTowing === 'yes'}
                        onChange={(e) => setNeedsTowing(e.target.value)}
                        className="w-4 h-4 text-[#043873] border-gray-300 focus:ring-[#043873]"
                      />
                      <span className="ml-3 text-gray-700 flex items-center">
                        <Truck size={16} className="mr-2" />
                        Yes, I need towing service
                      </span>
                    </label>
                  </div>
                </div>

                {/* Commitment Fee Info */}
                <div className="bg-gradient-to-r from-[#043873]/10 to-[#3B82F6]/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <DollarSign className="text-[#043873] mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-[#043873] mb-2">₦5,000 Commitment Fee</h4>
                      <ul className="text-[#043873] text-sm space-y-1">
                        <li>• Required to process your request</li>
                        <li>• 50% refund available if service is not used</li>
                        <li>• Final service charge agreed with mechanic</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSubmitRequest}
                  disabled={!selectedService || !carIssue || !location || isSubmittingRequest}
                  className="w-full bg-[#043873] hover:bg-[#043873]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting Request...
                    </>
                  ) : (
                    'Submit Maintenance Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Available Mechanics */}
        {activeStep === 'mechanics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#043873] mb-2">Available Mechanics Near You</h2>
              <p className="text-gray-600">Choose a mechanic based on proximity, rating, and specialization</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nearbyMechanics.map((mechanic) => (
                <div key={mechanic.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={mechanic.image} 
                          alt={mechanic.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        {mechanic.isAvailable && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{mechanic.name}</h3>
                          {mechanic.verified && (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Shield size={12} />
                              Verified
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-current" />
                            <span>{mechanic.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{mechanic.completedJobs} jobs</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>Responds in {mechanic.responseTime}</span>
                          </div>
                          <span>•</span>
                          <span>{mechanic.distance} away</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {mechanic.specialties.map((specialty, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="flex items-center text-sm mb-3">
                    <DollarSign className="w-4 h-4 mr-2 text-[#F76300]" />
                    <span className="font-medium">{mechanic.priceRange}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Phone className="w-4 h-4 mr-2" />
                    {mechanic.contact}
                  </div>

                  <p className="text-xs text-gray-500 mb-4">{mechanic.address}</p>

                  {/* Towing Service */}
                  {needsTowing === 'yes' && mechanic.hasTowing && (
                    <div className="flex items-center text-sm text-green-600 mb-4">
                      <Truck className="w-4 h-4 mr-2" />
                      Towing service available
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleSelectMechanic(mechanic)}
                      disabled={!mechanic.isAvailable}
                      className="flex-1 bg-[#043873] hover:bg-[#043873]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      {mechanic.isAvailable ? 'Select Mechanic' : 'Not Available'}
                    </button>
                    <button 
                      onClick={() => handleContactMechanic(mechanic.id)}
                      className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setActiveStep('report')}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                ← Back to Report
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {activeStep === 'payment' && selectedMechanic && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center text-green-600 mb-6">
                <CheckCircle className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-[#043873]">Confirm Service Request</h2>
                  <p className="text-gray-600">Review your selection and make the commitment payment</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Selected Mechanic */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Selected Mechanic</h4>
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedMechanic.image} 
                      alt={selectedMechanic.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-lg">{selectedMechanic.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{selectedMechanic.rating} ({selectedMechanic.reviews} reviews)</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedMechanic.address}</p>
                      <p className="text-sm text-gray-600">{selectedMechanic.contact}</p>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Location:</span> {location}</div>
                    <div><span className="font-medium">Service Type:</span> {selectedService}</div>
                    <div><span className="font-medium">Issue:</span> {carIssue}</div>
                    <div><span className="font-medium">Towing needed:</span> {needsTowing === 'yes' ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">Estimated cost:</span> {selectedMechanic.priceRange}</div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-2 border-[#F76300] bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#F76300] mb-3">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commitment Fee:</span>
                      <span className="font-medium">₦5,000</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Required to process your request</p>
                      <p>• 50% refundable if service is not used</p>
                      <p>• Final service charge will be agreed with mechanic</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveStep('mechanics')}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Go Back
                  </button>
                  <button className="bg-[#043873] hover:bg-[#043873]/90 text-white font-semibold py-3 rounded-xl transition-colors">
                    Pay ₦5,000 & Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-[#043873] to-[#3B82F6] rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">How Auto Maintenance Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">
                <MessageCircle className="mx-auto" size={32} />
              </div>
              <div className="font-semibold mb-2">Contact Mechanic</div>
              <div className="text-sm opacity-90">Choose and contact your preferred mechanic</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">
                <DollarSign className="mx-auto" size={32} />
              </div>
              <div className="font-semibold mb-2">Get Quote</div>
              <div className="text-sm opacity-90">Receive detailed quote and timeline</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">
                <Wrench className="mx-auto" size={32} />
              </div>
              <div className="font-semibold mb-2">Service & Pay</div>
              <div className="text-sm opacity-90">Get your car fixed and pay securely</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoMaintenance;

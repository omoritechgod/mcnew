import React, { useState } from 'react';
import { Building, ArrowLeft, ArrowRight } from 'lucide-react';

interface VendorDetailsFormProps {
  onSubmit: (data: { vendor_type: string; business_name: string; category: string }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({ onSubmit, onBack, isLoading = false }) => {
  const [formData, setFormData] = useState({
    vendor_type: 'individual',
    business_name: '',
    category: ''
  });

  const categories = [
    { id: 'rider', name: 'Ride-Hailing (Okada)', description: 'Motorcycle taxi services' },
    { id: 'mechanic', name: 'Auto Mechanic', description: 'Vehicle repair and maintenance' },
    { id: 'product_vendor', name: 'Product Vendor', description: 'Sell physical products' },
    { id: 'service_apartment', name: 'Service Apartments', description: 'Short-term accommodation' },
    { id: 'service_vendor', name: 'General Services', description: 'Home and professional services' },
    { id: 'food_vendor', name: 'Food Vendor', description: 'Restaurant and food services' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center mb-6">
        <Building className="w-6 h-6 mr-3 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
          <p className="text-gray-600">Tell us about your business type and category</p>
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Type *
        </label>
        <select
          name="vendor_type"
          value={formData.vendor_type}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="individual">Individual</option>
          <option value="business">Registered Business</option>
        </select>
      </div>

      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.vendor_type === 'individual' ? 'Service Name' : 'Business Name'} *
        </label>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={formData.vendor_type === 'individual' ? 'e.g., John\'s Catering Service' : 'Enter your business name'}
            required
          />
        </div>
      </div>

      {/* Service Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Service Category *
        </label>
        <div className="grid grid-cols-1 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                formData.category === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={formData.category === category.id}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                required
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-600">{category.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.business_name || !formData.category}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VendorDetailsForm;
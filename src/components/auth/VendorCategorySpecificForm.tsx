import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import MechanicFormFields from './category-forms/MechanicFormFields';
import RiderFormFields from './category-forms/RiderFormFields';
import ProductVendorFormFields from './category-forms/ProductVendorFormFields';
import ServiceApartmentFormFields from './category-forms/ServiceApartmentFormFields';
import ServiceVendorFormFields from './category-forms/ServiceVendorFormFields';

interface VendorCategorySpecificFormProps {
  category: string;
  onSubmit: (data: any) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const VendorCategorySpecificForm: React.FC<VendorCategorySpecificFormProps> = ({ 
  category, 
  onSubmit, 
  onBack, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<any>({});

  const handleFormDataChange = (data: any) => {
    setFormData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderCategoryForm = () => {
    switch (category) {
      case 'mechanic':
        return <MechanicFormFields onDataChange={handleFormDataChange} />;
      case 'rider':
        return <RiderFormFields onDataChange={handleFormDataChange} />;
      case 'product_vendor':
        return <ProductVendorFormFields onDataChange={handleFormDataChange} />;
      case 'service_apartment':
        return <ServiceApartmentFormFields onDataChange={handleFormDataChange} />;
      case 'service_vendor':
        return <ServiceVendorFormFields onDataChange={handleFormDataChange} />;
      case 'food_vendor':
        return <FoodVendorFormFields onDataChange={handleFormDataChange} />;
      default:
        return <div>Invalid category selected</div>;
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'mechanic':
        return 'Auto Mechanic Details';
      case 'rider':
        return 'Rider Details';
      case 'product_vendor':
        return 'Product Vendor Details';
      case 'service_apartment':
        return 'Service Apartment Details';
      case 'service_vendor':
        return 'Service Provider Details';
      case 'food_vendor':
        return 'Food Vendor Details';
      default:
        return 'Vendor Details';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{getCategoryTitle()}</h3>
          <p className="text-gray-600">Complete your profile with specific information</p>
        </div>
      </div>

      {renderCategoryForm()}

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
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Completing Registration...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Complete Registration
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default VendorCategorySpecificForm;
import React, { useState, useEffect } from 'react';
import { Bike, CreditCard, Clock } from 'lucide-react';

interface RiderFormFieldsProps {
  onDataChange: (data: any) => void;
}

const RiderFormFields: React.FC<RiderFormFieldsProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    vehicle_type: 'bike',
    experience_years: 1
  });

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Type *
        </label>
        <div className="relative">
          <Bike className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="bike">Motorcycle</option>
            <option value="tricycle">Tricycle (Keke)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience *
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleInputChange}
            min="1"
            max="50"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Years of driving experience"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Requirements</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Vehicle registration documents</li>
          <li>• Insurance coverage</li>
          <li>• Valid identification</li>
          <li>• Motorcycle/tricycle ownership proof</li>
        </ul>
      </div>
    </div>
  );
};

export default RiderFormFields;
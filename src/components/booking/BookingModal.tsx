import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, Clock, CreditCard, AlertCircle } from 'lucide-react';
import { ApartmentData } from '../../services/apartmentApi';

interface BookingModalProps {
  apartment: ApartmentData;
  isOpen: boolean;
  onClose: () => void;
  onBookingSubmit: (bookingData: BookingFormData) => void;
  isLoading?: boolean;
}

export interface BookingFormData {
  listing_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  nights: number;
  total_price: number;
  notes?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  apartment,
  isOpen,
  onClose,
  onBookingSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    guests: 1,
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate nights and total price
  const calculateBookingDetails = () => {
    if (!formData.check_in_date || !formData.check_out_date) {
      return { nights: 0, totalPrice: 0 };
    }

    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const pricePerNight = parseFloat(apartment.price_per_night);
    const totalPrice = nights * pricePerNight;

    return { nights: Math.max(0, nights), totalPrice };
  };

  const { nights, totalPrice } = calculateBookingDetails();

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.check_in_date) {
      newErrors.check_in_date = 'Check-in date is required';
    } else if (formData.check_in_date < today) {
      newErrors.check_in_date = 'Check-in date cannot be in the past';
    }

    if (!formData.check_out_date) {
      newErrors.check_out_date = 'Check-out date is required';
    } else if (formData.check_out_date <= formData.check_in_date) {
      newErrors.check_out_date = 'Check-out date must be after check-in date';
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (nights < 1) {
      newErrors.general = 'Booking must be for at least 1 night';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bookingData: BookingFormData = {
      listing_id: apartment.id,
      check_in_date: formData.check_in_date,
      check_out_date: formData.check_out_date,
      guests: formData.guests,
      nights,
      total_price: totalPrice,
      notes: formData.notes || undefined
    };

    onBookingSubmit(bookingData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Your Stay</h2>
            <p className="text-gray-600">{apartment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Apartment Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-4">
            <img
              src={apartment.images[0] || '/placeholder.svg'}
              alt={apartment.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{apartment.title}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin size={14} />
                <span>{apartment.location}</span>
              </div>
              <div className="text-lg font-bold text-blue-600 mt-2">
                ₦{parseFloat(apartment.price_per_night).toLocaleString()} / night
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Check-in Date
              </label>
              <input
                type="date"
                value={formData.check_in_date}
                onChange={(e) => handleInputChange('check_in_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.check_in_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.check_in_date && (
                <p className="text-red-600 text-sm mt-1">{errors.check_in_date}</p>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.check_out_date}
                onChange={(e) => handleInputChange('check_out_date', e.target.value)}
                min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.check_out_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.check_out_date && (
                <p className="text-red-600 text-sm mt-1">{errors.check_out_date}</p>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-1" />
              Number of Guests
            </label>
            <select
              value={formData.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guests ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
            {errors.guests && (
              <p className="text-red-600 text-sm mt-1">{errors.guests}</p>
            )}
          </div>

          {/* Special Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requests or notes for the host..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Booking Summary */}
          {nights > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>₦{parseFloat(apartment.price_per_night).toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₦0</span>
                </div>
                <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Clock size={16} />
                  <span>Duration: {nights} night{nights > 1 ? 's' : ''} • {formData.guests} guest{formData.guests > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || nights < 1}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Request Booking
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Your booking request will be reviewed by our admin team. You'll be notified once approved and can proceed with payment.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import {
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign
} from 'lucide-react';
import { foodApi } from '../../../services/foodApi';
import { uploadToCloudinary } from '../../../utils/cloudinaryUploader';

const FoodVendorProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    cuisines: [] as string[],
    location: '',
    latitude: null as number | null,
    longitude: null as number | null,
    contact_phone: '',
    contact_email: '',
    description: '',
    logo: '',
    operating_hours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { closed: true }
    },
    delivery_radius_km: 5,
    minimum_order_amount: 0,
    delivery_fee: 0,
    estimated_preparation_time: 30,
    accepts_cash: true,
    accepts_card: true,
    is_open: true
  });

  const [cuisineInput, setCuisineInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const response = await foodApi.getVendorProfile();
      
      if (response.data) {
        const profile = response.data;
        setFormData({
          business_name: profile.business_name || '',
          specialty: profile.specialty || '',
          cuisines: profile.cuisines || [],
          location: profile.location || '',
          latitude: profile.latitude || null,
          longitude: profile.longitude || null,
          contact_phone: profile.contact_phone || '',
          contact_email: profile.contact_email || '',
          description: profile.description || '',
          logo: profile.logo || '',
          operating_hours: profile.operating_hours || formData.operating_hours,
          delivery_radius_km: profile.delivery_radius_km || 5,
          minimum_order_amount: profile.minimum_order_amount || 0,
          delivery_fee: profile.delivery_fee || 0,
          estimated_preparation_time: profile.estimated_preparation_time || 30,
          accepts_cash: profile.accepts_cash !== undefined ? profile.accepts_cash : true,
          accepts_card: profile.accepts_card !== undefined ? profile.accepts_card : true,
          is_open: profile.is_open !== undefined ? profile.is_open : true
        });
      }
    } catch (err: any) {
      console.log('Profile not yet created, using defaults');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCuisine = () => {
    if (cuisineInput.trim() && !formData.cuisines.includes(cuisineInput.trim())) {
      setFormData(prev => ({
        ...prev,
        cuisines: [...prev.cuisines, cuisineInput.trim()]
      }));
      setCuisineInput('');
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.filter(c => c !== cuisine)
    }));
  };

  const uploadLogo = async (file: File) => {
    setLogoUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      
      if (url) {
        handleChange('logo', url);
        setSuccess('Logo uploaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Failed to upload logo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await foodApi.updateVendorProfile(formData);
      
      if (response.message) {
        setSuccess(response.message);
        setTimeout(() => {
          navigate('/dashboard/food-vendor');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Food Vendor Profile</h1>
          <p className="text-gray-600">Complete your business profile to start accepting orders</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Nigerian delicacies"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisines
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Nigerian, African, Continental"
                />
                <button
                  type="button"
                  onClick={addCuisine}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cuisines.map((cuisine, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {cuisine}
                    <button
                      type="button"
                      onClick={() => removeCuisine(cuisine)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4">
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Upload size={20} />
                  <span>{logoUploading ? 'Uploading...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                    disabled={logoUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Wuse 2, Abuja"
                required
              />
            </div>
          </div>

          {/* Order Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Minimum Order (₦)
                </label>
                <input
                  type="number"
                  value={formData.minimum_order_amount}
                  onChange={(e) => handleChange('minimum_order_amount', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee (₦)
                </label>
                <input
                  type="number"
                  value={formData.delivery_fee}
                  onChange={(e) => handleChange('delivery_fee', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Prep Time (mins)
                </label>
                <input
                  type="number"
                  value={formData.estimated_preparation_time}
                  onChange={(e) => handleChange('estimated_preparation_time', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.accepts_cash}
                  onChange={(e) => handleChange('accepts_cash', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Accept Cash</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.accepts_card}
                  onChange={(e) => handleChange('accepts_card', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Accept Card</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_open}
                  onChange={(e) => handleChange('is_open', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Currently Open</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/food-vendor')}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default FoodVendorProfileSetup;
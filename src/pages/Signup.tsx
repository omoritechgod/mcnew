import React, { useState } from 'react';
import { ArrowLeft, User, Building, Shield, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import VendorDetailsForm from '../components/auth/VendorDetailsForm';
import VendorCategorySpecificForm from '../components/auth/VendorCategorySpecificForm';
import { logErrorToBackend } from '../utils/logError'; // 👈 Make sure this exists
import { authApi } from '../services/authApi'; // ✅ Add this line


type RegistrationStep = 'initial' | 'vendorDetails' | 'vendorCategorySpecific';

interface InitialRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  user_type: 'user' | 'vendor';
}

interface VendorDetailsData {
  vendor_type: string;
  business_name: string;
  category: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'user' | 'vendor'>('user');
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('initial');
  const [initialRegistrationData, setInitialRegistrationData] = useState<InitialRegistrationData | null>(null);
  const [vendorDetailsData, setVendorDetailsData] = useState<VendorDetailsData | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const handleInitialRegistrationSubmit = async (formData: InitialRegistrationData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await authApi.registerUser(formData);

      if (formData.user_type === 'user') {
        setSuccessMessage('Registration successful! Please check your email for verification.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const loginData = await authApi.loginUser({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('token', loginData.token);
        setInitialRegistrationData(formData);
        setRegistrationStep('vendorDetails');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during registration');
      await logErrorToBackend('Initial Registration', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorDetailsSubmit = async (vendorData: VendorDetailsData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');


    try {
      const { vendorApi } = await import('../services/vendorApi');
      
      await vendorApi.registerVendor(vendorData);

      setVendorDetailsData(vendorData);
      setRegistrationStep('vendorCategorySpecific');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error submitting vendor details');
      await logErrorToBackend('Vendor Details Submission', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalVendorRegistrationSubmit = async (categorySpecificData: any) => {
    if (!initialRegistrationData || !vendorDetailsData) {
      setErrorMessage('Missing registration data. Please start over.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');


    try {
      const { vendorApi } = await import('../services/vendorApi');
      let result;

      switch (vendorDetailsData.category) {
        case 'mechanic':
          result = await vendorApi.setupMechanic(categorySpecificData);
          break;
        case 'rider':
          result = await vendorApi.setupRider(categorySpecificData);
          break;
        case 'product':
          result = await vendorApi.setupProductVendor(categorySpecificData);
          break;
        case 'service-apartment':
          result = await vendorApi.setupServiceApartment(categorySpecificData);
          break;
        case 'service':
          result = await vendorApi.setupServiceVendor(categorySpecificData);
          break;
        default:
          throw new Error('Invalid vendor category');
      }

      setSuccessMessage('Vendor registration completed successfully! Your account will be reviewed for verification.');
      setTimeout(() => {
        setRegistrationStep('initial');
        setInitialRegistrationData(null);
        setVendorDetailsData(null);
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during vendor registration');
      await logErrorToBackend('Final Vendor Category Submission', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="text-2xl font-bold text-blue-600">McDee</div>
            </div>
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {registrationStep === 'initial' ? 'Join McDee Today' : registrationStep === 'vendorDetails' ? 'Vendor Details' : 'Complete Your Profile'}
          </h1>
          <p className="text-lg text-gray-600">
            {registrationStep === 'initial'
              ? 'Create your account and start connecting with trusted service providers'
              : registrationStep === 'vendorDetails'
              ? 'Tell us more about your business'
              : `Provide specific details for your ${vendorDetailsData?.category} business`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {registrationStep === 'initial' && (
            <>
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                    activeTab === 'user'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User size={20} />
                    <span>I'm a Customer</span>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    Book services and shop products
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('vendor')}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                    activeTab === 'vendor'
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building size={20} />
                    <span>I'm a Vendor</span>
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    Offer services and sell products
                  </div>
                </button>
              </div>

              <div className="p-8">
                {activeTab === 'vendor' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-amber-600 mt-1">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-1">Vendor Account Verification</h4>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          Your vendor account will need to be verified before you can start listing services or products.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <SignupForm
                  userType={activeTab}
                  onSubmit={handleInitialRegistrationSubmit}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}

          {registrationStep === 'vendorDetails' && (
            <div className="p-8">
              <VendorDetailsForm
                onSubmit={handleVendorDetailsSubmit}
                onBack={() => setRegistrationStep('initial')}
                isLoading={isLoading}
              />
            </div>
          )}

          {registrationStep === 'vendorCategorySpecific' && vendorDetailsData && (
            <div className="p-8">
              <VendorCategorySpecificForm
                category={vendorDetailsData.category}
                onSubmit={handleFinalVendorRegistrationSubmit}
                onBack={() => setRegistrationStep('vendorDetails')}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {registrationStep === 'initial' && (
          <div className="mt-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Why Choose McDee?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <Shield className="mx-auto text-blue-600 mb-2" size={32} />
                  <div className="font-medium">Secure Escrow</div>
                  <div>Protected transactions</div>
                </div>
                <div>
                  <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
                  <div className="font-medium">Verified Vendors</div>
                  <div>Trusted service providers</div>
                </div>
                <div>
                  <Star className="mx-auto text-yellow-600 mb-2" size={32} />
                  <div className="font-medium">Easy to Use</div>
                  <div>Simple and intuitive</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { X, Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { verificationApi } from '../../services/verificationApi';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number;
  userPhone: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userPhone,
}) => {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSendOTP = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await verificationApi.sendOTP(userId);
      setMessage({ type: 'success', text: response.message || 'Voice OTP sent successfully!' });
      setStep('verify');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOTP = async () => {
    if (!otp || otp.length !== 3) {
      setMessage({ type: 'error', text: 'Please enter a valid 3-digit OTP' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await verificationApi.confirmOTP(userId, otp);
      setMessage({ type: 'success', text: response.message || 'Phone number verified successfully!' });

      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('send');
        setOtp('');
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('send');
    setOtp('');
    setMessage({ type: '', text: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <Phone className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'send' ? 'Verify Your Phone' : 'Enter OTP Code'}
          </h2>
          <p className="text-gray-600">
            {step === 'send'
              ? `We'll call ${userPhone} with your verification code`
              : `Enter the 3-digit code sent to ${userPhone}`}
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {step === 'send' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-800">Phone Verification Required</h4>
                  <p className="text-blue-700 text-sm">
                    We’ll place a call to your phone number with your OTP. Please make sure your
                    line is active.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Phone size={16} />
                  Send Voice OTP
                </>
              )}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 3-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 3))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                placeholder="000"
                maxLength={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('send')}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Resend Code
              </button>
              <button
                onClick={handleConfirmOTP}
                disabled={isLoading || otp.length !== 3}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationModal;

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
  Clock
} from 'lucide-react';
import { getStoredUser } from '../../../utils/dashboardUtils';
import { authApi } from '../../../services/authApi';
import { uploadToCloudinary } from '../../../utils/cloudinaryUploader';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState(getStoredUser());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mdoilandgas.com/mcdee/backend/public';

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleProfileImageUpdate = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: '', text: '' });

    try {
      // Step 1: Upload to Cloudinary
      setUploadProgress(25);
      setMessage({ type: 'info', text: 'Uploading image to cloud storage...' });
      
      const cloudinaryUrl = await uploadToCloudinary(selectedFile);
      
      if (!cloudinaryUrl) {
        throw new Error('Failed to upload image to cloud storage');
      }

      setUploadProgress(75);
      setMessage({ type: 'info', text: 'Updating profile...' });

      // Step 2: Send URL to backend
      const data = await authApi.updateProfileImage(cloudinaryUrl);

      // Update user data in state and localStorage
      const updatedUser = { ...user, profile_image: cloudinaryUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUploadProgress(100);
      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
      setSelectedFile(null);
      setPreviewUrl(null);

      // Reset file input
      const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error updating profile image:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile image' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User data not found</h2>
            <p className="text-gray-600">Please try logging in again.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Management</h2>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : message.type === 'info'
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : message.type === 'info' ? (
                  <Clock size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && uploadProgress > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-800 font-medium">Upload Progress</span>
                  <span className="text-blue-600 text-sm">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                  
                  <div className="relative inline-block mb-4">
                    {previewUrl || user.profile_image ? (
                      <img 
                        src={previewUrl || user.profile_image} 
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-gray-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <label 
                      htmlFor="profile-image-input"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
                      style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
                    >
                      <Camera size={16} />
                    </label>
                  </div>

                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleProfileImageUpdate}
                          disabled={isUploading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              Update
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          disabled={isUploading}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Max file size: 5MB<br />
                    Supported formats: JPG, PNG, GIF<br />
                    Images stored securely in the cloud
                  </p>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={user.phone}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Contact support to change your phone number</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600">
                      {user.user_type === 'user' ? 'Customer' : 'Vendor'}
                      {user.user_type === 'vendor' && user.vendor && (
                        <span className="ml-2 text-sm">
                          ({user.vendor.business_name} - {user.vendor.category})
                        </span>
                      )}
                    </div>
                  </div>

                  {user.user_type === 'vendor' && user.vendor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Status
                      </label>
                      <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.vendor.verification_status === 'verified' 
                            ? 'bg-green-100 text-green-800'
                            : user.vendor.verification_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.vendor.verification_status?.charAt(0).toUpperCase() + user.vendor.verification_status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
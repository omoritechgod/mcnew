import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Shield, 
  Mail, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  User,
  Building
} from 'lucide-react';
import { getStoredUser } from '../../../utils/dashboardUtils';
import { verificationApi } from '../../../services/verificationApi';
import { uploadToCloudinary } from '../../../utils/cloudinaryUploader';
import OTPVerificationModal from '../../../components/modals/OTPVerificationModal';

interface ComplianceStatus {
  phone_verified: boolean;
  phone_verified_at: string | null;
  document_uploaded: boolean;
  document_type: 'nin' | 'cac' | null;
  compliance_status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
}

const VendorCompliance: React.FC = () => {
  const [user] = useState(getStoredUser());
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchComplianceStatus();
  }, []);

  const fetchComplianceStatus = async () => {
    try {
      const status = await verificationApi.getComplianceStatus();
      setComplianceStatus(status);
    } catch (error: any) {
      console.error('Error fetching compliance status:', error);
      setMessage({ type: 'error', text: 'Failed to load compliance status' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Please select a valid image (JPG, PNG) or PDF file' });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 10MB' });
        return;
      }
      
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile || !user?.vendor) {
      setMessage({ type: 'error', text: 'Please select a document first' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: '', text: '' });

    try {
      const documentType = user.vendor.vendor_type === 'individual' ? 'nin' : 'cac';
      
      // Upload to Cloudinary first
      setUploadProgress(25);
      setMessage({ type: 'info', text: 'Uploading document to cloud storage...' });
      
      const cloudinaryUrl = await uploadToCloudinary(selectedFile);
      
      if (!cloudinaryUrl) {
        throw new Error('Failed to upload document to cloud storage');
      }

      setUploadProgress(75);
      setMessage({ type: 'info', text: 'Saving document information...' });

      // Send document URL to backend
      await verificationApi.uploadComplianceDocument({
        type: documentType,
        document_url: cloudinaryUrl
      });

      setUploadProgress(100);
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh compliance status
      await fetchComplianceStatus();
    } catch (error: any) {
      console.error('Error uploading document:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload document' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await verificationApi.submitForReview();
      setMessage({ type: 'success', text: 'Submitted for review! You will be notified once approved.' });
      
      // Refresh compliance status
      await fetchComplianceStatus();
    } catch (error: any) {
      console.error('Error submitting for review:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to submit for review' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSuccess = () => {
    fetchComplianceStatus();
    setMessage({ type: 'success', text: 'Phone number verified successfully!' });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || !complianceStatus) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load compliance data</h2>
            <p className="text-gray-600">Please try refreshing the page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isIndividual = user.vendor?.vendor_type === 'individual';
  const documentType = isIndividual ? 'NIN' : 'CAC';
  const documentDescription = isIndividual 
    ? 'National Identification Number document' 
    : 'Corporate Affairs Commission certificate';

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compliance Verification</h2>
            <p className="text-gray-600">
              Complete your verification to activate your vendor account and start receiving orders.
            </p>
          </div>

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

          {/* Compliance Status Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
              <div className={`px-4 py-2 rounded-full font-semibold ${
                complianceStatus.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {complianceStatus.is_verified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Live
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    Test Mode
                  </div>
                )}
              </div>
            </div>

            {!complianceStatus.is_verified && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Account Not Live</h4>
                    <p className="text-yellow-700 text-sm">
                      Your account is in test mode. Complete Phone Verification and document upload 
                      to activate your account and start receiving orders.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Verification Status */}
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                <div className={`p-3 rounded-full ${
                  complianceStatus.phone_verified ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Mail className={`${
                    complianceStatus.phone_verified ? 'text-green-600' : 'text-gray-400'
                  }`} size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone Verification</h4>
                  <p className={`text-sm ${
                    complianceStatus.phone_verified ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {complianceStatus.phone_verified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>

              {/* Document Upload Status */}
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                <div className={`p-3 rounded-full ${
                  complianceStatus.document_uploaded ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <FileText className={`${
                    complianceStatus.document_uploaded ? 'text-green-600' : 'text-gray-400'
                  }`} size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{documentType} Document</h4>
                  <p className={`text-sm ${
                    complianceStatus.document_uploaded ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {complianceStatus.document_uploaded ? 'Uploaded' : 'Not Uploaded'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Verification Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-full ${
                complianceStatus.phone_verified ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Mail className={`${
                  complianceStatus.phone_verified ? 'text-green-600' : 'text-blue-600'
                }`} size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone Verification</h3>
                <p className="text-gray-600">Verify your phone number address to activate your account</p>
              </div>
            </div>

            {complianceStatus.phone_verified ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <h4 className="font-semibold text-green-800">Phone Verified</h4>
                    <p className="text-green-700 text-sm">
                      Your Phone number was verified on {new Date(complianceStatus.phone_verified_at!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Click the button below to send a verification code to your Phone number: <strong>{user.email}</strong>
                </p>
                <button
                  onClick={() => setShowOTPModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Mail size={16} />
                  Verify Phone
                </button>
              </div>
            )}
          </div>

          {/* Document Upload Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-full ${
                complianceStatus.document_uploaded ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {isIndividual ? (
                  <User className={`${
                    complianceStatus.document_uploaded ? 'text-green-600' : 'text-orange-600'
                  }`} size={24} />
                ) : (
                  <Building className={`${
                    complianceStatus.document_uploaded ? 'text-green-600' : 'text-orange-600'
                  }`} size={24} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
                <p className="text-gray-600">Upload your {documentDescription}</p>
              </div>
            </div>

            {complianceStatus.document_uploaded ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <div>
                      <h4 className="font-semibold text-green-800">{documentType} Document Uploaded</h4>
                      <p className="text-green-700 text-sm">
                        Your document is under review. You'll be notified once approved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className={`p-4 rounded-lg border ${
                  complianceStatus.compliance_status === 'approved' 
                    ? 'bg-green-50 border-green-200'
                    : complianceStatus.compliance_status === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {complianceStatus.compliance_status === 'approved' ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : complianceStatus.compliance_status === 'rejected' ? (
                      <AlertCircle className="text-red-600" size={20} />
                    ) : (
                      <Clock className="text-yellow-600" size={20} />
                    )}
                    <div>
                      <h4 className={`font-semibold ${
                        complianceStatus.compliance_status === 'approved' 
                          ? 'text-green-800'
                          : complianceStatus.compliance_status === 'rejected'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}>
                        Compliance Status: {complianceStatus.compliance_status.charAt(0).toUpperCase() + complianceStatus.compliance_status.slice(1)}
                      </h4>
                      <p className={`text-sm ${
                        complianceStatus.compliance_status === 'approved' 
                          ? 'text-green-700'
                          : complianceStatus.compliance_status === 'rejected'
                          ? 'text-red-700'
                          : 'text-yellow-700'
                      }`}>
                        {complianceStatus.compliance_status === 'approved' 
                          ? 'Your account is now live and can receive orders!'
                          : complianceStatus.compliance_status === 'rejected'
                          ? 'Your document was rejected. Please contact support for more information.'
                          : 'Your document is being reviewed by our team.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="text-orange-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Required Document: {documentType}</h4>
                      <p className="text-orange-700 text-sm mb-3">
                        {isIndividual 
                          ? 'Upload a clear photo or scan of your National Identification Number (NIN) slip or card.'
                          : 'Upload your Corporate Affairs Commission (CAC) certificate or incorporation documents.'
                        }
                      </p>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Accepted formats: JPG, PNG, PDF</li>
                        <li>• Maximum file size: 10MB</li>
                        <li>• Ensure document is clear and readable</li>
                        <li>• Documents are securely stored in the cloud</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select {documentType} Document
                  </label>
                  <input
                    id="document-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {selectedFile && (
                  <button
                    onClick={handleDocumentUpload}
                    disabled={isUploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload Document
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit for Review */}
          {complianceStatus.phone_verified && complianceStatus.document_uploaded && complianceStatus.compliance_status === 'pending' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready for Review</h3>
                  <p className="text-gray-600">Submit your application for final approval</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Review Process</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Our team will review your submitted documents</li>
                  <li>• Review typically takes 1-3 business days</li>
                  <li>• You'll receive an email notification once approved</li>
                  <li>• Your account will automatically go live upon approval</li>
                </ul>
              </div>

              <button
                onClick={handleSubmitForReview}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold px-8 py-4 rounded-xl transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          )}

          {/* Compliance Checklist */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Verification Checklist</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  complianceStatus.phone_verified ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {complianceStatus.phone_verified && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={`${complianceStatus.phone_verified ? 'text-green-600' : 'text-gray-600'}`}>
                  Phone number verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  complianceStatus.document_uploaded ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {complianceStatus.document_uploaded && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={`${complianceStatus.document_uploaded ? 'text-green-600' : 'text-gray-600'}`}>
                  {documentType} document uploaded
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  complianceStatus.compliance_status === 'approved' ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {complianceStatus.compliance_status === 'approved' && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={`${complianceStatus.compliance_status === 'approved' ? 'text-green-600' : 'text-gray-600'}`}>
                  Admin approval received
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  complianceStatus.is_verified ? 'bg-green-600' : 'bg-gray-300'
                }`}>
                  {complianceStatus.is_verified && <CheckCircle className="text-white" size={16} />}
                </div>
                <span className={`${complianceStatus.is_verified ? 'text-green-600' : 'text-gray-600'}`}>
                  Account is live and active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal */}
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onSuccess={handleOTPSuccess}
          userId={user.id}
        />
      </div>
    </DashboardLayout>
  );
};

export default VendorCompliance;
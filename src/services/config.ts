// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://mdoilandgas.com/mcdee/backend/public',
  ADMIN_BASE_URL: import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://mdoilandgas.com/mcdee/backend/public',
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/logout',
  ME: '/api/me',
  
  // Profile
  UPDATE_PROFILE_IMAGE: '/api/profile-picture/upload',
  
  // Maintenance
  MAINTENANCE_REQUEST: '/api/maintenance/request',
  MAINTENANCE_HISTORY: '/api/maintenance/my-requests',
  
  // Verification
  SEND_OTP: '/api/verify/send-otp',
  CONFIRM_OTP: '/api/verify/confirm-otp',
  
  // Vendor Compliance
  COMPLIANCE_STATUS: '/api/vendor/compliance/status',
  UPLOAD_COMPLIANCE_DOCUMENT: '/api/vendor/compliance/upload-document',
  SUBMIT_FOR_REVIEW: '/api/vendor/compliance/submit-review',
  
  // Vendor Registration (Legacy - to be organized later)
  VENDOR_REGISTER: '/api/vendor/register',
  VENDOR_MECHANIC_SETUP: '/api/vendor/mechanic/setup',
  VENDOR_RIDER_SETUP: '/api/vendor/rider/setup',
  VENDOR_PRODUCT_SETUP: '/api/vendor/product/setup',
  VENDOR_APARTMENT_SETUP: '/api/vendor/apartment/setup',
  VENDOR_SERVICE_SETUP: '/api/vendor/service/setup',
};

export default API_CONFIG;
// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://omoriapi.name.ng/mcdee/backend/public',
  ADMIN_BASE_URL: import.meta.env.VITE_ADMIN_API_BASE_URL || 'https://omoriapi.name.ng/mcdee/backend/public',
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
  
  // Service Vendor Endpoints
  VENDOR_SERVICE_PRICINGS: '/api/vendor/service-pricings',
  VENDOR_SERVICE_ORDERS: '/api/vendor/service-orders',
  SERVICE_VENDORS_PUBLIC: '/api/service-vendors',
  SERVICE_ORDERS: '/api/service-orders',
  SERVICE_ORDERS_MY: '/api/service-orders/my',
  SERVICE_ORDER_RESPOND: '/api/service-orders/{id}/respond',
  SERVICE_ORDER_PAY: '/api/service-orders/{id}/pay',
  SERVICE_ORDER_MARK_COMPLETED: '/api/service-orders/{id}/mark-completed',
  FLUTTERWAVE_MANUAL_TRIGGER: '/api/flutterwave/manual-trigger',
  
  // Vendor Registration (Legacy - to be organized later)
  VENDOR_REGISTER: '/api/vendor/register',
  VENDOR_MECHANIC_SETUP: '/api/vendor/mechanic/setup',
  VENDOR_RIDER_SETUP: '/api/vendor/rider/setup',
  VENDOR_PRODUCT_SETUP: '/api/vendor/product/setup',
  VENDOR_APARTMENT_SETUP: '/api/vendor/apartment/setup',
  VENDOR_SERVICE_SETUP: '/api/vendor/service/setup',

  // Admin Endpoints
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_LOGOUT: '/api/admin/logout',
  ADMIN_ME: '/api/admin/me',
  ADMIN_DASHBOARD: '/api/admin/dashboard',
  ADMIN_VENDORS: '/api/admin/vendors',
  ADMIN_KYC_VERIFICATIONS: '/api/admin/kyc/verifications',
  ADMIN_APPROVE_KYC: '/api/admin/kyc/verifications/{id}/approve',
  ADMIN_REJECT_KYC: '/api/admin/kyc/verifications/{id}/reject',
};

export default API_CONFIG;
